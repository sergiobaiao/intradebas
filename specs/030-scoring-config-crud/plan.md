# Implementation Plan: Scoring Config CRUD

## Goal

Complete the scoring configuration admin workflow with creation and deletion of scoring rules, preserving the existing edit flow.

## Scope

- Add DTOs and controller/service methods for create and delete
- Add backend tests for new scoring config mutations
- Extend the admin settings page with a create form and delete action
- Keep listing and point editing intact

## Validation

- `cd backend && npm test`
- `cd backend && npm run build`
- `cd frontend && npm run build`
