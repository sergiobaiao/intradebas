# Feature Specification: Admin Authentication with JWT

**Feature Branch**: `003-admin-auth`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "Proceed with implementation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin login to access protected management APIs (Priority: P1)

As a commission member, I need to authenticate with email and password so that athlete,
result, sponsorship, and configuration APIs are not publicly writable.

**Why this priority**: Without authentication, the admin surface cannot safely evolve beyond a demo.

**Independent Test**: Seed an admin user, submit valid credentials to the login endpoint, obtain
an access token, and use that token to call a protected admin-only route.

**Acceptance Scenarios**:

1. **Given** an active admin user exists, **When** valid credentials are posted to the login
   endpoint, **Then** the API returns an access token and user role data.
2. **Given** invalid credentials are submitted, **When** login is attempted, **Then** the API
   rejects the request with an unauthorized response.
3. **Given** a protected admin endpoint is called without a bearer token, **When** the request
   reaches the backend, **Then** access is denied.

---

### User Story 2 - Frontend admin login flow and route protection bootstrap (Priority: P2)

As an organizer, I need a visible login screen and a protected admin shell so the dashboard is no
longer publicly accessible by direct navigation.

**Why this priority**: Backend auth without a usable frontend flow still leaves the admin
experience disconnected.

**Independent Test**: Open the login page, authenticate successfully, and confirm the dashboard
becomes reachable only after the session token is present.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor opens an admin route, **When** no valid session token is
   present, **Then** the user is redirected to the login page.
2. **Given** valid login credentials are submitted from the frontend, **When** the login succeeds,
   **Then** the token is stored and the user is redirected to the admin dashboard.

---

### User Story 3 - Seeded admin bootstrap for local development (Priority: P3)

As a developer, I need the local seed flow to create at least one admin account so the auth stack
can be exercised immediately after `prisma:seed`.

**Why this priority**: Local validation of auth should not require manual database setup every time.

**Independent Test**: Run the seed command, then authenticate using the documented default admin
credentials.

**Acceptance Scenarios**:

1. **Given** the database has been reset, **When** `npm run prisma:seed` completes,
   **Then** a default active admin user exists with a documented email and password.

### Edge Cases

- What happens when a deactivated admin attempts login?
- What happens when a user account exists but has an unsupported role?
- How is expired or malformed JWT handled on protected routes?
- How should frontend route protection behave when local storage is empty but a stale cookie or token exists?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose an admin login endpoint under `/api/v1/auth/login`.
- **FR-002**: Login MUST validate email, password, and active user status.
- **FR-003**: Successful login MUST return a signed JWT access token and basic admin identity metadata.
- **FR-004**: The backend MUST provide a reusable JWT auth guard for protected routes.
- **FR-005**: At least one existing admin-only route MUST be protected by the JWT guard in this slice.
- **FR-006**: The seed flow MUST create a default local admin user with a bcrypt-hashed password.
- **FR-007**: The frontend MUST provide a login page and submit credentials to the backend auth endpoint.
- **FR-008**: The frontend MUST gate admin routes behind authentication and redirect unauthenticated users to login.
- **FR-009**: The system MUST avoid exposing password hashes in API responses.

### Key Entities *(include if feature involves data)*

- **Admin User**: Existing `User` table record with email, password hash, role, and active status.
- **Access Token**: Signed JWT that carries the admin user identifier, email, and role.
- **Auth Session State**: Frontend token state used to decide whether admin routes are accessible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A seeded admin can successfully authenticate and receive a JWT from `/api/v1/auth/login`.
- **SC-002**: Protected admin endpoints reject unauthenticated requests with 401.
- **SC-003**: Admin dashboard access from the frontend requires a valid login flow.
- **SC-004**: Backend and frontend builds continue to pass after auth is added.

## Assumptions

- Refresh tokens can remain out of scope for this slice; access-token login bootstrap is enough.
- Route protection can start with dashboard and other admin routes can be migrated incrementally.
- Local frontend auth state may use a simple browser storage strategy for this phase.

