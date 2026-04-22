# Feature Specification: Real Media Storage

**Feature Branch**: `026-real-media-storage`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Upload local media files from admin (Priority: P1)

Admins can upload actual media files from the panel so the media library no longer depends only on external URLs.

**Independent Test**: Upload a media file and verify the backend persists a local media record with a served file URL.

## Requirements

- FR-001: The backend MUST expose an authenticated multipart upload endpoint for media files.
- FR-002: Uploaded files MUST be stored on disk and exposed through a public file-serving route.
- FR-003: The admin media creation page MUST support local file upload in addition to remote URL creation.
- FR-004: Automated backend tests MUST cover local uploaded media creation behavior.

## Success Criteria

- SC-001: Admins can upload a local image or video from `/admin/midia/nova`.
- SC-002: Uploaded local media records resolve to a backend-served file URL.
- SC-003: Backend tests and both app builds remain green.
