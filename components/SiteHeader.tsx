import Link from 'next/link';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function SiteHeader({ lang, t }: { lang: Locale; t: Dictionary }) {
  const links = [
    { href: `/${lang}/cpus`, label: t.nav.cpus },
    { href: `/${lang}/gpus`, label: t.nav.gpus },
    { href: `/${lang}/compare/cpus`, label: t.nav.compare },
    { href: `/${lang}/builder`, label: t.nav.builder },
  ];
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4" aria-label="Main">
        <Link href={`/${lang}`} className="text-lg font-bold">PC Builder Hub</Link>
        <ul className="flex flex-wrap gap-4 text-sm">
          {links.map(link => (
            <li key={link.href}><Link href={link.href} className="hover:underline">{link.label}</Link></li>
          ))}
        </ul>
        <div className="ml-auto"><LanguageSwitcher current={lang} label={t.nav.language} /></div>
      </nav>
    </header>
  );
}
