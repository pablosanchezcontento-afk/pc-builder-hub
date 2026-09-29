/**
 * Builds the SQLite catalog from db/schema.sql and the curated seed in data/seed.ts.
 * Every source URL is validated against the allowlist before it is stored: an unapproved source aborts the build.
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { seedComponents, type ComponentSpec } from '../../data/seed';
import { extractDomain } from '../allowlist.config';
import { validateSourceStrict } from '../validateSource';

export const SCHEMA_PATH = resolve(process.cwd(), 'db/schema.sql');

const MANUFACTURER_WEBSITES: Record<ComponentSpec['brand'], string> = {
  Intel: 'https://www.intel.com',
  AMD: 'https://www.amd.com',
  NVIDIA: 'https://www.nvidia.com',
};

export interface PopulateReport {
  manufacturers: number;
  cpus: number;
  gpus: number;
  sources: number;
}

export function populate(db: Database.Database, components: ComponentSpec[] = seedComponents): PopulateReport {
  db.pragma('foreign_keys = ON');
  db.exec(readFileSync(SCHEMA_PATH, 'utf-8'));

  const insertManufacturer = db.prepare(
    'INSERT INTO manufacturers (name, website) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET website = excluded.website',
  );
  const manufacturerId = db.prepare<[string], { id: number }>('SELECT id FROM manufacturers WHERE name = ?');
  const insertComponent = db.prepare(
    `INSERT INTO components (external_id, manufacturer_id, model, type) VALUES (?, ?, ?, ?)
     ON CONFLICT(external_id) DO UPDATE SET model = excluded.model, manufacturer_id = excluded.manufacturer_id`,
  );
  const componentId = db.prepare<[string], { id: number }>('SELECT id FROM components WHERE external_id = ?');
  const upsertCpu = db.prepare(
    `INSERT INTO cpu_specs (component_id, cores, threads, base_clock, boost_clock, tdp, socket) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(component_id) DO UPDATE SET cores = excluded.cores, threads = excluded.threads,
       base_clock = excluded.base_clock, boost_clock = excluded.boost_clock, tdp = excluded.tdp, socket = excluded.socket`,
  );
  const upsertGpu = db.prepare(
    `INSERT INTO gpu_specs (component_id, cuda_cores, stream_processors, base_clock, boost_clock, memory, memory_type, tdp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(component_id) DO UPDATE SET cuda_cores = excluded.cuda_cores, stream_processors = excluded.stream_processors,
       base_clock = excluded.base_clock, boost_clock = excluded.boost_clock, memory = excluded.memory,
       memory_type = excluded.memory_type, tdp = excluded.tdp`,
  );
  const insertSource = db.prepare('INSERT OR IGNORE INTO sources (url, domain, data_type, is_allowed) VALUES (?, ?, ?, 1)');
  const sourceId = db.prepare<[string], { id: number }>('SELECT id FROM sources WHERE url = ?');
  const linkSource = db.prepare(
    `INSERT INTO component_sources (component_id, source_id, source_type, verified_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(component_id, source_id, source_type) DO UPDATE SET verified_at = excluded.verified_at`,
  );

  const addSource = (url: string, dataType: 'cpu_specs' | 'gpu_specs' | 'price'): number => {
    validateSourceStrict(url, dataType);
    insertSource.run(url, extractDomain(url), dataType);
    return sourceId.get(url)!.id;
  };

  const run = db.transaction((items: ComponentSpec[]) => {
    for (const brand of new Set<ComponentSpec["brand"]>(items.map(item => item.brand))) {
      insertManufacturer.run(brand, MANUFACTURER_WEBSITES[brand]);
    }
    for (const item of items) {
      const expected = item.type === 'CPU' ? 'cpu_specs' : 'gpu_specs';
      if (item.sources.specsDataType !== expected) {
        throw new Error(`${item.id}: ${item.type} must use ${expected} sources, got ${item.sources.specsDataType}`);
      }
      insertComponent.run(item.id, manufacturerId.get(item.brand)!.id, item.model, item.type);
      const id = componentId.get(item.id)!.id;
      const s = item.specs;
      if (item.type === 'CPU') {
        upsertCpu.run(id, s.cores ?? null, s.threads ?? null, s.baseClock ?? null, s.boostClock ?? null, s.tdp ?? null, s.socket ?? null);
      } else {
        upsertGpu.run(id, s.cudaCores ?? null, s.streamProcessors ?? null, s.baseClock ?? null, s.boostClock ?? null,
          s.memory ?? null, s.memoryType ?? null, s.tdp ?? null);
      }
      linkSource.run(id, addSource(item.sources.specsUrl, expected), 'specs', item.sources.lastVerified);
      linkSource.run(id, addSource(item.sources.priceUrl, 'price'), 'price', item.sources.lastVerified);
    }
  });
  run(components);

  const count = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  return {
    manufacturers: count('SELECT COUNT(*) AS n FROM manufacturers'),
    cpus: count("SELECT COUNT(*) AS n FROM components WHERE type = 'CPU'"),
    gpus: count("SELECT COUNT(*) AS n FROM components WHERE type = 'GPU'"),
    sources: count('SELECT COUNT(*) AS n FROM sources'),
  };
}

export function createCatalogDatabase(path = ':memory:'): Database.Database {
  const db = new Database(path);
  populate(db);
  return db;
}
