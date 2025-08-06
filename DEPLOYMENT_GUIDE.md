# 🐳 PRODUCTION DEPLOYMENT GUIDE
# Cyberpunk Portfolio - Docker + Traefik Setup

## 📋 PREREQUISITES

1. **Docker & Docker Compose installed**
2. **Traefik reverse proxy running**
3. **Domain configured** (replace `nebulahost.tech` with your domain)
4. **SSL certificate resolver configured in Traefik**

## 🚀 DEPLOYMENT STEPS

### Step 1: Prepare the Application

```bash
# Clone/copy your application
cd /path/to/cyberpunk-portfolio

# Remove backend directory (frontend-only deployment)
rm -rf backend/
rm -rf backend.py requirements.txt

# Security audit dependencies
cd frontend/
yarn audit --audit-level moderate
yarn install --frozen-lockfile
cd ..
```

### Step 2: Configure Environment

```bash
# Update docker-compose.yml with your domain
sed -i 's/nebulahost.tech/YOUR_DOMAIN.com/g' docker-compose.yml

# Ensure Traefik network exists
docker network create traefik 2>/dev/null || true
```

### Step 3: Build and Deploy

```bash
# Build the secure container
docker-compose build --no-cache

# Deploy the application
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs -f cyberpunk-portfolio
```

### Step 4: Security Verification

```bash
# Test security headers
curl -I https://your-domain.com

# Verify CSP
curl -H "Accept: text/html" https://your-domain.com | grep -i "content-security-policy"

# Check container security
docker exec cyberpunk-portfolio whoami  # Should show 'nginxuser'
docker exec cyberpunk-portfolio ls -la /  # Should show read-only filesystem
```

## 🛡️ SECURITY FEATURES ENABLED

### Docker Security
- ✅ **Non-root user execution** (UID/GID 1001)
- ✅ **Read-only root filesystem**
- ✅ **No new privileges**
- ✅ **Resource limits** (512M RAM, 0.5 CPU)
- ✅ **Minimal attack surface** (nginx:alpine base)
- ✅ **Security updates** applied

### Application Security
- ✅ **Input sanitization** on all terminal commands
- ✅ **Whitelisted commands** only
- ✅ **XSS prevention** through React escaping
- ✅ **No code injection** vectors
- ✅ **Safe external links** (single whitelisted domain)

### Network Security
- ✅ **HTTPS only** via Traefik SSL
- ✅ **Security headers** (CSP, HSTS, X-Frame-Options, etc.)
- ✅ **Rate limiting** available via Traefik
- ✅ **Fail2ban compatible** logs

## 📊 MONITORING & MAINTENANCE

### Health Checks
```bash
# Application health
curl https://your-domain.com/health

# Container health
docker inspect --format='{{.State.Health.Status}}' cyberpunk-portfolio

# Resource usage
docker stats cyberpunk-portfolio
```

### Log Monitoring
```bash
# Application logs
docker-compose logs -f cyberpunk-portfolio

# Nginx access logs (for fail2ban)
docker exec cyberpunk-portfolio tail -f /var/log/nginx/access.log

# Security events
grep "404\|403\|499" /var/log/nginx/access.log
```

### Updates
```bash
# Update base image
docker pull nginx:1.25-alpine

# Rebuild with security updates
docker-compose build --no-cache --pull

# Rolling update
docker-compose up -d
```

## ⚡ PERFORMANCE OPTIMIZATION

### Nginx Caching
- Static assets cached for 1 year
- Gzip compression enabled
- Browser caching optimized

### Resource Limits
- Memory: 512MB limit, 256MB reserved
- CPU: 0.5 cores limit, 0.25 reserved
- Disk: Read-only filesystem

### Docker Optimization
- Multi-stage build reduces image size
- Alpine base image (minimal footprint)
- Layer caching for faster rebuilds

## 🔧 TRAEFIK INTEGRATION

### Required Traefik Labels
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.cyberpunk.rule=Host(`your-domain.com`)"
  - "traefik.http.routers.cyberpunk.entrypoints=websecure"
  - "traefik.http.routers.cyberpunk.tls.certresolver=letsencrypt"
  - "traefik.http.services.cyberpunk.loadbalancer.server.port=80"
```

### Optional Security Middleware
```yaml
# Rate limiting
- "traefik.http.middlewares.cyberpunk-ratelimit.ratelimit.burst=100"
- "traefik.http.middlewares.cyberpunk-ratelimit.ratelimit.average=10"

# IP whitelist (if needed)
- "traefik.http.middlewares.cyberpunk-whitelist.ipwhitelist.sourcerange=0.0.0.0/0"
```

## 🚨 TROUBLESHOOTING

### Common Issues

**Container won't start:**
```bash
docker-compose logs cyberpunk-portfolio
# Check file permissions and user conflicts
```

**502 Bad Gateway:**
```bash
# Verify Traefik network
docker network ls | grep traefik
# Check container is healthy
docker inspect cyberpunk-portfolio | grep Health -A 10
```

**SSL Issues:**
```bash
# Check Traefik SSL configuration
docker logs traefik | grep -i ssl
# Verify domain DNS points to server
dig your-domain.com
```

## ✅ PRODUCTION READY CHECKLIST

- [ ] Domain DNS configured
- [ ] Traefik running with SSL
- [ ] Application built and tested
- [ ] Security headers verified
- [ ] Health checks passing
- [ ] Monitoring setup
- [ ] Backup strategy defined
- [ ] SSL certificates auto-renewing
- [ ] Log rotation configured
- [ ] Updates scheduled

## 🎯 FINAL VERIFICATION

```bash
# Complete security test
curl -I https://your-domain.com
# Should show all security headers

# Performance test
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
# Should load quickly with proper caching

# Functionality test
# Visit all pages: /, /resume, /stack, /infra, /certs, /contact, /learning, /logs
# Test terminal commands
# Verify easter eggs work

echo "🎉 CYBERPUNK PORTFOLIO IS PRODUCTION READY!"
```

Your cyberpunk portfolio is now **SECURE**, **SCALABLE**, and **PRODUCTION-READY**! 🚀