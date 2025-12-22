import { getCPUBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: { lang: string; comparison: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slugs = params.comparison.split('-vs-');
  if (slugs.length !== 2) return { title: 'Comparación no válida' };

  const [cpuA, cpuB] = await Promise.all([
    getCPUBySlug(slugs[0]),
    getCPUBySlug(slugs[1])
  ]);

  if (!cpuA || !cpuB) return { title: 'Comparación no encontrada' };

  return {
    title: `${cpuA.manufacturer_name} ${cpuA.model} vs ${cpuB.manufacturer_name} ${cpuB.model} - Comparación Técnica`,
    description: `Comparación detallada de especificaciones oficiales entre ${cpuA.manufacturer_name} ${cpuA.model} y ${cpuB.manufacturer_name} ${cpuB.model}. Socket, núcleos, frecuencias y más.`
  };
}

export default async function CPUComparisonPage({ params }: PageProps) {
  const slugs = params.comparison.split('-vs-');
  
  if (slugs.length !== 2) {
    notFound();
  }

  const [cpuA, cpuB] = await Promise.all([
    getCPUBySlug(slugs[0]),
    getCPUBySlug(slugs[1])
  ]);

  if (!cpuA || !cpuB) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO Optimized Heading */}
      <h1 className="text-3xl font-bold mb-4">
        {cpuA.manufacturer_name} {cpuA.model} vs {cpuB.manufacturer_name} {cpuB.model}
      </h1>
      
      <p className="text-gray-600 mb-8">
        Comparación técnica basada en especificaciones oficiales de fabricantes
      </p>

      {/* Comparison Table */}
      <div className="overflow-x-auto mb-8">
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

      {/* SEO Content - Auto-generated comparison text */}
      <div className="prose max-w-none mb-8">
        <h2 className="text-2xl font-semibold mb-4">Análisis de Especificaciones</h2>
        
        <div className="space-y-4 text-gray-700">
          {cpuA.cores && cpuB.cores && (
            <p>
              En cuanto a núcleos, {cpuA.cores > cpuB.cores ? 
                `el ${cpuA.manufacturer_name} ${cpuA.model} ofrece ${cpuA.cores} núcleos frente a los ${cpuB.cores} del ${cpuB.manufacturer_name} ${cpuB.model}` :
                cpuA.cores < cpuB.cores ?
                `el ${cpuB.manufacturer_name} ${cpuB.model} ofrece ${cpuB.cores} núcleos frente a los ${cpuA.cores} del ${cpuA.manufacturer_name} ${cpuA.model}` :
                `ambos procesadores cuentan con ${cpuA.cores} núcleos`
              }.
            </p>
          )}
          
          {cpuA.base_clock_ghz && cpuB.base_clock_ghz && (
            <p>
              La frecuencia base es de {cpuA.base_clock_ghz} GHz para el {cpuA.manufacturer_name} {cpuA.model} y {cpuB.base_clock_ghz} GHz para el {cpuB.manufacturer_name} {cpuB.model}.
            </p>
          )}

          {cpuA.socket && cpuB.socket && cpuA.socket !== cpuB.socket && (
            <p className="font-medium">
              <strong>Importante:</strong> Estos procesadores utilizan sockets diferentes ({cpuA.socket} vs {cpuB.socket}), por lo que no son intercambiables en la misma placa base.
            </p>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-sm text-yellow-800">
          <strong>Aviso:</strong> Esta comparación se basa únicamente en especificaciones oficiales de fabricantes. No incluye benchmarks de rendimiento ni análisis de casos de uso específicos. Los datos mostrados pueden no estar completos si el fabricante no los ha publicado oficialmente.
        </p>
      </div>

      {/* Links */}
      <div className="flex gap-4">
        <Link href={`/${params.lang}/cpus/${cpuA.slug}`} className="text-blue-600 hover:underline">
          Ver detalles de {cpuA.model}
        </Link>
        <Link href={`/${params.lang}/cpus/${cpuB.slug}`} className="text-blue-600 hover:underline">
          Ver detalles de {cpuB.model}
        </Link>
        <Link href={`/${params.lang}/compare/cpus`} className="text-blue-600 hover:underline">
          Comparar otros CPUs
        </Link>
      </div>
    </div>
  );
}
