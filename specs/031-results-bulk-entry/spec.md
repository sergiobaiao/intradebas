# Feature Specification: Results Bulk Entry

**Feature Branch**: `031-results-bulk-entry`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Launch multiple results in one operation (Priority: P1)

An admin can submit multiple result rows in a single action from the results screen so event operations do not depend on repetitive one-by-one entry.

**Why this priority**: Result entry is already functional, but still inefficient during live event operation.

**Independent Test**: Submit a batch of result rows and verify all rows are persisted in one successful operation.

**Acceptance Scenarios**:

1. **Given** valid result rows, **When** an authenticated admin submits the batch, **Then** all rows are created successfully.
2. **Given** one invalid row in the batch, **When** submission is attempted, **Then** the batch is rejected without partial persistence.

### User Story 2 - Keep admin visibility after batch launch (Priority: P2)

An admin can launch a batch and immediately see the new results in the same screen.

**Why this priority**: Bulk entry only helps if the UI reflects the new state without manual refresh or losing context.

**Independent Test**: Complete a batch launch and verify the admin results list refreshes with the created entries.

**Acceptance Scenarios**:

1. **Given** a successful batch launch, **When** the request completes, **Then** the results list and confirmation message update in the admin screen.
2. **Given** a failed batch launch, **When** the request returns an error, **Then** the form remains editable and no success message is shown.

## Requirements

### Functional Requirements

- FR-001: The backend MUST expose an authenticated bulk result creation endpoint.
- FR-002: Bulk result creation MUST be transactional and reject partial persistence.
- FR-003: Each bulk row MUST apply the same scoring logic already used by single result creation.
- FR-004: The admin results screen MUST provide a bulk entry workflow.
- FR-005: The admin results screen MUST refresh result visibility after a successful batch launch.
- FR-006: Automated backend tests MUST cover bulk success and transactional failure behavior.

## Success Criteria

- SC-001: Admins can launch multiple results in one request from `/admin/resultados`.
- SC-002: Invalid batches do not create partial records.
- SC-003: Backend automated tests and backend/frontend builds pass after the feature is added.
