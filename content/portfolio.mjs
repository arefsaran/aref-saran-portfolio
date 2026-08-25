const portfolio = {
  site: {
    url: 'https://arefsaran.ir/',
    title: 'Aref Saran — Senior Test Engineer',
    description: 'Aref Saran is a Senior Test Engineer who builds test automation and quality systems for complex fintech, API, integration, and BPMN/Camunda workflows.',
    socialDescription: 'Senior Test Engineer making complex software safer to change, faster to validate, and easier to trust.',
    socialImage: 'og-card-senior.jpg',
    language: 'en',
    lastModified: '2026-08-25',
    themeColor: '#f7f7f5'
  },
  profile: {
    name: 'Aref Saran',
    role: 'Senior Test Engineer',
    specialization: 'Test Automation & Quality Systems',
    location: 'Tehran',
    portrait: {
      webp: 'assets/aref-saran-profile.webp',
      fallback: 'assets/aref-saran-profile.png',
      width: 735,
      height: 861,
      alt: 'Portrait of Aref Saran, Senior Test Engineer'
    },
    email: 'arefsaran@gmail.com',
    education: 'Lorestan University',
    socialLinks: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/arefsaran' },
      { label: 'GitHub', href: 'https://github.com/arefsaran' }
    ]
  },
  navigation: [
    { label: 'How I help', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Approach', href: '#approach' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ],
  hero: {
    eyebrow: 'Quality Engineer · Automation · Complex Systems',
    roleLine: 'Aref Saran · Senior Test Engineer',
    headline: 'I engineer confidence into complex software.',
    lead: 'I help teams make critical systems safer to change, faster to validate, and easier to trust through automation architecture, risk-based quality engineering, and reliable delivery evidence.',
    primaryCta: { label: 'View selected work', href: '#work' },
    secondaryCta: { label: 'Contact me', href: '#contact' },
    context: 'Fintech · BPMN / Camunda · API & integration',
    availability: 'Based in Tehran · Working globally'
  },
  proof: [
    { value: '2,300+', label: 'Automated API and integration checks maintained' },
    { value: '39h → 2h', label: 'Regression feedback' },
    { value: '≈95%', label: 'Shorter regression cycle' },
    { value: 'API · Integration · E2E · Performance', label: 'Coverage layers' }
  ],
  services: [
    {
      title: 'Quality strategy',
      problem: 'Critical paths are covered unevenly and release risk is difficult to explain.',
      action: 'Translate business impact and failure probability into coverage priorities, negative paths, and release criteria.',
      outcome: 'A quality strategy the team can defend and evolve.'
    },
    {
      title: 'Automation architecture',
      problem: 'Slow or brittle suites delay decisions instead of supporting them.',
      action: 'Design maintainable layers, isolated data, reusable behavior, diagnostics, and deterministic execution.',
      outcome: 'Faster feedback that remains trustworthy.'
    },
    {
      title: 'Complex systems quality',
      problem: 'A passing endpoint can hide broken workflow, database, provider, or financial state.',
      action: 'Correlate APIs, BPMN/Camunda transitions, persistence, callbacks, retries, and side effects.',
      outcome: 'Evidence of business correctness—not merely HTTP success.'
    },
    {
      title: 'Delivery & performance',
      problem: 'Quality evidence arrives after the change is already expensive to fix.',
      action: 'Place risk-based smoke, regression, k6 baselines, and explicit quality gates in CI.',
      outcome: 'Earlier release signals with actionable evidence.'
    }
  ],
  caseStudies: [
    {
      id: 'regression-architecture',
      category: 'Automation architecture',
      title: '39 hours became a two-hour signal.',
      summary: 'A 2,300+ check API and integration suite needed faster release feedback without sacrificing isolation, diagnostics, or intent.',
      metric: { value: '39h → 2h', label: 'regression feedback' },
      scan: [
        { label: 'Problem', text: 'A complete regression took approximately 39 hours—too late for routine release decisions.' },
        { label: 'Decision', text: 'Segment suites by purpose, isolate test data, and introduce safe parallelism before adding concurrency.' },
        { label: 'Outcome', text: 'Feedback fell to approximately two hours, about 95% shorter, while failures remained diagnosable.' }
      ],
      details: {
        Context: 'More than 2,300 API and integration checks protected transaction-heavy workflows.',
        Risk: 'Late feedback pushed meaningful evidence away from the engineering decision that needed it.',
        Constraints: 'The suite still needed deterministic data, readable failures, safe reruns, and a comprehensive validation layer.',
        Approach: 'Separate smoke, targeted regression, and nightly intent; make execution boundaries independent; parallelize only safe suites.',
        Verification: 'Keep failures observable, avoid hiding instability behind retries, and retain deliberate comprehensive coverage.',
        Lesson: 'Fast feedback stays trustworthy when isolation, observability, and suite purpose are designed together.'
      }
    },
    {
      id: 'provider-virtualization',
      category: 'Service virtualization',
      title: 'External failure, made repeatable.',
      summary: 'Provider behavior was brought under test control so critical failure paths could run on demand instead of by chance.',
      metric: { value: 'Deterministic', label: 'provider behavior' },
      scan: [
        { label: 'Problem', text: 'External dependencies made timeout, retry, malformed-response, and callback paths difficult to reproduce.' },
        { label: 'Decision', text: 'Model explicit provider states with controlled payloads, timing, failures, and interaction evidence.' },
        { label: 'Outcome', text: 'Critical dependency paths became repeatable, diagnosable, and safe to exercise in automation.' }
      ],
      scenarios: ['Success', 'Timeout', 'Retry', 'Invalid response', 'Partial failure'],
      details: {
        Context: 'Critical workflows depended on provider responses that were not reliably reproducible in test environments.',
        Risk: 'Important negative paths could remain untested or fail intermittently for reasons unrelated to the product.',
        Constraints: 'The test double had to model explicit contracts without exposing or pretending to reproduce confidential provider architecture.',
        Approach: 'Give each provider scenario named inputs, outputs, timing, and failure semantics.',
        Verification: 'Connect each controlled state to targeted assertions, provider interactions, business state, and rerun safety.',
        Lesson: 'A deterministic failure is more useful than an occasional realistic one when dependable validation is the goal.'
      }
    },
    {
      id: 'workflow-correctness',
      category: 'Fintech workflow quality',
      title: 'Protecting critical financial workflows.',
      summary: 'Purchase, refund, billing, settlement, and credit flows require evidence across process state, persistence, providers, and financial side effects.',
      metric: { value: 'State + side effects', label: 'synchronized evidence' },
      scan: [
        { label: 'Problem', text: 'An HTTP success could still hide an incorrect workflow path, transaction, callback, or duplicate financial effect.' },
        { label: 'Decision', text: 'Treat the workflow as a state machine and define synchronized oracles for every consequential transition.' },
        { label: 'Outcome', text: 'Validation described whether the business operation was correct—not simply whether an endpoint responded.' }
      ],
      scenarios: ['Purchase', 'Refund', 'Settlement', 'Idempotency', 'DB evidence'],
      details: {
        Context: 'Financial workflows crossed services, provider behavior, Camunda process state, and persistent business state.',
        Risk: 'Retries, timers, callbacks, or replays could create stale state, lost transitions, or duplicate effects.',
        Constraints: 'Public evidence remains generalized and excludes private systems, production data, and proprietary architecture.',
        Approach: 'Correlate API results with process instances, active tasks, history, database state, provider interactions, and financial invariants.',
        Verification: 'Assert intended effects, forbidden effects, retry behavior, and replay safety before accepting the final state.',
        Lesson: 'Workflow quality lives in the agreement between every observable state.'
      }
    }
  ],
  qualityApproach: {
    title: 'From risk to a release decision.',
    description: 'The useful output of quality engineering is not a test count. It is timely, traceable evidence that helps a team decide what is safe to ship.',
    steps: [
      { title: 'Risk', body: 'Prioritize probability × impact, especially money movement, retries, callbacks, and state transitions.' },
      { title: 'Strategy', body: 'Choose scenarios, boundaries, negative paths, and the right level of coverage for the decision.' },
      { title: 'Automation', body: 'Build reusable, isolated checks across APIs, UI, services, databases, and workflows.' },
      { title: 'Evidence', body: 'Correlate responses with system state, side effects, diagnostics, and explicit failure signals.' },
      { title: 'Release decision', body: 'Move the right evidence into feature branches, merge requests, regression, and performance gates.' }
    ],
    principle: {
      title: 'HTTP success is not business correctness.',
      body: 'Financial and BPMN workflows still require the expected process path, database state, provider behavior, idempotency, and final side effect to agree.'
    }
  },
  experience: [
    {
      period: '2023 — Present',
      scope: 'Fintech quality engineering',
      role: 'Software Test Engineer',
      outcome: 'Automation architecture, API and integration coverage, BPMN workflow validation, performance testing, quality gates, and deterministic evidence across complex credit and banking workflows.'
    },
    {
      period: '2021 — 2023',
      scope: 'E-commerce quality',
      role: 'Software Test Engineer',
      outcome: 'Quality coverage connected storefront setup, checkout, payments, orders, responsive UI, provider integrations, and release readiness.'
    },
    {
      period: '2017 — 2022',
      scope: 'Lorestan University',
      role: 'B.Sc. in Computer Engineering',
      outcome: 'The technical foundation behind a career built around systems thinking, careful investigation, and dependable software.'
    }
  ],
  capabilities: [
    {
      title: 'Quality Engineering',
      items: ['Risk-Based Testing', 'API Testing', 'Integration Testing', 'E2E Testing', 'Exploratory Testing', 'Cross-browser & Responsive Testing']
    },
    {
      title: 'Automation',
      items: ['Robot Framework', 'Python', 'JavaScript', 'Playwright', 'Service Virtualization', 'Mock Servers']
    },
    {
      title: 'Systems',
      items: ['BPMN / Camunda', 'MySQL', 'MongoDB', 'Redis', 'API Integrations', 'Financial Workflows']
    },
    {
      title: 'Delivery',
      items: ['GitLab CI', 'Docker', 'k6', 'Quality Gates', 'Performance Testing', 'Feature-branch Testing']
    }
  ],
  aiPractice: {
    title: 'AI-assisted engineering workflow',
    body: 'AI accelerates repository analysis, test design, failure investigation, and review. Engineering judgment—and evidence from source code, contracts, deterministic tests, databases, and runtime behavior—remains the decision layer.',
    items: ['Repository analysis', 'Test-design assistance', 'Failure investigation', 'Code review support']
  },
  perspective: 'I am most useful where software has meaningful state, external dependencies, and a real cost to getting the answer wrong.',
  contact: {
    title: 'Have a quality problem worth solving?',
    body: 'Let’s talk about making a complex system easier to validate and safer to change.',
    reasons: ['Quality Engineering roles', 'Automation architecture', 'Fintech & workflow testing', 'API & integration strategy', 'CI quality gates', 'Performance engineering'],
    primaryLabel: 'Email Aref',
    resumeNote: 'A current public résumé is available by email.'
  },
  footerStatement: 'Quality engineering for complex software systems.'
};

export default portfolio;
