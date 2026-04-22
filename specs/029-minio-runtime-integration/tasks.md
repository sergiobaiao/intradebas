# Tasks: MinIO Runtime Integration

**Input**: Design documents from `/specs/029-minio-runtime-integration/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [x] T001 Create the Spec Kit artifacts for MinIO runtime integration
- [x] T002 Review the current Compose and storage runtime flow

## Phase 2: Implementation

- [x] T003 Add deterministic MinIO bucket bootstrap services to runtime Compose files
- [x] T004 Wire backend startup order to the MinIO bootstrap flow
- [x] T005 Add automated backend tests for the MinIO storage service
- [x] T006 Update runtime documentation to match the MinIO-backed upload flow
- [x] T007 Remove runtime mocked data from the frontend data layer

## Phase 3: Validation

- [x] T008 Run backend tests plus backend/frontend builds successfully
