# Research: Admin Screens Redesign

## Decision: Reuse the feature 051 admin dashboard language as the design baseline

**Rationale**: The dashboard redesign already introduced the approved Studio Admin direction for INTRADEBAS: light admin shell, dense cards, clear tables, rounded panels, real-data panels and responsive behavior. Reusing that visual language prevents another disconnected admin experience.

**Alternatives considered**:

- Rebuild all screens with a new component library: rejected because it expands scope and risks regression.
- Keep old screens unchanged: rejected because the dashboard now exposes a visible quality gap.

## Decision: Prioritize primary list screens before every detail/form screen

**Rationale**: The highest operational traffic is in lists: athletes, teams, modalities, results, sponsorship, media, LGPD, audit and users. These screens define the perceived admin quality and are easier to validate with real data.

**Alternatives considered**:

- Redesign every route in one pass: risky due many forms and edge cases.
- Redesign only forms: lower value because operators first land on list/overview pages.

## Decision: Preserve all contracts and actions

**Rationale**: This feature is visual/UX standardization. Changing backend contracts, validation rules or business behavior would make the slice harder to verify and violate the spec scope.

**Alternatives considered**:

- Add aggregate endpoints for every screen: deferred until performance/data needs justify it.
- Remove low-use links while redesigning: rejected because users need continuity.

## Decision: Add E2E coverage for representative admin screens

**Rationale**: Full visual coverage for every admin route is expensive, but a representative Playwright suite can catch broken routing, missing shell elements and obvious mock-data regressions.

**Alternatives considered**:

- Manual review only: rejected because the project standard requires automated validation.
- Snapshot testing: deferred because current test stack is Playwright flow-based.
