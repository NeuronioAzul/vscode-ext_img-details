# Documentation Guidelines

## Structure Rule

**Root level:** Only `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`  
**All other docs:** Create in `docs/` subfolders

## Where to Create Files

| Type | Location |
|------|----------|
| User guides | `docs/` |
| Contributing guides | `docs/contributing/` |
| Development docs | `docs/development/` |

## Checklist

When adding documentation:

- [ ] File created in appropriate `docs/` subfolder
- [ ] Link added to `docs/README.md`
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
└── docs/
    └── NEW_DOC.md  # Create in docs/
```

## **REMEMBER: Organized documentation = Professional project! 🚀**
