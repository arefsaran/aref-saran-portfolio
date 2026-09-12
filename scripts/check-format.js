import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

const roots = ['src', 'scripts', 'tests', 'public', 'server.js', 'package.json', 'README.md', 'VERIFICATION.md'];
const supported = new Set(['.js', '.mjs', '.ejs', '.css', '.json', '.md']);
const files = [];
function collect(entry) {
  const stat = statSync(entry);
  if (stat.isDirectory()) {
    for (const name of readdirSync(entry)) collect(`${entry}/${name}`);
  } else if (supported.has(extname(entry))) files.push(entry);
}
for (const root of roots) collect(root);

const failures = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (!text.endsWith('\n')) failures.push(`${file}: missing final newline`);
  text.split('\n').forEach((line, index) => {
    if (/[ \t]+$/.test(line)) failures.push(`${file}:${index + 1}: trailing whitespace`);
  });
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Formatting guard passed for ${files.length} files.`);
