import { escapeHtml, externalLink, list, sectionHeading } from './html.mjs';

export const Header = ({ profile, navigation }) => `
  <header class="site-header" data-testid="site-header">
    <div class="nav-shell">
      <a class="brand" href="#top" aria-label="${escapeHtml(profile.name)}, home">
        <span class="brand-mark" aria-hidden="true">AS</span>
        <span class="brand-copy"><strong>${escapeHtml(profile.name)}</strong><small>Quality engineering</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span>Menu</span><i aria-hidden="true"></i></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
        ${list(navigation, (item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)}
        <a class="nav-contact" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
        <button class="theme-toggle" type="button" aria-label="Switch to dark theme" aria-pressed="false" data-theme-toggle><span aria-hidden="true">◐</span><b>Theme</b></button>
      </nav>
    </div>
  </header>`;

const QualitySignal = ({ qualitySignal }) => `
  <aside class="quality-card" aria-labelledby="quality-signal-title">
    <p class="visualization-note">${escapeHtml(qualitySignal.label)}</p>
    <div class="card-label">
      <span class="signal-mark" aria-hidden="true">↗</span>
      <span id="quality-signal-title">${escapeHtml(qualitySignal.title)}</span>
      <strong><i aria-hidden="true"></i>${escapeHtml(qualitySignal.state)}</strong>
    </div>
    <ul>${list(qualitySignal.signals, (signal) => `<li><span>${escapeHtml(signal.label)}</span><b><span aria-hidden="true">✓</span> ${escapeHtml(signal.state)}</b></li>`)}</ul>
    <div class="quality-bar" aria-hidden="true"><span></span></div>
  </aside>`;

export const Hero = ({ profile, hero, qualitySignal }) => `
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero-copy" data-reveal="up">
      <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(hero.eyebrow)}</p>
      <h1 id="hero-title">I engineer <em>confidence</em> into complex software.</h1>
      <p class="hero-lead">${escapeHtml(hero.lead)}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="${escapeHtml(hero.primaryCta.href)}">${escapeHtml(hero.primaryCta.label)} <span aria-hidden="true">↘</span></a>
        <a class="button button-secondary" href="${escapeHtml(hero.secondaryCta.href)}">${escapeHtml(hero.secondaryCta.label)} <span aria-hidden="true">↗</span></a>
      </div>
      <div class="hero-proof" aria-label="Professional profiles and availability">
        <span class="availability"><i aria-hidden="true"></i>${escapeHtml(hero.availability)}</span>
        ${list(profile.socialLinks, (link) => externalLink(link))}
      </div>
    </div>
    <div class="hero-visual" data-reveal="scale">
      <div class="hero-grid-lines" aria-hidden="true"></div>
      <figure class="portrait-card">
        <picture><source srcset="./${escapeHtml(profile.portrait.webp)}" type="image/webp"><img src="./${escapeHtml(profile.portrait.fallback)}" alt="${escapeHtml(profile.portrait.alt)}" width="${profile.portrait.width}" height="${profile.portrait.height}" fetchpriority="high"></picture>
        <figcaption><span>Based in ${escapeHtml(profile.location)}</span><span>Working globally</span></figcaption>
      </figure>
      ${QualitySignal({ qualitySignal })}
      <div class="speed-badge" aria-hidden="true"><strong>≈95%</strong><span>shorter<br>regression</span></div>
    </div>
  </section>`;

export const ProofStrip = ({ metrics }) => `
  <section class="proof-strip" aria-labelledby="proof-title">
    <div class="proof-strip-inner">
      <h2 id="proof-title">Selected proof</h2>
      ${list(metrics, (metric) => `<div class="proof-item"><strong>${escapeHtml(metric.value)}</strong><p>${escapeHtml(metric.label)}</p></div>`)}
    </div>
  </section>`;

export const HowIHelp = ({ help }) => `
  <section class="section" id="help" aria-labelledby="help-title">
    ${sectionHeading({ kicker: '01 / How I help', title: 'Quality work that earns its place.', description: 'Each capability starts with an engineering problem, applies an intervention, and ends in a clearer decision—not a longer tool list.', id: 'help-title' })}
    <div class="help-grid">
      ${list(help, (item) => `<article class="help-card help-card-${escapeHtml(item.tone)}" data-reveal="up">
        <span class="card-index">${escapeHtml(item.number)}</span><h3>${escapeHtml(item.title)}</h3>
        <dl class="problem-map"><div><dt>Problem</dt><dd>${escapeHtml(item.problem)}</dd></div><div><dt>Intervention</dt><dd>${escapeHtml(item.intervention)}</dd></div><div><dt>Outcome</dt><dd>${escapeHtml(item.outcome)}</dd></div></dl>
        <ul>${list(item.evidence, (entry) => `<li>${escapeHtml(entry)}</li>`)}</ul>
      </article>`)}
    </div>
  </section>`;

const CaseVisual = ({ visual }) => {
  if (visual.scenarios) return `<div class="state-matrix" aria-label="${escapeHtml(visual.label)}">${list(visual.scenarios, (scenario) => `<span>${escapeHtml(scenario)}</span>`)}</div>`;
  return `<div class="case-impact${visual.type === 'risk' ? ' case-impact-amber' : ''}"><span>${escapeHtml(visual.label)}</span><strong>${escapeHtml(visual.value)}</strong><p>${escapeHtml(visual.detail)}</p></div>`;
};

const CaseStudy = (study) => `
  <article class="case-card" data-reveal="up" id="${escapeHtml(study.id)}">
    <div class="case-number">${escapeHtml(study.number)} <span>${escapeHtml(study.category)}</span></div>
    <div class="case-main">
      <p class="case-eyebrow">${escapeHtml(study.eyebrow)}</p><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.summary)}</p>
      <ul class="tag-list" aria-label="Case study topics">${list(study.tags, (tag) => `<li>${escapeHtml(tag)}</li>`)}</ul>
      <details class="case-detail"><summary>Read the engineering breakdown <span aria-hidden="true">＋</span></summary><dl>${Object.entries(study.story).map(([term, detail]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(detail)}</dd></div>`).join('')}</dl></details>
    </div>
    ${CaseVisual({ visual: study.visual })}
  </article>`;

export const Work = ({ caseStudies }) => `
  <section class="section work-section" id="work" aria-labelledby="work-title">
    ${sectionHeading({ kicker: '02 / Selected work', title: 'Evidence from the hard parts.', description: 'Generalized case studies explain context, diagnosis, decisions, safeguards, outcomes, and lessons without exposing confidential systems.', id: 'work-title' })}
    <div class="case-grid">${list(caseStudies, CaseStudy)}</div>
    <p class="confidentiality-note">Client identifiers, private endpoints, credentials, production data, and proprietary implementation details are intentionally excluded.</p>
  </section>`;

export const QualitySystem = ({ qualitySystem }) => `
  <section class="quality-system-section" id="quality-system" aria-labelledby="quality-system-title">
    <div class="section quality-system-inner">
      <div class="quality-system-heading" data-reveal="up"><p class="section-kicker">03 / Quality system</p><h2 id="quality-system-title">Quality is a chain of evidence.</h2><p>A test becomes useful when it connects product risk to observable behavior, a release decision, and feedback that improves the system.</p></div>
      <ol class="system-flow" aria-label="Quality system flow">${list(qualitySystem, (step, index) => `<li data-reveal="up"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(step.title)}</strong><small>${escapeHtml(step.detail)}</small></div></li>`)}</ol>
    </div>
  </section>`;

export const ReleaseLab = ({ lab }) => `
  <section class="lab-section" id="lab" aria-labelledby="lab-title"><div class="section lab-inner">
    <div class="lab-copy" data-reveal="up"><p class="section-kicker">04 / ${escapeHtml(lab.title)}</p><h2 id="lab-title">Watch a quality gate think.</h2><p>${escapeHtml(lab.description)}</p><button class="button lab-button" id="run-suite" type="button" data-testid="run-suite"><span class="play-mark" aria-hidden="true">▶</span><span class="button-label">Run the demo suite</span></button><p class="lab-note">No real systems are contacted. Every state and result is deterministic portfolio demonstration data.</p></div>
    <div class="lab-console" data-testid="lab-console" data-run-state="idle" data-reveal="scale">
      <div class="lab-console-head"><div><span class="terminal-mark" aria-hidden="true">AS</span><p><strong>release-confidence</strong><small>critical-path evidence pipeline</small></p></div><span class="suite-state"><i aria-hidden="true"></i><b data-testid="suite-state">Ready</b></span></div>
      <div class="progress-wrap"><div class="progress-label"><span>Pipeline progress</span><b class="progress-value">0%</b></div><div class="progress-track" role="progressbar" aria-label="Demo suite progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-progress="0"><span class="progress-fill"></span></div></div>
      <ol class="pipeline" aria-label="Automated quality pipeline" data-testid="pipeline">${list(lab.stages, (stage, index) => `<li data-stage="${escapeHtml(stage.id)}" data-state="pending" data-evidence="${escapeHtml(stage.evidence)}"><span class="stage-index">${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.detail)}</small></div><b>Waiting</b></li>`)}</ol>
      <div class="lab-result" aria-live="polite" aria-atomic="true"><div class="result-icon" aria-hidden="true">✓</div><p><span>Release signal</span><strong data-testid="result-summary">Ready to run</strong></p><small class="result-time">—</small></div>
    </div>
  </div></section>`;

export const Principles = ({ principles }) => `
  <section class="section principles-section" aria-labelledby="principles-title">
    ${sectionHeading({ kicker: '05 / Engineering principles', title: 'A practical quality mindset.', description: 'Working principles that change what gets tested, how evidence is read, and how release decisions are made.', id: 'principles-title' })}
    <div class="principles-grid">${list(principles, (item, index) => `<article data-reveal="up"><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`)}</div>
  </section>`;

export const CapabilityMap = ({ capabilities }) => `
  <section class="capability-section" aria-labelledby="capability-title"><div class="section capability-inner">
    <div class="capability-heading" data-reveal="up"><p class="section-kicker">Capability map</p><h2 id="capability-title">A toolkit organized around outcomes.</h2><p>Tools support the quality system; they do not replace engineering judgment.</p></div>
    <div class="capability-groups" data-reveal="up">${list(capabilities, (group) => `<div><h3>${escapeHtml(group.title)}</h3><ul>${list(group.items, (item) => `<li>${escapeHtml(item)}</li>`)}</ul></div>`)}</div>
  </div></section>`;

export const Experience = ({ experience }) => `
  <section class="section experience-section" id="experience" aria-labelledby="experience-title">
    ${sectionHeading({ kicker: '06 / Experience', title: 'Built through real delivery.', description: 'Scope, responsibility, and meaningful outcome—kept concise and privacy-aware.', id: 'experience-title' })}
    <div class="timeline">${list(experience, (item) => `<article data-reveal="up"><div class="timeline-marker" aria-hidden="true"><span></span></div><p class="timeline-period">${escapeHtml(item.period)}</p><div class="timeline-copy"><span>${escapeHtml(item.scope)}</span><h3>${escapeHtml(item.role)}</h3><p>${escapeHtml(item.outcome)}</p></div></article>`)}</div>
  </section>`;

export const About = ({ about }) => `
  <section class="section about-section" id="about" aria-labelledby="about-title"><div class="about-panel"><div data-reveal="up"><p class="section-kicker">07 / About</p><h2 id="about-title">Quality is an engineering property.</h2></div><div class="about-copy" data-reveal="up">${list(about, (paragraph) => `<p>${escapeHtml(paragraph)}</p>`)}</div></div></section>`;

export const Contact = ({ contact, profile }) => `
  <section class="section contact-section" id="contact" aria-labelledby="contact-title" data-reveal="scale"><div class="contact-orb" aria-hidden="true"></div><p class="section-kicker">08 / Contact</p><h2 id="contact-title">${escapeHtml(contact.title)}</h2><p>${escapeHtml(contact.body)}</p><div class="contact-actions"><a class="button button-dark" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(contact.primaryLabel)} <span aria-hidden="true">↗</span></a><nav class="contact-links" aria-label="Contact options"><a href="mailto:${escapeHtml(profile.email)}">Email</a>${list(profile.socialLinks, (link) => externalLink(link))}</nav></div><p class="cv-note">${escapeHtml(contact.resumeNote)}</p></section>`;

export const Footer = ({ profile }) => `
  <footer><a class="footer-brand" href="#top"><span aria-hidden="true">AS</span>${escapeHtml(profile.name)}</a><p>© 2026 · Designed with care, tested with purpose.</p><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
  <button class="scroll-top" type="button" aria-label="Back to top" title="Back to top">↑</button>`;
