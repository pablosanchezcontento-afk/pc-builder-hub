// End-to-end smoke test against the production build: `npm run build && node scripts/smoke.mjs`.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const port = process.env.PORT ?? '3137';
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', port], { stdio: 'inherit' });

const checks = [
  { path: '/', headers: { 'accept-language': 'es-ES,es;q=0.9' }, status: 307, location: '/es' },
  { path: '/en', status: 200, contains: ['PC Builder Hub', 'validated sources'] },
  { path: '/es/cpus', status: 200, contains: ['Procesadores (CPUs)', 'Ryzen 7 7800X3D', 'Core i9-14900K'] },
  { path: '/pt/gpus', status: 200, contains: ['Placas gráficas (GPUs)', 'GeForce RTX 4090'] },
  { path: '/en/gpus/radeon-rx-7600', status: 200, contains: ['Not published', 'amd.com'] },
  { path: '/en/gpus/unknown-card', status: 404 },
  { path: '/en/cpus/socket/am5', status: 200, contains: ['Ryzen 9 7950X'] },
  { path: '/en/gpus/vram/24', status: 200, contains: ['Radeon RX 7900 XTX'] },
  { path: '/en/compare/cpus?a=core-i9-14900k&b=ryzen-9-7950x', status: 200, contains: ['better'] },
  { path: '/en/builder?cpu=ryzen-7-7800x3d&gpu=geforce-rtx-4090', status: 200, contains: ['670', '900', 'AM5'] },
];

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      await fetch(`${base}/en`);
      return;
    } catch {
      await sleep(500);
    }
  }
  throw new Error('server did not start');
}

let failures = 0;
try {
  await waitForServer();
  for (const check of checks) {
    const response = await fetch(base + check.path, { redirect: 'manual', headers: check.headers });
    const body = await response.text();
    const problems = [];
    if (response.status !== check.status) problems.push(`status ${response.status} != ${check.status}`);
    if (check.location && !response.headers.get('location')?.endsWith(check.location)) problems.push(`location ${response.headers.get('location')}`);
    for (const text of check.contains ?? []) if (!body.includes(text)) problems.push(`missing "${text}"`);
    if (!response.headers.get('x-content-type-options')) problems.push('missing security headers');
    failures += problems.length ? 1 : 0;
    console.log(`${problems.length ? 'FAIL' : 'ok  '} ${check.path}${problems.length ? ` — ${problems.join('; ')}` : ''}`);
  }
} finally {
  server.kill();
}
if (failures) {
  console.error(`${failures} smoke check(s) failed`);
  process.exit(1);
}
console.log('smoke: all checks passed');
