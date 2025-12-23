import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGPUBySlug } from '@/lib/db';

interface PageProps {
    params: Promise<{ lang: string; comparison: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { comparison } = await params;
    const slugs = comparison.split('-vs-');
  if (slugs.length !== 2) return { title: 'Comparación no válida' };
  const [slugA, slugB] = parts;
  const gpuA = getGPUBySlug(slugA);
  const gpuB = getGPUBySlug(slugB);

  if (!gpuA || !gpuB) return { title: 'GPU no encontrada' };

  return {
    title: `${gpuA.model} vs ${gpuB.model} - Comparación de GPUs`,
    description: `Comparación detallada entre ${gpuA.model} y ${gpuB.model}. Especificaciones, diferencias de VRAM, frecuencias y arquitecturas.`,
  };
}

export default async function GPUComparisonPage({ params }: PageProps) {
    const { comparison } = await params;
  const slugs = comparison.split('-vs-');
  if (slugs.length !== 2) notFound();
  const [slugA, slugB] = parts;
  const gpuA = getGPUBySlug(slugA);
  const gpuB = getGPUBySlug(slugB);

  if (!gpuA || !gpuB) notFound();

  const specRows = [
    { label: 'Fabricante', valueA: gpuA.manufacturer_name, valueB: gpuB.manufacturer_name },
    { label: 'Modelo', valueA: gpuA.model, valueB: gpuB.model },
    { label: 'VRAM (GB)', valueA: gpuA.vram_gb, valueB: gpuB.vram_gb },
    { label: 'Tipo de Memoria', valueA: gpuA.memory_type, valueB: gpuB.memory_type },
    { label: 'Frecuencia Base (MHz)', valueA: gpuA.base_clock_mhz, valueB: gpuB.base_clock_mhz },
    { label: 'Frecuencia Boost (MHz)', valueA: gpuA.boost_clock_mhz, valueB: gpuB.boost_clock_mhz },
    { label: 'TDP (W)', valueA: gpuA.tdp_watts, valueB: gpuB.tdp_watts },
    { label: 'Interfaz PCIe', valueA: gpuA.pcie, valueB: gpuB.pcie },
    { label: 'Fecha de Lanzamiento', valueA: gpuA.release_date, valueB: gpuB.release_date },
  ];

  // Análisis automático
  const vramDiff = (gpuA.vram_gb ?? 0) - (gpuB.vram_gb ?? 0);
  const boostDiff = (gpuA.boost_clock_mhz ?? 0) - (gpuB.boost_clock_mhz ?? 0);
  const tdpDiff = (gpuA.tdp_watts ?? 0) - (gpuB.tdp_watts ?? 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link href={`/${params.lang}/compare/gpus`} className="text-blue-600 hover:underline">
          ← Volver al comparador de GPUs
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-2">
        {gpuA.model} vs {gpuB.model}
      </h1>
      <p className="text-gray-600 mb-8">Comparación de especificaciones oficiales</p>

      {/* Tabla de comparación */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Especificación</th>
              <th className="border border-gray-300 p-3 text-left">{gpuA.model}</th>
              <th className="border border-gray-300 p-3 text-left">{gpuB.model}</th>
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3 font-medium">{row.label}</td>
                <td className="border border-gray-300 p-3">
                  {row.valueA ?? <span className="text-gray-400">No especificado</span>}
                </td>
                <td className="border border-gray-300 p-3">
                  {row.valueB ?? <span className="text-gray-400">No especificado</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Análisis automático */}
      <div className="bg-blue-50 border border-blue-200 rounded p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Análisis de Especificaciones</h2>
        <div className="space-y-3 text-gray-700">
          {vramDiff !== 0 && (
            <p>
              <strong>VRAM:</strong> {gpuA.model} tiene {Math.abs(vramDiff)} GB {vramDiff > 0 ? 'más' : 'menos'} que {gpuB.model}.
              {Math.abs(vramDiff) >= 4 && ' Una diferencia significativa para tareas de renderizado y juegos en resoluciones altas.'}
            </p>
          )}
          {boostDiff !== 0 && (
            <p>
              <strong>Frecuencia Boost:</strong> {gpuA.model} tiene una frecuencia {Math.abs(boostDiff)} MHz {boostDiff > 0 ? 'superior' : 'inferior'} a {gpuB.model}.
            </p>
          )}
          {tdpDiff !== 0 && (
            <p>
              <strong>Consumo (TDP):</strong> {gpuA.model} consume {Math.abs(tdpDiff)}W {tdpDiff > 0 ? 'más' : 'menos'} que {gpuB.model}.
              {Math.abs(tdpDiff) >= 50 && ' Considere los requisitos de su fuente de alimentación.'}
            </p>
          )}
          {gpuA.memory_type !== gpuB.memory_type && gpuA.memory_type && gpuB.memory_type && (
            <p>
              <strong>Tipo de Memoria:</strong> {gpuA.model} usa {gpuA.memory_type} mientras que {gpuB.model} usa {gpuB.memory_type}.
            </p>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-400 rounded p-4 mb-8">
        <p className="text-sm text-yellow-800">
          <strong>Aviso:</strong> Esta comparación se basa únicamente en especificaciones oficiales de fabricantes.
          No incluye benchmarks de rendimiento real, pruebas de gaming, ni evaluación de drivers.
          Los datos mostrados provienen de nuestra base de datos de componentes verificados.
        </p>
      </div>

      {/* Links relacionados */}
      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Ver más detalles</h3>
        <div className="flex gap-4">
          <Link
            href={`/${params.lang}/gpus/${gpuA.slug}`}
            className="text-blue-600 hover:underline"
          >
            Ver detalles de {gpuA.model}
          </Link>
          <Link
            href={`/${params.lang}/gpus/${gpuB.slug}`}
            className="text-blue-600 hover:underline"
          >
            Ver detalles de {gpuB.model}
          </Link>
          <Link
            href={`/${params.lang}/compare/gpus`}
            className="text-blue-600 hover:underline"
          >
            Comparar otras GPUs
          </Link>
        </div>
      </div>
    </div>
  );
}
