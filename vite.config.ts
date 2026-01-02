// 该文件AI参与度高
// This file has a high AI participation rate.

import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import yaml from '@modyfi/vite-plugin-yaml';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { markdownBlog } from './scripts/vite-posts-plugin';
import { viteMeta } from './scripts/vite-meta-plugin';
import { viteSitemapMulti } from './scripts/vite-sitemap-plugin';
import { viteExtendHead } from './scripts/vite-head-plugin';
import { viteRssFeed } from './scripts/vite-rss-plugin';


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
      inject: [
        '<!-- 往每篇文章的head注入一些元素 -->',
        '<!-- Inject some elements into the head of each article -->',
        //`<script src="https://giscus.app/client.js" ...></script>`
      ],
      suffix: ' - Revealry Blog'
      /*suffix: {
        'zh-CN': ' - Revealry 中文博客后缀',
        'en': ' - Revealry Blog Suffix English'
      }*/
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
      hostnames: [
        // 将域名换成你自己的，可添加多个
        // Replace the domain with your own, you can add multiple
        'https://for-the-zero.github.io/Revealry'
      ],
      baseOutDir: 'dist'
    }),
    viteRssFeed({
      hostname: 'https://for-the-zero.github.io/Revealry/',
      feedTitle: 'Revealry Blog RSS Feed',
      feedDescription: 'Latest blog posts from Revealry',
      copyright: 'Copyright',
      author: 'Author'
    }),
    viteExtendHead({
      heads: [
        '<!-- 往每个页面的head注入一些元素（文章除外） -->',
        '<!-- Inject some elements into the head of each page (excluding articles) -->'
      ],
      home: [
        '<!-- 额外往首页的head注入一些元素 -->',
        '<!-- Inject some elements into the head of the homepage -->'
      ]
    })
  ],
});