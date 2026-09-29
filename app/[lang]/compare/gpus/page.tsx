import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparePicker } from '@/components/ComparePicker';
import { CompareTable, type CompareRow } from '@/components/CompareTable';
import { formatGhz } from '@/lib/catalog';
import { getAllGPUs, getGPUBySlug } from '@/lib/db';
import type { GPU } from '@/lib/db/types';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';
import { resolveLang, single } from '@/lib/params';

type Search = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : 'en').compare.gpuTitle };
}

function rows(a: GPU, b: GPU, t: Dictionary): CompareRow[] {
  const ghz = (value: number | null) => (value === null ? null : formatGhz(value, ''));
  const watts = (value: number | null) => (value === null ? null : `${value} W`);
  const gb = (value: number | null) => (value === null ? null : `${value} GB`);
  return [
    { label: t.gpu.memory, a: gb(a.memoryGb), b: gb(b.memoryGb), values: [a.memoryGb, b.memoryGb] },
    { label: t.gpu.memoryType, a: a.memoryType, b: b.memoryType },
    { label: t.gpu.baseClock, a: ghz(a.baseClockGhz), b: ghz(b.baseClockGhz), values: [a.baseClockGhz, b.baseClockGhz] },
    { label: t.gpu.boostClock, a: ghz(a.boostClockGhz), b: ghz(b.boostClockGhz), values: [a.boostClockGhz, b.boostClockGhz] },
    { label: t.gpu.tdp, a: watts(a.tdpW), b: watts(b.tdpW), values: [a.tdpW, b.tdpW], lowerIsBetter: true },
  ];
}

export default async function CompareGPUsPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Search }) {
  const { lang, t } = await resolveLang(params);
  const query = await searchParams;
  const aSlug = single(query.a);
  const bSlug = single(query.b);
  const a = aSlug ? getGPUBySlug(aSlug) : null;
  const b = bSlug ? getGPUBySlug(bSlug) : null;
  const options = getAllGPUs().map(gpu => ({ slug: gpu.slug, label: `${gpu.manufacturer} ${gpu.model}` }));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.compare.gpuTitle}</h1>
      <p className="text-sm"><Link href={`/${lang}/compare/cpus`} className="text-blue-600 hover:underline dark:text-blue-400">{t.compare.cpuTitle} →</Link></p>
      <ComparePicker action={`/${lang}/compare/gpus`} options={options} a={a?.slug} b={b?.slug}
        labels={{ first: t.compare.first, second: t.compare.second, submit: t.compare.submit, none: t.builder.none }} />
      {!a || !b ? <p className="text-slate-500">{t.compare.choose}</p>
        : a.id === b.id ? <p className="text-slate-500">{t.compare.same}</p>
          : <>
            <CompareTable nameA={`${a.manufacturer} ${a.model}`} nameB={`${b.manufacturer} ${b.model}`} rows={rows(a, b, t)}
              labels={{ spec: t.compare.spec, better: t.compare.better, tie: t.compare.tie, empty: t.common.notAvailable }} />
            <p className="text-xs text-slate-500">{t.compare.lowerIsBetter}</p>
          </>}
    </div>
  );
}
