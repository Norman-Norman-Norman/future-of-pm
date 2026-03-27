# OctoCAT Supply — Competitive Review: Branch Manager Perspective

**Reviewer:** Priya Sharma, Branch Manager — Northeast Region  
**Location:** Boston, MA  
**Date:** March 10, 2026  
**Context:** Competitive analysis against Amazon; 20% revenue growth target for next quarter  
**Specs Reviewed:** Catalog Management, Order Management & Checkout, Logistics & Delivery Tracking, Customer Experience & Retention, Analytics & Reporting  
**Branch Profile:** 14 staff, ~400 active B2B customers, second-highest performing branch in region  

---

## 1. Gut Reaction

Here's the thing — I read through all five specs and then I went and looked at the actual code, and I'm going to be honest with you: we are asking our customers to compete in a knife fight with a spoon. Our checkout button literally does nothing. I clicked "Proceed To Checkout" and... nothing. No handler. No redirect. Nothing. We are sending customers through a beautiful product catalog, letting them build a cart, and then slamming a brick wall in their face at the moment they want to give us money. Meanwhile Amazon has one-click ordering and same-day delivery. I'm not even mad — I'm embarrassed. My sales floor team is telling customers to "call us to place the order" because the website can't close a sale. That is not a 2026 experience.

---

## 2. The Customer Angle

Let me tell you about my best customer, Torres Hardware. They order from us every two weeks — about $3,200 per order. Last month, their new procurement manager tried to use our website instead of calling Jamal in our warehouse. She loaded up a cart, clicked checkout, and nothing happened. She called us confused. Then she called Amazon Business. We almost lost a $80K annual account because our checkout button is decorative.

My customers don't care about our internal architecture. They care about three things:
1. Can I find what I need? (Sort of — search is basic, no filters)
2. Can I buy it? (NO — checkout is broken)
3. Can I track it? (NO — zero visibility after the order)

We are failing on two out of three. The customer doesn't care that we have beautiful API endpoints for deliveries if there's no UI to see them. They don't care that we have an order model with a status field if they can't check their order status. They see Amazon showing them a live map of their delivery driver and then they come to us and get... silence.

---

## 3. Top Priorities — What My Branch Needs to Hit Revenue Targets

1. **FIX CHECKOUT. TODAY.** (Order Management spec, RICE 10.0) — This isn't a feature request, this is a fire. Every day without a working checkout is lost revenue. My team is processing orders by phone and manually entering them. That's 2-3 hours of admin time daily that could be spent on customer relationships. The cart is built. The API endpoints exist. The button just needs to DO something.

2. **Cart persistence** — Right now, if a customer refreshes the page, their cart is gone. It's React state only, `useState<CartItem[]>([])`, zero persistence. My customer builds a $2,000 cart, their browser crashes, and they start over? Or worse — they don't start over, they go to Amazon. This has to be localStorage at minimum, server-side for logged-in users.

3. **Order history and tracking** — After someone places an order, they need to see it. Status, estimated delivery, tracking number. Right now we have delivery data in the API (`/api/deliveries`) but ZERO frontend for it. My admin staff, Sarah, spends an hour a day fielding "where's my order?" phone calls. An hour. Every day. Give customers a "My Orders" page and that hour goes back to productive work.

4. **Product search and filtering** — We have 13 products now but the catalog is growing. Right now it's a single text search box, no categories, no price filter, no supplier filter. When we scale to 50+ products, customers won't scroll through a flat grid. They'll leave. Amazon has autocomplete, spell correction, and recommendations — we have a text input with `.includes()`.

5. **Branch performance dashboard** — I check my branch's daily revenue, fill rate, and order volume before my first coffee every morning. Today I do that by exporting data from three systems into a spreadsheet. There is ZERO analytics in this platform. No revenue tracking, no conversion metrics, no product performance. How am I supposed to track progress toward a 20% growth target if I can't even see current revenue?

---

## 4. Pain Points — What Worries Me and What Won't Work at Branch Level

**The checkout gap is causing real customer complaints.** My team has logged 23 complaints in the last month about the online ordering experience. The top three complaints:
- "I can't complete my order online" (checkout broken)
- "I don't know where my order is" (no tracking)
- "I lost my cart" (no persistence)

**The flat $10 shipping is wrong for B2B.** I looked at the cart code — `const SHIPPING_COST = 10;`. A flat $10 whether someone orders $50 or $5,000? My warehouse lead Jamal would laugh. Shipping should be based on weight, volume, and destination. Torres Hardware orders 200 units at a time — $10 shipping for that is either eating our margin or insulting theirs.

**The coupon system is consumer-grade.** There's one hardcoded coupon code ("techconnect") for a flat 5% off everything. B2B customers need volume pricing, negotiated rates, and contract terms. My top 10 customers have different price agreements — I can't honor any of them through this system.

**No loyalty or retention features at all.** The customer experience spec says it clearly: "There are currently ZERO customer retention features." We're competing against Amazon Prime, which has free shipping, Subscribe & Save, and a whole ecosystem of lock-in. We have... a promo popup on the products page. My customers have no reason to come back except that they like us personally. That's a relationship model, not a scalable business.

**The security vulnerability in deliveries scares me.** The logistics spec mentions a command injection vulnerability in the delivery status endpoint — `exec(notifyCommand)`. I don't pretend to understand the technical details, but my warehouse team uses that delivery system. If something goes wrong with that, our entire delivery tracking is compromised.

---

## 5. Would I Use This Platform? — MAYBE, But Not Today

**Today: No.** I literally cannot complete a transaction. My team would spend MORE time working around the system than just doing things manually. The cart is nice. The product grid looks professional. But it's a showroom with no cash register.

**With checkout + cart persistence + order tracking: Yes, absolutely.** The bones are good. The product catalog works, the cart UI is clean, the API layer has most of what we need. If we can close the gap between "browse" and "buy and track," this could genuinely replace the phone-and-email ordering that 60% of my customers still rely on.

**With analytics dashboards: I'd be in this system every morning.** Right now I start my day across three different tools. Give me one screen with today's orders, at-risk orders, revenue vs. target, and stock alerts, and I'll make this my home page.

---

## 6. What's Missing — Things the PM Hasn't Considered from Branch Level

- **Inter-branch inventory visibility.** When I'm out of WhiskerWare Interactive Laser Modules and the Rhode Island branch has 200 units, I need to see that and transfer stock. The specs don't mention inter-branch transfers at all. This is a daily headache for me.

- **Customer-specific pricing.** B2B customers don't all pay the same price. Torres Hardware gets 12% off because they're a volume buyer. The new coffee shop down the street pays list price. There's no concept of customer pricing tiers anywhere in the specs.

- **Branch-level permissions.** I should see my branch's data, my regional director should see the region, HQ should see everything. The specs talk about analytics dashboards but don't mention data scoping by branch. If I'm looking at a revenue dashboard, I need MY branch revenue, not the company total.

- **Proactive customer communication.** When orders are delayed, I want to notify customers BEFORE they call me. "Your CatNap Deluxe Bed shipment is delayed 2 days due to supplier backlog" — sent automatically. Right now my team makes those calls manually.

- **Quick reorder for branch restocking.** My warehouse does similar restock orders every 2 weeks. A "reorder last order" button would save Jamal 30 minutes every cycle.

- **Mobile-friendly operations view.** I'm on the floor half the day. I need to check order status, approve purchase requests, and see alerts from my phone. The specs don't mention a mobile experience for branch staff at all.

---

## 7. My Ask — If I Could Change One Thing

Fix the checkout. I know I keep saying it, but the customer doesn't care about — I need to stop and just say this clearly: **we cannot grow revenue by 20% if customers cannot buy things.** Everything else — loyalty programs, analytics, product recommendations — those are important and I want all of them. But they're optimization on top of a funnel that is currently broken at the most critical step.

Get checkout working, persist the cart, and give customers order tracking. Do those three things and I will personally guarantee my branch hits its number. My customers WANT to order from us online. They're literally trying to give us money and our website won't let them.

Then give me a dashboard so I can prove it.

---

*"Our fill rate is 94%, which sounds fine until you realize that 6% represents 24 angry customers a month who tried to buy something and couldn't. Now add in the fact that 100% of online orders fail because checkout doesn't work, and you see why I'm on fire about this."*

— Priya Sharma, Branch Manager, Northeast Region
