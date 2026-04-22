# Feature Specification: Athlete Admin Edit

**Feature Branch**: `023-athlete-admin-edit`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User request: "prossiga com os proximos passos"

## User Stories

### User Story 1 - Edit athlete registration data from admin (Priority: P1)

Admins can update athlete registration data from the panel so operational corrections do not require direct database intervention.

**Independent Test**: Update an athlete and verify the API returns the new team, profile data, and sport registrations.

## Requirements

- FR-001: The backend MUST expose an authenticated endpoint to update athlete registration data.
- FR-002: Athlete updates MUST support team changes and sport registration replacement.
- FR-003: The admin athlete detail page MUST provide an edit form for the supported fields.
- FR-004: Automated backend tests MUST cover athlete update behavior.

## Success Criteria

- SC-001: Admins can edit an athlete from `/admin/atletas/[id]`.
- SC-002: Team and sport changes persist and are reflected immediately after save.
- SC-003: Backend tests and both app builds remain green.
