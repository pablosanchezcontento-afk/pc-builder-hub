import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComponentCard } from '@/components/ComponentCard';
import { gpuRows } from '@/components/specs';
import { getGPUsByVram, getVramSizes } from '@/lib/db';
import { format } from '@/lib/dictionaries';
import { i18n } from '@/lib/i18n';
import { resolveLang } from '@/lib/params';

type Params = Promise<{ lang: string; vram: string }>;

export function generateStaticParams() {
  return i18n.locales.flatMap(lang => getVramSizes().map(gb => ({ lang, vram: String(gb) })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { vram } = await params;
  return { title: `${vram} GB` };
}

export default async function VramPage({ params }: { params: Params }) {
  const { lang, t } = await resolveLang(params);
  const { vram } = await params;
  const gb = /^\d+$/.test(vram) ? Number(vram) : NaN;
  const gpus = Number.isFinite(gb) ? getGPUsByVram(gb) : [];
  if (gpus.length === 0) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{format(t.gpu.vramTitle, { gb })}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gpus.map(gpu => (
          <ComponentCard key={gpu.id} href={`/${lang}/gpus/${gpu.slug}`} model={gpu.model} manufacturer={gpu.manufacturer}
            rows={gpuRows(gpu, t)} empty={t.common.notAvailable} cta={t.common.viewDetails} />
        ))}
      </div>
    </div>
  );
}
