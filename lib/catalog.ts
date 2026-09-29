/** Pure helpers shared by the data layer, the pages and the tests. */

import type { CPU, GPU } from './db/types';

export function createSlug(model: string): string {
  return model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "3.5 GHz" → 3.5, "1830 MHz" → 1.83; anything unparsable → null (never guessed). */
export function parseClockGhz(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^\s*([\d.]+)\s*(ghz|mhz)\s*$/i.exec(value);
  if (!match) return null;
  const number = Number(match[1]);
  if (!Number.isFinite(number)) return null;
  return match[2].toLowerCase() === 'mhz' ? Math.round(number) / 1000 : number;
}

/** "125W" / "125 W" → 125. */
export function parseWatts(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^\s*(\d+(?:\.\d+)?)\s*w\s*$/i.exec(value);
  return match ? Number(match[1]) : null;
}

/** "8 GB" → 8. */
export function parseMemoryGb(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^\s*(\d+(?:\.\d+)?)\s*gb\s*$/i.exec(value);
  return match ? Number(match[1]) : null;
}

export type Winner = 'a' | 'b' | 'tie' | null;

/** Which side wins a numeric spec; `lowerIsBetter` for power draw. Null when either side is unknown. */
export function compareSpec(a: number | null, b: number | null, lowerIsBetter = false): Winner {
  if (a === null || b === null) return null;
  if (a === b) return 'tie';
  const aWins = lowerIsBetter ? a < b : a > b;
  return aWins ? 'a' : 'b';
}

/** Rest-of-system allowance (motherboard, RAM, storage, fans) used for the PSU estimate. */
export const REST_OF_SYSTEM_W = 100;
/** Headroom factor applied to the estimated peak draw. */
export const PSU_HEADROOM = 1.3;

export interface BuildSummary {
  cpu: CPU | null;
  gpu: GPU | null;
  estimatedDrawW: number | null;
  recommendedPsuW: number | null;
  totalPriceEur: number | null;
  missing: ('cpu' | 'gpu' | 'cpuTdp' | 'gpuTdp')[];
}

/**
 * Estimate power draw and a recommended PSU size for a CPU + GPU pair.
 * It is an estimate from official TDP/TBP figures, rounded up to the next 50 W; it never invents a value
 * when a figure is missing.
 */
export function summarizeBuild(cpu: CPU | null, gpu: GPU | null): BuildSummary {
  const missing: BuildSummary['missing'] = [];
  if (!cpu) missing.push('cpu');
  if (!gpu) missing.push('gpu');
  if (cpu && cpu.tdpW === null) missing.push('cpuTdp');
  if (gpu && gpu.tdpW === null) missing.push('gpuTdp');
  const complete = missing.length === 0 && cpu && gpu;
  const estimatedDrawW = complete ? (cpu.tdpW ?? 0) + (gpu.tdpW ?? 0) + REST_OF_SYSTEM_W : null;
  const recommendedPsuW = estimatedDrawW === null ? null : Math.ceil((estimatedDrawW * PSU_HEADROOM) / 50) * 50;
  const prices = [cpu?.latestPriceEur, gpu?.latestPriceEur];
  const totalPriceEur = complete && prices.every((price): price is number => typeof price === 'number')
    ? Math.round(prices.reduce((sum, price) => sum + price, 0) * 100) / 100
    : null;
  return { cpu, gpu, estimatedDrawW, recommendedPsuW, totalPriceEur, missing };
}

export function formatGhz(value: number | null, fallback: string): string {
  return value === null ? fallback : `${value.toFixed(2).replace(/\.?0+$/, '')} GHz`;
}
