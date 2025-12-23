import { getAllGPUs, getGPUBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import CompareSelector from './CompareSelector';
interface PageProps {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function CompareGPUsPage({ params, searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const { lang } = await params;
    const gpuA = resolvedSearchParams.a ? await getGPUBySlug(resolvedSearchParams.a) : null;
    const gpuB = resolvedSearchParams.b ? await getGPUBySlug(resolvedSearchParams.b) : null;

    const gpus = await getAllGPUs();

    // Si se especifica un slug pero no existe, mostrar 404
    if ((resolvedSearchParams.a && !gpuA) || (resolvedSearchParams.b && !gpuB)) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Comparador de GPUs</h1>

            <CompareSelector
                gpus={gpus}
                gpuA={gpuA}
                gpuB={gpuB}
                lang={lang}
                slugA={resolvedSearchParams.a}
                slugB={resolvedSearchParams.b}
            />
        </div>
    );
}
