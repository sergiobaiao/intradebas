# Tasks: Admin Dashboard Redesign

**Input**: Design documents from `/specs/051-admin-dashboard-redesign/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admin-dashboard-ui.md, quickstart.md

**Tests**: Required by FR-011 and SC-005. Add Playwright coverage for the dashboard route.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the frontend dashboard work without changing backend contracts.

- [X] T001 Review current admin route coverage in `frontend/app/admin/dashboard/page.tsx` against `specs/051-admin-dashboard-redesign/contracts/admin-dashboard-ui.md`
- [X] T002 [P] Create dashboard E2E test scaffold in `frontend/e2e/admin-dashboard.spec.ts`
- [X] T003 [P] Identify reusable admin CSS namespace additions needed in `frontend/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data derivation and layout primitives required by all user stories.

**CRITICAL**: No user story implementation should begin until these tasks are complete.

- [X] T004 Define admin navigation groups and route metadata in `frontend/app/admin/dashboard/page.tsx`
- [X] T005 Define dashboard metric derivation helpers using existing real data in `frontend/app/admin/dashboard/page.tsx`
- [X] T006 Define empty-state and safe formatting helpers in `frontend/app/admin/dashboard/page.tsx`
- [X] T007 Add base admin shell, sidebar, topbar, card, table and responsive CSS classes in `frontend/app/globals.css`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Navegar pelo painel administrativo com estrutura profissional (Priority: P1) MVP

**Goal**: Replace the current button-only admin dashboard with a professional sidebar/topbar dashboard shell.

**Independent Test**: Open `/admin/dashboard` and verify persistent grouped navigation links work for all existing admin destinations.

### Tests for User Story 1

- [X] T008 [P] [US1] Add Playwright assertions for sidebar/topbar and required admin links in `frontend/e2e/admin-dashboard.spec.ts`

### Implementation for User Story 1

- [X] T009 [US1] Replace button grid with admin dashboard shell structure in `frontend/app/admin/dashboard/page.tsx`
- [X] T010 [US1] Render grouped sidebar navigation for all routes from the UI contract in `frontend/app/admin/dashboard/page.tsx`
- [X] T011 [US1] Render topbar with page context and real operational status labels in `frontend/app/admin/dashboard/page.tsx`
- [X] T012 [US1] Style desktop sidebar, topbar and main content hierarchy in `frontend/app/globals.css`

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Ver indicadores reais do evento em cards e painéis (Priority: P1)

**Goal**: Show real operational metrics, team performance and records without mock data.

**Independent Test**: Compare dashboard values with existing API responses or verify explicit empty states when responses are empty.

### Tests for User Story 2

- [X] T013 [P] [US2] Add Playwright assertions that dashboard does not render reference/mock strings in `frontend/e2e/admin-dashboard.spec.ts`
- [X] T014 [P] [US2] Add Playwright assertions for real metric headings and empty-state behavior in `frontend/e2e/admin-dashboard.spec.ts`

### Implementation for User Story 2

- [X] T015 [US2] Fetch existing real data for teams, athletes, sports, results, ranking and sponsorship quotas in `frontend/app/admin/dashboard/page.tsx`
- [X] T016 [US2] Render metric cards calculated from real data in `frontend/app/admin/dashboard/page.tsx`
- [X] T017 [US2] Render team performance or ranking panel using real team/ranking data in `frontend/app/admin/dashboard/page.tsx`
- [X] T018 [US2] Render operational records table/list from real athletes, results, sports or sponsorship data in `frontend/app/admin/dashboard/page.tsx`
- [X] T019 [US2] Render explicit empty/error states for missing data in `frontend/app/admin/dashboard/page.tsx`
- [X] T020 [US2] Style metric cards, performance panel and operational table/list in `frontend/app/globals.css`

**Checkpoint**: User Story 2 should show useful real dashboard content without fake values.

---

## Phase 5: User Story 3 - Operar o dashboard em telas menores (Priority: P2)

**Goal**: Make the redesigned dashboard usable on notebook, tablet and mobile widths.

**Independent Test**: Resize to 1440px, 1024px, 768px and 390px and verify no horizontal overlap or unreadable table/list behavior.

### Tests for User Story 3

- [X] T021 [P] [US3] Add Playwright viewport checks for desktop, tablet and mobile dashboard rendering in `frontend/e2e/admin-dashboard.spec.ts`

### Implementation for User Story 3

- [X] T022 [US3] Add responsive sidebar/topbar behavior in `frontend/app/globals.css`
- [X] T023 [US3] Add responsive dashboard card and panel grids in `frontend/app/globals.css`
- [X] T024 [US3] Add responsive table/list overflow handling in `frontend/app/globals.css`

**Checkpoint**: User Story 3 should be independently verifiable through viewport checks.

---

## Phase 6: User Story 4 - Comparar visualmente com a referência aprovada (Priority: P3)

**Goal**: Ensure the final screen has the same structural quality as the approved reference while preserving INTRADEBAS identity and real data.

**Independent Test**: Compare `/admin/dashboard` side by side with the reference and confirm sidebar, topbar, cards, analytic panel and table/list are present.

### Implementation for User Story 4

- [X] T025 [US4] Tune visual spacing, borders, density and hierarchy in `frontend/app/globals.css`
- [X] T026 [US4] Tune dashboard copy to match INTRADEBAS terminology and avoid copied reference labels in `frontend/app/admin/dashboard/page.tsx`
- [X] T027 [US4] Verify no customer/revenue/reference-domain content appears in `frontend/app/admin/dashboard/page.tsx`

**Checkpoint**: User Story 4 should satisfy visual review against the reference without copying its fake data.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate, document and prepare the feature for implementation closure.

- [X] T028 [P] Update `INTRADEBAS_2026_Especificacao_Tecnica.md` to mark the admin dashboard redesign progress
- [X] T029 Run `npm run build` in `frontend/`
- [X] T030 Run `npm run test:e2e` in `frontend/`
- [X] T031 [P] Review `specs/051-admin-dashboard-redesign/quickstart.md` against actual validation steps
- [X] T032 Commit and push completed feature changes on branch `051-admin-dashboard-redesign`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **US1 and US2 (P1)**: Depend on Foundational. US1 and US2 may be developed in parallel if file conflicts are coordinated, but sequential implementation is safer because both touch `page.tsx` and `globals.css`.
- **US3 (P2)**: Depends on US1 layout and US2 content structure.
- **US4 (P3)**: Depends on US1, US2 and US3.
- **Polish**: Depends on selected user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: First MVP slice after foundation.
- **User Story 2 (P1)**: Can start after foundation; final integration is easier after US1 shell exists.
- **User Story 3 (P2)**: Requires concrete layout/content to test responsiveness.
- **User Story 4 (P3)**: Requires the final composed screen.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T008 can run while T009-T012 are implemented if selectors are agreed.
- T013 and T014 can run in parallel before US2 implementation.
- T021 can run in parallel with responsive CSS implementation after US1/US2 structure exists.
- T028 and T031 can run in parallel during polish.

---

## Parallel Example: User Story 2

```text
Task: "Add Playwright assertions that dashboard does not render reference/mock strings in frontend/e2e/admin-dashboard.spec.ts"
Task: "Add Playwright assertions for real metric headings and empty-state behavior in frontend/e2e/admin-dashboard.spec.ts"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Implement User Story 1 to deliver the sidebar/topbar shell and full navigation.
3. Validate `/admin/dashboard` manually and through Playwright.

### Incremental Delivery

1. Add US1 shell/navigation.
2. Add US2 real metrics/content.
3. Add US3 responsive behavior.
4. Add US4 visual polish against the approved reference.
5. Run build and E2E before commit/push.

### Quality Rules

- Do not add mock names, revenue, customer counts or random chart series.
- Prefer empty states over fake values.
- Preserve every existing admin route.
- Keep implementation limited to the dashboard unless a small shared CSS/helper change is necessary.
