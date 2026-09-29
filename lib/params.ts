import { notFound } from 'next/navigation';
import { getDictionary } from './dictionaries';
import { isLocale, type Locale } from './i18n';

/** Resolve and validate the `lang` route segment. */
export async function resolveLang(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { lang: lang as Locale, t: getDictionary(lang) };
}

/** First value of a search param, if it is a string. */
export function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
