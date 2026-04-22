# Feature Specification: Admin Create Core Entities

**Feature Branch**: `019-admin-create-core`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User request: "deixe a homologacao por ultimo. vamos prosseguir com as outras tarefas"

## User Stories

### User Story 1 - Create teams from admin (Priority: P1)

An admin can create a new team from the panel so the event can add or reorganize teams without database intervention.

**Why this priority**: Team creation is a core admin gap and blocks operational changes.

**Independent Test**: Create a team and verify it is returned by the API with the provided name and color.

### User Story 2 - Create sports from admin (Priority: P2)

An admin can create a new sport from the panel so the event schedule can evolve without editing the database manually.

**Why this priority**: Sport creation is the other missing half of the admin core CRUD.

**Independent Test**: Create a sport and verify the API returns the new sport with category and scheduling metadata.

## Requirements

### Functional Requirements

- FR-001: The backend MUST expose an authenticated endpoint to create teams.
- FR-002: The backend MUST expose an authenticated endpoint to create sports.
- FR-003: The admin UI MUST include a new team form.
- FR-004: The admin UI MUST include a new sport form.
- FR-005: Automated backend tests MUST cover team and sport creation.

## Success Criteria

- SC-001: Admins can create teams from `/admin/equipes/nova`.
- SC-002: Admins can create sports from `/admin/modalidades/nova`.
- SC-003: Backend automated tests and both app builds remain green.
