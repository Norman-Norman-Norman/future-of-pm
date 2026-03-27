# PetSmart.com vs. OctoCAT Supply — Mobile Shopper Competitive Review

**Reviewer:** Sophie Williams, Owner of Sophie's Bowls (food truck)  
**Device:** iPhone 15 — no desktop, no laptop, phone only  
**Date:** March 16, 2026  
**Context:** Compared OctoCAT Supply (localhost:5137) against PetSmart.com as a mobile-only user ordering supplies between the morning farmers market and the afternoon beach run

---

## The Honest Take

I'm going to be real with you. I pulled up OctoCAT Supply on my phone during the morning rush, and within 30 seconds I hit a wall that PetSmart would never put in front of me. This isn't a "nice to have" gap list. These are three things that literally make the site unusable on a phone.

---

## TOP 3 Critical Feature Gaps

### 1. The Navigation Literally Disappears on Mobile

**What PetSmart does:** Full mobile menu with a hamburger icon that opens a clean, scrollable drawer. Categories, services, deals, pharmacy, store locator — it's all there, tappable, finger-friendly. You can get anywhere on the site in two taps.

**What OctoCAT Supply does:** The nav links — Home, Products, About Us — use `hidden md:block`. That means on any phone screen, they just... vanish. Gone. The only things I can see in the header on mobile are the cart icon, the dark mode toggle, and the Login button. That's it. There's no hamburger menu. There's no mobile drawer. There's no way to navigate the site unless I manually type a URL or happen to land on the homepage and find the "Explore Products" button buried in the hero section.

**Why this is a deal-breaker:** If I'm on the cart page and want to go back to products? I can't. I have to tap the logo and hope it takes me home, then scroll to find a link. On PetSmart I can get to any section in two taps from anywhere. On OctoCAT Supply, I'm stranded on whatever page I landed on. A site with no mobile navigation isn't a mobile site. It's a desktop site that renders on a phone. Those are very different things.

---

### 2. The Cart Page Is a 7-Column Desktop Spreadsheet

**What PetSmart does:** On mobile, each cart item is a stacked card — product image on top, name below it, quantity selector with big tappable buttons, price, and a remove link. Everything flows vertically. The checkout button is fixed at the bottom of the screen, right in the thumb zone. You can review your cart one-handed while walking to your car.

**What OctoCAT Supply does:** The cart is an HTML `<table>` with 7 columns: S. No., Product Image, Product Name, Unit Price, Quantity, Total, Remove. Seven columns. On a 390px phone screen. The quantity input is a `type="number"` field that's 64px wide (`w-16`). The coupon code section at the bottom has an input and two buttons side by side that will absolutely stack in a broken way. The order summary is pushed into a sidebar (`lg:w-1/4`) that only shows next to the table on large screens — on mobile it'll stack below, meaning I have to scroll past the entire broken table to even see my total.

**Why this is a deal-breaker:** I add 3 items to my cart between the morning rush and the beach run. I pull out my phone to review before I hit checkout. What I see is a table where every column is crushed so small I can't read the product names, the quantity field is impossible to tap accurately, and I have to scroll horizontally — or worse, pinch to zoom — just to see my own order. PetSmart makes cart review a 10-second glance. OctoCAT Supply makes it a puzzle. I will literally abandon the cart and go to a competitor before I fight with a table layout on my phone.

---

### 3. No Product Detail Pages — No Reviews, No Recommendations, No Way to Make a Decision

**What PetSmart does:** Every product has a full detail page. Multiple product images I can swipe through. A 4.6-star rating with 478 reviews I can read. Size and flavor selectors. Fulfillment options — pickup, same-day delivery, or ship. An Autoship subscription option. "You may also like" recommendations. Breadcrumb navigation so I can easily go back. I can make an informed buying decision in under 60 seconds, on my phone, while my açaí base is blending.

**What OctoCAT Supply does:** Products are listed as cards on a single page. If I tap a product image, a modal pops up with... the same image bigger and the same description I already read. That's it. No reviews. No ratings. No "customers also bought." No way to know if other people liked this product. No way to discover related products. The modal doesn't even show the price or an Add to Cart button — I have to close the modal and go back to the card to actually buy.

**Why this is a deal-breaker:** I'm a small business owner. Every dollar counts. When I'm deciding between two products, reviews are everything. "Does this hold up in a commercial setting?" "Is the quality consistent?" Those are the questions I need answered, and other customers' reviews answer them. PetSmart gives me that social proof on every single product. OctoCAT Supply gives me a name, a price, and a one-line description. I'm not spending $200 on supplies with that little information. I'll go somewhere that helps me feel confident about my purchase.

---

## What OctoCAT Supply Got Right

Before I roast you completely — the cart persistence using localStorage is actually solid. I added items, closed the tab, came back 20 minutes later, and my cart was still there. PetSmart does this too (they'd better), but I was genuinely surprised OctoCAT Supply handled it. In food truck life, getting interrupted is the default, so cart persistence matters a lot. Keep that.

---

## My One Ask

**Give me a mobile navigation.** I mean it. A hamburger menu, a bottom tab bar, literally anything that lets me move between pages on my phone. Without navigation, the site isn't "missing a feature" — it's fundamentally broken on mobile. The cart table and the product pages are huge problems, but I can work around bad layouts with some frustration. I cannot work around having no way to navigate. Fix the nav, and I'll stick around long enough for you to fix the rest.

---

## Summary Table

| Feature | PetSmart | OctoCAT Supply | Gap Severity |
|---|---|---|---|
| Mobile navigation | Hamburger menu with full site access | Nav links hidden on mobile, no alternative | **Critical** |
| Mobile cart layout | Stacked cards, thumb-friendly checkout | 7-column HTML table, unusable on phone | **Critical** |
| Product detail pages | Images, reviews, ratings, recommendations | Modal with enlarged image + description only | **Critical** |
| Cart persistence | Yes | Yes (localStorage) | No gap |
| Product search | Category browsing + search + filters | Text search only, no categories | High |
| Reviews & ratings | Stars + written reviews on every product | None | High |
| Payment options | Apple Pay, saved payment, multiple methods | `alert('Order placed!')` — no real checkout | High |
| Order tracking | Full order history and tracking | None | High |
| Rewards/loyalty | Treats loyalty program, prominently featured | None | Medium |
| Wishlist/favorites | Save items for later | None | Medium |

---

*Written from the driver's seat of my food truck, parked at Ocean Beach, between a 47-bowl morning rush and a 3 PM restock panic. The kittens can wait. My supply orders can't.*
