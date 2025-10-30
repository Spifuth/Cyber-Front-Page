# Cyber Front Page

Cyber Front Page is a cyberpunk-themed portfolio web app built with Vite + React, served statically by Caddy and optionally backed by FastAPI.

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
![Release](https://github.com/<owner>/<repo>/actions/workflows/release.yml/badge.svg)

## Overview

Cyber Front Page showcases interactive portfolio content with an offline-first experience. The frontend ships as a Vite SPA with
Tailwind styling, while an optional FastAPI backend augments data when mocks are disabled. Assets are designed for static hosting
behind Caddy or Traefik, making the app easy to deploy across environments.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/<owner>/<repo>.git
cd Cyber-Front-Page

# Install dependencies (frontend)
corepack enable
yarn install --immutable

# Build the production bundle
yarn build

# Run the container locally
docker build -t cyber-front-page .
docker run -p 8080:80 cyber-front-page
```

For additional setup scenarios, see [Installation](docs/INSTALLATION.md).

## Features

- Offline-ready mode with mock data (`VITE_USE_MOCK=1`).
- Interactive cyberpunk UI with ambient animations and CyberMaze screensaver.
- Optional FastAPI backend with health checks for observability.
- Docker image with Caddy serving static assets and `/health` endpoint.
- Traefik v3 labels and security headers prepared for edge deployment.
- GitHub Actions CI, release automation, and security audits.

## Architecture

The frontend and backend share a modular structure that separates presentation, data mocks, and API integrations. Static assets
can be delivered directly from the built `frontend/dist` directory, while the backend extends functionality for connected installs.
Explore diagrams and component relationships in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## CI / CD

Automated GitHub Actions pipelines cover linting, builds, dependency audits, Docker packaging, and multi-arch releases.
Review workflow triggers, artifacts, and release tagging in [docs/CI-CD.md](docs/CI-CD.md).

## Configuration

Environment flags control branding, data sources, and integrations. Refer to [docs/CONFIG.md](docs/CONFIG.md) for the full variable list.

## Deployment

Deploy as a Docker container served by Caddy with optional Traefik routing rules. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Docker build flags, Traefik labels, and runtime guidance.

## Troubleshooting

Common fixes include enabling mock mode for offline demos, pausing CyberMaze to reduce CPU usage, and validating `/health` in CI.
More scenarios are documented in [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## License / Credits

Released under the MIT License. Crafted by the Cyber Front Page contributors.

---
📚 **Documentation:** [Installation](docs/INSTALLATION.md) · [Deployment](docs/DEPLOYMENT.md) · [Architecture](docs/ARCHITECTURE.md) · [CI/CD](docs/CI-CD.md)
