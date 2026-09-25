import { expect, test } from '@playwright/test';

test('home page renders the main heading', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('src/app/page.tsx')).toBeVisible();
});

test('responses include the baseline security headers', async ({ request }) => {
  const response = await request.get('/');

  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-powered-by']).toBeUndefined();
});

test('unknown routes render the not-found page with a 404 status', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
});
