# Implementation Plan: Sponsor and Coupon Admin Visibility

**Branch**: `013-sponsor-coupon-admin` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-sponsor-coupon-admin/spec.md`

## Summary

Add the missing operational visibility for commercial flows by exposing authenticated sponsor and coupon listings in the backend and surfacing them in a dedicated admin page. Reuse the existing sponsorship domain and keep the slice focused on read visibility rather than additional sponsor actions.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, React 19, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests, backend build, frontend build  
**Target Platform**: Web admin portal and NestJS API  
**Project Type**: Full-stack MVP feature slice  
**Performance Goals**: Admin listing queries remain lightweight for low commercial volume  
**Constraints**: Reuse the existing sponsorship module; no sponsor self-service auth in this slice  
**Scale/Scope**: Admin read visibility for sponsors and coupons only

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed. Endpoints remain admin-protected.
- **Incremental MVP Slices**: Passed. This extends sponsor activation/coupon generation with the required admin visibility.

## Project Structure

### Documentation (this feature)

```text
specs/013-sponsor-coupon-admin/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   └── sponsorship/
└── test/

frontend/
└── app/
    └── admin/
        └── patrocinio/
```

**Structure Decision**: Keep the feature inside the existing sponsorship module and expose the operational page under `/admin/patrocinio`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Add separate sponsor and coupon admin projections | Needed to keep UI data shape concise and purpose-built | Reusing raw Prisma models would leak irrelevant fields and make the UI brittle |
