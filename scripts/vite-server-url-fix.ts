import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

export function viteServerUrlFix(): Plugin {
    return {
        name: 'vite-server-url-fix',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url || '';
                if (url.match(/^\/blog\/posts\/[^/]+\/template\.ts$/)) {
                    req.url = '/blog/posts/template.ts';
                };
                if (url.match(/^\/blog\/posts\/[^/]+\/template\.css$/)) {
                    req.url = '/blog/posts/template.css';
                };
                if (/^\/(?:blog(?:\/posts(?:\/[^/]+)?)?|intro|links)(?:\/)?$/g.test(url)) {
                    const newUrl = url.replace(/\/?$/, '/');
                    if (newUrl !== url) {
                        res.writeHead(302, { Location: newUrl });
                        res.end();
                        return;
                    };
                };
                next();
            });
        }
    };
};

export function viteCopyImagesPlugin(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    return {
        name: 'vite-copy-images',
        closeBundle() {
            const imgDir = path.join(projectRoot, 'posts/img');
            const destDir = path.join(projectRoot, 'dist/blog/posts/img');
            if (fs.existsSync(imgDir)) {
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }
                const files = fs.readdirSync(imgDir);
                files.forEach(file => {
                    const src = path.join(imgDir, file);
                    const dest = path.join(destDir, file);
                    fs.copyFileSync(src, dest);
                });
            }
        }
    };
}