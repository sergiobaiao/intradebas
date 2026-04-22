# Implementation Plan: Admin Pagination And Filters

**Branch**: `022-admin-pagination-filters` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)

## Summary

Introduce dedicated paginated admin listing endpoints for athletes and results, then wire the admin pages to use those endpoints with basic filtering controls.

## Technical Context

**Language/Version**: TypeScript, Next.js 15, NestJS 10, Prisma  
**Primary Dependencies**: Next.js App Router, NestJS, Prisma  
**Testing**: Jest backend tests, backend build, frontend build

## Implementation Strategy

1. Add paginated admin list methods in athletes and results services/controllers.
2. Extend Prisma mocks and add backend tests for pagination/filter metadata.
3. Add frontend admin fetch helpers, filters, and pager controls.
4. Validate the full stack.
