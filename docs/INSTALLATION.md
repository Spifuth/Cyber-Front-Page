# Installation

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Local Development](#local-development)
- [Building Assets](#building-assets)

## Prerequisites

- Node.js 20 with Corepack enabled for Yarn.
- Docker Engine 24+ for container builds and smoke tests.
- Optional: Python 3.11+ for FastAPI backend development.

## Project Setup

```bash
# Clone and enter the repository
git clone https://github.com/<owner>/<repo>.git
cd Cyber-Front-Page

# Enable Corepack (recommended for Yarn 4 projects)
corepack enable

# Install frontend dependencies with immutable lockfile enforcement
yarn install --immutable
```

If `yarn.lock` is missing, CI will generate one automatically using `--mode=update-lockfile` during the first run.

## Local Development

```bash
# Start the Vite dev server
yarn dev
```

The app boots with mock data enabled (`VITE_USE_MOCK=1`) for offline usage. Update `.env.local` to point at a running FastAPI
backend when network connectivity is available.

To work on the backend, create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

## Building Assets

```bash
# Production build of the frontend
yarn build

# Preview the static bundle locally
yarn preview
```

Bundle outputs are stored in `frontend/dist`. The Docker workflow consumes this directory when building runtime images. For
container testing, follow the commands in [Deployment](DEPLOYMENT.md).
