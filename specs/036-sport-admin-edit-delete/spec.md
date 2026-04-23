# Spec: Sport Admin Edit And Delete

## Goal
- Strengthen admin sport management with full edit and safe delete flows.

## Requirements
- Admin can update sport details from list and detail views.
- Admin can delete a sport only when it has no registrations and no results.
- Backend must reject unsafe deletion with clear errors.
- Frontend admin screens must expose edit/delete controls and reflect changes immediately.
- Add automated backend tests for update/delete success and blocked deletion.
