# Development Files

This directory contains files used during development that are not needed in production.

## 📁 Structure

- **docs/** - Technical documentation, guides, and contributing info
- **test-images/** - Sample images for testing the extension
- **admin/** - Administrative files (logos, designs, etc.)
- **scripts/** - Build, publish, and automation scripts
- **planning/** - Roadmaps, migration docs, and planning documents

## 🔄 Development Workflow

### Getting Started

1. **Clone the dev branch:**
   ```bash
   git clone -b dev https://github.com/NeuronioAzul/vscode-ext_img-details.git
   cd vscode-ext_img-details
   npm install
   ```

2. **Run in development:**
   ```bash
   npm run watch  # Start watch mode
   # Press F5 to launch Extension Development Host
   ```

3. **Make changes:**
   - Edit files in `src/`
   - Test in Extension Development Host
   - Update CHANGELOG.md
   - Commit to dev branch

### Branch Structure

- **main**: Production-ready code (releases only)
  - Contains only essential files for the extension
  - Receives merges from dev for releases
  
- **dev**: Development and documentation
  - Contains everything (production + development files)
  - All development work happens here

### Release Process

1. **Prepare release in dev:**
   ```bash
   git checkout dev
   # Update version in package.json
   # Update CHANGELOG.md
   npm run compile
   git commit -am "chore: prepare release v1.x.x"
   ```

2. **Merge to main:**
   ```bash
   git checkout main
   git merge dev --no-ff -m "release: v1.x.x"
   git push origin main
   ```

3. **Create tag:**
   ```bash
   git tag v1.x.x
   git push origin v1.x.x
   ```

4. **Publish:**
   ```bash
   cd .dev/scripts
   ./publish.sh
   ```

## 📚 Documentation

- **Contributing Guide**: `.dev/docs/contributing/CONTRIBUTING.md`
- **Internationalization**: `.dev/docs/contributing/I18N.md`
- **Development Guide**: `.dev/docs/development/REFACTORING.md`
- **Publishing Guide**: `.dev/docs/PUBLISH_GUIDE.md`

## 🧪 Testing

Test images are available in `.dev/test-images/` for manual testing of:
- Different image formats (PNG, JPEG, GIF, WebP)
- Various EXIF data scenarios
- Edge cases (corrupted, large files, etc.)

## 🛠️ Scripts

Available in `.dev/scripts/`:
- `publish.sh` - Automated publishing to VS Code Marketplace

## 📋 Planning Documents

Available in `.dev/planning/`:
- Roadmap and feature planning
- Migration status and refactoring summaries
- Phase completion documents

---

**Note**: Files in `.dev/` are NOT included in:
- The published extension package (via `.vscodeignore`)
- The main production branch (kept only in dev)
