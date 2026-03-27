# Spec: Catalog Management

| Field | Value |
|-------|-------|
| Status | Existing + Major Enhancements Planned |
| Last Updated | March 10, 2026 |
| GitHub Issues | #36, #41, #42, #47 |
| RICE Score | 9.0 (highest sub-feature) |

## Overview
Catalog Management covers the product catalog, supplier relationships, product discovery (search & filtering), product reviews & ratings, and product bundling. This is the core revenue-generating surface of OctoCAT Supply — if customers can't find and evaluate products, they can't buy them.

## Current State

### API Endpoints
| Method | Route | File | Description |
|--------|-------|------|-------------|
| GET | /api/products | `api/src/routes/product.ts` | Returns all products |
| GET | /api/products/:id | `api/src/routes/product.ts` | Get product by productId |
| POST | /api/products | `api/src/routes/product.ts` | Create product |
| PUT | /api/products/:id | `api/src/routes/product.ts` | Replace product |
| DELETE | /api/products/:id | `api/src/routes/product.ts` | Delete product |
| GET | /api/suppliers | `api/src/routes/supplier.ts` | Returns all suppliers |
| GET | /api/suppliers/:id | `api/src/routes/supplier.ts` | Get supplier by supplierId |
| POST | /api/suppliers | `api/src/routes/supplier.ts` | Create supplier |
| PUT | /api/suppliers/:id | `api/src/routes/supplier.ts` | Replace supplier |
| DELETE | /api/suppliers/:id | `api/src/routes/supplier.ts` | Delete supplier |

### Data Models
| Model | File | Fields | Relationships |
|-------|------|--------|---------------|
| Product | `api/src/models/product.ts` | productId, supplierId, name, description, price, sku, unit, imgName, discount? | belongs to Supplier |
| Supplier | `api/src/models/supplier.ts` | supplierId, name, description, contactPerson, email, phone | has many Products |

### Frontend Components
| Component | File | Description |
|-----------|------|-------------|
| Products | `frontend/src/components/entity/product/Products.tsx` | Product catalog grid with basic text search, quantity selectors, add-to-cart, product detail modal, promo popup |
| ProductForm | `frontend/src/components/entity/product/ProductForm.tsx` | Modal form for creating/editing products (admin) |
| AdminProducts | `frontend/src/components/admin/AdminProducts.tsx` | Admin product management table with sorting, edit/delete |

### Seed Data
- 13 products across 3 suppliers (PurrTech Innovations, WhiskerWare Systems, CatNip Creations)
- Products range from $29.99 to $199.99
- 4 products have 25% discount
- Products include images (imgName field)

## Gap Analysis

| Gap | Severity | Source |
|-----|----------|--------|
| No faceted filtering (category, price range, supplier, discount) | **Critical** | BigCommerce B2B Trends 2026 — product discovery is #1 driver of conversion |
| No product categories/taxonomy | **Critical** | Every competitor has hierarchical categories; Baymard Institute shows 40% discovery drop without |
| Basic text search only (no autocomplete, no semantic search, no spell correction) | **Critical** | Amazon attributes 35% of revenue to AI-powered search + recommendations |
| No product reviews or ratings | **High** | Products with reviews convert at 3.5x rate — Forrester 2025 |
| No product recommendations ("Also Bought", "Similar Products") | **High** | McKinsey: personalization drives 10-15% revenue lift |
| No product comparison feature | **Medium** | Standard for complex/technical products |
| No wishlist/favorites | **Medium** | Reduces return-visit conversion |
| No product bundles | **Medium** | Standard upselling mechanism |
| No pagination on product listings | **Low** | Only 13 products currently, but won't scale |
| N+1 query pattern in AdminProducts (fetches supplier per product) | **Low** | Performance issue at scale |

## Proposed Enhancements

| Priority | Enhancement | RICE Score | GitHub Issue |
|----------|-------------|------------|-------------|
| P0 | Product search with autocomplete & spell correction | 9.0 | #47 |
| P0 | Product categories & faceted filtering (price, category, supplier, discount) | 9.0 | #36 |
| P1 | Product reviews & ratings system | 7.5 | #41 |
| P1 | AI-powered product recommendations ("Frequently bought together") | 7.0 | — |
| P2 | Wishlist / Favorites | 5.0 | #43 |
| P2 | Product bundles | 4.5 | #42 |
| P2 | Product comparison | 3.5 | — |
| P3 | Pagination & infinite scroll | 2.0 | Part of #6 |

## User Stories
- As a **first-time buyer**, I want to search for products by name or keyword so that I can quickly find what I need without scrolling through the full catalog.
- As a **repeat customer**, I want to filter products by category, price range, and supplier so that I can narrow down my options efficiently.
- As a **budget-conscious buyer**, I want to see product reviews and ratings so that I can make informed purchasing decisions without guessing.
- As a **corporate buyer**, I want product recommendations based on my purchase history so that I can discover relevant products faster.
- As a **small business owner**, I want to save products to a wishlist so that I can build my order over time before committing to purchase.

## Acceptance Criteria
- [ ] Given a user on the products page, when they type in the search box, then autocomplete suggestions appear within 300ms
- [ ] Given a user browsing products, when they select category/price/supplier filters, then the product grid updates to show only matching products
- [ ] Given a product page, when a user views a product, then they see average star rating and review count
- [ ] Given a product page, when a user views a product, then they see "Frequently Bought Together" recommendations
- [ ] Given an authenticated user, when they click the heart/wishlist icon on a product, then it's saved to their wishlist

## Technical Notes
- Search implementation: Start with client-side filtering on existing GET /api/products response, then migrate to server-side search endpoint with query params
- Categories: Add `category` field to Product model; create a Category model for hierarchical taxonomy
- Reviews: New Review model (reviewId, productId, userId, rating, title, body, createdAt); new `/api/reviews` endpoints
- Recommendations: Start with "same supplier" and "same category" co-occurrence; evolve to collaborative filtering

## References
- BigCommerce B2B Trends 2026 — Product discovery and rich content are key conversion drivers
- McKinsey Personalization — 10-15% revenue lift from product recommendations
- Baymard Institute — Faceted filtering best practices and conversion impact
- Forrester 2025 — 79% of buyers trust peer reviews; products with reviews convert 3.5x higher
