---
description: "Use when working on React components, frontend styling, API integration, or frontend routing. Covers React Query, Tailwind theming, and API config patterns."
applyTo: "frontend/**"
---
# Frontend Conventions

## Components

- Functional components with hooks — no class components
- PascalCase filenames (e.g., `Products.tsx`, `Navigation.tsx`)
- Default export for page/feature components
- Entity components live in `frontend/src/components/entity/<name>/`
- Shared components live in `frontend/src/components/`

## Data Fetching

Use React Query v3 with axios:

```typescript
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';

const fetchItems = async (): Promise<Item[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.items}`);
  return data;
};

// In component:
const { data: items, isLoading, error } = useQuery('items', fetchItems);
```

- Use endpoint constants from `frontend/src/api/config.ts` — never hardcode URLs
- When adding a new entity, add its endpoint to the `api.endpoints` object in `config.ts`

## Styling

- Tailwind utility classes only — no custom CSS unless unavoidable
- Custom palette: primary `#76B852`, dark `#0A0A0A`, light `#F5F5F5`, accent `#8BC34A`
- Dark mode: use `darkMode` from `useTheme()` context, toggle classes conditionally:
  ```tsx
  const { darkMode } = useTheme();
  <div className={`${darkMode ? 'bg-dark text-white' : 'bg-gray-100 text-gray-900'}`}>
  ```
- Loading state: centered spinner with `animate-spin border-primary`
- Error state: red text centered in container

## Routing

- React Router DOM 7 with `BrowserRouter` in `App.tsx`
- Add new routes as `<Route path="/path" element={<Component />} />`
- Navigation links go in `frontend/src/components/Navigation.tsx`

## Context

- **Auth**: `useAuth()` from `AuthContext` — provides `isLoggedIn`, `isAdmin`, `logout()`
- **Theme**: `useTheme()` from `ThemeContext` — provides `darkMode`, `toggleTheme()`
