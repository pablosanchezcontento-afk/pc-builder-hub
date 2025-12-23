import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCPUBySlug } from '@/lib/db';

export default async function CPUDetailPage({
  params
}: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const { slug, lang } = await params;
  const cpu = getCPUBySlug(slug);

  if (!cpu) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href={`/${lang}/cpus`}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Volver a CPUs
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
                <span className="font-medium">Núcleos:</span>
                <span>{cpu.cores}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Hilos:</span>
                <span>{cpu.threads}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Frecuencia Base:</span>
                <span>{cpu.base_clock} GHz</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Frecuencia Boost:</span>
                <span>{cpu.boost_clock} GHz</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Socket:</span>
                <span>{cpu.socket}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">TDP:</span>
                <span>{cpu.tdp}W</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Información Adicional</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Proceso de Fabricación:</span>
                <span>{cpu.process_nm}nm</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Caché L3:</span>
                <span>{cpu.l3_cache_mb}MB</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Memoria Máxima:</span>
                <span>{cpu.max_memory_gb}GB</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Soporte PCIe:</span>
                <span>{cpu.pcie_version}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Gráficos Integrados:</span>
                <span>{cpu.integrated_graphics || 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
