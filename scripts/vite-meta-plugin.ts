// 该文件AI参与度高
// This file has a high AI participation rate.

import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
interface MetaConfig {
    path: string;
    title: string;
    description: string;
};
function generateMetaTags(title: string, description: string): string {
    return `
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
`;
};
export function viteMeta(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    const metaConfigPath = path.resolve(projectRoot, 'src/_configs/meta.yaml');
    let metaData: MetaConfig[] = [];
    try {
        metaData = yaml.load(fs.readFileSync(metaConfigPath, 'utf8')) as MetaConfig[];
    } catch (e) {
        console.error('Failed to load or parse meta.yaml:', e);
    };
    return {
        name: 'vite-meta-plugin',
        transformIndexHtml(html, ctx) {
            const url = ctx.originalUrl || ctx.path;

            let normalizedPath = url.endsWith('/') ? url.slice(0, -1) : url;
            if (normalizedPath === '' || normalizedPath.endsWith('/index.html')) {
                normalizedPath = '/';
            } else if (normalizedPath.endsWith('.html')) {
                normalizedPath = normalizedPath.slice(0, -5);
            };
            const pageMeta = metaData.find(m => m.path === normalizedPath);
            if (pageMeta) {
                const metaTags = generateMetaTags(pageMeta.title, pageMeta.description);
                return html.replace('</head>', `${metaTags}\n</head>`);
            };

            return html;
        },
        handleHotUpdate({ file, server }) {
            if (file.endsWith('meta.yaml')) {
                console.log('Reloading due to change in meta.yaml');
                server.ws.send({ type: 'full-reload', path: '*' });
            };
        },
    };
};
