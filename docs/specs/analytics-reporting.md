# Spec: Analytics & Reporting

| Field | Value |
|-------|-------|
| Status | Planned |
| Last Updated | March 10, 2026 |
| GitHub Issues | #13, #15 |
| RICE Score | 9.0 |

## Overview
Analytics & Reporting provides dashboards, KPI tracking, and data export capabilities to measure business performance and drive data-informed decisions. Without analytics, OctoCAT Supply cannot measure the success of any growth initiative or track progress toward the 20% revenue growth target.

## Current State

### Existing Features
- None. There is zero analytics infrastructure in the codebase.
- Raw data exists in API endpoints (orders, products, deliveries) but no aggregation, visualization, or reporting.

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
| Total Revenue | Sum of all completed order values | Σ(orderDetail.unitPrice × orderDetail.quantity) |
| Average Order Value (AOV) | Revenue / number of orders | Total Revenue / Order Count |
| Conversion Rate | Orders / unique visitors | Orders / Sessions × 100 |
| Cart Abandonment Rate | Carts created - orders completed / carts created | (Carts - Orders) / Carts × 100 |
| Customer Retention Rate | Repeat customers / total customers | Repeat / Total × 100 |
| Revenue Growth Rate | (Current - Previous) / Previous | (Rev_t - Rev_{t-1}) / Rev_{t-1} × 100 |
| Product Performance | Revenue by product, units sold | Per-product aggregation |
| Supplier Performance | Delivery on-time rate, order fill rate | Deliveries metrics |

## User Stories
- As an **operations director**, I want a real-time dashboard showing revenue, AOV, and conversion rate so that I can monitor business health.
- As a **branch manager**, I want to see my branch's order volume and revenue so that I can track against my targets.
- As a **procurement officer**, I want supplier performance metrics so that I can negotiate better terms.

## Acceptance Criteria
- [ ] Given the analytics dashboard, when a user views it, then they see total revenue, AOV, order count, and conversion rate
- [ ] Given the dashboard, when a user selects a date range, then all metrics update to reflect that period
- [ ] Given the reporting page, when a user clicks "Export CSV", then a CSV file downloads with the current view's data

## Technical Notes
- Dashboard: New `/api/analytics` endpoints that aggregate order/product/delivery data
- Frontend: New Analytics page with charts (Chart.js or Recharts)
- Real-time: WebSocket updates for live dashboard, or polling every 30s
- Export: Server-side CSV generation endpoint

## References
- All major platforms (Coupa, SAP, Amazon Business) provide spend analytics
- BigCommerce — Business analytics is a key B2B trend for 2026
