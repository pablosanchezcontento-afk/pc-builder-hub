import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComponentCard } from '@/components/ComponentCard';
import { cpuRows } from '@/components/specs';
import { getCPUsBySocket, getSockets } from '@/lib/db';
import { format } from '@/lib/dictionaries';
import { i18n } from '@/lib/i18n';
import { resolveLang } from '@/lib/params';

type Params = Promise<{ lang: string; socket: string }>;

export function generateStaticParams() {
  return i18n.locales.flatMap(lang => getSockets().map(socket => ({ lang, socket: socket.toLowerCase() })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { socket } = await params;
  return { title: decodeURIComponent(socket).toUpperCase() };
}

export default async function SocketPage({ params }: { params: Params }) {
  const { lang, t } = await resolveLang(params);
  const cpus = getCPUsBySocket(decodeURIComponent((await params).socket));
  if (cpus.length === 0) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{format(t.cpu.socketTitle, { socket: cpus[0].socket ?? '' })}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cpus.map(cpu => (
          <ComponentCard key={cpu.id} href={`/${lang}/cpus/${cpu.slug}`} model={cpu.model} manufacturer={cpu.manufacturer}
            rows={cpuRows(cpu, t)} empty={t.common.notAvailable} cta={t.common.viewDetails} />
        ))}
      </div>
    </div>
  );
}
