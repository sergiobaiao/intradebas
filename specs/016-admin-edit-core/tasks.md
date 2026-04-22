# Tasks: Admin Edit Core

**Input**: Design documents from `/specs/016-admin-edit-core/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for admin edit core
- [x] T002 Review current team, sport, and scoring read flows

---

## Phase 2: Foundational

- [x] T003 Add DTO/contracts for authenticated team, sport, and scoring updates
- [x] T004 Extend backend test scaffolding for update coverage

---

## Phase 3: User Story 1 - Admin can edit team metadata (Priority: P1)

**Goal**: Make team identity editable from the admin panel.

**Independent Test**: Update a team and verify the new data is returned.

- [x] T005 [US1] Implement authenticated team update endpoint
- [x] T006 [US1] Add inline edit flow to the admin teams page

---

## Phase 4: User Story 2 - Admin can edit sports and scoring config (Priority: P2)

**Goal**: Make sport metadata and scoring rows operationally editable.

**Independent Test**: Update a sport and a scoring row successfully.

- [x] T007 [US2] Implement authenticated sport update endpoint
- [x] T008 [US2] Implement authenticated scoring config update endpoint
- [x] T009 [US2] Add inline edit flows to the admin sports and settings pages

---

## Phase 5: User Story 3 - Edit behavior stays covered by automated tests (Priority: P3)

**Goal**: Keep the new admin mutations stable.

**Independent Test**: Run backend tests and builds successfully.

- [x] T010 [US3] Add automated backend tests for team, sport, and scoring update flows
- [x] T011 [US3] Run backend tests plus backend/frontend builds successfully
