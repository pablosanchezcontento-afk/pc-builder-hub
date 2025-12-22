/**
 * Capa de acceso a datos READ-ONLY para SQLite
 * Utiliza las vistas v_cpus_complete y v_gpus_complete
 */

import Database from 'better-sqlite3';
import { resolve } from 'path';
import type { CPUView, GPUView, ComponentSlug } from './types';

const DB_PATH = resolve(process.cwd(), 'data/pc_components.db');

/**
 * Obtiene la conexi\u00f3n a la base de datos en modo READ-ONLY
 */
function getDatabase(): Database.Database {
  try {
    const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    return db;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('No se pudo conectar a la base de datos');
  }
}

/**
 * Convierte un nombre de modelo a slug
 */
export function createSlug(model: string): ComponentSlug {
  return model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Obtiene todos los CPUs desde la vista v_cpus_complete
 */
export function getAllCPUs(): CPUView[] {
  try {
    const db = getDatabase();
    const cpus = db.prepare('SELECT * FROM v_cpus_complete ORDER BY manufacturer_name, model').all() as CPUView[];
    db.close();
    return cpus;
  } catch (error) {
    console.error('Error al obtener CPUs:', error);
    return [];
  }
}

/**
 * Obtiene todos los GPUs desde la vista v_gpus_complete
 */
export function getAllGPUs(): GPUView[] {
  try {
    const db = getDatabase();
    const gpus = db.prepare('SELECT * FROM v_gpus_complete ORDER BY manufacturer_name, model').all() as GPUView[];
    db.close();
    return gpus;
  } catch (error) {
    console.error('Error al obtener GPUs:', error);
    return [];
  }
}

/**
 * Obtiene un CPU espec\u00edfico por slug
 */
export function getCPUBySlug(slug: ComponentSlug): CPUView | null {
  try {
    const db = getDatabase();
    const cpus = db.prepare('SELECT * FROM v_cpus_complete').all() as CPUView[];
    db.close();
    
    const cpu = cpus.find(c => createSlug(c.model) === slug);
    return cpu || null;
  } catch (error) {
    console.error('Error al obtener CPU por slug:', error);
    return null;
  }
}

/**
 * Obtiene un GPU espec\u00edfico por slug
 */
export function getGPUBySlug(slug: ComponentSlug): GPUView | null {
  try {
    const db = getDatabase();
    const gpus = db.prepare('SELECT * FROM v_gpus_complete').all() as GPUView[];
    db.close();
    
    const gpu = gpus.find(g => createSlug(g.model) === slug);
    return gpu || null;
  } catch (error) {
    console.error('Error al obtener GPU por slug:', error);
    return null;
  }
}
