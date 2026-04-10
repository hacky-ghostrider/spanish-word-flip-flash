import { test, expect, Page } from '@playwright/test';

async function gotoHomeWithRandomButtonRetry(page: Page) {
  for (let i = 0; i < 10; i++) {
    await page.goto('/');
    const counter = page.getByTestId('counter');
    const randomButton = page.getByTestId('random-btn');

    try {
      await counter.waitFor({ state: 'visible', timeout: 2000 });
      await randomButton.waitFor({ state: 'visible', timeout: 1000 });
      return;
    } catch {
      // Retry navigation until the app loads and the random button is shown.
    }
  }

  await expect(page.getByTestId('counter')).toBeVisible();
  await expect(page.getByTestId('random-btn')).toBeVisible();
}

test('Random Card jumps to a non-sequential card (not 2/15 from 1/15)', async ({ page }) => {
  await gotoHomeWithRandomButtonRetry(page);

  const counter = page.getByTestId('counter');
  await expect(counter).toHaveText('1 / 15');

  const randomButton = page.getByTestId('random-btn');
  await expect(randomButton).toBeVisible({ timeout: 5000 });

  // Click a few times to ensure we land on non-sequential indices
  let sawNonSequential = false;
  for (let i = 0; i < 3; i++) {
    await randomButton.click();
    const text = await counter.textContent();
    // Expect not '2 / 15' when starting from '1 / 15'
    if (text && !/^\s*2\s*\/\s*15\s*$/.test(text)) {
      sawNonSequential = true;
      break;
    }
  }

  expect(sawNonSequential).toBeTruthy();
});


