import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function run(cmd, cwd) {
    console.log(`> ${cmd}`);
    execSync(cmd, { cwd, stdio: 'inherit' });
};
const now = new Date();
const cmt_msg = `Site updated: ${new Date().toLocaleString('en-CA', { hour12: false }).replace(',', '')}`;

console.log('[LOG] 开始构建...');
run('npm run build', process.cwd());
console.log('[LOG] 构建完成');

const dist_dir = path.resolve('dist');
if (!fs.existsSync(dist_dir)) {
    console.error('[ERR] dist 目录不存在');
    process.exit(1);
};
if (!fs.existsSync(path.join(dist_dir, '.git'))) {
    if (!fs.existsSync(path.resolve('src/_configs/global.yaml'))) {
        console.error('[ERR] src/_configs/global.yaml 不存在');
        process.exit(1);
    };
    const config = yaml.load(fs.readFileSync(path.resolve('src/_configs/global.yaml'), 'utf8'));
    const repo_name = config?.repo;
    if (!repo_name) {
        console.error('[ERR] global.yaml 中缺少 repo ');
        process.exit(1);
    };
    run('git init', dist_dir);
    run(`git remote add origin ${repo_name}`, dist_dir);
    console.log(`[LOG] 仓库初始化完成`);
};


run('git add .', dist_dir);
try {
    run(`git commit -m "${cmt_msg}"`, dist_dir);
} catch (e) {
    console.log('[WRN] 提交报错');
};
try {
    run('git push -u origin master --force', dist_dir);
} catch {
    console.log('[WRN] 上传报错');
};

console.log('[LOG] 部署完成');