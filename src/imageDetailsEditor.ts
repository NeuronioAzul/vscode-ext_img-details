/**
 * Image Details Editor Provider
 * Main entry point for the custom image editor
 * 
 * Refactored: 2025-11-25
 * Architecture: Modular design with separation of concerns
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import sizeOf from 'image-size';
import ExifReader from 'exifreader';

// Import types
import { Translations, DisplayMode, SectionStates } from './types';

// Import i18n
import { getTranslations } from './i18n/translations';

// Import utility functions
import { formatFileSize, getColorInfo, calculateBitDepth, extractRelevantExifData } from './utils/metadata';
import { resizeImageSafe } from './utils/imageResize';

// Import HTML template generators
import { getErrorHtml, getHtmlForWebview } from './templates/htmlGenerators';

export class ImageDetailsEditorProvider implements vscode.CustomReadonlyEditorProvider {
    private static readonly viewType = 'imageDetails.viewer';
    private static readonly stateKey = 'imageDetails.sectionStates';
    private static readonly displayModeKey = 'imageDetails.displayMode';

    constructor(private readonly context: vscode.ExtensionContext) {}

    /**
     * Get translations for current VS Code locale
     * Migrated to use centralized i18n module
     */
    private getTranslations(): Translations {
        return getTranslations(vscode.env.language);
    }

    private getSectionStates(): SectionStates {
        const rememberStates = vscode.workspace.getConfiguration('imageDetails').get<boolean>('rememberSectionStates', true);
        
        if (rememberStates) {
            const saved = this.context.globalState.get<{ [key: string]: boolean }>(ImageDetailsEditorProvider.stateKey);
            if (saved) {
                return saved;
            }
        }
        
        // Use default configuration from VS Code settings
        const defaultStates = vscode.workspace.getConfiguration('imageDetails').get<{ [key: string]: boolean }>('defaultSectionStates', {
            'basic-info': true,
            'color-info': false,
            'exif-data': false
        });
        
        // Convert camelCase to kebab-case for consistency
        return {
            'basic-info': defaultStates['basicInfo'] !== undefined ? defaultStates['basicInfo'] : true,
            'color-info': defaultStates['colorInfo'] !== undefined ? defaultStates['colorInfo'] : false,
            'exif-data': defaultStates['exifData'] !== undefined ? defaultStates['exifData'] : false
        };
    }

    private saveSectionState(sectionId: string, isExpanded: boolean): void {
        const rememberStates = vscode.workspace.getConfiguration('imageDetails').get<boolean>('rememberSectionStates', true);
        
        if (rememberStates) {
            const currentStates = this.getSectionStates();
            currentStates[sectionId] = isExpanded;
            this.context.globalState.update(ImageDetailsEditorProvider.stateKey, currentStates);
        }
    }

    private getDisplayMode(): DisplayMode {
        // First check user's saved preference
        const saved = this.context.globalState.get<DisplayMode>(ImageDetailsEditorProvider.displayModeKey);
        if (saved) {
            return saved;
        }
        
        // Fall back to configuration setting
        return vscode.workspace.getConfiguration('imageDetails').get<DisplayMode>('defaultDisplayMode', 'accordion');
    }

    private setDisplayMode(mode: DisplayMode): void {
        this.context.globalState.update(ImageDetailsEditorProvider.displayModeKey, mode);
    }

    async openCustomDocument(
        uri: vscode.Uri,
        openContext: vscode.CustomDocumentOpenContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return {
            uri,
            dispose: () => {}
        };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        try {
            // Set up the webview
            webviewPanel.webview.options = {
                enableScripts: true
            };

            // Get image metadata
            const metadata = await this.getImageMetadata(document.uri);

            // Set the webview HTML content
            webviewPanel.webview.html = getHtmlForWebview(
                webviewPanel.webview,
                document.uri,
                metadata,
                this.getTranslations(),
                this.getSectionStates(),
                this.getDisplayMode()
            );

            
            // Handle messages from the webview
            webviewPanel.webview.onDidReceiveMessage(
                async (message: any) => {
                    switch (message.command) {
                        case 'copy':
                            vscode.env.clipboard.writeText(message.text);
                            // Visual feedback is handled in the webview
                            break;
                        case 'toggleSection':
                            this.saveSectionState(message.sectionId, message.isExpanded);
                            break;
                        case 'setDisplayMode':
                            this.setDisplayMode(message.mode);
                            // Refresh the webview with new mode
                            webviewPanel.webview.html = getHtmlForWebview(
                                webviewPanel.webview,
                                document.uri,
                                metadata,
                                this.getTranslations(),
                                this.getSectionStates(),
                                this.getDisplayMode()
                            );
                            break;
                        case 'removeExif':
                            try {
                                // Show confirmation dialog
                                const confirmed = await vscode.window.showWarningMessage(
                                    this.getTranslations().removeExifConfirm,
                                    { modal: true },
                                    'Yes',
                                    'No'
                                );
                                
                                if (confirmed !== 'Yes') {
                                    // User cancelled - send message to reset button
                                    webviewPanel.webview.postMessage({
                                        command: 'resetRemoveExifButton'
                                    });
                                    return;
                                }
                                
                                await this.removeExifData(document.uri);
                                vscode.window.showInformationMessage(this.getTranslations().removeExifSuccess);
                                // Reload metadata and refresh webview
                                const newMetadata = await this.getImageMetadata(document.uri);
                                webviewPanel.webview.html = getHtmlForWebview(
                                    webviewPanel.webview,
                                    document.uri,
                                    newMetadata,
                                    this.getTranslations(),
                                    this.getSectionStates(),
                                    this.getDisplayMode()
                                );
                            } catch (error) {
                                const errorMsg = error instanceof Error ? error.message : String(error);
                                vscode.window.showErrorMessage(`${this.getTranslations().removeExifError}: ${errorMsg}`);
                                // Send message to reset button state
                                webviewPanel.webview.postMessage({
                                    command: 'resetRemoveExifButton'
                                });
                            }
                            break;
                        case 'viewJsonMetadata':
                            // Send metadata as JSON to webview
                            webviewPanel.webview.postMessage({
                                command: 'showJsonModal',
                                metadata: metadata
                            });
                            break;
                        case 'resizeImage':
                            // Send current image dimensions to webview for modal
                            webviewPanel.webview.postMessage({
                                command: 'showResizeModal',
                                width: metadata.width || 0,
                                height: metadata.height || 0,
                                filePath: document.uri.fsPath
                            });
                            break;
                        case 'applyResize':
                            try {
                                const { width, height, quality } = message;
                                
                                // Validate dimensions
                                if (!width || !height || width <= 0 || height <= 0) {
                                    vscode.window.showErrorMessage(this.getTranslations().invalidDimensions);
                                    webviewPanel.webview.postMessage({ command: 'resetResizeButton' });
                                    return;
                                }
                                
                                // Show confirmation
                                const confirmed = await vscode.window.showWarningMessage(
                                    this.getTranslations().resizeConfirm,
                                    { modal: true },
                                    'Yes',
                                    'No'
                                );
                                
                                if (confirmed !== 'Yes') {
                                    webviewPanel.webview.postMessage({ command: 'resetResizeButton' });
                                    return;
                                }
                                
                                await this.resizeImage(document.uri, width, height, quality || 80);
                                vscode.window.showInformationMessage(this.getTranslations().resizeSuccess);
                                
                                // Reload metadata and refresh webview
                                const newMetadata = await this.getImageMetadata(document.uri);
                                webviewPanel.webview.html = getHtmlForWebview(
                                    webviewPanel.webview,
                                    document.uri,
                                    newMetadata,
                                    this.getTranslations(),
                                    this.getSectionStates(),
                                    this.getDisplayMode()
                                );
                            } catch (error) {
                                const errorMsg = error instanceof Error ? error.message : String(error);
                                vscode.window.showErrorMessage(`${this.getTranslations().resizeError}: ${errorMsg}`);
                                webviewPanel.webview.postMessage({ command: 'resetResizeButton' });
                            }
                            break;
                    }
                },
                undefined,
                this.context.subscriptions
            );
        } catch (error) {
            // Log error and show error message in webview
            console.error('Error loading image details:', error);
            webviewPanel.webview.html = getErrorHtml(error);
        }
    }
    
    private async getImageMetadata(uri: vscode.Uri): Promise<any> {
        try {
            const filePath = uri.fsPath;
            const stats = await fs.promises.stat(filePath);
            
            let dimensions = { width: 'Unknown', height: 'Unknown', type: 'Unknown' };
            let colorInfo: any = {};
            
            try {
                const size = sizeOf(filePath);
                dimensions = {
                    width: size.width?.toString() || 'Unknown',
                    height: size.height?.toString() || 'Unknown',
                    type: size.type || 'Unknown'
                };
                
                // Get color information
                if (size.type) {
                    colorInfo = getColorInfo(size);
                }
            } catch (error) {
                // Silently handle error, return unknown dimensions
            }

            // Extract EXIF data
            let exifData: any = null;
            try {
                const buffer = await fs.promises.readFile(filePath);
                const tags = ExifReader.load(buffer);
                exifData = extractRelevantExifData(tags);
                
                // Add DPI from EXIF to colorInfo if available
                if (exifData && exifData.dpi) {
                    colorInfo.dpi = exifData.dpi;
                }
                
                // Enhance color depth with EXIF data
                if (exifData && (exifData.bitsPerSample || exifData.samplesPerPixel)) {
                    colorInfo.colorDepth = calculateBitDepth(exifData.bitsPerSample, exifData.samplesPerPixel, colorInfo.colorDepth);
                }
            } catch (error) {
                // EXIF data not available or error reading it
                // Silently handle - this is expected for images without EXIF data
            }

            return {
                path: filePath,
                fileName: path.basename(filePath),
                fileSize: formatFileSize(stats.size),
                fileSizeBytes: stats.size,
                width: dimensions.width,
                height: dimensions.height,
                format: dimensions.type,
                extension: path.extname(filePath),
                created: stats.birthtime.toLocaleString(),
                modified: stats.mtime.toLocaleString(),
                colorInfo: colorInfo,
                exif: exifData
            };
        } catch (error) {
            // Return minimal metadata if file cannot be read
            return {
                path: uri.fsPath,
                fileName: path.basename(uri.fsPath),
                fileSize: 'Unknown',
                fileSizeBytes: 0,
                width: 'Unknown',
                height: 'Unknown',
                format: 'Unknown',
                extension: path.extname(uri.fsPath),
                created: 'Unknown',
                modified: 'Unknown',
                colorInfo: {},
                exif: null
            };
        }
    }

    private async removeExifData(uri: vscode.Uri): Promise<void> {
        const filePath = uri.fsPath;
        const ext = path.extname(filePath).toLowerCase();
        
        // Read the original file
        const originalBuffer = await fs.promises.readFile(filePath);
        
        // For JPEG/JPG files, we can strip EXIF by removing metadata segments
        if (ext === '.jpg' || ext === '.jpeg') {
            // Create a backup
            const backupPath = filePath.replace(/(\.[^.]+)$/, '_backup$1');
            await fs.promises.writeFile(backupPath, originalBuffer);
            
            try {
                // Strip EXIF data from JPEG
                const cleanBuffer = this.stripJpegExif(originalBuffer);
                await fs.promises.writeFile(filePath, cleanBuffer);
                
                vscode.window.showInformationMessage(`Backup saved as: ${path.basename(backupPath)}`);
            } catch (error) {
                // Restore from backup if stripping fails
                await fs.promises.writeFile(filePath, originalBuffer);
                throw error;
            }
        } else if (ext === '.png') {
            // For PNG, strip metadata chunks
            const backupPath = filePath.replace(/(\.[^.]+)$/, '_backup$1');
            await fs.promises.writeFile(backupPath, originalBuffer);
            
            try {
                const cleanBuffer = this.stripPngMetadata(originalBuffer);
                await fs.promises.writeFile(filePath, cleanBuffer);
                
                vscode.window.showInformationMessage(`Backup saved as: ${path.basename(backupPath)}`);
            } catch (error) {
                await fs.promises.writeFile(filePath, originalBuffer);
                throw error;
            }
        } else {
            throw new Error(`Unsupported format: ${ext}. Only JPEG and PNG are supported.`);
        }
    }

    private stripJpegExif(buffer: Buffer): Buffer {
        const SOI = 0xFFD8; // Start of Image
        const APP1 = 0xFFE1; // APP1 marker (EXIF)
        const SOS = 0xFFDA; // Start of Scan
        
        const result: number[] = [];
        let i = 0;
        
        // Copy SOI marker
        if (buffer.readUInt16BE(i) !== SOI) {
            throw new Error('Not a valid JPEG file');
        }
        result.push(0xFF, 0xD8);
        i += 2;
        
        // Process markers
        while (i < buffer.length) {
            if (buffer[i] !== 0xFF) {
                break;
            }
            
            const marker = buffer.readUInt16BE(i);
            
            // If we hit Start of Scan, copy rest of file
            if (marker === SOS) {
                while (i < buffer.length) {
                    result.push(buffer[i++]);
                }
                break;
            }
            
            // Skip EXIF/metadata markers (APP0-APP15)
            if (marker >= 0xFFE0 && marker <= 0xFFEF) {
                const length = buffer.readUInt16BE(i + 2);
                // Skip this marker only if it contains EXIF data
                const markerData = buffer.slice(i + 4, i + 4 + Math.min(4, length - 2));
                if (markerData.toString() === 'Exif' || marker === APP1) {
                    i += 2 + length;
                    continue;
                }
            }
            
            // Copy other markers
            const length = buffer.readUInt16BE(i + 2);
            for (let j = 0; j < length + 2; j++) {
                result.push(buffer[i++]);
            }
        }
        
        return Buffer.from(result);
    }

    private stripPngMetadata(buffer: Buffer): Buffer {
        const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
        const result: number[] = [];
        
        // Verify PNG signature
        if (!buffer.slice(0, 8).equals(PNG_SIGNATURE)) {
            throw new Error('Not a valid PNG file');
        }
        
        // Copy signature
        for (let i = 0; i < 8; i++) {
            result.push(buffer[i]);
        }
        
        let i = 8;
        while (i < buffer.length) {
            const length = buffer.readUInt32BE(i);
            const type = buffer.slice(i + 4, i + 8).toString();
            
            // Skip metadata chunks but keep critical chunks
            const skipChunks = ['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME'];
            
            if (skipChunks.includes(type)) {
                // Skip this chunk
                i += 12 + length; // length + type + data + CRC
                continue;
            }
            
            // Copy this chunk (length + type + data + CRC)
            const chunkSize = 12 + length;
            for (let j = 0; j < chunkSize && i + j < buffer.length; j++) {
                result.push(buffer[i + j]);
            }
            
            i += chunkSize;
            
            // Stop at IEND
            if (type === 'IEND') {
                break;
            }
        }
        
        return Buffer.from(result);
    }

    private async resizeImage(uri: vscode.Uri, width: number, height: number, quality: number): Promise<void> {
        const filePath = uri.fsPath;
        const ext = path.extname(filePath).toLowerCase();
        const dir = path.dirname(filePath);
        const basename = path.basename(filePath, ext);
        
        // Check if format is supported
        const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
        if (!supportedFormats.includes(ext)) {
            throw new Error(`Unsupported format: ${ext}. Only JPEG, PNG, and WebP are supported.`);
        }
        
        // Create backup path
        const backupPath = path.join(dir, `${basename}-original${ext}`);
        
        // Check if backup already exists
        if (fs.existsSync(backupPath)) {
            const replace = await vscode.window.showWarningMessage(
                this.getTranslations().backupExists,
                { modal: true },
                'Yes',
                'No'
            );
            
            if (replace !== 'Yes') {
                throw new Error('Backup file already exists. Operation cancelled.');
            }
        }
        
        // Read original file
        const originalBuffer = await fs.promises.readFile(filePath);
        
        try {
            // Create backup
            await fs.promises.writeFile(backupPath, originalBuffer);
            
            // Determine format for resizer
            let imageFormat: 'jpeg' | 'png' | 'webp';
            if (ext === '.jpg' || ext === '.jpeg') {
                imageFormat = 'jpeg';
            } else if (ext === '.png') {
                imageFormat = 'png';
            } else if (ext === '.webp') {
                imageFormat = 'webp';
            } else {
                throw new Error(`Unsupported format for resizing: ${ext}`);
            }
            
            // Resize image using native implementation
            const resizedBuffer = await resizeImageSafe(
                originalBuffer,
                width,
                height,
                imageFormat,
                quality
            );
            
            // Save resized image
            await fs.promises.writeFile(filePath, resizedBuffer);
            
            vscode.window.showInformationMessage(
                `Backup saved as: ${path.basename(backupPath)}`
            );
        } catch (error) {
            // Restore from backup if resize fails
            if (fs.existsSync(backupPath)) {
                await fs.promises.writeFile(filePath, originalBuffer);
            }
            throw error;
        }
    }
}