# Logic & Code Audit

## 1. System map

### High-level data flow

1. **User agent** loads the SPA from Caddy on port 80.
2. `frontend/src/main.jsx` mounts `<App>` inside `<React.StrictMode>`.
3. `<App>` wraps all routes in `<ThemeProvider>` and renders pages via `react-router-dom`.
4. Pages (primarily `HomePage`) compose presentational components (`Hero`, `About`, `Projects`, `Terminal`, etc.).
5. Data requirements:
   - When `VITE_USE_MOCK` is truthy (default), hooks/components read mock fixtures via `mockBackend.js`.
   - Otherwise `loadCollection()` performs `fetch('/data/{name}.json')` against the static assets served by Caddy/backends.
6. Terminal-style interactions trigger React state transitions and navigation (`useNavigate` → route change). Optional buttons may link to external URLs, which are gated by `getExternalUrl()` to honour offline mode.
7. Backend (`backend/server.py`) is optional. If deployed, FastAPI exposes `/api/status` endpoints backed by MongoDB or an in-memory store and `/health` for Docker smoke tests.
8. Docker runtime packages the pre-built `frontend/dist` into `caddy:2.8-alpine` with a Caddyfile that serves static assets and the `/health` endpoint.

### Key modules & responsibilities

| Module | Responsibility |
| --- | --- |
| `frontend/src/main.jsx` | Entry point; mounts React tree with strict mode. |
| `frontend/src/App.jsx` | Defines routing table for the SPA; wraps routes in `ThemeProvider`. |
| `frontend/src/contexts/ThemeContext.jsx` | Theme state management and root `<html>` class synchronisation. |
| `frontend/src/lib/env.js` | Helpers to read Vite env vars, evaluate mock mode and safe external URLs. |
| `frontend/src/lib/dataClient.js` | Abstraction over loading collections from mocks or static JSON files. |
| `frontend/src/lib/utils.jsx` | Utility combinators, color palettes (COLORS), formatting functions. |
| `frontend/src/lib/constants.js` | Application-wide constants and configuration values. |
| `frontend/src/mocks/mockBackend.js` | Mock data fixtures and getters for offline mode. |
| `frontend/src/components/shared/*` | Reusable UI components (PageLayout, GlitchEffects). |
| `frontend/src/hooks/*` | Custom React hooks for data, animations, and interactions. |
| `frontend/src/components/*` | Reusable visual sections (hero, projects grid, animated terminal/logs, background canvas, etc.). |
| `frontend/src/pages/*` | Route-level screens orchestrating data loading and component composition. |
| `backend/server.py` | FastAPI app exposing `/api/status` CRUD-like endpoints and `/health` check with optional MongoDB persistence. |
| `Dockerfile` + `docker/Caddyfile` | Build static frontend and serve with Caddy, providing health check and security headers. |

## 2. Function catalog

### Frontend custom hooks

| Hook | Location | Purpose | Inputs | Output | Notes |
| --- | --- | --- | --- | --- | --- |
| `useDataFetch` | `hooks/useDataFetch.js` | Generic data fetching with transform support | `collectionName`, `transform?`, `options?` | `{ data, setData, loading, error, refetch }` | Supports transform functions and setData for manual updates |
| `useLocalStorage` | `hooks/useDataFetch.js` | Persist state to localStorage | `key`, `initialValue` | `[value, setValue]` | Handles JSON serialization |
| `useFilter` | `hooks/useDataFetch.js` | Filter arrays with search | `items`, `searchKeys`, `initialSearch` | `{ filtered, search, setSearch }` | Case-insensitive matching |
| `useToggle` | `hooks/useDataFetch.js` | Boolean toggle | `initialValue` | `[value, toggle, setTrue, setFalse]` | Memoized callbacks |
| `useDebounce` | `hooks/useDataFetch.js` | Debounce value updates | `value`, `delay` | Debounced value | Cleanup on unmount |
| `useCopyToClipboard` | `hooks/useDataFetch.js` | Clipboard with feedback | `resetDelay` | `{ copiedField, copyToClipboard }` | Auto-reset copied state |
| `useForm` | `hooks/useDataFetch.js` | Form state management | `initialValues` | `{ values, handleChange, reset, setValues }` | Handles input changes |
| `useSequentialLines` | `hooks/useAnimatedEffects.js` | Display lines sequentially | `lines[]`, `options` | `{ currentLine, visibleLines, isComplete, reset, start }` | Auto cleanup timers |
| `useGlitchText` | `hooks/useAnimatedEffects.js` | Random glitch text effect | `originalText`, `options` | Glitched text string | Configurable probability |
| `useDelayedState` | `hooks/useAnimatedEffects.js` | State with activation delay | `initialValue`, `delay` | `[value, trigger, reset]` | Safe timer management |
| `useCountdown` | `hooks/useAnimatedEffects.js` | Countdown timer | `initialCount`, `options` | `{ count, isRunning, start, pause, reset }` | Callback on complete |
| `useSafeTimers` | `hooks/useAnimatedEffects.js` | Memory-safe timers | None | `{ setTimeout, setInterval, clearTimeout, clearInterval, clearAll }` | Auto cleanup on unmount |
| `useTypewriter` | `hooks/useTypewriter.js` | Typewriter text animation | `text`, `speed` | `{ displayText, isComplete }` | Cleans up intervals |
| `useMazeControls` | `hooks/useMazeControls.js` | Maze canvas interactions | `options` | `{ color, opacity, isEnabled, setters... }` | Persists to localStorage |
| `useTerminalCommands` | `hooks/useTerminalCommands.js` | Terminal command processing | `filesystem`, `navigate` | `{ processCommand, history }` | Supports multiple commands |

### Frontend shared components

| Component | Location | Purpose | Props | Notes |
| --- | --- | --- | --- | --- |
| `PageLayout` | `components/shared/PageLayout.jsx` | Base layout wrapper | `children`, `className` | Provides consistent styling |
| `PageHeader` | `components/shared/PageLayout.jsx` | Page header with back button | `title`, `subtitle`, `backPath`, `backText` | Auto-prefixes title with ► |
| `PageContent` | `components/shared/PageLayout.jsx` | Centered content container | `children`, `maxWidth` | Configurable max-width |
| `LoadingSpinner` | `components/shared/PageLayout.jsx` | Loading state | `icon`, `message` | Animated spinner |
| `SectionCard` | `components/shared/PageLayout.jsx` | Card with border | `children`, `borderColor`, `className` | Customizable border |
| `FilterButton` | `components/shared/PageLayout.jsx` | Filter/tab button | `active`, `onClick`, `children` | Active state styling |
| `SkillBadge` | `components/shared/PageLayout.jsx` | Tag badge | `children`, `variant` | Multiple color variants |
| `ServiceCard` | `components/shared/PageLayout.jsx` | Service display | `name`, `description`, `status`, `tags`, `borderColor`, `badgeVariant` | With status indicator |
| `SectionTitle` | `components/shared/PageLayout.jsx` | Section heading | `children`, `color`, `className` | Consistent styling |
| `StatBox` | `components/shared/PageLayout.jsx` | Stats display | `value`, `label`, `color` | Centered layout |
| `CopyButton` | `components/shared/PageLayout.jsx` | Copy to clipboard | `text`, `copied`, `onCopy`, `color` | Feedback state |
| `ErrorState` | `components/shared/PageLayout.jsx` | Error display | `message` | Centered error message |
| `Scanlines` | `components/shared/GlitchEffects.jsx` | Animated scan lines | `count`, `color`, `intense` | Overlay effect |
| `GlitchOverlay` | `components/shared/GlitchEffects.jsx` | Full screen glitch | `active`, `pattern`, `color` | Conditional rendering |
| `CyberBackground` | `components/shared/GlitchEffects.jsx` | Gradient background | `variant`, `showScanlines`, `glitching` | Multiple variants |
| `TerminalWindow` | `components/shared/GlitchEffects.jsx` | Terminal container | `prompt`, `command`, `shaking`, `borderColor`, `statusIndicator` | Styled terminal UI |
| `AnimatedLine` | `components/shared/GlitchEffects.jsx` | Terminal line | `text`, `type`, `showCursor`, `icon` | Multiple line types |
| `BackButton` | `components/shared/GlitchEffects.jsx` | Back navigation | `onClick`, `text`, `icon` | Hover animation |
| `StatusBadge` | `components/shared/GlitchEffects.jsx` | Connection status | `connected`, `connectedText`, `disconnectedText` | Animated indicator |
| `GlitchTitle` | `components/shared/GlitchEffects.jsx` | Glitching title | `text`, `className` | Gradient text effect |

### Frontend core utilities

| Export | Location | Purpose | Inputs | Output | Side effects / Error handling / Invariants |
| --- | --- | --- | --- | --- | --- |
| `useTheme` | `contexts/ThemeContext.jsx` | Consume theme context safely. | None | `{ theme, setTheme }` | Throws if called outside provider; invariant that provider sets `theme`.
| `ThemeProvider` | same | Provide theme state and sync `<html>` class. | `children` | JSX | Manipulates `document.documentElement`; assumes DOM available.
| `isMockEnabled` | `lib/env.js` | Decide offline mode. | None | boolean | Normalises env string; defaults to `true` when undefined.
| `getEnvVar` | `lib/env.js` | Read env var with fallback. | `key`, `fallback` | string | Returns fallback when missing; no side effects.
| `getExternalUrl` | `lib/env.js` | Provide safe URL or fallback. | `key`, `fallback` | string | Returns fallback when offline or empty; prevents external navigation in mock mode.
| `loadCollection` | `lib/dataClient.js` | Load dataset by name. | `name` | Promise<object> | Throws if name missing, or fetch fails; chooses mock vs fetch.
| `cn` | `lib/utils.jsx` | Merge Tailwind class names. | variadic | string | No side effects.
| `mockData`, `getMockCollection`, `getMockProfile`, `getMockGithub`, `getMockTools`, `getMockTerminal` | `mocks/mockBackend.js` | Provide deep-cloned mock fixtures. | Name (where relevant) | Object | Throws when collection missing; clones to avoid shared mutation.

### Frontend components

| Component | Location | Purpose | Inputs/Props | Output | Notes |
| --- | --- | --- | --- | --- | --- |
| `Hero` | `components/Hero.jsx` | Landing headline with typewriter animation. | none | JSX | Uses intervals for typing/cursor; cleans up on unmount.
| `About` | `components/About.jsx` | Profile summary and tech stack. | none | JSX | Memoises env overrides; splits tech stack string when online.
| `Projects` | `components/Projects.jsx` | Fetch and display project cards with filters/lightbox. | none | JSX | Loads `projects` collection; handles loading/error; uses stateful modals.
| `Terminal` | `components/Terminal.jsx` | Interactive terminal simulation with commands, navigation and logs. | callbacks for navigation | JSX | Manages extensive state, timers and intervals; sanitises commands; interacts with router.
| `GitHubLink` | `components/GitHubLink.jsx` | CTA linking to GitHub profile. | none | JSX | Memoised env-driven data; respects mock URL gating.
| `ToolsLink` | `components/ToolsLink.jsx` | CTA for tools suite. | none | JSX | Similar gating to GitHub link.
| `AnimatedLogsFeed` | `components/AnimatedLogsFeed.jsx` | Floating live log viewer. | `isVisible`, `onClose` | JSX or `null` | Interval to append logs; auto-scroll; handles pause/clear.
| `CyberMaze` | `components/CyberMaze.jsx` | Canvas-based animated maze background. | `isEnabled`, `color`, `opacity` | JSX | Uses canvas + RAF; cleans up on disable; handles resize/mouse events.

### Frontend pages (default exports)

| Page | Purpose | Data dependencies | Notes |
| --- | --- | --- | --- |
| `HomePage` | Landing hub composing hero/about/projects plus navigation cards and terminal modal. | Projects load via `loadCollection`; Terminal nested. | Uses `NavigationCard` component; handles accessibility for modal, background toggles. |
| `UndergroundPage` | Secure zone narrative with CTA. | Static content. | Uses shared `CyberBackground`, `GlitchTitle`, `StatusBadge`, `BackButton` components; `useGlitchText` hook for title effect. |
| `KrbtgtPage` | Kerberoasting-themed interactive instructions. | Static content; uses timer/effects. | Refactored with `useSequentialLines`, `useSafeTimers` hooks; uses `TerminalWindow`, `AnimatedLine` components. |
| `SelfDestructPage` | Dramatic self-destruct countdown and effects. | Static timers/intervals. | Refactored with `useCountdown`, `useSequentialLines`, `useSafeTimers` hooks; proper timer cleanup. |
| `ResumePage` | Aggregated resume built from timeline/stack/certs collections. | `timeline`, `stack`, `certs`. | Uses `PageLayout`, `SectionCard`, `SectionTitle`, `SkillBadge` shared components. |
| `TimelinePage` | Visual timeline of events. | `timeline` collection. | Uses `useDataFetch` hook and `PageLayout` components. |
| `StackPage` | Technology stack cards. | `stack` collection. | Uses `useDataFetch` hook and `PageLayout` components. |
| `SkillsPage` | Radar/skill badges. | `skills` collection. | Uses `useDataFetch` hook and `PageLayout` components. |
| `InfraPage` | Infrastructure overview. | `infra` collection. | Uses `ServiceCard`, `SectionCard`, `SectionTitle` shared components. |
| `CertsPage` | Certifications list. | `certs` collection. | Uses `useDataFetch` hook and `PageLayout` components. |
| `ContactPage` | Contact and availability info. | `mockBackend` + env overrides (`VITE_CONTACT_*`). | Uses `useCopyToClipboard`, `useForm`, `useToggle` hooks; `CopyButton` component. |
| `LearningPage` | Learning resources. | `learning` collection. | Uses `useDataFetch` hook and `PageLayout` components. |
| `LogsPage` | Log archive screen. | `logs` collection. | Uses `useDataFetch` with `setData` for live mode; `FilterButton`, `StatBox` components. |

### Backend exports

| Export | Purpose | Inputs | Output | Notes |
| --- | --- | --- | --- | --- |
| `lifespan` | FastAPI lifespan manager establishing Mongo connection when available. | `app` | async context manager | Catches connection errors; falls back to memory store.
| `app` | FastAPI instance. | — | FastAPI app | Includes router and CORS middleware.
| `save_status` | Persist status check. | `StatusCheck` | `StatusCheck` | Inserts into Mongo or keeps last 100 in-memory.
| `fetch_statuses` | Retrieve last checks. | — | List[`StatusCheck`] | Sorted by timestamp; memory fallback reversed to chronological order.
| `root` | `/api/` ping endpoint. | — | `{"message": "Hello World"}` | Simple connectivity check.
| `create_status_check` | POST `/api/status`. | payload with `client_name` | `StatusCheck` | Strips name; relies on `save_status`.
| `get_status_checks` | GET `/api/status`. | — | List | Pulls via `fetch_statuses`.
| `healthcheck` | GET `/health`. | — | `{"status": "ok", "database": state}` | Used by Docker health checks.

## 3. Control & data flow

1. **Page load:** `index.html` injects `frontend/src/main.jsx`. Vite env variables available under `import.meta.env`.
2. **Initialization:** `<ThemeProvider>` sets `document.documentElement` class to `dark`. `HomePage` renders default layout.
3. **Data fetching:** Components call `loadCollection(name)` inside `useEffect`. With mocks enabled, this synchronously reads JSON fixtures from `frontend/src/mocks/data/*.json`; otherwise it fetches `/data/*.json` (served from `public/data`).
4. **Rendering:** State updates trigger re-renders. Many components guard with loading skeletons and fallback arrays. Terminal sets up intervals for time updates, typewriter effect, and optional log feed.
5. **Navigation:** Buttons call `useNavigate()` (client-side routes) or safe anchors from `getExternalUrl`. Terminal commands may also call navigate or toggle UI state.
6. **Backend (optional):** Deployed FastAPI handles `/api/status` routes. When Mongo env var missing/unreachable, in-memory list is used. `/health` returns JSON consumed by Caddy health check and Docker smoke test.

**Fragile areas:**

- Components assume browser APIs exist (e.g., `window.document`, canvas context). No SSR support.
- ~~Several pages use multiple timers/intervals (Terminal, SelfDestructPage) that need consistent cleanup~~ **Resolved**: `useSafeTimers` hook now manages all timers with automatic cleanup.
- `Projects` and other data-driven components assume JSON schema fields exist; missing keys default to empty arrays but type mismatches could break rendering.
- `Terminal` executes asynchronous `loadCollection('filesystem')`; failure sets `filesystem` to `null`, yet some commands may expect data. More validation may be needed.
- Large animation effects (CyberMaze canvas, Terminal logs, SelfDestruct countdown) can trigger re-render storms on low-powered devices.

## 4. Dead code & duplication

| Item | Status | Recommendation |
| --- | --- | --- |
| `frontend/src/hooks/use-toast.jsx` | **Removed in previous audit** (unused). | N/A — deletion reduces bundle size. |
| Repeated loading/error patterns | **Resolved** — refactored into `useDataFetch` hook. | Shared hook used across all data pages. |
| Repeated page layout code | **Resolved** — extracted to `PageLayout` components. | Shared components in `components/shared/`. |
| Repeated glitch/animation code | **Resolved** — extracted to `GlitchEffects` components and `useAnimatedEffects` hooks. | Consistent effects across special pages. |
| Repeated timer management | **Resolved** — `useSafeTimers` hook handles cleanup. | Prevents memory leaks in animated pages. |
| JSON fixtures vs env overrides | Slight duplication between mock data and `.env` overrides. | Acceptable but document to avoid drift. |

## 5. Error & edge cases

- **Missing assets/env:** `getEnvVar` and `getExternalUrl` supply defaults (`""`/`#`). When env absent, UI displays mock content without crashing.
- **Network offline:** `isMockEnabled()` defaults to `true`, so components stay offline-ready. If toggled off and network fails, fetches throw; most components catch errors and set fallback state, but user feedback is sometimes generic (“Failed to load…”).
- **Backend down:** Frontend does not rely on backend for core views. Docker health depends on Caddy’s `/health` which is static.
- **Mobile/low GPU:** `CyberMaze` canvas and Terminal animations could be heavy; `HomePage` allows disabling the maze and reducing opacity, but defaults might still tax low-end devices.
- **Tab inactive:** Intervals continue to run (Terminal logs, countdowns). Could consider pausing when tab hidden to save resources.
- **Accessibility:** Many buttons have ARIA labels; however, lightbox controls and certain terminal outputs may need better focus management (e.g., when modal opens, focus stays on input but escape closes — good). Color contrast relies on neon palette; verify with accessibility tooling.

## 6. Performance & accessibility checklist

- **CPU/GPU intensive:** `CyberMaze` (`requestAnimationFrame`), Terminal command typing (frequent state updates), `AnimatedLogsFeed` (interval appends), `SelfDestructPage` visual effects. Consider throttling or providing user opt-outs (maze toggle already present).
- **LCP/TTI:** Hero typewriter delays final headline; consider SSR or pre-rendered text for faster LCP. Heavy scripts (lucide-react icons) increase bundle size.
- **Images:** Mostly SVG avatars; good for performance.
- **Keyboard navigation:** Many controls accessible (`aria-label`, `role`). Ensure lightbox buttons and timeline cards receive focus outlines.
- **Focus traps:** Terminal modal closes on Escape and restores focus; good. Color picker closes on outside click but should also close on Escape for parity.

## 7. Security & privacy checklist

- **Secrets:** None stored in repo. `.env.example` placeholders only.
- **Analytics:** No tracking scripts observed.
- **CSP/HSTS:** Enforced via Caddy and Traefik middleware (strict policies). Consider allowing required external domains when mocks disabled.
- **Dependency risks:** JS audit limited to high/critical; pip-audit ensures Python libs vetted. Keep dependencies updated to avoid stale vulnerabilities.
- **Input sanitisation:** Terminal sanitises command input (removes HTML and `..`). API payloads validated with Pydantic.
- **Backend auth:** `/api/status` unauthenticated; acceptable for demo but restrict in production.

## 8. Actionable TODOs

| ID | Title | Area | Priority | Effort | Files | Acceptance criteria |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | Document lightbox accessibility requirements | Frontend UX | P2 | S | `frontend/src/components/Projects.jsx` | Lightbox traps focus and exposes keyboard shortcuts. |
| F2 | ~~Pause high-frequency animations when tab hidden~~ | ~~Frontend perf~~ | ~~P1~~ | ~~M~~ | — | **Partially addressed** in CyberMaze; consider extending to other animations. |
| F3 | Improve error messaging for data loads | Frontend DX | P2 | S | Various pages/components | Users see contextual alerts when fetch fails (not only console errors). |
| ~~F4~~ | ~~Harden SelfDestruct timers cleanup~~ | ~~Frontend stability~~ | ~~P1~~ | ~~S~~ | — | **✅ RESOLVED** — `useSafeTimers` hook now handles all timer cleanup. |
| F5 | Optional backend auth guard | Backend security | P3 | M | `backend/server.py` | API rejects unauthorised requests (token or API key) when env flag set. |
| CI1 | Cache yarn/pip installs | DevOps | P2 | M | `.github/workflows/ci.yml` | CI uses caches to reduce install times while respecting immutable installs. |
| DOC1 | Keep mock JSON schema documented | Docs | P3 | XS | `docs/README.md` or new schema doc | Document expected keys for each collection to simplify maintenance. |

## 9. Recent Refactoring Summary (Dec 2024)

### Phase 1: Core Component Restructuring
- Fixed `main.jsx` React 18 compatibility bug
- Created `NavigationCard` component for consistent nav styling
- Modularized Terminal component into `Terminal/index.jsx` and `Terminal/TerminalUI.jsx`
- Created custom hooks: `useTypewriter`, `useMazeControls`, `useTerminalCommands`
- Added `lib/constants.js` for app-wide configuration

### Phase 2: Shared Page Components
- Created `components/shared/PageLayout.jsx` with 7 exported components
- Created `hooks/useDataFetch.js` with 5+ hooks for data/state management
- Enhanced `lib/utils.jsx` with `COLORS` palette and formatting utilities
- Refactored: CertsPage, SkillsPage, StackPage, TimelinePage, LearningPage

### Phase 3: Extended Shared Components
- Added to PageLayout: `ServiceCard`, `SectionTitle`, `StatBox`, `CopyButton`, `ErrorState`
- Added hooks: `useCopyToClipboard`, `useForm`
- Enhanced `useDataFetch` with `setData` and transform function support
- Refactored: InfraPage, LogsPage, ContactPage, ResumePage

### Phase 4: Animation & Effects System
- Created `components/shared/GlitchEffects.jsx` with 9 exported components
- Created `hooks/useAnimatedEffects.js` with 5 specialized hooks
- Refactored: UndergroundPage (-26%), KrbtgtPage (-52%), SelfDestructPage (-50%)
- Resolved timer memory leak issues with `useSafeTimers` hook

### Code Reduction Metrics
| Page | Before | After | Reduction |
|------|--------|-------|-----------|
| HomePage | 455 lines | ~280 lines | -38% |
| KrbtgtPage | 363 lines | 175 lines | -52% |
| SelfDestructPage | 389 lines | 195 lines | -50% |
| InfraPage | 152 lines | 104 lines | -32% |
| UndergroundPage | 197 lines | 145 lines | -26% |
| ContactPage | 271 lines | 220 lines | -19% |
| CertsPage | 114 lines | 92 lines | -19% |
| TimelinePage | 107 lines | 88 lines | -18% |
| LogsPage | 212 lines | 179 lines | -16% |
| LearningPage | 347 lines | 295 lines | -15% |

