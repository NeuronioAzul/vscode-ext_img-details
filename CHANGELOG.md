# Changelog

All notable changes to the "Image Details" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **EXIF Data Support**: Complete support for reading and displaying EXIF metadata from photos
  - Camera information (make, model)
  - Photo settings (ISO, aperture, shutter speed, focal length)
  - Date taken
  - GPS location data (latitude, longitude)
  - Image orientation, color space, and software information
- **Color Information Display**: 
  - Transparency support detection for PNG, GIF, WebP, SVG
  - Color depth information based on image format
- **Image Zoom Functionality**: Complete zoom controls for viewing images
  - Zoom in/out buttons with visual controls
  - Mouse wheel zoom (Ctrl/Cmd + Scroll)
  - Click to toggle 2x zoom
  - Keyboard shortcuts: `+` (zoom in), `-` (zoom out), `0` (reset)
  - Fit to screen button
  - Smooth zoom transitions with scale transform
- **Internationalization (i18n)**: Full support for multiple languages
  - English (en) - default
  - Brazilian Portuguese (pt-br)
  - Automatic language detection based on VS Code settings
- **Resizable Metadata Panel**: Users can now resize the metadata panel horizontally
  - Drag the left edge of the panel to resize
  - Minimum width: 250px, Maximum width: 600px
- **Sticky Sidebar**: Metadata panel stays fixed on the right while scrolling through large images
- **Context Menu Option**: Right-click on image files to open with Image Details Viewer
- **Error Handling Page**: User-friendly error page when image loading fails
- **Type Safety Improvements**: Better handling of EXIF data types

### Fixed
- **Bug Fix**: Fixed `text.replace is not a function` error when loading images with EXIF data
  - Added type validation in `escapeHtml` method
  - Improved EXIF data extraction with proper type conversion
  - Added fallback for undefined/null values
- **Bug Fix**: Fixed copy feedback notification not displaying
  - Added `.show` class CSS for proper animation

### Changed
- Enhanced error handling in `resolveCustomEditor` method
- Improved EXIF data extraction with helper function for safer value retrieval
- Better support for various EXIF tag formats
- Improved image container styling for zoom functionality
- Updated package.json with comprehensive metadata for marketplace
- Enhanced README with badges, sections, and detailed information

### Documentation
- Added LICENSE file (MIT)
- Created comprehensive CONTRIBUTING.md guide
- Updated I18N.md with new translation keys
- Improved documentation structure overall

## [0.1.0] - 2025-10-05

First beta release with complete feature set ready for testing.

### Summary
This release includes all core features: EXIF support, zoom controls, color information, internationalization, and a polished user experience.

## [0.0.1] - Initial Development

### Added
- Basic image metadata display
- File name, dimensions, format, file size
- Full file path
- Creation and modification dates
- Click-to-copy functionality for all metadata values
- Visual feedback when copying values
- Support for common image formats (PNG, JPG, JPEG, GIF, BMP, WebP, SVG, ICO)
- Dark/light theme support
- Icons for each metadata type
- Custom editor for image files

---

## Versioning Notes

- **Unreleased**: Features currently in development, not yet published
- Version numbers follow Semantic Versioning: MAJOR.MINOR.PATCH
  - MAJOR: Incompatible API changes
  - MINOR: New functionality (backwards-compatible)
  - PATCH: Bug fixes (backwards-compatible)
