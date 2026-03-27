# OctoCAT Supply — Shopping Cart B2B Evaluation

**Reviewer:** Tom Wheeler, Regional Facilities Manager  
**Company:** Mid-size tech company (800 employees, 12 Midwest office locations)  
**Date:** March 10, 2026  
**Evaluated at:** http://localhost:5137  
**Annual Procurement Budget:** $1.2M  
**Ordering Pattern:** Weekly consolidated orders across 12 locations  

---

## 1. Overall Rating for B2B Use: 2/10

I'll be blunt: this is a consumer shopping cart. It's clean, it works well for someone buying one cat toy for themselves, and the UI is polished. But I manage procurement for 12 offices. I can't use this site in its current state. I'd need to build workarounds in Excel for nearly every step of my workflow, which defeats the purpose of having a supplier portal. I've seen this pattern before — a supplier invests in a good-looking storefront but skips the features that matter to the people writing the big checks.

---

## 2. Purchase Order Support — NO

**Finding:** There is no PO number field anywhere in the cart or checkout flow.

This is a dealbreaker. Every order I place requires a PO number tied to a cost center. Without it, I can't reconcile invoices, I can't pass audit, and I can't report spend to my VP of Operations. The cart has a "Coupon Code" field — that's for consumers. Where is the "PO Number" field? Where is the "Cost Center" dropdown?

Currently, the checkout flow has:
- Coupon Code field (accepts promo codes like "TechConnect")
- Apply Coupon button
- Proceed To Checkout button
- **No PO number field**
- **No cost center allocation**
- **No internal reference number**

If I placed a $4,000 order here, I'd have to copy the order confirmation into an email to myself, manually cross-reference it in SAP, and hope my finance team doesn't flag it. That's not a workflow — that's a liability.

---

## 3. Bulk Ordering — PARTIALLY FUNCTIONAL, POORLY DESIGNED

**Finding:** Quantity selection works via +/- buttons with single-unit increments. No direct quantity input on the product page. No quantity break pricing.

I order in cases — 12, 24, 48, 96 units. Clicking a "+" button 48 times is not a workflow. The product page does not allow me to type a quantity directly. I have to click-click-click.

The cart page does have a numeric input field where I can type a quantity directly (which is good), but the product page forces me through the +/- stepper. For someone ordering 12 units of 13 different products across 12 locations, that's hundreds of unnecessary clicks.

**What I need to see on each product:**
- A text input field where I can type "48" directly
- Quantity break pricing: "1-11: $72.99 | 12-47: $65.99 | 48+: $58.99"
- Case/unit toggle: "Order by: Unit | Case (12)"
- Stock availability for bulk quantities

The current pricing model shows a flat 5% discount on the entire cart regardless of quantity — that tells me nothing about volume economics. I need per-SKU quantity breaks so I can forecast my budget accurately.

---

## 4. Invoice/Payment Terms — NO

**Finding:** The cart flows directly to "Proceed To Checkout" with no payment term options.

The order summary shows:
- Subtotal
- Discount (flat 5%)
- Shipping (flat $10 regardless of order size)
- Grand Total

There is no option for:
- **Net-30 / Net-60 payment terms** — Standard for B2B. My company doesn't pay with credit cards for procurement orders.
- **Invoice generation** — I need a downloadable invoice with line items, PO number, ship-to address, and tax details.
- **Tax calculation** — No tax line item visible. I need tax broken out by jurisdiction for each ship-to location.
- **Payment method selection** — No ACH, wire transfer, or purchase card options.

A flat $10 shipping fee for any order size also makes no sense for B2B. If I'm ordering $6,000 worth of SmartFeeders for 12 offices, shipping should be calculated by weight, destination, and method — not a flat fee that's the same whether I order 1 item or 100.

---

## 5. Approval Workflow — NO

**Finding:** No approval routing, no role-based access, no spending limits.

My orders over $5,000 require my VP's sign-off. Currently, I email a screenshot of the cart to my VP, she replies "approved," and I paste that into a shared folder. It's embarrassing.

What I need:
- **Spending thresholds** — Orders under $2,000: auto-approve. $2,000-$5,000: manager approval. $5,000+: VP approval.
- **Approval queue** — My VP should be able to log in, see pending orders, and approve/reject with one click.
- **Delegated ordering** — Janet in Des Moines should be able to build a cart for her location, but it should route to me for review before it's submitted.
- **Audit trail** — Who ordered what, who approved it, when, and at what cost center.

The site has a "Login" link, suggesting user accounts exist, but there's no account hierarchy, no roles, no permissions.

---

## 6. Multi-Location Shipping — NO

**Finding:** The cart assumes a single ship-to address. There is no ability to specify multiple delivery locations.

This is the second dealbreaker. I manage 12 offices. When I order SmartFeeders, I need:
- 5 units to Denver (cost center 4420-MAINT-DEN)
- 3 units to Chicago (cost center 4420-MAINT-CHI)
- 2 units to Minneapolis (cost center 4420-MAINT-MSP)
- ...and so on for all 12 locations

With this cart, I would need to place 12 separate orders, with 12 separate checkouts, and track 12 separate order confirmations. That's not a 2-hour Monday morning ordering session — that's an entire day, and it creates 12x the reconciliation work at month-end.

What I need:
- **Multi-ship-to in a single order** — Select items, allocate quantities per location, one checkout, one invoice.
- **Saved ship-to addresses** — My 12 offices shouldn't need to be re-entered every time.
- **Per-location line items on the invoice** — So I can allocate costs to the correct cost center in SAP.
- **Location-based delivery scheduling** — Denver might need next-day, Des Moines can wait for standard.

---

## 7. Missing B2B Features — Comprehensive List

| Category | Feature | Status |
|----------|---------|--------|
| **Procurement** | PO number field | Missing |
| **Procurement** | Cost center allocation | Missing |
| **Procurement** | Saved payment methods (ACH/wire) | Missing |
| **Procurement** | Net-30/Net-60 terms | Missing |
| **Ordering** | Direct quantity input on product page | Missing (cart has it) |
| **Ordering** | Quantity break pricing | Missing |
| **Ordering** | Quick reorder / standing orders | Missing |
| **Ordering** | Saved/template orders | Missing |
| **Ordering** | CSV upload for bulk orders | Missing |
| **Shipping** | Multi-ship-to addresses | Missing |
| **Shipping** | Saved address book | Missing |
| **Shipping** | Shipping method selection | Missing |
| **Shipping** | Calculated shipping by weight/destination | Missing |
| **Invoicing** | Downloadable invoice (PDF/CSV) | Missing |
| **Invoicing** | Tax calculation by jurisdiction | Missing |
| **Invoicing** | Invoice export (CSV/Excel) | Missing |
| **Reporting** | Spend by location | Missing |
| **Reporting** | Spend by category | Missing |
| **Reporting** | Year-over-year comparison | Missing |
| **Reporting** | Exportable order history | Missing |
| **Workflow** | Approval chains | Missing |
| **Workflow** | Role-based access (buyer/approver/admin) | Missing |
| **Workflow** | Delegated ordering | Missing |
| **Workflow** | Spending limits | Missing |
| **Data** | Cart persistence (survives page refresh) | Missing |
| **Data** | Order history | Missing |
| **Data** | Product favorites / lists | Missing |

**Note on cart persistence:** During my testing, the cart contents were lost on every page refresh. The cart state is stored entirely in browser memory (React Context) with no persistence to localStorage or a backend. In a procurement workflow where I'm building orders over 30-60 minutes — cross-referencing my spreadsheet, checking with site managers, comparing prices — losing my cart because I accidentally refreshed the page is unacceptable.

---

## 8. Top 3 Recommendations

### Recommendation 1: Add Purchase Order and Cost Center Fields to Checkout

This is the single highest-impact change. Add two fields to the checkout:
- **PO Number** (required text field, validated against a standard format)
- **Cost Center** (dropdown populated from the customer's account, or free text)

Without this, I cannot use the site for any order, period. This is table stakes for any B2B supplier.

### Recommendation 2: Implement Multi-Ship-To Ordering

Allow me to build one order and allocate line items to multiple ship-to addresses. One cart, one checkout, one invoice — with per-location line items. This alone would save me a full workday per month. My benchmark is how SAP handles multi-plant requisitions: select the material, specify the plant (location), quantity, and delivery date per line.

### Recommendation 3: Persist Cart State and Add Export Capability

At minimum:
- Persist the cart to localStorage or a backend so it survives page refreshes and browser sessions.
- Add a "Download as CSV" button to the order summary so I can import into my Excel tracking sheets.
- Add a "Download Invoice" option post-checkout that generates a proper invoice with PO number, line items, tax, and ship-to details.

If I can't get data out of this system in a format my spreadsheets can consume, I'm rebuilding every order by hand — which is exactly where I am today with most supplier sites.

---

## My One Ask

If you give me one thing: **a PO number field and a CSV export of every order**. I can work around everything else with Excel. I've been doing it for 18 years. But if I can't attach a PO and I can't export the data, this site doesn't exist in my procurement workflow. It's just another consumer storefront I have to work around instead of work with.

---

*Tom Wheeler | Regional Facilities Manager | Minneapolis, MN*  
*"This isn't Amazon. I'm not buying socks. I need PO tracking, multi-ship-to, and invoicing."*
