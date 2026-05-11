# Tasks: Admin Screens Redesign

**Input**: Design documents from `/specs/052-admin-screens-redesign/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admin-screens-ui.md, quickstart.md

**Tests**: Required by FR-008 and SC-006.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inventory current admin screens and prepare shared styling/testing.

- [X] T001 Review current admin list/form routes under `frontend/app/admin/` against `specs/052-admin-screens-redesign/contracts/admin-screens-ui.md`
- [ ] T002 [P] Create representative E2E scaffold in `frontend/e2e/admin-screens.spec.ts`
- [X] T003 [P] Identify reusable admin screen classes to extend in `frontend/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared visual primitives for route-level redesign.

- [X] T004 Add reusable admin page header, action row, section card, table wrapper and form section CSS in `frontend/app/globals.css`
- [X] T005 Add admin empty-state and responsive utility CSS in `frontend/app/globals.css`
- [ ] T006 Define representative E2E admin session setup in `frontend/e2e/admin-screens.spec.ts`

---

## Phase 3: User Story 1 - Navegar entre telas administrativas com layout consistente (Priority: P1) MVP

**Goal**: Make primary admin routes visually consistent with feature 051.

**Independent Test**: Open primary admin routes and verify consistent page heading, actions and admin structure.

### Tests for User Story 1

- [ ] T007 [P] [US1] Add E2E route smoke assertions for primary admin headings in `frontend/e2e/admin-screens.spec.ts`

### Implementation for User Story 1

- [ ] T008 [US1] Redesign athletes admin listing shell in `frontend/app/admin/atletas/page.tsx`
- [ ] T009 [US1] Redesign teams admin listing shell in `frontend/app/admin/equipes/page.tsx`
- [ ] T010 [US1] Redesign sports admin listing shell in `frontend/app/admin/modalidades/page.tsx`
- [ ] T011 [US1] Redesign results admin listing shell in `frontend/app/admin/resultados/page.tsx`
- [ ] T012 [US1] Redesign sponsorship admin listing shell in `frontend/app/admin/patrocinio/page.tsx`
- [ ] T013 [US1] Redesign media admin listing shell in `frontend/app/admin/midia/page.tsx`
- [ ] T014 [US1] Redesign LGPD/audit/users/config listing shells in `frontend/app/admin/lgpd/page.tsx`, `frontend/app/admin/auditoria/page.tsx`, `frontend/app/admin/usuarios/page.tsx`, and `frontend/app/admin/configuracoes/page.tsx`

---

## Phase 4: User Story 2 - Trabalhar com listas e tabelas reais de forma legível (Priority: P1)

**Goal**: Standardize real-data list/table/card presentations and empty states.

**Independent Test**: Compare altered screens with real API-backed content or explicit empty states.

### Tests for User Story 2

- [ ] T015 [P] [US2] Add E2E assertions that altered admin screens do not render reference mock strings in `frontend/e2e/admin-screens.spec.ts`

### Implementation for User Story 2

- [ ] T016 [US2] Standardize athletes/equipes/modalidades data views in `frontend/app/admin/atletas/page.tsx`, `frontend/app/admin/equipes/page.tsx`, and `frontend/app/admin/modalidades/page.tsx`
- [ ] T017 [US2] Standardize results/ranking operational views in `frontend/app/admin/resultados/page.tsx` and `frontend/app/admin/ranking/page.tsx`
- [ ] T018 [US2] Standardize sponsorship/media/backdrop data views in `frontend/app/admin/patrocinio/page.tsx`, `frontend/app/admin/midia/page.tsx`, and `frontend/app/admin/backdrop/page.tsx`
- [ ] T019 [US2] Standardize governance views in `frontend/app/admin/lgpd/page.tsx`, `frontend/app/admin/auditoria/page.tsx`, `frontend/app/admin/usuarios/page.tsx`, and `frontend/app/admin/configuracoes/page.tsx`
- [ ] T020 [US2] Ensure every altered empty list uses explicit empty-state copy in altered `frontend/app/admin/**/page.tsx` files

---

## Phase 5: User Story 3 - Usar formulários administrativos com apresentação consistente (Priority: P2)

**Goal**: Bring main creation/edit forms into the same visual pattern without changing behavior.

**Independent Test**: Open form routes and verify field grouping, actions and existing submission behavior remain available.

### Tests for User Story 3

- [ ] T021 [P] [US3] Add E2E form route smoke assertions in `frontend/e2e/admin-screens.spec.ts`

### Implementation for User Story 3

- [ ] T022 [US3] Redesign team/sport creation forms in `frontend/app/admin/equipes/nova/page.tsx` and `frontend/app/admin/modalidades/nova/page.tsx`
- [ ] T023 [US3] Redesign athlete/media creation forms in `frontend/app/admin/atletas/novo/page.tsx` and `frontend/app/admin/midia/nova/page.tsx`
- [ ] T024 [US3] Redesign result creation form in `frontend/app/admin/resultados/novo/page.tsx`
- [ ] T025 [US3] Align edit form wrappers in `frontend/app/admin/atletas/athlete-edit-form.tsx`, `frontend/app/admin/equipes/team-edit-form.tsx`, and `frontend/app/admin/modalidades/sport-edit-form.tsx`

---

## Phase 6: User Story 4 - Operar o admin em telas menores (Priority: P2)

**Goal**: Ensure changed admin screens are responsive.

**Independent Test**: Representative routes remain usable at 1440px, 1024px, 768px and 390px.

### Tests for User Story 4

- [ ] T026 [P] [US4] Add representative viewport checks in `frontend/e2e/admin-screens.spec.ts`

### Implementation for User Story 4

- [ ] T027 [US4] Add responsive behavior for admin screen grids/forms/tables in `frontend/app/globals.css`
- [ ] T028 [US4] Verify altered table wrappers use controlled overflow in altered `frontend/app/admin/**/page.tsx` files

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate and document the feature.

- [ ] T029 [P] Update `INTRADEBAS_2026_Especificacao_Tecnica.md` with feature 052 progress
- [ ] T030 Run `npm run build` in `frontend/`
- [ ] T031 Run `npm run test:e2e` in `frontend/`
- [ ] T032 Commit and push completed feature changes on branch `052-admin-screens-redesign`

---

## Dependencies & Execution Order

- Phase 1 before Phase 2.
- Phase 2 blocks all user stories.
- US1 and US2 are P1 and should be implemented first.
- US3 can start after shared CSS and list shell patterns exist.
- US4 depends on concrete screens being altered.
- Polish depends on selected user stories being complete.

## Parallel Opportunities

- T002 and T003 can run in parallel.
- T007 and T015 can be prepared while implementation patterns are being defined.
- Route groups can be implemented in parallel if each developer owns distinct files.
- T029 can run during polish while final validation executes.

## Implementation Strategy

1. Establish shared CSS primitives.
2. Redesign the highest-impact list routes first.
3. Standardize real-data views and empty states.
4. Bring form routes into the same visual language.
5. Validate build/E2E and update the technical specification.
