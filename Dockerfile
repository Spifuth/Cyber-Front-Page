# =============================================
# SECURE PRODUCTION DOCKERFILE
# Cyberpunk Portfolio - Frontend Only
# =============================================

# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Security: Create non-root user
RUN addgroup -g 1001 -S nodegroup && \
    adduser -S nodeuser -u 1001 -G nodegroup

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/yarn.lock ./

# Install dependencies with security audit
RUN yarn install --frozen-lockfile --production=false && \
    yarn audit --audit-level moderate && \
    rm -rf ~/.npm ~/.yarn/cache

# Copy source code
COPY frontend/ .

# Build the application
RUN yarn build

# Remove development dependencies and sensitive files
RUN rm -rf node_modules src public/data package.json yarn.lock \
           craco.config.js tailwind.config.js postcss.config.js \
           .eslintrc.js .gitignore README.md

# Stage 2: Production Stage
FROM nginx:1.25-alpine AS production

# Security: Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginxgroup && \
    adduser -S nginxuser -u 1001 -G nginxgroup

# Remove default nginx content and configs
RUN rm -rf /usr/share/nginx/html/* \
           /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder --chown=nginxuser:nginxgroup /app/build /usr/share/nginx/html

# Copy secure nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
# Security-hardened nginx configuration
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self';" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Disable server signature
    server_tokens off;

    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security: Block access to sensitive files
    location ~ /\.(git|env|htaccess|htpasswd|log) {
        deny all;
        return 404;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable access logs for static assets
    location ~* \.(css|js|ico|gif|jpe?g|png|svg|woff2?)$ {
        access_log off;
        log_not_found off;
    }

    # Rate limiting (if needed)
    # limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
}
EOF

# Set proper permissions
RUN chown -R nginxuser:nginxgroup /usr/share/nginx/html /var/cache/nginx /var/run && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginxuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]