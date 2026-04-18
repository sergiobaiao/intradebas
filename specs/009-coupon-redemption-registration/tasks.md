# Tasks: Coupon Redemption During Registration

**Input**: Design documents from `/specs/009-coupon-redemption-registration/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for coupon redemption during registration
- [x] T002 Review current athlete registration flow, coupon schema, and public registration UI

---

## Phase 2: Foundational

- [x] T003 Extend the athlete registration contract to accept an optional coupon code
- [x] T004 Extend backend test scaffolding for coupon redemption coverage

---

## Phase 3: User Story 1 - Guest registration can redeem a courtesy coupon (Priority: P1)

**Goal**: Redeem a valid courtesy coupon during public athlete registration.

**Independent Test**: Submit registration with a valid coupon and verify the athlete is created and the coupon is used.

- [x] T005 [US1] Implement coupon-aware athlete creation in the backend service transaction
- [x] T006 [US1] Mark redeemed coupons as used and linked to the created athlete

---

## Phase 4: User Story 2 - Invalid or reused coupons are rejected (Priority: P2)

**Goal**: Protect single-use sponsor benefits.

**Independent Test**: Submit registration with invalid or used coupon and verify rejection.

- [x] T007 [US2] Validate invalid or inactive coupons before redemption
- [x] T008 [US2] Prevent reused coupons from creating a second athlete

---

## Phase 5: User Story 3 - Registration UI supports coupon redemption and backend rules stay covered by tests (Priority: P3)

**Goal**: Expose the feature publicly and lock it down with automated tests.

**Independent Test**: Confirm the public registration form accepts a coupon and backend tests pass.

- [x] T009 [US3] Add coupon field and submit flow to the public registration page
- [x] T010 [US3] Add automated backend tests for valid redemption and invalid/reused coupons
- [x] T011 [US3] Run backend tests plus backend/frontend builds successfully
