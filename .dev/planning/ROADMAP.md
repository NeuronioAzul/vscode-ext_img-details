# Roadmap

**Version:** 1.3.1 | **Updated:** March 2026

## 📊 Project Status

| Category | Total | Completed | Pending | % Complete |
|----------|-------|-----------|---------|------------|
| **Code Cleanup** | 5 | 5 | 0 | 100% |
| **Extended Metadata** | 7 | 6 | 1 | 86% |
| **Interface & UX** | 12 | 12 | 0 | 100% |
| **Image Resize** | 1 | 1 | 0 | 100% |
| **i18n** | 5 | 5 | 0 | 100% |
| **Settings** | 4 | 1 | 3 | 25% |
| **Performance** | 3 | 0 | 3 | 0% |
| **Publishing** | 13 | 12 | 1 | 92% |
| **Testing** | 8 | 0 | 8 | 0% |
| **Documentation** | 6 | 4 | 2 | 67% |
| **Compatibility** | 4 | 0 | 4 | 0% |

---

## ✅ Completed Milestones

### v1.0.0 – v1.1.5 (2025)
- Custom editor for image files with comprehensive metadata display
- EXIF data extraction (70+ fields) with camera, lens, GPS, and technical info
- DPI/PPI resolution display with separate X/Y and unit
- Accordion/list display modes with persistent section states
- Zoom controls (mouse wheel, keyboard shortcuts, click toggle)
- Copy-to-clipboard for all metadata values
- EXIF removal with backup and restore-on-error
- View all metadata as formatted JSON modal
- Modular architecture (types, i18n, utils, templates)
- 5 languages: English, Portuguese, Japanese, Spanish, Chinese Simplified

### v1.2.0 – v1.2.6 (2025-2026)
- Image resize feature via Jimp (pure JS, cross-platform)
- Backup-first pattern for resize (`image-original.ext`)
- Quality slider, aspect ratio lock, dimension validation
- sharp → jimp migration (no native binaries)
- Bug fixes: resize modal, keyboard shortcuts, input fields

### v1.3.0 – v1.3.1 (March 2026)
- DPI/PPI display improvements (PPI (DPI) label, X/Y on single line)
- Border-radius removal from image/thumbnail
- Documentation migration to `.dev/` folder
- Contributors section in README

---

## 🚀 v1.4.0 – Next Release

### 🎯 High Priority

#### 1. Testing System

- [ ] Unit tests for `src/utils/metadata.ts`
- [ ] Unit tests for `src/i18n/translations.ts`
- [ ] Unit tests for `src/templates/htmlGenerators.ts`
- [ ] Integration tests for editor provider
- [ ] Format-specific tests (PNG, JPEG, GIF, WebP)

#### 2. CI/CD

- [ ] GitHub Actions workflow (build, type-check, test on push)
- [ ] Automated release pipeline

#### 3. Performance

- [ ] Lazy loading for large images
- [ ] Metadata caching
- [ ] Virtual scrolling for long metadata lists

---

## 🔮 v1.5.0 – Mid-term

### 🎯 Medium Priority

#### 4. User Settings

- [ ] Metadata visibility selection (choose which sections to display)
- [ ] Customizable date/time format
- [ ] Measurement unit options (bytes vs KB/MB)

#### 5. Extended Metadata

- [ ] IPTC metadata (keywords, caption, copyright)
- [ ] XMP metadata (panorama, creator, rights)
- [ ] PNG compression type/quality

#### 6. Additional Languages

- [ ] French (fr)
- [ ] German (de)
- [ ] Russian (ru)
- [ ] Korean (ko)

---

## 🌟 v2.0.0 – Long-term Vision

### 🎯 Advanced Features

#### 7. New Format Support

- [ ] RAW formats (CR2, NEF, ARW, DNG)
- [ ] TIFF (multi-page, GeoTIFF)
- [ ] HEIC/HEIF
- [ ] Vector formats (SVG metadata)

#### 8. Advanced Features

- [ ] Remote URL image support
- [ ] Batch image operations
- [ ] Resize history (undo/redo)

#### 9. Documentation

- [ ] Internal API documentation (JSDoc)
- [ ] Troubleshooting guide
- [ ] Examples and samples

#### 9. Extended Compatibility

**Complexity:** Medium | **Estimated Time:** 2 weeks

- [ ] **Multi-version VS Code**
  - Test with v1.85, 1.90, 1.94+
  - Graceful degradation
  
- [ ] **Integration with other extensions**
  - Image editors
  - Git viewers
  - Preview extensions
  
- [ ] **Cross-platform testing**
  - Windows, macOS, Linux
  - WSL compatibility
  - Remote development

**Benefit:** Greater reach and compatibility

---

## 📝 Backlog / Future Ideas

### Features Under Consideration

- **Batch operations**
  - Remove EXIF from multiple images
  - Export metadata to JSON/CSV
  
- **Image comparison**
  - Side-by-side viewer
  - Metadata diff
  
- **Metadata editor**
  - Edit EXIF fields
  - Add/remove tags
  
- **Export reports**
  - HTML report generation
  - PDF export
  
- **Command palette actions**
  - Quick EXIF removal
  - Copy specific metadata
  
- **Workspace integration**
  - Project-wide image analysis
  - Metadata search across files

---

## 🏆 Milestones

### ✅ v1.0.0 - Initial Public Release (Completed)

- ✅ Core functionality
- ✅ EXIF support
- ✅ Multi-language (EN, PT-BR)
- ✅ Zoom controls
- ✅ EXIF removal tool
- ✅ Published to marketplace

### 🎯 v1.1.0 - Enhanced Metadata (Q1 2026)

- Complete extended metadata
- User settings
- Basic testing system
- CI/CD implemented

### 🔮 v1.2.0 - Performance & Quality (Q2 2026)

- Optimized performance
- Complete documentation
- Test coverage > 80%

### 🌟 v2.0.0 - Professional Edition (Q3-Q4 2026)

- RAW formats
- Remote resources
- Advanced features

---

## 📊 Success Metrics

### Goals for v1.1.0

- [ ] 1,000+ installations
- [ ] 4.5+ star rating
- [ ] < 5 critical issues open
- [ ] Test coverage > 60%

### Goals for v2.0.0

- [ ] 10,000+ installations
- [ ] 4.8+ star rating
- [ ] External contributors: 5+
- [ ] Test coverage > 80%

---

## 🤝 How to Contribute

Want to help implement any roadmap item?

1. Choose an unassigned item
2. Comment on the corresponding issue
3. Read the [Contributing Guide](docs/contributing/CONTRIBUTING.md)
4. Fork and start working!

**Areas that need help most:**

- 🧪 Automated testing
- 📝 Documentation
- 🌐 Translations to new languages
- 🐛 Bug fixes

---

## 📞 Feedback

Have suggestions for the roadmap?

- [Open an issue](https://github.com/NeuronioAzul/vscode-ext_img-details/issues/new)
- [Start a discussion](https://github.com/NeuronioAzul/vscode-ext_img-details/discussions)
- Comment on existing issues

---

**Note:** This roadmap is dynamic and may be adjusted based on community feedback, priorities, and available resources.

**Last review:** November 18, 2025
