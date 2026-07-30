import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'PC Builder Hub - Comparador de componentes de PC',
    description:
      'Compara especificaciones oficiales de CPUs y GPUs. Sin rankings, sin benchmarks inventados. Solo datos verificados de fabricantes.',
    alternates: {
      canonical: `/${lang}`,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">PC Builder Hub</h1>
          <p className="mb-4 text-xl text-gray-600">
            Comparador de componentes de PC basado en especificaciones oficiales
          </p>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Sin benchmarks inventados. Sin rankings engañosos. Solo datos verificables
            para tomar decisiones informadas.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            ¿Qué quieres hacer?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href={`/${lang}/cpus`}
              className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 transition-all hover:bg-blue-100 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl" aria-hidden="true">🖥️</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Ver procesadores</h3>
              <p className="text-sm text-gray-600">Explora CPUs con especificaciones oficiales.</p>
            </Link>

            <Link
              href={`/${lang}/gpus`}
              className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 transition-all hover:bg-purple-100 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl" aria-hidden="true">🎮</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Ver tarjetas gráficas</h3>
              <p className="text-sm text-gray-600">Consulta las GPUs disponibles en la base de datos.</p>
            </Link>

            <Link
              href={`/${lang}/compare/cpus`}
              className="rounded-lg border-2 border-green-200 bg-green-50 p-6 transition-all hover:bg-green-100 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl" aria-hidden="true">⚖️</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Comparar CPUs</h3>
              <p className="text-sm text-gray-600">Compara dos procesadores lado a lado.</p>
            </Link>

            <Link
              href={`/${lang}/builder`}
              className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6 transition-all hover:bg-orange-100 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl" aria-hidden="true">🔧</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Armador de PC</h3>
              <p className="text-sm text-gray-600">Selecciona componentes y revisa compatibilidad básica.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Cómo funciona</h2>
          <ol className="space-y-8">
            {[
              ['Explora componentes reales', 'Consulta CPUs y GPUs con especificaciones procedentes de fabricantes.'],
              ['Compara especificaciones', 'Revisa núcleos, frecuencias, memoria y otras diferencias sin ganadores artificiales.'],
              ['Arma tu configuración', 'Comprueba compatibilidad básica. El builder no sustituye una validación eléctrica o térmica completa.'],
            ].map(([title, description], index) => (
              <li className="flex gap-6" key={title}>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-lg border-2 border-yellow-400 bg-yellow-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Compromiso de transparencia</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Fuentes identificables:</strong> cada dato debería poder vincularse a una fuente oficial.</p>
            <p><strong>Sin puntuaciones inventadas:</strong> la aplicación compara especificaciones, no fabrica rendimiento.</p>
            <p><strong>Compatibilidad limitada:</strong> socket y PCIe no garantizan por sí solos una configuración válida.</p>
            <p><strong>Datos ausentes:</strong> cuando una especificación no esté verificada, debe mostrarse como desconocida.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
