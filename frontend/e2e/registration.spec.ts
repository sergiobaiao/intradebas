import { expect, test } from '@playwright/test';

test('submits a public athlete registration', async ({ page }) => {
  await page.goto('/inscricao');

  await page.getByLabel('Nome completo').fill('Joao Silva Santos');
  await page.getByLabel('CPF').fill('000.000.000-00');
  await page.getByLabel('E-mail').fill('joao@example.com');
  await page.getByLabel('Telefone').fill('(86) 99999-0000');
  await page.getByLabel('Data de nascimento').fill('1990-01-10');
  await page.getByLabel('Equipe').selectOption('team-1');
  await page.getByLabel('Futsal').check();
  await page
    .getByLabel(/Autorizo o tratamento/)
    .check();

  await page.getByRole('button', { name: 'Enviar inscricao' }).click();

  await expect(page.getByText('Inscricao concluida com sucesso.')).toBeVisible();
  await expect(page.getByText(/Protocolo:/)).toContainText('athlete-1');
});
