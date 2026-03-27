# OctoCAT Supply — Full Site Mobile Audit

**Reviewer:** Sophie Williams, Owner of "Sophie's Bowls" (açaí food truck, San Diego)
**Device:** iPhone 15, 375x812 viewport. No desktop. No laptop. Phone only. Period.
**Date:** March 2026
**Pages Tested:** Every single page — Home, Products, Cart, Login, About, Footer navigation
**Test Scenario:** First-time visitor trying to browse products, add to cart, and complete a purchase — entirely from a phone, between the morning farmers market and the afternoon beach run. I had about 4 minutes before my next customer showed up.

---

## Overall Rating: 2.5/10 — "I literally cannot navigate this site on my phone. Not 'it's hard.' I CANNOT."

I first reviewed this site's cart page 9 months ago and gave it a 2/10. I was hoping to see improvements. What I found instead is that almost nothing has changed. The cart is still a desktop table. The navigation still vanishes on mobile. Checkout still doesn't exist. And now I'm reviewing the ENTIRE site on mobile, not just the cart, and honestly? It's worse than I thought.

Here's my 4-minute experience: I loaded the homepage. Looked good-ish. Tried to navigate to Products. The nav links are gone — `hidden md:block` hides them below 768px and there's NO hamburger menu, NO slide-out drawer, NO mobile navigation at all. I literally had to guess the URL and type `/products` in my browser bar. On a phone. While my açaí base was blending.

This is not a mobile experience. This is a desktop site that opens on a phone.

---

## 1. Mobile-First Assessment

**Verdict: This is designed for desktop. Mobile is an afterthought that nobody actually tested.**

Let me break down every page:

### Homepage (`/`)
- The hero image loads and looks fine — full width, auto height. OK.
- The product carousel uses `react-slick` with responsive breakpoints (6 → 4 → 3 → 2 slides). The 2-slide mobile setting is reasonable.
- **But I can't navigate anywhere from here.** The "Explore Products" button works (it's a `useNavigate` call), but the nav bar links are invisible. If I want to go to About, Login, or Products from the homepage, my only options are: (a) the CTA button to Products, or (b) scroll ALL the way to the footer and hope those links work. Spoiler: they don't. Every footer link is `href="#"`.
- The category cards on the homepage look cute but have no click handlers — they're decorative.

### Products Page (`/products`)
- **The promo popup.** Every. Single. Time. `useState(true)` means this "EXCLUSIVE SALE!" popup appears every time I visit this page. On mobile it covers my entire screen. I have to find and tap the "OK" button before I can see any products. There's no "don't show again," no cookie, no session flag. I visited this page 3 times during my test and saw this popup 3 times. I'm not special anymore, OctoCAT, the excitement has worn off.
- Product grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`. On my iPhone 15 (375px), this should be 1 column. But at 390px+ (newer iPhones), it hits the `sm` breakpoint (640px... wait, actually 375px is below 640px, so it stays at 1 column). OK so single-column on my phone — that's actually the RIGHT call. One product per row. 
- **But the product cards have problems:**
  - The quantity +/- buttons are `w-8 h-8` — that's 32x32 pixels. Apple Human Interface Guidelines say 44x44px MINIMUM for touch targets. I'm going to hit the wrong button. I'm going to accidentally decrease when I meant to increase. Guaranteed.
  - The "Add to Cart" button sits right next to the quantity controls. At single-column width, there's enough room, but the button is disabled (gray) when quantity is 0, and it's the SAME COLOR as the background in dark mode (`bg-gray-700 text-gray-400`). I tapped it 3 times before realizing I needed to increase quantity first. There's no visual hint.
  - Product images have `hover:scale-105` — HOVER. On a touchscreen. Hover doesn't exist on my phone. This means the scale-up animation never triggers on mobile, which is fine visually, but it tells me the developers were thinking about mouse interactions, not touch.
  - Tapping a product image opens a detail modal. The close button is an "X" in the **top-right corner** — the hardest spot to reach with my right thumb on a 6.1-inch phone. Bottom-center or a swipe-down-to-dismiss would be 10x better.

### Cart Page (`/cart`)
- **Still a 7-column HTML table.** I reviewed this 9 months ago. It's unchanged. S.No, Product Image, Product Name, Unit Price, Quantity, Total, Remove — all crammed into 375 pixels. The text is unreadable without zooming. The quantity input is a tiny `w-16` number field that requires me to type a number on my phone keyboard. The remove button is a 24x24 trash icon.
- **Cart still uses `useState`.** No `localStorage`. No server-side persistence. I added 3 items, answered a customer's question about our dragonfruit topping, came back, and my cart was gone because the browser tab refreshed. Nine months later and this still isn't fixed.
- The coupon code feature still works — `techconnect` applies — but still doesn't visibly change the price. The 5% discount shows up regardless.
- "Proceed to Checkout" is still a dead button. No `onClick`. No `onSubmit`. Nothing. It's a beautiful green gradient button that does absolutely nothing.

### Login Page (`/login`)
- Actually decent on mobile. Full-width form, readable labels, big submit button. The `max-w-md w-full` container works well on a phone. Input fields are large enough to tap.
- **But:** No "Sign in with Apple" or "Sign in with Google." No biometric auth. No "Remember me" checkbox. I have to type my email and password every single time. On a phone keyboard. In 2026.
- The error message uses `dangerouslySetInnerHTML` to render errors — that's a security concern, not a mobile issue, but I noticed it and it made me trust the site less.

### About Page (`/about`)
- Static content page. Probably fine on mobile. Not where my frustration lies.

### Footer
- `grid-cols-1 md:grid-cols-4`. Below 768px it should stack to single column. That's correct.
- **Every single link is `href="#"`.** My Cart, Checkout, Shopping Details, Order, Help Center, Services, Supports, Feedback, Terms & Conditions, Privacy Policy, Twitter, Facebook, YouTube, LinkedIn, Instagram — ALL of them go nowhere. Every. Single. One. On mobile, where the footer is sometimes the ONLY navigation available (because the top nav is hidden!), this means I literally cannot reach any page through the footer.

---

## 2. Thumb Zone Analysis

On a 6.1-inch iPhone 15, the "thumb zone" (the area I can comfortably reach with my right thumb while holding the phone one-handed) is roughly the bottom-right quadrant of the screen.

| Element | Position | One-Thumb Reachable? | Notes |
|---------|----------|---------------------|-------|
| Cart icon in nav | Top-right | NO — requires stretching | Have to shift grip to reach |
| Theme toggle in nav | Top-right | NO | Same problem |
| Login/Logout in nav | Top-right | NO | Same problem |
| Nav links (Home/Products/About) | Top-center | HIDDEN on mobile | Don't exist below 768px |
| Search box on Products | Top of content | NO on first load | Reachable after scrolling |
| Product quantity +/- | Mid-card | YES when scrolled | But they're 32px — too small |
| Add to Cart button | Bottom of card | YES | Correct placement! |
| Modal close button (X) | Top-right of modal | NO — worst possible spot | Need to reach across screen |
| Promo popup "OK" button | Bottom-center of popup | YES | Good placement |
| Proceed to Checkout | Bottom of order summary | YES after scrolling | Good placement (if it worked) |
| Coupon Apply button | Mid-page in cart | Depends on scroll | Reasonable |

**Bottom line:** The most critical actions (navigation, cart access, login) are all in the top bar, which is the HARDEST area to reach one-handed. The actual shopping interactions (add to cart, quantity) are positioned OK but are too small to tap accurately.

---

## 3. Touch Target Audit

Apple Human Interface Guidelines: 44x44pt minimum.
Google Material Design: 48x48dp minimum.

| Element | Actual Size | Minimum Required | Pass/Fail |
|---------|------------|-----------------|-----------|
| Quantity +/- on product cards | 32x32px (`w-8 h-8`) | 44x44px | FAIL |
| Remove (trash) icon in cart | ~24x24px icon + `p-2` padding = ~40x40px | 44x44px | FAIL |
| Cart quantity input field | 64x~40px (`w-16`) | 44x44px height | BORDERLINE |
| Product card image (tap to detail) | ~full card width × 224px | Fine | PASS |
| Add to Cart button | ~100x40px at mobile width | 44px height needed | BORDERLINE |
| Search input | Full width × ~40px | 44px height | BORDERLINE |
| Login form inputs | Full width × ~36px (`py-2`) | 44px height | FAIL |
| Proceed to Checkout | Full width × ~56px (`py-3.5`) | 44px height | PASS |
| Apply Coupon button | ~120x44px (`py-2.5 px-6`) | 44x44px | PASS |
| Admin dropdown menu items | Full width × ~36px (`py-2 px-4`) | 44px height | FAIL |
| Footer links | Text links, ~20px line height | 44px tap area | FAIL |

11 interactive elements tested. 5 fail. 3 borderline. Only 3 pass outright. That's a 27% pass rate for touch targets. Industry standard for a shipping mobile site should be 100%.

---

## 4. Load Speed & Performance

I'll give credit where it's due: the site loads fast. Vite bundles are small, the product images are reasonably sized, and React Query caches product data. On my LTE connection between stops, the products page loaded in under 2 seconds. The hero image on the homepage was quick too.

**But speed doesn't matter if I can't navigate.** A page that loads in 1 second but has no mobile menu is worse than a page that loads in 3 seconds with proper mobile UX.

The promo popup adds perceived latency — the products page technically loads fast, but I can't interact with it until I dismiss the popup. So my PERCEIVED load time includes the time it takes me to read the popup, process it, and find the dismiss button.

---

## 5. Interruption Recovery — The Food Truck Test

This is MY test. Can I start a task, get interrupted by a customer, and come back to finish?

| Scenario | Result | Grade |
|----------|--------|-------|
| Add 3 items to cart → serve customer → come back | Cart is GONE if tab refreshed or reclaimed | F |
| Browse products → serve customer → come back | Products page reloads, promo popup AGAIN | D |
| Start typing in search box → serve customer → come back | Search text gone (component re-render) | F |
| Half-fill login form → serve customer → come back | Form data might survive if tab stayed alive | D |
| Apply coupon code → serve customer → come back | Coupon state gone with cart | F |

**5 out of 5 scenarios fail the interruption test.** This site has ZERO state persistence beyond the current browser tab's memory. For a food truck operator who gets interrupted every 3-5 minutes, this means I'd have to redo my entire shopping session every time. I would literally never complete an order.

Amazon? I add items to my cart on Monday, close the app, open it Thursday, and they're still there. Along with a notification saying "Price dropped on SmartFeeder One!" That's the bar.

---

## 6. Payment & Checkout — The Dealbreaker

There is no checkout. The "Proceed to Checkout" button is a styled `<button>` with no event handler. Even if I somehow managed to navigate the site, find products, survive the popup, tap the tiny quantity buttons, hold my cart state alive long enough to reach the cart page, and scroll past the 7-column table to find the order summary — I cannot buy anything.

**What I need:**
- Apple Pay / Google Pay. I tap, I FaceID, I'm done. 2 seconds. This is how I pay for everything in 2026.
- Saved payment methods. If you won't do Apple Pay, at least remember my card.
- Guest checkout. I do not want to create an account to buy cat supplies. I create accounts for banks and airlines. Not cat food.
- One-tap reorder. I order the same 5 items every week. Let me tap "Reorder Last Order" and be done in 10 seconds.

Amazon does all four of these. Buy with 1-Click. Apple Pay support. Saved cards. Reorder from order history. THIS is why Amazon gets my money and OctoCAT doesn't.

---

## 7. Missing Mobile-Critical Features

| Feature | Status | Mobile Impact |
|---------|--------|---------------|
| Hamburger/slide-out mobile menu | MISSING | Cannot navigate the site on mobile |
| Cart persistence (localStorage) | MISSING | Cart vanishes on any interruption |
| Apple Pay / Google Pay | MISSING | Maximum payment friction |
| Working checkout flow | MISSING | Cannot complete purchases |
| PWA (Progressive Web App) | MISSING — no manifest.json, no service worker | Can't "install" to home screen, no offline, no app-like experience |
| Push notifications | MISSING | No restock alerts, no order updates, no abandoned cart reminders |
| Swipe gestures | MISSING | No swipe-to-delete in cart, no swipe navigation |
| Pull-to-refresh | MISSING | Standard mobile pattern not implemented |
| Bottom navigation bar | MISSING | All nav is in the unreachable top bar |
| Sticky "Add to Cart" on product detail | MISSING | Detail modal requires scrolling to find action |
| Barcode/QR scanning | MISSING | Can't scan a product to find it |
| Haptic feedback | MISSING | No tactile response on add-to-cart |
| Offline product browsing | MISSING (no service worker) | Can't browse between stops with spotty signal |

That's 13 mobile-critical features. Zero are implemented. Zero. The only "mobile" thing this site does is have a viewport meta tag and Tailwind responsive breakpoints that half-work.

---

## 8. The Amazon Comparison — Why This Hurts

The user mentioned Amazon as the mobile benchmark. Let me make the comparison painfully clear:

| Feature | Amazon Mobile | OctoCAT Supply Mobile |
|---------|--------------|----------------------|
| Mobile navigation | Bottom tab bar + hamburger + search bar | Nav links disappear on mobile |
| Search | Voice search, barcode scan, autocomplete, spell correction | Text box with no autocomplete |
| Product discovery | Personalized recommendations, "Customers also bought" | Static grid, same for everyone |
| Add to cart | One-tap "Add to Cart" + "Buy Now" | Set quantity (tiny buttons) THEN tap Add to Cart |
| Cart persistence | Permanent, synced across devices | Gone on refresh |
| Checkout | 1-Click ordering, Apple Pay, saved addresses | Dead button |
| Push notifications | Price drops, delivery updates, restock alerts | None |
| PWA / App | Native app with offline, widgets, Alexa integration | Plain website |
| Reorder | "Buy Again" from order history, Subscribe & Save | Not possible |
| Order tracking | Real-time map, delivery photo, push updates | No orders exist |

I'm not saying OctoCAT Supply needs to BE Amazon. I'm saying that Amazon trained my expectations. Every supplier site I use is compared to Amazon in my head. When I can't even NAVIGATE your site on my phone, you've lost me before I've even started shopping.

---

## 9. What's Actually Good (Yes, There Are Things)

I want to be fair. Some things work:

1. **Tailwind dark mode** — The dark/light toggle works and persists to localStorage. On my phone at 6:30 AM in a dark food truck, dark mode matters. This is implemented correctly.
2. **Product images** — They load fast, they're properly contained (`object-contain`), and they look good on the product cards. No broken layouts from oversized images.
3. **Login page** — Actually pretty decent on mobile. Full-width form, readable, big button.
4. **Search input** — Full-width, works, filters products client-side with instant results. The UX pattern is right even if the implementation is basic.
5. **Coupon feature** — The input/apply flow works. Responsive, good feedback. Just needs to actually affect the price.
6. **The color palette** — That green (`#76B852`) looks great on a phone screen. Good contrast, eye-catching CTAs.

---

## 10. My One Ask — What Would Make Me Stay

Last time I said "replace the cart table with cards and add localStorage." That's still true. But after reviewing the ENTIRE site on mobile, my one ask has evolved:

**Give me a bottom navigation bar and make the checkout button work.**

That's it. Two things:

1. **Bottom nav bar** with tabs: Home, Products, Cart (with badge), Account. Always visible. Always reachable with my thumb. This fixes navigation, discoverability, and the entire "I can't get anywhere on this site" problem in one component.

2. **Make "Proceed to Checkout" open a simple mobile-first checkout** — even a demo one. Shipping address form (auto-sized for mobile, with autofill support), an "Apple Pay" button (even if it's mocked), and an order confirmation screen. Show me you're TRYING to make this work on a phone.

Everything else — cart persistence, PWA support, push notifications, swipe gestures — those are "would be amazing." But bottom nav + working checkout? Those are "I will literally leave if you don't have these."

---

## Summary Table

| Category | Score | Notes |
|----------|-------|-------|
| Mobile Navigation | 0/10 | Nav links hidden, no hamburger menu, no bottom bar, footer links are all dead |
| Touch Targets | 3/10 | CTA buttons pass but quantity controls, remove, admin menu all fail |
| Product Browsing | 4/10 | Single-column grid is correct, but popup on every visit and tiny controls |
| Cart Experience | 1/10 | 7-column desktop table, no persistence, dead checkout button |
| Checkout | 0/10 | Does not exist |
| Payment Options | 0/10 | No Apple Pay, no Google Pay, no saved cards, no checkout |
| Interruption Recovery | 0/10 | All state is in-memory, everything lost on any disruption |
| Load Speed | 8/10 | Fast loads, small bundles, cached queries — genuinely good |
| PWA / App Experience | 0/10 | No manifest, no service worker, no install prompt, no offline |
| Push Notifications | 0/10 | Nothing |
| Dark Mode | 9/10 | Works great, persists, good contrast |
| Login | 6/10 | Functional but no social login, no biometrics, no "remember me" |
| Search | 5/10 | Works but basic — no autocomplete, no voice, no suggestions |
| **Overall Mobile Experience** | **2.5/10** | **Desktop site that opens on a phone. Would not use.** |

---

## Would I Use This Site on My Phone in Its Current State?

**No.** Hard no. Not-even-close no.

I can't navigate it (no mobile menu). I can't keep my cart (no persistence). I can't check out (dead button). I can't pay (no Apple Pay). I can't come back to it (no PWA). I can't get notified (no push). The things I CAN interact with are sized for a mouse cursor, not a thumb.

I would load this site once, try to navigate from the homepage to Products, fail to find the nav links, maybe stumble onto Products through the CTA button, get hit by the popup, dismiss it, scroll through products, try to tap the tiny +/- buttons, accidentally open a product modal, struggle to close it (top-right X button — ugh), eventually add something to cart, serve a customer, come back, find my cart is empty, and close the tab forever.

Then I'd go order from a supplier with an actual mobile app. Or from Amazon. Because Amazon never makes me pinch-to-zoom to tap a quantity button.

This has potential. The design language is clean. The color palette is great. The dark mode and load speed show someone cares. But mobile wasn't part of the "caring" yet. When 60%+ of B2B buyers are researching on mobile (your own spec says this!), that's not a gap — it's a wall between you and revenue.

Make it work on my phone. I'm rooting for you.

---

*Written from the driver's seat of my food truck, parked in Ocean Beach, while my current foster kitten (a calico named Mango) naps in a blanket on the passenger seat. She has better mobile app taste than this site's developers. She once batted my phone off the dashboard when a site asked me to pinch-to-zoom. Smart cat.* 🐱
