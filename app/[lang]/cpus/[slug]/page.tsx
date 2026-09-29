import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SourceLinks } from '@/components/SourceLinks';
import { SpecTable } from '@/components/SpecTable';
import { cpuRows } from '@/components/specs';
import { getAllCPUs, getCPUBySlug } from '@/lib/db';
import { i18n } from '@/lib/i18n';
import { resolveLang } from '@/lib/params';

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  return i18n.locales.flatMap(lang => getAllCPUs().map(cpu => ({ lang, slug: cpu.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cpu = getCPUBySlug(slug);
  return { title: cpu ? `${cpu.manufacturer} ${cpu.model}` : undefined };
}

export default async function CPUDetailPage({ params }: { params: Params }) {
  const { lang, t } = await resolveLang(params);
  const cpu = getCPUBySlug((await params).slug);
  if (!cpu) notFound();
  return (
    <article className="max-w-2xl">
      <Link href={`/${lang}/cpus`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">← {t.common.back}</Link>
      <p className="mt-4 text-sm uppercase tracking-wide text-slate-500">{cpu.manufacturer}</p>
      <h1 className="mb-6 text-3xl font-bold">{cpu.model}</h1>
      <SpecTable rows={cpuRows(cpu, t)} empty={t.common.notAvailable} />
      <SourceLinks item={cpu} t={t} lang={lang} />
    </article>
  );
}
