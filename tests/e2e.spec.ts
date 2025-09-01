import { test, expect } from '@playwright/test';

test('home page has title and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Cyber Security Dictionary');
  await expect(page.locator('h1')).toHaveText('Cyber Security Dictionary');
});
