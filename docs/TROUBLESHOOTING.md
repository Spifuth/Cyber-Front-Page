# Troubleshooting

- [High CPU Usage](#high-cpu-usage)
- [Blank Page](#blank-page)
- [CI Failures](#ci-failures)
- [Docker Issues](#docker-issues)

## High CPU Usage

CyberMaze animations can increase CPU on low-power devices. Disable the screensaver in the UI or switch browser tabs to trigger
automatic pause. Confirm background tabs reduce animation load before resuming intensive work.

## Blank Page

Ensure mock mode remains enabled (`VITE_USE_MOCK=1`) when operating offline. If using real data, provide JSON fixtures in
`frontend/public/data/*.json` or point environment variables at live APIs.

## CI Failures

JavaScript audits fail only on high or critical issues. Run `npm audit --audit-level=high` locally to reproduce. For Python
issues, execute `pip-audit -r backend/requirements.txt` to identify vulnerable packages.

## Docker Issues

- Verify that `frontend/dist` exists when building with `USE_LOCAL_DIST=1`.
- Confirm `.env` values such as `SITE_NAME` and Traefik routing variables are present.
- After starting the container, validate `curl -fsS http://localhost:8080/health` to ensure Caddy is serving assets.
