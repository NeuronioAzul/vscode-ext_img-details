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
import sharp from 'sharp';

// Import types
import { Translations, DisplayMode, SectionStates } from './types';

// Import i18n
import { getTranslations } from './i18n/translations';

// Import utility functions
import { formatFileSize, getColorInfo, calculateBitDepth, extractRelevantExifData } from './utils/metadata';

// Import HTML template generators
import { 
    escapeHtml, 
    getErrorHtml, 
    generateBasicInfoSection,
    generateColorInfoHtml,
    generateExifHtml,
    getHtmlForWebview 
} from './templates/htmlGenerators';

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
        interopVersion: 'Interop Version',
        resizeImage: 'Resize Image',
        resizeImageTitle: 'Resize Image',
        width: 'Width',
        height: 'Height',
        maintainAspectRatio: 'Maintain aspect ratio',
        currentSize: 'Current size',
        newSize: 'New size',
        estimatedFileSize: 'Estimated file size',
        quality: 'Quality',
        resizeOptions: 'Resize Options',
        resizeConfirm: 'Resize this image? The original will be backed up.',
        resizeSuccess: 'Image resized successfully!',
        resizeError: 'Error resizing image',
        backupExists: 'Backup file already exists. Replace it?',
        invalidDimensions: 'Invalid dimensions. Width and height must be positive numbers.',
        applyResize: 'Apply Resize',
        cancel: 'Cancel',
        apply: 'Apply'
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
        interopVersion: 'Versão Interop',
        resizeImage: 'Redimensionar Imagem',
        resizeImageTitle: 'Redimensionar Imagem',
        width: 'Largura',
        height: 'Altura',
        maintainAspectRatio: 'Manter proporção',
        currentSize: 'Tamanho atual',
        newSize: 'Novo tamanho',
        estimatedFileSize: 'Tamanho estimado do arquivo',
        quality: 'Qualidade',
        resizeOptions: 'Opções de Redimensionamento',
        resizeConfirm: 'Redimensionar esta imagem? A original será salva como backup.',
        resizeSuccess: 'Imagem redimensionada com sucesso!',
        resizeError: 'Erro ao redimensionar imagem',
        backupExists: 'Arquivo de backup já existe. Substituir?',
        invalidDimensions: 'Dimensões inválidas. Largura e altura devem ser números positivos.',
        applyResize: 'Aplicar Redimensionamento',
        cancel: 'Cancelar',
        apply: 'Aplicar'
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
        interopVersion: '相互運用バージョン',
        resizeImage: '画像のリサイズ',
        resizeImageTitle: '画像のリサイズ',
        width: '幅',
        height: '高さ',
        maintainAspectRatio: 'アスペクト比を維持',
        currentSize: '現在のサイズ',
        newSize: '新しいサイズ',
        estimatedFileSize: '推定ファイルサイズ',
        quality: '品質',
        resizeOptions: 'リサイズオプション',
        resizeConfirm: 'この画像をリサイズしますか？元の画像はバックアップされます。',
        resizeSuccess: '画像のリサイズに成功しました！',
        resizeError: '画像のリサイズエラー',
        backupExists: 'バックアップファイルが既に存在します。置き換えますか？',
        invalidDimensions: '無効な寸法です。幅と高さは正の数でなければなりません。',
        applyResize: 'リサイズを適用',
        cancel: 'キャンセル',
        apply: '適用'
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
        interopVersion: 'Versión Interop',
        resizeImage: 'Redimensionar Imagen',
        resizeImageTitle: 'Redimensionar Imagen',
        width: 'Ancho',
        height: 'Alto',
        maintainAspectRatio: 'Mantener relación de aspecto',
        currentSize: 'Tamaño actual',
        newSize: 'Nuevo tamaño',
        estimatedFileSize: 'Tamaño estimado del archivo',
        quality: 'Calidad',
        resizeOptions: 'Opciones de Redimensionamiento',
        resizeConfirm: '¿Redimensionar esta imagen? La original será respaldada.',
        resizeSuccess: '¡Imagen redimensionada con éxito!',
        resizeError: 'Error al redimensionar imagen',
        backupExists: 'El archivo de respaldo ya existe. ¿Reemplazarlo?',
        invalidDimensions: 'Dimensiones inválidas. El ancho y alto deben ser números positivos.',
        applyResize: 'Aplicar Redimensionamiento',
        cancel: 'Cancelar',
        apply: 'Aplicar'
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
            
            // Resize image using sharp
            let resizer = sharp(originalBuffer)
                .resize(width, height, {
                    fit: 'fill' // Exact dimensions specified by user
                });
            
            // Apply quality settings based on format
            if (ext === '.jpg' || ext === '.jpeg') {
                resizer = resizer.jpeg({ quality });
            } else if (ext === '.png') {
                // PNG quality is different (0-9 compression level)
                const compressionLevel = Math.round((100 - quality) / 11);
                resizer = resizer.png({ compressionLevel: Math.min(9, Math.max(0, compressionLevel)) });
            } else if (ext === '.webp') {
                resizer = resizer.webp({ quality });
            }
            
            // Save resized image
            const resizedBuffer = await resizer.toBuffer();
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