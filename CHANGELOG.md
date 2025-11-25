# Changelog

All notable changes to the "Image Details" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2025-11-24

### 🎨 UI Improvements

- **Accordion Icons Update**: Changed accordion toggle icons to use VS Code native Codicon chevrons
  - Chevron-right (▶) when section is collapsed
  - Chevron-down (▼) when section is expanded
  - Maintains consistency with VS Code's standard UI patterns
  - All icons are inline SVG for offline compatibility

### 🐛 Bug Fixes

- **Fixed EXIF Data Display in Accordion Mode**: Increased max-height for expanded sections from 1000px to 10000px
  - Resolves issue where not all EXIF metadata items were visible when expanded
  - Ensures all 70+ EXIF fields display correctly in accordion mode
  - Maintains smooth animation transitions

## [1.1.1] - 2025-11-21

### 🐛 Bug Fixes

- Fixed an issue where the publishing script failed to update the version number in `package.json` when using the `--version` flag.

## [1.1.0] - 2025-11-20

### ✨ New Features

- **Comprehensive EXIF Metadata Display**: Expanded EXIF data visualization to include 70+ fields
  - Image Description
  - Camera Information: Make, Model, Owner Name
  - Lens Information: Make, Model, Serial Number
  - Photo Settings: ISO, Aperture, Shutter Speed, Focal Length, Exposure Program/Mode/Compensation, Metering Mode, Flash, White Balance, Components Configuration, User Comment
  - Date/Time Information: Date Taken, Create Date, Modify Date
  - GPS Information (30+ fields): Version ID, Coordinates with references, Altitude, Timestamps, Satellites, Status, Measure Mode, DOP, Speed, Track, Image Direction, Map Datum, Destination coordinates, Bearing, Distance, Differential
  - Image Technical Information: Compression, Orientation, Resolution (X/Y), Color Space, YCbCr Positioning, Software, Artist, Copyright, EXIF/Flashpix/Interop Versions

- **JSON Metadata Viewer**: New button to view all metadata in JSON format
  - Modal dialog with formatted JSON
  - Easy copy-to-clipboard functionality
  - Useful for developers and advanced users

### 🌍 Internationalization

- **Complete Bilingual Support**: All 70+ EXIF fields now fully translated
  - Portuguese (Brazil) - pt-BR
  - English - en
- **65 New Translation Keys**: Added comprehensive translations for all new EXIF metadata fields
- **Consistent User Experience**: No mixed language display - complete localization

### 🎨 UI Improvements

- Organized EXIF data into logical sections with clear hierarchy
- Added icons for each metadata category
- Improved section headers and visual grouping

### 📝 Documentation

- Updated README with new EXIF features
- Enhanced documentation organization

### 🛠️ Developer Tools

- **Automated Publishing Script**: Interactive publishing automation with professional UX
  - Intelligent version suggestion (Semantic Versioning)
  - Automatic CHANGELOG extraction for release notes
  - Git tag creation and push automation
  - GitHub release creation (via GitHub CLI)
  - VS Code Marketplace publishing
  - Dry-run mode for testing
  - Visual progress indicators and formatted output
  - Command-line options for non-interactive use
- **Publishing Documentation**: Complete guide in `docs/PUBLISHING.md`
  - Prerequisites and setup instructions
  - Workflow explanation with examples
  - Troubleshooting section
  - Security best practices

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
