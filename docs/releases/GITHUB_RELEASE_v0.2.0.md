# GitHub Release - v0.2.0

## Title

🎉 v0.2.0 - Enhanced Collapsible Sections with Smart Defaults

## Description

This release delivers major improvements to the metadata panel with intelligent section management, beautiful animations, and persistent user preferences.

---

## 🎯 Highlights

- ✨ Smart default states with intelligent section management
- 🎬 Advanced animations with cubic-bezier transitions
- 💾 Session persistence for user preferences
- 🎛️ Display mode toggle (Accordion/List)
- ⚙️ Comprehensive VS Code settings integration

---

## ✨ What's New

### 📱 Smart Default States (3.1.1)

- **Basic Information** section expanded by default
- **Color Information** and **EXIF Data** sections collapsed by default
- Provides immediate access to essential info while keeping the UI clean
- Fully configurable via `imageDetails.defaultSectionStates`

### 🎬 Advanced Animations (3.1.2)

- Smooth 0.4s expand/collapse transitions with cubic-bezier easing
- Icon rotation animation (-90° for collapsed state)
- Cascading item animations (translateY + opacity)
- Enhanced hover effects with transform and box-shadow
- Optimized durations for best UX

### 💾 Session Persistence (3.1.3)

- Automatically saves section states when you expand/collapse
- Intelligently restores your preferences when reopening images
- Can be disabled via `imageDetails.rememberSectionStates`
- Falls back to default configuration when disabled

### 🎛️ Display Mode Toggle (3.1.4)

- **Accordion Mode** (default): Collapsible sections for clean organization
- **List Mode**: All sections always visible for quick overview
- Visual toggle buttons in the metadata panel
- Display preference saved between sessions
- Configurable via `imageDetails.defaultDisplayMode`

---

## ⚙️ New Configuration Options

```json
{
  // Choose default display mode
  "imageDetails.defaultDisplayMode": "accordion",  // or "list"
  
  // Configure which sections are expanded by default
  "imageDetails.defaultSectionStates": {
    "basicInfo": true,
    "colorInfo": false,
    "exifData": false
  },
  
  // Enable/disable session persistence
  "imageDetails.rememberSectionStates": true
}
```

---

## 🌐 Internationalization

All new features fully translated:

- 🇺🇸 English
- 🇧🇷 Português (Brasil)

New translation keys: `accordionMode`, `listMode`, `sectionSettings`

---

## 🔧 Technical Improvements

- Refactored section generation methods
- Bidirectional webview ↔ extension communication
- Enhanced state management
- Improved CSS architecture with mode-specific styles
- Configuration fallback support

---

## 📚 Documentation

- ✅ Complete CHANGELOG with detailed release notes
- ✅ Updated I18N.md with new translation keys
- ✅ New TESTING.md with comprehensive testing guide
- ✅ Updated TODO.md (completed items 3.1.1-3.1.4)
- ✅ Full release notes in RELEASE_NOTES_v0.2.0.md

---

## 🎓 Migration

This is a **non-breaking release**. All existing functionality works as before.

To keep all sections expanded (previous behavior):

- Set `"imageDetails.defaultDisplayMode": "list"`, OR
- Set all sections to `true` in `defaultSectionStates`

---

## 🧪 How to Test

1. Open any image in VS Code
2. Verify only "Basic Information" is expanded
3. Click section headers to see smooth animations
4. Try switching between Accordion and List modes
5. Restart VS Code to verify preferences are saved

---

## 📦 Assets

- Source code (zip)
- Source code (tar.gz)

---

## 🔗 Links

- [Full Changelog](https://github.com/NeuronioAzul/vscode-ext_img-details/blob/main/CHANGELOG.md)
- [Documentation](https://github.com/NeuronioAzul/vscode-ext_img-details/blob/main/README.md)
- [Contributing Guide](https://github.com/NeuronioAzul/vscode-ext_img-details/blob/main/CONTRIBUTING.md)
- [I18N Guide](https://github.com/NeuronioAzul/vscode-ext_img-details/blob/main/I18N.md)
- [Testing Guide](https://github.com/NeuronioAzul/vscode-ext_img-details/blob/main/TESTING.md)

---

**Full Changelog**: <https://github.com/NeuronioAzul/vscode-ext_img-details/compare/v0.1.0...v0.2.0>

---

## 🙏 Acknowledgments

Special thanks to everyone who provided feedback on the collapsible sections feature!

## Enjoy the enhanced Image Details experience! 🚀

---
