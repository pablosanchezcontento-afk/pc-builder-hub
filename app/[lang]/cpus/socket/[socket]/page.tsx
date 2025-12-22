import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCPUs } from '@/lib/db';

interface PageProps {
  params: { lang: string; socket: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const socketDecoded = decodeURIComponent(params.socket);
  return {
    title: `CPUs con Socket ${socketDecoded} - PC Builder Hub`,
    description: `Listado completo de procesadores compatibles con socket ${socketDecoded}. Especificaciones oficiales y comparaciones.`,
  };
}

export default function CPUSocketPage({ params }: PageProps) {
  const socketDecoded = decodeURIComponent(params.socket);
  const allCPUs = getAllCPUs();
  
  // Filtrar CPUs por socket
  const filteredCPUs = allCPUs.filter(
    (cpu) => cpu.socket && cpu.socket.toLowerCase() === socketDecoded.toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link href={`/${params.lang}/cpus`} className="text-blue-600 hover:underline">
          ← Volver a todos los CPUs
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-2">CPUs con Socket {socketDecoded}</h1>
      <p className="text-gray-600 mb-8">
        {filteredCPUs.length} procesador(es) compatible(s) encontrado(s)
      </p>

      {filteredCPUs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
          <p className="text-gray-600">No hay procesadores registrados para este socket.</p>
          <Link
            href={`/${params.lang}/cpus`}
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Ver todos los CPUs disponibles
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredCPUs.map((cpu) => (
            <div
              key={cpu.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{cpu.model}</h2>
                  <p className="text-gray-600">{cpu.manufacturer_name}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                    {cpu.socket}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Núcleos</p>
                  <p className="font-medium">{cpu.cores ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hilos</p>
                  <p className="font-medium">{cpu.threads ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frecuencia Base</p>
                  <p className="font-medium">{cpu.base_clock_ghz ? `${cpu.base_clock_ghz} GHz` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frecuencia Boost</p>
                  <p className="font-medium">{cpu.boost_clock_ghz ? `${cpu.boost_clock_ghz} GHz` : 'N/A'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/${params.lang}/cpus/${cpu.slug}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver especificaciones completas
                </Link>
                <Link
                  href={`/${params.lang}/compare/cpus`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Comparar con otros CPUs
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-6">
        <h3 className="text-lg font-semibold mb-2">Compatibilidad de Socket</h3>
        <p className="text-gray-700 text-sm">
          Los procesadores listados son compatibles con el socket <strong>{socketDecoded}</strong>.
          Asegúrese de que su placa base sea compatible con este socket antes de realizar una compra.
          Las especificaciones mostradas son oficiales de los fabricantes.
        </p>
      </div>
    </div>
  );
}
