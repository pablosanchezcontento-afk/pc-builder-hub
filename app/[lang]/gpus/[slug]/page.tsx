import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SourceLinks } from '@/components/SourceLinks';
import { SpecTable } from '@/components/SpecTable';
import { gpuRows } from '@/components/specs';
import { getAllGPUs, getGPUBySlug } from '@/lib/db';
import { i18n } from '@/lib/i18n';
import { resolveLang } from '@/lib/params';

type Params = Promise<{ lang: string; slug: string }>;

export function generateStaticParams() {
  return i18n.locales.flatMap(lang => getAllGPUs().map(gpu => ({ lang, slug: gpu.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const gpu = getGPUBySlug(slug);
  return { title: gpu ? `${gpu.manufacturer} ${gpu.model}` : undefined };
}

export default async function GPUDetailPage({ params }: { params: Params }) {
  const { lang, t } = await resolveLang(params);
  const gpu = getGPUBySlug((await params).slug);
  if (!gpu) notFound();
  return (
    <article className="max-w-2xl">
      <Link href={`/${lang}/gpus`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">← {t.common.back}</Link>
      <p className="mt-4 text-sm uppercase tracking-wide text-slate-500">{gpu.manufacturer}</p>
      <h1 className="mb-6 text-3xl font-bold">{gpu.model}</h1>
      <SpecTable rows={gpuRows(gpu, t)} empty={t.common.notAvailable} />
      <SourceLinks item={gpu} t={t} lang={lang} />
    </article>
  );
}
