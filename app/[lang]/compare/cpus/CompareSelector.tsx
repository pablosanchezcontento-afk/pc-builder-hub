'use client';

import { useRouter } from 'next/navigation';
import type { CPU } from '@/lib/db/types';

interface CompareSelectorProps {
  cpus: CPU[];
  cpuA: CPU | null;
  cpuB: CPU | null;
  lang: string;
  slugA?: string;
  slugB?: string;
}

export default function CompareSelector({
  cpus,
  cpuA,
  cpuB,
  lang,
  slugA,
  slugB
}: CompareSelectorProps) {
  const router = useRouter();

  const handleSelectA = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set('a', slug);
    if (slugB) params.set('b', slugB);
    router.push(`/${lang}/compare/cpus?${params.toString()}`);
  };

  const handleSelectB = (slug: string) => {
    const params = new URLSearchParams();
    if (slugA) params.set('a', slugA);
    if (slug) params.set('b', slug);
    router.push(`/${lang}/compare/cpus?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label htmlFor="cpu-a" className="block text-sm font-medium mb-2">
          CPU A
        </label>
        <select
          id="cpu-a"
          className="w-full p-2 border rounded"
          value={slugA || ''}
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
          value={slugB || ''}
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
  );
}
