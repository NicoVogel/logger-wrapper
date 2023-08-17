/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    cache: {
      dir: '../../node_modules/.vitest',
    },
    browser: {
      enabled: true,
      headless: true,
      name: 'chromium',
      provider: 'playwright'
    },
    include: ['src/browser/*.spec.ts'],
  },
});
