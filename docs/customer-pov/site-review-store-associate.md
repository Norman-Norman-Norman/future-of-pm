# Store Associate Site Review — Jake Rodriguez

| Field | Value |
|-------|-------|
| Reviewer | Jake Rodriguez, Senior Store Associate |
| Location | Denver, CO — Branch #1 |
| Date | March 10, 2026 |
| Specs Reviewed | Catalog Management, Order Management & Checkout, Frontend Shell & UX |
| Perspective | Floor associate — 60-80 customer interactions/day, standing at the counter, answering phones, training new hires |

---

## Gut Reaction

Okay so I'm gonna be real with you — this site cannot sell anything right now. The checkout button literally does nothing. I just watched myself click "Proceed To Checkout" and... nothing happened. No error, no redirect, no feedback. Just a dead button. That's not a bug, that's the entire business not working. If you told me to compete with Amazon using this, I'd think you were joking.

The bones are there — product grid looks clean, dark mode is nice, the cart UI is actually decent — but we're asking customers to browse a store where they can't buy anything. That's like opening a restaurant where the kitchen is closed.

---

## The Speed/Simplicity Angle

Right now, here's what a typical customer interaction looks like for me:

**Customer asks: "Do you have smart cat feeders?"**
- I go to Products page: **1 click**
- I type in the search box: results filter as I type — **okay, that part actually works**
- But there's no autocomplete, no suggestions, no "did you mean" — if they say "feeder" and the product says "Food Dispenser," we get zero results
- No category filters, so if they say "show me everything under $50," I have to eyeball it
- **Time: ~15-20 seconds** to answer a simple question. Should be **3-5 seconds**.

**Customer says: "I want to buy this."**
- Add to cart: select quantity, click Add to Cart — **3 clicks, not bad**
- Go to cart: **1 click** (cart icon in nav — nice)
- Click "Proceed To Checkout": **DEAD. Nothing happens.**
- I literally cannot complete this sale. At all.
- **Time: infinite**, because the transaction never finishes.

**Customer calls: "Where's my order?"**
- There is no order tracking page. None.
- There is no "My Orders" section.
- I have zero information to give them.
- **Time: the entire call is wasted**, and the customer thinks we're incompetent.

---

## Top Priorities (From the Floor)

1. **MAKE CHECKOUT WORK.** I cannot overstate this. The button is there, it's beautiful — gradient, rounded corners, the whole thing — and it does absolutely nothing. This is priority zero. Nothing else matters until customers can give us money.

2. **Don't lose the cart on refresh.** Right now the cart is React state only. Customer adds 6 items, accidentally hits refresh, everything's gone. I watched the code — it's `useState` with no localStorage, no server sync. This will destroy people. DoorDash doesn't lose your burrito when you switch apps. We shouldn't lose a $500 order.

3. **Product search that actually finds things.** The search box filters by name and description, which is better than nothing. But there's no autocomplete, no fuzzy matching, no category filters, no price range slider. If someone types "dispensor" instead of "dispenser" they get nothing. Amazon would've shown them results AND corrected their spelling.

4. **Order tracking.** When a customer calls and asks where their order is, I need to give them an answer in 10 seconds. Right now I'd have to say "I don't know" and that is embarrassing.

5. **Fix the footer.** Every single link in the footer is `href="#"`. My Cart, Checkout, Help Center, Privacy Policy, Terms — all dead. Customers click those and nothing happens. It looks like a template someone forgot to finish. Because it is.

---

## Pain Points

- **The checkout button does nothing.** I want to be absolutely clear: there's a big green gradient button that says "Proceed To Checkout" and it has NO onClick handler. Not a broken one — literally none. Look at the code — it's just `<button className="...">Proceed To Checkout</button>`. No function, no redirect, nothing. This is the most important button on the entire site and it's decorative.

- **Cart vanishes.** `CartContext.tsx` uses `useState<CartItem[]>([])`. No localStorage. No sessionStorage. No API persistence. Customer spends 10 minutes building a cart, refreshes the page, it's all gone. I'd have to say "sorry, can you add those again?" You know how that sounds?

- **No mobile hamburger menu.** The navigation uses `hidden md:block` which means on mobile, the nav links just disappear. Customers on phones can see the logo and the cart icon — that's it. Can't get to Products, can't get to About, can't get to anything. 60% of traffic is mobile according to the spec. We're hiding the nav from 60% of visitors.

- **No order history, no order confirmation.** If checkout DID work, what would customers see after? Nothing. No confirmation page, no order number, no email. They'd click pay and wonder if it went through. That's anxiety-inducing. Every real store shows you a confirmation.

- **"Update Cart" button is also dead.** In the cart, there's an "Update Cart" button that also has no handler. It's another decorative button. Are we collecting decorative buttons?

- **Product search has no filters.** 13 products right now, sure, we can scroll. But the spec says we're growing. Without category filters, price filters, or supplier filters, this becomes a wall of products fast.

---

## Would I Use This?

**No.** Not in its current state. I literally cannot complete a sale. The site is a product catalog — like a brochure — not a store. Customers can look at things, put them in a pretend cart, click a checkout button that goes nowhere, and then... leave.

If I had to help a customer right now, I'd pull up the products page to show them what we have (the grid layout is actually nice), then I'd write their order down on paper and call the warehouse. That's where we are.

**What would make me say yes:**
1. Checkout button works — they click, they enter shipping, they enter payment, they see confirmation. Done.
2. Cart persists — I can help them build a cart today and they can come back tomorrow.
3. I can look up their order status in under 10 seconds.

That's it. Those three things turn this from a brochure into a store.

---

## The Tyler Test

Could I train Tyler (new hire, 2 weeks in) to use this in under 2 minutes?

**Browsing products:** Yes, actually. The grid is clean, search works for basic stuff, add to cart is intuitive. I'd give this a thumbs up — Tyler figured it out day one. **Pass.**

**Checking out a customer:** No. Because I can't explain "click this beautiful checkout button and then nothing happens." Tyler would think the site is broken. Because it is. **Fail.**

**Looking up an order:** No. There's no way to do it. There's no order history page, no route for it, nothing in the nav. Tyler would have to ask me, I'd have to shrug. **Fail.**

**Using on mobile:** No. The nav disappears on phones. Tyler would be standing at the counter with his phone trying to help a customer and couldn't even navigate to the products page. He'd have to manually type `/products` in the URL bar. That's not a real solution. **Fail.**

**Understanding the footer:** Tyler would click "Help Center" and it goes nowhere. He'd click "My Cart" and it goes nowhere. He'd think the site is half-finished. He'd be right. **Fail.**

---

## What's Embarrassing Right Now

I'm gonna be honest, since you asked:

1. **A checkout button that doesn't check out.** This is like a cash register with no drawer. Customers will think we're either broken or a scam.

2. **Footer full of fake links.** 15 links, zero of them work. "Terms & Conditions" → nowhere. "Privacy Policy" → nowhere. "Help Center" → nowhere. This screams "we threw this together in a weekend."

3. **No mobile navigation.** On a phone, you get a logo and a cart icon. That's it. The actual nav links are hidden. This is 2026 — my grandma's church website has a hamburger menu.

4. **Cart that evaporates.** If a customer texts me "hey I added a bunch of stuff to my cart yesterday" and they open the site and it's empty — that's on us. Use localStorage. Shopify does it. Amazon does it. Every single competitor does it.

5. **No way to track orders.** If a customer asks "where's my stuff?" and we have to say "I don't know, let me check... actually I can't check either" — that's the kind of experience that loses a customer forever.

---

## My Ask

If I could change **one thing** right now — today, before anything else — it's this:

**Make the checkout button work.**

I don't care if it's a simple flow. I don't care if payment is mocked. I don't care if it's just: shipping address → confirm → "Order #12345 placed, we'll email you." Give me SOMETHING so that when a customer clicks that button, the system does what a store is supposed to do — take their money and promise them their stuff.

Everything else — search autocomplete, product ratings, AI recommendations, subscription ordering — all of that is great, and I want it eventually. But none of it matters if the customer gets to the finish line and the door is locked.

Fix checkout. Then fix cart persistence. Then add order tracking. In that order. Everything else can wait.

---

## Quick Comparison to Apps I Actually Use

| Feature | Amazon | Shopify POS | DoorDash | OctoCAT Supply |
|---------|--------|-------------|----------|----------------|
| Search with autocomplete | Yes | Yes | Yes | No — basic text filter only |
| Checkout works | Obviously | Yes | Yes | **No — button is dead** |
| Cart persists | Yes, forever | Yes | Yes | **No — lost on refresh** |
| Order tracking | Real-time with map | Yes | Real-time with map | **Doesn't exist** |
| Mobile nav | Hamburger + bottom tabs | Optimized for iPad | Full mobile app | **Nav links hidden on mobile** |
| Filters (price, category) | Extensive | Yes | Yes | **None** |
| Guest checkout | Yes | Yes | N/A | **Doesn't exist** |
| Order history | Full history | Full history | Full history | **Doesn't exist** |

We're competing with Amazon and we can't even complete a purchase. That's where we are.

---

*— Jake Rodriguez, Denver Branch. Standing at my counter. Ready to sell stuff the moment this site lets me.*
