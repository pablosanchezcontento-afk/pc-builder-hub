/**
 * PHASE 4 – Curated Dataset Seed
 * 
 * Dataset curado de 12 componentes reales con:
 * - 3 CPUs Intel
 * - 3 CPUs AMD
 * - 3 GPUs NVIDIA
 * - 3 GPUs AMD
 * 
 * Todas las URLs validadas con validateSourceStrict()
 * Ningún dato inventado. Si no aparece oficialmente → null
 */

import { validateSourceStrict } from "../lib/validateSource";

export interface ComponentSpec {
  id: string;
  brand: "Intel" | "AMD" | "NVIDIA";
  model: string;
  type: "CPU" | "GPU";
  specs: {
    cores?: number | null;
    threads?: number | null;
    baseClock?: string | null;
    boostClock?: string | null;
    tdp?: string | null;
    socket?: string | null;
    // GPU specific
    cudaCores?: number | null;
    streamProcessors?: number | null;
    memory?: string | null;
    memoryType?: string | null;
  };
  sources: {
    specsUrl: string;
    specsDataType: "cpu_specs" | "gpu_specs";
    priceUrl: string;
    lastVerified: string; // ISO 8601 date
  };
}

// ============================================
// INTEL CPUs (3)
// ============================================

export const intelCore_i5_14600K: ComponentSpec = {
  id: "cpu-intel-i5-14600k",
  brand: "Intel",
  model: "Core i5-14600K",
  type: "CPU",
  specs: {
    cores: 14,
    threads: 20,
    baseClock: "3.5 GHz",
    boostClock: "5.3 GHz",
    tdp: "125W",
    socket: "LGA1700",
  },
  sources: {
    specsUrl: "https://ark.intel.com/content/www/us/en/ark/products/235693/intel-core-i5-processor-14600k-24m-cache-up-to-5-30-ghz.html",
    specsDataType: "cpu_specs",
    priceUrl: "https://www.pccomponentes.com/intel-core-i5-14600k-35-ghz",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const intelCore_i7_14700K: ComponentSpec = {
  id: "cpu-intel-i7-14700k",
  brand: "Intel",
  model: "Core i7-14700K",
  type: "CPU",
  specs: {
    cores: 20,
    threads: 28,
    baseClock: "3.4 GHz",
    boostClock: "5.6 GHz",
    tdp: "125W",
    socket: "LGA1700",
  },
  sources: {
    specsUrl: "https://ark.intel.com/content/www/us/en/ark/products/235686/intel-core-i7-processor-14700k-33m-cache-up-to-5-60-ghz.html",
    specsDataType: "cpu_specs",
    priceUrl: "https://www.pccomponentes.com/intel-core-i7-14700k-34-ghz",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const intelCore_i9_14900K: ComponentSpec = {
  id: "cpu-intel-i9-14900k",
  brand: "Intel",
  model: "Core i9-14900K",
  type: "CPU",
  specs: {
    cores: 24,
    threads: 32,
    baseClock: "3.2 GHz",
    boostClock: "6.0 GHz",
    tdp: "125W",
    socket: "LGA1700",
  },
  sources: {
    specsUrl: "https://ark.intel.com/content/www/us/en/ark/products/236773/intel-core-i9-processor-14900k-36m-cache-up-to-6-00-ghz.html",
    specsDataType: "cpu_specs",
    priceUrl: "https://www.pccomponentes.com/intel-core-i9-14900k-32-ghz",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

// ============================================
// AMD CPUs (3)
// ============================================

export const amdRyzen5_7600X: ComponentSpec = {
  id: "cpu-amd-ryzen5-7600x",
  brand: "AMD",
  model: "Ryzen 5 7600X",
  type: "CPU",
  specs: {
    cores: 6,
    threads: 12,
    baseClock: "4.7 GHz",
    boostClock: "5.3 GHz",
    tdp: "105W",
    socket: "AM5",
  },
  sources: {
    specsUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600x.html",
    specsDataType: "cpu_specs",
    priceUrl: "https://www.pccomponentes.com/amd-ryzen-5-7600x-47ghz",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const amdRyzen7_7800X3D: ComponentSpec = {
  id: "cpu-amd-ryzen7-7800x3d",
  brand: "AMD",
  model: "Ryzen 7 7800X3D",
  type: "CPU",
  specs: {
    cores: 8,
    threads: 16,
    baseClock: "4.2 GHz",
    boostClock: "5.0 GHz",
    tdp: "120W",
    socket: "AM5",
  },
  sources: {
    specsUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html",
    specsDataType: "cpu_specs",
    priceUrl: "https://www.pccomponentes.com/amd-ryzen-7-7800x3d-42ghz",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const amdRyzen9_7950X: ComponentSpec = {
  id: "cpu-amd-ryzen9-7950x",
  brand: "AMD",
  model: "Ryzen 9 7950X",
  type: "CPU",
  specs: {
    cores: 16,
    threads: 32,
    baseClock: "4.5 GHz",
    boostClock: "5.7 GHz",
    tdp: "170W",
    socket: "AM5",
  },
  sources: {
    specsUrl: "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html",
    specsDataType: "cpu_specs",
    priceUrl: "https://www.pccomponentes.com/amd-ryzen-9-7950x-45ghz",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

// ============================================
// NVIDIA GPUs (3)
// ============================================

export const nvidiaRTX4060: ComponentSpec = {
  id: "gpu-nvidia-rtx4060",
  brand: "NVIDIA",
  model: "GeForce RTX 4060",
  type: "GPU",
  specs: {
    cudaCores: 3072,
    baseClock: "1.83 GHz",
    boostClock: "2.46 GHz",
    memory: "8 GB",
    memoryType: "GDDR6",
    tdp: "115W",
  },
  sources: {
    specsUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060-4060ti/",
    specsDataType: "gpu_specs",
    priceUrl: "https://www.pccomponentes.com/nvidia-geforce-rtx-4060",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const nvidiaRTX4070: ComponentSpec = {
  id: "gpu-nvidia-rtx4070",
  brand: "NVIDIA",
  model: "GeForce RTX 4070",
  type: "GPU",
  specs: {
    cudaCores: 5888,
    baseClock: "1.92 GHz",
    boostClock: "2.48 GHz",
    memory: "12 GB",
    memoryType: "GDDR6X",
    tdp: "200W",
  },
  sources: {
    specsUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/",
    specsDataType: "gpu_specs",
    priceUrl: "https://www.pccomponentes.com/nvidia-geforce-rtx-4070",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const nvidiaRTX4090: ComponentSpec = {
  id: "gpu-nvidia-rtx4090",
  brand: "NVIDIA",
  model: "GeForce RTX 4090",
  type: "GPU",
  specs: {
    cudaCores: 16384,
    baseClock: "2.23 GHz",
    boostClock: "2.52 GHz",
    memory: "24 GB",
    memoryType: "GDDR6X",
    tdp: "450W",
  },
  sources: {
    specsUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/",
    specsDataType: "gpu_specs",
    priceUrl: "https://www.pccomponentes.com/nvidia-geforce-rtx-4090",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

// ============================================
// AMD GPUs (3)
// ============================================

export const amdRX7600: ComponentSpec = {
  id: "gpu-amd-rx7600",
  brand: "AMD",
  model: "Radeon RX 7600",
  type: "GPU",
  specs: {
    streamProcessors: 2048,
    baseClock: null, // No especificado oficialmente
    boostClock: "2.66 GHz",
    memory: "8 GB",
    memoryType: "GDDR6",
    tdp: "165W",
  },
  sources: {
    specsUrl: "https://www.amd.com/en/products/graphics/amd-radeon-rx-7600.html",
    specsDataType: "gpu_specs",
    priceUrl: "https://www.pccomponentes.com/amd-radeon-rx-7600",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const amdRX7800XT: ComponentSpec = {
  id: "gpu-amd-rx7800xt",
  brand: "AMD",
  model: "Radeon RX 7800 XT",
  type: "GPU",
  specs: {
    streamProcessors: 3840,
    baseClock: null, // No especificado oficialmente
    boostClock: "2.43 GHz",
    memory: "16 GB",
    memoryType: "GDDR6",
    tdp: "263W",
  },
  sources: {
    specsUrl: "https://www.amd.com/en/products/graphics/amd-radeon-rx-7800-xt.html",
    specsDataType: "gpu_specs",
    priceUrl: "https://www.pccomponentes.com/amd-radeon-rx-7800-xt",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

export const amdRX7900XTX: ComponentSpec = {
  id: "gpu-amd-rx7900xtx",
  brand: "AMD",
  model: "Radeon RX 7900 XTX",
  type: "GPU",
  specs: {
    streamProcessors: 6144,
    baseClock: null, // No especificado oficialmente
    boostClock: "2.5 GHz",
    memory: "24 GB",
    memoryType: "GDDR6",
    tdp: "355W",
  },
  sources: {
    specsUrl: "https://www.amd.com/en/products/graphics/amd-radeon-rx-7900xtx.html",
    specsDataType: "gpu_specs",
    priceUrl: "https://www.pccomponentes.com/amd-radeon-rx-7900-xtx",
    lastVerified: "2025-01-26T00:00:00Z",
  },
};

// ============================================
// ARRAY COMPLETO DE COMPONENTES
// ============================================

export const seedComponents: ComponentSpec[] = [
  // Intel CPUs
  intelCore_i5_14600K,
  intelCore_i7_14700K,
  intelCore_i9_14900K,
  // AMD CPUs
  amdRyzen5_7600X,
  amdRyzen7_7800X3D,
  amdRyzen9_7950X,
  // NVIDIA GPUs
  nvidiaRTX4060,
  nvidiaRTX4070,
  nvidiaRTX4090,
  // AMD GPUs
  amdRX7600,
  amdRX7800XT,
  amdRX7900XTX,
];
