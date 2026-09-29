import { describe, expect, test } from 'vitest';
import {
  compareSpec, createSlug, formatGhz, parseClockGhz, parseMemoryGb, parseWatts, summarizeBuild,
} from '@/lib/catalog';
import type { CPU, GPU } from '@/lib/db/types';

const cpu = (overrides: Partial<CPU> = {}): CPU => ({
  type: 'CPU', id: 1, externalId: 'cpu', slug: 'cpu', model: 'CPU', manufacturer: 'AMD', specsUrl: null, priceUrl: null,
  latestPriceEur: null, priceDate: null, cores: 8, threads: 16, baseClockGhz: 4.2, boostClockGhz: 5, tdpW: 120,
  socket: 'AM5', ...overrides,
});
const gpu = (overrides: Partial<GPU> = {}): GPU => ({
  type: 'GPU', id: 2, externalId: 'gpu', slug: 'gpu', model: 'GPU', manufacturer: 'NVIDIA', specsUrl: null, priceUrl: null,
  latestPriceEur: null, priceDate: null, cudaCores: null, streamProcessors: null, baseClockGhz: 2.23, boostClockGhz: 2.52,
  memoryGb: 24, memoryType: 'GDDR6X', tdpW: 450, ...overrides,
});

describe('parsers never guess', () => {
  test('clock values', () => {
    expect(parseClockGhz('3.5 GHz')).toBe(3.5);
    expect(parseClockGhz('1830 MHz')).toBe(1.83);
    expect(parseClockGhz('fast')).toBeNull();
    expect(parseClockGhz(null)).toBeNull();
  });
  test('power and memory', () => {
    expect(parseWatts('125W')).toBe(125);
    expect(parseWatts('263 W')).toBe(263);
    expect(parseWatts('lots')).toBeNull();
    expect(parseMemoryGb('24 GB')).toBe(24);
    expect(parseMemoryGb(undefined)).toBeNull();
  });
  test('formatting and slugs', () => {
    expect(formatGhz(3.5, '-')).toBe('3.5 GHz');
    expect(formatGhz(5, '-')).toBe('5 GHz');
    expect(formatGhz(10, '-')).toBe('10 GHz');
    expect(formatGhz(null, '-')).toBe('-');
    expect(createSlug('Radeon RX 7900 XTX')).toBe('radeon-rx-7900-xtx');
    expect(createSlug('  Core i5-14600K ')).toBe('core-i5-14600k');
  });
});

describe('compareSpec', () => {
  test('higher is better by default, lower when asked, unknown stays unknown', () => {
    expect(compareSpec(16, 8)).toBe('a');
    expect(compareSpec(8, 16)).toBe('b');
    expect(compareSpec(8, 8)).toBe('tie');
    expect(compareSpec(120, 170, true)).toBe('a');
    expect(compareSpec(null, 8)).toBeNull();
  });
});

describe('summarizeBuild', () => {
  test('estimates draw and rounds the PSU up to 50 W', () => {
    const summary = summarizeBuild(cpu(), gpu());
    expect(summary.estimatedDrawW).toBe(120 + 450 + 100);
    expect(summary.recommendedPsuW).toBe(900); // 670 * 1.3 = 871 → 900
    expect(summary.missing).toEqual([]);
    expect(summary.totalPriceEur).toBeNull();
  });
  test('sums prices only when both are recorded', () => {
    expect(summarizeBuild(cpu({ latestPriceEur: 199.99 }), gpu({ latestPriceEur: 1799.5 })).totalPriceEur).toBe(1999.49);
    expect(summarizeBuild(cpu({ latestPriceEur: 199.99 }), gpu()).totalPriceEur).toBeNull();
  });
  test('refuses to estimate with missing parts or power figures', () => {
    expect(summarizeBuild(null, gpu())).toMatchObject({ recommendedPsuW: null, missing: ['cpu'] });
    expect(summarizeBuild(cpu(), gpu({ tdpW: null }))).toMatchObject({ recommendedPsuW: null, missing: ['gpuTdp'] });
    expect(summarizeBuild(null, null).missing).toEqual(['cpu', 'gpu']);
  });
});
