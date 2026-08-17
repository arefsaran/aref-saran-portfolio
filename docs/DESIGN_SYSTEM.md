# Engineering Editorial × Quality Control System

## Positioning

The visual system presents a Quality Engineer who makes complex software safer to change, faster to validate, and easier to trust. “Engineering editorial” provides calm hierarchy and readable long-form proof; “quality control system” contributes status cues, evidence flows, stages, and release-decision language.

The interface avoids stock dashboard theater. Metrics are limited to verified proof, the quality signal is labeled as a portfolio visualization, and the Release Confidence Lab states that its evidence is deterministic demonstration data.

## Visual principles

1. **Evidence before decoration.** Every metric, badge, stage, and state supports a concrete claim or explanation.
2. **Editorial rhythm.** Large headings, narrow reading measures, generous sections, and ruled dividers make technical depth approachable.
3. **Operational clarity.** Labels, stage numbers, progress, and status colors resemble quality-system artifacts without pretending to be live infrastructure.
4. **Controlled color.** Warm paper, navy, cobalt, mint, amber, and rose have clear roles; there are no gradients.
5. **Progressive enhancement.** The content and native disclosures work before JavaScript. Motion, navigation state, themes, and the lab enhance the baseline.

## Tokens

The canonical tokens live at the top of `styles.css`.

### Color

- `--paper`, `--paper-deep`, and `--surface`: page and card hierarchy.
- `--ink`, `--ink-soft`, and `--ink-faint`: primary, supporting, and metadata text.
- `--navy` and `--navy-2`: high-emphasis controls and identity surfaces.
- `--blue` and `--blue-soft`: links, focus, active navigation, and selected evidence.
- `--mint` and `--mint-strong`: positive status and systems-quality emphasis.
- `--amber`: timing/risk emphasis.
- `--rose`: alternate capability-card grouping.
- `--line` and `--line-strong`: structural rules and borders.

Intentionally dark evidence surfaces use fixed dark colors and light text instead of theme-reversible tokens. This preserves their meaning and contrast in both themes.

### Typography

The system stack is `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. No font is downloaded. Headings use tight tracking and compact leading; body content uses relaxed leading. Labels use small, bold, uppercase text with increased tracking. Responsive type is controlled with `clamp()`.

### Space, shape, depth, and motion

- Spacing: `--space-1` through `--space-5`, supplemented by fluid section spacing.
- Radius: `--radius-sm`, `--radius-md`, and `--radius-pill`.
- Depth: `--shadow-sm` and `--shadow-lg`, used sparingly for floating/interactive surfaces.
- Motion: `--duration-fast`, `--duration-base`, and `--ease-out`.
- Layout: `--max-width: 1200px` with fluid side gutters.

## Themes

Light mode uses warm paper and dark ink. Dark mode uses deep blue-black neutrals and higher-luminance text/accent values.

`theme-init.js` executes before the stylesheet to prevent a visible wrong-theme frame. It follows `prefers-color-scheme` unless a valid manual preference exists in `localStorage`. The theme control exposes its state with `aria-pressed`, persists manual choices, and the page resumes following OS changes only while the source remains `system`.

Both themes declare the relevant `color-scheme`, update the browser theme-color metadata, and pass automated WCAG A/AA scans.

## Components

- **Header:** fixed translucent shell, clear brand, section navigation, contact route, theme control, and keyboard-safe mobile menu.
- **Hero:** outcome-led statement, verified positioning copy, two real calls to action, professional links, portrait, disclosed quality signal, and the verified ≈95% reduction badge.
- **Proof strip:** three compact verified outcomes.
- **How I help:** four cards with explicit problem, intervention, outcome, and evidence.
- **Case studies:** four generalized proof narratives with native, keyboard-operable engineering breakdowns.
- **Quality system:** nine linked stages from product risk to learning loop.
- **Release Confidence Lab:** seven deterministic stages, accessible progress state, evidence updates, and explicit release decision.
- **Principles:** five engineering principles, including testability.
- **Capability map:** tools grouped by quality outcome rather than brand display.
- **Experience, About, Contact:** privacy-aware career scope, professional viewpoint, and real email/profile routes.

## Accessibility rules

- One H1 followed by logical H2/H3 progression.
- Semantic landmarks and section labels.
- A keyboard-visible skip link and consistent `:focus-visible` treatment.
- Controls and primary links have at least a 44 px minimum target dimension where relevant.
- Native button, link, progressbar, navigation, and details semantics.
- Menu state uses `aria-expanded`; lab state uses `aria-live`, `aria-atomic`, and progress values.
- Decorative marks are hidden from assistive technology.
- Essential information is never represented by color alone.
- Reduced-motion users get instant reveals, non-smooth scrolling, and an instant deterministic lab completion.
- Both themes are automatically checked with axe against WCAG A/AA tags, including WCAG 2.2 AA rules available in the installed axe version.

## Responsive behavior

The design is fluid rather than device-specific. Main structural transitions occur at 1080, 840, 620, and 380 px. Navigation becomes a controlled menu below 840 px. Multi-column content collapses progressively, case-study visuals move below narratives, and the nine-stage system moves from three to two to one column.

Automated overflow checks cover 320, 375, 768, 1024, 1440, and 1920 px. The minimum supported page width is 320 px.

## Content and interaction voice

Copy is direct, concrete, and evidence-led. It avoids unsupported seniority, company claims, generic “passionate tester” language, and decorative numbers. Interactions explain state and outcome: “Ready,” “Running,” “Passed,” and “Release confidence: high” are attached to a disclosed deterministic demo, not presented as production telemetry.
