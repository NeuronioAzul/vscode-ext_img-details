import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import sizeOf from 'image-size';
import ExifReader from 'exifreader';

interface Translations {
    imageDetails: string;
    fileName: string;
    dimensions: string;
    format: string;
    fileSize: string;
    sizeBytes: string;
    extension: string;
    fullPath: string;
    created: string;
    modified: string;
    exifData: string;
    camera: string;
    make: string;
    model: string;
    photoSettings: string;
    iso: string;
    aperture: string;
    shutterSpeed: string;
    focalLength: string;
    date: string;
    dateTaken: string;
    location: string;
    latitude: string;
    longitude: string;
    additionalInfo: string;
    orientation: string;
    colorSpace: string;
    software: string;
    clickToCopy: string;
    copied: string;
}

const translations: { [key: string]: Translations } = {
    'en': {
        imageDetails: 'Image Details',
        fileName: 'File Name',
        dimensions: 'Dimensions',
        format: 'Format',
        fileSize: 'File Size',
        sizeBytes: 'Size (Bytes)',
        extension: 'Extension',
        fullPath: 'Full Path',
        created: 'Created',
        modified: 'Modified',
        exifData: 'EXIF Data',
        camera: 'Camera',
        make: 'Make',
        model: 'Model',
        photoSettings: 'Photo Settings',
        iso: 'ISO',
        aperture: 'Aperture',
        shutterSpeed: 'Shutter Speed',
        focalLength: 'Focal Length',
        date: 'Date',
        dateTaken: 'Date Taken',
        location: 'Location',
        latitude: 'Latitude',
        longitude: 'Longitude',
        additionalInfo: 'Additional Info',
        orientation: 'Orientation',
        colorSpace: 'Color Space',
        software: 'Software',
        clickToCopy: 'Click to copy',
        copied: 'Copied'
    },
    'pt-br': {
        imageDetails: 'Detalhes da Imagem',
        fileName: 'Nome do Arquivo',
        dimensions: 'Dimensões',
        format: 'Formato',
        fileSize: 'Tamanho do Arquivo',
        sizeBytes: 'Tamanho (Bytes)',
        extension: 'Extensão',
        fullPath: 'Caminho Completo',
        created: 'Criado em',
        modified: 'Modificado em',
        exifData: 'Dados EXIF',
        camera: 'Câmera',
        make: 'Marca',
        model: 'Modelo',
        photoSettings: 'Configurações da Foto',
        iso: 'ISO',
        aperture: 'Abertura',
        shutterSpeed: 'Velocidade do Obturador',
        focalLength: 'Distância Focal',
        date: 'Data',
        dateTaken: 'Data da Captura',
        location: 'Localização',
        latitude: 'Latitude',
        longitude: 'Longitude',
        additionalInfo: 'Informações Adicionais',
        orientation: 'Orientação',
        colorSpace: 'Espaço de Cores',
        software: 'Software',
        clickToCopy: 'Clique para copiar',
        copied: 'Copiado'
    }
};

export class ImageDetailsEditorProvider implements vscode.CustomReadonlyEditorProvider {
    private static readonly viewType = 'imageDetails.viewer';

    constructor(private readonly context: vscode.ExtensionContext) {}

    private getTranslations(): Translations {
        const locale = vscode.env.language.toLowerCase();
        
        // Check for exact match
        if (translations[locale]) {
            return translations[locale];
        }
        
        // Check for language without region (e.g., 'pt' from 'pt-BR')
        const lang = locale.split('-')[0];
        if (translations[lang]) {
            return translations[lang];
        }
        
        // Check for 'pt-br' variations
        if (locale.includes('pt')) {
            return translations['pt-br'];
        }
        
        // Default to English
        return translations['en'];
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
            webviewPanel.webview.html = this.getHtmlForWebview(
                webviewPanel.webview,
                document.uri,
                metadata
            );

            // Handle messages from the webview
            webviewPanel.webview.onDidReceiveMessage(
                (message: any) => {
                    switch (message.command) {
                        case 'copy':
                            vscode.env.clipboard.writeText(message.text);
                            // Visual feedback is handled in the webview
                            break;
                    }
                },
                undefined,
                this.context.subscriptions
            );
        } catch (error) {
            // Log error and show error message in webview
            console.error('Error loading image details:', error);
            webviewPanel.webview.html = this.getErrorHtml(error);
        }
    }

    private async getImageMetadata(uri: vscode.Uri): Promise<any> {
        try {
            const filePath = uri.fsPath;
            const stats = await fs.promises.stat(filePath);
            
            let dimensions = { width: 'Unknown', height: 'Unknown', type: 'Unknown' };
            
            try {
                const size = sizeOf(filePath);
                dimensions = {
                    width: size.width?.toString() || 'Unknown',
                    height: size.height?.toString() || 'Unknown',
                    type: size.type || 'Unknown'
                };
            } catch (error) {
                // Silently handle error, return unknown dimensions
            }

            // Extract EXIF data
            let exifData: any = null;
            try {
                const buffer = await fs.promises.readFile(filePath);
                const tags = ExifReader.load(buffer);
                exifData = this.extractRelevantExifData(tags);
            } catch (error) {
                // EXIF data not available or error reading it
            }

            return {
                path: filePath,
                fileName: path.basename(filePath),
                fileSize: this.formatFileSize(stats.size),
                fileSizeBytes: stats.size,
                width: dimensions.width,
                height: dimensions.height,
                format: dimensions.type,
                extension: path.extname(filePath),
                created: stats.birthtime.toLocaleString(),
                modified: stats.mtime.toLocaleString(),
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
                exif: null
            };
        }
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) {return '0 Bytes';}
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    private extractRelevantExifData(tags: any): any {
        const exif: any = {};

        // Helper function to safely get description
        const getDescription = (tag: any): string | undefined => {
            if (!tag) return undefined;
            const desc = tag.description || tag.value;
            return desc !== undefined && desc !== null ? String(desc) : undefined;
        };

        // Camera info
        const cameraMake = getDescription(tags.Make);
        if (cameraMake) {
            exif.cameraMake = cameraMake;
        }
        
        const cameraModel = getDescription(tags.Model);
        if (cameraModel) {
            exif.cameraModel = cameraModel;
        }

        // Photo settings
        const iso = getDescription(tags.ISO || tags.ISOSpeedRatings);
        if (iso) {
            exif.iso = iso;
        }
        
        if (tags.FNumber) {
            const fnumber = getDescription(tags.FNumber);
            if (fnumber) {
                exif.aperture = fnumber.includes('f/') ? fnumber : `f/${fnumber}`;
            }
        }
        
        const exposureTime = getDescription(tags.ExposureTime);
        if (exposureTime) {
            exif.shutterSpeed = exposureTime;
        }
        
        if (tags.FocalLength) {
            const focal = getDescription(tags.FocalLength);
            if (focal) {
                exif.focalLength = focal.includes('mm') ? focal : `${focal}mm`;
            }
        }

        // Date info
        const dateTaken = getDescription(tags.DateTimeOriginal || tags.DateTime);
        if (dateTaken) {
            exif.dateTaken = dateTaken;
        }

        // GPS info
        const gpsLat = getDescription(tags.GPSLatitude);
        const gpsLon = getDescription(tags.GPSLongitude);
        if (gpsLat && gpsLon) {
            exif.gpsLatitude = gpsLat;
            exif.gpsLongitude = gpsLon;
        }

        // Image info
        const orientation = getDescription(tags.Orientation);
        if (orientation) {
            exif.orientation = orientation;
        }
        
        const colorSpace = getDescription(tags.ColorSpace);
        if (colorSpace) {
            exif.colorSpace = colorSpace;
        }
        
        const software = getDescription(tags.Software);
        if (software) {
            exif.software = software;
        }

        return Object.keys(exif).length > 0 ? exif : null;
    }

    private getHtmlForWebview(
        webview: vscode.Webview,
        imageUri: vscode.Uri,
        metadata: any
    ): string {
        // Convert the image URI to a webview URI
        const imageWebviewUri = webview.asWebviewUri(imageUri);
        const t = this.getTranslations();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Details</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 100vh;
        }
        .container {
            display: flex;
            gap: 0;
            height: 100vh;
            position: relative;
        }
        .image-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            background-color: var(--vscode-editor-background);
            padding: 20px;
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .metadata-panel {
            width: 320px;
            min-width: 250px;
            max-width: 600px;
            border-left: 1px solid var(--vscode-panel-border);
            padding: 20px;
            overflow-y: auto;
            background-color: var(--vscode-sideBar-background);
            position: sticky;
            top: 0;
            right: 0;
            height: 100vh;
            resize: horizontal;
        }
        .resize-handle {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            cursor: ew-resize;
            background-color: transparent;
            transition: background-color 0.2s ease;
        }
        .resize-handle:hover {
            background-color: var(--vscode-focusBorder);
        }
        h2 {
            margin-top: 0;
            color: var(--vscode-sideBarTitle-foreground);
            font-size: 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        h3 {
            color: var(--vscode-sideBarTitle-foreground);
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
            margin-bottom: 12px;
        }
        .metadata-item {
            margin-bottom: 16px;
        }
        .metadata-label {
            font-weight: bold;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .metadata-value {
            padding: 8px 12px;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            cursor: pointer;
            word-break: break-all;
            transition: all 0.2s ease;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
            position: relative;
        }
        .metadata-value:hover {
            background-color: var(--vscode-list-hoverBackground);
            border-color: var(--vscode-focusBorder);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .metadata-value:active {
            background-color: var(--vscode-list-activeSelectionBackground);
            color: var(--vscode-list-activeSelectionForeground);
            transform: translateY(0);
        }
        .metadata-value::after {
            content: "📋";
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.2s ease;
            font-size: 12px;
        }
        .metadata-value:hover::after {
            opacity: 0.5;
        }
        .metadata-value.copied {
            background-color: var(--vscode-statusBar-foreground) !important;
            color: var(--vscode-statusBar-background) !important;
            transform: scale(1.02);
        }
        .copy-feedback {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--vscode-notifications-background);
            color: var(--vscode-notifications-foreground);
            border: 1px solid var(--vscode-notifications-border);
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }
        @media (prefers-color-scheme: dark) {
            .image-container img {
                box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container">
            <img src="${imageWebviewUri}" alt="Image Preview" />
        </div>
        <div class="metadata-panel" id="metadataPanel">
            <div class="resize-handle" id="resizeHandle"></div>
            <h2>${t.imageDetails}</h2>
            
            <div class="metadata-item">
                <div class="metadata-label">📁 ${t.fileName}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(metadata.fileName)}')">${this.escapeHtml(metadata.fileName)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">📐 ${t.dimensions}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${metadata.width} x ${metadata.height}')">${metadata.width} x ${metadata.height}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">🎨 ${t.format}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(metadata.format)}')">${this.escapeHtml(metadata.format)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">💾 ${t.fileSize}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(metadata.fileSize)}')">${this.escapeHtml(metadata.fileSize)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">🔢 ${t.sizeBytes}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${metadata.fileSizeBytes}')">${metadata.fileSizeBytes}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">🏷️ ${t.extension}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(metadata.extension)}')">${this.escapeHtml(metadata.extension)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">📂 ${t.fullPath}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(metadata.path)}')">${this.escapeHtml(metadata.path)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">📅 ${t.created}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(metadata.created)}')">${this.escapeHtml(metadata.created)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">✏️ ${t.modified}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(metadata.modified)}')">${this.escapeHtml(metadata.modified)}</div>
            </div>
            
            ${metadata.exif ? this.generateExifHtml(metadata.exif, t) : ''}
        </div>
    </div>
    
    <div class="copy-feedback" id="copyFeedback">
        ✅ ${t.copied}!
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        const copiedText = '${t.copied}';
        
        function copyToClipboard(text) {
            // Visual feedback
            const feedback = document.getElementById('copyFeedback');
            const shortText = text.length > 30 ? text.substring(0, 30) + '...' : text;
            feedback.textContent = '✅ ' + copiedText + ': ' + shortText;
            feedback.classList.add('show');
            
            // Send to extension
            vscode.postMessage({
                command: 'copy',
                text: text
            });
            
            // Hide feedback after 2 seconds
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 2000);
            
            // Add flash effect to the clicked element
            const clickedElement = event.target;
            clickedElement.classList.add('copied');
            setTimeout(() => {
                clickedElement.classList.remove('copied');
            }, 300);
        }
        
        // Resize functionality
        const resizeHandle = document.getElementById('resizeHandle');
        const metadataPanel = document.getElementById('metadataPanel');
        let isResizing = false;
        
        resizeHandle.addEventListener('mousedown', function(e) {
            isResizing = true;
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            
            const containerWidth = document.querySelector('.container').offsetWidth;
            const newWidth = containerWidth - e.clientX;
            
            if (newWidth >= 250 && newWidth <= 600) {
                metadataPanel.style.width = newWidth + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        });
    </script>
</body>
</html>`;
    }

    private escapeHtml(text: string | number | undefined | null): string {
        if (text === undefined || text === null) {
            return '';
        }
        
        // Convert to string if it's a number or other type
        const str = String(text);
        
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, m => map[m]);
    }

    private getErrorHtml(error: any): string {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : '';
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Loading Image</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .error-container {
            max-width: 600px;
            padding: 30px;
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 8px;
        }
        h1 {
            color: var(--vscode-errorForeground);
            margin-top: 0;
            font-size: 24px;
        }
        .error-message {
            margin: 20px 0;
            padding: 15px;
            background-color: var(--vscode-editor-background);
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            word-break: break-word;
        }
        .error-stack {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-editor-background);
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            overflow-x: auto;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
        }
        .suggestion {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-editor-background);
            border-left: 3px solid var(--vscode-focusBorder);
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>⚠️ Error Loading Image Details</h1>
        <div class="error-message">
            <strong>Error:</strong> ${this.escapeHtml(errorMessage)}
        </div>
        ${errorStack ? `<details>
            <summary style="cursor: pointer; margin-bottom: 10px;">View Stack Trace</summary>
            <div class="error-stack">${this.escapeHtml(errorStack)}</div>
        </details>` : ''}
        <div class="suggestion">
            <strong>Suggestions:</strong>
            <ul>
                <li>Make sure the image file is not corrupted</li>
                <li>Try opening the image with the default VS Code image viewer</li>
                <li>Check the Developer Console for more details (Help → Toggle Developer Tools)</li>
                <li>Report this issue on GitHub if it persists</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
    }

    private generateExifHtml(exif: any, t: Translations): string {
        let html = `<div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid var(--vscode-panel-border);"><h2>📷 ${t.exifData}</h2>`;

        // Camera Information
        if (exif.cameraMake || exif.cameraModel) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.camera}</h3>`;
            
            if (exif.cameraMake) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📱 ${t.make}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.cameraMake)}')">${this.escapeHtml(exif.cameraMake)}</div>
                </div>`;
            }
            
            if (exif.cameraModel) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📸 ${t.model}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.cameraModel)}')">${this.escapeHtml(exif.cameraModel)}</div>
                </div>`;
            }
        }

        // Photo Settings
        if (exif.iso || exif.aperture || exif.shutterSpeed || exif.focalLength) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.photoSettings}</h3>`;
            
            if (exif.iso) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔆 ${t.iso}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.iso)}')">${this.escapeHtml(exif.iso)}</div>
                </div>`;
            }
            
            if (exif.aperture) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔍 ${t.aperture}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.aperture)}')">${this.escapeHtml(exif.aperture)}</div>
                </div>`;
            }
            
            if (exif.shutterSpeed) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚡ ${t.shutterSpeed}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.shutterSpeed)}')">${this.escapeHtml(exif.shutterSpeed)}</div>
                </div>`;
            }
            
            if (exif.focalLength) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.focalLength}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.focalLength)}')">${this.escapeHtml(exif.focalLength)}</div>
                </div>`;
            }
        }

        // Date Information
        if (exif.dateTaken) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.date}</h3>`;
            html += `
            <div class="metadata-item">
                <div class="metadata-label">📅 ${t.dateTaken}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.dateTaken)}')">${this.escapeHtml(exif.dateTaken)}</div>
            </div>`;
        }

        // GPS Information
        if (exif.gpsLatitude || exif.gpsLongitude) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.location}</h3>`;
            
            if (exif.gpsLatitude) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.latitude}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsLatitude)}')">${this.escapeHtml(exif.gpsLatitude)}</div>
                </div>`;
            }
            
            if (exif.gpsLongitude) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.longitude}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsLongitude)}')">${this.escapeHtml(exif.gpsLongitude)}</div>
                </div>`;
            }
        }

        // Additional Information
        if (exif.orientation || exif.colorSpace || exif.software) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.additionalInfo}</h3>`;
            
            if (exif.orientation) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔄 ${t.orientation}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.orientation)}')">${this.escapeHtml(exif.orientation)}</div>
                </div>`;
            }
            
            if (exif.colorSpace) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.colorSpace}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.colorSpace)}')">${this.escapeHtml(exif.colorSpace)}</div>
                </div>`;
            }
            
            if (exif.software) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">💻 ${t.software}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.software)}')">${this.escapeHtml(exif.software)}</div>
                </div>`;
            }
        }

        html += '</div>';
        return html;
    }
}
