# Contemporary Engineering Portfolio Design System

## Direction

The interface is a single-theme, light-first personal portfolio: editorial, restrained, human, and technically credible without resembling documentation, a dashboard, or a SaaS template.

The hierarchy is deliberate:

```text
Identity → Value → Proof → Work → Approach → Experience → Contact
```

Engineering credibility comes from factual content, case-study decisions, and evidence. Decorative technical diagrams are not part of the visual language.

## Core principles

1. **Evidence before taxonomy.** Proof and selected work appear before the broad capability inventory.
2. **Typography before decoration.** Scale, measure, and rhythm establish hierarchy; cards do not carry the entire design.
3. **Depth is optional.** Case-study problem, decision, and outcome remain visible; implementation detail uses native `<details>`.
4. **One accent, neutral surfaces.** Cobalt marks actions and emphasis. Color does not simulate system state or monitoring UI.
5. **Mobile is composed, not compressed.** Navigation, portrait, case studies, approach flow, and capability groups receive explicit mobile layouts.
6. **Motion is nonessential.** Content never depends on animation. Reduced motion disables smooth scrolling and transitions.

## Tokens

Canonical values live at the beginning of `styles.css`.

### Color

| Token | Value | Purpose |
| --- | --- | --- |
| `--bg` | `#f7f7f5` | Warm neutral page background. |
| `--surface` | `#ffffff` | Cards and full-width proof/approach surfaces. |
| `--surface-subtle` | `#f1f2ef` | Quiet scenario labels. |
| `--text` | `#111214` | Primary copy and headings. |
| `--text-secondary` | `#5b5e63` | Supporting copy. |
| `--text-muted` | `#62656a` | Metadata with WCAG AA contrast at small sizes. |
| `--border` | `rgba(17, 18, 20, 0.11)` | Structural separation. |
| `--accent` | `#315cf6` | Primary action and emphasis. |
| `--accent-hover` | `#2449d8` | Interactive hover state. |
| `--soft-accent` | `#edf1ff` | Restrained callout surface. |

There are no dark tokens, alternate palettes, `data-theme` selectors, or color-scheme preference branches.

### Typography

The site uses a local system-first stack: Inter when installed, then SF Pro, Segoe UI Variable, Segoe UI, Helvetica, and Arial. No remote font request is made.

- Hero: `clamp(3.5rem, 6.4vw, 5.9rem)` desktop; 44–56px mobile.
- Section heading: `clamp(2.4rem, 4.5vw, 4rem)` desktop; 32–42px mobile.
- Body: 17px desktop, 16px mobile.
- Supporting content: approximately 12–16px according to hierarchy.
- Labels: 11–12px, bold, high contrast, and never the only source of essential meaning.

Headings use restrained weight, compact leading, and tight tracking. Paragraph widths remain bounded for readable scanning.

### Spacing and shape

- Major desktop section space: 96–128px.
- Major tablet space: 88px.
- Major mobile space: 76px.
- Internal section gaps: 32–64px.
- Card gaps: 16–24px.
- Radii: 10px controls, 18px cards, 24px portrait/contact.
- Shadows: limited to the compact open mobile-navigation panel.

No section uses viewport-height sizing or arbitrary minimum height.

## Components

- **Header:** 64px desktop and 60px mobile, small AS mark, restrained links, icon-only accessible mobile trigger, and opaque scrolled state.
- **Hero:** outcome-led copy, two CTAs, two concise proof signals, professional context, and a supporting real portrait without overlays.
- **Proof:** four factual evidence groups in a typographic strip rather than dashboard widgets.
- **How I Help:** four cards organized by Problem, What I do, and Outcome.
- **Selected Work:** four responsive cases, with the regression case condensed into a six-part engineering grid plus metric, optional scenarios, and native disclosure.
- **Quality Approach:** a five-step semantic flow that becomes a collision-free vertical sequence on small screens.
- **Experience + Capabilities:** compact two-column composition with a timeline, four grouped capability domains, and one supporting AI-assisted practice.
- **Contact:** one pale accent panel, direct email CTA, professional profiles, and reasons to connect.
- **Footer:** one compact identity row with no oversized back-to-top control.

## Accessibility contract

- One H1 and logical H2/H3/H4 progression.
- Semantic landmarks, lists, definition lists, native disclosures, and descriptive link labels.
- Skip link, 44px interactive targets, visible focus, Escape handling, and focus return for mobile navigation.
- Sufficient text contrast at every size and on every surface.
- Meaning does not depend on color, shape, motion, or JavaScript.
- Mobile navigation remains present without JavaScript; progressive enhancement converts it to a controlled popup.
- `prefers-reduced-motion: reduce` removes smooth scrolling and transition duration.
- Forced-colors rules preserve important borders and flow markers.

## Responsive contract

Automated geometry checks cover 375×667, 390×844, 430×932, 768×1024, 1024×768, and 1440×900. Tests enforce compact mobile-header height, no horizontal overflow, bounded section padding, restrained portrait height, collision-free approach content, nonduplicated list numbering, and visible internal-link targets below the sticky header.
