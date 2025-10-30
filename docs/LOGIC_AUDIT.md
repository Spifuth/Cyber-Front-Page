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
| `frontend/src/lib/utils.jsx` | Utility combinators (currently Tailwind class merger). |
| `frontend/src/mocks/mockBackend.js` | Mock data fixtures and getters for offline mode. |
| `frontend/src/components/*` | Reusable visual sections (hero, projects grid, animated terminal/logs, background canvas, etc.). |
| `frontend/src/pages/*` | Route-level screens orchestrating data loading and component composition. |
| `backend/server.py` | FastAPI app exposing `/api/status` CRUD-like endpoints and `/health` check with optional MongoDB persistence. |
| `Dockerfile` + `docker/Caddyfile` | Build static frontend and serve with Caddy, providing health check and security headers. |

## 2. Function catalog

### Frontend core & utilities

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
| `HomePage` | Landing hub composing hero/about/projects plus navigation cards and terminal modal. | Projects load via `loadCollection`; Terminal nested. | Handles accessibility for modal, background toggles.
| `UndergroundPage` | Secure zone narrative with CTA. | Static content. | Provides navigation back to home.
| `KrbtgtPage` | Kerberoasting-themed interactive instructions. | Static content; uses timer/effects. | Navigates on actions.
| `SelfDestructPage` | Dramatic self-destruct countdown and effects. | Static timers/intervals. | Plays audio/visual cues (needs caution for performance).
| `ResumePage` | Aggregated resume built from timeline/stack/certs collections. | `timeline`, `stack`, `certs`. | Filters by type/status; handles loading fallback.
| `TimelinePage` | Visual timeline of events. | `timeline` collection. | Renders categories, ensures fallback arrays.
| `StackPage` | Technology stack cards. | `stack` collection. | Displays categories/technologies.
| `SkillsPage` | Radar/skill badges. | `skills` collection. | Renders radar-style layout, ensures arrays.
| `InfraPage` | Infrastructure overview. | `infra` collection. | Renders nested lists; handles missing data gracefully.
| `CertsPage` | Certifications list. | `certs` collection. | Filters by status icons.
| `ContactPage` | Contact and availability info. | `mockBackend` + env overrides (`VITE_CONTACT_*`). | Respects mock links.
| `LearningPage` | Learning resources. | `learning` collection. | Shows categories; handles offline mode messaging.
| `LogsPage` | Log archive screen. | `logs` collection. | Provides filtering/search.

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
- Several pages use multiple timers/intervals (Terminal, SelfDestructPage) that need consistent cleanup; `SelfDestructPage` should be reviewed for possible timer leaks.
- `Projects` and other data-driven components assume JSON schema fields exist; missing keys default to empty arrays but type mismatches could break rendering.
- `Terminal` executes asynchronous `loadCollection('filesystem')`; failure sets `filesystem` to `null`, yet some commands may expect data. More validation may be needed.
- Large animation effects (CyberMaze canvas, Terminal logs, SelfDestruct countdown) can trigger re-render storms on low-powered devices.

## 4. Dead code & duplication

| Item | Status | Recommendation |
| --- | --- | --- |
| `frontend/src/hooks/use-toast.jsx` | **Removed in this audit** (unused). | N/A — deletion reduces bundle size. |
| Repeated status color maps in `Projects` | Duplicated between card and list functions. | Refactor into shared helper if future changes required. |
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
| F1 | Document lightbox accessibility requirements | Frontend UX | P2 | S | `frontend/src/components/Projects.jsx` | Lightbox traps focus and exposes keyboard shortcuts.
| F2 | Pause high-frequency animations when tab hidden | Frontend perf | P1 | M | `components/AnimatedLogsFeed.jsx`, `components/CyberMaze.jsx`, `components/Terminal.jsx` | Animations respect `document.visibilityState` to reduce CPU usage.
| F3 | Improve error messaging for data loads | Frontend DX | P2 | S | Various pages/components | Users see contextual alerts when fetch fails (not only console errors).
| F4 | Harden SelfDestruct timers cleanup | Frontend stability | P1 | S | `pages/SelfDestructPage.jsx` | All intervals/timeouts cleared on unmount; add unit/integration test.
| F5 | Optional backend auth guard | Backend security | P3 | M | `backend/server.py` | API rejects unauthorised requests (token or API key) when env flag set.
| CI1 | Cache yarn/pip installs | DevOps | P2 | M | `.github/workflows/ci.yml` | CI uses caches to reduce install times while respecting immutable installs.
| DOC1 | Keep mock JSON schema documented | Docs | P3 | XS | `docs/README.md` or new schema doc | Document expected keys for each collection to simplify maintenance.

