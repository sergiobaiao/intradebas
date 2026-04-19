# Implementation Plan: Admin Results Entry and Correction

**Branch**: `011-results-admin-entry` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-results-admin-entry/spec.md`

## Summary

Turn the existing results backend into an operational admin workflow by adding an authenticated
results management page that can create and correct results. Extend the backend with a correction
endpoint that recalculates points from the scoring table, and protect the behavior with automated
tests.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, React 19, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests, backend build, frontend build  
**Target Platform**: Web admin portal and NestJS API  
**Project Type**: Full-stack MVP feature slice  
**Performance Goals**: Low-latency admin entry for small operational volume  
**Constraints**: Reuse current JWT auth and existing results domain structures  
**Scale/Scope**: Admin result list, create, and update only; no audit UI yet

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed. Result mutations stay admin-protected.
- **Incremental MVP Slices**: Passed. This is the next operational step after exposing ranking publicly.

## Project Structure

### Documentation (this feature)

```text
specs/011-results-admin-entry/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   └── results/
└── test/

frontend/
└── app/
    └── admin/
        └── resultados/
```

**Structure Decision**: Keep all mutation logic in the existing results module and implement the admin screen as a dedicated page under `/admin/resultados`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Add explicit update DTO and endpoint for result correction | Needed to correct operational mistakes without deleting/recreating data | Reusing create-only flow would force duplicate rows and broken rankings |
