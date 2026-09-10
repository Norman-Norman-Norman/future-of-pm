# Strategic Portfolio Review — Operations Director

| Field | Value |
|-------|-------|
| Reviewer | Sarah Mitchell, Director of Operations |
| Date | March 10, 2026 |
| Scope | All specs: Catalog Management, Order Management, Logistics, Administration, Customer Experience, Analytics |
| Context | Board mandate: 20% revenue growth next quarter. Competitive threat from Amazon Business, Shopify B2B, Coupa. |

---

## Gut Reaction

I'll be blunt: we don't have a growth problem. We have a **"the building is on fire and we're debating paint colors"** problem. Checkout doesn't work. That means online revenue is literally zero. We have a command injection vulnerability that could take down the entire operation. And we have no analytics to measure anything — so even if we fixed everything tomorrow, we couldn't prove it to the board.

Before we talk about loyalty programs and AI-powered recommendations, we need to stop the bleeding. The 20% growth target is achievable, but only if we sequence ruthlessly and resist the temptation to boil the ocean.

---

## The Business Impact Angle

Let me frame this the way I'd present it to the CEO and the board.

**Current revenue capability: $0 online.** The "Proceed To Checkout" button does nothing. We have a shopping cart that goes nowhere. Every dollar of online revenue potential is sitting in abandoned carts with no path to completion. That's not a feature gap — that's a business-critical failure.

**Current risk exposure: catastrophic.** I confirmed the code myself. There's an `exec()` call in the delivery status endpoint that accepts arbitrary commands from the request body. Someone with basic curl knowledge could wipe our servers. The XSS in login could steal every credential that passes through. And every API endpoint — all 40+ of them — is publicly writable with zero authentication. Any competitor, any script kiddie, any bot could delete our entire product catalog right now. This isn't theoretical. This is "call the lawyers and the insurance company" territory.

**Current measurement capability: zero.** We have no analytics. No revenue dashboard. No conversion tracking. No way to know if our growth initiatives are working. I can't run a quarterly business review, I can't report to the board, and I can't compare branch performance. I'm flying blind across 12 branches.

---

## Top Priorities — The Sarah Mitchell Sequencing

Here's how I'd invest, in order, if the board gave me the budget tomorrow. I'm thinking in 90-day sprints because that's what "next quarter" means.

### Phase 1: Stop the Bleeding (Weeks 1–3)
*These are non-negotiable. No feature work until these are done.*

1. **Fix the command injection vulnerability** — The `exec(notifyCommand)` in delivery.ts is a remote code execution door. One exploit and we lose everything: data, reputation, customer trust, and potentially face regulatory action. I manage 12 branches. If someone injects a command that corrupts our delivery data, I have warehouse teams across 4 regions making decisions on bad information. Remove it. Today.

2. **Fix the XSS in Login** — `dangerouslySetInnerHTML` rendering URL parameters. An attacker sends a phishing link to our customers, steals their credentials, and we're liable. I've seen companies lose enterprise contracts over a single publicized vulnerability.

3. **Implement server-side authentication** — Every endpoint is publicly writable. Someone could POST fake orders, DELETE all our products, or PUT garbage data into branch records. My regional managers rely on this data. If branch data gets corrupted, operational decisions across the entire network are compromised.

4. **Fix the OrderDetailDelivery ID bug** — Three endpoints are looking up by the wrong ID field. This means delivery-to-order linking is broken. My logistics team can't trust the data, and at scale that means shipments going to the wrong places.

### Phase 2: Turn On Revenue (Weeks 3–6)
*This is the single biggest lever for the 20% target.*

5. **Complete the checkout flow** — Shipping address, payment (mock for now, designed for Stripe later), order confirmation page. This is table stakes. Every day without checkout is revenue we'll never recover. Based on our current cart activity, I'd estimate we're losing thousands per week in unconverted carts.

6. **Cart persistence** — Carts disappear on page refresh. That's not a minor UX issue — that's a revenue leak. Every customer who refreshes, navigates away, or opens a new tab loses their entire cart. Save to localStorage at minimum, server-side for authenticated users.

7. **Guest checkout** — 19% abandonment from forced account creation. We're a B2B supply company — procurement officers don't want to create yet another account. Let them buy with an email address and offer account creation post-purchase.

8. **B2B payment terms** — PO numbers, net-30/60/90. This is the single biggest differentiator for enterprise customers. 83% of B2B buyers abandon without payment terms. Every enterprise customer we lose to Amazon Business or Coupa is because we don't support how businesses actually buy things.

### Phase 3: Help Customers Find Products (Weeks 5–8)
*Can't sell what customers can't find.*

9. **Product categories and faceted filtering** — Category, price range, supplier, discount status. We have 13 products now, but we're planning to scale. Without filtering, product discovery degrades exponentially with catalog growth. Every branch I open means more products, more suppliers, more SKUs.

10. **Search with autocomplete** — Our current search is basic text matching. Amazon attributes 35% of revenue to search and recommendations. We don't need to match Amazon, but we need to not embarrass ourselves.

### Phase 4: Measure and Retain (Weeks 7–12)
*Can't improve what you can't measure. Can't grow what you can't retain.*

11. **Analytics dashboard** — Revenue by branch, AOV, conversion rate, order volume trends. This is my #1 personal pain point. I oversee 12 branches and I'm stitching together data from spreadsheets. I need a single screen with traffic-light indicators per branch, trend sparklines, and anomaly alerts. If Branch 7's conversion rate drops 15%, I need to know before it becomes a quarterly miss.

12. **Order history and tracking** — Customers need to see their past orders. This drives repeat purchases, builds trust, and reduces support calls. My branch teams spend absurd amounts of time answering "where's my order?" calls that a simple tracking page would eliminate.

13. **Product reviews and ratings** — 3.5x conversion lift on products with reviews. This is the highest-ROI retention feature. Peer validation is how B2B buyers make decisions — they're not impulse shopping, they're justifying purchases to procurement committees.

14. **Abandoned cart recovery** — 70% of carts are abandoned. Even recovering 5% of that is meaningful revenue. This requires email infrastructure, but the ROI is immediate and measurable.

---

## Biggest Risks

### Risk 1: Security Breach Before We Fix Vulnerabilities
**Likelihood: HIGH. Impact: CATASTROPHIC.**
The command injection vulnerability is public in the codebase. If this is an open-source repo or anyone with access decides to test it, we're exposed. A breach would mean: regulatory notification requirements, customer trust destruction, potential litigation, and operational chaos across all 12 branches. I've seen this happen at a previous company — the recovery took 18 months and cost $4M.

### Risk 2: Building Features on a Broken Foundation
**Likelihood: MEDIUM. Impact: HIGH.**
If we jump to loyalty programs and AI recommendations without fixing auth and checkout, we're building a house on sand. Every feature we ship without authentication is a feature that can be exploited. Every customer-facing feature we ship without analytics is a feature we can't measure. This is how companies end up with technical debt that costs 10x to fix later.

### Risk 3: Losing Enterprise Customers to Competitors During Build-Out
**Likelihood: HIGH. Impact: HIGH.**
Every week without B2B payment terms is a week where enterprise buyers are building habits on Amazon Business or Coupa. Switching costs in B2B procurement are high — once a company sets up their PO workflow on a competitor, they don't come back. We're not just losing a sale; we're losing a customer lifetime value.

### Risk 4: Scaling Without Operational Visibility
**Likelihood: HIGH. Impact: MEDIUM.**
We're opening 3 new branches this year. Without an analytics dashboard and branch performance comparison, I'm managing growth blind. Each new branch multiplies the operational complexity, and without data-driven management, quality degrades across the entire network.

### Risk 5: The 20% Growth Target Becomes a Feature Factory
**Likelihood: MEDIUM. Impact: MEDIUM.**
The board says 20% growth. The instinct is to ship everything: loyalty, subscriptions, AI, bundles, referrals. That's how you end up with 15 half-built features and zero completed ones. Discipline in sequencing is what separates companies that hit targets from companies that make excuses at the next board meeting.

---

## Would I Use This System Today?

**No.** Absolutely not. Not for my operation. I would not put any branch on a system with known security vulnerabilities, a non-functional checkout, and zero analytics. If a vendor pitched this to me, I'd walk out of the meeting at "checkout doesn't work."

**Would I use it after Phase 2?** Conditionally yes — for a pilot at one branch, with close monitoring. Security fixed, checkout working, cart persisting — that's a minimum viable product for a single-branch pilot.

**Would I use it after Phase 4?** Yes, and I'd be excited about it. Analytics, order history, reviews, B2B terms — that's a platform I could run my operation on. That's a platform I'd present to the board as a competitive advantage.

---

## What's Missing From These Specs

1. **Branch-level analytics and comparison** — The analytics spec talks about revenue and conversion but doesn't mention branch-level drill-down. I need to compare branch performance side-by-side. Which branch has the best fill rate? Worst inventory turns? Highest AOV? This is how I manage a multi-branch operation.

2. **Role-based views** — The admin spec talks about RBAC, but none of the specs address role-appropriate dashboards. A warehouse manager and an operations director should not see the same interface. I need executive-level KPIs. Marcus in the warehouse needs pick lists and receiving schedules.

3. **Forecasting and demand planning** — Not a single spec mentions forecasting. If we're serious about 20% growth, I need demand projections to plan inventory, staffing, and capacity across 12 branches. "Priya thinks Q4 will be busy" is not a forecast.

4. **Alert and exception management** — I don't want to check a dashboard 10 times a day. I want the system to tell me when something goes wrong. Fill rate drops below 95%? Alert. Branch revenue deviates 10% from forecast? Alert. Delivery on-time rate below threshold? Alert. The analytics spec mentions KPIs but not exception-based alerting.

5. **Report export and board-ready output** — The analytics spec mentions CSV/PDF export at P1, but this needs to be P0 for me. My board deck takes 2 days to compile. If this system can't generate a board-ready revenue summary by branch with trend lines, I'm still in Excel.

6. **Multi-branch inventory visibility** — None of these specs address cross-branch inventory. Can Branch 3 see that Branch 7 has excess stock of a product they're short on? Inter-branch transfer is a massive cost-saving opportunity that no spec touches.

7. **Supplier performance metrics** — The logistics spec mentions delivery tracking but doesn't address supplier scorecarding. I negotiate with suppliers based on on-time delivery rates, fill rates, and quality metrics. I need this data aggregated and historical.

---

## My Ask — One Thing I'd Change

If I could change one thing about this entire portfolio: **make security and checkout a single, non-negotiable Phase 0 that blocks all other work.** I see these specs treating security fixes and checkout as "P0" alongside other P0 items like search and categories. No. Security and checkout are in a category above P0. They are existential. Everything else — search, reviews, loyalty, subscriptions — is optimization on top of a working, secure system.

Ship security fixes and checkout. Measure the impact with basic analytics. Then — and only then — start layering on growth features with data to guide prioritization.

That's what I'd present to the CEO. That's what I'd defend to the board. And that's what will actually get us to 20%.

---

## What I'd Present to the CEO — The One-Pager

**Subject: Q3 Investment Sequencing for 20% Revenue Growth**

| Phase | Timeline | Investment | Expected Impact |
|-------|----------|------------|-----------------|
| **Phase 0: Security** | Weeks 1–3 | Fix 3 critical vulnerabilities, add auth | Risk mitigation: prevent catastrophic breach |
| **Phase 1: Revenue On** | Weeks 3–6 | Checkout, cart persistence, guest checkout, B2B terms | **Enable 100% of online revenue** (currently $0) |
| **Phase 2: Discovery** | Weeks 5–8 | Categories, filtering, search | **+15-20% conversion lift** from product discovery |
| **Phase 3: Measure & Retain** | Weeks 7–12 | Analytics dashboard, order history, reviews, cart recovery | **+10-15% from retention**, operational visibility |

**Total projected impact:** Conservative 20-30% revenue growth from a $0 online baseline, plus risk elimination and operational visibility across all 12 branches.

**What I need from you:** Executive sponsorship to hold the line on sequencing. The temptation will be to do everything at once. That's how we end up doing nothing well. Phase 0 is non-negotiable. Phase 1 is the growth engine. Phases 2-3 are fuel. In that order.

---

*— Sarah Mitchell, Director of Operations*
*"I don't care about the feature — I care about what it does to our fill rate and customer retention."*
