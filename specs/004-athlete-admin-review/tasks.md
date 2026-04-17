# Tasks: Athlete Admin Review and Approval

**Input**: Design documents from `/specs/004-athlete-admin-review/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for athlete admin review
- [x] T002 Review current athlete/auth contracts and admin route structure

---

## Phase 2: Foundational

- [x] T003 Add a protected athlete list endpoint or protect the existing list endpoint appropriately
- [x] T004 Add shared frontend helpers for authenticated admin API calls

---

## Phase 3: User Story 1 - Admin reviews pending athlete registrations (Priority: P1)

**Goal**: Give admins a protected athlete review screen.

**Independent Test**: Log in and load the admin athlete review page using the protected API.

- [x] T005 [US1] Implement backend support for admin athlete review list access
- [x] T006 [US1] Create the admin athlete review page in `frontend/app/admin/atletas/`
- [x] T007 [US1] Render athlete status, team, and sports on the page

---

## Phase 4: User Story 2 - Admin approves or rejects a pending athlete (Priority: P2)

**Goal**: Make the protected status endpoint usable from the admin UI.

**Independent Test**: Approve and reject athletes from the admin page and see the updated result.

- [x] T008 [US2] Wire approve/reject UI actions to the protected status endpoint
- [x] T009 [US2] Refresh or reconcile athlete state in the UI after mutation
- [x] T010 [US2] Show success and error states for admin review actions

---

## Phase 5: User Story 3 - Admin session bootstrap is reusable across protected frontend requests (Priority: P3)

**Goal**: Avoid duplicating admin token handling for future pages.

**Independent Test**: The review page loads and mutates through shared authenticated fetch helpers.

- [x] T011 [US3] Centralize admin-token-aware fetch helpers in `frontend/app/lib.ts`
- [x] T012 [US3] Update documentation or navigation to expose the athlete review page
- [x] T013 [US3] Validate backend and frontend builds after the review flow is added
