# Frontend du portfolio

Application React du projet **Cyber-Front-Page**. Elle est basée sur React 19, configurée via [Craco](https://github.com/dilanx/craco) et stylisée avec Tailwind CSS et shadcn/ui.

## Stack principale

- **Yarn 1.x** pour la gestion des dépendances
- **Craco** : surcharge de la configuration CRA et alias `@` vers `src/`
- **Tailwind CSS** (+ `tailwindcss-animate`) avec thème sombre/clair
- **Radix UI** & **shadcn/ui** pour les composants
- **next-themes** et `ThemeContext` pour la gestion des thèmes

## Installation

```bash
cd frontend
yarn install
```

## Scripts

- `yarn start` : lance le serveur de développement sur `http://localhost:3000`
- `yarn build` : génère les fichiers de production dans `build/`
- `yarn test` : exécute les tests en mode CI

## Structure

```
src/
  components/  # composants UI réutilisables
  contexts/    # contextes React (ex. ThemeContext)
  hooks/       # hooks personnalisés
  lib/         # utilitaires et helpers
  mock/        # données simulées (data.js)
  pages/       # pages de l'application
public/
  data/        # fichiers JSON (projects, skills, timeline, etc.)
```

Les fichiers JSON de `public/data/` alimentent les sections du portfolio. Pour des tests hors ligne, des données de démonstration sont disponibles dans `src/mock/data.js`.

## Thèmes

Le mode sombre/clair est géré par `ThemeContext` et la librairie `next-themes`. La configuration Tailwind (`tailwind.config.js`) expose des variables CSS permettant d'ajuster les couleurs et de créer de nouveaux thèmes.

---

Pour plus de détails sur le projet global et les commandes du terminal, consultez le README à la racine du dépôt.
