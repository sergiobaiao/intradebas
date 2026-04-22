# Implementation Plan: Sponsor Admin Edit

## Goal

Add authenticated sponsor editing in the backend and connect the existing sponsorship admin screen to a real edit workflow without regressing coupon visibility.

## Scope

- Add DTO and service/controller update flow for sponsors
- Add backend tests for sponsor update success and validation failures
- Add edit form and refresh behavior in `/admin/patrocinio`
- Reuse existing sponsorship listing and coupon-loading flows

## Design Decisions

- Keep editing on the existing sponsorship admin screen rather than adding a separate detail route
- Allow direct status changes to `pending`, `active`, or `inactive`
- Reuse quota options from the already loaded sponsor summaries and global quota list
- Refresh sponsor list after save to keep coupon counts and status pills consistent

## Validation

- `cd backend && npm test`
- `cd backend && npm run build`
- `cd frontend && npm run build`
