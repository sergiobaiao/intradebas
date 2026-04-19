# Tasks: Admin Screen Suite

**Input**: Design documents from `/specs/014-admin-screen-suite/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for the admin screen suite
- [x] T002 Review current admin coverage, schema, and missing backend contracts

---

## Phase 2: Foundational

- [x] T003 Add missing backend read contracts for settings and media
- [x] T004 Extend backend test scaffolding for the new admin-support modules

---

## Phase 3: User Story 1 - Admin can navigate the core operational screens (Priority: P1)

**Goal**: Expose the full primary admin navigation set.

**Independent Test**: Open the dashboard and navigate to every main admin page.

- [x] T005 [US1] Add dashboard navigation for all primary admin pages
- [x] T006 [US1] Create admin pages for teams, sports, ranking, audit, backdrop, media, and settings

---

## Phase 4: User Story 2 - Admin screens show live data from the backend (Priority: P2)

**Goal**: Make each admin page operationally useful with backend-backed data.

**Independent Test**: Load each admin page and verify it renders data or an empty state.

- [x] T007 [US2] Wire admin pages to existing contracts for teams, sports, results, ranking, sponsors, and audits
- [x] T008 [US2] Wire admin pages to the new settings and media contracts

---

## Phase 5: User Story 3 - New admin contracts stay covered by automated tests (Priority: P3)

**Goal**: Keep the expanded admin suite stable.

**Independent Test**: Run backend tests and builds successfully.

- [x] T009 [US3] Add automated backend tests for settings and media services
- [x] T010 [US3] Keep existing tests valid after the admin suite changes
- [x] T011 [US3] Run backend tests plus backend/frontend builds successfully
