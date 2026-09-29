import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparePicker } from '@/components/ComparePicker';
import { CompareTable, type CompareRow } from '@/components/CompareTable';
import { formatGhz } from '@/lib/catalog';
import { getAllCPUs, getCPUBySlug } from '@/lib/db';
import type { CPU } from '@/lib/db/types';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';
import { resolveLang, single } from '@/lib/params';

type Search = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : 'en').compare.cpuTitle };
}

function rows(a: CPU, b: CPU, t: Dictionary): CompareRow[] {
  const ghz = (value: number | null) => (value === null ? null : formatGhz(value, ''));
  const watts = (value: number | null) => (value === null ? null : `${value} W`);
  return [
    { label: t.cpu.cores, a: a.cores?.toString() ?? null, b: b.cores?.toString() ?? null, values: [a.cores, b.cores] },
    { label: t.cpu.threads, a: a.threads?.toString() ?? null, b: b.threads?.toString() ?? null, values: [a.threads, b.threads] },
    { label: t.cpu.baseClock, a: ghz(a.baseClockGhz), b: ghz(b.baseClockGhz), values: [a.baseClockGhz, b.baseClockGhz] },
    { label: t.cpu.boostClock, a: ghz(a.boostClockGhz), b: ghz(b.boostClockGhz), values: [a.boostClockGhz, b.boostClockGhz] },
    { label: t.cpu.tdp, a: watts(a.tdpW), b: watts(b.tdpW), values: [a.tdpW, b.tdpW], lowerIsBetter: true },
    { label: t.cpu.socket, a: a.socket, b: b.socket },
  ];
}

export default async function CompareCPUsPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Search }) {
  const { lang, t } = await resolveLang(params);
  const query = await searchParams;
  const aSlug = single(query.a);
  const bSlug = single(query.b);
  const a = aSlug ? getCPUBySlug(aSlug) : null;
  const b = bSlug ? getCPUBySlug(bSlug) : null;
  const options = getAllCPUs().map(cpu => ({ slug: cpu.slug, label: `${cpu.manufacturer} ${cpu.model}` }));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.compare.cpuTitle}</h1>
      <p className="text-sm"><Link href={`/${lang}/compare/gpus`} className="text-blue-600 hover:underline dark:text-blue-400">{t.compare.gpuTitle} →</Link></p>
      <ComparePicker action={`/${lang}/compare/cpus`} options={options} a={a?.slug} b={b?.slug}
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
