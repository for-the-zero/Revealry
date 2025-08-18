// 该文件AI参与度高
// This file has a high AI participation rate.

import { defineConfig } from 'vite';
import path from 'path';
import { glob } from 'glob';
import yaml from '@modyfi/vite-plugin-yaml';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { markdownBlog } from './scripts/vite-posts-plugin';


const htmlEntries = glob.sync('src/**/*.html', {
  ignore: ['src/blog/posts/template.html']
}).reduce((acc, file) => {
  const relativePath = path.relative('src', file);
  const name = relativePath.replace(/\.html$/, '').replace(/\\/g, '/');
  acc[name] = path.resolve(__dirname, file);
  return acc;
}, {} as Record<string, string>);
const postEntries = glob.sync('src/_post/*.md').reduce((acc, file) => {
  const name = path.basename(file, '.md');
  acc[`blog/posts/${name}/index`] = path.resolve(__dirname, 'src/blog/posts/template.ts');
  return acc;
}, {} as Record<string, string>);
const allEntries = {
  ...htmlEntries,
  ...postEntries
};


export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: allEntries,
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.startsWith('blog/posts/')) {
            return '[name].js';
          };
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extname = path.extname(assetInfo.name || '');
          if (extname === '.css') {
            return 'assets/[name]-[hash][extname]';
          };
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  server: {
    host: "0.0.0.0",
  },
  base: './',
  plugins: [
    yaml(),
    markdownBlog(),
    viteStaticCopy({
      targets: [
        {
          src: '_post/img/**/*',
          dest: 'blog/posts/img'
        },
        {
          src: '_post/img/**/*',
          dest: 'img'
        },
        {
          src: 'assets/icon.svg',
          dest: ''
        }
      ]
    }),
  ],
});