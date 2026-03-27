# Cart Feedback — Rush Order Customer

**Reviewer:** Raj Kapoor, Owner, Kapoor Events  
**Date:** March 10, 2026  
**Device:** Desktop browser (simulating mobile-first urgency mindset)  
**Scenario:** Wednesday afternoon, 3:15 PM. I need supplies for a corporate event on Friday. I have 10 minutes max before my next client call. Go.  
**URL Tested:** http://localhost:5137/cart

---

## 1. Overall Rating: 3/10

I'm being generous. This cart exists, which is more than nothing, but it's completely useless for anyone who needs to place a rush order. There's no checkout. There's no shipping options. There's no delivery estimate. I literally cannot buy anything from this cart. Espresso could have designed a more functional checkout by walking across a keyboard.

---

## 2. Speed to Checkout: IMPOSSIBLE

**Clicks from cart to "order placed":** ∞ (infinity)

The "Proceed To Checkout" button is a **decoration**. It does nothing. I clicked it. Nothing happened. The URL stayed at `/cart`. No checkout flow, no payment form, no confirmation page. It's a green button that lies to your face.

On Amazon, I'd be done in 2 clicks: "Buy Now" → confirm. Here, I can click that checkout button until Friday comes and goes and I still won't have placed an order.

**Critical Bug:** The button has no `onClick` handler. It's pure CSS cosplay as a functional element.

---

## 3. Delivery Estimates: NONEXISTENT

There is zero delivery information anywhere on the cart page:

- No estimated delivery date
- No delivery date range
- No "arrives by" label
- No carrier information
- No warehouse/fulfillment location

The only shipping information is "Shipping: $10" — a flat fee with no context. $10 to where? By when? Via carrier pigeon?

For me, delivery information is the **single most important thing on the cart page**. I need to know: "Will this arrive by Friday 9 AM in Miami?" Yes or no. That's it. I don't see anything even close to that.

---

## 4. Express Shipping: NONEXISTENT

There are no shipping options at all:

- No Standard vs. Express vs. Rush toggle
- No shipping speed selector
- No "Need it faster?" prompt
- No expedited shipping surcharge option
- No same-day or next-day option

Just one flat $10 fee. For all I know, that $10 gets me a delivery sometime next quarter. On Amazon, I see "FREE delivery Thursday" vs. "Fastest delivery Tomorrow, $6.99" right on the product page, before I even add to cart.

---

## 5. Express Checkout: NONEXISTENT

There is no express checkout functionality:

- No Apple Pay / Google Pay
- No saved payment methods
- No one-click buy
- No "Buy Now" button on product pages
- No saved addresses
- No guest checkout
- **No checkout at all** — the button is dead

I shouldn't have to fill out a single form field. I've ordered from you before (hypothetically). You should know my address, my card, my preferred shipping. One tap. Done. That's the bar. Amazon does it. Everyone does it.

---

## 6. Cart Loading Speed: ACCEPTABLE (with caveats)

The cart page itself renders quickly once you're on it — sub-second rendering. The table, the order summary, the styling — all load fast. But:

- **Cart state doesn't persist on page reload.** If I refresh the page or navigate directly to `/cart`, my cart is empty. The cart only exists in React component state with no `localStorage` or session persistence. I added 3 items, navigated away, came back — empty. That's a data loss bug. If my phone switches tabs or my browser refreshes, I lose everything and have to start over. This alone would make me close the tab and go to Amazon.

- **The promo popup on the products page** blocks interaction for 2-3 seconds every time I visit. I don't care about your Chef's Hat sale. I'm looking for specific items. Let me shop.

- **Navigation bar overlaps the checkout button.** On smaller viewports, the fixed navbar covers the "Proceed To Checkout" button, making it physically unclickable without scrolling past it. That's a z-index/layout bug.

---

## 7. Missing Urgency Features

Here's everything this cart needs to not lose rush-order customers like me:

| Feature | Status | Impact |
|---------|--------|--------|
| Working checkout flow | Missing | **BLOCKER** — Cannot place orders |
| Cart persistence (localStorage) | Missing | **BLOCKER** — Cart empties on refresh |
| Delivery date estimates | Missing | Critical — I won't order without knowing when it arrives |
| Shipping speed options | Missing | Critical — I need express/rush options |
| Express checkout (Apple Pay, saved methods) | Missing | High — Every extra form field = time I don't have |
| "Buy Now" on product pages | Missing | High — Skip the cart entirely for single-item rush orders |
| Delivery tracking page | Missing | High — I check tracking 5x/day |
| Reorder from past orders | Missing | Medium — 60% of my orders are repeats |
| Phone number for rush orders | Missing | Medium — When digital fails, I need a human |
| Filter products by "available for express" | Missing | Medium — Don't show me stuff that can't arrive in time |
| Real-time stock availability | Missing | Medium — Don't let me add out-of-stock items |
| Order confirmation email/page | Missing | Medium — I need a receipt immediately |

---

## 8. Top 3 Recommendations

### 1. MAKE THE CHECKOUT BUTTON ACTUALLY WORK
This is not a feature request. This is a defect. The button says "Proceed To Checkout" and does nothing. Build a checkout flow — even a simple one with address, payment, and confirmation. Without this, this isn't a store. It's a catalog.

### 2. ADD DELIVERY DATE ESTIMATES EVERYWHERE
On the product page: "Express delivery: Arrives Friday, March 12." On the cart page: "Estimated arrival: March 12 for Express ($15) | March 17 for Standard ($10)." On the checkout page: "Guaranteed delivery by Friday." I need dates, not vibes.

### 3. PERSIST THE CART ACROSS PAGE RELOADS
Use `localStorage`. Use a cookie. Use a session. I don't care how — just don't erase my cart when I accidentally close a tab or my phone goes to sleep. Every item I re-add is 30 seconds I don't have. Cart persistence is table stakes. Even a weekend hackathon project has this.

---

## The One Thing That Would Stop Me From Defaulting to Amazon Prime

**A guaranteed delivery date visible on the product card before I even click "Add to Cart."**

Not "3-5 business days." Not "Ships from warehouse." A date: "Arrives Friday, March 12 to Miami, FL." If I see that, I'll stay on your site. If I don't, I'm already on Amazon by the time your product page finishes loading.

---

## Summary

It's 3:25 PM on Wednesday. I've spent 10 minutes on this site. I have zero items ordered. My cart emptied itself once. The checkout button is broken. I have no idea when anything would arrive even if I could order. I'm going to Amazon now. Espresso just knocked a water glass off my desk to express her solidarity with this review.

**Verdict:** Come back to me when there's a functioning checkout and a delivery date. Until then, this is a window-shopping app, not a supply store.
