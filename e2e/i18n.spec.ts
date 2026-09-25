import { expect, test } from '@playwright/test';

test.describe('with an English browser', () => {
  test.use({ locale: 'en-US' });

  test('redirects the root to the default locale', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('switches language and remembers the choice', async ({ page }) => {
    await page.goto('/en');

    await page
      .getByRole('navigation', { name: 'Language' })
      .getByRole('link', { name: 'Español' })
      .click();

    await expect(page).toHaveURL(/\/es$/);
    await expect(page.getByRole('link', { name: 'Documentación' })).toBeVisible();

    // The locale cookie now wins over the browser language.
    await page.goto('/');
    await expect(page).toHaveURL(/\/es$/);
  });

  test('renders the localized not-found page with a 404 status', async ({ page }) => {
    const response = await page.goto('/es/this-route-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
  });

  test('prefixes unlocalized unknown paths and renders the not-found page', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page).toHaveURL(/\/en\/this-route-does-not-exist$/);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });
});

test.describe('with a Spanish browser', () => {
  test.use({ locale: 'es-ES' });

  test('negotiates the locale from the Accept-Language header', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});
