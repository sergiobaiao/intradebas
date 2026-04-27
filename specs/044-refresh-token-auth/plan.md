# Implementation Plan: Refresh Token Auth

## Backend

- Add refresh token persistence migration
- Add login refresh-token issuance and rotation
- Add refresh and logout endpoints

## Frontend

- Store refresh token cookie on login
- Accept refresh-token cookie in admin middleware
- Retry protected reads after a successful refresh

## Validation

- Backend automated tests
- Backend build
- Frontend build
