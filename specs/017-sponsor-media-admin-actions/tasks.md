# Tasks: Sponsor And Media Admin Actions

**Input**: Design documents from `/specs/017-sponsor-media-admin-actions/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for sponsor and media admin actions
- [x] T002 Review the current sponsorship and media admin flows

---

## Phase 2: Foundational

- [x] T003 Add DTO/contracts for media admin updates
- [x] T004 Extend backend test scaffolding where needed

---

## Phase 3: User Story 1 - Activate pending sponsors from admin (Priority: P1)

**Goal**: Let admins activate sponsor records directly from the sponsorship page.

**Independent Test**: Trigger activation and verify the updated sponsor status and coupon count are returned.

- [x] T005 [US1] Add sponsor activation action to the admin sponsorship page
- [x] T006 [US1] Refresh sponsorship summary state after activation

---

## Phase 4: User Story 2 - Manage media featured state and ordering (Priority: P2)

**Goal**: Turn the media admin page into an actionable editorial console.

**Independent Test**: Update a media row and verify the new featured state and order.

- [x] T007 [US2] Implement authenticated media update endpoint
- [x] T008 [US2] Add inline edit flow to the admin media page

---

## Phase 5: User Story 3 - Keep mutations covered (Priority: P3)

**Goal**: Maintain regression coverage for the new admin mutations.

**Independent Test**: Run backend tests and both app builds successfully.

- [x] T009 [US3] Add automated backend tests for media update behavior
- [x] T010 [US3] Run backend tests plus backend/frontend builds successfully
