import { expect, test } from '@playwright/test';

test.describe('cross-browser smoke', () => {
  test('loads the primary positioning and engineering evidence', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');

    await expect(page).toHaveTitle('Aref Saran — Senior Test Engineer');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'BPMN testing goes beyond the endpoint.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'HTTP success is not financial correctness.' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('keeps the 390px layout within the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  });
});
