# Implementation Plan: Admin Screens Redesign

**Branch**: `052-admin-screens-redesign` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/052-admin-screens-redesign/spec.md`

## Summary

Apply the Studio Admin visual standard established in feature 051 to the remaining high-traffic admin screens. The implementation will preserve existing routes, actions, backend contracts and real data flows while replacing the older public-site-like page structure with consistent admin page shells, section headers, cards, data tables, forms, empty states and responsive behavior.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Next.js 15  
**Primary Dependencies**: Next.js App Router, existing admin routes under `frontend/app/admin`, existing fetch helpers in `frontend/app/lib.ts`, global CSS from feature 051  
**Storage**: N/A for new persistence; screens consume existing backend data  
**Testing**: Playwright E2E via `npm run test:e2e`, Next.js build via `npm run build`  
**Target Platform**: Browser-based admin UI served by Dockerized frontend/nginx  
**Project Type**: Web application frontend slice  
**Performance Goals**: Admin screens remain usable within 3 seconds in local dev with seeded data  
**Constraints**: No mock data, no route/action removals, no backend contract changes unless explicitly justified  
**Scale/Scope**: At least 8 primary admin routes plus shared admin CSS/components where needed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Spec Before Code**: PASS. `spec.md` exists and this plan precedes implementation.
- **II. Contract-First Web Delivery**: PASS. No new backend contract is planned; existing contracts are preserved.
- **III. Production-Like Local Environment**: PASS. Validation remains Docker/Next compatible, though Docker daemon availability is environment-dependent.
- **IV. Security and LGPD by Default**: PASS. Existing admin data exposure is preserved; no new personal data surfaces are introduced.
- **V. Incremental MVP Slices**: PASS. Work can be delivered route-group by route-group.

No constitution violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/052-admin-screens-redesign/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── admin-screens-ui.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── admin/
│   │   ├── atletas/
│   │   ├── auditoria/
│   │   ├── backdrop/
│   │   ├── configuracoes/
│   │   ├── equipes/
│   │   ├── lgpd/
│   │   ├── midia/
│   │   ├── modalidades/
│   │   ├── patrocinio/
│   │   ├── ranking/
│   │   ├── resultados/
│   │   └── usuarios/
│   └── globals.css
└── e2e/
    └── admin-screens.spec.ts
```

**Structure Decision**: Keep implementation in existing admin route files and shared global CSS. If repetition becomes harmful, introduce small shared admin view helpers only within the frontend app; do not alter backend modules for this feature.

## Complexity Tracking

No constitution violations or complexity exceptions.

## Phase 0: Research Summary

Research decisions are captured in [research.md](./research.md). Key decisions:

- Reuse feature 051 admin visual language as the source of truth.
- Prioritize primary list and form screens before lower-impact detail screens.
- Use real data and empty states only.

## Phase 1: Design Summary

Design artifacts:

- [data-model.md](./data-model.md): UI entities for admin shell, data views, forms and empty states.
- [contracts/admin-screens-ui.md](./contracts/admin-screens-ui.md): UI contract for altered routes.
- [quickstart.md](./quickstart.md): local validation and test flow.

## Post-Design Constitution Check

- **Spec Before Code**: PASS.
- **Contract-First Web Delivery**: PASS.
- **Production-Like Local Environment**: PASS.
- **Security and LGPD by Default**: PASS.
- **Incremental MVP Slices**: PASS.
