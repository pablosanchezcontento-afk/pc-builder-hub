import { getAllGPUs, getGPUBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import CompareSelector from './CompareSelector';

interface PageProps {
  params: { lang: string };
  searchParams: { a?: string; b?: string };
}

export default async function CompareGPUsPage({ params, searchParams }: PageProps) {
  const gpus = await getAllGPUs();
  const gpuA = searchParams.a ? await getGPUBySlug(searchParams.a) : null;
  const gpuB = searchParams.b ? await getGPUBySlug(searchParams.b) : null;

  // Si se especifica un slug pero no existe, mostrar 404
  if ((searchParams.a && !gpuA) || (searchParams.b && !gpuB)) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Comparador de GPUs</h1>

      <CompareSelector
        gpus={gpus}
        gpuA={gpuA}
        gpuB={gpuB}
        lang={params.lang}
        slugA={searchParams.a}
        slugB={searchParams.b}
      />

      {gpuA && gpuB && (
        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Especificación</th>
                <th className="border p-3 text-left">{gpuA.manufacturer_name} {gpuA.model}</th>
                <th className="border p-3 text-left">{gpuB.manufacturer_name} {gpuB.model}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3 font-medium">Fabricante</td>
                <td className="border p-3">{gpuA.manufacturer_name}</td>
                <td className="border p-3">{gpuB.manufacturer_name}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Modelo</td>
                <td className="border p-3">{gpuA.model}</td>
                <td className="border p-3">{gpuB.model}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">VRAM (GB)</td>
                <td className="border p-3">{gpuA.vram_gb ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{gpuB.vram_gb ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Frecuencia Base (MHz)</td>
                <td className="border p-3">{gpuA.base_clock_mhz ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{gpuB.base_clock_mhz ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Frecuencia Boost (MHz)</td>
                <td className="border p-3">{gpuA.boost_clock_mhz ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{gpuB.boost_clock_mhz ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">TDP (W)</td>
                <td className="border p-3">{gpuA.tdp_watts ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{gpuB.tdp_watts ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Interfaz</td>
                <td className="border p-3">{gpuA.interface ?? 'No especificado oficialmente'}</td>
                <td className="border p-3">{gpuB.interface ?? 'No especificado oficialmente'}</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Precio Referencia (USD)</td>
                <td className="border p-3">{gpuA.price_usd ? `$${gpuA.price_usd}` : 'No especificado oficialmente'}</td>
                <td className="border p-3">{gpuB.price_usd ? `$${gpuB.price_usd}` : 'No especificado oficialmente'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!gpuA && !gpuB && (
        <div className="text-center text-gray-500 py-12">
          <p>Selecciona dos GPUs para comparar sus especificaciones</p>
        </div>
      )}

      {((gpuA && !gpuB) || (!gpuA && gpuB)) && (
        <div className="text-center text-gray-500 py-12">
          <p>Selecciona una segunda GPU para realizar la comparación</p>
        </div>
      )}
    </div>
  );
}
