# Spec: Frontend Shell & UX

| Field | Value |
|-------|-------|
| Status | Existing |
| Last Updated | March 10, 2026 |
| GitHub Issues | #37, #50, #40 |
| RICE Score | 6.0 |

## Overview
The Frontend Shell covers the application layout, navigation, routing, theming (dark/light mode), error handling, and overall user experience. This is the frame that all features live inside.

## Current State

### Frontend Components
| Component | File | Description |
|-----------|------|-------------|
| App | `frontend/src/App.tsx` | Root component. Provider hierarchy: Auth → Theme → Cart → Router |
| Navigation | `frontend/src/components/Navigation.tsx` | Fixed top navbar with logo, links (Home, Products, About), admin dropdown, cart badge, theme toggle, login/logout |
| Welcome | `frontend/src/components/Welcome.tsx` | Landing page with hero image, "Explore Products" CTA, partner carousel, category cards |
| About | `frontend/src/components/About.tsx` | Static about page with mission statement |
| Footer | `frontend/src/components/Footer.tsx` | 4-column footer. **All links are href="#" placeholders** |
| Login | `frontend/src/components/Login.tsx` | Login form (email + password) |

### Routes
| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | Welcome | No |
| `/about` | About | No |
| `/products` | Products | No |
| `/cart` | Cart | No |
| `/login` | Login | No |
| `/admin/products` | AdminProducts | Yes (client-side check) |

### Context Providers
| Provider | File | Purpose |
|----------|------|---------|
| AuthProvider | `frontend/src/context/AuthContext.tsx` | Login state, admin detection |
| ThemeProvider | `frontend/src/context/ThemeContext.tsx` | Dark/light mode toggle, localStorage persistence |
| CartProvider | `frontend/src/context/CartContext.tsx` | Shopping cart state |

## Gap Analysis

| Gap | Severity | Source |
|-----|----------|--------|
| All footer links are non-functional (`href="#"`) | **LOW** | Codebase Analyst |
| No 404 page | **MEDIUM** | Issue #37 |
| No frontend error handling / error boundaries | **MEDIUM** | Issue #50 |
| No loading skeleton screens | **LOW** | UX best practice |
| No breadcrumb navigation | **LOW** | Helps with deep navigation |
| Mobile responsiveness needs testing | **MEDIUM** | 60%+ traffic is mobile |

## Proposed Enhancements

| Priority | Enhancement | RICE Score | GitHub Issue |
|----------|-------------|------------|-------------|
| P1 | Frontend error boundaries & error pages | 6.0 | #50 |
| P1 | Fix footer links (connect to real pages or remove) | 5.0 | #37 |
| P2 | Mobile responsive audit & fixes | 4.0 | — |
| P2 | 404 page | 3.0 | #37 |
| P3 | Skeleton loading screens | 2.0 | — |

## Technical Notes
- Error boundaries: Wrap App in React ErrorBoundary component
- Footer: Either create real pages (FAQ, Contact, Terms) or remove dead links
- Mobile: Tailwind responsive by default, but needs touch-target audit

## References
- Baymard Institute — Mobile UX best practices
- BigCommerce — 60%+ of B2B buyers research on mobile
