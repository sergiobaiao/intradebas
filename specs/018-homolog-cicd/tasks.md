# Tasks: Homologation CI/CD Pipeline

**Input**: Design documents from `/specs/018-homolog-cicd/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for homologation CI/CD
- [x] T002 Review the current production compose/deploy shape

---

## Phase 2: Foundational

- [x] T003 Add a homologation compose file compatible with an external nginx proxy
- [x] T004 Add a reusable remote deploy script

---

## Phase 3: User Story 1 - Deploy homologation automatically after push (Priority: P1)

**Goal**: Pushes to the homolog branch deploy automatically to the VM.

**Independent Test**: The workflow validates the repo and triggers the remote deploy script over SSH.

- [x] T005 [US1] Add GitHub Actions workflow for validate + deploy
- [x] T006 [US1] Document required GitHub secrets and remote repo bootstrap

---

## Phase 4: User Story 2 - Support a VM with an existing external proxy (Priority: P2)

**Goal**: Keep the deployment compatible with the VM's existing nginx proxy.

**Independent Test**: The homolog stack uses configurable loopback ports and excludes the app nginx container.

- [x] T007 [US2] Expose frontend/backend only on configurable loopback ports in homolog compose
- [x] T008 [US2] Document proxy target ports and env file expectations

---

## Phase 5: User Story 3 - Keep delivery validated (Priority: P3)

**Goal**: Maintain automated confidence in the deployment setup.

**Independent Test**: Run backend tests, backend/frontend builds, and shell syntax validation successfully.

- [x] T009 [US3] Run backend tests plus backend/frontend builds successfully
- [x] T010 [US3] Validate deploy script shell syntax successfully
