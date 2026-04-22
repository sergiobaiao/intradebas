# Feature Specification: Database Index Hardening

**Feature Branch**: `024-db-index-hardening`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Keep hot queries fast as data grows (Priority: P1)

As an operator, I want the database schema to include indexes aligned with the app's hottest filters and sorts so query latency does not degrade as the event grows.

**Independent Test**: Prisma schema validates and the application builds/tests remain green after index additions.

## Requirements

- FR-001: The Prisma schema MUST add indexes for hot filters and orderings in athletes, results, audits, sponsorship, coupons, media, and scheduling.
- FR-002: The scoring config table MUST enforce uniqueness for category + position because ranking logic depends on that pair.
- FR-003: The hardening MUST preserve application behavior and pass validation/build checks.

## Success Criteria

- SC-001: Prisma schema reflects the main query patterns already implemented in the services.
- SC-002: Schema validation, backend tests, backend build, and frontend build all remain green.
