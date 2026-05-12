import { expect, test } from '@playwright/test';

test('shows public home shell with primary navigation and real sections', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: /Dashboard publico para inscricoes, ranking ao vivo e patrocinio do INTRADEBAS 2026\./,
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Inscricoes' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Resultados ao vivo' })).toBeVisible();
  await expect(page.getByText('Atletas cadastrados')).toBeVisible();
  await expect(page.getByText('As tres frentes que movem o INTRADEBAS')).toBeVisible();
});

test('does not render public shell on admin login', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('button', { name: 'Quero me inscrever' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Entrar no painel' })).toBeVisible();
});
