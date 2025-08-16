import { defineConfig } from 'vite';
import path from 'path';
import { glob } from 'glob';
import yaml from '@modyfi/vite-plugin-yaml';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { markdownBlog } from './scripts/vite-posts-plugin';

const postEntries = glob.sync('src/_post/*.md').reduce((acc, file) => {
  const name = path.basename(file, '.md');
  acc[`blog/posts/${name}`] = path.resolve(__dirname, 'src/blog/posts/template.html');
  return acc;
}, {} as Record<string, string>);

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist'
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
        }
      ]
    }),
  ],
});