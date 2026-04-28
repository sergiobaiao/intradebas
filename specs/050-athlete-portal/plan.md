# Implementation Plan: Athlete Portal

## Backend

- Add `AthletePortalToken` persistence with hashed confirmation/access tokens and expiry.
- Add public endpoints:
  - `POST /api/v1/athletes`
  - `POST /api/v1/athletes/portal/confirm-email`
  - `POST /api/v1/athletes/portal/session`
- Verify Google reCAPTCHA server-side during public registration when `RECAPTCHA_SECRET_KEY` is configured.
- Send registration confirmation links by e-mail after successful registration.
- Reuse existing athlete projections without exposing unrelated athletes.

## Frontend

- Add `/atleta` with confirmation-token and personal-area states.
- Add links from the public home/footer.
- Add frontend contracts for athlete portal access request/session.
- Expose `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` for optional Google reCAPTCHA widget integration.

## Validation

- Backend unit tests for registration confirmation, CAPTCHA failure, and token session.
- Backend build.
- Frontend build.
- Update `INTRADEBAS_2026_Especificacao_Tecnica.md`.
