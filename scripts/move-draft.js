// 该文件AI参与度高
// This file has a high AI participation rate.

import fs from 'fs';
import path from 'path';

const sourceDir = 'posts/_draft';
const targetDir = 'posts';
const sourceImgDir = path.join(sourceDir, 'img');
const targetImgDir = path.join(targetDir, 'img');

function ensureDirExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    };
};

function moveFile(src, dest) {
    ensureDirExists(path.dirname(dest));
    if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
    };
    fs.renameSync(src, dest);
};

function moveFiles(source, target) {
    if (!fs.existsSync(source)) {
        return;
    };
    ensureDirExists(target);
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const srcPath = path.join(source, file);
        const destPath = path.join(target, file);
        const stat = fs.statSync(srcPath);
        if (stat.isFile()) {
            moveFile(srcPath, destPath);
        };
    });
};

function main() {
    console.log('Moving drafts to posts directory...');
    moveFiles(sourceDir, targetDir);
    moveFiles(sourceImgDir, targetImgDir);
    console.log('Drafts moved successfully.');
};

main();
