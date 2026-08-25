# Portfolio Audit — 2026-08-25

## Baseline

The repository entered the redesign as a clean `main` branch synchronized with `origin/main`. `npm ci` completed with zero reported vulnerabilities, and the original `npm run quality` baseline passed 28 browser/build checks across Chrome, Firefox, WebKit, and Edge.

The architecture was already appropriate: a framework-free Node.js static generator, centralized content, pure render functions, local assets, progressive JavaScript, Playwright and axe coverage, Docker/Nginx packaging, security headers, metadata, sitemap, and JSON-LD.

## What was strong and preserved

- Static delivery with no client framework or hydration cost.
- `content/portfolio.mjs` as the factual source of truth.
- Semantic HTML, skip navigation, keyboard access, reduced motion, and visible focus.
- Verified evidence: 2,300+ checks, 39h → 2h feedback, approximately 95% shorter regression, and API/Integration/E2E/Performance layers.
- Privacy-safe case-study material, real portrait, favicon, and social preview.
- Canonical, OpenGraph, Twitter/X, robots, sitemap, and `WebSite`/`ProfilePage`/`Person` structured data.
- Deterministic production generation and hardened Docker/Nginx deployment path.
- Chromium detail coverage plus Firefox, WebKit, and Edge smoke coverage.

## Rejected presentation found

- Dark/navy-first visual language and a full OS/manual theme state machine.
- Eleven visually separate homepage chapters with numbered report labels.
- Standalone BPMN, fintech, architecture, and AI sections competing with the portfolio story.
- Oversized headings, very large section padding, and excessive full-page length.
- Documentation-like diagrams, repeated engineering taxonomies, and dense default case-study content.
- Large mobile navigation treatment, dominant portrait framing, dark panels, and dashboard cues.
- Five primary case studies and redundant capability/card systems.
- Theme-specific tests that protected functionality explicitly rejected by the product brief.

## Keep / change / remove / add

### Keep

The static generator, content/presentation boundary, verified content, portrait, metadata, structured data, accessibility foundations, tests, Docker/Nginx path, security headers, and deployment secrets contract.

### Change

The information architecture, content grouping, components, complete CSS system, navigation, hero composition, case-study hierarchy, responsive behavior, favicon, regression coverage, and documentation.

### Remove

`theme-init.js`, theme controls, persisted theme state, dark tokens, standalone technical chapters, numbered section architecture, complex ordered diagrams, scroll-to-top UI, and obsolete tests/selectors/content entries.

### Add

A 60px mobile header, seven-area portfolio structure, four outcome-led service cards, three scannable primary case studies, a five-step risk-to-release approach, compact experience/capability columns, an integrated AI-assisted practice note, geometry regressions, asset budgets, and Docker input validation.

## Adversarial review and revision

The initial simplification risked becoming a generic minimal portfolio. The revised design prevents that in four ways:

1. Verified proof appears in the hero and immediately following proof area.
2. Selected Work is the visual center and preserves deeper evidence through native disclosures.
3. Fintech, BPMN/Camunda, database state, provider behavior, retries, and idempotency remain specific in services, case studies, the quality approach, and capabilities.
4. AI is present only as a supporting engineering workflow with explicit authoritative evidence.

The page avoids manufacturing technical depth through decoration. Strong typography, concise reasoning, and verified evidence carry the professional positioning.

## Asset audit

| Asset | Dimensions | Role |
| --- | ---: | --- |
| `assets/aref-saran-profile.webp` | 735 × 861 | Primary efficient portrait. |
| `assets/aref-saran-profile.png` | 735 × 861 | Compatibility fallback. |
| `og-card-senior.jpg` | 1200 × 630 | Existing light social preview with the real portrait. |
| `favicon.svg` | Vector | Updated single-theme AS identity mark. |

No external imagery, font, analytics, script, or runtime request was introduced.
