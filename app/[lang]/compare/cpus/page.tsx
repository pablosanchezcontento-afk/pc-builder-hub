import { getAllCPUs, getCPUBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import CompareSelector from './CompareSelector';

interface PageProps {
  params: { lang: string };
  searchParams: { a?: string; b?: string };
}

export default async function CompareCPUsPage({ params, searchParams }: PageProps) {
  const cpus = await getAllCPUs();
  const cpuA = searchParams.a ? await getCPUBySlug(searchParams.a) : null;
  const cpuB = searchParams.b ? await getCPUBySlug(searchParams.b) : null;

  // Si se especifica un slug pero no existe, mostrar 404
  if ((searchParams.a && !cpuA) || (searchParams.b && !cpuB)) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Comparador de CPUs</h1>

      <CompareSelector
        cpus={cpus}
        cpuA={cpuA}
        cpuB={cpuB}
        lang={params.lang}
        slugA={searchParams.a}
        slugB={searchParams.b}
      />

      {cpuA && cpuB && (
        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Especificación</th>
                <th className="border p-3 text-left">{cpuA.manufacturer_name} {cpuA.model}</th>
                <th className="border p-3 text-left">{cpuB.manufacturer_name} {cpuB.model}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3 font-medium">Fabricante</td>
                <td className="border p-3">{cpuA.manufacturer_name}</td>
                <td className="border p-3">{cpuB.manufacturer_name}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Modelo</td>
                <td className="border p-3">{cpuA.model}</td>
                <td className="border p-3">{cpuB.model}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Núcleos</td>
                <td className="border p-3">{cpuA.cores ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{cpuB.cores ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Hilos</td>
                <td className="border p-3">{cpuA.threads ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{cpuB.threads ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Frecuencia Base (GHz)</td>
                <td className="border p-3">{cpuA.base_clock_ghz ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{cpuB.base_clock_ghz ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Frecuencia Turbo (GHz)</td>
                <td className="border p-3">{cpuA.boost_clock_ghz ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{cpuB.boost_clock_ghz ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">TDP (W)</td>
                <td className="border p-3">{cpuA.tdp_watts ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{cpuB.tdp_watts ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Socket</td>
                <td className="border p-3">{cpuA.socket ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{cpuB.socket ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Precio Referencia (USD)</td>
                <td className="border p-3">{cpuA.price_usd ? `$${cpuA.price_usd}` : 'No especificado oficialmente'}</td>
                <td className="border p-3">{cpuB.price_usd ? `$${cpuB.price_usd}` : 'No especificado oficialmente'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!cpuA && !cpuB && (
        <div className="text-center text-gray-500 py-12">
          <p>Selecciona dos CPUs para comparar sus especificaciones</p>
        </div>
      )}

      {((cpuA && !cpuB) || (!cpuA && cpuB)) && (
        <div className="text-center text-gray-500 py-12">
          <p>Selecciona una segunda CPU para realizar la comparación</p>
        </div>
      )}
    </div>
  );
}
