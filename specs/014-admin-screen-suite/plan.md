# Implementation Plan: Admin Screen Suite

**Branch**: `014-admin-screen-suite` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-admin-screen-suite/spec.md`

## Summary

Expand the admin panel from a few operational pages into the full primary MVP screen set. Reuse existing contracts where possible, add small read-only backend modules for settings and media where needed, and expose the new pages through dashboard navigation and backend-backed summaries.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, React 18, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests, backend build, frontend build  
**Target Platform**: Web admin portal and NestJS API  
**Project Type**: Full-stack MVP feature suite  
**Performance Goals**: Admin read screens remain responsive with lightweight queries  
**Constraints**: Prefer incremental read-only projections over incomplete CRUD flows  
**Scale/Scope**: Primary admin screen coverage only, not every detail subpage or form variant

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed. New data endpoints are admin-only where appropriate.
- **Incremental MVP Slices**: Passed. This is a cohesive admin coverage slice built on the existing modules.

## Project Structure

### Documentation (this feature)

```text
specs/014-admin-screen-suite/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── media/
│   └── settings/
└── test/

frontend/
└── app/
    └── admin/
        ├── auditoria/
        ├── backdrop/
        ├── configuracoes/
        ├── equipes/
        ├── midia/
        ├── modalidades/
        └── ranking/
```

**Structure Decision**: Use dedicated lightweight backend modules for data that currently has no API contract, and keep the new admin pages read-oriented to avoid overstretching the slice.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Add read-only modules for media and settings | Needed because the schema already exists but no API supports the admin screens | Hardcoding empty placeholders would not satisfy backend-backed admin coverage |
