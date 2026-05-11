# Quickstart: Admin Screens Redesign

## Run Locally

```bash
docker compose -f docker-compose.dev.yml up -d
```

If Docker is unavailable, validate through the frontend build and Playwright server:

```bash
cd frontend
npm run build
npm run test:e2e
```

## Manual Review

Open these routes:

- `http://localhost:3000/admin/dashboard`
- `http://localhost:3000/admin/atletas`
- `http://localhost:3000/admin/equipes`
- `http://localhost:3000/admin/modalidades`
- `http://localhost:3000/admin/resultados`
- `http://localhost:3000/admin/patrocinio`
- `http://localhost:3000/admin/midia`
- `http://localhost:3000/admin/lgpd`
- `http://localhost:3000/admin/auditoria`
- `http://localhost:3000/admin/usuarios`

Verify:

- Visual pattern matches the dashboard standard from feature 051.
- Existing actions remain available.
- Data is real or shown as empty state.
- No reference-dashboard customer/revenue mock content appears.
- Layout remains usable at 1440px, 1024px, 768px and 390px.

## Automated Validation

```bash
cd frontend
npm run build
npm run test:e2e
```

Expected:

- Frontend build succeeds.
- Existing tests continue passing.
- New admin screen coverage passes.
