# Implementation Plan: Results Bulk Entry

## Goal

Add transactional bulk result creation in the backend and a practical batch-entry workflow in the admin results screen.

## Scope

- Add bulk DTOs and controller/service flow for results
- Add backend tests for bulk result creation
- Extend the admin results screen with batch-entry controls
- Keep existing single-entry and correction flows intact

## Validation

- `cd backend && npm test`
- `cd backend && npm run build`
- `cd frontend && npm run build`
