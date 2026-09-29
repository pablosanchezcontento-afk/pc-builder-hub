/**
 * Read-only catalog queries. Uses data/pc_components.db when it exists (built with `npm run db:build`);
 * otherwise builds the same catalog in memory from the schema and the validated seed, so the site always
 * renders real, sourced data and never a silent empty state.
 */

import 'server-only';
import Database from 'better-sqlite3';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createSlug, parseClockGhz, parseMemoryGb, parseWatts } from '../catalog';
import { createCatalogDatabase } from './populate';
import type { CPU, GPU, Manufacturer } from './types';

export const DB_PATH = resolve(process.cwd(), 'data/pc_components.db');

let connection: Database.Database | null = null;

function database(): Database.Database {
  if (!connection) {
    connection = existsSync(DB_PATH)
      ? new Database(DB_PATH, { readonly: true, fileMustExist: true })
      : createCatalogDatabase();
  }
  return connection;
}

/** For tests: use an explicit connection. */
export function useDatabase(db: Database.Database | null): void {
  connection = db;
}

interface CpuRow {
  id: number; external_id: string; model: string; manufacturer: Manufacturer;
  cores: number | null; threads: number | null; base_clock: string | null; boost_clock: string | null;
  tdp: string | null; socket: string | null; latest_price: number | null; price_date: string | null;
  specs_url: string | null; price_url: string | null;
}

interface GpuRow {
  id: number; external_id: string; model: string; manufacturer: Manufacturer;
  cuda_cores: number | null; stream_processors: number | null; base_clock: string | null; boost_clock: string | null;
  memory: string | null; memory_type: string | null; tdp: string | null; latest_price: number | null;
  price_date: string | null; specs_url: string | null; price_url: string | null;
}

function toCpu(row: CpuRow): CPU {
  return {
    type: 'CPU', id: row.id, externalId: row.external_id, slug: createSlug(row.model), model: row.model,
    manufacturer: row.manufacturer, cores: row.cores, threads: row.threads,
    baseClockGhz: parseClockGhz(row.base_clock), boostClockGhz: parseClockGhz(row.boost_clock),
    tdpW: parseWatts(row.tdp), socket: row.socket, specsUrl: row.specs_url, priceUrl: row.price_url,
    latestPriceEur: row.latest_price, priceDate: row.price_date,
  };
}

function toGpu(row: GpuRow): GPU {
  return {
    type: 'GPU', id: row.id, externalId: row.external_id, slug: createSlug(row.model), model: row.model,
    manufacturer: row.manufacturer, cudaCores: row.cuda_cores, streamProcessors: row.stream_processors,
    baseClockGhz: parseClockGhz(row.base_clock), boostClockGhz: parseClockGhz(row.boost_clock),
    memoryGb: parseMemoryGb(row.memory), memoryType: row.memory_type, tdpW: parseWatts(row.tdp),
    specsUrl: row.specs_url, priceUrl: row.price_url, latestPriceEur: row.latest_price, priceDate: row.price_date,
  };
}

export function getAllCPUs(): CPU[] {
  return (database().prepare('SELECT * FROM v_cpus_complete ORDER BY manufacturer, model').all() as CpuRow[]).map(toCpu);
}

export function getAllGPUs(): GPU[] {
  return (database().prepare('SELECT * FROM v_gpus_complete ORDER BY manufacturer, model').all() as GpuRow[]).map(toGpu);
}

export function getCPUBySlug(slug: string): CPU | null {
  return getAllCPUs().find(cpu => cpu.slug === slug) ?? null;
}

export function getGPUBySlug(slug: string): GPU | null {
  return getAllGPUs().find(gpu => gpu.slug === slug) ?? null;
}

export function getSockets(): string[] {
  return [...new Set(getAllCPUs().map(cpu => cpu.socket).filter((socket): socket is string => Boolean(socket)))].sort();
}

export function getCPUsBySocket(socket: string): CPU[] {
  return getAllCPUs().filter(cpu => cpu.socket?.toLowerCase() === socket.toLowerCase());
}

export function getVramSizes(): number[] {
  return [...new Set(getAllGPUs().map(gpu => gpu.memoryGb).filter((gb): gb is number => gb !== null))].sort((a, b) => a - b);
}

export function getGPUsByVram(gb: number): GPU[] {
  return getAllGPUs().filter(gpu => gpu.memoryGb === gb);
}
