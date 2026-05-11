# UI Contract: Admin Dashboard

## Route

- `GET /admin/dashboard`

## Purpose

Render the main administrative landing page with a professional dashboard structure inspired by the approved reference while using only real INTRADEBAS data or explicit empty states.

## Required Layout Regions

### Sidebar

Must include grouped navigation for all existing dashboard destinations:

- Equipes: `/admin/equipes`
- Nova equipe: `/admin/equipes/nova`
- Revisar atletas: `/admin/atletas`
- Modalidades: `/admin/modalidades`
- Nova modalidade: `/admin/modalidades/nova`
- Gerenciar patrocinio: `/admin/patrocinio`
- Gerenciar resultados: `/admin/resultados`
- Ranking: `/admin/ranking`
- Auditoria: `/admin/auditoria`
- LGPD: `/admin/lgpd`
- Usuarios admin: `/admin/usuarios`
- Backdrop: `/admin/backdrop`
- Midia: `/admin/midia`
- Nova midia: `/admin/midia/nova`
- Configuracoes: `/admin/configuracoes`

### Topbar

Must include:

- Page context for the admin dashboard.
- Quick links or status indicators relevant to INTRADEBAS operations.
- No fake user avatar/name unless backed by the real authenticated session.

### Metrics

Must include real operational metrics derived from available data, such as:

- Total athletes.
- Pending athletes.
- Active teams.
- Registered sports/results or sponsorship capacity, depending on available API responses.

If source data is unavailable, the metric must show an unavailable/empty state, not a fake number.

### Analytic/Performance Panel

Must include a real team performance or ranking visualization using existing team/ranking data.

Allowed presentations:

- Ranking rows.
- Progress bars using real scores.
- Simple chart-like bars built from real values.

Disallowed:

- Random line charts.
- Reference dashboard customer activity data.
- Generated placeholder series.

### Operational Table/List

Must include real recent or relevant operational records. Acceptable sources include athletes, results, sports, sponsorships or media.

Required row behavior:

- Real title/name.
- Real status when available.
- Link to an existing admin route when possible.
- Empty state if no records exist.

## Responsiveness Contract

- At desktop widths, sidebar and topbar remain visible and content uses a multi-column dashboard grid.
- At tablet widths, cards and panels may collapse to fewer columns without overlap.
- At mobile widths, sidebar may become horizontal/top navigation or stacked navigation, and tables/lists must remain readable.

## Data Integrity Contract

- No dashboard section may include names, dates, counts or labels copied from the reference dashboard.
- No metric may be hardcoded unless it is a static label or route name.
- When a backend call fails, the UI must make the absence of real data visible.
