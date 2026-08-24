import { escapeHtml, externalLink, list, sectionHeading } from './html.mjs';

export const Header = ({ profile, navigation }) => `
  <header class="site-header" data-testid="site-header">
    <div class="nav-shell">
      <a class="brand" href="#top" aria-label="${escapeHtml(profile.name)}, home">
        <span class="brand-mark" aria-hidden="true">AS</span>
        <span class="brand-copy"><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.role)}</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span>Menu</span><i aria-hidden="true"></i></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
        ${list(navigation, (item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)}
        <button class="theme-toggle" type="button" aria-label="Switch to dark theme" aria-pressed="false" data-theme-toggle><span aria-hidden="true">◐</span><b>Theme</b></button>
      </nav>
    </div>
  </header>`;

export const Hero = ({ profile, hero }) => `
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="hero-name"><span aria-hidden="true"></span>${escapeHtml(hero.eyebrow)}</p>
      <p class="hero-role">${escapeHtml(hero.roleLine)}</p>
      <h1 id="hero-title">${escapeHtml(hero.headline)}</h1>
      <p class="hero-lead">${escapeHtml(hero.lead)}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="${escapeHtml(hero.primaryCta.href)}">${escapeHtml(hero.primaryCta.label)} <span aria-hidden="true">↘</span></a>
        <a class="button button-secondary" href="${escapeHtml(hero.secondaryCta.href)}">${escapeHtml(hero.secondaryCta.label)} <span aria-hidden="true">↓</span></a>
      </div>
      <div class="hero-proof" aria-label="Professional profiles and availability">
        <span class="availability"><i aria-hidden="true"></i>${escapeHtml(hero.availability)}</span>
        ${list(profile.socialLinks, (link) => externalLink(link))}
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-grid" aria-hidden="true"></div>
      <figure class="portrait-card">
        <picture><source srcset="./${escapeHtml(profile.portrait.webp)}" type="image/webp"><img src="./${escapeHtml(profile.portrait.fallback)}" alt="${escapeHtml(profile.portrait.alt)}" width="${profile.portrait.width}" height="${profile.portrait.height}" fetchpriority="high"></picture>
        <figcaption><span>Based in ${escapeHtml(profile.location)}</span><span>Working globally</span></figcaption>
      </figure>
      <ul class="hero-domains" aria-label="Core engineering domains">${list(hero.domains, (domain) => `<li>${escapeHtml(domain)}</li>`)}</ul>
    </div>
  </section>`;

export const ProofBar = ({ metrics }) => `
  <section class="proof-bar" aria-labelledby="proof-title">
    <div class="proof-inner">
      <h2 id="proof-title">Selected proof</h2>
      ${list(metrics, (metric) => `<div class="proof-item"><strong>${escapeHtml(metric.value)}</strong><p>${escapeHtml(metric.label)}${metric.note ? `<small>${escapeHtml(metric.note)}</small>` : ''}</p></div>`)}
    </div>
  </section>`;

export const OutcomeMap = ({ outcomes }) => `
  <section class="section outcomes-section" aria-labelledby="outcomes-title">
    ${sectionHeading({ kicker: '01 / How I help', title: 'Engineering outcomes, not a tool inventory.', description: 'The work starts with a system problem and ends with clearer, faster, more trustworthy engineering decisions.', id: 'outcomes-title' })}
    <div class="outcome-grid">
      ${list(outcomes, (item) => `<article class="outcome-card">
        <div class="outcome-label"><span>${escapeHtml(item.number)}</span><strong>${escapeHtml(item.action)}</strong></div>
        <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p>
        <ul>${list(item.evidence, (entry) => `<li>${escapeHtml(entry)}</li>`)}</ul>
      </article>`)}
    </div>
  </section>`;

const ArchitectureLayer = (layer, index) => `<li class="architecture-layer" data-tone="${escapeHtml(layer.tone)}">
  <span class="layer-index">${String(index + 1).padStart(2, '0')}</span>
  <div class="layer-copy"><strong>${escapeHtml(layer.label)}</strong><small>${escapeHtml(layer.detail)}</small></div>
  ${layer.nodes ? `<ul class="boundary-nodes" aria-label="Execution boundaries">${list(layer.nodes, (node) => `<li>${escapeHtml(node)}</li>`)}</ul>` : ''}
</li>`;

export const SystemArchitecture = ({ architecture }) => `
  <section class="system-section" id="systems" aria-labelledby="systems-title">
    <div class="section system-inner">
      <div class="system-heading">
        <p class="section-kicker">02 / Quality system architecture</p>
        <h2 id="systems-title">${escapeHtml(architecture.title)}</h2>
        <p>${escapeHtml(architecture.description)}</p>
      </div>
      <figure class="architecture-figure">
        <figcaption>Quality-system layers from business risk to an explicit delivery decision.</figcaption>
        <ol class="architecture-stack">${list(architecture.layers, ArchitectureLayer)}</ol>
      </figure>
      <div class="delivery-model" aria-labelledby="delivery-title">
        <div><p class="diagram-label">Feature-branch quality engineering</p><h3 id="delivery-title">${escapeHtml(architecture.deliveryTitle)}</h3></div>
        <ol class="delivery-flow">${list(architecture.deliveryStages, (stage, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(stage)}</li>`)}</ol>
      </div>
    </div>
  </section>`;

export const WorkflowEngineering = ({ workflow }) => `
  <section class="section workflow-section" id="workflow" aria-labelledby="workflow-title">
    ${sectionHeading({ kicker: '03 / BPMN & Camunda', title: workflow.title, description: workflow.description, id: 'workflow-title' })}
    <div class="workflow-layout">
      <figure class="workflow-figure">
        <figcaption>Representative workflow path. The diagram is generalized and contains no private system details.</figcaption>
        <ol class="workflow-flow">${list(workflow.flow, (node, index) => `<li data-type="${escapeHtml(node.type)}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(node.label)}</strong></li>`)}</ol>
      </figure>
      <div class="oracle-panel">
        <p class="diagram-label">Synchronized test oracle</p>
        <h3>One scenario. Eight sources of evidence.</h3>
        <ol class="oracle-list">${list(workflow.oracles, (oracle, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(oracle)}</li>`)}</ol>
      </div>
    </div>
    <ul class="concept-strip" aria-label="BPMN and Camunda concepts">${list(workflow.concepts, (concept) => `<li>${escapeHtml(concept)}</li>`)}</ul>
  </section>`;

export const FintechCorrectness = ({ fintech }) => `
  <section class="fintech-section" id="fintech" aria-labelledby="fintech-title">
    <div class="section fintech-inner">
      ${sectionHeading({ kicker: '04 / Fintech correctness', title: fintech.title, description: fintech.description, id: 'fintech-title' })}
      <figure class="correctness-figure">
        <figcaption>Financial correctness chain</figcaption>
        <ol class="correctness-chain">${list(fintech.chain, (step, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(step)}</strong></li>`)}</ol>
      </figure>
      <div class="fintech-evidence">
        <div class="check-panel"><p class="diagram-label">What must still be proven</p><ul>${list(fintech.checks, (check) => `<li><span aria-hidden="true">✓</span>${escapeHtml(check)}</li>`)}</ul></div>
        <div class="idempotency-panel"><p class="diagram-label">${escapeHtml(fintech.idempotency.title)}</p><div><span>${escapeHtml(fintech.idempotency.first.label)}</span><strong>${escapeHtml(fintech.idempotency.first.result)}</strong></div><div><span>${escapeHtml(fintech.idempotency.replay.label)}</span><strong>${escapeHtml(fintech.idempotency.replay.result)}</strong></div></div>
      </div>
      <div class="risk-strip"><strong>Risk follows consequence.</strong><ul>${list(fintech.risks, (risk) => `<li>${escapeHtml(risk)}</li>`)}</ul></div>
    </div>
  </section>`;

const CaseStudy = (study, index) => `
  <article class="case-card${index === 0 ? ' case-card-featured' : ''}" id="${escapeHtml(study.id)}">
    <div class="case-meta"><span>${escapeHtml(study.number)}</span><strong>${escapeHtml(study.category)}</strong></div>
    <h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.summary)}</p>
    <strong class="case-proof">${escapeHtml(study.proof)}</strong>
    <ul class="tag-list" aria-label="Case study topics">${list(study.tags, (tag) => `<li>${escapeHtml(tag)}</li>`)}</ul>
    <details class="case-detail"><summary>Read the engineering breakdown <span aria-hidden="true">＋</span></summary><dl>${Object.entries(study.story).map(([term, detail]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(detail)}</dd></div>`).join('')}</dl></details>
  </article>`;

export const Work = ({ caseStudies }) => `
  <section class="section work-section" id="work" aria-labelledby="work-title" data-testid="work-section">
    ${sectionHeading({ kicker: '05 / Selected engineering work', title: 'Evidence from the hard parts.', description: 'Generalized engineering narratives preserve the problem, risk, decisions, safeguards, and lessons without exposing confidential systems.', id: 'work-title' })}
    <div class="case-grid">${list(caseStudies, CaseStudy)}</div>
    <p class="confidentiality-note">Client identifiers, private endpoints, credentials, production data, and proprietary implementation details are intentionally excluded.</p>
  </section>`;

export const AiAugmented = ({ aiAugmented }) => `
  <section class="ai-section" id="ai-augmented" aria-labelledby="ai-title">
    <div class="section ai-inner">
      <div class="ai-copy"><p class="section-kicker">06 / AI-augmented quality engineering</p><h2 id="ai-title">${escapeHtml(aiAugmented.title)}</h2><p>${escapeHtml(aiAugmented.description)}</p></div>
      <div class="ai-model">
        <div><p class="diagram-label">Accelerated analysis</p><ul>${list(aiAugmented.responsibilities, (item) => `<li><span aria-hidden="true">↗</span>${escapeHtml(item)}</li>`)}</ul></div>
        <div class="authority-panel"><p class="diagram-label">Sources of truth</p><ol>${list(aiAugmented.authorities, (item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(item)}</li>`)}</ol></div>
      </div>
    </div>
  </section>`;

export const CapabilityMap = ({ capabilities }) => `
  <section class="capability-section" id="capabilities" aria-labelledby="capability-title"><div class="section capability-inner">
    <div class="capability-heading"><p class="section-kicker">07 / Engineering toolkit</p><h2 id="capability-title">Capabilities organized by engineering domain.</h2><p>Tools support the quality system. They do not replace strategy, risk analysis, or engineering judgment.</p></div>
    <div class="capability-groups">${list(capabilities, (group) => `<section><h3>${escapeHtml(group.title)}</h3><ul>${list(group.items, (item) => `<li>${escapeHtml(item)}</li>`)}</ul></section>`)}</div>
  </div></section>`;

export const Experience = ({ experience, perspective }) => `
  <section class="section experience-section" id="experience" aria-labelledby="experience-title">
    ${sectionHeading({ kicker: '08 / Experience', title: 'Built through real delivery.', description: 'Professional scope and responsibility, kept concise and privacy-aware.', id: 'experience-title' })}
    <div class="experience-layout"><div class="timeline">${list(experience, (item) => `<article><div class="timeline-marker" aria-hidden="true"><span></span></div><p class="timeline-period">${escapeHtml(item.period)}</p><div class="timeline-copy"><span>${escapeHtml(item.scope)}</span><h3>${escapeHtml(item.role)}</h3><p>${escapeHtml(item.outcome)}</p></div></article>`)}</div><aside class="perspective-panel" aria-labelledby="perspective-title"><p class="diagram-label">Engineering perspective</p><h3 id="perspective-title">Quality is a property of the system.</h3>${list(perspective, (paragraph) => `<p>${escapeHtml(paragraph)}</p>`)}</aside></div>
  </section>`;

export const Contact = ({ contact, profile }) => `
  <section class="section contact-section" id="contact" aria-labelledby="contact-title"><p class="section-kicker">09 / Contact</p><h2 id="contact-title">${escapeHtml(contact.title)}</h2><p>${escapeHtml(contact.body)}</p><div class="contact-actions"><a class="button button-dark" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(contact.primaryLabel)} <span aria-hidden="true">↗</span></a><nav class="contact-links" aria-label="Contact options"><a href="mailto:${escapeHtml(profile.email)}">Email</a>${list(profile.socialLinks, (link) => externalLink(link))}</nav></div><p class="cv-note">${escapeHtml(contact.resumeNote)}</p></section>`;

export const Footer = ({ profile }) => `
  <footer><a class="footer-brand" href="#top"><span aria-hidden="true">AS</span>${escapeHtml(profile.name)}</a><p>© 2026 · Designed with care, tested with purpose.</p><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
  <button class="scroll-top" type="button" aria-label="Back to top" title="Back to top">↑</button>`;
