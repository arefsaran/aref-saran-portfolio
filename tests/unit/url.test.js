import test from 'node:test';
import assert from 'node:assert/strict';
import { safeHttpUrl, safeEmail } from '../../src/utils/url.js';

test('safeHttpUrl rejects executable schemes and supports internal media paths', () => {
  assert.equal(safeHttpUrl('javascript:alert(1)'), '');
  assert.equal(safeHttpUrl('/uploads/image.webp', { allowRelative: true }), '/uploads/image.webp');
  assert.equal(safeHttpUrl('//evil.example', { allowRelative: true }), '');
  assert.match(safeHttpUrl('https://example.com/path'), /^https:\/\/example\.com\/path/);
});

test('safeEmail accepts normal addresses and rejects malformed input', () => {
  assert.equal(safeEmail('aref@example.com'), 'aref@example.com');
  assert.equal(safeEmail('not-an-email'), '');
});
