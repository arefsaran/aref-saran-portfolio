import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function loadProductionConfig(overrides = {}) {
  return spawnSync(process.execPath, ['--input-type=module', '--eval', "import('./src/config/env.js')"], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      BASE_URL: 'https://arefsaran.ir',
      MONGODB_URI: 'mongodb://mongo:27017/arefsaran',
      SESSION_SECRET: 'a-secure-random-looking-session-secret-123456789',
      ADMIN_TIMEZONE: 'Asia/Tehran',
      ...overrides,
    },
  });
}

test('production configuration accepts explicit secure values', () => {
  assert.equal(loadProductionConfig().status, 0);
});

test('production configuration rejects placeholder secrets and insecure origins', () => {
  const placeholder = loadProductionConfig({ SESSION_SECRET: 'replace-with-at-least-32-random-characters' });
  assert.notEqual(placeholder.status, 0);
  assert.match(placeholder.stderr, /SESSION_SECRET/);

  const httpOrigin = loadProductionConfig({ BASE_URL: 'http://arefsaran.ir' });
  assert.notEqual(httpOrigin.status, 0);
  assert.match(httpOrigin.stderr, /BASE_URL/);
});

test('configuration rejects an invalid IANA timezone', () => {
  const result = loadProductionConfig({ ADMIN_TIMEZONE: 'Invalid/Timezone' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ADMIN_TIMEZONE/);
});
