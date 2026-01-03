// 该文件已修复 RSS 规范性问题与路径解析逻辑
// Fixed RSS specification issues and path resolution logic.

import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import type { Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

interface BlogItem { 
    filename: string; 
    title?: string; 
    date?: string;
    description?: string;
    author?: string;
};

interface FeedItem {
    title: string;
    link: string;
    description: string;
    pubDate: Date;
    author?: string;
    guid: string;
};

const gitTime = (file: string, root: string): Date | null => {
    try {
        const t = execSync(`git log --diff-filter=A --follow --format=%at -- "${file}" | tail -1`, {
            encoding: 'utf8',
            cwd: root,
        }).trim();
        return t ? new Date(Number(t) * 1000) : null;
    } catch { return null; };
};
const formatRfc822Date = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timezoneOffsetMinutes = -date.getTimezoneOffset();
    const offsetSign = timezoneOffsetMinutes >= 0 ? '+' : '-';
    const offsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60).toString().padStart(2, '0');
    const offsetMinutes = (Math.abs(timezoneOffsetMinutes) % 60).toString().padStart(2, '0');
    const timezoneOffset = `${offsetSign}${offsetHours}${offsetMinutes}`;
    return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${timezoneOffset}`;
};
/**
 * 从 Markdown 中提取纯文本描述，并修复相对资源路径为公共 img 目录
 */
const extractDescriptionFromMarkdown = (content: string, postBaseUrl: string): string => {
    const baseHost = postBaseUrl.split('/blog/posts/')[0]; 
    const imageRoot = `${baseHost}/blog/posts/img/`; 
    content = content.replace(/!\[(.*?)\]\((?!http)(.*?)\)/g, (match, alt, src) => {
        const fileName = src.split('/').pop();
        if (fileName) {
            const absoluteSrc = `${imageRoot}${fileName}`;
            return `![${alt}](${absoluteSrc})`;
        };
        return match;
    });
    const firstParagraph = content.split('\n\n').find(p => p.trim().length > 0);
    if (firstParagraph) {
        return firstParagraph
            .replace(/^#+\s*/gm, '') 
            .replace(/---/g, '')     
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/<[^>]*>/g, '') 
            .trim()
            .substring(0, 300) + (firstParagraph.length > 300 ? '...' : '');
    };
    return '';
};

export function viteRssFeed(opts: {
    hostname: string;
    feedTitle: string;
    feedDescription: string;
    copyright?: string;
    author?: string;
}): Plugin {
    let config: ResolvedConfig;
    const { hostname, feedTitle, feedDescription, copyright, author } = opts;
    const baseHost = hostname.replace(/\/$/, '');
    return {
        name: 'vite-rss-feed',
        apply: 'build',
        configResolved(c) { config = c; },
        closeBundle() {
            const root = path.resolve(process.cwd());
            const outDir = path.resolve(root, 'dist');
            const blogListFile = path.join(root, 'src/_configs/blog.yaml');
            if (!fs.existsSync(blogListFile)) return;
            const blogList = yaml.load(fs.readFileSync(blogListFile, 'utf-8')) as BlogItem[] ?? [];
            const feedItems: FeedItem[] = [];
            for (const it of blogList) {
                if (!it.filename) continue;
                const mdFile = path.join(root, `posts/${it.filename}.md`);
                if (!fs.existsSync(mdFile)) continue;
                const mdContent = fs.readFileSync(mdFile, 'utf-8');
                const postUrl = `${baseHost}/blog/posts/${it.filename}/`;
                let date: Date;
                if (it.date) {
                    const dateStr = it.date.trim().replace(' ', 'T');
                    const parsedDate = new Date(dateStr);
                    date = isNaN(parsedDate.getTime()) ? (gitTime(mdFile, root) ?? fs.statSync(mdFile).ctime) : parsedDate;
                } else {
                    date = gitTime(mdFile, root) ?? fs.statSync(mdFile).ctime;
                };
                feedItems.push({
                    title: it.title || it.filename,
                    link: postUrl,
                    description: it.description || extractDescriptionFromMarkdown(mdContent, postUrl),
                    pubDate: date,
                    author: it.author || author,
                    guid: it.filename
                });
            };
            feedItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
            const lines: string[] = [];
            lines.push('<?xml version="1.0" encoding="UTF-8"?>');
            lines.push('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">');
            lines.push('<channel>');
            lines.push(`  <title>${feedTitle}</title>`);
            lines.push(`  <link>${baseHost}</link>`);
            lines.push(`  <description>${feedDescription}</description>`);
            if (copyright) lines.push(`  <copyright>${copyright}</copyright>`);
            lines.push(`  <atom:link href="${baseHost}/rss.xml" rel="self" type="application/rss+xml" />`);
            for (const item of feedItems) {
                lines.push('  <item>');
                lines.push(`    <title><![CDATA[${item.title}]]></title>`);
                lines.push(`    <link>${item.link}</link>`);
                lines.push(`    <guid isPermaLink="false">${item.guid}</guid>`);
                lines.push(`    <description><![CDATA[${item.description}]]></description>`);
                lines.push(`    <pubDate>${formatRfc822Date(item.pubDate)}</pubDate>`);
                if (item.author) lines.push(`    <dc:creator>${item.author}</dc:creator>`);
                lines.push('  </item>');
            };
            lines.push('</channel>');
            lines.push('</rss>');
            const file = path.join(outDir, 'rss.xml');
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, lines.join('\n'), 'utf-8');
            console.log(`[rss-feed] rss.xml generated at ${file}`);
        },
    };
};