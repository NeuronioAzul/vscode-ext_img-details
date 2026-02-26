# Localization (i18n) — Image Details Extension

Guidelines for adding, modifying, and maintaining translations in this VS Code extension. This project uses a **custom i18n module** (`src/i18n/`) — it does NOT use VS Code's standard `@vscode/l10n` library.

---

## Architecture Overview

```
src/
  types/index.ts          ← Translations interface (source of truth for all keys)
  i18n/
    translations.ts       ← getTranslations(locale) with fallback logic
    locales/
      en.ts               ← English (default/fallback)
      pt-br.ts            ← Portuguese (Brazil)
      ja.ts               ← Japanese
      es.ts               ← Spanish
      zh-cn.ts            ← Chinese Simplified
```

### How it works

1. `vscode.env.language` provides the user's VS Code locale (e.g., `"pt-br"`, `"en"`, `"ja"`)
2. `ImageDetailsEditorProvider.getTranslations()` calls `getTranslations(vscode.env.language)`
3. The `Translations` object (`t`) is passed through HTML generator functions as a parameter
4. All user-facing strings in the webview reference `t.keyName`

### Fallback chain

```
exact locale match → language prefix (e.g., "pt" from "pt-br") → includes-based match → English
```

Example: `"pt"` → matches `"pt-br"`; `"zh-tw"` → falls back to `"zh-cn"`; `"de"` → falls back to `"en"`.

---

## Supported Languages

| Code     | Language              | File             |
|----------|-----------------------|------------------|
| `en`     | English               | `locales/en.ts`  |
| `pt-br`  | Portuguese (Brazil)   | `locales/pt-br.ts` |
| `ja`     | Japanese              | `locales/ja.ts`  |
| `es`     | Spanish               | `locales/es.ts`  |
| `zh-cn`  | Chinese (Simplified)  | `locales/zh-cn.ts` |

---

## Adding a New Translation Key

When adding a new user-facing string, update these files **in this order**:

### Step 1 — Add the key to the `Translations` interface

File: `src/types/index.ts`

```typescript
export interface Translations {
    // ...existing keys...
    myNewKey: string;  // ← Add here, in the logical group
}
```

> TypeScript will now show compile errors in every locale file that is missing the new key — use this to ensure completeness.

### Step 2 — Add the English value

File: `src/i18n/locales/en.ts`

```typescript
export const en: Translations = {
    // ...existing...
    myNewKey: 'My new label',
};
```

### Step 3 — Add translations to ALL other locale files

Files: `pt-br.ts`, `ja.ts`, `es.ts`, `zh-cn.ts`

Every locale file must implement the **full** `Translations` interface. The TypeScript compiler will enforce this — a missing key is a compile error.

```typescript
// pt-br.ts
myNewKey: 'Meu novo rótulo',

// ja.ts
myNewKey: '新しいラベル',

// es.ts
myNewKey: 'Mi nueva etiqueta',

// zh-cn.ts
myNewKey: '我的新标签',
```

### Step 4 — Use the key in code

In HTML generators (`src/templates/htmlGenerators.ts`), the translations object is received as parameter `t`:

```typescript
function generateSomeSection(t: Translations): string {
    return `<span>${escapeHtml(t.myNewKey)}</span>`;
}
```

In the editor provider (`src/imageDetailsEditor.ts`), access via `this.getTranslations()`:

```typescript
vscode.window.showInformationMessage(this.getTranslations().myNewKey);
```

> **Always** wrap user-facing values with `escapeHtml()` inside HTML templates to prevent XSS.

---

## Adding a New Language

### Step 1 — Create the locale file

Create `src/i18n/locales/<lang-code>.ts` by copying `en.ts` as a template:

```typescript
import { Translations } from '../../types';

export const de: Translations = {
    imageDetails: 'Bilddetails',
    fileName: 'Dateiname',
    // ... translate ALL keys
};
```

**Rules:**
- The file must export a `const` that satisfies the `Translations` interface
- Use the VS Code locale code as the filename (e.g., `de.ts`, `fr.ts`, `ko.ts`)
- The export name should be a valid JS identifier derived from the locale (e.g., `de`, `fr`, `ko`)
- Translate every key — do not leave English fallbacks inside locale files

### Step 2 — Register in `translations.ts`

File: `src/i18n/translations.ts`

```typescript
import { de } from './locales/de';

export const translations: { [key: string]: Translations } = {
    'en': en,
    'pt-br': ptBr,
    'ja': ja,
    'es': es,
    'zh-cn': zhCn,
    'zh': zhCn,
    'de': de,  // ← Add here
};
```

### Step 3 — Add fallback logic (if needed)

If the language has regional variants that should fall back to this locale, add a line in `getTranslations()`:

```typescript
// Specific locale fallbacks
if (normalizedLocale.includes('de')) return translations['de'];
```

### Step 4 — Update documentation

- Update the supported languages table in this skill
- Update `copilot-instructions.md` with the new language count and code

---

## Key Naming Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| `noun` or `camelCaseNoun` | `fileName`, `latitude` | Simple labels displayed as metadata field names |
| `verbNoun` | `removeExif`, `viewJsonMetadata` | Button labels and action text |
| `verbNounResult` | `removeExifSuccess`, `resizeError` | Success/error messages after an action |
| `verbNounConfirm` | `removeExifConfirm`, `resizeConfirm` | Confirmation dialog messages |
| `featureNoun` | `resizeImage`, `resizeOptions` | Feature section titles and headers |

**Rules:**
- Use camelCase for all keys
- Group related keys together (e.g., all `gps*` keys, all `resize*` keys)
- Confirmation messages (`*Confirm`) should be full sentences with question marks
- Success/error messages (`*Success`, `*Error`) should be concise user-facing messages
- Keep keys semantically meaningful — avoid generic names like `label1`, `text2`

---

## Translation Quality Rules

1. **Complete coverage** — Every locale file must implement ALL keys from the `Translations` interface. TypeScript enforces this at compile time.

2. **No English fallbacks inside locale files** — Every value must be properly translated. If unsure about a translation, mark it with a `// TODO: verify translation` comment.

3. **Consistent tone** — Each language should maintain consistent formality level:
   - English: neutral/professional
   - Portuguese: informal ("você")
   - Japanese: polite form (です/ます)
   - Spanish: formal ("usted" implied)
   - Chinese: neutral/standard

4. **Respect string length** — Some UI areas are width-constrained. Keep translations concise, especially for:
   - Button labels (`removeExif`, `viewJsonMetadata`, `applyResize`)
   - Toggle labels (`accordionMode`, `listMode`)
   - Short labels (`collapse`, `expand`, `copied`)

5. **Technical terms** — Keep universally understood terms untranslated when the language convention prefers it:
   - EXIF, GPS, DPI, ISO, JSON — keep as-is in all languages
   - File format names (JPEG, PNG, WebP) — keep as-is

6. **Placeholders and interpolation** — This project does NOT use placeholder syntax (`{0}`, `%s`). Dynamic values are concatenated separately in the HTML generators or via template literals. Do not introduce placeholder patterns into translation strings.

---

## Scope of This i18n System

### What IS localized through this system
- All webview UI text (labels, buttons, headers, tooltips)
- User-facing messages shown via `vscode.window.showInformationMessage` / `showErrorMessage` / `showWarningMessage`
- Confirmation dialogs

### What is NOT localized through this system
- `package.json` contributions (command titles, setting descriptions, setting enum labels)
- These would require `package.nls.<langid>.json` files (VS Code's standard mechanism)
- Currently, `package.json` strings are English-only

> **Note**: If `package.json` localization is added in the future, it should use the standard `package.nls.json` / `package.nls.<langid>.json` approach from VS Code, NOT this custom system.

---

## Checklist — Before Submitting i18n Changes

- [ ] New key added to `Translations` interface in `src/types/index.ts`
- [ ] English value added to `src/i18n/locales/en.ts`
- [ ] Value added to ALL other locale files (`pt-br.ts`, `ja.ts`, `es.ts`, `zh-cn.ts`)
- [ ] TypeScript compiles without errors (`npm run check-types`)
- [ ] All user-facing strings in HTML use `escapeHtml(t.keyName)` — never raw interpolation
- [ ] Key follows naming conventions (camelCase, semantically clear)
- [ ] No English text left hardcoded in HTML generators or editor provider
