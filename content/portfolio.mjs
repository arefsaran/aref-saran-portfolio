const portfolio = {
  site: {
    url: 'https://arefsaran.ir/',
    title: 'Aref Saran — Senior Test Engineer',
    description: 'Aref Saran is a Senior Test Engineer who designs test automation and quality systems for complex fintech, API, and BPMN/Camunda workflows.',
    socialDescription: 'Senior Test Engineer designing quality systems across APIs, databases, BPMN workflows, external providers, performance, and CI/CD.',
    socialImage: 'og-card-senior.jpg',
    language: 'en',
    lastModified: '2026-08-24',
    themeColors: { light: '#f4f1eb', dark: '#0d1822' }
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
    { label: 'Work', href: '#work' },
    { label: 'Systems', href: '#systems' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ],
  hero: {
    eyebrow: 'Aref Saran',
    roleLine: 'Senior Test Engineer · Test Automation & Quality Systems',
    headline: 'Engineering confidence into complex software systems.',
    lead: 'I design test strategies and automation systems that connect APIs, databases, BPMN workflows, external providers, performance testing, and CI/CD into reliable engineering evidence.',
    primaryCta: { label: 'Explore engineering work', href: '#work' },
    secondaryCta: { label: 'View quality systems', href: '#systems' },
    availability: 'Open to thoughtful collaborations',
    domains: ['Fintech correctness', 'BPMN / Camunda', 'API & integration', 'CI quality gates']
  },
  metrics: [
    { value: '2,300+', label: 'API and integration automated checks maintained' },
    { value: '39h → 2h', label: 'Regression feedback cycle', note: 'approximately 95% shorter' },
    { value: '4 layers', label: 'API · Integration · E2E · Performance' }
  ],
  outcomes: [
    {
      number: '01', action: 'Build', title: 'Quality systems from zero',
      body: 'Design the strategy, repository architecture, automation layers, test data, evidence, documentation, and CI integration needed for a system teams can adopt and evolve.',
      evidence: ['Strategy', 'Architecture', 'Team adoption']
    },
    {
      number: '02', action: 'Stabilize', title: 'Deterministic engineering evidence',
      body: 'Control data, sessions, environments, external providers, polling, and failure paths so automation remains repeatable and diagnosable.',
      evidence: ['Mock servers', 'DB oracles', 'Diagnostics']
    },
    {
      number: '03', action: 'Protect', title: 'Workflow and financial state',
      body: 'Find process, money-movement, retry, callback, and idempotency failures that an HTTP status alone cannot reveal.',
      evidence: ['BPMN state', 'Financial invariants', 'Risk analysis']
    },
    {
      number: '04', action: 'Accelerate', title: 'Feedback close to the change',
      body: 'Move fast, risk-based validation into feature branches and merge requests while preserving deeper regression, nightly, and performance evidence.',
      evidence: ['MR smoke', 'GitLab CI', 'Performance gates']
    }
  ],
  architecture: {
    title: 'A quality system connects risk to release evidence.',
    description: 'Automation is one layer. Confidence comes from connecting product risk, test design, system boundaries, deterministic infrastructure, diagnostics, and delivery decisions.',
    layers: [
      { label: 'Business risk', detail: 'Probability × impact', tone: 'risk' },
      { label: 'Test strategy', detail: 'Scenarios · boundaries · negative paths', tone: 'strategy' },
      { label: 'Business behavior', detail: 'Features · workflows · reusable steps', tone: 'behavior' },
      { label: 'Execution boundaries', detail: 'Choose the most useful observable layer', tone: 'execution', nodes: ['API', 'UI', 'DB'] },
      { label: 'Services & infrastructure', detail: 'Auth · data · mocking · polling · providers', tone: 'infrastructure' },
      { label: 'Evidence & diagnostics', detail: 'State · side effects · logs · reports', tone: 'evidence' },
      { label: 'CI/CD decision', detail: 'Timely, explicit, traceable quality gates', tone: 'delivery' }
    ],
    deliveryTitle: 'Reduce the distance between introducing risk and detecting it.',
    deliveryStages: ['Feature branch', 'Fast validation', 'API / contract', 'Risk-based smoke', 'MR quality gate', 'Merge', 'Targeted regression', 'Nightly / performance']
  },
  workflow: {
    title: 'BPMN testing goes beyond the endpoint.',
    description: 'A workflow is a state machine with business consequences. The test must follow process transitions, external behavior, persistence, retries, and the final financial effect together.',
    flow: [
      { label: 'Request', type: 'event' },
      { label: 'Process start', type: 'event' },
      { label: 'Gateway', type: 'gateway' },
      { label: 'Service task / provider', type: 'task' },
      { label: 'Timer · retry · callback', type: 'event' },
      { label: 'Financial operation', type: 'risk' },
      { label: 'Process complete', type: 'complete' }
    ],
    oracles: [
      'API response',
      'Camunda process instance',
      'Active or current task',
      'Business request state',
      'Database state',
      'Provider interaction',
      'Retry and callback idempotency',
      'Final financial effect'
    ],
    concepts: ['BPMN', 'Camunda', 'Gateways', 'Timers', 'Boundary events', 'Message events', 'Retries', 'Process history']
  },
  fintech: {
    title: 'HTTP success is not financial correctness.',
    description: 'A purchase can return 200 while the wrong account, transaction, process state, or financial side effect is persisted. Correctness requires evidence across the entire chain.',
    chain: ['HTTP result', 'Ticket', 'Account / credit', 'Transaction', 'BPMN state', 'Financial invariant'],
    checks: [
      'Correct ticket and customer',
      'Correct account or credit affected',
      'Correct amount and transaction persisted',
      'Expected workflow transition',
      'Expected ledger and business state',
      'No forbidden or duplicate side effect'
    ],
    idempotency: {
      title: 'Callback replay must remain safe.',
      first: { label: 'Callback #1', result: 'Transaction created once' },
      replay: { label: 'Callback #2', result: 'Replay detected · no duplicate debit or refund' }
    },
    risks: ['Duplicate debit', 'Duplicate refund', 'Lost callback', 'Incorrect settlement', 'Retry side effects', 'Process inconsistency']
  },
  caseStudies: [
    {
      id: 'regression-architecture', number: '01', category: 'Automation at scale',
      title: 'From 39 hours to a two-hour signal.',
      summary: 'A large API and integration suite had become too slow for useful release feedback. The response was architectural: isolate execution, segment intent, and preserve evidence.',
      tags: ['2,300+ checks', 'Parallel execution', 'CI feedback'],
      proof: '≈95% shorter regression',
      story: {
        Context: 'More than 2,300 API and integration checks protected transaction-heavy workflows.',
        Risk: 'A complete regression cycle took approximately 39 hours, making the signal too late for routine release decisions.',
        Constraints: 'The suite still needed deterministic data, readable failures, safe reruns, and useful engineering evidence.',
        Approach: 'Separate feedback by purpose and make execution boundaries independent before increasing concurrency.',
        Implementation: 'Introduce smoke, targeted regression, and nightly layers; isolate test data; parallelize only safe suites; publish evidence through CI.',
        Verification: 'Keep failures diagnosable, avoid hiding instability behind retries, and retain an intentional comprehensive layer.',
        Outcome: 'Regression execution fell from approximately 39 hours to approximately two hours—about 95% shorter.',
        Lesson: 'Fast feedback stays trustworthy when isolation, observability, and suite intent are designed together.'
      }
    },
    {
      id: 'automation-from-zero', number: '02', category: 'Quality system architecture',
      title: 'Build the system, not only the scripts.',
      summary: 'Starting from zero requires strategy, layering, data, environment control, reusable business behavior, diagnostics, CI gates, documentation, and a path for team adoption.',
      tags: ['Robot Framework', 'Python', 'Architecture'],
      proof: 'Zero → maintainable system',
      story: {
        Context: 'Complex products need an automation foundation that can grow without turning every new scenario into duplicated implementation.',
        Risk: 'A script-first approach couples tests to endpoints and environments, making the suite expensive to scale and difficult to trust.',
        Constraints: 'The system must support multiple test layers, controlled data, authentication, external dependencies, CI execution, and readable evidence.',
        Approach: 'Design around business scenarios, reusable layers, explicit boundaries, independent data, and observable failure modes.',
        Implementation: 'Establish repository structure, API and UI abstractions, business steps, DB evidence, mocking, diagnostics, reporting, quality gates, and documentation.',
        Verification: 'Review maintainability, isolation, failure clarity, execution purpose, and whether another engineer can safely extend the system.',
        Outcome: 'A production-ready automation system that can be adopted, maintained, and scaled over time.',
        Lesson: 'Architecture creates leverage only when the team can understand and evolve it.'
      }
    },
    {
      id: 'workflow-correctness', number: '03', category: 'BPMN & fintech quality',
      title: 'Test workflow state, not merely endpoints.',
      summary: 'Financial workflows are validated across API results, Camunda state, business state, databases, provider behavior, retries, callbacks, and final side effects.',
      tags: ['Camunda', 'DB oracles', 'Idempotency'],
      proof: 'State + side effects',
      story: {
        Context: 'Credit, purchase, refund, settlement, repayment, and billing workflows cross services, providers, process state, and persistent financial state.',
        Risk: 'A successful response can hide an incorrect gateway path, stale task, duplicate effect, lost callback, or inconsistent business state.',
        Constraints: 'Public evidence must remain generalized and avoid exposing private systems, production data, or proprietary architecture.',
        Approach: 'Model the workflow as a state machine and define synchronized oracles for each important transition and failure path.',
        Implementation: 'Correlate endpoint results with process instances, tasks, history, DB state, provider interactions, timers, retries, callbacks, and financial invariants.',
        Verification: 'Assert intended effects, forbidden effects, retry behavior, and replay safety before accepting the final business state.',
        Outcome: 'Evidence describes whether the business operation is correct, not simply whether an endpoint responded.',
        Lesson: 'Workflow quality lives in the agreement between every observable state.'
      }
    },
    {
      id: 'provider-virtualization', number: '04', category: 'Deterministic dependencies',
      title: 'Make external failure repeatable.',
      summary: 'Provider behavior is brought under test control so success, timeout, retry, malformed response, callback, and partial-failure paths can run on demand.',
      tags: ['Mock servers', 'Failure injection', 'Repeatability'],
      proof: 'Controlled provider states',
      story: {
        Context: 'Critical workflows depended on external-provider responses that were not reliably reproducible in test environments.',
        Risk: 'Timeout, retry, invalid payload, delayed callback, duplicate callback, and partial-failure paths could not be exercised consistently.',
        Constraints: 'The test double must model explicit contracts without pretending to reproduce confidential provider architecture.',
        Approach: 'Move provider behavior behind deterministic scenarios with named inputs, outputs, timing, and failure semantics.',
        Implementation: 'Model success, timeout, connection failure, 4xx, 5xx, invalid or partial responses, delay, retry, callback replay, and business rejection.',
        Verification: 'Connect each controlled state to targeted assertions, provider-interaction evidence, business state, and rerun safety.',
        Outcome: 'External failure paths become repeatable, diagnosable, and available whenever the suite needs them.',
        Lesson: 'A deterministic failure is more useful than an occasional realistic one when dependable validation is the goal.'
      }
    },
    {
      id: 'ecommerce-quality', number: '05', category: 'Web & e-commerce quality',
      title: 'Connect storefront behavior to order confidence.',
      summary: 'Responsive and cross-browser validation connects storefront setup, checkout, payments, order lifecycle, provider integrations, and administrative workflows.',
      tags: ['Responsive testing', 'Cross-browser', 'Order lifecycle'],
      proof: 'UI + business state',
      story: {
        Context: 'E-commerce quality spans customer-facing interfaces, transaction flows, external providers, and administrative operations.',
        Risk: 'A journey can appear correct in one browser or viewport while failing later in payment, order state, or administration.',
        Constraints: 'The public case study remains generalized and excludes private systems and customer data.',
        Approach: 'Treat the storefront and operational back office as one connected customer journey.',
        Implementation: 'Exercise responsive and cross-browser behavior alongside checkout, payment, order, provider, and admin scenarios.',
        Verification: 'Use representative viewports, meaningful journey boundaries, and evidence beyond visual completion.',
        Outcome: 'Coverage demonstrates web quality while retaining a systems view of the product.',
        Lesson: 'Interface behavior and business state should be validated as one journey.'
      }
    }
  ],
  aiAugmented: {
    title: 'AI accelerates analysis. Evidence remains authoritative.',
    description: 'AI-augmented quality engineering helps connect repository structure, product risk, tests, CI failures, and documentation. It supports engineering judgment rather than replacing it.',
    responsibilities: [
      'Repository and architecture analysis',
      'Test-gap and risk discovery',
      'Backend, frontend, and BPMN correlation',
      'Robot Framework and code review assistance',
      'CI failure diagnosis',
      'Reusable QA knowledge and documentation'
    ],
    authorities: ['Source code', 'Contracts', 'Deterministic tests', 'Databases', 'Runtime evidence']
  },
  capabilities: [
    { title: 'Quality systems', items: ['Test strategy', 'Risk analysis', 'Test architecture', 'Test data strategy', 'Evidence & diagnostics', 'Team adoption'] },
    { title: 'Workflow engineering', items: ['BPMN', 'Camunda', 'State machines', 'Gateways', 'Timers', 'Async events', 'Retries'] },
    { title: 'Fintech correctness', items: ['Credit', 'Purchase', 'Refund', 'Settlement', 'Repayment', 'Billing', 'Financial idempotency'] },
    { title: 'Automation & integration', items: ['Robot Framework', 'Python', 'JavaScript', 'REST APIs', 'E2E automation', 'Contract verification'] },
    { title: 'Delivery & reliability', items: ['GitLab CI', 'Docker', 'Feature-branch testing', 'Quality gates', 'k6', 'Performance baselines'] },
    { title: 'Data & dependencies', items: ['MySQL', 'MongoDB', 'Redis', 'DB validation', 'Mock servers', 'Service virtualization'] },
    { title: 'AI-augmented QA', items: ['QA-agent workflows', 'Repository analysis', 'Test-gap analysis', 'Assisted test design', 'Review assistance', 'Knowledge systems'] }
  ],
  experience: [
    { period: '2023 — Present', scope: 'Fintech quality engineering', role: 'Software Test Engineer', outcome: 'Automation architecture, API and integration coverage, BPMN workflow validation, performance testing, quality gates, and deterministic evidence across complex credit and banking workflows.' },
    { period: '2021 — 2023', scope: 'E-commerce quality', role: 'Software Test Engineer', outcome: 'Quality coverage connected storefront setup, checkout, payments, orders, responsive UI, provider integrations, and release readiness.' },
    { period: '2017 — 2022', scope: 'Lorestan University', role: 'B.Sc. in Computer Engineering', outcome: 'The technical foundation behind a career built around systems thinking, careful investigation, and dependable software.' }
  ],
  perspective: [
    'I’m most useful where software has meaningful state, external dependencies, and a cost to getting the answer wrong.',
    'My work sits between product intent and system evidence: identify how a feature can fail, make that failure observable, and build feedback the team can trust.',
    'Quality is treated as an engineering property of the system—not a final inspection step.'
  ],
  contact: {
    title: 'Have a quality problem worth solving?',
    body: 'Let’s talk about quality-system architecture, fintech and BPMN workflow testing, API and integration strategy, deterministic dependencies, performance engineering, or CI quality gates.',
    primaryLabel: 'Start a conversation',
    resumeNote: 'A current public résumé is available by email.'
  }
};

export default portfolio;
