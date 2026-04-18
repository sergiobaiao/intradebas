# Tasks: Public Sponsor Backdrop Gallery

**Input**: Design documents from `/specs/010-backdrop-public-gallery/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for the public sponsor backdrop
- [x] T002 Review current sponsorship domain and public homepage structure

---

## Phase 2: Foundational

- [x] T003 Extend sponsorship contracts for a public backdrop feed
- [x] T004 Extend backend test coverage scaffolding for backdrop behavior

---

## Phase 3: User Story 1 - Public users can see the active sponsor backdrop (Priority: P1)

**Goal**: Expose active sponsors publicly in the portal.

**Independent Test**: Load the public backdrop page and verify active sponsors are shown.

- [x] T005 [US1] Implement a public backdrop endpoint in the sponsorship backend
- [x] T006 [US1] Add a public backdrop page to the frontend portal

---

## Phase 4: User Story 2 - Higher-tier sponsors receive higher visual priority (Priority: P2)

**Goal**: Preserve quota-based sponsor prominence in the backdrop feed.

**Independent Test**: Verify sponsors are sorted by backdrop priority descending.

- [x] T007 [US2] Filter backdrop feed to active sponsors only
- [x] T008 [US2] Order backdrop feed deterministically by priority

---

## Phase 5: User Story 3 - Backdrop rules are covered by automated tests (Priority: P3)

**Goal**: Lock down commercial ordering logic with tests.

**Independent Test**: Run backend tests and builds successfully.

- [x] T009 [US3] Add automated backend tests for backdrop filtering and ordering
- [x] T010 [US3] Surface the backdrop link from the public homepage
- [x] T011 [US3] Run backend tests plus backend/frontend builds successfully
