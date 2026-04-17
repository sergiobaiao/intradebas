# Tasks: MVP Core Portal

**Input**: Design documents from `/specs/001-mvp-core-portal/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Initialize Spec Kit in the repository root with Codex integration
- [x] T002 Create frontend and backend application scaffolds aligned to the event specification
- [x] T003 Configure local buildable dependencies for `frontend/` and `backend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Define the domain schema baseline in `backend/prisma/schema.prisma`
- [x] T005 Create initial seed data for teams, sports, and sponsorship quotas in `backend/prisma/seed.ts`
- [x] T006 Create shared runtime fixtures for MVP contract development in `backend/src/shared/fixtures.ts`
- [x] T007 Configure frontend data access helpers with backend-first fetch and local fallbacks in `frontend/app/lib.ts`

**Checkpoint**: Foundation ready for user-story delivery.

---

## Phase 3: User Story 1 - Public athlete registration and live team visibility (Priority: P1) 🎯 MVP

**Goal**: Let public users inspect teams, register athletes, and see a simple ranked scoreboard.

**Independent Test**: Open `/`, `/inscricao`, and `/resultados`, then validate the matching
backend contracts for teams and athletes.

- [x] T008 [US1] Implement team contract endpoints in `backend/src/teams/`
- [x] T009 [US1] Implement athlete contract endpoints and validation in `backend/src/athletes/`
- [x] T010 [US1] Enforce duplicate CPF rejection and guest status rules in `backend/src/athletes/athletes.service.ts`
- [x] T011 [US1] Build public registration page in `frontend/app/inscricao/page.tsx`
- [x] T012 [US1] Build public results page in `frontend/app/resultados/page.tsx`
- [x] T013 [US1] Update home navigation and public CTA flow in `frontend/app/page.tsx`

---

## Phase 4: User Story 2 - Admin operational visibility for athlete intake (Priority: P2)

**Goal**: Give the organizing committee a minimal operational dashboard driven by backend data.

**Independent Test**: Open `/admin/dashboard` and verify athlete, pending, and team counts.

- [x] T014 [US2] Build dashboard metrics page in `frontend/app/admin/dashboard/page.tsx`
- [x] T015 [US2] Reuse athlete/team backend contracts in the dashboard data flow via `frontend/app/lib.ts`

---

## Phase 5: User Story 3 - Structured MVP foundation for persistence and next modules (Priority: P3)

**Goal**: Keep the project traceable and ready for subsequent auth, sponsorship, and scoring work.

**Independent Test**: Inspect Spec Kit artifacts and run app builds successfully.

- [x] T016 [US3] Establish project constitution in `.specify/memory/constitution.md`
- [x] T017 [US3] Create Spec Kit feature artifacts in `specs/001-mvp-core-portal/`
- [x] T018 [US3] Validate `npm run build` in `backend/`
- [x] T019 [US3] Validate `npm run build` in `frontend/`

---

## Phase 6: Next Work (Unstarted)

- [ ] T020 Replace in-memory athlete/team runtime storage with Prisma-backed repositories
- [ ] T021 Add NestJS auth module with JWT and protect admin routes
- [ ] T022 Add automated contract tests for athlete and team endpoints
- [ ] T023 Adapt the `next-shadcn-admin-dashboard` template into `frontend/`
- [ ] T024 Implement sponsorship quota public/admin flows
- [ ] T025 Implement result entry, scoring config, and live ranking stream

