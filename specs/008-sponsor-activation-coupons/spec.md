# Feature Specification: Sponsor Activation and Courtesy Coupons

**Feature Branch**: `008-sponsor-activation-coupons`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "Proceed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin can activate a sponsor after payment confirmation (Priority: P1)

As an organizer, I need to activate a sponsor after confirming payment so the sponsorship moves from
interest to an active commercial slot.

**Why this priority**: Sponsor capture is already implemented; activation is the next operational step.

**Independent Test**: Authenticate as admin, activate a pending sponsor, and verify the sponsor
status becomes `active`.

**Acceptance Scenarios**:

1. **Given** a pending sponsor exists, **When** an authenticated admin activates it,
   **Then** the sponsor status changes to `active`.
2. **Given** an invalid or non-existent sponsor ID, **When** activation is attempted,
   **Then** the API returns a clear error.

---

### User Story 2 - Courtesy coupons are generated automatically on activation (Priority: P2)

As an organizer, I need activation to create the correct number of courtesy coupons so sponsor
benefits are provisioned without manual work.

**Why this priority**: Courtesy coupons are a core business rule of sponsorship quotas.

**Independent Test**: Activate a sponsor and verify the expected number of unique coupons exists.

**Acceptance Scenarios**:

1. **Given** a sponsor quota defines a courtesy count, **When** the sponsor is activated,
   **Then** that many unique active coupons are created.
2. **Given** a sponsor is already active, **When** activation is attempted again,
   **Then** duplicate coupon generation does not occur.

---

### User Story 3 - Coupon generation and activation rules are covered by automated tests (Priority: P3)

As a developer, I need automated tests for sponsor activation and coupon generation so these
commercial rules stay correct as the product evolves.

**Why this priority**: Coupon generation is deterministic and high-value for automated protection.

**Independent Test**: Run backend tests and verify activation/coupon cases are covered.

**Acceptance Scenarios**:

1. **Given** mocked sponsor and quota data, **When** sponsorship activation tests run,
   **Then** they validate status changes, unique code generation, and duplicate protection.

### Edge Cases

- What happens if coupon generation collides with an existing code?
- What happens when a sponsor quota has zero courtesy slots?
- How is repeated activation handled for a sponsor already marked `active`?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose an authenticated sponsor activation endpoint.
- **FR-002**: Sponsor activation MUST validate that the sponsor exists.
- **FR-003**: Sponsor activation MUST change sponsor status to `active`.
- **FR-004**: Sponsor activation MUST create the correct number of courtesy coupons based on the linked quota.
- **FR-005**: Generated coupon codes MUST be unique.
- **FR-006**: Re-activating an already active sponsor MUST NOT create duplicate coupons.
- **FR-007**: Backend sponsor activation and coupon rules MUST be covered by automated tests.

### Key Entities *(include if feature involves data)*

- **Sponsor Activation**: Transition of a sponsor from pending interest to active sponsorship.
- **Coupon**: Single-use courtesy code linked to a sponsor and created at activation time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An authenticated admin can activate a sponsor successfully.
- **SC-002**: Activation creates the expected quantity of coupons.
- **SC-003**: Automated backend tests cover activation and coupon rules.
- **SC-004**: Backend build continues to pass after the feature is added.

## Assumptions

- Coupon redemption UI remains out of scope for this slice.
- Sponsor activation may stay API-first without a dedicated admin UI in this iteration.

