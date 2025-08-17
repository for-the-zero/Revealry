// 该文件AI参与度高

import type { Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { processMarkdown } from './md-processor';

export function markdownBlog(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    const templatePath = path.resolve(projectRoot, 'src/blog/posts/template.html');
    const template = fs.readFileSync(templatePath, 'utf-8');
    let viteCommand: ResolvedConfig['command'];
    let viteConfig: ResolvedConfig;
    
    function transformTemplate(templateStr: string, entryChunk: any, bundle: any, htmlOutputPath: string) {
        let processedTemplate = templateStr;
        const htmlDir = path.posix.dirname(htmlOutputPath);

        // handle JS imports & entry
        let scriptTags = '';
        // imports (other chunks)
        if (entryChunk.imports && entryChunk.imports.length > 0) {
            entryChunk.imports.forEach((importFileName: string) => {
                const rel = path.posix.relative(htmlDir, importFileName).replace(/\\/g, '/');
                const src = rel.startsWith('.') ? rel : './' + rel;
                scriptTags += `<script src="${src}" type="module"></script>\n`;
            });
        }
        // main entry chunk
        if (entryChunk.fileName) {
            const relMain = path.posix.relative(htmlDir, entryChunk.fileName).replace(/\\/g, '/');
            const mainSrc = relMain.startsWith('.') ? relMain : './' + relMain;
            scriptTags += `<script src="${mainSrc}" type="module"></script>\n`;
        }

        // remove any existing module script placeholders in template
        processedTemplate = processedTemplate.replace(/<script[^>]*src=["'][^"']*template\.ts["'][^>]*><\/script>/gi, '');

        if (scriptTags) {
            processedTemplate = processedTemplate.replace('</body>', `${scriptTags}\n</body>`);
        }

        return processedTemplate;
    }
    
    // 调整图片路径的函数
    function adjustImagePaths(html: string, isProduction: boolean): string {
        if (isProduction) {
            // 生产环境：./img/ 或 img/ -> ../img/
            return html.replace(/(<img[^>]*src=["'])(?:\.\/)?img\//g, '$1../img/');
        } else {
            // 开发环境：../img/ -> ./img/ 或 img/
            return html.replace(/(<img[^>]*src=["'])\.\.\/img\//g, '$1img/');
        }
    }
    
    return {
        name: 'vite-posts-plugin',
        configResolved(resolvedConfig) {
            viteCommand = resolvedConfig.command;
            viteConfig = resolvedConfig;
        },

        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const urlMatch = req.url?.match(/^\/blog\/posts\/([a-zA-Z0-9_-]+)\/?$/);
                if (!urlMatch) { return next(); }
                
                const slug = urlMatch[1];
                const mdPath = path.resolve(projectRoot, `src/_post/${slug}.md`);
                
                if (fs.existsSync(mdPath)) {
                    const { html, toc } = processMarkdown(mdPath);
                    // 在开发环境中调整图片路径
                    const adjustedHtml = adjustImagePaths(html, false); // false 表示开发环境
                    const pageHtml = template
                        .replace('{{ content }}', adjustedHtml)
                        .replace('{{ toc_json }}', `<script id="toc-json" type="application/json">${JSON.stringify(toc)}</script>`);
                    
                    let finalHtml = '';
                    if (req.url) {
                        finalHtml = await server.transformIndexHtml(req.url, pageHtml, req.originalUrl);
                        res.setHeader('Content-Type', 'text/html');
                        res.statusCode = 200;
                        res.end(finalHtml);
                        return;
                    }
                }
                return next();
            });
        },

        generateBundle(options, bundle) {
            if (viteCommand !== 'build') {
                return;
            }

            const postsDir = path.resolve(projectRoot, 'src/_post');
            const files = fs.readdirSync(postsDir);

            // 调试：打印所有bundle内容
            console.log('\n=== DEBUG: All bundle items ===');
            Object.entries(bundle).forEach(([key, item]) => {
                if (item.type === 'asset' && item.fileName.endsWith('.css')) {
                    console.log(`CSS Asset: ${item.fileName}`, {
                        originalFileName: (item as any).originalFileName,
                        source: typeof item.source === 'string' ? item.source.substring(0, 100) + '...' : '[Buffer]'
                    });
                } else if (item.type === 'chunk' && item.isEntry) {
                    console.log(`Entry Chunk: ${item.fileName}`, {
                        name: item.name,
                        facadeModuleId: item.facadeModuleId,
                        imports: item.imports,
                        viteMetadata: (item as any).viteMetadata
                    });
                }
            });

            for (const file of files) {
                if (path.extname(file) !== '.md') { continue; }
                
                const slug = path.basename(file, '.md');
                const mdPath = path.join(postsDir, file);
                const { html: postHtml, toc } = processMarkdown(mdPath);
                
                // 在生产环境中调整图片路径
                const adjustedPostHtml = adjustImagePaths(postHtml, true); // true 表示生产环境
                
                // 查找对应的博客文章入口文件
                const entryKey = `blog/posts/${slug}/index`;
                const entryChunk = Object.values(bundle).find(chunk => 
                    chunk.type === 'chunk' && 
                    chunk.isEntry && 
                    chunk.name === entryKey
                );

                if (entryChunk && entryChunk.type === 'chunk') {
                    const htmlOutputPath = `blog/posts/${slug}/index.html`;
                    const htmlDir = path.posix.dirname(htmlOutputPath);
                    
                    console.log(`\n=== DEBUG: Processing ${slug} ===`);
                    console.log('Entry chunk:', {
                        fileName: entryChunk.fileName,
                        name: entryChunk.name,
                        facadeModuleId: entryChunk.facadeModuleId,
                        imports: entryChunk.imports,
                        viteMetadata: (entryChunk as any).viteMetadata
                    });
                    
                    // 方法1：从entry chunk的importedCss中获取CSS文件
                    let templateCssFiles: string[] = [];
                    
                    // 首先尝试从viteMetadata中获取
                    if ((entryChunk as any).viteMetadata?.importedCss && (entryChunk as any).viteMetadata.importedCss.size > 0) {
                        templateCssFiles = Array.from((entryChunk as any).viteMetadata.importedCss);
                    }
                    
                    // 如果没有找到，尝试从bundle中找到与template相关的CSS
                    if (templateCssFiles.length === 0) {
                        templateCssFiles = Object.values(bundle).filter((item: any) => {
                            if (item && item.type === 'asset' && item.fileName && item.fileName.endsWith('.css')) {
                                // 检查文件内容是否包含template相关的样式
                                const source = typeof item.source === 'string' ? item.source : item.source?.toString();
                                if (source && (
                                    source.includes('.article') || 
                                    source.includes('.toc-list') ||
                                    source.includes('highlight.js') ||
                                    source.includes('hljs') ||
                                    source.includes('mdui-prose')
                                )) {
                                    return true;
                                }
                            }
                            return false;
                        }).map((item: any) => item.fileName);
                    }
                    
                    // 如果还是没有找到，检查是否有与entry chunk同名的CSS文件
                    if (templateCssFiles.length === 0) {
                        const chunkBaseName = entryChunk.name.replace(/^blog\/posts\//, '').replace(/\/index$/, '');
                        templateCssFiles = Object.values(bundle).filter((item: any) => {
                            if (item && item.type === 'asset' && item.fileName && item.fileName.endsWith('.css')) {
                                return item.fileName.includes(chunkBaseName) || item.fileName.includes('template');
                            }
                            return false;
                        }).map((item: any) => item.fileName);
                    }
                    
                    console.log('Found template CSS files:', templateCssFiles);
                    
                    // 生成CSS链接标签
                    const cssLinks = templateCssFiles.map(cssFile => {
                        const rel = path.posix.relative(htmlDir, cssFile).replace(/\\/g, '/');
                        const href = rel.startsWith('.') ? rel : './' + rel;
                        return `<link rel="stylesheet" href="${href}">`;
                    }).join('\n');

                    console.log('Generated CSS links:', cssLinks);

                    // 生成处理后的HTML内容
                    let processedTemplate = template
                        .replace('{{ content }}', adjustedPostHtml)
                        .replace('{{ toc_json }}', `<script id="toc-json" type="application/json">${JSON.stringify(toc)}</script>`);

                    // 替换或插入CSS链接
                    if (cssLinks) {
                        if (/<link\s+rel=["']stylesheet["'][^>]*>/i.test(processedTemplate)) {
                            // 替换现有的stylesheet链接
                            processedTemplate = processedTemplate.replace(
                                /<link\s+rel=["']stylesheet["'][^>]*>/gi, 
                                cssLinks
                            );
                        } else {
                            // 在</head>前插入CSS链接
                            processedTemplate = processedTemplate.replace('</head>', `${cssLinks}\n</head>`);
                        }
                    }

                    // 处理JS文件引用
                    processedTemplate = transformTemplate(processedTemplate, entryChunk, bundle, htmlOutputPath);

                    console.log('Final HTML head section:', processedTemplate.match(/<head>[\s\S]*?<\/head>/)?.[0]);

                    // 生成HTML文件
                    this.emitFile({
                        type: 'asset',
                        fileName: htmlOutputPath,
                        source: processedTemplate
                    });
                }
            }
        },

        handleHotUpdate({ file, server }) {
            const postsDir = path.resolve(projectRoot, 'src/_post');
            if (file.startsWith(postsDir)) {
                server.ws.send({ type: 'full-reload', path: '*' });
            }
        },
    };
}