export interface SpecRow {
  label: string;
  value: string | number | null;
}

export function SpecTable({ rows, empty }: { rows: SpecRow[]; empty: string }) {
  return (
    <dl className="divide-y divide-slate-200 text-sm dark:divide-slate-800">
      {rows.map(row => (
        <div key={row.label} className="flex justify-between gap-4 py-2">
          <dt className="text-slate-500">{row.label}</dt>
          <dd className="font-medium">{row.value ?? <span className="text-slate-400">{empty}</span>}</dd>
        </div>
      ))}
    </dl>
  );
}
