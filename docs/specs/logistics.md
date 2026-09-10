# Spec: Logistics & Delivery Tracking

| Field | Value |
|-------|-------|
| Status | Existing (API) + No Frontend |
| Last Updated | March 10, 2026 |
| GitHub Issues | #14, #2 |
| RICE Score | 6.4 |

## Overview
Logistics covers delivery management, delivery tracking, and the fulfillment link between orders and deliveries. The API has full CRUD for deliveries and the OrderDetailDelivery join table, but there is zero frontend UI for any logistics feature. The delivery status endpoint also contains a critical command injection vulnerability.

## Current State

### API Endpoints
| Method | Route | File | Description |
|--------|-------|------|-------------|
| GET | /api/deliveries | `api/src/routes/delivery.ts` | Returns all deliveries |
| GET | /api/deliveries/:id | `api/src/routes/delivery.ts` | Get delivery by deliveryId |
| POST | /api/deliveries | `api/src/routes/delivery.ts` | Create delivery |
| PUT | /api/deliveries/:id/status | `api/src/routes/delivery.ts` | **VULNERABLE** — Update status; accepts `notifyCommand` passed to `exec()` |
| PUT | /api/deliveries/:id | `api/src/routes/delivery.ts` | Replace delivery |
| DELETE | /api/deliveries/:id | `api/src/routes/delivery.ts` | Delete delivery |
| GET | /api/order-detail-deliveries | `api/src/routes/orderDetailDelivery.ts` | Returns all order-detail-delivery links |
| GET | /api/order-detail-deliveries/:id | `api/src/routes/orderDetailDelivery.ts` | **BUG**: finds by deliveryId, not orderDetailDeliveryId |
| POST | /api/order-detail-deliveries | `api/src/routes/orderDetailDelivery.ts` | Create link |
| PUT | /api/order-detail-deliveries/:id | `api/src/routes/orderDetailDelivery.ts` | **BUG**: wrong ID field |
| DELETE | /api/order-detail-deliveries/:id | `api/src/routes/orderDetailDelivery.ts` | **BUG**: wrong ID field |

### Data Models
| Model | File | Fields | Relationships |
|-------|------|--------|---------------|
| Delivery | `api/src/models/delivery.ts` | deliveryId, supplierId, deliveryDate, name, description, status | belongs to Supplier, has many OrderDetailDeliveries |
| OrderDetailDelivery | `api/src/models/orderDetailDelivery.ts` | orderDetailDeliveryId, orderDetailId, deliveryId, quantity, notes | joins OrderDetail ↔ Delivery |

### Seed Data
- 2 deliveries: "PurrTech Smart Home Bundle" (pending), "WhiskerWare Entertainment Package" (in-transit)
- 3 order-detail-delivery links

## Gap Analysis

| Gap | Severity | Source |
|-----|----------|--------|
| **CRITICAL: Command injection** in delivery status endpoint (`exec(notifyCommand)`) | **CRITICAL** | OWASP Top 10 — must remove immediately |
| **BUG: Wrong ID field** in OrderDetailDelivery route (GET/PUT/DELETE use deliveryId) | **HIGH** | Codebase Analyst report |
| No delivery tracking UI for customers | **HIGH** | Amazon, Shopify, all competitors show real-time delivery tracking |
| No estimated delivery date display | **HIGH** | Baymard: show dates, not "2-3 days" |
| No delivery notifications (email/push) | **MEDIUM** | Standard e-commerce feature |
| No delivery dashboard for warehouse staff | **MEDIUM** | Internal staff need visibility |

## Proposed Enhancements

| Priority | Enhancement | RICE Score | GitHub Issue |
|----------|-------------|------------|-------------|
| P0 | Fix command injection vulnerability | 60.0 | #2 (PR #52) |
| P0 | Fix OrderDetailDelivery wrong ID field | N/A | #4 |
| P1 | Delivery tracking UI with status timeline | 6.4 | #14 |
| P1 | Estimated delivery date display in checkout & order history | 5.0 | — |
| P2 | Delivery notification system (email) | 3.5 | — |
| P2 | Warehouse delivery dashboard | 3.0 | — |

## User Stories
- As a **customer**, I want to track my delivery status in real-time so that I know when my order will arrive.
- As a **warehouse manager**, I want a delivery dashboard showing all pending and in-transit deliveries so that I can plan receiving.
- As a **branch manager**, I want delivery notifications so that I can prepare for incoming stock.

## Acceptance Criteria
- [ ] Given a customer with an order, when they view order details, then they see delivery status and estimated arrival date
- [ ] Given a delivery status change, when the status updates, then the customer receives an email notification
- [ ] Given the delivery tracking page, when a user views it, then they see a visual timeline (ordered → shipped → in-transit → delivered)

## Technical Notes
- **SECURITY**: Remove `exec()` call from delivery.ts immediately — this is a critical RCE vulnerability
- **BUG FIX**: Change orderDetailDelivery.ts to use `orderDetailDeliveryId` for GET/PUT/DELETE lookups
- Delivery tracking: Extend Delivery model with `trackingNumber`, `estimatedArrival`, `actualArrival`
- Notifications: Queue-based email system (start with mock/logging for demo)

## References
- Baymard Institute — Show delivery dates, not shipping speed
- Amazon — Real-time GPS tracking with push notifications sets the bar
- Cin7 — Multi-channel delivery tracking and fulfillment management
