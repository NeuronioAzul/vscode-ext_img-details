# Image Details Extension

A VS Code extension that displays detailed image metadata in a side panel.
- Adds a side panel to show image details
- Allows copying metadata values to clipboard with a click

## Features

- Display image metadata including:
  - File name
  - Dimensions (width x height)
  - Image format
  - File size
  - Full file path
  - Creation and modification dates
- **EXIF Data Support** (when available):
  - Camera information (make, model)
  - Photo settings (ISO, aperture, shutter speed, focal length)
  - Date taken
  - GPS location data (latitude, longitude)
  - Orientation, color space, and software used
- **Color Information**:
  - Transparency support detection
  - Color depth information
- **Internationalization (i18n)**:
  - Full support for English and Brazilian Portuguese
  - Automatically detects VS Code language settings
- **Enhanced UX**:
  - Resizable metadata panel (drag the left edge)
  - Sticky sidebar that stays visible while scrolling
  - **Image Zoom Controls**:
    - Zoom in/out with + and - buttons
    - Mouse wheel zoom (Ctrl/Cmd + Scroll)
    - Click image to toggle 2x zoom
    - Keyboard shortcuts (+, -, 0)
    - Fit to screen button
  - Click on any metadata value to copy it to clipboard
  - Visual feedback when copying values
- Right-click context menu option to open images with the viewer
- Works with common image formats: PNG, JPG, JPEG, GIF, BMP, WebP, SVG, ICO

## Usage

1. Open any supported image file in VS Code
2. Click on the image file to open it in the editor
3. View the image with metadata in the side panel
4. Click on any metadata value to copy it to your clipboard

## Development

### Installation

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Debug

Press `F5` to open a new Extension Development Host window with the extension loaded.

## Requirements

- VS Code version 1.85.0 or higher

## License

MIT
