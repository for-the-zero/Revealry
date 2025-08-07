import { defineConfig } from 'vite';
import yaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  plugins: [yaml()],
  root: 'src',
  build: {
    outDir: '../dist'
  },
  "server": {
    host: "0.0.0.0"
  }
});
