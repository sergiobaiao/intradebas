# Implementation Plan: MVP Core Portal

**Branch**: `001-mvp-core-portal` | **Date**: 2026-04-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mvp-core-portal/spec.md`

## Summary

Deliver the first independently useful slice of the INTRADEBAS portal by exposing
contract-backed public registration and team ranking flows plus an initial admin dashboard.
Use NestJS controllers/services for athlete and team contracts, keep Prisma aligned with the
 long-term data model, and render Next.js pages against those contracts with safe local
fallbacks while persistence is still being hardened.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: Next.js 15, NestJS 10, Prisma 5, class-validator  
**Storage**: PostgreSQL via Prisma schema; in-memory runtime store temporarily used for MVP flow  
**Testing**: Build validation now; automated API and UI tests to be added in subsequent tasks  
**Target Platform**: Linux containers via Docker Compose  
**Project Type**: Web application with separate frontend and backend apps  
**Performance Goals**: Public pages remain responsive on mobile; buildable baseline for <300ms p95 API later  
**Constraints**: Docker-first architecture, LGPD-aware data handling, mobile-first UI  
**Scale/Scope**: 300 to 500 event participants, three teams, multi-module event portal

## Constitution Check

- **Spec Before Code**: Passed. This feature has concrete `spec.md`, `plan.md`, and `tasks.md`.
- **Contract-First Web Delivery**: Passed. Frontend reads backend athlete/team contracts.
- **Production-Like Local Environment**: Passed with temporary runtime compromise.
  Docker files and compose exist, but runtime persistence is not yet wired to PostgreSQL.
- **Security and LGPD by Default**: Partially passed. LGPD consent and CPF uniqueness are enforced,
  but authentication and audit coverage are not part of this slice.
- **Incremental MVP Slices**: Passed. Stories are prioritized and independently demonstrable.

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-core-portal/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── src/
    ├── athletes/
    ├── health/
    ├── shared/
    └── teams/

frontend/
├── app/
│   ├── admin/dashboard/
│   ├── api/health/
│   ├── inscricao/
│   ├── resultados/
│   ├── globals.css
│   ├── layout.tsx
│   ├── lib.ts
│   └── page.tsx
└── next.config.ts
```

**Structure Decision**: Use the current web-app split with `frontend/` and `backend/`, keeping
domain contracts in the backend and server-rendered route composition in the frontend.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Temporary in-memory athlete/team store | Unblocks public/admin flow implementation before Prisma wiring is finished | Waiting for full persistence would delay usable MVP slices and Spec Kit adoption |

