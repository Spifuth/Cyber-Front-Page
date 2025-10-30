# Configuration

- [Environment Files](#environment-files)
- [Core Variables](#core-variables)
- [Branding and Content](#branding-and-content)
- [Traefik and Networking](#traefik-and-networking)

## Environment Files

Copy `.env.example` to `.env` or `.env.local` and adjust values per environment. The frontend consumes variables prefixed with
`VITE_`, while backend settings are read by FastAPI.

## Core Variables

| Variable | Description |
| --- | --- |
| `VITE_USE_MOCK` | Enables offline mode by reading JSON from `frontend/public/data`. |
| `SITE_DOMAIN` | Public domain name used by the site and Traefik routing. |
| `SITE_NAME` | Display name for UI headers and metadata. |
| `SITE_THEME` | Chooses the cyberpunk palette variant. |
| `SITE_TAGLINE` | Short description shown on hero sections. |

## Branding and Content

| Variable | Purpose |
| --- | --- |
| `VITE_PROFILE_*` | Personal profile details such as name, role, and description. |
| `VITE_GITHUB_*` | GitHub profile URL and avatar metadata. |
| `VITE_TOOLS_*` | List of featured tools with names and links. |
| `VITE_CONTACT_*` | Contact URLs (email, LinkedIn, etc.). |

Disable or adjust external links when operating fully offline by pointing them to local resources or placeholders.

## Traefik and Networking

| Variable | Description |
| --- | --- |
| `TRAEFIK_SERVICE_NAME` | Name used for router and service labels. |
| `TRAEFIK_ROUTER_RULE` | Domain rule (e.g., `Host(\`cyber.local\`)`). |
| `TRAEFIK_ENTRYPOINT` | Entrypoint to expose (e.g., `websecure`). |
| `TRAEFIK_MIDDLEWARE_HEADERS` | Middleware applying CSP, HSTS, and security headers. |
| `MONGO_URL` | Connection string for MongoDB when enabling persistence. |
| `DB_NAME` | Database name for the FastAPI backend. |
| `TRUSTED_ORIGINS` | Comma-separated list for CORS configuration. |

Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for guidance on common configuration pitfalls.
