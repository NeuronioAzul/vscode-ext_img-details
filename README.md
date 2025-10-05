# Image Details Extension

A powerful VS Code extension that displays comprehensive image metadata in a beautiful, interactive side panel.

![VS Code Version](https://img.shields.io/badge/VS%20Code-1.85.0%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## ✨ Features

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

## 📸 Usage

1. **Open an image file** in VS Code (PNG, JPG, GIF, WebP, BMP, SVG, ICO)
2. The extension automatically opens with the **Image Details Viewer**
3. View comprehensive metadata in the **sticky sidebar on the right**
4. **Click any metadata value** to copy it to your clipboard
5. **Use zoom controls** to inspect images in detail

### Keyboard Shortcuts

- `+` or `=` - Zoom In
- `-` or `_` - Zoom Out
- `0` - Reset Zoom to 100%
- `Ctrl/Cmd + Scroll` - Zoom with mouse wheel

### Context Menu

Right-click any image file in the Explorer and select **"Open with Image Details Viewer"** to open it with this extension.

## 🎨 Screenshots

<!-- TODO: Add screenshots here -->

## 🚀 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Image Details"
4. Click Install

### From Source

```bash
git clone https://github.com/NeuronioAzul/vscode-ext_img-details.git
cd vscode-ext_img-details
npm install
npm run compile
```

Then press `F5` to run in development mode.

## ⚙️ Configuration

Currently, the extension works out of the box with no configuration needed. Configuration options for customization are planned for future releases.

## 🌍 Supported Languages

- 🇺🇸 **English** - Default
- 🇧🇷 **Português (Brasil)** - Brazilian Portuguese

The extension automatically detects your VS Code language setting. Want to add your language? See [CONTRIBUTING.md](CONTRIBUTING.md)!

## 📋 Supported Image Formats

- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- WebP (`.webp`)
- BMP (`.bmp`)
- SVG (`.svg`)
- ICO (`.ico`)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Reporting bugs
- Suggesting features
- Adding translations
- Submitting pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

None at the moment. If you find a bug, please [report it](../../issues/new)!

## 🗺️ Roadmap

See [TODO.md](TODO.md) for planned features and improvements.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed version history.

## 💬 Feedback

Have feedback or suggestions? We'd love to hear from you!

- [Open an issue](../../issues/new)
- [Start a discussion](../../discussions) (if available)
- Contribute directly via pull request

## 🙏 Acknowledgments

- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- Image size detection using [image-size](https://www.npmjs.com/package/image-size)
- EXIF data extraction using [exifreader](https://www.npmjs.com/package/exifreader)

---

**Made with ❤️ by [NeuronioAzul](https://github.com/NeuronioAzul)**

**Enjoy the extension? Give it a ⭐ on GitHub!**
