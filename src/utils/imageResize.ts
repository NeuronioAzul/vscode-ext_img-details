/**
 * Native Image Resizing Utility
 * Uses Jimp (pure JavaScript) for image processing
 * No native dependencies required - works cross-platform
 * 
 * Created: 2025-12-29
 */

import Jimp from 'jimp';

/**
 * Resize an image using Jimp
 * Supports JPEG, PNG, and other formats
 * Pure JavaScript implementation - no native binaries
 */
export async function resizeImage(
    inputBuffer: Buffer,
    width: number,
    height: number,
    format: 'jpeg' | 'png' | 'webp',
    quality: number = 90
): Promise<Buffer> {
    // Read image from buffer
    const image = await Jimp.read(inputBuffer);
    
    // Resize to exact dimensions
    image.resize(width, height);
    
    // Set quality
    image.quality(quality);
    
    // Get buffer in the correct format
    let mimeType: string;
    
    switch (format) {
        case 'jpeg':
            mimeType = Jimp.MIME_JPEG;
            break;
        case 'png':
            mimeType = Jimp.MIME_PNG;
            break;
        case 'webp':
            // Jimp may not support WebP in all versions, fallback to JPEG
            mimeType = Jimp.MIME_JPEG;
            console.warn('WebP format requested but may not be supported by Jimp. Using JPEG instead.');
            break;
        default:
            mimeType = Jimp.MIME_JPEG;
    }
    
    return await image.getBufferAsync(mimeType);
}

/**
 * Main resize function (simplified - only uses Jimp)
 */
export async function resizeImageSafe(
    inputBuffer: Buffer,
    width: number,
    height: number,
    format: 'jpeg' | 'png' | 'webp',
    quality: number = 90
): Promise<Buffer> {
    return await resizeImage(inputBuffer, width, height, format, quality);
}
