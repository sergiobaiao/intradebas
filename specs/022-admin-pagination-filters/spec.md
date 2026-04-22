# Feature Specification: Admin Pagination And Filters

**Feature Branch**: `022-admin-pagination-filters`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Review athletes with pagination and filters (Priority: P1)

Admins can page and filter athlete review data so the screen stays responsive as registrations grow.

**Independent Test**: Request paginated athlete review data with filters and verify items plus total metadata.

### User Story 2 - Operate results with pagination and filters (Priority: P1)

Admins can page and filter result listings by team and sport so the results screen remains usable at scale.

**Independent Test**: Request paginated results with filters and verify items plus total metadata.

## Requirements

- FR-001: The athlete review admin endpoint MUST support page, pageSize, status, teamId, and search filters.
- FR-002: The results admin endpoint MUST support page, pageSize, teamId, and sportId filters.
- FR-003: Admin athlete and results pages MUST use the paginated endpoints.
- FR-004: Backend automated tests MUST cover paginated admin list behavior.

## Success Criteria

- SC-001: `/admin/atletas` can filter and page records without loading the entire dataset.
- SC-002: `/admin/resultados` can filter and page records without loading the entire dataset.
- SC-003: Backend tests and both app builds remain green.
