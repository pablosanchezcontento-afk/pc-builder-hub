# PC Builder Hub

PC Builder Hub is a transparent PC component explorer, comparison tool and compatibility-first PC builder. It uses manufacturer specifications instead of invented aggregate scores.

## What it does

- Browse CPUs and GPUs from a local SQLite catalogue.
- Compare components side by side using their published specifications.
- Build a CPU + GPU configuration and receive explainable compatibility checks.
- Navigate in Spanish or English.
- Keep every component tied to a source and verification state.

## Product principles

1. **No fake benchmark scores.** The project does not invent performance rankings.
2. **Explain every warning.** Compatibility results state the rule that triggered them.
3. **Separate facts from advice.** Manufacturer specifications are facts; recommendations are labelled as guidance.
4. **Fail honestly.** Missing data is shown as unknown instead of silently guessed.

## Tech stack

- Next.js 15 App Router
- React 19 and TypeScript
- SQLite through `better-sqlite3`
- Tailwind CSS

## Run locally

```bash
npm install
npm run dev
```

The application expects the catalogue at `data/pc_components.db`. The database should expose the views `v_cpus_complete` and `v_gpus_complete` used by the read-only data layer.

## Quality checks

```bash
npm run lint
npm run build
```

Pull requests run the same checks through GitHub Actions.

## Current scope

The public version focuses on CPUs, GPUs, comparisons and an explainable CPU/GPU builder. PSU sizing, motherboard selection, RAM, storage, physical dimensions and live prices are intentionally outside the validated scope until the catalogue contains enough structured data to support them reliably.

## Data quality

Every imported record should include:

- manufacturer and model;
- official source URL;
- source retrieval or verification date;
- explicit nulls for unavailable fields;
- no inferred benchmark or performance score.

## Portfolio note

This repository demonstrates product definition, source-aware data modelling, explainable compatibility rules and quality-gated delivery. Coding assistants may be used during implementation, but product scope, validation criteria and final review remain human-directed.
