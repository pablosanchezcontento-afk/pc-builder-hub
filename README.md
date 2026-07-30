# PC Builder Hub

Aplicación web multilingüe para explorar y comparar componentes de PC usando especificaciones verificables. El proyecto evita rankings opacos y no presenta estimaciones de rendimiento como si fueran datos oficiales.

## Funcionalidades

- Catálogo de CPUs y GPUs.
- Fichas por componente y rutas filtradas por socket o VRAM.
- Comparadores lado a lado.
- Builder con comprobaciones básicas de compatibilidad.
- SQLite en modo de solo lectura para la aplicación.
- Rutas localizadas con Next.js App Router.

## Stack

- Next.js 15, React 19 y TypeScript.
- SQLite mediante `better-sqlite3`.
- Tailwind CSS.

## Desarrollo local

```bash
npm ci
npm run dev
```

La aplicación espera la base de datos en `data/pc_components.db`. Antes de publicar datos nuevos, conserva la fuente original, fecha de consulta y URL del fabricante.

## Verificación

```bash
npm run lint
npm run build
```

## Principios de datos

1. Una especificación debe tener fuente identificable.
2. Un dato desconocido no se sustituye por una estimación.
3. Las comparaciones muestran diferencias; no inventan un ganador.
4. La compatibilidad mostrada es orientativa y no cubre por sí sola fuente, BIOS, dimensiones, refrigeración o consumo transitorio.

## Estado

Proyecto en desarrollo. Las siguientes prioridades son ampliar pruebas, documentar la procedencia de cada registro y desplegar una demo estable.
