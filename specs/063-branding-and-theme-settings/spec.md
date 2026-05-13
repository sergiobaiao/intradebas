# Feature Specification: 063-branding-and-theme-settings

## Summary
Centralize theme selection and competition branding inside the admin settings area, removing theme controls from navigation shells and making the application identity configurable per competition.

## Problems
- The theme selector is currently exposed directly in the admin shell and public header.
- The selected theme description is visually noisy because it appears inside the selector control instead of as auxiliary help.
- The application still treats `INTRADEBAS` as a fixed product name, but the platform is intended to support multiple competitions.
- There is no settings area for configuring competition title and logo.

## Goals
- Keep theme selection only in `/admin/configuracoes`.
- Show theme description as tooltip/help, not inside the visible button label.
- Apply the selected theme to both the public frontend and the administrative area.
- Allow competition-level branding through configurable application title and logomark.

## Requirements
### R1
The theme selector must be removed from the public header and from the admin shell navigation.

### R2
Theme management must exist only in `/admin/configuracoes`.

### R3
The selected theme must apply globally to both public and administrative interfaces.

### R4
Theme description/help text must be exposed as tooltip or supporting helper content, not rendered inline inside the selector trigger/button label.

### R5
The settings page must include a branding section with:
- configurable application title
- configurable logomark/logo asset reference

### R6
The branding configuration must be designed as competition-level identity, not hardcoded to `INTRADEBAS`.

### R7
The public shell and admin shell must consume the configured title/logo once this branding setting is active.

### R8
Automated coverage must validate:
- absence of theme selector in public/admin shells
- presence of theme controls in `/admin/configuracoes`
- theme persistence across public/admin views
- presence of the branding configuration section
