# Cyber Front Page

## Badges

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
![Release](https://github.com/<owner>/<repo>/actions/workflows/release.yml/badge.svg)

## What is shipped

- SPA Vite/React servie par Caddy sur le port 80, prête pour des labels Traefik v3.
- Frontend offline-first (`VITE_USE_MOCK=1`) avec backend FastAPI optionnel.
- Artefacts `frontend/dist` priorisés : l'image Docker consomme l'artefact quand disponible.

## How CI works

- **CI (PRs / branche dev)** : installe les dépendances (lockfile initial puis mode immutable), construit le frontend, audite les dépendances JS (échec uniquement si vulnérabilité high/critical), audite Python, construit l'image Docker et réalise un smoke test `/health`. Aucun push d'image.
- **Release (main & tags)** : reconstruit le frontend, construit et pousse des images multi-arch vers GHCR avec tags semver lors des tags `v*.*.*`.

## Triggers

- Ouvrir une PR → le workflow CI valide les builds et audits.
- Merger sur `main` → le workflow Release pousse des tags `:sha` et `:main`.
- Pousser un tag `vX.Y.Z` → le workflow Release pousse également `:X.Y.Z` et `:X.Y`.

## Pulling the image

```bash
docker pull ghcr.io/<owner>/<repo>:vX.Y.Z
docker run -p 8080:80 ghcr.io/<owner>/<repo>:vX.Y.Z
```

## Config & env

- `.env.example` définit `SITE_DOMAIN`, `SITE_NAME`, `SITE_THEME`, `VITE_USE_MOCK`.
- Derrière Traefik v3, le service écoute sur le port 80.

## Troubleshooting

- Blank page → assurez-vous que `VITE_USE_MOCK=1` ou fournissez des fichiers `/public/data/*.json`.
- High CPU → désactivez CyberMaze dans l'UI ; le changement d'onglet met en pause les animations.
- CI fails on audit → seuls les niveaux high/critical doivent échouer (`npm audit --audit-level=high`).

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
