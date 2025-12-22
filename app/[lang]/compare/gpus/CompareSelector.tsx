'use client';

import { useRouter } from 'next/navigation';
import type { GPU } from '@/lib/db/types';

interface CompareSelectorProps {
  gpus: GPU[];
  gpuA: GPU | null;
  gpuB: GPU | null;
  lang: string;
  slugA?: string;
  slugB?: string;
}

export default function CompareSelector({
  gpus,
  gpuA,
  gpuB,
  lang,
  slugA,
  slugB
}: CompareSelectorProps) {
  const router = useRouter();

  const handleSelectA = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set('a', slug);
    if (slugB) params.set('b', slugB);
    router.push(`/${lang}/compare/gpus?${params.toString()}`);
  };

  const handleSelectB = (slug: string) => {
    const params = new URLSearchParams();
    if (slugA) params.set('a', slugA);
    if (slug) params.set('b', slug);
    router.push(`/${lang}/compare/gpus?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label htmlFor="gpu-a" className="block text-sm font-medium mb-2">
          GPU A
        </label>
        <select
          id="gpu-a"
          className="w-full p-2 border rounded"
          value={slugA || ''}
          onChange={(e) => handleSelectA(e.target.value)}
        >
          <option value="">Seleccionar GPU...</option>
          {gpus.map((gpu) => (
            <option key={gpu.id} value={gpu.slug}>
              {gpu.manufacturer_name} {gpu.model}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="gpu-b" className="block text-sm font-medium mb-2">
          GPU B
        </label>
        <select
          id="gpu-b"
          className="w-full p-2 border rounded"
          value={slugB || ''}
          onChange={(e) => handleSelectB(e.target.value)}
        >
          <option value="">Seleccionar GPU...</option>
          {gpus.map((gpu) => (
            <option key={gpu.id} value={gpu.slug}>
              {gpu.manufacturer_name} {gpu.model}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
