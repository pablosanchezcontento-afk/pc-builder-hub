/** Build data/pc_components.db from db/schema.sql and the validated seed. Usage: npm run db:build [path] */

import Database from 'better-sqlite3';
import { rmSync } from 'node:fs';
import { populate } from '../lib/db/populate';

const target = process.argv[2] ?? 'data/pc_components.db';
rmSync(target, { force: true });
const db = new Database(target);
const report = populate(db);
db.close();
console.log(`${target}: ${report.cpus} CPUs, ${report.gpus} GPUs, ${report.manufacturers} manufacturers, ${report.sources} validated sources`);
