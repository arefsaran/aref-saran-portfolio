import test from 'node:test';
import assert from 'node:assert/strict';
import { safeJsonForHtml } from '../../src/utils/json.js';

test('safeJsonForHtml prevents script-closing injection inside JSON-LD', () => {
  const json = safeJsonForHtml({ title: '</script><script>alert(1)</script>' });
  assert.doesNotMatch(json, /<\/script>/i);
  assert.match(json, /\\u003c\/script\\u003e/);
});
