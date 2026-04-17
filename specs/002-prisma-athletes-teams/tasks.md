# Tasks: Prisma-Backed Athletes and Teams

**Input**: Design documents from `/specs/002-prisma-athletes-teams/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for database-backed athlete/team persistence
- [x] T002 Review current in-memory service behavior and preserve the external contract shape

---

## Phase 2: Foundational

- [x] T003 Add a shared Prisma module/service under `backend/src/prisma/`
- [x] T004 Update backend wiring so application modules can depend on Prisma cleanly
- [x] T005 Align package scripts and seed metadata for Prisma client generation and seeding

---

## Phase 3: User Story 1 - Persist athlete registrations in PostgreSQL (Priority: P1)

**Goal**: Create and manage athletes from the database instead of runtime memory.

**Independent Test**: Generate Prisma client, seed baseline data, create athletes, and retrieve them after restart.

- [x] T006 [US1] Replace athlete fixture storage in `backend/src/athletes/athletes.service.ts` with Prisma queries
- [x] T007 [US1] Implement transactional athlete creation with registration rows and LGPD timestamp persistence
- [x] T008 [US1] Preserve duplicate CPF, team validation, sport validation, and titular validation against the database
- [x] T009 [US1] Persist athlete status updates in `PATCH /api/v1/athletes/:id/status`

---

## Phase 4: User Story 2 - Read public team ranking and team athletes from the database (Priority: P2)

**Goal**: Serve team and team-athlete data from PostgreSQL.

**Independent Test**: Seed teams and athletes, then validate all team endpoints against persisted data.

- [x] T010 [US2] Replace fixture reads in `backend/src/teams/teams.service.ts` with Prisma queries
- [x] T011 [US2] Ensure `GET /api/v1/teams/:id` returns athlete count from persisted relations
- [x] T012 [US2] Ensure `GET /api/v1/teams/:id/athletes` returns persisted athletes with stable response fields

---

## Phase 5: User Story 3 - Keep the repository aligned with the long-term Prisma architecture (Priority: P3)

**Goal**: Make the repository clearly ready for later modules on top of Prisma.

**Independent Test**: Generate Prisma client and run backend build successfully.

- [x] T013 [US3] Document the database-backed flow in `README.md`
- [x] T014 [US3] Run Prisma client generation and backend build validation
- [x] T015 [US3] Remove no-longer-needed runtime fixture dependency from athlete/team persistence paths
