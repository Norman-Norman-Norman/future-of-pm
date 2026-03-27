# Shopping Cart Feedback — Helen Park, Senior Customer

**Date:** March 10, 2026  
**Reviewer:** Helen Park, age 74, retired librarian, Sarasota, FL  
**Device:** HP laptop, browser at 100% zoom  
**Cats:** Biscuit (16, arthritis & kidney disease) and Marmalade (14, hyperthyroidism)  
**Task:** Order monthly supplies for Biscuit and Marmalade via the shopping cart

---

## Overall Rating: 4 out of 10

I'm going to be honest with you, because I think you'd want me to be. I've been ordering things for Biscuit and Marmalade online for years now, ever since Karen set up my account. I know what I want. I know exactly what my cats need. But this cart made me feel like I was doing something wrong at every step, and I shouldn't have to feel that way just to buy cat food.

---

## 1. Readability

**Rating: 5/10**

The product names and prices inside the cart table are set at 18px, which I can read without squinting — that's the one thing I'll give you credit for. But the column headers at the top of the table — "S. NO.", "PRODUCT IMAGE", "PRODUCT NAME", "UNIT PRICE", "QUANTITY", "TOTAL", "REMOVE" — those are only 14px, uppercase, and gray on a light background. I had to lean forward to read them. At the library, we never put labels in small gray text. Labels are the most important thing on a page. They tell you what you're looking at.

The footer text is 14px too, which is fine for fine print I suppose, but the footer has important things like "Help Center" and "My Cart" — those shouldn't be in fine print.

The Order Summary on the right side is readable. "Subtotal," "Discount," "Shipping," "Grand Total" — I can see those clearly. The "Proceed To Checkout" button at 18px is the largest text on the page and I appreciate that. It's the one thing I could find without my reading glasses.

**What I need:** All text on this page should be at least 16px. Column headers should be larger than the data they describe, not smaller. Gray text on a gray-white background is not accessible.

---

## 2. Button Clarity

**Rating: 4/10**

There are three kinds of buttons on this page, and only one of them is clear:

- **"Proceed To Checkout"** — Large, green, obvious. I know exactly what it does. Good.
- **"Apply Coupon"** and **"Update Cart"** — These are green and readable, but I don't understand what "Update Cart" does. Am I supposed to click it after changing a quantity? Does the cart not update automatically? In a library catalog, when you change something, it just changes. You don't have to tell the computer you've made a change.
- **The trash can icons** — These are the "Remove" buttons. They're just little trash can pictures, 40 pixels by 40 pixels. No text. Just an icon. If I hadn't read the column header (which, as I mentioned, is hard to read), I wouldn't know what that little picture does. And at 40px, it's smaller than my fingertip. The Web Content Accessibility Guidelines say interactive elements should be at least 44 pixels. These fail that test.

**What I need:** The remove buttons should say "Remove" next to the icon, or at least be larger. And I need to know: does the cart update when I change a number, or do I have to click "Update Cart"? That should be obvious without guessing.

---

## 3. Navigation

**Rating: 3/10**

This is where I had the most trouble, and I want to explain carefully because it matters.

The navigation links at the top — "Home," "Products," "About us" — are set at 14px. That's the size of a footnote. The touch targets are only 36 pixels tall, which is below the accessibility minimum. On my laptop, the links are small, close together, and easy to miss.

The shopping cart icon in the corner is 40x40 pixels with no text label. It's just a little cart picture. I know what it is because Karen told me, but someone who's never shopped online might not. When there are items in the cart, a tiny green number appears — but it's so small I can barely see it.

Here is what truly frustrated me: I added items to my cart from the Products page, and when I tried to navigate to my cart, the page seemed to bounce back and forth. Sometimes my items disappeared entirely. I understand from experience that this might be a "page refresh" issue, but I shouldn't have to understand that. If I put something in my cart, it should stay there. Period. I don't care if I close my browser and come back tomorrow — Richard's old bookshop kept my order ready until I came back for it.

**What I need:** Navigation links should be at least 16px with adequate spacing. The cart icon should have the word "Cart" next to it. And my cart items must persist — if I close the page and come back, my items should still be there.

---

## 4. Confusion Points

Several things confused me enough that I almost closed my laptop:

1. **Cart items vanish on page refresh.** The cart uses in-memory storage only — no saving to the browser. This means if I accidentally refresh, bookmark the page, or come back later, everything I selected is gone. For someone like me who takes her time shopping, this is devastating. I spent fifteen minutes finding the right products for Biscuit's kidney diet, and then they just... disappeared.

2. **The "Update Cart" button.** What does it do? When I change a quantity in the number box, does it update automatically or not? The button exists but appears to have no visible effect. In the library, we called this "a button that lies" — it looks like it does something, but it doesn't tell you what.

3. **Footer links go nowhere.** The footer lists "My Cart," "Checkout," "Shopping Details," "Order," and "Help Center" — every single one of these goes to a dead end (the "#" link). I clicked "Help Center" looking for a phone number and nothing happened. That's not just confusing — it's a broken promise.

4. **Product page modals block everything.** When I clicked on a product image on the Products page, a dark overlay appeared covering the entire screen. I couldn't click anything else until I found a way to dismiss it. If I accidentally click a product image while trying to click the small "+" button next to it, I'm trapped in a popup I don't understand.

5. **No confirmation when removing items.** One tap on that tiny trash can icon and the item is gone. No "Are you sure?" No undo. With my arthritis, I sometimes click the wrong thing. I need a chance to take it back.

6. **The quantity jumped from 0 to 62.** When I tried to use the "+" button on the Products page, the quantity leaped to 62 at one point. The "+" and "-" buttons are only 32x32 pixels — far too small for someone with limited dexterity. I was apparently hitting them multiple times without realizing it.

---

## 5. Font and Size Issues

Here is a summary of what I measured:

| Element | Font Size | Touch Target | Passes 44px Minimum? |
|---|---|---|---|
| Nav links (Home, Products, etc.) | 14px | 36px tall | No |
| Cart icon | — | 40×40px | No |
| Cart table headers | 14px uppercase | — | N/A |
| Cart product names | 18px | — | N/A |
| Cart prices | 18px | — | N/A |
| Quantity input (cart) | 18px | 64×46px | Yes |
| Remove button (trash icon) | — | 40×40px | No |
| Apply Coupon button | 16px | 158×44px | Yes (barely) |
| Update Cart button | 16px | 157×44px | Yes (barely) |
| Proceed To Checkout | 18px | 254×56px | Yes |
| Products page +/- buttons | — | 32×32px | No |
| Footer text | 14px | — | N/A |
| Product descriptions | 14px | — | N/A |

Five interactive elements fail the 44px minimum touch target. The +/- buttons on the Products page at 32px are the worst offenders — they are the primary way I adjust quantities, and I can barely hit them with a mouse, let alone with arthritic fingers.

---

## 6. Missing Simplicity Features

1. **No phone number anywhere on the page.** Not in the header, not in the footer, not in the "Help Center" link (which goes nowhere). When the website defeats me — and it did — I want to call someone and say, "I need three bags of kidney support food for my cat Biscuit, size medium, shipped to my house." That should be possible. It isn't.

2. **No delivery instructions field.** I have arthritis. I can't carry heavy boxes up my porch steps. I need a field that says "Delivery Instructions" where I can write "Please leave on the porch bench." There's no place for that.

3. **No "Save Cart for Later" feature.** I shop on Saturday mornings. Sometimes Marmalade needs something and I have to get up to check her. I need to be able to come back to my cart. Right now, if I leave, it's all gone.

4. **No order summary email before checkout.** Before I click "Proceed To Checkout," I'd like the option to email myself a summary so I can review it at my own pace, maybe check with the vet about Biscuit's food before I finalize.

5. **No senior cat product category.** I know what Biscuit and Marmalade need — kidney support food, thyroid treats, joint supplements, heated beds. But I have to search through all the products to find anything relevant. There's no "Senior Cat" or "Health & Wellness" section.

6. **The 5% discount is applied automatically with no explanation.** The Order Summary shows "Discount(5%)" — but discount for what? Is it always there? Is it because I have a coupon? I didn't apply one. This is confusing. If there's a discount, tell me why I'm getting it, clearly.

---

## 7. Top 3 Recommendations

### 1. Make the cart persistent and the journey foolproof

My items should be saved to the browser so they survive page refreshes, accidental closures, and come-back-later shopping sessions. When I click the cart icon, I should go to my cart and see exactly what I put there. Every time. Without exception. Richard's bookshop kept my holds for a week. Surely a website can keep my cart for an afternoon.

### 2. Make every interactive element large enough to see and click

Every button, link, and input should be at least 44 pixels in both dimensions. The +/- buttons at 32 pixels are too small. The trash can icons at 40 pixels are too small. The navigation links at 36 pixels are too small. I shouldn't need Karen's young eyes and steady hands to use this website. Increase all touch targets, add text labels next to icons, and ensure that accidentally clicking near a button doesn't trigger something unexpected.

### 3. Put a phone number on every page, visible and large

At the top of the page or in a sticky banner, in at least 18px text: "Need help? Call us at 1-800-XXX-XXXX." That's it. That's all I need. When the website confuses me — and it will, because I'm 74 and websites change their layouts constantly — I want to pick up the phone, talk to a kind person, and place my order for Biscuit's kidney food. That phone number is my safety net. Without it, I'll go elsewhere. And you'll never know I left, because I don't leave angry reviews. I just leave.

---

## A Final Word

I know this website was likely designed by talented young people who can see small text and click tiny buttons without thinking about it. But Biscuit is sixteen years old and he needs his kidney support food. Marmalade is fourteen and she needs her thyroid treats. I will spend whatever it takes to keep them comfortable and healthy. I am not a customer who needs to be enticed with flashy designs and discount popups. I just need a clear page, with clear text, where I can find what my cats need, put it in a cart that remembers me, and pay.

That's all. I don't think that's too much to ask.

— Helen Park  
*Sarasota, FL*  
*Cat companion for 45 years*
