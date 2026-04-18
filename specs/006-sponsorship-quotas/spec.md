# Feature Specification: Sponsorship Quotas and Interest Registration

**Feature Branch**: `006-sponsorship-quotas`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "Proceed and then implement the next feature"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public visitors can see sponsorship quota availability (Priority: P1)

As a potential sponsor, I need to see which sponsorship quotas exist and how many slots remain so I
can decide whether to register interest.

**Why this priority**: Public visibility of quota availability is the first useful sponsorship slice.

**Independent Test**: Open the public sponsorship page and confirm quota cards are populated from
the backend contract with remaining slot information.

**Acceptance Scenarios**:

1. **Given** sponsorship quotas exist in the database, **When** `GET /api/v1/sponsorship/quotas`
   is called, **Then** each quota includes level, price, max slots, used slots, and remaining slots.
2. **Given** sponsors already occupy slots for a quota, **When** the quota list is returned,
   **Then** the remaining capacity reflects the active/pending records.

---

### User Story 2 - A sponsor can register interest in a quota (Priority: P2)

As a sponsor, I need to submit my company and contact information against an available quota so the
organizing committee can follow up and activate the sponsorship later.

**Why this priority**: Without interest registration, the quota listing is informational only.

**Independent Test**: Submit a valid sponsorship interest payload and verify the backend persists
the sponsor record.

**Acceptance Scenarios**:

1. **Given** a quota has slots available, **When** a sponsor submits valid interest data,
   **Then** a sponsor record is created with `pending` status.
2. **Given** a quota has no remaining slots, **When** interest is submitted,
   **Then** the backend rejects the request with a clear error.

---

### User Story 3 - Sponsorship backend rules are covered by automated tests (Priority: P3)

As a developer, I need automated tests for quota availability and sponsor creation rules so future
changes do not break this commercial flow silently.

**Why this priority**: The user asked that new work always includes automated tests.

**Independent Test**: Run backend tests and verify sponsorship service rules are covered.

**Acceptance Scenarios**:

1. **Given** mocked quota and sponsor data, **When** sponsorship service tests run,
   **Then** they validate normal and full-capacity cases.

### Edge Cases

- What happens when a quota ID does not exist?
- How is interest handled when `used_slots` cache differs from actual sponsor count?
- What happens if the same email submits interest multiple times?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose `GET /api/v1/sponsorship/quotas`.
- **FR-002**: The backend MUST expose `POST /api/v1/sponsors`.
- **FR-003**: Quota listing MUST include computed remaining slots.
- **FR-004**: Sponsor interest creation MUST validate quota existence.
- **FR-005**: Sponsor interest creation MUST reject full quotas.
- **FR-006**: The frontend MUST expose a public sponsorship page that renders quota cards from the backend.
- **FR-007**: The sponsorship page MUST allow submitting sponsor interest for a selected quota.
- **FR-008**: Backend sponsorship rules MUST be covered by automated tests.

### Key Entities *(include if feature involves data)*

- **Sponsorship Quota**: Quota definition with level, price, capacity, and benefits.
- **Sponsor Interest**: Pending sponsor record tied to a quota and awaiting manual activation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Public quota list renders from the backend contract.
- **SC-002**: Valid sponsor interest submissions persist successfully.
- **SC-003**: Full quotas reject new sponsor interest submissions.
- **SC-004**: Automated backend sponsorship tests pass.

## Assumptions

- Sponsor interest remains `pending` until a later admin flow activates it.
- Duplicate-interest handling can remain permissive for now unless it violates quota limits.

