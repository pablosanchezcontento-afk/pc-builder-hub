'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { i18n, languageNames, type Locale } from '@/lib/i18n';

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;
  const rest = pathname.split('/').slice(2).join('/');
  return (
    <ul className="flex gap-2 text-sm" aria-label={label}>
      {i18n.locales.map(locale => (
        <li key={locale}>
          <Link
            href={`/${locale}${rest ? `/${rest}` : ''}`}
            hrefLang={locale}
            aria-current={locale === current ? 'true' : undefined}
            className={locale === current ? 'font-semibold underline' : 'hover:underline'}
          >
            {languageNames[locale]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
