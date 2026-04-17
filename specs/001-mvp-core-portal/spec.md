# Feature Specification: MVP Core Portal

**Feature Branch**: `001-mvp-core-portal`  
**Created**: 2026-04-16  
**Status**: Draft  
**Input**: User description: "Implement the INTRADEBAS portal from the approved technical specification using Spec Kit workflow"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public athlete registration and live team visibility (Priority: P1)

Residents, family members, and invited participants need a public portal where they can
understand the event, choose a team, and register with the minimum required athlete data.
The same portal must expose the current team standings so the event already has visible value
before the full admin experience is complete.

**Why this priority**: Registration and public scoreboard are the core event-facing functions.
Without them, the portal does not yet serve athletes or the organizing committee.

**Independent Test**: A user can access the public home, open the registration screen, inspect
available teams, and submit a valid athlete payload through the backend contract while another
user can open the results screen and see ranked teams.

**Acceptance Scenarios**:

1. **Given** a visitor opens the public portal, **When** they navigate to registration,
   **Then** they can view the required athlete fields, available teams, and selectable sports.
2. **Given** a valid athlete payload with LGPD consent, **When** it is sent to
   `POST /api/v1/athletes`, **Then** the system returns a created athlete with the correct team
   and status rules.
3. **Given** team scores exist, **When** a visitor opens the results page,
   **Then** teams are shown in score order with visible totals.

---

### User Story 2 - Admin operational visibility for athlete intake (Priority: P2)

Commission members need an initial admin dashboard that shows how many athletes are registered,
how many records still require approval, and how many teams are actively represented.

**Why this priority**: Once public intake starts, the committee immediately needs operational
visibility even before the full CRUD/admin suite is finished.

**Independent Test**: An organizer can open the admin dashboard and see counts derived from the
athlete and team contracts without using mock-only frontend data.

**Acceptance Scenarios**:

1. **Given** athletes exist in the backend, **When** the admin dashboard loads,
   **Then** total athletes, pending registrations, and active teams are displayed.
2. **Given** a guest athlete remains pending, **When** the dashboard loads,
   **Then** the pending count includes that athlete.

---

### User Story 3 - Structured MVP foundation for persistence and next modules (Priority: P3)

Developers need the repository to be organized around the approved domain model and Spec Kit
artifacts so future work on authentication, sponsorship, scoring, and LGPD can proceed without
re-planning from scratch.

**Why this priority**: The project must scale beyond a demo scaffold and preserve traceability
between the original event specification and implementation work.

**Independent Test**: The repository contains a project constitution, feature spec, plan,
tasks, schema seed outline, and buildable frontend/backend apps aligned with the same domain.

**Acceptance Scenarios**:

1. **Given** a developer clones the repository, **When** they inspect `specs/001-mvp-core-portal`,
   **Then** they can identify scope, tasks, contracts, and quickstart steps for the MVP.
2. **Given** the backend and frontend dependencies are installed, **When** builds run,
   **Then** both applications compile successfully.

### Edge Cases

- What happens when a duplicate CPF is submitted during athlete registration?
- How does the system handle a family member or guest submission without a titular reference?
- What happens when frontend pages cannot reach the backend during static rendering?
- How does the system represent pending guest registrations in public and admin contexts?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST expose a public landing page that links to registration,
  results, and the admin bootstrap dashboard.
- **FR-002**: The system MUST expose `GET /api/v1/teams` and return team identifiers, names,
  colors, and consolidated scores.
- **FR-003**: The system MUST expose `GET /api/v1/teams/:id` and
  `GET /api/v1/teams/:id/athletes` for team-specific inspection.
- **FR-004**: The system MUST expose `GET /api/v1/athletes`,
  `GET /api/v1/athletes/:id`, `POST /api/v1/athletes`, and
  `PATCH /api/v1/athletes/:id/status`.
- **FR-005**: Athlete creation MUST reject duplicate CPF values.
- **FR-006**: Athlete creation MUST require LGPD consent.
- **FR-007**: Athlete creation MUST require a titular reference for `familiar` and `convidado`
  submissions.
- **FR-008**: Guest registrations MUST default to `pending`; titular and family records MUST
  default to `active` unless a future rule supersedes this.
- **FR-009**: The public registration page MUST render the minimum mandatory fields defined by
  the technical specification.
- **FR-010**: The public results page MUST render a ranking ordered by descending team score.
- **FR-011**: The admin dashboard MUST render athlete, pending, and team counts derived from the
  same backend contracts used by the public app.
- **FR-012**: The repository MUST include a seed path for teams, sports, and sponsorship quotas
  aligned with the Prisma domain model.
- **FR-013**: The repository MUST include Spec Kit artifacts for this MVP feature.

### Key Entities *(include if feature involves data)*

- **Team**: Represents one of the three event teams with name, color, and total score.
- **Athlete**: Represents a titular, family member, or guest with CPF uniqueness, team
  membership, shirt size, status, and selected sports.
- **Sport**: Represents a competition modality used in athlete selection and later scoring.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Frontend and backend production builds complete successfully in the local
  development environment.
- **SC-002**: A valid athlete registration request can be completed against the backend contract
  in under 3 minutes of manual interaction from the public registration page.
- **SC-003**: Duplicate CPF submissions are rejected with a conflict response and a clear message.
- **SC-004**: The admin dashboard displays consistent counts for athlete total, pending athletes,
  and active teams based on the same backend source.

## Assumptions

- Persistence may temporarily be in-memory for early MVP flow validation, provided that the
  Prisma schema and seeds remain the source of truth for the production data model.
- Authentication is not required for the initial dashboard rendering in this feature slice.
- The event’s three teams remain fixed as Mucura, Jacare, and Capivara.
- Public pages may use server-side fallback data when the backend is unavailable during local
  rendering, but the primary path remains the backend API contract.

