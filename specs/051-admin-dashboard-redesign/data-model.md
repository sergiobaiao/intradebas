# Data Model: Admin Dashboard Redesign

This feature does not add persisted database entities. The following entities are derived UI models built from existing backend responses.

## Admin Navigation Item

Represents one administrative destination in the sidebar.

**Fields**:

- `label`: Human-readable destination name.
- `href`: Existing route path.
- `group`: Functional group such as Operacao, Cadastros, Competicao, Patrocinio, Midia, Governanca or Sistema.
- `status`: Optional visual state for active/current route.

**Validation Rules**:

- `href` must point to an existing admin route.
- Every route currently exposed as a dashboard button must exist as one navigation item.
- Labels must be domain-specific to INTRADEBAS, not copied from the reference dashboard.

## Dashboard Metric

Represents one top-level operational card.

**Fields**:

- `label`: Metric title.
- `value`: Real calculated value or explicit empty indicator.
- `description`: Short explanation of what the metric means.
- `tone`: Visual tone such as neutral, attention, success or warning.
- `source`: Data source used for calculation.

**Validation Rules**:

- Values must be calculated from API responses or shown as unavailable.
- No metric may use arbitrary fixture values.
- Missing data must render an explicit empty state.

## Team Performance Row

Represents one team in the dashboard performance panel.

**Fields**:

- `teamId`: Existing team identifier.
- `name`: Existing team name.
- `color`: Existing team color when available.
- `totalScore`: Existing persisted or ranking-derived score.
- `athletesCount`: Count derived from athlete list when available.

**Validation Rules**:

- Team name and color must come from real team data.
- Scores must come from existing team/ranking data, not local fixture arrays.
- If no teams exist, render an empty performance state.

## Operational Record

Represents one row in the dashboard operational table/list.

**Fields**:

- `id`: Source entity identifier.
- `title`: Primary display text from a real record.
- `category`: Domain context such as athlete, result, sport, sponsor or media.
- `status`: Existing source status where available.
- `description`: Minimal detail safe for admin display.
- `href`: Existing admin route for follow-up action.

**Validation Rules**:

- Records must be derived from real API responses.
- Personally identifiable data should be limited to what admin screens already expose.
- If there are no records, show empty state and direct admin to the relevant management screen.

## Dashboard Empty State

Represents honest fallback content when data is unavailable.

**Fields**:

- `title`: What data is missing.
- `message`: Why the panel is empty or unavailable.
- `actionHref`: Optional route to resolve the empty state.
- `actionLabel`: Optional action label.

**Validation Rules**:

- Empty states must not include sample names, fake totals or fake dates.
- Copy must distinguish between "no records yet" and "unable to load data" when possible.
