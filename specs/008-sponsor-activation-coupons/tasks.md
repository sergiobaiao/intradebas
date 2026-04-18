# Tasks: Sponsor Activation and Courtesy Coupons

**Input**: Design documents from `/specs/008-sponsor-activation-coupons/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for sponsor activation and coupon generation
- [x] T002 Review current sponsorship, sponsor, and coupon schema/service behavior

---

## Phase 2: Foundational

- [x] T003 Extend the sponsorship backend module for activation and coupon logic
- [x] T004 Add backend test scaffolding for sponsor activation coverage

---

## Phase 3: User Story 1 - Admin can activate a sponsor after payment confirmation (Priority: P1)

**Goal**: Turn sponsor interest into an active sponsorship via protected API.

**Independent Test**: Authenticate and activate a pending sponsor successfully.

- [x] T005 [US1] Implement authenticated sponsor activation endpoint
- [x] T006 [US1] Validate sponsor existence and status transition rules

---

## Phase 4: User Story 2 - Courtesy coupons are generated automatically on activation (Priority: P2)

**Goal**: Provision courtesy benefits automatically during activation.

**Independent Test**: Activate a sponsor and verify coupon generation count and uniqueness.

- [x] T007 [US2] Implement coupon generation based on quota courtesy count
- [x] T008 [US2] Prevent duplicate coupon creation on repeated activation

---

## Phase 5: User Story 3 - Coupon generation and activation rules are covered by automated tests (Priority: P3)

**Goal**: Lock in the core commercial rules with tests.

**Independent Test**: Run backend tests and verify activation/coupon coverage passes.

- [x] T009 [US3] Add automated tests for sponsor activation rules
- [x] T010 [US3] Add automated tests for coupon generation and duplicate-protection rules
- [x] T011 [US3] Run backend tests and backend build successfully
