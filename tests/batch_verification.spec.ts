import { test, expect } from '@playwright/test';

test.describe('Batch QR Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/generator');
  });

  test('should show batch generation fields when batch tab is selected', async ({ page }) => {
    // Select Batch tab
    await page.locator('button').filter({ hasText: /^Batch(Premium)?$/i }).click({ force: true });

    // Check for upload area and manual entry
    await expect(page.locator('text=Upload a CSV file')).toBeVisible();
    await expect(page.getByPlaceholder(/https:\/\/example\.com.*https:\/\/google\.com/s)).toBeVisible();
  });

  test('should show preview when URLs are entered manually', async ({ page }) => {
    await page.locator('button').filter({ hasText: /^Batch(Premium)?$/i }).click({ force: true });

    const textarea = page.getByPlaceholder(/https:\/\/example\.com.*https:\/\/google\.com/s);
    await textarea.fill('https://test1.com\nhttps://test2.com');

    await expect(page.locator('text=Preview (2 URLs)')).toBeVisible();
    await expect(page.locator('text=1. https://test1.com')).toBeVisible();
    await expect(page.locator('text=2. https://test2.com')).toBeVisible();
  });

  test('should show generate button for batch', async ({ page }) => {
    await page.locator('button').filter({ hasText: /^Batch(Premium)?$/i }).click({ force: true });
    await expect(page.getByRole('button', { name: /Generate & Download ZIP/i })).toBeVisible();
  });
});
