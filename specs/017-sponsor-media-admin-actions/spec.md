# Feature Specification: Sponsor And Media Admin Actions

**Feature Branch**: `017-sponsor-media-admin-actions`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Activate pending sponsors from admin (Priority: P1)

An admin can activate a pending sponsor from the sponsorship screen so that payment confirmation and courtesy coupon generation happen without leaving the panel.

**Why this priority**: Sponsor activation unlocks coupon distribution and public backdrop visibility.

**Independent Test**: Activate a pending sponsor and verify the sponsor status plus generated coupon count are updated in the admin response.

**Acceptance Scenarios**:

1. **Given** a pending sponsor, **When** the admin triggers activation, **Then** the API returns the sponsor as `active` and includes the generated courtesy coupon count.
2. **Given** the sponsorship admin screen is loaded, **When** activation succeeds, **Then** the screen updates the sponsor card and coupon summary without a full reload.

---

### User Story 2 - Manage media featured state and ordering (Priority: P2)

An admin can mark a media item as featured and adjust its sort order from the media screen.

**Why this priority**: The media page is currently read-only and cannot support editorial curation.

**Independent Test**: Update a media item and verify the API returns the new featured state and order.

**Acceptance Scenarios**:

1. **Given** an existing media item, **When** the admin saves a new `isFeatured` or `sortOrder`, **Then** the API persists and returns the updated item.
2. **Given** the media admin screen, **When** the admin updates an item, **Then** the local list reflects the new badge and order immediately.

## Requirements

### Functional Requirements

- FR-001: The backend MUST expose an authenticated sponsor activation workflow usable by the admin UI.
- FR-002: The sponsorship admin page MUST provide an activate action for pending sponsors.
- FR-003: The sponsorship admin page MUST refresh sponsor and coupon summary state after activation.
- FR-004: The backend MUST expose an authenticated media update endpoint for `isFeatured` and `sortOrder`.
- FR-005: The media admin page MUST support inline editing for featured state and sort order.
- FR-006: Automated tests MUST cover the new backend mutation flow for media updates.

### Key Entities

- Sponsor: Company record tied to a quota, activation status, and courtesy coupons.
- Media: Uploaded photo or video item with editorial featured state and display order.

## Success Criteria

- SC-001: Admins can activate pending sponsors directly from `/admin/patrocinio`.
- SC-002: Admins can edit media featured state and order from `/admin/midia`.
- SC-003: Backend automated tests remain green after the new mutations are added.
