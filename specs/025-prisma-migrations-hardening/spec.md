# Feature Specification: Prisma Migrations Hardening

**Feature Branch**: `025-prisma-migrations-hardening`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Deploy schema changes through versioned migrations (Priority: P1)

As an operator, I want the project to use versioned Prisma migrations instead of relying on `db push` so schema changes are deterministic across environments.

**Independent Test**: The repository contains a baseline migration and the backend scripts/docs reference `migrate deploy`.

## Requirements

- FR-001: The backend MUST include a Prisma migrations directory with a baseline migration for the current schema.
- FR-002: Backend scripts MUST expose a production-safe migration command based on `prisma migrate deploy`.
- FR-003: Documentation and deploy guidance MUST prefer migrations over `db push`.

## Success Criteria

- SC-001: The repo can bootstrap the schema from migrations rather than only from direct push.
- SC-002: Backend tests, backend build, and frontend build remain green after the migration hardening changes.
