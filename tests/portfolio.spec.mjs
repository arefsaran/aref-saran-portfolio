import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const targetViewports = [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
];

test.describe('portfolio experience', () => {
  test('loads the complete professional positioning without runtime, asset, or third-party failures', async ({ page }) => {
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

    await expect(page).toHaveTitle('Aref Saran — Senior Test Engineer');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('I engineer confidence into complex software.');
    await expect(page.getByText('Aref Saran · Senior Test Engineer')).toBeVisible();
    await expect(page.getByText('2,300+', { exact: true }).first()).toBeVisible();
    await expect(page.locator('main > .major-area')).toHaveCount(7);
    await expect(page.locator('.portrait img')).toHaveJSProperty('complete', true);
    await expect(page.locator('html')).toHaveAttribute('data-enhanced', 'true');
    expect(await page.locator('.portrait img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    expect(runtimeErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    expect(thirdPartyRequests).toEqual([]);
  });

  test('renders the seven-area information architecture and concise technical depth', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Solve the quality problem behind the test request.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Evidence from consequential engineering problems.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'From risk to a release decision.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Systems thinking, built through delivery.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Have a quality problem worth solving?' })).toBeVisible();
    await expect(page.locator('.service-card')).toHaveCount(4);
    await expect(page.locator('.case-study')).toHaveCount(3);
    await expect(page.locator('.approach-flow > li')).toHaveCount(5);
    await expect(page.getByText('BPMN / Camunda', { exact: true })).toBeVisible();
    await expect(page.getByText('AI-assisted engineering workflow', { exact: true })).toBeVisible();
  });

  test('connects every internal link and the primary call to action to a visible target', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const primaryCta = page.getByRole('link', { name: /View selected work/ });
    await expect(primaryCta).toHaveAttribute('href', '#work');
    await primaryCta.click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.getByRole('heading', { name: 'Evidence from consequential engineering problems.' })).toBeVisible();

    const targetPosition = await page.locator('#work').evaluate((target) => ({
      top: target.getBoundingClientRect().top,
      headerHeight: document.querySelector('.site-header').getBoundingClientRect().height
    }));
    expect(targetPosition.top).toBeGreaterThanOrEqual(targetPosition.headerHeight - 1);

    const internalLinks = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    const missingTargets = await page.evaluate((hrefs) => hrefs.filter((href) => !document.querySelector(href)), internalLinks);
    expect(missingTargets).toEqual([]);

    const unsafeExternalLinks = await page.locator('a[target="_blank"]').evaluateAll((links) => links
      .filter((link) => !link.relList.contains('noopener') || !link.relList.contains('noreferrer'))
      .map((link) => link.href));
    expect(unsafeExternalLinks).toEqual([]);
  });

  test('provides a compact keyboard-friendly mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const header = page.locator('.site-header');
    const menu = page.locator('[data-menu-toggle]');
    const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
    await expect(menu).toHaveAccessibleName('Open navigation');
    const closedHeight = await header.evaluate((element) => element.getBoundingClientRect().height);
    expect(closedHeight).toBeGreaterThanOrEqual(56);
    expect(closedHeight).toBeLessThanOrEqual(64);

    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveAccessibleName('Close navigation');
    await expect(navigation).toHaveAttribute('data-open', 'true');
    await expect(navigation).toBeVisible();
    expect(await header.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThanOrEqual(64);

    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();

    await menu.click();
    await navigation.getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  test('contains no theme control, persisted theme state, or switching resources', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('[data-theme-toggle], .theme-toggle')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-source', /.+/);
    expect(await page.evaluate(() => localStorage.getItem('aref-theme'))).toBeNull();
    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
    expect(resources.some((url) => url.includes('theme-init'))).toBe(false);
  });

  test('expands a case-study engineering breakdown with the keyboard', async ({ page }) => {
    await page.goto('/#work');
    const details = page.locator('.case-detail').first();
    const summary = details.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(details.getByText('Verification', { exact: true })).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(details).not.toHaveAttribute('open', '');
  });

  for (const viewport of targetViewports) {
    test(`has intentional geometry at ${viewport.width}×${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const geometry = await page.evaluate(() => {
        const clientWidth = document.documentElement.clientWidth;
        const offenders = [...document.querySelectorAll('body *')]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { element: element.className || element.tagName, left: Math.round(rect.left), right: Math.round(rect.right) };
          })
          .filter(({ left, right }) => left < -1 || right > clientWidth + 1)
          .slice(0, 8);
        const areas = [...document.querySelectorAll('main > .major-area')];
        const gaps = areas.slice(1).map((area, index) => Math.round(area.getBoundingClientRect().top - areas[index].getBoundingClientRect().bottom));
        const paddings = [...document.querySelectorAll('.hero, .major-area.section, .approach-inner')].map((element) => {
          const styles = getComputedStyle(element);
          return { selector: element.className, top: parseFloat(styles.paddingTop), bottom: parseFloat(styles.paddingBottom) };
        });
        return {
          clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          offenders,
          gaps,
          paddings,
          headerHeight: document.querySelector('.site-header').getBoundingClientRect().height,
          portraitHeight: document.querySelector('.portrait img').getBoundingClientRect().height
        };
      });

      expect(geometry.scrollWidth, JSON.stringify(geometry.offenders)).toBeLessThanOrEqual(geometry.clientWidth + 1);
      geometry.gaps.forEach((gap) => expect(gap).toBeLessThanOrEqual(1));
      const paddingLimit = viewport.width <= 768 ? 88 : 128;
      geometry.paddings.forEach(({ selector, top, bottom }) => {
        expect(top, `${selector} top padding`).toBeLessThanOrEqual(paddingLimit);
        expect(bottom, `${selector} bottom padding`).toBeLessThanOrEqual(paddingLimit);
      });
      if (viewport.width <= 860) expect(geometry.headerHeight).toBeLessThanOrEqual(64);
      if (viewport.width <= 768) expect(geometry.portraitHeight).toBeLessThanOrEqual(420);
    });
  }

  for (const width of [375, 1440]) {
    test(`keeps the quality approach collision-free at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/#approach');
      const layout = await page.locator('.approach-flow').evaluate((flow) => {
        const items = [...flow.children];
        const collisions = [];
        items.forEach((item, index) => {
          const title = item.querySelector('h3').getBoundingClientRect();
          const body = item.querySelector('p').getBoundingClientRect();
          if (title.bottom > body.top + 1) collisions.push(`text overlap in item ${index}`);
          items.slice(index + 1).forEach((other, offset) => {
            const first = item.getBoundingClientRect();
            const second = other.getBoundingClientRect();
            const overlapX = Math.min(first.right, second.right) - Math.max(first.left, second.left);
            const overlapY = Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);
            if (overlapX > 1 && overlapY > 1) collisions.push(`item ${index} overlaps item ${index + offset + 1}`);
          });
        });
        return {
          collisions,
          listStyle: getComputedStyle(flow).listStyleType,
          text: items.map((item) => item.innerText.trim())
        };
      });

      expect(layout.collisions).toEqual([]);
      expect(layout.listStyle).toBe('none');
      layout.text.forEach((text) => expect(text).not.toMatch(/^\d{2}\s/));
      await expect(page.locator('.layer-index, .architecture-layer, .boundary-nodes')).toHaveCount(0);
    });
  }

  test('keeps all content immediately available with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const state = await page.locator('.service-card').first().evaluate((element) => {
      const styles = getComputedStyle(element);
      return { opacity: styles.opacity, transform: styles.transform, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
    });
    expect(state).toEqual({ opacity: '1', transform: 'none', scrollBehavior: 'auto' });
  });

  test('keeps the static runtime and layout-shift budgets', async ({ page }) => {
    await page.addInitScript(() => {
      window.__portfolioMetrics = { cls: 0, lcp: 0 };
      if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) window.__portfolioMetrics.cls += entry.value;
          });
        }).observe({ type: 'layout-shift', buffered: true });
      }
      if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          window.__portfolioMetrics.lcp = entries.at(-1)?.startTime ?? 0;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      }
    });

    await page.goto('/');
    await expect(page.locator('.portrait img')).toHaveJSProperty('complete', true);
    await page.waitForTimeout(500);
    const performance = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      return {
        cls: window.__portfolioMetrics.cls,
        lcp: window.__portfolioMetrics.lcp,
        requestCount: resources.length + 1,
        encodedBytes: (navigation?.encodedBodySize ?? 0) + resources.reduce((total, entry) => total + entry.encodedBodySize, 0)
      };
    });

    expect(performance.cls).toBeLessThanOrEqual(0.1);
    expect(performance.lcp).toBeGreaterThan(0);
    expect(performance.lcp).toBeLessThan(5_000);
    expect(performance.requestCount).toBeLessThanOrEqual(6);
    expect(performance.encodedBytes).toBeLessThanOrEqual(250_000);
  });

  test('uses logical headings, unique ids, and valid Person, ProfilePage, and WebSite data', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    const content = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      const levels = [...document.querySelectorAll('h1,h2,h3,h4')].map((heading) => Number(heading.tagName.slice(1)));
      const json = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
      return { ids, levels, json };
    });
    expect(new Set(content.ids).size).toBe(content.ids.length);
    content.levels.slice(1).forEach((level, index) => expect(level - content.levels[index]).toBeLessThanOrEqual(1));
    const types = content.json['@graph'].map((item) => item['@type']);
    expect(types).toEqual(expect.arrayContaining(['Person', 'ProfilePage', 'WebSite']));
    expect(content.json['@graph'].find((item) => item['@type'] === 'Person')).toMatchObject({ name: 'Aref Saran', jobTitle: 'Senior Test Engineer' });
  });

  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    test(`has no automatically detectable WCAG A or AA violations at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
