import Link from 'next/link';
import { getAllGPUs, createSlug } from '@/lib/db';

export default function GPUsPage({ params }: { params: { lang: string } }) {
  const gpus = getAllGPUs();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tarjetas Gr\u00e1ficas (GPUs)</h1>
      
      {gpus.length === 0 ? (
        <p className="text-gray-600">No hay GPUs disponibles.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gpus.map((gpu) => {
            const slug = createSlug(gpu.model);
            
            return (
              <Link 
                key={gpu.id} 
                href={`/${params.lang}/gpus/${slug}`}
                className="border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{gpu.model}</h2>
                <p className="text-sm text-gray-600 mb-4">{gpu.manufacturer_name}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Memoria:</span>
                    <span className="font-medium">{gpu.memory_gb} GB {gpu.memory_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frecuencia Base:</span>
                    <span className="font-medium">{gpu.core_clock_mhz} MHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frecuencia Boost:</span>
                    <span className="font-medium">{gpu.boost_clock_mhz} MHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TDP:</span>
                    <span className="font-medium">{gpu.tdp_watts}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interfaz:</span>
                    <span className="font-medium">{gpu.interface}</span>
                  </div>
                </div>
                
                {gpu.current_price_eur && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-2xl font-bold text-blue-600">
                      \u20ac{gpu.current_price_eur.toFixed(2)}
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
