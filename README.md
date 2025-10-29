# Cyber Front Page

Branche `dev` servant de socle propre pour le portfolio cyberpunk de Fenrir. L'application fournit une landing page statique (Vite + React) et un backend FastAPI optionnel pour stocker l'historique des "status checks". L'ensemble est prêt pour un déploiement dans un homelab via Caddy et Traefik.

## Contenu du dépôt

```
frontend/  → SPA Vite + Tailwind
backend/   → API FastAPI (stockage MongoDB optionnel)
docker/    → Dockerfile Caddy + docker-compose prêt Traefik
docs/      → Documentation complémentaire
```

## Prérequis

- Node.js 20+
- npm 10+
- Python 3.11+
- Docker / Docker Compose (pour l'image de prod)

## Installation locale

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (optionnel)
cd ../backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.server:app --reload
```

Les données statiques sont servies depuis `frontend/public/data/*.json`. Le terminal embarqué communique uniquement avec ces fichiers ; le backend est destiné à des intégrations futures.

## Tests

```bash
# Vérifier que le build passe
cd frontend
npm run build

# Tests Python
cd ../
pytest
```

## Configuration

Copiez `.env.example` vers `.env` à la racine et complétez les variables :

- `SITE_NAME`, `SITE_THEME`, `SITE_DOMAIN` : branding du site.
- `MONGO_URL`, `DB_NAME` : connexion MongoDB (laisser vide pour stocker en mémoire).
- `TRUSTED_ORIGINS` : origines autorisées par le CORS backend.
- `TRAEFIK_ROUTER_RULE`, `TRAEFIK_ENTRYPOINT` : intégration Traefik.

Le backend lit automatiquement `.env` s'il est présent ; Caddy récupère `SITE_*` via les variables d'environnement du conteneur.

## Docker (production)

```bash
# Build de l'image
docker build -t cyber-front-page .

# Démarrage via compose (répertoire docker/)
cd docker
docker compose up -d
```

L'image finale (~80 Mo) expose le port 80 et publie un endpoint `/health` utilisé par le healthcheck. Le fichier `docker/docker-compose.yml` inclut des labels Traefik v3 prêts à l'emploi et mappe le port 8080 pour des tests locaux (supprimez la section `ports` lorsque Traefik gère l'exposition publique).

## Traefik

Assurez-vous que le réseau Docker `traefik-net` existe (externe) et que Traefik 3.x importe les labels suivants :

- `traefik.enable=true`
- `traefik.http.routers.cyberfront.rule=Host("example.com")`
- `traefik.http.routers.cyberfront.entrypoints=web`
- `traefik.http.services.cyberfront.loadbalancer.server.port=80`

Adaptez `TRAEFIK_ROUTER_RULE` / `TRAEFIK_ENTRYPOINT` dans `.env` pour refléter votre configuration réelle.

## Structure propre

- Aucun secret ni dossier `node_modules` commité.
- `.gitignore` et `.dockerignore` excluent les artefacts lourds.
- `CHANGELOG.md` consigne les évolutions dès cette branche `dev`.
- `docs/README.md` centralise les futures documentations techniques.

Bon hack !
