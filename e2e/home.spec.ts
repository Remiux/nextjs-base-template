import { expect, test } from '@playwright/test';

test('home page renders the main heading', async ({ page }) => {
  await page.goto('/en');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('src/app/[locale]/page.tsx')).toBeVisible();
});

test('responses include the baseline security headers', async ({ request }) => {
  const response = await request.get('/en');

  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-powered-by']).toBeUndefined();
});

test('robots.txt and the sitemap are served outside the locale routing', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  const sitemap = await request.get('/sitemap.xml');

  expect(robots.ok()).toBe(true);
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('/es');
});
