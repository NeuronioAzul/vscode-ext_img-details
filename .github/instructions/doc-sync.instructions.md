# Documentation Sync Instructions for AI Agents

When making changes to this project, you MUST update the relevant documentation to keep it in sync with the code. Follow these rules:

## Always Update

### CHANGELOG.md (root)
- Add an entry under the appropriate version heading when making any user-facing change (feature, fix, UI change)
- Use the existing format: `### Added`, `### Changed`, `### Fixed`, `### Documentation`, `### Internal`
- If no version section exists for the current work, create one as `## [Unreleased]`

### .dev/docs/development/TODO.md
- Mark items as completed (`[x]`) when they are implemented
- Add new items when new features or tasks are planned
- Update the `Prioridades` section if priorities shift
- Update the `Notas` section with milestone summaries

## Conditional Updates

### When modifying i18n (src/i18n/)
- **Adding a language**: Update `.dev/docs/contributing/I18N.md` supported languages list
- **Adding/removing translation keys**: Update `src/types/index.ts` Translations interface, then update ALL locale files in `src/i18n/locales/`
- **Changing fallback logic**: Update `.dev/docs/contributing/I18N.md` Language Detection Logic section

### When adding features or changing UI
- Update `README.md` Features section if the feature is user-visible
- Update `.dev/planning/ROADMAP.md` to mark completed items or add new planned items
- Update `.dev/docs/MARKETPLACE_GUIDE.md` description if the extension summary changes

### When modifying project structure
- Update `.dev/docs/STRUCTURE_SUMMARY.md` project tree
- Update `.dev/docs/contributing/CONTRIBUTING.md` Project Structure section
- Update `.github/copilot-instructions.md` Architecture section

### When changing dependencies
- Update `.dev/docs/MARKETPLACE_GUIDE.md` Dependencies tab section
- Update `.github/copilot-instructions.md` Key External Dependencies section

### When publishing a new version
- Update version references in `.dev/docs/PUBLISH_GUIDE.md`
- Update `.dev/docs/MARKETPLACE_GUIDE.md` version/date
- Update `.dev/planning/ROADMAP.md` version header and completed milestones

## Documentation Location Rules

- **Root level**: Only `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`
- **All other docs**: Inside `.dev/` subfolders
- **Contributing guides**: `.dev/docs/contributing/`
- **Development docs**: `.dev/docs/development/`
- **Publishing docs**: `.dev/docs/`
- **Planning docs**: `.dev/planning/`
- **Scripts**: `.dev/scripts/`

## Version Reference

When updating version numbers across docs, update ALL of these locations:
- `package.json` → `version`
- `CHANGELOG.md` → version heading
- `.dev/planning/ROADMAP.md` → version header
- `.dev/docs/PUBLISH_GUIDE.md` → footer version
- `.dev/docs/MARKETPLACE_GUIDE.md` → footer date
