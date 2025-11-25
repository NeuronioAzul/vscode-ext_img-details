/**
 * Utility functions for image metadata processing
 * 
 * This module contains standalone utility functions for processing image metadata,
 * file sizes, color information, bit depth calculations, and EXIF data extraction.
 */

/**
 * Format file size in human-readable format
 * @param bytes - Number of bytes to format
 * @returns Formatted file size string (e.g., "1.5 MB", "256 KB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) {return '0 Bytes';}
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Extract color information from image size data
 * @param size - Image size object containing type and other properties
 * @returns Color information object with transparency support and color depth
 */
export function getColorInfo(size: any): any {
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

/**
 * Calculate bit depth from EXIF metadata
 * @param bitsPerSample - Bits per sample value from EXIF (can be space-separated values)
 * @param samplesPerPixel - Samples per pixel value from EXIF
 * @param fallback - Fallback value if calculation fails
 * @returns Formatted bit depth string
 */
export function calculateBitDepth(bitsPerSample: string | undefined, samplesPerPixel: string | undefined, fallback: string | undefined): string {
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

/**
 * Extract relevant EXIF data from raw EXIF tags
 * @param tags - Raw EXIF tags object
 * @returns Processed EXIF data object with only relevant fields, or null if no data
 */
export function extractRelevantExifData(tags: any): any {
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
