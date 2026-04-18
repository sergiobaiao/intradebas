# Feature Specification: Results Entry and Public Team Ranking

**Feature Branch**: `007-results-ranking`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "Proceed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public visitors can see a real ranking derived from recorded results (Priority: P1)

As a visitor, I need the public results page to show the real ranking of teams based on recorded
results so the event portal reflects competition progress instead of seed-only numbers.

**Why this priority**: Public ranking is one of the main product promises of the portal.

**Independent Test**: Record results in the backend and verify the public ranking endpoint and page
reflect the correct team order and point totals.

**Acceptance Scenarios**:

1. **Given** recorded results exist, **When** `GET /api/v1/results/ranking` is called,
   **Then** teams are returned in descending point order.
2. **Given** the public results page loads, **When** ranking data exists,
   **Then** the page renders live totals from the backend instead of only static fallback values.

---

### User Story 2 - Admin can record a result through a protected API contract (Priority: P2)

As an organizer, I need a protected result entry endpoint so competition outcomes can be captured in
the system and feed the ranking.

**Why this priority**: Ranking cannot evolve without a path to write results.

**Independent Test**: Authenticate as admin, submit a valid result payload, and verify the result is
stored with calculated points.

**Acceptance Scenarios**:

1. **Given** a valid sport and team exist, **When** an admin posts a result,
   **Then** the backend creates the result and stores calculated points.
2. **Given** the request is unauthenticated, **When** result creation is attempted,
   **Then** access is denied.

---

### User Story 3 - Ranking rules are covered by automated backend tests (Priority: P3)

As a developer, I need automated tests around ranking aggregation and result entry rules so the
competition logic does not regress silently.

**Why this priority**: Scoring and ranking logic is business-critical and easy to break.

**Independent Test**: Run backend tests and verify they cover result creation and ranking aggregation.

**Acceptance Scenarios**:

1. **Given** mocked team/result data, **When** results service tests run,
   **Then** they verify score calculation and ranking ordering.

### Edge Cases

- What happens when a result references a non-existent team or sport?
- How should ties in total points be ordered in this initial slice?
- What happens when a category has no scoring config for a given position?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose `GET /api/v1/results/ranking`.
- **FR-002**: The backend MUST expose `GET /api/v1/results`.
- **FR-003**: The backend MUST expose protected `POST /api/v1/results`.
- **FR-004**: Result creation MUST validate referenced sport and team or athlete data as required.
- **FR-005**: Result creation MUST compute `calculated_points` from `scoring_config` when available.
- **FR-006**: Ranking MUST aggregate points by team from recorded results.
- **FR-007**: The public results page MUST consume the ranking endpoint.
- **FR-008**: Backend ranking and result rules MUST be covered by automated tests.

### Key Entities *(include if feature involves data)*

- **Result**: Recorded competition outcome tied to a sport and optionally athlete/team.
- **Ranking Row**: Aggregated team points derived from stored results.
- **Scoring Config**: Per-category position-to-points mapping used during result creation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Valid result creation persists successfully for authenticated admins.
- **SC-002**: Public ranking reflects aggregated team points from stored results.
- **SC-003**: Backend tests cover result creation and ranking logic.
- **SC-004**: Backend and frontend builds continue to pass.

## Assumptions

- Initial result entry can focus on team-based results and not yet require a full admin UI form.
- Ties may be ordered by team name after total points in this first slice.

