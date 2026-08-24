# Spec: Analytics & Reporting

| Field | Value |
|-------|-------|
| Status | MVP implemented |
| Last Updated | August 24, 2026 |
| GitHub Issues | #13, #15, #109 |
| RICE Score | 9.0 |

## Overview
Analytics & Reporting provides dashboards, KPI tracking, and data export capabilities to measure business performance and drive data-informed decisions. Without analytics, OctoCAT Supply cannot measure the success of any growth initiative or track progress toward the 20% revenue growth target.

## Current State

### Existing Features
- Authenticated users see a dashboard on `/`; guests continue to see the Welcome page.
- API aggregation endpoints exist under `/api/analytics`.
- Dashboard data polls every 30 seconds through React Query.
- Raw order, order-detail, product, and delivery CRUD routes share the same in-memory state used by analytics.

## Gap Analysis

| Gap | Severity | Source |
|-----|----------|--------|
| No analytics dashboard at all | **HIGH** | Can't improve what you can't measure |
| No revenue tracking | **HIGH** | Cannot measure growth target |
| No conversion funnel tracking | **HIGH** | Cannot identify drop-off points |
| No customer behavior analytics | **MEDIUM** | Cannot segment or personalize |
| No report export (CSV/PDF) | **MEDIUM** | Management needs offline reports |
| No A/B testing infrastructure | **LOW** | Needed for optimization |

## Proposed Enhancements

| Priority | Enhancement | RICE Score | GitHub Issue |
|----------|-------------|------------|-------------|
| P0 | Revenue & order analytics dashboard | 9.0 | #13 |
| P1 | Conversion funnel tracking | 6.0 | — |
| P1 | CSV/PDF report export | 4.5 | #15 |
| P2 | Customer behavior analytics | 3.5 | — |
| P3 | A/B testing framework | 2.0 | — |

### Dashboard KPIs
| KPI | Description | Formula |
|-----|-------------|---------|
| Total Orders | Count of all orders in memory | `orders.length` |
| Gross Order Value | Sum of active order line values | Σ(orderDetail.unitPrice × orderDetail.quantity), excluding cancelled orders |
| Average Order Value (AOV) | Gross value / active order count | Gross Order Value / non-cancelled Order Count |
| Pending Deliveries | Deliveries still pending or in transit | Count where status is `pending` or `in-transit` |
| Low Stock Count | Products at or below reorder point | Count where `stockLevel <= reorderPoint` |
| Product Performance | Revenue by product, units sold | Per-product aggregation |
| Supplier Performance | Delivery on-time rate, order fill rate | Deliveries metrics |

Deferred metrics such as conversion rate, cart abandonment, retention, revenue growth, export, and forecasting require visitor/session/customer/history data that does not exist in the current in-memory demo.

## MVP API contracts

| Endpoint | Response |
|---|---|
| `GET /api/analytics/summary` | `totalOrders`, `grossOrderValue`, `averageOrderValue`, `pendingDeliveries`, `lowStockCount`, `generatedAt` |
| `GET /api/analytics/orders-by-status` | Every known order status with a numeric count, including zero-count statuses |
| `GET /api/analytics/delivery-performance` | `onTime`, `late`, `notYetDelivered`, `onTimeRate` |
| `GET /api/analytics/recent-orders?limit=5` | Recent orders sorted by `orderDate` descending, then `orderId` descending; `limit` must be 1-25 |
| `GET /api/analytics/top-products?limit=5` | Products ranked by units sold, then revenue, then product ID; cancelled orders are excluded |
| `GET /api/analytics/low-stock` | Products whose `stockLevel <= reorderPoint` |

On-time delivery is defined as `actualDeliveryDate <= scheduledDate`. Deliveries without `actualDeliveryDate` are counted as `notYetDelivered` and excluded from the on-time-rate denominator.

## User Stories
- As an **operations director**, I want a real-time dashboard showing revenue, AOV, and conversion rate so that I can monitor business health.
- As a **branch manager**, I want to see my branch's order volume and revenue so that I can track against my targets.
- As a **procurement officer**, I want supplier performance metrics so that I can negotiate better terms.

## Acceptance Criteria
- [ ] Given the analytics dashboard, when a user views it, then they see total revenue, AOV, order count, and conversion rate
- [ ] Given the dashboard, when a user selects a date range, then all metrics update to reflect that period
- [ ] Given the reporting page, when a user clicks "Export CSV", then a CSV file downloads with the current view's data

## Technical Notes
- Dashboard: `/api/analytics` endpoints aggregate order/product/delivery data.
- Frontend: Dashboard uses semantic HTML, CSS bars, KPI cards, and table equivalents instead of adding a chart dependency.
- Refresh: React Query polling every 30 seconds; no WebSocket infrastructure in this slice.
- Export: CSV/PDF export remains a follow-up tracked by #15.

## References
- All major platforms (Coupa, SAP, Amazon Business) provide spend analytics
- BigCommerce — Business analytics is a key B2B trend for 2026
