# Conventional Commits

Rules for writing commit messages in this project, based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

---

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **type**: required — lowercase noun describing the category of the change
- **scope**: optional — noun in parentheses describing the affected area of the codebase
- **`!`**: optional — placed immediately before `:` to signal a breaking change
- **description**: required — short imperative summary after the colon and space
- **body**: optional — free-form detail, separated from description by one blank line
- **footer(s)**: optional — key-value metadata, separated from body by one blank line

---

## Types

| Type | When to use | SemVer impact |
|------|-------------|---------------|
| `feat` | New feature or capability | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only (README, CHANGELOG, JSDoc, comments) | — |
| `style` | Formatting, whitespace, semicolons — no logic change | — |
| `refactor` | Code restructuring without changing behavior | — |
| `perf` | Performance improvement | — |
| `test` | Adding or updating tests | — |
| `build` | Build system or external dependencies (esbuild, npm, tsconfig) | — |
| `ci` | CI/CD configuration and scripts | — |
| `chore` | Maintenance tasks that don't fit other types | — |
| `revert` | Reverting a previous commit | — |

> Types must be **lowercase**. Only `feat` and `fix` have direct SemVer impact. Any type can trigger a MAJOR bump if it includes a breaking change.

---

## Scopes (Project-Specific)

Use scopes that map to areas of this codebase:

| Scope | Covers |
|-------|--------|
| `editor` | `imageDetailsEditor.ts` — Custom editor provider, webview lifecycle, messaging |
| `webview` | `templates/htmlGenerators.ts` — HTML/CSS/JS generation, UI sections |
| `i18n` | `i18n/` — Translations, locale files, `getTranslations()` |
| `metadata` | `utils/metadata.ts` — EXIF extraction, color info, format utils |
| `resize` | `utils/imageResize.ts` — Image resizing via Jimp |
| `types` | `types/index.ts` — Shared TypeScript interfaces |
| `config` | `package.json` settings — Extension configuration, contribution points |
| `build` | `esbuild.js`, `tsconfig.json` — Build and bundler configuration |
| `deps` | Dependency additions, removals, or upgrades |

Scope is optional. Omit it when the change spans multiple areas or is project-wide.

---

## Description Rules

- Use **imperative mood**: "add feature" not "added feature" or "adds feature"
- **Lowercase** first letter — do not capitalize
- **No period** at the end
- Keep under **72 characters**
- Describe **what** the commit does, not why

```
✅ feat(i18n): add German locale
✅ fix(editor): prevent crash when EXIF buffer is empty
✅ refactor(metadata): extract DPI calculation to separate function

❌ feat(i18n): Added German locale.
❌ fix: Fixed the bug
❌ refactor(metadata): This refactors the DPI calculation into its own function for better reuse
```

---

## Body Rules

- Separated from description by **one blank line**
- Free-form text — can have multiple paragraphs
- Use to explain **why** the change was made and provide context
- Wrap lines at **72 characters**

---

## Footer Rules

- Separated from body by **one blank line**
- Format: `Token: value` or `Token #value`
- Use `-` instead of spaces in token names (e.g., `Reviewed-By`, not `Reviewed By`)
- Exception: `BREAKING CHANGE` (uppercase, with space) is always valid

### Common footers

| Footer | Purpose |
|--------|---------|
| `BREAKING CHANGE: <desc>` | Describes an incompatible API/behavior change (triggers MAJOR) |
| `Refs: #<issue>` | References related issues |
| `Closes: #<issue>` | Automatically closes the referenced issue |
| `Reviewed-By: <name>` | Code review attribution |
| `Co-Authored-By: <name> <email>` | Co-author credit |

---

## Breaking Changes

Breaking changes MUST be indicated in at least one of:

1. **`!` after type/scope**: `feat(editor)!: change webview message protocol`
2. **`BREAKING CHANGE:` footer**: full description of what breaks

Both can be used together for maximum visibility:

```
feat(editor)!: change webview message protocol

BREAKING CHANGE: the `copy` message now requires a `format` field in addition to `text`
```

> `BREAKING-CHANGE` (with hyphen) is synonymous with `BREAKING CHANGE`.

---

## Examples for This Project

### Simple feature
```
feat(i18n): add Korean locale
```

### Bug fix with scope
```
fix(metadata): handle missing BitsPerSample in TIFF files
```

### Documentation
```
docs: update README with new resize feature screenshots
```

### Refactor with body
```
refactor(editor): extract JPEG stripping to dedicated module

Move stripJpegExif() and stripPngMetadata() from imageDetailsEditor.ts
to a new utils/exifStrip.ts module to improve separation of concerns.
```

### Feature with breaking change
```
feat(webview)!: redesign metadata sections as web components

Sections are now rendered as custom elements instead of raw HTML strings.
Existing CSS targeting .section-header and .section-content will break.

BREAKING CHANGE: section HTML structure changed from div-based layout
to custom elements <metadata-section> and <metadata-field>
```

### Dependency update
```
build(deps): upgrade exifreader to v5.0.0
```

### Multi-paragraph body with footers
```
fix(editor): prevent race condition during EXIF removal

Introduce a mutex lock around file write operations to prevent
concurrent removeExif and resizeImage calls from corrupting the file.

The backup-restore pattern now checks for an active operation before
proceeding.

Closes: #42
Refs: #38
```

### Revert
```
revert: feat(resize): add WebP output support

Refs: a3b8f2c
```

### Chore
```
chore: remove unused legacy translations from imageDetailsEditor
```

---

## Commit Splitting

If a commit conforms to more than one type, split it into multiple commits:

```
# Instead of one mixed commit, make two:
git commit -m "feat(i18n): add Spanish locale"
git commit -m "fix(i18n): correct Portuguese fallback for pt-PT"
```

This keeps the commit history clean and enables accurate CHANGELOG generation.

---

## Quick Reference

```
<type>(<scope>)!: <description>    ← header (required, max 72 chars)
                                    ← blank line
<body>                              ← optional, wrap at 72 chars
                                    ← blank line
<footer(s)>                         ← optional
```

Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

Scopes: `editor` `webview` `i18n` `metadata` `resize` `types` `config` `build` `deps`
