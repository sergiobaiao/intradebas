# Implementation Plan: Media Admin Delete And Edit

## Goal

Complete core media administration by enabling deletion and richer metadata editing while cleaning up local stored assets.

## Scope

- Extend media update DTO/service for title editing
- Add delete flow in media service/controller
- Remove local stored object when deleting local media
- Extend admin media page with delete and richer edit controls
- Add backend tests

## Validation

- `cd backend && npm test`
- `cd backend && npm run build`
- `cd frontend && npm run build`
