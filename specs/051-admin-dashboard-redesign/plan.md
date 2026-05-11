# Implementation Plan: Admin Dashboard Redesign

**Branch**: `051-admin-dashboard-redesign` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/051-admin-dashboard-redesign/spec.md`

## Summary

Redesign `/admin/dashboard` into a production-grade administrative dashboard inspired by the approved `next-shadcn-admin-dashboard` reference. The implementation will keep the current Next.js frontend and existing backend contracts, replacing the current button-only page with a sidebar/topbar shell, real metric cards, team performance panel, operational records table/list, empty states, and responsive behavior without mock data.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Next.js 15  
**Primary Dependencies**: Next.js App Router, existing fetch helpers in `frontend/app/lib.ts`, existing global CSS  
**Storage**: N/A for new persistence; dashboard reads existing backend data  
**Testing**: Playwright E2E via `npm run test:e2e`, Next.js build via `npm run build`  
**Target Platform**: Browser-based admin UI served by Dockerized frontend/nginx  
**Project Type**: Web application frontend slice  
**Performance Goals**: Dashboard visually usable within 3 seconds in local dev with seeded data; no client-side mock generation  
**Constraints**: Must use real API data or explicit empty states; preserve existing admin routes; avoid broad redesign of all admin subpages in this feature  
**Scale/Scope**: One primary route (`/admin/dashboard`) plus shared CSS/components as needed for reusable admin shell

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Spec Before Code**: PASS. `spec.md` exists for `051-admin-dashboard-redesign`; this `plan.md` and downstream `tasks.md` will precede implementation.
- **II. Contract-First Web Delivery**: PASS. No new backend capability is required; UI consumes existing contracts for teams, athletes, sports, results, sponsorship, media, LGPD and admin users where available.
- **III. Production-Like Local Environment**: PASS. Work remains compatible with Docker Compose frontend/backend/nginx setup.
- **IV. Security and LGPD by Default**: PASS. Dashboard must not expose extra personal data beyond existing admin surfaces and must avoid fake data that could obscure real privacy state.
- **V. Incremental MVP Slices**: PASS. The feature is scoped to `/admin/dashboard` and independently testable.

No constitution violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/051-admin-dashboard-redesign/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── admin-dashboard-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── globals.css
│   └── lib.ts
└── e2e/
    └── admin-dashboard.spec.ts
```

**Structure Decision**: Implement this as a frontend-only dashboard redesign using the existing App Router route. Add local helper functions or small components inside `frontend/app/admin/dashboard/page.tsx` unless reuse becomes necessary. Extend `frontend/app/globals.css` with admin-specific classes. Add a Playwright E2E spec for the dashboard.

## Complexity Tracking

No constitution violations or complexity exceptions.

## Phase 0: Research Summary

Research decisions are captured in [research.md](./research.md). Key decisions:

- Use the approved reference as structural inspiration, not as copied content.
- Use real existing API helpers only; missing/empty data renders empty states.
- Keep this feature scoped to the dashboard route rather than redesigning every admin subpage.

## Phase 1: Design Summary

Design artifacts:

- [data-model.md](./data-model.md): UI data entities and derivation rules.
- [contracts/admin-dashboard-ui.md](./contracts/admin-dashboard-ui.md): UI contract for dashboard sections, links, metrics and empty states.
- [quickstart.md](./quickstart.md): verification flow for local Docker and tests.

## Post-Design Constitution Check

- **Spec Before Code**: PASS. Plan and design artifacts are complete before implementation.
- **Contract-First Web Delivery**: PASS. UI contract documents consumed data and no backend changes are required.
- **Production-Like Local Environment**: PASS. Quickstart validates via Docker Compose and existing scripts.
- **Security and LGPD by Default**: PASS. The plan limits personal data display and requires real data/empty states.
- **Incremental MVP Slices**: PASS. Tasks can be generated around independently testable dashboard slices.
