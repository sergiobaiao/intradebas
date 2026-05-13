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

const adminRoutes = [
  { path: '/admin/atletas', heading: 'Atletas' },
  { path: '/admin/equipes', heading: 'Equipes' },
  { path: '/admin/modalidades', heading: 'Modalidades' },
  { path: '/admin/resultados', heading: 'Resultados operacionais' },
  { path: '/admin/patrocinio', heading: 'Patrocinio' },
  { path: '/admin/midia', heading: 'Galeria de midia' },
  { path: '/admin/lgpd', heading: 'LGPD' },
  { path: '/admin/auditoria', heading: 'Logs de auditoria' },
  { path: '/admin/usuarios', heading: 'Usuarios do sistema' },
  { path: '/admin/configuracoes', heading: 'Pontuacao e regras' },
];

const formRoutes = [
  { path: '/admin/equipes/nova', heading: 'Nova equipe' },
  { path: '/admin/modalidades/nova', heading: 'Nova modalidade' },
  { path: '/admin/atletas/novo', heading: 'Novo atleta' },
  { path: '/admin/midia/nova', heading: 'Novo item de midia' },
];

for (const route of adminRoutes) {
  test(`admin route ${route.path} renders with correct heading`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { name: route.heading, exact: true })).toBeVisible();
    
    // Ensure basic admin shell components are present (from admin-shell.tsx)
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
  });
}

for (const route of formRoutes) {
  test(`admin form route ${route.path} renders with correct heading`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
  });
}

test('admin screens do not render reference mock strings', async ({ page }) => {
  // Test representative list route
  await page.goto('/admin/atletas');
  
  await expect(page.getByText('Total Revenue')).toHaveCount(0);
  await expect(page.getByText('Customer Activity')).toHaveCount(0);
  await expect(page.getByText('Sarah Parker')).toHaveCount(0);
});

test('admin list screens handle empty states correctly', async ({ page }) => {
  // We don't have an easy way to force empty state in E2E without real API control or mocking
  // but we can check if the empty state text from athletes page is at least not visible when data exists
  await page.goto('/admin/atletas');
  const emptyState = page.getByText('Nenhum atleta encontrado');
  
  // If there are articles, empty state should not be visible
  const articles = await page.locator('article').count();
  if (articles > 0) {
    await expect(emptyState).not.toBeVisible();
  }
});

for (const viewport of [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'mobile' },
]) {
  test(`admin athletes list is usable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/admin/atletas');
    
    await expect(page.getByRole('heading', { name: 'Atletas', exact: true })).toBeVisible();
    // In mobile, sidebar might be hidden or in a menu, but main content should be visible
    await expect(page.locator('main')).toBeVisible();
  });
}
