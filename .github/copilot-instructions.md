# Image Details VS Code Extension - Copilot Instructions

## Project Overview

This is a VS Code extension that provides a custom webview editor for viewing comprehensive image metadata, EXIF data, privacy-focused metadata removal, and image resizing. It uses a **Custom Editor API** pattern with TypeScript and modular architecture.

## Architecture

### Core Components

1. **`src/extension.ts`** - Extension activation point (~28 lines)
   - Registers `ImageDetailsEditorProvider` as custom editor for image files
   - Registers `imageDetails.openWith` command
   - Entry point: `activate()` and `deactivate()` functions

2. **`src/imageDetailsEditor.ts`** - Main editor orchestrator (~550 lines)
   - Implements `vscode.CustomReadonlyEditorProvider`
   - Manages webview lifecycle and state
   - Coordinates metadata extraction, HTML generation, and user interactions
   - Binary manipulation methods: `stripJpegExif()`, `stripPngMetadata()`
   - Image resizing via `resizeImageSafe()` with backup-first pattern

3. **`src/templates/htmlGenerators.ts`** - Webview HTML generation (~2715 lines)
   - `getHtmlForWebview()` - Complete webview HTML with inline CSS/JS
   - `getErrorHtml()` - Error state fallback HTML
   - `generateBasicInfoSection()`, `generateColorInfoHtml()`, `generateExifHtml()` - Section generators
   - `escapeHtml()` - Security: XSS prevention for user-facing strings
   - All HTML/CSS/JavaScript is **inline** in the webview (no separate files)

4. **`src/utils/metadata.ts`** - Image metadata utilities (~508 lines)
   - `formatFileSize()` - Bytes to KB/MB/GB conversion
   - `getColorInfo()` - Extract transparency support, color depth by format
   - `calculateBitDepth()` - Compute bit depth from EXIF BitsPerSample/SamplesPerPixel
   - `extractRelevantExifData()` - Parse 70+ EXIF fields from raw tags

5. **`src/utils/imageResize.ts`** - Image resizing utility (~65 lines)
   - `resizeImage()` - Resize via Jimp (pure JavaScript, cross-platform)
   - `resizeImageSafe()` - Safe wrapper for resize operations
   - Supports JPEG, PNG formats (WebP falls back to JPEG)

6. **`src/i18n/`** - Internationalization (modular, ~47 lines core)
   - `translations.ts` - `getTranslations(locale)` with fallback logic
   - `locales/en.ts`, `pt-br.ts`, `ja.ts`, `es.ts`, `zh-cn.ts` - Language files (~132 lines each)
   - Auto-detects VS Code locale (`vscode.env.language`)

7. **`src/types/index.ts`** - TypeScript interfaces (~158 lines)
   - `Translations` (129 string keys), `ImageMetadata`, `ColorInfo`, `SectionStates`, `DisplayMode`

### Key External Dependencies

- **`exifreader`** (v4.32.0) - EXIF tag extraction from image buffers
- **`image-size`** (v1.1.1) - Fast dimension/format detection
- **`jimp`** (v0.22.12) - Pure-JS image resizing (no native binaries)
- **`@vscode/codicons`** & **`@fortawesome/fontawesome-free`** - Icons in webview

### Build System

- **`esbuild.js`** - Bundles `src/extension.ts` → `dist/extension.js`
  - Production: `npm run package` (minified, no sourcemaps)
  - Development: `npm run watch` (dual watch: esbuild + TypeScript type-checking)
  - External: `vscode` module (provided by runtime)

- **Watch Mode Critical**: Always use `npm run watch` (not `npm run compile`) for live development to get both:
  - File changes rebuilt by esbuild
  - Type errors from `tsc --noEmit --watch`

## Development Workflows

### Testing the Extension

1. Open this workspace in VS Code
2. Press **F5** to launch Extension Development Host
3. In the new window, open any image (`.png`, `.jpg`, `.gif`, `.webp`, etc.)
4. Webview should load with metadata sidebar

### Adding a New Language

**Modular approach (current):**
1. Create `src/i18n/locales/<lang-code>.ts` by copying `en.ts`
2. Translate all 129 string keys (TypeScript enforces completeness via `Translations` interface)
3. Import in `src/i18n/translations.ts`: `import { de } from './locales/de';`
4. Add to exports: `'de': de,`
5. Add fallback logic if needed in `getTranslations()` function

**Supported languages (5):**
- English (en)
- Portuguese - Brazil (pt-br)
- Japanese (ja)
- Spanish (es)
- Chinese Simplified (zh-cn)

### State Management

- **Section expand/collapse**: Saved to `context.globalState` (persistent across sessions)
  - Key: `imageDetails.sectionStates` (map of `{ [sectionId]: boolean }`)
  - Setting: `imageDetails.rememberSectionStates` (user can disable persistence)

- **Display mode**: Accordion vs. List stored in `globalState`
  - Key: `imageDetails.displayMode`
  - Falls back to VS Code setting: `imageDetails.defaultDisplayMode`

### Webview Communication

**Extension → Webview:**
- Initial data: HTML includes serialized metadata in `<script>` tags
- Messages: `webviewPanel.webview.postMessage({ command, ...data })`
  - `showJsonModal` - Send metadata as JSON for modal display
  - `showResizeModal` - Send current dimensions for resize dialog
  - `resetRemoveExifButton` - Reset button state after cancel/error
  - `resetResizeButton` - Reset button state after cancel/error

**Webview → Extension:**
```typescript
webviewPanel.webview.onDidReceiveMessage(async (message) => {
  switch (message.command) {
    case 'copy': // Clipboard copy
    case 'toggleSection': // Save section state
    case 'setDisplayMode': // Switch accordion/list
    case 'removeExif': // Strip metadata
    case 'viewJsonMetadata': // Show JSON modal
    case 'resizeImage': // Open resize modal
    case 'applyResize': // Execute image resize with { width, height, quality }
  }
})
```

### EXIF Removal Feature

**Critical workflow:**
1. User clicks "Remove EXIF Data" button
2. Extension shows **modal confirmation** (`vscode.window.showWarningMessage`)
3. If cancelled, extension sends `resetRemoveExifButton` message to webview
4. If confirmed:
   - Creates backup file (`<filename>_backup.ext`)
   - Strips EXIF via `stripJpegExif()` or `stripPngMetadata()` (binary manipulation)
   - On error, restores from backup
   - Refreshes webview with new metadata

**Supported formats:** JPEG/JPG, PNG only (others show error)

### Image Resize Feature

**Workflow:**
1. User clicks "Resize Image" → webview sends `resizeImage` message
2. Extension sends `showResizeModal` back to webview with current dimensions
3. User sets width, height, quality → webview sends `applyResize`
4. Extension shows **modal confirmation** (`vscode.window.showWarningMessage`)
5. If cancelled, extension sends `resetResizeButton` message to webview
6. If confirmed:
   - Creates backup file (`<basename>-original.ext`)
   - Resizes via `resizeImageSafe()` (Jimp, pure JavaScript)
   - On error, restores from backup
   - Refreshes webview with new metadata

**Supported formats:** JPEG/JPG, PNG, WebP (WebP falls back to JPEG output)

## Code Conventions

### Naming

- **Functions**: camelCase (`getImageMetadata`, `formatFileSize`)
- **Classes**: PascalCase (`ImageDetailsEditorProvider`)
- **Constants**: SCREAMING_SNAKE_CASE (`APP1`, `PNG_SIGNATURE`)
- **Section IDs**: kebab-case (`'basic-info'`, `'color-info'`, `'exif-data'`)

### TypeScript

- **Strict mode enabled** (`tsconfig.json`)
- Use `any` sparingly - only for EXIF tags (external library shapes)
- Always define return types for public functions
- Use `undefined | null` checks: `if (value !== undefined && value !== null)`

### HTML Generation

- **Always escape user input**: Use `escapeHtml()` for all metadata values
- **Inline everything**: CSS, JavaScript, icons (base64/data URIs) - no external resources
- **VS Code theming**: Use CSS variables (`var(--vscode-editor-background)`)

### Error Handling

- **Graceful degradation**: If EXIF fails, show "Unknown" not errors
- **User-facing errors**: Use `vscode.window.showErrorMessage()` with translated strings
- **Backup before destructive ops**: See EXIF removal pattern

## Common Tasks

### Modify Metadata Display

1. Add EXIF field to `src/utils/metadata.ts` → `extractRelevantExifData()`
2. Update HTML generator in `src/templates/htmlGenerators.ts` → `generateExifHtml()`
3. Add translation keys to `src/types/index.ts` → `Translations` interface
4. Add translated values to all language files in `src/i18n/locales/*.ts`

### Change Webview Styling

- Edit inline CSS in `src/templates/htmlGenerators.ts` → `getHtmlForWebview()`
- Use VS Code theme variables: `--vscode-*` (see [Theme Color Reference](https://code.visualstudio.com/api/references/theme-color))
- Test in both light/dark themes

### Add Configuration Setting

1. Add to `package.json` → `contributes.configuration.properties`
2. Read in code: `vscode.workspace.getConfiguration('imageDetails').get<Type>('settingName')`
3. Document in `README.md` → Configuration section

## Migration Notes

**Migration complete:**
- ✅ Types extracted to `src/types/`
- ✅ i18n modularized to `src/i18n/locales/`
- ✅ Utilities extracted to `src/utils/metadata.ts`
- ✅ Image resize utility in `src/utils/imageResize.ts`
- ✅ HTML generators in `src/templates/htmlGenerators.ts`
- ✅ Legacy translations object removed from `imageDetailsEditor.ts`
- ✅ All translation access uses `getTranslations()` from `src/i18n/translations.ts`

## Testing

**No automated tests currently** - manual testing in Extension Development Host only.

**To add tests:**
1. Create test files matching `*.test.ts` pattern
2. Use `@vscode/test-electron` (already in devDependencies)
3. Run via `npm test` (configured in `package.json`)

## Publishing

- **Version**: Increment in `package.json` + `CHANGELOG.md`
- **Package**: `npm run package` → generates `.vsix` in root
- **Publish**: Use `publish.sh` script or `vsce publish`
- See `docs/PUBLISH_GUIDE.md` for detailed steps

## Key Files to Reference

- **Architecture decisions**: `REFACTORING_SUMMARY.md`
- **Contribution guide**: `docs/contributing/CONTRIBUTING.md`
- **i18n guide**: `docs/contributing/I18N.md`
- **Publishing**: `docs/PUBLISH_GUIDE.md`
