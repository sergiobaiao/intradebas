# Feature Specification: Prisma-Backed Athletes and Teams

**Feature Branch**: `002-prisma-athletes-teams`  
**Created**: 2026-04-16  
**Status**: Draft  
**Input**: User description: "Proceed with implementation following Spec Kit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persist athlete registrations in PostgreSQL (Priority: P1)

As the organizing committee, we need athlete registrations to survive process restarts and align
with the official event data model so the portal stops behaving like a demo-only runtime.

**Why this priority**: Registration persistence is the first hard boundary between a scaffold and
an operable event system.

**Independent Test**: Create an athlete through `POST /api/v1/athletes`, restart the backend, and
confirm the record can still be retrieved from `GET /api/v1/athletes`.

**Acceptance Scenarios**:

1. **Given** valid teams and sports exist in PostgreSQL, **When** a valid athlete registration is
   posted, **Then** the athlete is stored in the database and linked to the selected team.
2. **Given** a registration includes selected sports, **When** the athlete is created,
   **Then** matching registration records are stored in the database.
3. **Given** a duplicate CPF is submitted, **When** the backend validates the request,
   **Then** the API rejects the request with a conflict response.

---

### User Story 2 - Read public team ranking and team athletes from the database (Priority: P2)

As a public visitor or organizer, we need team listings and athlete/team detail views to come from
the same persisted source of truth as registrations.

**Why this priority**: Public scoreboards and team visibility lose credibility if they are not
derived from the persisted system state.

**Independent Test**: Seed the database, call the team endpoints, and verify that returned counts
and athlete listings match stored records.

**Acceptance Scenarios**:

1. **Given** teams exist in PostgreSQL, **When** `GET /api/v1/teams` is called,
   **Then** the endpoint returns the persisted teams ordered for frontend display.
2. **Given** athletes are linked to a team, **When** `GET /api/v1/teams/:id/athletes` is called,
   **Then** the endpoint returns those athletes from the database.

---

### User Story 3 - Keep the repository aligned with the long-term Prisma architecture (Priority: P3)

As a developer, I need Prisma modules, service wiring, seed commands, and documentation to reflect
the intended architecture so later auth, sponsorship, and scoring work can build on the same base.

**Why this priority**: Without a proper persistence layer in the codebase, subsequent modules will
fork into incompatible implementations.

**Independent Test**: Install dependencies, generate Prisma client, and run backend build
successfully with the database-backed services in place.

**Acceptance Scenarios**:

1. **Given** the repository is cloned, **When** a developer reads the current specs and backend
   structure, **Then** they can identify how NestJS reaches PostgreSQL through Prisma.
2. **Given** Prisma client generation has run, **When** the backend build executes,
   **Then** the application compiles without the in-memory fixtures being required.

### Edge Cases

- What happens when `familiar` or `convidado` references a non-existent titular in the database?
- What happens when one or more provided sport IDs do not exist?
- How is `GET /api/v1/teams/:id` handled when the team exists but has zero athletes?
- How should the system behave if seed data has not yet been applied in a fresh environment?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST replace in-memory athlete persistence with PostgreSQL-backed
  persistence via Prisma.
- **FR-002**: The backend MUST replace in-memory team reads with PostgreSQL-backed reads via Prisma.
- **FR-003**: `POST /api/v1/athletes` MUST create an athlete record and associated
  `registrations` rows for selected sports in one transactional operation.
- **FR-004**: Athlete creation MUST reject duplicate CPF values before committing changes.
- **FR-005**: Athlete creation MUST reject non-existent team IDs and sport IDs.
- **FR-006**: Athlete creation MUST reject `familiar` and `convidado` records without a valid
  titular reference.
- **FR-007**: Athlete creation MUST set status to `pending` for guests and `active` for the other
  athlete types unless a newer spec overrides this rule.
- **FR-008**: Athlete creation MUST record LGPD consent timestamp even in the MVP persistence flow.
- **FR-009**: `GET /api/v1/athletes` and `GET /api/v1/athletes/:id` MUST return team and sport
  information from persisted relations.
- **FR-010**: `PATCH /api/v1/athletes/:id/status` MUST update the persisted athlete status.
- **FR-011**: The backend MUST expose a NestJS Prisma service/module usable by later features.
- **FR-012**: The repository MUST include an executable seed path for the core team/sport/quota
  baseline.

### Key Entities *(include if feature involves data)*

- **Athlete**: Persisted participant record with CPF uniqueness, team relation, status, and LGPD data.
- **Registration**: Persisted relation between athlete and sport for chosen modalities.
- **Team**: Persisted event team record used by public ranking and athlete grouping.
- **Sport**: Persisted modality record validated during athlete creation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Backend build succeeds after replacing in-memory athlete/team services with Prisma-backed implementations.
- **SC-002**: A valid athlete registration produces one athlete row and the expected count of registration rows in the database.
- **SC-003**: Team endpoints return persisted team data without reading from runtime fixture collections.
- **SC-004**: Repository documentation and specs clearly state that athlete/team persistence now uses Prisma/PostgreSQL.

## Assumptions

- PostgreSQL remains the only supported primary persistence engine for this project.
- Seed data will establish the baseline teams and sports required for registration.
- Authentication stays out of scope for this feature and will be handled in a later spec slice.
- Frontend pages can continue to use their existing request shape because the backend contract is preserved.

