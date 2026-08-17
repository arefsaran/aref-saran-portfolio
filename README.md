# Aref Saran — Quality Engineering Portfolio

Production portfolio for [arefsaran.ir](https://arefsaran.ir/). It positions Aref Saran as a Quality Engineer and Test Automation & Quality Systems Engineer who makes complex software safer to change, faster to validate, and easier to trust.

The implementation is intentionally static: structured JavaScript content is rendered to semantic HTML at build time, CSS supplies the complete responsive design system, and a small progressive-enhancement script handles themes, navigation, reveals, and the deterministic Release Confidence Lab. The public site has no framework runtime, API, database, CMS, analytics, remote font, or third-party request.

## Production architecture

The production image has two responsibilities on the same domain:

```text
Darkube ingress
    |
    v
Nginx :80
   | \
   |  \\ VPN WebSocket path
   |   \
Portfolio  ->  V2Ray internal port
```

The Dockerfile builds this repository’s portfolio and derives the deployment image from `alphacodinghub/v2ray-nginx:latest`. That parent supplies V2Ray, Nginx, Supervisor, `/entrypoint.sh`, and the runtime configuration substitution for `LISTENING_PORT`, `CLIENT_ID`, `CLIENT_ALTERID`, and `CLIENT_WSPATH`. The inherited entrypoint and Supervisor command are intentionally not overridden.

The generated site is copied to `/opt/portfolio`, not the parent image’s `/var/www/html` volume. This ensures a Darkube build from this repository packages the portfolio into the derived image.

Required environment variable names are:

```text
LISTENING_PORT
CLIENT_ID
CLIENT_ALTERID
CLIENT_WSPATH
```

Values must be configured as deployment secrets/environment variables; do not commit them. The V2Ray listening port is internal and should not normally be exposed publicly. Darkube should expose container port `80`, while HTTPS terminates at the platform/ingress layer unless the existing deployment architecture requires otherwise.

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
- `Dockerfile` and `nginx.conf` — multi-stage derived production image, hardened portfolio serving, and the V2Ray WebSocket proxy.
- `docs/` — baseline audit, design-system reference, and evidence-backed implementation report.

To change portfolio copy, edit `content/portfolio.mjs`. To add or change a section’s structure, edit `src/components.mjs` and compose it in `src/render-page.mjs`. Run `npm run quality` before publishing.

## CI and Darkube deployment

`.gitlab-ci.yml` runs the full quality gate in GitLab and retains the generated site and browser reports as job artifacts. A merge or default-branch deployment should only proceed after the `portfolio-quality` job passes.

Configure Darkube to build the repository rather than directly running the upstream parent image:

```text
Source: Git repository
Repository: this portfolio repository
Branch: main
Build: Dockerfile from repository root
Dockerfile: Dockerfile
Application/container port: 80
Health path: /
```

Keep the existing V2Ray environment variable values configured in Darkube under the names documented above. Kubernetes should run the derived image produced by this build. If pod events still show only `alphacodinghub/v2ray-nginx:latest` as the deployed image, the platform is bypassing this repository’s Dockerfile and the portfolio files will not be present.

The same derived image can be checked locally:

```bash
docker build -t aref-saran-portfolio .
docker run --rm -p 8080:80 \
  -e LISTENING_PORT=3456 \
  -e CLIENT_ID=11111111-1111-4111-8111-111111111111 \
  -e CLIENT_ALTERID=64 \
  -e CLIENT_WSPATH=/__codex_vpn_ws_test__ \
  aref-saran-portfolio
```

Then open `http://127.0.0.1:8080`.

## Content, privacy, and claims

Professional claims are restricted to the supplied, verified material. The current employer and client systems remain unnamed; identifiers, private endpoints, credentials, production data, and proprietary implementation details are excluded. The résumé is offered by email instead of published until its public wording is current.

Do not add employer or customer names, private repository links, certifications, testimonials, awards, years of experience, or new metrics without a verifiable source and explicit approval.

## More documentation

- [Portfolio audit](docs/PORTFOLIO_AUDIT.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Implementation report](docs/IMPLEMENTATION_REPORT.md)
