# Feature Specification: Media And Sponsor Pagination

**Feature Branch**: `034-media-sponsor-pagination`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User request: "prossiga"

## User Stories

### User Story 1 - Paginate and filter media in admin (Priority: P1)

An admin can filter and paginate media items so the media screen remains usable as the catalog grows.

**Independent Test**: Request a filtered media page and verify the API returns only the matching items with pagination metadata.

### User Story 2 - Paginate and filter sponsorship data in admin (Priority: P1)

An admin can filter sponsors and coupons by operational status so the sponsorship screen scales beyond small datasets.

**Independent Test**: Request filtered sponsor and coupon pages and verify the API returns paginated results.

## Requirements

- FR-001: The backend MUST expose paginated media listing for admin use.
- FR-002: Media listing MUST support filtering by provider and featured state.
- FR-003: The backend MUST expose paginated sponsor and coupon listing for admin use.
- FR-004: Sponsor listing MUST support filtering by sponsor status.
- FR-005: Coupon listing MUST support filtering by coupon status and sponsor.
- FR-006: Admin screens for media and sponsorship MUST use the new paginated endpoints.
- FR-007: Automated backend tests MUST cover the new pagination/filter behavior.

## Success Criteria

- SC-001: `/admin/midia` loads paginated and filterable media data.
- SC-002: `/admin/patrocinio` loads paginated and filterable sponsor/coupon data.
- SC-003: Backend automated tests and backend/frontend builds pass after the feature is added.
