# Implementation Plan: Sponsorship Quotas and Interest Registration

**Branch**: `006-sponsorship-quotas` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-sponsorship-quotas/spec.md`

## Summary

Implement the first sponsorship slice across backend and frontend: public quota availability and
sponsor interest capture. Back it with Prisma data, keep the API simple, and add automated tests
for quota availability and sponsor creation constraints.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, Jest  
**Storage**: PostgreSQL via Prisma; mocked Prisma in tests  
**Testing**: Backend automated service tests plus backend/frontend builds  
**Target Platform**: Docker-first web app  
**Project Type**: Full-stack feature slice with backend tests  
**Performance Goals**: Lightweight public listing and form submission  
**Constraints**: Preserve current repo structure and public mobile-first UI direction  
**Scale/Scope**: Public sponsorship listing and interest capture only; coupon generation/activation later

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed for current scope; public form stores only sponsor contact data.
- **Incremental MVP Slices**: Passed. Listing and interest capture are independently useful.

## Project Structure

### Documentation (this feature)

```text
specs/006-sponsorship-quotas/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── sponsors/
│   └── sponsorship/
└── test/

frontend/
└── app/
    ├── patrocinio/
    └── lib.ts
```

**Structure Decision**: Add focused sponsorship modules in the backend and a single public page in the frontend, with tests centered on backend business rules.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Compute remaining slots from sponsor count at read time | More reliable than trusting cache-only `used_slots` during early implementation | Returning raw quota data would make availability misleading |

