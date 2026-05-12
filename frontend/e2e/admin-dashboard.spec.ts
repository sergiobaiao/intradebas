import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'intradebas_admin_token',
      value: 'e2e-token',
      url: 'http://127.0.0.1:3100',
    },
  ]);
});

test('shows the redesigned admin dashboard with real operational sections', async ({ page }) => {
  await page.goto('/admin/dashboard');

  await expect(page.getByRole('heading', { name: 'Dashboard operacional' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Navegacao administrativa' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Atletas' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Gerenciar resultados' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Usuarios admin' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nova equipe' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Nova modalidade' })).toHaveCount(0);

  await expect(page.getByText('Total de atletas')).toBeVisible();
  await expect(page.getByText('Inscricoes pendentes')).toBeVisible();
  await expect(page.getByText('Desempenho das equipes')).toBeVisible();
  await expect(page.getByText('Registros operacionais')).toBeVisible();
  await expect(page.getByText('Joao Silva Santos')).toBeVisible();

  await expect(page.getByText('Total Revenue')).toHaveCount(0);
  await expect(page.getByText('Customer Activity')).toHaveCount(0);
  await expect(page.getByText('Sarah Parker')).toHaveCount(0);
});

test('keeps athletes under Cadastros and exposes creation inside the page', async ({ page }) => {
  await page.goto('/admin/atletas');

  await expect(page.getByRole('heading', { name: 'Atletas' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Atletas' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Novo atleta' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nova equipe' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Nova modalidade' })).toHaveCount(0);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`keeps admin dashboard usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/admin/dashboard');

    await expect(page.getByRole('heading', { name: 'Dashboard operacional' })).toBeVisible();
    await expect(page.getByText('Desempenho das equipes')).toBeVisible();
    await expect(page.getByText('Registros operacionais')).toBeVisible();
  });
}
