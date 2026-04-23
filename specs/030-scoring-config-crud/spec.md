# Feature Specification: Scoring Config CRUD

**Feature Branch**: `030-scoring-config-crud`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Create scoring rules from admin (Priority: P1)

An admin can add a new scoring rule with category, position, and points from the settings screen so ranking rules do not require direct database changes.

**Why this priority**: The admin can edit existing rows today, but cannot complete the rule table when a position/category pair is missing.

**Independent Test**: Create a new scoring row and verify it appears in the API response and the admin screen.

**Acceptance Scenarios**:

1. **Given** a missing category/position pair, **When** an authenticated admin creates a rule, **Then** the new row is persisted and returned with updater context.
2. **Given** a duplicate category/position pair, **When** creation is attempted, **Then** the API rejects it with a clear validation error.

### User Story 2 - Remove obsolete scoring rules from admin (Priority: P2)

An admin can remove obsolete scoring rules from the settings screen so the table matches the current competition structure.

**Why this priority**: Operational changes should not leave stale scoring rules in the system.

**Independent Test**: Delete an existing scoring row and verify it is removed from the admin listing.

**Acceptance Scenarios**:

1. **Given** an existing scoring row, **When** an authenticated admin deletes it, **Then** the row is removed successfully.
2. **Given** an invalid scoring row ID, **When** delete is attempted, **Then** the API returns a not-found error.

## Requirements

### Functional Requirements

- FR-001: The backend MUST expose authenticated create and delete endpoints for scoring config rows.
- FR-002: Scoring config creation MUST require `category`, `position`, and `points`.
- FR-003: Scoring config creation MUST reject duplicate `category + position` combinations.
- FR-004: The admin settings screen MUST support creating new scoring rows.
- FR-005: The admin settings screen MUST support deleting existing scoring rows.
- FR-006: Automated backend tests MUST cover create success, duplicate rejection, delete success, and delete not-found behavior.

## Success Criteria

- SC-001: Admins can create scoring rows from `/admin/configuracoes`.
- SC-002: Admins can delete scoring rows from `/admin/configuracoes`.
- SC-003: Backend automated tests and backend/frontend builds pass after the CRUD expansion.
