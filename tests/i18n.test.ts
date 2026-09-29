import { describe, expect, test } from 'vitest';
import en from '@/lib/dictionaries/en.json';
import es from '@/lib/dictionaries/es.json';
import pt from '@/lib/dictionaries/pt.json';
import { format, getDictionary } from '@/lib/dictionaries';
import { getLocaleFromPathname, negotiateLocale } from '@/lib/i18n';

function keys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key)).sort();
}

describe('dictionaries', () => {
  test('every locale has exactly the same keys, all non-empty', () => {
    expect(keys(es)).toEqual(keys(en));
    expect(keys(pt)).toEqual(keys(en));
    for (const dictionary of [en, es, pt]) {
      expect(JSON.stringify(dictionary)).not.toMatch(/""/);
    }
  });
  test('placeholders are the same across locales', () => {
    const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
    const walk = (a: unknown, b: unknown, path: string) => {
      if (typeof a === 'string') expect(placeholders(b as string), path).toEqual(placeholders(a));
      else for (const key of Object.keys(a as object)) walk((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], `${path}.${key}`);
    };
    walk(en, es, 'es');
    walk(en, pt, 'pt');
  });
  test('format fills placeholders and leaves unknown ones visible', () => {
    expect(format('Socket {socket}', { socket: 'AM5' })).toBe('Socket AM5');
    expect(format('{a} {b}', { a: 1 })).toBe('1 {b}');
    expect(getDictionary('es').nav.builder).toBe('Configurador');
  });
});

describe('locale negotiation', () => {
  test('honours quality values and falls back to English', () => {
    expect(negotiateLocale('es-ES,es;q=0.9,en;q=0.8')).toBe('es');
    expect(negotiateLocale('fr-FR,pt;q=0.7,es;q=0.5')).toBe('pt');
    expect(negotiateLocale('en;q=0.2,es;q=0.9')).toBe('es');
    expect(negotiateLocale('de,fr')).toBe('en');
    expect(negotiateLocale('es;q=0')).toBe('en');
    expect(negotiateLocale(null)).toBe('en');
  });
  test('reads the locale from a path', () => {
    expect(getLocaleFromPathname('/pt/gpus')).toBe('pt');
    expect(getLocaleFromPathname('/xx/gpus')).toBe('en');
  });
});
