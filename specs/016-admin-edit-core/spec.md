# Feature Specification: Admin Edit Core

**Feature Branch**: `016-admin-edit-core`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Prossiga"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin can edit team metadata (Priority: P1)

As an organizer, I need to edit team name and color in the admin area so the event identity stays correct.

**Why this priority**: Teams are visible across the portal and need operational updates.

**Independent Test**: Update a team and verify the new values are persisted and returned by the API.

**Acceptance Scenarios**:

1. **Given** an existing team, **When** an authenticated admin updates its name or color,
   **Then** the team is saved and returned with the new values.
2. **Given** an invalid team ID, **When** update is attempted,
   **Then** the API returns a clear not-found error.

---

### User Story 2 - Admin can edit sports and scoring config (Priority: P2)

As an organizer, I need to edit sport metadata and scoring rows so schedule and ranking rules can be corrected operationally.

**Why this priority**: The admin screens now exist, but they are still read-only for two core operational domains.

**Independent Test**: Update a sport and a scoring row and verify the API returns persisted values.

**Acceptance Scenarios**:

1. **Given** a sport exists, **When** an authenticated admin edits its activity or schedule data,
   **Then** the updated metadata is returned.
2. **Given** a scoring row exists, **When** an authenticated admin edits its points,
   **Then** the updated row is returned with updater context preserved.

---

### User Story 3 - Edit behavior stays covered by automated tests (Priority: P3)

As a developer, I need automated tests for the new update flows so admin editing does not regress.

**Why this priority**: These flows mutate core event configuration and require regression protection.

**Independent Test**: Run backend tests and verify team, sport, and scoring update scenarios pass.

**Acceptance Scenarios**:

1. **Given** mocked entities, **When** update tests run,
   **Then** they validate success paths and missing-record errors.

### Edge Cases

- What happens when an admin clears an optional team color?
- What happens when a sport schedule is removed?
- What happens when a scoring row ID is invalid?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose authenticated update endpoints for teams, sports, and scoring config rows.
- **FR-002**: The admin frontend MUST allow editing team metadata from the teams page.
- **FR-003**: The admin frontend MUST allow editing sport metadata from the sports page.
- **FR-004**: The admin frontend MUST allow editing scoring config rows from the settings page.
- **FR-005**: Automated backend tests MUST cover these update flows.

### Key Entities *(include if feature involves data)*

- **Editable Team**: Team identity data maintained by the commission.
- **Editable Sport**: Sport metadata and schedule information maintained by the commission.
- **Editable Scoring Config**: Ranking rule row for a category/position pair.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can edit teams, sports, and scoring rows from the web UI.
- **SC-002**: Update endpoints return not-found errors for invalid IDs.
- **SC-003**: Backend automated tests and backend/frontend builds continue to pass.
