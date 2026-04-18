# Implementation Plan: Coupon Redemption During Registration

**Branch**: `009-coupon-redemption-registration` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-coupon-redemption-registration/spec.md`

## Summary

Close the sponsorship coupon loop by letting the public athlete registration flow redeem an active
coupon atomically during athlete creation. Reuse the existing athlete endpoint, keep the business
rules in the backend service layer, and expose the capability through the public registration form.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, React 19, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests, backend build, frontend build  
**Target Platform**: Web app with NestJS API and Next.js public portal  
**Project Type**: Full-stack MVP feature slice  
**Performance Goals**: Registration and coupon redemption remain lightweight for event-scale traffic  
**Constraints**: Preserve existing registration behavior when no coupon is provided; keep the flow atomic  
**Scale/Scope**: One public registration flow with optional coupon redemption

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed. Public registration API is extended deliberately.
- **Production-Like Local Environment**: Passed. No environment divergence is introduced.
- **Security and LGPD by Default**: Passed for scope; only public registration payload is extended.
- **Incremental MVP Slices**: Passed. This is the next direct slice after sponsor activation and coupon creation.

## Project Structure

### Documentation (this feature)

```text
specs/009-coupon-redemption-registration/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   └── athletes/
└── test/

frontend/
└── app/
    ├── inscricao/
    └── lib.ts
```

**Structure Decision**: Extend the existing athlete registration path instead of introducing a separate coupon redemption API, because redemption is only meaningful when tied to athlete creation.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Coupon redemption is embedded in athlete creation transaction | Needed to enforce single-use behavior atomically | A separate pre-validation call would still leave a race window before registration |
