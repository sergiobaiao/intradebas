# Implementation Plan: 063-branding-and-theme-settings

## Design
- Move visible theme controls into the admin settings page.
- Keep theme runtime global through the shared provider.
- Introduce application branding settings for title and logo reference.
- Refactor public/admin shell branding so the visible identity comes from shared configuration instead of fixed literals.

## Technical Notes
- Prefer using existing settings infrastructure where possible.
- If persistence does not exist yet for branding, introduce a minimal backend-backed settings model rather than keeping branding only in client storage.
- Tooltips/helper text should use shared UI primitives where available.

## Validation
- Run frontend build.
- Run relevant backend tests if branding/theme persistence touches API settings.
- Run E2E for admin settings and public/admin shell branding.
