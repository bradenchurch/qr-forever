import { test, expect } from '@playwright/test';

const QR_TYPES = [
  { id: 'url', label: 'URL', fields: ['Enter URL...'] },
  { id: 'wifi', label: 'WiFi', fields: ['Network Name (SSID)', 'Password'] },
  { id: 'vcard', label: 'vCard', fields: ['First Name', 'Last Name', 'Company', 'Title', 'Phone Number', 'Email Address', 'Address', 'Website'] },
  { id: 'email', label: 'Email', fields: ['Email To', 'Subject', 'Body'] },
  { id: 'sms', label: 'SMS', fields: ['Phone Number', 'Message'] },
  { id: 'phone', label: 'Phone', fields: ['Phone Number'] },
  { id: 'crypto', label: 'Crypto', fields: ['Wallet Address'] },
];

test.describe('QR Type Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/generator');
  });

  for (const type of QR_TYPES) {
    test(`should show correct fields for ${type.label}`, async ({ page }) => {
      // Click the type button
      await page.locator('div.flex.flex-wrap.gap-2.mb-6 button').filter({ hasText: new RegExp(`^${type.label}(Premium)?$`, 'i') }).click({ force: true });

      // Check if fields are visible
      for (const field of type.fields) {
        if (field === 'Body' || field === 'Message') {
            await expect(page.locator(`textarea[placeholder="${field}"]`)).toBeVisible();
        } else {
            await expect(page.getByPlaceholder(field, { exact: true })).toBeVisible();
        }
      }

      // Special checks for selects
      if (type.id === 'wifi') {
        const wifiSelect = page.locator('form select');
        await expect(wifiSelect).toBeVisible();
        await expect(wifiSelect).toContainText('WPA/WPA2');
        await expect(wifiSelect).toContainText('WEP');
        await expect(wifiSelect).toContainText('None');
      }

      if (type.id === 'crypto') {
        const cryptoSelect = page.locator('form select');
        await expect(cryptoSelect).toBeVisible();
        await expect(cryptoSelect).toContainText('Bitcoin');
        await expect(cryptoSelect).toContainText('Ethereum');
        await expect(cryptoSelect).not.toContainText('Litecoin');
      }
    });
  }
});
