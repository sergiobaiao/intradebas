# Implementation Plan: Admin Authentication with JWT

**Branch**: `003-admin-auth` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-admin-auth/spec.md`

## Summary

Add a minimal but real admin authentication stack across backend and frontend. Seed a default
admin user, expose a JWT login endpoint in NestJS, protect at least the dashboard/admin API
surface, and introduce a frontend login page plus admin route gating.

## Technical Context

**Language/Version**: TypeScript, Node.js 20  
**Primary Dependencies**: NestJS 10, Prisma 5, JWT, bcrypt, Next.js 15  
**Storage**: PostgreSQL for users; browser storage for access token bootstrap  
**Testing**: Build validation and local login verification  
**Target Platform**: Docker-first web application  
**Project Type**: Full-stack web auth slice  
**Performance Goals**: Login response under typical API latency targets; negligible overhead on route gating  
**Constraints**: Preserve current repository structure; keep auth slice minimal and incremental  
**Scale/Scope**: Initial admin authentication only; refresh tokens and password reset remain for later work

## Constitution Check

- **Spec Before Code**: Passed.
- **Contract-First Web Delivery**: Passed. Auth contract is defined before frontend integration.
- **Production-Like Local Environment**: Passed. Uses Prisma/PostgreSQL and app routing already in repo.
- **Security and LGPD by Default**: Passed for scope. Password hashing and protected admin access are required.
- **Incremental MVP Slices**: Passed. Login, route protection, and seed bootstrap are independently testable.

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-auth/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
└── src/
    ├── auth/
    ├── prisma/
    └── users/

frontend/
└── app/
    ├── (auth) or login/
    ├── admin/
    └── lib/
```

**Structure Decision**: Introduce a focused `auth` module in the backend and a minimal frontend
login/session layer while preserving the existing app routes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Browser-side token bootstrap before full server session design | Keeps auth shippable in one slice | Waiting for a complete session architecture would delay protection of admin flows |

