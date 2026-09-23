import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage communicates senior FinTech QA positioning and Germany path', async ({ page }) => {
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Senior QA \/ Test Automation Engineer/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Senior QA');
  await expect(page.getByText('FinTech · Credit · Payments')).toBeVisible();
  await expect(page.getByText('Open to Senior QA opportunities in Germany and Europe')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'QA Engineer · QA Engineering Chapter Lead' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download résumé' }).first()).toHaveAttribute('href', '/resume/Aref_Saran_QA_Engineer.pdf');
  expect(runtimeErrors).toEqual([]);
});

test('professional information architecture is routable and writing aliases preserve article URLs', async ({ page }) => {
  for (const [path, heading] of [['/experience', 'Engineering impact across financial systems.'], ['/expertise', 'Quality engineering, organized by system risk.'], ['/about', 'I build evidence for difficult release decisions.'], ['/contact', 'Let’s discuss quality engineering for financial systems.']]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  }
  const response = await page.request.get('/writing/published-engineering-note', { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe('/articles/published-engineering-note');
});

test('published article is server-rendered and discoverable', async ({ page }) => {
  await page.goto('/articles');
  await expect(page.getByRole('link', { name: 'Published Engineering Note' })).toBeVisible();
  await page.getByRole('link', { name: 'Published Engineering Note' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Published Engineering Note' })).toBeVisible();
  await expect(page.getByText('Business state matters.')).toBeVisible();
});

test('RSS and sitemap expose canonical writing routes', async ({ request }) => {
  const rss = await request.get('/rss.xml');
  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain('/articles/published-engineering-note');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('/articles/published-engineering-note');
});

test('latest verified resume is the public PDF', async ({ request }) => {
  const response = await request.get('/resume/Aref_Saran_QA_Engineer.pdf');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).byteLength).toBe(65356);
});

test('public content has no automatically detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/articles/published-engineering-note');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('public pages do not horizontally overflow common widths', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  }
});

test('mobile presentation loads its visual system and exposes navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('.hero-portrait img')).toBeVisible();
  const background = await page.locator('body').evaluate((element) => element.ownerDocument.defaultView.getComputedStyle(element).backgroundColor);
  expect(background).toBe('rgb(244, 241, 232)');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Experience' })).toBeVisible();
});
