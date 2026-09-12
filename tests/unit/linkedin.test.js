import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLinkedInDraft } from '../../src/utils/linkedin.js';

test('LinkedIn draft uses article as canonical source and creates article CTA', () => {
  const output = buildLinkedInDraft({ title: 'API Testing', slug: 'api-testing', excerpt: 'HTTP 200 is not enough.', linkedinKeyPoints: ['Validate business state'], linkedinHashtags: ['SoftwareTesting'] }, 'https://arefsaran.ir');
  assert.match(output, /HTTP 200 is not enough/);
  assert.match(output, /https:\/\/arefsaran\.ir\/articles\/api-testing/);
  assert.match(output, /#SoftwareTesting/);
});
