/// <reference types="vitest" />
import { mergeConfig , defineConfig} from 'vite';
import baseConfig from './vite.config'


export default mergeConfig(baseConfig, {
  test: {
    cache: {
      dir: 'node_modules/.vitest',
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
