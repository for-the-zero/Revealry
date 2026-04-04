import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import yaml from '@modyfi/vite-plugin-yaml';
import jsYaml from 'js-yaml';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { markdownBlog } from './scripts/vite-posts-plugin';
import { viteMeta } from './scripts/vite-meta-plugin';
import { viteSitemapMulti } from './scripts/vite-sitemap-plugin';
import { viteExtendHead } from './scripts/vite-head-plugin';
import { viteRssFeed } from './scripts/vite-rss-plugin';
import { viteSeoArea } from './scripts/vite-seo-area-plugin';

const configPath = path.resolve(__dirname, 'configs/config.yaml');
const config = jsYaml.load(fs.readFileSync(configPath, 'utf8')) as any;


const htmlEntries = glob.sync('src/**/*.html', {
  ignore: ['src/blog/posts/template.html']
}).reduce((acc, file) => {
  const relativePath = path.relative('src', file);
  const name = relativePath.replace(/\.html$/, '').replace(/\\/g, '/');
  acc[name] = path.resolve(__dirname, file);
  return acc;
}, {} as Record<string, string>);
const postEntries = glob.sync('posts/*.md').reduce((acc, file) => {
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
    viteMeta(),
    yaml(),
    markdownBlog({
      inject: config.blog?.head_inject || [
        '<!-- 往每篇文章的head注入一些元素 -->',
        '<!-- Inject some elements into the head of each article -->',
      ],
      suffix: config.blog?.suffix || ' - Revealry Blog'
    }),
    viteStaticCopy({
      targets: [
        {
          src: '../posts/img/**/*',
          dest: 'blog/posts/img'
        },
        {
          src: '../posts/img/**/*',
          dest: 'img'
        },
        {
          src: 'assets/icon.svg',
          dest: ''
        },
        {
          src: 'assets/intro/**/*',
          dest: 'assets/intro'
        },
        {
          src: 'vercel.json',
          dest: ''
        },
        ...(fs.existsSync('src/README.md') ? [{
          src: 'README.md',
          dest: ''
        }] : [])
      ]
    }),
    viteSitemapMulti({
      hostnames: config.sitemap?.hostnames || [
        'https://for-the-zero.github.io/Revealry'
      ],
      baseOutDir: 'dist'
    }),
    viteRssFeed({
      hostname: config.rss?.hostname || 'https://for-the-zero.github.io/Revealry/',
      feedTitle: config.rss?.title || 'Revealry Blog RSS Feed',
      feedDescription: config.rss?.description || 'Latest blog posts from Revealry',
      copyright: config.rss?.copyright || 'Copyright',
      author: config.rss?.author || 'Author'
    }),
    viteExtendHead({
      heads: config.head_extension?.global || [
        '<!-- 往每个页面的head注入一些元素（文章除外） -->',
        '<!-- Inject some elements into the head of each page (excluding articles) -->'
      ],
      home: config.head_extension?.home || [
        '<!-- 额外往首页的head注入一些元素 -->',
        '<!-- Inject some elements into the head of the homepage -->'
      ]
    }),
    viteSeoArea()
  ],
});