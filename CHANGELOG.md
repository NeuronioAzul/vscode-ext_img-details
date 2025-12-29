# Changelog

All notable changes to the "Image Details" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.5] - 2025-12-29

### 🔧 Changed - v1.2.5

- **Image Processing**: Replaced `sharp` with `jimp` for image resizing
  - Eliminates native binary dependencies that caused installation errors
  - Pure JavaScript implementation works across all platforms
  - Fixes "Could not load the sharp module" error in VS Code Remote/Server environments
  - Maintains full image resize functionality without platform-specific builds

### 🧹 Code Cleanup - v1.2.5

- **Refactoring**: Removed legacy code and unused imports
  - Removed legacy translations object (~530 lines) that was no longer used
  - Removed unused imports (`escapeHtml`, `generateBasicInfoSection`, `generateColorInfoHtml`, `generateExifHtml`)
  - Reduced `imageDetailsEditor.ts` file size by ~49% (1078 → 550 lines)
  - Code now uses only modular i18n implementation from `src/i18n/translations.ts`

### 🐛 Fixed - v1.2.5

- **Extension Activation**: Fixed extension activation failure in VS Code Server/Remote environments
  - Resolved sharp binary compatibility issues on linux-x64 runtime
  - Extension now works reliably in WSL, Remote SSH, and Codespaces

## [1.2.4] - 2025-12-28

### 🔒 Security - v1.2.4

- **Webview Security**: Added Content Security Policy (CSP) to all webviews
  - Eliminates VS Code warning about missing CSP
  - Improves security by restricting resource loading
  - Follows VS Code webview best practices
  - CSP allows only necessary sources: webview resources, data URIs, inline styles/scripts

### 🐛 Fixed

- **Extension Host Warning**: Resolved "webview without content security policy" warning in Extension Host logs

## [1.2.3] - 2025-12-23

### 🏗️ Repository Organization v1.2.3

- **Repository Structure**: Added professional repository organization system
  - Separates production files (main branch) from development files (dev branch)
  - Moves development files to `.dev/` directory structure in dev branch
  - Maintains clean main branch with only essential production files

### 🔧 Improvements in branch dev v1.2.3

- **Publishing Script**: Enhanced `publish.sh` with better error handling
  - Improved PAT validation with detailed error messages
  - Added detection for TF400813 authorization errors
  - Better guidance on required permissions (Marketplace Manage vs Publish)
  - Automatic error detection and helpful suggestions
  - Links to publisher management and token creation

### 🐛 Fixed in branch dev v1.2.3

- **Publishing Workflow**: Improved error detection and user feedback
  - Better validation of Personal Access Token before making changes
  - Clear instructions when authorization fails
  - Prevents failed publishes with invalid credentials

## [1.2.2] - 2025-12-23

### 🐛 Fixed - v1.2.2

- **Image Resize Tool**: Improved error handling and user feedback

## [1.2.1] - 2025-12-22

### 🐛 Fixed - v1.2.1

- **Resize Modal**: Fixed input fields not accepting numeric values
- **Resize Modal**: Width and Height fields now pre-populate with current image dimensions
- **Resize Modal**: Aspect ratio calculation now works correctly when changing either dimension
- **Resize Modal**: Event listeners properly initialized when modal opens
- **Resize Modal**: Fixed infinite loop causing modal to constantly reopen
- **Resize Modal**: Fixed pointer-events preventing interaction with modal elements
- **Resize Modal**: Close button (X), Cancel button, and overlay click now properly close the modal
- **Resize Modal**: Input fields now accept all numeric values including zero

### 🔧 Changed - v1.2.1

- **Keyboard Shortcuts**: Zoom shortcuts now require Ctrl modifier to prevent conflicts with input fields
  - Zoom In: `Ctrl + +` (previously `+`)
  - Zoom Out: `Ctrl + -` (previously `-`)
  - Reset Zoom: `Ctrl + 0` (previously `0`)
- **Keyboard Shortcuts**: Shortcuts are now disabled when typing in input fields or textareas
- **UI**: Updated zoom button tooltips to reflect new keyboard shortcuts

## [1.2.0] - 2025-12-22

### ✨ Added - v1.2.0

- **Image Resize Tool**: New feature to resize images directly from the viewer
  - Interactive modal with width/height inputs
  - Automatic aspect ratio calculation
  - Quality control slider (0-100) for compressed formats
  - Automatic backup creation with `-original` suffix
  - Support for JPEG, PNG, and WebP formats
  - Error handling with automatic backup restoration
  - Real-time dimension preview
  - Complete translations in 5 languages (en, pt-br, ja, es, zh-cn)

### 🔧 Changed - v1.2.0

- Added `sharp@0.33.1` dependency for high-performance image processing

## [1.1.5] - 2025-11-25

### 🌐 Chinese Simplified (zh-cn) - 简体中文 Language Support v1.1.4

- **Chinese Simplified Language (简体中文)**: Added complete Chinese Simplified translation
  - All 110+ UI strings translated
  - Automatic detection for all Chinese Simplified locales (`zh-cn`, `zh-sg`, etc.)
  - Full EXIF metadata field translations
  - Chinese is the most spoken language globally with over 1 billion speakers

### 🏗️ Code Architecture Refactoring

- **Modular Architecture Implementation**

- **Phase 1 - Modularization**: Refactored monolithic `imageDetailsEditor.ts` (3250+ lines) into a modular structure for improved maintainability, testability, and scalability.

- **Phase 2 - Core Migration** (COMPLETED):
  - Replaced `getTranslations()` method with centralized i18n module (28 → 3 lines, 89% reduction)
  - Updated type definitions to use imported types
  - Removed duplicate interface definitions

- **Benefits**:
  - Improved maintainability (reduced code duplication)
  - Better testability (pure functions, loose coupling)
  - Enhanced reusability (functions can be imported by other modules)
  - Easier to add new languages (create one file per locale)
  - Clear separation of concerns
  - Better code organization and readability

- **Modular Architecture - Phase 3 Complete**: Refactored monolithic 3250-line file into professional modular structure
  - **`src/types/`**: Centralized TypeScript type definitions (`Translations`, `DisplayMode`, `SectionStates`)
  - **`src/i18n/`**: Internationalization module with automatic locale detection
  - **`src/i18n/locales/`**: Separate files for each language (en, pt-br, ja, es)
  - **`src/utils/metadata.ts`**: Complete metadata processing utilities (507 lines)
  - **`src/templates/`**: HTML generation functions separated from business logic (pending)

- **Phase 3 - Utility Functions Migration** (COMPLETED):
  - ✅ Extracted `formatFileSize()` - File size formatting (8 lines)
  - ✅ Extracted `getColorInfo()` - Color information extraction (37 lines)
  - ✅ Extracted `calculateBitDepth()` - Bit depth calculation (45 lines)
  - ✅ Extracted `extractRelevantExifData()` - Complete EXIF processing (580 lines)
  - ✅ Updated all function calls from `this.method()` to `method()`
  - ✅ Added comprehensive JSDoc documentation
  - ✅ Zero compilation errors

- **Phase 4A - HTML Generators Migration** (PARTIAL):
  - ✅ Created `src/templates/htmlGenerators.ts` module
  - ✅ Extracted `escapeHtml()` - HTML sanitization helper (18 lines)
  - ✅ Extracted `getErrorHtml()` - Error page generator (86 lines)
  - ⏳ Pending: `generateColorInfoHtml()` (~50 lines)
  - ⏳ Pending: `generateExifHtml()` (~600 lines with 70+ EXIF fields)
  - ⏳ Pending: `getHtmlForWebview()` (~950 lines with full CSS/JS)
  - ✅ Zero compilation errors

- **Code Reduction Metrics**:
  - Main file: 3,252 → 2,655 lines (-597 lines, -18.4%)
  - Total reduction: 597 lines from original (18.4%)
  - Code extracted to modules:
    - `utils/metadata.ts`: 507 lines
    - `templates/htmlGenerators.ts`: 175 lines (partial, Phase 4A)
  - Remaining to extract (Phase 4B): ~1,600 lines

- **Documentation**: Added comprehensive refactoring docs
  - `REFACTORING_SUMMARY.md`: Executive summary
  - `docs/development/REFACTORING.md`: Technical documentation
  - `MIGRATION_STATUS.md`: Migration progress tracker
  - `PHASE_3_COMPLETE.md`: Detailed Phase 3 completion report
  - `PHASE_4A_COMPLETE.md`: Phase 4A partial completion report

## [1.1.4] - 2025-11-25

### 🌐 Japanese and Spanish Language Support v1.1.4

- **Spanish Language (Español)**: Added complete Spanish translation
  - All 110+ UI strings translated
  - Automatic detection for all Spanish locales (`es`, `es-ES`, `es-MX`, `es-AR`, etc.)
  - Full EXIF metadata field translations
  - Spanish is the 4th most spoken language globally with 500+ million speakers

- **Japanese Language (日本語)**: Added complete Japanese translation
  - All 110+ UI strings translated
  - Automatic detection for `ja` and `ja-JP` locales
  - Full EXIF metadata field translations

## [1.1.3] - 2025-11-24

### 📦 build package improvement v1.1.3

- **Bundling Optimization**: Updated esbuild configuration to exclude unnecessary files from the final package
  - Removed redundant type declaration files (.d.ts) from `node_modules`
  - Reduced package size

## [1.1.2] - 2025-11-24

### 🎨 UI Improvements v1.1.2

- **Accordion Icons Update**: Changed accordion toggle icons to use VS Code native Codicon chevrons
  - Chevron-right (▶) when section is collapsed
  - Chevron-down (▼) when section is expanded
  - Maintains consistency with VS Code's standard UI patterns
  - All icons are inline SVG for offline compatibility

### 🐛 Bug Fixes v1.1.2

- **Fixed EXIF Data Display in Accordion Mode**: Increased max-height for expanded sections from 1000px to 10000px
  - Resolves issue where not all EXIF metadata items were visible when expanded
  - Ensures all 70+ EXIF fields display correctly in accordion mode
  - Maintains smooth animation transitions

## [1.1.1] - 2025-11-21

### 🐛 Bug Fixes v1.1.1

- Fixed an issue where the publishing script failed to update the version number in `package.json` when using the `--version` flag.

## [1.1.0] - 2025-11-20

### ✨ New Features v1.1.0

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

### 🌍 Internationalization v1.1.0

- **Complete Bilingual Support**: All 70+ EXIF fields now fully translated
  - Portuguese (Brazil) - pt-BR
  - English - en
- **65 New Translation Keys**: Added comprehensive translations for all new EXIF metadata fields
- **Consistent User Experience**: No mixed language display - complete localization

### 🎨 UI Improvements v1.1.0

- Organized EXIF data into logical sections with clear hierarchy
- Added icons for each metadata category
- Improved section headers and visual grouping

### 📝 Documentation v1.1.0

- Updated README with new EXIF features
- Enhanced documentation organization

### 🛠️ Developer Tools v1.1.0

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

### 🐛 Bug Fixes v1.0.2

- Fixed badges in README.md not displaying correctly on GitHub and VS Code Marketplace

## [1.0.1] - 2025-11-18

### 🚀 Performance & Documentation v1.0.1

- **Bundling with esbuild**: Reduced from 149 files to 100 files (33% reduction)
- **Optimized package size**: Single bundled JavaScript file improves activation time
- **Documentation improvements**: Streamlined and professional documentation
- **Cleaner structure**: All documentation organized in `docs/` folder

### 🔧 Technical v1.0.1

- Added esbuild bundling for production builds
- Updated build scripts: `npm run package` for optimized builds
- Watch mode now includes parallel type checking
- Enhanced VS Code tasks configuration

---

## [1.0.0] - 2025-11-18

### 🎉 Initial Public Release

This is the first stable public release of Image Details extension for VS Code.

### ✨ Features v1.0.0

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

### 🔒 Security v1.0.0

- Clean commit history
- Public repository ready

### 📚 Documentation v1.0.0

- Complete README with screenshots and demo
- Contributing guidelines
- Internationalization guide
- Comprehensive Development docs

### 🛠️ Technical v1.0.0

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
