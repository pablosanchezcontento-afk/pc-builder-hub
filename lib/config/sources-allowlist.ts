/**
 * Official Sources Allowlist
 * 
 * CRITICAL: This file defines the ONLY approved sources for component data.
 * Any data source NOT listed here is FORBIDDEN.
 * 
 * Requirements:
 * - Official manufacturer pages (Intel, AMD, NVIDIA, etc.)
 * - PcComponentes.com (Spain-based retailer)
 * - NO third-party aggregators (PCPartPicker, TechPowerUp, etc.)
 * - NO scraped data from unauthorized sources
 */

export interface AllowedSource {
  domain: string;
  name: string;
  type: 'official_manufacturer' | 'authorized_retailer';
  allowedFor: string[]; // Component categories
  notes?: string;
}

// Manufacturer official sources
export const OFFICIAL_MANUFACTURERS: AllowedSource[] = [
  {
    domain: 'intel.com',
    name: 'Intel Official',
    type: 'official_manufacturer',
    allowedFor: ['cpu'],
    notes: 'ARK database for official CPU specs',
  },
  {
    domain: 'amd.com',
    name: 'AMD Official',
    type: 'official_manufacturer',
    allowedFor: ['cpu', 'gpu'],
    notes: 'Official specs for Ryzen CPUs and Radeon GPUs',
  },
  {
    domain: 'nvidia.com',
    name: 'NVIDIA Official',
    type: 'official_manufacturer',
    allowedFor: ['gpu'],
    notes: 'Official GeForce specs',
  },
  {
    domain: 'asus.com',
    name: 'ASUS Official',
    type: 'official_manufacturer',
    allowedFor: ['motherboard', 'gpu', 'cooling'],
  },
  {
    domain: 'msi.com',
    name: 'MSI Official',
    type: 'official_manufacturer',
    allowedFor: ['motherboard', 'gpu', 'cooling'],
  },
  {
    domain: 'gigabyte.com',
    name: 'Gigabyte Official',
    type: 'official_manufacturer',
    allowedFor: ['motherboard', 'gpu'],
  },
  {
    domain: 'asrock.com',
    name: 'ASRock Official',
    type: 'official_manufacturer',
    allowedFor: ['motherboard'],
  },
  {
    domain: 'corsair.com',
    name: 'Corsair Official',
    type: 'official_manufacturer',
    allowedFor: ['ram', 'psu', 'case', 'cooling', 'storage'],
  },
  {
    domain: 'gskill.com',
    name: 'G.Skill Official',
    type: 'official_manufacturer',
    allowedFor: ['ram'],
  },
  {
    domain: 'crucial.com',
    name: 'Crucial Official',
    type: 'official_manufacturer',
    allowedFor: ['ram', 'storage'],
  },
  {
    domain: 'samsung.com',
    name: 'Samsung Official',
    type: 'official_manufacturer',
    allowedFor: ['storage', 'ram'],
  },
  {
    domain: 'westerndigital.com',
    name: 'Western Digital Official',
    type: 'official_manufacturer',
    allowedFor: ['storage'],
  },
  {
    domain: 'seagate.com',
    name: 'Seagate Official',
    type: 'official_manufacturer',
    allowedFor: ['storage'],
  },
  {
    domain: 'evga.com',
    name: 'EVGA Official',
    type: 'official_manufacturer',
    allowedFor: ['gpu', 'psu'],
  },
  {
    domain: 'noctua.at',
    name: 'Noctua Official',
    type: 'official_manufacturer',
    allowedFor: ['cooling'],
  },
  {
    domain: 'bequiet.com',
    name: 'be quiet! Official',
    type: 'official_manufacturer',
    allowedFor: ['psu', 'cooling', 'case'],
  },
  {
    domain: 'seasonic.com',
    name: 'Seasonic Official',
    type: 'official_manufacturer',
    allowedFor: ['psu'],
  },
  {
    domain: 'fractal-design.com',
    name: 'Fractal Design Official',
    type: 'official_manufacturer',
    allowedFor: ['case', 'cooling', 'psu'],
  },
  {
    domain: 'nzxt.com',
    name: 'NZXT Official',
    type: 'official_manufacturer',
    allowedFor: ['case', 'cooling'],
  },
];

// Authorized retailers (for pricing and availability)
export const AUTHORIZED_RETAILERS: AllowedSource[] = [
  {
    domain: 'pccomponentes.com',
    name: 'PcComponentes',
    type: 'authorized_retailer',
    allowedFor: ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooling'],
    notes: 'PRIMARY retailer for pricing and availability in Spain',
  },
];

// Combined allowlist
export const ALLOWED_SOURCES = [
  ...OFFICIAL_MANUFACTURERS,
  ...AUTHORIZED_RETAILERS,
];

// FORBIDDEN sources (explicitly blocked)
export const FORBIDDEN_SOURCES = [
  'pcpartpicker.com',
  'techpowerup.com',
  'cpu-world.com',
  'wikichip.org',
  'userbenchmark.com',
  'passmark.com',
];

/**
 * Validate if a URL is from an allowed source
 */
export function isAllowedSource(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    // Check if domain is in allowlist
    const isAllowed = ALLOWED_SOURCES.some(
      source => hostname.includes(source.domain)
    );
    
    // Check if domain is explicitly forbidden
    const isForbidden = FORBIDDEN_SOURCES.some(
      forbiddenDomain => hostname.includes(forbiddenDomain)
    );
    
    return isAllowed && !isForbidden;
  } catch (error) {
    // Invalid URL
    return false;
  }
}

/**
 * Get allowed sources for a specific component category
 */
export function getAllowedSourcesForCategory(category: string): AllowedSource[] {
  return ALLOWED_SOURCES.filter(
    source => source.allowedFor.includes(category)
  );
}
