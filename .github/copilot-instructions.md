# Image Details VS Code Extension - Copilot Instructions

## Project Overview

This is a VS Code extension that provides a custom webview editor for viewing comprehensive image metadata, EXIF data, and privacy-focused metadata removal. It uses a **Custom Editor API** pattern with TypeScript and modular architecture.

## Architecture

### Core Components

1. **`src/extension.ts`** - Extension activation point
   - Registers `ImageDetailsEditorProvider` as custom editor for image files
   - Registers `imageDetails.openWith` command
   - Entry point: `activate()` and `deactivate()` functions

2. **`src/imageDetailsEditor.ts`** - Main editor orchestrator (~1500 lines)
   - Implements `vscode.CustomReadonlyEditorProvider`
   - Manages webview lifecycle and state
   - Coordinates metadata extraction, HTML generation, and user interactions
   - **Legacy translations object** exists here for backward compatibility during modular migration

3. **`src/templates/htmlGenerators.ts`** - Webview HTML generation (~800 lines)
   - `getHtmlForWebview()` - Complete webview HTML with inline CSS/JS
   - `generateBasicInfoSection()`, `generateColorInfoHtml()`, `generateExifHtml()` - Section generators
   - `escapeHtml()` - Security: XSS prevention for user-facing strings
   - All HTML/CSS/JavaScript is **inline** in the webview (no separate files)

4. **`src/utils/metadata.ts`** - Image metadata utilities (~200 lines)
   - `formatFileSize()` - Bytes to KB/MB/GB conversion
   - `getColorInfo()` - Extract transparency support, color depth by format
   - `calculateBitDepth()` - Compute bit depth from EXIF BitsPerSample/SamplesPerPixel
   - `extractRelevantExifData()` - Parse 70+ EXIF fields from raw tags

5. **`src/i18n/`** - Internationalization (modular, ~50 lines core)
   - `translations.ts` - `getTranslations(locale)` with fallback logic
   - `locales/en.ts`, `pt-br.ts`, `ja.ts`, `es.ts` - Language files (~115 lines each)
   - Auto-detects VS Code locale (`vscode.env.language`)

6. **`src/types/index.ts`** - TypeScript interfaces (~150 lines)
   - `Translations`, `ImageMetadata`, `ColorInfo`, `SectionStates`, `DisplayMode`

### Key External Dependencies

- **`exifreader`** (v4.32.0) - EXIF tag extraction from image buffers
- **`image-size`** (v1.1.1) - Fast dimension/format detection
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
2. Translate all 114 string keys
3. Import in `src/i18n/translations.ts`: `import { de } from './locales/de';`
4. Add to exports: `'de': de,`

**Why modular?** See `REFACTORING_SUMMARY.md` - reduces maintenance burden from 3250-line monolith to 115-line files per language.

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
- Messages: `webviewPanel.webview.postMessage({ command: 'showJsonModal', metadata })`

**Webview → Extension:**
```typescript
webviewPanel.webview.onDidReceiveMessage(async (message) => {
  switch (message.command) {
    case 'copy': // Clipboard copy
    case 'toggleSection': // Save section state
    case 'setDisplayMode': // Switch accordion/list
    case 'removeExif': // Strip metadata
    case 'viewJsonMetadata': // Show JSON modal
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
3. Add translation keys to all language files in `src/i18n/locales/*.ts`
4. Update `src/types/index.ts` → `Translations` interface

### Change Webview Styling

- Edit inline CSS in `src/templates/htmlGenerators.ts` → `getHtmlForWebview()`
- Use VS Code theme variables: `--vscode-*` (see [Theme Color Reference](https://code.visualstudio.com/api/references/theme-color))
- Test in both light/dark themes

### Add Configuration Setting

1. Add to `package.json` → `contributes.configuration.properties`
2. Read in code: `vscode.workspace.getConfiguration('imageDetails').get<Type>('settingName')`
3. Document in `README.md` → Configuration section

## Migration Notes

**Current state (Phase 3/4 complete):**
- ✅ Types extracted to `src/types/`
- ✅ i18n modularized to `src/i18n/locales/`
- ✅ Utilities extracted to `src/utils/metadata.ts`
- ✅ HTML generators in `src/templates/htmlGenerators.ts`
- ⚠️ **`imageDetailsEditor.ts` still contains legacy translations object** for backward compatibility
- 🎯 Next: Complete migration (remove legacy code after validation)

**When refactoring:**
- Prefer `getTranslations()` from `src/i18n/translations.ts` over direct access
- Keep backward compatibility until migration validated
- See `REFACTORING_SUMMARY.md` for full plan

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
