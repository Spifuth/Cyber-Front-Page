# Architecture

- [Stack Overview](#stack-overview)
- [Frontend](#frontend)
  - [Component Architecture](#component-architecture)
  - [Custom Hooks](#custom-hooks)
  - [Shared Components](#shared-components)
- [Backend](#backend)
- [Build and Delivery](#build-and-delivery)
- [Further Reading](#further-reading)

## Stack Overview

```
[Vite + React SPA] --(static assets)--> [Caddy] --(optional routing)--> [Traefik]
           |                                     |
     [Mock data JSON]                    [/health endpoint]
           |
    [FastAPI backend (optional)]
```

The project targets static hosting with optional dynamic capabilities. Mocks keep the experience offline-ready, while the backend
exposes APIs when connected to data sources such as MongoDB.

## Frontend

- Located in `frontend/` with Vite, React, and Tailwind.
- Uses `frontend/src/mocks/mockBackend.js` and `frontend/public/data/*.json` when `VITE_USE_MOCK=1`.
- CyberMaze animations can be paused automatically when the browser tab loses focus.

### Component Architecture

```
src/
├── components/
│   ├── shared/              # Reusable UI components
│   │   ├── PageLayout.jsx   # Page structure components
│   │   ├── GlitchEffects.jsx# Visual effects components
│   │   └── index.js         # Barrel exports
│   ├── Terminal/            # Modular terminal component
│   │   ├── index.jsx        # Main terminal logic
│   │   └── TerminalUI.jsx   # UI sub-components
│   ├── NavigationCard.jsx   # Reusable nav card
│   └── [Other components]
├── hooks/                   # Custom React hooks
│   ├── useDataFetch.js      # Data fetching & state hooks
│   ├── useAnimatedEffects.js# Animation & timer hooks
│   ├── useMazeControls.js   # Maze interaction hooks
│   ├── useTypewriter.js     # Typewriter effect hooks
│   ├── useTerminalCommands.js# Terminal command logic
│   └── index.js             # Barrel exports
├── lib/                     # Utilities & constants
│   ├── dataClient.js        # Data loading abstraction
│   ├── env.js               # Environment helpers
│   ├── utils.jsx            # Styling utilities & colors
│   └── constants.js         # App-wide constants
└── pages/                   # Route-level screens
```

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useDataFetch` | Generic data fetching with loading/error states |
| `useLocalStorage` | Persist state to localStorage |
| `useFilter` | Array filtering with search |
| `useToggle` | Boolean state toggle |
| `useDebounce` | Debounced value updates |
| `useCopyToClipboard` | Clipboard with feedback |
| `useForm` | Form state management |
| `useSequentialLines` | Display lines with delays |
| `useGlitchText` | Random glitch text effect |
| `useCountdown` | Countdown timer |
| `useSafeTimers` | Memory-safe timer management |
| `useTypewriter` | Typewriter text animation |
| `useMazeControls` | Maze canvas interactions |
| `useTerminalCommands` | Terminal command processing |

### Shared Components

**PageLayout.jsx exports:**
- `PageLayout` - Base layout wrapper
- `PageHeader` - Consistent page headers with back button
- `PageContent` - Centered content container
- `LoadingSpinner` - Loading state display
- `SectionCard` - Card container with border
- `FilterButton` - Filter/tab buttons
- `SkillBadge` - Small badges for tags
- `ServiceCard` - Service display with status
- `SectionTitle` - Consistent section titles
- `StatBox` - Statistics display
- `CopyButton` - Copy to clipboard button
- `ErrorState` - Error display component

**GlitchEffects.jsx exports:**
- `Scanlines` - Animated scan lines overlay
- `GlitchOverlay` - Full screen glitch effect
- `CyberBackground` - Gradient background with effects
- `TerminalWindow` - Styled terminal container
- `AnimatedLine` - Sequential terminal line display
- `BackButton` - Styled back navigation
- `StatusBadge` - Connection status indicator
- `GlitchTitle` - Animated glitching title

## Backend

- FastAPI application under `backend/` with default in-memory storage.
- Optional MongoDB integration controlled via `MONGO_URL` and `DB_NAME` environment variables.
- Health checks served at `/health` to support CI smoke tests and platform monitoring.

## Build and Delivery

- Frontend builds to `frontend/dist` and is copied into the Docker runtime stage.
- Caddy serves static files with security headers; Traefik labels define routing and middleware when used.
- GitHub Actions build multi-architecture images and upload artifacts for release automation.

## Further Reading

For a detailed logic catalog and component analysis, consult [LOGIC_AUDIT.md](LOGIC_AUDIT.md).
