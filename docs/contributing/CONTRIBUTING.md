# Contributing to Image Details Extension

Thank you for your interest in contributing to the Image Details extension! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- **Report bugs**: Found a bug? [Open an issue](../../issues/new)
- **Suggest features**: Have an idea? [Create a feature request](../../issues/new)
- **Translate**: Add support for new languages
- **Code**: Fix bugs or implement features
- **Documentation**: Improve docs, add examples

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- VS Code (v1.85.0 or higher)
- Git

### Setup Development Environment

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR-USERNAME/vscode-ext_img-details.git
   cd vscode-ext_img-details
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Watch Mode**

   ```bash
   npm run watch
   ```

4. **Debug the Extension**
   - Press `F5` in VS Code
   - This opens a new Extension Development Host window
   - Test your changes in the new window

## 📝 Development Guidelines

### Code Style

- Use TypeScript
- Follow existing code patterns
- Use meaningful variable/function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Use clear, descriptive commit messages:

```text
feat: add zoom controls to image viewer
fix: resolve EXIF data parsing error
docs: update README with new features
style: improve metadata panel styling
refactor: simplify color info extraction
test: add unit tests for metadata extraction
```

Prefixes:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting (no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Testing

Before submitting a PR:

1. **Manual Testing**
   - Test with different image formats (PNG, JPG, GIF, WebP, etc.)
   - Test with images that have EXIF data
   - Test with images that don't have EXIF data
   - Test zoom functionality
   - Test resize functionality
   - Test copy-to-clipboard
   - Test both light and dark themes

2. **Check for Errors**
   - No TypeScript compilation errors
   - No runtime errors in Developer Tools console
   - Extension activates correctly

3. **Test in Both Languages**
   - Test in English (`en`)
   - Test in Portuguese (`pt-br`)

## 🌐 Adding Translations

To add support for a new language:

1. **Edit** `src/imageDetailsEditor.ts`
2. **Find** the `translations` object
3. **Add** your language following the existing pattern:

   ```typescript
   'your-lang-code': {
      imageDetails: 'Your Translation',
      fileName: 'Your Translation',
      // ... all other keys
   }
   ```

4. **Update** `I18N.md` with the new language
5. **Test** by changing VS Code language setting
6. **Submit** a PR with your translation

See [I18N.md](I18N.md) for the complete list of translation keys.

## 🐛 Reporting Bugs

When reporting a bug, please include:

- **VS Code version**: Help → About
- **Extension version**: From Extensions panel
- **Operating System**: Windows/macOS/Linux
- **Steps to reproduce**: Clear step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Error messages**: From Developer Tools console

### Bug Report Template

```markdown
**Environment:**
- VS Code Version: 
- Extension Version: 
- OS: 

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Screenshots/Error Messages:**

```

## 💡 Suggesting Features

When suggesting a feature:

- Check existing issues to avoid duplicates
- Explain the use case
- Describe the desired behavior
- Consider providing mockups or examples

### Feature Request Template

```markdown
**Feature Description:**


**Use Case:**


**Proposed Solution:**


**Alternatives Considered:**


**Additional Context:**

```

## 🔧 Pull Request Process

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing patterns
   - Test thoroughly

3. **Update Documentation**
   - Update README.md if needed
   - Update CHANGELOG.md with your changes
   - Update I18N.md if adding translations

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

### PR Checklist

- [ ] Code compiles without errors
- [ ] Tested manually with various image types
- [ ] No console errors
- [ ] Updated documentation
- [ ] Updated CHANGELOG.md
- [ ] Translations work correctly (if applicable)
- [ ] Follows code style guidelines
- [ ] Clear commit messages

## 📚 Project Structure

```text
vscode-ext_img-details/
├── src/
│   ├── extension.ts          # Extension entry point
│   └── imageDetailsEditor.ts # Main editor implementation
├── test-images/               # Test images
├── out/                       # Compiled JavaScript (generated)
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Main documentation
├── CHANGELOG.md              # Version history
├── TODO.md                   # Development roadmap
├── I18N.md                   # Internationalization guide
├── CONTRIBUTING.md           # This file
└── LICENSE                   # MIT License
```

## 🎯 Current Priorities

See [TODO.md](TODO.md) for the current development roadmap and priorities.

## ❓ Questions?

If you have questions:

- Check existing [Issues](../../issues)
- Read the [documentation](README.md)
- Open a new [Discussion](../../discussions) (if available)
- Create an [Issue](../../issues/new) for questions

## 📜 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to learn and improve together.

## 🙏 Thank You

Your contributions help make this extension better for everyone. We appreciate your time and effort!

---

## **Happy Coding! 🚀**
