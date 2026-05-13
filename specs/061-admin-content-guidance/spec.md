# Feature Specification: 061-admin-content-guidance

## Summary
Reorganize the `Patrocinio e midia` area of the admin so the menu is simpler and each page explains clearly what the operator can do there.

## Problems
- The current menu is redundant for content flows, especially `Nova midia`.
- Sponsorship/media pages still use an older layout style and provide little guidance.
- Operators do not get enough contextual help when entering a section.

## Goals
- Simplify the admin navigation for sponsorship and media.
- Remove redundant create actions from the sidebar when the destination page already owns creation.
- Introduce clear explanatory headers for the pages in this section.
- Keep all flows on real data and preserve existing actions.

## Requirements
### R1
The `Patrocinio e midia` navigation group must remove redundant creation entries from the sidebar.

### R2
The media management page must own the create action internally, without requiring a separate `Nova midia` menu item.

### R3
The pages `/admin/patrocinio`, `/admin/backdrop`, `/admin/midia`, and `/admin/midia/nova` must use the modern admin shell/header pattern.

### R4
Each page in this section must render an explanatory header telling the operator what can be done on that screen.

### R5
The redesign must preserve existing sponsor, coupon, backdrop, and media operations.

### R6
Automated coverage must validate the navigation structure and the presence of the new explanatory headers.
