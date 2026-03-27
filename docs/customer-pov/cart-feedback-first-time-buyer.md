# Shopping Cart Feedback — First-Time Buyer Perspective

**Reviewer:** Aisha Johnson, Founder & CEO, coworking space startup (Brooklyn, NY)  
**Date:** March 10, 2026  
**Feature Tested:** Shopping Cart (`/cart`)  
**Test Path:** Products → Add Items → Cart → Coupon → Checkout Readiness  
**Device:** MacBook Air, browser  

---

## 1. Overall Rating: 5/10

Look, I *want* to like this. The products are fun, the cat-tech branding is cute (Venture would love a SmartFeeder), and the green color scheme feels fresh. But the cart experience has enough rough edges that I'd probably abandon mid-order and go back to Amazon if this were a real purchase. I've been shopping online for over a decade. This cart feels like it was built by engineers who've never had to buy their own office supplies.

---

## 2. First Impressions (The First 60 Seconds)

I landed on the products page and was immediately hit with a **promo popup** blocking the entire screen — "EXCLUSIVE SALE! 30% OFF GitHub Copilot Chef's Hat" with a promo code "TechConnect." Cool concept, but:

- It blocks EVERYTHING until I click "OK." I can't browse, I can't scroll, I can't close it by clicking outside. On Amazon, popups never block me from seeing products.
- It appears on **every single page load**. I refreshed the products page during testing and got hit with the same popup again. And again. And again.
- The promo code is "TechConnect" but the coupon field in the cart accepts "techconnect" (case-insensitive). Fine, but nowhere does the popup tell me to enter this in the cart. It just says "Promo Code" like I'm supposed to know what to do with it.

The cart itself, once I finally got items into it, looks clean enough. Table layout, green accents, Order Summary on the right. First thought: "OK, this looks like a real shopping cart." Second thought: "Wait, where did my discount go?"

---

## 3. What Worked Well

- **Cart table layout is clear.** I can see my items, quantities, unit prices, and line totals at a glance. The table structure makes sense.
- **Quantity spinners work.** I could type a number directly into the quantity field and the totals updated instantly. No page reload needed. That's table stakes, but at least it works.
- **Remove button works.** Clicked the trash icon, item disappeared. Simple. My only wish is a confirmation ("Are you sure?") because I almost deleted the wrong item.
- **Order Summary panel** is on the right side and stays visible. Shows subtotal, discount, shipping, and grand total. This is standard but well-executed.
- **Coupon code input** is visible and accessible. Typed "techconnect," hit Apply, got green "Applied!" text. Immediate feedback — that's good.
- **Cart badge** in the nav shows item count. Helpful to know I have items while browsing products.
- **Dark mode toggle** is a nice touch. Didn't test it deeply but it's there.

---

## 4. Pain Points

### The prices don't match between pages.
On the Products page, the SmartFeeder One is listed at **$129.99** (with a "$97.49" sale price shown as "25% OFF"). But in my cart, it shows up as **$130** at full price. Where did my 25% off go? Did I imagine the sale? This feels like a bait-and-switch. If a product shows "25% OFF" on the catalog, that discount needs to follow me into the cart. Period.

Same with the Chef's Hat: listed at $72.99 on the products page, shows as $73 in the cart. I know that's rounding, but rounding UP? On Amazon, $72.99 stays $72.99 everywhere. Consistency matters for trust, especially with a first-time customer.

### What is this 5% discount and where did it come from?
The Order Summary shows "Discount(5%): -$20.65" and I have no idea why. I didn't enter a coupon code yet. Is this a membership discount? A first-time buyer perk? A loyalty reward? **There is zero explanation.** When I DID apply the "techconnect" coupon, the discount didn't seem to change or stack. So what does the coupon actually DO? The green "Applied!" text tells me it worked, but... worked how? Nothing changed in my total. Where's the "Coupon discount: -$X" line item?

### The "Update Cart" button — what does this update?
There's a green "Update Cart" button at the bottom of the cart table. I changed a quantity and the totals updated automatically. So what does this button do that isn't already happening? On most sites I use, quantity changes either auto-save or there's a clear "Save Changes" button. Having both auto-updating totals AND a manual "Update Cart" button is confusing. Is one of them not actually saving? Am I supposed to click this? What happens if I don't?

### Cart state vanishes on page reload.
I refreshed the page. Cart: empty. All my items: gone. I have to go back to Products, fight through the promo popup again, re-add everything item by item. On Amazon, my cart survives for WEEKS. On this site, it doesn't survive a browser refresh. For a first-time buyer who might be comparison shopping in multiple tabs, this is a dealbreaker. I'd add items, switch to a competitor's tab, come back, and my cart would be empty.

### Adding items to the cart is weirdly fragile.
I tried adding three products (Chef's Hat, SmartFeeder, PawTrack) and it took multiple attempts. The promo popup repeatedly blocked my clicks. The quantity would reset to 0 between interactions. Sometimes I'd click "Add to Cart" and nothing seemed to happen. The experience of getting items INTO the cart was the hardest part of the entire shopping flow. That should be the easiest.

### No confirmation when removing items.
I clicked the trash icon and the item just... disappeared. No "Are you sure?" dialog. No undo option. No "Item removed — undo?" toast message. One accidental click and my item is gone. On a desktop that's annoying; on mobile with fat-finger taps, that would be rage-inducing.

### Product names in the cart aren't links.
I wanted to go back and check the SmartFeeder description before buying. I clicked on the product name in the cart table — nothing. It's just text. On every e-commerce site I use, clicking a product name in the cart takes me back to the product detail page. This is basic.

---

## 5. Missing Features (What I Specifically Need)

- **Cart persistence.** Save to localStorage at minimum. I might close my laptop and come back tomorrow.
- **"Continue Shopping" button.** There's a "Browse Products" link on the empty cart, but when I have items, there's no easy way back to products except the nav.
- **Save for Later / Wishlist.** I want the SmartFeeder but maybe not this month. Let me save it.
- **Estimated delivery date.** When will this arrive? I'm setting up a coworking space. Timing matters.
- **Product links in cart.** Let me click product names to go back to the product page.
- **Order notes field.** I might need to add delivery instructions for my building.
- **Guest checkout.** The "Login" link in the nav makes me nervous. Do I NEED an account to buy? Can I just check out as a guest? Amazon lets me buy in 2 clicks. Don't make me create an account first.
- **Quantity limits or stock indicators.** How many SmartFeeders are in stock? Can I order 50? Is there a max? No idea.

---

## 6. Pricing & Discount Display

This is the biggest trust issue in the whole cart:

| What I See on Products Page | What I See in Cart | My Reaction |
|---|---|---|
| SmartFeeder: ~~$129.99~~ **$97.49** (25% OFF) | SmartFeeder: **$130** | "Wait, where's my discount?" |
| Chef's Hat: **$72.99** | Chef's Hat: **$73** | "Why did the price go up?" |
| PawTrack: **$79.99** | PawTrack: **$80** | "Consistent rounding at least..." |
| No mention of 5% discount | Discount(5%): -$20.65 | "Where did this come from?" |
| Promo popup says "30% OFF" | Coupon "Applied!" but nothing changes | "So... what did applying the coupon do?" |

The pricing story is incoherent. I see sale prices on the catalog that vanish in the cart. I see a mystery 5% discount with no source. I apply a coupon code and nothing visibly changes. If I can't trust the pricing, I'm not checking out.

---

## 7. Checkout Readiness — Would I Click "Proceed To Checkout"?

**No.** Here's why:

1. **I don't trust the prices.** The product page said 25% off. The cart charges full price. Which is it?
2. **I don't know what the coupon did.** I applied "techconnect" and nothing happened to my total.
3. **I don't know if this will persist.** If I accidentally close this tab or navigate away, I lose everything and start over.
4. **I don't know what happens next.** Does "Proceed to Checkout" take me to a login wall? A 30-field form asking for my tax ID? A payment page? There's no indication of what the checkout flow looks like.
5. **$402.31 is a lot of money** for a first order from a site I've never bought from. There are no reviews, no trust badges, no return policy visible, no "Secure Checkout" indicator. Why should I give this site my credit card?

---

## 8. Top 3 Recommendations

### 1. Fix the pricing consistency — this is the #1 trust-killer.
If a product shows "25% OFF" with a sale price on the catalog, that same discounted price must appear in the cart. And show cents everywhere ($72.99, not $73). If there's a 5% automatic discount, label it: "New Customer Discount: 5%" or "Bulk Order Savings: 5%." If the coupon code gives an additional discount, show it as a separate line item: "Coupon (TechConnect): -$XX." Pricing transparency = trust = checkout conversion.

### 2. Persist the cart state.
Save the cart to localStorage or sessionStorage. Nobody's cart should vanish on a page refresh. This alone would probably reduce abandonment by half. Every competitor does this. This is 2026 — ephemeral carts are unacceptable.

### 3. Kill the promo popup or make it a dismissible banner.
The full-screen blocking popup on every product page visit is hostile UX. Replace it with a small banner at the top of the page ("Use code TECHCONNECT for 30% off the Chef's Hat!") that can be dismissed once and stays dismissed. Stop punishing me for browsing your products.

---

*"Every new business owner is going to land on this site knowing what I know, which is nothing about B2B. You either help them or lose them. Right now? You're losing me at the cart."*

— Aisha Johnson
