# Implementation Plan: Results Entry and Public Team Ranking

**Branch**: `007-results-ranking` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-results-ranking/spec.md`

## Summary

Implement the first real competition scoring slice by adding protected result creation, public
result/ranking endpoints, aggregation by team, and backend tests for scoring rules. Update the
public results page to consume the ranking endpoint instead of static assumptions.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Automated backend service tests plus backend/frontend builds  
**Target Platform**: Docker-first web app  
**Project Type**: Full-stack scoring feature slice  
**Performance Goals**: Ranking endpoint should remain lightweight for event-scale usage  
**Constraints**: Protect write paths with existing JWT auth; keep UI focused on public consumption first  
**Scale/Scope**: API-first result entry; no admin result-entry UI form yet

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed for scope; write path remains admin-protected.
- **Incremental MVP Slices**: Passed. Public ranking and protected result creation are independently valuable.

## Project Structure

### Documentation (this feature)

```text
specs/007-results-ranking/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── results/
│   └── auth/
└── test/

frontend/
└── app/
    ├── resultados/
    └── lib.ts
```

**Structure Decision**: Introduce a dedicated `results` backend module and reuse the public results page as the first UI consumer.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Compute ranking directly from stored results on read | Keeps logic correct during early slices without background workers | Reusing team seed scores would make the ranking misleading |

