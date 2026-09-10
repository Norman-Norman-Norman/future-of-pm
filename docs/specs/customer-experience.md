# Spec: Customer Experience & Retention

| Field | Value |
|-------|-------|
| Status | Planned |
| Last Updated | March 10, 2026 |
| GitHub Issues | #41, #43, #46, #48 |
| RICE Score | 7.5 (highest sub-feature) |

## Overview
Customer Experience & Retention covers features designed to increase customer loyalty, repeat purchases, and lifetime value: product reviews, wishlist/favorites, loyalty programs, subscription ordering, abandoned cart recovery, and personalization. These are the features that drive the 20% revenue growth target.

## Current State

### Existing Features
- Basic shopping cart with coupon code support (validates "techconnect" for 5% off)
- Product detail modal with quantity selection
- Welcome page with category cards

### What's Missing — Everything Else
There are currently ZERO customer retention features. No reviews, no wishlist, no loyalty, no subscriptions, no abandoned cart recovery, no email marketing, no personalization, no customer accounts beyond basic login.

## Gap Analysis

| Gap | Severity | Source |
|-----|----------|--------|
| No product reviews or ratings | **HIGH** | Products with reviews convert 3.5x — Forrester 2025 |
| No wishlist/favorites/saved items | **HIGH** | Standard feature reducing return-visit friction |
| No loyalty/rewards program | **HIGH** | Repeat customers spend 67% more — Bain |
| No subscription/auto-reorder | **MEDIUM** | Amazon Subscribe & Save — recurring revenue driver |
| No abandoned cart recovery | **HIGH** | 70% of carts abandoned; recovery emails recapture 5-15% |
| No email marketing integration | **HIGH** | Primary re-engagement channel |
| No customer segmentation | **MEDIUM** | Generic experience vs. personalized |
| No referral program | **MEDIUM** | Low-cost acquisition channel |
| No product bundles | **MEDIUM** | AOV increase mechanism |
| No social proof / trust badges | **MEDIUM** | 79% of buyers trust peer reviews |

## Proposed Enhancements

| Priority | Enhancement | RICE Score | GitHub Issue | Revenue Impact |
|----------|-------------|------------|-------------|----------------|
| P0 | Product reviews & ratings | 7.5 | #41 | +15-20% conversion lift |
| P1 | Abandoned cart recovery (email) | 7.0 | — | +5-15% recovered revenue |
| P1 | Wishlist / Favorites | 5.0 | #43 | +10-15% return visit conversion |
| P1 | Paw Points Loyalty Program | 4.5 | #46 | +5-10% retention lift |
| P2 | Subscription / auto-reorder | 3.6 | #48 | Recurring revenue stream |
| P2 | Customer segmentation & personalization | 3.5 | — | +10-15% revenue lift |
| P2 | Referral program ("Refer a Friend") | 3.0 | — | Low-cost acquisition |
| P3 | Social proof badges (trusted seller, verified) | 2.0 | — | Trust signal |

## User Stories
- As a **repeat customer**, I want to leave reviews on products I've purchased so that other buyers can benefit from my experience.
- As a **budget-conscious buyer**, I want to earn points on every purchase from a loyalty program so that I save money on future orders.
- As a **busy professional**, I want to set up auto-reorder for my regular supplies so that I never run out.
- As a **first-time buyer**, I want to save items to a wishlist so that I can come back and buy them later.
- As a **returning visitor**, I want to receive a reminder email about items in my cart so that I don't forget to complete my purchase.

## Acceptance Criteria
- [ ] Given a purchased product, when the customer visits the product page, then they can submit a star rating (1-5) and written review
- [ ] Given a product with reviews, when any user views it, then they see average rating, review count, and individual reviews
- [ ] Given an authenticated user, when they add items to their wishlist, then the items persist to their account
- [ ] Given a cart abandoned for 1 hour, when the system triggers recovery, then the user receives an email with cart contents and a return link
- [ ] Given the loyalty program, when a customer completes a purchase, then they earn 1 point per $1 spent
- [ ] Given accumulated loyalty points, when the customer checks out, then they can apply points as a discount

## Technical Notes
- Reviews: New `Review` model and `/api/reviews` endpoints. Display on product page. Require purchase verification.
- Loyalty: New `LoyaltyAccount` model tracking points. Points earned on order completion, redeemable at checkout.
- Abandoned cart: Requires email infrastructure (SendGrid/SES) and a background job to check cart age.
- Wishlist: New `Wishlist` model, `/api/wishlists` endpoints. Frontend heart icon on product cards.
- Subscriptions: New `Subscription` model with frequency, next delivery date. Cron job to auto-create orders.

## References
- Bain & Company — 5% retention increase = 25-95% profit increase; repeat customers spend 67% more
- McKinsey — Personalization drives 10-15% revenue lift; 71% of consumers expect personalization
- Forrester 2025 — 79% of buyers trust peer reviews; products with reviews convert 3.5x
- Baymard Institute — 70% cart abandonment rate
