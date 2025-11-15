// 该文件AI参与度高
// This file has a high AI participation rate.

import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import type { Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

interface BlogItem { filename: string; title?: string; date?: string }
interface MetaItem { path: string; title: string }

export function viteSitemapMulti(opts: {
    hostnames: string[];
    baseOutDir: string;
}): Plugin {
    let config: ResolvedConfig;
    const { hostnames, baseOutDir } = opts;
    const gitTime = (file: string): Date | null => {
        try {
            const t = execSync(`git log --diff-filter=A --follow --format=%at -- "${file}" | tail -1`, {
                encoding: 'utf8',
                cwd: path.resolve(__dirname, '..'),
            }).trim();
            return t ? new Date(Number(t) * 1000) : null;
        } catch { return null; };
    };
    const loadYaml = <T>(p: string): T | null =>
        fs.existsSync(p) ? yaml.load(fs.readFileSync(p, 'utf-8')) as T : null;
    return {
        name: 'vite-sitemap-multi',
        apply: 'build',
        configResolved(c) { config = c; },
        closeBundle() {
            const root = path.resolve(__dirname, '..');
            const outDir = path.resolve(root, baseOutDir);
            const blogList: BlogItem[] = loadYaml(path.join(root, 'src/_configs/blog.yaml')) ?? [];
            const metaList: MetaItem[] = loadYaml(path.join(root, 'src/_configs/meta.yaml')) ?? [];
            type UrlItem = { loc: string; lastmod?: Date };
            const urlMap = new Map<string, UrlItem>();
            for (const f of require('glob').sync('src/**/*.html', { ignore: 'src/blog/posts/template.html' })) {
                const rel = path.relative('src', f).replace(/\\/g, '/');
                const filename = path.basename(f);
                if (filename === 'index.html') {
                    const dirPath = path.dirname(rel);
                    const loc = dirPath === '.' ? '/' : '/' + dirPath.replace(/\\/g, '/') + '/';
                    urlMap.set(loc, { loc });
                } else {
                    const loc = '/' + rel.replace(/\\/g, '/');
                    urlMap.set(loc, { loc });
                };
            };
            for (const it of blogList) {
                if (!it.filename) continue;
                const mdFile = path.join(root, `posts/${it.filename}.md`);
                const date = it.date ? new Date(it.date) : gitTime(mdFile) ?? fs.statSync(mdFile).ctime;
                urlMap.set(`/blog/posts/${it.filename}/`, { loc: `/blog/posts/${it.filename}/`, lastmod: date });
            };
            const multi = hostnames.length > 1;
            const lines: string[] = [];
            lines.push('<?xml version="1.0" encoding="UTF-8"?>');
            lines.push(multi
                ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
                : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

            for (const u of urlMap.values()) {
                lines.push('  <url>');
                const base = hostnames[0].replace(/\/$/, '');
                const isHtmlFile = u.loc.endsWith('.html');
                const finalLoc = isHtmlFile ? u.loc : (u.loc.endsWith('/') ? u.loc : u.loc + '/');
                const main = base + finalLoc;
                lines.push(`    <loc>${main}</loc>`);
                if (u.lastmod) lines.push(`    <lastmod>${u.lastmod.toISOString()}</lastmod>`);
                if (multi) {
                    for (const h of hostnames) {
                        const href = `${h.replace(/\/$/, '')}${finalLoc}`;
                        lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${href}" />`);
                    };
                };
                lines.push('  </url>');
            };
            lines.push('</urlset>');
            const file = path.join(outDir, 'sitemap.xml');
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, lines.join('\n'), 'utf-8');
            console.log(`[sitemap-multi] sitemap.xml generated at ${file}`);
            const notFoundHtmlPath = path.join(outDir, '404.html');
            if (fs.existsSync(notFoundHtmlPath)) {
                try {
                    let htmlContent = fs.readFileSync(notFoundHtmlPath, 'utf-8');
                    const scriptTag = `<script id="hostnames" type="application/json">${JSON.stringify(hostnames)}</script>`;
                    if (htmlContent.includes('</body>')) {
                        htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);
                    } else {
                        htmlContent += `\n${scriptTag}`;
                    };
                    fs.writeFileSync(notFoundHtmlPath, htmlContent, 'utf-8');
                    console.log(`[sitemap-multi] Injected hostnames into ${notFoundHtmlPath}`);
                } catch (error) {
                    console.error(`[sitemap-multi] Failed to inject hostnames into 404.html:`, error);
                };
            } else {
                config.logger.warn(`[sitemap-multi] 404.html not found in output directory, skipping hostname injection.`);
            };
        },
    };
};