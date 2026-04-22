# Feature Specification: Performance Hardening

**Feature Branch**: `021-performance-hardening`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User request: "vamos melhorar a performance...nao deixe nada fraco em nada"

## User Stories

### User Story 1 - Reduce public page load cost (Priority: P1)

As a visitor, I want public pages to avoid unnecessary cache misses so the portal responds faster under repeated traffic.

**Independent Test**: Public fetch helpers use bounded revalidation instead of unconditional `no-store`.

### User Story 2 - Reduce backend overfetch and ranking cost (Priority: P1)

As an operator, I want backend list and ranking endpoints to do less work so the admin and public views remain responsive as data grows.

**Independent Test**: Ranking is computed from aggregated result data and list endpoints use narrower field selection.

## Requirements

- FR-001: Public frontend fetch helpers MUST use bounded cache revalidation instead of unconditional `no-store`.
- FR-002: Ranking computation MUST avoid loading full team result arrays when only totals are needed.
- FR-003: Athlete and result listing responses MUST avoid overfetching unrelated columns.
- FR-004: Automated tests MUST cover the optimized ranking path and preserve behavior.

## Success Criteria

- SC-001: Public pages can reuse data for a short interval instead of forcing origin fetches every request.
- SC-002: Ranking still returns correct ordering while doing less backend work.
- SC-003: Backend tests and both builds remain green after the optimizations.
