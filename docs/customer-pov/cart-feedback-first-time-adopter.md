# Cart Experience Feedback — First-Time Cat Adopter

**Reviewer:** Tyler Brooks, 23, Portland OR  
**Cat:** Pixel, 2-year-old brown tabby (adopted 5 weeks ago from Multnomah County shelter)  
**Device:** MacBook Pro, Chrome  
**Date:** March 2025  
**Session:** Late-night shopping run after Pixel knocked my water glass off the nightstand for the third time this week  

---

## Overall Rating: 3/10

I'm going to be real here: I came to OctoCAT Supply to buy a smart feeder and a water fountain for Pixel because the Reddit thread said this place was good. What I got was a popup I didn't ask for, prices that don't match between pages, a mystery discount I can't explain, and a coupon code that does nothing. I'm sitting here at midnight with a cat asleep on my keyboard wondering if I should just go to Chewy.

---

## 1. Product Guidance

**Score: 2/10**

There is literally NO guidance for someone like me. I just adopted a cat five weeks ago. I went in "just to look" at the shelter and came out with Pixel, a cardboard carrier, and zero supplies. I have been Googling "what does a cat need" every single day since.

When I land on the products page, I see 13 smart tech products with no categories, no filters, and no indication of what's essential vs. nice to have. There's no "New Cat Owner Starter Kit" or "First Things to Buy" or even basic categories like "Feeding" vs "Play" vs "Health."

I had to scroll through everything and guess. A SmartFeeder sounds useful — Pixel needs to eat. A Smart Fountain Flow+ — I read on r/cats that cats don't drink enough still water and kidney problems are a thing. But what about the AutoClean Litter Dome vs the ScratchPad Pro vs the ZoomieTracker AI Mat? I have no idea what priority any of these are.

**What I wish existed:** A "You just adopted a cat — here's what you need first" flow that walks me through essentials (food, water, litter, scratching) before showing me the fun stuff (cameras, AI mats, entertainment portals).

---

## 2. Cart Clarity

**Score: 3/10**

The cart layout itself is... fine? I can see my items, quantities, and totals. But there are a bunch of problems:

- **"S. No." column** — Why is this here? I don't need my cart items numbered like an Excel spreadsheet. I have two items. I can count to two.

- **Prices are rounded weirdly** — The products page showed SmartFeeder One at $97.49 (25% OFF from $129.99). The cart shows "$130." Not $97.49. Not $129.99. Just $130. Where did $97.49 go?? Am I being charged the sale price or the full price? I genuinely cannot tell and that is terrifying for someone trying to stick to a budget.

- **"Update Cart" button** — What does this do? I changed a quantity and... do I need to click this? Or does it auto-update? I clicked it and nothing happened that I could see. Is it broken? Is it decorative?

- **No link back to the product** — If I want to double-check what the SmartFeeder One actually does before I commit, I can't click the product name or image to go back to its detail page. I'd have to go back to Products and find it again.

- **No +/- buttons for quantity** — The products page had plus and minus buttons for quantity. The cart just has a number input. Why is the interaction pattern different between pages?

---

## 3. Price Anxiety

**Score: 1/10 — This is the biggest problem.**

Okay, I need to vent about this because it genuinely shook my confidence in the site:

### The 25% OFF Bait-and-Switch

On the products page, the SmartFeeder One shows:
> ~~$129.99~~ **$97.49** (25% OFF badge)

I put it in my cart expecting to pay $97.49. I get to the cart and it says **$130**. That is not $97.49. That's not even $129.99. It's $129.99 rounded UP to $130 with no explanation. The sale price evaporated. Where did the 25% off go??

Same thing with Smart Fountain Flow+:
> ~~$69.99~~ **$52.49** (25% OFF badge)

Cart says **$70**. Not $52.49.

I've worked in software — I know what happened. The code adds `product.price` to the cart, not `product.price * (1 - product.discount)`. The sale prices are literally just for show. The cart charges full price. **This feels deceptive.** Even if it's a bug, from my perspective, the site advertised one price and charged another. That destroys trust immediately.

### The Mysterious 5% Discount

The Order Summary shows "Discount (5%)" with -$10.00. Cool. Where did this 5% come from? I didn't do anything to earn it. It's not the 25% from the product badges. It's not the 30% from the popup promo. It just... exists. With no explanation.

As a new customer, I have questions:
- Is this a first-time buyer discount?
- Is it always there?
- Will it go away if I leave and come back?
- Is it being applied ON TOP of the 25% OFF? (Spoiler: the 25% OFF isn't applied at all)

### The Coupon Code Theater

The promo popup that assaulted me when I loaded the page said: "EXCLUSIVE SALE! 30% OFF GitHub Copilot Chef's Hat, Promo Code: TechConnect." So I typed "techconnect" into the coupon field and it said "Applied!" — but absolutely nothing changed. The 5% discount was already there. The grand total didn't budge. The coupon code is cosmetic. It validates but does nothing.

### The Math Doesn't Even Add Up

- Subtotal: $200 (rounded from $199.98)
- Discount (5%): -$10.00
- Shipping: $10
- $200 - $10 + $10 = $200. Grand total shows $199.98.

Are we rounding some things and not others? If I'm going to be charged $199.98, why does the subtotal say $200? Pick a system and stick with it.

---

## 4. Product Recommendations

**Score: 1/10**

There are ZERO product recommendations anywhere in the cart. No "Frequently Bought Together." No "People who bought SmartFeeder One also bought..." No "Complete your setup" suggestions.

I bought a smart feeder and a water fountain. You know what I probably also need? A litter box. Food bowls. A scratching post. Maybe a cat bed. The site knows exactly what I bought and has products in those categories. Why isn't it helping me?

The Reddit thread that sent me here was more helpful than the site's own cart page, and that's kind of sad.

---

## 5. Confidence Level

**Score: 2/10**

I am NOT confident about this purchase. Here's my mental state:

- **Am I paying the sale price or the full price?** The cart says $130 for something advertised at $97.49. I don't know.
- **What does the coupon code actually do?** It says "Applied!" but nothing changed.
- **Where did Discount(5%) come from?** Unknown. Could disappear if I reload.
- **Is $10 shipping reasonable?** No idea. No shipping estimates, no delivery timeframes, nothing.
- **What happens when I click "Proceed To Checkout"?** I'm not logged in. Will it save my cart? Will it ask me to create an account? Will my cart evaporate?

That last one is a real concern because I discovered earlier that if I accidentally do a full page refresh, my entire cart disappears. Nothing is saved. Zero persistence. I'm one Command+R away from losing everything and having to fight the promo popup again.

---

## 6. Missing Newbie Features

Here's what a first-time cat owner desperately needs that this cart doesn't have:

1. **Cart persistence** — Save my cart to localStorage at minimum. I closed my laptop to move Pixel off my keyboard and when I came back, I had to re-add everything. That's not okay.

2. **Product education in the cart** — A one-line description of each item would help. "SmartFeeder One" — is that the automatic food dispenser? I think so? A subtitle like "Automated portion-controlled cat feeder" would confirm I'm buying the right thing.

3. **"Is this right for your cat?" context** — Pixel is 10 lbs and 2 years old. Is the SmartFeeder One sized for that? Is the fountain's water capacity sufficient? These products might have specs but I can't see them from the cart.

4. **Honest pricing** — Show the same price on the products page AND the cart page. If it's on sale for $97.49, charge me $97.49. If the sale isn't real, don't show it.

5. **Coupon code that works** — If "TechConnect" is a valid promo code, it should actually apply a discount. If the popup offering 30% off a Chef's Hat only applies to the Chef's Hat, say that clearly.

6. **Save for later** — I'm interested in the SnackVault Puzzle Dispenser but I'm not ready to commit. Let me save it without adding it to my cart.

7. **Shipping estimate before checkout** — "Shipping: $10" tells me nothing. When will it arrive? Is there a free shipping threshold? Should I buy more to qualify?

8. **Return/satisfaction policy** — I'm buying my first cat products. What if Pixel hates the feeder? Can I return it? No information available.

---

## 7. Top 3 Recommendations

If I could wave a magic wand and fix three things about this cart experience:

### 1. Fix the Pricing Integrity

This is non-negotiable. The price displayed on the products page MUST match the price in the cart. Showing "25% OFF $97.49" on the product and charging $130 in the cart is either a bug or deceptive — and from the customer's perspective, the distinction doesn't matter. I won't buy from a site I can't trust to charge the price it advertises. Pixel deserves better and honestly so do I.

### 2. Add a "New Cat Owner" Guided Shopping Experience

I don't need 13 smart tech products staring at me with no context. I need someone (or something) to say: "Hey, you just got a cat! Here's what you need in order of priority: 1) Food + Feeder, 2) Water Fountain, 3) Litter Setup, 4) Scratching Post, 5) Enrichment Toys." Walk me through it. Let me add a curated bundle. Save me from my own analysis paralysis. I spent 30 minutes reading about the difference between the ScratchPad Pro and just... using a cardboard box. Help me.

### 3. Persist the Cart and Earn My Trust

My cart disappearing on page refresh is genuinely awful. I know from a technical standpoint this is just React state with no persistence — but from a customer standpoint it feels like the site doesn't care about my shopping progress. Save the cart. Let me come back tomorrow after I've convinced myself that $200 on cat tech is reasonable (Pixel is worth it, but I need to process this). And while you're at it, explain where the 5% discount comes from and make the coupon code actually do something.

---

## The Promo Popup Deserves Its Own Section

When I first loaded the products page, I was immediately hit with a full-screen modal:

> **EXCLUSIVE SALE! 30% OFF GitHub Copilot Chef's Hat**  
> **Promo Code: TechConnect**

This is the first thing I see when I come to buy cat supplies. A chef's hat. For a cat. At 30% off. Before I can even see the products.

It's a `fixed inset-0` overlay with no close button — just an "OK" button. And it comes back EVERY TIME the page re-renders because the state defaults to `true`. If I accidentally trigger a re-render (which happened constantly because the quantity buttons are janky), boom — popup again.

Also, the chef's hat is $72.99. It's the most expensive non-essential item on the site. Leading with a 30% discount on a novelty cat chef's hat when I'm here to buy my first cat's basic supplies is... a choice.

---

## Screenshots

- [Cart in light mode](cart-light-mode.png) — showing the price discrepancy clearly  
- [Cart in dark mode](cart-dark-mode.png) — dark mode works but the pricing issues are the same  
- [Products page](products-dark-mode.png) — note the "25% OFF" badges and discounted prices that vanish in the cart  

---

## Summary

I came to OctoCAT Supply because Reddit recommended it. I wanted to buy two things for Pixel. Instead I spent 45 minutes fighting a promo popup, discovering that sale prices are decorative, watching my cart vanish on refresh, and trying to figure out why a coupon code says "Applied!" but does nothing.

Pixel is currently headbutting my elbow because it's past midnight and he wants me to stop typing and go to bed. He's right. But I need him to know that I'm trying to find him a good feeder and a water fountain and this website is making it SIGNIFICANTLY harder than it needs to be.

Fix the pricing. Guide the newbies. Save the cart. That's it. That's the feedback.

---

*Submitted by Tyler Brooks, who is going to bed now because Pixel just laid down on the trackpad and closed three tabs. He's helping.*
