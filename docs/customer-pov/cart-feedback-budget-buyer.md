# Shopping Cart Feedback — Carmen Delgado, Budget-Conscious Buyer

**Reviewer:** Carmen Delgado, Office Manager, Phoenix AZ Nonprofit  
**Date:** March 10, 2026  
**Page Tested:** Shopping Cart (`/cart`)  
**Device:** Chromebook (desktop browser)  
**Scenario:** Monthly supply order — 4 items, testing coupon code, comparing pricing

---

## Overall Rating: 4/10

I wanted to like this cart. The layout is clean, the table is readable, and the quantities update in real time. But the pricing is fundamentally broken in ways that would get me fired if I submitted this to my board. I cannot trust this cart with donor dollars.

---

## 1. Price Clarity — FAILING

**What I see:** Unit prices displayed as rounded whole numbers — $130, $200, $90, $80. No cents.

**What I need:** I need $129.99, $199.99, $89.99, $79.99. Every cent matters when I'm comparing across 4 supplier sites. If I'm building a purchase justification spreadsheet and this site shows $130 while their competitor shows $129.99, I'm going to pick the competitor because I can't verify the real price.

**The real damage:** My board reviews supply spending to the penny. I can't submit a receipt that says "$130" when the product page says "$129.99." That's $0.01 I can't account for — and Linda (my ED) will ask about it.

**What competitors do:** Every supplier I use — Staples, Amazon Business, Uline — shows prices to the cent. Always. No exceptions.

---

## 2. Discount Visibility — CRITICALLY BROKEN

### The 25% OFF Bug

This is the one that makes me close the tab and never come back.

SmartFeeder One is advertised on the product page as **$129.99 ~~crossed out~~ → $97.49 (25% OFF)**. Beautiful. I love a sale. I added two to my cart.

**In the cart, it shows $130 per unit. The ORIGINAL price. Not the sale price.**

I just got charged $260 for two items that should cost $194.98. That's **$65.02 more than advertised**. For my entire test cart of 4 items (two of which were "on sale"), I'm being overcharged significantly. On an $8,000 annual budget, this kind of error would cost hundreds of dollars over a year.

This isn't a UX issue. This is a trust-destroying bug. If I caught this at checkout, I would never order from here again. If I didn't catch it, I'd be overpaying with donor money.

### The 5% "Discount" That's Always There

The cart always shows a 5% discount line item: "Discount(5%) -$31.50." Always. Whether I use a coupon or not. Who decided I always get 5% off? Where does this come from? Is it a member discount? A first-time buyer discount? A mistake?

I need to know WHY I'm getting this discount so I can explain it to my finance team. "There was this mystery 5% off" is not something I can put in a board packet.

---

## 3. Coupon Experience — DECEPTIVE

I typed "techconnect" into the coupon field. I clicked "Apply Coupon." It said **"Applied!"** in green text.

And then... nothing changed. Not the subtotal. Not the discount. Not the grand total. Not a single number moved.

The coupon code "techconnect" is **cosmetic only**. It shows a success message but applies zero additional savings. This is the shopping equivalent of a placebo. The promo popup on the products page announced "30% OFF GitHub Copilot Chef's Hat — Promo Code: TechConnect." I expected at least SOMETHING to change.

**What I expected:** Either a new discount line item ("Coupon TECHCONNECT: -$X.XX") or an increased discount percentage. Something visible, something I can screenshot for receipts.

**What I got:** A word. "Applied!" A word that lies.

If a supplier did this to me in real life, I'd call their customer service, ask for a manager, and then switch suppliers. My nonprofit doesn't have money to waste on sites that promise discounts and don't deliver them.

---

## 4. Savings Opportunities — ALMOST NONE

Here's what I see for ways to save money on this site:

| Savings Feature | Available? | Notes |
|---|---|---|
| Coupon codes | Broken | Shows "Applied!" but doesn't change price |
| Product sale prices (25% OFF) | Broken | Cart charges full price anyway |
| Bulk/quantity discounts | No | No "buy 5+ get 10% off" tiers |
| Free shipping threshold | No | Flat $10 always |
| Price alerts / sale notifications | No | Can't set "notify me when price drops" |
| Bundle deals | No | No product bundles for savings |
| Loyalty/repeat buyer discounts | No | No account-based pricing |
| Side-by-side price comparison | No | Can't compare similar products |

**That's zero working savings features.** The 5% discount is automatic and unexplained. The coupon is fake. The sale prices don't carry to the cart.

---

## 5. Shipping Cost — NEEDS WORK

$10 flat shipping on a $630 order? That's 1.6% — tolerable. But on an $80 order (if I only bought the collar), that's 12.5%. That's painful.

**What I need:**
- Free shipping over $200 (most B2B suppliers do $150-$250 threshold)
- Visible shipping tiers: "Spend $X more for free shipping!" with a progress bar
- For my Board: I need to show we're not wasting money on shipping. A flat fee with no way to avoid it looks bad in year-end reports

**What competitors do:** Amazon Business = free shipping on most items. Staples = free shipping over $49. Uline = variable but shows rates upfront. Every single competitor lets me avoid shipping costs if I plan my order right.

---

## 6. Missing Budget Features

### Must-Have (Blocking Purchase)
1. **Per-unit pricing everywhere** — Show me $/unit, $/piece on product cards AND in the cart. I calculate this manually right now for every order across every supplier.
2. **Working discount prices in cart** — If you say 25% OFF on the product page, the cart MUST reflect that price. This is non-negotiable.
3. **Working coupon codes** — If you advertise a promo code, it must actually change the total. Otherwise remove the coupon field.

### Should-Have (Would Influence Switching)
4. **Export to CSV/PDF** — I need date, item, SKU, qty, unit price, total in a format I can paste into my spreadsheet. Right now I'd have to retype everything from the screen.
5. **Order history with unit prices** — When my board asks "what did we pay for cat feeders last quarter?", I need a one-click answer.
6. **Free shipping threshold** — Show me "Add $X more for free shipping!" I will absolutely add items to hit the threshold.
7. **Bulk discount tiers** — "Buy 5+ for 10% off, 10+ for 15% off." Show me the tiers on the product page and in the cart.

### Nice-to-Have (Would Delight)
8. **Price comparison view** — Let me select 2-3 products and see them side by side: price, unit cost, rating, shipping.
9. **Price drop alerts** — "Email me when SmartFeeder One drops below $90." I would use this constantly.
10. **Budget tracking** — Let me set a monthly budget ($400) and show me where I am. "You've spent $260 of $400 this month."

---

## 7. Cart Persistence — BROKEN

During testing, the cart emptied itself multiple times when I navigated between pages. The cart state is stored in memory only — no localStorage, no cookies, no session persistence. If I accidentally close the tab or my Chromebook restarts, my carefully curated cart is gone.

I spend 20-30 minutes building each order, comparing products, adjusting quantities. Losing that work is not acceptable. Every other supplier site remembers my cart for at least 24 hours.

---

## 8. Top 3 Recommendations

### 1. Fix the pricing — discounted products MUST show discounted prices in the cart
This is a showstopper. The cart currently charges full price ($129.99) for items advertised at $97.49 (25% off). This would result in overcharging customers. Until this is fixed, I cannot place an order. At my nonprofit's annual volume, this bug would cost us hundreds of dollars.

### 2. Make the coupon code actually work
The "techconnect" coupon shows "Applied!" but changes nothing. Either wire it up to add a real discount (the promo says 30% off Chef's Hat) or remove the coupon field entirely. A fake coupon field is worse than no coupon field — it wastes my time and erodes trust.

### 3. Add per-unit pricing and CSV export for budget accountability
Show prices to the cent ($129.99, not $130). Add a "Download as CSV" button to the order summary. I need to justify every purchase to my board with exact numbers. Without exportable, precise pricing data, I can't choose this supplier over competitors who provide it.

---

## The Bottom Line

I *want* to buy from OctoCAT Supply. The products look great. Grant (our office therapy cat) would love the SmartFeeder. But right now, this cart is asking me to pay more than the advertised price, accept a fake coupon, and trust rounded-off numbers. I can't do that with donor money.

Fix the pricing bugs. Add export. Show me the real numbers. Then we'll talk.

— Carmen Delgado  
*Office Manager, Every Dollar Counts*
