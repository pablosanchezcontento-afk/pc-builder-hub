import Link from 'next/link';
import { getAllCPUs, createSlug } from '@/lib/db';

export default async function CPUsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
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
                href={`/${lang}/cpus/${slug}`}
                className="border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{cpu.model}</h2>
                <p className="text-sm text-gray-600 mb-4">{cpu.manufacturer_name}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Núcleos:</span>
                    <span className="font-medium">{cpu.cores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hilos:</span>
                    <span className="font-medium">{cpu.threads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frecuencia Base:</span>
                    <span className="font-medium">{cpu.base_clock} GHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TDP:</span>
                    <span className="font-medium">{cpu.tdp}W</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
