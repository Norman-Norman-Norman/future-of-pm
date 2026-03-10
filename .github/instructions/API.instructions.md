---
description: "Use when working on Express API routes, models, seed data, or API tests. Covers route structure, Swagger JSDoc, model definitions, and Vitest testing patterns."
applyTo: "api/**"
---
# API Conventions

## Route Structure

Each route file follows this exact pattern (see `api/src/routes/branch.ts`):

1. **Swagger JSDoc block** at the top — tag definition, then full CRUD endpoint docs referencing `$ref` schemas
2. **Imports**: `express`, the model interface, seed data
3. **In-memory array**: `let items: Model[] = [...seedItems]`
4. **Exported reset function**: `export const resetItems = () => { items = [...seedItems]; }` — used by tests
5. **CRUD handlers**: POST (201), GET all (200), GET by ID (200/404), PUT (200/404), DELETE (204/404)
6. **Default export**: `export default router`

## Model Definitions

- Define in `api/src/models/` as a TypeScript `interface`
- Include a Swagger `@openapi components.schemas` JSDoc block above the interface
- Mark required fields in the schema: `required: [field1, field2]`

## Seed Data

- Add seed records to `api/src/seedData.ts`
- Export as a named array (e.g., `export const branches: Branch[] = [...]`)
- Provide at least 2 seed records

## Testing

- Framework: Vitest + Supertest
- File naming: `<route>.test.ts` alongside the route file
- Setup pattern:
  ```typescript
  import { describe, it, expect, beforeEach } from 'vitest';
  import request from 'supertest';
  import express from 'express';
  import router, { resetItems } from './items';

  let app: express.Express;

  describe('Item API', () => {
    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.use('/items', router);
      resetItems();
    });
  });
  ```
- Cover: POST (201), GET all (200), GET by ID (200), PUT (200), DELETE (204), 404 for missing resources
- Assertions: `expect(response.status).toBe()`, `toEqual()`, `toMatchObject()`

## Registering Routes

In `api/src/index.ts`, add: `app.use('/api/<plural-noun>', router)`
