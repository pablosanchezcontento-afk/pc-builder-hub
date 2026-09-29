# PC Builder Hub

[![CI](https://github.com/pablosanchezcontento-afk/pc-builder-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/pablosanchezcontento-afk/pc-builder-hub/actions/workflows/ci.yml)

Multi-language (English, Español, Português) catalog, comparator and build planner for CPUs and GPUs.
Every specification comes from the manufacturer's official page, and **every source URL is validated
against an allowlist before it enters the database**. When a figure is not officially published it is
shown as *not published*: nothing is guessed.

## Features

| Route | What it does |
|---|---|
| `/{lang}` | overview, number of components and validated sources |
| `/{lang}/cpus`, `/{lang}/gpus` | catalog cards with parsed specs |
| `/{lang}/cpus/{slug}`, `/{lang}/gpus/{slug}` | detail page with official spec and retailer links |
| `/{lang}/cpus/socket/{socket}`, `/{lang}/gpus/vram/{gb}` | filtered listings (statically generated) |
| `/{lang}/compare/cpus?a=…&b=…`, `/{lang}/compare/gpus?a=…&b=…` | side-by-side comparison; the better value is highlighted (lower is better for power) |
| `/{lang}/builder?cpu=…&gpu=…` | estimated peak draw and recommended PSU, socket reminder, total price when prices are recorded |

`/` redirects to the best language from `Accept-Language` (quality values honoured, English fallback).
Forms use plain `GET`, so comparisons and builds are shareable URLs and work without JavaScript.

## Data model

```
data/seed.ts ──validateSourceStrict()──▶ lib/db/populate.ts ──▶ SQLite (db/schema.sql)
                                                                 ├─ manufacturers, components, cpu_specs, gpu_specs
                                                                 ├─ sources, component_sources (provenance), prices
                                                                 └─ views v_cpus_complete / v_gpus_complete
lib/db/index.ts (read-only) ─▶ typed CPU / GPU objects ─▶ pages
```

* **Allowlist** (`lib/allowlist.config.ts`): `intel.com` (CPU specs), `amd.com` (CPU + GPU specs),
  `nvidia.com` (GPU specs), `pccomponentes.com` (prices). Only `http(s)` URLs; look-alike domains are rejected;
  a source is also checked against the data type it provides (Intel cannot be a price source).
* **Import is transactional**: one unapproved source aborts the whole import.
* **Prices**: the seed contains retailer links but no prices, because none were recorded from the source.
  The UI therefore shows "No recorded price"; the `prices` table and the builder total are ready for real data.
* The site uses `data/pc_components.db` if present (`npm run db:build`); otherwise it builds the same catalog
  in memory at startup from the schema and the validated seed.

## Development

Requires Node.js 20+.

```bash
npm ci
npm run dev          # http://localhost:3000
npm run db:build     # optional: write data/pc_components.db
```

Quality gates (all run in CI):

```bash
npm run lint         # ESLint (next/core-web-vitals + typescript)
npm run typecheck    # tsc --noEmit, strict
npm test             # Vitest: validator, parsers, builder maths, database, i18n parity
npm run build        # next build (static generation of all catalog pages)
npm run smoke        # starts the production server and checks every route
```

## Adding a component

1. Add a `ComponentSpec` to `data/seed.ts` with the official specs URL and the retailer URL.
2. Use `null` for anything the manufacturer does not publish.
3. Run `npm test`: the seed test fails if a source is not on the allowlist for its data type.

To approve a new source domain, add it to `ALLOWED_SOURCES` with the data types it may provide.

## Project layout

```
app/[lang]/           pages (layout sets <html lang>, metadata and hreflang alternates)
components/           header, language switcher, spec tables, compare table/picker
lib/catalog.ts        pure helpers: parsing, comparison, PSU estimate
lib/db/               schema population and read-only queries
lib/dictionaries/     en / es / pt strings (parity enforced by tests)
lib/validateSource.ts source validation
tests/                Vitest suites
scripts/              build-db.ts, smoke.mjs
docs/                 historical notes
```

## Notes

* The PSU recommendation is an estimate: CPU TDP + GPU board power + 100 W for the rest of the system,
  with 30 % headroom, rounded up to 50 W. Check your GPU vendor's PSU recommendation as well.
* Automatic Vercel deployments are disabled in `vercel.json`.
