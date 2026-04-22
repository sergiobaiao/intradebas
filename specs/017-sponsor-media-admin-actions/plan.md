# Implementation Plan: Sponsor And Media Admin Actions

**Branch**: `017-sponsor-media-admin-actions` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)

## Summary

Add operational admin actions to two existing read-heavy areas: activate sponsors from the sponsorship console and edit media featured/order metadata from the media console.

## Technical Context

**Language/Version**: TypeScript, Node.js 20, Next.js 15, NestJS 10  
**Primary Dependencies**: Next.js App Router, NestJS, Prisma, PostgreSQL  
**Storage**: PostgreSQL via Prisma  
**Testing**: Jest backend service tests, backend build, frontend build  
**Project Type**: Full-stack web app  
**Performance Goals**: Immediate admin UI refresh after mutation  
**Constraints**: Keep admin flows JWT-protected and preserve current public behavior  

## Project Structure

### Documentation

```text
specs/017-sponsor-media-admin-actions/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code

```text
backend/src/sponsorship/
backend/src/media/
backend/test/
frontend/app/admin/patrocinio/
frontend/app/admin/midia/
frontend/app/lib.ts
```

## Implementation Strategy

1. Reuse the existing sponsor activation endpoint in the frontend admin page.
2. Add a dedicated media update DTO, service method, controller route, and automated backend tests.
3. Extend the admin library helpers and wire inline edit interactions into the sponsorship and media pages.
4. Validate with backend tests plus backend/frontend builds.
