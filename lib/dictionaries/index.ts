import 'server-only';
import type { Locale } from '../i18n';

// Dictionary type based on our JSON structure
type Dictionary = {
  home: {
    title: string;
    subtitle: string;
    description: string;
  };
  nav: {
    home: string;
    compare: string;
    builder: string;
    about: string;
  };
  common: {
    language: string;
    loading: string;
    error: string;
    readMore: string;
  };
};

// Cache for loaded dictionaries
const dictionaries: Partial<Record<Locale, Dictionary>> = {};

// Dynamic import function for dictionaries
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Return cached dictionary if available
  if (dictionaries[locale]) {
    return dictionaries[locale]!;
  }

  // Dynamically import the dictionary
  try {
    const dictionary = await import(`./${locale}.json`);    dictionaries[locale] = dictionary.default;
    return dictionary.default;
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    // Fallback to English if dictionary not found
    const fallback = await import('./en.json');
    return fallback.default;
  }
};

export type { Dictionary };
