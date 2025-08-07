import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist'
  },
  "server": {
    host: "0.0.0.0"
  }
})
