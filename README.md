# Image Details Extension

A VS Code extension that displays detailed image metadata in a side panel with click-to-copy functionality.

## Features

- Display image metadata including:
  - File name
  - Dimensions (width x height)
  - Image format
  - File size
  - Full file path
  - Creation and modification dates
- Click on any metadata value to copy it to clipboard
- Works with common image formats: PNG, JPG, JPEG, GIF, BMP, WebP, SVG, ICO

## Usage

1. Open any supported image file in VS Code
2. Right-click on the image file in the explorer
3. Select "Reopen Editor With..." → "Image Details Viewer"
4. View the image with metadata in the side panel
5. Click on any metadata value to copy it to your clipboard

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
