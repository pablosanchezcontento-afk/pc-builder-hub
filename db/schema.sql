-- PHASE 5: Database Schema
-- Base de datos SQLite normalizada para PC Builder Hub
-- 
-- Diseño:
-- - Normalización completa (manufacturers, components, specs separadas)
-- - Trazabilidad de fuentes
-- - Histórico de precios
-- - Separación estricta entre specs y precios

-- ============================================================
-- 1. MANUFACTURERS (fabricantes)
-- ============================================================
CREATE TABLE IF NOT EXISTS manufacturers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,          -- "Intel", "AMD", "NVIDIA"
  website TEXT,                        -- URL oficial
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. COMPONENTS (componentes base)
-- ============================================================
CREATE TABLE IF NOT EXISTS components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT NOT NULL UNIQUE,    -- "cpu-intel-i5-14600k" (desde seed.ts)
  manufacturer_id INTEGER NOT NULL,
  model TEXT NOT NULL,                 -- "Core i5-14600K"
  type TEXT NOT NULL CHECK(type IN ('CPU', 'GPU')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
);

CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_external_id ON components(external_id);

-- ============================================================
-- 3. CPU_SPECS (especificaciones de CPUs)
-- ============================================================
CREATE TABLE IF NOT EXISTS cpu_specs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER NOT NULL UNIQUE,
  cores INTEGER,
  threads INTEGER,
  base_clock TEXT,                     -- "3.5 GHz"
  boost_clock TEXT,                    -- "5.3 GHz"
  tdp TEXT,                            -- "125W"
  socket TEXT,                         -- "LGA1700"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. GPU_SPECS (especificaciones de GPUs)
-- ============================================================
CREATE TABLE IF NOT EXISTS gpu_specs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER NOT NULL UNIQUE,
  cuda_cores INTEGER,                  -- Para NVIDIA
  stream_processors INTEGER,           -- Para AMD
  base_clock TEXT,
  boost_clock TEXT,
  memory TEXT,                         -- "8 GB"
  memory_type TEXT,                    -- "GDDR6"
  tdp TEXT,                            -- "115W"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. SOURCES (fuentes de datos)
-- ============================================================
CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,                -- "ark.intel.com", "amd.com", etc.
  data_type TEXT NOT NULL CHECK(data_type IN ('cpu_specs', 'gpu_specs', 'price')),
  is_allowed BOOLEAN DEFAULT 1,       -- Validación contra allowlist
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sources_domain ON sources(domain);
CREATE INDEX idx_sources_data_type ON sources(data_type);

-- ============================================================
-- 6. COMPONENT_SOURCES (relación componente-fuente)
-- ============================================================
CREATE TABLE IF NOT EXISTS component_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER NOT NULL,
  source_id INTEGER NOT NULL,
  source_type TEXT NOT NULL CHECK(source_type IN ('specs', 'price')),
  verified_at DATETIME NOT NULL,      -- Última verificación
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES sources(id),
  UNIQUE(component_id, source_id, source_type)
);

CREATE INDEX idx_component_sources_component ON component_sources(component_id);
CREATE INDEX idx_component_sources_source ON component_sources(source_id);

-- ============================================================
-- 7. PRICES (histórico de precios)
-- ============================================================
CREATE TABLE IF NOT EXISTS prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER NOT NULL,
  source_id INTEGER NOT NULL,         -- URL de PcComponentes
  price_eur REAL NOT NULL,             -- Precio en euros
  currency TEXT DEFAULT 'EUR',
  availability TEXT,                   -- "in_stock", "out_of_stock", etc.
  recorded_at DATETIME NOT NULL,      -- Fecha del scraping
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_prices_component ON prices(component_id);
CREATE INDEX idx_prices_recorded_at ON prices(recorded_at DESC);

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista completa de CPUs con specs y última precio
CREATE VIEW IF NOT EXISTS v_cpus_complete AS
SELECT 
  c.id,
  c.external_id,
  c.model,
  m.name AS manufacturer,
  cs.cores,
  cs.threads,
  cs.base_clock,
  cs.boost_clock,
  cs.tdp,
  cs.socket,
  p.price_eur AS latest_price,
  p.recorded_at AS price_date,
  s_specs.url AS specs_url,
  s_price.url AS price_url,
  c.created_at,
  c.updated_at
FROM components c
JOIN manufacturers m ON c.manufacturer_id = m.id
LEFT JOIN cpu_specs cs ON c.id = cs.component_id
LEFT JOIN (
  SELECT component_id, MAX(recorded_at) AS max_date
  FROM prices
  GROUP BY component_id
) latest ON c.id = latest.component_id
LEFT JOIN prices p ON c.id = p.component_id AND p.recorded_at = latest.max_date
LEFT JOIN component_sources csrc_specs ON c.id = csrc_specs.component_id AND csrc_specs.source_type = 'specs'
LEFT JOIN sources s_specs ON csrc_specs.source_id = s_specs.id
LEFT JOIN component_sources csrc_price ON c.id = csrc_price.component_id AND csrc_price.source_type = 'price'
LEFT JOIN sources s_price ON csrc_price.source_id = s_price.id
WHERE c.type = 'CPU';

-- Vista completa de GPUs con specs y última precio
CREATE VIEW IF NOT EXISTS v_gpus_complete AS
SELECT 
  c.id,
  c.external_id,
  c.model,
  m.name AS manufacturer,
  gs.cuda_cores,
  gs.stream_processors,
  gs.base_clock,
  gs.boost_clock,
  gs.memory,
  gs.memory_type,
  gs.tdp,
  p.price_eur AS latest_price,
  p.recorded_at AS price_date,
  s_specs.url AS specs_url,
  s_price.url AS price_url,
  c.created_at,
  c.updated_at
FROM components c
JOIN manufacturers m ON c.manufacturer_id = m.id
LEFT JOIN gpu_specs gs ON c.id = gs.component_id
LEFT JOIN (
  SELECT component_id, MAX(recorded_at) AS max_date
  FROM prices
  GROUP BY component_id
) latest ON c.id = latest.component_id
LEFT JOIN prices p ON c.id = p.component_id AND p.recorded_at = latest.max_date
LEFT JOIN component_sources csrc_specs ON c.id = csrc_specs.component_id AND csrc_specs.source_type = 'specs'
LEFT JOIN sources s_specs ON csrc_specs.source_id = s_specs.id
LEFT JOIN component_sources csrc_price ON c.id = csrc_price.component_id AND csrc_price.source_type = 'price'
LEFT JOIN sources s_price ON csrc_price.source_id = s_price.id
WHERE c.type = 'GPU';

-- ============================================================
-- TRIGGERS PARA AUDITORÍA
-- ============================================================

-- Actualizar updated_at en components
CREATE TRIGGER IF NOT EXISTS update_components_timestamp 
AFTER UPDATE ON components
BEGIN
  UPDATE components SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Actualizar updated_at en cpu_specs
CREATE TRIGGER IF NOT EXISTS update_cpu_specs_timestamp 
AFTER UPDATE ON cpu_specs
BEGIN
  UPDATE cpu_specs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Actualizar updated_at en gpu_specs
CREATE TRIGGER IF NOT EXISTS update_gpu_specs_timestamp 
AFTER UPDATE ON gpu_specs
BEGIN
  UPDATE gpu_specs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
