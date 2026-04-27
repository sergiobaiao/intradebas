# Feature Specification: Password Recovery

## Summary

Implement real administrative password recovery with email delivery and public reset screens.

## Requirements

- The backend must support forgot-password and reset-password flows.
- Reset tokens must be persisted with expiration and single-use semantics.
- Recovery emails must be delivered through configured SMTP.
- The frontend must provide request and reset pages.
- The implementation must include automated backend tests and technical status sync.
