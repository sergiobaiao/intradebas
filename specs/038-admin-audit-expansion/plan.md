# Plan: Admin Audit Expansion

## Scope
- Add generic audit_log persistence model and backend module.
- Wire audit writes into critical admin service mutations.
- Replace result-only audit UI with unified feed and entity filter.

## Risks
- Keep audit writes non-invasive to existing business flows.
- Avoid breaking existing result audit behavior while introducing generic audit coverage.
