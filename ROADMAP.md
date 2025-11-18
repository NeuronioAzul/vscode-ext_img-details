# Roadmap

**Version:** 1.0.0 | **Updated:** November 2025

## 📊 Project Status

| Category | Total | Completed | Pending | % Complete |
|----------|-------|-----------|---------|------------|
| **Code Cleanup** | 5 | 5 | 0 | 100% |
| **Extended Metadata** | 5 | 4 | 1 | 80% |
| **Interface & UX** | 12 | 12 | 0 | 100% |
| **Settings** | 4 | 0 | 4 | 0% |
| **Performance** | 1 | 0 | 1 | 0% |
| **Publishing** | 12 | 9 | 3 | 75% |
| **Testing** | 5 | 0 | 5 | 0% |
| **Documentation** | 5 | 2 | 3 | 40% |
| **Compatibility** | 4 | 0 | 4 | 0% |

---

## 🚀 v1.1.0 - Next Release (Q1 2026)

### 🎯 High Priority

#### 1. Complete Extended Metadata

**Complexity:** Medium | **Estimated Time:** 2-3 weeks

- [ ] **Add detailed PNG metadata**
  - Compression type/quality
  - Filter and Interlace information
  
- [ ] **Implement IPTC metadata**
  - Keywords, Caption, Copyright
  - Author, Location information
  - Categories and ratings
  
- [ ] **Add XMP metadata**
  - Panorama information
  - Creator and Rights
  - Advanced photo metadata

**Benefit:** More complete data for professional photographers and designers

---

#### 2. User Settings

**Complexity:** Low-Medium | **Estimated Time:** 1-2 weeks

- [ ] **Visible metadata selection**
  - Checkboxes to choose which sections to display
  - Save preferences per workspace
  
- [ ] **Customizable date/time format**
  - Automatic locale detection
  - Format options (ISO, Local, Custom)
  
- [ ] **Measurement units**
  - Toggle bytes vs KB/MB/GB
  - Unit options for dimensions

**Benefit:** Personalized experience for different user types

---

### 🎯 Medium Priority

#### 3. Testing System

**Complexity:** High | **Estimated Time:** 2-3 weeks

- [ ] **Unit tests**
  - Metadata extraction
  - Value formatting
  - Type validation
  
- [ ] **Integration tests**
  - VS Code API
  - File system operations
  - Webview communication
  
- [ ] **Compatibility tests**
  - Different image formats
  - Various file sizes
  - Edge cases

**Benefit:** Greater stability and confidence in releases

---

#### 4. CI/CD and Automation

**Complexity:** Medium | **Estimated Time:** 1 week

- [ ] **GitHub Actions workflow**
  - Automatic build on commits
  - Automated tests
  - Release automation
  
- [ ] **Quality gates**
  - Minimum code coverage
  - Mandatory linting
  - Type checking

**Benefit:** More professional and reliable development process

---

## 🔮 v1.2.0 - Future Release (Q2 2026)

### 🎯 Medium-Low Priority

#### 5. Performance and Optimization

**Complexity:** Medium-High | **Estimated Time:** 2 weeks

- [ ] **Lazy loading for large images**
  - Load metadata first
  - Low-resolution preview
  - Full load on-demand
  
- [ ] **Metadata caching**
  - Avoid EXIF re-parsing
  - Smart invalidation
  
- [ ] **Virtual scrolling**
  - For long metadata lists
  - Better performance with many fields

**Benefit:** Smooth experience even with very large files

---

#### 6. Advanced Documentation

**Complexity:** Low-Medium | **Estimated Time:** 1-2 weeks

- [ ] **Documented internal API**
  - Complete JSDoc
  - Architecture diagrams
  - Extension points
  
- [ ] **Examples and samples**
  - Common use cases
  - Code snippets
  - Best practices
  
- [ ] **Troubleshooting guide**
  - FAQ
  - Common issues
  - Debug tips

**Benefit:** Facilitates contributions and user support

---

## 🌟 v2.0.0 - Long-term Vision (Q3-Q4 2026)

### 🎯 Advanced Features

#### 7. Support for New Formats

**Complexity:** High | **Estimated Time:** 3-4 weeks

- [ ] **RAW formats**
  - CR2, NEF, ARW, DNG
  - Camera-specific metadata
  
- [ ] **Advanced TIFF**
  - Multi-page support
  - GeoTIFF information
  
- [ ] **Vector formats**
  - SVG metadata
  - AI/EPS information (if possible)

**Benefit:** Make the extension useful for professional photographers

---

#### 8. Remote Resources

**Complexity:** High | **Estimated Time:** 2-3 weeks

- [ ] **Remote URL support**
  - Fetch online images
  - Local cache
  
- [ ] **Git repository images**
  - Image preview in PRs
  - History visualization
  
- [ ] **Cloud storage integration**
  - AWS S3, Google Cloud Storage
  - Metadata directly from cloud

**Benefit:** Flexibility to work with diverse resources

---

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
