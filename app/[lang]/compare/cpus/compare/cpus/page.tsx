'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CPU } from '@/lib/db/types';

export default function CompareCPUsPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cpus, setCpus] = useState<CPU[]>([]);
  const [cpuA, setCpuA] = useState<CPU | null>(null);
  const [cpuB, setCpuB] = useState<CPU | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cpus')
      .then(res => res.json())
      .then(data => {
        setCpus(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const slugA = searchParams.get('a');
    const slugB = searchParams.get('b');

    if (slugA) {
      fetch(`/api/cpus/${slugA}`)
        .then(res => res.json())
        .then(data => setCpuA(data));
    } else {
      setCpuA(null);
    }

    if (slugB) {
      fetch(`/api/cpus/${slugB}`)
        .then(res => res.json())
        .then(data => setCpuB(data));
    } else {
      setCpuB(null);
    }
  }, [searchParams]);

  const handleSelectA = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('a', slug);
    } else {
      params.delete('a');
    }
    router.push(`/${params.lang}/compare/cpus?${params.toString()}`);
  };

  const handleSelectB = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('b', slug);
    } else {
      params.delete('b');
    }
    router.push(`/${params.lang}/compare/cpus?${params.toString()}`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Comparador de CPUs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label htmlFor="cpu-a" className="block text-sm font-medium mb-2">
            CPU A
          </label>
          <select
            id="cpu-a"
            className="w-full p-2 border rounded"
            value={searchParams.get('a') || ''}
            onChange={(e) => handleSelectA(e.target.value)}
          >
            <option value="">Seleccionar CPU...</option>
            {cpus.map((cpu) => (
              <option key={cpu.id} value={cpu.slug}>
                {cpu.manufacturer_name} {cpu.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cpu-b" className="block text-sm font-medium mb-2">
            CPU B
          </label>
          <select
            id="cpu-b"
            className="w-full p-2 border rounded"
            value={searchParams.get('b') || ''}
            onChange={(e) => handleSelectB(e.target.value)}
          >
            <option value="">Seleccionar CPU...</option>
            {cpus.map((cpu) => (
              <option key={cpu.id} value={cpu.slug}>
                {cpu.manufacturer_name} {cpu.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cpuA && cpuB && (
        <div className="overflow-x-auto">
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
