# OctoCAT Supply vs. Amazon Business — Corporate Procurement Evaluation

**Reviewer:** Tom Wheeler, Regional Facilities Manager  
**Company:** Mid-size tech company (800 employees, 12 Midwest office locations)  
**Date:** March 10, 2026  
**Evaluated at:** http://localhost:5137  
**Annual Procurement Budget:** $1.2M  
**Current Supplier Platform:** Amazon Business (3 years)  
**Evaluation Scope:** Full B2B procurement capability comparison  

---

## 1. Executive Summary: NOT VIABLE — 1/10

I spent 45 minutes evaluating OctoCAT Supply as a potential alternative or supplement to Amazon Business for our multi-location office supply procurement. I'm going to be direct: this platform cannot be used for corporate procurement. Not "needs improvement" — *cannot be used*. There is no scenario where I could route even a $200 order through this system without creating compliance risk, audit exposure, and manual workaround overhead that costs more than the order itself.

Amazon Business isn't perfect. Their UI frustrates me, their account rep takes two days to respond, and their bulk pricing isn't always competitive. But they give me the infrastructure to run a $1.2M procurement operation across 12 locations. OctoCAT Supply gives me a consumer checkout with a broken button.

I came in hoping to find a niche supplier with a cleaner ordering experience. I left wondering who this platform is built for, because it's not built for anyone who writes purchase orders.

---

## 2. Head-to-Head Feature Comparison

| Capability | Amazon Business | OctoCAT Supply | Gap Severity |
|---|---|---|---|
| PO Number at Checkout | Yes — required field, maps to invoices | **No field exists anywhere** | DEALBREAKER |
| Net-30/60/90 Payment Terms | Yes — Pay by Invoice, configurable terms | **Credit card only (no payment processing at all)** | DEALBREAKER |
| Approval Workflows | Yes — multi-tier, configurable thresholds | **None** | DEALBREAKER |
| Multi-User Business Accounts | Yes — unlimited users, roles, permissions | **Single user, client-side admin check by email domain** | DEALBREAKER |
| Multi-Location Ship-To | Yes — address book with cost center mapping | **Single address assumed, no address entry at all** | DEALBREAKER |
| Spend Analytics/Reporting | Yes — dashboards, CSV/PDF export, integrations | **Zero analytics infrastructure** | DEALBREAKER |
| Order Tracking | Yes — real-time status, delivery estimates | **No order tracking, no order history** | CRITICAL |
| Bulk/Volume Pricing | Yes — quantity discounts, Business-only pricing | **Flat 5% discount regardless of quantity** | CRITICAL |
| Invoice Management | Yes — downloadable, CSV export, SAP integration | **No invoices generated** | CRITICAL |
| Checkout Flow | Yes — complete multi-step checkout | **"Proceed To Checkout" button has no handler** | CRITICAL |
| Cart Persistence | Yes — server-side, survives sessions | **React state only — lost on page refresh** | HIGH |
| Guided Buying | Yes — preferred products, restricted categories | **None** | HIGH |
| Tax Calculation | Yes — jurisdiction-aware, tax-exempt support | **No tax line item** | HIGH |
| Quick Reorder | Yes — one-click from order history | **No order history exists** | HIGH |
| Punchout/Integration | Yes — cXML punchout to SAP, Coupa, etc. | **No integration capability** | MEDIUM |

**Count: 7 dealbreakers, 4 critical gaps, 3 high gaps, 1 medium gap.**

---

## 3. Why I Would NEVER Use OctoCAT Supply Today

### 3.1 I Cannot Place a Compliant Order

My company requires a PO number on every procurement transaction. Period. This isn't a preference — it's a policy enforced by our finance team, validated in quarterly audits, and required for cost center allocation in SAP. The OctoCAT Supply checkout has a "Coupon Code" field and a broken "Proceed To Checkout" button. There is no PO number field, no cost center dropdown, no internal reference number.

If I placed an order here — which I can't, because the checkout button doesn't work — I'd have no way to tie it to PO #4420-2026-0312. My finance team would reject the expense. My VP would ask why I'm buying from a supplier that can't produce a proper invoice. I'd be building reconciliation workarounds in Excel for a platform that should be making my life easier.

Amazon Business: I enter my PO number at checkout. It appears on every invoice. It flows into our SAP integration. My finance team never asks questions.

### 3.2 I Cannot Pay

My company does not pay for procurement orders with personal credit cards. We use Pay by Invoice (Net-30) through Amazon Business. OctoCAT Supply has no payment processing at all — the checkout button is non-functional. Even if it worked, there are no payment term options. No Net-30, no ACH, no purchase cards, no wire transfer.

I carry a $1.2M annual budget. I am not putting that on a Visa.

### 3.3 I Cannot Order for Multiple Locations

Every Monday morning, I consolidate supply requests from 12 site managers into one ordering session. On Amazon Business, I select a ship-to address from my address book, add items, switch to the next address, add items, and check out once. One order, one invoice, 12 ship-to addresses, each tagged with a cost center.

OctoCAT Supply doesn't even have an address entry field. The cart assumes one anonymous buyer shipping to one unknown location. If I somehow got checkout to work, I'd need to place 12 separate orders — 12 checkouts, 12 order confirmations (which don't exist), 12 reconciliation entries in my spreadsheet. That turns my 2-hour Monday ordering session into an entire day and creates 12x the audit trail.

### 3.4 No One Can Approve My Orders

Orders over $5,000 need my VP's sign-off. On Amazon Business, I set approval thresholds — orders auto-route to the right approver based on dollar amount. My VP logs in, reviews, approves with one click. Done.

On OctoCAT Supply, the "auth" system checks if your email ends with `@github.com`. That's it. No user roles, no spending limits, no approval queues, no delegation. Janet in Des Moines can't even have her own account that routes orders to me for review. There is no concept of organizational hierarchy.

### 3.5 I Cannot Report on Spend

Every quarter, I present a spend analysis to my VP of Operations: spend by location, by category, year-over-year trends. Amazon Business gives me dashboards and CSV exports. I pull the data, drop it into my template, and I'm done in an hour.

OctoCAT Supply has — and I verified this in the specs — "zero analytics infrastructure." No dashboards, no export, no aggregation. There's raw order data in the API, but no way to see "Q4 spend at the Denver office" without building a custom report from scratch. I already do enough Excel. I don't need another supplier adding to the pile.

### 3.6 The Checkout Doesn't Work

This needs to be stated plainly: the "Proceed To Checkout" button has no click handler. It renders a gradient-styled button that does absolutely nothing. I'm evaluating a supplier whose storefront cannot complete a transaction. The order management spec confirms this — it's flagged as "the single biggest revenue blocker" with a RICE score of 10.0. Their own spec says "OctoCAT Supply literally cannot generate online revenue."

I can't evaluate a checkout flow that doesn't exist.

---

## 4. Absolute Minimum B2B Features to Be Considered

If OctoCAT Supply wants corporate buyers to even *test* the platform, these are non-negotiable. Not "nice to have." Not "Phase 2." These must exist before I'd run a single pilot order:

### Tier 1 — Gate to Entry (Must have before first pilot order)

1. **Working checkout flow.** The button must do something. Shipping address entry, order review, order confirmation with an order number.

2. **PO number field at checkout.** A required text input where I enter my purchase order number. It must appear on every order confirmation and invoice.

3. **Invoice generation.** After an order is placed, I need a downloadable invoice with: PO number, line items (SKU, quantity, unit price, total), ship-to address, tax, and grand total. PDF minimum. CSV preferred.

4. **Net-30 payment terms.** I need to select "Pay by Invoice — Net 30" at checkout instead of entering a credit card. This requires a credit application process and account-level payment configuration.

5. **Multi-address shipping.** I need an address book with at least 12 saved addresses. At checkout, I select which items go to which address. One order, one invoice, multiple ship-to locations.

6. **Order history and tracking.** After placing an order, I need to see it in "My Orders" with status updates (pending, processing, shipped, delivered).

### Tier 2 — Required for Ongoing Use (Must have within 90 days of pilot)

7. **Approval workflows.** Configurable spending thresholds with multi-tier routing. Under $2K: auto-approve. $2K-$5K: my approval. $5K+: VP approval.

8. **Multi-user business accounts with roles.** I need Admin, Buyer, and Viewer roles. Site managers can place orders; I review and approve; finance can view but not order.

9. **Spend reporting with CSV export.** Dashboard showing spend by location, by category, by time period. "Export to CSV" button. That's it.

10. **Volume/quantity pricing.** Tiered pricing visible on the product page: "1-11: $72.99, 12-47: $65.99, 48+: $58.99." I need to forecast my budget. Flat 5% tells me nothing.

11. **Cart persistence.** The cart cannot vanish when I refresh the page. This is basic.

12. **Tax calculation.** Tax broken out by jurisdiction. My 12 locations span 4 states. I need accurate tax on every order.

### Tier 3 — Required for Full Migration from Amazon Business

13. **Punchout or SAP integration.** If I can't connect OctoCAT Supply to our SAP procurement workflow, it stays a secondary supplier forever.

14. **Guided buying.** I need to set preferred products and restrict categories so site managers order what's approved, not whatever catches their eye.

15. **Contract pricing locked for 12 months.** I negotiate annual rates. I don't want prices changing mid-quarter because someone updated a product page.

---

## 5. What Would Make Me Switch from Amazon Business

I'll be honest — switching from Amazon Business is a high bar. We've been on it for 3 years this month. My team knows it. My finance team trusts it. My SAP integration works. Switching suppliers costs me time, training, and political capital with my VP.

But Amazon Business isn't perfect, and there's an opening. Here's what OctoCAT Supply could offer that Amazon doesn't:

1. **A dedicated account rep who knows my 12 locations.** Amazon Business treats me like one of 5 million accounts. If OctoCAT Supply assigned me a rep who understood that my Denver office goes through 4x the breakroom supplies because they have 120 employees and the others have 40-60, that relationship matters.

2. **Simplified multi-location ordering.** Amazon Business multi-address checkout works, but it's clunky. If OctoCAT Supply built a "Location Cart" model — where I see all 12 locations as tabs, add items to each, and check out once with one consolidated invoice broken out by location and cost center — that would be genuinely better than what Amazon offers.

3. **Transparent, competitive pricing with no gamesmanship.** Amazon's pricing fluctuates daily. I've seen the same box of pens swing $4 in a week. If OctoCAT Supply offered contract pricing locked for 12 months with clear quantity breaks, I'd value the predictability.

4. **Cleaner spend reporting.** Amazon's reporting is powerful but dense. If OctoCAT Supply gave me a simple dashboard — "Here's what you spent this quarter, by location, versus last quarter" — with a one-click CSV export, I'd actually enjoy the quarterly review instead of dreading it.

5. **Faster, simpler approval workflows.** Amazon's approval system works but has too many configuration screens. A cleaner, faster approval flow with email notifications and one-click approve/reject would save my VP's time and mine.

But here's the truth: none of that matters until features 1-6 from Tier 1 exist. You can't outperform Amazon Business if you can't process an order. The car can't be faster if it doesn't have an engine.

---

## 6. Cost of Inaction for OctoCAT Supply

If I'm evaluating this platform, other corporate buyers are too. Here's what they're all seeing:

- **No PO support** → Immediately disqualified by any company with procurement policies
- **No payment terms** → Immediately disqualified by any company that doesn't pay with credit cards (which is most of them at scale)
- **No checkout** → Immediately disqualified by everyone, because you can't buy anything
- **No multi-user accounts** → Can't onboard a procurement team
- **No reporting** → Can't justify the spend to management

Every corporate buyer who evaluates this platform today and leaves is a buyer who won't come back for 12-18 months, if ever. First impressions in B2B procurement are extremely sticky. I have 38 supplier relationships. I evaluate new ones maybe twice a year. If OctoCAT Supply wastes one of those evaluation slots, they go to the bottom of the list.

---

## 7. My One Ask

If I could have one thing: **PO number field at checkout with a downloadable invoice that includes it.**

That single feature wouldn't make OctoCAT Supply usable for full procurement, but it would make it usable as a *secondary* supplier for small orders. I could place a $500 order, enter my PO number, get an invoice, and drop it into SAP. That's the foot in the door. Everything else can be built iteratively, but without PO-to-invoice traceability, this platform doesn't exist in my procurement workflow. It's invisible to my finance team, and if it's invisible to finance, it doesn't get budget.

---

## 8. Summary Scorecard

| Evaluation Criteria | Weight | Score (1-10) | Weighted |
|---|---|---|---|
| Process Fit (PO, cost centers, compliance) | 25% | 0 | 0.00 |
| Multi-Location Support | 20% | 0 | 0.00 |
| Payment & Invoicing | 20% | 0 | 0.00 |
| Reporting & Exports | 10% | 0 | 0.00 |
| Approval & Delegation | 10% | 0 | 0.00 |
| Product Catalog & Pricing | 10% | 3 | 0.30 |
| Time Impact on Weekly Workflow | 5% | 1 | 0.05 |
| **TOTAL** | **100%** | | **0.35 / 10** |

**Recommendation:** Do not proceed. Revisit in 12 months if Tier 1 features are implemented.

---

*Filed by Tom Wheeler — March 10, 2026*  
*Comparison baseline: Amazon Business account #[REDACTED], active since March 2023*  
*Next scheduled supplier evaluation window: September 2026*
