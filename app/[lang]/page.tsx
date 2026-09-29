import Link from 'next/link';
import { getAllCPUs, getAllGPUs } from '@/lib/db';
import { resolveLang } from '@/lib/params';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const cpus = getAllCPUs();
  const gpus = getAllGPUs();
  const sources = new Set([...cpus, ...gpus].flatMap(item => [item.specsUrl, item.priceUrl]).filter(Boolean)).size;
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">{t.home.title}</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">{t.home.subtitle}</p>
        <p className="max-w-3xl text-slate-600 dark:text-slate-400">{t.home.description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={`/${lang}/cpus`} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">{t.home.browseCpus}</Link>
          <Link href={`/${lang}/gpus`} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">{t.home.browseGpus}</Link>
          <Link href={`/${lang}/builder`} className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900">{t.home.openBuilder}</Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"><p className="text-3xl font-bold">{cpus.length + gpus.length}</p><p className="text-slate-500">{t.home.components}</p></div>
        <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"><p className="text-3xl font-bold">{sources}</p><p className="text-slate-500">{t.home.sources}</p></div>
      </section>
      <section>
        <h2 className="mb-3 text-2xl font-semibold">{t.home.principlesTitle}</h2>
        <ul className="list-disc space-y-1 pl-6 text-slate-600 dark:text-slate-400">
          <li>{t.home.principle1}</li><li>{t.home.principle2}</li><li>{t.home.principle3}</li>
        </ul>
      </section>
    </div>
  );
}
