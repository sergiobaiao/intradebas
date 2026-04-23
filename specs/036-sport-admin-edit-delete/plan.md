# Plan: Sport Admin Edit And Delete

## Scope
- Extend sports backend with safe delete checks and edit support.
- Connect admin modalities screens to update/delete actions.
- Cover behavior with automated tests and run full validation.

## Risks
- Delete must respect existing registrations/results to avoid data corruption.
- Admin list and detail views must stay consistent after edits.
