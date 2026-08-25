import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import portfolio from '../content/portfolio.mjs';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
const requiredFiles = ['index.html', 'styles.css', 'script.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'og-card-senior.jpg', 'assets/aref-saran-profile.webp', 'assets/aref-saran-profile.png'];
const missing = requiredFiles.filter((file) => !existsSync(resolve(output, file)));
if (missing.length) throw new Error(`Missing production files: ${missing.join(', ')}`);
if (existsSync(resolve(output, 'theme-init.js')) || existsSync(resolve(root, 'theme-init.js'))) throw new Error('Removed theme initializer is still present.');

const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const css = readFileSync(resolve(output, 'styles.css'), 'utf8');
const javascript = readFileSync(resolve(output, 'script.js'), 'utf8');
const sitemap = readFileSync(resolve(output, 'sitemap.xml'), 'utf8');
const robots = readFileSync(resolve(output, 'robots.txt'), 'utf8');
const dockerfile = readFileSync(resolve(root, 'Dockerfile'), 'utf8');

const dockerInputs = ['content', 'src', 'scripts', 'assets', 'styles.css', 'script.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', portfolio.site.socialImage];
const missingDockerInputs = dockerInputs.filter((input) => !dockerfile.includes(input));
if (missingDockerInputs.length) throw new Error(`Dockerfile does not include production build inputs: ${missingDockerInputs.join(', ')}`);

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) throw new Error(`Duplicate HTML ids: ${[...new Set(duplicates)].join(', ')}`);

const internalLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const missingTargets = internalLinks.filter((target) => !ids.includes(target));
if (missingTargets.length) throw new Error(`Internal links without targets: ${[...new Set(missingTargets)].join(', ')}`);

const jsonLd = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)?.[1];
if (!jsonLd) throw new Error('Missing structured data.');
const structuredData = JSON.parse(jsonLd);
const graph = structuredData['@graph'];
if (!Array.isArray(graph)) throw new Error('Structured data must use an @graph.');
const person = graph.find((item) => item['@type'] === 'Person');
const profilePage = graph.find((item) => item['@type'] === 'ProfilePage');
const website = graph.find((item) => item['@type'] === 'WebSite');
if (person?.name !== portfolio.profile.name || person?.jobTitle !== portfolio.profile.role) throw new Error('Person JSON-LD does not match the content model.');
if (!profilePage || !website) throw new Error('ProfilePage or WebSite structured data is missing.');

const executableInlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>(.*?)<\/script>/gs)].filter((match) => match[1].trim());
if (executableInlineScripts.length) throw new Error('Executable inline script found; production CSP requires external scripts.');
if (!html.includes(`content="${portfolio.site.title}"`) || !html.includes(`content="${new URL(portfolio.site.socialImage, portfolio.site.url).href}"`)) throw new Error('Social metadata does not match the content model.');
if (!sitemap.includes(`<loc>${portfolio.site.url}</loc>`) || !sitemap.includes(`<lastmod>${portfolio.site.lastModified}</lastmod>`)) throw new Error('Sitemap does not match the site content model.');
if (!robots.includes(new URL('sitemap.xml', portfolio.site.url).href)) throw new Error('robots.txt does not advertise the canonical sitemap.');

for (const requiredCopy of ['Senior Test Engineer', 'I engineer confidence into complex software.', '39 hours became a two-hour signal.', 'From risk to a release decision.']) {
  if (!html.includes(requiredCopy)) throw new Error(`Required positioning is missing: ${requiredCopy}`);
}

const majorAreas = [...html.matchAll(/<section[^>]*class="[^"]*\bmajor-area\b[^"]*"/g)];
if (majorAreas.length !== 7) throw new Error(`Expected seven major portfolio areas, found ${majorAreas.length}.`);
if ((html.match(/class="case-study(?:\s|"|$)/g) ?? []).length !== 3) throw new Error('Expected exactly three primary case studies.');

const removedThemeTokens = ['data-theme=', 'data-theme-source', 'data-theme-toggle', 'theme-toggle', 'theme-init.js', 'aref-theme', 'prefers-color-scheme: dark'];
for (const token of removedThemeTokens) {
  if (`${html}\n${css}\n${javascript}`.includes(token)) throw new Error(`Removed theme infrastructure remains: ${token}`);
}

const budgets = {
  'index.html': 100_000,
  'styles.css': 90_000,
  'script.js': 25_000,
  'assets/aref-saran-profile.webp': 100_000,
  'og-card-senior.jpg': 250_000
};
const overBudget = Object.entries(budgets)
  .filter(([file, limit]) => statSync(resolve(output, file)).size > limit)
  .map(([file, limit]) => `${file} > ${limit} bytes`);
if (overBudget.length) throw new Error(`Production asset budget exceeded: ${overBudget.join(', ')}`);

new Function(javascript);
process.stdout.write(`Production build verified: ${requiredFiles.length} required files, seven major areas, three case studies, ${ids.length} unique ids, structured data, Docker inputs, links, scripts, and asset budgets.\n`);
