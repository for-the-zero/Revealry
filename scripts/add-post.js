// AI参与度高 / high AI participation rate

import fs from 'fs';
import path from 'path';

const contentToPrepend = `- title: ''
  category: ''
  tags: null
  filename: ''
  allow_lang:
  - zh-CN
  - en
  date: '${new Date(2026, 0, 1).toLocaleDateString()}'
  desc: ''
`;

try {
    const originalContent = fs.readFileSync(path.join(__dirname, '../src/_configs/blog.yaml'), 'utf8');
    fs.writeFileSync(path.join(__dirname, '../src/_configs/blog.yaml'), contentToPrepend + originalContent);
    console.log('Done');
} catch (err) {
    console.error('Error:', err);
};