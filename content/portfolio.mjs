const portfolio = {
  site: {
    url: 'https://arefsaran.ir/',
    title: 'Aref Saran — Quality Engineer',
    description: 'Aref Saran is a Quality Engineer designing resilient test automation, API coverage, and quality systems for complex fintech products.',
    socialDescription: 'Test automation architecture, risk-based API testing, and quality systems for software that needs to ship with confidence.',
    socialImage: 'og-card.jpg',
    language: 'en',
    themeColors: { light: '#f4f1eb', dark: '#0d1822' }
  },
  profile: {
    name: 'Aref Saran',
    role: 'Quality Engineer',
    specialization: 'Test Automation & Quality Systems Engineer',
    location: 'Tehran',
    portrait: {
      webp: 'assets/aref-saran-profile.webp',
      fallback: 'assets/aref-saran-profile.png',
      width: 735,
      height: 861,
      alt: 'Portrait of Aref Saran'
    },
    email: 'arefsaran@gmail.com',
    education: 'Lorestan University',
    socialLinks: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/arefsaran' },
      { label: 'GitHub', href: 'https://github.com/arefsaran' }
    ]
  },
  navigation: [
    { label: 'Work', href: '#work' },
    { label: 'How I help', href: '#help' },
    { label: 'Quality system', href: '#quality-system' },
    { label: 'Experience', href: '#experience' },
    { label: 'About', href: '#about' }
  ],
  hero: {
    eyebrow: 'Quality Engineer · Automation · Complex Systems',
    headline: 'I engineer confidence into complex software.',
    lead: 'I help teams make software safer to change, faster to validate, and easier to trust—through quality architecture, automation, risk-based testing, and fast engineering feedback.',
    primaryCta: { label: 'Explore my work', href: '#work' },
    secondaryCta: { label: 'Let’s talk', href: 'mailto:arefsaran@gmail.com' },
    availability: 'Open to thoughtful collaborations'
  },
  qualitySignal: {
    title: 'release-confidence',
    label: 'Portfolio visualization · not live infrastructure',
    state: 'Evidence ready',
    signals: [
      { label: 'Critical journeys', state: 'Mapped' },
      { label: 'API contracts', state: 'Checked' },
      { label: 'Integration state', state: 'Observed' },
      { label: 'Performance budget', state: 'Defined' },
      { label: 'Release evidence', state: 'Compiled' }
    ]
  },
  metrics: [
    { value: '2,300+', label: 'API & integration automated checks maintained' },
    { value: '39h → 2h', label: 'Regression feedback cycle' },
    { value: '≈95%', label: 'Shorter regression execution time' },
    { value: '4 layers', label: 'API · Integration · E2E · Performance' }
  ],
  help: [
    {
      number: '01', title: 'Quality strategy & risk', tone: 'blue',
      problem: 'Critical workflows can carry very different consequences while receiving equal testing attention.',
      intervention: 'Map product risk, expose failure modes, and choose coverage that matches consequence.',
      outcome: 'A clearer release decision built on the scenarios that matter most.',
      evidence: ['Risk-based testing', 'Exploratory thinking', 'Testability']
    },
    {
      number: '02', title: 'Automation architecture', tone: 'mint',
      problem: 'Large suites become slow, coupled, duplicated, and difficult to diagnose.',
      intervention: 'Design reusable automation layers, independent data, useful diagnostics, and safe parallel execution.',
      outcome: 'Maintainable automation and materially faster trustworthy feedback.',
      evidence: ['Robot Framework', 'Python', 'Suite design']
    },
    {
      number: '03', title: 'Systems & integration quality', tone: 'amber',
      problem: 'A successful response can hide incorrect state, side effects, or provider behavior.',
      intervention: 'Validate contracts, state transitions, idempotency, databases, and controlled failure paths.',
      outcome: 'Confidence across service boundaries, not merely at the HTTP layer.',
      evidence: ['API & integration', 'MySQL / MongoDB', 'Service virtualization']
    },
    {
      number: '04', title: 'Delivery & performance', tone: 'rose',
      problem: 'Late or noisy feedback makes quality a release bottleneck instead of a decision system.',
      intervention: 'Create CI quality gates, layered suites, performance baselines, and actionable evidence.',
      outcome: 'Faster engineering feedback without trading away repeatability.',
      evidence: ['GitLab CI', 'Docker', 'k6']
    }
  ],
  caseStudies: [
    {
      id: 'regression-architecture', number: '01', category: 'Automation at scale', eyebrow: 'Regression architecture',
      title: 'From 39 hours to a two-hour signal.',
      summary: 'A large API and integration suite had become too slow for useful release feedback. The response was architectural: isolate execution, segment intent, and preserve evidence.',
      tags: ['Parallel execution', 'Suite segmentation', 'CI feedback'],
      visual: { type: 'metric', label: 'Outcome', value: '≈95%', detail: 'shorter execution across 2,300+ checks' },
      story: {
        Context: 'More than 2,300 API and integration checks protected transaction-heavy workflows.',
        Problem: 'A complete regression cycle took approximately 39 hours, making the signal too late for routine release decisions.',
        Constraints: 'The suite still needed deterministic data, readable failures, safe reruns, and useful evidence for engineers.',
        Diagnosis: 'Execution time was not only a test-count problem. Suite coupling, shared data, and undifferentiated execution layers limited safe parallelism.',
        'Engineering decision': 'Separate feedback by purpose and make execution boundaries independent before increasing concurrency.',
        Implementation: 'Introduce smoke, targeted regression, and nightly layers; isolate test data; parallelize only safe suites; publish evidence through CI.',
        'Quality safeguards': 'Keep failures diagnosable, avoid hiding instability behind retries, and retain an intentional comprehensive layer.',
        Outcome: 'Regression execution fell from approximately 39 hours to approximately two hours—about 95% shorter.',
        Lessons: 'Fast feedback stays trustworthy when isolation, observability, and suite intent are designed together.'
      }
    },
    {
      id: 'provider-virtualization', number: '02', category: 'Deterministic testing', eyebrow: 'Service virtualization',
      title: 'Make external failure repeatable.',
      summary: 'Provider behavior was brought under test control so success and failure paths could be exercised on demand without relying on unpredictable third parties.',
      tags: ['Mock servers', 'Failure paths', 'Repeatability'],
      visual: { type: 'matrix', label: 'Controlled provider scenarios', scenarios: ['Success', 'Timeout', 'Retry', 'Invalid response', 'Partial failure'] },
      story: {
        Context: 'Critical workflows depended on external-provider responses that were not reliably reproducible in test environments.',
        Problem: 'Timeout, retry, malformed response, and partial-failure paths could not be exercised consistently.',
        Constraints: 'The test double needed explicit behavior without pretending to reproduce confidential provider architecture.',
        Diagnosis: 'Uncontrolled dependencies made failures intermittent and reduced confidence in both negative-path coverage and reruns.',
        'Engineering decision': 'Move provider behavior behind deterministic mock-server scenarios with explicit response contracts.',
        Implementation: 'Model success, timeout, retry, invalid-response, and partial-failure scenarios; connect each state to targeted assertions and evidence.',
        'Quality safeguards': 'Keep scenarios named, isolated, contract-focused, and clearly separate from live production behavior.',
        Outcome: 'External failure paths became repeatable, diagnosable, and available whenever the suite needed them.',
        Lessons: 'A deterministic failure is more useful than an occasional realistic one when the goal is dependable validation.'
      }
    },
    {
      id: 'financial-workflows', number: '03', category: 'Risk-based quality', eyebrow: 'Financial journeys',
      title: 'Protect the moments where mistakes matter most.',
      summary: 'Risk-based coverage combined API, state, and end-to-end evidence across purchase, refund, settlement, billing, coupon, and credit workflows.',
      tags: ['Idempotency', 'State validation', 'Risk coverage'],
      visual: { type: 'risk', label: 'Validation model', value: 'State + side effects', detail: 'negative paths · boundaries · idempotency' },
      story: {
        Context: 'Transaction workflows cross services, providers, and persistent business state.',
        Problem: 'A successful endpoint response alone cannot prove that balances, status transitions, or downstream effects are correct.',
        Constraints: 'Coverage must remain privacy-safe and avoid exposing production data or proprietary architecture.',
        Diagnosis: 'The highest risk sits in boundaries, repeated requests, partial progress, and disagreement between response and stored state.',
        'Engineering decision': 'Design scenarios around business risk and state transitions rather than endpoint count.',
        Implementation: 'Combine negative paths, boundary analysis, idempotency checks, state validation, database evidence, and critical end-to-end journeys.',
        'Quality safeguards': 'Assert both intended effects and forbidden side effects while keeping test data controlled and independent.',
        Outcome: 'Release evidence covered the financial journey as a stateful system rather than a sequence of isolated calls.',
        Lessons: 'Confidence comes from proving what changed, what did not, and what happens when the same request arrives again.'
      }
    },
    {
      id: 'ecommerce-quality', number: '04', category: 'Web & e-commerce quality', eyebrow: 'Customer journeys',
      title: 'Connect storefront behavior to order confidence.',
      summary: 'Responsive and cross-browser validation covered storefront setup, checkout, payments, order lifecycle, provider integrations, and administrative workflows.',
      tags: ['Responsive testing', 'Cross-browser', 'Order lifecycle'],
      visual: { type: 'journey', label: 'Journey coverage', scenarios: ['Storefront', 'Checkout', 'Payment', 'Order', 'Admin'] },
      story: {
        Context: 'E-commerce quality spans customer-facing interfaces, transaction flows, external providers, and administrative operations.',
        Problem: 'A journey can appear correct in one browser or viewport while failing later in payment, order state, or administration.',
        Constraints: 'The public case study must stay generalized and avoid disclosing private systems or customer data.',
        Diagnosis: 'Confidence required both presentation coverage and validation of the full order lifecycle.',
        'Engineering decision': 'Treat the storefront and operational back office as one connected customer journey.',
        Implementation: 'Exercise responsive and cross-browser behavior alongside checkout, payment, order, provider, and admin scenarios.',
        'Quality safeguards': 'Use representative viewports, meaningful journey boundaries, and evidence beyond visual completion.',
        Outcome: 'Coverage demonstrated quality engineering beyond banking APIs while retaining a systems view of the product.',
        Lessons: 'Web quality is strongest when interface behavior and business state are validated as one journey.'
      }
    }
  ],
  qualitySystem: [
    { title: 'Product risk', detail: 'Identify what could hurt the user or the business.' },
    { title: 'Test design', detail: 'Select the evidence that can reveal that risk.' },
    { title: 'Business scenarios', detail: 'Translate intent into positive, negative, and boundary paths.' },
    { title: 'Automation orchestration', detail: 'Choose layers, data, isolation, and execution strategy.' },
    { title: 'API · UI · services', detail: 'Exercise behavior at the most useful system boundary.' },
    { title: 'System & database evidence', detail: 'Verify state, side effects, and observable outcomes.' },
    { title: 'CI quality gate', detail: 'Make evidence timely, repeatable, and visible.' },
    { title: 'Release decision', detail: 'Turn results into an explicit engineering signal.' },
    { title: 'Engineering feedback', detail: 'Use failures to improve product and testability.' }
  ],
  lab: {
    title: 'Release Confidence Lab',
    description: 'A deterministic portfolio simulation of how evidence moves from preparation to a release decision.',
    stages: [
      { id: 'prepare', title: 'Prepare', detail: 'Test data & environment', evidence: 'Independent data prepared' },
      { id: 'contract', title: 'Contract', detail: 'API schema & boundaries', evidence: 'Contracts and boundaries checked' },
      { id: 'integrate', title: 'Integrate', detail: 'Services & provider states', evidence: 'Integration states observed' },
      { id: 'journey', title: 'Critical journey', detail: 'Financial flow & side effects', evidence: 'Critical journey verified' },
      { id: 'performance', title: 'Performance', detail: 'Baseline & budget', evidence: 'Performance budget reviewed' },
      { id: 'evidence', title: 'Evidence', detail: 'Diagnostics & traceability', evidence: 'Decision evidence compiled' },
      { id: 'decision', title: 'Decision', detail: 'Release quality gate', evidence: 'Release signal ready' }
    ]
  },
  principles: [
    { title: 'Test risk, not vanity metrics.', body: 'More checks do not automatically create more confidence. Coverage should follow consequence.' },
    { title: 'Evidence before assumptions.', body: 'An HTTP success code is a starting point, not proof that business state is correct.' },
    { title: 'Fast feedback must stay trustworthy.', body: 'Speed is an improvement only when execution remains deterministic and diagnosable.' },
    { title: 'External failure should be reproducible.', body: 'Critical validation should not depend on the availability or mood of a third-party provider.' },
    { title: 'Testability is an engineering property.', body: 'Important behavior should be observable and controllable by design, not only after a failure.' }
  ],
  capabilities: [
    { title: 'Quality engineering', items: ['Risk-based testing', 'Exploratory testing', 'E2E testing', 'Integration testing', 'API testing', 'Responsive / cross-browser'] },
    { title: 'Automation', items: ['Robot Framework', 'Python', 'JavaScript', 'Service virtualization', 'Mock servers'] },
    { title: 'Delivery', items: ['GitLab CI', 'Docker execution', 'Quality gates', 'Test evidence'] },
    { title: 'Performance & data', items: ['k6', 'MySQL', 'MongoDB', 'State and side-effect validation'] }
  ],
  experience: [
    { period: '2023 — Present', scope: 'Fintech quality engineering', role: 'Software Test Engineer', outcome: 'Automation architecture, API and integration coverage, performance testing, quality gates, and deterministic validation across complex credit and banking workflows.' },
    { period: '2021 — 2023', scope: 'E-commerce quality', role: 'Software Test Engineer', outcome: 'Quality coverage connected storefront setup, checkout, payments, orders, responsive UI, provider integrations, and release readiness.' },
    { period: '2017 — 2022', scope: 'Lorestan University', role: 'B.Sc. in Computer Engineering', outcome: 'The technical foundation behind a career built around systems thinking, careful investigation, and dependable software.' }
  ],
  about: [
    'I’m most useful where software has meaningful state, external dependencies, and a cost to getting the answer wrong.',
    'My work sits between product intent and system evidence: asking how a feature can fail, making that failure observable, then shaping automation that helps a team learn quickly without losing trust in the signal.',
    'That means collaborating with product and development early, improving testability, documenting engineering decisions, and treating quality as a property of the system rather than a final inspection step.'
  ],
  contact: {
    title: 'Have a quality problem worth solving?',
    body: 'Let’s talk about test automation architecture, quality-engineering roles, fintech quality, API and integration strategy, performance testing, CI quality gates, or engineering-quality collaboration.',
    primaryLabel: 'Start a conversation',
    resumeNote: 'A current public résumé is available by email.'
  }
};

export default portfolio;
