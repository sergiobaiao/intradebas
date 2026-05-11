# Data Model: Admin Screens Redesign

This feature adds no persisted entities. The following are UI models derived from existing pages and API responses.

## Admin Page Shell

Shared structure for an admin route.

**Fields**:

- `title`: Page title.
- `eyebrow`: Domain/category label.
- `description`: Operational summary.
- `primaryAction`: Optional main action link.
- `secondaryActions`: Optional supporting action links.

**Validation Rules**:

- Title and actions must match the existing route purpose.
- No action that exists today may be removed.

## Admin Data View

Table, card grid or list showing real records.

**Fields**:

- `records`: Real records from existing data helpers or admin client calls.
- `columns`: Visible labels/status/actions.
- `emptyState`: Message for no records or failed load.

**Validation Rules**:

- Records must come from existing data sources.
- Empty views must not show fake names, fake dates or fake counts.

## Admin Form Section

Visual grouping of an existing admin form.

**Fields**:

- `legend`: Section title.
- `description`: Optional operational guidance.
- `fields`: Existing fields.
- `actions`: Existing submit/cancel actions.

**Validation Rules**:

- Field names, required state and submission behavior must be preserved.
- Error/success messages must remain visible.

## Admin Empty State

Explicit message for absent/unavailable data.

**Fields**:

- `title`: Missing data context.
- `message`: Explanation.
- `actionHref`: Optional resolution route.
- `actionLabel`: Optional call to action.

**Validation Rules**:

- Must distinguish no records from unavailable backend when the page can detect it.
- Must never include sample records.
