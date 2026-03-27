# Project Guidelines

## Overview

OctoCAT Supply is a B2B supply chain management demo app. TypeScript monorepo with two workspaces: `api/` (Express REST API) and `frontend/` (React SPA).

## Architecture

- **API**: Express 4 + TypeScript, in-memory seed data (no external DB), Swagger/OpenAPI via JSDoc annotations
- **Frontend**: React 18 + Vite + Tailwind CSS, React Query v3 for server state, React Router DOM 7, Context API for auth/theme
- **Monorepo**: npm workspaces (`api`, `frontend`) managed from root `package.json`
- **Deployment**: Azure Container Apps with Docker, Bicep IaC, GitHub Actions CI/CD. Co-hosted model — frontend `dist/` is served from the API container in production.

**Data model** (8 entities): Headquarters → Branch → Order → OrderDetail → Product, Supplier → Delivery → OrderDetailDelivery. See [docs/architecture.md](../docs/architecture.md) for ERD and full details.

## Build and Test

```bash
npm install                    # Install all workspace dependencies
npm run dev                    # Run API + Frontend concurrently (API :3000, Frontend :5137)
npm run dev:api                # API only with tsx hot reload
npm run dev:frontend           # Vite dev server only
npm run build                  # Build all workspaces
npm run test                   # Run all tests (Vitest)
npm run test:api               # API tests only
npm run lint                   # Lint frontend (ESLint flat config)
```

## Code Style

- **TypeScript strict mode** — both API and frontend tsconfigs enforce `strict: true`
- **Env vars**: `UPPER_SNAKE_CASE`. Key vars: `PORT`, `API_CORS_ORIGINS`, `CODESPACE_NAME`, `API_HOST`, `API_PORT`
- **API patterns**: See `.github/instructions/API.instructions.md` for route structure, model definitions, seed data, and testing conventions
- **Frontend patterns**: See `.github/instructions/Frontend.instructions.md` for component structure, data fetching, styling, and routing conventions

## Conventions

- **API endpoints**: RESTful, plural nouns — `/api/branches`, `/api/orders`, `/api/products`
- **Swagger UI**: Available at `/api-docs` in dev. JSON export at `/api-docs.json`
- **Node requirement**: `>=18`

## Pitfalls

- **In-memory data**: All API data lives in arrays — no DB. Data resets on server restart. Each route exports a `reset*()` function used by tests in `beforeEach`
- **Auth is client-side only**: `AuthContext` checks email domain (`@github.com` → admin). No backend validation — fine for demos, not production
- **CORS in dev**: Defaults allow `localhost:5137` and any `*.app.github.dev` Codespace domain. Set `API_CORS_ORIGINS` in production
- **No frontend tests**: Only API routes have Vitest tests. React components are untested

## Documentation

- [docs/full-spec.md](../docs/full-spec.md) — Complete functional specification
- [docs/specs/](../docs/specs/) — Feature specs: catalog, orders, logistics, analytics, administration, customer experience
- [docs/architecture.md](../docs/architecture.md) — System design, ERD, component architecture
- [docs/deployment.md](../docs/deployment.md) — Azure deployment guide
- [docs/customer-pov/](../docs/customer-pov/) — 38+ buyer persona evaluations and competitive analyses

## GitHub Workflow

- **Upstream repo**: `Norman-Norman-Norman/future-of-pm` (`https://github.com/Norman-Norman-Norman/future-of-pm.git`)
- **Commits & pushes**: Always push to `upstream` (not `origin`). Use `git push upstream HEAD`
- **Issues**: Create on the upstream repo: `Norman-Norman-Norman/future-of-pm`
- **Pull requests**: Create on the upstream repo: `Norman-Norman-Norman/future-of-pm`
- Use the `commit-and-push` skill for conventional commits (push target: `upstream`)
- Use the `create-pull-request` skill for comprehensive PRs
- Use the `create-github-issue` skill for structured issue creation
