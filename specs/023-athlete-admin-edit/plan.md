# Implementation Plan: Athlete Admin Edit

**Branch**: `023-athlete-admin-edit` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)

## Summary

Add an authenticated athlete update endpoint that validates team and sports, rewrites registrations when needed, and expose a dedicated admin edit form on the athlete detail page.

## Technical Context

**Language/Version**: TypeScript, Next.js 15, NestJS 10, Prisma  
**Primary Dependencies**: Next.js App Router, NestJS, Prisma, class-validator  
**Testing**: Jest backend tests, backend build, frontend build

## Implementation Strategy

1. Add update-athlete DTO plus service/controller mutation.
2. Extend Prisma test scaffolding and athlete service tests.
3. Convert the athlete detail page into an editable admin form backed by the new endpoint.
4. Validate the full stack.
