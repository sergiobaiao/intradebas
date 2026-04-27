# Implementation Plan: Live Ranking SSE Stream

## Backend

- Add SSE ranking stream based on the existing ranking calculation
- Keep the stream payload compatible with the public ranking page

## Frontend

- Convert the public results page to hydrate from initial ranking and subscribe via EventSource
- Surface connection status in the live score UI

## Validation

- Backend automated tests
- Backend build
- Frontend build
