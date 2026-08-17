# Aref Saran — Quality Engineering Portfolio

Production portfolio for [arefsaran.ir](https://arefsaran.ir/). It positions Aref Saran as a Quality Engineer and Test Automation & Quality Systems Engineer who makes complex software safer to change, faster to validate, and easier to trust.

The implementation is intentionally static: structured JavaScript content is rendered to semantic HTML at build time, CSS supplies the complete responsive design system, and a small progressive-enhancement script handles themes, navigation, reveals, and the deterministic Release Confidence Lab. The public site has no framework runtime, API, database, CMS, analytics, remote font, or third-party request.

## Local setup

Requirements: Node.js 24+ and npm. Chrome or Playwright Chromium is required for browser tests.

```bash
npm ci
npx playwright install chromium
npm run serve
```

Open `http://127.0.0.1:4173`.

## Commands

```bash
npm run format:check  # final newline and trailing-whitespace checks
npm run lint          # JavaScript syntax validation
npm run build         # generate and validate dist/
npm test              # Playwright interaction, responsive, and axe checks
npm run quality       # complete local quality gate
```

`npm run build` recreates `dist/` from the source files. Do not edit generated files in `dist/` directly.

## Architecture and editing

- `content/portfolio.mjs` — single source of truth for profile details, proof points, capabilities, case studies, quality-system stages, lab stages, principles, experience, and contact copy.
- `src/components.mjs` — functional HTML components for every page section.
- `src/render-page.mjs` — document shell, metadata, JSON-LD, and component composition.
- `src/html.mjs` — escaping and small rendering helpers.
- `styles.css` — Engineering Editorial × Quality Control System tokens, themes, components, breakpoints, and reduced-motion behavior.
- `theme-init.js` — pre-paint OS-theme detection and persisted manual preference.
- `script.js` — progressive enhancement for navigation, theme controls, reveals, active sections, and the Release Confidence Lab.
- `scripts/build.mjs` — deterministic production build.
- `tests/build-check.mjs` — build manifest, link, metadata, JSON-LD, inline-script, and asset-budget validation.
- `tests/portfolio.spec.mjs` — browser behavior, keyboard, theme, responsive overflow, reduced motion, semantic structure, and WCAG checks.
- `Dockerfile` and `nginx.conf` — multi-stage production image and hardened static serving.
- `docs/` — baseline audit, design-system reference, and evidence-backed implementation report.

To change portfolio copy, edit `content/portfolio.mjs`. To add or change a section’s structure, edit `src/components.mjs` and compose it in `src/render-page.mjs`. Run `npm run quality` before publishing.

## GitLab CI and Hamravesh

`.gitlab-ci.yml` runs the full quality gate in GitLab and retains the generated site and browser reports as job artifacts. A merge or default-branch deployment should only proceed after the `portfolio-quality` job passes.

For Hamravesh, connect the GitLab repository and use the included `Dockerfile` as the build source. The container listens on port `80`; use `/` as the health path. No runtime environment variables, database, persistent volume, or start-command override is required. Point `arefsaran.ir` to the Hamravesh service and enable the platform’s TLS/HTTPS option. The same image can be checked locally:

```bash
docker build -t aref-saran-portfolio .
docker run --rm -p 8080:80 aref-saran-portfolio
```

Then open `http://127.0.0.1:8080`.

## Content, privacy, and claims

Professional claims are restricted to the supplied, verified material. The current employer and client systems remain unnamed; identifiers, private endpoints, credentials, production data, and proprietary implementation details are excluded. The résumé is offered by email instead of published until its public wording is current.

Do not add employer or customer names, private repository links, certifications, testimonials, awards, years of experience, or new metrics without a verifiable source and explicit approval.

## More documentation

- [Portfolio audit](docs/PORTFOLIO_AUDIT.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Implementation report](docs/IMPLEMENTATION_REPORT.md)
