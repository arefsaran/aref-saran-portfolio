import { escapeHtml, externalLink, list, sectionHeading } from './html.mjs';

export const Header = ({ profile, navigation }) => `
  <header class="site-header" data-testid="site-header">
    <div class="nav-shell">
      <a class="brand" href="#top" aria-label="${escapeHtml(profile.name)}, home">
        <span class="brand-mark" aria-hidden="true">AS</span>
        <span class="brand-name">${escapeHtml(profile.name)}</span>
      </a>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav" data-menu-toggle>
        <span class="menu-icon" aria-hidden="true"><i></i><i></i></span>
      </button>
      <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
        ${list(navigation, (item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)}
      </nav>
    </div>
  </header>`;

export const Hero = ({ profile, hero, proof }) => `
  <section class="hero major-area" id="top" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>
      <p class="hero-identity">${escapeHtml(hero.roleLine)}</p>
      <h1 id="hero-title">${escapeHtml(hero.headline)}</h1>
      <p class="hero-lead">${escapeHtml(hero.lead)}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="${escapeHtml(hero.primaryCta.href)}">${escapeHtml(hero.primaryCta.label)} <span aria-hidden="true">↓</span></a>
        <a class="button button-secondary" href="${escapeHtml(hero.secondaryCta.href)}">${escapeHtml(hero.secondaryCta.label)}</a>
      </div>
      <div class="hero-evidence" aria-label="Selected evidence">
        <div><strong>${escapeHtml(proof[0].value)}</strong><span>automated checks</span></div>
        <div><strong>${escapeHtml(proof[1].value)}</strong><span>regression feedback</span></div>
      </div>
      <div class="hero-context">
        <span>${escapeHtml(hero.context)}</span>
        <span>${escapeHtml(hero.availability)}</span>
      </div>
    </div>
    <figure class="portrait">
      <picture>
        <source srcset="./${escapeHtml(profile.portrait.webp)}" type="image/webp">
        <img src="./${escapeHtml(profile.portrait.fallback)}" alt="${escapeHtml(profile.portrait.alt)}" width="${profile.portrait.width}" height="${profile.portrait.height}" fetchpriority="high" decoding="async">
      </picture>
      <figcaption>${escapeHtml(profile.specialization)}</figcaption>
    </figure>
  </section>`;

export const Proof = ({ proof }) => `
  <section class="proof-section major-area" aria-labelledby="proof-title">
    <div class="proof-inner">
      <div class="proof-intro">
        <p class="eyebrow">Selected proof</p>
        <h2 id="proof-title">Evidence before claims.</h2>
      </div>
      <dl class="proof-grid">
        ${list(proof, (item) => `<div><dt>${escapeHtml(item.value)}</dt><dd>${escapeHtml(item.label)}</dd></div>`)}
      </dl>
    </div>
  </section>`;

export const HowIHelp = ({ services }) => `
  <section class="section services-section major-area" id="services" aria-labelledby="services-title">
    ${sectionHeading({
      eyebrow: 'How I help',
      title: 'Solve the quality problem behind the test request.',
      description: 'Tools are selected after the risk is understood. The goal is a system that gives the team clearer, faster, more dependable decisions.',
      id: 'services-title'
    })}
    <div class="services-grid">
      ${list(services, (service) => `<article class="service-card">
        <h3>${escapeHtml(service.title)}</h3>
        <dl>
          <div><dt>Problem</dt><dd>${escapeHtml(service.problem)}</dd></div>
          <div><dt>What I do</dt><dd>${escapeHtml(service.action)}</dd></div>
          <div class="service-outcome"><dt>Outcome</dt><dd>${escapeHtml(service.outcome)}</dd></div>
        </dl>
      </article>`)}
    </div>
  </section>`;

const CaseStudy = (study, index) => `
  <article class="case-study${index === 0 ? ' case-study-featured' : ''}" id="${escapeHtml(study.id)}">
    <header class="case-header">
      <div>
        <p class="eyebrow">${escapeHtml(study.category)}</p>
        <h3>${escapeHtml(study.title)}</h3>
        <p>${escapeHtml(study.summary)}</p>
      </div>
      <div class="case-metric"><strong>${escapeHtml(study.metric.value)}</strong><span>${escapeHtml(study.metric.label)}</span></div>
    </header>
    <dl class="case-scan">
      ${list(study.scan, (item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.text)}</dd></div>`)}
    </dl>
    ${study.scenarios ? `<ul class="scenario-list" aria-label="Representative scenarios">${list(study.scenarios, (scenario) => `<li>${escapeHtml(scenario)}</li>`)}</ul>` : ''}
    <details class="case-detail">
      <summary><span>View engineering breakdown</span><i aria-hidden="true"></i></summary>
      <dl class="case-detail-content">${Object.entries(study.details).map(([term, detail]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(detail)}</dd></div>`).join('')}</dl>
    </details>
  </article>`;

export const SelectedWork = ({ caseStudies }) => `
  <section class="section work-section major-area" id="work" aria-labelledby="work-title" data-testid="work-section">
    ${sectionHeading({
      eyebrow: 'Selected work',
      title: 'Evidence from consequential engineering problems.',
      description: 'Each case is generalized to protect private systems while preserving the problem, the engineering decision, and the verified outcome.',
      id: 'work-title'
    })}
    <div class="case-list">${list(caseStudies, CaseStudy)}</div>
    <p class="confidentiality-note">Client identifiers, private endpoints, credentials, production data, and proprietary implementation details are intentionally excluded.</p>
  </section>`;

export const QualityApproach = ({ qualityApproach }) => `
  <section class="approach-section major-area" id="approach" aria-labelledby="approach-title">
    <div class="section approach-inner">
      ${sectionHeading({
        eyebrow: 'Quality engineering approach',
        title: qualityApproach.title,
        description: qualityApproach.description,
        id: 'approach-title'
      })}
      <ol class="approach-flow" aria-label="Quality engineering flow">
        ${list(qualityApproach.steps, (step) => `<li><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.body)}</p></li>`)}
      </ol>
      <aside class="approach-principle" aria-labelledby="principle-title">
        <p class="eyebrow">Fintech & workflow quality</p>
        <h3 id="principle-title">${escapeHtml(qualityApproach.principle.title)}</h3>
        <p>${escapeHtml(qualityApproach.principle.body)}</p>
      </aside>
    </div>
  </section>`;

export const ExperienceCapabilities = ({ experience, capabilities, aiPractice, perspective }) => `
  <section class="section experience-section major-area" id="experience" aria-labelledby="experience-title">
    ${sectionHeading({
      eyebrow: 'Experience & capabilities',
      title: 'Systems thinking, built through delivery.',
      description: perspective,
      id: 'experience-title'
    })}
    <div class="experience-capabilities">
      <div class="experience-column">
        <h3 class="column-title">Experience</h3>
        <ol class="timeline">
          ${list(experience, (item) => `<li>
            <p class="timeline-period">${escapeHtml(item.period)}</p>
            <div><span>${escapeHtml(item.scope)}</span><h4>${escapeHtml(item.role)}</h4><p>${escapeHtml(item.outcome)}</p></div>
          </li>`)}
        </ol>
      </div>
      <div class="capabilities-column">
        <h3 class="column-title">Capabilities</h3>
        <div class="capability-groups">
          ${list(capabilities, (group) => `<section><h4>${escapeHtml(group.title)}</h4><ul>${list(group.items, (item) => `<li>${escapeHtml(item)}</li>`)}</ul></section>`)}
        </div>
        <aside class="ai-practice" aria-labelledby="ai-practice-title">
          <h4 id="ai-practice-title">${escapeHtml(aiPractice.title)}</h4>
          <p>${escapeHtml(aiPractice.body)}</p>
          <ul>${list(aiPractice.items, (item) => `<li>${escapeHtml(item)}</li>`)}</ul>
        </aside>
      </div>
    </div>
  </section>`;

export const Contact = ({ contact, profile }) => `
  <section class="section contact-section major-area" id="contact" aria-labelledby="contact-title">
    <div class="contact-panel">
      <div class="contact-copy">
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">${escapeHtml(contact.title)}</h2>
        <p>${escapeHtml(contact.body)}</p>
        <ul class="contact-reasons">${list(contact.reasons, (reason) => `<li>${escapeHtml(reason)}</li>`)}</ul>
      </div>
      <div class="contact-actions">
        <a class="button button-primary" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(contact.primaryLabel)} <span aria-hidden="true">↗</span></a>
        <nav class="contact-links" aria-label="Professional profiles">
          ${list(profile.socialLinks, (link) => externalLink(link))}
        </nav>
        <p>${escapeHtml(contact.resumeNote)}</p>
      </div>
    </div>
  </section>`;

export const Footer = ({ profile, footerStatement }) => `
  <footer class="site-footer">
    <div>
      <a class="footer-brand" href="#top" aria-label="${escapeHtml(profile.name)}, back to top"><span aria-hidden="true">AS</span>${escapeHtml(profile.name)}</a>
      <p>${escapeHtml(footerStatement)}</p>
    </div>
    <nav aria-label="Footer links"><a href="mailto:${escapeHtml(profile.email)}">Email</a>${list(profile.socialLinks, (link) => externalLink(link))}</nav>
    <p>© 2026 ${escapeHtml(profile.name)}</p>
  </footer>`;
