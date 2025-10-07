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
    colorInformation: string;
    supportsTransparency: string;
    colorDepth: string;
    dpi: string;
    thumbnail: string;
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
        copied: 'Copied',
        colorInformation: 'Color Information',
        supportsTransparency: 'Transparency Support',
        colorDepth: 'Color Depth',
        dpi: 'DPI/PPI',
        thumbnail: 'Thumbnail'
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
        copied: 'Copiado',
        colorInformation: 'Informações de Cor',
        supportsTransparency: 'Suporte a Transparência',
        colorDepth: 'Profundidade de Cor',
        dpi: 'DPI/PPI',
        thumbnail: 'Miniatura'
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
                    colorInfo = this.getColorInfo(size);
                }
            } catch (error) {
                // Silently handle error, return unknown dimensions
            }

            // Extract EXIF data
            let exifData: any = null;
            try {
                const buffer = await fs.promises.readFile(filePath);
                const tags = ExifReader.load(buffer);
                exifData = this.extractRelevantExifData(tags);
                
                // Add DPI from EXIF to colorInfo if available
                if (exifData && exifData.dpi) {
                    colorInfo.dpi = exifData.dpi;
                }
                
                // Enhance color depth with EXIF data
                if (exifData && (exifData.bitsPerSample || exifData.samplesPerPixel)) {
                    colorInfo.colorDepth = this.calculateBitDepth(exifData.bitsPerSample, exifData.samplesPerPixel, colorInfo.colorDepth);
                }
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

    private formatFileSize(bytes: number): string {
        if (bytes === 0) {return '0 Bytes';}
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    private getColorInfo(size: any): any {
        const colorInfo: any = {};
        
        // Check for transparency support based on format
        const transparentFormats = ['png', 'gif', 'webp', 'svg'];
        if (size.type && transparentFormats.includes(size.type.toLowerCase())) {
            colorInfo.supportsTransparency = 'Yes';
        } else {
            colorInfo.supportsTransparency = 'No';
        }
        
        // Get bit depth if available
        if (size.type) {
            const format = size.type.toLowerCase();
            if (format === 'png' || format === 'bmp') {
                // PNG and BMP can have various bit depths
                colorInfo.colorDepth = 'Variable (8-32 bit)';
            } else if (format === 'jpg' || format === 'jpeg') {
                colorInfo.colorDepth = '24 bit (8 bit per channel)';
            } else if (format === 'gif') {
                colorInfo.colorDepth = '8 bit (256 colors)';
            } else if (format === 'webp') {
                colorInfo.colorDepth = '24-32 bit';
            }
        }
        
        return colorInfo;
    }

    private calculateBitDepth(bitsPerSample: string | undefined, samplesPerPixel: string | undefined, fallback: string | undefined): string {
        if (!bitsPerSample && !samplesPerPixel) {
            return fallback || 'Unknown';
        }

        try {
            let bitDepthInfo = '';
            
            if (bitsPerSample) {
                // BitsPerSample pode ser um array como "8 8 8" para RGB
                const bits = bitsPerSample.toString().trim();
                const bitsArray = bits.split(/\s+/).map(b => parseInt(b)).filter(b => !isNaN(b));
                
                if (bitsArray.length > 0) {
                    const uniqueBits = [...new Set(bitsArray)];
                    if (uniqueBits.length === 1) {
                        // Todos os canais têm a mesma profundidade
                        const bitsPerChannel = uniqueBits[0];
                        const totalChannels = samplesPerPixel ? parseInt(samplesPerPixel.toString()) : bitsArray.length;
                        const totalBits = bitsPerChannel * (totalChannels || bitsArray.length);
                        
                        if (totalChannels && totalChannels > 1) {
                            bitDepthInfo = `${totalBits} bit (${bitsPerChannel} bit per channel, ${totalChannels} channels)`;
                        } else {
                            bitDepthInfo = `${bitsPerChannel} bit`;
                        }
                    } else {
                        // Diferentes profundidades por canal
                        const totalBits = bitsArray.reduce((sum, bits) => sum + bits, 0);
                        bitDepthInfo = `${totalBits} bit (${bits} per channel)`;
                    }
                }
            } else if (samplesPerPixel) {
                const channels = parseInt(samplesPerPixel.toString());
                if (!isNaN(channels)) {
                    bitDepthInfo = `${channels} channel${channels > 1 ? 's' : ''}`;
                }
            }

            return bitDepthInfo || fallback || 'Unknown';
        } catch (error) {
            return fallback || 'Unknown';
        }
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

        // Bit depth information
        const bitsPerSample = getDescription(tags.BitsPerSample);
        if (bitsPerSample) {
            exif.bitsPerSample = bitsPerSample;
        }

        const samplesPerPixel = getDescription(tags.SamplesPerPixel);
        if (samplesPerPixel) {
            exif.samplesPerPixel = samplesPerPixel;
        }

        // DPI/PPI information
        const xResolution = tags.XResolution?.value || tags.XResolution?.description;
        const yResolution = tags.YResolution?.value || tags.YResolution?.description;
        const resolutionUnit = tags.ResolutionUnit?.description || tags.ResolutionUnit?.value;
        
        if (xResolution && yResolution) {
            const unit = resolutionUnit === '3' || resolutionUnit === 'cm' ? 'pixels/cm' : 'DPI';
            if (xResolution === yResolution) {
                exif.dpi = `${xResolution} ${unit}`;
            } else {
                exif.dpi = `${xResolution} x ${yResolution} ${unit}`;
            }
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
            position: relative;
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
            cursor: zoom-in;
        }
        .image-container img.zoomed {
            cursor: zoom-out;
            max-width: none;
            max-height: none;
        }
        .zoom-controls {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 8px;
            display: flex;
            gap: 4px;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .zoom-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
        }
        .zoom-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .zoom-button:active {
            transform: scale(0.95);
        }
        .zoom-level {
            display: flex;
            align-items: center;
            padding: 0 8px;
            font-size: 13px;
            color: var(--vscode-foreground);
            min-width: 60px;
            justify-content: center;
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
        .copy-feedback.show {
            opacity: 1;
            transform: translateX(0);
        }
        @media (prefers-color-scheme: dark) {
            .image-container img {
                box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
            }
        }
        
        /* Thumbnail styles */
        .thumbnail-container {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .thumbnail-container .metadata-label {
            margin-bottom: 8px;
        }
        .thumbnail-preview {
            display: flex;
            justify-content: center;
            padding: 8px;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
        }
        .thumbnail-image {
            max-width: 120px;
            max-height: 120px;
            object-fit: contain;
            border-radius: 2px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .thumbnail-image:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container" id="imageContainer">
            <img src="${imageWebviewUri}" alt="Image Preview" id="imagePreview" />
            <div class="zoom-controls">
                <button class="zoom-button" onclick="zoomOut()" title="Zoom Out">−</button>
                <div class="zoom-level" id="zoomLevel">100%</div>
                <button class="zoom-button" onclick="zoomIn()" title="Zoom In">+</button>
                <button class="zoom-button" onclick="resetZoom()" title="Reset Zoom">⟲</button>
                <button class="zoom-button" onclick="fitToScreen()" title="Fit to Screen">⊡</button>
            </div>
        </div>
        <div class="metadata-panel" id="metadataPanel">
            <div class="resize-handle" id="resizeHandle"></div>
            <h2>${t.imageDetails}</h2>
            
            <!-- Thumbnail Preview -->
            <div class="thumbnail-container">
                <div class="metadata-label">🖼️ ${t.thumbnail}</div>
                <div class="thumbnail-preview">
                    <img src="${imageWebviewUri}" alt="Thumbnail" class="thumbnail-image">
                </div>
            </div>
            
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
            
            ${this.generateColorInfoHtml(metadata.colorInfo, t)}
            
            ${metadata.exif ? this.generateExifHtml(metadata.exif, t) : ''}
            <p><br><br></p>
        </div>
    </div>
    
    <div class="copy-feedback" id="copyFeedback">
        ✅ ${t.copied}!
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        const copiedText = '${t.copied}';
        
        // Zoom functionality
        let currentZoom = 1;
        const zoomStep = 0.25;
        const minZoom = 0.1;
        const maxZoom = 5;
        
        const imagePreview = document.getElementById('imagePreview');
        const imageContainer = document.getElementById('imageContainer');
        const zoomLevelDisplay = document.getElementById('zoomLevel');
        
        function updateZoom(newZoom) {
            currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
            imagePreview.style.transform = \`scale(\${currentZoom})\`;
            zoomLevelDisplay.textContent = Math.round(currentZoom * 100) + '%';
            
            if (currentZoom !== 1) {
                imagePreview.classList.add('zoomed');
            } else {
                imagePreview.classList.remove('zoomed');
            }
        }
        
        function zoomIn() {
            updateZoom(currentZoom + zoomStep);
        }
        
        function zoomOut() {
            updateZoom(currentZoom - zoomStep);
        }
        
        function resetZoom() {
            updateZoom(1);
        }
        
        function fitToScreen() {
            const containerRect = imageContainer.getBoundingClientRect();
            const imageRect = imagePreview.getBoundingClientRect();
            
            const scaleX = (containerRect.width - 40) / (imageRect.width / currentZoom);
            const scaleY = (containerRect.height - 40) / (imageRect.height / currentZoom);
            
            updateZoom(Math.min(scaleX, scaleY));
        }
        
        // Zoom with mouse wheel
        imageContainer.addEventListener('wheel', function(e) {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
                updateZoom(currentZoom + delta);
            }
        });
        
        // Click to toggle zoom
        imagePreview.addEventListener('click', function(e) {
            if (currentZoom === 1) {
                updateZoom(2);
            } else {
                resetZoom();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                resetZoom();
            }
        });
        
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

        // Thumbnail click to focus image
        const thumbnailImage = document.querySelector('.thumbnail-image');
        if (thumbnailImage) {
            thumbnailImage.addEventListener('click', function() {
                imageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (currentZoom === 1) {
                    zoomIn();
                }
            });
        }
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

    private generateColorInfoHtml(colorInfo: any, t: Translations): string {
        if (!colorInfo || Object.keys(colorInfo).length === 0) {
            return '';
        }

        let html = `<div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid var(--vscode-panel-border);"><h2>🎨 ${t.colorInformation}</h2>`;

        if (colorInfo.supportsTransparency) {
            html += `
            <div class="metadata-item">
                <div class="metadata-label">✨ ${t.supportsTransparency}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(colorInfo.supportsTransparency)}')">${this.escapeHtml(colorInfo.supportsTransparency)}</div>
            </div>`;
        }

        if (colorInfo.colorDepth) {
            html += `
            <div class="metadata-item">
                <div class="metadata-label">🌈 ${t.colorDepth}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(colorInfo.colorDepth)}')">${this.escapeHtml(colorInfo.colorDepth)}</div>
            </div>`;
        }

        if (colorInfo.dpi) {
            html += `
            <div class="metadata-item">
                <div class="metadata-label">📐 ${t.dpi}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(colorInfo.dpi)}')">${this.escapeHtml(colorInfo.dpi)}</div>
            </div>`;
        }

        html += '</div>';
        return html;
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
