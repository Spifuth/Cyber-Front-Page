# Cyber Front Page

Branche `dev` pour une vitrine cyberpunk offline-ready : frontend Vite/React, backend FastAPI optionnel et livraison via Caddy + Traefik. Cette branche est pensée pour fonctionner sans accès réseau local, tout en restant prête pour une CI GitHub connectée.

## Aperçu du projet

- **frontend/** : SPA Vite + Tailwind, thèmes et terminal interactif.
- **backend/** : API FastAPI (MongoDB facultatif, stockage mémoire par défaut).
- **docker/** : Dockerfile multi-stage (Node → Caddy) + docker-compose avec labels Traefik v3.
- **.github/** : pipeline CI orchestrant build frontend, audit Python et image Docker multi-arch.

## Architecture en un coup d'œil

- Cartographie complète et catalogue des fonctions disponibles dans [`docs/LOGIC_AUDIT.md`](docs/LOGIC_AUDIT.md).
- Résumé des flux de données (mocks vs backend), invariants critiques et TODOs priorisés.
- À utiliser comme point d'entrée rapide avant toute contribution technique.

## Mode offline

Le frontend bascule automatiquement sur des mocks lorsque `VITE_USE_MOCK=1` (valeur par défaut). Les données sont servies depuis `frontend/public/data/*.json` et des placeholders locaux (`frontend/public/assets`).

- Les requêtes réseau sont neutralisées en mode offline (`Projects`, `Learning`, etc.).
- `frontend/src/mocks/mockBackend.js` expose des collections statiques alignées sur les JSON publics.
- Les URLs externes peuvent être réactivées via les variables `.env` (`VITE_TOOLS_URL`, `VITE_GITHUB_URL`, ...).

### Variables clés

```
VITE_USE_MOCK=1
VITE_CONTACT_* (email, linkedin, github, ...)
VITE_TOOLS_* (name, url, description)
VITE_GITHUB_* (profile, url, avatar)
VITE_PROFILE_* (name, role, description, tech stack)
```

### Limites offline

- Les liens externes sont neutralisés (`href="#"`) tant que le mode mock est actif.
- Les assets sont des SVG statiques (pas de screenshots dynamiques).
- L'audio/streaming n'est pas embarqué ; les sections affichent un message explicite.

## Build CI GitHub

Le workflow `.github/workflows/ci.yml` réalise :

1. **Job frontend**
   - Node 20 + Corepack, génération unique de `yarn.lock` si absent (`YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install --mode=update-lockfile`) puis `yarn install --immutable`.
   - `yarn build` puis upload de l'artefact `frontend/dist`.
   - Audit JS via `npm audit --audit-level=high` (les vulnérabilités low/moderate n'échouent pas le job).
2. **Job backend-audit**
   - Python 3.11, installation des dépendances puis `pip-audit -r backend/requirements.txt`.
3. **Job docker-image**
   - buildx, récupération de l'artefact `frontend-dist` et build `linux/amd64` avec `outputs: type=docker` pour charger l'image localement.
   - Smoke test : `docker run -p 8080:80` puis `curl -fsS http://localhost:8080/health`.
   - Push multi-arch optionnel (amd64/arm64) vers GHCR si `secrets.GHCR_PUSH == 'true'`.

> ⚠️ Aucun `yarn.lock` n'est commité ici : il sera généré automatiquement lors du premier run CI (`--mode=update-lockfile`) puis les installations resteront immuables.

## Docker (CI ou prod)

Le `Dockerfile` multi-stage :

1. Stage build (Node 20) avec `ARG NPM_REGISTRY`, build Vite si `USE_LOCAL_DIST=0`.
2. Stage runtime (Caddy 2.8) servant `/srv/app`, healthcheck `GET /health`.
3. Si un `frontend/dist` est présent dans le contexte (artefact CI), il est copié tel quel (`USE_LOCAL_DIST=1`).

`docker/docker-compose.yml` fournit :

- Labels Traefik v3 (`cyberfront-headers` middleware de sécurité).
- Réseau externe `traefik-net` (à créer côté infra).
- Variables de branding (`SITE_NAME`, `SITE_DOMAIN`, `SITE_THEME`, `SITE_TAGLINE`).

### Build dans la CI

```
# dans GitHub Actions (job docker-image)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg USE_LOCAL_DIST=1 \
  -t ghcr.io/${{ github.repository }}:${{ github.sha }} .
```

## Backend FastAPI

- Fonctionne sans MongoDB (`memory_status_checks`).
- `backend/requirements.txt` contient des versions indicatives, la CI (`pip-audit`) est responsable du pinning définitif.
- Variables pertinentes : `MONGO_URL`, `DB_NAME`, `TRUSTED_ORIGINS`.

## Traefik

- Réseau externe : `traefik-net`.
- Labels principaux :
  - `traefik.http.routers.${TRAEFIK_SERVICE_NAME}.rule`
  - `traefik.http.routers.${TRAEFIK_SERVICE_NAME}.middlewares=${TRAEFIK_MIDDLEWARE_HEADERS}`
  - Middleware `headers` appliquant CSP, HSTS, Referrer-Policy.
- Ajuster `.env` (`TRAEFIK_ROUTER_RULE`, `TRAEFIK_ENTRYPOINT`) selon l'environnement.

## Dépendances & scripts

```
frontend/package.json
  dev      → vite
  build    → vite build
  preview  → vite preview
  lint     → placeholder (configurer ESLint en CI)
```

Backend : `python -m venv .venv && pip install -r backend/requirements.txt` (optionnel, via CI uniquement).

## Génération de la CI

- `yarn.lock` : généré par le job frontend et stocké en cache/artifact avant commit manuel.
- `pip-audit` : assure la compatibilité et le pinning des dépendances Python.
- Artefact `frontend/dist` réinjecté dans l'image Docker.

## Commandes Git (local sans réseau)

```
git status
git add .
git commit -m "offline-ready dev"
# push à réaliser sur machine connectée
git push origin dev
```

Bon hack et bon routage offline !

## Sécurité/MAJ

- Prévoir une PR dédiée (une fois l'accès réseau CI rétabli) pour mettre `vite` à `^5.4.21` ou version recommandée ultérieure, régénérer `yarn.lock`, puis supprimer `resolutions.esbuild` si le correctif n'est plus requis.
