# Feature Specification: Media Admin Delete And Edit

**Feature Branch**: `033-media-admin-delete-edit`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Edit media metadata from admin (Priority: P1)

An admin can edit the title and editorial state of a media item so the gallery stays organized without recreating entries.

**Why this priority**: The current media screen only partially edits items and is weak for real operational curation.

**Independent Test**: Update an existing media item and verify the API persists the new title and editorial fields.

### User Story 2 - Delete media items from admin (Priority: P2)

An admin can delete a media item and, for local uploads, also remove the stored object so obsolete assets do not remain in the system.

**Why this priority**: Media management is incomplete until admins can remove bad or obsolete uploads.

**Independent Test**: Delete an existing local media item and verify the record is removed and storage cleanup is invoked.

## Requirements

- FR-001: The backend MUST expose an authenticated delete endpoint for media.
- FR-002: The backend MUST support editing media title in addition to featured/sort fields.
- FR-003: Deleting a local media item MUST remove the stored object from MinIO-compatible storage.
- FR-004: The media admin screen MUST support deleting items and editing title/editorial fields.
- FR-005: Automated backend tests MUST cover media deletion and local-storage cleanup.

## Success Criteria

- SC-001: Admins can edit media title and editorial fields from `/admin/midia`.
- SC-002: Admins can delete media items from `/admin/midia`.
- SC-003: Backend automated tests and backend/frontend builds pass after the feature is added.
