# Publishing Guide

This guide explains how to publish new versions of the Image Details extension.

## Prerequisites

Before publishing, ensure you have:

1. **Git** - For version control and tagging
2. **Node.js & npm** - For building and packaging
3. **GitHub CLI (optional)** - For automated GitHub releases
   ```bash
   # Install GitHub CLI (optional)
   # macOS
   brew install gh
   
   # Linux
   sudo apt install gh
   
   # Authenticate
   gh auth login
   ```
4. **Personal Access Token (PAT)** - For VS Code Marketplace publishing
   - Get it from: https://dev.azure.com/
   - Required scopes: `Marketplace (Publish)`

## Quick Start

### Interactive Publishing (Recommended)

The easiest way to publish is using the interactive script:

```bash
./publish.sh
```

This will guide you through:
1. Version selection (with intelligent suggestions)
2. Release message (auto-extracted from CHANGELOG)
3. Git tag creation and push
4. GitHub release creation
5. VS Code Marketplace publishing

### Non-Interactive Publishing

You can also specify all options via command-line:

```bash
./publish.sh --version 1.0.4 --pat YOUR_TOKEN --message "Bug fixes and improvements"
```

### Dry Run (Testing)

Test the publishing process without making any changes:

```bash
./publish.sh --dry-run
```

## Publishing Workflow

The script automates the following steps:

### 1. Pre-flight Checks
- Verifies git working directory is clean
- Checks git remote is configured
- Validates version format

### 2. Version Selection
You'll be presented with suggestions based on semantic versioning:
- **Patch** (e.g., 1.0.3 → 1.0.4) - Bug fixes, minor changes
- **Minor** (e.g., 1.0.3 → 1.1.0) - New features, backward compatible
- **Major** (e.g., 1.0.3 → 2.0.0) - Breaking changes
- **Custom** - Enter your own version

### 3. Release Message
The script will:
1. Try to extract release notes from CHANGELOG.md
2. Offer to use the extracted content
3. Allow you to write custom message if needed

### 4. Git Tagging
Creates an annotated git tag:
```bash
git tag -a v1.0.4 -m "Release message"
git push origin v1.0.4
```

### 5. GitHub Release
If GitHub CLI is available and authenticated:
- Creates a new release on GitHub
- Attaches the release notes
- Marks as latest release

### 6. Marketplace Publishing
Publishes to VS Code Marketplace:
- Packages the extension
- Publishes using your PAT
- Updates marketplace listing

## Command-Line Options

```bash
./publish.sh [options]

Options:
  --version <version>   Specify version (e.g., 1.0.4)
  --pat <token>         Personal Access Token for marketplace
  --message <text>      Release message
  --dry-run             Test without making changes
  -h, --help            Show help
```

## Examples

### Example 1: Fully Interactive
```bash
./publish.sh
```

### Example 2: Specify Version Only
```bash
./publish.sh --version 1.0.4
# Will prompt for PAT and extract message from CHANGELOG
```

### Example 3: Complete Non-Interactive
```bash
./publish.sh \
  --version 1.0.4 \
  --pat "your-token-here" \
  --message "## Bug Fixes
- Fixed issue #123
- Updated dependencies"
```

### Example 4: Test Run
```bash
./publish.sh --dry-run --version 1.0.4
```

## Best Practices

### Before Publishing

1. **Update CHANGELOG.md**
   ```markdown
   ## [1.0.4] - 2025-11-20
   
   ### Fixed
   - Bug fix description
   
   ### Added
   - New feature description
   ```

2. **Update package.json version** (if not using the script)
   ```json
   {
     "version": "1.0.4"
   }
   ```

3. **Commit and push all changes**
   ```bash
   git add .
   git commit -m "Prepare v1.0.4 release"
   git push origin main
   ```

4. **Test the extension locally**
   ```bash
   npm run compile
   # Test in VS Code
   ```

### During Publishing

1. Use the script's suggestions for version numbers
2. Review the summary before confirming
3. Keep release messages clear and concise
4. Follow semantic versioning principles

### After Publishing

1. Verify the GitHub release: https://github.com/NeuronioAzul/vscode-ext_img-details/releases
2. Check the marketplace: https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details
3. Monitor for user feedback and issues

## Troubleshooting

### Git Tag Already Exists
```bash
# Delete local tag
git tag -d v1.0.4

# Delete remote tag
git push origin :refs/tags/v1.0.4

# Re-run the script
./publish.sh
```

### GitHub CLI Not Authenticated
```bash
gh auth login
# Follow the prompts
```

### VSCE Not Found
The script will automatically install it, or you can manually:
```bash
npm install -g @vscode/vsce
```

### Invalid PAT
Ensure your PAT has the correct scopes:
1. Go to https://dev.azure.com/
2. Create new token
3. Select scope: `Marketplace (Publish)`
4. Copy and use the token

### Publishing Fails
1. Check your internet connection
2. Verify PAT is valid and not expired
3. Ensure package.json has correct publisher name
4. Check npm/vsce are up to date

## Manual Publishing (Without Script)

If you prefer to publish manually:

```bash
# 1. Update version in package.json
vim package.json

# 2. Build and test
npm run compile

# 3. Create git tag
git tag -a v1.0.4 -m "Release v1.0.4"
git push origin v1.0.4

# 4. Create GitHub release (optional)
gh release create v1.0.4 --title "Release v1.0.4" --notes "Release notes here"

# 5. Publish to marketplace
vsce publish -p YOUR_PAT
```

## Semantic Versioning Guide

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) - Incompatible API changes
- **MINOR** (1.X.0) - Add functionality (backward compatible)
- **PATCH** (1.0.X) - Bug fixes (backward compatible)

Examples:
- `1.0.3 → 1.0.4` - Fixed a bug
- `1.0.3 → 1.1.0` - Added new EXIF fields
- `1.0.3 → 2.0.0` - Changed API or removed features

## Security Notes

### Protecting Your PAT

1. **Never commit PAT to git**
2. **Use environment variables** (optional):
   ```bash
   export VSCE_PAT="your-token"
   ./publish.sh --version 1.0.4
   # Script will use $VSCE_PAT if --pat not provided
   ```
3. **Regenerate if exposed**
4. **Use minimal required scopes**

### Token Storage

For frequent publishing, consider:
```bash
# Store in .env (add to .gitignore!)
echo "VSCE_PAT=your-token" >> .env

# Or use system keychain
# macOS
security add-generic-password -a "$USER" -s vsce-pat -w "your-token"
```

## Getting Help

If you encounter issues:

1. Check this guide
2. Run with `--dry-run` to test
3. Check the [troubleshooting section](#troubleshooting)
4. Open an issue: https://github.com/NeuronioAzul/vscode-ext_img-details/issues

## Changelog Format

The script auto-extracts release notes from CHANGELOG.md. Use this format:

```markdown
## [1.0.4] - 2025-11-20

### Added
- New feature description

### Changed
- Changed behavior description

### Fixed
- Bug fix description

### Removed
- Removed feature description
```

The script will extract everything between `## [1.0.4]` and the next `## [` header.

