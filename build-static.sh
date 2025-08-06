# =============================================
# BUILD SCRIPT FOR STATIC FILE EXTRACTION
# Use this if you want to mount files directly
# =============================================

#!/bin/bash

# Build and extract static files
echo "🏗️  Building cyberpunk portfolio..."

# Build the Docker image and export build files
docker build -f Dockerfile.static --target export --output type=local,dest=./static-build .

echo "✅ Static files extracted to ./static-build/"
echo "📁 Contents:"
ls -la ./static-build/

echo ""
echo "🚀 To serve with Traefik, mount ./static-build/ in your static file server container"
echo "   Example Traefik docker-compose.yml snippet:"
echo ""
echo "  static-portfolio:"
echo "    image: nginx:alpine"
echo "    volumes:"
echo "      - ./static-build:/usr/share/nginx/html:ro"
echo "    labels:"
echo "      - \"traefik.enable=true\""
echo "      - \"traefik.http.routers.portfolio.rule=Host(\`nebulahost.tech\`)\""
echo "      - \"traefik.http.routers.portfolio.entrypoints=websecure\""
echo "      - \"traefik.http.routers.portfolio.tls.certresolver=letsencrypt\""
echo ""