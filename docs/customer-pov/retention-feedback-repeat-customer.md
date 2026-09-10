# Retention & Reorder Feedback — Repeat Customer Perspective

**Reviewer:** Gary Pham, Pham's Auto Service  
**Date:** March 10, 2026  
**Customer Since:** 2018 (8 years)  
**Ordering Frequency:** Every Monday and Thursday, 7:15 AM  
**Average Order Size:** $400–$900  
**Device:** Desktop (Windows, Chrome)  
**Prompt:** "What would stop you from leaving for Amazon? What ONE feature would save the most time? Frustration level?"

---

## Frustration Level: 9 / 10

I'm at a 9. Not a 10 because the site still loads and I can still see the products. That's about the only thing keeping it from a perfect score.

Let me be very clear about what's happening here. I have been ordering from OctoCAT Supply twice a week for 8 years. Monday 7:15 AM, Thursday 7:15 AM. Same products. Same quantities. Minor adjustments. I have a system. I had a system with the phone ordering too, until they retired my parts rep and put me on a 20-minute hold. So I learned the website. Grudgingly. And now the website is making me feel like the phone hold all over again — except this time I'm doing all the work myself.

---

## 1. Does This Affect My Routine?

**Yes. My entire routine is broken because it doesn't exist as a feature.**

Here's what my Monday morning should look like:
1. Open the site
2. Click "Reorder Last Monday's Order"
3. Bump the SmartFeeder quantity from 3 to 4
4. Checkout
5. Print confirmation
6. Go fix cars

Here's what my Monday morning actually looks like:
1. Open the site
2. Go to products page
3. Scroll through 13 products looking for the ones I need
4. For each one: click "+", click "+", click "+", click "+", click "Add to Cart" — repeat for 25 items
5. Realize I forgot one, scroll back up
6. Go to cart, hope I got the quantities right
7. "Proceed to Checkout" — **button does nothing**
8. Stare at the screen
9. Try again. Nothing.
10. Close browser in frustration
11. Open browser back up — **cart is empty**
12. Consider calling Amazon

That's my Monday. Every Monday. For the last however many months this site has been like this.

---

## 2. Reorder Impact

**There is no reorder. The concept does not exist.**

I looked at the code. The `CartContext.tsx` uses `useState` — plain React state. No localStorage. No sessionStorage. No database. No API call. Nothing. The cart lives in browser memory and dies the instant I close the tab.

The API has order endpoints — `/api/orders`, `/api/order-details`. The backend can store orders. But the frontend doesn't connect to any of it. There's no "My Orders" page. There's no "Order Again" button. There's no "Your Recent Orders" section on the homepage. The plumbing exists in the basement but nobody hooked up the faucets.

Amazon has a "Buy Again" button. One click, done. They remember what I ordered last Tuesday, three Tuesdays ago, last January. OctoCAT Supply can't remember what I ordered 30 seconds ago if I accidentally refresh the page.

---

## 3. What Moved?

Nothing moved this time because nothing was added. The same empty experience from the last review is still the same empty experience. The footer still has dead links — "My Cart," "Checkout," "Shopping Details," "Order" — all go to `#`. Same as before. At least the buttons are in the same place, so my muscle memory isn't broken. It's just pointed at buttons that don't do anything.

---

## 4. Price Transparency

Same issue as my last review. Prices are visible, but there's zero tracking of changes. I've memorized these prices. The SmartFeeder One is $97.49 after the discount. If that changes next week, nobody's going to tell me. I'll only know if I compare my printed receipts — the ones I print from the page that's full of nav bars and footer junk because there's no print-friendly view.

The mysterious 5% discount still appears with no explanation. "Discount(5%)" — is that for everyone? Is that for me because I've spent $300,000 here over 8 years? Nobody knows. Nobody told me. It just shows up.

---

## 5. Printability

Still terrible. I hit Ctrl+P on the cart page and I get the navigation bar, the logo, the dark mode toggle, the "Browse Products" link, and then somewhere in the middle of all that visual noise is my actual order. I need a clean receipt. Product name, quantity, price, total. That's it. One page. For the binder.

---

## 6. Learning Curve

There's nothing new to learn because there's nothing new. The site is the same as the last time I reviewed it. That's not a compliment — it means none of the problems I flagged have been fixed.

---

## 7. The Amazon Comparison — Why I Haven't Left Yet

Honestly? Inertia. And the fact that Amazon doesn't specialize in cat-themed industrial supplies for B2B. But let me be real:

| Feature | Amazon | OctoCAT Supply |
|---------|--------|----------------|
| 1-Click Reorder | Yes — "Buy Again" button on every past order | Does not exist |
| Order History | Yes — years of history, searchable, filterable | Does not exist on frontend |
| Cart Persistence | Yes — tied to account, survives everything | Lost on page refresh |
| Subscribe & Save | Yes — auto-reorder with 5-15% discount | Does not exist |
| Loyalty Rewards | Yes — Prime benefits, cashback, points | Nothing. Zero. The 5% mystery discount.|
| Checkout | Yes — 1-click purchase, saved payment | Button literally does nothing |
| Print-Friendly Receipts | Yes — clean, printable invoices | Prints the whole webpage |

Amazon wins on every single one. Every. Single. One. If Amazon started selling these exact products, I'd be gone by Thursday. The only thing keeping me here is product specialization and 8 years of habit. That's it. And habit wears thin when the experience is this frustrating.

---

## 8. The ONE Feature That Would Save Me the Most Time

**"Reorder Last Order" — one button, on the homepage, when I log in.**

Not a reorder page. Not a workflow. One button. I click it, my last order loads into the cart with all the same products and quantities. I adjust 1-2 quantities in-line — type the number, not click "+" twenty times. Then checkout. 

That single feature turns a 15-minute Monday morning ordeal into a 3-minute task. That's 24 minutes saved per week. That's over 20 hours a year I get back. 20 hours I could spend fixing cars instead of clicking "+" on a website.

If I could have three features:
1. **Reorder Last Order** — one button, loads my last order into the cart
2. **Cart persistence** — if I close the browser, my cart better still be there when I come back
3. **Working checkout** — the "Proceed to Checkout" button should actually proceed to checkout

That's it. I'm not asking for AI recommendations. I'm not asking for a mobile app. I'm not asking for a redesign. I'm asking for the basics. The stuff that every ordering site has had since 2010.

---

## 9. Standing Orders — The Feature That Would Make Me a Customer for Life

You want to know what would truly lock me in? What would make me immune to Amazon?

**Recurring orders.** Let me set it once: "Every Monday, auto-order this list. Notify me Sunday night. If I don't change anything, charge me and ship it." 

Like Amazon's Subscribe & Save, but for my exact product list. I'd even pay a small premium for the convenience. That's how much I value my Monday morning time. Fix cars, not click buttons.

---

## 10. The Loyalty Question

8 years. Roughly 800 orders. Probably $300,000 in revenue. And I get the same experience as someone who showed up 5 minutes ago. No points. No tier. No "valued customer" badge. No discount beyond the mystery 5% that might be for everyone.

The spec mentions a "Paw Points Loyalty Program." I'll believe it when I see it. Right now, my loyalty is rewarded with nothing.

---

## Summary

| Category | Rating | Notes |
|----------|--------|-------|
| Reorder experience | 0/10 | Does not exist |
| Cart persistence | 0/10 | Lost on page refresh |
| Order history | 0/10 | Backend exists, frontend doesn't use it |
| Checkout | 0/10 | Button does nothing |
| Loyalty/rewards | 0/10 | Nothing after 8 years |
| Price transparency | 3/10 | Prices visible, no change tracking |
| Printability | 1/10 | Prints entire webpage with all the chrome |
| Overall frustration | **9/10** | One step from leaving |

**What would stop me from leaving for Amazon?** Three words: Reorder. Persistence. Checkout. Build those three things and I'll stay another 8 years.

**What's my ONE feature?** "Reorder Last Order" button. Homepage. One click. Done. Give me back my Monday mornings.

---

*— Gary Pham, Pham's Auto Service, Sacramento, CA. 8-year customer. For now.*
