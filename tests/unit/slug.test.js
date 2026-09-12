import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSlug } from '../../src/utils/slug.js';

test('makeSlug generates stable URL-safe slugs', () => {
  assert.equal(makeSlug('Testing APIs Beyond HTTP 200'), 'testing-apis-beyond-http-200');
  assert.equal(makeSlug('CI/CD & Quality Gates'), 'cicd-and-quality-gates');
});
