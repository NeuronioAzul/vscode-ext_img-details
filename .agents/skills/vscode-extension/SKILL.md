# VS Code Extension — Image Details

Project-specific architecture, patterns, and development workflows for the **Image Details** VS Code extension. This extension provides a custom webview editor for viewing image metadata, EXIF data, and privacy-focused metadata removal.

---

## Project Identity

| Field | Value |
|-------|-------|
| Extension ID | `NeuronioAzul.image-details` |
| View Type | `imageDetails.viewer` |
| VS Code API | `^1.94.0` |
| Bundler | esbuild (CJS, Node platform) |
| Language | TypeScript (strict mode) |
| Entry point | `src/extension.ts` → `dist/extension.js` |

---

## Architecture

```
src/
  extension.ts              ← Activation: registers editor provider + command
  imageDetailsEditor.ts     ← Core: CustomReadonlyEditorProvider (webview lifecycle, messaging, file ops)
  types/
    index.ts                ← Shared TypeScript interfaces (Translations, ImageMetadata, ColorInfo, etc.)
  i18n/
    translations.ts         ← getTranslations(locale) with fallback chain
    locales/
      en.ts, pt-br.ts, ja.ts, es.ts, zh-cn.ts
  templates/
    htmlGenerators.ts       ← All webview HTML/CSS/JS generation (inline, no external files)
  utils/
    metadata.ts             ← formatFileSize, getColorInfo, calculateBitDepth, extractRelevantExifData
    imageResize.ts          ← Image resizing via Jimp (pure JS, cross-platform)
```

### Data Flow

```
Image file opened
  → extension.ts registers CustomReadonlyEditorProvider
    → resolveCustomEditor() called by VS Code
      → getImageMetadata(uri) reads file stats, dimensions (image-size), EXIF (exifreader)
      → getHtmlForWebview() generates full HTML with inline CSS/JS
      → webview.html = rendered HTML
      → webview.onDidReceiveMessage handles user actions
```

---

## Contribution Points (package.json)

### Custom Editor

```jsonc
"customEditors": [{
  "viewType": "imageDetails.viewer",
  "displayName": "Image Details Viewer",
  "selector": [
    { "filenamePattern": "*.png" },
    { "filenamePattern": "*.jpg" },
    { "filenamePattern": "*.jpeg" },
    { "filenamePattern": "*.gif" },
    { "filenamePattern": "*.bmp" },
    { "filenamePattern": "*.webp" },
    { "filenamePattern": "*.svg" },
    { "filenamePattern": "*.ico" }
  ],
  "priority": "default"
}]
```

When adding a new image format: add a `filenamePattern` entry here AND update the `when` clause in `menus.explorer/context`.

### Commands

| Command ID | Title | Context |
|------------|-------|---------|
| `imageDetails.openWith` | Open with Image Details Viewer | Explorer context menu |

### Configuration Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `imageDetails.defaultDisplayMode` | `"accordion" \| "list"` | `"accordion"` | Metadata sections display mode |
| `imageDetails.defaultSectionStates` | `object` | `{ basicInfo: true, colorInfo: false, exifData: false }` | Default expand/collapse per section |
| `imageDetails.rememberSectionStates` | `boolean` | `true` | Persist section states across sessions |

---

## Build System

### Scripts

| Command | Purpose | When to use |
|---------|---------|-------------|
| `npm run watch` | Dual watch: esbuild rebuild + tsc type-checking | **Always during development** |
| `npm run compile` | Single build: type-check + esbuild bundle | CI or one-off build |
| `npm run package` | Production build: type-check + minified esbuild (no sourcemaps) | Before publishing |
| `npm run check-types` | TypeScript-only type check (`tsc --noEmit`) | Quick validation |
| `npm run lint` | ESLint on `src/**/*.ts` | Before commits |

### esbuild Configuration

- **Entry**: `src/extension.ts`
- **Output**: `dist/extension.js` (CommonJS)
- **Platform**: `node`
- **External**: `vscode` (provided by VS Code runtime — never bundled)
- **Production**: minified, no sourcemaps
- **Development**: sourcemaps enabled, watch mode with problem matcher

> **Critical**: Always use `npm run watch` (not just `npm run compile`) during development. It runs `esbuild --watch` AND `tsc --noEmit --watch` in parallel via `npm-run-all`.

### TypeScript Configuration

- **Target**: ES2020
- **Module**: CommonJS
- **Strict mode**: enabled
- `noImplicitReturns`, `noFallthroughCasesInSwitch`: enabled
- `esModuleInterop`, `allowSyntheticDefaultImports`: enabled (for `import sizeOf from 'image-size'` syntax)

---

## Dependencies

### Runtime

| Package | Purpose | Used in |
|---------|---------|---------|
| `exifreader` | Extract EXIF/IPTC/XMP tags from image buffers | `imageDetailsEditor.ts` → `metadata.ts` |
| `image-size` | Fast image dimension and format detection | `imageDetailsEditor.ts` |
| `jimp` | Pure-JS image manipulation (resize) | `imageResize.ts` |

### Dev-only

| Package | Purpose |
|---------|---------|
| `esbuild` | Bundler |
| `typescript` | Type checking |
| `eslint` + `@typescript-eslint/*` | Linting |
| `@types/vscode`, `@types/node` | Type definitions |
| `@vscode/test-cli`, `@vscode/test-electron` | Testing framework (not yet implemented) |
| `@vscode/codicons` | Icon font for webview UI |
| `@fortawesome/fontawesome-free` | Additional icons in webview |
| `npm-run-all` | Parallel script execution |

---

## Core Pattern: Custom Readonly Editor

This extension implements `vscode.CustomReadonlyEditorProvider` — not `CustomEditorProvider` (no edit/save lifecycle).

### Provider Registration

```typescript
// extension.ts
const provider = new ImageDetailsEditorProvider(context);
vscode.window.registerCustomEditorProvider('imageDetails.viewer', provider, {
    webviewOptions: { retainContextWhenHidden: true },
    supportsMultipleEditorsPerDocument: false
});
```

### Lifecycle Methods

| Method | Purpose |
|--------|---------|
| `openCustomDocument(uri)` | Returns a minimal `CustomDocument` (just URI + dispose) |
| `resolveCustomEditor(document, webviewPanel)` | Sets up webview options, generates HTML, registers message handler |

### Key Implementation Details

- `retainContextWhenHidden: true` — webview state preserved when tab is not visible (prevents re-render on tab switch)
- `supportsMultipleEditorsPerDocument: false` — one viewer per image file
- `enableScripts: true` — required for webview JavaScript (section toggling, copy, modals)

---

## Webview Communication

### Extension → Webview

Messages sent via `webviewPanel.webview.postMessage()`:

| Command | Payload | Purpose |
|---------|---------|---------|
| `showJsonModal` | `{ metadata }` | Show full metadata as JSON modal |
| `showResizeModal` | `{ width, height, filePath }` | Open resize dialog with current dimensions |
| `resetRemoveExifButton` | — | Reset button state after cancel/error |
| `resetResizeButton` | — | Reset button state after cancel/error |

### Webview → Extension

Messages received via `webviewPanel.webview.onDidReceiveMessage()`:

| Command | Payload | Purpose |
|---------|---------|---------|
| `copy` | `{ text }` | Copy text to clipboard |
| `toggleSection` | `{ sectionId, isExpanded }` | Save section expand/collapse state |
| `setDisplayMode` | `{ mode }` | Switch accordion/list mode |
| `removeExif` | — | Trigger EXIF metadata removal |
| `viewJsonMetadata` | — | Request JSON metadata modal |
| `resizeImage` | — | Request resize modal |
| `applyResize` | `{ width, height, quality }` | Execute image resize |

---

## State Management

### Global State (persistent across sessions)

| Key | Type | Purpose |
|-----|------|---------|
| `imageDetails.sectionStates` | `{ [sectionId: string]: boolean }` | Which sections are expanded/collapsed |
| `imageDetails.displayMode` | `"accordion" \| "list"` | Current display mode preference |

State is read via `context.globalState.get()` and written via `context.globalState.update()`.

### Section IDs

Section IDs use **kebab-case** in global state and HTML, but **camelCase** in `package.json` settings:

| Global State / HTML | package.json setting |
|---------------------|---------------------|
| `basic-info` | `basicInfo` |
| `color-info` | `colorInfo` |
| `exif-data` | `exifData` |

The `getSectionStates()` method handles this mapping.

---

## Webview HTML Generation

All HTML, CSS, and JavaScript is generated **inline** in `src/templates/htmlGenerators.ts`. No external files are loaded into the webview.

### Key Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `getHtmlForWebview()` | Main entry | Full webview HTML with embedded CSS/JS |
| `getErrorHtml()` | Error fallback | Error display when image loading fails |
| `generateBasicInfoSection()` | Section | File name, dimensions, format, size, dates |
| `generateColorInfoHtml()` | Section | Transparency, color depth, DPI |
| `generateExifHtml()` | Section | All EXIF metadata fields |
| `escapeHtml()` | Security | XSS prevention for all user-facing values |

### Conventions

- **Always** escape metadata values with `escapeHtml()` before inserting into HTML
- Use VS Code CSS variables for theming: `var(--vscode-editor-background)`, `var(--vscode-foreground)`, etc.
- Icons: inline SVGs for chevrons, Codicons/FontAwesome via bundled CSS
- Each collapsible section follows the pattern: `.section-header` (onclick toggles) + `.section-content` (expanded/collapsed)
- JavaScript in webview communicates via `vscode.postMessage({ command, ...data })`

---

## File Operations

### EXIF Removal

Supported: **JPEG/JPG** and **PNG** only.

1. User clicks "Remove EXIF Data" → webview sends `removeExif` message
2. Extension shows modal confirmation (`vscode.window.showWarningMessage`)
3. If confirmed:
   - Creates backup: `<filename>_backup.<ext>`
   - JPEG: strips APP1 (EXIF) markers via binary manipulation (`stripJpegExif()`)
   - PNG: removes metadata chunks (tEXt, zTXt, iTXt, eXIf, tIME) via `stripPngMetadata()`
   - On error: restores original from backup
4. Refreshes webview with new metadata

### Image Resize

Supported: **JPEG/JPG**, **PNG**, **WebP**.

1. User clicks "Resize Image" → webview sends `resizeImage` message
2. Extension sends `showResizeModal` back to webview with current dimensions
3. User sets dimensions/quality → webview sends `applyResize` with new values
4. Extension shows modal confirmation
5. If confirmed:
   - Creates backup: `<basename>-original.<ext>`
   - Resizes via Jimp (`resizeImageSafe()`)
   - On error: restores original from backup
6. Refreshes webview with new metadata

### Backup Pattern

All destructive operations follow the **backup-first** pattern:
1. Read original into memory
2. Write backup file
3. Perform operation
4. On error → restore from backup

---

## How-To Guides

### Add a New Image Format

1. **package.json** — Add `filenamePattern` to `contributes.customEditors[0].selector`
2. **package.json** — Update `when` clause in `menus.explorer/context` regex
3. **metadata.ts** — Update `getColorInfo()` if the format has specific color properties
4. **imageDetailsEditor.ts** — Update `removeExifData()` if metadata stripping is supported
5. **imageDetailsEditor.ts** — Update `resizeImage()` supported formats list if resizing is supported

### Add a New Configuration Setting

1. **package.json** — Add to `contributes.configuration.properties` under `imageDetails.*`
2. **Source code** — Read via `vscode.workspace.getConfiguration('imageDetails').get<Type>('settingName')`
3. **README.md** — Document in Configuration section

### Add a New Command

1. **package.json** — Add to `contributes.commands` with `command` and `title`
2. **package.json** — Add menu entry if needed (e.g., `menus.explorer/context` with `when` clause)
3. **extension.ts** — Register handler via `vscode.commands.registerCommand()`
4. **extension.ts** — Add to `context.subscriptions`

### Add a New Webview Message Handler

1. **htmlGenerators.ts** — Add JS code in webview that calls `vscode.postMessage({ command: 'myAction', ... })`
2. **imageDetailsEditor.ts** — Add `case 'myAction':` in the `onDidReceiveMessage` switch
3. If reply needed: use `webviewPanel.webview.postMessage()` and handle in webview JS `window.addEventListener('message', ...)`

### Add a New Metadata Section

1. **htmlGenerators.ts** — Create `generateMySection(data, t, sectionStates, displayMode)` following the collapsible section pattern
2. **htmlGenerators.ts** — Call the new function from `getHtmlForWebview()`
3. **types/index.ts** — Add translation keys to `Translations` interface
4. **All locale files** — Add translated strings
5. **imageDetailsEditor.ts** — If the section needs new data, extract it in `getImageMetadata()`
6. **package.json** — Add default section state to `imageDetails.defaultSectionStates` if collapsible

---

## Testing

### Manual Testing (current)

1. Open workspace in VS Code
2. Press **F5** → launches Extension Development Host
3. Open any image file in the new window
4. Verify: metadata loads, sections toggle, copy works, EXIF removal works

### Automated Testing (planned)

- Framework: `@vscode/test-electron` + `@vscode/test-cli` (already in devDependencies)
- Test files: `src/**/*.test.ts` pattern
- Run: `npm test`
- Unit-testable modules: `metadata.ts`, `imageResize.ts`, `htmlGenerators.ts` (pure functions)
- Integration tests: require VS Code API mocking for `ImageDetailsEditorProvider`

---

## Publishing

| Step | Command |
|------|---------|
| Type check + minified bundle | `npm run package` |
| Generate .vsix | `vsce package` |
| Publish to marketplace | `vsce publish` or use `publish.sh` |

Before publishing:
- Increment version in `package.json`
- Update `CHANGELOG.md`
- Run `npm run lint` and `npm run check-types`
- Test manually with F5

---

## Error Handling Patterns

- **Graceful degradation**: If EXIF extraction fails, show metadata without EXIF (no error to user)
- **Unknown fallbacks**: Display "Unknown" for any metadata field that cannot be read
- **User-facing errors**: Use `vscode.window.showErrorMessage()` with translated strings
- **Webview errors**: Render `getErrorHtml()` if the entire image loading fails
- **Button state recovery**: Always send `resetRemoveExifButton` / `resetResizeButton` on cancel or error to prevent stuck UI states
- **Backup restoration**: All file mutations restore original on error

---

## Naming Conventions

| Element | Convention | Examples |
|---------|-----------|----------|
| Functions | camelCase | `getImageMetadata`, `formatFileSize` |
| Classes | PascalCase | `ImageDetailsEditorProvider` |
| Constants | SCREAMING_SNAKE | `SOI`, `APP1`, `PNG_SIGNATURE` |
| Section IDs | kebab-case | `basic-info`, `color-info`, `exif-data` |
| Setting keys | dot.camelCase | `imageDetails.defaultDisplayMode` |
| Commands | dot.camelCase | `imageDetails.openWith` |
| Translation keys | camelCase | `removeExifConfirm`, `colorInformation` |
| Locale files | lowercase dash | `pt-br.ts`, `zh-cn.ts` |
