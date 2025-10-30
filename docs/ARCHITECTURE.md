# Architecture

- [Stack Overview](#stack-overview)
- [Frontend](#frontend)
- [Backend](#backend)
- [Build and Delivery](#build-and-delivery)
- [Further Reading](#further-reading)

## Stack Overview

```
[Vite + React SPA] --(static assets)--> [Caddy] --(optional routing)--> [Traefik]
           |                                     |
     [Mock data JSON]                    [/health endpoint]
           |
    [FastAPI backend (optional)]
```

The project targets static hosting with optional dynamic capabilities. Mocks keep the experience offline-ready, while the backend
exposes APIs when connected to data sources such as MongoDB.

## Frontend

- Located in `frontend/` with Vite, React, and Tailwind.
- Uses `frontend/src/mocks/mockBackend.js` and `frontend/public/data/*.json` when `VITE_USE_MOCK=1`.
- CyberMaze animations can be paused automatically when the browser tab loses focus.

## Backend

- FastAPI application under `backend/` with default in-memory storage.
- Optional MongoDB integration controlled via `MONGO_URL` and `DB_NAME` environment variables.
- Health checks served at `/health` to support CI smoke tests and platform monitoring.

## Build and Delivery

- Frontend builds to `frontend/dist` and is copied into the Docker runtime stage.
- Caddy serves static files with security headers; Traefik labels define routing and middleware when used.
- GitHub Actions build multi-architecture images and upload artifacts for release automation.

## Further Reading

For a detailed logic catalog and component analysis, consult [LOGIC_AUDIT.md](LOGIC_AUDIT.md).
