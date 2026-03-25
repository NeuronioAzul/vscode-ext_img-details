---
name: code-reviewer
description: "Code review guidelines for the Image Details VS Code extension. TypeScript-only project using Custom Editor API, webview, and binary image processing. Use when reviewing pull requests, analyzing code quality, or generating review checklists."
---

# Code Reviewer — Image Details Extension

Guidelines for reviewing code changes in this VS Code extension project. This is a TypeScript-only codebase (~4700 lines) using the Custom Editor API with webview, EXIF processing, and image resizing.

---

## Quick Review Workflow

1. **Check scope** — Does the PR match its description? No unrelated changes?
2. **Run validation** — `npm run check-types && npm run lint`
3. **Review by priority** — Security → Correctness → Architecture → Style
4. **Test manually** — F5 → open an image → verify the change works

---

## Project-Specific Review Checklist

### Security (Critical for this project)

- [ ] All metadata values passed through `escapeHtml()` before HTML insertion
- [ ] No raw string interpolation of user/file data into webview HTML
- [ ] No `innerHTML` or template literals with unescaped EXIF data
- [ ] File paths sanitized — no path traversal via metadata values
- [ ] Backup files created before any destructive operation (EXIF strip, resize)
- [ ] No secrets/tokens in code (check for hardcoded API keys)

> **Why critical**: This extension reads arbitrary image files and renders their metadata in a webview. Malicious EXIF data could inject HTML/JS if not escaped.

### Binary File Operations

- [ ] JPEG marker parsing validates SOI (0xFFD8) before processing
- [ ] PNG signature validated before chunk parsing
- [ ] Buffer bounds checked — no reads past `buffer.length`
- [ ] Backup written BEFORE modifying the original file
- [ ] Original restored from backup on ANY error during write
- [ ] File format checked against supported list before processing

### Webview Communication

- [ ] New messages added to BOTH directions (Extension ↔ Webview) if needed
- [ ] Button states reset on cancel/error (`resetRemoveExifButton`, `resetResizeButton`)
- [ ] Webview refreshed after file mutations (EXIF removal, resize)
- [ ] No `postMessage` with sensitive data that shouldn't be in webview context

### Translations (i18n)

- [ ] New user-facing strings use translation keys (not hardcoded English)
- [ ] Key added to `Translations` interface in `src/types/index.ts`
- [ ] Value added to ALL 5 locale files (`en`, `pt-br`, `ja`, `es`, `zh-cn`)
- [ ] TypeScript compiles (missing keys cause compile errors)
- [ ] Key follows naming convention: `camelCase`, semantically descriptive

### TypeScript Quality

- [ ] No new `any` types (exception: EXIF tag objects from `exifreader`)
- [ ] Public functions have explicit return types
- [ ] Error handling uses `instanceof Error` check before accessing `.message`
- [ ] `undefined`/`null` checks use strict comparison (`!== undefined`)
- [ ] No `as` type assertions unless absolutely necessary with justification

### HTML Generation (`htmlGenerators.ts`)

- [ ] VS Code theme variables used (`var(--vscode-*)`) — no hardcoded colors
- [ ] All inline CSS/JS stays inline — no external resource loading
- [ ] New sections follow collapsible section pattern (header + content + toggle)
- [ ] Section IDs use kebab-case (`my-section`)
- [ ] Tested in both light and dark VS Code themes

### Configuration Changes

- [ ] New settings added to `package.json` → `contributes.configuration`
- [ ] Setting read via `vscode.workspace.getConfiguration('imageDetails')`
- [ ] Default value specified in both `package.json` and reading code
- [ ] Setting documented in `README.md`

---

## Code Quality Thresholds

| Metric | Threshold | Current hotspots |
|--------|-----------|------------------|
| Function length | < 50 lines | `resolveCustomEditor` (~120 lines — switch/case justified) |
| File size | < 600 lines | `htmlGenerators.ts` (~2715 lines — HTML generation, acceptable) |
| Parameters | ≤ 5 per function | HTML generators take 4-6 (translations, states, mode — acceptable) |
| Nesting depth | ≤ 4 levels | EXIF extraction has justified deep nesting |
| Cyclomatic complexity | ≤ 10 per function | `extractRelevantExifData` is higher (70+ fields — by design) |

> **Note**: `htmlGenerators.ts` is large by design — it contains all inline HTML/CSS/JS. Splitting would add complexity without benefit. `extractRelevantExifData` is a flat mapping function, not genuinely complex.

---

## Common Issues in This Codebase

### Missing `escapeHtml()` on new metadata fields
```typescript
// BAD — XSS vulnerability
html += `<span>${metadata.someField}</span>`;

// GOOD
html += `<span>${escapeHtml(metadata.someField)}</span>`;
```

### Forgetting to reset button state on cancel
```typescript
// BAD — button stays in "loading" state forever
if (confirmed !== 'Yes') {
    return; // User cancelled but button is stuck
}

// GOOD
if (confirmed !== 'Yes') {
    webviewPanel.webview.postMessage({ command: 'resetMyButton' });
    return;
}
```

### Missing backup before file mutation
```typescript
// BAD — data loss on error
await fs.promises.writeFile(filePath, newBuffer);

// GOOD — backup-first pattern
const originalBuffer = await fs.promises.readFile(filePath);
const backupPath = filePath.replace(/(\.[^.]+)$/, '_backup$1');
await fs.promises.writeFile(backupPath, originalBuffer);
try {
    await fs.promises.writeFile(filePath, newBuffer);
} catch (error) {
    await fs.promises.writeFile(filePath, originalBuffer); // restore
    throw error;
}
```

### Hardcoded English string
```typescript
// BAD
vscode.window.showErrorMessage('Failed to resize image');

// GOOD
vscode.window.showErrorMessage(this.getTranslations().resizeError);
```

---

## Review Verdicts

| Condition | Verdict |
|-----------|---------|
| Clean, follows all patterns, types pass | **Approve** |
| Minor style issues, no functional problems | **Approve with comments** |
| Missing escapeHtml, missing translations, missing backup | **Request changes** |
| XSS vulnerability, data loss risk, buffer overflow | **Block** |

---

## Reference Guides

Detailed checklists and standards in the `references/` directory:

- `references/code_review_checklist.md` — Systematic checklists (pre-review, correctness, security, performance, maintainability)
- `references/coding_standards.md` — TypeScript coding standards (types, null safety, async patterns)
- `references/common_antipatterns.md` — Antipattern catalog with examples and fixes (god class, deep nesting, floating promises)
