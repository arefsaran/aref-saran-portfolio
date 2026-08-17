import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('portfolio experience', () => {
  test('loads the complete hero without runtime or asset failures', async ({ page }) => {
    const runtimeErrors = [];
    const failedRequests = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('requestfailed', (request) => failedRequests.push(request.url()));

    await page.goto('/');

    await expect(page).toHaveTitle(/Aref Saran/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('safer to change');
    await expect(page.getByText('Open to thoughtful collaborations')).toBeVisible();
    await expect(page.locator('.portrait-card img')).toHaveJSProperty('complete', true);
    await expect(page.locator('html')).toHaveAttribute('data-enhanced', 'true');
    expect(runtimeErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('runs the interactive release-confidence suite to completion', async ({ page }) => {
    await page.goto('/#lab');
    const consolePanel = page.getByTestId('lab-console');

    await page.getByTestId('run-suite').click();
    await expect(consolePanel).toHaveAttribute('data-run-state', 'complete', { timeout: 8_000 });
    await expect(page.getByTestId('suite-state')).toHaveText('Passed');
    await expect(page.getByTestId('result-summary')).toHaveText('Release confidence: high');
    await expect(page.locator('.pipeline li[data-state="passed"]')).toHaveCount(4);
    await expect(page.locator('.progress-track')).toHaveAttribute('aria-valuenow', '100');
    await expect(page.getByTestId('run-suite')).toBeEnabled();
  });

  test('provides a keyboard-friendly mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toHaveAttribute('data-open', 'true');

    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();

    await menu.click();
    await page.getByRole('link', { name: 'Quality system' }).click();
    await expect(page).toHaveURL(/#quality-system$/);
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  test('switches and persists the visual theme', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-theme-toggle]');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  for (const width of [320, 375, 768, 1024, 1440]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const overflow = await page.evaluate(() => {
        const clientWidth = document.documentElement.clientWidth;
        const offenders = [...document.querySelectorAll('body *')]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { element: element.className || element.tagName, left: Math.round(rect.left), right: Math.round(rect.right) };
          })
          .filter(({ left, right }) => left < -1 || right > clientWidth + 1)
          .slice(0, 8);
        return { clientWidth, scrollWidth: document.documentElement.scrollWidth, offenders };
      });
      expect(overflow.scrollWidth, JSON.stringify(overflow.offenders)).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }

  test('keeps content and the demo usable with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const revealState = await page.locator('[data-reveal]').first().evaluate((element) => {
      const styles = getComputedStyle(element);
      return { opacity: styles.opacity, transform: styles.transform };
    });
    expect(revealState).toEqual({ opacity: '1', transform: 'none' });

    await page.getByTestId('run-suite').click();
    await expect(page.getByTestId('lab-console')).toHaveAttribute('data-run-state', 'complete');
    await expect(page.locator('.pipeline li[data-state="passed"]')).toHaveCount(4);
  });

  test('has no automatically detectable WCAG A or AA violations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
