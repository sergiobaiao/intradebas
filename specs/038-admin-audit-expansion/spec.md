# Spec: Admin Audit Expansion

## Goal
- Expand admin audit coverage beyond results to include critical changes in athletes, teams, sports, and sponsors.

## Requirements
- Persist generic audit entries for critical admin mutations.
- Expose an authenticated audit feed endpoint with optional entity filtering.
- Register audit events for athlete, team, sport, and sponsor changes/removals.
- Update the admin audit page to consume the unified feed.
- Add automated tests for audit logging behavior and feed listing.
