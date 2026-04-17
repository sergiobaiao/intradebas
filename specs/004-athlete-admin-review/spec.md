# Feature Specification: Athlete Admin Review and Approval

**Feature Branch**: `004-athlete-admin-review`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "Proceed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin reviews pending athlete registrations (Priority: P1)

As a commission member, I need to see pending athlete registrations in the admin area so I can
approve or reject guest registrations without using raw API tools.

**Why this priority**: Guest approval is already a business rule and now the backend endpoint is
protected; the admin UI should catch up immediately.

**Independent Test**: Log in as admin, open the athlete review page, and see pending and active
athletes rendered from the protected API.

**Acceptance Scenarios**:

1. **Given** pending guest athletes exist, **When** the admin athlete page loads,
   **Then** those athletes appear with visible status and team information.
2. **Given** a protected athlete list endpoint is called without a token, **When** the request is
   made, **Then** access is denied.

---

### User Story 2 - Admin approves or rejects a pending athlete (Priority: P2)

As a commission member, I need to update an athlete status from the admin interface so the public
and operational views reflect approval decisions quickly.

**Why this priority**: The protected status endpoint already exists, and this UI flow turns it into
usable event operations.

**Independent Test**: Approve or reject a pending athlete from the admin page and confirm the UI
updates from the backend response.

**Acceptance Scenarios**:

1. **Given** a pending athlete is listed, **When** the admin clicks approve,
   **Then** the athlete status changes to `active`.
2. **Given** a pending athlete is listed, **When** the admin clicks reject,
   **Then** the athlete status changes to `rejected`.

---

### User Story 3 - Admin session bootstrap is reusable across protected frontend requests (Priority: P3)

As a developer, I need a reusable frontend helper for authenticated admin API calls so future admin
features can build on the same token flow instead of duplicating cookie parsing logic.

**Why this priority**: This prevents the admin area from fragmenting as more protected pages are added.

**Independent Test**: Protected frontend data fetches and mutations use the same helper logic while
respecting the existing login token.

**Acceptance Scenarios**:

1. **Given** the admin token cookie is present, **When** the athlete review page fetches data or
   updates status, **Then** the request includes the bearer token through a shared helper path.

### Edge Cases

- What happens when the admin token is present but expired during a status update?
- What happens when the athlete status was already changed by another admin before the UI action?
- How should the page behave when there are zero pending athletes?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose at least one protected admin list endpoint for athlete review.
- **FR-002**: The frontend MUST provide an admin athlete review page under the admin area.
- **FR-003**: The page MUST show athlete name, status, team, and selected sports.
- **FR-004**: The page MUST allow approving and rejecting athletes through the protected status endpoint.
- **FR-005**: Protected frontend requests MUST reuse a shared admin-authenticated fetch helper.
- **FR-006**: The page MUST handle empty and error states clearly.

### Key Entities *(include if feature involves data)*

- **Athlete Review Item**: Admin-facing representation of an athlete with status, team, and sports.
- **Admin Authenticated Request**: Frontend request carrying the admin bearer token from the login flow.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can load the athlete review page only when authenticated.
- **SC-002**: Admins can change a pending athlete to `active` or `rejected` from the UI.
- **SC-003**: The page renders successfully for zero, one, or many athletes.
- **SC-004**: Backend and frontend builds continue to pass after this feature.

## Assumptions

- Athlete review may initially show all athletes, with emphasis on pending ones, instead of a full filter suite.
- The token cookie set by the login page remains the source of frontend admin authentication for this slice.

