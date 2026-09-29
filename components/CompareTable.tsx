import { compareSpec } from '@/lib/catalog';

export interface CompareRow {
  label: string;
  a: string | null;
  b: string | null;
  /** Raw numbers used to decide the better side; omit for non-comparable specs. */
  values?: [number | null, number | null];
  lowerIsBetter?: boolean;
}

export function CompareTable({ nameA, nameB, rows, labels }: {
  nameA: string; nameB: string; rows: CompareRow[];
  labels: { spec: string; better: string; tie: string; empty: string };
}) {
  const cell = (text: string | null, wins: boolean) => (
    <td className={`px-3 py-2 ${wins ? 'font-semibold text-green-700 dark:text-green-400' : ''}`}>
      {text ?? <span className="text-slate-400">{labels.empty}</span>}
      {wins && <span className="ml-2 text-xs">({labels.better})</span>}
    </td>
  );
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-300 text-left dark:border-slate-700">
          <th scope="col" className="px-3 py-2">{labels.spec}</th>
          <th scope="col" className="px-3 py-2">{nameA}</th>
          <th scope="col" className="px-3 py-2">{nameB}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const winner = row.values ? compareSpec(row.values[0], row.values[1], row.lowerIsBetter) : null;
          return (
            <tr key={row.label} className="border-b border-slate-200 dark:border-slate-800">
              <th scope="row" className="px-3 py-2 text-left font-normal text-slate-500">
                {row.label}{winner === 'tie' && <span className="ml-2 text-xs">({labels.tie})</span>}
              </th>
              {cell(row.a, winner === 'a')}
              {cell(row.b, winner === 'b')}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
