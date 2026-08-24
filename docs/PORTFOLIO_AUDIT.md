# Portfolio Audit — 2026-08-24

## Repository assessment

The repository is a framework-free Node.js static generator. Structured content in `content/portfolio.mjs` is rendered by pure component functions into semantic HTML, then copied with local CSS, JavaScript, metadata, and images into a deterministic `dist/` artifact.

The architecture was already appropriate for the product. It had no client framework, remote font, analytics, CMS, API, authentication, or third-party runtime request. Playwright and axe supplied a strong browser-quality baseline; GitHub and GitLab pipelines, Docker, Nginx, CSP, and security headers covered release concerns.

## What remained strong

- Static delivery and a small browser runtime.
- Centralized factual content and privacy-safe case studies.
- Verified proof: 2,300+ checks, 39h → 2h regression, approximately 95% shorter execution, and four test layers.
- Local portrait, favicon, and social assets.
- Working light/dark themes, keyboard navigation, reduced motion, and responsive CSS.
- Deterministic production build and hardened deployment configuration.
- Automated link, heading, structured-data, asset, keyboard, viewport, and WCAG checks.

## Gaps found before this refactor

### Positioning

- Primary copy and metadata said “Quality Engineer,” not “Senior Test Engineer.”
- Aref’s name and role were not both visible in the first mobile viewport.
- BPMN/Camunda, feature-branch quality, and AI-augmented QA were absent.
- Fintech state validation was present only as a generalized case study rather than a clear professional differentiator.
- The quality-system visualization did not show execution boundaries, infrastructure, evidence, and delivery as one architecture.

### UX and content

- How-I-help cards, principles, the quality flow, the capability map, and the interactive lab repeated similar ideas.
- The deterministic Release Confidence Lab resembled simulated operational UI but added little technical substance.
- Case studies were useful but did not represent automation-from-zero or BPMN workflow quality.
- The page was approximately 16,866px tall at 390px despite missing several required capabilities.
- Small labels and oversized headings reduced practical reading comfort.

### Maintainability and resilience

- `styles.css` ended with a second override layer containing duplicated and dead selectors.
- Unused content fields remained in the content model.
- Scroll-reveal styles hid content until JavaScript and IntersectionObserver state were applied.
- Mobile navigation was unavailable without JavaScript.

### SEO and verification

- Title, descriptions, social text, image copy, and Person job title reflected the old role.
- Structured data did not model the page as a `ProfilePage` within a `WebSite`.
- The sitemap modification date was stale.
- Responsive tests omitted 390, 430, and 1280px.
- Browser automation covered Chrome/Chromium only.
- GitHub Actions used Node 22 while the documented and deployment runtime used Node 24.

## Refactor decisions

1. Preserve the static generator, content/component boundary, portrait, themes, verified metrics, case-study evidence, CI, and deployment architecture.
2. Rebuild the information architecture around Senior Test Engineer positioning, quality systems, BPMN/Camunda, fintech correctness, and engineering evidence.
3. Replace simulated dashboard/lab UI with semantic HTML/CSS system diagrams.
4. Remove JavaScript-controlled content reveals and keep enhancement limited to navigation, themes, section state, and back-to-top behavior.
5. Group capabilities by engineering domain and retain technical depth behind native case-study disclosures.
6. Add focused cross-browser smoke coverage rather than tripling the entire detailed suite.
7. Keep every existing number unchanged and add no employer, client, volume, certification, award, or confidential architecture claim.

## Image audit

| Asset | Dimensions | Role |
| --- | ---: | --- |
| `assets/aref-saran-profile.webp` | 735 × 861 | Primary efficient portrait. |
| `assets/aref-saran-profile.png` | 735 × 861 | Compatibility fallback. |
| `og-card-senior.jpg` | 1200 × 630 | Role-accurate social preview with the original portrait preserved. |
| `favicon.svg` | Vector | Local AS identity mark. |

The production page makes no third-party request and exposes no private credentials, endpoints, repositories, customer data, or deployment-secret values.
