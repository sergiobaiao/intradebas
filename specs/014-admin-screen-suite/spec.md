# Feature Specification: Admin Screen Suite

**Feature Branch**: `014-admin-screen-suite`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "Implemente todas as telas administrativas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin can navigate the core operational screens (Priority: P1)

As an organizer, I need the admin panel to expose the main operational areas so I can manage the event without relying on direct API calls.

**Why this priority**: The existing admin panel only covers part of the operational flow and leaves major areas inaccessible.

**Independent Test**: Open the dashboard and navigate to each main admin page successfully.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they open the dashboard,
   **Then** they can navigate to teams, sports, sponsorship, results, ranking, audit, backdrop, media, and settings.
2. **Given** an admin page has no records yet, **When** it loads,
   **Then** it shows a usable empty state instead of failing.

---

### User Story 2 - Admin screens show live data from the backend (Priority: P2)

As an organizer, I need each admin screen to show current backend data so the panel is operationally useful.

**Why this priority**: Navigation alone is not enough; the admin pages must expose the event state.

**Independent Test**: Load each admin page and verify it renders data from the relevant API.

**Acceptance Scenarios**:

1. **Given** teams, athletes, sports, results, sponsors, and audit data exist, **When** their admin pages load,
   **Then** the pages render summaries and detailed lists from backend contracts.
2. **Given** scoring configuration or media entries exist, **When** their admin pages load,
   **Then** those datasets are visible in the panel.

---

### User Story 3 - New admin contracts stay covered by automated tests (Priority: P3)

As a developer, I need automated tests for the new backend admin contracts so the expanded panel stays stable.

**Why this priority**: The admin suite expands the number of read projections and needs regression protection.

**Independent Test**: Run backend automated tests and verify the new admin-support endpoints are covered.

**Acceptance Scenarios**:

1. **Given** mocked data for settings and media, **When** backend tests run,
   **Then** they validate the admin-facing projections.

### Edge Cases

- What happens when media has no uploaded items yet?
- What happens when no scoring configuration rows exist?
- What happens when a team has no athletes or results?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The admin dashboard MUST link to all core admin screens for the MVP.
- **FR-002**: The frontend MUST provide admin pages for teams, sports, ranking, audit, backdrop, media, and settings.
- **FR-003**: The backend MUST expose any missing read contracts needed by those admin pages.
- **FR-004**: Admin pages MUST tolerate empty datasets gracefully.
- **FR-005**: Automated backend tests MUST cover any new admin-support services or contracts.

### Key Entities *(include if feature involves data)*

- **Admin Team View**: Projection of teams and their athlete composition.
- **Admin Sport View**: Projection of sports and associated result counts.
- **Admin Ranking View**: Projection of team ranking combined with recent audit history.
- **Admin Media View**: Projection of uploaded media entries.
- **Admin Settings View**: Projection of scoring configuration rows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The admin panel exposes the full primary MVP navigation set.
- **SC-002**: Each admin screen renders backend-backed data or an explicit empty state.
- **SC-003**: Backend automated tests and backend/frontend builds continue to pass.
