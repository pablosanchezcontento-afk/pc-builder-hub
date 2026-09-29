/** Rows exposed by the read-only data layer, derived from the v_cpus_complete / v_gpus_complete views. */

export type Manufacturer = 'Intel' | 'AMD' | 'NVIDIA';

interface ComponentBase {
  id: number;
  externalId: string;
  slug: string;
  model: string;
  manufacturer: Manufacturer;
  /** Official specification page (validated against the allowlist). */
  specsUrl: string | null;
  /** Retailer page for prices; prices themselves are only shown when recorded. */
  priceUrl: string | null;
  latestPriceEur: number | null;
  priceDate: string | null;
}

export interface CPU extends ComponentBase {
  type: 'CPU';
  cores: number | null;
  threads: number | null;
  baseClockGhz: number | null;
  boostClockGhz: number | null;
  tdpW: number | null;
  socket: string | null;
}

export interface GPU extends ComponentBase {
  type: 'GPU';
  cudaCores: number | null;
  streamProcessors: number | null;
  baseClockGhz: number | null;
  boostClockGhz: number | null;
  memoryGb: number | null;
  memoryType: string | null;
  tdpW: number | null;
}

export type Component = CPU | GPU;
