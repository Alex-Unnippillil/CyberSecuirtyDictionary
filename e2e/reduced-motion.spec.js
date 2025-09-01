const { test, expect } = require('@playwright/test');

test('reduced-motion toggle disables transforms', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.dictionary-item');
  const firstItem = page.locator('.dictionary-item').first();

  // Hover to trigger transform before enabling reduced motion
  await firstItem.hover();
  const baseline = await firstItem.evaluate((el) => getComputedStyle(el).transform);
  expect(baseline).not.toBe('none');
  await page.mouse.move(0, 0);

  await page.click('#reduce-motion-toggle');
  await firstItem.hover();
  const reduced = await firstItem.evaluate((el) => getComputedStyle(el).transform);
  expect(reduced).toBe('none');
});

test('no CLS spikes during route change', async ({ page }) => {
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('/search.html');
  await page.waitForLoadState('load');
  await page.waitForTimeout(500);
  const cls = await page.evaluate(() => window.__cls);
  expect(cls).toBeLessThan(0.1);
});
