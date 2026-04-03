import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

function generateSeoArea(linksConfig: { [lang: string]: links }): string {
    const urlLinks: { href: string; text: string }[] = [];
    for (const lang of Object.keys(linksConfig)) {
        const groups = linksConfig[lang];
        if (!groups) continue;
        for (const group of groups) {
            if (!group.items) continue;
            for (const item of group.items) {
                if (!item.links) continue;
                for (const link of item.links) {
                    if (link.type === 'url') {
                        urlLinks.push({
                            href: link.content,
                            text: item.name
                        });
                    };
                };
            };
        };
    };
    const uniqueLinks = urlLinks.filter((link, index, self) =>
        index === self.findIndex(l => l.href === link.href && l.text === link.text)
    );
    const anchorTags = uniqueLinks
        .map(link => `<a href="${link.href}">${link.text}</a>`)
        .join('');
    return `<div class="seo-area">${anchorTags}</div>`;
};

function generateBlogSeoArea(blogConfig: blog_post[]): string {
    const anchorTags = blogConfig
        .filter(post => post.filename)
        .map(post => `<a href="./posts/${post.filename}/">${post.title}</a>`)
        .join('');
    return `<div class="seo-area">${anchorTags}</div>`;
};

export function viteSeoArea(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    const linksConfigPath = path.resolve(projectRoot, 'configs/links.yaml');
    const blogConfigPath = path.resolve(projectRoot, 'configs/blog.yaml');

    let linksData: { [lang: string]: links } = {};
    try {
        linksData = yaml.load(fs.readFileSync(linksConfigPath, 'utf8')) as { [lang: string]: links };
    } catch (e) {
        console.error('Failed to load or parse links.yaml:', e);
    };
    const linksSeoAreaHtml = generateSeoArea(linksData);

    let blogData: blog_post[] = [];
    try {
        blogData = yaml.load(fs.readFileSync(blogConfigPath, 'utf8')) as blog_post[];
    } catch (e) {
        console.error('Failed to load or parse blog.yaml:', e);
    };
    const blogSeoAreaHtml = generateBlogSeoArea(blogData);

    return {
        name: 'vite-seo-area-plugin',
        transformIndexHtml(html, ctx) {
            const pagePath = ctx.path || ctx.filename || '';

            if (pagePath.includes('links')) {
                return html
                    .replace(/<div\s+class="seo-area">\s*<\/div>/g, linksSeoAreaHtml)
                    .replace(/\{\{\s*seo_area\s*\}\}/g, linksSeoAreaHtml);
            }

            if (pagePath.includes('blog')) {
                return html
                    .replace(/<div\s+class="seo-area">\s*<\/div>/g, blogSeoAreaHtml)
                    .replace(/\{\{\s*seo_area\s*\}\}/g, blogSeoAreaHtml);
            }

            return html;
        },
        handleHotUpdate({ file, server }) {
            if (file.endsWith('links.yaml')) {
                console.log('Reloading due to change in links.yaml');
                server.ws.send({ type: 'full-reload', path: '*' });
            };
            if (file.endsWith('blog.yaml')) {
                console.log('Reloading due to change in blog.yaml');
                server.ws.send({ type: 'full-reload', path: '*' });
            };
        },
    };
};