import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const requiredFiles = ['index.html', 'styles.css', 'script.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'og-card-v2.png', 'assets/aref-saran-profile.webp'];
const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) throw new Error(`Missing required site files: ${missing.join(', ')}`);

const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const requiredMarkers = ['id="main"', 'id="work"', 'id="help"', 'id="quality-system"', 'id="lab"', 'id="experience"', 'id="about"', 'id="contact"', 'application/ld+json'];
const missingMarkers = requiredMarkers.filter((marker) => !html.includes(marker));
if (missingMarkers.length) throw new Error(`Missing required content markers: ${missingMarkers.join(', ')}`);

new Function(readFileSync(resolve(root, 'script.js'), 'utf8'));
console.log(`Static build check passed: ${requiredFiles.length} assets and ${requiredMarkers.length} content markers verified.`);
