# OctoCAT Supply — Shopping Cart Accessibility Review

**Reviewer:** Kenji Tanaka, IT Consultant  
**Date:** March 10, 2026  
**Assistive Technology:** JAWS Screen Reader, Windows High-Contrast Mode, 200% Zoom  
**Page Tested:** `/cart` (Shopping Cart)  
**Browser:** Chromium-based, keyboard-only navigation  

---

## 1. Overall Accessibility Rating: 5/10

This cart has a decent foundation — ARIA labels on quantity inputs and remove buttons, product images with alt text, and keyboard-reachable interactive elements. But there are critical structural issues that make the experience frustrating with a screen reader. The cart table lacks semantic context, the coupon field has no label, dynamic changes are never announced, and the page has no heading identifying it as a cart. Half the score is earned by the things done right; the other half is lost to the things that weren't thought through.

---

## 2. Screen Reader Compatibility

### What JAWS Hears

When I Tab into the cart table, JAWS announces the quantity input correctly: *"Quantity of SmartFeeder One, edit, spinbox."* That's good — the `aria-label` on each `<input type="number">` works. The remove buttons also read well: *"Remove SmartFeeder One from cart, button."* Solid.

But here's what falls apart:

**No page heading.** The cart page has no `<h1>`. The first heading JAWS encounters is `<h2>Order Summary</h2>`. When I use JAWS' heading navigation (H key), I get:

- H2: "Order Summary"
- H2: "About" (footer)
- H2: "Account" (footer)
- H2: "Helpful Links" (footer)
- H2: "Social Media" (footer)

Where's "Shopping Cart"? Where's the primary heading that tells me what page I'm on? This fails **WCAG SC 2.4.2** (Page Titled — the page title is generic "OctoCAT Supplies" without "Cart") and **SC 2.4.6** (Headings and Labels).

**The cart table is semantically weak.** The `<table>` has no `<caption>` element, so JAWS announces *"Table with 4 rows and 7 columns"* — but doesn't tell me WHAT the table contains. Is it order history? Search results? I have to Tab into it to figure out it's the cart. Additionally, the `<th>` elements lack `scope="col"`, which means JAWS can't reliably associate data cells with their column headers. When I'm on a cell that says "$200", is that the unit price or the total? I can't tell without visual context.

**Dynamic content is silent.** When I change a quantity or remove an item, JAWS announces... nothing. No `aria-live` region. No status update. I change the quantity from 1 to 2 and have to manually navigate to the total column to verify it updated. I remove an item and hope it worked. This fails **SC 4.1.3** (Status Messages).

**Coupon feedback is invisible to AT.** The "Applied!" success message and "Invalid coupon code" error are rendered as plain `<span>` elements with no `aria-live`, no `role="alert"`, no `role="status"`. I type a coupon code, press "Apply Coupon", and JAWS says nothing. Did it work? Did it fail? I have no idea.

### What Works

- Product images in the cart have `alt={item.name}` — JAWS reads "AutoClean Litter Dome, image." 
- Quantity inputs: `aria-label="Quantity of {product name}"` — clear and specific.  
- Remove buttons: `aria-label="Remove {product name} from cart"` — exactly what I need.

---

## 3. Keyboard Navigation

### Tab Order

I tested keyboard Tab navigation through the populated cart. The elements receive focus in this order:

1. Navigation links (Home, Products, About us, Shopping cart, Theme toggle, Login)
2. Quantity input: "Quantity of SmartFeeder One"
3. Remove button: "Remove SmartFeeder One from cart"
4. Quantity input: "Quantity of ScratchPad Pro"
5. Remove button: "Remove ScratchPad Pro from cart"
6. Quantity input: "Quantity of PawTrack Smart Collar"
7. Remove button: "Remove PawTrack Smart Collar from cart"
8. Coupon code text input (NO label — JAWS says "edit text")
9. "Apply Coupon" button
10. "Update Cart" button
11. "Proceed To Checkout" button
12. Footer links

### Issues

**Missing skip navigation link.** There is no "Skip to main content" link. Every time I load the cart page, I must Tab through the entire navigation bar before reaching the cart content. For a page I visit frequently (3-4 times per order session), this is 6+ unnecessary Tab presses every time. Fails **SC 2.4.1** (Bypass Blocks).

**Table cells (product name, prices, serial number) are NOT in the tab order.** This is actually correct behavior — static content shouldn't be focusable. But because the table lacks `scope` attributes on headers, navigating the table with JAWS' Table Layer (Ctrl+Alt+Arrow keys) doesn't reliably read column headers with data cells.

**"Proceed To Checkout" is reachable and activatable.** It's a `<button>`, it receives focus, Enter activates it. That works.

**The "Update Cart" button has no clear effect.** I can Tab to it and press Enter, but what does it do? It's not connected to any visible state change. Is it a form submit? A recalculation trigger? Unclear both visually and semantically.

---

## 4. ARIA Labels

### Good

| Element | ARIA Label | Assessment |
|---------|-----------|------------|
| Quantity inputs | `aria-label="Quantity of {product name}"` | Descriptive, unique per product |
| Remove buttons | `aria-label="Remove {product name} from cart"` | Clear action + product context |
| Shopping cart nav link | `aria-label="Shopping cart"` | Functional |
| Theme toggle button | `aria-label="Toggle dark/light mode"` | Clear |
| Search input (products page) | `aria-label="Search products"` | Good |

### Missing or Problematic

| Element | Issue | WCAG Reference |
|---------|-------|----------------|
| Coupon code `<input>` | No `aria-label`, no `<label>`, only `placeholder` | SC 1.3.1, SC 4.1.2 |
| "Apply Coupon" button | Text content works, but no connection to the input | SC 1.3.1 |
| "Update Cart" button | No `aria-label` explaining purpose | SC 2.4.6 |
| "Proceed To Checkout" button | Text content is sufficient, but no `aria-describedby` linking to total | Nice-to-have |
| Shopping cart icon SVG | `img [ref]` with no alt text in accessibility tree | SC 1.1.1 |
| Cart item count badge | No `aria-label` on the badge number; screen reader doesn't announce count changes | SC 4.1.3 |
| Empty cart SVG | `img [ref]` with no alt text on the empty cart icon | SC 1.1.1 |

---

## 5. Color Contrast

### Concerns

1. **Discount amount in red:** The discount value uses `text-red-400` (`#F87171`). Against a white background (`bg-white`), this is approximately **3.5:1 contrast ratio** — below the **4.5:1** required for normal text by **SC 1.4.3** (Contrast Minimum). Against the dark mode background (`bg-gray-900`), it passes.

2. **Focus ring transparency:** Quantity inputs use `focus:outline-none` combined with `focus:ring-1 focus:ring-primary`. The outline is suppressed (`outlineColor: rgba(0, 0, 0, 0)` — transparent), and the ring uses the primary green (`#76B852`). Against white, this green ring has approximately **3.2:1** contrast — below the **3:1** required for non-text contrast on UI components (**SC 1.4.11**). It barely passes, but it's cutting it close with certain monitors.

3. **Coupon "Applied!" text:** Uses `text-primary` (`#76B852`) against white. This is approximately **3.2:1** — fails **SC 1.4.3** for text at default size.

4. **"S. No." column and gray text:** Uses `text-gray-300` in dark mode and `text-gray-600` in light mode. The light-mode gray-600 (`#4B5563`) against white passes at **7:1**. Dark-mode gray-300 (`#D1D5DB`) against gray-900 passes.

---

## 6. Focus Management

### Focus Visibility

- **Quantity inputs:** Focus is indicated by a green ring (`focus:ring-1 focus:ring-primary`) with transparent outline. Visible on standard displays but may be invisible in Windows high-contrast mode because high-contrast mode ignores CSS box-shadow/ring effects and only shows CSS `outline`. Since `focus:outline-none` is set, **focus is invisible in high-contrast mode.** This fails **SC 2.4.7** (Focus Visible) for high-contrast users.

- **Remove buttons:** Use browser-default `outline: auto` — visible in all modes.

- **"Apply Coupon" and "Update Cart" buttons:** Browser-default outline — visible.

- **"Proceed To Checkout" button:** Has `outline: auto` — visible.

- **Coupon code input:** Same ring-without-outline pattern as quantity inputs — **invisible in high-contrast mode.**

### Focus Trapping (Products Page Modal)

The promo popup modal on the products page uses `<div class="fixed inset-0">` as an overlay but has:

- **No `role="dialog"`** or `aria-modal="true"`
- **No focus trap** — Tab key sends focus behind the modal to page content
- **No Escape key handler** — you can't dismiss it with keyboard shortcuts
- **No focus management** — focus doesn't move to the modal when it opens, and doesn't return to the trigger when it closes

This fails **SC 2.1.2** (No Keyboard Trap — ironically, the modal DOESN'T trap focus, but it SHOULD), **SC 2.4.3** (Focus Order), and **SC 1.3.1** (the modal has no semantic role).

---

## 7. WCAG 2.2 Compliance Issues

### Critical (Must Fix)

| # | Issue | WCAG SC | Severity |
|---|-------|---------|----------|
| 1 | **No `<h1>` heading on cart page** — screen readers can't identify the page purpose via heading navigation | SC 2.4.6 | Critical |
| 2 | **Coupon code input has no label** — JAWS reads "edit text" with no context; `placeholder` is not a substitute for a label | SC 1.3.1, SC 4.1.2 | Critical |
| 3 | **No `aria-live` regions for dynamic updates** — quantity changes, item removals, and coupon validation results are not announced | SC 4.1.3 | Critical |
| 4 | **Cart table has no `<caption>`** — screen reader says "table" but not what the table contains | SC 1.3.1 | Critical |
| 5 | **Table `<th>` elements lack `scope="col"`** — JAWS can't associate data cells with column headers during table navigation | SC 1.3.1 | Critical |
| 6 | **Products page modals lack `role="dialog"`, focus trap, and Escape key handling** — keyboard users can Tab behind the modal and can't dismiss it with Escape | SC 2.1.2, SC 2.4.3 | Critical |

### Serious (Should Fix)

| # | Issue | WCAG SC | Severity |
|---|-------|---------|----------|
| 7 | **No skip navigation link** — keyboard users must Tab through entire nav on every page load | SC 2.4.1 | Serious |
| 8 | **Focus invisible in high-contrast mode** on quantity inputs and coupon field due to `focus:outline-none` with ring fallback | SC 2.4.7 | Serious |
| 9 | **Shopping cart SVG icon has no alt text** in navigation — screen reader skips it or says "image" | SC 1.1.1 | Serious |
| 10 | **Empty cart icon SVG has no alt text** — JAWS says "image" or nothing | SC 1.1.1 | Serious |
| 11 | **Page `<title>` is generic** — "OctoCAT Supplies" doesn't indicate you're on the cart page | SC 2.4.2 | Serious |

### Minor (Nice to Fix)

| # | Issue | WCAG SC | Severity |
|---|-------|---------|----------|
| 12 | **Cart badge count not announced** — when items are added, the badge updates visually but screen readers don't know | SC 4.1.3 | Minor |
| 13 | **"Update Cart" button purpose unclear** — no visible or accessible description of what it does | SC 2.4.6 | Minor |
| 14 | **Discount text color contrast borderline** — `text-red-400` against white is ~3.5:1 | SC 1.4.3 | Minor |
| 15 | **"Applied!" success text contrast** — `text-primary` against white is ~3.2:1 | SC 1.4.3 | Minor |
| 16 | **Heading hierarchy skips H1** — cart page goes directly to H2 "Order Summary" | SC 1.3.1 | Minor |

---

## 8. Top 3 Accessibility Recommendations

### 1. Add Proper Headings and Table Semantics to the Cart

**What to do:**
- Add `<h1>Shopping Cart</h1>` at the top of the cart page
- Add `<caption className="sr-only">Items in your shopping cart</caption>` to the cart table
- Add `scope="col"` to every `<th>` in the cart table header
- Update the page `<title>` to include "Cart" (e.g., "Shopping Cart — OctoCAT Supplies")

**Why:** Right now JAWS users land on the cart and have no heading to confirm where they are. The table reads as 47 unlabeled cells. This is maybe 10 minutes of work and it transforms the entire screen reader experience.

**Code change (Cart.tsx):**
```tsx
{/* Add before the flex container */}
<h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
  Shopping Cart
</h1>

{/* Add to table */}
<table className="w-full">
  <caption className="sr-only">Items in your shopping cart</caption>
  <thead>
    <tr>
      <th scope="col" className="...">S. No.</th>
      <th scope="col" className="...">Product Image</th>
      {/* etc. */}
    </tr>
  </thead>
```

### 2. Add `aria-live` Regions for All Dynamic Content

**What to do:**
- Wrap the cart totals section in `aria-live="polite"` so quantity changes announce updated totals
- Add `role="status"` or `role="alert"` to coupon validation messages
- Add an `aria-live="assertive"` visually-hidden element that announces "Item removed from cart" when a product is deleted

**Why:** Without live regions, screen reader users operate the cart blind. You change a quantity and hear... nothing. You remove an item and hear... nothing. You apply a coupon and hear... nothing. Every dynamic interaction is silent. This is 5-10 lines of code that makes the cart usable.

**Code change (Cart.tsx):**
```tsx
{/* Coupon feedback */}
{couponApplied && (
  <span role="status" aria-live="polite" className="text-primary text-sm font-medium">
    Coupon applied! 5% discount active.
  </span>
)}
{couponError && (
  <span role="alert" className="text-red-500 text-sm">
    {couponError}
  </span>
)}
```

### 3. Add a Label to the Coupon Input and Fix Focus Visibility

**What to do:**
- Add `aria-label="Enter coupon code"` to the coupon text input, or better yet, add a visible `<label>` element
- Replace `focus:outline-none` with `focus:outline-2 focus:outline-primary` on ALL inputs, so focus remains visible in Windows high-contrast mode where box-shadow/ring is ignored

**Why:** The coupon input currently announces as "edit text" — which is useless. And keyboard focus on inputs is invisible in high-contrast mode, which I and many other low-vision users depend on. These are two-line fixes each.

**Code change (Cart.tsx):**
```tsx
{/* Coupon input — add aria-label */}
<input
  type="text"
  placeholder="Coupon Code"
  aria-label="Enter coupon code"
  ...
/>

{/* Fix focus visibility — all inputs */}
className="... focus:outline-2 focus:outline-primary focus:ring-1 focus:ring-primary"
```

---

## Summary

The OctoCAT Supply cart has a **good intention** — ARIA labels on key interactive elements show someone thought about accessibility. But the implementation has **structural gaps** that make the screen reader experience disorienting: no page heading, no table semantics, no live regions, and an unlabeled form field.

The good news? Every issue listed here is fixable in under a day of development work. The ARIA labels on quantity inputs and remove buttons prove the team knows HOW to do accessibility — they just need to apply it consistently.

Accessibility isn't a feature request. It's a legal requirement (ADA, Section 508, EAA) and a moral baseline. I'm happy to help test the fixes.

— Kenji Tanaka

*P.S. Sudo sat on my lap through this entire review. He meowed once when JAWS got stuck reading the 7-column table without headers. Coincidence? I think not.*
