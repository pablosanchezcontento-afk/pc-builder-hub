import { Metadata } from 'next';
import Link from 'next/link';
import { getAllGPUs } from '@/lib/db';

interface PageProps {
  params: { lang: string; vram: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const vramGB = params.vram;
  return {
    title: `GPUs con ${vramGB} GB de VRAM - PC Builder Hub`,
    description: `Listado completo de tarjetas gráficas con ${vramGB} GB de VRAM. Especificaciones oficiales y comparaciones.`,
  };
}

export default function GPUVRAMPage({ params }: PageProps) {
  const vramGB = parseInt(params.vram);
  const allGPUs = getAllGPUs();
  
  // Filtrar GPUs por VRAM
  const filteredGPUs = allGPUs.filter(
    (gpu) => gpu.vram_gb === vramGB
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link href={`/${params.lang}/gpus`} className="text-blue-600 hover:underline">
          ← Volver a todas las GPUs
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-2">GPUs con {vramGB} GB de VRAM</h1>
      <p className="text-gray-600 mb-8">
        {filteredGPUs.length} tarjeta(s) gráfica(s) encontrada(s)
      </p>

      {filteredGPUs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
          <p className="text-gray-600">No hay tarjetas gráficas registradas con {vramGB} GB de VRAM.</p>
          <Link
            href={`/${params.lang}/gpus`}
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Ver todas las GPUs disponibles
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredGPUs.map((gpu) => (
            <div
              key={gpu.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{gpu.model}</h2>
                  <p className="text-gray-600">{gpu.manufacturer_name}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-medium">
                    {gpu.vram_gb} GB {gpu.memory_type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo de Memoria</p>
                  <p className="font-medium">{gpu.memory_type ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frecuencia Base</p>
                  <p className="font-medium">{gpu.base_clock_mhz ? `${gpu.base_clock_mhz} MHz` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frecuencia Boost</p>
                  <p className="font-medium">{gpu.boost_clock_mhz ? `${gpu.boost_clock_mhz} MHz` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">TDP</p>
                  <p className="font-medium">{gpu.tdp_watts ? `${gpu.tdp_watts}W` : 'N/A'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/${params.lang}/gpus/${gpu.slug}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver especificaciones completas
                </Link>
                <Link
                  href={`/${params.lang}/compare/gpus`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Comparar con otras GPUs
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded p-6">
        <h3 className="text-lg font-semibold mb-2">Sobre VRAM</h3>
        <p className="text-gray-700 text-sm">
          Las tarjetas gráficas con <strong>{vramGB} GB de VRAM</strong> son adecuadas para diferentes casos de uso.
          La cantidad de VRAM es importante para juegos en altas resoluciones, renderizado 3D y aplicaciones de IA.
          Las especificaciones mostradas son oficiales de los fabricantes.
        </p>
      </div>
    </div>
  );
}
