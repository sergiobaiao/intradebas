# Feature Specification: Public Sponsor Backdrop Gallery

**Feature Branch**: `010-backdrop-public-gallery`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "Proceed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public users can see the active sponsor backdrop (Priority: P1)

As a public visitor, I need to see the sponsors currently supporting the event so the platform
delivers the promised digital exposure.

**Why this priority**: Sponsor activation and coupon flows are already in place; public exposure is the next commercial deliverable.

**Independent Test**: Load the public backdrop page and verify active sponsors are rendered.

**Acceptance Scenarios**:

1. **Given** active sponsors exist, **When** the public backdrop endpoint is queried,
   **Then** it returns active sponsors with company name, quota level, priority, and logo.
2. **Given** no active sponsors exist, **When** the public backdrop page loads,
   **Then** it shows an empty-state message instead of failing.

---

### User Story 2 - Higher-tier sponsors receive higher visual priority (Priority: P2)

As an organizer, I need the backdrop feed ordered by sponsorship priority so Ouro sponsors receive
the strongest exposure.

**Why this priority**: Priority ordering is a core business promise of sponsorship quotas.

**Independent Test**: Verify the service returns sponsors ordered by quota backdrop priority descending.

**Acceptance Scenarios**:

1. **Given** sponsors of multiple quota levels are active, **When** the backdrop feed is loaded,
   **Then** sponsors are ordered by `backdropPriority` descending.
2. **Given** two sponsors share the same priority, **When** the feed is loaded,
   **Then** ordering remains deterministic.

---

### User Story 3 - Backdrop rules are covered by automated tests (Priority: P3)

As a developer, I need automated coverage for backdrop filtering and priority ordering so sponsor
exposure rules remain stable.

**Why this priority**: Commercial ranking logic is simple and high-value to lock down.

**Independent Test**: Run backend tests and confirm active-only ordering is covered.

**Acceptance Scenarios**:

1. **Given** mixed sponsor statuses, **When** backdrop tests run,
   **Then** only active sponsors are returned and sorted correctly.

### Edge Cases

- What happens when an active sponsor has no logo URL yet?
- What happens when all sponsors are pending or inactive?
- What happens when sponsors share the same backdrop priority?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose a public backdrop feed endpoint.
- **FR-002**: The backdrop feed MUST include only sponsors with `active` status.
- **FR-003**: The backdrop feed MUST return sponsors ordered by `backdropPriority` descending.
- **FR-004**: The backdrop feed MUST remain deterministic for sponsors with the same priority.
- **FR-005**: The public frontend MUST expose a backdrop page that consumes the backdrop feed.
- **FR-006**: Automated backend tests MUST cover filtering and ordering behavior.

### Key Entities *(include if feature involves data)*

- **Backdrop Sponsor Item**: Projection of an active sponsor for public digital exposure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Public visitors can load a backdrop page backed by live sponsor data.
- **SC-002**: Only active sponsors appear in the backdrop feed.
- **SC-003**: Higher-priority sponsors appear before lower-priority sponsors.
- **SC-004**: Backend automated tests and backend/frontend builds continue to pass.
