# Full Site Evaluation — First-Time Buyer vs. Amazon

**Reviewer:** Aisha Johnson, Founder & CEO, coworking space startup (Brooklyn, NY)  
**Date:** March 10, 2026  
**Scope:** Complete shopping experience — landing page through (attempted) checkout  
**Comparison Baseline:** Amazon.com, where I've been buying everything for 4 months  
**Device:** MacBook Air, 3 tabs open, comparing suppliers  
**Cat Context:** Venture (4-month-old tuxedo kitten) needs supplies. I need a reason to not just go back to Amazon.  

---

## 1. Overall Rating: 3/10

I'm going to be really honest. I came here because my business advisor said I should find a proper supplier and stop overpaying on Amazon. I Googled "wholesale cat tech supplies," and OctoCAT Supply came up. The branding is cute — "Smart Cat Tech, Purrsonalized" — and for about 15 seconds I thought, *maybe this is the one.* Then I tried to actually buy something. And now I'm back on Amazon.

---

## 2. The Four Questions

### Question 1: What would make me abandon this site immediately?

All of these things happened, and all of them almost made me close the tab.

**The checkout button does nothing.** I'm not being dramatic. I added three products to my cart — a SmartFeeder for Venture, a PawTrack collar, and the Chef's Hat because it's funny — spent time getting quantities right, reviewed my order summary, hit "Proceed To Checkout," and... nothing. The button is there. It's big. It's green. It has a gradient. It looks *important.* It does absolutely nothing. No error message. No loading spinner. No redirect. Nothing. I clicked it four times thinking my trackpad was broken. It wasn't. The button is literally decorative.

On Amazon, I go from "Add to Cart" to "Order placed" in under 90 seconds. On OctoCAT Supply, I go from "Add to Cart" to staring at a pretty button that does nothing, forever.

**My cart vanishes when I refresh the page.** I had $400 of products in my cart. I refreshed the page to see if the checkout button would work on reload (troubleshooting instincts from a lifetime of apps). Cart: empty. Everything gone. No warning. No "your session expired" message. Just... gone. The cart is stored in React state — which means it lives in memory and dies the second you navigate away, refresh, or sneeze. I went back to the products page to re-add items and got hit with that promo popup AGAIN. I almost threw my laptop.

**No search that actually works.** There's a search bar on the products page. I typed "food" because I need cat food for Venture. Zero results. I tried "feeder." Got the SmartFeeder. But I wanted to find products by *category* — like "feeding," "health," "toys." There are no categories. There are no filters. There's no way to browse by price range. There are 13 products and I have to scroll through all of them every time. On Amazon, I can filter by Prime delivery, price range, rating, brand, and 47 other things. Here I get a text box that does a basic string match.

**No product reviews.** How am I supposed to know if the SmartFeeder is actually good? There are zero ratings, zero reviews, zero social proof. The product description says it "detects overeating" and "auto-updates a Feline Health Repo." That sounds made up. Is anyone actually using this? Has any real cat owner reviewed it? On Amazon, I wouldn't buy a $3 phone charger without checking reviews first. You want me to spend $130 on an AI cat feeder with zero reviews? No.

### Question 2: What minimum features would make me consider placing an order?

I'm a reasonable person. I don't need this to be Amazon on day one. But I need the basics:

1. **A checkout that works.** This is non-negotiable. I need to be able to enter my shipping address, pick a payment method, and place an order. That's it. I don't need Apple Pay or cryptocurrency support. I need a form and a "Place Order" button that actually places an order.

2. **Guest checkout.** Don't make me create an account before I can buy. I'm evaluating you. I'm not ready to commit to a relationship. Let me buy ONE order as a guest. If the experience is good, I'll create an account voluntarily for my second order. Amazon lets me buy without an account. So should you.

3. **Cart persistence.** Save my cart in localStorage. It's like 5 lines of code. My cart should survive a page refresh at absolute minimum. Ideally it should survive closing and reopening the tab.

4. **At least 5 product reviews.** I don't need thousands. Give me 5 reviews per product from real (or realistic) customers. Star ratings. Written feedback. "I bought this for my tabby and she figured out the schedule override in 3 days" — something that tells me actual cats have used these products.

5. **Category filters.** Let me filter by: Feeding, Health & Tracking, Entertainment, Accessories. And by price range. And by "On Sale." That's three filters. Not rocket science.

6. **Order confirmation.** After I place an order, show me a confirmation page with an order number, what I ordered, estimated delivery, and total charged. Send me an email. This is e-commerce 101.

### Question 3: What would make me choose this over Amazon?

OK here's the thing — Amazon is *fine* for cat supplies. It's not *great.* The cat tech category on Amazon is a mess of knockoff smart feeders, products with fake reviews, and Prime delivery that sometimes means "maybe Tuesday." There's an opening here for OctoCAT Supply. Here's what would make me switch:

- **Curated catalog.** You have 13 products. That's not a weakness — that's a feature. Amazon has 10,000 cat tech products and 9,900 of them are junk. If OctoCAT Supply can tell me "we hand-picked these 13 products and they're all legitimate quality," that's a value proposition. But you have to COMMUNICATE that. Right now your catalog feels small because it's incomplete, not because it's curated.

- **Expert recommendations.** "You have a 4-month-old kitten? Here's what you need." Amazon's recommendation algorithm is a black box. You could have actual cat-tech expertise. A "New Kitten Starter Kit" bundle with a SmartFeeder, PawTrack collar, and CatFlix Entertainment Portal for 15% off would genuinely make me buy all three.

- **B2B pricing without B2B complexity.** My advisor told me to find a "wholesale supplier." But I'm buying for a 6-person coworking space, not a Fortune 500 company. I don't have a tax ID for a business account. I don't know what Net 30 terms are. If you can give me bulk pricing without making me fill out a credit application, I'm yours.

- **Better product information.** Your product descriptions are fun but they're marketing copy, not buying information. What are the actual dimensions of the SleepNest ThermoPod? What's the warranty? Is it compatible with my apartment's outlets? Does the SmartFeeder work with wet food or just dry? Amazon product pages have specs tables, Q&A sections, and comparison charts. Give me the information I need to make a decision.

- **Trust signals.** A return policy. A customer service phone number or chat. A "shipping to Brooklyn: 3-5 business days" estimate. A "30-day money-back guarantee" badge. Anything that tells me this isn't just a pretty website with no one behind it.

### Question 4: How does the lack of checkout make me feel?

Honestly? Disrespected.

Not angry. Not confused. Disrespected. Because the entire site presents itself as a functional e-commerce store. There's a product catalog. There's an "Add to Cart" button. There's a cart page with a coupon code field. There's an Order Summary with a shipping calculation. There's a "Proceed To Checkout" button with a pretty gradient. The ENTIRE user journey walks me right up to the moment of purchase and then... nothing. The door is painted on the wall.

It feels like being invited to a restaurant, being seated, reading the menu, placing your order, and then the waiter says "oh, we don't actually have a kitchen." You built the whole restaurant except the part that makes food.

I spent 15 minutes on this site. I browsed products. I compared prices. I figured out the quantity selector UI (which, by the way, starts at 0 and I can't add to cart until I increment — on Amazon I click "Add to Cart" and default quantity is 1). I applied a coupon code. I reviewed my order summary. I was *ready to buy.* And then the site told me, in the most passive way possible, that buying things isn't actually something it supports.

That's 15 minutes of my life I invested in a store that can't sell me anything. I will not be investing another 15 minutes to check back later.

---

## 3. The Jargon Check

Things on this site that a normal human being ordering cat supplies for the first time would not understand:

| Term/Label | Where I Saw It | My Reaction |
|---|---|---|
| "SKU: CAT-FEED-001" | Product detail modal | What is a SKU? Why is this customer-facing? I don't care about your internal inventory codes. |
| "Unit: piece" | Product detail modal | As opposed to what? Am I going to accidentally order a SmartFeeder by weight? "Piece" is B2B jargon. Normal stores don't say "unit: piece." |
| "Discount(5%)" | Cart order summary | 5% of WHAT? FROM what? Why? Who decided this? Is it always there? Can it go away? |
| "Coupon Code" field | Cart | OK this one I understand, but the promo popup says "Promo Code" and the cart says "Coupon Code." Pick one term and stick with it. |
| "Update Cart" button | Cart | Update what? The totals already updated when I changed quantities. What does this button do that isn't already happening? |
| Login required (implied) | Navigation bar | The nav has a "Login" link. Does that mean I need to log in to checkout? To see prices? To browse? The ambiguity is anxiety-inducing for a first-timer. |

---

## 4. The Amazon Comparison

| Feature | Amazon | OctoCAT Supply | My Feeling |
|---|---|---|---|
| Search | AI-powered, autocomplete, spell correction, "did you mean?" | Basic text filter, no autocomplete, no categories | Like going from Google to a library card catalog |
| Filters | Price, rating, brand, Prime, category, 20+ facets | None | Genuinely nothing. Not one filter. |
| Product Reviews | Thousands per product, verified purchase, photos, Q&A | Zero | Buying blind. I wouldn't do it for $10, let alone $130. |
| Cart Persistence | Survives weeks, syncs across devices, survives logout | Dies on page refresh | Unacceptable in 2026. My Uber Eats cart survives longer. |
| Checkout | 1-Click ordering, guest checkout, saved payment methods | Button does nothing. Literally nothing. | The most broken thing I've encountered on a shopping site in years. |
| Guest Checkout | Yes, prominently offered | No, login appears required | Instant abandon for ~20% of shoppers (industry stat) |
| Order Tracking | Real-time, map view, delivery photo | Doesn't exist | Can't track what you can't order |
| Mobile Experience | Fully responsive, native app | Questionable — table layout in cart, hero image overflow | I switch between my MacBook and iPhone constantly. This doesn't work on iPhone. |
| Return Policy | Clearly visible, 30-day standard | Not mentioned anywhere | Am I stuck with a $200 robot litter box if Venture hates it? |
| Customer Service | Chat, phone, email, all visible | No contact info visible in the shopping flow | If something goes wrong, who do I call? |
| Onboarding | "New customer? Start here" prompts, guided experience | Nothing. No tooltip, no guide, no "first time here?" | I walked into a store with no staff and no signs. |

---

## 5. Onboarding Friendliness

**Score: 1/10.**

There is no onboarding. At all. Zero.

The Welcome page has a nice hero image and an "Explore Products" button. I click it and I'm on the product grid. From here I'm on my own. There's no "Welcome to OctoCAT Supply — here's how ordering works," no product category navigation, no "New here? Start with our bestsellers," no getting-started guide, no tooltip on the cart icon explaining how ordering works.

The login page is even worse. It's email + password. No "Sign up" option. No "Create Account" link. No "New customer?" flow. Just... a login form. So if I don't already have an account, what do I do? The form doesn't tell me. There's no registration page. There's no "Forgot password" link. It's a login form for a members-only club that doesn't have a sign-up sheet at the door.

I am the exact customer you need to win over — a new business owner making purchasing decisions for the first time. If your site doesn't help me in the first 60 seconds, I'm not going to figure it out on my own. I'm going to go back to Amazon where "Add to Cart → Buy Now" is a two-step process I've done 500 times.

---

## 6. Would I Stay or Bounce?

**Bounce. Hard.**

Here's my exact mental timeline:

- **0:00** — Land on Welcome page. "Smart Cat Tech, Purrsonalized." Cute. Venture would love this. Click "Explore Products."
- **0:05** — Promo popup blocks everything. Dismiss it. Slightly annoyed.
- **0:15** — Scrolling through 13 products. No filters. Search "kitten supplies." Zero results. Try "food." Zero results. Try "feeder." One result.
- **0:45** — Found the SmartFeeder. $97.49 with 25% off! Nice! Add to cart. Wait, quantity is 0 and I have to increment first? OK, weird. Tap +, tap "Add to Cart."
- **1:30** — Add a PawTrack collar too. Go to cart. SmartFeeder shows as $130 instead of $97.49. Prices don't match the product page. Suspicious.
- **2:00** — See "Discount(5%)" with no explanation. See "Proceed To Checkout" button. Click it.
- **2:01** — Nothing happens.
- **2:05** — Click it again. Still nothing. Check if I'm supposed to be logged in.
- **2:15** — Click login. See a login form. No signup option. Can't create an account. Can't check out without an account (presumably). Can't check out WITH an account (button doesn't work).
- **2:30** — Close the tab. Open Amazon. Search "smart cat feeder." Find one with 4.5 stars and 2,000 reviews. One-click purchase. Done.

Total time on OctoCAT Supply: 2 minutes 30 seconds.  
Total money spent on OctoCAT Supply: $0.  
Likelihood of return visit: Near zero.

---

## 7. The "Explain It to Me" Ask

The one thing that needs the most immediate help: **What happens after I add items to my cart?**

Seriously. There should be a clear, visible, impossible-to-miss explanation of the purchasing flow. Something like:

> "1. Browse & add items to your cart → 2. Review your order → 3. Enter shipping details → 4. Choose payment method → 5. Place your order → 6. Get order confirmation"

A simple progress bar. A "How ordering works" link. A tooltip on the cart icon. ANYTHING that tells a first-time visitor "yes, you can actually buy things here, and here's how." Because right now I genuinely cannot tell if this is:
- A functional store where checkout is broken
- A catalog where I'm supposed to call someone to place an order  
- A demo site that was never meant to sell anything

And the fact that I can't tell the difference is the problem.

---

## 8. My One Ask: Make the Store Actually Work

I can forgive a lot. I can forgive the jargon. I can forgive the missing filters. I can forgive the lack of reviews. Those are features you can add over time.

But I can't forgive a store that doesn't sell things.

If you do ONE thing before I visit again, make the "Proceed To Checkout" button take me to a checkout page where I can:
1. Enter my shipping address
2. Enter my payment information
3. Click "Place Order"
4. See a confirmation that my order was placed

That's it. No fancy payment terms. No PO numbers. No Net 30. Just let me give you money in exchange for cat supplies. That's the entire value proposition of an online store. And right now, you can't deliver on it.

Fix checkout. Persist the cart. Add guest checkout. Everything else is polish. Those three things are survival.

---

## 9. My Honest Summary

OctoCAT Supply has the *ingredients* of a store I'd actually want to use. The product catalog is interesting (Venture would genuinely benefit from the SmartFeeder and PawTrack). The branding is strong. The UI design is clean enough. The prices are competitive with Amazon for cat tech.

But right now it's a beautiful storefront with the doors welded shut. I can window-shop all day, but I can't buy anything. And the small things — cart vanishing on refresh, prices not matching between pages, mystery discounts, no reviews, no filters, no guest checkout — all add up to a site that feels unfinished and untrustworthy.

I represent the next generation of B2B buyers. We don't know what SKUs are. We don't have tax IDs memorized. We compare everything to Amazon because that's what we've used our entire adult lives. You either meet us where we are or you lose us to the site that does.

Right now? You're losing me. And I really did want to buy that SmartFeeder for Venture.

---

*"I spent 15 minutes trying to give you $400. You made it impossible. On Amazon, I would've been done in 90 seconds. Fix checkout, persist the cart, and let me buy without creating an account — and I'll give you another chance. One more chance."*

— Aisha Johnson

*P.S. — Venture just knocked my coffee off the desk while I was writing this. I do genuinely need that PawTrack collar to understand his zoomie patterns. Please let me buy it.*
