// i18n configuration
export const i18n = {
  locales: ['en', 'es', 'pt'] as const,
  defaultLocale: 'en' as const,
};

export type Locale = (typeof i18n.locales)[number];

// Language names for display
export const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

// Get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const firstSegment = segments[1] as Locale;
  return i18n.locales.includes(firstSegment) ? firstSegment : i18n.defaultLocale;
}
