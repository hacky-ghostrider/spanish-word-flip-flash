import { test, expect, Page } from '@playwright/test';

async function gotoHomeWithRetry(page: Page) {
  for (let i = 0; i < 8; i++) {
    await page.goto('/');
    const counter = page.getByTestId('counter');
    try {
      await counter.waitFor({ state: 'visible', timeout: 2000 });
      return;
    } catch {
      // Retry navigation in case of random error inject on load
    }
  }
  // Final attempt throws if missing
  await expect(page.getByTestId('counter')).toBeVisible();
}

test('flip the card and iterate next until wrapping to 1/15', async ({ page }) => {
  await gotoHomeWithRetry(page);

  const counter = page.getByTestId('counter');
  const card = page.getByTestId('card');
  const transformInner = page.getByTestId('card-inner');
  const next = page.getByTestId('next-btn');

  await expect(counter).toHaveText('1 / 15');

  const classBefore = await transformInner.getAttribute('class');
  const wasFlippedBefore = (classBefore ?? '').includes('rotate-y-180');

  await card.click({ force: true });
  await expect
    .poll(async () => {
      const classAfter = await transformInner.getAttribute('class');
      return (classAfter ?? '').includes('rotate-y-180');
    })
    .not.toBe(wasFlippedBefore);

  // Use dispatched clicks here to avoid CI/browser-specific actionability
  // delays from the floating card animation while still exercising the button handler.
  for (let index = 2; index <= 15; index++) {
    await next.dispatchEvent('click');
    await expect(counter).toHaveText(`${index} / 15`);
  }

  await next.dispatchEvent('click');
  await expect(counter).toHaveText('1 / 15');
});


