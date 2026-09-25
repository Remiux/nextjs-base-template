import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Add every public route here; each one is checked in both locales and both color schemes.
const pages = ['/en', '/es', '/en/this-route-does-not-exist'];

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`${colorScheme} mode`, () => {
    test.use({ colorScheme });

    for (const path of pages) {
      test(`${path} has no WCAG 2.2 AA violations`, async ({ page }) => {
        await page.goto(path);

        const { violations } = await new AxeBuilder({ page }).withTags(WCAG_22_AA).analyze();

        expect(violations).toEqual([]);
      });
    }
  });
}
