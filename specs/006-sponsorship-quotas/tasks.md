# Tasks: Sponsorship Quotas and Interest Registration

**Input**: Design documents from `/specs/006-sponsorship-quotas/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for sponsorship quota listing and interest registration
- [x] T002 Review the Prisma quota and sponsor models already present in the schema

---

## Phase 2: Foundational

- [x] T003 Add backend modules/controllers/services for sponsorship quota listing and sponsor interest
- [x] T004 Extend frontend shared helpers for sponsorship quota and sponsor interest requests
- [x] T005 Add backend test scaffolding for sponsorship service coverage

---

## Phase 3: User Story 1 - Public visitors can see sponsorship quota availability (Priority: P1)

**Goal**: Expose meaningful public quota availability from real data.

**Independent Test**: Load the public sponsorship page and verify quota cards render from backend data.

- [x] T006 [US1] Implement `GET /api/v1/sponsorship/quotas`
- [x] T007 [US1] Create the public sponsorship page in `frontend/app/patrocinio/page.tsx`
- [x] T008 [US1] Render remaining-slot information clearly in the UI

---

## Phase 4: User Story 2 - A sponsor can register interest in a quota (Priority: P2)

**Goal**: Capture pending sponsor interest through the public app.

**Independent Test**: Submit sponsor interest from the UI and persist it through the backend.

- [x] T009 [US2] Implement `POST /api/v1/sponsors`
- [x] T010 [US2] Add sponsor interest form submission to the public sponsorship page
- [x] T011 [US2] Show validation/success states for sponsor submissions

---

## Phase 5: User Story 3 - Sponsorship backend rules are covered by automated tests (Priority: P3)

**Goal**: Ensure quota and sponsor rules are protected by tests.

**Independent Test**: Run backend tests and verify sponsorship coverage passes.

- [x] T012 [US3] Add automated tests for quota availability rules
- [x] T013 [US3] Add automated tests for sponsor interest creation rules
- [x] T014 [US3] Run backend tests and both app builds successfully
