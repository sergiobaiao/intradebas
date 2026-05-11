# Research: Admin Dashboard Redesign

## Decision: Use the approved reference as structural inspiration only

**Rationale**: The user explicitly compared the current `/admin/dashboard` against `next-shadcn-admin-dashboard` and requested alignment with that standard. The useful parts are layout structure and interaction density: sidebar, topbar, metric cards, analytic panel and table/list. Copying reference labels, customer data or business metrics would violate the project requirement of no mock data.

**Alternatives considered**:

- Copy the reference layout literally: rejected because it would introduce irrelevant CRM/customer concepts and fictitious data.
- Keep the existing INTRADEBAS visual language only: rejected because the current result does not meet the approved admin dashboard standard.

## Decision: Keep the feature frontend-only unless a real data gap blocks the dashboard

**Rationale**: Existing frontend helpers already expose teams, athletes, results, sports, sponsorship quotas, media and other admin-facing data. The dashboard can calculate useful operational metrics from those contracts. Avoiding new backend endpoints keeps this slice small and independently testable.

**Alternatives considered**:

- Create a dedicated `/admin/dashboard/summary` backend endpoint: deferred because it is not necessary for the first redesign and would expand scope.
- Hardcode aggregate numbers: rejected because the user explicitly rejected mock data.

## Decision: Render explicit empty/error states instead of placeholder values

**Rationale**: The dashboard must be honest. If the backend returns an empty list or a request fails, the UI should say that data is unavailable or absent, not show `1,234`, fake names or chart-like noise.

**Alternatives considered**:

- Show skeletons indefinitely: rejected because it can hide data failures.
- Use demo values for visual polish: rejected by the no-mock-data requirement.

## Decision: Scope the visual redesign to `/admin/dashboard`

**Rationale**: The current spec requests setting this as the next feature based on the screenshot comparison. The measurable pain is the main admin dashboard. Redesigning every admin subpage would be larger, riskier and harder to validate as a single MVP slice.

**Alternatives considered**:

- Redesign all admin pages in one feature: rejected due scope creep.
- Create only shared layout components without improving the dashboard content: rejected because the user needs to see a materially improved screen.

## Decision: Use Playwright for automated dashboard validation

**Rationale**: The frontend already uses Playwright E2E tests. A dashboard test can validate that the route renders core navigation, metric headings and absence of reference/mock strings.

**Alternatives considered**:

- Add only unit tests: rejected because this is primarily an integrated UI route.
- Manual visual review only: rejected because the project standard requires automated tests.
