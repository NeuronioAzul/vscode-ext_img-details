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

// Legacy translation object kept for backward compatibility during migration
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
    },
    'ja': {
        imageDetails: '画像詳細',
        fileName: 'ファイル名',
        dimensions: '寸法',
        format: 'フォーマット',
        fileSize: 'ファイルサイズ',
        sizeBytes: 'サイズ（バイト）',
        extension: '拡張子',
        fullPath: 'フルパス',
        created: '作成日',
        modified: '更新日',
        exifData: 'EXIFデータ',
        camera: 'カメラ',
        make: 'メーカー',
        model: 'モデル',
        photoSettings: '撮影設定',
        iso: 'ISO',
        aperture: '絞り',
        shutterSpeed: 'シャッタースピード',
        focalLength: '焦点距離',
        date: '日付',
        dateTaken: '撮影日時',
        location: '位置情報',
        latitude: '緯度',
        longitude: '経度',
        additionalInfo: '追加情報',
        orientation: '向き',
        colorSpace: '色空間',
        software: 'ソフトウェア',
        clickToCopy: 'クリックでコピー',
        copied: 'コピーしました',
        colorInformation: '色情報',
        supportsTransparency: '透明度サポート',
        colorDepth: '色深度',
        dpi: 'DPI/PPI',
        thumbnail: 'サムネイル',
        basicInfo: '基本情報',
        collapse: '折りたたむ',
        expand: '展開',
        accordionMode: 'アコーディオン',
        listMode: 'リスト',
        sectionSettings: '表示',
        removeExif: 'EXIFデータを削除',
        removeExifConfirm: 'この画像からすべてのEXIFメタデータを削除しますか？メタデータなしの新しいファイルが保存されます。',
        removeExifSuccess: 'EXIFデータを正常に削除しました！',
        removeExifError: 'EXIFデータの削除中にエラーが発生しました',
        viewJsonMetadata: 'JSONで表示',
        metadataJson: 'メタデータ（JSON）',
        copyJson: 'JSONをコピー',
        closeModal: '閉じる',
        imageDescription: '画像の説明',
        ownerName: '所有者名',
        lens: 'レンズ',
        lensMake: 'レンズメーカー',
        lensModel: 'レンズモデル',
        lensSerialNumber: 'レンズシリアル番号',
        apertureValue: '絞り値',
        maxAperture: '最大絞り',
        exposureTime: '露出時間',
        shutterSpeedValue: 'シャッタースピード値',
        focalLength35mm: '焦点距離（35mm換算）',
        exposureProgram: '露出プログラム',
        exposureMode: '露出モード',
        exposureCompensation: '露出補正',
        meteringMode: '測光モード',
        flash: 'フラッシュ',
        whiteBalance: 'ホワイトバランス',
        componentsConfiguration: 'コンポーネント構成',
        userComment: 'ユーザーコメント',
        createDate: '作成日時',
        modifyDate: '更新日時',
        gps: 'GPS',
        gpsVersionId: 'GPSバージョンID',
        latitudeRef: '緯度基準',
        longitudeRef: '経度基準',
        gpsAltitude: 'GPS高度',
        altitudeRef: '高度基準',
        gpsTimeStamp: 'GPSタイムスタンプ',
        gpsDateStamp: 'GPS日付スタンプ',
        gpsSatellites: 'GPS衛星',
        gpsStatus: 'GPSステータス',
        gpsMeasureMode: 'GPS測定モード',
        gpsDOP: 'GPS精度低下率',
        gpsSpeed: 'GPS速度',
        gpsSpeedRef: 'GPS速度基準',
        gpsTrack: 'GPSトラック',
        gpsTrackRef: 'GPSトラック基準',
        gpsImgDirection: 'GPS画像方向',
        gpsImgDirectionRef: 'GPS画像方向基準',
        gpsMapDatum: 'GPS地図データム',
        gpsDestLatitude: 'GPS目的地緯度',
        gpsDestLatitudeRef: 'GPS目的地緯度基準',
        gpsDestLongitude: 'GPS目的地経度',
        gpsDestLongitudeRef: 'GPS目的地経度基準',
        gpsDestBearing: 'GPS目的地方位',
        gpsDestBearingRef: 'GPS目的地方位基準',
        gpsDestDistance: 'GPS目的地距離',
        gpsDestDistanceRef: 'GPS目的地距離基準',
        gpsDifferential: 'GPS差分',
        compression: '圧縮',
        xResolution: 'X解像度',
        yResolution: 'Y解像度',
        resolutionUnit: '解像度単位',
        yCbCrPositioning: 'YCbCr配置',
        artist: 'アーティスト',
        copyright: '著作権',
        exifVersion: 'EXIFバージョン',
        flashpixVersion: 'Flashpixバージョン',
        interopIndex: '相互運用インデックス',
        interopVersion: '相互運用バージョン'
    },
    'es': {
        imageDetails: 'Detalles de la Imagen',
        fileName: 'Nombre del Archivo',
        dimensions: 'Dimensiones',
        format: 'Formato',
        fileSize: 'Tamaño del Archivo',
        sizeBytes: 'Tamaño (Bytes)',
        extension: 'Extensión',
        fullPath: 'Ruta Completa',
        created: 'Creado',
        modified: 'Modificado',
        exifData: 'Datos EXIF',
        camera: 'Cámara',
        make: 'Marca',
        model: 'Modelo',
        photoSettings: 'Configuración de Foto',
        iso: 'ISO',
        aperture: 'Apertura',
        shutterSpeed: 'Velocidad de Obturación',
        focalLength: 'Distancia Focal',
        date: 'Fecha',
        dateTaken: 'Fecha de Captura',
        location: 'Ubicación',
        latitude: 'Latitud',
        longitude: 'Longitud',
        additionalInfo: 'Información Adicional',
        orientation: 'Orientación',
        colorSpace: 'Espacio de Color',
        software: 'Software',
        clickToCopy: 'Clic para copiar',
        copied: 'Copiado',
        colorInformation: 'Información de Color',
        supportsTransparency: 'Soporte de Transparencia',
        colorDepth: 'Profundidad de Color',
        dpi: 'DPI/PPP',
        thumbnail: 'Miniatura',
        basicInfo: 'Información Básica',
        collapse: 'Contraer',
        expand: 'Expandir',
        accordionMode: 'Acordeón',
        listMode: 'Lista',
        sectionSettings: 'Visualización',
        removeExif: 'Eliminar Datos EXIF',
        removeExifConfirm: '¿Eliminar todos los metadatos EXIF de esta imagen? Se guardará un nuevo archivo sin metadatos.',
        removeExifSuccess: '¡Datos EXIF eliminados correctamente!',
        removeExifError: 'Error al eliminar datos EXIF',
        viewJsonMetadata: 'Ver como JSON',
        metadataJson: 'Metadatos (JSON)',
        copyJson: 'Copiar JSON',
        closeModal: 'Cerrar',
        imageDescription: 'Descripción de la Imagen',
        ownerName: 'Nombre del Propietario',
        lens: 'Lente',
        lensMake: 'Fabricante del Lente',
        lensModel: 'Modelo del Lente',
        lensSerialNumber: 'Número de Serie del Lente',
        apertureValue: 'Valor de Apertura',
        maxAperture: 'Apertura Máxima',
        exposureTime: 'Tiempo de Exposición',
        shutterSpeedValue: 'Valor de Velocidad de Obturación',
        focalLength35mm: 'Distancia Focal (35mm)',
        exposureProgram: 'Programa de Exposición',
        exposureMode: 'Modo de Exposición',
        exposureCompensation: 'Compensación de Exposición',
        meteringMode: 'Modo de Medición',
        flash: 'Flash',
        whiteBalance: 'Balance de Blancos',
        componentsConfiguration: 'Configuración de Componentes',
        userComment: 'Comentario del Usuario',
        createDate: 'Fecha de Creación',
        modifyDate: 'Fecha de Modificación',
        gps: 'GPS',
        gpsVersionId: 'ID de Versión GPS',
        latitudeRef: 'Ref. Latitud',
        longitudeRef: 'Ref. Longitud',
        gpsAltitude: 'Altitud GPS',
        altitudeRef: 'Ref. Altitud',
        gpsTimeStamp: 'Marca de Tiempo GPS',
        gpsDateStamp: 'Marca de Fecha GPS',
        gpsSatellites: 'Satélites GPS',
        gpsStatus: 'Estado GPS',
        gpsMeasureMode: 'Modo de Medición GPS',
        gpsDOP: 'DOP GPS',
        gpsSpeed: 'Velocidad GPS',
        gpsSpeedRef: 'Ref. Velocidad GPS',
        gpsTrack: 'Pista GPS',
        gpsTrackRef: 'Ref. Pista GPS',
        gpsImgDirection: 'Dirección de Imagen GPS',
        gpsImgDirectionRef: 'Ref. Dirección de Imagen GPS',
        gpsMapDatum: 'Datum del Mapa GPS',
        gpsDestLatitude: 'Latitud de Destino GPS',
        gpsDestLatitudeRef: 'Ref. Latitud de Destino GPS',
        gpsDestLongitude: 'Longitud de Destino GPS',
        gpsDestLongitudeRef: 'Ref. Longitud de Destino GPS',
        gpsDestBearing: 'Rumbo de Destino GPS',
        gpsDestBearingRef: 'Ref. Rumbo de Destino GPS',
        gpsDestDistance: 'Distancia de Destino GPS',
        gpsDestDistanceRef: 'Ref. Distancia de Destino GPS',
        gpsDifferential: 'Diferencial GPS',
        compression: 'Compresión',
        xResolution: 'Resolución X',
        yResolution: 'Resolución Y',
        resolutionUnit: 'Unidad de Resolución',
        yCbCrPositioning: 'Posicionamiento YCbCr',
        artist: 'Artista',
        copyright: 'Derechos de Autor',
        exifVersion: 'Versión EXIF',
        flashpixVersion: 'Versión Flashpix',
        interopIndex: 'Índice Interop',
        interopVersion: 'Versión Interop'
    }
};

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
        // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
        const chevronDown = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
        const chevronRight = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
        const toggleIcon = isExpanded ? chevronDown : chevronRight;

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
                
                // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
                const chevronDown = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
                const chevronRight = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
                
                if (isExpanded) {
                    content.classList.remove('expanded');
                    content.classList.add('collapsed');
                    toggle.classList.add('collapsed');
                    toggle.innerHTML = chevronRight;
                } else {
                    content.classList.remove('collapsed');
                    content.classList.add('expanded');
                    toggle.classList.remove('collapsed');
                    toggle.innerHTML = chevronDown;
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
        // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
        const chevronDown = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
        const chevronRight = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
        const toggleIcon = isExpanded ? chevronDown : chevronRight;

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
        // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
        const chevronDown = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
        const chevronRight = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
        const toggleIcon = isExpanded ? chevronDown : chevronRight;

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
