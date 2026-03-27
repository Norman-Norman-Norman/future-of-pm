# Shopping Cart Evaluation — Returns & Post-Purchase Focus

**Reviewer:** Linda Chen, Owner of Chen's Boutique (Portland, OR)  
**Date:** March 10, 2026  
**Testing Method:** Playwright MCP browser automation against http://localhost:5137  
**Persona Context:** B2B reseller who curates home goods for her boutique. Orders weekly, returns ~15% of products due to quality/accuracy standards. Needs documentation trails and clear policies.

---

## 1. Overall Rating: 3/10

This is a storefront that wants my money but won't tell me what happens after I pay. I've been burned before. I photograph every delivery. I compare every item to the listing. And when something doesn't match, I need a clear, fast path to resolution. This site gives me nothing — no return policy, no exchange option, no warranty info, no order history. My cat Invoice pushed a pen off the desk in solidarity when I couldn't find the Terms & Conditions.

---

## 2. Return Policy Visibility: 0/10 — Nonexistent

I searched every page. Products, cart, footer, checkout flow. There is **zero return policy information anywhere on this site.**

- The footer lists "Terms & Conditions" — dead link (goes to `#`)
- The footer lists "Privacy Policy" — dead link (goes to `#`)
- No return window mentioned (30 days? 14 days? "No returns"?)
- No restocking fee disclosed
- No return conditions stated

**The impact:** I run a boutique. When I order products for resale, I need to know my options BEFORE I spend $3,000+. I'm not going to place a $532 order — let alone a $3,305 one — without knowing what happens when the AutoClean Litter Dome arrives and the "self-cleaning" feature is just a sticker on a regular box.

ASOS puts the return label IN the box. This site won't even tell me if returns exist.

---

## 3. Exchange Options: 0/10 — None

There is no mention of exchanges anywhere in the application. Not in the cart. Not on product pages. Not in the footer. Not in any route defined in the application.

**What I need:** If I order a SleepNest ThermoPod and it arrives in the wrong color, I don't want a refund — I want the right product. An exchange option saves both of us time and money.

---

## 4. Guarantee Info: 0/10 — None

These are AI-powered smart devices priced at $80-$200. The PawTrack Smart Collar uses "AI-powered mood detection." The SmartFeeder One "auto-updates a Feline Health Repo." These are technology products with complex functionality.

**Not a single product has:**
- Warranty duration
- Manufacturer guarantee
- Defect coverage
- Expected product lifespan
- Material composition
- Exact dimensions or weight

The listing says the CatFlix Entertainment Portal offers "on-demand laser shows." If the laser dies in 3 weeks, am I just out $90? As a reseller, I can't put that uncertainty on my customers.

---

## 5. Cart Flexibility: 5/10 — Functional but Fragile

**What works:**
- Quantity editing via number input in the cart (direct number entry)
- Remove individual items via trash icon button
- Coupon code system (found the valid code: "techconnect")
- Automatic 5% discount on all orders
- Flat $10 shipping calculation
- Order Summary panel with subtotal, discount, shipping, and grand total

**What doesn't work:**
- **Cart state is not persisted.** Refreshing the page or navigating via URL wipes the entire cart. I tested this multiple times. For a B2B buyer placing $500-$3,000 orders, losing the cart because I opened a new tab or refreshed is unacceptable. Use localStorage, sessionStorage, or a server-side cart — anything.
- **No "Continue Shopping" button** when cart has items. The empty cart state has a "Browse Products" link, but the populated cart doesn't have a clear way to go back and add more items without using the nav.
- **"Update Cart" button** exists but isn't clear what it does — the quantity changes appear to apply immediately via the input field.
- **Product modals constantly block interaction on the products page.** Adding items to the cart triggers overlay modals that intercept clicks, making it frustrating to add multiple products in sequence. I had to fight through at least 6 overlays to add 3 items. My customers would abandon.
- **No saved cart or wishlist** — I can't save a curated order and come back to it later.

---

## 6. Trust Signals: 2/10 — Not Enough to Buy

**Trust signals present:**
- Product images (though I can't verify they match what ships)
- Product descriptions (creative but lacking specifications)
- "Trusted By Cat Lovers Everywhere" brand carousel on homepage
- 25% OFF badges on sale items (clear discount visibility)

**Trust signals missing:**
- No return policy = I assume the worst
- No customer reviews or ratings
- No order accuracy rate ("12% of orders for this item report discrepancies")
- No product specifications (dimensions, weight, materials)
- All footer "Helpful Links" are dead (`#` hrefs): Services, Supports, Feedback, Terms & Conditions, Privacy Policy
- All "Account" links are dead: My Cart (footer version), Checkout, Shopping Details, Order, Help Center
- No SSL/security badges near checkout
- No business address or contact information
- No phone number or live chat for support
- Copyright says 2025 — are we even current?

**As a reseller:** My reputation is on the line. If I list the GitHub Copilot Chef's Hat on my store as "breathable, stain-resistant fabric" and it shows up as thin polyester that stains on contact, I'm refunding MY customer and eating the loss. I need product accuracy guarantees.

---

## 7. Missing Post-Purchase Features

This site has **zero post-purchase infrastructure:**

| Feature | Status |
|---------|--------|
| Return initiation (self-service) | Missing |
| Return status tracking | Missing |
| RMA number generation | Missing |
| Refund/credit history ledger | Missing |
| Order confirmation page | Missing |
| Order history / past orders | Missing |
| Order tracking after purchase | Missing |
| Photo upload for discrepancies | Missing |
| Product accuracy reporting | Missing |
| Exchange request flow | Missing |
| Warranty claims | Missing |
| Customer support contact | Missing |
| Email notifications (order/shipping/delivery) | Missing |
| Invoice/receipt download | Missing |

The "Proceed To Checkout" button is the end of the road. No checkout page exists in the routing. The journey ends at a button that goes nowhere.

---

## 8. Top 3 Recommendations

### 1. Publish a Clear, Accessible Return Policy — Everywhere

Put the return window, conditions, and process on:
- Every product page (near the "Add to Cart" button)
- The cart page (before "Proceed to Checkout")
- A dedicated `/returns` page linked from the footer
- The order confirmation (when it exists)

I should never have to search for this information. If I can find the "Apply Coupon" button in 2 seconds, I should find the return policy in 2 seconds. The listing says "ceramic." I receive plastic. I should see "30-day returns, free return shipping for product discrepancies" right there on the product page.

### 2. Persist the Cart and Build Post-Purchase Order Tracking

The cart disappearing on page refresh is a showstopper for any buyer spending more than $50. At minimum:
- Store cart state in localStorage so it survives refreshes
- Build an order confirmation flow after checkout
- Create an order history page showing past orders and their status
- Add return initiation directly from the order history ("Return this item")

I order on Tuesdays. I build my cart. I compare products. Sometimes I walk away and come back Wednesday to finalize. If my cart is gone when I return, I'm ordering from someone else.

### 3. Add Product Specifications and Quality Trust Signals

Every product listing needs:
- Exact dimensions (inches/cm)
- Weight
- Material composition ("ceramic" vs. "ceramic-look plastic" — these are different things)
- Warranty duration
- An order accuracy indicator or customer satisfaction metric

My boutique's reputation depends on what I sell my customers matching what I tell them they're buying. "AI-powered chef's hat" is fun marketing copy, but I need to know: What is it made of? What are the dimensions? Is the logo embroidered or printed? Will it survive a wash? Give me the specifications, and I'll order 50 of them.

---

## Additional Notes

- **The product image modal UX needs work.** Clicking near the product area opens a full-screen overlay that blocks all interaction with the page. Adding multiple items to the cart required dismissing this overlay between each addition. For a B2B buyer adding 5-10 items per order, this friction adds up fast.
- **The promotional sale banner** that appears on the products page also creates an overlay interaction issue. Multiple overlays stacking is a usability problem.
- **Dead footer links are a credibility issue.** Every `#` link tells me this site isn't finished. If the "Help Center" link doesn't go anywhere, how am I supposed to get help when my order is wrong?
- **No login-gated features.** The cart works without login, which is fine for browsing, but for order history, returns, and account management, there needs to be an authenticated experience.

---

*Swatch is sitting on the keyboard. Invoice is judging this review from across the room. Both cats agree: they wouldn't buy a SmartFeeder from a site that won't tell them what happens if it breaks.*
