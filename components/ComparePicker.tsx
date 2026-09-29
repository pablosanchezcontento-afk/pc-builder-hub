export interface Option { slug: string; label: string }

export function ComparePicker({ action, options, a, b, labels }: {
  action: string; options: Option[]; a?: string; b?: string;
  labels: { first: string; second: string; submit: string; none: string };
}) {
  const select = (name: 'a' | 'b', label: string, value?: string) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-500">{label}</span>
      <select name={name} defaultValue={value ?? ''} className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700">
        <option value="">{labels.none}</option>
        {options.map(option => <option key={option.slug} value={option.slug}>{option.label}</option>)}
      </select>
    </label>
  );
  return (
    <form action={action} method="get" className="flex flex-wrap items-end gap-4">
      {select('a', labels.first, a)}
      {select('b', labels.second, b)}
      <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">{labels.submit}</button>
    </form>
  );
}
