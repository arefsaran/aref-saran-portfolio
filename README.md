# Aref Saran — Quality Engineering Portfolio

Production-ready static portfolio for `arefsaran.ir`. The site positions Aref as a Quality Engineer who helps teams make complex software safer to change, faster to validate, and easier to trust.

## Architecture

The portfolio intentionally stays framework-free: semantic HTML, one CSS design system, and a small progressive-enhancement script. There is no authentication, API, database, CMS, analytics, remote font, or third-party runtime request.

- `index.html` — content, semantic structure, SEO metadata, and Person structured data
- `styles.css` — responsive Engineering Editorial × Quality Control System design tokens and components
- `script.js` — theme persistence, navigation, scroll/reveal behavior, and deterministic release lab
- `tests/portfolio.spec.mjs` — Playwright smoke, interaction, responsive, reduced-motion, and axe checks
- `tests/build-check.mjs` — static production-file and content-marker validation
- `nginx.conf` / `Dockerfile` — production container and security headers
- `docs/` — audit, design system, and implementation report

## Local development

```bash
npm install
npm run serve
```

Open `http://127.0.0.1:4173`.

## Quality checks

```bash
npm run build
npm test
```

The Playwright suite uses the installed Chrome browser and covers the hero, primary navigation, release-confidence lab, theme persistence, keyboard-friendly mobile navigation, reduced motion, responsive overflow, and automated WCAG A/AA checks.

## Deployment

The site can be served directly by Nginx or built into the included Docker image:

```bash
docker build -t aref-saran-portfolio .
docker run --rm -p 8080:80 aref-saran-portfolio
```

The canonical public URL is `https://arefsaran.ir/`. `robots.txt`, `sitemap.xml`, Open Graph metadata, Twitter metadata, and a `Person` JSON-LD record are maintained in the root page.

## Content and privacy

Professional claims are based on the supplied repository content and master directive. The current employer remains unnamed, client identifiers and private implementation details are excluded, and the résumé is offered by email rather than published until its public wording is current.

When editing content, preserve the verified metrics and do not add employers, customer names, confidential endpoints, private repositories, certifications, testimonials, awards, or unsupported performance claims.
