# Feature Specification: Sponsor Coupon Admin Actions

**Feature Branch**: `032-sponsor-coupon-admin-actions`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Generate extra courtesy coupons from admin (Priority: P1)

An admin can generate an extra coupon for a sponsor directly from the sponsorship screen so operational exceptions do not require direct database changes.

**Why this priority**: Sponsor and coupon visibility already exist, but the commission still lacks direct operational control over coupon issuance.

**Independent Test**: Generate a coupon for an existing sponsor and verify it appears in sponsor coupon listings.

**Acceptance Scenarios**:

1. **Given** an existing sponsor, **When** an authenticated admin generates a coupon, **Then** a new active coupon is created with a unique code.
2. **Given** an invalid sponsor ID, **When** generation is attempted, **Then** the API returns a validation error.

### User Story 2 - Expire active coupons from admin (Priority: P2)

An admin can expire an active coupon from the sponsorship screen so invalid or revoked coupons stop being usable.

**Why this priority**: Coupon control is incomplete until the admin can revoke a still-active code.

**Independent Test**: Expire an active coupon and verify the coupon status changes to `expired`.

**Acceptance Scenarios**:

1. **Given** an active coupon, **When** an authenticated admin expires it, **Then** the coupon status becomes `expired`.
2. **Given** a used or missing coupon, **When** expire is attempted, **Then** the API returns a clear validation error.

## Requirements

### Functional Requirements

- FR-001: The backend MUST expose an authenticated coupon generation action for sponsors.
- FR-002: The backend MUST expose an authenticated coupon expiration action.
- FR-003: Generated coupon codes MUST remain unique.
- FR-004: Coupon expiration MUST reject missing or already-used coupons.
- FR-005: The admin sponsorship screen MUST provide controls to generate and expire coupons.
- FR-006: Automated backend tests MUST cover coupon generation and expiration flows.

## Success Criteria

- SC-001: Admins can generate extra coupons from `/admin/patrocinio`.
- SC-002: Admins can expire active coupons from `/admin/patrocinio`.
- SC-003: Backend automated tests and backend/frontend builds pass after the feature is added.
