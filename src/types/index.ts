/**
 * Core type definitions for the Image Details extension
 */

export interface Translations {
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

export interface ImageMetadata {
    width?: number;
    height?: number;
    type?: string;
    format?: string;
    colorInfo?: ColorInfo;
    exif?: any;
    [key: string]: any;
}

export interface ColorInfo {
    supportsTransparency: boolean;
    colorDepth?: number;
    dpi?: number;
    [key: string]: any;
}

export type DisplayMode = 'accordion' | 'list';

export interface SectionStates {
    [key: string]: boolean;
}
