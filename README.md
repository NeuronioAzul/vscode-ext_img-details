# Image Details

A powerful VS Code extension that displays comprehensive image metadata, EXIF data, and provides tools to clean metadata from images for privacy.

<div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">

[![Version](https://vsmarketplacebadges.dev/version-short/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![Installs](https://vsmarketplacebadges.dev/installs/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![Downloads](https://vsmarketplacebadges.dev/downloads/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![Rating](https://vsmarketplacebadges.dev/rating/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
  
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-orange?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/neuronioazul)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue?logo=paypal)](https://www.paypal.com/donate/?hosted_button_id=QNEHQ5LAF64G2)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor-EA4AAA?logo=github)](https://github.com/sponsors/NeuronioAzul)
[![Follow on X](https://img.shields.io/twitter/follow/NeuronioAzul?style=social)](https://x.com/NeuronioAzul)

</div>

## Screenshot

![Image Details Viewer Main Interface](https://iili.io/fft5iMJ.png)

## Usage

### Quick Start

1. **Open any image file** in VS Code (supports PNG, JPG, GIF, WebP, BMP, SVG, ICO)
2. The extension **automatically activates** and displays the Image Details Viewer
3. View comprehensive metadata in the **resizable sidebar** on the right
4. **Click any metadata value** to instantly copy it to your clipboard
5. **Use zoom controls** to inspect images in detail
6. **Remove EXIF data** with one click to protect your privacy
7. **Resize** images directly from the viewer with high-quality processing
8. View **metadata in JSON** format for developers and advanced users

### Interacting with Images

#### Advanced Zoom Controls

- **Buttons**: Use the visual `+`, `-`, `⟲`, and `⊡` buttons in the toolbar
- **Keyboard**: Press `Ctrl + +` to zoom in, `Ctrl + -` to zoom out, `Ctrl + 0` to reset
- **Mouse Wheel**: Hold `Ctrl` (Windows/Linux) or `Cmd` (Mac) and scroll
- **Click**: Click anywhere on the image to toggle 2× zoom
- **Fit to Screen**: Click the fit button to auto-adjust image size

### Image Resize Tool

- **Resize Images**: Resize images directly from the viewer with high-quality processing
- **Interactive Modal**: User-friendly dialog with width and height inputs
- **Aspect Ratio Lock**: Checkbox to maintain proportions when resizing
- **Quality Control**: Adjustable quality slider (0-100) for JPEG/WebP compression
- **Automatic Backup**: Creates backup with `-original` suffix before resizing
- **Real-time Preview**: See new dimensions before applying changes
- **Format Support**: Works with JPEG, PNG, and WebP formats
- **Error Recovery**: Automatically restores from backup if operation fails
- **Safe Operation**: Confirmation dialog prevents accidental changes

### EXIF Data Management

- **Remove EXIF Metadata**: One-click button to strip all EXIF data from images
- **Automatic Backup**: Creates a backup file (`_backup`) before removing metadata
- **Remove EXIF Format Supported**: Works with JPEG/JPG and PNG images
- **Smart Detection**: Button only appears when image contains EXIF data
- **Safe Operation**: Confirmation dialog prevents accidental removal
- **Error Recovery**: Automatically restores from backup if operation fails
- **Real-time Update**: Interface refreshes automatically after metadata removal

## 📽️ Demonstrations

Demonstration you can choose to view image metadata in either **Accordion** or **List** mode.:

![Accordion or List mode](https://iili.io/fft5s6v.gif)

Show metadata in JSON format for developers and advanced users:

![metadata in JSON format](https://iili.io/fft5QFR.gif)

Remove EXIF metadata from images with a single click to protect your privacy, while automatically creating a backup of the original image:

![Remove EXIF Metadata](https://iili.io/fft5Zap.gif)

## ✨ Features

### Comprehensive Metadata Display

You can click any metadata value to copy it to clipboard.

- **Basic Informations about the Image**:
  - File name and full path
  - Dimensions (width × height in pixels)
  - Image format and file extension
  - File size (auto-formatted: Bytes, KB, MB, GB)
  - Creation and modification timestamps
  - And more...

- **Color & Technical Information**
  - Transparency support detection
  - Color depth and bit information
  - DPI/PPI resolution data (when available)
  - And more...

- **📷 EXIF Data Support**
  - **Comprehensive metadata for photos** (70+ fields when available):
  - **Image Description**: Photo title and description
  - **Camera Information**:
    - Camera make and model
    - Owner name
  - **Lens Information**:
    - Lens make and model
    - Lens serial number
  - **Photo Settings** (Complete):
    - ISO sensitivity
    - Aperture (f-stop) and values
    - Shutter speed (exposure time) and values
    - Focal length (including 35mm equivalent)
    - Exposure program, mode, and compensation
    - Metering mode
    - Flash settings
    - White balance
    - Components configuration
    - User comments
  - **Date & Time Information**:
    - Original date taken
    - Create and modify dates
  - **GPS Information** (Complete - 30+ fields):
    - GPS version and coordinates (latitude/longitude with references)
    - Altitude with reference
    - Timestamps and date stamps
    - Satellite count and status
    - Measurement mode and DOP
    - Speed and track with references
    - Image direction
    - Map datum (e.g., WGS-84)
    - Destination coordinates and bearing
    - Distance and differential correction
  - **Image Technical Information**:
    - Compression type
    - Orientation
    - Resolution (X/Y and unit)
    - Color space and YCbCr positioning
    - Software used
    - Artist and copyright information
    - EXIF, Flashpix, and Interop versions

- **JSON Metadata Viewer**
  - View all metadata in formatted JSON
  - Easy copy-to-clipboard for entire metadata object
  - Perfect for developers and advanced users

### Supported Image Formats

Works with all common image formats:

- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- WebP (`.webp`)
- BMP (`.bmp`)
- SVG (`.svg`)
- ICO (`.ico`)

### Internationalization (i18n)

- English, Portuguese (Brasil), Japanese (日本語), Spanish (Español), and Chinese Simplified (简体中文)
- Auto-detects VS Code language
- Extensible ([I18N Guide](docs/contributing/I18N.md))

## Installation

**VS Code Marketplace:**

1. Extensions (`Ctrl+Shift+X`)
2. Search "Image Details"
3. Install

**Alternative:** Right-click image → "Open with Image Details Viewer"

## Configuration

> `imageDetails.defaultDisplayMode`: Accordion or list mode (default: accordion) or set in `settings.json`:

```json
{
  "imageDetails.defaultDisplayMode": "list"
}
```

> `imageDetails.defaultSectionStates`: Default expanded sections (default: all collapsed) or set in `settings.json`:

```json
{
  "imageDetails.defaultSectionStates": {
    "basicInfo": true,
    "colorInfo": false,
    "exifData": false,
    "jsonData": false
  }
}
```

> `imageDetails.rememberSectionStates`: Remember state between sessions (default: true) or set in `settings.json`:

```json
{
  "imageDetails.rememberSectionStates": true
}
```

## Contributing 🤝

See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Bug reports
- Feature requests
- Translation contributions
- Pull requests

## Links

- [Changelog](CHANGELOG.md)
- [Documentation](docs/README.md)
- [Issues](https://github.com/NeuronioAzul/vscode-ext_img-details/issues)
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)

## License

MIT - See [LICENSE](LICENSE)

## Support

If you find this extension useful:

<div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">

<a href="https://www.buymeacoffee.com/neuronioazul" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" width="120"></a>

<a href="https://www.paypal.com/donate/?hosted_button_id=QNEHQ5LAF64G2" target="_blank"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" alt="PayPal Donate"></a>

<a href="https://github.com/sponsors/NeuronioAzul" target="_blank"><img src="https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?logo=github" alt="GitHub Sponsors"></a>

</div>

---

**[NeuronioAzul](https://github.com/NeuronioAzul)** | Give it a ⭐ on [GitHub](https://github.com/NeuronioAzul/vscode-ext_img-details)

---
