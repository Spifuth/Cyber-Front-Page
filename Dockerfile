# ----- build -----
FROM node:20-alpine AS build
WORKDIR /app

COPY .yarnrc.yml ./
COPY frontend/package.json ./
ENV NODE_ENV=production
RUN corepack enable

COPY frontend/ .
RUN if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install; \
    fi
RUN yarn build

# ----- runtime -----
FROM caddy:2.8-alpine AS runtime
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

COPY --from=build /app/dist/ /srv/app/

COPY docker/Caddyfile /etc/caddy/Caddyfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1/health || exit 1
EXPOSE 80
CMD ["caddy","run","--config","/etc/caddy/Caddyfile","--adapter","caddyfile"]
