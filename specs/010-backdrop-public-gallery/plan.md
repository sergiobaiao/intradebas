# Implementation Plan: Public Sponsor Backdrop Gallery

**Branch**: `010-backdrop-public-gallery` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-backdrop-public-gallery/spec.md`

## Summary

Expose a public backdrop feed of active sponsors ordered by quota priority, then surface that feed in
the public Next.js portal through a dedicated backdrop page. Reuse the existing sponsorship domain and
protect the business rule with automated backend tests.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, Next.js 15, React 19, Jest  
**Storage**: PostgreSQL via Prisma, mocked Prisma in backend tests  
**Testing**: Backend automated tests, backend build, frontend build  
**Target Platform**: Web app public portal and NestJS API  
**Project Type**: Full-stack MVP feature slice  
**Performance Goals**: Backdrop feed remains lightweight and cacheable  
**Constraints**: Reuse sponsorship models and expose only public-safe sponsor data  
**Scale/Scope**: Public listing only, no admin ordering UI yet

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed. Public backdrop feed is a discrete contract.
- **Production-Like Local Environment**: Passed.
- **Security and LGPD by Default**: Passed. Only public sponsor data is exposed.
- **Incremental MVP Slices**: Passed. This is the next commercial/public slice after sponsor activation and coupon redemption.

## Project Structure

### Documentation (this feature)

```text
specs/010-backdrop-public-gallery/
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
    ├── backdrop/
    ├── lib.ts
    └── page.tsx
```

**Structure Decision**: Keep the feed inside the sponsorship domain because it is a read projection of sponsor/quota data, and render it through a lightweight public page.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dedicated public backdrop page in addition to the API | Needed to expose sponsor visibility in the portal immediately | API-only delivery would leave the feature incomplete from a user-facing perspective |
