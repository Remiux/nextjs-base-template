import { expect, test } from '@playwright/test';

test('home page renders the getting started heading', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(/to get started, edit the/i)).toBeVisible();
});
