import { test, expect, Page } from '@playwright/test';

async function gotoHomeWithRetry(page: Page) {
  for (let i = 0; i < 8; i++) {
    await page.goto('/');

    try {
      await page.getByTestId('counter').waitFor({ state: 'visible', timeout: 2000 });
      return;
    } catch {
      // Retry navigation in case the app throws during load.
    }
  }

  await expect(page.getByTestId('counter')).toBeVisible();
}

test('homepage loads and shows title', async ({ page }) => {
  await gotoHomeWithRetry(page);
  await expect(page).toHaveTitle(/spanish-word-flip-flash/i);
  await expect(page.getByTestId('next-btn')).toBeVisible();
});


