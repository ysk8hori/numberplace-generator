import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
  test: {
    globals: true,
    setupFiles: './src/__tests__/test.setup.ts',
  },
});
