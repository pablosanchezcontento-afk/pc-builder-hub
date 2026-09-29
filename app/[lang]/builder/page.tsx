import type { Metadata } from 'next';
import { PSU_HEADROOM, REST_OF_SYSTEM_W, summarizeBuild } from '@/lib/catalog';
import { getAllCPUs, getAllGPUs, getCPUBySlug, getGPUBySlug } from '@/lib/db';
import { format, getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';
import { resolveLang, single } from '@/lib/params';

type Search = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : 'en').builder.title };
}

export default async function BuilderPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Search }) {
  const { lang, t } = await resolveLang(params);
  const query = await searchParams;
  const cpuSlug = single(query.cpu);
  const gpuSlug = single(query.gpu);
  const summary = summarizeBuild(cpuSlug ? getCPUBySlug(cpuSlug) : null, gpuSlug ? getGPUBySlug(gpuSlug) : null);
  const submitted = Boolean(cpuSlug || gpuSlug);
  const select = (name: 'cpu' | 'gpu', label: string, value: string | undefined, options: { slug: string; label: string }[]) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-500">{label}</span>
      <select name={name} defaultValue={value ?? ''} className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700">
        <option value="">{t.builder.none}</option>
        {options.map(option => <option key={option.slug} value={option.slug}>{option.label}</option>)}
      </select>
    </label>
  );
  const messages = summary.missing.map(item => (
    item === 'cpu' ? t.builder.missingCpu : item === 'gpu' ? t.builder.missingGpu : t.builder.missingTdp
  ));
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{t.builder.title}</h1>
      <p className="text-slate-600 dark:text-slate-400">{t.builder.intro}</p>
      <form action={`/${lang}/builder`} method="get" className="flex flex-wrap items-end gap-4">
        {select('cpu', t.builder.cpu, summary.cpu?.slug, getAllCPUs().map(cpu => ({ slug: cpu.slug, label: `${cpu.manufacturer} ${cpu.model}` })))}
        {select('gpu', t.builder.gpu, summary.gpu?.slug, getAllGPUs().map(gpu => ({ slug: gpu.slug, label: `${gpu.manufacturer} ${gpu.model}` })))}
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">{t.builder.submit}</button>
      </form>
      {submitted && (
        <section aria-live="polite" className="space-y-3 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
          {[...new Set(messages)].map(message => <p key={message} className="text-amber-700 dark:text-amber-400">{message}</p>)}
          {summary.recommendedPsuW !== null && (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm text-slate-500">{t.builder.estimatedDraw}</dt><dd className="text-2xl font-bold">{summary.estimatedDrawW} W</dd></div>
              <div><dt className="text-sm text-slate-500">{t.builder.recommendedPsu}</dt><dd className="text-2xl font-bold">{summary.recommendedPsuW} W</dd></div>
            </dl>
          )}
          {summary.totalPriceEur !== null && (
            <p><span className="text-sm text-slate-500">{t.builder.total}: </span>
              <strong>{new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(summary.totalPriceEur)}</strong></p>
          )}
          {summary.cpu?.socket && <p className="text-sm">{format(t.builder.socketNote, { socket: summary.cpu.socket })}</p>}
          <p className="text-xs text-slate-500">{format(t.builder.psuNote, { rest: REST_OF_SYSTEM_W, headroom: Math.round((PSU_HEADROOM - 1) * 100) })}</p>
        </section>
      )}
    </div>
  );
}
