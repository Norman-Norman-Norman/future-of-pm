# Competitive Accessibility Comparison: OctoCAT Supply vs. PetSmart.com

**Reviewer:** Kenji Tanaka — IT Consultant, Seattle, WA  
**Date:** March 16, 2026  
**Assistive Technology:** JAWS 2025, Windows High Contrast Dark Mode, 200% zoom  
**Evaluation Standard:** WCAG 2.2 Level AA  
**Focus:** Top 3 accessibility feature gaps PetSmart has that OctoCAT Supply critically needs

---

## Executive Summary

I Tab-navigated through OctoCAT Supply and compared the experience against PetSmart.com. Credit where it's due: OctoCAT Supply has meaningful `aria-label` attributes on interactive controls (cart buttons, quantity controls, search input) and product images carry `alt` text. That's more than many sites ship with. But there are three structural accessibility gaps that PetSmart handles and OctoCAT Supply does not — and each one represents a class of users being blocked, not inconvenienced. Blocked.

---

## Gap #1: No Skip Navigation Link

**WCAG Failure:** SC 2.4.1 — Bypass Blocks (Level A)

### What PetSmart Does

PetSmart provides an explicit "Enable accessibility" link at the very top of the page. This lets keyboard and screen reader users skip past the navigation bar and jump directly to main content. It's the first focusable element on the page.

### What OctoCAT Supply Does

Nothing. There is no skip link anywhere in the markup. I checked `index.html` — the `<body>` contains only `<div id="root">`. I checked `App.tsx` — the `<main>` element exists (good), but there's no skip link before the `<Navigation />` component.

### What JAWS Experiences

Every single page load, I have to Tab through the logo link, "Home," "Products," "About us," the cart icon, the theme toggle, and the login/logout controls before I reach any page content. That's 6-8 Tab stops minimum. On the products page, I already know what I want — I want to search. But I have to sit through the full nav announcement every time.

### The Fix

Add a visually-hidden skip link as the very first focusable element inside `ThemedApp`, before `<Navigation />`. It should be visible on focus (for sighted keyboard users) and link to `#main-content`. Then add `id="main-content"` to the `<main>` element. This is about 10 lines of code:

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded">
  Skip to main content
</a>
```

This is a **Level A** requirement. It's the lowest bar in WCAG. Every site should have this.

---

## Gap #2: No `aria-live` Announcements for Dynamic Content

**WCAG Failure:** SC 4.1.3 — Status Messages (Level AA)

### What PetSmart Does

PetSmart provides live announcements for interactive actions. When you interact with product controls, add items to cart, or switch between fulfillment options, the screen reader receives status updates. Their star ratings announce "4.6 out of 5 stars selected" — meaningful, contextual feedback. Image navigation buttons announce "Go to image 1" — you know what happened.

### What OctoCAT Supply Does

Silence. I reviewed `CartContext.tsx` — the `addToCart` function updates React state and `localStorage`. That's it. No `aria-live` region, no status announcement, no screen reader notification of any kind. Same for `removeFromCart`, `updateQuantity`, and `clearCart`.

I also checked `Products.tsx`. The `handleAddToCart` function resets the quantity to 0 after adding — but JAWS has no idea the item was added. I click "Add to Cart" and hear... nothing. Did it work? Did it fail? I have to navigate to the cart page to find out. On the cart page, applying a coupon code shows an error message (`couponError`) in a `<p>` tag, but it's not announced — there's no `aria-live` attribute, no `role="alert"`, nothing.

### What JAWS Experiences

1. I set quantity to 2, Tab to "Add to Cart," press Enter. JAWS says nothing. I have no confirmation.
2. I navigate to the cart icon in the nav. The badge (`totalItems`) updates visually, but JAWS only reads the static `aria-label="Shopping cart"` — not the count.
3. I enter "invalid" in the coupon field and click Apply. The error text appears visually (`Invalid coupon code`), but JAWS announces nothing. I don't know my coupon failed.
4. Place Order on checkout calls `alert()` — that's a native browser alert, so JAWS catches it. But that's the *only* action that gets announced, and it's an anti-pattern.

### The Fix

Add a global `aria-live="polite"` status region to the app shell and announce cart actions:

```tsx
// In App.tsx or a dedicated StatusAnnouncer component
<div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
  {statusMessage}
</div>
```

Then update `addToCart` to set a status message like `"2 × Smart Cat Feeder added to cart"`. For errors, add `role="alert"` to the coupon error `<p>` element in `Cart.tsx`. This pattern takes maybe 30 lines across the app and brings every dynamic interaction into parity with PetSmart's feedback model.

---

## Gap #3: Modals Without Dialog Semantics or Focus Management

**WCAG Failure:** SC 2.4.3 — Focus Order (Level A), SC 1.3.1 — Info and Relationships (Level A), SC 4.1.2 — Name, Role, Value (Level A)

### What PetSmart Does

PetSmart uses structured product detail views with tabbed content sections ("Description," "Ingredients") — keyboard-navigable tabs with proper ARIA roles. Image galleries use labeled buttons ("Go to image 1," "Go to image 2"). Focus is managed within interactive regions. The page structure tells the screen reader exactly what's happening.

### What OctoCAT Supply Does

OctoCAT Supply uses two modals — a product detail modal and a promo popup — and both fail the same way.

**Product detail modal** (`Products.tsx`, lines ~203-240):
- The overlay is a `<div>` with an `onClick` handler. No `role="dialog"`. No `aria-modal="true"`. No `aria-labelledby`.
- The close button is an SVG with no `aria-label`. JAWS announces: "button." Button for what?
- There is **no focus trap**. When the modal opens, focus stays wherever it was. I can Tab behind the modal into the page content beneath the overlay. I have no idea I'm in a modal.
- When the modal closes, focus does not return to the trigger element. Focus is lost — JAWS drops to the top of the page.

**Promo popup** (`Products.tsx`, lines ~244-290):
- Same structural issues: `<div>` container, no dialog role, no focus management.
- This popup appears automatically on page load with no screen reader announcement. JAWS keeps reading the page behind it.
- The "OK" button has no descriptive label for what it dismisses.
- There's no Escape key handler. Keyboard users can't dismiss it without finding and clicking the button.

### What JAWS Experiences

1. I land on the Products page. The promo popup renders. JAWS has no idea it's there — it reads "Products" (the H1) and keeps going through the product grid.
2. I eventually Tab to "OK" and press Enter. No announcement that anything closed.
3. I later click a product image (via Enter on the image container — but wait, the image container is a `<div>` with `onClick` and `cursor-pointer`. It has no `role="button"`, no `tabIndex`, and no `onKeyDown`. JAWS can't activate it at all. The product detail modal is completely unreachable by keyboard.)
4. Even if I could open it, the modal would trap me in an invisible overlay with no way to understand, navigate, or escape it.

### The Fix

Use proper dialog markup:

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onKeyDown={handleEscapeKey}>
```

Add focus trapping (or use a library like `@headlessui/react` Dialog). Return focus to the trigger on close. Add `aria-label="Close product details"` to the close button. Make the product image clickable container a `<button>` or add `role="button"`, `tabIndex={0}`, and keyboard event handling. Same treatment for the promo popup.

---

## Honorable Mentions (Not Top 3, But Noted)

| Issue | WCAG SC | Notes |
|---|---|---|
| Cart badge count not announced to screen readers | SC 4.1.3 | Badge is visual-only; `aria-label` on cart link is static |
| Coupon code field has no `<label>` element | SC 1.3.1, SC 4.1.2 | Only has `placeholder` — screen readers may not announce purpose |
| Footer links are all `href="#"` | SC 2.4.4 | JAWS reads 10 links that go nowhere — confusing and wastes time |
| Admin dropdown lacks `aria-expanded` | SC 4.1.2 | Button doesn't announce open/close state |
| No breadcrumb navigation | SC 2.4.8 | PetSmart has breadcrumbs for orientation; helps understand page context |
| Error message in login uses `dangerouslySetInnerHTML` | SC 4.1.3 + security | No `role="alert"` and potential XSS vector |
| Product image container not keyboard-accessible | SC 2.1.1 | `<div onClick>` is invisible to keyboard users |

---

## My One Ask

**Add an `aria-live="polite"` status announcer to the application shell.** This single addition unblocks every dynamic interaction on the site — adding to cart, removing items, applying coupons, form errors, all of it. Without live region announcements, a screen reader user is operating blindfolded in a room full of silent buttons. I press things and hope they worked. That's not an experience — that's a guessing game.

PetSmart gets this right because their controls tell you what happened. OctoCAT Supply's controls do things silently. Fix the announcements and you've fixed the single biggest gap between these two sites.

---

## Bottom Line

OctoCAT Supply has a foundation — `aria-label` attributes are thoughtful, form inputs in the login have proper `<label>` association, images have `alt` text. That tells me someone on the team thought about accessibility. But the three gaps above are structural: skip navigation, live announcements, and dialog semantics. These aren't edge cases or nice-to-haves. They're Level A and Level AA requirements that PetSmart already meets. Until they're addressed, I'm ordering supplies from a competitor's site. Not because I want to — because I literally cannot complete a full shopping flow on this one.

I'm happy to test when fixes are in. Sudo and I will be here.

— Kenji
