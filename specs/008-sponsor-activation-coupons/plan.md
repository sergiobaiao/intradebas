# Implementation Plan: Sponsor Activation and Courtesy Coupons

**Branch**: `008-sponsor-activation-coupons` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-sponsor-activation-coupons/spec.md`

## Summary

Add the next commercial step after sponsor interest: authenticated sponsor activation that generates
courtesy coupons according to quota rules. Keep this slice backend-first and protect it with
automated tests covering status transitions and coupon generation.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests and backend build  
**Target Platform**: Backend service with existing JWT auth  
**Project Type**: Backend business-rule feature slice  
**Performance Goals**: Activation remains lightweight for low administrative volume  
**Constraints**: Reuse existing auth and sponsorship models; keep UI out of scope for now  
**Scale/Scope**: API-first sponsor activation and coupon generation only

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed for scope; activation remains admin-protected.
- **Incremental MVP Slices**: Passed. This is the next natural step after sponsor interest capture.

## Project Structure

### Documentation (this feature)

```text
specs/008-sponsor-activation-coupons/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth/
│   └── sponsorship/
└── test/
```

**Structure Decision**: Build directly on the current sponsorship backend slice and keep activation in the same domain module.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Generate coupon codes in application logic during activation | Needed to keep coupon rules deterministic and testable | Deferring generation to manual admin work would violate the core business rule |

