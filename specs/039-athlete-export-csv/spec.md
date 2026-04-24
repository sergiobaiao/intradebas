# Spec: Athlete Export CSV

## Goal
- Allow admins to export athlete data as CSV from the admin area.

## Requirements
- Provide an authenticated backend CSV export endpoint for athletes.
- Include core athlete fields, team, status, type, shirt size, and registered sports.
- Expose an export action in `/admin/atletas`.
- Add automated backend tests for CSV generation behavior.
