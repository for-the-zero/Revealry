// 该文件AI参与度高
// This file has a high AI participation rate.

import type { Plugin } from 'vite';

interface ViteExtendHeadOptions {
    heads?: string[];
    home?: string[];
};

export function viteExtendHead(options: ViteExtendHeadOptions): Plugin {
    const { heads = [], home = [] } = options;
    return {
        name: 'vite-plugin-vite-extend-head',
        transformIndexHtml(html: string, { path }) {
            let tagsToInject = [...heads];
            if (path === '/index.html') {
                tagsToInject.push(...home);
            };
            if (tagsToInject.length === 0) {
                return html;
            };
            const headEndIndex = html.lastIndexOf('</head>');
            if (headEndIndex === -1) {
                return html;
            };
            const beforeHeadTag = html.substring(0, headEndIndex);
            const isHeadTagOnFirstLine = !beforeHeadTag.includes('\n');
            let injectionString: string;
            if (isHeadTagOnFirstLine) {
                injectionString = tagsToInject.join('');
            } else {
                injectionString = tagsToInject.join('\n') + '\n';
            };
            const finalHtml =
                html.slice(0, headEndIndex) + injectionString + html.slice(headEndIndex);
            return finalHtml;
        },
    };
};