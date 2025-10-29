# Frontend

Application Vite/React servant l'interface Cyber Front Page.

## Scripts disponibles

- `npm run dev` : lance le serveur de développement Vite.
- `npm run build` : produit le bundle de production dans `dist/`.
- `npm run preview` : prévisualise le bundle localement.

## Configuration

Le frontend lit les variables `SITE_NAME`, `SITE_THEME` et `SITE_DOMAIN` via l'environnement au moment du build (transmises dans le conteneur Caddy). Les données dynamiques proviennent de `public/data/*.json`.
