# Portfolio Audit

## Scope and method

The audit covered the committed repository, production-serving configuration, content, interaction model, images, metadata, accessibility tests, and deployment path before the rebuild. Baseline commands were run before implementation so the report distinguishes what already worked from what was missing.

## Original repository

The original project was a framework-free static site with `index.html`, `styles.css`, and `script.js`, plus Playwright/axe tests, a Docker/Nginx deployment, and a GitHub Actions quality workflow. Its small runtime footprint and semantic direction were appropriate for a portfolio, so a framework migration was not justified.

The existing build script was a marker check rather than a production build: the source root was served directly and no clean, deployable output directory was created. Content and presentation were tightly coupled in one HTML file. The site also had two stale social cards that described Aref as a “Software Test Engineer,” while the intended positioning was Quality Engineer / Test Automation & Quality Systems Engineer.

## What was already strong

- Static delivery with no backend, database, authentication, analytics, or runtime dependency.
- A clear visual direction, portrait asset, responsive CSS, progressive interaction, and a working Docker/Nginx path.
- Existing Playwright and axe dependencies with a useful initial browser suite.
- Real contact routes and public professional-profile links.
- A factual foundation: 2,300+ automated checks, regression reduced from 39 hours to about two hours, financial-workflow quality, service virtualization, CI gates, and layered API/integration/E2E/performance work.

## Gaps found

### Positioning and evidence

- The original narrative did not consistently express the outcome “safer to change, faster to validate, easier to trust.”
- Case studies were short summaries rather than complete context → problem → constraints → diagnosis → decision → implementation → safeguards → outcome → lessons narratives.
- “How I help” cards were tool-oriented and did not explicitly connect problem, intervention, and outcome.
- The quality-system flow, Release Confidence Lab, and principles sections did not contain all requested stages and principles.
- The quality visualization needed an explicit disclosure that it was a portfolio illustration rather than live infrastructure telemetry.

### Architecture and maintainability

- Portfolio content, document structure, metadata, and components lived in one root HTML file.
- `npm run build` did not create a production artifact.
- There was no content model, component layer, or generated-output boundary.
- No GitLab pipeline existed for the user’s GitLab/Hamravesh workflow.

### Theme and accessibility

- Theme initialization relied on executable inline scripts, forcing a weaker Content Security Policy.
- Manual theme behavior did not fully model OS preference, manual override, persistence, and system changes.
- Automated coverage did not test both themes, six target widths, unique IDs, heading progression, all internal targets, external-link safety, the complete lab, or keyboard-operated case-study details.
- Light/dark color responsibilities were coupled: theme-dependent `--navy`/`--white` tokens were also used by intentionally dark components. Expanded axe checks exposed the resulting contrast failures, which were fixed by separating fixed dark surfaces from theme neutrals.

### SEO, social, security, and release

- Social-preview assets used obsolete positioning and one was over 1 MB.
- The server policy allowed inline scripts and lacked some useful isolation/resource policies.
- The Docker image copied source files directly instead of a validated production build.
- No implementation, audit, or design-system documentation existed.
- There was no measured Lighthouse record.

## Content decisions

The implementation uses only claims supplied in the repository and directive. Case studies are generalized around the verified themes of regression architecture, service virtualization, financial workflows, and multi-layer commerce quality. No employer, client, private endpoint, repository, credential, testimonial, certification, award, team size, or unsupported metric was added.

The current role is presented without naming the employer. The résumé remains available on request because no verified public résumé artifact was supplied.

## Image audit

| Asset | Dimensions | Source size | Decision |
| --- | ---: | ---: | --- |
| `assets/aref-saran-profile.webp` | 735 × 861 | 40,718 bytes | Primary portrait; retained for efficient delivery. |
| `assets/aref-saran-profile.png` | 735 × 861 | 756,960 bytes | Compatibility fallback; retained under the 1 MB asset budget. |
| `og-card.jpg` | 1200 × 630 | 135,708 bytes | New role-accurate social card; generated from the supplied portrait and optimized as JPEG. |
| `favicon.svg` | Vector | 338 bytes in build | Simplified to the portfolio’s navy/cobalt/white identity. |
| `og-card.png` | 1200 × 630 | 354,896 bytes | Deleted because its role text was stale. Recoverable from Git history. |
| `og-card-v2.png` | 1200 × 630 | 1,217,974 bytes | Deleted because its role text was stale and it exceeded the asset budget. Recoverable from Git history. |

All production images are local. The page makes no third-party runtime request.

## Decisions and rationale

1. Preserve static architecture, because the content and interactions do not require a client framework.
2. Add a build-time content/component layer, because it separates truth, structure, and presentation without increasing browser complexity.
3. Generate a clean `dist/`, because CI and Docker need a deterministic release artifact.
4. Keep the Release Confidence Lab deterministic and explicitly labeled, because a portfolio should demonstrate thinking without simulating real telemetry.
5. Use native `<details>` for engineering breakdowns, because it is resilient and keyboard accessible without custom disclosure logic.
6. Keep all assets local and avoid analytics, because that improves speed, privacy, and policy simplicity.
7. Add GitLab CI and retain GitHub Actions, because the repository may be mirrored while Hamravesh tracks GitLab.

## Audit conclusion

The original codebase was a sound static foundation but not a complete production system for the supplied brief. The rebuild keeps its appropriate low-complexity architecture while adding structured content, richer proof, deterministic builds, both-theme accessibility, hardened serving, GitLab/Hamravesh readiness, and evidence-backed documentation.
