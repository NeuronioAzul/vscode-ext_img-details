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
    basicInfo: string;
    collapse: string;
    expand: string;
    accordionMode: string;
    listMode: string;
    sectionSettings: string;
    removeExif: string;
    removeExifConfirm: string;
    removeExifSuccess: string;
    removeExifError: string;
    viewJsonMetadata: string;
    metadataJson: string;
    copyJson: string;
    closeModal: string;
    imageDescription: string;
    ownerName: string;
    lens: string;
    lensMake: string;
    lensModel: string;
    lensSerialNumber: string;
    apertureValue: string;
    maxAperture: string;
    exposureTime: string;
    shutterSpeedValue: string;
    focalLength35mm: string;
    exposureProgram: string;
    exposureMode: string;
    exposureCompensation: string;
    meteringMode: string;
    flash: string;
    whiteBalance: string;
    componentsConfiguration: string;
    userComment: string;
    createDate: string;
    modifyDate: string;
    gps: string;
    gpsVersionId: string;
    latitudeRef: string;
    longitudeRef: string;
    gpsAltitude: string;
    altitudeRef: string;
    gpsTimeStamp: string;
    gpsDateStamp: string;
    gpsSatellites: string;
    gpsStatus: string;
    gpsMeasureMode: string;
    gpsDOP: string;
    gpsSpeed: string;
    gpsSpeedRef: string;
    gpsTrack: string;
    gpsTrackRef: string;
    gpsImgDirection: string;
    gpsImgDirectionRef: string;
    gpsMapDatum: string;
    gpsDestLatitude: string;
    gpsDestLatitudeRef: string;
    gpsDestLongitude: string;
    gpsDestLongitudeRef: string;
    gpsDestBearing: string;
    gpsDestBearingRef: string;
    gpsDestDistance: string;
    gpsDestDistanceRef: string;
    gpsDifferential: string;
    compression: string;
    xResolution: string;
    yResolution: string;
    resolutionUnit: string;
    yCbCrPositioning: string;
    artist: string;
    copyright: string;
    exifVersion: string;
    flashpixVersion: string;
    interopIndex: string;
    interopVersion: string;
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
        thumbnail: 'Thumbnail',
        basicInfo: 'Basic Information',
        collapse: 'Collapse',
        expand: 'Expand',
        accordionMode: 'Accordion',
        listMode: 'List',
        sectionSettings: 'Display',
        removeExif: 'Remove EXIF Data',
        removeExifConfirm: 'Remove all EXIF metadata from this image? A new file will be saved without metadata.',
        removeExifSuccess: 'EXIF data removed successfully!',
        removeExifError: 'Error removing EXIF data',
        viewJsonMetadata: 'View as JSON',
        metadataJson: 'Metadata (JSON)',
        copyJson: 'Copy JSON',
        closeModal: 'Close',
        imageDescription: 'Image Description',
        ownerName: 'Owner Name',
        lens: 'Lens',
        lensMake: 'Lens Make',
        lensModel: 'Lens Model',
        lensSerialNumber: 'Lens Serial Number',
        apertureValue: 'Aperture Value',
        maxAperture: 'Max Aperture',
        exposureTime: 'Exposure Time',
        shutterSpeedValue: 'Shutter Speed Value',
        focalLength35mm: 'Focal Length (35mm)',
        exposureProgram: 'Exposure Program',
        exposureMode: 'Exposure Mode',
        exposureCompensation: 'Exposure Compensation',
        meteringMode: 'Metering Mode',
        flash: 'Flash',
        whiteBalance: 'White Balance',
        componentsConfiguration: 'Components Configuration',
        userComment: 'User Comment',
        createDate: 'Create Date',
        modifyDate: 'Modify Date',
        gps: 'GPS',
        gpsVersionId: 'GPS Version ID',
        latitudeRef: 'Latitude Ref',
        longitudeRef: 'Longitude Ref',
        gpsAltitude: 'GPS Altitude',
        altitudeRef: 'Altitude Ref',
        gpsTimeStamp: 'GPS Time Stamp',
        gpsDateStamp: 'GPS Date Stamp',
        gpsSatellites: 'GPS Satellites',
        gpsStatus: 'GPS Status',
        gpsMeasureMode: 'GPS Measure Mode',
        gpsDOP: 'GPS DOP',
        gpsSpeed: 'GPS Speed',
        gpsSpeedRef: 'GPS Speed Ref',
        gpsTrack: 'GPS Track',
        gpsTrackRef: 'GPS Track Ref',
        gpsImgDirection: 'GPS Image Direction',
        gpsImgDirectionRef: 'GPS Image Direction Ref',
        gpsMapDatum: 'GPS Map Datum',
        gpsDestLatitude: 'GPS Dest Latitude',
        gpsDestLatitudeRef: 'GPS Dest Latitude Ref',
        gpsDestLongitude: 'GPS Dest Longitude',
        gpsDestLongitudeRef: 'GPS Dest Longitude Ref',
        gpsDestBearing: 'GPS Dest Bearing',
        gpsDestBearingRef: 'GPS Dest Bearing Ref',
        gpsDestDistance: 'GPS Dest Distance',
        gpsDestDistanceRef: 'GPS Dest Distance Ref',
        gpsDifferential: 'GPS Differential',
        compression: 'Compression',
        xResolution: 'X Resolution',
        yResolution: 'Y Resolution',
        resolutionUnit: 'Resolution Unit',
        yCbCrPositioning: 'YCbCr Positioning',
        artist: 'Artist',
        copyright: 'Copyright',
        exifVersion: 'EXIF Version',
        flashpixVersion: 'Flashpix Version',
        interopIndex: 'Interop Index',
        interopVersion: 'Interop Version'
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
        thumbnail: 'Miniatura',
        basicInfo: 'Informações Básicas',
        collapse: 'Recolher',
        expand: 'Expandir',
        accordionMode: 'Sanfona',
        listMode: 'Lista',
        sectionSettings: 'Exibição',
        removeExif: 'Remover Dados EXIF',
        removeExifConfirm: 'Remover todos os metadados EXIF desta imagem? Um novo arquivo será salvo sem os metadados.',
        removeExifSuccess: 'Dados EXIF removidos com sucesso!',
        removeExifError: 'Erro ao remover dados EXIF',
        viewJsonMetadata: 'Ver como JSON',
        metadataJson: 'Metadados (JSON)',
        copyJson: 'Copiar JSON',
        closeModal: 'Fechar',
        imageDescription: 'Descrição da Imagem',
        ownerName: 'Nome do Proprietário',
        lens: 'Lente',
        lensMake: 'Fabricante da Lente',
        lensModel: 'Modelo da Lente',
        lensSerialNumber: 'Número de Série da Lente',
        apertureValue: 'Valor da Abertura',
        maxAperture: 'Abertura Máxima',
        exposureTime: 'Tempo de Exposição',
        shutterSpeedValue: 'Valor da Velocidade do Obturador',
        focalLength35mm: 'Distância Focal (35mm)',
        exposureProgram: 'Programa de Exposição',
        exposureMode: 'Modo de Exposição',
        exposureCompensation: 'Compensação de Exposição',
        meteringMode: 'Modo de Medição',
        flash: 'Flash',
        whiteBalance: 'Balanço de Branco',
        componentsConfiguration: 'Configuração de Componentes',
        userComment: 'Comentário do Usuário',
        createDate: 'Data de Criação',
        modifyDate: 'Data de Modificação',
        gps: 'GPS',
        gpsVersionId: 'ID de Versão GPS',
        latitudeRef: 'Ref. Latitude',
        longitudeRef: 'Ref. Longitude',
        gpsAltitude: 'Altitude GPS',
        altitudeRef: 'Ref. Altitude',
        gpsTimeStamp: 'Carimbo de Tempo GPS',
        gpsDateStamp: 'Carimbo de Data GPS',
        gpsSatellites: 'Satélites GPS',
        gpsStatus: 'Status GPS',
        gpsMeasureMode: 'Modo de Medição GPS',
        gpsDOP: 'DOP GPS',
        gpsSpeed: 'Velocidade GPS',
        gpsSpeedRef: 'Ref. Velocidade GPS',
        gpsTrack: 'Trilha GPS',
        gpsTrackRef: 'Ref. Trilha GPS',
        gpsImgDirection: 'Direção da Imagem GPS',
        gpsImgDirectionRef: 'Ref. Direção da Imagem GPS',
        gpsMapDatum: 'Datum do Mapa GPS',
        gpsDestLatitude: 'Latitude de Destino GPS',
        gpsDestLatitudeRef: 'Ref. Latitude de Destino GPS',
        gpsDestLongitude: 'Longitude de Destino GPS',
        gpsDestLongitudeRef: 'Ref. Longitude de Destino GPS',
        gpsDestBearing: 'Rumo de Destino GPS',
        gpsDestBearingRef: 'Ref. Rumo de Destino GPS',
        gpsDestDistance: 'Distância de Destino GPS',
        gpsDestDistanceRef: 'Ref. Distância de Destino GPS',
        gpsDifferential: 'Diferencial GPS',
        compression: 'Compressão',
        xResolution: 'Resolução X',
        yResolution: 'Resolução Y',
        resolutionUnit: 'Unidade de Resolução',
        yCbCrPositioning: 'Posicionamento YCbCr',
        artist: 'Artista',
        copyright: 'Direitos Autorais',
        exifVersion: 'Versão EXIF',
        flashpixVersion: 'Versão Flashpix',
        interopIndex: 'Índice Interop',
        interopVersion: 'Versão Interop'
    }
};

export class ImageDetailsEditorProvider implements vscode.CustomReadonlyEditorProvider {
    private static readonly viewType = 'imageDetails.viewer';
    private static readonly stateKey = 'imageDetails.sectionStates';
    private static readonly displayModeKey = 'imageDetails.displayMode';

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

    private getSectionStates(): { [key: string]: boolean } {
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

    private getDisplayMode(): 'accordion' | 'list' {
        // First check user's saved preference
        const saved = this.context.globalState.get<'accordion' | 'list'>(ImageDetailsEditorProvider.displayModeKey);
        if (saved) {
            return saved;
        }
        
        // Fall back to configuration setting
        return vscode.workspace.getConfiguration('imageDetails').get<'accordion' | 'list'>('defaultDisplayMode', 'accordion');
    }

    private setDisplayMode(mode: 'accordion' | 'list'): void {
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
            webviewPanel.webview.html = this.getHtmlForWebview(
                webviewPanel.webview,
                document.uri,
                metadata
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
                            webviewPanel.webview.html = this.getHtmlForWebview(
                                webviewPanel.webview,
                                document.uri,
                                metadata
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
                                webviewPanel.webview.html = this.getHtmlForWebview(
                                    webviewPanel.webview,
                                    document.uri,
                                    newMetadata
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

    private generateBasicInfoSection(metadata: any, t: Translations, sectionStates: { [key: string]: boolean }, displayMode: string): string {
        const isExpanded = sectionStates['basic-info'] !== false; // Default to true if not set
        const expandedClass = isExpanded ? 'expanded' : 'collapsed';
        const toggleClass = isExpanded ? '' : 'collapsed';
        const eyeOpenSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8 5.5C6.897 5.5 6 6.397 6 7.5c0 1.103.897 2 2 2s2-.897 2-2c0-1.103-.897-2-2-2zm0 3c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1z"/><path d="M8 2C4.545 2 1.584 4.373 0 7.5c1.584 3.127 4.545 5.5 8 5.5s6.416-2.373 8-5.5C14.416 4.373 11.455 2 8 2zm0 10c-2.757 0-5.287-1.822-6.766-4.5C2.713 5.322 5.243 3.5 8 3.5s5.287 1.822 6.766 4.5C13.287 10.678 10.757 12.5 8 12.5z"/></svg>';
        const eyeClosedSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1.354 2.354l12.293 12.293-.707.707L10.584 13A7.95 7.95 0 0 1 8 13.5c-3.455 0-6.416-2.373-8-5.5a8.658 8.658 0 0 1 2.995-3.484L1.354 2.939l-.707-.707.707-.878zm1.891 1.477A7.664 7.664 0 0 0 1 8c1.519 2.678 4.243 4.5 7 4.5.939 0 1.843-.178 2.668-.5l-1.523-1.523A2.988 2.988 0 0 1 8 10.5c-1.657 0-3-1.343-3-3 0-.474.113-.923.311-1.322L3.245 3.831zM8 2.5c3.455 0 6.416 2.373 8 5.5a8.658 8.658 0 0 1-2.197 3.097l-.742-.742A7.664 7.664 0 0 0 15 8c-1.519-2.678-4.243-4.5-7-4.5a7.95 7.95 0 0 0-2.668.461l-.817-.817A8.817 8.817 0 0 1 8 2.5zm-.5 3.207l2.793 2.793A2.014 2.014 0 0 0 10 7.5c0-1.103-.897-2-2-2-.174 0-.342.029-.5.086v.121zm-1.293.586A2.988 2.988 0 0 0 5 7.5c0 1.657 1.343 3 3 3 .474 0 .923-.113 1.322-.311l-.793-.793A2.014 2.014 0 0 1 8 9.5c-1.103 0-2-.897-2-2 0-.174.029-.342.086-.5l-.879-.707z"/></svg>';
        const toggleIcon = isExpanded ? eyeOpenSvg : eyeClosedSvg;

        return `
        <div class="collapsible-section">
            <div class="section-header" onclick="toggleSection('basic-info')">
                <span class="section-title">📋 ${t.basicInfo}</span>
                <span class="section-toggle ${toggleClass}" id="basic-info-toggle">${toggleIcon}</span>
            </div>
            <div class="section-content ${expandedClass}" id="basic-info-content">
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
            </div>
        </div>`;
    }    private async getImageMetadata(uri: vscode.Uri): Promise<any> {
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
                // Silently handle - this is expected for images without EXIF data
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

        // === IMAGE DESCRIPTION ===
        const imageDescription = getDescription(tags.ImageDescription);
        if (imageDescription) {
            exif.imageDescription = imageDescription;
        }

        // === CAMERA INFO ===
        const cameraMake = getDescription(tags.Make);
        if (cameraMake) {
            exif.cameraMake = cameraMake;
        }
        
        const cameraModel = getDescription(tags.Model);
        if (cameraModel) {
            exif.cameraModel = cameraModel;
        }

        // === PHOTO SETTINGS ===
        // ISO
        const iso = getDescription(tags.ISO || tags.ISOSpeedRatings);
        if (iso) {
            exif.iso = iso;
        }
        
        // Aperture (F-Number)
        if (tags.FNumber) {
            const fnumber = getDescription(tags.FNumber);
            if (fnumber) {
                exif.aperture = fnumber.includes('f/') ? fnumber : `f/${fnumber}`;
            }
        }
        
        // Aperture Value
        const apertureValue = getDescription(tags.ApertureValue);
        if (apertureValue) {
            exif.apertureValue = apertureValue;
        }
        
        // Max Aperture
        const maxAperture = getDescription(tags.MaxApertureValue);
        if (maxAperture) {
            exif.maxApertureValue = maxAperture;
        }
        
        // Shutter Speed (Exposure Time)
        const exposureTime = getDescription(tags.ExposureTime);
        if (exposureTime) {
            exif.shutterSpeed = exposureTime;
        }
        
        // Shutter Speed Value
        const shutterSpeedValue = getDescription(tags.ShutterSpeedValue);
        if (shutterSpeedValue) {
            exif.shutterSpeedValue = shutterSpeedValue;
        }
        
        // Focal Length
        if (tags.FocalLength) {
            const focal = getDescription(tags.FocalLength);
            if (focal) {
                exif.focalLength = focal.includes('mm') ? focal : `${focal}mm`;
            }
        }
        
        // Focal Length in 35mm
        const focalLength35mm = getDescription(tags.FocalLengthIn35mmFormat);
        if (focalLength35mm) {
            exif.focalLength35mm = focalLength35mm;
        }

        // Exposure Program
        const exposureProgram = getDescription(tags.ExposureProgram);
        if (exposureProgram) {
            exif.exposureProgram = exposureProgram;
        }
        
        // Exposure Mode
        const exposureMode = getDescription(tags.ExposureMode);
        if (exposureMode) {
            exif.exposureMode = exposureMode;
        }
        
        // Exposure Compensation
        const exposureCompensation = getDescription(tags.ExposureCompensation);
        if (exposureCompensation !== undefined) {
            exif.exposureCompensation = exposureCompensation;
        }

        // Metering Mode
        const meteringMode = getDescription(tags.MeteringMode);
        if (meteringMode) {
            exif.meteringMode = meteringMode;
        }

        // Flash
        const flash = getDescription(tags.Flash);
        if (flash) {
            exif.flash = flash;
        }

        // White Balance
        const whiteBalance = getDescription(tags.WhiteBalance);
        if (whiteBalance) {
            exif.whiteBalance = whiteBalance;
        }

        // Components Configuration
        const componentsConfig = getDescription(tags.ComponentsConfiguration);
        if (componentsConfig) {
            exif.componentsConfiguration = componentsConfig;
        }

        // User Comment
        const userComment = getDescription(tags.UserComment);
        if (userComment) {
            exif.userComment = userComment;
        }

        // === DATE/TIME INFO ===
        const dateTaken = getDescription(tags.DateTimeOriginal || tags.DateTime);
        if (dateTaken) {
            exif.dateTaken = dateTaken;
        }
        
        const createDate = getDescription(tags.CreateDate);
        if (createDate) {
            exif.createDate = createDate;
        }
        
        const modifyDate = getDescription(tags.ModifyDate);
        if (modifyDate) {
            exif.modifyDate = modifyDate;
        }

        // === GPS INFO ===
        const gpsLat = getDescription(tags.GPSLatitude);
        const gpsLon = getDescription(tags.GPSLongitude);
        if (gpsLat && gpsLon) {
            exif.gpsLatitude = gpsLat;
            exif.gpsLongitude = gpsLon;
        }
        
        const gpsLatRef = getDescription(tags.GPSLatitudeRef);
        if (gpsLatRef) {
            exif.gpsLatitudeRef = gpsLatRef;
        }
        
        const gpsLonRef = getDescription(tags.GPSLongitudeRef);
        if (gpsLonRef) {
            exif.gpsLongitudeRef = gpsLonRef;
        }
        
        const gpsAltitude = getDescription(tags.GPSAltitude);
        if (gpsAltitude) {
            exif.gpsAltitude = gpsAltitude;
        }
        
        const gpsAltitudeRef = getDescription(tags.GPSAltitudeRef);
        if (gpsAltitudeRef) {
            exif.gpsAltitudeRef = gpsAltitudeRef;
        }
        
        const gpsTimeStamp = getDescription(tags.GPSTimeStamp);
        if (gpsTimeStamp) {
            exif.gpsTimeStamp = gpsTimeStamp;
        }
        
        const gpsDateStamp = getDescription(tags.GPSDateStamp);
        if (gpsDateStamp) {
            exif.gpsDateStamp = gpsDateStamp;
        }
        
        const gpsSatellites = getDescription(tags.GPSSatellites);
        if (gpsSatellites) {
            exif.gpsSatellites = gpsSatellites;
        }
        
        const gpsStatus = getDescription(tags.GPSStatus);
        if (gpsStatus) {
            exif.gpsStatus = gpsStatus;
        }
        
        const gpsMeasureMode = getDescription(tags.GPSMeasureMode);
        if (gpsMeasureMode) {
            exif.gpsMeasureMode = gpsMeasureMode;
        }
        
        const gpsDOP = getDescription(tags.GPSDOP);
        if (gpsDOP) {
            exif.gpsDOP = gpsDOP;
        }
        
        const gpsSpeed = getDescription(tags.GPSSpeed);
        if (gpsSpeed !== undefined) {
            exif.gpsSpeed = gpsSpeed;
        }
        
        const gpsSpeedRef = getDescription(tags.GPSSpeedRef);
        if (gpsSpeedRef) {
            exif.gpsSpeedRef = gpsSpeedRef;
        }
        
        const gpsTrack = getDescription(tags.GPSTrack);
        if (gpsTrack !== undefined) {
            exif.gpsTrack = gpsTrack;
        }
        
        const gpsTrackRef = getDescription(tags.GPSTrackRef);
        if (gpsTrackRef) {
            exif.gpsTrackRef = gpsTrackRef;
        }
        
        const gpsImgDirection = getDescription(tags.GPSImgDirection);
        if (gpsImgDirection !== undefined) {
            exif.gpsImgDirection = gpsImgDirection;
        }
        
        const gpsImgDirectionRef = getDescription(tags.GPSImgDirectionRef);
        if (gpsImgDirectionRef) {
            exif.gpsImgDirectionRef = gpsImgDirectionRef;
        }
        
        const gpsMapDatum = getDescription(tags.GPSMapDatum);
        if (gpsMapDatum) {
            exif.gpsMapDatum = gpsMapDatum;
        }
        
        const gpsDestLatitude = getDescription(tags.GPSDestLatitude);
        if (gpsDestLatitude) {
            exif.gpsDestLatitude = gpsDestLatitude;
        }
        
        const gpsDestLatitudeRef = getDescription(tags.GPSDestLatitudeRef);
        if (gpsDestLatitudeRef) {
            exif.gpsDestLatitudeRef = gpsDestLatitudeRef;
        }
        
        const gpsDestLongitude = getDescription(tags.GPSDestLongitude);
        if (gpsDestLongitude) {
            exif.gpsDestLongitude = gpsDestLongitude;
        }
        
        const gpsDestLongitudeRef = getDescription(tags.GPSDestLongitudeRef);
        if (gpsDestLongitudeRef) {
            exif.gpsDestLongitudeRef = gpsDestLongitudeRef;
        }
        
        const gpsDestBearing = getDescription(tags.GPSDestBearing);
        if (gpsDestBearing !== undefined) {
            exif.gpsDestBearing = gpsDestBearing;
        }
        
        const gpsDestBearingRef = getDescription(tags.GPSDestBearingRef);
        if (gpsDestBearingRef) {
            exif.gpsDestBearingRef = gpsDestBearingRef;
        }
        
        const gpsDestDistance = getDescription(tags.GPSDestDistance);
        if (gpsDestDistance !== undefined) {
            exif.gpsDestDistance = gpsDestDistance;
        }
        
        const gpsDestDistanceRef = getDescription(tags.GPSDestDistanceRef);
        if (gpsDestDistanceRef) {
            exif.gpsDestDistanceRef = gpsDestDistanceRef;
        }
        
        const gpsDifferential = getDescription(tags.GPSDifferential);
        if (gpsDifferential) {
            exif.gpsDifferential = gpsDifferential;
        }
        
        const gpsVersionID = getDescription(tags.GPSVersionID);
        if (gpsVersionID) {
            exif.gpsVersionID = gpsVersionID;
        }

        // === IMAGE INFO ===
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
        
        const artist = getDescription(tags.Artist);
        if (artist) {
            exif.artist = artist;
        }
        
        const copyright = getDescription(tags.Copyright);
        if (copyright) {
            exif.copyright = copyright;
        }
        
        const compression = getDescription(tags.Compression);
        if (compression) {
            exif.compression = compression;
        }
        
        const yCbCrPositioning = getDescription(tags.YCbCrPositioning);
        if (yCbCrPositioning) {
            exif.yCbCrPositioning = yCbCrPositioning;
        }

        // === LENS INFO ===
        const lensMake = getDescription(tags.LensMake);
        if (lensMake) {
            exif.lensMake = lensMake;
        }
        
        const lensModel = getDescription(tags.LensModel);
        if (lensModel) {
            exif.lensModel = lensModel;
        }
        
        const lensSerialNumber = getDescription(tags.LensSerialNumber);
        if (lensSerialNumber) {
            exif.lensSerialNumber = lensSerialNumber;
        }
        
        const ownerName = getDescription(tags.OwnerName);
        if (ownerName) {
            exif.ownerName = ownerName;
        }

        // === VERSION INFO ===
        const exifVersion = getDescription(tags.ExifVersion);
        if (exifVersion) {
            exif.exifVersion = exifVersion;
        }
        
        const flashpixVersion = getDescription(tags.FlashpixVersion);
        if (flashpixVersion) {
            exif.flashpixVersion = flashpixVersion;
        }
        
        const interopIndex = getDescription(tags.InteropIndex);
        if (interopIndex) {
            exif.interopIndex = interopIndex;
        }
        
        const interopVersion = getDescription(tags.InteropVersion);
        if (interopVersion) {
            exif.interopVersion = interopVersion;
        }

        // === BIT DEPTH INFORMATION ===
        const bitsPerSample = getDescription(tags.BitsPerSample);
        if (bitsPerSample) {
            exif.bitsPerSample = bitsPerSample;
        }

        const samplesPerPixel = getDescription(tags.SamplesPerPixel);
        if (samplesPerPixel) {
            exif.samplesPerPixel = samplesPerPixel;
        }

        // === DPI/PPI INFORMATION ===
        const xResolution = tags.XResolution?.value || tags.XResolution?.description;
        const yResolution = tags.YResolution?.value || tags.YResolution?.description;
        const resolutionUnit = tags.ResolutionUnit?.description || tags.ResolutionUnit?.value;
        
        if (xResolution && yResolution) {
            exif.xResolution = xResolution;
            exif.yResolution = yResolution;
            exif.resolutionUnit = resolutionUnit || 'inches';
            
            const unit = resolutionUnit === '3' || resolutionUnit === 'cm' ? 'pixels/cm' : 'DPI';
            if (xResolution === yResolution) {
                exif.dpi = `${xResolution} ${unit}`;
            } else {
                exif.dpi = `${xResolution} x ${yResolution} ${unit}`;
            }
        }

        return Object.keys(exif).length > 0 ? exif : null;
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

    private getHtmlForWebview(
        webview: vscode.Webview,
        imageUri: vscode.Uri,
        metadata: any
    ): string {
        // Convert the image URI to a webview URI
        const imageWebviewUri = webview.asWebviewUri(imageUri);
        const t = this.getTranslations();
        const sectionStates = this.getSectionStates();
        const displayMode = this.getDisplayMode();

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
            flex-direction: column;
            background-color: var(--vscode-editor-background);
            overflow: hidden;
        }
        .image-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            padding: 20px;
            min-height: 0;
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
            flex-shrink: 0;
            background-color: var(--vscode-editor-background);
            border-top: 1px solid var(--vscode-panel-border);
            padding: 12px 20px;
            display: flex;
            gap: 4px;
            justify-content: center;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
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
        .remove-exif-button {
            width: 100%;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .remove-exif-button:hover {
            background-color: var(--vscode-button-hoverBackground);
            color: var(--vscode-button-foreground);
        }
        .remove-exif-button:active {
            transform: scale(0.98);
        }
        .remove-exif-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        /* View JSON button styles */
        .view-json-button {
            width: 100%;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .view-json-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .view-json-button:active {
            transform: scale(0.98);
        }
        
        /* JSON Modal styles */
        .json-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        .json-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .json-modal-content {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        .json-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .json-modal-header h2 {
            margin: 0;
            font-size: 16px;
            color: var(--vscode-foreground);
        }
        .json-modal-close {
            background: none;
            border: none;
            color: var(--vscode-foreground);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }
        .json-modal-close:hover {
            background-color: var(--vscode-toolbar-hoverBackground);
        }
        .json-modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .json-modal-body pre {
            margin: 0;
            padding: 12px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            line-height: 1.6;
            overflow-x: auto;
            color: var(--vscode-editor-foreground);
        }
        .json-modal-footer {
            padding: 16px 20px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .json-copy-button,
        .json-close-button {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .json-copy-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid var(--vscode-button-border);
        }
        .json-copy-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .json-close-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-button-border);
        }
        .json-close-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        /* Support section styles */
        .support-section {
            margin: 24px 0;
            padding: 16px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 8px;
            text-align: center;
        }
        .support-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--vscode-foreground);
            margin-bottom: 12px;
        }
        .support-buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        .support-link {
            display: inline-block;
            text-decoration: none;
            transition: transform 0.2s ease;
        }
        .support-link:hover {
            transform: scale(1.05);
        }
        .support-button-img {
            height: 45px;
            width: auto;
            border-radius: 4px;
        }
        .support-text {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
        }
        
        /* Collapsible sections styles */
        .collapsible-section {
            margin: 20px 0;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .collapsible-section.collapsed {
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background-color: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-widget-border);
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        .section-header:hover {
            background-color: var(--vscode-list-hoverBackground);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .section-title {
            font-weight: 600;
            font-size: 14px;
            color: var(--vscode-foreground);
        }
        .section-toggle {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
        }
        .section-toggle.collapsed {
            
        }
        .section-content {
            padding: 0;
            background-color: var(--vscode-editor-background);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            opacity: 1;
        }
        .section-content.expanded {
            max-height: 10000px;
            opacity: 1;
            padding: 8px 0;
        }
        .section-content.collapsed {
            max-height: 0;
            opacity: 0;
            padding: 0;
        }
        .section-content .metadata-item {
            margin: 0 16px 12px 16px;
            transform: translateY(0);
            transition: all 0.3s ease;
        }
        .section-content.collapsed .metadata-item {
            transform: translateY(-10px);
            opacity: 0;
        }
        .section-content h3 {
            margin: 16px 16px 12px 16px;
        }
        
        /* List mode styles */
        .list-mode .collapsible-section {
            border: none;
            margin: 0;
            border-radius: 0;
        }
        .list-mode .section-header {
            display: none;
        }
        .list-mode .section-content {
            max-height: none !important;
            opacity: 1 !important;
            padding: 0 !important;
            background-color: transparent;
        }
        .list-mode .section-content .metadata-item {
            transform: none !important;
            opacity: 1 !important;
            margin: 0 0 16px 0;
        }
        .list-mode .section-content h3 {
            margin: 20px 0 12px 0;
        }
        
        /* Display mode toggle */
        .display-mode-toggle {
            margin-bottom: 20px;
            padding: 12px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .display-mode-toggle label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-right: 8px;
        }
        .mode-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
        }
        .mode-button.active {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .mode-button:hover:not(.active) {
            background-color: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container" id="imageContainer">
            <div class="image-wrapper">
                <img src="${imageWebviewUri}" alt="Image Preview" id="imagePreview" />
            </div>
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
            
            <!-- Display Mode Toggle -->
            <div class="display-mode-toggle">
                <label>${t.sectionSettings}:</label>
                <button class="mode-button ${displayMode === 'accordion' ? 'active' : ''}" onclick="setDisplayMode('accordion')">${t.accordionMode}</button>
                <button class="mode-button ${displayMode === 'list' ? 'active' : ''}" onclick="setDisplayMode('list')">${t.listMode}</button>
            </div>
            
            <!-- Thumbnail Preview -->
            <div class="thumbnail-container">
                <div class="metadata-label">🖼️ ${t.thumbnail}</div>
                <div class="thumbnail-preview">
                    <img src="${imageWebviewUri}" alt="Thumbnail" class="thumbnail-image">
                </div>
                ${metadata.exif ? `<button class="remove-exif-button" onclick="removeExifData()" id="removeExifBtn">
                    🗑️ ${t.removeExif}
                </button>` : ''}
                <button class="view-json-button" onclick="viewJsonMetadata()">
                    📋 ${t.viewJsonMetadata}
                </button>
            </div>
            
            <div class="${displayMode === 'list' ? 'list-mode' : ''}">
                <!-- Basic Information Section -->
                ${this.generateBasicInfoSection(metadata, t, sectionStates, displayMode)}
                
                ${this.generateColorInfoHtml(metadata.colorInfo, t, sectionStates, displayMode)}
                
                ${metadata.exif ? this.generateExifHtml(metadata.exif, t, sectionStates, displayMode) : ''}
            </div>
            
            <!-- Support Section -->
            <div class="support-section">
                <div class="support-title">💖 Support this Extension</div>
                <div class="support-buttons">
                    <a href="https://www.buymeacoffee.com/neuronioazul" target="_blank" class="support-link">
                        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" class="support-button-img" style="height: 30px;" />
                    </a>
                </div>
                <div class="support-text">If you find this extension helpful, <br>consider supporting its development!</div>
            </div>
            
            <p><br><br></p>
        </div>
    </div>
    
    <div class="copy-feedback" id="copyFeedback">
        ✅ ${t.copied}!
    </div>
    
    <!-- JSON Modal -->
    <div class="json-modal" id="jsonModal">
        <div class="json-modal-content">
            <div class="json-modal-header">
                <h2>${t.metadataJson}</h2>
                <button class="json-modal-close" onclick="closeJsonModal()">✕</button>
            </div>
            <div class="json-modal-body">
                <pre id="jsonContent"></pre>
            </div>
            <div class="json-modal-footer">
                <button class="json-copy-button" onclick="copyJsonMetadata()">
                    📋 ${t.copyJson}
                </button>
                <button class="json-close-button" onclick="closeJsonModal()">
                    ${t.closeModal}
                </button>
            </div>
        </div>
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
            const imageWrapper = document.querySelector('.image-wrapper');
            const wrapperRect = imageWrapper.getBoundingClientRect();
            const imageRect = imagePreview.getBoundingClientRect();
            
            // Get original image dimensions (without current zoom)
            const originalWidth = imageRect.width / currentZoom;
            const originalHeight = imageRect.height / currentZoom;
            
            // Calculate available space (considering padding)
            const availableWidth = wrapperRect.width - 40;
            const availableHeight = wrapperRect.height - 40;
            
            // Calculate scale to fit
            const scaleX = availableWidth / originalWidth;
            const scaleY = availableHeight / originalHeight;
            
            // Use the smaller scale to ensure image fits completely
            updateZoom(Math.min(scaleX, scaleY, 1));
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

        // Collapsible sections functionality
        function toggleSection(sectionId) {
            const content = document.getElementById(sectionId + '-content');
            const toggle = document.getElementById(sectionId + '-toggle');
            
            if (content && toggle) {
                const isExpanded = content.classList.contains('expanded');
                
                const eyeOpenSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8 5.5C6.897 5.5 6 6.397 6 7.5c0 1.103.897 2 2 2s2-.897 2-2c0-1.103-.897-2-2-2zm0 3c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1z"/><path d="M8 2C4.545 2 1.584 4.373 0 7.5c1.584 3.127 4.545 5.5 8 5.5s6.416-2.373 8-5.5C14.416 4.373 11.455 2 8 2zm0 10c-2.757 0-5.287-1.822-6.766-4.5C2.713 5.322 5.243 3.5 8 3.5s5.287 1.822 6.766 4.5C13.287 10.678 10.757 12.5 8 12.5z"/></svg>';
                const eyeClosedSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1.354 2.354l12.293 12.293-.707.707L10.584 13A7.95 7.95 0 0 1 8 13.5c-3.455 0-6.416-2.373-8-5.5a8.658 8.658 0 0 1 2.995-3.484L1.354 2.939l-.707-.707.707-.878zm1.891 1.477A7.664 7.664 0 0 0 1 8c1.519 2.678 4.243 4.5 7 4.5.939 0 1.843-.178 2.668-.5l-1.523-1.523A2.988 2.988 0 0 1 8 10.5c-1.657 0-3-1.343-3-3 0-.474.113-.923.311-1.322L3.245 3.831zM8 2.5c3.455 0 6.416 2.373 8 5.5a8.658 8.658 0 0 1-2.197 3.097l-.742-.742A7.664 7.664 0 0 0 15 8c-1.519-2.678-4.243-4.5-7-4.5a7.95 7.95 0 0 0-2.668.461l-.817-.817A8.817 8.817 0 0 1 8 2.5zm-.5 3.207l2.793 2.793A2.014 2.014 0 0 0 10 7.5c0-1.103-.897-2-2-2-.174 0-.342.029-.5.086v.121zm-1.293.586A2.988 2.988 0 0 0 5 7.5c0 1.657 1.343 3 3 3 .474 0 .923-.113 1.322-.311l-.793-.793A2.014 2.014 0 0 1 8 9.5c-1.103 0-2-.897-2-2 0-.174.029-.342.086-.5l-.879-.707z"/></svg>';
                
                if (isExpanded) {
                    content.classList.remove('expanded');
                    content.classList.add('collapsed');
                    toggle.classList.add('collapsed');
                    toggle.innerHTML = eyeClosedSvg;
                } else {
                    content.classList.remove('collapsed');
                    content.classList.add('expanded');
                    toggle.classList.remove('collapsed');
                    toggle.innerHTML = eyeOpenSvg;
                }
                
                // Save state to extension
                vscode.postMessage({
                    command: 'toggleSection',
                    sectionId: sectionId,
                    isExpanded: !isExpanded
                });
            }
        }

        // Display mode functionality
        function setDisplayMode(mode) {
            vscode.postMessage({
                command: 'setDisplayMode',
                mode: mode
            });
        }

        // Remove EXIF data functionality
        function removeExifData() {
            const btn = document.getElementById('removeExifBtn');
            if (btn) {
                btn.disabled = true;
                btn.textContent = '⏳ Processing...';
            }
            
            vscode.postMessage({
                command: 'removeExif'
            });
        }
        
        // View JSON metadata functionality
        function viewJsonMetadata() {
            vscode.postMessage({
                command: 'viewJsonMetadata'
            });
        }
        
        // Close JSON modal
        function closeJsonModal() {
            const modal = document.getElementById('jsonModal');
            if (modal) {
                modal.classList.remove('show');
            }
        }
        
        // Copy JSON metadata
        function copyJsonMetadata() {
            const jsonContent = document.getElementById('jsonContent');
            if (jsonContent) {
                const text = jsonContent.textContent;
                vscode.postMessage({
                    command: 'copy',
                    text: text
                });
                
                // Show feedback
                const feedback = document.getElementById('copyFeedback');
                if (feedback) {
                    feedback.textContent = '✅ JSON ' + copiedText + '!';
                    feedback.classList.add('show');
                    setTimeout(() => {
                        feedback.classList.remove('show');
                    }, 2000);
                }
            }
        }

        // Make functions available globally
        window.toggleSection = toggleSection;
        window.setDisplayMode = setDisplayMode;
        window.removeExifData = removeExifData;
        window.viewJsonMetadata = viewJsonMetadata;
        window.closeJsonModal = closeJsonModal;
        window.copyJsonMetadata = copyJsonMetadata;
        
        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'resetRemoveExifButton':
                    const btn = document.getElementById('removeExifBtn');
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = '🗑️ ${t.removeExif}';
                    }
                    break;
                case 'showJsonModal':
                    const modal = document.getElementById('jsonModal');
                    const jsonContent = document.getElementById('jsonContent');
                    if (modal && jsonContent && message.metadata) {
                        jsonContent.textContent = JSON.stringify(message.metadata, null, 2);
                        modal.classList.add('show');
                    }
                    break;
            }
        });
        
        // Initialize section states based on saved preferences
        document.addEventListener('DOMContentLoaded', function() {
            // Section states are already set server-side, no need to re-initialize
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

    private generateColorInfoHtml(colorInfo: any, t: Translations, sectionStates: { [key: string]: boolean } = {}, displayMode: string = 'accordion'): string {
        if (!colorInfo || Object.keys(colorInfo).length === 0) {
            return '';
        }

        const isExpanded = sectionStates['color-info'] !== undefined ? sectionStates['color-info'] : false;
        const expandedClass = isExpanded ? 'expanded' : 'collapsed';
        const toggleClass = isExpanded ? '' : 'collapsed';
        const eyeOpenSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8 5.5C6.897 5.5 6 6.397 6 7.5c0 1.103.897 2 2 2s2-.897 2-2c0-1.103-.897-2-2-2zm0 3c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1z"/><path d="M8 2C4.545 2 1.584 4.373 0 7.5c1.584 3.127 4.545 5.5 8 5.5s6.416-2.373 8-5.5C14.416 4.373 11.455 2 8 2zm0 10c-2.757 0-5.287-1.822-6.766-4.5C2.713 5.322 5.243 3.5 8 3.5s5.287 1.822 6.766 4.5C13.287 10.678 10.757 12.5 8 12.5z"/></svg>';
        const eyeClosedSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1.354 2.354l12.293 12.293-.707.707L10.584 13A7.95 7.95 0 0 1 8 13.5c-3.455 0-6.416-2.373-8-5.5a8.658 8.658 0 0 1 2.995-3.484L1.354 2.939l-.707-.707.707-.878zm1.891 1.477A7.664 7.664 0 0 0 1 8c1.519 2.678 4.243 4.5 7 4.5.939 0 1.843-.178 2.668-.5l-1.523-1.523A2.988 2.988 0 0 1 8 10.5c-1.657 0-3-1.343-3-3 0-.474.113-.923.311-1.322L3.245 3.831zM8 2.5c3.455 0 6.416 2.373 8 5.5a8.658 8.658 0 0 1-2.197 3.097l-.742-.742A7.664 7.664 0 0 0 15 8c-1.519-2.678-4.243-4.5-7-4.5a7.95 7.95 0 0 0-2.668.461l-.817-.817A8.817 8.817 0 0 1 8 2.5zm-.5 3.207l2.793 2.793A2.014 2.014 0 0 0 10 7.5c0-1.103-.897-2-2-2-.174 0-.342.029-.5.086v.121zm-1.293.586A2.988 2.988 0 0 0 5 7.5c0 1.657 1.343 3 3 3 .474 0 .923-.113 1.322-.311l-.793-.793A2.014 2.014 0 0 1 8 9.5c-1.103 0-2-.897-2-2 0-.174.029-.342.086-.5l-.879-.707z"/></svg>';
        const toggleIcon = isExpanded ? eyeOpenSvg : eyeClosedSvg;

        let html = `
        <div class="collapsible-section">
            <div class="section-header" onclick="toggleSection('color-info')">
                <span class="section-title">🎨 ${t.colorInformation}</span>
                <span class="section-toggle ${toggleClass}" id="color-info-toggle">${toggleIcon}</span>
            </div>
            <div class="section-content ${expandedClass}" id="color-info-content">`;

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

        html += `
            </div>
        </div>`;
        return html;
    }

    private generateExifHtml(exif: any, t: Translations, sectionStates: { [key: string]: boolean } = {}, displayMode: string = 'accordion'): string {
        const isExpanded = sectionStates['exif-data'] !== undefined ? sectionStates['exif-data'] : false;
        const expandedClass = isExpanded ? 'expanded' : 'collapsed';
        const toggleClass = isExpanded ? '' : 'collapsed';
        const eyeOpenSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8 5.5C6.897 5.5 6 6.397 6 7.5c0 1.103.897 2 2 2s2-.897 2-2c0-1.103-.897-2-2-2zm0 3c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1z"/><path d="M8 2C4.545 2 1.584 4.373 0 7.5c1.584 3.127 4.545 5.5 8 5.5s6.416-2.373 8-5.5C14.416 4.373 11.455 2 8 2zm0 10c-2.757 0-5.287-1.822-6.766-4.5C2.713 5.322 5.243 3.5 8 3.5s5.287 1.822 6.766 4.5C13.287 10.678 10.757 12.5 8 12.5z"/></svg>';
        const eyeClosedSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M1.354 2.354l12.293 12.293-.707.707L10.584 13A7.95 7.95 0 0 1 8 13.5c-3.455 0-6.416-2.373-8-5.5a8.658 8.658 0 0 1 2.995-3.484L1.354 2.939l-.707-.707.707-.878zm1.891 1.477A7.664 7.664 0 0 0 1 8c1.519 2.678 4.243 4.5 7 4.5.939 0 1.843-.178 2.668-.5l-1.523-1.523A2.988 2.988 0 0 1 8 10.5c-1.657 0-3-1.343-3-3 0-.474.113-.923.311-1.322L3.245 3.831zM8 2.5c3.455 0 6.416 2.373 8 5.5a8.658 8.658 0 0 1-2.197 3.097l-.742-.742A7.664 7.664 0 0 0 15 8c-1.519-2.678-4.243-4.5-7-4.5a7.95 7.95 0 0 0-2.668.461l-.817-.817A8.817 8.817 0 0 1 8 2.5zm-.5 3.207l2.793 2.793A2.014 2.014 0 0 0 10 7.5c0-1.103-.897-2-2-2-.174 0-.342.029-.5.086v.121zm-1.293.586A2.988 2.988 0 0 0 5 7.5c0 1.657 1.343 3 3 3 .474 0 .923-.113 1.322-.311l-.793-.793A2.014 2.014 0 0 1 8 9.5c-1.103 0-2-.897-2-2 0-.174.029-.342.086-.5l-.879-.707z"/></svg>';
        const toggleIcon = isExpanded ? eyeOpenSvg : eyeClosedSvg;

        let html = `
        <div class="collapsible-section">
            <div class="section-header" onclick="toggleSection('exif-data')">
                <span class="section-title">📷 ${t.exifData}</span>
                <span class="section-toggle ${toggleClass}" id="exif-data-toggle">${toggleIcon}</span>
            </div>
            <div class="section-content ${expandedClass}" id="exif-data-content">`;

        // === IMAGE DESCRIPTION ===
        if (exif.imageDescription) {
            html += `
            <div class="metadata-item">
                <div class="metadata-label">📝 ${t.imageDescription}</div>
                <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.imageDescription)}')">${this.escapeHtml(exif.imageDescription)}</div>
            </div>`;
        }

        // === CAMERA INFORMATION ===
        if (exif.cameraMake || exif.cameraModel || exif.ownerName) {
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
            
            if (exif.ownerName) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">👤 ${t.ownerName}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.ownerName)}')">${this.escapeHtml(exif.ownerName)}</div>
                </div>`;
            }
        }

        // === LENS INFORMATION ===
        if (exif.lensMake || exif.lensModel || exif.lensSerialNumber) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">🔭 ${t.lens}</h3>`;
            
            if (exif.lensMake) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🏭 ${t.lensMake}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.lensMake)}')">${this.escapeHtml(exif.lensMake)}</div>
                </div>`;
            }
            
            if (exif.lensModel) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔭 ${t.lensModel}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.lensModel)}')">${this.escapeHtml(exif.lensModel)}</div>
                </div>`;
            }
            
            if (exif.lensSerialNumber) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔢 ${t.lensSerialNumber}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.lensSerialNumber)}')">${this.escapeHtml(exif.lensSerialNumber)}</div>
                </div>`;
            }
        }

        // === PHOTO SETTINGS ===
        if (exif.iso || exif.aperture || exif.apertureValue || exif.maxApertureValue || exif.shutterSpeed || exif.shutterSpeedValue || exif.focalLength || exif.focalLength35mm || exif.exposureProgram || exif.exposureMode || exif.exposureCompensation !== undefined || exif.meteringMode || exif.flash || exif.whiteBalance || exif.componentsConfiguration || exif.userComment) {
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
                    <div class="metadata-label">🔍 ${t.aperture} (F-Number)</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.aperture)}')">${this.escapeHtml(exif.aperture)}</div>
                </div>`;
            }
            
            if (exif.apertureValue) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔍 ${t.apertureValue}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.apertureValue)}')">${this.escapeHtml(exif.apertureValue)}</div>
                </div>`;
            }
            
            if (exif.maxApertureValue) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔍 ${t.maxAperture}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.maxApertureValue)}')">${this.escapeHtml(exif.maxApertureValue)}</div>
                </div>`;
            }
            
            if (exif.shutterSpeed) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚡ ${t.shutterSpeed} (${t.exposureTime})</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.shutterSpeed)}')">${this.escapeHtml(exif.shutterSpeed)}</div>
                </div>`;
            }
            
            if (exif.shutterSpeedValue) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚡ ${t.shutterSpeedValue}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.shutterSpeedValue)}')">${this.escapeHtml(exif.shutterSpeedValue)}</div>
                </div>`;
            }
            
            if (exif.focalLength) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.focalLength}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.focalLength)}')">${this.escapeHtml(exif.focalLength)}</div>
                </div>`;
            }
            
            if (exif.focalLength35mm) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.focalLength35mm}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.focalLength35mm)}')">${this.escapeHtml(exif.focalLength35mm)}</div>
                </div>`;
            }
            
            if (exif.exposureProgram) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.exposureProgram}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.exposureProgram)}')">${this.escapeHtml(exif.exposureProgram)}</div>
                </div>`;
            }
            
            if (exif.exposureMode) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.exposureMode}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.exposureMode)}')">${this.escapeHtml(exif.exposureMode)}</div>
                </div>`;
            }
            
            if (exif.exposureCompensation !== undefined) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.exposureCompensation}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.exposureCompensation)}')">${this.escapeHtml(exif.exposureCompensation)}</div>
                </div>`;
            }
            
            if (exif.meteringMode) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.meteringMode}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.meteringMode)}')">${this.escapeHtml(exif.meteringMode)}</div>
                </div>`;
            }
            
            if (exif.flash) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚡ ${t.flash}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.flash)}')">${this.escapeHtml(exif.flash)}</div>
                </div>`;
            }
            
            if (exif.whiteBalance) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚖️ ${t.whiteBalance}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.whiteBalance)}')">${this.escapeHtml(exif.whiteBalance)}</div>
                </div>`;
            }
            
            if (exif.componentsConfiguration) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔧 ${t.componentsConfiguration}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.componentsConfiguration)}')">${this.escapeHtml(exif.componentsConfiguration)}</div>
                </div>`;
            }
            
            if (exif.userComment) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">💬 ${t.userComment}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.userComment)}')">${this.escapeHtml(exif.userComment)}</div>
                </div>`;
            }
        }

        // === DATE & TIME INFORMATION ===
        if (exif.dateTaken || exif.createDate || exif.modifyDate) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.date}</h3>`;
            
            if (exif.dateTaken) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.dateTaken} (Original)</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.dateTaken)}')">${this.escapeHtml(exif.dateTaken)}</div>
                </div>`;
            }
            
            if (exif.createDate) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.createDate}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.createDate)}')">${this.escapeHtml(exif.createDate)}</div>
                </div>`;
            }
            
            if (exif.modifyDate) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.modifyDate}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.modifyDate)}')">${this.escapeHtml(exif.modifyDate)}</div>
                </div>`;
            }
        }

        // === GPS INFORMATION ===
        const hasGPS = exif.gpsLatitude || exif.gpsLongitude || exif.gpsAltitude || exif.gpsTimeStamp || exif.gpsDateStamp || 
                       exif.gpsSatellites || exif.gpsStatus || exif.gpsMeasureMode || exif.gpsDOP || exif.gpsSpeed !== undefined || 
                       exif.gpsTrack !== undefined || exif.gpsImgDirection !== undefined || exif.gpsMapDatum || 
                       exif.gpsDestLatitude || exif.gpsDestLongitude || exif.gpsDestBearing !== undefined || 
                       exif.gpsDestDistance !== undefined || exif.gpsDifferential || exif.gpsVersionID;
        
        if (hasGPS) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.location} (${t.gps})</h3>`;
            
            if (exif.gpsVersionID) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔖 ${t.gpsVersionId}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsVersionID)}')">${this.escapeHtml(exif.gpsVersionID)}</div>
                </div>`;
            }
            
            if (exif.gpsLatitude) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.latitude}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsLatitude)}')">${this.escapeHtml(exif.gpsLatitude)}</div>
                </div>`;
            }
            
            if (exif.gpsLatitudeRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.latitudeRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsLatitudeRef)}')">${this.escapeHtml(exif.gpsLatitudeRef)}</div>
                </div>`;
            }
            
            if (exif.gpsLongitude) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.longitude}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsLongitude)}')">${this.escapeHtml(exif.gpsLongitude)}</div>
                </div>`;
            }
            
            if (exif.gpsLongitudeRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.longitudeRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsLongitudeRef)}')">${this.escapeHtml(exif.gpsLongitudeRef)}</div>
                </div>`;
            }
            
            if (exif.gpsAltitude) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⛰️ ${t.gpsAltitude}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsAltitude)}')">${this.escapeHtml(exif.gpsAltitude)}</div>
                </div>`;
            }
            
            if (exif.gpsAltitudeRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⛰️ ${t.altitudeRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsAltitudeRef)}')">${this.escapeHtml(exif.gpsAltitudeRef)}</div>
                </div>`;
            }
            
            if (exif.gpsTimeStamp) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">⏰ ${t.gpsTimeStamp}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsTimeStamp)}')">${this.escapeHtml(exif.gpsTimeStamp)}</div>
                </div>`;
            }
            
            if (exif.gpsDateStamp) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.gpsDateStamp}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDateStamp)}')">${this.escapeHtml(exif.gpsDateStamp)}</div>
                </div>`;
            }
            
            if (exif.gpsSatellites) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🛰️ ${t.gpsSatellites}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsSatellites)}')">${this.escapeHtml(exif.gpsSatellites)}</div>
                </div>`;
            }
            
            if (exif.gpsStatus) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📡 ${t.gpsStatus}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsStatus)}')">${this.escapeHtml(exif.gpsStatus)}</div>
                </div>`;
            }
            
            if (exif.gpsMeasureMode) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📐 ${t.gpsMeasureMode}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsMeasureMode)}')">${this.escapeHtml(exif.gpsMeasureMode)}</div>
                </div>`;
            }
            
            if (exif.gpsDOP) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.gpsDOP}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDOP)}')">${this.escapeHtml(exif.gpsDOP)}</div>
                </div>`;
            }
            
            if (exif.gpsSpeed !== undefined) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🚗 ${t.gpsSpeed}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsSpeed)}')">${this.escapeHtml(exif.gpsSpeed)}</div>
                </div>`;
            }
            
            if (exif.gpsSpeedRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🚗 ${t.gpsSpeedRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsSpeedRef)}')">${this.escapeHtml(exif.gpsSpeedRef)}</div>
                </div>`;
            }
            
            if (exif.gpsTrack !== undefined) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🧭 ${t.gpsTrack}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsTrack)}')">${this.escapeHtml(exif.gpsTrack)}</div>
                </div>`;
            }
            
            if (exif.gpsTrackRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🧭 ${t.gpsTrackRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsTrackRef)}')">${this.escapeHtml(exif.gpsTrackRef)}</div>
                </div>`;
            }
            
            if (exif.gpsImgDirection !== undefined) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📷 ${t.gpsImgDirection}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsImgDirection)}')">${this.escapeHtml(exif.gpsImgDirection)}</div>
                </div>`;
            }
            
            if (exif.gpsImgDirectionRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📷 ${t.gpsImgDirectionRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsImgDirectionRef)}')">${this.escapeHtml(exif.gpsImgDirectionRef)}</div>
                </div>`;
            }
            
            if (exif.gpsMapDatum) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🗺️ ${t.gpsMapDatum}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsMapDatum)}')">${this.escapeHtml(exif.gpsMapDatum)}</div>
                </div>`;
            }
            
            if (exif.gpsDestLatitude) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestLatitude}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestLatitude)}')">${this.escapeHtml(exif.gpsDestLatitude)}</div>
                </div>`;
            }
            
            if (exif.gpsDestLatitudeRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestLatitudeRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestLatitudeRef)}')">${this.escapeHtml(exif.gpsDestLatitudeRef)}</div>
                </div>`;
            }
            
            if (exif.gpsDestLongitude) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestLongitude}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestLongitude)}')">${this.escapeHtml(exif.gpsDestLongitude)}</div>
                </div>`;
            }
            
            if (exif.gpsDestLongitudeRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestLongitudeRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestLongitudeRef)}')">${this.escapeHtml(exif.gpsDestLongitudeRef)}</div>
                </div>`;
            }
            
            if (exif.gpsDestBearing !== undefined) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestBearing}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestBearing)}')">${this.escapeHtml(exif.gpsDestBearing)}</div>
                </div>`;
            }
            
            if (exif.gpsDestBearingRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestBearingRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestBearingRef)}')">${this.escapeHtml(exif.gpsDestBearingRef)}</div>
                </div>`;
            }
            
            if (exif.gpsDestDistance !== undefined) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestDistance}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestDistance)}')">${this.escapeHtml(exif.gpsDestDistance)}</div>
                </div>`;
            }
            
            if (exif.gpsDestDistanceRef) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestDistanceRef}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDestDistanceRef)}')">${this.escapeHtml(exif.gpsDestDistanceRef)}</div>
                </div>`;
            }
            
            if (exif.gpsDifferential) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.gpsDifferential}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.gpsDifferential)}')">${this.escapeHtml(exif.gpsDifferential)}</div>
                </div>`;
            }
        }

        // === IMAGE TECHNICAL INFO ===
        if (exif.orientation || exif.colorSpace || exif.software || exif.artist || exif.copyright || exif.compression || exif.yCbCrPositioning || exif.exifVersion || exif.flashpixVersion || exif.interopIndex || exif.interopVersion || exif.xResolution || exif.yResolution || exif.resolutionUnit) {
            html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.additionalInfo}</h3>`;
            
            if (exif.compression) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🗜️ Compression</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.compression)}')">${this.escapeHtml(exif.compression)}</div>
                </div>`;
            }
            
            if (exif.orientation) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔄 ${t.orientation}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.orientation)}')">${this.escapeHtml(exif.orientation)}</div>
                </div>`;
            }
            
            if (exif.xResolution) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.xResolution}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.xResolution)}')">${this.escapeHtml(exif.xResolution)}</div>
                </div>`;
            }
            
            if (exif.yResolution) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.yResolution}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.yResolution)}')">${this.escapeHtml(exif.yResolution)}</div>
                </div>`;
            }
            
            if (exif.resolutionUnit) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.resolutionUnit}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.resolutionUnit)}')">${this.escapeHtml(exif.resolutionUnit)}</div>
                </div>`;
            }
            
            if (exif.colorSpace) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.colorSpace}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.colorSpace)}')">${this.escapeHtml(exif.colorSpace)}</div>
                </div>`;
            }
            
            if (exif.yCbCrPositioning) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.yCbCrPositioning}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.yCbCrPositioning)}')">${this.escapeHtml(exif.yCbCrPositioning)}</div>
                </div>`;
            }
            
            if (exif.software) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">💻 ${t.software}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.software)}')">${this.escapeHtml(exif.software)}</div>
                </div>`;
            }
            
            if (exif.artist) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.artist}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.artist)}')">${this.escapeHtml(exif.artist)}</div>
                </div>`;
            }
            
            if (exif.copyright) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">©️ ${t.copyright}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.copyright)}')">${this.escapeHtml(exif.copyright)}</div>
                </div>`;
            }
            
            if (exif.exifVersion) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔖 ${t.exifVersion}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.exifVersion)}')">${this.escapeHtml(exif.exifVersion)}</div>
                </div>`;
            }
            
            if (exif.flashpixVersion) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔖 ${t.flashpixVersion}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.flashpixVersion)}')">${this.escapeHtml(exif.flashpixVersion)}</div>
                </div>`;
            }
            
            if (exif.interopIndex) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔗 ${t.interopIndex}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.interopIndex)}')">${this.escapeHtml(exif.interopIndex)}</div>
                </div>`;
            }
            
            if (exif.interopVersion) {
                html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔗 ${t.interopVersion}</div>
                    <div class="metadata-value" title="${t.clickToCopy}" onclick="copyToClipboard('${this.escapeHtml(exif.interopVersion)}')">${this.escapeHtml(exif.interopVersion)}</div>
                </div>`;
            }
        }

        html += `
            </div>
        </div>`;
        return html;
    }
}
