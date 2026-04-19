# Feature Specification: Sponsor and Coupon Admin Visibility

**Feature Branch**: `013-sponsor-coupon-admin`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "Proceed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin can list sponsors operationally (Priority: P1)

As an organizer, I need to see the current sponsors in the admin area so I can manage commercial follow-up and activation status.

**Why this priority**: Sponsor capture and activation already exist, but there is still no operational visibility.

**Independent Test**: Load the sponsor admin page and verify sponsors are listed with quota and status.

**Acceptance Scenarios**:

1. **Given** sponsors exist, **When** the admin sponsor listing loads,
   **Then** it shows company, contact, quota, and current status.
2. **Given** no sponsors exist, **When** the page loads,
   **Then** an empty state is shown.

---

### User Story 2 - Admin can inspect generated coupons and redemption status (Priority: P2)

As an organizer, I need to inspect courtesy coupons by sponsor so I can confirm generation and usage.

**Why this priority**: The business flow is incomplete without operational visibility into generated and redeemed coupons.

**Independent Test**: Load sponsor coupons and verify each coupon shows code, status, and redeemed athlete when present.

**Acceptance Scenarios**:

1. **Given** a sponsor has generated coupons, **When** the admin opens that sponsor section,
   **Then** the coupon list shows each code and its current status.
2. **Given** a coupon has already been redeemed, **When** it is listed,
   **Then** the UI shows that it is used and the linked athlete when available.

---

### User Story 3 - Sponsor/coupon listing behavior stays covered by automated tests (Priority: P3)

As a developer, I need automated tests for sponsor and coupon listing behavior so these admin views remain stable.

**Why this priority**: The admin view is projection-heavy and easy to break when domain fields evolve.

**Independent Test**: Run backend automated tests and verify sponsor/coupon listing scenarios pass.

**Acceptance Scenarios**:

1. **Given** mocked sponsors and coupons, **When** backend listing tests run,
   **Then** they validate projection of coupon status and sponsor quota metadata.

### Edge Cases

- What happens when a sponsor has no coupons yet?
- What happens when a redeemed coupon has no expanded athlete object loaded?
- What happens when sponsors exist in both pending and active states?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose an authenticated sponsor listing endpoint for admins.
- **FR-002**: The backend MUST expose an authenticated coupon listing endpoint for admins.
- **FR-003**: The backend MUST support listing coupons for a specific sponsor.
- **FR-004**: Coupon listings MUST include coupon status and redeemed athlete context when available.
- **FR-005**: The admin frontend MUST expose a sponsor/coupon management page.
- **FR-006**: Automated backend tests MUST cover sponsor and coupon listing projections.

### Key Entities *(include if feature involves data)*

- **Sponsor Admin Summary**: Operational projection of sponsor data including quota and status.
- **Coupon Admin Summary**: Operational projection of coupon code, status, sponsor, and redemption context.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can review sponsors from the web UI.
- **SC-002**: Admins can review generated and redeemed coupons from the web UI.
- **SC-003**: Backend automated tests and backend/frontend builds continue to pass.
