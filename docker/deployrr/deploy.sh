#!/usr/bin/env bash
#
# deploy-deployrr.sh - Deploy Cyber-Front-Page to Deployrr environment
# Usage: bash deploy-deployrr.sh [--build]
#

set -euo pipefail

# Configuration - Adjust to match your Deployrr setup
DOCKERDIR="${DOCKERDIR:-/home/nl/homelab/docker}"
APPDATA="${DOCKERDIR}/appdata"
TRAEFIK_RULES="${APPDATA}/traefik3/rules/Debian-homelab-Hetzner"
CYBERFRONT_DIR="${APPDATA}/cyberfront"
COMPOSE_FILE="${DOCKERDIR}/docker-compose-Debian-homelab-Hetzner.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo "═══════════════════════════════════════════════════════════════"
echo "         CYBER-FRONT-PAGE DEPLOYRR DEPLOYMENT"
echo "═══════════════════════════════════════════════════════════════"

# Check if running from repo or download
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

if [[ -f "${REPO_DIR}/docker/deployrr/docker-compose-cyberfront.yml" ]]; then
    DEPLOY_DIR="${REPO_DIR}/docker/deployrr"
else
    error "Could not find deployment files. Run from repo directory."
fi

# Step 1: Create appdata directory
log "Creating appdata directory..."
mkdir -p "${CYBERFRONT_DIR}/data"
mkdir -p "${CYBERFRONT_DIR}/repo"

# Step 2: Copy/clone repo for local builds
if [[ "${1:-}" == "--build" ]]; then
    log "Copying repo for local build..."
    rsync -av --exclude='.git' --exclude='node_modules' --exclude='.yarn/cache' \
        "${REPO_DIR}/" "${CYBERFRONT_DIR}/repo/"
fi

# Step 3: Copy Traefik rules
log "Installing Traefik rules..."
if [[ -d "${TRAEFIK_RULES}" ]]; then
    cp "${DEPLOY_DIR}/traefik-rules/app-cyberfront.yml" "${TRAEFIK_RULES}/"
    log "Traefik rules installed to ${TRAEFIK_RULES}/app-cyberfront.yml"
else
    warn "Traefik rules directory not found at ${TRAEFIK_RULES}"
    warn "You may need to manually copy app-cyberfront.yml"
fi

# Step 4: Copy sample data files (optional)
if [[ -d "${REPO_DIR}/frontend/public/data" ]]; then
    log "Copying sample data files..."
    cp -r "${REPO_DIR}/frontend/public/data/"* "${CYBERFRONT_DIR}/data/" 2>/dev/null || true
fi

# Step 5: Deploy method selection
echo ""
echo "Choose deployment method:"
echo "  1) Standalone (docker-compose-cyberfront.yml)"
echo "  2) Add to main Deployrr compose file"
echo ""
read -p "Selection [1]: " DEPLOY_METHOD
DEPLOY_METHOD="${DEPLOY_METHOD:-1}"

case "$DEPLOY_METHOD" in
    1)
        log "Deploying standalone..."
        cd "${DEPLOY_DIR}"
        
        # Check if using local build or ghcr image
        if [[ "${1:-}" == "--build" ]]; then
            # Modify compose to use build
            sed -i 's|image: ghcr.io/spifuth/cyber-front-page:latest|# image: ghcr.io/spifuth/cyber-front-page:latest|' docker-compose-cyberfront.yml
            sed -i 's|# build:|build:|' docker-compose-cyberfront.yml
            sed -i "s|#   context:.*|  context: ${CYBERFRONT_DIR}/repo|" docker-compose-cyberfront.yml
            sed -i 's|#   dockerfile: Dockerfile|  dockerfile: Dockerfile|' docker-compose-cyberfront.yml
            docker compose -f docker-compose-cyberfront.yml build
        fi
        
        docker compose -f docker-compose-cyberfront.yml up -d
        ;;
    2)
        log "Adding to main Deployrr compose..."
        echo ""
        echo "Add the following to ${COMPOSE_FILE}:"
        echo ""
        echo "─────────────────────────────────────────"
        cat "${DEPLOY_DIR}/docker-compose-cyberfront.yml" | grep -A 100 "services:" | head -50
        echo "─────────────────────────────────────────"
        echo ""
        warn "After adding, run: cd ${DOCKERDIR} && docker compose up -d cyberfront"
        ;;
esac

# Step 6: Verify
echo ""
log "Waiting for container to start..."
sleep 5

if docker ps --format '{{.Names}}' | grep -q cyberfront; then
    log "Container is running!"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🎉 DEPLOYMENT COMPLETE!"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "  URL: https://cyber.nebulahost.tech"
    echo "  Health: https://cyber.nebulahost.tech/health"
    echo ""
    echo "  Logs: docker logs -f cyberfront"
    echo "  Status: docker ps | grep cyberfront"
    echo ""
else
    warn "Container may not have started. Check logs:"
    echo "  docker logs cyberfront"
fi
