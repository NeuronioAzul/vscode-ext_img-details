# Contributing to Image Details

Thank you for your interest in contributing to the Image Details VS Code extension!

## 🌿 Development Branch

**All development happens in the `dev` branch.**

The repository uses a two-branch structure:

- **`main`**: Production-ready code (releases only)
- **`dev`**: Development, documentation, and all development files

## 🚀 Getting Started

1. **Clone the dev branch:**

   ```bash
   git clone -b dev https://github.com/NeuronioAzul/vscode-ext_img-details.git
   cd vscode-ext_img-details
   npm install
   ```

2. **Run the extension:**

   ```bash
   npm run watch  # Start watch mode
   # Press F5 in VS Code to launch Extension Development Host
   ```

3. **Make your changes:**
   - Edit files in `src/`
   - Test thoroughly in Extension Development Host
   - Update `CHANGELOG.md` if needed
   - Follow the existing code style

4. **Submit a pull request:**
   - Create a new branch from `dev`
   - Make your changes
   - Submit PR to the `dev` branch (NOT main)

## 📚 Documentation

All development documentation is available in the `dev` branch under `.dev/docs/`:

- Contributing guidelines
- Internationalization guide
- Development and refactoring docs
- Publishing guide

## 🐛 Bug Reports

Please open an issue on GitHub with:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- VS Code version and OS
- Extension version

## 💡 Feature Requests

We welcome feature suggestions! Please open an issue with:

- Clear description of the feature
- Use case and benefits
- Any relevant examples or mockups

## 📝 Code Style

- Follow existing TypeScript conventions
- Use meaningful variable/function names
- Add comments for complex logic
- Update translations for UI changes

## 🔄 Pull Request Process

1. Fork the repository and create your branch from `dev`
2. Make your changes and test thoroughly
3. Update documentation if needed
4. Submit PR to `dev` branch with clear description
5. Wait for review and address any feedback

## 📧 Questions?

Feel free to open an issue for questions or reach out to the maintainers.

---

Thank you for helping improve Image Details! Your contributions are greatly appreciated. 👍🏼
