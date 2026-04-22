# Implementation Plan: Database Index Hardening

**Branch**: `024-db-index-hardening` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)

## Summary

Add Prisma-level indexes and one uniqueness constraint to match the current hot query patterns in athletes, results, auditing, sponsorship, coupon redemption, media ordering, and scoring resolution.

## Technical Context

**Language/Version**: Prisma schema, TypeScript  
**Primary Dependencies**: Prisma, PostgreSQL, NestJS, Next.js  
**Testing**: Prisma schema validation, backend Jest tests, backend build, frontend build

## Implementation Strategy

1. Map current service-layer filters/sorts to concrete schema indexes.
2. Add indexes and the scoring uniqueness constraint in `backend/prisma/schema.prisma`.
3. Validate schema and rerun app tests/builds to ensure no regressions.
