import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentCard } from '@/components/ComponentCard';
import { gpuRows } from '@/components/specs';
import { getAllGPUs, getVramSizes } from '@/lib/db';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';
import { resolveLang } from '@/lib/params';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : 'en').gpu.title };
}

export default async function GPUsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const gpus = getAllGPUs();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.gpu.title}</h1>
      <nav aria-label={t.gpu.byVram} className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">{t.gpu.byVram}:</span>
        {getVramSizes().map(gb => (
          <Link key={gb} href={`/${lang}/gpus/vram/${gb}`} className="rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900">{gb} GB</Link>
        ))}
      </nav>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gpus.map(gpu => (
          <ComponentCard key={gpu.id} href={`/${lang}/gpus/${gpu.slug}`} model={gpu.model} manufacturer={gpu.manufacturer}
            rows={gpuRows(gpu, t)} empty={t.common.notAvailable} cta={t.common.viewDetails} />
        ))}
      </div>
    </div>
  );
}
