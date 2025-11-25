/**
 * Internationalization (i18n) for Image Details extension
 * Languages: English, Portuguese (Brasil), Japanese, Spanish
 */

import { Translations } from '../types';
import { en } from './locales/en';
import { ptBr } from './locales/pt-br';
import { ja } from './locales/ja';
import { es } from './locales/es';

export const translations: { [key: string]: Translations } = {
    'en': en,
    'pt-br': ptBr,
    'ja': ja,
    'es': es
};

/**
 * Get translations based on VS Code locale
 */
export function getTranslations(locale: string): Translations {
    const normalizedLocale = locale.toLowerCase();
    
    // Exact match
    if (translations[normalizedLocale]) {
        return translations[normalizedLocale];
    }
    
    // Language without region (e.g., 'pt' from 'pt-BR')
    const lang = normalizedLocale.split('-')[0];
    if (translations[lang]) {
        return translations[lang];
    }
    
    // Specific locale fallbacks
    if (normalizedLocale.includes('pt')) return translations['pt-br'];
    if (normalizedLocale.includes('ja')) return translations['ja'];
    if (normalizedLocale.includes('es')) return translations['es'];
    
    // Default to English
    return translations['en'];
}
