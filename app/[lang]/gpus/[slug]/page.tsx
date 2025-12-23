import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGPUBySlug } from '@/lib/db';

export default  asyncfunction GPUDetailPage({ 
  params 
}: { 
    params: Promise<{ slug: string; lang: string }>
      }) {
    const { slug, lang } = await params;
  const gpu = getGPUBySlug(slug);
  if (!gpu) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href={`/${lang}/gpus`}        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        \u2190 Volver a GPUs
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-b pb-6 mb-6">
          <h1 className="text-4xl font-bold mb-2">{gpu.model}</h1>
          <p className="text-xl text-gray-600">{gpu.manufacturer_name}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Especificaciones</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Memoria:</span>
                <span>{gpu.memory_gb} GB {gpu.memory_type}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Frecuencia Base:</span>
                <span>{gpu.core_clock_mhz} MHz</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Frecuencia Boost:</span>
                <span>{gpu.boost_clock_mhz} MHz</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">TDP:</span>
                <span>{gpu.tdp_watts}W</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Interfaz:</span>
                <span>{gpu.interface}</span>
              </div>
            </div>
          </div>

          <div>
            {gpu.current_price_eur && (
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-2">Precio Actual</h2>
                <p className="text-4xl font-bold text-blue-600">
                  \u20ac{gpu.current_price_eur.toFixed(2)}
                </p>
                {gpu.price_recorded_at && (
                  <p className="text-sm text-gray-600 mt-2">
                    \u00daltima actualizaci\u00f3n: {new Date(gpu.price_recorded_at).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            )}

            {gpu.spec_source_url && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Fuente Oficial</h2>
                <a 
                  href={gpu.spec_source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {gpu.spec_source_domain || gpu.spec_source_url}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>ID: {gpu.external_id}</p>
          <p>Creado: {new Date(gpu.created_at).toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
}
