import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCPUBySlug } from '@/lib/db';

export default function CPUDetailPage({ 
  params 
}: { 
  params: { slug: string; lang: string } 
}) {
  const cpu = getCPUBySlug(params.slug);

  if (!cpu) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href={`/${params.lang}/cpus`}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        \u2190 Volver a CPUs
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-b pb-6 mb-6">
          <h1 className="text-4xl font-bold mb-2">{cpu.model}</h1>
          <p className="text-xl text-gray-600">{cpu.manufacturer_name}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Especificaciones</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">N\u00facleos:</span>
                <span>{cpu.cores}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Hilos:</span>
                <span>{cpu.threads}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Frecuencia Base:</span>
                <span>{cpu.base_clock_ghz} GHz</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Frecuencia Boost:</span>
                <span>{cpu.boost_clock_ghz} GHz</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">TDP:</span>
                <span>{cpu.tdp_watts}W</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Socket:</span>
                <span>{cpu.socket}</span>
              </div>
            </div>
          </div>

          <div>
            {cpu.current_price_eur && (
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-2">Precio Actual</h2>
                <p className="text-4xl font-bold text-blue-600">
                  \u20ac{cpu.current_price_eur.toFixed(2)}
                </p>
                {cpu.price_recorded_at && (
                  <p className="text-sm text-gray-600 mt-2">
                    \u00daltima actualizaci\u00f3n: {new Date(cpu.price_recorded_at).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            )}

            {cpu.spec_source_url && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Fuente Oficial</h2>
                <a 
                  href={cpu.spec_source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {cpu.spec_source_domain || cpu.spec_source_url}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>ID: {cpu.external_id}</p>
          <p>Creado: {new Date(cpu.created_at).toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
}
