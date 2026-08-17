import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const excluded = new Set(['.git', '.idea', 'dist', 'node_modules', 'playwright-report', 'test-results']);
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.mjs', '.svg', '.txt', '.xml', '.yml']);

const collect = async (directory) => {
  const files = [];
  for (const name of await readdir(directory)) {
    if (excluded.has(name)) continue;
    const path = resolve(directory, name);
    if ((await stat(path)).isDirectory()) files.push(...await collect(path));
    else if (textExtensions.has(extname(path))) files.push(path);
  }
  return files;
};

const failures = [];
for (const file of await collect(root)) {
  if (file.endsWith('package-lock.json')) continue;
  const text = await readFile(file, 'utf8');
  if (!text.endsWith('\n')) failures.push(`${file}: missing final newline`);
  text.split(/\r?\n/).forEach((line, index) => {
    if (/[ \t]+$/.test(line)) failures.push(`${file}:${index + 1}: trailing whitespace`);
  });
}

if (failures.length) throw new Error(`Formatting check failed:\n${failures.join('\n')}`);
process.stdout.write('Formatting check passed.\n');
