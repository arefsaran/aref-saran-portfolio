import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage communicates Test Engineering positioning and Germany path', async ({ page }) => {
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Aref Saran — Test Engineer/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Engineering quality systems');
  await expect(page.getByText('Open to Test Engineering opportunities in Germany')).toBeVisible();
  const german = page.getByRole('link', { name: /German Learning Journey/i });
  await expect(german).toHaveAttribute('href', 'https://learninggerman.ir');
  expect(runtimeErrors).toEqual([]);
});

test('published article is server-rendered and discoverable', async ({ page }) => {
  await page.goto('/articles');
  await expect(page.getByRole('link', { name: 'Published Engineering Note' })).toBeVisible();
  await page.getByRole('link', { name: 'Published Engineering Note' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Published Engineering Note' })).toBeVisible();
  await expect(page.getByText('Business state matters.')).toBeVisible();
});

test('public content has no automatically detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/articles/published-engineering-note');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('public pages do not horizontally overflow common widths', async ({ page }) => {
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/articles');
    const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  }
});
