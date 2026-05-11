# Quickstart: Admin Dashboard Redesign

## Prerequisites

- Docker Compose development stack available.
- Backend seeded with at least the default teams/admin user where possible.
- Browser access to `http://localhost:3000` or `http://localhost`.

## Run Locally

```bash
docker compose -f docker-compose.dev.yml up -d
```

Open:

```text
http://localhost:3000/admin/dashboard
```

## Manual Verification

1. Confirm the dashboard has a sidebar, topbar, metric cards, team performance/ranking panel and operational table/list.
2. Confirm every link previously exposed as a button is still available in the new navigation.
3. Confirm no copied reference data appears, including customer names, fake revenue, fake customer counts or random growth numbers.
4. Confirm metrics match real API data or display explicit empty states.
5. Resize the browser to 1440px, 1024px, 768px and 390px widths and confirm there is no horizontal layout break.

## Automated Verification

From `frontend/`:

```bash
npm run build
npm run test:e2e
```

Expected result:

- Next.js build succeeds.
- Existing E2E tests continue passing.
- New dashboard E2E test confirms admin navigation and real-data/empty-state contract.

## Regression Watch

- Do not remove existing admin routes.
- Do not introduce fake dashboard data to make cards look populated.
- Do not expose extra athlete personal data beyond existing admin display conventions.
