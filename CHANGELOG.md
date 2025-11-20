# Changelog

All notable changes to the "Image Details" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-11-18

### 🐛 Bug Fixes

- Fixed badges in README.md not displaying correctly on GitHub and VS Code Marketplace

## [1.0.1] - 2025-11-18

### 🚀 Performance & Documentation

- **Bundling with esbuild**: Reduced from 149 files to 100 files (33% reduction)
- **Optimized package size**: Single bundled JavaScript file improves activation time
- **Documentation improvements**: Streamlined and professional documentation
- **Cleaner structure**: All documentation organized in `docs/` folder

### 🔧 Technical

- Added esbuild bundling for production builds
- Updated build scripts: `npm run package` for optimized builds
- Watch mode now includes parallel type checking
- Enhanced VS Code tasks configuration

---

## [1.0.0] - 2025-11-18

### 🎉 Initial Public Release

This is the first stable public release of Image Details extension for VS Code.

### ✨ Features

- **Comprehensive Image Metadata Display**
  - Basic information: dimensions, format, file size, timestamps
  - Color & technical information: transparency, color depth, DPI/PPI
  - Full EXIF data support for photos (camera, settings, GPS, dates)
  - Collapsible metadata sections with persistent state
  
- **EXIF Data Management**
  - Remove EXIF metadata from JPEG/PNG images
  - Automatic backup creation before removal
  - Safe restore on errors
  
- **Image Viewer**
  - Thumbnail preview in metadata panel
  - Zoom controls (in/out/fit/reset)
  - Keyboard shortcuts support
  - Mouse wheel zoom (Ctrl+Scroll)
  
- **User Experience**
  - Click any metadata value to copy to clipboard
  - Visual feedback on copy
  - Multi-language support (English, Portuguese BR)
  - Dark/Light theme responsive
  - Custom icons for metadata types

### 🔒 Security

- Clean commit history
- Public repository ready

### 📚 Documentation

- Complete README with screenshots and demo
- Contributing guidelines
- Internationalization guide
- Comprehensive Development docs

### 🛠️ Technical

- VS Code API 1.94.0 support
- TypeScript 5.3.3
- ExifReader 4.32.0 for EXIF parsing
- Image-size 1.1.1 for dimensions
- Optimized build and package size

- Improved README.md structure with better organization of features
- Enhanced marketplace presentation with visual assets
- Updated license badge to use standard MIT badge format
- Added `sponsor` field in package.json

---
