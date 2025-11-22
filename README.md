# Image Details

A powerful VS Code extension that displays comprehensive image metadata, EXIF data, and provides tools to clean metadata from images for privacy.

[![Version](https://vsmarketplacebadges.dev/version-short/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![Installs](https://vsmarketplacebadges.dev/installs/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![Downloads](https://vsmarketplacebadges.dev/downloads/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![Rating](https://vsmarketplacebadges.dev/rating/NeuronioAzul.image-details.svg)](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Follow on X](https://img.shields.io/twitter/follow/NeuronioAzul?style=social)](https://x.com/NeuronioAzul)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-orange?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/neuronioazul)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue?logo=paypal)](https://www.paypal.com/donate/?hosted_button_id=QNEHQ5LAF64G2)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor-EA4AAA?logo=github)](https://github.com/sponsors/NeuronioAzul)

## Screenshots

![Image Details Viewer Main Interface](https://raw.githubusercontent.com/NeuronioAzul/vscode-ext_img-details/main/media/screenshots/screenshot-main-v0-2-0.png)

Demonstration of copying metadata values to clipboard:

![Copy Metadata Demo](https://raw.githubusercontent.com/NeuronioAzul/vscode-ext_img-details/main/media/demo/screen-record-01-v0-2-0.gif)

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

## Usage

### Quick Start

1. **Open any image file** in VS Code (supports PNG, JPG, GIF, WebP, BMP, SVG, ICO)
2. The extension **automatically activates** and displays the Image Details Viewer
3. View comprehensive metadata in the **resizable sidebar** on the right
4. **Click any metadata value** to instantly copy it to your clipboard
5. **Use zoom controls** to inspect images in detail

### Interacting with Images

#### Advanced Zoom Controls

- **Buttons**: Use the visual `+`, `-`, `⟲`, and `⊡` buttons in the toolbar
- **Keyboard**: Press `+` to zoom in, `-` to zoom out, `0` to reset
- **Mouse Wheel**: Hold `Ctrl` (Windows/Linux) or `Cmd` (Mac) and scroll
- **Click**: Click anywhere on the image to toggle 2× zoom
- **Fit to Screen**: Click the fit button to auto-adjust image size

### EXIF Data Management

- **Remove EXIF Metadata**: One-click button to strip all EXIF data from images
- **Automatic Backup**: Creates a backup file (`_backup`) before removing metadata
- **Format Support**: Works with JPEG/JPG and PNG images
- **Smart Detection**: Button only appears when image contains EXIF data
- **Safe Operation**: Confirmation dialog prevents accidental removal
- **Error Recovery**: Automatically restores from backup if operation fails
- **Real-time Update**: Interface refreshes automatically after metadata removal

### Internationalization (i18n)

### Internationalization

- English and Portuguese (Brasil)
- Auto-detects VS Code language
- Extensible ([I18N Guide](docs/contributing/I18N.md))

## Installation

**VS Code Marketplace:**

1. Extensions (`Ctrl+Shift+X`)
2. Search "Image Details"
3. Install

**Alternative:** Right-click image → "Open with Image Details Viewer"

## Configuration

- `imageDetails.defaultDisplayMode`: Accordion or list mode
- `imageDetails.defaultSectionStates`: Default expanded sections
- `imageDetails.rememberSectionStates`: Remember state between sessions

## Development & Publishing

### For Developers

```bash
# Clone repository
git clone https://github.com/NeuronioAzul/vscode-ext_img-details.git
cd vscode-ext_img-details

# Install dependencies
npm install

# Compile
npm run compile

# Watch mode (development)
npm run watch

# Test in VS Code
# Press F5 to open Extension Development Host
```

### For Maintainers

To publish a new version, use the interactive publishing script:

```bash
./publish.sh
```

The script will guide you through:

- Version selection (patch/minor/major)
- Git tag creation and push
- GitHub release creation
- VS Code Marketplace publishing

For detailed instructions, see [Publishing Guide](docs/PUBLISHING.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Bug reports
- Feature requests
- Translation contributions
- Pull requests

## Links

- [Changelog](CHANGELOG.md)
- [Documentation](docs/README.md)
- [Publishing Guide](docs/PUBLISHING.md) - For maintainers
- [Issues](https://github.com/NeuronioAzul/vscode-ext_img-details/issues)
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)

## License

MIT - See [LICENSE](LICENSE)

## Support

If you find this extension useful:

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-blue.png)](https://www.buymeacoffee.com/neuronioazul)
[![PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/donate/?hosted_button_id=QNEHQ5LAF64G2)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?logo=github)](https://github.com/sponsors/NeuronioAzul)

---

**[NeuronioAzul](https://github.com/NeuronioAzul)** | Give it a ⭐ on [GitHub](https://github.com/NeuronioAzul/vscode-ext_img-details)
