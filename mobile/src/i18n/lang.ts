export type Lang = 'en' | 'de';

export const UI_LANGS: readonly Lang[] = ['en', 'de'];

export function resolveLang(preference: Lang | 'auto', deviceLanguageCode: string | null | undefined): Lang {
  if (preference !== 'auto') return preference;
  return deviceLanguageCode?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

/** Languages offered for translation. Names are given in both UI languages. */
export const TRANSLATION_LANGS = [
  { code: 'en', en: 'English', de: 'Englisch' },
  { code: 'de', en: 'German', de: 'Deutsch' },
  { code: 'fr', en: 'French', de: 'Französisch' },
  { code: 'es', en: 'Spanish', de: 'Spanisch' },
  { code: 'it', en: 'Italian', de: 'Italienisch' },
  { code: 'pt', en: 'Portuguese', de: 'Portugiesisch' },
  { code: 'nl', en: 'Dutch', de: 'Niederländisch' },
  { code: 'pl', en: 'Polish', de: 'Polnisch' },
  { code: 'cs', en: 'Czech', de: 'Tschechisch' },
  { code: 'tr', en: 'Turkish', de: 'Türkisch' },
  { code: 'ru', en: 'Russian', de: 'Russisch' },
  { code: 'uk', en: 'Ukrainian', de: 'Ukrainisch' },
  { code: 'ar', en: 'Arabic', de: 'Arabisch' },
  { code: 'zh', en: 'Chinese', de: 'Chinesisch' },
  { code: 'ja', en: 'Japanese', de: 'Japanisch' },
  { code: 'ko', en: 'Korean', de: 'Koreanisch' },
  { code: 'vi', en: 'Vietnamese', de: 'Vietnamesisch' },
  { code: 'th', en: 'Thai', de: 'Thailändisch' },
  { code: 'id', en: 'Indonesian', de: 'Indonesisch' },
  { code: 'hi', en: 'Hindi', de: 'Hindi' },
] as const;

export type TranslationLangCode = (typeof TRANSLATION_LANGS)[number]['code'];

export function translationLangName(code: TranslationLangCode, inLang: Lang): string {
  const entry = TRANSLATION_LANGS.find((l) => l.code === code);
  return entry ? entry[inLang] : code;
}
