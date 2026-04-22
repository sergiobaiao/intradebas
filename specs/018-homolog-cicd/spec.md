# Feature Specification: Homologation CI/CD Pipeline

**Feature Branch**: `018-homolog-cicd`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User request: "possuo uma vm na oracle cloud. é possivel criarmos uma esteira de ci/cd..."

## User Stories

### User Story 1 - Deploy homologation automatically after push (Priority: P1)

As the project owner, I want pushes to a dedicated homologation branch to deploy automatically to the Oracle Cloud VM so we can validate the system in a real environment.

**Why this priority**: This unlocks real homologation without manual shell work on every update.

**Independent Test**: Push to the homologation branch and verify the GitHub Actions workflow reaches the remote VM and runs the deploy script successfully.

**Acceptance Scenarios**:

1. **Given** a push to the homologation branch, **When** the workflow runs, **Then** it validates the repo and executes the remote deploy script over SSH.
2. **Given** the remote deploy script completes, **When** the application health check is executed, **Then** the backend health endpoint responds successfully.

---

### User Story 2 - Support a VM that already has an external nginx proxy (Priority: P2)

As the project owner, I want the homologation deployment to avoid binding ports `80/443` and avoid a second nginx layer because the VM already has a reverse proxy in place.

**Why this priority**: The existing VM topology would conflict with the current production compose file.

**Independent Test**: Start the homologation compose stack and verify frontend/backend publish only configurable internal loopback ports while the stack excludes the project nginx service.

**Acceptance Scenarios**:

1. **Given** the homologation compose file, **When** the stack starts, **Then** it runs without the project nginx service.
2. **Given** the VM proxy configuration, **When** it forwards to the configured loopback ports, **Then** the app remains reachable without exposing `80/443` from this stack.

## Requirements

### Functional Requirements

- FR-001: The repository MUST include a GitHub Actions workflow for homologation deployment.
- FR-002: The workflow MUST run automated validation before remote deployment.
- FR-003: The workflow MUST connect to the VM over SSH using GitHub secrets.
- FR-004: The repository MUST include a remote deploy script that performs git update, compose build/up, Prisma schema sync, and health check.
- FR-005: The repository MUST include a compose file dedicated to homologation on a VM with an external proxy already in place.
- FR-006: The repository MUST document the required GitHub secrets, VM layout, env file, and proxy target ports.

### Key Entities

- Homologation Workflow: GitHub Actions pipeline that validates and deploys the application.
- Remote Deploy Script: Shell script executed on the VM to update code and restart services.
- Homologation Compose Stack: Docker Compose definition that runs the app behind an existing reverse proxy.

## Success Criteria

- SC-001: A push to the homologation branch is sufficient to trigger remote deployment.
- SC-002: The homologation stack does not bind ports `80/443` and does not depend on the repository nginx service.
- SC-003: The deployment flow remains reproducible from repository files and documented secrets.
