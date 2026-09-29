import type { Component } from '@/lib/db/types';
import { format, type Dictionary } from '@/lib/dictionaries';

export function SourceLinks({ item, t, lang }: { item: Component; t: Dictionary; lang: string }) {
  return (
    <div className="mt-6 space-y-2 text-sm">
      {item.latestPriceEur !== null ? (
        <p className="text-2xl font-bold">
          {new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(item.latestPriceEur)}
          {item.priceDate && <span className="ml-2 text-sm font-normal text-slate-500">{format(t.common.priceDate, { date: new Date(item.priceDate).toLocaleDateString(lang) })}</span>}
        </p>
      ) : (
        <p className="text-slate-500">{t.common.noPrice}</p>
      )}
      <ul className="flex flex-wrap gap-4">
        {item.specsUrl && <li><a className="text-blue-600 hover:underline dark:text-blue-400" href={item.specsUrl} rel="noopener noreferrer" target="_blank">{t.common.officialSpecs} ↗</a></li>}
        {item.priceUrl && <li><a className="text-blue-600 hover:underline dark:text-blue-400" href={item.priceUrl} rel="noopener noreferrer" target="_blank">{t.common.retailer} ↗</a></li>}
      </ul>
    </div>
  );
}
