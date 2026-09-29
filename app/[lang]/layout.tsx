import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { getDictionary } from '@/lib/dictionaries';
import { i18n, isLocale } from '@/lib/i18n';
import '../globals.css';

export function generateStaticParams() {
  return i18n.locales.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : i18n.defaultLocale);
  return {
    title: { default: t.meta.title, template: `%s · ${t.meta.title}` },
    description: t.meta.description,
    alternates: { languages: Object.fromEntries(i18n.locales.map(locale => [locale, `/${locale}`])) },
  };
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <html lang={lang}>
      <body className="min-h-screen antialiased">
        <SiteHeader lang={lang} t={t} />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">{t.common.footer}</footer>
      </body>
    </html>
  );
}
