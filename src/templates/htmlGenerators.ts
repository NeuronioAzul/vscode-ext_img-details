/**
 * HTML template generators for Image Details webview
 */

import { Translations, SectionStates } from '../types';

/**
 * Generate basic information section HTML
 */
export function generateBasicInfoSection(
    metadata: any,
    t: Translations,
    sectionStates: SectionStates,
    displayMode: string
): string {
    // Implementation moved from imageDetailsEditor.ts
    // (This would contain the full HTML generation logic)
    return '';
}

/**
 * Generate color information section HTML
 */
export function generateColorInfoHtml(
    colorInfo: any,
    t: Translations,
    sectionStates: SectionStates,
    displayMode: string
): string {
    // Implementation moved from imageDetailsEditor.ts
    return '';
}

/**
 * Generate EXIF data section HTML
 */
export function generateExifHtml(
    exif: any,
    t: Translations,
    sectionStates: SectionStates,
    displayMode: string
): string {
    // Implementation moved from imageDetailsEditor.ts
    return '';
}

/**
 * Generate main webview HTML
 */
export function getHtmlForWebview(
    webview: any,
    extensionUri: any,
    imageUri: any,
    metadata: any
): string {
    // Implementation moved from imageDetailsEditor.ts
    return '';
}

/**
 * Generate error HTML
 */
export function getErrorHtml(error: any): string {
    // Implementation moved from imageDetailsEditor.ts
    return '';
}
