# Aref Saran — Senior Test Engineer Portfolio

Production portfolio for [arefsaran.ir](https://arefsaran.ir/). It presents Aref Saran as a Senior Test Engineer who builds automation and quality systems for complex fintech, API, integration, and BPMN/Camunda workflows.

The implementation is intentionally static. Structured JavaScript content is rendered to semantic HTML at build time, a single light-first CSS system provides the complete responsive presentation, and a small progressive-enhancement script handles only mobile navigation, sticky-header state, and active navigation. The public page has no framework runtime, API, database, CMS, analytics, remote font, or third-party request.

## Product structure

The homepage has seven major areas:

1. Hero
2. Proof
3. How I Help
4. Selected Work
5. Quality Engineering Approach
6. Experience + Capabilities
7. Contact

Three generalized case studies provide scannable problem, decision, and outcome summaries. Native `<details>` disclosures preserve deeper technical evidence without turning the default page into documentation.

## Local setup

Requirements: Node.js 24+ and npm. Chrome, Playwright Firefox, and Playwright WebKit are required for the complete browser suite; local Windows runs also use Edge when available.

```bash
npm ci
npx playwright install chromium firefox webkit
npm run serve
```

Open `http://127.0.0.1:4173`.

## Commands

```bash
npm run format:check  # final-newline and trailing-whitespace checks
npm run lint          # JavaScript syntax validation
npm run build         # generate and validate dist/
npm run test:chromium # detailed interaction, responsive, performance, and axe checks
npm test              # Chrome plus Firefox/WebKit/Edge smoke coverage
npm run quality       # complete quality gate
```

`npm run build` recreates `dist/` from allow-listed source files. Do not edit generated files in `dist/` directly.

## Source architecture

- `content/portfolio.mjs` — factual source of truth for profile, proof, services, three case studies, quality approach, experience, capabilities, AI-assisted practice, and contact content.
- `src/components.mjs` — pure semantic HTML render functions for the header, seven major areas, and footer.
- `src/render-page.mjs` — document shell, metadata, JSON-LD, and component composition.
- `src/html.mjs` — output escaping and small rendering helpers.
- `styles.css` — single-theme editorial design system, component layouts, intentional breakpoints, focus states, and reduced-motion handling.
- `script.js` — progressive enhancement for the compact mobile menu, sticky-header state, and active navigation.
- `scripts/build.mjs` — deterministic production artifact generation.
- `tests/build-check.mjs` — production manifest, Docker input, link, section-count, metadata, JSON-LD, theme-removal, script, sitemap, and asset-budget verification.
- `tests/portfolio.spec.mjs` — detailed Chrome behavior, keyboard access, target viewport geometry, spacing, collision, accessibility, performance, and semantic coverage.
- `tests/cross-browser.spec.mjs` — focused Chromium/Chrome, Firefox, WebKit, and Edge smoke coverage.
- `Dockerfile` and `nginx.conf` — multi-stage derived production image, hardened portfolio serving, and the existing V2Ray WebSocket proxy.

Copy changes belong in `content/portfolio.mjs`. Structural changes belong in `src/components.mjs` and `src/render-page.mjs`. Run `npm run quality` before publishing.

## Production architecture

The production image preserves the existing same-domain portfolio and VPN routing:

```text
Darkube ingress
    |
    v
Nginx :80
   | \
   |  \ VPN WebSocket path
   |   \
Portfolio  ->  V2Ray internal port
```

The Dockerfile builds the portfolio and derives from `alphacodinghub/v2ray-nginx:latest`. The parent supplies V2Ray, Nginx, Supervisor, `/entrypoint.sh`, and runtime substitution for `LISTENING_PORT`, `CLIENT_ID`, `CLIENT_ALTERID`, and `CLIENT_WSPATH`. The inherited entrypoint and Supervisor command are intentionally not overridden.

Generated files are copied to `/opt/portfolio`. Darkube must build this repository’s Dockerfile, expose container port `80`, and keep the four existing runtime values in deployment secrets/environment configuration. Do not commit those values.

```bash
docker build -t aref-saran-portfolio .
docker run --rm -p 8080:80 \
  -e LISTENING_PORT=3456 \
  -e CLIENT_ID=11111111-1111-4111-8111-111111111111 \
  -e CLIENT_ALTERID=64 \
  -e CLIENT_WSPATH=/__portfolio_vpn_ws_test__ \
  aref-saran-portfolio
```

If deployment events show only the upstream parent image, the platform is bypassing this repository’s Dockerfile and the portfolio artifact will not be present.

## CI, security, and privacy

`.gitlab-ci.yml` installs the supported browsers and runs the full quality gate. Nginx retains CSP, HSTS, MIME-sniffing, frame, referrer, permissions, COOP, and CORP protections.

Professional claims are restricted to supplied, verified material. Employer and client identifiers, private endpoints, credentials, production data, and proprietary implementation details are excluded. The résumé remains available by email until a verified public file is supplied.

## Documentation

- [Portfolio audit](docs/PORTFOLIO_AUDIT.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Implementation report](docs/IMPLEMENTATION_REPORT.md)
