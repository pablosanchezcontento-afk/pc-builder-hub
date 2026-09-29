import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type Database from 'better-sqlite3';
import { seedComponents, type ComponentSpec } from '@/data/seed';
import {
  getAllCPUs, getAllGPUs, getCPUBySlug, getCPUsBySocket, getGPUBySlug, getGPUsByVram, getSockets, getVramSizes, useDatabase,
} from '@/lib/db';
import { createCatalogDatabase, populate } from '@/lib/db/populate';
import { validateSource } from '@/lib/validateSource';

let db: Database.Database;

beforeAll(() => {
  db = createCatalogDatabase();
  useDatabase(db);
});
afterAll(() => {
  useDatabase(null);
  db.close();
});

describe('seed', () => {
  test('every source in the seed is on the allowlist for its data type', () => {
    for (const item of seedComponents) {
      expect(validateSource(item.sources.specsUrl, item.sources.specsDataType).valid, item.id).toBe(true);
      expect(validateSource(item.sources.priceUrl, 'price').valid, item.id).toBe(true);
    }
  });
  test('ids and slugs are unique', () => {
    expect(new Set(seedComponents.map(item => item.id)).size).toBe(seedComponents.length);
  });
});

describe('catalog database', () => {
  test('contains every seeded component with parsed specs', () => {
    expect(getAllCPUs()).toHaveLength(6);
    expect(getAllGPUs()).toHaveLength(6);
    const cpu = getCPUBySlug('ryzen-7-7800x3d');
    expect(cpu).toMatchObject({ manufacturer: 'AMD', cores: 8, threads: 16, baseClockGhz: 4.2, boostClockGhz: 5, tdpW: 120, socket: 'AM5' });
    expect(cpu?.specsUrl).toMatch(/^https:\/\/www\.amd\.com\//);
    expect(cpu?.priceUrl).toMatch(/^https:\/\/www\.pccomponentes\.com\//);
  });
  test('missing official values stay null instead of being invented', () => {
    const gpu = getGPUBySlug('radeon-rx-7600');
    expect(gpu?.baseClockGhz).toBeNull();
    expect(gpu?.boostClockGhz).toBe(2.66);
    expect(getAllCPUs().every(item => item.latestPriceEur === null)).toBe(true);
  });
  test('groups by socket and memory size', () => {
    expect(getSockets()).toEqual(['AM5', 'LGA1700']);
    expect(getCPUsBySocket('am5').map(item => item.model)).toContain('Ryzen 9 7950X');
    expect(getVramSizes()).toEqual([8, 12, 16, 24]);
    expect(getGPUsByVram(24).map(item => item.model).sort()).toEqual(['GeForce RTX 4090', 'Radeon RX 7900 XTX']);
    expect(getCPUBySlug('does-not-exist')).toBeNull();
  });
  test('populating twice is idempotent', () => {
    expect(populate(db)).toMatchObject({ cpus: 6, gpus: 6, manufacturers: 3 });
  });
  test('an unapproved source aborts the whole import', () => {
    const bad: ComponentSpec = {
      ...seedComponents[0], id: 'cpu-bad',
      sources: { ...seedComponents[0].sources, specsUrl: 'https://www.techpowerup.com/cpu-specs/x' },
    };
    const fresh = createCatalogDatabase();
    expect(() => populate(fresh, [bad])).toThrow(/allowlist/);
    expect((fresh.prepare("SELECT COUNT(*) AS n FROM components WHERE external_id = 'cpu-bad'").get() as { n: number }).n).toBe(0);
    fresh.close();
  });
});
