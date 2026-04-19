# Tasks: Sponsor and Coupon Admin Visibility

**Input**: Design documents from `/specs/013-sponsor-coupon-admin/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for sponsor and coupon admin visibility
- [x] T002 Review the existing sponsorship domain and coupon flow

---

## Phase 2: Foundational

- [x] T003 Extend sponsorship contracts for admin sponsor and coupon projections
- [x] T004 Extend backend test scaffolding for sponsor/coupon admin views

---

## Phase 3: User Story 1 - Admin can list sponsors operationally (Priority: P1)

**Goal**: Make sponsor state visible in the admin portal.

**Independent Test**: Load the sponsor admin page and verify sponsor metadata is shown.

- [x] T005 [US1] Implement authenticated sponsor listing endpoint
- [x] T006 [US1] Add the admin patrocinio page and dashboard navigation

---

## Phase 4: User Story 2 - Admin can inspect generated coupons and redemption status (Priority: P2)

**Goal**: Provide coupon visibility by sponsor and status.

**Independent Test**: Load coupon data and verify codes, status, and redemption info are exposed.

- [x] T007 [US2] Implement authenticated coupon listing endpoints
- [x] T008 [US2] Render sponsor coupon details in the admin patrocinio page

---

## Phase 5: User Story 3 - Sponsor/coupon listing behavior stays covered by automated tests (Priority: P3)

**Goal**: Keep admin projections stable with automated checks.

**Independent Test**: Run backend tests and builds successfully.

- [x] T009 [US3] Add automated backend tests for sponsor and coupon listing projections
- [x] T010 [US3] Keep existing sponsor activation/coupon coverage valid after projection changes
- [x] T011 [US3] Run backend tests plus backend/frontend builds successfully
