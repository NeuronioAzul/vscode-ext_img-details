# Documentation Organization

## Structure

```text
docs/
├── README.md
├── contributing/
│   └── I18N.md
└── development/
    └── TODO.md
```

## Rule

**Root files:** README.md, CHANGELOG.md, CONTRIBUTING.md only  
**Everything else:** Goes in `docs/` subfolders

See [.github/DOCUMENTATION_STRUCTURE.md](../.github/DOCUMENTATION_STRUCTURE.md) for guidelines.

### Immediate

- [ ] Push changes to repository
- [ ] Verify all links work on GitHub
- [ ] Update wiki (if any) with new structure

### Future

- [ ] Create `docs/tutorials/` when needed
- [ ] Create `docs/api/` for API reference
- [ ] Add screenshots in `docs/images/`
- [ ] Translate main documents to PT-BR

---

## 📝 Git Commands

```bash
# Already executed:
git add -A
git commit -m "docs: organize documentation in hierarchical structure"

# To do:
git push origin main
```

---

## ✨ Final Result

### Before

```text
project-root/
├── README.md
├── CHANGELOG.md           ❌ In root
├── CONTRIBUTING.md        ❌ In root
├── I18N.md               ❌ In root
├── TESTING.md            ❌ In root
└── src/
```

### After

```text
project-root/
├── README.md              ✅ Only MD in root
├── .github/
│   └── DOCUMENTATION_STRUCTURE.md
├── docs/                  ✅ All documentation organized
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── contributing/
│   └── development/
└── src/
```

---

## 🎓 Lessons Learned

1. **Clear separation** between code and documentation
2. **Intuitive structure** facilitates contributions
3. **Documentation of rules** prevents future disorganization
4. **Relative links** maintain portability
5. **Centralized index** improves docs discovery

---

**Status**: ✅ Complete  
**Date**: October 2025  
**Version**: 0.2.0  

---

## **Organized documentation = Professional project! 🚀**
