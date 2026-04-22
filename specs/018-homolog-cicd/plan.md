# Implementation Plan: Homologation CI/CD Pipeline

**Branch**: `018-homolog-cicd` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)

## Summary

Create a homologation deployment path for an Oracle Cloud VM that already has Docker and an external nginx proxy. The repo will gain a dedicated compose file, a remote deploy script, a GitHub Actions workflow, and setup documentation.

## Technical Context

**Language/Version**: YAML, Bash, Docker Compose, GitHub Actions  
**Primary Dependencies**: Docker, Docker Compose, SSH, GitHub Actions  
**Storage**: Existing PostgreSQL/Redis/MinIO containers managed by Docker Compose  
**Testing**: Backend Jest suite, backend build, frontend build, shell syntax check  
**Project Type**: Full-stack web app with remote VM deployment  
**Performance Goals**: One-command remote deploy script and branch-triggered homologation updates  
**Constraints**: VM already runs an external reverse proxy; no internal nginx or `80/443` binding in this stack  

## Project Structure

### Documentation

```text
specs/018-homolog-cicd/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code

```text
.github/workflows/
docs/
scripts/
docker-compose.homolog.yml
README.md
```

## Implementation Strategy

1. Add a homolog-specific compose file with loopback-only frontend/backend ports and no project nginx.
2. Add a remote deploy script that updates the repo, rebuilds the stack, synchronizes Prisma, and performs a health check.
3. Add a GitHub Actions workflow that validates the repo and triggers the remote deploy script via SSH on pushes to the homolog branch.
4. Document GitHub secrets, VM bootstrap, env file layout, and nginx proxy targets.
