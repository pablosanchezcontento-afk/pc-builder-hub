import { getAllGPUs } from '@/lib/db';
import Link from 'next/link';

interface PageProps {
  params: { lang: string };
  searchParams: { cpu?: string };
}

export default async function GPUSelectionPage({ params, searchParams }: PageProps) {
  const gpus = await getAllGPUs();
  const cpuSlug = searchParams.cpu;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={`/${params.lang}/builder${cpuSlug ? `?cpu=${cpuSlug}` : ''}`}
          className="text-blue-600 hover:underline"
        >
          ← Volver al builder
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Selecciona una Tarjeta Gráfica (GPU)</h1>
      <p className="text-gray-600 mb-8">Elige la tarjeta gráfica que deseas para tu PC</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gpus.map((gpu) => (
          <Link
            key={gpu.id}
            href={`/${params.lang}/builder?gpu=${gpu.slug}${cpuSlug ? `&cpu=${cpuSlug}` : ''}`}
            className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">
                  {gpu.manufacturer_name}
                </h3>
                <p className="text-xl font-bold">{gpu.model}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>VRAM:</span>
                  <span className="font-medium">
                    {gpu.vram_gb ? `${gpu.vram_gb} GB` : 'No especificado oficialmente'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frec. Base:</span>
                  <span className="font-medium">
                    {gpu.base_clock_mhz ? `${gpu.base_clock_mhz} MHz` : 'No especificado oficialmente'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frec. Boost:</span>
                  <span className="font-medium">
                    {gpu.boost_clock_mhz ? `${gpu.boost_clock_mhz} MHz` : 'No especificado oficialmente'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Interfaz:</span>
                  <span className="font-medium">{gpu.interface || 'No especificado oficialmente'}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="text-lg font-bold text-green-600">
                    {gpu.price_usd ? `$${gpu.price_usd}` : 'No especificado oficialmente'}
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

      {gpus.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No hay tarjetas gráficas disponibles en este momento</p>
        </div>
      )}
    </div>
  );
}
