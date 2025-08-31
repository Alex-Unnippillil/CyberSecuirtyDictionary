import { test, expect } from '@playwright/test';

// Test 1: Home page
test('home page shows dictionary title and terms', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Cyber Security Dictionary' })).toBeVisible();
  await page.waitForSelector('#terms-list .dictionary-item');
});

// Test 2: Search page
test('search returns expected term', async ({ page }) => {
  await page.goto('/search.html');
  await page.fill('#search-box', 'phishing');
  await expect(page.locator('.result-card').first()).toContainText('Phishing');
});

// Test 3: Term page via click
test('clicking a term shows its definition', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#terms-list .dictionary-item');
  const first = page.locator('#terms-list .dictionary-item').first();
  const term = await first.locator('h3').evaluate(el => el.childNodes[0].textContent.trim());
  await first.click();
  await expect(page.locator('#definition-container')).toBeVisible();
  await expect(page.locator('#definition-container')).toContainText(term);
});

// Test 4: Favorites filter
test('favorites filter shows only favorited items', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#terms-list .dictionary-item');
  const first = page.locator('#terms-list .dictionary-item').first();
  await first.locator('.favorite-star').click();
  await page.check('#show-favorites');
  await expect(page.locator('#terms-list .dictionary-item')).toHaveCount(1);
});

// Test 5: Compare view (currently missing)
test('compare view is not found', async ({ request }) => {
  const response = await request.get('/compare.html');
  expect(response.status()).toBe(404);
});
