/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/node/*.spec.ts'],
  },
});
