# INTRADEBAS Constitution

## Core Principles

### I. Spec Before Code
Every meaningful delivery MUST start from an explicit spec artifact under `specs/`.
Implementation work without a current `spec.md`, `plan.md`, and `tasks.md` is treated as
exploration only and must not be presented as complete product work.

### II. Contract-First Web Delivery
Public and admin experiences MUST be driven by explicit backend contracts.
For every new capability that crosses frontend/backend boundaries, the API contract,
validation rules, and data ownership MUST be defined before broad UI implementation.

### III. Production-Like Local Environment
The project MUST remain runnable through Docker-first local orchestration with
`frontend`, `backend`, `db`, `redis`, `minio`, and `nginx` represented in the repository.
Shortcuts for local development are allowed, but they must converge back to the specified
containerized architecture rather than replace it.

### IV. Security and LGPD by Default
Personal data handling is a first-class concern. Features that collect, expose, modify,
or delete athlete or sponsor data MUST define validation, masking, authorization, audit,
and LGPD behavior as part of the implementation, not as deferred cleanup.

### V. Incremental MVP Slices
Work MUST be organized into independently testable user stories that produce usable slices
of value. Each slice should be demonstrable on its own and should avoid speculative
architecture when a simpler implementation satisfies the current spec.

## Technical and Delivery Constraints

- Mandatory stack: Next.js, NestJS, Prisma, PostgreSQL, Redis, Docker.
- Design system direction: shadcn/ui and the `next-shadcn-admin-dashboard` template.
- Public UX MUST remain mobile-first and readable on small screens.
- The system MUST preserve the domain model defined in
  `INTRADEBAS_2026_Especificacao_Tecnica.md` unless a newer approved spec supersedes it.
- Backend code MUST expose health checks and stable JSON responses for user-facing flows.

## Workflow and Quality Gates

- Default workflow is `constitution -> spec -> optional clarify -> plan -> tasks -> implement`.
- Each spec MUST declare prioritized user stories with independent test criteria.
- Before merge, changed areas MUST at minimum build successfully in the affected apps.
- When persistence is mocked or in-memory for speed, the active spec MUST state that clearly
  and list the migration path to production persistence.
- Breaking deviations from the current spec or constitution MUST be captured in the matching
  `specs/...` artifacts before implementation continues.

## Governance

This constitution governs repository-level engineering decisions.
Any implementation, review, or plan that conflicts with it is incomplete until the conflict
is resolved through a documented update to the relevant spec artifacts and, if necessary,
this constitution itself.

**Version**: 1.0.0 | **Ratified**: 2026-04-16 | **Last Amended**: 2026-04-16
