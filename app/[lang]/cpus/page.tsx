import Link from 'next/link';
import { getAllCPUs, createSlug } from '@/lib/db';

export default function CPUsPage({ params }: { params: { lang: string } }) {
  const cpus = getAllCPUs();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Procesadores (CPUs)</h1>
      
      {cpus.length === 0 ? (
        <p className="text-gray-600">No hay CPUs disponibles.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cpus.map((cpu) => {
            const slug = createSlug(cpu.model);
            
            return (
              <Link 
                key={cpu.id} 
                href={`/${params.lang}/cpus/${slug}`}
                className="border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{cpu.model}</h2>
                <p className="text-sm text-gray-600 mb-4">{cpu.manufacturer_name}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">N\u00facleos:</span>
                    <span className="font-medium">{cpu.cores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hilos:</span>
                    <span className="font-medium">{cpu.threads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frecuencia Base:</span>
                    <span className="font-medium">{cpu.base_clock_ghz} GHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frecuencia Boost:</span>
                    <span className="font-medium">{cpu.boost_clock_ghz} GHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Socket:</span>
                    <span className="font-medium">{cpu.socket}</span>
                  </div>
                </div>
                
                {cpu.current_price_eur && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-2xl font-bold text-blue-600">
                      \u20ac{cpu.current_price_eur.toFixed(2)}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
