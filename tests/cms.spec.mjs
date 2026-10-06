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

  const csrf = await page.locator('input[name="_csrf"]').inputValue();
  const write = await page.request.post('/admin/articles', {
    form: { _csrf: csrf, title: 'Unauthorized', slug: 'unauthorized', excerpt: 'No', body: 'No' },
    maxRedirects: 0,
  });
  expect(write.status()).toBe(302);
  expect(write.headers().location).toBe('/admin/login');
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

  const invalid = await page.request.post('/admin/articles', {
    form: { _csrf: 'invalid', title: 'Bad CSRF', slug: 'bad-csrf', excerpt: 'Rejected', body: 'Rejected' },
  });
  expect(invalid.status()).toBe(403);

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
  await page.getByLabel('Tags', { exact: true }).fill('API Testing, Idempotency');
  await page.getByRole('button', { name: 'Save article' }).click();
  await expect(page.getByText('Saved.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue('Idempotency Testing in Financial APIs');
  const preview = page.getByRole('link', { name: 'Preview' });
  const [previewPage] = await Promise.all([page.waitForEvent('popup'), preview.click()]);
  await expect(previewPage.getByText('Private preview.')).toBeVisible();
  expect((await previewPage.locator('script').allTextContents()).join('\n')).not.toContain('alert(1)');
  await previewPage.close();
  const slug = await page.getByLabel('Slug').inputValue();
  const draftResponse = await page.request.get(`/articles/${slug}`);
  expect(draftResponse.status()).toBe(404);
  expect((await (await page.request.get('/articles')).text())).not.toContain('Idempotency Testing in Financial APIs');
  await page.getByRole('button', { name: 'Publish' }).click();
  const publicUrl = await page.getByLabel('Slug').inputValue();
  await page.goto(`/articles/${publicUrl}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Idempotency Testing in Financial APIs');
});

test('article can be edited, unpublished, republished and deleted', async ({ page }) => {
  await login(page);
  await page.goto('/admin/articles/new');
  await page.getByLabel('Title', { exact: true }).fill('Lifecycle article');
  await page.getByLabel('Excerpt').fill('Lifecycle excerpt');
  await page.getByLabel('Markdown article').fill('Initial body');
  await page.getByRole('button', { name: 'Save article' }).click();
  const slug = await page.getByLabel('Slug').inputValue();
  await page.getByRole('button', { name: 'Publish' }).click();
  const firstPublished = await page.locator('[data-published-at]').textContent();
  await page.getByLabel('Markdown article').fill('Updated body');
  await page.getByRole('button', { name: 'Save article' }).click();
  expect(await (await page.request.get(`/articles/${slug}`)).text()).toContain('Updated body');
  await page.getByRole('button', { name: 'Unpublish' }).click();
  expect((await page.request.get(`/articles/${slug}`)).status()).toBe(404);
  await page.getByRole('button', { name: 'Publish' }).click();
  expect(await page.locator('[data-published-at]').textContent()).toBe(firstPublished);
  expect((await page.request.get(`/articles/${slug}`)).status()).toBe(200);
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  expect((await page.request.get(`/articles/${slug}`)).status()).toBe(404);
});

test('duplicate slug is rejected without replacing the existing article', async ({ page }) => {
  await login(page);
  await page.goto('/admin/articles/new');
  await page.getByLabel('Title', { exact: true }).fill('Published Engineering Note');
  await page.getByLabel('Slug').fill('published-engineering-note');
  await page.getByLabel('Excerpt').fill('A duplicate');
  await page.getByLabel('Markdown article').fill('A duplicate body');
  await page.getByRole('button', { name: 'Save article' }).click();
  await expect(page.getByRole('alert')).toContainText('already in use');
  expect(await (await page.request.get('/articles/published-engineering-note')).text()).toContain('Business state matters.');
});
