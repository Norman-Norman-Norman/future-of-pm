# Spec: Order Management & Checkout

| Field | Value |
|-------|-------|
| Status | Existing (API) + Critical Frontend Gaps |
| Last Updated | March 10, 2026 |
| GitHub Issues | #44, #45, #9, #48 |
| RICE Score | 10.0 (checkout is the #1 revenue blocker) |

## Overview
Order Management covers the complete purchase lifecycle: shopping cart, checkout flow, payment processing, order confirmation, order history, and repeat ordering. The cart was recently built but checkout is non-functional — this is the single biggest revenue blocker. Without checkout, OctoCAT Supply literally cannot generate online revenue.

## Current State

### API Endpoints
| Method | Route | File | Description |
|--------|-------|------|-------------|
| GET | /api/orders | `api/src/routes/order.ts` | Returns all orders |
| GET | /api/orders/:id | `api/src/routes/order.ts` | Get order by orderId |
| POST | /api/orders | `api/src/routes/order.ts` | Create order |
| PUT | /api/orders/:id | `api/src/routes/order.ts` | Replace order |
| DELETE | /api/orders/:id | `api/src/routes/order.ts` | Delete order |
| GET | /api/order-details | `api/src/routes/orderDetail.ts` | Returns all order details |
| GET | /api/order-details/:id | `api/src/routes/orderDetail.ts` | Get by orderDetailId |
| POST | /api/order-details | `api/src/routes/orderDetail.ts` | Create order detail |
| PUT | /api/order-details/:id | `api/src/routes/orderDetail.ts` | Replace order detail |
| DELETE | /api/order-details/:id | `api/src/routes/orderDetail.ts` | Delete order detail |

### Data Models
| Model | File | Fields | Relationships |
|-------|------|--------|---------------|
| Order | `api/src/models/order.ts` | orderId, branchId, orderDate, name, description, status | belongs to Branch, has many OrderDetails |
| OrderDetail | `api/src/models/orderDetail.ts` | orderDetailId, orderId, productId, quantity, unitPrice, notes | belongs to Order, references Product |

### Frontend Components
| Component | File | Description |
|-----------|------|-------------|
| Cart | `frontend/src/components/entity/cart/Cart.tsx` | Shopping cart with quantity editing, coupon code (validates "techconnect"), order summary. **"Proceed To Checkout" button has NO handler.** |
| CartContext | `frontend/src/context/CartContext.tsx` | Client-side only cart state (items, addToCart, removeFromCart, updateQuantity, clearCart). **Cart is lost on refresh.** |

### Seed Data
- 2 orders: "Q2 Feline Tech Refresh" (pending, branch 1), "Cat Enrichment Bundle" (processing, branch 2)
- 3 order details linking to products with quantities and unit prices

## Gap Analysis

| Gap | Severity | Source |
|-----|----------|--------|
| **No checkout flow** — "Proceed To Checkout" button does nothing | **CRITICAL** | Revenue = $0 without checkout. Baymard: 35% conversion uplift from checkout optimization. |
| **No payment processing** — no payment gateway integration | **CRITICAL** | Cannot complete transactions |
| **No guest checkout** — 19% of users abandon forced account creation | **CRITICAL** | Baymard Institute 2025 — guest checkout must be the most prominent option |
| **Cart not persisted** — lost on page refresh (React state only) | **HIGH** | Standard practice is localStorage or server-side persistence |
| **No order confirmation** — no receipt, no email, no confirmation page | **HIGH** | Fundamental e-commerce requirement |
| **No order history** — customers can't see past orders | **HIGH** | Drives repeat purchases and trust |
| **No order tracking** — no status updates for customers | **HIGH** | Amazon, Shopify, all competitors show real-time tracking |
| **No quick reorder** — can't repeat previous orders | **HIGH** | Shopify: AMR Hair saw 77% AOV rise with quick reorder |
| **No abandoned cart recovery** — 70% of carts are abandoned | **HIGH** | Cart recovery emails recover 5-15% of revenue |
| **No B2B payment terms** — no PO numbers, net-30/60/90 | **HIGH** | 83% of B2B buyers abandon without payment terms |
| **No subscription/auto-reorder** | **MEDIUM** | Amazon Subscribe & Save model drives recurring revenue |
| **No order workflow state machine** — status changes are unvalidated | **MEDIUM** | Issue #9 |

## Proposed Enhancements

| Priority | Enhancement | RICE Score | GitHub Issue |
|----------|-------------|------------|-------------|
| P0 | Complete checkout flow (shipping, payment, confirmation) | 10.0 | #44 |
| P0 | Cart persistence (localStorage + server-side) | 8.0 | Part of #44 |
| P0 | Guest checkout option | 8.0 | Part of #44 |
| P1 | Order confirmation page + email | 7.5 | — |
| P1 | Order history & status tracking for customers | 7.0 | — |
| P1 | Quick reorder / one-click repeat | 7.2 | #45 |
| P1 | B2B payment terms (PO, net-30/60/90) | 6.5 | — |
| P1 | Abandoned cart recovery emails | 6.0 | — |
| P2 | Subscription / auto-reorder | 3.6 | #48 |
| P2 | Order workflow state machine | 5.1 | #9 |

## User Stories
- As a **first-time buyer**, I want to complete my purchase without creating an account so that I don't abandon my cart due to registration friction.
- As a **repeat customer**, I want to reorder my previous purchases with one click so that I save time on routine orders.
- As a **corporate buyer**, I want to enter a PO number and select net-30 payment terms so that my purchase complies with our procurement policy.
- As a **mobile shopper**, I want a streamlined checkout that works on my phone so that I can order from anywhere.
- As a **rush order customer**, I want to see estimated delivery dates during checkout so that I know exactly when I'll receive my order.
- As a **budget buyer**, I want my cart to persist between sessions so that I don't lose my carefully curated selections.

## Acceptance Criteria
- [ ] Given a cart with items, when the user clicks "Proceed To Checkout", then they see a multi-step checkout form (shipping → payment → review → confirm)
- [ ] Given checkout step 1, when the user enters a shipping address, then it's validated and saved
- [ ] Given checkout step 2, when the user enters payment info, then it's processed securely (or PO # for B2B)
- [ ] Given a completed order, when the user confirms, then they see an order confirmation page with order number
- [ ] Given a logged-in user, when they visit "My Orders", then they see their order history with statuses
- [ ] Given a returning user, when they reload the page, then their cart items are still present

## Technical Notes
- Cart persistence: Save to localStorage immediately; sync to server-side cart endpoint when user is authenticated
- Checkout: Create a `/api/checkout` endpoint that atomically creates Order + OrderDetails from cart contents
- Payment: Start with mock payment (demo app); design for Stripe/PayPal integration later
- Guest checkout: Use email-only identification; offer account creation post-purchase
- Order tracking: Extend Order model with `trackingNumber`, `estimatedDelivery`, `shippingAddress` fields

## References
- Baymard Institute — 70% cart abandonment rate; 35% conversion gain from checkout optimization
- Baymard Institute — 19% of users abandon due to forced account creation
- Shopify B2B — 83% of B2B buyers abandon without payment terms; AMR Hair 77% AOV rise with quick reorder
- McKinsey B2B Pulse — 39% of B2B buyers comfortable placing $500K+ self-service orders
