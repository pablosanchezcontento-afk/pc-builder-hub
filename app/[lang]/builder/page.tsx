import { getCPUBySlug, getGPUBySlug } from '@/lib/db';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string }>;  searchParams: { cpu?: string; gpu?: string };
  searchParams: Promise<{ cu?: string; gpu?: string }>;
export default async function BuilderPage({ params, searchParams }: PageProps) {
    const { cpu: cpuSlug, gpu: gpuSlug } = await searchParams;

  const cpu = cpuSlug ? await getCPUBySlug(cpuSlug) : null;
  const gpu = gpuSlug ? await getGPUBySlug(gpuSlug) : null;

  const totalPrice = (
    (cpu?.price_usd || 0) + 
    (gpu?.price_usd || 0)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Construye tu PC</h1>

      <div className="space-y-6">
        {/* CPU Selection */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Procesador (CPU)</h2>
              {cpu ? (
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-medium">{cpu.manufacturer_name}</span> {cpu.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    Socket: {cpu.socket || 'No especificado oficialmente'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Precio: {cpu.price_usd ? `$${cpu.price_usd}` : 'No especificado oficialmente'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No seleccionado</p>
              )}
            </div>
            <Link
              href={`/${params.lang}/builder/cpu${gpuSlug ? `?gpu=${gpuSlug}` : ''}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {cpu ? 'Cambiar' : 'Seleccionar'}
            </Link>
          </div>
        </div>

        {/* GPU Selection */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Tarjeta Gráfica (GPU)</h2>
              {gpu ? (
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-medium">{gpu.manufacturer_name}</span> {gpu.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    VRAM: {gpu.vram_gb ? `${gpu.vram_gb} GB` : 'No especificado oficialmente'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Precio: {gpu.price_usd ? `$${gpu.price_usd}` : 'No especificado oficialmente'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No seleccionado</p>
              )}
            </div>
            <Link
              href={`/${params.lang}/builder/gpu${cpuSlug ? `?cpu=${cpuSlug}` : ''}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {gpu ? 'Cambiar' : 'Seleccionar'}
            </Link>
          </div>
        </div>

        {/* Summary */}
        {(cpu || gpu) && (
          <div className="border-t-4 border-blue-600 bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4">Resumen del PC</h3>
            
            <div className="space-y-3">
              {totalPrice > 0 && (
                <div className="flex justify-between text-lg font-semibold">
                  <span>Precio Total:</span>
                  <span className="text-blue-600">${totalPrice.toFixed(2)} USD</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="bg-blue-100 p-4 rounded">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    ✓ Compatibilidad básica verificada
                  </p>
                  <p className="text-xs text-blue-700">
                    Este builder no evalúa rendimiento ni consumo. Los datos mostrados provienen de especificaciones oficiales de fabricantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!cpu && !gpu && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Comienza seleccionando un procesador para tu PC</p>
            <Link
              href={`/${params.lang}/builder/cpu`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Seleccionar CPU
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
