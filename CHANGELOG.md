# Changelog

All notable changes to the "Image Details" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-11-13

### Added

- **EXIF Data Removal Tool**: Remove all EXIF metadata from images with automatic backup
  - One-Click Removal button below thumbnail preview
  - Automatic backup creates `_backup` file before removing metadata
  - Format Support for JPEG/JPG and PNG images
  - Smart Detection - button only appears when image contains EXIF data
  - Confirmation dialog prevents accidental metadata removal
  - Real-time update - automatically refreshes interface after removal
  - Error handling with automatic restore from backup if operation fails

- **Enhanced Collapsible Sections**:
  - Smart default states (Basic Information expanded, others collapsed)
  - Smooth CSS animations with cubic-bezier transitions
  - Session persistence - remembers section states between VS Code sessions
  - Display mode toggle between Accordion and List modes
  - Configurable via VS Code settings

- **Improved UI Layout**:
  - Fixed zoom bar position at bottom of image area
  - Proper flexbox layout for image and controls
  - Dynamic breadcrumb sizing with resizable metadata panel
  - CSS variable system for synchronized layout updates

### Changed

- Enhanced zoom controls positioning to not overlap images
- Improved metadata panel integration with VS Code UI
- Better visual feedback and animations throughout the interface

### Fixed

- Extension activation issue with missing dependencies in VSIX package
- Confirm dialog sandbox restriction (moved to backend using VS Code API)
- Button state reset when user cancels EXIF removal

## [0.1.0] - 2025-10-05

### Added

- **EXIF Data Support**: Complete EXIF metadata display
  - Camera information, photo settings, GPS data
  - DPI/PPI information extraction
  
- **Advanced Zoom Controls**:
  - Visual controls (+, -, reset, fit to screen)
  - Mouse wheel zoom (Ctrl/Cmd + Scroll)
  - Click to toggle 2× zoom
  - Keyboard shortcuts
  
- **Internationalization**:
  - Full support for English and Brazilian Portuguese
  - Automatic language detection
  
- **Enhanced UI**:
  - Resizable metadata panel (250-600px)
  - Sticky sidebar for large images
  - Thumbnail preview with hover zoom
  - Collapsible metadata sections
  - Context menu integration
  - Click-to-copy for all values

### Initial Features

- Basic image metadata display
- File information (name, size, dimensions, dates)
- Support for PNG, JPG, JPEG, GIF, BMP, WebP, SVG, ICO
- Dark/light theme support
- Error handling page

---

For detailed changelog, see [docs/CHANGELOG.md](docs/CHANGELOG.md)
