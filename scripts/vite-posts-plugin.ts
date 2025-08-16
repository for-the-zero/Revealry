// 该文件AI参与度高

import type { Plugin, ResolvedConfig } from 'vite'; // 导入 ResolvedConfig 类型
import path from 'path';
import fs from 'fs';
import { processMarkdown } from './md-processor';

export function markdownBlog(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    const templatePath = path.resolve(projectRoot, 'src/blog/posts/template.html');
    const template = fs.readFileSync(templatePath, 'utf-8');
    let viteCommand: ResolvedConfig['command'];
    return {
        name: 'vite-posts-plugin',
        configResolved(resolvedConfig) {
            viteCommand = resolvedConfig.command;
        },

        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const urlMatch = req.url?.match(/^\/blog\/posts\/([a-zA-Z0-9_-]+)\/?$/);
                if (!urlMatch){return next();};
                const slug = urlMatch[1];
                const mdPath = path.resolve(projectRoot, `src/_post/${slug}.md`);
                if (fs.existsSync(mdPath)) {
                    const { html, toc } = processMarkdown(mdPath);
                    const pageHtml = template
                        .replace('{{ content }}', html)
                        .replace('{{ toc_json }}', `<script id="toc-json" type="application/json">${JSON.stringify(toc)}</script>`);
                    let finalHtml = '';
                    if (req.url) {
                        finalHtml = await server.transformIndexHtml(req.url, pageHtml, req.originalUrl);
                        res.setHeader('Content-Type', 'text/html');
                        res.statusCode = 200;
                        res.end(finalHtml);
                        return;
                    };
                };
                return next();
            });
        },
        buildStart() {
            if (viteCommand !== 'build') {
                return;
            };
            const postsDir = path.resolve(projectRoot, 'src/_post');
            const files = fs.readdirSync(postsDir);

            for (const file of files) {
                if (path.extname(file) !== '.md'){continue;};
                const slug = path.basename(file, '.md');
                const mdPath = path.join(postsDir, file);
                const { html: postHtml, toc } = processMarkdown(mdPath);
                const pageHtml = template
                    .replace('{{ content }}', postHtml)
                    .replace('{{ toc_json }}', `<script id="toc-json" type="application/json">${JSON.stringify(toc)}</script>`);
                this.emitFile({
                    type: 'asset',
                    fileName: `blog/posts/${slug}/index.html`,
                    source: pageHtml
                });
            };
        },
        handleHotUpdate({ file, server }) {
            const postsDir = path.resolve(projectRoot, 'src/_post');
            if (file.startsWith(postsDir)) {
                server.ws.send({ type: 'full-reload', path: '*' });
            };
        },
    };
};