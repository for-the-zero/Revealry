// 该文件AI参与度高
// This file has a high AI participation rate.
// Gemini 2.5 Pro -> Claude 4 Sonnet -> GPT-5(free) -> Claude 4 Sonnet -> Gemini 2.5 Pro[Final ver.]

import type { Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { processMarkdown } from './md-processor';
import yaml from 'js-yaml';
interface BlogPostConfig {
    filename: string;
    title: string;
    [key: string]: any;
};
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
export function markdownBlog(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    const templatePath = path.resolve(projectRoot, 'src/blog/posts/template.html');
    const template = fs.readFileSync(templatePath, 'utf-8');
    const blogConfigPath = path.resolve(projectRoot, 'src/_configs/blog.yaml');
    let blogData: BlogPostConfig[] = [];
    try {
        blogData = yaml.load(fs.readFileSync(blogConfigPath, 'utf8')) as BlogPostConfig[];
    } catch (e) {
        console.error('Failed to load or parse blog.yaml:', e);
    };
    function generateDescription(mdContent: string): string {
        const plainText = mdContent
            .replace(/---[\s\S]*?---/, '')
            .replace(/#+\s.*/g, '')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/[*>_-]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        return plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
    };
    function generateMetaTags(title: string, description: string): string {
        const safeTitle = escapeHtml(title);
        const safeDescription = escapeHtml(description);
        return `
<meta name="description" content="${safeDescription}">
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDescription}">
<meta property="og:type" content="article">
`;
    };
    let viteCommand: ResolvedConfig['command'];
    let viteConfig: ResolvedConfig;
    function transformTemplate(templateStr: string, entryChunk: any, bundle: any, htmlOutputPath: string) {
        let processedTemplate = templateStr;
        const htmlDir = path.posix.dirname(htmlOutputPath);
        let scriptTags = '';
        if (entryChunk.imports && entryChunk.imports.length > 0) {
            entryChunk.imports.forEach((importFileName: string) => {
                const rel = path.posix.relative(htmlDir, importFileName).replace(/\\/g, '/');
                const src = rel.startsWith('.') ? rel : './' + rel;
                scriptTags += `<script src="${src}" type="module"></script>\n`;
            });
        };
        if (entryChunk.fileName) {
            const relMain = path.posix.relative(htmlDir, entryChunk.fileName).replace(/\\/g, '/');
            const mainSrc = relMain.startsWith('.') ? relMain : './' + relMain;
            scriptTags += `<script src="${mainSrc}" type="module"></script>\n`;
        };
        processedTemplate = processedTemplate.replace(/<script[^>]*src=["'][^"']*template\.ts["'][^>]*><\/script>/gi, '');
        if (scriptTags) {
            processedTemplate = processedTemplate.replace('</body>', `${scriptTags}\n</body>`);
        };
        return processedTemplate;
    };
    function adjustImagePaths(html: string, isProduction: boolean): string {
        if (isProduction) {
            return html.replace(/(<img[^>]*src=["'])(?:\.\/)?img\//g, '$1../img/');
        } else {
            return html.replace(/(<img[^>]*src=["'])\.\.\/img\//g, '$1img/');
        };
    };
    function findTemplateCssFiles(entryChunk: any, bundle: any, slug: string): string[] {
        if ((entryChunk as any).viteMetadata?.importedCss && (entryChunk as any).viteMetadata.importedCss.size > 0) {
            return Array.from((entryChunk as any).viteMetadata.importedCss);
        };
        const templateCssFiles: string[] = [];
        const chunkBaseName = entryChunk.fileName.replace(/\.js$/, '');
        const matchingCss = Object.values(bundle).find((item: any) => {
            return item &&
                item.type === 'asset' &&
                item.fileName &&
                item.fileName.endsWith('.css') &&
                item.fileName.replace(/\.css$/, '') === chunkBaseName;
        });
        if (matchingCss) {
            templateCssFiles.push((matchingCss as any).fileName);
            return templateCssFiles;
        };
        const templateCss = Object.values(bundle).filter((item: any) => {
            return item &&
                item.type === 'asset' &&
                item.fileName &&
                item.fileName.endsWith('.css') &&
                (item.fileName.includes('template') ||
                item.fileName.includes('blog-posts') ||
                item.fileName.includes('post-template'));
        }).map((item: any) => item.fileName);
        if (templateCss.length > 0) {
            templateCssFiles.push(...templateCss);
            return templateCssFiles;
        };
        const contentBasedCss = Object.values(bundle).filter((item: any) => {
            if (!item || item.type !== 'asset' || !item.fileName || !item.fileName.endsWith('.css')) {
                return false;
            };
            const source = typeof item.source === 'string' ? item.source : item.source?.toString();
            if (!source) return false;
            const blogFeatures = [
                source.includes('.article'),
                source.includes('.toc-list'),
                source.includes('highlight.js') || source.includes('.hljs'),
                source.includes('mdui-prose') || source.includes('.prose')
            ];
            const matchCount = blogFeatures.filter(Boolean).length;
            const excludeFeatures = [
                source.includes('.homepage'),
                source.includes('.nav-main'),
                source.includes('.footer-main'),
                source.includes('.gallery'),
                source.includes('.contact-form')
            ];
            return matchCount >= 2 && !excludeFeatures.some(Boolean);
        }).map((item: any) => item.fileName);
        templateCssFiles.push(...contentBasedCss.slice(0, 2));
        console.log(`[${slug}] Found CSS files:`, templateCssFiles);
        return templateCssFiles;
    };
    return {
        name: 'vite-posts-plugin',
        configResolved(resolvedConfig) {
            viteCommand = resolvedConfig.command;
            viteConfig = resolvedConfig;
        },
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const urlMatch = req.url?.match(/^\/blog\/posts\/([^/]+)\/?$/);
                if (!urlMatch) { return next(); };
                const slug = urlMatch[1];
                const decodedSlug = decodeURIComponent(slug);
                const mdPath = path.resolve(projectRoot, `src/_post/${decodedSlug}.md`);
                if (fs.existsSync(mdPath)) {
                    const mdContent = fs.readFileSync(mdPath, 'utf-8');
                    const { html, toc } = processMarkdown(mdPath);
                    const adjustedHtml = adjustImagePaths(html, false);
                    const postInfo = blogData.find(p => p.filename === decodedSlug);
                    const title = postInfo ? postInfo.title : 'Blog Post';
                    const description = generateDescription(mdContent);
                    const metaTags = generateMetaTags(title, description);
                    const pageHtml = template
                        .replace('{{ content }}', adjustedHtml)
                        .replace('{{ toc_json }}', `<script id="toc-json" type="application/json">${JSON.stringify(toc)}</script>`)
                        .replace('</head>', `${metaTags}\n</head>`);
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
        generateBundle(options, bundle) {
            if (viteCommand !== 'build') {
                return;
            };
            const postsDir = path.resolve(projectRoot, 'src/_post');
            const files = fs.readdirSync(postsDir);
            for (const file of files) {
                if (path.extname(file) !== '.md') { continue; };
                const slug = path.basename(file, '.md');
                const mdPath = path.join(postsDir, file);
                const mdContent = fs.readFileSync(mdPath, 'utf-8');
                const { html: postHtml, toc } = processMarkdown(mdPath);
                const adjustedPostHtml = adjustImagePaths(postHtml, true);
                const postInfo = blogData.find(p => p.filename === slug);
                const title = postInfo ? postInfo.title : 'Blog Post';
                const description = generateDescription(mdContent);
                const metaTags = generateMetaTags(title, description);
                const entryKey = `blog/posts/${slug}/index`;
                const entryChunk = Object.values(bundle).find(chunk =>
                    chunk.type === 'chunk' &&
                    chunk.isEntry &&
                    chunk.name === entryKey
                );
                if (entryChunk && entryChunk.type === 'chunk') {
                    const htmlOutputPath = `blog/posts/${slug}/index.html`;
                    const htmlDir = path.posix.dirname(htmlOutputPath);
                    const templateCssFiles = findTemplateCssFiles(entryChunk, bundle, slug);
                    const cssLinks = templateCssFiles.map(cssFile => {
                        const rel = path.posix.relative(htmlDir, cssFile).replace(/\\/g, '/');
                        const href = rel.startsWith('.') ? rel : './' + rel;
                        return `<link rel="stylesheet" href="${href}">`;
                    }).join('\n');
                    let processedTemplate = template
                        .replace('{{ content }}', adjustedPostHtml)
                        .replace('{{ toc_json }}', `<script id="toc-json" type="application/json">${JSON.stringify(toc)}</script>`)
                        .replace('</head>', `${metaTags}\n</head>`);
                    if (cssLinks) {
                        if (/<link\s+rel=["']stylesheet["'][^>]*>/i.test(processedTemplate)){
                            processedTemplate = processedTemplate.replace(
                                /<link\s+rel=["']stylesheet["'][^>]*>/gi,
                                cssLinks
                            );
                        } else {
                            processedTemplate = processedTemplate.replace('</head>', `${cssLinks}\n</head>`);
                        };
                    };
                    processedTemplate = transformTemplate(processedTemplate, entryChunk, bundle, htmlOutputPath);
                    this.emitFile({
                        type: 'asset',
                        fileName: htmlOutputPath,
                        source: processedTemplate
                    });
                };
            };
        },
        handleHotUpdate({ file, server }) {
            const postsDir = path.resolve(projectRoot, 'src/_post');
            if (file.startsWith(postsDir) || file.endsWith('blog.yaml')) {
                server.ws.send({ type: 'full-reload', path: '*' });
            };
        },
    };
};