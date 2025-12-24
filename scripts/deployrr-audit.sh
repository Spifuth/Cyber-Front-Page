#!/usr/bin/env bash
#
# deployrr-audit.sh - Analyse l'environnement Deployrr pour adapter Cyber-Front-Page
# Usage: bash deployrr-audit.sh > deployrr-report.txt
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}► $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}\n"
}

subheader() {
    echo -e "\n${YELLOW}▸ $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Start report
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           DEPLOYRR ENVIRONMENT AUDIT REPORT                      ║"
echo "║           Generated: $(date '+%Y-%m-%d %H:%M:%S')                        ║"
echo "║           Hostname: $(hostname)                                         ║"
echo "╚══════════════════════════════════════════════════════════════════╝"

########################################
# 1. SYSTEM INFO
########################################
header "1. SYSTEM INFORMATION"

subheader "Docker Version"
docker --version 2>/dev/null || echo "Docker not found"
docker compose version 2>/dev/null || docker-compose --version 2>/dev/null || echo "Docker Compose not found"

subheader "OS Info"
cat /etc/os-release 2>/dev/null | grep -E "^(NAME|VERSION)=" || uname -a

subheader "User & Groups"
echo "Current user: $(whoami)"
echo "Docker group: $(groups | grep -o docker || echo 'Not in docker group')"
id

########################################
# 2. DEPLOYRR STRUCTURE
########################################
header "2. DEPLOYRR DIRECTORY STRUCTURE"

# Common Deployrr paths
DOCKERDIR="${DOCKERDIR:-$HOME/docker}"
APPDATA="${DOCKERDIR}/appdata"

subheader "Environment Variables"
echo "DOCKERDIR=${DOCKERDIR}"
echo "PUID=${PUID:-$(id -u)}"
echo "PGID=${PGID:-$(id -g)}"
echo "TZ=${TZ:-$(cat /etc/timezone 2>/dev/null || echo 'UTC')}"
echo "HOSTNAME=${HOSTNAME:-$(hostname)}"
echo "DOMAINNAME=${DOMAINNAME:-not set}"

# Check for .env files
subheader "Found .env files"
for envfile in "$DOCKERDIR/.env" "$HOME/.env" "/opt/docker/.env" "$DOCKERDIR/compose/.env"; do
    if [[ -f "$envfile" ]]; then
        echo "Found: $envfile"
        echo "--- Contents (secrets masked) ---"
        sed -E 's/(PASSWORD|SECRET|KEY|TOKEN)=.*/\1=***MASKED***/gi' "$envfile" 2>/dev/null | head -50
        echo "--- End ---"
    fi
done

subheader "Docker directory tree (depth 2)"
if [[ -d "$DOCKERDIR" ]]; then
    tree -L 2 -d "$DOCKERDIR" 2>/dev/null || find "$DOCKERDIR" -maxdepth 2 -type d 2>/dev/null | head -50
else
    echo "DOCKERDIR not found at $DOCKERDIR"
    echo "Searching for docker directories..."
    find /home -maxdepth 3 -type d -name "docker" 2>/dev/null | head -5
    find /opt -maxdepth 2 -type d -name "docker" 2>/dev/null | head -5
fi

########################################
# 3. DOCKER NETWORKS
########################################
header "3. DOCKER NETWORKS"

subheader "All networks"
docker network ls --format "table {{.Name}}\t{{.Driver}}\t{{.Scope}}"

subheader "Network details (proxy/traefik networks)"
for net in $(docker network ls --format '{{.Name}}' | grep -iE 'proxy|traefik|web|frontend'); do
    echo -e "\n--- Network: $net ---"
    docker network inspect "$net" --format '{{json .}}' 2>/dev/null | python3 -m json.tool 2>/dev/null || docker network inspect "$net" 2>/dev/null | head -30
done

########################################
# 4. TRAEFIK CONFIGURATION
########################################
header "4. TRAEFIK CONFIGURATION"

subheader "Traefik container info"
TRAEFIK_CONTAINER=$(docker ps --filter "name=traefik" --format '{{.Names}}' | head -1)
if [[ -n "$TRAEFIK_CONTAINER" ]]; then
    echo "Container: $TRAEFIK_CONTAINER"
    docker inspect "$TRAEFIK_CONTAINER" --format '
Image: {{.Config.Image}}
Ports: {{range $p, $conf := .NetworkSettings.Ports}}{{$p}} -> {{(index $conf 0).HostPort}} {{end}}
Networks: {{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}
Labels: {{range $k, $v := .Config.Labels}}
  {{$k}}: {{$v}}{{end}}
'
else
    echo "Traefik container not found"
fi

subheader "Traefik config files"
TRAEFIK_DIR=""
for dir in "$APPDATA/traefik3" "$APPDATA/traefik" "$DOCKERDIR/traefik" "/opt/traefik"; do
    if [[ -d "$dir" ]]; then
        TRAEFIK_DIR="$dir"
        echo -e "\n--- Found: $dir ---"
        ls -laR "$dir" 2>/dev/null | head -100
        
        # Show traefik.yml or traefik.toml (FULL)
        for cfg in "$dir/traefik.yml" "$dir/traefik.yaml" "$dir/traefik.toml"; do
            if [[ -f "$cfg" ]]; then
                echo -e "\n########## $cfg (FULL) ##########"
                cat "$cfg" 2>/dev/null
                echo -e "########## END $cfg ##########\n"
            fi
        done
        break
    fi
done

subheader "Traefik entrypoints from running config"
if [[ -n "$TRAEFIK_CONTAINER" ]]; then
    docker exec "$TRAEFIK_CONTAINER" cat /etc/traefik/traefik.yml 2>/dev/null || echo "Could not read traefik config from container"
fi

########################################
# 4B. TRAEFIK RULES (ALL FILES)
########################################
header "4B. TRAEFIK RULES - COMPLETE DUMP"

# Find all rules directories
for rules_dir in "$TRAEFIK_DIR/rules" "$TRAEFIK_DIR/rules/$HOSTNAME" "$APPDATA/traefik3/rules" "$APPDATA/traefik3/rules/$HOSTNAME" "$APPDATA/traefik/rules"; do
    if [[ -d "$rules_dir" ]]; then
        echo -e "\n${YELLOW}══════ Rules directory: $rules_dir ══════${NC}"
        ls -la "$rules_dir" 2>/dev/null
        
        # Dump ALL rule files
        find "$rules_dir" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "*.toml" \) 2>/dev/null | while read rulefile; do
            echo -e "\n########## $rulefile ##########"
            cat "$rulefile" 2>/dev/null
            echo -e "########## END $(basename "$rulefile") ##########"
        done
    fi
done

########################################
# 4C. TRAEFIK MIDDLEWARES
########################################
header "4C. TRAEFIK MIDDLEWARES"

subheader "Middleware files"
for mw_dir in "$TRAEFIK_DIR/middlewares" "$TRAEFIK_DIR/dynamic" "$TRAEFIK_DIR/conf.d"; do
    if [[ -d "$mw_dir" ]]; then
        echo -e "\n--- Middleware dir: $mw_dir ---"
        find "$mw_dir" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "*.toml" \) 2>/dev/null | while read mwfile; do
            echo -e "\n########## $mwfile ##########"
            cat "$mwfile" 2>/dev/null
            echo -e "########## END $(basename "$mwfile") ##########"
        done
    fi
done

subheader "Middlewares defined in rules"
if [[ -n "$TRAEFIK_DIR" ]]; then
    echo "Searching for middleware definitions..."
    grep -rh "middlewares:" "$TRAEFIK_DIR" 2>/dev/null | sort -u | head -30
    echo ""
    echo "Middleware chains found:"
    grep -rh "@file" "$TRAEFIK_DIR" 2>/dev/null | sort -u | head -30
fi

########################################
# 4D. TRAEFIK CERTIFICATES & TLS
########################################
header "4D. TRAEFIK TLS CONFIGURATION"

subheader "TLS options and cert stores"
for tls_file in "$TRAEFIK_DIR/tls.yml" "$TRAEFIK_DIR/certificates.yml" "$TRAEFIK_DIR/certs.yml"; do
    if [[ -f "$tls_file" ]]; then
        echo -e "\n########## $tls_file ##########"
        cat "$tls_file" 2>/dev/null
        echo -e "########## END $(basename "$tls_file") ##########"
    fi
done

subheader "ACME configuration"
for acme in "$TRAEFIK_DIR/acme" "$TRAEFIK_DIR/acme.json" "$TRAEFIK_DIR/letsencrypt"; do
    if [[ -e "$acme" ]]; then
        echo "Found: $acme"
        if [[ -f "$acme" ]]; then
            # Don't dump full acme.json (contains private keys), just show structure
            echo "File size: $(ls -lh "$acme" | awk '{print $5}')"
            echo "Certificates registered for domains:"
            python3 -c "import json; d=json.load(open('$acme')); print('\n'.join([c.get('domain',{}).get('main','?') for r in d.values() if isinstance(r,dict) for c in r.get('Certificates',[])]))" 2>/dev/null || echo "(Could not parse)"
        fi
    fi
done

########################################
# 5. DOCKER COMPOSE FILES (FULL DUMP)
########################################
header "5. DOCKER COMPOSE FILES"

subheader "Compose files found"
COMPOSE_FILES=$(find "$DOCKERDIR" -maxdepth 4 \( -name "docker-compose*.yml" -o -name "docker-compose*.yaml" -o -name "compose*.yml" -o -name "compose*.yaml" \) 2>/dev/null)
echo "$COMPOSE_FILES"

subheader "Main compose file (deployrr master)"
# Look for the main deployrr compose
for main_compose in "$DOCKERDIR/docker-compose.yml" "$DOCKERDIR/compose/docker-compose.yml" "$DOCKERDIR/docker-compose-deployrr.yml"; do
    if [[ -f "$main_compose" ]]; then
        echo -e "\n########## $main_compose (FULL) ##########"
        cat "$main_compose" 2>/dev/null
        echo -e "########## END $(basename "$main_compose") ##########"
        break
    fi
done

subheader "All compose files content"
echo "$COMPOSE_FILES" | while read compose_file; do
    if [[ -f "$compose_file" ]]; then
        echo -e "\n########## $compose_file ##########"
        cat "$compose_file" 2>/dev/null
        echo -e "########## END $(basename "$compose_file") ##########"
    fi
done

########################################
# 5B. DEPLOYRR-SPECIFIC FILES
########################################
header "5B. DEPLOYRR-SPECIFIC CONFIGURATION"

subheader "Deployrr secrets/shared"
for secrets_dir in "$DOCKERDIR/secrets" "$DOCKERDIR/shared" "$DOCKERDIR/scripts"; do
    if [[ -d "$secrets_dir" ]]; then
        echo -e "\n--- Directory: $secrets_dir ---"
        ls -la "$secrets_dir" 2>/dev/null
        # Show non-sensitive files
        find "$secrets_dir" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "*.sh" -o -name "*.conf" \) 2>/dev/null | while read f; do
            if [[ ! "$f" =~ (password|secret|key|token) ]]; then
                echo -e "\n########## $f ##########"
                cat "$f" 2>/dev/null | head -100
            fi
        done
    fi
done

subheader "Custom templates/includes"
for tpl_dir in "$DOCKERDIR/templates" "$DOCKERDIR/include" "$DOCKERDIR/common"; do
    if [[ -d "$tpl_dir" ]]; then
        echo -e "\n--- Templates: $tpl_dir ---"
        find "$tpl_dir" -type f 2>/dev/null | while read f; do
            echo -e "\n########## $f ##########"
            cat "$f" 2>/dev/null
            echo -e "########## END $(basename "$f") ##########"
        done
    fi
done

########################################
# 6. RUNNING CONTAINERS ANALYSIS
########################################
header "6. RUNNING CONTAINERS ANALYSIS"

subheader "All running containers"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"

subheader "Container labels (Traefik-enabled apps)"
for container in $(docker ps --format '{{.Names}}'); do
    LABELS=$(docker inspect "$container" --format '{{range $k, $v := .Config.Labels}}{{if contains $k "traefik"}}{{$k}}={{$v}}|{{end}}{{end}}' 2>/dev/null)
    if [[ -n "$LABELS" ]]; then
        echo -e "\n--- $container ---"
        echo "$LABELS" | tr '|' '\n' | grep -v '^$'
    fi
done

subheader "Sample web app inspection"
# Find a web app similar to what we want to deploy
for pattern in "nginx" "caddy" "apache" "web" "frontend" "static"; do
    SAMPLE_APP=$(docker ps --format '{{.Names}}' | grep -i "$pattern" | head -1)
    if [[ -n "$SAMPLE_APP" ]]; then
        echo -e "\n--- Inspecting: $SAMPLE_APP ---"
        docker inspect "$SAMPLE_APP" --format '
Image: {{.Config.Image}}
WorkingDir: {{.Config.WorkingDir}}
Entrypoint: {{.Config.Entrypoint}}
Cmd: {{.Config.Cmd}}
Env: {{range .Config.Env}}
  {{.}}{{end}}
Volumes: {{range $k, $v := .Config.Volumes}}
  {{$k}}{{end}}
Mounts: {{range .Mounts}}
  {{.Source}} -> {{.Destination}} ({{.Type}}){{end}}
Networks: {{range $k, $v := .NetworkSettings.Networks}}
  {{$k}}: {{$v.IPAddress}}{{end}}
Labels (Traefik): {{range $k, $v := .Config.Labels}}{{if contains $k "traefik"}}
  {{$k}}: {{$v}}{{end}}{{end}}
'
        break
    fi
done

########################################
# 7. CERT RESOLVERS & TLS
########################################
header "7. TLS / CERTIFICATES CONFIGURATION"

subheader "ACME / Let's Encrypt config"
for acme in "$APPDATA/traefik/acme" "$APPDATA/traefik3/acme" "$APPDATA/traefik/letsencrypt"; do
    if [[ -d "$acme" ]]; then
        echo "Found ACME dir: $acme"
        ls -la "$acme" 2>/dev/null
    fi
done

subheader "Cert resolvers from Traefik labels"
docker ps --format '{{.Names}}' | while read container; do
    RESOLVER=$(docker inspect "$container" --format '{{index .Config.Labels "traefik.http.routers.'"$container"'.tls.certresolver"}}' 2>/dev/null)
    if [[ -n "$RESOLVER" && "$RESOLVER" != "<no value>" ]]; then
        echo "$container: certresolver=$RESOLVER"
    fi
done | sort -u | head -20

########################################
# 8. HEALTHCHECK PATTERNS
########################################
header "8. HEALTHCHECK PATTERNS"

subheader "Healthchecks from running containers"
docker ps --format '{{.Names}}' | while read container; do
    HC=$(docker inspect "$container" --format '{{if .Config.Healthcheck}}{{.Config.Healthcheck.Test}}{{end}}' 2>/dev/null)
    if [[ -n "$HC" && "$HC" != "[]" ]]; then
        echo "$container: $HC"
    fi
done | head -20

########################################
# 9. VOLUMES & STORAGE
########################################
header "9. VOLUMES & STORAGE"

subheader "Named volumes"
docker volume ls --format "table {{.Name}}\t{{.Driver}}"

subheader "Bind mount patterns"
docker ps --format '{{.Names}}' | while read container; do
    echo -e "\n--- $container ---"
    docker inspect "$container" --format '{{range .Mounts}}{{.Type}}: {{.Source}} -> {{.Destination}}
{{end}}' 2>/dev/null
done | head -50

########################################
# 10. RECOMMENDATIONS & FILE GENERATION CONTEXT
########################################
header "10. SUMMARY FOR CYBER-FRONT-PAGE"

echo "Based on this audit, here's what we found:"
echo ""

# Network recommendation
PROXY_NET=$(docker network ls --format '{{.Name}}' | grep -iE '^proxy$|^traefik|^web$' | head -1)
echo "• Recommended network: ${PROXY_NET:-'proxy (create it)'}"

# Cert resolver
echo "• Cert resolver: Check Traefik labels above for certresolver name"

# Domain pattern
echo "• Domain pattern: Check DOMAINNAME env var and Traefik rules"

# Labels pattern
echo "• Traefik labels: See sample apps above for correct label format"

echo ""
echo "═══════════════════════════════════════════════════════════════"

########################################
# 11. ENVIRONMENT VARIABLES DUMP
########################################
header "11. ALL ENVIRONMENT VARIABLES (Docker-related)"

subheader "Current shell env (filtered)"
env | grep -iE "docker|traefik|domain|puid|pgid|tz|host|proxy|acme|cert|network" | sort

subheader "Compose .env interpolation test"
if [[ -f "$DOCKERDIR/.env" ]]; then
    echo "Variables that would be interpolated:"
    grep -E '^\$\{?[A-Z_]+\}?' "$DOCKERDIR/.env" 2>/dev/null | head -30
fi

########################################
# 12. NETWORK INSPECTION (DETAILED)
########################################
header "12. DETAILED NETWORK CONFIGURATION"

subheader "Full network inspect for proxy network"
if [[ -n "$PROXY_NET" ]]; then
    docker network inspect "$PROXY_NET" 2>/dev/null
fi

subheader "Socket proxy (if exists)"
SOCKET_PROXY=$(docker ps --filter "name=socket" --format '{{.Names}}' | head -1)
if [[ -n "$SOCKET_PROXY" ]]; then
    echo "Socket proxy container: $SOCKET_PROXY"
    docker inspect "$SOCKET_PROXY" --format '
Networks: {{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}
Env: {{range .Config.Env}}{{.}}
{{end}}'
fi

########################################
# 13. CADDY/NGINX CONFIGS (if present)
########################################
header "13. WEB SERVER CONFIGURATIONS"

subheader "Caddyfile examples"
find "$DOCKERDIR" -name "Caddyfile*" -o -name "*.caddy" 2>/dev/null | while read f; do
    echo -e "\n########## $f ##########"
    cat "$f" 2>/dev/null
    echo -e "########## END $(basename "$f") ##########"
done

subheader "Nginx configs"
find "$DOCKERDIR" -name "nginx*.conf" -o -name "default.conf" 2>/dev/null | while read f; do
    echo -e "\n########## $f ##########"
    cat "$f" 2>/dev/null
    echo -e "########## END $(basename "$f") ##########"
done

########################################
# 14. LABELS PATTERN ANALYSIS
########################################
header "14. TRAEFIK LABELS PATTERN ANALYSIS"

subheader "All unique label keys used"
docker ps --format '{{.Names}}' | while read container; do
    docker inspect "$container" --format '{{range $k, $v := .Config.Labels}}{{$k}}
{{end}}' 2>/dev/null
done | grep traefik | sort -u

subheader "Router patterns"
docker ps --format '{{.Names}}' | while read container; do
    docker inspect "$container" --format '{{range $k, $v := .Config.Labels}}{{if contains $k "traefik.http.routers"}}{{$k}}={{$v}}
{{end}}{{end}}' 2>/dev/null
done | sort -u | head -50

subheader "Service patterns"
docker ps --format '{{.Names}}' | while read container; do
    docker inspect "$container" --format '{{range $k, $v := .Config.Labels}}{{if contains $k "traefik.http.services"}}{{$k}}={{$v}}
{{end}}{{end}}' 2>/dev/null
done | sort -u | head -50

subheader "Middleware usage patterns"
docker ps --format '{{.Names}}' | while read container; do
    docker inspect "$container" --format '{{range $k, $v := .Config.Labels}}{{if contains $k "middlewares"}}{{$k}}={{$v}}
{{end}}{{end}}' 2>/dev/null
done | sort -u | head -30

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "                    END OF REPORT"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "FILES TO GENERATE FOR CYBER-FRONT-PAGE:"
echo "  1. Dockerfile"
echo "  2. docker-compose.yml (or docker-compose-cyberfront.yml)"
echo "  3. docker/traefik-rules/app-cyberfront.yml"
echo "  4. docker/Caddyfile (if using Caddy)"
echo "  5. .env.example"
echo "  6. scripts/deploy.sh"
echo ""
echo "Send this report to get all files generated!"
