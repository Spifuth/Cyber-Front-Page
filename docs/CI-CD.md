# CI / CD

- [Workflows](#workflows)
- [CI Pipeline](#ci-pipeline)
- [Release Pipeline](#release-pipeline)
- [Security Checks](#security-checks)

## Workflows

Two GitHub Actions workflows orchestrate verification and release automation:

- `ci.yml` runs on pull requests and pushes to `dev`.
- `release.yml` runs on merges to `main` and semantic version tags (`v*.*.*`).

## CI Pipeline

The CI workflow performs three jobs:

1. **frontend** – installs dependencies via Yarn 4, builds the Vite app, uploads `frontend/dist`, and executes
   `npm audit --audit-level=high` so only high/critical issues fail the job.
2. **backend-audit** – sets up Python 3.11 and runs `pip-audit -r backend/requirements.txt`.
3. **docker-image** – rebuilds the container with BuildKit, loads it locally, and smoke tests `/health` using `curl`.

## Release Pipeline

The release workflow rebuilds the frontend, packages multi-architecture Docker images (`linux/amd64`, `linux/arm64`), and pushes
artifacts to GHCR. Images are tagged with the commit SHA, branch name, and semantic versions (`:X.Y.Z`, `:X.Y`) when applicable.

## Security Checks

- JavaScript dependencies: `npm audit --audit-level=high` in CI.
- Python dependencies: `pip-audit` on backend requirements.
- Docker smoke test ensures the `/health` endpoint responds before publishing artifacts.
