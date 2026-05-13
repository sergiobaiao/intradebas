# Feature Specification: 062-multi-theme-design-system

## Summary
Support multiple UI themes driven by different `DESIGN.md` references, without duplicating pages or components.

## Requirements
### R1
The frontend must support registering multiple named themes from structured design tokens.

### R2
The active theme must be switchable at runtime and persisted for the current browser.

### R3
The public shell and admin shell must expose a visible theme selector.

### R4
The theme system must include at least two real themes:
- the active Zapier-inspired warm theme from `DESIGN.md`
- an INTRADEBAS classic fallback theme

### R5
Core shared UI surfaces must consume theme tokens instead of hardcoded color assumptions where feasible.
