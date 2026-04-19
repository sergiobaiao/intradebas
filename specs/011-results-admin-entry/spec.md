# Feature Specification: Admin Results Entry and Correction

**Feature Branch**: `011-results-admin-entry`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "Proceed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin can launch results from the dashboard (Priority: P1)

As an organizer, I need an admin interface to register competition results so the event scoreboard
can be maintained operationally without relying on direct API calls.

**Why this priority**: Result creation already exists in the backend, but it is not operationally usable.

**Independent Test**: Authenticate as admin, open the results admin page, submit a new result, and
verify it appears in the list.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they submit a valid result from the admin page,
   **Then** the result is persisted and rendered in the admin list.
2. **Given** invalid sport or team data, **When** the admin submits the form,
   **Then** a clear validation error is shown.

---

### User Story 2 - Admin can correct an existing result (Priority: P2)

As an organizer, I need to correct an existing result so operational mistakes do not permanently
distort the ranking.

**Why this priority**: The technical specification already calls for result correction support.

**Independent Test**: Update an existing result and verify recalculated points and displayed fields.

**Acceptance Scenarios**:

1. **Given** a recorded result exists, **When** an authenticated admin updates its position or score,
   **Then** the stored result is updated with recalculated points.
2. **Given** a missing result ID, **When** correction is attempted,
   **Then** the API returns a clear error.

---

### User Story 3 - Result entry and correction rules stay covered by automated tests (Priority: P3)

As a developer, I need automated tests for result creation and correction rules so scoring behavior
remains stable.

**Why this priority**: Result logic is ranking-critical and easy to regress accidentally.

**Independent Test**: Run backend automated tests and verify create/update result scenarios pass.

**Acceptance Scenarios**:

1. **Given** valid mocked inputs, **When** result tests run,
   **Then** they cover point calculation on both creation and correction.

### Edge Cases

- What happens if a result is corrected to a position with no scoring rule configured?
- What happens if two teams end with the same score after correction?
- What happens when the admin opens the page with no results yet registered?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST support updating an existing result through an authenticated endpoint.
- **FR-002**: Result correction MUST re-evaluate calculated points based on the scoring table.
- **FR-003**: The backend MUST reject corrections for invalid sports, teams, or missing result IDs.
- **FR-004**: The admin frontend MUST provide a results page with a launch form and current results list.
- **FR-005**: The admin frontend MUST allow inline correction of an existing result.
- **FR-006**: Automated backend tests MUST cover result creation and correction behaviors.

### Key Entities *(include if feature involves data)*

- **Result Entry**: Administrative creation of a competition outcome for a team and sport.
- **Result Correction**: Administrative update of a previously recorded result with recalculated points.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can create results from the web UI.
- **SC-002**: Admins can correct existing results from the web UI.
- **SC-003**: Corrected results reflect recalculated points immediately in the API response.
- **SC-004**: Backend automated tests and backend/frontend builds continue to pass.
