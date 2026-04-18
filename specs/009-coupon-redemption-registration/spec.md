# Feature Specification: Coupon Redemption During Registration

**Feature Branch**: `009-coupon-redemption-registration`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "Proceed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest registration can redeem a courtesy coupon (Priority: P1)

As a guest or courtesy participant, I need to enter a valid coupon during registration so my courtesy
access is consumed and linked to my athlete record.

**Why this priority**: Sponsor activation already generates coupons; redemption is the missing half of
the commercial flow.

**Independent Test**: Submit a registration with a valid active coupon and verify the athlete is
created and the coupon becomes used.

**Acceptance Scenarios**:

1. **Given** an active coupon exists, **When** a public registration is submitted with that code,
   **Then** the athlete is created and the coupon is marked as used by that athlete.
2. **Given** a guest registration uses a valid coupon, **When** the registration completes,
   **Then** the athlete status is created as `active`.

---

### User Story 2 - Invalid or reused coupons are rejected (Priority: P2)

As the platform, I need coupon redemption to reject invalid or already used codes so sponsor
benefits cannot be consumed twice.

**Why this priority**: Single-use coupon enforcement is a core business rule.

**Independent Test**: Try registering with an invalid or reused coupon and verify the API rejects it.

**Acceptance Scenarios**:

1. **Given** a coupon code does not exist, **When** registration is submitted with that code,
   **Then** the API returns a clear validation error.
2. **Given** a coupon is already used or inactive, **When** registration is submitted with that code,
   **Then** the API rejects the request and does not create a new athlete.

---

### User Story 3 - Registration UI supports coupon redemption and backend rules stay covered by tests (Priority: P3)

As a participant and as a developer, I need the public registration form to accept a coupon code and
the backend redemption rules to be covered by automated tests.

**Why this priority**: The feature is not complete unless users can reach it from the public form and
regressions are detected automatically.

**Independent Test**: Open the public registration page, confirm the coupon field exists, and run the
backend automated tests successfully.

**Acceptance Scenarios**:

1. **Given** the registration page loads, **When** a user fills out the form,
   **Then** they can optionally provide a courtesy coupon code.
2. **Given** backend tests run, **When** coupon redemption scenarios execute,
   **Then** valid redemption and duplicate protection are covered.

### Edge Cases

- What happens if a coupon code is supplied with extra whitespace or mixed casing?
- What happens if two submissions try to redeem the same coupon concurrently?
- What happens if no coupon is supplied in a normal registration?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Public athlete registration MUST accept an optional coupon code.
- **FR-002**: Coupon redemption MUST validate that the coupon exists and is currently active.
- **FR-003**: Coupon redemption MUST mark the coupon as used and link it to the created athlete.
- **FR-004**: A coupon that is already used or inactive MUST be rejected.
- **FR-005**: Guest registrations with a valid coupon MUST be created with `active` status.
- **FR-006**: Registrations without a coupon MUST continue to work with the existing behavior.
- **FR-007**: The public registration UI MUST expose a coupon field and submit it to the backend.
- **FR-008**: Automated backend tests MUST cover valid redemption and invalid/reused coupon rejection.

### Key Entities *(include if feature involves data)*

- **Coupon Redemption**: Transition of a coupon from `active` to `used` during athlete registration.
- **Athlete Registration**: Public registration payload that may optionally carry a courtesy coupon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A valid courtesy coupon can be redeemed during public athlete registration.
- **SC-002**: Reused or invalid coupons are rejected without creating an athlete.
- **SC-003**: The public registration page exposes coupon entry.
- **SC-004**: Backend automated tests and backend/frontend builds continue to pass.

## Assumptions

- Coupon redemption will be handled atomically inside the athlete registration transaction.
- A courtesy coupon may be supplied by any public registration, but the immediate business gain is for guest/courtesy use.
