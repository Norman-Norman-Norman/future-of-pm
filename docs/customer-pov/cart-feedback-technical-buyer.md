# Cart Evaluation — Technical Specification Buyer

**Reviewer:** Derek Thompson, Senior Manufacturing Engineer  
**Date:** March 10, 2026  
**Test URL:** http://localhost:5137/cart  
**Products Evaluated:** SmartFeeder One (×3), PawTrack Smart Collar (×2), AutoClean Litter Dome (×1)

---

## 1. Overall Rating: 2/10

I've been sourcing components and products for manufacturing lines for 27 years. This cart page is a consumer-grade shopping UI. For anyone doing technical procurement — specifying products against a BOM, cross-referencing material certifications, comparing dimensional tolerances — this site fails at the fundamentals. I can't even identify a product by its part number from the cart.

---

## 2. Product Detail in Cart

**Rating: 1/10**

The cart displays seven columns: **S. No., Product Image, Product Name, Unit Price, Quantity, Total, Remove.** That's it.

Here's what I see for "SmartFeeder One":
- **Name:** SmartFeeder One
- **Unit Price:** $130
- **Quantity:** 3
- **Total:** $390

Here's what I need to see:
- **SKU/Part Number:** CAT-FEED-001 (this exists in your API data but is not displayed — I checked the seed data and confirmed `sku: "CAT-FEED-001"` is stored server-side)
- **Unit of Measure:** "piece" (also in your API data, also not displayed)
- **Dimensions:** Not in your data model at all — length × width × height in mm or inches
- **Weight:** Not in your data model — net weight in kg or lbs
- **Material/Construction:** What is this made of? ABS plastic? Stainless steel hopper? "AI-powered feeder" is a marketing description, not a specification
- **Power Requirements:** Input voltage, wattage, connector type
- **Certifications:** UL listing, FCC compliance, CE marking, RoHS status
- **Country of Origin:** Required for customs and compliance

The cart gives me a name and a rounded price. That's not enough to issue a purchase order.

**Critical issue:** Prices are displayed as whole dollars ($130, $80, $200) rather than actual precision values ($129.99, $79.99, $199.99). For procurement, this is unacceptable — PO line items must match exact pricing. The `CartItem` interface stores `price` as a number but the display truncates with `.toFixed(0)`. This introduces rounding discrepancies on every line item.

---

## 3. SKU/Part Numbers

**Rating: 1/10**

Your product data model includes a `sku` field. Every product has one:
- SmartFeeder One → `CAT-FEED-001`
- AutoClean Litter Dome → `CAT-LITTER-001`
- PawTrack Smart Collar → `CAT-COLLAR-001`

**None of these appear anywhere in the cart.** Not in the cart table, not in the product cards on the products page, not in the product detail modal. The SKU field exists in your database, gets returned by your API, is defined in the frontend `Product` interface, and is then completely ignored in every rendered component.

When I add a product to the cart, the `CartItem` interface strips the SKU entirely — it only stores `productId`, `name`, `price`, `imgName`, and `quantity`. The SKU is lost at the point of cart insertion.

For a procurement engineer, the SKU is the product. I don't search for "SmartFeeder One" — I search for `CAT-FEED-001`. I put `CAT-FEED-001` on the PO, in the BOM, and in the inspection report. Without it, I can't cross-reference this order with any of my internal systems.

---

## 4. Technical Documentation

**Rating: 0/10**

There are no downloadable documents anywhere:
- No product spec sheets (PDF)
- No certificates of conformance
- No material test reports (MTR)
- No safety data sheets (SDS/MSDS)
- No compliance certificates (UL, CE, FCC)
- No CAD drawings or dimensional diagrams
- No installation guides or technical manuals

The product modal (when clicking a product image) shows exactly two things: a larger image and the same marketing description from the product card. No specifications, no documents, no technical data.

For context: I will not issue a purchase order for any product without a downloadable specification sheet. My quality team reviews spec sheets before approving new vendors. My regulatory compliance files require certificates of conformance. No spec sheet means no purchase — full stop.

---

## 5. Product Comparison

**Rating: 0/10**

There is no comparison capability whatsoever:
- No "compare" checkbox on product cards
- No side-by-side specification comparison view
- No feature comparison matrix
- No way to view specifications of multiple products simultaneously
- No export-to-spreadsheet for offline comparison

When I'm sourcing, I open 6-10 product tabs and build a comparison spreadsheet with: part number, material, dimensions, weight, price, compliance status, and lead time. This site provides only name and price — not enough data points for any meaningful comparison.

---

## 6. Missing Technical Features

### Data Model Gaps
The `Product` interface has: `productId`, `name`, `description`, `price`, `sku`, `unit`, `imgName`, `discount`. That's a consumer product catalog, not a technical specification database. Missing fields that any B2B procurement system requires:

- **Weight** (net and gross, in kg and lbs)
- **Dimensions** (L × W × H, tolerance range)
- **Material composition** (primary materials, finish, grade)
- **Power specifications** (voltage, amperage, wattage, frequency)
- **Operating environment** (temperature range, humidity rating, IP rating)
- **Compliance/Certifications** (UL, CE, FCC, RoHS, REACH, ASTM, ISO)
- **Country of origin**
- **Lead time / availability**
- **Minimum order quantity (MOQ)**
- **UNSPSC or HS code** for procurement classification
- **Manufacturer part number** (vs. distributor SKU)
- **Revision/version number**

### Cart-Specific Gaps
- **No line-item notes field** — I need to annotate PO lines with inspection requirements
- **No per-item delivery date** — different line items may have different required-by dates
- **No link back to product specification** from cart — once in the cart, the product is just a name
- **No quantity unit display** — it says "3" but 3 what? Pieces? Cases? Each? The `unit` field exists in your data but isn't shown
- **No cart export** (CSV/PDF) — I can't email this cart to my quality team for review
- **No save/share cart** — multi-stakeholder procurement requires sharing cart contents before ordering
- **No request-for-quote (RFQ) flow** — bulk orders need quote requests, not "Proceed to Checkout"

### Search Gaps
- Product search does not accept SKU/part numbers (searching "CAT-FEED-001" may not work)
- No technical parameter search or filtering (material, price range, dimensions)
- No advanced search operators

---

## 7. Documentation Links

**Status: None exist**

Expected documentation links per product page:
1. **Product Data Sheet** (PDF) — full technical specifications
2. **Certificate of Conformance** — quality system certification
3. **Safety Data Sheet** (if applicable) — OSHA/GHS compliant SDS
4. **Installation/Setup Guide** — for equipment products
5. **Compliance Declaration** — RoHS, REACH, CE, UL declarations
6. **Dimensional Drawing** (PDF or DXF) — for integration planning
7. **Test Reports** — third-party testing results

None of these exist in the product model, the API responses, or the frontend UI.

---

## 8. Top 3 Recommendations

### 1. Display the SKU and unit of measure everywhere — especially in the cart
The data already exists. Every product has a `sku` and `unit` field in the API. The `CartItem` interface drops them. Add `sku` and `unit` to `CartItem`, display the SKU as the primary product identifier in the cart table (above or alongside the name), and show the unit next to quantity. A procurement engineer identifies products by part number, not marketing name. This is the single highest-impact, lowest-effort improvement: the data is there, it just needs to flow through to the display.

### 2. Add a technical specifications section to each product and make it accessible from the cart
Product descriptions like "AI-powered feeder learns your cat's snack schedule" tell me nothing about the physical product. I need: materials, dimensions (with tolerances), weight, power requirements, operating temperature range, and applicable standards. Even if spec sheets aren't available yet, structured specification fields on the product model would be a massive improvement. And from the cart, each product name should link to its full specification page — once I've added a product to my cart, I still need to review its specs before issuing a PO.

### 3. Show exact pricing with full decimal precision
Displaying $130 when the actual price is $129.99 is a data integrity problem. Every line item on a purchase order must match the agreed price exactly. A $0.01 discrepancy multiplied across hundreds of line items creates reconciliation nightmares with accounts payable. Change `.toFixed(0)` to `.toFixed(2)` in the cart display. This is a one-line fix with significant business impact.

---

## My One Ask

**Give me the spec sheet.** That's it. A downloadable PDF for each product with: part number, full dimensional specifications, material composition, electrical ratings, compliance certifications, and test data. Everything else — the search, the comparison tools, the cart enhancements — those are quality-of-life improvements. But without a spec sheet, I can't bring this product into my facility. My quality team will reject it, my purchasing department won't approve the PO, and my compliance officer won't sign off. The spec sheet is the gateway to every industrial sale.

---

*Reviewed from a dual-monitor setup with BOM spreadsheet open on the left, your site on the right. Caliper is sitting on a stack of mill certs behind me, unimpressed.*
