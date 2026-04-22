# Implementation Plan: Performance Hardening

**Branch**: `021-performance-hardening` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)

## Summary

Harden obvious performance weak points by caching public fetches for a short interval, switching ranking to aggregated backend queries, and replacing broad Prisma includes with leaner selects in hot list endpoints.

## Technical Context

**Language/Version**: TypeScript, Next.js 15, NestJS 10, Prisma  
**Primary Dependencies**: Next.js App Router, NestJS, Prisma  
**Testing**: Jest backend tests, backend build, frontend build

## Implementation Strategy

1. Update public frontend fetch helpers to use `next.revalidate`.
2. Optimize backend ranking via `groupBy` + minimal team lookup.
3. Replace broad `include` usage in hot list endpoints with targeted `select` shapes.
4. Extend tests for the new ranking strategy and validate the full stack builds.
