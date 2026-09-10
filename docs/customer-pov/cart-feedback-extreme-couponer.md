# Cart & Coupon System Review — Connie Battaglia, Extreme Savings Strategist

**Date:** March 10, 2026  
**Reviewer:** Connie Battaglia, 44, Syracuse, NY  
**Testing Context:** OctoCAT Supply shopping cart and coupon/discount system  
**Cats Fed by This Budget:** 5 (Penny, Nickel, Dime, Quarter, Dollar)  
**Browser Tabs Open During Review:** 14 (as usual)  

---

## Overall Rating: 2/10

I don't give a 2 lightly. I give a 2 because I've been doing this for 12 years and I have *never* seen a coupon system that lies to your face this brazenly. A popup screams "30% OFF" with a promo code, you type the code in, it says "Applied!" — and then your total doesn't change by a single penny. That's not a coupon system. That's a trust violation. I'm getting ahead of myself. Let me walk you through it.

---

## What I Was Trying to Do

I wanted to evaluate whether OctoCAT Supply is worth adding to my cat supply price-tracking spreadsheet (14 tabs, 200+ products, 8 competitor websites). Specifically, I wanted to:

1. Understand the pricing structure and any available discounts
2. Test the coupon/promo code system advertised on the site
3. Determine if I can stack discounts or earn loyalty rewards
4. Calculate price-per-unit to compare against Chewy, Amazon, and Costco
5. Decide whether this site deserves a column in my spreadsheet

---

## What Actually Happened

### Step 1: The Promo Popup — A Promise Too Good to Check (But I Checked)

The moment I hit the Products page, a big popup appeared:

> **EXCLUSIVE SALE!**  
> GitHub Copilot Chef's Hat  
> **30% OFF**  
> For Microsoft Tech Connect Attendees Only  
> Promo Code: **TechConnect**

My heart rate went up. 30% off? On a $72.99 item? That's $21.90 in savings, bringing the hat down to $51.09. I wrote it down. I prepared my cart strategy around this discount. This is what I do.

### Step 2: Building My Cart

I added items to the cart:

| Product | Listed Price | Quantity | Line Total |
|---------|-------------|----------|------------|
| GitHub Copilot Chef's Hat | $72.99 (displayed as "$73") | 1 | $73 |
| SmartFeeder One | $129.99 (displayed as "$130") | 2 | $260 |
| PawTrack Smart Collar | $79.99 (displayed as "$80") | 1 | $80 |

**Subtotal: $463** (displayed — actual calculated: $462.96)

Already I noticed something that made my eye twitch: **the prices are rounded to whole dollars in the cart.** The SmartFeeder One is listed as "$130" in the cart, but on the product page it's $129.99. On a single item that's a $0.01 display discrepancy. On 12 bags of cat litter at scale, that kind of rounding obscures whether you're getting the real price. I need cents. I live in the cents.

### Step 3: The Mystery 5% Discount

Before I even typed a coupon code, the Order Summary showed:

- **Subtotal:** $463
- **Discount (5%):** -$23.15
- **Shipping:** $10
- **Grand Total:** $449.81

Wait. A 5% discount? Applied automatically? Where did this come from? There's no explanation. No label like "Member Discount" or "First-Time Buyer" or "Because We Like You." Just "Discount(5%)." I checked every page on the site. There's no mention of an automatic 5% discount anywhere except this line in the cart.

I have questions:
- Is this always active? If so, it's not a discount — it's the real price
- Does it change based on cart total? Order frequency? Account type?
- Can I combine it with other offers?
- Why is there no explanation?

On Chewy, the Autoship discount is clearly labeled "Autoship: Save 5% on recurring deliveries." On Amazon, Subscribe & Save shows "Save 5-15% on subscription." Here? Mystery meat.

### Step 4: Applying the "TechConnect" Coupon — The Betrayal

I typed "techconnect" into the Coupon Code field. I clicked "Apply Coupon."

The green text appeared: **"Applied!"**

I looked at the Order Summary:

- **Subtotal:** $463
- **Discount (5%):** -$23.15
- **Shipping:** $10
- **Grand Total:** $449.81

I looked again. I refreshed my mental math. I checked three times.

**The total did not change. Not by one cent.**

The coupon said "Applied!" but it did absolutely nothing. The 5% discount was already there before I typed the code. The 30% off promised in the popup? Nowhere to be found. The Grand Total should have been approximately $339.07 if 30% was applied to the Chef's Hat, or $334.08 if applied to the entire cart. Instead: $449.81. Same as before.

I have been couponing for 12 years. I have seen every trick in the book — inflated pre-sale prices, "limited time" offers that run permanently, subscription traps that silently increase prices. But I have never seen a site display a popup promising 30% off, accept the promo code, say "Applied!" with a cheerful green checkmark, and then **change nothing about the price.**

That's not a bug. That's a bait-and-switch.

### Step 5: Testing Invalid Coupon Codes

To see if the system was even functional, I tested three invalid codes:

| Code | Result |
|------|--------|
| SAVE50 | "Invalid coupon code" (red text) |
| DISCOUNT | "Invalid coupon code" (red text) |
| FREE | "Invalid coupon code" (red text) |

So the system CAN distinguish between valid and invalid codes. It knows "techconnect" is "valid." It just doesn't DO anything with that information.

### Step 6: Testing the "Update Cart" Button

There's a green "Update Cart" button next to the coupon field. I clicked it. Nothing happened. No confirmation, no recalculation, no feedback. It's a decorative button. It sits there looking important and doing nothing — like a checkout lane at a store with no cashier.

---

## How It Made Me Feel

**Furious.** And then suspicious.

I am not a person who uses the word "furious" casually. But when a website promises me a 30% discount, accepts my code, tells me it worked, and then charges me full price? That's the kind of thing I post about in my local Facebook couponing group with a warning emoji and a screenshot. That's the kind of thing that gets a site permanently blacklisted from my spreadsheet.

The missing explanation for the 5% auto-discount also makes me suspicious. Is the "real" price 5% lower, and they're just showing an inflated price with a fake discount to make me feel like I'm getting a deal? Because that's a technique I've seen before, and I have zero patience for it.

---

## What It Cost Me

1. **Time:** 25 minutes evaluating a coupon system that doesn't actually function
2. **Trust:** 100% gone. If the coupon system lies, what else on this site is fake?
3. **Potential savings lost:** $21.90 on the Chef's Hat alone (the 30% that was promised but never delivered)
4. **Spreadsheet column:** This site will not be getting one

---

## What I Expected Instead

Based on my experience with Chewy, Amazon, PetSmart, Petco, Walmart, Target, Costco, and every other pet supply retailer I track:

1. **A coupon code that actually changes the price.** When I enter "TechConnect" on Chewy, my Autoship discount stacks with the promo and I see the line item change in real time. That's the minimum expectation.

2. **A clear breakdown of every discount.** Chewy shows: "Autoship Savings: -$X.XX" and "Promo Code SAVE20: -$X.XX" as separate line items. I need to see exactly what each discount does to my total.

3. **Price display with cents.** "$129.99" and "$130" are not the same number. When I'm comparing prices across 8 websites to the penny, rounding to whole dollars makes your site useless for price comparison.

4. **An explanation for the 5% auto-discount.** Tell me where it comes from, whether it's permanent, and whether I can increase it by spending more or subscribing.

5. **A loyalty/rewards program.** Every major pet retailer has one. Chewy has Autoship (5% recurring discount). Amazon has Subscribe & Save (5-15%). PetSmart has Treats Rewards (8 points per dollar, $5 reward per 1,000 points). If OctoCAT Supply has no loyalty program, there's zero reason for me to consolidate my purchases here versus splitting across whoever has the best price on any given day.

6. **Quantity discount breakpoints.** I buy in bulk. Show me: "Buy 3, save 10%. Buy 6, save 20%." I need to know the exact quantities where price breaks kick in so I can calculate the optimal order size.

7. **Price history or price alerts.** I track prices myself in a spreadsheet with 14 tabs. But it would save me 20 minutes per day if the site showed a 30-day price trend or let me set an alert for "notify me when SmartFeeder One drops below $90."

---

## Would I Come Back?

**No.** Not in its current state. And here's the specific competitor I'd go to instead:

The SmartFeeder One is listed at $129.99 (with a "25% OFF" badge showing $97.49). I'd need to verify whether Chewy or Amazon carries this product, but if they do, and if they offer even a 5% Autoship/Subscribe discount on top, that's $92.62 — $4.87 less than OctoCAT's "sale" price. And I'd trust that the price I see is the price I pay, because those sites don't have coupon systems that lie to me.

---

## My One Ask

**Make the coupon code actually work.**

That's it. That's the ask. The promo popup promises 30% off the GitHub Copilot Chef's Hat with code "TechConnect." When I type that code in, the price of the Chef's Hat should drop from $72.99 to $51.09, and the Order Summary should show a new line item: "Promo Code TechConnect: -$21.90." The Grand Total should decrease by exactly $21.90. If you promise a discount, deliver the discount.

Right now, this coupon system is a green "Applied!" message attached to nothing. It's like a receipt that says "You saved $0.00!" — technically accurate, deeply insulting.

Fix the coupon. Show me real savings with real numbers. Then we'll talk about whether OctoCAT Supply earns a column in my spreadsheet.

---

## Detailed Findings Summary

### 1. Coupon UX — Rating: 1/10

The coupon field exists. It accepts input. It has an "Apply Coupon" button. It shows "Applied!" for valid codes and "Invalid coupon code" for invalid ones. So far, so competent. But it **does not actually apply any discount to the price.** The entire coupon system is cosmetic. The promo popup on the Products page promises 30% OFF with code "TechConnect," but applying that code changes nothing in the Order Summary. Zero. The Grand Total before and after applying the coupon: identical to the penny.

### 2. Discount Stacking — Rating: 0/10

There is nothing to stack. The only discount that exists is a 5% auto-discount that's always present regardless of whether you enter a coupon code. There is no second discount to combine with it. The coupon code adds zero. You cannot stack zero with anything.

### 3. Error Messages — Rating: 5/10

Invalid codes ("SAVE50", "DISCOUNT", "FREE") correctly show "Invalid coupon code" in red text. This is the one thing the coupon system does competently. However, there's no helpful guidance like "This code has expired" or "This code is not valid for items in your cart" or "Did you mean TECHCONNECT?" Just a flat "Invalid coupon code." Chewy tells you specifically if a code has expired vs. doesn't apply to your items. That distinction matters.

### 4. Savings Visibility — Rating: 3/10

The Order Summary shows a "Discount(5%)" line with the dollar amount. That's the bare minimum. What's missing:
- No explanation of where the 5% comes from
- No breakdown if multiple discounts apply (not that any do)
- No "You saved $X.XX on this order!" summary
- No comparison to what you'd pay at full price
- Prices rounded to whole dollars in the cart, hiding the actual cents
- No price-per-unit calculation for bulk buyers

### 5. Missing Coupon Features — What I Need

1. **Coupons that change the price** — the most basic requirement
2. **Coupon stacking** — let me combine a site-wide coupon with a product-specific promo
3. **Visible promo code field before cart** — I need to know what promos exist before I build my cart, not after
4. **Loyalty/rewards program** — points, tiers, recurring discounts
5. **Bulk quantity discounts** — buy 3/save 10%, buy 6/save 20% breakpoints
6. **Price alerts** — notify when a product drops below my target price
7. **Price history** — show me the 30/60/90-day price trend
8. **Coupon expiration dates** — when does TechConnect expire? It doesn't say

### 6. Price Comparison — Rating: 2/10

Prices are shown but:
- Cart rounds to whole dollars (useless for comparison)
- No price-per-unit for different sizes
- No competitor price reference
- Sale prices on product page (e.g., SmartFeeder $129.99 → $97.49) become just "$130" in the cart, with the sale price apparently not carrying through to the cart display
- The "25% OFF" product badge seems to affect the price in the product listing but the cart shows the original price per unit — inconsistent and confusing

### 7. Top 3 Recommendations

1. **FIX THE COUPON**: The "TechConnect" promo code must actually apply 30% off the Chef's Hat (or whatever it promises). Right now it says "Applied!" and does nothing. This is the single most damaging issue on the entire site, because it destroys trust. If I can't trust the coupon system, I can't trust the prices.

2. **SHOW REAL PRICES WITH CENTS**: Display "$129.99" not "$130" in the cart. When I'm comparison shopping across 8 websites, every penny matters. Rounding makes it impossible to verify I'm being charged correctly and impossible to compare against competitors like Chewy ($97.49 sale price) or Amazon.

3. **ADD A LOYALTY PROGRAM WITH VISIBLE BENEFITS**: Give me a reason to buy here repeatedly instead of cherry-picking the lowest price across 8 sites. Even a basic "spend $100 get $5 off next order" would create some switching cost. Without loyalty incentives, I have zero reason to consolidate purchases on a site where the coupon system doesn't work.

---

*— Connie Battaglia*  
*"I paid $8.99 for that litter. Regular price is $14.99. That's 40% off. I bought 12 bags. That's $72 in savings on one order. You're welcome. And OctoCAT Supply? They couldn't even give me the 30% they promised on a chef's hat."*
