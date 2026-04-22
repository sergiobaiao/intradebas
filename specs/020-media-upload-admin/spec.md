# Feature Specification: Media Upload Admin

**Feature Branch**: `020-media-upload-admin`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User request: "go ahead"

## User Stories

### User Story 1 - Register media items from admin (Priority: P1)

An admin can register a photo or video item from the panel using a public URL and metadata so the media library becomes operational without direct database edits.

**Why this priority**: The media area still lacks a real creation flow.

**Independent Test**: Create a media item and verify the API returns the saved record with uploader context.

### User Story 2 - Enter media from a dedicated admin screen (Priority: P2)

An admin can use a dedicated screen to add media and return to the media library.

**Why this priority**: The backend endpoint needs a usable operational frontend.

**Independent Test**: Submit the form and confirm navigation back to the media index without build regressions.

## Requirements

- FR-001: The backend MUST expose an authenticated endpoint to create media items.
- FR-002: Media creation MUST persist the authenticated admin as `uploadedBy`.
- FR-003: The admin UI MUST include a dedicated page for creating media entries.
- FR-004: Automated backend tests MUST cover media creation.

## Success Criteria

- SC-001: Admins can create photos and videos from `/admin/midia/nova`.
- SC-002: The created media item appears in the media library after navigation back.
- SC-003: Backend tests and both app builds remain green.
