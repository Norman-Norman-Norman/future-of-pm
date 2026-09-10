# OctoCAT Supply — Full Site Accessibility Audit

**Reviewer:** Kenji Tanaka — Independent IT Consultant, Seattle, WA  
**Assistive Tech:** JAWS 2025, Windows High Contrast Dark Mode, 200% zoom, keyboard-only navigation  
**Date:** March 10, 2026  
**Scope:** Full site — Navigation, Products, Cart, Login, Welcome, Footer, Admin, all Modals  

---

## Executive Summary

I can't use this site. Not "it's hard to use" — I literally cannot complete a purchase. The modals trap me or don't announce themselves, the cart gives me no feedback when I add items, half the forms have unlabeled fields, and the focus management is nonexistent. I've audited hundreds of e-commerce sites. This one has some good intentions (a few `aria-label` attributes here and there), but it was clearly never tested with a screen reader. I counted **23 WCAG 2.2 Level AA violations** across the site.

I'll be constructive. Most of these are fixable in a day or two by a developer who cares. But until the critical ones are fixed, I'm ordering from your competitor.

---

## 1. Screen Reader Compatibility

### 1.1 No Skip Navigation Link — SC 2.4.1 (Bypass Blocks)

There is no skip-to-content link anywhere. The fixed navigation bar has 7+ links and controls. Every single page load, I have to Tab through the logo, "OctoCAT Supply," "Smart Cat Tech, Powered by AI," Home, Products, About us, the cart icon, the theme toggle, and the Login button before I reach page content.

On the Products page that's **9 tab stops** before I can even search. On every. single. page.

**Fix:** Add a visually-hidden skip link as the first focusable element in `App.tsx`:
```html
<a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to main content</a>
```
And add `id="main-content"` to the `<main>` element. Two lines of code.

### 1.2 Modals Have No Dialog Semantics — SC 4.1.2 (Name, Role, Value)

Three modal implementations in the codebase. **None of them are accessible.**

**Product detail modal** (`Products.tsx` ~line 166):
- No `role="dialog"` or `<dialog>` element
- No `aria-modal="true"`
- No `aria-labelledby` pointing to the product name heading
- Close button has **no accessible name** — JAWS reads "button" with zero context
- Clicking the backdrop overlay closes it, but there's no Escape key handler
- No focus trap — Tab goes right through the modal into the page behind it

**Promo popup** (`Products.tsx` ~line 196):
- Same problems. No role, no label, no focus management
- This pops up on page load and blocks the entire viewport, but JAWS doesn't know it's there because it's just a `<div>`. I'm listening to the Products page content *behind* the modal
- The "OK" button exists but I might never find it because focus isn't sent to the modal

**ProductForm modal** (`ProductForm.tsx`):
- Same structural problems
- Additionally, form labels are `<label>` elements but **none use `htmlFor`** — they're not programmatically associated with their inputs. JAWS reads the label text and then when I Tab to the input, it says "edit text" with no context

**Fix for all modals:**
```jsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
```
Add focus trap (trap Tab/Shift+Tab within modal), send focus to modal on open, return focus to trigger on close, close on Escape. Use a library like `react-focus-lock` if you don't want to roll your own.

### 1.3 No Live Region Announcements — SC 4.1.3 (Status Messages)

When I click "Add to Cart," absolutely nothing happens from JAWS's perspective. No announcement. The cart badge number updates visually (a small green circle in the nav bar) but there's no `aria-live` region to announce "Item added to cart" or "3 items in cart."

Same problem with:
- Coupon code validation — "Applied!" and "Invalid coupon code" appear visually but are never announced (`Cart.tsx` ~line 131)
- Loading state — the spinner is a purely visual `<div>` with CSS animation. No `aria-live="polite"` with "Loading products..." text
- Error state — "Failed to fetch products" renders as red text but has no `role="alert"` or `aria-live` attribute

**Fix:** Add an `aria-live="polite"` region that announces cart additions. Add `role="alert"` to error messages. Add `role="status"` to the loading indicator with screen-reader-only text.

### 1.4 SVG Icons Without Accessible Names — SC 1.1.1 (Non-text Content)

The partner logo SVGs on the Welcome page (Whiskers Cafe, PawTech Solutions, etc.) have **no `<title>`, no `aria-label`, no `role="img"`**. JAWS skips them entirely or reads nothing useful. The text labels below each SVG are in separate `<span>` elements with no programmatic association to the SVGs.

The close button (X) in the product modal has an SVG with no text alternative. JAWS says "button" — button for what?

The empty cart SVG icon on the empty cart state has no alt text.

The sort icons in AdminProducts use text characters (↕, ↑, ↓) which is actually fine for screen readers — one of the few things that works.

### 1.5 Loading Spinner Is Invisible to Screen Readers — SC 1.1.1

`Products.tsx` line 76: The loading state renders a spinning `<div>` with a CSS border animation. JAWS reads... nothing. I'm sitting on the Products page and I have no idea anything is happening.

```jsx
<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
```

No text. No `aria-label`. No `role="status"`. Nothing.

---

## 2. Keyboard Navigation

### 2.1 Focus Indicator Deliberately Removed — SC 2.4.7 (Focus Visible)

This one actually made me angry.

The theme toggle button in `Navigation.tsx` has `focus:outline-none` in its className. Someone **deliberately removed** the browser's default focus indicator. When I Tab to that button, I have zero visual indication of where I am.

```jsx
className="p-2 rounded-full focus:outline-none transition-colors"
```

This fails SC 2.4.7. The default browser focus outline exists for a reason. If you don't like how it looks, replace it with a custom focus ring — don't remove it.

**Fix:** Replace `focus:outline-none` with `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2` or simply remove the `focus:outline-none`.

### 2.2 Admin Dropdown Has No Keyboard Support — SC 2.1.1 (Keyboard)

The admin dropdown menu (`Navigation.tsx` ~line 42):
- No `aria-expanded` attribute on the trigger button
- No `aria-haspopup="true"`
- No Escape key to close the dropdown
- No arrow key navigation between menu items
- Dropdown stays open when I Tab past it — no blur/focus-out handling
- The dropdown renders conditionally based on `adminMenuOpen` state but JAWS doesn't know a menu has appeared

This fails SC 2.1.1 (Keyboard operable) and SC 4.1.2 (Name, Role, Value).

### 2.3 Product Image Click Handler Not Keyboard Accessible — SC 2.1.1

`Products.tsx` line 127: The product image area has an `onClick` handler on a `<div>`:
```jsx
<div className="... cursor-pointer" onClick={() => handleProductClick(product)}>
```

A `<div>` is not focusable. I cannot Tab to it. I cannot activate it. This product detail view is completely inaccessible to keyboard users. Use a `<button>` or add `tabIndex="0"`, `role="button"`, and `onKeyDown` handling — though a `<button>` is the right answer.

### 2.4 Sortable Table Headers Are Not Keyboard Accessible — SC 2.1.1

`AdminProducts.tsx`: Table headers have `onClick` handlers for sorting but they're `<th>` elements with `cursor-pointer`. They're not focusable, have no `role="button"`, no `tabIndex`, no `onKeyDown`. I cannot sort the admin product table by keyboard.

### 2.5 No Focus Management on Route Changes — SC 2.4.3 (Focus Order)

When navigating between pages via React Router, focus is not managed. After clicking "Products" in the nav, focus stays on the nav link — it doesn't move to the page content or the H1. Combined with no skip link, this means I re-tab through the entire nav on every page change.

---

## 3. Form Accessibility

### 3.1 Login Form — Mostly Good, One Critical Bug

Credit where it's due: the Login form **does** use proper `<label htmlFor="email">` and `<label htmlFor="password">` associations. JAWS correctly reads "Email Address, edit text" and "Password, edit text." This is one of the few things that works right.

**However**, the error message uses `dangerouslySetInnerHTML`:
```jsx
<div dangerouslySetInnerHTML={{ __html: error }} />
```

Where `error` can come from URL search params (`searchParams.get('error')`). This is an **XSS vulnerability** — an attacker can craft a URL with `?error=<script>...</script>` and inject arbitrary HTML/JS. Beyond being a security issue, the error message div also has **no `role="alert"`** so JAWS never announces login errors.

### 3.2 ProductForm Labels Not Associated — SC 1.3.1 (Info and Relationships)

Every label in `ProductForm.tsx` is a `<label>` element but **none have `htmlFor` attributes** and **none wrap their inputs**. The labels and inputs are siblings inside a `<div>`, but there's no programmatic association.

JAWS reads: "Name" (the label text... I Tab)... "edit text" (the input, no context).

Eight form fields. None of them announce their label when focused. That's 8 failures of SC 1.3.1 and SC 4.1.2 in a single component.

**Fix:** Add `htmlFor` and matching `id` to every label/input pair, just like the Login form does correctly.

### 3.3 Coupon Code Input Has No Label — SC 1.3.1

`Cart.tsx` ~line 122: The coupon code input has `placeholder="Coupon Code"` but **no `<label>`, no `aria-label`, no `aria-labelledby`**. Placeholders are NOT labels (SC 1.3.1, SC 3.3.2). When the placeholder disappears on input, JAWS users have no idea what field they're in.

### 3.4 Cart Quantity Input Missing Context — SC 3.3.2 (Labels or Instructions)

The cart quantity `<input type="number">` does have `aria-label={`Quantity of ${item.name}`}` — good. But there's no indication of min/max constraints or what happens when I change the value. When I type a new number, is it saved? Auto-updated? Do I need to click "Update Cart"? The "Update Cart" button exists but doesn't appear to do anything in the code. Confusing for everyone, not just screen reader users.

---

## 4. Color Independence

### 4.1 Error Messages Use Color Alone — SC 1.4.1 (Use of Color)

Login error: red text on a red-bordered div. The error message itself contains text, so that's partially okay — but the visual styling relies on red color to convey "this is an error." There's no error icon, no "Error:" prefix, and no `role="alert"`.

Coupon errors in `Cart.tsx`: "Invalid coupon code" is styled as `text-red-500` and "Applied!" as `text-primary` (green). Color is the only differentiator between success and failure states.

### 4.2 Discount Badge Is Color-Dependent — SC 1.4.1

Product discount badges (`Products.tsx` ~line 135) use a green (`bg-primary`) ribbon with white text showing "30% OFF." The color green carries meaning (sale/discount), but at least the text is present. This is borderline — okay-ish, but could use an icon.

### 4.3 Cart Item Count Badge — SC 1.4.1

The cart badge in the nav (`Navigation.tsx` ~line 73) is a small green circle with a white number. At 200% zoom this is fine visually for me, but the information is position-dependent (tiny absolute-positioned element on the cart icon). There's no screen reader announcement of the count — it's inside the cart link's DOM but **outside** the `aria-label="Shopping cart"`. JAWS reads "Shopping cart, link" — not "Shopping cart, 3 items, link."

---

## 5. Dynamic Content

### 5.1 Cart Badge Updates Silently — SC 4.1.3

Already covered above. The cart badge count changes without any `aria-live` announcement. This is the single biggest frustration. I add items to cart and I genuinely don't know if it worked.

### 5.2 Promo Popup Appears Without Announcement — SC 4.1.3

The promo popup renders on mount of the Products component. It covers the entire viewport but JAWS has no idea it appeared. Focus isn't sent to it. It's just a floating div. I'm listening to the Products page behind it and wondering why nothing is interactive.

### 5.3 Product Modal Appears Without Focus Shift — SC 4.1.3

Click a product image (if I could, since it's not keyboard accessible) and a modal appears — but focus stays wherever it was. JAWS doesn't announce the modal. I'd have to manually search the page to find it.

### 5.4 Admin Dropdown Content Appears Without Announcement

The admin submenu appears on click but `aria-expanded` isn't set on the button, so JAWS doesn't communicate the state change.

---

## 6. Heading Structure

### 6.1 Heading Hierarchy — SC 1.3.1

The heading structure is **mostly reasonable** but has some gaps:

- **Welcome page:** H1 "Smart Cat Tech. Purrsonalized." followed by H2 "Trusted By Cat Lovers Everywhere" and H2 "Smart Solutions for Modern Cats." Logical.
- **Products page:** H1 "Products" — good. Product names are H3 — slightly odd (where's H2?), but functional.
- **Cart page:** No H1. The "Order Summary" is an H2 but it's the only heading. The main cart table section has no heading at all, so JAWS heading navigation (`H` key) goes straight to "Order Summary" and skips the cart contents entirely.
- **About page:** H1 "About OctoCAT Supply" with H2 subheadings — good structure.
- **Footer:** Uses H2 "About," "Account," "Helpful Links," "Social Media." These should arguably be H3 or have a preceding H2 for "Footer" since they're below the page's main content hierarchy. Minor issue.
- **Login page:** H2 "Login" — should be H1 since it's the page's primary heading.

### 6.2 Navigation Has No Landmark Labeling — SC 1.3.1

The `<nav>` element exists (good) but has no `aria-label`. If there were multiple nav regions (there's also footer links), screen reader users can't distinguish them. Add `aria-label="Main navigation"` to the nav bar and `aria-label="Footer navigation"` to the footer, or wrap footer links in a `<nav>`.

---

## 7. Additional Issues

### 7.1 Contrast Concerns in Dark Mode — SC 1.4.3 (Minimum Contrast)

I can't measure exact ratios without a tool, but several text classes concern me:
- `text-gray-400` on `bg-gray-800` or `bg-dark` (#0A0A0A) — gray-400 (#a3a3a3) on dark (#0A0A0A) is approximately 6.7:1, which passes AA
- `text-gray-500` (#737373) on the same background is approximately 4.3:1, which barely passes for large text but fails for small text
- `text-gray-500` is used for product descriptions and partner logo labels in small text

### 7.2 Footer Links Are `#` — SC 2.4.4 (Link Purpose)

All 10 footer links (`My Cart`, `Checkout`, `Services`, etc.) point to `href="#"`. Each link's purpose is clear from its text (good), but they don't actually go anywhere. If this is a demo, fine — but using `href="#"` means clicking them scrolls to page top and confuses navigation history.

### 7.3 Mobile Navigation Missing — SC 1.3.1

Nav links use `hidden md:block`, making them invisible below `md` breakpoint. There's no hamburger menu, no mobile nav alternative. On a narrow viewport or at high zoom (which I use), the main navigation disappears entirely.

### 7.4 `autoFocus` on Login Email Field — SC 3.2.1 (On Focus)

`Login.tsx`: The email input has `autoFocus`. This is generally discouraged for accessibility because it can disorient screen reader users who expect to hear the page heading first. JAWS starts reading inside a form field with no page context.

---

## Summary of WCAG 2.2 AA Violations

| # | Issue | WCAG SC | Severity | Component |
|---|-------|---------|----------|-----------|
| 1 | No skip navigation link | 2.4.1 | Critical | App.tsx |
| 2 | Product modal: no dialog role/focus trap | 4.1.2, 2.4.3 | Critical | Products.tsx |
| 3 | Promo modal: no dialog role/focus trap/announcement | 4.1.2, 4.1.3 | Critical | Products.tsx |
| 4 | ProductForm modal: no dialog role/focus trap | 4.1.2, 2.4.3 | Critical | ProductForm.tsx |
| 5 | Focus indicator removed on theme toggle | 2.4.7 | Critical | Navigation.tsx |
| 6 | No "added to cart" announcement | 4.1.3 | Critical | Products.tsx |
| 7 | Product image click not keyboard accessible | 2.1.1 | Critical | Products.tsx |
| 8 | ProductForm labels not associated with inputs | 1.3.1, 4.1.2 | Critical | ProductForm.tsx |
| 9 | Coupon input has no label | 1.3.1, 3.3.2 | High | Cart.tsx |
| 10 | Admin dropdown: no aria-expanded/keyboard support | 4.1.2, 2.1.1 | High | Navigation.tsx |
| 11 | Loading spinner has no text alternative | 1.1.1 | High | Products.tsx |
| 12 | Error states not announced (no role="alert") | 4.1.3 | High | Products.tsx, Login.tsx |
| 13 | Close buttons on modals have no accessible name | 4.1.2 | High | Products.tsx |
| 14 | Cart badge not announced to screen readers | 4.1.3 | Medium | Navigation.tsx |
| 15 | Cart page has no H1 heading | 1.3.1 | Medium | Cart.tsx |
| 16 | Login page heading is H2 not H1 | 1.3.1 | Medium | Login.tsx |
| 17 | SVG partner logos have no accessible names | 1.1.1 | Medium | Welcome.tsx |
| 18 | Color-only coupon success/error indicators | 1.4.1 | Medium | Cart.tsx |
| 19 | Sortable table headers not keyboard accessible | 2.1.1 | Medium | AdminProducts.tsx |
| 20 | Navigation landmark has no aria-label | 1.3.1 | Low | Navigation.tsx |
| 21 | Footer links all point to # | 2.4.4 | Low | Footer.tsx |
| 22 | Mobile navigation hidden with no alternative | 1.3.1 | Low | Navigation.tsx |
| 23 | autoFocus on login email | 3.2.1 | Low | Login.tsx |

### Security Note (Not WCAG, But Critical)

`Login.tsx` line 48 uses `dangerouslySetInnerHTML={{ __html: error }}` where `error` comes from URL query parameters (`?error=...`). This is a **reflected XSS vulnerability**. An attacker can craft a URL like `/login?error=<img src=x onerror=alert(document.cookie)>` and steal session data. This must be fixed immediately regardless of accessibility — use `{error}` as text content, not `dangerouslySetInnerHTML`.

---

## My Biggest Frustration

The same thing that frustrates me on every e-commerce site built by sighted developers: **silent cart interactions.** I click "Add to Cart." Did it work? I don't know. JAWS said nothing. The screen didn't change from my perspective. The visual badge updated — great for sighted users. For me, it's a complete dead end.

This is a B2B site where I'm placing $200-$1,500 orders on behalf of my clients. If I can't confirm items are in my cart, I can't use the site. Period.

And the promo popup that loads on the Products page? I had no idea it existed until I read the source code. It's blocking the entire viewport but JAWS is reading the content behind it. I'm tabbing around wondering why nothing works. That's not an edge case — that's the first thing every user sees on the Products page, and it's invisible to screen readers.

---

## My One Ask

**Implement `aria-live` regions for all state changes — especially "item added to cart" confirmations.**

This is the single fix that would unblock the most users. A polite live region that announces "Added 2 GitHub Copilot Smart Cat Collars to cart. Cart now has 5 items." That's maybe 10 lines of code in `CartContext.tsx` and it transforms the entire shopping experience from broken to functional.

Everything else matters — the modals need dialog roles, the forms need labels, the skip link needs to exist — but without cart feedback, I can't even shop. Fix the live region first, then work through the rest of the table.

---

## What I'd Need Before I Consider Using This Site

1. **`aria-live` announcements** for cart add/remove and all status messages
2. **Skip navigation link** on every page
3. **Modal focus management** — role="dialog", aria-modal, focus trap, Escape to close
4. **All form inputs labeled** — `htmlFor`/`id` pairs on every field
5. **Visible focus indicators** — stop removing `outline` and add custom focus rings
6. **Keyboard-accessible product details** — make the image click area a proper button

Fix those six things and I'll try again. I'll even help you test. Sudo and I are available.

---

*Kenji Tanaka — kenji.tanaka@example.com — "Accessibility isn't a feature request. It's a legal requirement and a moral baseline."*
