# ----- build -----
FROM node:20-alpine AS build
ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG USE_LOCAL_DIST=0
ENV NODE_ENV=production
RUN corepack enable && npm config set registry ${NPM_REGISTRY}
WORKDIR /app
COPY .yarnrc.yml ./
COPY frontend/ ./
RUN if [ "${USE_LOCAL_DIST}" != "1" ]; then \
      if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else yarn install; fi && \
      yarn build; \
    else \
      echo "Skipping frontend build (USE_LOCAL_DIST=${USE_LOCAL_DIST})" && mkdir -p dist; \
    fi

# ----- runtime -----
FROM caddy:2.8-alpine AS runtime
ARG USE_LOCAL_DIST=0
ARG OCI_IMAGE_TITLE="Cyber Front Page"
ARG OCI_IMAGE_DESCRIPTION="Static SPA served by Caddy"
ARG OCI_IMAGE_REVISION=""
ARG OCI_IMAGE_SOURCE=""
WORKDIR /srv/app

LABEL \
  org.opencontainers.image.title="${OCI_IMAGE_TITLE}" \
  org.opencontainers.image.description="${OCI_IMAGE_DESCRIPTION}" \
  org.opencontainers.image.revision="${OCI_IMAGE_REVISION}" \
  org.opencontainers.image.source="${OCI_IMAGE_SOURCE}"

# Copy artefact first when provided by CI (frontend/dist)
COPY frontend/dist/ /srv/app/

# Fallback to build stage output when artefact is absent or empty
COPY --from=build /app/dist/ /srv/app/

COPY docker/Caddyfile /etc/caddy/Caddyfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1/health || exit 1
EXPOSE 80
CMD ["caddy","run","--config","/etc/caddy/Caddyfile","--adapter","caddyfile"]
