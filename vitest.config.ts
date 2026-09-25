import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Reuse the `paths` aliases from tsconfig.json (e.g. `@/*`) instead of redeclaring them.
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globalSetup: ['./vitest.global-setup.ts'],
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', '.next', 'e2e', 'playwright-report', 'test-results'],
    server: {
      deps: {
        // next-intl's ESM build imports `next/navigation` without an extension, which Node's
        // resolver rejects; letting Vite process it resolves the import.
        inline: ['next-intl'],
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'i18n-builder/build.ts'],
      exclude: ['**/*.test.{ts,tsx}'],
      reporter: ['text', 'html'],
    },
  },
});
