export const i18n = {
  locales: ['en', 'es', 'pt'] as const,
  defaultLocale: 'en' as const,
};

export type Locale = (typeof i18n.locales)[number];

export const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}

export function getLocaleFromPathname(pathname: string): Locale {
  const first = pathname.split('/')[1] ?? '';
  return isLocale(first) ? first : i18n.defaultLocale;
}

/** Pick the best supported locale from an Accept-Language header (quality-ordered). */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return i18n.defaultLocale;
  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map(p => p.trim()).find(p => p.startsWith('q='));
      const quality = q ? Number(q.slice(2)) : 1;
      return { code: tag.toLowerCase().split('-')[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(entry => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  return ranked.find(entry => isLocale(entry.code))?.code as Locale | undefined ?? i18n.defaultLocale;
}
