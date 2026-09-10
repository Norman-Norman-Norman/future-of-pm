# OctoCAT Supply — Cart Mobile UX Feedback

**Reviewer:** Sophie Williams, Owner of "Sophie's Bowls" (açaí food truck, San Diego)
**Device:** iPhone 15, 375x812 viewport. No desktop. No laptop. Phone only.
**Date:** June 2025
**Page Tested:** Shopping Cart (`/cart`) and product browsing flow (`/products`)
**Test Scenario:** Browse products, add 3 items (Chef's Hat x1, SmartFeeder One x2, PawTrack Smart Collar x1), navigate to cart, test coupon code, change quantities, remove an item

---

## Overall Rating: 2/10 — "This is giving 2015 mobile experience vibes. Not in a cute retro way."

I run my entire business from my phone. I'm ordering between the morning farmers market and the afternoon beach spot. I have maybe 3 minutes. This cart page made me want to close the tab and find a different supplier. Almost every part of this experience tells me the team built it on a desktop monitor and never once held a phone while testing.

---

## 1. Mobile-First Assessment

**Verdict: This is a desktop site that technically loads on a phone. It is NOT a mobile experience.**

The cart page uses an HTML `<table>` with **seven columns** (S.No, Product Image, Product Name, Unit Price, Quantity, Total, Remove) squeezed onto a 375px screen. Seven columns. On a phone. The text is microscopic, the product images are thumbnails, and the quantity input field is so small I'd need a stylus to tap it accurately.

The layout *claims* to be responsive — the Order Summary section uses `flex-col lg:flex-row` so it should stack on mobile — but the cart items themselves are in a rigid table that has zero mobile adaptation. No card-based layout. No stacking. No horizontal scroll indicator. Just a desktop table crammed onto a phone.

The products page is even worse. The product grid shows four tiny product cards per row at mobile width. Each product card is barely wider than my thumb. The "Add to Cart" buttons are so small I'd accidentally tap the wrong product every single time.

---

## 2. Touch Targets

**Almost everything is too small to tap accurately.**

| Element | Estimated Size | Required (Apple HIG) | Verdict |
|---------|---------------|----------------------|---------|
| Quantity input field | ~64px wide, but only ~40px tall | 44x44px minimum | Borderline — width OK but the number inside is hard to change |
| Remove (trash icon) button | ~24x24px icon area | 44x44px minimum | WAY too small. The `p-2` padding helps a little but the visual target is a tiny trash can |
| "Add to Cart" on product cards | Cramped into a 4-col grid at ~80px wide | 44x44px minimum | Not even close. I'd need to pinch-zoom first |
| Quantity +/- buttons on product page | ~28px circles in the product cards | 44x44px minimum | Absolutely not. I'd hit the wrong button every time |
| Coupon code input | `w-48` (192px) — OK width | Fine | This one's actually fine |
| "Apply Coupon" button | Full-sized button | Fine | This one's fine too |
| "Proceed to Checkout" | Full-width rounded button | Fine | Fine — but see below for the visibility problem |
| Nav links (Home/Products/About us) | Small text links with `px-3 py-2` | 44x44px minimum | Usable but cramped when all 3 show inline on mobile |

The functional buttons (Update Cart, Apply Coupon, Proceed to Checkout) are fine — they're big green buttons. But the interactive elements I use MOST — changing quantities, removing items, tapping products — are all designed for a mouse cursor, not a thumb.

---

## 3. Layout & Responsive Design Issues

### Cart Table — The Biggest Problem

The cart is a full `<table>` element with seven fixed-width columns. On a 375px screen:
- Column headers ("S. NO.", "PRODUCT IMAGE", "PRODUCT NAME", etc.) are in uppercase tiny text that barely fits
- Product images are squeezed to ~96px containers (the `w-24 h-24` class)
- Product names break into multiple lines ("GitHub Copilot Chef's Hat" wraps to 3 lines)
- The table overflows or compresses text to unreadable sizes

**What I need:** On mobile, ditch the table entirely. Show each cart item as a card: product image on the left, name + price on the right, quantity controls below, swipe-to-delete. Every good e-commerce app does this. Instagram Shopping does this. Amazon does this. A table with seven columns on a phone is something I'd expect from a government procurement website.

### Sticky Navigation Overlapping Content

The nav bar is `fixed w-full z-50`, and it sits on top of the second row of the cart table. When I scrolled through my cart items, the SmartFeeder One row was literally hidden behind the nav bar. I couldn't see what I was buying. The cart page has `pt-20` to create space, but the table rows scroll UNDER the sticky nav as I scroll down. On my phone, where the nav bar is a bigger proportion of my 812px screen, this is really noticeable.

### Order Summary Sidebar

The Order Summary uses `lg:w-1/4` for desktop sidebar positioning. On mobile (`flex-col`), it should stack below the cart table. That part is correct in the code. But when the table overflows horizontally, the Order Summary gets pushed to an awkward position. In my testing, the "Proceed to Checkout" button and the "Grand Total" line were partially hidden or required scrolling to find.

### Footer — 4 Columns on Mobile?

The footer uses `grid-cols-1 md:grid-cols-4`. On a phone below the `md` breakpoint (768px), it should stack into a single column. If it's rendering correctly at 375px, that's fine. But in my testing, I saw all four columns (About, Account, Helpful Links, Social Media) squeezed side by side with tiny text. If the responsive breakpoint isn't kicking in, the footer is also broken.

---

## 4. Pain Points

### Pain Point #1: Cart State Doesn't Survive Interruptions

This is the one that would actually make me stop using this site. The cart uses React `useState` — it's in-memory only. No `localStorage`. No server-side cart. No session persistence.

Here's what that means for me: I'm in my truck, I add three items to my cart. A customer walks up. I lock my phone, make their smoothie bowl, and come back 5 minutes later. If I accidentally refreshed the page, closed the tab, or if the browser reclaimed the tab's memory? **My cart is completely gone.** All three items. Gone. I have to start over.

This happens to me constantly. I'm juggling blenders and orders. I can't have a shopping cart that evaporates the moment I look away. Every real shopping app — Amazon, Target, Instacart — saves my cart automatically. This one doesn't even try.

### Pain Point #2: No Mobile Navigation Menu

The navigation component has `hidden md:block` on the main links, which should hide them on mobile. But there's **no hamburger menu, no slide-out drawer, no mobile menu at all.** So below 768px, the Home/Products/About links just... disappear? And there's no way to access them except the footer links (which use `<a href="#">` — they don't even navigate anywhere, they're placeholder links)?

The only reliable navigation on mobile is the cart icon and the Login button, which are always visible. There's no way to get to Products or Home from the cart page on a phone without using the browser back button.

### Pain Point #3: Promo Popup Blocks Everything on Products Page

Every time I load the products page, a full-screen popup appears: "EXCLUSIVE SALE!" for the Chef's Hat at 30% off. It's a `fixed inset-0 z-50` overlay that covers the entire screen. On mobile, this popup takes up essentially all the visible area. I HAVE to interact with it (tap "OK, LET'S GO!") before I can see or do anything.

If I navigate away and come back to products, it shows again (it's controlled by `useState(true)` — no "don't show again" logic, no cookie, no session tracking). So I see this popup every. single. time.

### Pain Point #4: Product Detail Modal After Adding to Cart

When I tap a product image, a detail modal opens. Fine. But this modal ALSO uses `fixed inset-0 z-50`. On mobile, I now have to find and tap the close button (an "X" in the top-right corner — top right! The hardest spot to reach with one thumb on a tall phone). If I accidentally tapped the product image when trying to hit the "Add to Cart" button (easy to do when everything is crammed in a 4-column grid), I'm stuck dismissing a modal I didn't want.

### Pain Point #5: No Apple Pay / Google Pay / Saved Payment

The "Proceed to Checkout" button goes nowhere — it's just a button with no `onClick` handler. But even if checkout existed, there's no mention of Apple Pay, Google Pay, or any digital wallet. In 2025, asking me to type 16 credit card digits on a phone keyboard is not acceptable. I use Apple Pay for literally everything. If checkout requires manual card entry, I'll find a supplier with an app.

---

## 5. Missing Features (Mobile-Critical)

1. **Cart persistence** — Save cart to `localStorage` at minimum. Server-side cart with user accounts ideally. My cart should survive refreshes, tab closures, and coming back the next day.

2. **Hamburger menu** — The nav needs a mobile menu toggle. There's literally no way to navigate the site on a phone right now.

3. **Swipe-to-delete in cart** — Standard mobile gesture. Swipe left on a cart item to reveal the delete button. Way more natural than hunting for a tiny trash icon.

4. **Product card mobile layout** — Single column or two columns max on a phone. Each card needs a photo big enough to see, a readable name, a readable price, and "Add to Cart" and quantity buttons that I can actually tap.

5. **Quick reorder** — I order the same stuff every week. Show me my recent orders and let me one-tap reorder.

6. **Cart item count toast/animation** — When I add an item, give me a satisfying visual confirmation (cart icon bounces, toast notification slides up) instead of an overlay modal I have to dismiss.

---

## 6. Checkout Flow

The checkout flow doesn't exist yet — "Proceed to Checkout" is a dead button. So I can't evaluate it. But based on what I've seen, here's what I'm worried about:

- The coupon code input works fine (`techconnect` applied correctly, showed "Applied!" feedback) — this is one of the few things that actually works well on mobile
- But there's no indication of what the coupon DOES — no "You saved $X!" message, no price change in the order summary
- Quantity changes work (I changed SmartFeeder from 2 to 3, total updated) — functional but the input field is small
- Remove works (I removed PawTrack, cart updated correctly) — but the tiny trash icon is hard to tap

If checkout mirrors the cart's approach to mobile design (desktop table with tiny fields), I'd expect address forms with `<select>` dropdowns for states, tiny text inputs, no autofill support, and definitely no Apple Pay. Please don't do that.

---

## 7. Coupon Code Experience

The coupon feature actually works pretty well! This was one of the bright spots:

- The input field is a good size (`w-48`, 192px — my thumbs can hit it)
- "Apply Coupon" button is visually clear and tappable
- "Applied!" feedback appears immediately
- Error state ("Invalid coupon code") also works

**What's missing:** After applying the coupon, nothing changes in the Order Summary. The 5% discount is always there regardless of the coupon. The coupon code `techconnect` says "Applied!" but doesn't seem to do anything to the total. Is this a bug? Or is the coupon just cosmetic? Either way, on mobile I want to see a clear "You saved $X with code TECHCONNECT!" message and see the price update in real-time.

---

## 8. My One Ask — The Mobile Fix That Would Make Me Stay

**Replace the cart table with a mobile card layout and persist the cart to localStorage.**

If you do only two things:
1. Turn each cart item into a swipeable card (image left, name/price right, quantity stepper below) instead of a 7-column table
2. Save the cart to `localStorage` so it survives when I get interrupted by a customer

...I would go from "I'm looking for a different supplier" to "OK, I can work with this."

The table layout and the lack of persistence are the two things that make this site completely unusable on a phone. Fix those, and everything else becomes a "nice to improve" instead of a "can't use this at all."

---

## Summary Table

| Category | Score | Notes |
|----------|-------|-------|
| Mobile-First Design | 1/10 | Desktop table crammed on phone, no mobile layout |
| Touch Targets | 3/10 | Action buttons fine, but quantity/remove/product cards too small |
| Load Speed | 7/10 | Pages load fast, no heavy images |
| Interruption Recovery | 0/10 | Cart uses useState, no persistence whatsoever |
| Navigation | 2/10 | No hamburger menu, no mobile nav, sticky nav covers content |
| Checkout | N/A | "Proceed to Checkout" is a dead button |
| Coupon Feature | 7/10 | Input works, feedback works, but no visible price impact |
| Product Browsing | 2/10 | 4-col grid with tiny cards, promo popup every visit, modal on image tap |
| **Overall** | **2/10** | **Built for desktop, tested on desktop, called it done** |

---

*Written from the driver's seat of my food truck, parked in Pacific Beach, between the morning rush and the 2 PM açaí wave. I have 23 foster kittens to feed and zero patience for pinch-to-zoom. Make it work on my phone or I'm ordering from someone who will.* 🐱
