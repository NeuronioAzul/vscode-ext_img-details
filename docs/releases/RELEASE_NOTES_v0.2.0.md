# Release Notes - v0.2.0

## 🎉 Enhanced Collapsible Sections with Smart Defaults

**Release Date:** October 7, 2025

This release focuses on improving the metadata panel experience with intelligent section management, advanced animations, and persistent user preferences.

---

## 🎯 Highlights

- ✨ **Smart default states** with intelligent section management
- 🎬 **Advanced animations** with cubic-bezier transitions
- 💾 **Session persistence** for user preferences
- 🎛️ **Display mode toggle** (Accordion/List)
- ⚙️ **Comprehensive VS Code settings** integration

---

## ✨ New Features

### 📱 Smart Default States (3.1.1)

The metadata panel now opens with an optimized view:

- **Basic Information section**: Expanded by default (most frequently accessed)
- **Color Information section**: Collapsed by default
- **EXIF Data section**: Collapsed by default

This provides immediate access to essential information while keeping the interface clean and organized.

**Configurable via:**
```json
{
  "imageDetails.defaultSectionStates": {
    "basicInfo": true,
    "colorInfo": false,
    "exifData": false
  }
}
```

### 🎬 Advanced Animations (3.1.2)

Beautiful, smooth animations enhance the user experience:

- **Smooth transitions**: 0.4s for expand/collapse with cubic-bezier easing
- **Icon rotation**: -90° animation when sections collapse
- **Cascading effects**: Items animate with translateY + opacity
- **Hover effects**: Enhanced visual feedback with transform and box-shadow
- **Optimized durations**: 0.4s for expand/collapse, 0.2s for hovers

The animations use `cubic-bezier(0.4, 0, 0.2, 1)` for a natural, material design feel.

### 💾 Session Persistence (3.1.3)

Your preferences are automatically remembered:

- **Automatic saving**: Section states saved when you expand/collapse
- **Intelligent restoration**: Preferences restored when reopening images
- **Configurable**: Can be disabled if you prefer default states
- **Fallback support**: Uses configured defaults when persistence is disabled

**Control via:**
```json
{
  "imageDetails.rememberSectionStates": true  // default
}
```

### 🎛️ Display Mode Toggle (3.1.4)

Choose how you want to view metadata:

**Accordion Mode (default):**
- Collapsible sections for a clean, organized view
- Expand only what you need
- Saves vertical space

**List Mode:**
- All sections always visible
- No need to click to expand
- Quick overview of all metadata

**Toggle buttons** at the top of the metadata panel let you switch modes instantly. Your preference is saved between sessions.

**Set default mode:**
```json
{
  "imageDetails.defaultDisplayMode": "accordion"  // or "list"
}
```

---

## ⚙️ Configuration Options

Three new VS Code settings give you full control:

### `imageDetails.defaultDisplayMode`

**Type:** `"accordion" | "list"`  
**Default:** `"accordion"`

Choose the default display mode for metadata sections.

### `imageDetails.defaultSectionStates`

**Type:** `object`  
**Default:**
```json
{
  "basicInfo": true,
  "colorInfo": false,
  "exifData": false
}
```

Configure which sections are expanded by default.

### `imageDetails.rememberSectionStates`

**Type:** `boolean`  
**Default:** `true`

Enable or disable session persistence for section states.

---

## 🌐 Internationalization

All new features are fully translated:

| Key | English | Português (Brasil) |
|-----|---------|-------------------|
| `accordionMode` | "Accordion Mode" | "Modo Sanfona" |
| `listMode` | "List Mode" | "Modo Lista" |
| `sectionSettings` | "Section Display" | "Exibição de Seções" |

---

## 🔧 Technical Improvements

### Architecture Enhancements

- **Refactored section generation**: New `generateBasicInfoSection()` method
- **Updated methods**: `generateColorInfoHtml()` and `generateExifHtml()` now accept state parameters
- **State management**: New methods for `getSectionStates()`, `saveSectionState()`
- **Configuration integration**: Enhanced `getDisplayMode()` with fallback support

### Communication

- **Bidirectional messaging**: webview ↔ extension communication via `postMessage`
- **Real-time sync**: Display mode changes applied immediately
- **Automatic persistence**: User preferences saved seamlessly

### CSS Architecture

- **Enhanced animations**: Advanced cubic-bezier transitions
- **Mode-specific styles**: Separate CSS for accordion and list modes
- **Improved hover effects**: Transform and box-shadow animations
- **Responsive design**: Maintains all responsive features

---

## 📚 Documentation Updates

- ✅ **CHANGELOG.md**: Complete v0.2.0 release notes
- ✅ **I18N.md**: Updated with new translation keys
- ✅ **TESTING.md**: New comprehensive testing guide
- ✅ **TODO.md**: Marked items 3.1.1-3.1.4 as completed

---

## 🧪 Testing

To test the new features:

1. **Open any image** in VS Code with the Image Details extension
2. **Verify default states**: Only "Basic Information" should be expanded
3. **Click section headers**: Watch the smooth animations
4. **Toggle display modes**: Try switching between Accordion and List modes
5. **Restart VS Code**: Verify your preferences are remembered

For detailed testing instructions, see [TESTING.md](TESTING.md).

---

## 🎓 Migration Guide

This is a **non-breaking release**. All existing functionality works exactly as before, with new features added on top.

### If you want to keep all sections expanded (old behavior):

1. Set display mode to "list":
```json
{
  "imageDetails.defaultDisplayMode": "list"
}
```

OR

2. Configure all sections to be expanded by default:
```json
{
  "imageDetails.defaultSectionStates": {
    "basicInfo": true,
    "colorInfo": true,
    "exifData": true
  }
}
```

---

## 🙏 Acknowledgments

This release implements TODO items 3.1.1 through 3.1.4, delivering:

- ✅ Smart default states
- ✅ Advanced animations
- ✅ Session persistence
- ✅ Display mode options

All features were implemented following VS Code best practices with full internationalization support.

---

## 🔗 Links

- **GitHub Repository**: https://github.com/NeuronioAzul/vscode-ext_img-details
- **Issues**: https://github.com/NeuronioAzul/vscode-ext_img-details/issues
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **I18N Guide**: [I18N.md](I18N.md)
- **Testing Guide**: [TESTING.md](TESTING.md)

---

**Enjoy the enhanced Image Details experience! 🚀**
