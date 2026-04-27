# Implementation Plan: Admin Management

## Backend

- Add DTOs and service methods for admin user management
- Expose protected endpoints in the auth module
- Enforce superadmin-only access

## Frontend

- Add contracts for admin user management
- Add `/admin/usuarios` screen with create and update flows
- Link the new screen from the dashboard

## Validation

- Backend automated tests
- Backend build
- Frontend build
