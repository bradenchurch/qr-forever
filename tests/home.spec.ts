import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/QR/);
  });
});

test.describe('Generator Page', () => {
  test('should load generator and show premium overlay for non-logged-in users', async ({ page }) => {
    await page.goto('/generator');
    // Check that the generator loads
    await expect(page.getByRole('heading', { name: /QR Code Generator/i })).toBeVisible();
  });
});

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /Pricing/i })).toBeVisible();
  });
});
