# Tasks: Admin Results Entry and Correction

**Input**: Design documents from `/specs/011-results-admin-entry/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for admin results entry and correction
- [x] T002 Review the existing results backend, tests, and admin dashboard

---

## Phase 2: Foundational

- [x] T003 Extend results contracts for authenticated correction
- [x] T004 Extend test scaffolding for result update coverage

---

## Phase 3: User Story 1 - Admin can launch results from the dashboard (Priority: P1)

**Goal**: Make result launch operational from the admin portal.

**Independent Test**: Submit a new result from the admin page and verify it appears in the list.

- [x] T005 [US1] Implement admin-facing results list and create actions in the frontend
- [x] T006 [US1] Expose the admin results page from the dashboard navigation

---

## Phase 4: User Story 2 - Admin can correct an existing result (Priority: P2)

**Goal**: Allow operational correction with recalculated points.

**Independent Test**: Update an existing result and verify the recalculated points.

- [x] T007 [US2] Implement authenticated result update endpoint in the backend
- [x] T008 [US2] Add admin UI flow for correcting an existing result

---

## Phase 5: User Story 3 - Result entry and correction rules stay covered by automated tests (Priority: P3)

**Goal**: Keep scoring logic stable with automated checks.

**Independent Test**: Run backend tests and builds successfully.

- [x] T009 [US3] Add automated backend tests for result correction and missing-result rejection
- [x] T010 [US3] Keep result creation coverage valid after the contract changes
- [x] T011 [US3] Run backend tests plus backend/frontend builds successfully
