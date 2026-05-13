# Implementation Plan: 061-admin-content-guidance

## Design
- Simplify sidebar labels in `frontend/app/admin/admin-shell.tsx`.
- Rebuild sponsorship/media pages on top of `AdminPageHeader`, `AdminSurface`, `Button`, `Badge`, and related shared admin components.
- Keep `Nova midia` as a route, but remove it from the sidebar and expose the action from `/admin/midia`.

## Validation
- Update Playwright admin coverage for sidebar expectations and page guidance copy.
- Run `frontend npm run test:e2e -- --reporter=list`.
- Run `frontend npm run build`.
