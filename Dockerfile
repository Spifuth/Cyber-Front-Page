# Stage 1 - build frontend assets
FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2 - serve with Caddy
FROM caddy:2.8-alpine

ENV NODE_ENV=production \
    SITE_NAME="Cyber Front Page" \
    SITE_THEME="cyber" \
    SITE_DOMAIN="example.com"

WORKDIR /srv/app

COPY --from=build /app/dist/ ./
COPY docker/Caddyfile /etc/caddy/Caddyfile

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1/health || exit 1

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
