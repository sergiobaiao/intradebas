# UI Contract: Admin Screens Redesign

## Routes In Scope

Minimum primary routes:

- `/admin/atletas`
- `/admin/equipes`
- `/admin/modalidades`
- `/admin/resultados`
- `/admin/patrocinio`
- `/admin/midia`
- `/admin/lgpd`
- `/admin/auditoria`
- `/admin/usuarios`
- `/admin/configuracoes`
- `/admin/backdrop`
- `/admin/ranking`

Creation/edit routes may be included when touched by the route group:

- `/admin/atletas/novo`
- `/admin/equipes/nova`
- `/admin/modalidades/nova`
- `/admin/midia/nova`
- `/admin/resultados/novo`
- Detail/edit routes under `[id]`

## Required Page Structure

Each altered route must expose:

- Admin page heading.
- Short description of the operational purpose.
- Existing primary actions.
- Real records or explicit empty state.
- Navigation back to dashboard or equivalent admin context.

## Data Integrity Rules

- No fake records.
- No copied customer/revenue data from the reference dashboard.
- No arbitrary counts to improve visual density.
- Existing route actions must remain accessible.

## Responsiveness Rules

- Desktop: content may use multi-column cards/tables.
- Tablet: content collapses to fewer columns.
- Mobile: tables/cards remain readable through stacked layout or controlled horizontal scroll.

## Test Contract

Automated tests must verify:

- Representative admin routes render after admin cookie/session bypass.
- Core headings/actions are visible.
- Mock/reference strings do not appear.
- Responsive viewport smoke coverage exists for at least one representative list route.
