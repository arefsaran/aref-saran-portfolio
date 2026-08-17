import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import portfolio from '../content/portfolio.mjs';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
const requiredFiles = ['index.html', 'styles.css', 'script.js', 'theme-init.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'og-card.jpg', 'assets/aref-saran-profile.webp', 'assets/aref-saran-profile.png'];
const missing = requiredFiles.filter((file) => !existsSync(resolve(output, file)));
if (missing.length) throw new Error(`Missing production files: ${missing.join(', ')}`);

const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) throw new Error(`Duplicate HTML ids: ${[...new Set(duplicates)].join(', ')}`);

const internalLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const missingTargets = internalLinks.filter((target) => !ids.includes(target));
if (missingTargets.length) throw new Error(`Internal links without targets: ${[...new Set(missingTargets)].join(', ')}`);

const jsonLd = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)?.[1];
if (!jsonLd) throw new Error('Missing Person JSON-LD.');
const person = JSON.parse(jsonLd);
if (person['@type'] !== 'Person' || person.name !== portfolio.profile.name) throw new Error('Person JSON-LD does not match the content model.');

const executableInlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>(.*?)<\/script>/gs)].filter((match) => match[1].trim());
if (executableInlineScripts.length) throw new Error('Executable inline script found; production CSP requires external scripts.');
if (!html.includes(`content="${portfolio.site.title}"`) || !html.includes(`content="${new URL(portfolio.site.socialImage, portfolio.site.url).href}"`)) throw new Error('Social metadata does not match the content model.');
if (!html.includes('Portfolio visualization · not live infrastructure')) throw new Error('Quality signal disclosure is missing.');

const oversized = requiredFiles.filter((file) => statSync(resolve(output, file)).size > 1_000_000);
if (oversized.length) throw new Error(`Production assets exceed 1 MB: ${oversized.join(', ')}`);

new Function(readFileSync(resolve(output, 'theme-init.js'), 'utf8'));
new Function(readFileSync(resolve(output, 'script.js'), 'utf8'));
process.stdout.write(`Production build verified: ${requiredFiles.length} required files, ${ids.length} unique ids, structured data, links, scripts, and asset budgets.\n`);
