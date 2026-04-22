# Feature Specification: Sponsor Admin Edit

**Feature Branch**: `028-sponsor-admin-edit`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Edit sponsor operational data (Priority: P1)

An admin can update sponsor contact data, logo URL, quota, and status from the sponsorship screen so commercial corrections do not require database intervention.

**Why this priority**: Sponsors are already visible and activatable in admin, but the workflow is incomplete without edit capability.

**Independent Test**: Update an existing sponsor and verify the API persists the changes and the admin screen reflects them after save.

**Acceptance Scenarios**:

1. **Given** an existing sponsor, **When** an authenticated admin updates contact or quota data, **Then** the API returns the saved sponsor with the new values.
2. **Given** an invalid sponsor ID, **When** update is attempted, **Then** the API returns a clear validation error.

### User Story 2 - Keep coupon visibility intact after edits (Priority: P2)

An admin can edit a sponsor without losing coupon visibility or breaking the sponsorship overview.

**Why this priority**: Sponsor editing must not regress the coupon-monitoring flow already in use.

**Independent Test**: Load the sponsorship screen, edit a sponsor, and verify sponsor cards plus selected coupon lists still render correctly.

**Acceptance Scenarios**:

1. **Given** the sponsorship screen with sponsor and coupon data loaded, **When** an edit succeeds, **Then** the sponsor list refreshes without losing the current admin context.
2. **Given** the selected sponsor is edited, **When** the save completes, **Then** the coupon panel still loads for that sponsor.

## Requirements

### Functional Requirements

- FR-001: The backend MUST expose an authenticated update endpoint for sponsors.
- FR-002: Sponsor updates MUST support `companyName`, `contactName`, `email`, `phone`, `logoUrl`, `quotaId`, and `status`.
- FR-003: Sponsor updates MUST reject invalid sponsor IDs and invalid quota IDs.
- FR-004: The admin sponsorship screen MUST provide an edit form for the selected sponsor.
- FR-005: The sponsorship admin screen MUST refresh sponsor data after a successful edit.
- FR-006: Automated backend tests MUST cover successful sponsor edits and invalid-record failures.

### Key Entities

- Sponsor: Commercial partner record tied to a quota, contact data, activation state, and courtesy coupons.
- SponsorshipQuota: Commercial tier assigned to a sponsor and used for courtesy coupon generation and backdrop ordering.

## Success Criteria

- SC-001: Admins can edit sponsor details from `/admin/patrocinio`.
- SC-002: Sponsor edits preserve coupon visibility in the admin screen.
- SC-003: Backend automated tests and backend/frontend builds pass after the feature is added.
