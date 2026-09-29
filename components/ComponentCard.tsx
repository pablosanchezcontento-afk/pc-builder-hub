import Link from 'next/link';
import { SpecTable, type SpecRow } from './SpecTable';

export function ComponentCard({ href, model, manufacturer, rows, empty, cta }: {
  href: string; model: string; manufacturer: string; rows: SpecRow[]; empty: string; cta: string;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-500">{manufacturer}</p>
      <h2 className="mb-3 text-lg font-semibold">{model}</h2>
      <SpecTable rows={rows} empty={empty} />
      <Link href={href} className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">{cta} →</Link>
    </article>
  );
}
