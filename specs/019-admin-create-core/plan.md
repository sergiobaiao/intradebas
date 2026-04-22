# Implementation Plan: Admin Create Core Entities

**Branch**: `019-admin-create-core` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)

## Summary

Close the remaining creation gap in the admin panel by adding team and sport creation endpoints, corresponding client helpers, dedicated admin forms, and backend test coverage.

## Technical Context

**Language/Version**: TypeScript, Next.js 15, NestJS 10, Prisma  
**Primary Dependencies**: Next.js App Router, NestJS, Prisma, class-validator  
**Storage**: PostgreSQL via Prisma  
**Testing**: Jest backend service tests, backend build, frontend build  

## Implementation Strategy

1. Add create DTOs and service/controller methods for teams and sports.
2. Extend Prisma mocks and backend tests for the new create behavior.
3. Add admin helper functions and dedicated pages for new team/new sport.
4. Link the list and dashboard screens to the new create pages.
