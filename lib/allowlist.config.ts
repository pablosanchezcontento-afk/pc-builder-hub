// lib/allowlist.config.ts

/**
 * Official Source Allowlist
 * 
 * CRITICAL RULE: Only domains listed here are allowed as data sources.
 * 
 * Forbidden sources:
 * - PCPartPicker
 * - TechPowerUp
 * - CPU-World
 * - WikiChip
 * - Any community benchmark database
 * - Any scraped dataset
 */

export type SourceType = 
  | "price_availability"
  | "cpu_specs"
  | "gpu_specs_amd"
  | "gpu_specs_nvidia"
  | "ram_specs"
  | "motherboard_specs"
  | "psu_specs"
  | "storage_specs"
  | "case_specs";

export interface AllowedDomain {
  domain: string;
  types: SourceType[];
  description: string;
  notes?: string;
}

export const ALLOWED_SOURCES: AllowedDomain[] = [
  // Price & Availability
  {
    domain: "pccomponentes.com",
    types: ["price_availability"],
    description: "PcComponentes - Official Spanish retailer for prices and availability",
    notes: "Primary source for pricing data"
  },

  // CPU Specifications
  {
    domain: "intel.com",
    types: ["cpu_specs"],
    description: "Intel - Official CPU specifications",
    notes: "ark.intel.com for detailed specs"
  },
  {
    domain: "amd.com",
    types: ["cpu_specs"],
    description: "AMD - Official CPU specifications",
  },

  // GPU Specifications
  {
    domain: "amd.com",
    types: ["gpu_specs_amd"],
    description: "AMD - Official GPU specifications",
  },
  {
    domain: "nvidia.com",
    types: ["gpu_specs_nvidia"],
    description: "NVIDIA - Official GPU specifications",
  },

  // Add more official manufacturers as explicitly approved
  // Examples (ONLY add after explicit approval):
  // {
  //   domain: "corsair.com",
  //   types: ["ram_specs", "psu_specs"],
  //   description: "Corsair - Official RAM and PSU specs",
  // },
];

/**
 * Extract domain from URL
 * Supports subdomains (ark.intel.com → intel.com)
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Extract root domain (handle subdomains)
    // e.g., "ark.intel.com" → "intel.com"
    const parts = hostname.split(".");
    if (parts.length >= 2) {
      return parts.slice(-2).join(".");
    }
    return hostname;
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }
}

/**
 * Check if domain is in allowlist
 */
export function isDomainAllowed(domain: string): boolean {
  return ALLOWED_SOURCES.some(
    (allowed) => allowed.domain === domain
  );
}

/**
 * Get allowed source types for a domain
 */
export function getAllowedTypes(domain: string): SourceType[] {
  const source = ALLOWED_SOURCES.find(
    (allowed) => allowed.domain === domain
  );
  return source?.types || [];
}
