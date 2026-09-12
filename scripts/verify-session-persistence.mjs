import { spawnSync } from 'node:child_process';

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:4173';
const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;
if (!email || !password) throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD are required.');

const forwardedHeaders = { 'x-forwarded-proto': 'https' };
const loginPage = await fetch(`${origin}/admin/login`, { headers: forwardedHeaders });
const initialCookie = loginPage.headers.get('set-cookie')?.split(';', 1)[0];
const csrfToken = (await loginPage.text()).match(/name="_csrf" value="([^"]+)"/)?.[1];
if (!initialCookie || !csrfToken) throw new Error('Login page did not issue a session and CSRF token.');

const login = await fetch(`${origin}/admin/login`, {
  method: 'POST',
  redirect: 'manual',
  headers: {
    ...forwardedHeaders,
    cookie: initialCookie,
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({ _csrf: csrfToken, email, password }),
});
const authenticatedCookie = login.headers.get('set-cookie')?.split(';', 1)[0];
if (login.status !== 302 || !authenticatedCookie || authenticatedCookie === initialCookie) {
  throw new Error('Login did not rotate and persist the authenticated session.');
}

const restart = spawnSync('docker', ['compose', 'restart', 'web'], { cwd: process.cwd(), encoding: 'utf8' });
if (restart.status !== 0) throw new Error(`Web restart failed: ${restart.stderr}`);

let authenticatedAfterRestart;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    authenticatedAfterRestart = await fetch(`${origin}/admin`, {
      redirect: 'manual',
      headers: { ...forwardedHeaders, cookie: authenticatedCookie },
    });
    if (authenticatedAfterRestart.status === 200) break;
  } catch {
    // The container is expected to refuse connections briefly while restarting.
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

if (authenticatedAfterRestart?.status !== 200) throw new Error('Authenticated session did not survive the web restart.');
process.stdout.write('Production session rotated at login and survived a web-container restart.\n');
