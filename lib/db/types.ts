/**
 * Tipos TypeScript para las vistas de base de datos SQLite
 * Alineados con v_cpus_complete y v_gpus_complete del schema.sql
 */

// Vista completa de CPU con todas las relaciones
export interface CPUView {
  // Datos del componente
  id: number;
  external_id: string;
  model: string;
  manufacturer_id: number;
  manufacturer_name: string;
  manufacturer_website: string;
  
  // Especificaciones CPU
  cores: number;
  threads: number;
  base_clock_ghz: number;
  boost_clock_ghz: number;
  tdp_watts: number;
  socket: string;
  
  // Precio actual
  current_price_eur: number | null;
  price_recorded_at: string | null;
  
  // Fuente de especificaciones
  spec_source_url: string | null;
  spec_source_domain: string | null;
  
  // Fuente de precio
  price_source_url: string | null;
  price_source_domain: string | null;
  
  // Metadatos
  created_at: string;
  updated_at: string;
}

// Vista completa de GPU con todas las relaciones
export interface GPUView {
  // Datos del componente
  id: number;
  external_id: string;
  model: string;
  manufacturer_id: number;
  manufacturer_name: string;
  manufacturer_website: string;
  
  // Especificaciones GPU
  memory_gb: number;
  memory_type: string;
  core_clock_mhz: number;
  boost_clock_mhz: number;
  tdp_watts: number;
  interface: string;
  
  // Precio actual
  current_price_eur: number | null;
  price_recorded_at: string | null;
  
  // Fuente de especificaciones
  spec_source_url: string | null;
  spec_source_domain: string | null;
  
  // Fuente de precio
  price_source_url: string | null;
  price_source_domain: string | null;
  
  // Metadatos
  created_at: string;
  updated_at: string;
}

// Tipo para crear slugs a partir de modelos
export type ComponentSlug = string;
