# OctoCAT Supply Cart Evaluation — Wholesale Bulk Buyer

**Reviewer:** James Okonkwo, Owner & Managing Director, Okonkwo Distribution Co.  
**Date:** March 10, 2026  
**Role:** Regional distributor, 150+ retail accounts, $800K+ annual supplier spend  
**Evaluation URL:** http://localhost:5137  
**Pages Tested:** `/products`, `/cart`  
**Test Scenario:** Evaluating OctoCAT Supply as a potential new supplier for 3 product categories at wholesale volume  

---

## 1. Overall Rating for Wholesale: 1 / 10

I'm going to be direct: this is a retail consumer storefront. There is nothing here for a distributor buying 5,000 units. I wouldn't even call this a B2B-capable platform. It's a nice consumer shopping cart for someone buying one cat bed for their living room. For someone placing a $40,000 order? We're done in 30 seconds.

---

## 2. Bulk Quantity Entry

**Rating: 2 / 10**

The products page uses tiny `+` and `-` buttons that increment by 1. One. Unit. At. A. Time.

I need to order 500 SmartFeeders. That's 500 clicks on a button the size of a fingertip. There is no text input field on the product listing page — you cannot type "500" or "5000" anywhere. You click `+` like you're playing a clicker game.

I tested entering 50+ units. The experience:
- Clicking `+` 50 times takes real time and triggers UI instability
- A promotional modal popup ("EXCLUSIVE SALE!") appears and blocks the entire page, requiring dismissal before you can interact with products again
- The quantity resets to 0 after adding to cart, with no confirmation of what was actually added or how many
- There is no maximum quantity indicator — I have no idea if they even have 50 in stock

The cart page does have a `type="number"` spinner input where you can type a quantity, but you have to add at least 1 unit first through the painful +/- button, then navigate to the cart and manually edit the quantity there. That's a two-step workaround for what should be a single text field.

**What I need:** A text input field on the product page where I type "500" and hit Add to Cart. Or better: a quick-order form where I enter multiple SKUs and quantities at once, like a purchase spreadsheet.

---

## 3. Volume Pricing

**Rating: 0 / 10**

There is no volume pricing. None. Zero. The code confirms it:

- The discount is hardcoded at a flat 5% (`DISCOUNT_RATE = 0.05`) regardless of whether I'm buying 1 unit or 10,000
- No tiered pricing structure (e.g., 1-99 units = list price, 100-499 = 10% off, 500+ = 20% off)
- No quantity breaks displayed on the product page
- No distributor pricing tier
- No contract rate capability
- Some products show "25% OFF" badges, but these are flat promotional discounts — not volume-based

The GitHub Copilot Chef's Hat is $72.99 whether I buy 1 or I buy 5,000. At my volume, I expect to negotiate that down to $50-55 at a minimum. List price is for retail buyers who walk in off the street. I'm not a walk-in.

**What I need:** A pricing engine that supports:
- Quantity break tiers visible on the product page
- Distributor/wholesale pricing tier (separate from retail)
- Customer-specific negotiated pricing after account setup
- Annual contract rates locked for 12 months

---

## 4. Shipping Calculation

**Rating: 0 / 10**

Shipping is a flat $10. For everything. The code confirms: `SHIPPING_COST = 10`.

Whether I order 1 cat collar or 5,000 AutoClean Litter Domes that fill an entire truck, shipping is $10. This is absurd for any volume buyer.

There are zero shipping options:
- No LTL (Less Than Truckload) vs. FTL (Full Truckload) selection
- No freight cost estimation based on weight, volume, or destination
- No carrier selection
- No delivery window scheduling — I need a 4-hour window, not "sometime this week"
- No split shipment capability — I have 2 warehouses (Atlanta Warehouse A and Atlanta Warehouse B) and need to split orders between them
- No shipping address management for multiple locations

At $40,000 in product, freight alone could be $2,000-$5,000. A flat $10 tells me this platform has never shipped a pallet.

**What I need:** LTL/FTL freight quotes. Delivery window scheduling. Multi-address shipping with split shipment support. Actual carrier integration (UPS Freight, FedEx Freight, SAIA, etc.).

---

## 5. Credit Terms

**Rating: 0 / 10**

There are no payment terms. The cart has a "Proceed To Checkout" button and that's it. The code shows no payment processing, no credit term selection, no invoice generation.

For context: I am not paying $40,000 on a credit card. That's not how distribution works. I need:
- Net 30/60/90 payment terms
- Purchase Order (PO) billing — I submit a PO number, receive goods, get invoiced, pay on terms
- Credit limit management — establish a credit line based on payment history
- Credit application process for new accounts

Credit card checkout for a $40,000 order is an immediate disqualifier. If I can't pay on terms, there's no deal. Period.

The site doesn't even have an invoice or order history system. After I "checkout" (which goes nowhere), how do I track my order? Where's my packing slip? My commercial invoice for my AP department?

---

## 6. Missing Wholesale Features

This is a long list:

### Account Management
- No dedicated account rep assignment
- No account login with distributor-level access
- No customer-specific pricing
- No order history or reorder capability
- Login page exists but provides no wholesale account features

### Request for Quote (RFQ)
- No ability to submit a quote request for large orders
- No RFQ workflow (submit quantities, receive pricing, negotiate, approve)
- No sales team contact for volume pricing discussions

### Standing / Blanket Orders
- No recurring order capability
- Cannot set up: "Ship 500 units of Product X to Warehouse A every Monday at $Y per unit for 12 months"
- No blanket purchase order management
- No scheduled delivery system

### Product Information
- No SKU/UPC visible on product listings for cross-referencing with my ERP
- No product spec sheets or technical documentation
- No case pack quantities (how many units per case? per pallet?)
- No minimum order quantities (MOQ)
- No lead time information
- No stock/availability indicators

### Cart Persistence
- Cart state is stored in browser memory (React Context) only
- Navigating away or refreshing the browser wipes the entire cart
- A $40,000 order built over 30 minutes disappears if I accidentally hit F5
- No server-side cart persistence
- No saved cart / draft order functionality

### Order Documentation
- No packing slip generation
- No commercial invoice
- No Bill of Lading support
- No order confirmation email workflow
- No purchase order attachment capability

---

## 7. Cart for Large Orders

**Rating: 2 / 10**

The cart uses an HTML table layout with columns for: S. No., Product Image, Product Name, Unit Price, Quantity, Total, Remove. This is a reasonable consumer layout, but for 20+ line items:

- The table would scroll endlessly with 20+ products — no pagination or grouping
- No line item notes or PO line references
- No ability to add special instructions per line item
- No bulk actions (select all, remove selected, update all quantities)
- The quantity input in the cart is a `type="number"` field (width 64px / `w-16`) — adequate for editing individual quantities but no bulk upload
- No CSV/Excel upload for building orders from a spreadsheet
- No quick-reorder from previous orders
- The coupon code field accepts one code ("TechConnect") — no support for multiple promotions or negotiated discount codes

The Order Summary sidebar shows:
- Subtotal (sum of line totals)
- Discount (flat 5%)
- Shipping (flat $10)
- Grand Total

Missing from summary:
- Tax calculation
- Freight estimate by weight/volume
- Volume discount breakdown
- Credit terms selection
- PO number entry
- Delivery date selection

---

## 8. Top 3 Recommendations

### 1. Implement a Wholesale Account Tier with Net Terms and PO Billing

Before anything else, I need to be able to pay on terms. Create a B2B account type with:
- Credit application and approval workflow
- Net 30/60/90 payment term selection at checkout
- PO number entry and PO-based billing
- Invoice generation and accounts receivable management

Without this, no distributor with annual volume over $100K can use this platform. It's a dealbreaker that eliminates your entire B2B market.

### 2. Add Volume/Tiered Pricing and a Request for Quote System

Replace the flat 5% discount with a tiered pricing engine:
- Display quantity breaks on product pages (e.g., 1-99: $72.99, 100-499: $65.69, 500+: $58.39)
- Allow customer-specific negotiated pricing attached to accounts
- Build an RFQ flow: I submit my quantities, your sales team responds with pricing, I approve or counter

I want to submit "5,000 SmartFeeders at $80/unit, delivered to Atlanta, Net 60" and have a human respond within 24 hours. The website should facilitate that conversation, not replace it.

### 3. Build Proper Freight/Logistics with Multi-Address and Delivery Scheduling

The $10 flat shipping has to go. Implement:
- Freight quoting based on order weight, dimensions, and destination
- LTL vs. FTL shipping selection
- Multiple shipping addresses per account (my 2 warehouses)
- Split shipment across locations
- Delivery window scheduling (4-hour windows)
- Carrier preference selection

I ship to 2 warehouses. Every order needs to be split. If the platform can't split a shipment, my operations team has to manually coordinate outside the system, and at that point, why am I using the platform at all?

---

## The One Ask

If I could only get one thing: **Net payment terms with PO billing.** Everything else — the pricing, the logistics, the account management — I can work around with phone calls and spreadsheets if I have to. But if I can't pay on terms, there is no $500K annual relationship. There's no first order. A supplier who requires a credit card for a $40,000 purchase is not a supplier I can work with.

I'll check back when there's a B2B checkout option. Right now, this is a consumer storefront with consumer features. Chairman and I will be evaluating other suppliers in the meantime.

---

*— James Okonkwo, Okonkwo Distribution Co., Atlanta, GA*
