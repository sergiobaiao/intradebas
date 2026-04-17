# Tasks: Admin Authentication with JWT

**Input**: Design documents from `/specs/003-admin-auth/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for admin authentication
- [x] T002 Review current admin routes and identify the first protected path

---

## Phase 2: Foundational

- [x] T003 Add backend auth dependencies and configuration for JWT and password hashing
- [x] T004 Create backend auth module, JWT strategy/guard, and DTOs under `backend/src/auth/`
- [x] T005 Extend the Prisma seed flow to create a default admin user with hashed password

---

## Phase 3: User Story 1 - Admin login to access protected management APIs (Priority: P1)

**Goal**: Authenticate admins against PostgreSQL and guard protected routes.

**Independent Test**: Seed admin user, login successfully, and use returned token against a protected route.

- [x] T006 [US1] Implement `/api/v1/auth/login` in `backend/src/auth/`
- [x] T007 [US1] Validate active admin credentials against the `User` table
- [x] T008 [US1] Protect at least one admin route using the JWT guard

---

## Phase 4: User Story 2 - Frontend admin login flow and route protection bootstrap (Priority: P2)

**Goal**: Expose a usable login screen and protect the dashboard UI.

**Independent Test**: Authenticate through the frontend and confirm the dashboard is gated.

- [x] T009 [US2] Create a frontend login page and credential submission flow
- [x] T010 [US2] Store the access token client-side and gate admin navigation
- [x] T011 [US2] Redirect unauthenticated access to the login page

---

## Phase 5: User Story 3 - Seeded admin bootstrap for local development (Priority: P3)

**Goal**: Make local auth verification repeatable after seed.

**Independent Test**: Run seed and authenticate with the documented default admin account.

- [x] T012 [US3] Document default local admin credentials in `README.md`
- [x] T013 [US3] Validate backend and frontend builds after auth integration
