// Source traceability types
export interface DataSource {
  type: 'official_manufacturer' | 'pccomponentes' | 'retailer';
  url: string;
  verifiedDate: string; // ISO 8601 format
  notes?: string;
}

// Base component interface with source tracking
export interface ComponentBase {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  category: ComponentCategory;
  imageUrl?: string;
  
  // Price tracking
  prices: PriceData[];
  
  // Source traceability (CRITICAL)
  sources: {
    officialSpecs: DataSource; // REQUIRED: manufacturer official page
    retailers: DataSource[];    // PcComponentes + others
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  verificationStatus: 'verified' | 'pending' | 'needs_update';
}

// Price data with source
export interface PriceData {
  amount: number;
  currency: 'EUR' | 'USD';
  retailer: string;
  url: string;
  fetchedAt: string;
  inStock: boolean;
}

// Component categories
export type ComponentCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooling';

// CPU specific specs
export interface CPUComponent extends ComponentBase {
  category: 'cpu';
  specs: {
    socket: string | null;
    cores: number | null;
    threads: number | null;
    baseClock: number | null; // GHz
    boostClock: number | null; // GHz
    tdp: number | null; // Watts
    integratedGraphics: string | null;
    cachel3: number | null; // MB
    
    // Source for each spec field
    _sources: {
      socket?: DataSource;
      cores?: DataSource;
      threads?: DataSource;
      baseClock?: DataSource;
      boostClock?: DataSource;
      tdp?: DataSource;
      integratedGraphics?: DataSource;
      cachel3?: DataSource;
    };
  };
}

// GPU specific specs
export interface GPUComponent extends ComponentBase {
  category: 'gpu';
  specs: {
    chipset: string | null;
    memory: number | null; // GB
    memoryType: string | null; // GDDR6, GDDR6X, etc.
    coreClock: number | null; // MHz
    boostClock: number | null; // MHz
    tdp: number | null; // Watts
    pcie: string | null; // PCIe 4.0, 5.0, etc.
    outputs: string[] | null; // HDMI, DisplayPort, etc.
    
    // Source for each spec field
    _sources: {
      chipset?: DataSource;
      memory?: DataSource;
      memoryType?: DataSource;
      coreClock?: DataSource;
      boostClock?: DataSource;
      tdp?: DataSource;
      pcie?: DataSource;
      outputs?: DataSource;
    };
  };
}

// Union type for all components
export type PCComponent = CPUComponent | GPUComponent; // Extend with more types

// Validation helper type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Data integrity check
export function validateComponent(component: PCComponent): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required sources
  if (!component.sources.officialSpecs) {
    errors.push('Missing official manufacturer source');
  }
  
  if (component.sources.retailers.length === 0) {
    warnings.push('No retailer sources found');
  }

  // Check verified date is recent (within 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const verifiedDate = new Date(component.sources.officialSpecs.verifiedDate);
  if (verifiedDate < sixMonthsAgo) {
    warnings.push('Official specs verification is older than 6 months');
  }

  // Check for null specs without explanation
  const specs = component.specs as any;
  const nullFields = Object.keys(specs).filter(
    key => !key.startsWith('_') && specs[key] === null
  );
  
  if (nullFields.length > 0 && !component.sources.officialSpecs.notes) {
    warnings.push(
      `Found null spec fields (${nullFields.join(', ')}) without notes explaining why`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
