# Image Details Extension

A powerful VS Code extension that displays comprehensive image metadata in a beautiful, interactive side panel.

![VS Code Version](https://img.shields.io/badge/VS%20Code-1.85.0%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## ✨ Features

### 📊 Comprehensive Metadata Display

- **Basic Information**:
  - File name and full path
  - Dimensions (width × height in pixels)
  - Image format and file extension
  - File size (auto-formatted: Bytes, KB, MB, GB)
  - Creation and modification timestamps

### 📷 EXIF Data Support

Complete EXIF metadata extraction for photos (when available):

- **Camera Information**:
  - Camera make and model
  - Lens information
- **Photo Settings**:
  - ISO sensitivity
  - Aperture (f-stop)
  - Shutter speed (exposure time)
  - Focal length
- **Additional Data**:
  - Date and time taken
  - GPS location (latitude, longitude)
  - Image orientation
  - Color space information
  - Software/editor used

### 🎨 Color & Technical Information

- **Transparency Detection**: Automatically detects if the image format supports transparency
- **Color Depth**: Shows bit depth and color information based on format
- **DPI/PPI Information**: Displays resolution metadata (dots per inch / pixels per inch) when available in EXIF data

### 🔍 Advanced Zoom Controls

Multiple ways to zoom and inspect images:

- **Zoom Buttons**: Visual controls for zoom in (+), zoom out (-), and reset
- **Fit to Screen**: Automatically adjusts image to fit the viewport
- **Mouse Wheel Zoom**: Hold `Ctrl/Cmd` and scroll to zoom smoothly
- **Click to Zoom**: Click anywhere on the image to toggle 2× zoom
- **Keyboard Shortcuts**:
  - `+` or `=` → Zoom In
  - `-` or `_` → Zoom Out
  - `0` → Reset to 100%
- **Smooth Transitions**: Animated zoom with centered focal point

### 🌍 Internationalization (i18n)

- **Multi-language Support**:
  - 🇺🇸 English (default)
  - 🇧🇷 Português (Brasil)
- **Automatic Detection**: Uses your VS Code language settings
- **Easy to Extend**: Add your own language (see [I18N.md](I18N.md))

### 🎯 Enhanced User Experience

- **Resizable Sidebar**: Drag the left edge to resize metadata panel (250-600px)
- **Sticky Panel**: Metadata stays visible while scrolling through large images
- **Copy to Clipboard**: Click any metadata value to copy it instantly
- **Visual Feedback**: Animated notification when copying values
- **Context Menu Integration**: Right-click images in Explorer → "Open with Image Details Viewer"
- **Error Handling**: User-friendly error pages for loading failures
- **Dark/Light Theme**: Fully responsive to VS Code theme settings
- **Icons**: Visual icons for each metadata type for better scannability

### 🖼️ Supported Image Formats

Works with all common image formats:

- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- WebP (`.webp`)
- BMP (`.bmp`)
- SVG (`.svg`)
- ICO (`.ico`)

## 📸 Usage

### Quick Start

1. **Open any image file** in VS Code (supports PNG, JPG, GIF, WebP, BMP, SVG, ICO)
2. The extension **automatically activates** and displays the Image Details Viewer
3. View comprehensive metadata in the **resizable sidebar** on the right
4. **Click any metadata value** to instantly copy it to your clipboard
5. **Use zoom controls** to inspect images in detail

### Interacting with Images

#### Zoom Controls

- **Buttons**: Use the visual `+`, `-`, `⟲`, and `⊡` buttons in the toolbar
- **Keyboard**: Press `+` to zoom in, `-` to zoom out, `0` to reset
- **Mouse Wheel**: Hold `Ctrl` (Windows/Linux) or `Cmd` (Mac) and scroll
- **Click**: Click anywhere on the image to toggle 2× zoom
- **Fit to Screen**: Click the fit button to auto-adjust image size

#### Metadata Panel

- **Resize**: Drag the left edge of the panel to adjust width (250-600px)
- **Copy Values**: Click any metadata value to copy it to clipboard
- **Scroll**: Panel stays sticky on the right while scrolling large images

### Alternative Ways to Open

1. **Context Menu**: Right-click any image file in Explorer → **"Open with Image Details Viewer"**
2. **Command Palette**: Press `Ctrl+Shift+P` / `Cmd+Shift+P` → Type "Reopen with" → Select "Image Details Viewer"
3. **Default Viewer**: The extension registers as the default viewer for supported image formats

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
