import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCPUs } from '@/lib/db';

interface PageProps {
  params: Promise<{ lang: string; socket: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { socket } = await params;
  const socketDecoded = decodeURIComponent(socket);
  return {
    title: `CPUs con Socket ${socketDecoded} - PC Builder Hub`,
    description: `Listado completo de procesadores compatibles con socket ${socketDecoded}. Especificaciones oficiales y comparaciones.`,
  };
}

export default async function CPUSocketPage({ params }: PageProps) {
  const { lang, socket } = await params;
  const socketDecoded = decodeURIComponent(socket);
  const allCPUs = getAllCPUs();

  // Filtrar CPUs por socket
  const filteredCPUs = allCPUs.filter(
    (cpu) => cpu.socket && cpu.socket.toLowerCase() === socketDecoded.toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link href={`/${lang}/cpus`} className="text-blue-600 hover:underline">
          ← Volver a todos los CPUs
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-2">CPUs con Socket {socketDecoded}</h1>
      <p className="text-gray-600 mb-8">
        {filteredCPUs.length} procesador(es) compatible(s) encontrado(s)
      </p>

      {filteredCPUs.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-gray-700">
            No se encontraron procesadores con el socket <strong>{socketDecoded}</strong>.
          </p>
          <Link
            href={`/${lang}/cpus`}
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Ver todos los CPUs disponibles
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCPUs.map((cpu) => (
            <div
              key={cpu.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold mb-2">{cpu.model}</h2>
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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href={`/${lang}/cpus/${cpu.slug}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver especificaciones completas
                </Link>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/${lang}/cpus/${cpu.slug}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver especificaciones completas
                </Link>
                <Link
                  href={`/${lang}/compare/cpus`}
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
