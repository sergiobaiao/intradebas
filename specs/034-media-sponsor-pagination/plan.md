# Implementation Plan: Media And Sponsor Pagination

## Goal

Keep media and sponsorship administration responsive as data volume grows by moving those screens to filtered, paginated APIs.

## Scope

- Add pagination helpers and paginated media/sponsor/coupon list methods
- Add backend tests for those list methods
- Update admin media and sponsorship screens to use filters and paging state

## Validation

- `cd backend && npm test`
- `cd backend && npm run build`
- `cd frontend && npm run build`
