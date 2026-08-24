# Engineering Editorial × Quality Systems

## Positioning

The visual system presents Aref Saran as a Senior Test Engineer who designs quality systems for complex software and fintech products. Editorial hierarchy makes the professional story easy to scan; system diagrams expose the engineering relationships behind the claims.

The intended impression is “this person designs systems,” not “this person customized a portfolio template.”

## Principles

1. **Identity before tools.** Name, role, specialization, outcome, and evidence appear before technology brands.
2. **Evidence before decoration.** Numbers, state chains, diagrams, and case-study details support a concrete claim.
3. **Technical depth through progressive disclosure.** Recruiters can scan headings and diagrams; technical readers can open engineering breakdowns.
4. **Diagrams remain content.** Architecture, BPMN, fintech, and delivery flows are semantic ordered lists styled with CSS, with readable linear mobile fallbacks.
5. **Motion is optional.** No section is hidden for animation. Interaction is limited to useful hover, focus, navigation, and theme feedback.
6. **Controlled color.** Warm paper, navy, cobalt, mint, amber, and rose have defined roles in both themes.

## Tokens

Canonical tokens live at the top of `styles.css`.

- `--paper`, `--paper-deep`, `--surface`, `--surface-strong`: page and content hierarchy.
- `--ink`, `--ink-soft`, `--ink-faint`: primary, supporting, and metadata text.
- `--accent`, `--accent-soft`: links, focus, active states, and system emphasis.
- `--success`, `--success-soft`: validated state and authoritative evidence.
- `--warning-soft`: financial risk and high-consequence behavior.
- `--line`, `--line-strong`: architecture, dividers, and boundaries.
- `--dark-panel`, `--dark-panel-raised`, `--dark-text`, `--dark-muted`: fixed technical surfaces that retain contrast in both themes.

The typography uses local system fonts only. Headings use tight tracking and compact leading; body text uses relaxed leading; small labels are kept at readable sizes and never carry the only instance of essential information.

## Page components

- **Header:** name, Senior Test Engineer label, five concise navigation links, theme control, and keyboard-safe mobile menu.
- **Hero:** name, role, outcome-led headline, system-level statement, two internal CTAs, profiles, portrait, and four domain signals.
- **Proof bar:** three verified proof groups, with 39h → 2h and approximately 95% combined instead of duplicated.
- **Outcome map:** BUILD, STABILIZE, PROTECT, and ACCELERATE.
- **Quality-system architecture:** seven layers from business risk to CI/CD, plus an eight-stage feature-branch delivery model.
- **BPMN/Camunda:** generalized workflow path and eight synchronized test oracles.
- **Fintech correctness:** six-state correctness chain, invariant checklist, callback replay example, and risk priorities.
- **Selected work:** five generalized case studies with native `<details>` breakdowns.
- **AI-augmented QA:** accelerated analysis beside explicit sources of truth.
- **Capability map:** seven engineering-domain groups.
- **Experience:** delivery history plus a concise engineering perspective.
- **Contact:** one primary CTA and direct professional channels.

## Responsive behavior

Structural transitions occur at 1100, 900, 720, 430, and 360px. Diagrams become full-width stacks rather than horizontally scrolling canvases. Capability groups remain compact two-column cards where readable and become one column at the smallest width.

Automated overflow coverage runs at 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px. Focused browser-engine smoke coverage also verifies the 390px layout.

## Accessibility rules

- One H1 followed by logical H2/H3 progression.
- Semantic landmarks, section labels, figures, captions, ordered flows, and native disclosures.
- Skip link, visible focus, 44px primary control targets, and keyboard-operable navigation.
- Decorative marks hidden from assistive technology.
- Meaning never depends on color, shape, or motion alone.
- Content is visible without the enhancement script.
- Mobile navigation remains available without JavaScript; JavaScript converts it into a controlled menu.
- `prefers-reduced-motion` removes smooth scrolling and transition duration.
- Light and dark themes are scanned with axe using WCAG 2.0/2.1/2.2 A and AA tags.

## Content integrity

Only supplied or previously verified professional facts are public. Senior Test Engineer, BPMN/Camunda, fintech workflows, automation-from-zero, feature-branch quality, deterministic dependencies, and AI-augmented QA come from the supplied professional brief. Existing quantitative results remain unchanged. Public copy excludes employer/client identities, private endpoints, credentials, production data, and proprietary implementation details.
