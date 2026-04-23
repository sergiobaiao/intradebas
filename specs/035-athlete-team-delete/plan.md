# Implementation Plan: Athlete And Team Delete

## Goal

Add safe delete flows for athletes and teams, with explicit business-rule guards that prevent history corruption.

## Scope

- Add backend delete methods and controller routes
- Add backend tests for delete success and delete blocking rules
- Add delete controls to admin athlete/team screens

## Validation

- `cd backend && npm test`
- `cd backend && npm run build`
- `cd frontend && npm run build`
