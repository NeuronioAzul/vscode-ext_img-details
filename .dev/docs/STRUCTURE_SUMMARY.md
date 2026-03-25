# Documentation Structure

## Project Organization

```text
vscode-ext_img-details/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── package.json
├── esbuild.js
├── tsconfig.json
├── src/
│   ├── extension.ts
│   ├── imageDetailsEditor.ts
│   ├── i18n/
│   │   ├── translations.ts
│   │   └── locales/
│   ├── templates/
│   │   └── htmlGenerators.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── metadata.ts
│       └── imageResize.ts
├── dist/               # Bundled output (esbuild)
├── media/              # Extension icons
└── .dev/               # Development docs & scripts
    ├── docs/
    │   ├── contributing/
    │   │   ├── CONTRIBUTING.md
    │   │   └── I18N.md
    │   ├── development/
    │   │   ├── TODO.md
    │   │   └── REFACTORING.md
    │   └── publishing/
    │       └── PUBLISH_GUIDE.md
    ├── planning/
    │   └── ROADMAP.md
    ├── scripts/
    └── admin/
```

## Rule

New documentation goes in `.dev/docs/` subfolders.

**Navigation:** [Documentation Index](README.md)

- [ ] File created in `.dev/docs/` (appropriate subfolder)
- [ ] Link added to `.dev/docs/README.md`
- [ ] Correct relative links
- [ ] Cross-references updated
- [ ] Examples included
- [ ] Translation considered

---

**Last Updated:** March 2026
**Status:** ✅ Complete
