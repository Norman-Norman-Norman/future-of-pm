# Feature Specifications

This folder contains detailed specifications for all OctoCAT Supply features. Each spec documents both the **current state** and **proposed enhancements** for a product area.

## Spec Index

| Spec | Product Area | Status | Top Priority Issue |
|------|-------------|--------|-------------------|
| [catalog-management.md](catalog-management.md) | Products, search, filtering, reviews | Existing + Enhancements | #36, #47 |
| [order-management.md](order-management.md) | Cart, checkout, orders, payments | Critical Gaps | #44 (Checkout) |
| [logistics.md](logistics.md) | Deliveries, tracking, fulfillment | API Only, No Frontend | #14, #2 |
| [administration.md](administration.md) | Auth, RBAC, branches, security | Critical Security Gaps | #1, #3, #5 |
| [frontend-shell.md](frontend-shell.md) | Navigation, theming, UX shell | Existing | #50, #37 |
| [customer-experience.md](customer-experience.md) | Reviews, loyalty, retention | Planned | #41, #46 |
| [analytics-reporting.md](analytics-reporting.md) | Dashboards, KPIs, exports | Planned | #13 |

## Conventions
- Every feature must have a spec
- Specs document current state AND proposed enhancements
- Each spec references GitHub issues bidirectionally
- Status: `Existing` → `Existing + Enhancements Planned` → `In Progress` → `Shipped`
