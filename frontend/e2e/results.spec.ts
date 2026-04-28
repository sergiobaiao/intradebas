import { expect, test } from '@playwright/test';

test('shows public ranking results', async ({ page }) => {
  await page.goto('/resultados');

  await expect(page.getByRole('heading', { name: 'Central de resultados' })).toBeVisible();
  await expect(page.getByText('Mucura')).toBeVisible();
  await expect(page.getByText('14 pts')).toBeVisible();
  await expect(page.getByText('Guara')).toBeVisible();
  await expect(page.getByText('8 pts')).toBeVisible();
});
