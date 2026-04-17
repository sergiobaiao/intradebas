# Implementation Plan: Athlete Admin Review and Approval

**Branch**: `004-athlete-admin-review` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-athlete-admin-review/spec.md`

## Summary

Extend the new admin auth flow into a usable athlete review page. Add a protected athlete list API,
create shared frontend helpers for admin-authenticated requests, and implement approve/reject
actions for pending athletes in the admin UI.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: Next.js 15, NestJS 10, Prisma 5  
**Storage**: PostgreSQL for athlete state, browser cookie for admin token bootstrap  
**Testing**: Build validation and local manual auth flow verification  
**Target Platform**: Docker-first web app  
**Project Type**: Full-stack admin feature slice  
**Performance Goals**: Keep admin list rendering lightweight for the expected event scale  
**Constraints**: Reuse current JWT cookie flow; preserve existing athlete contract shape where possible  
**Scale/Scope**: Admin athlete review only; no advanced table filters or pagination yet

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed for scope; all new admin operations stay protected.
- **Incremental MVP Slices**: Passed. Review page and status update flow are independently useful.

## Project Structure

### Documentation (this feature)

```text
specs/004-athlete-admin-review/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
└── src/
    ├── athletes/
    └── auth/

frontend/
└── app/
    ├── admin/atletas/
    ├── admin/dashboard/
    └── lib/
```

**Structure Decision**: Build on top of the existing auth/authenticated admin shell without introducing a separate frontend state library yet.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Use client-side fetch + mutation in admin page instead of server actions | Fits current token-in-cookie bootstrap with minimal disruption | Full server action auth plumbing would expand scope beyond the review slice |

