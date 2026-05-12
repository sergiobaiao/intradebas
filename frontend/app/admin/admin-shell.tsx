'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavigationGroup = {
  label: string;
  items: { label: string; href: string; badge?: string }[];
};

const navigationGroups: NavigationGroup[] = [
  {
    label: 'Operacao',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Gerenciar resultados', href: '/admin/resultados' },
      { label: 'Ranking', href: '/admin/ranking' },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { label: 'Atletas', href: '/admin/atletas' },
      { label: 'Equipes', href: '/admin/equipes' },
      { label: 'Modalidades', href: '/admin/modalidades' },
    ],
  },
  {
    label: 'Patrocinio e midia',
    items: [
      { label: 'Gerenciar patrocinio', href: '/admin/patrocinio' },
      { label: 'Backdrop', href: '/admin/backdrop' },
      { label: 'Midia', href: '/admin/midia' },
      { label: 'Nova midia', href: '/admin/midia/nova' },
    ],
  },
  {
    label: 'Governanca',
    items: [
      { label: 'LGPD', href: '/admin/lgpd' },
      { label: 'Auditoria', href: '/admin/auditoria' },
      { label: 'Usuarios admin', href: '/admin/usuarios' },
      { label: 'Configuracoes', href: '/admin/configuracoes' },
    ],
  },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === '/admin/dashboard') {
    return pathname === href || pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="admin-dashboard-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">IN</span>
          <div>
            <strong>INTRADEBAS</strong>
            <small>Studio Admin</small>
          </div>
        </div>

        <a className="admin-quick-action" href="/admin/atletas">
          Revisar inscricoes
        </a>

        <nav className="admin-nav" aria-label="Navegacao administrativa">
          {navigationGroups.map((group) => (
            <section key={group.label} className="admin-nav-group">
              <span>{group.label}</span>
              {group.items.map((item) => (
                <a
                  key={item.href}
                  className={isActiveRoute(pathname, item.href) ? 'active' : undefined}
                  href={item.href}
                >
                  {item.label}
                  {item.badge ? <small>{item.badge}</small> : null}
                </a>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <section className="admin-dashboard-main admin-screen-content">{children}</section>
    </main>
  );
}
