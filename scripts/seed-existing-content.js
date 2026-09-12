import mongoose from 'mongoose';
import { config } from '../src/config/env.js';
import { CaseStudy } from '../src/models/CaseStudy.js';

const cases = [
  {
    title: 'Turning a 39-hour regression cycle into a two-hour signal',
    slug: 'regression-39-hours-to-2-hours',
    summary: 'A generalized regression-architecture case focused on parallel execution, execution-safe suite boundaries, and faster release feedback.',
    problem: 'A large API and integration regression suite had become too slow to provide useful release feedback.',
    approach: 'Use safe parallel execution, clear suite boundaries, and smoke/regression/nightly segmentation while preserving diagnostic evidence.',
    result: 'The existing public portfolio states an approximately 95% reduction in execution time, from 39 hours to roughly 2 hours, across more than 2,300 checks.',
    technologies: ['Robot Framework', 'Parallel execution', 'CI/CD', 'API testing'],
    status: 'published',
    featured: true,
  },
  {
    title: 'Making external-provider failures repeatable',
    slug: 'service-virtualization-repeatable-failures',
    summary: 'A generalized service-virtualization case for deterministic success, timeout, retry, invalid-response, and partial-failure testing.',
    problem: 'Critical tests depended on external systems whose behavior was not predictable enough for deterministic automation.',
    approach: 'Use mock servers and controlled failure modes so tests can reproduce external-provider behavior on demand.',
    result: 'Critical-path automation can validate failure handling without depending on unpredictable third-party availability or responses.',
    technologies: ['Mock servers', 'Service virtualization', 'API testing'],
    status: 'published',
    featured: true,
  },
  {
    title: 'Protecting high-risk financial journeys',
    slug: 'risk-based-financial-journeys',
    summary: 'A generalized financial-testing case covering negative paths, boundaries, state validation, and idempotency.',
    problem: 'Transaction-heavy workflows require validation beyond happy-path UI behavior because incorrect state transitions can create financial impact.',
    approach: 'Prioritize critical workflows and validate business state, negative paths, boundaries, retries, and idempotency across transaction lifecycles.',
    result: 'The testing strategy concentrates evidence around the failure modes with the highest product and financial risk.',
    technologies: ['Risk-based testing', 'API testing', 'Database validation', 'Idempotency'],
    status: 'published',
    featured: true,
  },
];

await mongoose.connect(config.mongoUri);
for (const item of cases) {
  await CaseStudy.findOneAndUpdate({ slug: item.slug }, item, { upsert: true, setDefaultsOnInsert: true });
}
console.log(`Seeded ${cases.length} generalized case studies from the existing public portfolio.`);
await mongoose.disconnect();
