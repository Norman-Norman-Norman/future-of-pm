# Build Guild: Zero to Agents — Product Management Edition

![OctoCAT Supply](./frontend/public/hero.png)

> **The base repository for the Build Guild "Zero to Agents" workshop series.**
> This version of the lab has been used to train over 100,000 engineers across GitHub, Microsoft, and partner organizations on how to move from basic Copilot usage to a fully governed, agentic product development workflow.

This is the **Product Management edition** of Zero to Agents. It goes beyond code generation to demonstrate how GitHub Copilot, custom agents, prompt files, instruction files, skills, and MCP integrations come together to run a complete product operating system — from customer research and feature specification through implementation, testing, documentation, and deployment — all inside a single GitHub repository.

The lab is built on top of **OctoCAT Supply**, a working B2B supply chain management application with a TypeScript monorepo, an Express REST API, a React SPA frontend, in-memory seed data, Swagger documentation, infrastructure-as-code for Azure, and over 80 custom Copilot agents representing product managers, test writers, codebase analysts, market researchers, and dozens of customer personas.

**Watch the talk:** [YouTube presentation](https://www.youtube.com/watch?v=TOAAKp9NYDw)

**Reference customization repo:** [customize-your-repo-with-github-copilot](https://github.com/microsoftnorman/customize-your-repo-with-github-copilot)

---

## Learning Outcomes

By the end of this lab, you will be able to:

1. **Customize Copilot for your repository** — Create and apply project-wide and scoped instruction files (`.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`) that shape how Copilot understands your codebase, your conventions, and your constraints.

2. **Build custom agents and chat modes** — Design specialized agents (`.github/agents/*.agent.md`) that embody specific roles — a product manager, a ruthless test writer, a warehouse manager persona, a first-time buyer — each with bounded responsibilities, domain knowledge, and tool access.

3. **Author reusable prompt files** — Write prompt files (`.github/prompts/*.prompt.md`) that automate repetitive multi-step workflows like documentation updates and test coverage audits, so that any engineer on the team can execute a governed workflow with a single slash command.

4. **Create and use skills** — Package domain-specific knowledge and multi-step procedures into skills (`.github/skills/*/SKILL.md`) that agents invoke automatically — commit-and-push with issue compliance, pull request creation with structured templates, GitHub issue creation from specs.

5. **Drive implementation from design artifacts** — Use Copilot Vision to interpret UI mockups (`docs/design/*.png`), generate implementation plans, scaffold React components, and wire up API routes — all grounded in the repository's custom instructions rather than generic patterns.

6. **Generate and improve test coverage** — Use the `@martin` test agent and the `Unit-Test-Coverage` prompt file to audit existing test gaps, generate route-level integration tests that follow the established `branch.test.ts` pattern, and verify coverage with `npm run test`.

7. **Run a governed agentic SDLC** — Execute the full product lifecycle — discovery, stakeholder feedback, specification, implementation, testing, documentation, commit, PR, and continuous improvement — where each phase has a designated agent, a human review gate, and an audit trail in GitHub.

8. **Understand the control boundaries** — Know where AI autonomy is appropriate (drafting, scaffolding, analysis, test generation) and where human judgment is required (prioritization, architectural exceptions, merge approval, production release).

---

## How This Lab Is Structured

The lab is organized as a progression. Each section builds on the previous one, moving you from foundational Copilot customization through to full agentic product management. You can run the entire sequence in order, or jump to the section that matches your current skill level.

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                    ZERO TO AGENTS PROGRESSION                       │
  │                                                                     │
  │   Lab 1: Instructions & Prompts                                     │
  │     └──► Lab 2: Custom Agents                                       │
  │            └──► Lab 3: Vision & Agentic Implementation              │
  │                   └──► Lab 4: Test Generation & Coverage            │
  │                          └──► Lab 5: Documentation & Governance     │
  │                                 └──► Lab 6: Full Product Management │
  └─────────────────────────────────────────────────────────────────────┘
```

---

## Lab 1: Create Custom Instructions and Prompt Files

**Learning outcome:** Understand how instruction files change Copilot's behavior and how prompt files automate multi-step workflows.

This activity is performed together as a group.

### 1.1 — Explore the codebase with Copilot

Before customizing anything, use Copilot's Ask Mode and Agent Mode to see how it responds to your codebase out of the box. This establishes a baseline so you can see the difference instructions make.

- Open GitHub Copilot Chat and try these prompts:
  - `Please give me details about the API of this project.`
  - `Are there any core features missing in my project?`
- Use Agent Mode to build and run the existing app:
  - `Please build and run my project so that I can see its existing state.`
  - Review the running store at `http://localhost:5137` (frontend) and `http://localhost:3000/api-docs` (Swagger UI).

### 1.2 — Create custom instruction files

Instruction files teach Copilot about your project's conventions, architecture, and constraints. They are Markdown files placed in `.github/` that Copilot reads automatically.

- Use the **Gear icon** in the GitHub Copilot Chat window and select **Generate Agent Instructions**.
- Create a **project-wide** instructions file:
  - File: `.github/copilot-instructions.md`
  - This file should describe the monorepo structure, key commands, coding conventions, and pitfalls that apply everywhere.
- Create an **API-scoped** instructions file:
  - File: `.github/instructions/API.instructions.md`
  - Sample prompt: `Please create an API Specific custom instructions set and save in #API.instructions.md`
  - This file should cover route structure, model definitions, seed data patterns, Swagger JSDoc, and Vitest testing conventions.

### 1.3 — Observe the difference

Ask Copilot the same questions you asked in step 1.1. Notice how the responses are now grounded in your project's actual patterns and conventions instead of generic TypeScript advice.

### 1.4 — Review existing prompt files

This repository ships with two prompt files in `.github/prompts/`:

| Prompt file | Purpose |
| --- | --- |
| `Unit-Test-Coverage.prompt.md` | Guided test coverage audit and generation for API routes |
| `documentation-update.prompt.md` | Automated documentation refresh across README, architecture, and build docs |

Review these files to understand the prompt file format. Execute one if you like — use the `/` slash command in Copilot Chat to invoke a prompt file.

---

## Lab 2: Review and Create Custom Agents (Chat Modes)

**Learning outcome:** Understand how custom agents scope Copilot's role, knowledge, and tool access to a specific job.

This activity is performed together as a group.

### 2.1 — Review existing agents

Browse the `.github/agents/` directory. This repository contains **84 custom agents** spanning five categories:

| Category | Examples | Count |
| --- | --- | --- |
| **Product and strategy** | `product-manager`, `backlog-analyst`, `market-researcher`, `codebase-analyst` | 5 |
| **Engineering** | `martin-test-writer` (ruthless test coverage), `ImplementationIdeas`, `copilotrepo` | 3 |
| **Internal personas** | `warehouse-manager`, `branch-manager`, `operations-director`, `procurement-officer`, `store-associate` | 5 |
| **Customer/shopper personas** | `first-time-buyer`, `wholesale-buyer`, `accessibility`, `luxury-cat-owner`, `mayor-humdinger`, and 60+ more | 65+ |
| **Skills** | `commit-and-push`, `create-pull-request`, `create-github-issue`, `issue-compliance`, `create-agent-skills` | 6 |

Each agent file (`.agent.md`) defines the agent's identity, domain expertise, tool access, and behavioral constraints. Open a few and read how they are structured.

### 2.2 — Create your own agent

Design a custom agent for a role that would be useful on your team. Think about:

- What role does this agent play? (QA lead? Security reviewer? Onboarding guide?)
- What files and context should it read?
- What tools should it have access to?
- What should it explicitly **not** do?

Create the file in `.github/agents/` following the pattern you observed.

---

## Lab 3: Requirements, Vision, and Agentic Implementation

**Learning outcome:** Use Copilot to drive implementation from design artifacts, specs, and product requirements using agents and vision.

### 3.1 — Implement a new product from a design mockup

This exercise demonstrates Copilot Vision — the ability to interpret images and translate them into code.

1. Open Agent Mode. Select a model that supports vision (Claude Sonnet 4 or similar).
2. Use the Mona figurine design mockup at `docs/design/MonaFigurine.png`.
3. Try this prompt:
   ```
   Using the image #file:MonaFigurine.png, create a new product offering on the
   OctoCAT Supply website. Price is $32.99, SKU is MONA-001, and description is
   "A beautiful handcrafted figurine inspired by the Mona Lisa."
   ```
4. Watch Copilot generate seed data, API route changes, and frontend components — all following the repository's custom instructions.
5. Review the changes. If a Pull Request was created, review it and merge the version you prefer.

### 3.2 — Implement a cart page from a design

1. Synchronize your branch with the latest main branch.
2. Start a new Agent Mode chat.
3. Drag the `docs/design/cart.png` file into the chat window.
4. Ask Copilot to implement a cart icon and cart page that displays items in the cart.
5. Review the implementation against the design mockup.

---

## Lab 4: Test Generation and Coverage Improvement

**Learning outcome:** Use Copilot agents and prompt files to audit test coverage, generate missing tests, and improve code quality.

### 4.1 — Audit current test coverage

The API has 8 route files but only 1 test file today. This is intentional — it gives you real gaps to work with.

| Route file | Test file | Status |
| --- | --- | --- |
| `api/src/routes/branch.ts` | `api/src/routes/branch.test.ts` | **Covered** |
| `api/src/routes/delivery.ts` | — | Missing |
| `api/src/routes/headquarters.ts` | — | Missing |
| `api/src/routes/order.ts` | — | Missing |
| `api/src/routes/orderDetail.ts` | — | Missing |
| `api/src/routes/orderDetailDelivery.ts` | — | Missing |
| `api/src/routes/product.ts` | — | Missing |
| `api/src/routes/supplier.ts` | — | Missing |

Frontend components have no automated tests.

Start by analyzing the gap:
- Sample prompt (Ask Mode): `Please analyze my current test coverage and identify any missing test cases.`

### 4.2 — Generate tests using the prompt file

Use the `Unit-Test-Coverage` prompt file to generate integration tests for the missing routes:

- Invoke: `/Unit-Test-Coverage` in Copilot Chat.
- Or ask directly: `Write route integration tests for the product and supplier routes following the branch.test.ts pattern.`

The test pattern to follow:
- Each test file co-locates with its route: `<route>.test.ts`
- `beforeEach` wires a fresh Express app and resets seed data via the route's exported `reset*()` function
- Tests cover CRUD operations (list all, get by ID, create, update, delete), 404 handling, and edge cases
- Assertions target status codes and response shape, not internal implementation

### 4.3 — Run tests and verify

```bash
npm run test          # All workspaces
npm run test:api      # API tests only
```

### 4.4 — Bonus: MCP-powered test execution

If you have the Playwright MCP server configured, ask Copilot to execute the tests through the MCP integration for a browser-driven verification experience.

---

## Lab 5: Documentation and Governance

**Learning outcome:** Use prompt files and agents to keep documentation synchronized with the codebase, and understand the governance model that makes agentic work auditable.

### 5.1 — Create a documentation update prompt

Use Copilot to create or complete a custom prompt file that automates documentation updates:

- Sample prompt: `Complete the prompt file to update the documentation of this project or the specified file mentioned by the user. Only update the prompt file, do not update any documentation.`

### 5.2 — Execute the documentation prompt

Run the prompt file to update documentation:
- Use the `/` slash command to invoke your prompt.
- Specify target files: `README.md`, `docs/architecture.md`, or let it update everything.

### 5.3 — Understand the governance model

This repository demonstrates that agentic development is auditable when the workflow is structured correctly. The key controls are:

**What agents can do vs. what humans must approve:**

| Activity | Agent assists with | Human decides |
| --- | --- | --- |
| Problem framing | Summaries, gap analysis, draft specs | Final prioritization and success criteria |
| Roadmap shaping | Milestone proposals, issue drafts, dependency mapping | Portfolio sequencing and tradeoff decisions |
| Implementation | Code changes, tests, docs, refactors | Final review, architectural exceptions, release signoff |
| Compliance support | Audit-friendly docs, rationale capture, traceability | Policy interpretation and risk acceptance |
| Deployment | Workflow generation, IaC drafting, environment docs | Secret management, approvals, production release |

---

## Lab 6: Full Product Management with Agents

**Learning outcome:** Run a complete governed SDLC using specialized agents — from discovery through deployment and continuous improvement.

This is what makes the Product Management edition different from the standard Zero to Agents lab. This section walks you through the full agent-assisted SDLC, showing how different agents own different phases and human review gates sit between them.

### Phase 1 — Discovery and Research

Use the `@product-manager` agent to analyze the product against specs and customer feedback:

```
Review the OctoCAT Supply product against the specs in docs/specs/ and the customer
feedback in docs/customer-pov/. Identify the three highest-value gaps for our next
quarter. For each gap, include the user problem, supporting evidence from the repo,
competitive risk, and a measurable success outcome.
```

Use `@codebase-analyst` for a technical inventory:

```
Produce a full inventory of the API routes, models, and frontend pages. For each
route, report whether it has test coverage, Swagger documentation, and seed data.
Flag any routes missing tests.
```

Use `@market-researcher` for competitive intelligence:

```
Research how Amazon Business, Chewy for Business, and PetSmart handle bulk ordering
and reorder workflows for B2B customers. Return a structured comparison with feature
gaps relevant to OctoCAT Supply.
```

### Phase 2 — Stakeholder Feedback (Persona Agents)

Pressure-test ideas against real user perspectives before committing to implementation. These persona agents respond **in character** with authentic priorities and concerns.

- `@marcus-chen-warehouse-manager` — Operations reality check
- `@sarah-mitchell-operations-director` — Executive lens and KPI priorities
- `@priya-sharma-branch-manager` — Branch-level operations and P&L concerns
- `@david-okafor-procurement-officer` — Supplier compliance and cost optimization
- `@jake-rodriguez-store-associate` — Frontline usability and daily workflow

Plus 65+ customer personas (first-time buyer, wholesale bulk buyer, accessibility-dependent shopper, luxury cat owner, budget-conscious buyer, mobile-only shopper, Mayor Humdinger, and many more) for e-commerce feature evaluation.

### Phase 3 — Specification and Planning

Use `@product-manager` to turn validated ideas into scoped work:

```
Create a complete feature spec for a bulk reorder workflow. Include the user problem,
target personas, proposed UX flow, API changes, data model impact, acceptance criteria,
risks, and a breakdown into GitHub issues sized for individual pull requests.
```

Use `@backlog-analyst` for backlog health:

```
Scan all open GitHub issues. Cross-reference them against the specs in docs/specs/
and the current codebase. Report which issues have specs, which are duplicates, which
are stale, and which are missing acceptance criteria.
```

### Phase 4 — Implementation

Use the default agent with repository instructions to implement scoped changes:

```
Implement the supplier rating feature described in issue #42. Follow the repository
instructions in .github/instructions/API.instructions.md. Add the route, model, seed
data, and Swagger docs. Do not modify existing routes.
```

Use `@implementation-ideas` to explore multiple approaches before committing.

### Phase 5 — Testing

Use `@martin` — the ruthless test writer — to audit gaps and generate tests:

```
Audit the API test coverage. For every route file in api/src/routes/, report whether
a test file exists, what behaviors are covered, and what gaps remain. Prioritize the
gaps by defect risk and propose the exact tests to add.
```

### Phase 6 — Documentation and Review

Use the `documentation-update` prompt file to sync docs with code. Use `@product-manager` for a review-board risk summary on pull requests.

### Phase 7 — Commit, PR, and Deployment

Use the built-in skills:

- **commit-and-push** — Runs all tests, creates a conventional commit message tied to the related issue, and pushes.
- **create-pull-request** — Creates a comprehensive PR with summary, rationale, issue links, test results, and reviewer guidance.
- **issue-compliance** — Enforces that every commit links to a GitHub issue.

### Phase 8 — Continuous Improvement

Use persona agents to evaluate shipped features and feed findings back into the next cycle. Use `@copilotrepo` to audit and improve the agent governance configuration itself.

### SDLC Phase Map

```
  Phase                  Primary Agent              Human Gate
  ─────────────────────  ─────────────────────────  ──────────────────────
  Discovery              @product-manager           Prioritization approval
  Stakeholder feedback   Persona agents             Feedback triage
  Specification          @product-manager           Spec sign-off
  Implementation         Default agent              Code review
  Testing                @martin                    Test review + merge
  Documentation          Default agent              Doc review
  Commit and PR          Skills                     PR approval
  Continuous improvement Persona agents             Roadmap update
```

---

## The Product: OctoCAT Supply

The lab is built on a working B2B supply chain management application with two workspaces:

- **`api/`** — Express 4 REST API in TypeScript with in-memory seed data, Swagger/OpenAPI via JSDoc, 8 route files covering headquarters, branches, orders, products, suppliers, deliveries, and fulfillment relationships.
- **`frontend/`** — React 18 SPA with Vite, Tailwind CSS, React Query v3, React Router DOM 7, and Context API for auth and theme state.

### Data Model

```
  Headquarters
    └── Branch
          └── Order
                └── OrderDetail ──► Product
                      └── OrderDetailDelivery
                            └── Delivery ──► Supplier
```

Eight entities: **Headquarters** → **Branch** → **Order** → **OrderDetail** → **Product**, **Supplier** → **Delivery** → **OrderDetailDelivery**. See [docs/architecture.md](./docs/architecture.md) for the full ERD and component architecture.

### Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Query, React Router |
| Backend | Express 4, TypeScript, Swagger/OpenAPI, Vitest, Supertest |
| Infrastructure | Docker, Azure Container Apps, Bicep IaC, GitHub Actions |
| AI Tooling | GitHub Copilot, 84 custom agents, prompt files, skills, MCP integrations |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- VS Code with GitHub Copilot extension

### Install and Run

```bash
npm install                    # Install all workspace dependencies
npm run dev                    # Run API + Frontend concurrently
                               #   API:      http://localhost:3000
                               #   Swagger:  http://localhost:3000/api-docs
                               #   Frontend: http://localhost:5137
```

### Other Commands

```bash
npm run dev:api                # API only with hot reload
npm run dev:frontend           # Vite dev server only
npm run build                  # Build all workspaces
npm run test                   # Run all tests (Vitest)
npm run test:api               # API tests only
npm run lint                   # Lint frontend (ESLint)
```

Or use VS Code tasks: `Ctrl+Shift+P` → `Run Task` → `Build API` / `Build Frontend`.

### MCP Server Setup (Optional)

For Playwright-powered test execution and browser automation:
- `Ctrl+Shift+P` → `MCP: List servers` → `playwright` → `Start server`

---

## Repository Structure

```
.github/
  copilot-instructions.md          Project-wide Copilot instructions
  instructions/                    Scoped instruction files (API, Frontend, Testing)
  agents/                          84 custom agent definitions
  prompts/                         Reusable prompt files
  skills/                          Packaged multi-step workflows
api/
  src/routes/                      8 Express route files + 1 test file (gap: 7 missing)
  src/models/                      TypeScript model definitions
  src/seedData.ts                  In-memory seed data (resets on restart)
frontend/
  src/                             React components, context, API integration
  public/                          Product images and static assets
docs/
  architecture.md                  System design and ERD
  full-spec.md                     Complete functional specification
  specs/                           Feature specifications by domain
  customer-pov/                    38+ customer persona evaluations
  design/                          UI mockups (MonaFigurine, cart, main, footer)
infra/
  main.bicep                       Azure infrastructure as code
  resources.bicep                  Resource definitions
```

---

## Known Constraints and Intentional Gaps

This lab intentionally ships with gaps so you have real work to do. These are not bugs — they are learning opportunities.

| Gap | Why it exists | Lab that addresses it |
| --- | --- | --- |
| 7 of 8 API routes have no tests | Gives you real coverage to generate | Lab 4 |
| Frontend has no automated tests | Lets you design a test strategy from scratch | Lab 4 (stretch) |
| Cart page is not implemented | Design mockup is provided for vision-driven implementation | Lab 3 |
| Mona figurine product does not exist | Design mockup is provided for agentic product creation | Lab 3 |
| Documentation may drift from code | Prompt file exists to fix this automatically | Lab 5 |
| Auth is client-side only | Fine for demos; not production-grade | Acknowledged |
| Data is in-memory (no DB) | Resets on restart; suitable for workshops | Acknowledged |

---

## Supporting Documentation

- [Architecture](./docs/architecture.md) — System design, ERD, component architecture
- [Full Specification](./docs/full-spec.md) — Complete functional specification
- [Feature Specs](./docs/specs/) — Domain-specific specs for catalog, orders, logistics, analytics, administration, customer experience
- [Customer POV Research](./docs/customer-pov/) — 38+ buyer persona evaluations and competitive analyses
- [Build Guide](./docs/build.md) — Build and tooling instructions
- [Deployment Guide](./docs/deployment.md) — Azure Container Apps deployment

---

## Acknowledgements

**Build Guild Zero to Agents** was created by Joel Norman ([@microsoftnorman](https://github.com/microsoftnorman)).

**GitHub Universe 2025 demo contributors:** Dustin Ellis ([@ellisd4](https://github.com/ellisd4)), Harald Kirschner ([@digitarald](https://github.com/digitarald)), Joel Norman ([@microsoftnorman](https://github.com/microsoftnorman)).

**Demo testers:** Tina Saulsberry ([@Snuckles2](https://github.com/Snuckles2)).

This entire project — including the hero image, the product data, the 84 custom agents, and this README — was built using AI and GitHub Copilot inside a governed product workflow. The point is not that AI wrote the code. The point is that AI participated in a structured, auditable, human-approved product operating system.
