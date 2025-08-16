// 该文件AI参与度高

import { createRequire } from 'module';const require = createRequire(import.meta.url);
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import mdAnchor from 'markdown-it-anchor';
const mdKatex = require('@vscode/markdown-it-katex'); // import mdKatex from '@vscode/markdown-it-katex';

interface toc_item {
    text: string;
    slug: string;
    children: toc_item[] | null;
};
interface flat_toc_item {
    level: number;
    text: string;
    slug: string;
};

const md = new MarkdownIt({
    html: true,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
            } catch (__) {};
        };
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

md.renderer.rules.hr = () => '<mdui-divider></mdui-divider>\n';
md.use(mdKatex.default);
md.use(mdAnchor, {
    level: [1, 2, 3, 4, 5, 6],
    slugify: (s: string) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')),
});

function buildTocTree(flatToc: flat_toc_item[]): toc_item[] {
    const toc: toc_item[] = [];
    const parentStack: toc_item[] = [];
    let lastItem: toc_item | null = null;
    flatToc.forEach(item => {
        const newItem: toc_item = {
            text: item.text,
            slug: item.slug,
            children: [],
        };
        const currentLevel = item.level;
        const lastLevel = lastItem ? flatToc.find(i => i.slug === lastItem!.slug)!.level : 0;
        if (currentLevel > lastLevel) {
            if (lastItem) {
                parentStack.push(lastItem);
            };
        } else if (currentLevel < lastLevel) {
            while (parentStack.length) {
                const parent = parentStack[parentStack.length - 1];
                const parentLevel = flatToc.find(i => i.slug === parent.slug)!.level;
                if (currentLevel > parentLevel) break;
                parentStack.pop();
            };
        };
        const parent = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;
        if (parent) {
            parent.children!.push(newItem);
        } else {
            toc.push(newItem);
        };
        lastItem = newItem;
    });
    const cleanEmptyChildren = (items: toc_item[]) => {
        items.forEach(item => {
            if (item.children?.length === 0) {
                item.children = null;
            } else if (item.children) {
                cleanEmptyChildren(item.children);
            };
        });
    };
    cleanEmptyChildren(toc);
    return toc;
};

export function processMarkdown(mdPath: string) {
    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    const env = {};
    const tokens = md.parse(mdContent, env);
    const flat_toc: flat_toc_item[] = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === 'heading_open') {
            const headingTextToken = tokens[i + 1];
            const slug = token.attrGet('id');
            if (headingTextToken && headingTextToken.type === 'inline' && slug) {
                flat_toc.push({
                    level: parseInt(token.tag.substring(1), 10),
                    text: headingTextToken.content,
                    slug: slug,
                });
            };
        };
    };
    const toc = buildTocTree(flat_toc);
    const html = md.renderer.render(tokens, md.options, env);
    return { html, toc };
};