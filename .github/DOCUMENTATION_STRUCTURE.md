# Documentation Guidelines

## Structure Rule

**Root level:** Only `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`  
**All other docs:** Create in `.dev/` subfolders

## Where to Create Files

| Type | Location |
| ------ | ---------- |
| User guides | `.dev/docs/` |
| Contributing guides | `.dev/docs/contributing/` |
| Development guides | `.dev/docs/development/` |
| Publishing guides | `.dev/docs/` |
| Scripts | `.dev/scripts/` |
| Planning | `.dev/planning/` |

## Checklist

When adding documentation:

- [ ] File created in appropriate `.dev/` subfolder
- [ ] Cross-references updated
- [ ] CHANGELOG updated if significant

## Examples

❌ **Wrong:**
```
project-root/
├── README.md
├── NEW_DOC.md      # Don't create docs in root
```

✅ **Correct:**
```
project-root/
├── README.md
└── .dev/
    └── docs/
        └── NEW_DOC.md  # Create in .dev/docs/
```

## **REMEMBER: Organized documentation = Professional project! 🚀**
