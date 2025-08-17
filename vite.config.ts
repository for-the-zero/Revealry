import { defineConfig } from 'vite';
import path from 'path';
import { glob } from 'glob';
import yaml from '@modyfi/vite-plugin-yaml';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { markdownBlog } from './scripts/vite-posts-plugin';

// 获取所有 HTML 入口文件（排除博客模板）
const htmlEntries = glob.sync('src/**/*.html', {
  ignore: ['src/blog/posts/template.html'] // 排除博客模板
}).reduce((acc, file) => {
  const relativePath = path.relative('src', file);
  const name = relativePath.replace(/\.html$/, '').replace(/\\/g, '/');
  acc[name] = path.resolve(__dirname, file);
  return acc;
}, {} as Record<string, string>);

// 获取博客文章入口 - 修复：为每个博客文章创建独立的入口
const postEntries = glob.sync('src/_post/*.md').reduce((acc, file) => {
  const name = path.basename(file, '.md');
  // 修复：为每个博客文章创建一个虚拟的入口点，指向模板的TS文件
  acc[`blog/posts/${name}/index`] = path.resolve(__dirname, 'src/blog/posts/template.ts');
  return acc;
}, {} as Record<string, string>);

// 合并所有入口
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
          // 如果是博客文章，使用特定的命名规则
          if (chunkInfo.name.startsWith('blog/posts/')) {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extname = path.extname(assetInfo.name || '');
          if (extname === '.css') {
            return 'assets/[name]-[hash][extname]';
          }
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
        // 同时复制一份到根目录的img，供开发环境使用
        {
          src: '_post/img/**/*',
          dest: 'img'
        }
      ]
    }),
  ],
});