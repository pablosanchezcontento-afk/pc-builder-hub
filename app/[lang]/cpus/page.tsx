import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentCard } from '@/components/ComponentCard';
import { cpuRows } from '@/components/specs';
import { getAllCPUs, getSockets } from '@/lib/db';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';
import { resolveLang } from '@/lib/params';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : 'en').cpu.title };
}

export default async function CPUsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const cpus = getAllCPUs();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.cpu.title}</h1>
      <nav aria-label={t.cpu.bySocket} className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">{t.cpu.bySocket}:</span>
        {getSockets().map(socket => (
          <Link key={socket} href={`/${lang}/cpus/socket/${encodeURIComponent(socket.toLowerCase())}`} className="rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900">{socket}</Link>
        ))}
      </nav>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cpus.map(cpu => (
          <ComponentCard key={cpu.id} href={`/${lang}/cpus/${cpu.slug}`} model={cpu.model} manufacturer={cpu.manufacturer}
            rows={cpuRows(cpu, t)} empty={t.common.notAvailable} cta={t.common.viewDetails} />
        ))}
      </div>
    </div>
  );
}
