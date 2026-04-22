# Implementation Plan: Admin Edit Core

**Branch**: `016-admin-edit-core` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-admin-edit-core/spec.md`

## Summary

Turn the recently added read-only admin screens for teams, sports, and settings into operational edit surfaces. Add authenticated backend update endpoints for those domains and wire the existing admin pages to inline edit forms with optimistic reload behavior.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, React 18, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests, backend build, frontend build  
**Target Platform**: Web admin portal and NestJS API  
**Project Type**: Full-stack MVP feature slice  
**Performance Goals**: Inline edits remain responsive and low-volume  
**Constraints**: Reuse current admin screens instead of introducing separate edit pages  
**Scale/Scope**: Team, sport, and scoring config updates only

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed. Update endpoints remain JWT-protected.
- **Incremental MVP Slices**: Passed. This is the next operational step after exposing the admin screens.

## Project Structure

### Documentation (this feature)

```text
specs/016-admin-edit-core/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── teams/
│   ├── sports/
│   └── settings/
└── test/

frontend/
└── app/
    └── admin/
        ├── equipes/
        ├── modalidades/
        └── configuracoes/
```

**Structure Decision**: Reuse the existing admin read pages and enhance them with inline edit actions backed by focused PATCH endpoints.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Add three small update flows in one slice | Needed because these pages now form the operational core of the admin panel | Splitting them further would add coordination overhead without reducing technical risk much |
