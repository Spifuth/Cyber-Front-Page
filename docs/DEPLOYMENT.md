# Deployment

- [Docker Image](#docker-image)
- [Runtime Configuration](#runtime-configuration)
- [Traefik Integration](#traefik-integration)
- [Smoke Tests](#smoke-tests)

## Docker Image

The project ships with a multi-stage Dockerfile:

1. **builder** – Node.js 20 installs dependencies and runs `yarn build` unless `USE_LOCAL_DIST=1` is supplied.
2. **runner** – Caddy 2.8 serves the static site from `/srv/app` and exposes `/health` for monitoring.

Build the image locally:

```bash
docker build -t cyber-front-page .
```

Pass `--build-arg USE_LOCAL_DIST=1` when reusing a pre-built `frontend/dist` directory (e.g., from CI artifacts).

For multi-architecture releases, the GitHub Action uses `docker buildx build --platform linux/amd64,linux/arm64` and tags images
with `:sha`, `:branch`, and semantic versions on `v*.*.*` tags.

## Runtime Configuration

The container listens on port `80`. Mount or copy your `.env` file to configure branding, routing, and mock mode. Key values are
described in [CONFIG.md](CONFIG.md).

Example run command:

```bash
docker run -d \
  -p 8080:80 \
  --env-file .env \
  --name cyber-front-page \
  ghcr.io/<owner>/<repo>:latest
```

## Traefik Integration

When deployed behind Traefik v3, reference the labels from `docker/docker-compose.yml`:

- `traefik.http.routers.<service>.rule`
- `traefik.http.routers.<service>.middlewares=<middleware>`
- Security middleware providing CSP, HSTS, and Referrer-Policy headers.

Ensure the shared network `traefik-net` exists before starting the stack, and align `.env` values such as `TRAEFIK_ROUTER_RULE`
and `TRAEFIK_ENTRYPOINT` with your environment.

## Smoke Tests

After deployment, validate the `/health` endpoint:

```bash
curl -fsS http://localhost:8080/health
```

In CI, the Docker job performs the same smoke test after building the image.
