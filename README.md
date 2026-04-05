# Subscription Intelligence Studio

Subscription Intelligence Studio is a polished, public-presentable take-home product for the RevenueCat Agentic AI Developer & Growth Advocate assignment. It combines a founder-friendly analytics dashboard, a developer console for request exploration, and a deterministic insight engine into one cohesive Next.js experience.

## What It Includes

- Marketing landing page with live UI preview and dual-audience positioning
- Executive dashboard with KPI cards, filters, charts, and a "what changed" panel
- Developer console with validated request builder, JSON viewer, and copyable TypeScript and curl snippets
- Natural-language insights page backed by deterministic prompt parsing and rule-based reasoning
- Automatic demo mode fallback when RevenueCat credentials are absent
- Typed fixtures, strong docs, unit/component/integration/e2e tests, and deployment-ready scripts

## Screenshots

- Screenshots are in the `docs/screenshots` folder:
- `docs/screenshots/landing.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/console.png`
- `docs/screenshots/insights.png`

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Recharts
- TanStack Query
- Zod
- React Hook Form
- Vitest + React Testing Library
- Playwright
- ESLint + Prettier

## Routes

- `/` landing page
- `/studio/dashboard` executive dashboard
- `/studio/console` developer console
- `/studio/insights` natural-language insights
- `/api/studio/dashboard` dashboard data endpoint
- `/api/studio/query` developer console endpoint
- `/api/studio/insights` deterministic insights endpoint

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment Variables

The app automatically runs in demo mode when `REVENUECAT_API_KEY` or `REVENUECAT_PROJECT_ID` is missing.

```env
REVENUECAT_API_KEY=
REVENUECAT_PROJECT_ID=
REVENUECAT_API_BASE_URL=https://api.revenuecat.com/v2
REVENUECAT_OVERVIEW_PATH_TEMPLATE=/projects/{projectId}/metrics/overview
REVENUECAT_CHART_PATH_TEMPLATE=/projects/{projectId}/charts/{metric}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Demo Mode

- Demo mode is the default local experience
- It uses typed local fixtures that mimic subscription analytics behavior
- All tests are designed to run against demo mode for stability
- The studio surfaces a clear banner whenever demo mode is active

## Architecture

```
app/
components/
features/
hooks/
lib/
types/
tests/
e2e/
content/
```

### Core Design Decisions

- Server-side adapters isolate RevenueCat credentials and live request logic
- A deterministic demo adapter powers all primary product flows without secrets
- Pages are split into focused feature modules to keep route files thin
- Shared UI primitives keep interaction patterns consistent across marketing and app surfaces
- The insight engine uses parsing and metric-based heuristics instead of an external LLM for reliability and testability

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Deployment Notes

- Deploy on Vercel or any Node-compatible platform
- Set the RevenueCat environment variables only if live mode is desired
- Without credentials, the deployment remains fully demoable using the local fixture layer
