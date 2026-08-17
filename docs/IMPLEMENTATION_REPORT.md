# Portfolio Implementation Report

## Result

The repository now builds a complete, evidence-led Quality Engineering portfolio from structured content into a deterministic static production artifact. The implementation preserves the appropriate framework-free browser architecture while adding a maintainable content/component layer, full requested information architecture, both-theme accessibility, performance evidence, hardened Nginx delivery, and GitLab/Hamravesh readiness.

The central positioning is consistent throughout: make complex software safer to change, faster to validate, and easier to trust through quality architecture, automation, risk-based testing, and fast engineering feedback.

## Delivered scope

- Outcome-led hero with real work/contact routes, public profile links, supplied portrait, and verified proof.
- Disclosed quality-signal visualization that does not imply live production telemetry.
- Proof strip for 2,300+ checks, 39h → 2h regression feedback, ≈95% reduction, and four validation layers.
- Four problem → intervention → outcome capability cards.
- Four privacy-safe case studies with context, problem, constraints, diagnosis, engineering decision, implementation, quality safeguards, outcome, and lessons.
- Nine-stage Quality System.
- Seven-stage deterministic Release Confidence Lab with explicit state, progress, evidence, and release decision.
- Five quality-engineering principles, outcome-grouped capabilities, privacy-aware experience, about, and contact sections.
- OS-aware and persistent manual light/dark themes without an inline-script policy exception.
- Canonical/social metadata, Person JSON-LD, robots, sitemap, favicon, and role-accurate social card.
- Deterministic `dist/` build, asset budgets, GitHub and GitLab quality pipelines, and multi-stage Docker/Nginx delivery.

## Architecture

`content/portfolio.mjs` is the factual source of truth. Pure functions in `src/components.mjs` render sections, while `src/render-page.mjs` composes the document and metadata. `scripts/build.mjs` removes only the validated project `dist/` path, writes generated HTML, and copies the allow-listed static assets.

The browser receives 31.1 KiB of HTML, 35.7 KiB of CSS, 6.7 KiB of progressive JavaScript, a 640-byte pre-paint theme initializer, and local media. There is no client framework, dependency bundle, API, database, authentication, analytics, remote font, or third-party request.

The primary portrait is delivered as a 40,718-byte WebP with a 756,960-byte PNG fallback. The generated social card is a 135,708-byte 1200 × 630 JPEG. Build validation rejects required assets above 1 MB.

## Image generation

The stale social previews were replaced with one new role-accurate card generated from the supplied portrait. The production asset is `og-card.jpg`; the original generated PNG is retained outside the repository at:

`C:\Users\a.saran\.codex\generated_images\01a00ecb-c3a8-7f60-9f43-4d4884abd544\exec-6e8a6377-942a-4c92-9263-630308bc86f4.png`

Final generation prompt:

> Use case: ads-marketing; professional OG 1200×630; real portrait identity; warm off-white + navy grid + cobalt lines + green status; exact text `AREF SARAN`, `QUALITY ENGINEER`, `Engineering confidence into complex software.`; AS mark; no extra copy, company, metrics, logos, watermark; avoid gradients/pastel/cyberpunk/terminal/fake charts.

The output was resized to exactly 1200 × 630 and encoded as JPEG quality 90 without changing its composition.

## Accessibility and responsive verification

The site provides semantic regions, one H1 and logical H2/H3 progression, a skip link, visible focus, native disclosure controls, accessible progress state, menu state, live lab results, decorative-content hiding, 44 px control targets, meaningful image alternative text, and reduced-motion behavior.

The final Playwright suite passed all 16 tests in 30.7 seconds. It verifies:

- hero content, assets, runtime errors, and absence of third-party requests;
- internal targets, calls to action, and safe external-link relationships;
- all seven lab stages and the explicit decision state;
- keyboard mobile navigation and keyboard case-study disclosures;
- OS theme preference, manual override, and persistence;
- no horizontal overflow at 320, 375, 768, 1024, 1440, and 1920 px;
- reduced-motion content and lab behavior;
- one H1, heading order, unique IDs, and valid Person JSON-LD;
- zero automatically detectable WCAG A/AA violations in both light and dark modes using the installed axe WCAG 2.0/2.1/2.2 tags.

Manual browser QA confirmed the desktop and 375 px mobile compositions, light/dark presentation, mobile menu state, final seven-stage lab state, top-level disclosures, and an empty warning/error console.

## Lighthouse measurement

Lighthouse 13.4.1 ran against the generated production site on localhost with mobile emulation and headless Chrome 151.

| Category or metric | Result |
| --- | ---: |
| Performance | 96 / 100 |
| Accessibility | 100 / 100 |
| Best Practices | 100 / 100 |
| SEO | 100 / 100 |
| First Contentful Paint | 2.1 s |
| Largest Contentful Paint | 2.2 s |
| Speed Index | 2.8 s |
| Total Blocking Time | 50 ms |
| Cumulative Layout Shift | 0 |
| Time to Interactive | 2.2 s |
| Requests | 6 |
| Transferred | 115 KiB |

INP is not produced by a local Lighthouse lab run because it requires interaction/field data. Total Blocking Time is recorded as the available lab responsiveness proxy; no field-data claim is made.

Lighthouse wrote a valid JSON report. Its Windows temp-profile cleanup returned an `EPERM` warning after the report was complete; the spawned headless browser processes exited, and the report parsed normally.

## Build, CI, and deployment verification

The production build contains 10 allow-listed files and passed checks for manifest completeness, 27 unique IDs, internal links, executable inline scripts, Person structured data, social metadata, visualization disclosure, JavaScript syntax, and asset budgets.

GitHub Actions and GitLab CI run formatting, syntax, production-build, and Playwright gates. GitLab retains `dist/`, `playwright-report/`, and `test-results/` for seven days.

The multi-stage Docker image was built successfully as `aref-saran-portfolio:qa` with Node 24 Alpine generating `dist/` and Nginx 1.28 Alpine serving only that artifact. A temporary container returned HTTP 200 and the expected title on port 8080. Verification confirmed:

- gzip for CSS;
- HTML `Cache-Control: no-cache`;
- CSS/JS one-week cache lifetime;
- image 30-day cache lifetime;
- Content Security Policy without `unsafe-inline`;
- HSTS, referrer, permissions, COOP, CORP, frame, and MIME-sniffing protections.

The temporary QA container was stopped and automatically removed after verification. No production, GitLab, DNS, or Hamravesh state was changed.

## Exact verification commands

```bash
npm ci
npm run format:check
npm run lint
npm run build
npm test
npx playwright test --workers=1 --grep "WCAG"
npx --yes lighthouse http://127.0.0.1:4173/ --output=json --only-categories=performance,accessibility,best-practices,seo
docker build --tag aref-saran-portfolio:qa .
docker run --detach --rm --name aref-saran-portfolio-qa -p 127.0.0.1:8080:80 aref-saran-portfolio:qa
curl --head --header "Accept-Encoding: gzip" http://127.0.0.1:8080/styles.css
docker stop aref-saran-portfolio-qa
```

`npm test` initially could not spawn Chromium inside the filesystem sandbox and was rerun with approved local browser-process access. The first expanded run then exposed an ambiguous test selector, excessive local worker concurrency, and theme-token contrast leaks. Those causes were corrected before the final 16/16 pass.

## Security and privacy review

- No secrets, credentials, private endpoints, private repositories, client names, or production data are present.
- External links use `noopener noreferrer`; email is the only contact submission path.
- No form data, cookies, trackers, analytics, remote fonts, or third-party runtime requests exist.
- Executable inline scripts are prohibited by the build check and CSP.
- Nginx serves only the generated production artifact and hides its version.
- The deterministic lab explicitly states that it does not contact real systems.

## Remaining limitations

1. Real INP and other field performance data require traffic on the deployed HTTPS site; this implementation reports lab results only.
2. The current public résumé was not supplied, so the site accurately offers it by email instead of publishing an unverified artifact.
3. The repository and image are Hamravesh-ready, but no external production deployment, DNS change, or GitLab push was performed because no project URL/credentials or explicit release action was supplied.
