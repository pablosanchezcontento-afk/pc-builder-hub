import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname),
      // `server-only` throws outside a React Server Component bundle; tests exercise the data layer directly.
      'server-only': resolve(__dirname, 'tests/server-only-stub.ts'),
    },
  },
  test: {
    include: ['lib/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
  },
});
