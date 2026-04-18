# Tasks: Results Entry and Public Team Ranking

**Input**: Design documents from `/specs/007-results-ranking/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for results entry and ranking
- [x] T002 Review current result, team, and scoring-related schema/model capabilities

---

## Phase 2: Foundational

- [x] T003 Add backend module/controller/service for results and ranking
- [x] T004 Extend frontend shared helpers for results/ranking fetches
- [x] T005 Add backend test scaffolding for result and ranking coverage

---

## Phase 3: User Story 1 - Public visitors can see a real ranking derived from recorded results (Priority: P1)

**Goal**: Replace static ranking assumptions with ranking data from stored results.

**Independent Test**: Populate results and verify the public page shows ranking from the backend.

- [x] T006 [US1] Implement `GET /api/v1/results/ranking`
- [x] T007 [US1] Implement `GET /api/v1/results`
- [x] T008 [US1] Update the public results page to use ranking API data

---

## Phase 4: User Story 2 - Admin can record a result through a protected API contract (Priority: P2)

**Goal**: Allow protected write access for results.

**Independent Test**: Authenticate, create a result, and verify stored/calculated points.

- [x] T009 [US2] Implement protected `POST /api/v1/results`
- [x] T010 [US2] Validate sport/team references and calculate points from scoring config
- [x] T011 [US2] Protect result creation with the existing JWT guard

---

## Phase 5: User Story 3 - Ranking rules are covered by automated backend tests (Priority: P3)

**Goal**: Ensure scoring and ranking logic is regression-resistant.

**Independent Test**: Run backend tests and verify result/ranking service tests pass.

- [x] T012 [US3] Add automated tests for result creation logic
- [x] T013 [US3] Add automated tests for ranking aggregation logic
- [x] T014 [US3] Run backend tests and both app builds successfully
