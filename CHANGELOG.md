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
  - **DPI/PPI Information**: Extracts and displays XResolution/YResolution from EXIF data
    - Shows DPI (dots per inch) or pixels/cm based on ResolutionUnit
    - Handles both uniform and non-uniform resolutions (e.g., "72 DPI" or "300 x 300 DPI")
    - Displayed in the Color & Technical Information section
- **Color Information Display**:
  - Transparency support detection for PNG, GIF, WebP, SVG
  - Color depth information based on image format (8-bit, 24-bit, 32-bit)
  - DPI/PPI metadata display when available
- **Image Zoom Functionality**: Complete zoom controls for viewing images
  - Zoom in/out buttons with visual controls (+, -, ⟲, ⊡)
  - Mouse wheel zoom (Ctrl/Cmd + Scroll)
  - Click to toggle 2× zoom
  - Keyboard shortcuts: `+` (zoom in), `-` (zoom out), `0` (reset)
  - Fit to screen button for automatic viewport adjustment
  - Smooth zoom transitions with CSS scale transform
  - Centered zoom focal point
- **Internationalization (i18n)**: Full support for multiple languages
  - 🇺🇸 English (en) - default
  - 🇧🇷 Brazilian Portuguese (pt-br)
  - Automatic language detection based on VS Code settings
  - All metadata labels, tooltips, and UI text fully translated
- **Resizable Metadata Panel**: Users can now resize the metadata panel horizontally
  - Drag the left edge of the panel to resize
  - Minimum width: 250px, Maximum width: 600px
  - Smooth resizing with visual resize cursor
- **Sticky Sidebar**: Metadata panel stays fixed on the right while scrolling through large images
  - Enables viewing metadata while exploring large images
  - Maintains visibility across all zoom levels
- **Context Menu Option**: Right-click on image files to open with Image Details Viewer
  - Registered as "editor/title/context" contribution
  - Appears in Explorer context menu for all supported image formats
- **Error Handling Page**: User-friendly error page when image loading fails
  - Displays helpful error messages
  - Suggests troubleshooting steps
  - Maintains consistent styling with main viewer
- **Type Safety Improvements**: Better handling of EXIF data types
  - `escapeHtml()` function now accepts `string | number | undefined | null`
  - `getDescription()` helper safely extracts EXIF values
  - Proper type conversion throughout metadata extraction

### Fixed

- **Bug Fix**: Fixed `text.replace is not a function` error when loading images with EXIF data
  - Root cause: EXIF data contained numeric and undefined values
  - Solution: Enhanced `escapeHtml()` to handle multiple types
  - Added type validation and conversion before string operations
  - Created `getDescription()` helper for safe EXIF value extraction
  - Added fallback for undefined/null values
- **Bug Fix**: Fixed copy feedback notification not displaying
  - Root cause: Missing CSS class for animation
  - Solution: Added `.show` class with `opacity: 1` and `transform: translateX(0)`
  - Notification now properly slides in from the right with fade effect
- **Development Fix**: Suppressed Node.js experimental SQLite warnings in VS Code debug environment
  - Added `NODE_NO_WARNINGS=1` environment variable to launch configurations
  - Warnings were from VS Code internal processes, not the extension itself
  - Provides cleaner debugging experience without affecting functionality

### Changed

- Enhanced error handling in `resolveCustomEditor` method with try-catch blocks
- Improved EXIF data extraction with `getDescription()` helper for safer value retrieval
- Better support for various EXIF tag formats (handles both `description` and `value` properties)
- Improved image container styling for zoom functionality
  - Added transform origin center for zoom
  - Smooth transitions with CSS
  - Cursor changes based on zoom state
- Updated package.json with comprehensive metadata for marketplace
  - Added publisher name "NeuronioAzul"
  - Enhanced description and keywords
  - Added repository and bugs URLs
  - Set categories: "Other", "Visualization"
- Enhanced README with badges, comprehensive feature list, and usage guide
  - Added VS Code version, license, and TypeScript badges
  - Reorganized features into logical categories
  - Added detailed usage instructions with examples
  - Improved documentation structure

### Documentation

- Added LICENSE file (MIT License)
- Created comprehensive CONTRIBUTING.md guide
  - Bug reporting guidelines
  - Feature request process
  - Pull request checklist
  - Translation contribution guide
- Created I18N.md with translation documentation
  - How to add new languages
  - Translation key reference
  - Step-by-step guide for contributors
- Updated I18N.md with new translation keys:
  - Added `dpi: 'DPI/PPI'` to Translations interface
  - Updated both English and Portuguese translations
- Improved README.md structure and content
  - Comprehensive feature list
  - Usage examples and keyboard shortcuts
  - Installation instructions
  - Contributing guidelines reference

## [0.1.0] - 2025-10-05

First beta release with complete feature set ready for testing.

### Summary

This release includes all core features: comprehensive EXIF support (including DPI/PPI), advanced zoom controls (5 different methods), color and transparency information, full internationalization (EN + PT-BR), resizable sticky sidebar, copy-to-clipboard functionality, and a polished user experience with error handling.

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
