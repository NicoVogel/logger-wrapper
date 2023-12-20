/// <reference types="vitest" />
import { mergeConfig , defineConfig} from 'vite';
import baseConfig from './vite.config'

export default mergeConfig(baseConfig,{
  test: {
    cache: {
      dir: 'node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/node/*.spec.ts'],
  },
});
