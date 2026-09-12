import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, estimateReadingTime } from '../../src/utils/markdown.js';

test('markdown renderer removes executable HTML and javascript URLs', () => {
  const html = renderMarkdown('# Safe\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))');
  assert.match(html, /<h2>Safe<\/h2>/);
  assert.doesNotMatch(html, /<h1/i);
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /javascript:/i);
});

test('reading time has a minimum of one minute', () => {
  assert.equal(estimateReadingTime('small article'), 1);
});
