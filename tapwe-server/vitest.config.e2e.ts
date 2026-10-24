import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // e2e files share one Postgres test database, so they must not run concurrently.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      // Pinned so tests never pick up the Supabase settings from .env.
      DB_HOST: 'localhost',
      DB_PORT: '5433',
      DB_USER: 'tapwe',
      DB_PASSWORD: 'tapwe',
      DB_NAME: 'tapwe_test',
      DB_SSL: 'false',
      JWT_SECRET: 'test-secret',
    },
  },
});
