# Feature Specification: Athlete And Team Delete

**Feature Branch**: `035-athlete-team-delete`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Delete athletes safely from admin (Priority: P1)

An admin can delete an athlete when the athlete has no blocking operational links, so incorrect registrations can be removed without touching the database.

**Independent Test**: Delete an athlete with no blocking links and verify registrations are removed and the athlete record disappears.

### User Story 2 - Delete empty teams safely from admin (Priority: P1)

An admin can delete a team only when it has no athletes and no results, so structural cleanup is possible without breaking event history.

**Independent Test**: Delete an empty team and verify the team record is removed; try deleting a populated team and verify the API rejects it.

## Requirements

- FR-001: The backend MUST expose authenticated delete endpoints for athletes and teams.
- FR-002: Athlete deletion MUST reject athletes with dependents, redeemed coupons, or recorded results.
- FR-003: Athlete deletion MUST remove registrations before deleting the athlete.
- FR-004: Team deletion MUST reject teams that still have athletes or results.
- FR-005: Admin athlete and team screens MUST expose delete actions.
- FR-006: Automated backend tests MUST cover successful deletion and blocked deletion scenarios.

## Success Criteria

- SC-001: Admins can delete eligible athletes from the admin UI.
- SC-002: Admins can delete eligible teams from the admin UI.
- SC-003: Backend automated tests and backend/frontend builds pass after the feature is added.
