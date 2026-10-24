import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // e2e files share one MySQL test database, so they must not run concurrently.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      DB_NAME: 'tapwe_test',
      JWT_SECRET: 'test-secret',
    },
  },
});
