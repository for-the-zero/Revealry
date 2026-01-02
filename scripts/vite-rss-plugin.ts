// 该文件AI参与度高
// This file has a high AI participation rate.

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
interface MetaItem { 
    path: string; 
    title: string;
    description?: string;
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
        let timezoneOffset;
        if (year < 1970) {
            timezoneOffset = '+0800';
        } else {
            const timezoneOffsetMinutes = -date.getTimezoneOffset();
            const offsetSign = timezoneOffsetMinutes >= 0 ? '+' : '-';
            const offsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60).toString().padStart(2, '0');
            const offsetMinutes = (Math.abs(timezoneOffsetMinutes) % 60).toString().padStart(2, '0');
            timezoneOffset = `${offsetSign}${offsetHours}${offsetMinutes}`;
        };
        return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${timezoneOffset}`;
    };
    const extractDescriptionFromMarkdown = (mdContent: string): string => {
        const content = mdContent.replace(/^---[\s\S]*?---/, '');
        const firstParagraph = content.split('\n\n').find(p => p.trim().length > 0);
        if (firstParagraph) {
            return firstParagraph
                .replace(/^#+\s*/, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .trim()
                .substring(0, 200) + (firstParagraph.length > 200 ? '...' : '');
        };
        return '';
    };
    return {
        name: 'vite-rss-feed',
        apply: 'build',
        configResolved(c) { config = c; },
        closeBundle() {
            const root = path.resolve(__dirname, '..');
            const outDir = path.resolve(root, 'dist');
            const blogList: BlogItem[] = loadYaml(path.join(root, 'src/_configs/blog.yaml')) ?? [];
            const feedItems: Array<{
                title: string;
                link: string;
                description: string;
                pubDate: Date;
                author?: string;
                guid: string;
            }> = [];
            for (const it of blogList) {
                if (!it.filename) continue;
                const mdFile = path.join(root, `posts/${it.filename}.md`);
                if (!fs.existsSync(mdFile)) continue;
                let date: Date;
                if (it.date) {
                    const dateStr = it.date.trim();
                    const parsedDate = new Date(dateStr.replace(' ', 'T'));
                    date = isNaN(parsedDate.getTime()) ? (gitTime(mdFile) ?? fs.statSync(mdFile).ctime) : parsedDate;
                } else {
                    date = gitTime(mdFile) ?? fs.statSync(mdFile).ctime;
                };
                const mdContent = fs.readFileSync(mdFile, 'utf-8');
                const description = it.description || extractDescriptionFromMarkdown(mdContent);
                feedItems.push({
                    title: it.title || it.filename,
                    link: `${hostname.replace(/\/$/, '')}/blog/posts/${it.filename}/`,
                    description,
                    pubDate: date,
                    author: it.author || author,
                    guid: it.filename
                });
            };
            feedItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
            const lines: string[] = [];
            lines.push('<?xml version="1.0" encoding="UTF-8"?>');
            lines.push('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
            lines.push('<channel>');
            lines.push(`  <title>${feedTitle}</title>`);
            lines.push(`  <link>${hostname.replace(/\/$/, '')}</link>`);
            lines.push(`  <description>${feedDescription}</description>`);
            if (copyright) lines.push(`  <copyright>${copyright}</copyright>`);
            lines.push(`  <atom:link href="${hostname.replace(/\/$/, '')}/rss.xml" rel="self" type="application/rss+xml" />`);
            for (const item of feedItems) {
                lines.push('  <item>');
                lines.push(`    <title><![CDATA[${item.title}]]></title>`);
                lines.push(`    <link>${item.link}</link>`);
                lines.push(`    <guid>${item.guid}</guid>`);
                lines.push(`    <description><![CDATA[${item.description}]]></description>`);
                lines.push(`    <pubDate>${formatRfc822Date(item.pubDate)}</pubDate>`);
                if (item.author) lines.push(`    <author>${item.author}</author>`);
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