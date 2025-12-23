import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string }>;}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
      const { lang } = await params;
    title: 'PC Builder Hub – Comparador de componentes de PC',
    description: 'Compara especificaciones oficiales de CPUs y GPUs. Sin rankings, sin benchmarks inventados. Solo datos verificados de fabricantes.',
  };
}

export default async function HomePage({ params }: PageProps) {
    const { lang } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            PC Builder Hub
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Comparador de componentes de PC basado en especificaciones oficiales
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Sin benchmarks inventados. Sin rankings engañosos. Solo datos verificados de fabricantes para que tomes decisiones informadas.
          </p>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            ¿Qué quieres hacer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ver CPUs */}
            <Link
              href={`/${params.lang}/cpus`}
              className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-6 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-4">🖥️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ver Procesadores
              </h3>
              <p className="text-gray-600 text-sm">
                Explora todos los CPUs con especificaciones oficiales
              </p>
            </Link>

            {/* Ver GPUs */}
            <Link
              href={`/${params.lang}/gpus`}
              className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg p-6 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ver Tarjetas Gráficas
              </h3>
              <p className="text-gray-600 text-sm">
                Consulta todas las GPUs disponibles en nuestra base de datos
              </p>
            </Link>

            {/* Comparar CPUs */}
            <Link
              href={`/${params.lang}/compare/cpus`}
              className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-6 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comparar CPUs
              </h3>
              <p className="text-gray-600 text-sm">
                Compara dos procesadores lado a lado
              </p>
            </Link>

            {/* PC Builder */}
            <Link
              href={`/${params.lang}/builder`}
              className="bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-lg p-6 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Armador de PC
              </h3>
              <p className="text-gray-600 text-sm">
                Selecciona componentes y verifica compatibilidad básica
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            ¿Cómo funciona?
          </h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Explora componentes reales
                </h3>
                <p className="text-gray-600">
                  Consulta listados de CPUs y GPUs con especificaciones oficiales de fabricantes. Sin datos inventados ni estimaciones.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Compara especificaciones
                </h3>
                <p className="text-gray-600">
                  Usa el comparador para ver diferencias de núcleos, frecuencias, VRAM y más. Comparaciones honestas sin "ganadores" artificiales.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Arma tu configuración
                </h3>
                <p className="text-gray-600">
                  Selecciona CPU y GPU, verifica compatibilidad básica de socket y PCIe. El builder no evalúa rendimiento ni consumo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📍 Compromiso de transparencia
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Solo especificaciones oficiales:</strong> Todos los datos provienen directamente de fabricantes. No inventamos benchmarks ni puntuaciones de rendimiento.
              </p>
              <p>
                <strong>Sin rankings engañosos:</strong> No creamos listas de "mejores CPUs" ni recomendaciones automáticas. Tú decides qué especificaciones son importantes para ti.
              </p>
              <p>
                <strong>Compatibilidad básica:</strong> El builder verifica socket y PCIe, pero NO valida potencia de fuente, cuello de botella ni rendimiento real.
              </p>
              <p>
                <strong>Datos verificados:</strong> Nuestra base de datos contiene componentes reales con información verificable. Si un dato no está disponible, lo indicamos claramente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Listo para comparar componentes
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Empieza explorando procesadores o tarjetas gráficas
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={`/${params.lang}/cpus`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ver todos los CPUs
            </Link>
            <Link
              href={`/${params.lang}/gpus`}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ver todas las GPUs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
