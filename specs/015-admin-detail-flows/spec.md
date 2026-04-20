# Feature Specification: Admin Detail Flows

**Feature Branch**: `015-admin-detail-flows`  
**Created**: 2026-04-20  
**Status**: Draft  
**Input**: User description: "Prossiga"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin can inspect athlete details (Priority: P1)

As an organizer, I need an athlete profile page in the admin area so I can inspect one athlete without scanning the full review list.

**Why this priority**: Athlete list review already exists, but detail inspection is still missing.

**Independent Test**: Open an athlete profile page and verify personal, team, and sport information render.

**Acceptance Scenarios**:

1. **Given** an athlete exists, **When** an admin opens the athlete detail page,
   **Then** the page shows the athlete identity, status, team, and registrations.
2. **Given** the athlete does not exist, **When** the page loads,
   **Then** it shows a usable error state.

---

### User Story 2 - Admin can create athletes manually and inspect sport details (Priority: P2)

As an organizer, I need manual athlete creation and sport detail views so I can operate registrations and modalities directly from the panel.

**Why this priority**: The specification expects both admin athlete onboarding and modality detail pages.

**Independent Test**: Submit a manual athlete registration from the admin area and open a sport detail page with aggregated results.

**Acceptance Scenarios**:

1. **Given** valid athlete input, **When** an admin submits the manual athlete form,
   **Then** the athlete is created and confirmation is shown.
2. **Given** a sport exists, **When** an admin opens its detail page,
   **Then** the page shows sport metadata and results tied to that sport.

---

### User Story 3 - New admin detail contracts stay covered by automated tests (Priority: P3)

As a developer, I need automated tests for any new backend detail contracts so the new admin detail flows stay reliable.

**Why this priority**: The slice extends backend projections and should preserve regression protection.

**Independent Test**: Run backend tests and confirm new sport detail scenarios pass.

**Acceptance Scenarios**:

1. **Given** mocked sports and results data, **When** backend tests run,
   **Then** they validate the sport detail projection.

### Edge Cases

- What happens when a sport has no results yet?
- What happens when manual athlete creation omits required LGPD consent or sports?
- What happens when the athlete detail page receives an invalid ID?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The admin frontend MUST provide an athlete detail page.
- **FR-002**: The admin frontend MUST provide a manual athlete creation page.
- **FR-003**: The backend MUST expose a sport detail endpoint including recent results.
- **FR-004**: The admin frontend MUST provide a sport detail page backed by that endpoint.
- **FR-005**: The admin frontend MUST provide a dedicated new-result page or entry shortcut aligned with the admin result flow.
- **FR-006**: Automated backend tests MUST cover the new sport detail projection.

### Key Entities *(include if feature involves data)*

- **Admin Athlete Profile**: Single-athlete admin view with registrations and team context.
- **Admin Sport Detail**: Single-sport admin view with metadata and associated results.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can open athlete detail pages from the panel.
- **SC-002**: Admins can create athletes manually from the panel.
- **SC-003**: Admins can open sport detail pages with current results.
- **SC-004**: Backend automated tests and backend/frontend builds continue to pass.
