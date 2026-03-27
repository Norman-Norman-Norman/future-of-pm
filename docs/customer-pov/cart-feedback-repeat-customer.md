# Cart Feedback — Repeat Customer Perspective

**Reviewer:** Gary Pham, Pham's Auto Service  
**Date:** March 10, 2026  
**Customer Since:** 2018 (8 years)  
**Ordering Frequency:** Every Monday and Thursday, 7:15 AM  
**Average Order Size:** $400–$900  
**Device:** Desktop (Windows, Chrome)  
**Page Tested:** http://localhost:5137/cart  

---

## Overall Rating: 2 / 10

I've been ordering from OctoCAT Supply for 8 years. Twice a week. Same products. Same quantities. And every single Monday morning, this cart makes me start from scratch like I'm a brand-new customer who wandered in off the street.

This is not a cart. This is an empty shopping bag with no memory.

---

## 1. Reorder Experience

**Rating: 0 / 10 — Does not exist.**

There is no "Reorder" button. There is no "Reorder Last Order" option. There is no way to pull up what I ordered last Monday and say "same thing, adjust the SmartFeeder quantity from 3 to 4, checkout." I have to browse the entire product catalog, find each item, increment the quantity one click at a time, and add them individually.

I order the same 25–30 items every week. This should take 2 minutes. It takes 15+ because I'm rebuilding my entire order from memory on the products page.

The "Add to Cart" button is disabled until you manually increment quantity. That means for every single product, I'm clicking "+" multiple times, then clicking "Add to Cart." Multiply that by 25 products. That's easily 75+ clicks just to recreate what I ordered 3 days ago.

---

## 2. Saved Carts

**Rating: 0 / 10 — Does not exist.**

There is no "Save Cart" button. There is no "Save for Later" option. There are no saved lists, favorites, or wishlists. If I spend 15 minutes building my cart and accidentally close the browser tab, **the entire cart is gone.** Not reduced, not saved to my account. Gone. Vanished.

I tested this: refresh the page, cart is empty. The cart state lives only in browser memory (`useState` in React). There's no localStorage, no sessionStorage, no server-side persistence. A single page refresh wipes everything.

This isn't just inconvenient — it's hostile to repeat buyers.

---

## 3. Order History

**Rating: 0 / 10 — Does not exist.**

There is no Order History page. The footer shows links for "My Cart," "Checkout," "Shopping Details," and "Order" — but every single one of those links goes to `#`. They're dead links. They go nowhere. They're decoration.

The API has order endpoints (`/api/orders`), but the frontend doesn't use them. There's no page that shows past orders. There's no way for me to say "show me what I ordered last Thursday" or "reorder from February." 

After 8 years of orders, I should have a history I can reference. I have nothing.

---

## 4. Price Consistency

**Rating: 3 / 10 — Prices visible, but no change tracking.**

I can see prices on the products page and in the cart summary. The SmartFeeder One shows $97.49 (discounted from $129.99). Fine. But there is zero indication of whether any price has changed since my last order. 

I know what I paid last week. If the price went up $2, I want to see a flag: "Price changed from $95.49 → $97.49 since your last order." That's basic courtesy for someone who orders every week. Right now, I'd never know unless I compared my printed receipts from the binder.

There's also a flat 5% discount applied automatically in the cart, but there's no explanation of why, no loyalty tier, no indication that I'm getting it because of my order volume. It just says "Discount(5%)" — is that for everyone? Is that my reward for 8 years? I can't tell.

---

## 5. Loyalty Benefits

**Rating: 0 / 10 — None visible.**

No loyalty program. No points. No tier status. No "valued customer" anything. I've placed 800+ orders over 8 years and I get the same exact experience as someone who showed up today for the first time.

There's a coupon code field in the cart — the code "techconnect" works for some kind of promo. But that's a one-time event code, not a loyalty benefit. There's also a popup advertising "30% OFF GitHub Copilot Chef's Hat — For Microsoft Tech Connect Attendees Only." That's a conference promo, not a loyalty reward.

After 8 years and probably $300,000 in orders, I deserve better than a coupon field.

---

## 6. Missing Repeat-Buyer Features

Every single one of these is missing:

- **Reorder button** — "Order Again" from any past order
- **Standing/recurring orders** — Auto-order every Monday, notify before charging
- **Saved product lists** — "Gary's Weekly Order" that I can load with one click
- **Cart persistence** — Cart should survive page refresh, browser close, even device changes. It should be tied to my account.
- **Order history page** — My past orders, filterable by date, reorderable
- **Price change alerts** — Flag items whose price changed since my last purchase
- **Quick quantity editing** — Type the number instead of clicking "+" twenty times
- **Frequently ordered items** — Show MY top products on the homepage or a dedicated section
- **Print-friendly receipts** — The page prints with nav bars, footers, and social media links. I need a clean receipt for my binder.
- **Account-linked cart** — Login exists but my cart isn't connected to my account. Cart is just browser memory.

---

## 7. What Slowed Me Down

1. **No navigation to cart from the products page.** The nav bar disappeared after scrolling on products. Had to scroll back to the top to find the cart icon. On a long product list, that's a waste of time.
2. **Quantity incrementer is click-only.** I can't type "12" in the quantity box on the product page. I have to click "+" twelve times. The cart page has a typeable quantity field, but the product page doesn't. Why are they different?
3. **Promotional popup blocks the page.** A "30% OFF" modal appeared on top of the products. I didn't ask for it. I know what I want. Get out of my way.
4. **Cart count badge disappeared** after certain navigation actions. I added items, the badge showed "78" (wrong number, by the way — I added 3), then it vanished after navigating.
5. **Footer links are all fake.** "My Cart," "Checkout," "Shopping Details," "Order," "Help Center" — all point to `#`. Don't put links in front of me if they don't go anywhere.

---

## 8. What Worked

Grudgingly, a few things:

- The product page layout is clean. I can see the product, the price, and the quantity controls without squinting.
- Prices are visible and clearly formatted.
- The cart summary section (subtotal, discount, shipping, grand total) is straightforward.
- Dark mode toggle exists — I don't use it, but fine.

---

## Top 3 Recommendations

1. **"Reorder Last Order" button on the cart page.** When I land on `/cart` and it's empty, show me my last order with a single "Reorder All" button. Let me adjust quantities inline before checkout. This one feature would cut my Monday ordering from 15 minutes to 3.

2. **Persist the cart to my account.** Cart state cannot live only in browser memory. If I refresh, if I close Chrome, if my computer crashes (it's an old Dell, it happens) — my cart should still be there when I come back. Tie it to my account, save it server-side.

3. **Build an Order History page.** Show me every past order with dates, items, quantities, and totals. Let me click "Reorder" on any of them. This is table-stakes for a B2B supplier. I should've had this 7 years ago.

---

## The Bottom Line

This cart was built for someone buying one item one time. It was not built for Gary Pham, who orders the same 25 products every Monday and Thursday like clockwork. The entire experience assumes I'm a new customer every single visit. No memory, no history, no shortcuts.

I've been loyal for 8 years. This cart hasn't earned that loyalty back.

Give me the reorder button. That's it. That's all I want. Everything else is gravy. But the reorder button is the bare minimum for a repeat buyer, and right now, it doesn't exist.

— Gary Pham  
*Pham's Auto Service, Sacramento, CA*  
*Written at the shop desk, 7:15 AM, Monday morning, Torque asleep on the parts counter*
