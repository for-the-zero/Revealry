import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
interface MetaConfig {
    path: string;
    title: string;
    description?: string;
};
function generateMetaTags(title: string, description?: string): string {
    let tags = `<meta property="og:title" content="${title}">\n<meta property="og:type" content="website">`;
    if (description) {
        tags = `<meta name="description" content="${description}">\n<meta property="og:description" content="${description}">\n${tags}`;
    };
    return '\n' + tags + '\n';
};
export function viteMeta(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    const metaConfigPath = path.resolve(projectRoot, 'configs/meta.yaml');
    let metaData: MetaConfig[] = [];
    try {
        metaData = yaml.load(fs.readFileSync(metaConfigPath, 'utf8')) as MetaConfig[];
    } catch (e) {
        console.error('Failed to load or parse meta.yaml:', e);
    };
    return {
        name: 'vite-meta-plugin',
        transformIndexHtml(html, ctx) {
            let url = ctx.originalUrl || ctx.path || '';
            url = url.replace(/\\/g, '/');
            if (url.includes('src/')) {
                const srcIndex = url.lastIndexOf('src/');
                url = url.substring(srcIndex + 3);
            };
            let normalizedPath = url;
            if (normalizedPath.endsWith('/index.html')) {
                normalizedPath = normalizedPath.slice(0, -10);
            } else if (normalizedPath.endsWith('.html')) {
                normalizedPath = normalizedPath.slice(0, -5);
            };
            if (!normalizedPath.startsWith('/')) {
                normalizedPath = '/' + normalizedPath;
            };
            if (!normalizedPath.endsWith('/') && normalizedPath !== '/') {
                normalizedPath = normalizedPath + '/';
            };
            if (normalizedPath === '//') {
                normalizedPath = '/';
            };
            const pageMeta = metaData.find(m => m.path === normalizedPath);
            if (pageMeta) {
                const metaTags = generateMetaTags(pageMeta.title, pageMeta.description);
                return html.replace('</head>', `${metaTags}</head>`);
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
