# OKR & KPI Plan: 20% Revenue Growth — Q2 2026

| Field | Value |
|-------|-------|
| Date | March 10, 2026 |
| Target | 20% revenue growth by end of Q2 2026 (June 10, 2026) |
| Prepared By | Product Manager Agent |
| Based On | Competitive analysis, 11 persona interviews, market research |
| Tracking | Analytics Dashboard (Issue #13 — must be built in Phase 2) |

---

## Strategic Context

OctoCAT Supply currently generates **$0 in online revenue** — the checkout button is non-functional. "20% growth" requires first establishing a revenue baseline by shipping checkout, then driving growth through discovery, retention, and B2B expansion. Our 11 personas unanimously agree: the #1 priority is a working checkout flow.

---

## Objective 1: Establish Online Revenue Capability

> **"Turn on the register."** — Priya Sharma, Branch Manager

**Why:** Currently impossible to complete a purchase online. Every persona rated probability of buying at 0%.

| Key Result | Metric | Baseline | Target | Owner | Phase |
|-----------|--------|----------|--------|-------|-------|
| KR 1.1: Ship complete checkout flow | Checkout completion rate | 0% (broken) | ≥60% | Engineering | Phase 1 (Weeks 1-4) |
| KR 1.2: Persist cart across sessions | Cart persistence rate | 0% (volatile) | 100% | Engineering | Phase 1 (Weeks 1-2) |
| KR 1.3: Enable guest checkout | Guest checkout usage | 0% | ≥40% of orders | Engineering | Phase 1 (Weeks 2-4) |
| KR 1.4: Fix all critical security vulnerabilities | Critical vulns open | 3 (RCE, XSS, no auth) | 0 | Engineering | Phase 0 (Week 1) |

### KPIs for Objective 1

| KPI | Definition | Target | Measurement Frequency |
|-----|-----------|--------|----------------------|
| **Checkout Completion Rate** | Orders completed / checkouts started × 100 | ≥60% | Daily |
| **Cart Abandonment Rate** | Carts created − orders / carts created × 100 | <50% (industry avg 70%) | Daily |
| **Time to First Purchase** | Minutes from first visit to completed order | <10 min | Weekly |
| **Cart Persistence Rate** | Carts surviving browser close / total carts × 100 | 100% | Weekly |
| **Security Vulnerability Count** | Open critical/high security issues | 0 critical, 0 high | Continuous |

---

## Objective 2: Drive Product Discovery & Conversion

> *"13 products and I still can't find what I need."* — Aisha Johnson, First-Time Buyer

**Why:** Without search, filtering, and reviews, customers can't find or trust products. Research shows +15-25% conversion lift from discovery features and 3.5x conversion from reviews.

| Key Result | Metric | Baseline | Target | Owner | Phase |
|-----------|--------|----------|--------|-------|-------|
| KR 2.1: Launch product search with autocomplete | Search usage rate | 0% (no search) | ≥50% of sessions use search | Engineering | Phase 2 (Weeks 4-6) |
| KR 2.2: Add category-based faceted filtering | Filter usage rate | 0% | ≥30% of sessions use filters | Engineering | Phase 2 (Weeks 4-6) |
| KR 2.3: Launch product reviews & ratings | Products with reviews | 0 | ≥80% of products have ≥3 reviews | Content + Eng | Phase 2 (Weeks 5-7) |
| KR 2.4: Achieve 15% conversion rate improvement | Conversion rate | Baseline (post-checkout) | +15% vs baseline | Product | Phase 2 end |

### KPIs for Objective 2

| KPI | Definition | Target | Measurement Frequency |
|-----|-----------|--------|----------------------|
| **Conversion Rate** | Orders / unique visitors × 100 | ≥3% (industry B2B: 1.1-3.1%) | Daily |
| **Search Success Rate** | Searches resulting in product click / total searches | ≥70% | Weekly |
| **Filter Usage Rate** | Sessions using ≥1 filter / total sessions | ≥30% | Weekly |
| **Average Review Score** | Mean star rating across all products | ≥4.0 | Weekly |
| **Product Page Bounce Rate** | Single-page visits to product page / total visits | <40% | Weekly |
| **Products Per Session** | Average products viewed per session | ≥3 | Weekly |

---

## Objective 3: Build Customer Retention & Repeat Revenue

> *"The ONE feature: a 'Reorder Last Order' button. Turns 15 minutes into 3."* — Gary Pham, Repeat Customer

**Why:** Repeat customers spend 67% more than new ones (Bain). Quick reorder, loyalty, and retention features compound revenue growth.

| Key Result | Metric | Baseline | Target | Owner | Phase |
|-----------|--------|----------|--------|-------|-------|
| KR 3.1: Launch order history & order tracking | Users viewing order history | 0 | ≥60% of logged-in users | Engineering | Phase 2-3 (Weeks 6-8) |
| KR 3.2: Ship quick reorder / "Buy Again" | Reorders / total orders | 0% | ≥20% of orders are reorders | Engineering | Phase 3 (Weeks 8-9) |
| KR 3.3: Deploy abandoned cart recovery emails | Cart recovery rate | 0% | ≥8% of abandoned carts recovered | Marketing + Eng | Phase 3 (Weeks 8-10) |
| KR 3.4: Achieve 25% repeat customer rate | Repeat purchase rate | 0% | ≥25% | Product | Phase 3 end |

### KPIs for Objective 3

| KPI | Definition | Target | Measurement Frequency |
|-----|-----------|--------|----------------------|
| **Repeat Purchase Rate** | Customers with 2+ orders / total customers × 100 | ≥25% | Weekly |
| **Customer Retention Rate** | Customers who return within 30 days / total × 100 | ≥40% | Monthly |
| **Reorder Conversion Rate** | "Buy Again" clicks resulting in order / total clicks | ≥50% | Weekly |
| **Cart Recovery Rate** | Recovered carts / abandoned carts × 100 | ≥8% | Weekly |
| **Average Order Value (AOV)** | Total revenue / total orders | ≥$85 (baseline TBD) | Daily |
| **Customer Lifetime Value (CLV)** | AOV × purchase frequency × retention period | Establish baseline | Monthly |

---

## Objective 4: Unlock B2B Enterprise Revenue

> *"Without PO-to-invoice traceability, this platform is invisible to my finance team."* — Tom Wheeler, Corporate Buyer

**Why:** 83% of B2B buyers abandon without payment terms. Amazon Business has 8M+ customers with PO, approval workflows, and Pay by Invoice. This is an entirely untapped revenue segment.

| Key Result | Metric | Baseline | Target | Owner | Phase |
|-----------|--------|----------|--------|-------|-------|
| KR 4.1: Support PO numbers at checkout | Orders with PO numbers | 0 | ≥10 B2B orders/week | Engineering | Phase 3 (Weeks 9-10) |
| KR 4.2: Offer net-30 payment terms | B2B conversion rate | 0% | ≥30% of B2B checkouts use terms | Finance + Eng | Phase 3 (Weeks 9-10) |
| KR 4.3: Ship basic approval workflow | Enterprises using approvals | 0 | ≥3 enterprise accounts | Engineering | Phase 4 (Weeks 11-12) |
| KR 4.4: Generate enterprise pipeline | Enterprise leads | 0 | ≥10 qualified leads | Sales | Phase 3-4 |

### KPIs for Objective 4

| KPI | Definition | Target | Measurement Frequency |
|-----|-----------|--------|----------------------|
| **B2B Order Volume** | Orders with PO numbers per week | ≥10/week | Weekly |
| **B2B Revenue Share** | B2B revenue / total revenue × 100 | ≥20% | Monthly |
| **B2B Conversion Rate** | B2B checkouts completed / B2B checkouts started | ≥40% | Weekly |
| **Net Terms Utilization** | Orders using net-30/60/90 / B2B orders | ≥50% | Weekly |
| **Enterprise Account Growth** | New enterprise accounts per month | ≥3/month | Monthly |
| **Average B2B Order Value** | B2B revenue / B2B orders | ≥$500 | Weekly |

---

## Objective 5: Enable Data-Driven Growth

> *"Can't improve what you can't measure."* — Market Research, every source

**Why:** Without analytics, we can't measure revenue growth, identify bottlenecks, or optimize any feature. This objective enables all other objectives.

| Key Result | Metric | Baseline | Target | Owner | Phase |
|-----------|--------|----------|--------|-------|-------|
| KR 5.1: Ship analytics dashboard with revenue tracking | Dashboard live | No | Yes, live with daily refresh | Engineering | Phase 2 (Weeks 5-7) |
| KR 5.2: Track full conversion funnel | Funnel stages tracked | 0 | 5 stages (visit → browse → add-to-cart → checkout → purchase) | Engineering | Phase 2 (Weeks 6-7) |
| KR 5.3: Enable CSV/PDF report export | Reports exported/week | 0 | ≥5 exports/week | Engineering | Phase 3 (Week 8) |
| KR 5.4: Measure all OKR KPIs automatically | KPIs tracked automatically | 0/25 | 25/25 | Engineering | Phase 3 end |

### KPIs for Objective 5

| KPI | Definition | Target | Measurement Frequency |
|-----|-----------|--------|----------------------|
| **Total Revenue** | Sum of completed order values | +20% vs Week 4 baseline | Daily |
| **Revenue Growth Rate** | (Rev_current − Rev_previous) / Rev_previous × 100 | ≥20% by quarter end | Weekly |
| **Funnel Drop-off Rate** | % lost at each funnel stage | Identify, then reduce top 2 by 25% | Weekly |
| **Dashboard Active Users** | Unique staff viewing dashboard/week | ≥10 | Weekly |
| **Report Generation Rate** | CSV/PDF exports per week | ≥5 | Weekly |

---

## Implementation Roadmap

```
Q2 2026 — 12-Week Plan
═══════════════════════

Phase 0: SECURITY (Weeks 1-2)            Obj 1: KR 1.4
├── Fix RCE command injection (#2)        ████░░░░░░░░
├── Fix XSS in Login (#3)
├── Add API authentication (#1)
└── Add input validation (#5)

Phase 1: REVENUE (Weeks 2-4)             Obj 1: KR 1.1-1.3
├── Complete checkout flow (#44)          ░░████░░░░░░
├── Cart persistence (localStorage)
├── Guest checkout
└── Mobile nav fix

Phase 2: DISCOVERY (Weeks 4-8)           Obj 2 + Obj 5
├── Product search + autocomplete (#47)   ░░░░████████
├── Categories + faceted filters (#36)
├── Product reviews & ratings (#41)
├── Analytics dashboard (#13)
├── Order history + tracking
└── Delivery tracking UI (#14)

Phase 3: RETENTION (Weeks 8-10)          Obj 3 + Obj 4
├── Quick reorder (#45)                   ░░░░░░░░████
├── Abandoned cart recovery
├── B2B payment terms (PO, net-30)
└── Report export (#15)

Phase 4: EXPANSION (Weeks 10-12)         Obj 4
├── Loyalty program (#46)                 ░░░░░░░░░░██
├── AI recommendations
├── Approval workflows
└── Subscription ordering (#48)
```

---

## Tracking & Governance

### Weekly Metrics Review
Every Monday, review these leading indicators:

| Metric | Source | Action Threshold |
|--------|--------|-----------------|
| Checkout completion rate | Analytics dashboard | <50% → investigate UX |
| Cart abandonment rate | Analytics dashboard | >60% → deploy recovery |
| Conversion rate trend | Analytics dashboard | Declining 2 weeks → intervene |
| Revenue vs. target | Analytics dashboard | <pace for 20% → reallocate |
| Open critical bugs | GitHub issues | >0 → stop features, fix bugs |

### Monthly Business Review
End of each month, present to leadership:

1. Revenue actuals vs. 20% target trajectory
2. OKR progress (red/yellow/green per Key Result)
3. Customer satisfaction trends (persona re-interviews)
4. Competitive feature gap closure rate
5. Top customer complaints and resolution status

### Quarter-End Assessment
At Q2 end (June 10, 2026):

- Did we hit 20% revenue growth? → Measure via analytics dashboard
- Which OKRs were achieved? → Score each KR (0.0 - 1.0)
- What's the competitive gap now? → Re-run competitive analysis
- What should Q3 focus on? → Based on gap and persona feedback

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|:---------:|:------:|------------|
| Security breach before patches ship | Medium | Critical | Phase 0 is a hard blocker — no other work until patched |
| Checkout ships but conversion is <30% | Medium | High | Follow Baymard best practices; guest checkout; iterate weekly |
| B2B features deprioritized for B2C | High | High | Reserve 20% of engineering capacity for B2B in Phase 3+ |
| Analytics not ready to measure growth | Medium | High | Ship basic tracking in Phase 2 Week 5 — don't wait for full dashboard |
| Team capacity insufficient for 12-week plan | Medium | Medium | Identify Phase 4 as "stretch" — Phases 0-2 are the must-haves |

---

## Success Criteria

**The quarter is a success if:**

1. ✅ Checkout is functional with ≥60% completion rate
2. ✅ Zero critical security vulnerabilities
3. ✅ Product search and filtering are live with ≥50% usage
4. ✅ Analytics dashboard tracks revenue and conversion daily
5. ✅ Revenue shows ≥20% growth vs. Week 4 baseline
6. ✅ ≥25% of customers are repeat buyers
7. ✅ At least 3 enterprise B2B accounts onboarded

**Stretch goals:**
- Loyalty program launched
- AI recommendations live
- Subscription ordering available
- WCAG 2.1 AA compliance achieved
