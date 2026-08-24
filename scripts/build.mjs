import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { basename, resolve, sep } from 'node:path';
import { renderPage } from '../src/render-page.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const outputDirectory = resolve(projectRoot, 'dist');
if (!outputDirectory.startsWith(`${projectRoot}${sep}`) || basename(outputDirectory) !== 'dist') {
  throw new Error(`Refusing to clean unexpected output path: ${outputDirectory}`);
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const files = ['styles.css', 'script.js', 'theme-init.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'og-card-senior.jpg'];
await Promise.all(files.map((file) => cp(resolve(projectRoot, file), resolve(outputDirectory, file))));
await cp(resolve(projectRoot, 'assets'), resolve(outputDirectory, 'assets'), { recursive: true });
await writeFile(resolve(outputDirectory, 'index.html'), renderPage(), 'utf8');

const collect = async (directory, prefix = '') => {
  const entries = await readdir(directory);
  const output = [];
  for (const entry of entries) {
    const absolute = resolve(directory, entry);
    const relative = prefix ? `${prefix}/${entry}` : entry;
    if ((await stat(absolute)).isDirectory()) output.push(...await collect(absolute, relative));
    else output.push(relative);
  }
  return output;
};

const outputFiles = await collect(outputDirectory);
process.stdout.write(`Production build created dist/ with ${outputFiles.length} files.\n`);
