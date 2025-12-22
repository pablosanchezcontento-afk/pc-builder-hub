import { getAllCPUs } from '@/lib/db';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string }>;  searchParams: { gpu?: string };
}

export default async function CPUSelectionPage({ params, searchParams }: PageProps) {
    const { lang } = await params;
const cpus = await getAllCPUs();
  const gpuSlug = searchParams.gpu;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={`/${lang}/builder${gpuSlug ? `?gpu=${gpuSlug}` : ''}`}
          className="text-blue-600 hover:underline"
        >
          ← Volver al builder
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Selecciona un Procesador (CPU)</h1>
      <p className="text-gray-600 mb-8">Elige el procesador que deseas para tu PC</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cpus.map((cpu) => (
          <Link
            key={cpu.id}
            href={`/${lang}/builder?cpu=${cpu.slug}${gpuSlug ? `&gpu=${gpuSlug}` : ''}`}
            className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">
                  {cpu.manufacturer_name}
                </h3>
                <p className="text-xl font-bold">{cpu.model}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Socket:</span>
                  <span className="font-medium">{cpu.socket || 'No especificado oficialmente'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Núcleos:</span>
                  <span className="font-medium">{cpu.cores || 'No especificado oficialmente'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hilos:</span>
                  <span className="font-medium">{cpu.threads || 'No especificado oficialmente'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frec. Base:</span>
                  <span className="font-medium">
                    {cpu.base_clock_ghz ? `${cpu.base_clock_ghz} GHz` : 'No especificado oficialmente'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="text-lg font-bold text-green-600">
                    {cpu.price_usd ? `$${cpu.price_usd}` : 'No especificado oficialmente'}
                  </span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                Seleccionar
              </button>
            </div>
          </Link>
        ))}
      </div>

      {cpus.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No hay procesadores disponibles en este momento</p>
        </div>
      )}
    </div>
  );
}
