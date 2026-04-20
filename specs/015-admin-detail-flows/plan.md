# Implementation Plan: Admin Detail Flows

**Branch**: `015-admin-detail-flows` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-admin-detail-flows/spec.md`

## Summary

Complete the next layer of admin usability by adding athlete detail pages, manual athlete creation, and sport detail pages. Reuse the current athlete creation contract, add a focused sport detail projection in the backend, and connect the new pages to the existing admin navigation.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, React 18, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests, backend build, frontend build  
**Target Platform**: Web admin portal and NestJS API  
**Project Type**: Full-stack MVP feature slice  
**Performance Goals**: Detail pages stay lightweight and server/data-driven  
**Constraints**: Reuse the public athlete create contract where practical; keep this slice focused on detail flows, not full CRUD editing  
**Scale/Scope**: Athlete detail/new and sport detail/new-result entry

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed for scope.
- **Incremental MVP Slices**: Passed. This extends the admin suite with the next expected operational detail pages.

## Project Structure

### Documentation (this feature)

```text
specs/015-admin-detail-flows/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   └── sports/
└── test/

frontend/
└── app/
    └── admin/
        ├── atletas/
        │   ├── [id]/
        │   └── novo/
        ├── modalidades/
        │   └── [id]/
        └── resultados/
            └── novo/
```

**Structure Decision**: Extend the sports module with one focused detail endpoint and keep all new admin screens within the existing route structure anticipated by the technical specification.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Add a sport detail endpoint instead of forcing the frontend to join multiple lists client-side | Needed to keep the detail page coherent and backend-backed | Client-only aggregation would be brittle and duplicate domain logic |
