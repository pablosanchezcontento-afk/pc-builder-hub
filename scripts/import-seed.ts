/**
 * PHASE 5: Database Import Script
 * Imports real component data from data/seed.ts into SQLite database
 * Validates URLs, creates all relationships, and generates Spanish report
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { seedComponents } from '../data/seed';
import { validateSourceStrict } from '../lib/validateSource';

const DB_PATH = resolve(process.cwd(), 'database.sqlite');
const SCHEMA_PATH = resolve(process.cwd(), 'db/schema.sql');

interface ImportStats {
  manufacturers: number;
  components: { total: number; intel: number; amd_cpu: number; nvidia: number; amd_gpu: number };
  cpuSpecs: number;
  gpuSpecs: number;
  sources: number;
  componentSources: number;
  errors: number;
  warnings: number;
}

const stats: ImportStats = {
  manufacturers: 0,
  components: { total: 0, intel: 0, amd_cpu: 0, nvidia: 0, amd_gpu: 0 },
  cpuSpecs: 0,
  gpuSpecs: 0,
  sources: 0,
  componentSources: 0,
  errors: 0,
  warnings: 0
};

const warnings: string[] = [];

/**
 * Initialize database and execute schema
 */
function initializeDatabase(): Database.Database {
  console.log('\ud83d\udd27 Inicializando base de datos...');
  const db = new Database(DB_PATH);
  
  const schema = readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
  
  console.log('\u2705 Esquema ejecutado correctamente');
  return db;
}

/**
 * Insert manufacturers (Intel, AMD, NVIDIA)
 */
function insertManufacturers(db: Database.Database): Map<string, number> {
  console.log('\n\ud83c\udfed Insertando fabricantes...');
  
  const manufacturers = [
    { name: 'Intel', website: 'https://www.intel.com' },
    { name: 'AMD', website: 'https://www.amd.com' },
    { name: 'NVIDIA', website: 'https://www.nvidia.com' }
  ];
  
  const insert = db.prepare(`
    INSERT INTO manufacturers (name, website)
    VALUES (?, ?)
  `);
  
  const manufacturerIds = new Map<string, number>();
  
  for (const mfr of manufacturers) {
    const result = insert.run(mfr.name, mfr.website);
    manufacturerIds.set(mfr.name, result.lastInsertRowid as number);
    stats.manufacturers++;
  }
  
  console.log(`  \u2705 ${stats.manufacturers} fabricantes insertados`);
  return manufacturerIds;
}

/**
 * Get manufacturer ID based on component external_id
 */
function getManufacturerId(externalId: string, type: string, manufacturerIds: Map<string, number>): number {
  if (type === 'cpu') {
    if (externalId.includes('intel')) return manufacturerIds.get('Intel')!;
    if (externalId.includes('amd')) return manufacturerIds.get('AMD')!;
  } else if (type === 'gpu') {
    if (externalId.includes('nvidia') || externalId.includes('rtx') || externalId.includes('geforce')) {
      return manufacturerIds.get('NVIDIA')!;
    }
    if (externalId.includes('amd') || externalId.includes('radeon')) {
      return manufacturerIds.get('AMD')!;
    }
  }
  
  // Default fallback
  return manufacturerIds.get('Intel')!;
}

/**
 * Validate and insert source URLs
 */
async function validateAndInsertSource(
  db: Database.Database,
  url: string,
  type: 'specs' | 'price'
): Promise<number | null> {
  try {
    const validation = await validateSourceStrict(url);
    
    if (!validation.valid) {
      warnings.push(`URL inv\u00e1lida: ${url} - ${validation.reason}`);
      stats.warnings++;
      return null;
    }
    
    const insert = db.prepare(`
      INSERT OR IGNORE INTO sources (url, domain, type)
      VALUES (?, ?, ?)
    `);
    
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    insert.run(url, domain, type);
    
    // Get the source ID
    const select = db.prepare('SELECT id FROM sources WHERE url = ?');
    const source = select.get(url) as { id: number } | undefined;
    
    if (source) {
      stats.sources++;
      return source.id;
    }
    
    return null;
  } catch (error) {
    warnings.push(`Error validando URL: ${url} - ${error}`);
    stats.warnings++;
    return null;
  }
}

/**
 * Import a single component with all its relationships
 */
async function importComponent(
  db: Database.Database,
  component: any,
  manufacturerIds: Map<string, number>
) {
  const mfgId = getManufacturerId(component.external_id, component.type, manufacturerIds);
  
  // Insert component
  const insertComponent = db.prepare(`
    INSERT INTO components (external_id, type, model, manufacturer_id)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = insertComponent.run(
    component.external_id,
    component.type,
    component.name,
    mfgId
  );
  
  const componentId = result.lastInsertRowid as number;
  stats.components.total++;
  
  // Track by manufacturer
  if (component.type === 'cpu') {
    if (component.external_id.includes('intel')) stats.components.intel++;
    if (component.external_id.includes('amd')) stats.components.amd_cpu++;
  } else if (component.type === 'gpu') {
    if (component.external_id.includes('nvidia') || component.external_id.includes('rtx')) {
      stats.components.nvidia++;
    }
    if (component.external_id.includes('amd') || component.external_id.includes('radeon')) {
      stats.components.amd_gpu++;
    }
  }
  
  // Insert specs based on type
  if (component.type === 'cpu') {
    const insertCpuSpecs = db.prepare(`
      INSERT INTO cpu_specs (
        component_id, cores, threads, base_clock_ghz, boost_clock_ghz, tdp_watts, socket
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertCpuSpecs.run(
      componentId,
      component.specs.cores,
      component.specs.threads,
      component.specs.base_clock_ghz,
      component.specs.boost_clock_ghz,
      component.specs.tdp_watts,
      component.specs.socket
    );
    stats.cpuSpecs++;
  } else if (component.type === 'gpu') {
    const insertGpuSpecs = db.prepare(`
      INSERT INTO gpu_specs (
        component_id, memory_gb, memory_type, core_clock_mhz, boost_clock_mhz, tdp_watts, interface
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertGpuSpecs.run(
      componentId,
      component.specs.memory_gb,
      component.specs.memory_type,
      component.specs.core_clock_mhz,
      component.specs.boost_clock_mhz,
      component.specs.tdp_watts,
      component.specs.interface
    );
    stats.gpuSpecs++;
  }
  
  // Validate and insert spec source
  if (component.spec_source) {
    const sourceId = await validateAndInsertSource(db, component.spec_source, 'specs');
    
    if (sourceId) {
      const insertCs = db.prepare(`
        INSERT INTO component_sources (component_id, source_id, verified_at)
        VALUES (?, ?, datetime('now'))
      `);
      
      insertCs.run(componentId, sourceId);
      stats.componentSources++;
    }
  }
  
  // Validate and insert price source
  if (component.price_source) {
    const sourceId = await validateAndInsertSource(db, component.price_source, 'price');
    
    if (sourceId) {
      const insertCs = db.prepare(`
        INSERT INTO component_sources (component_id, source_id, verified_at)
        VALUES (?, ?, datetime('now'))
      `);
      
      insertCs.run(componentId, sourceId);
      stats.componentSources++;
      
      // Insert price
      const insertPrice = db.prepare(`
        INSERT INTO prices (component_id, source_id, price_eur, recorded_at)
        VALUES (?, ?, ?, datetime('now'))
      `);
      
      insertPrice.run(componentId, sourceId, component.price_eur);
    }
  }
}

/**
 * Generate Spanish import report
 */
function generateReport() {
  const dbSize = (() => {
    try {
      const stats = require('fs').statSync(DB_PATH);
      return (stats.size / 1024).toFixed(2);
    } catch {
      return 'N/A';
    }
  })();
  
  console.log('\n═══════════════════════════════════════');
  console.log('   REPORTE DE IMPORTACI\u00d3N - PHASE 5');
  console.log('═══════════════════════════════════════\n');
  
  console.log(`\u2705 Manufacturers: ${stats.manufacturers} insertados`);
  console.log(`\u2705 Components: ${stats.components.total} importados`);
  console.log(`   - CPUs Intel: ${stats.components.intel}`);
  console.log(`   - CPUs AMD: ${stats.components.amd_cpu}`);
  console.log(`   - GPUs NVIDIA: ${stats.components.nvidia}`);
  console.log(`   - GPUs AMD: ${stats.components.amd_gpu}`);
  console.log(`\u2705 CPU Specs: ${stats.cpuSpecs} registros`);
  console.log(`\u2705 GPU Specs: ${stats.gpuSpecs} registros`);
  console.log(`\u2705 Sources: ${stats.sources} URLs validadas`);
  console.log(`\u2705 Component-Sources: ${stats.componentSources} links creados`);
  console.log(`\u26a0\ufe0f  Errores: ${stats.errors}`);
  console.log(`\u26a0\ufe0f  Warnings: ${stats.warnings}`);
  
  if (warnings.length > 0) {
    console.log('\n\ud83d\udea8 Warnings detectados:');
    warnings.forEach(w => console.log(`   - ${w}`));
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log('\ud83c\udf89 IMPORTACI\u00d3N EXITOSA');
  console.log(`Base de datos: database.sqlite (${dbSize} KB)`);
  console.log('═══════════════════════════════════════\n');
}

/**
 * Main import function
 */
async function runImport() {
  console.log('\ud83c\udf31 Iniciando importaci\u00f3n de datos reales...\n');
  
  let db: Database.Database | null = null;
  
  try {
    // Initialize database
    db = initializeDatabase();
    
    // Enable foreign keys
    db.exec('PRAGMA foreign_keys = ON;');
    
    // Start transaction
    db.exec('BEGIN TRANSACTION;');
    
    // Insert manufacturers
    const manufacturerIds = insertManufacturers(db);
    
    // Import all components
    console.log('\n\ud83d\udce6 Importando componentes...');
    for (const component of seedComponents) {
      await importComponent(db, component, manufacturerIds);
      console.log(`  \u2713 ${component.name}`);
    }
    
    // Commit transaction
    db.exec('COMMIT;');
    
    // Generate report
    generateReport();
    
    // Close database
    db.close();
    
    console.log('\u2728 Importaci\u00f3n completada exitosamente\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n\u274c Error durante la importaci\u00f3n:', error);
    
    if (db) {
      try {
        db.exec('ROLLBACK;');
        console.log('\u21a9\ufe0f  Rollback ejecutado');
        db.close();
      } catch (rollbackError) {
        console.error('Error durante rollback:', rollbackError);
      }
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runImport();
}

export { runImport };
