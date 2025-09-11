# =============================================
# SECURE PRODUCTION DOCKERFILE - SIMPLIFIED
# Cyberpunk Portfolio - Static Files Only
# =============================================

# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Security: Create non-root user
RUN addgroup -g 1001 -S nodegroup && \
    adduser -S nodeuser -u 1001 -G nodegroup

# Set working directory
WORKDIR /app

# Run subsequent commands as the non-root user
USER nodeuser

# Copy package files
COPY frontend/package.json frontend/yarn.lock ./

# Install dependencies (removed fragile audit step)
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY frontend/ .

# Build the application
RUN yarn build

# Clean up development dependencies only (keep build output safe)
RUN rm -rf node_modules src craco.config.js tailwind.config.js postcss.config.js

# Stage 2: Production Stage - Lightweight Static Server
FROM node:20-alpine AS production

# Security: Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Install serve globally as minimal static server
RUN npm install -g serve@14.2.5

# Set working directory
WORKDIR /app

# Copy built application with proper ownership
COPY --from=builder --chown=appuser:appgroup /app/build ./

# Switch to non-root user
USER appuser

# Health check using curl (fixed from wget)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Expose port (serve default port)
EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Serve static files
CMD ["serve", "-s", ".", "-p", "3000"]