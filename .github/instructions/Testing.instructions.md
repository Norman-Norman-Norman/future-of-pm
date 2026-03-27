---
description: "Use when working anywhere in the OctoCAT Supply app where testing strategy, test creation, or regression coverage is relevant. Covers Martin Fowler style test pyramid guidance for API, frontend, and cross-system behavior."
applyTo: "{api,frontend}/**"
---
# Testing Conventions

Use a Martin Fowler style test pyramid for this repository.

This is a hard rule for this app unless the user explicitly asks for a different testing strategy.

## Core Rule

- Prefer many fast, deterministic tests close to the code.
- Add a smaller number of integration tests around boundaries and contracts.
- Keep end-to-end coverage narrow and intentional.
- Do not solve gaps with a large top-heavy UI or browser test suite when a lower-level test would prove the behavior more reliably.

## Test Distribution For This App

### API

- Default to route-level integration tests with Vitest, Supertest, and an Express app wired to the real router.
- Treat these as the primary safety net for backend behavior because the API is thin, uses in-memory data, and exposes business behavior through HTTP routes.
- Reset seed-backed state in `beforeEach()` using the exported `reset*()` helper from the route module.
- Cover happy paths, not-found cases, mutation behavior, and any bug regression at the HTTP boundary.
- Prefer asserting status codes, response shape, and persisted in-memory changes over mocking internal implementation details.

### Frontend

- Prefer targeted component or feature tests for user-visible behavior, state transitions, and error handling.
- Test what the user can observe: rendered output, loading states, validation messages, navigation, and API-driven state changes.
- Avoid snapshot-heavy tests and avoid asserting internal hook wiring, implementation-only state, or Tailwind class trivia unless the class itself is the behavior.
- Add frontend tests when a behavior has meaningful user or business risk, especially around cart, authentication state, and critical flows.

### End-to-End

- Use end-to-end or browser-driven tests sparingly for a small number of critical journeys that cross frontend and API boundaries.
- Only add one when lower-level tests would not credibly cover the risk.
- Keep them stable, short, and focused on critical path confidence rather than exhaustive permutations.

## Fowler Pattern In Practice

- For a bug fix, add the lowest-level regression test that proves the bug is fixed.
- For a new API route, start with route integration tests before considering broader system tests.
- For a frontend feature, add targeted behavior tests before proposing browser automation.
- For a workflow spanning multiple layers, use a combination of route tests plus a minimal critical-path UI test rather than many duplicated checks at every layer.

## What Good Tests Look Like Here

- Deterministic: no hidden time, random, network, or environment dependencies.
- Isolated: each test sets up its own app state and leaves no residue.
- Behavioral: verifies externally visible outcomes, not internal code structure.
- Cheap to run: optimized for frequent execution during local development and pull request review.
- Specific: each test has a single reason to fail.

## Avoid These Patterns

- Do not default to browser tests for simple route or state logic.
- Do not over-mock routers, request objects, or data arrays when the real route can be exercised cheaply.
- Do not add tests that merely restate implementation details without protecting behavior.
- Do not create broad snapshot baselines as a substitute for meaningful assertions.
- Do not duplicate the same assertion at unit, integration, and end-to-end layers unless each layer is covering a distinct risk.

## API Test Template Expectations

- Follow the existing `api/src/routes/branch.test.ts` pattern.
- Use `beforeEach()` to build a fresh Express app and reset route state.
- Cover CRUD behavior and 404 handling for resource-oriented routes.
- Add focused regression tests for edge cases when route behavior changes.

## Decision Rule For Copilot

When asked to add tests or implement behavior that should be covered by tests, choose the lowest-cost test that gives credible confidence:

1. Start with a narrow behavioral test close to the changed code.
2. Escalate to an integration test when the risk lives at a boundary.
3. Use end-to-end coverage only when the user journey itself is the risk.

If proposing a higher-level test, explain why lower-level tests are insufficient.