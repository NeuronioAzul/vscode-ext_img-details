# Publishing Guide for VS Code Marketplace

This guide explains how to publish the Image Details extension to the Visual Studio Code Marketplace.

## Prerequisites

Before publishing, ensure you have:

- [x] A Microsoft account (for Azure DevOps)
- [x] Publisher account created on VS Code Marketplace
- [x] Personal Access Token (PAT) from Azure DevOps
- [x] `@vscode/vsce` installed globally: `npm install -g @vscode/vsce`

## Step 1: Create Publisher Account

1. Visit [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Create a new publisher:
   - **Publisher ID**: `NeuronioAzul` (must match `package.json`)
   - **Display Name**: Your display name
   - **Description**: Brief description of your publisher profile

## Step 2: Generate Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on your profile icon → **Personal access tokens**
3. Click **+ New Token**
4. Configure the token:
   - **Name**: `vsce-publish-token` (or any descriptive name)
   - **Organization**: All accessible organizations
   - **Expiration**: 90 days (or custom)
   - **Scopes**: 
     - Select **Custom defined**
     - Check **Marketplace** → **Manage**
5. Click **Create**
6. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## Step 3: Login to vsce

```bash
# Login using your publisher name and PAT
vsce login NeuronioAzul

# When prompted, paste your Personal Access Token
```

## Step 4: Pre-Publication Checklist

Before publishing, verify:

- [x] Version updated in `package.json` (currently 0.3.0)
- [x] `CHANGELOG.md` updated with new version changes
- [x] `README.md` has screenshots and complete documentation
- [x] All dependencies listed in `package.json`
- [x] Extension tested locally from VSIX
- [x] No compilation errors (`npm run compile`)
- [x] Icon file exists (`icon.png` - 128x128px)
- [x] License file exists (`LICENSE`)
- [x] Repository URL correct in `package.json`
- [x] `.vscodeignore` configured properly

## Step 5: Publish to Marketplace

### Option A: Publish Current Version (0.3.0)

```bash
cd /path/to/vscode-ext_img-details
vsce publish
```

This will:
1. Run `npm run vscode:prepublish` (compiles TypeScript)
2. Package the extension
3. Upload to marketplace
4. Extension goes live within minutes

### Option B: Publish with Version Bump

```bash
# Patch version (0.3.0 → 0.3.1)
vsce publish patch

# Minor version (0.3.0 → 0.4.0)
vsce publish minor

# Major version (0.3.0 → 1.0.0)
vsce publish major

# Specific version
vsce publish 0.3.0
```

### Option C: Publish Pre-Release

```bash
# For beta/preview versions
vsce publish --pre-release
```

## Step 6: Verify Publication

After publishing:

1. Visit your extension page:
   - [https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details](https://marketplace.visualstudio.com/items?itemName=NeuronioAzul.image-details)

2. Verify the following:
   - Version number is correct (0.3.0)
   - Screenshots appear in the Details tab
   - CHANGELOG appears in the Changelog tab
   - Dependencies are listed
   - Badges display correctly
   - Resources links work (Repository, Issues, License)

3. Test installation from marketplace:
   ```bash
   code --install-extension NeuronioAzul.image-details
   ```

## Step 7: Create Git Tag

After successful publication, tag the release:

```bash
git tag -a v0.3.0 -m "Release v0.3.0 - Screenshots and marketplace documentation"
git push origin v0.3.0
```

## Step 8: Create GitHub Release

1. Go to [GitHub Releases](https://github.com/NeuronioAzul/vscode-ext_img-details/releases)
2. Click **Draft a new release**
3. Configure release:
   - **Tag**: `v0.3.0` (select the tag you just pushed)
   - **Title**: `v0.3.0 - Screenshots and Marketplace Documentation`
   - **Description**: Copy from `CHANGELOG.md`
4. Attach the VSIX file: `image-details-0.3.0.vsix`
5. Click **Publish release**

## Troubleshooting

### Error: "Publisher not found"

Make sure the publisher ID in `package.json` matches your marketplace publisher:
```json
"publisher": "NeuronioAzul"
```

### Error: "Missing repository"

Use the `--allow-missing-repository` flag:
```bash
vsce publish --allow-missing-repository
```

Or ensure `package.json` has:
```json
"repository": {
  "type": "git",
  "url": "https://github.com/NeuronioAzul/vscode-ext_img-details"
}
```

### Error: "Extension validation failed"

Run validation locally:
```bash
vsce package --allow-missing-repository
```

Check the output for specific validation errors.

### Extension not appearing in search

- Wait 5-10 minutes for indexing
- Check that categories and keywords are set in `package.json`
- Verify extension is not marked as preview-only

## Updating an Existing Extension

To publish an update:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Run `vsce publish`
5. Create git tag
6. Create GitHub release

## Unpublishing

**WARNING**: Unpublishing is permanent and cannot be undone!

```bash
# Unpublish entire extension
vsce unpublish NeuronioAzul.image-details

# Unpublish specific version
vsce unpublish NeuronioAzul.image-details@0.3.0
```

## Marketplace Statistics

View download statistics and ratings:
- [Publisher Dashboard](https://marketplace.visualstudio.com/manage/publishers/NeuronioAzul)

## Additional Resources

- [VS Code Publishing Extensions Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Marketplace Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [vsce CLI Reference](https://github.com/microsoft/vscode-vsce)
- [Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)

---

## Quick Reference Commands

```bash
# Login (first time only)
vsce login NeuronioAzul

# Package locally for testing
vsce package

# Publish current version
vsce publish

# Publish with version bump
vsce publish patch  # 0.3.0 → 0.3.1
vsce publish minor  # 0.3.0 → 0.4.0
vsce publish major  # 0.3.0 → 1.0.0

# Publish specific version
vsce publish 0.3.0

# List files included in package
vsce ls

# Show package contents as tree
vsce ls --tree

# Validate without publishing
vsce package --allow-missing-repository
```

---

**Current Version**: 0.3.0  
**Package Location**: `/path/to/vscode-ext_img-details/image-details-0.3.0.vsix`  
**Last Updated**: November 14, 2025
