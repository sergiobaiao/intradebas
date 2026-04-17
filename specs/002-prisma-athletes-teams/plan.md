# Implementation Plan: Prisma-Backed Athletes and Teams

**Branch**: `002-prisma-athletes-teams` | **Date**: 2026-04-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-prisma-athletes-teams/spec.md`

## Summary

Replace the backend's temporary in-memory athlete and team runtime with Prisma-backed services.
Introduce a shared NestJS Prisma module, keep the public API contract stable, persist athlete
registrations transactionally, and preserve compatibility with the existing frontend pages.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, PostgreSQL 16  
**Storage**: PostgreSQL through Prisma client  
**Testing**: Backend build validation plus manual seed/runtime verification path  
**Target Platform**: Linux containerized backend service  
**Project Type**: Web application backend module enhancement  
**Performance Goals**: Maintain low-latency list/detail endpoints while moving off in-memory state  
**Constraints**: Preserve current API shapes; keep LGPD consent and validation rules intact  
**Scale/Scope**: Core registration/team flows only; sponsorship, auth, and scoring remain out of scope

## Constitution Check

- **Spec Before Code**: Passed. This feature has explicit spec/plan/tasks artifacts.
- **Contract-First Web Delivery**: Passed. The API contract remains stable while persistence changes underneath it.
- **Production-Like Local Environment**: Passed. The feature moves the backend closer to the required PostgreSQL architecture.
- **Security and LGPD by Default**: Passed for current scope. LGPD consent is persisted; auth is intentionally deferred by spec.
- **Incremental MVP Slices**: Passed. Athlete persistence, team reads, and infra wiring remain separable but compatible.

## Project Structure

### Documentation (this feature)

```text
specs/002-prisma-athletes-teams/
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
    ├── prisma/
    ├── shared/
    └── teams/

frontend/
└── app/
    ├── admin/dashboard/
    ├── inscricao/
    ├── lib.ts
    └── resultados/
```

**Structure Decision**: Keep frontend paths stable and refactor backend internals to a shared Prisma-backed data access layer.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Preserve frontend fallbacks while backend moves to Prisma | Avoids coupling persistence migration to a frontend rewrite in the same slice | Requiring frontend refactor now would enlarge scope without improving persistence correctness |

