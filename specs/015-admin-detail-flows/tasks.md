# Tasks: Admin Detail Flows

**Input**: Design documents from `/specs/015-admin-detail-flows/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for admin detail flows
- [x] T002 Review current admin coverage and identify missing detail pages/contracts

---

## Phase 2: Foundational

- [x] T003 Extend sports contracts for a detail projection with results
- [x] T004 Extend backend test scaffolding for sport detail coverage

---

## Phase 3: User Story 1 - Admin can inspect athlete details (Priority: P1)

**Goal**: Expose single-athlete inspection in the admin area.

**Independent Test**: Open an athlete detail page and verify profile data renders.

- [x] T005 [US1] Add athlete detail page in the admin area
- [x] T006 [US1] Link athlete cards/list entries to their detail page

---

## Phase 4: User Story 2 - Admin can create athletes manually and inspect sport details (Priority: P2)

**Goal**: Add admin detail and creation flows for athletes and sports.

**Independent Test**: Submit a manual athlete form and open a sport detail page successfully.

- [x] T007 [US2] Add manual athlete creation page in the admin area
- [x] T008 [US2] Implement sport detail endpoint and frontend page
- [x] T009 [US2] Add a dedicated new-result page that reuses the admin result flow

---

## Phase 5: User Story 3 - New admin detail contracts stay covered by automated tests (Priority: P3)

**Goal**: Keep the new detail contracts stable.

**Independent Test**: Run backend tests and builds successfully.

- [x] T010 [US3] Add automated backend tests for sport detail projection
- [x] T011 [US3] Run backend tests plus backend/frontend builds successfully
