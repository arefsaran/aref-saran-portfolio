import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('portfolio experience', () => {
  test('loads the complete hero without runtime, asset, or third-party failures', async ({ page }) => {
    const runtimeErrors = [];
    const failedRequests = [];
    const thirdPartyRequests = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('requestfailed', (request) => failedRequests.push(request.url()));
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== '127.0.0.1') thirdPartyRequests.push(request.url());
    });

    await page.goto('/');

    await expect(page).toHaveTitle('Aref Saran — Quality Engineer');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('confidence');
    await expect(page.getByText('Open to thoughtful collaborations')).toBeVisible();
    await expect(page.getByText('Portfolio visualization · not live infrastructure')).toBeVisible();
    await expect(page.locator('.portrait-card img')).toHaveJSProperty('complete', true);
    await expect(page.locator('html')).toHaveAttribute('data-enhanced', 'true');
    expect(runtimeErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    expect(thirdPartyRequests).toEqual([]);
  });

  test('connects navigation and primary calls to action to real targets', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Explore my work/ })).toHaveAttribute('href', '#work');
    await expect(page.locator('.hero-actions').getByRole('link', { name: /Let’s talk/ })).toHaveAttribute('href', 'mailto:arefsaran@gmail.com');

    const internalLinks = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    const missingTargets = await page.evaluate((hrefs) => hrefs.filter((href) => !document.querySelector(href)), internalLinks);
    expect(missingTargets).toEqual([]);

    const unsafeExternalLinks = await page.locator('a[target="_blank"]').evaluateAll((links) => links
      .filter((link) => !link.relList.contains('noopener') || !link.relList.contains('noreferrer'))
      .map((link) => link.href));
    expect(unsafeExternalLinks).toEqual([]);
  });

  test('runs all seven release-confidence stages to an explicit decision', async ({ page }) => {
    await page.goto('/#lab');
    const consolePanel = page.getByTestId('lab-console');

    await page.getByTestId('run-suite').click();
    await expect(consolePanel).toHaveAttribute('data-run-state', 'complete', { timeout: 8_000 });
    await expect(page.getByTestId('suite-state')).toHaveText('Passed');
    await expect(page.getByTestId('result-summary')).toHaveText('Release confidence: high');
    await expect(page.locator('.pipeline li[data-state="passed"]')).toHaveCount(7);
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

  test('follows system color preference and persists a manual choice', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const toggle = page.locator('[data-theme-toggle]');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme-source', 'system');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('html')).toHaveAttribute('data-theme-source', 'manual');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('expands a case-study engineering breakdown with the keyboard', async ({ page }) => {
    await page.goto('/#work');
    const details = page.locator('.case-detail').first();
    const summary = details.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(details.getByText('Engineering decision')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(details).not.toHaveAttribute('open', '');
  });

  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
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
    await expect(page.locator('.pipeline li[data-state="passed"]')).toHaveCount(7);
  });

  test('uses one H1, logical headings, unique ids, and valid Person data', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    const content = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      const levels = [...document.querySelectorAll('h1,h2,h3')].map((heading) => Number(heading.tagName.slice(1)));
      const json = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
      return { ids, levels, json };
    });
    expect(new Set(content.ids).size).toBe(content.ids.length);
    content.levels.slice(1).forEach((level, index) => expect(level - content.levels[index]).toBeLessThanOrEqual(1));
    expect(content.json).toMatchObject({ '@type': 'Person', name: 'Aref Saran', jobTitle: 'Quality Engineer' });
  });

  for (const colorScheme of ['light', 'dark']) {
    test(`has no automatically detectable WCAG A or AA violations in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme });
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
