import { expect, test } from '@playwright/test';

async function login(page) {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('testing-password-123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test('anonymous user cannot access admin', async ({ page }) => {
  await page.goto('/admin/articles');
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test('login rotates the session, CSRF protects writes, and logout invalidates reuse', async ({ page }) => {
  await page.goto('/admin/login');
  const before = (await page.context().cookies()).find((cookie) => cookie.name === 'as.sid');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('testing-password-123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  const authenticated = (await page.context().cookies()).find((cookie) => cookie.name === 'as.sid');
  expect(authenticated?.value).toBeTruthy();
  expect(authenticated?.value).not.toBe(before?.value);

  const rejected = await page.request.post('/admin/articles', {
    form: { title: 'No CSRF', slug: 'no-csrf', excerpt: 'Rejected', body: 'Rejected' },
  });
  expect(rejected.status()).toBe(403);

  const staleCookie = `${authenticated.name}=${authenticated.value}`;
  const csrf = await page.locator('input[name="_csrf"]').first().inputValue();
  await page.request.post('/admin/logout', { form: { _csrf: csrf } });
  const reuse = await page.request.get('/admin', { headers: { cookie: staleCookie }, maxRedirects: 0 });
  expect(reuse.status()).toBe(302);
  expect(reuse.headers().location).toBe('/admin/login');
});

test('admin can create, persist, preview and publish an article', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: '+ New article' }).first().click();
  await page.getByLabel('Title', { exact: true }).fill('Idempotency Testing in Financial APIs');
  await page.getByLabel('Slug').fill('idempotency-testing-financial-apis');
  await page.getByLabel('Excerpt').fill('How duplicate requests can create duplicate financial effects.');
  await page.getByLabel('Markdown article').fill('# Failure mode\n\nA retry must not create a second financial effect.\n\n<script>alert(1)</script>');
  await page.getByLabel('Series').fill('FinTech Testing');
  await page.getByLabel('Tags', { exact: true }).fill('API Testing, Idempotency');
  await page.getByRole('button', { name: 'Save article' }).click();
  await expect(page.getByText('Saved.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue('Idempotency Testing in Financial APIs');
  const preview = page.getByRole('link', { name: 'Preview' });
  const [previewPage] = await Promise.all([page.waitForEvent('popup'), preview.click()]);
  await expect(previewPage.getByText('Private preview.')).toBeVisible();
  await expect(previewPage.locator('script')).not.toContainText('alert(1)');
  await previewPage.close();
  await page.locator('#status').selectOption('published');
  await page.getByRole('button', { name: 'Save article' }).click();
  const publicUrl = await page.getByLabel('Slug').inputValue();
  await page.goto(`/articles/${publicUrl}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Idempotency Testing in Financial APIs');
});

test('LinkedIn draft generation remains review-first', async ({ page }) => {
  await login(page);
  await page.goto('/admin/articles');
  const existing = page.getByRole('link', { name: 'Edit' }).first();
  await existing.click();
  await page.getByRole('button', { name: 'Generate deterministic draft' }).click();
  await expect(page.locator('#linkedin-preview')).toContainText('Read the full engineering note:');
  await expect(page.locator('#linkedinStatus')).not.toHaveValue('posted');
});
