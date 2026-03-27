# OctoCAT Supply — Full System Specification

> **Purpose:** This document is the single-source-of-truth specification for recreating the OctoCAT Supply application from scratch. It captures every model, route, component, behavior, styling decision, deployment target, and known backlog item from the current codebase and GitHub issue tracker.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Data Model & Entity Relationships](#4-data-model--entity-relationships)
5. [API Specification](#5-api-specification)
6. [Seed Data](#6-seed-data)
7. [Frontend Specification](#7-frontend-specification)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Theming & Design System](#9-theming--design-system)
10. [Testing](#10-testing)
11. [Build & Development](#11-build--development)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)
13. [Known Issues & Quality Gaps](#13-known-issues--quality-gaps)
14. [GitHub Issue Backlog (Prioritized)](#14-github-issue-backlog-prioritized)
15. [Appendix: File Inventory](#15-appendix-file-inventory)

---

## 1. Product Overview

**OctoCAT Supply** is a B2B supply chain management demo application themed around AI-powered smart cat technology products. It serves as a demonstration platform for GitHub Copilot capabilities.

### What It Does
- Displays a product catalog of 13 smart cat tech products from 3 suppliers
- Allows users to browse, search (basic text filter), and view product details
- Provides a shopping cart with localStorage persistence, coupon codes, and checkout summary
- Supports a simple checkout flow with order review and "Place Order" (simulated — creates alert, clears cart)
- Admin interface for managing products (CRUD) — accessible to users with `@github.com` email
- Full REST API with Swagger documentation for 8 entities
- Dark mode / light mode toggle with localStorage persistence
- Promotional popup on product page for "GitHub Copilot Chef's Hat" (event-specific promo)
- A "Catapult Supply" landing/launch page with brand A/B testing, testimonials, and waitlist signup
- Responsive design (partial — mobile nav is broken per issue backlog)

### What It Does NOT Do (Gaps)
- **No real authentication** — login accepts any email+password combo; admin is determined client-side by email domain
- **No real payment processing** — checkout is simulated
- **No persistent database** — all data is in-memory and resets on server restart
- **No order history** — orders created via API have no frontend view
- **No user accounts/profiles** — no registration, no user model
- **No real email/notifications** — no transactional emails
- **Mobile navigation is broken** — no hamburger menu, links overflow

---

## 2. Architecture

### High-Level Architecture

```
┌────────────────────────────────────────────────────┐
│                    Frontend (React SPA)             │
│  React 18 • Vite • Tailwind CSS • React Query v3   │
│  React Router DOM 7 • Context API (Auth/Theme/Cart)│
│  Port: 5137 (dev)                                   │
└──────────────────────┬─────────────────────────────┘
                       │ HTTP REST (JSON)
                       │ CORS-enabled
┌──────────────────────▼─────────────────────────────┐
│                    API (Express REST)                │
│  Express 4 • TypeScript • Swagger/OpenAPI           │
│  In-memory data store • Port: 3000 (dev)            │
└────────────────────────────────────────────────────┘
```

### Monorepo Structure

```
root/
├── package.json          # npm workspaces: ["api", "frontend"]
├── api/                  # Express REST API workspace
│   ├── src/
│   │   ├── index.ts      # App entry, middleware, route registration
│   │   ├── seedData.ts   # All in-memory data
│   │   ├── models/       # TypeScript interfaces + Swagger schemas
│   │   └── routes/       # Express routers + test files
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # React SPA workspace
│   ├── src/
│   │   ├── App.tsx       # Root component, routing, providers
│   │   ├── main.tsx      # ReactDOM entry
│   │   ├── api/          # API config (base URL detection)
│   │   ├── components/   # All React components
│   │   └── context/      # AuthContext, CartContext, ThemeContext
│   ├── package.json
│   └── vite.config.ts
├── infra/                # Azure Bicep IaC
├── docs/                 # Documentation
└── azure.yaml            # Azure Developer CLI config
```

### Entity Relationship Diagram

```
Headquarters ||--o{ Branch: has
Branch ||--o{ Order: placed_at
Order ||--o{ OrderDetail: contains
OrderDetail ||--o{ OrderDetailDelivery: fulfilled_by
OrderDetail }|--|| Product: references
Delivery ||--o{ OrderDetailDelivery: includes
Supplier ||--o{ Delivery: provides
Supplier ||--o{ Product: supplies (implied by supplierId)
```

### Production Hosting Model

In production, the frontend is built and copied into `api/dist/public/`. The Express server serves both the API and the static frontend from a single process. The API catches `*` routes that don't match `/api` or `/api-docs` and serves `index.html` for client-side routing.

---

## 3. Technology Stack

### API

| Technology | Version | Purpose |
|---|---|---|
| Node.js | >=18 | Runtime |
| TypeScript | ~5.7 | Language (strict mode) |
| Express | 4.21 | HTTP framework |
| cors | 2.8.5 | CORS middleware |
| swagger-jsdoc | 6.2.8 | Generate OpenAPI spec from JSDoc |
| swagger-ui-express | 5.0.1 | Serve Swagger UI at `/api-docs` |
| tsx | 4.19.2 | Dev-time TypeScript execution (hot reload) |
| Vitest | 3.0.5 | Test runner |
| Supertest | 7.0.0 | HTTP assertion library for API tests |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI library |
| React DOM | 18.3.1 | DOM renderer |
| React Router DOM | 7.4.1 | Client-side routing |
| react-query | 3.39.3 | Server state management (v3, NOT TanStack Query v5) |
| axios | 1.8.4 | HTTP client |
| react-slick | 0.30.3 | Carousel/slider component |
| slick-carousel | 1.8.1 | Slick CSS |
| Vite | 6.2.0 | Build tool and dev server |
| Tailwind CSS | 3.3.0 | Utility-first CSS |
| TypeScript | ~5.7 | Language (strict mode) |
| ESLint | 9.21.0 | Linting (flat config) |
| PostCSS | 8.4.31 | CSS processing |
| Autoprefixer | 10.4.14 | CSS vendor prefixing |

### Infrastructure

| Technology | Purpose |
|---|---|
| Azure App Service (F1 Free tier, Linux) | Production hosting |
| Azure Bicep | Infrastructure as Code |
| Azure Developer CLI (azd) | Deployment orchestration |
| Azure Application Insights | Monitoring/telemetry |
| Azure Log Analytics | Log aggregation |

### Dev Tooling

| Tool | Purpose |
|---|---|
| npm workspaces | Monorepo management |
| concurrently | Run API + frontend in parallel |
| @vitejs/plugin-react | React Fast Refresh in Vite |

---

## 4. Data Model & Entity Relationships

### 4.1 Supplier

```typescript
interface Supplier {
    supplierId: number;    // Primary key
    name: string;          // Required. Supplier name
    description: string;   // Additional details
    contactPerson: string; // Primary contact name
    email: string;         // Contact email
    phone: string;         // Contact phone number
}
```

### 4.2 Product

```typescript
interface Product {
    productId: number;     // Primary key
    supplierId: number;    // Foreign key → Supplier.supplierId
    name: string;          // Required. Product name
    description: string;   // Detailed description
    price: number;         // Required. Unit price (USD)
    sku: string;           // Stock keeping unit code
    unit: string;          // Unit of measure (e.g., "piece")
    imgName: string;       // Filename of product image in public/
    discount?: number;     // Optional. Decimal (0.25 = 25% off)
}
```

### 4.3 Headquarters

```typescript
interface Headquarters {
    headquartersId: number; // Primary key
    name: string;           // Required. HQ name
    description: string;    // Additional details
    address: string;        // Physical address
    contactPerson: string;  // Primary contact name
    email: string;          // Contact email
    phone: string;          // Contact phone
}
```

### 4.4 Branch

```typescript
interface Branch {
    branchId: number;       // Primary key
    headquartersId: number; // Foreign key → Headquarters.headquartersId
    name: string;           // Required. Branch name
    description: string;    // Additional details
    address: string;        // Physical address
    contactPerson: string;  // Primary contact name
    email: string;          // Contact email
    phone: string;          // Contact phone
}
```

### 4.5 Order

```typescript
interface Order {
    orderId: number;       // Primary key
    branchId: number;      // Foreign key → Branch.branchId
    orderDate: string;     // ISO 8601 datetime string
    name: string;          // Order name/title
    description: string;   // Order description
    status: string;        // "pending" | "processing" | "shipped" | "delivered" | "cancelled"
}
```

### 4.6 OrderDetail

```typescript
interface OrderDetail {
    orderDetailId: number; // Primary key
    orderId: number;       // Foreign key → Order.orderId
    productId: number;     // Foreign key → Product.productId
    quantity: number;      // Quantity ordered
    unitPrice: number;     // Price per unit at time of order
    notes: string;         // Additional notes
}
```

### 4.7 Delivery

```typescript
interface Delivery {
    deliveryId: number;    // Primary key
    supplierId: number;    // Foreign key → Supplier.supplierId
    deliveryDate: string;  // ISO 8601 datetime string
    name: string;          // Delivery name/title
    description: string;   // Delivery description
    status: string;        // "pending" | "in-transit" | "delivered" | "failed"
}
```

### 4.8 OrderDetailDelivery

```typescript
interface OrderDetailDelivery {
    orderDetailDeliveryId: number; // Primary key
    orderDetailId: number;         // Foreign key → OrderDetail.orderDetailId
    deliveryId: number;            // Foreign key → Delivery.deliveryId
    quantity: number;              // Quantity in this delivery
    notes: string;                 // Additional notes
}
```

> **Note:** The Swagger schema definitions in JSDoc sometimes differ slightly from the TypeScript interfaces (e.g., Swagger Order has `totalAmount` but interface has `name`/`description`; Swagger Delivery has `orderId` but interface has `supplierId`). The TypeScript interfaces and seed data are the source of truth for the running application.

---

## 5. API Specification

### 5.1 Server Configuration

- **Port:** `process.env.PORT || 3000`
- **CORS Origins:** `process.env.API_CORS_ORIGINS` (comma-separated) or defaults: `http://localhost:5137`, `http://localhost:3001`, and regex `^https://.*\.app\.github\.dev$`
- **CORS Methods:** GET, POST, PUT, DELETE, OPTIONS
- **CORS Headers:** Content-Type, Authorization
- **CORS Credentials:** true
- **JSON body parsing:** enabled via `express.json()`

### 5.2 Swagger/OpenAPI

- **Swagger UI:** `GET /api-docs` — interactive documentation
- **Swagger JSON:** `GET /api-docs.json` — raw OpenAPI 3.0 spec
- **Spec Sources:** JSDoc annotations in `./src/models/*.ts` and `./src/routes/*.ts`
- **API Version:** 1.0.0
- **Title:** "Express API with Swagger"

### 5.3 Route Endpoints

All routes follow the same CRUD pattern. Each route file:
1. Imports the model interface and seed data
2. Creates a mutable copy of seed data: `let entities = [...seedEntities]`
3. Exports a `resetEntities()` function for test isolation
4. Implements 5 operations

**Pattern (using Branch as canonical example):**

| Method | Path | Description | Success | Error |
|---|---|---|---|---|
| GET | `/api/{entity}` | List all records | 200 + JSON array | — |
| GET | `/api/{entity}/:id` | Get by ID | 200 + JSON object | 404 "not found" |
| POST | `/api/{entity}` | Create new record | 201 + JSON object | — |
| PUT | `/api/{entity}/:id` | Update by ID (full replace) | 200 + JSON object | 404 "not found" |
| DELETE | `/api/{entity}/:id` | Delete by ID | 204 (no content) | 404 "not found" |

**All 8 Registered Routes:**

| Mount Path | Router File | Entity | ID Field | ID Parse |
|---|---|---|---|---|
| `/api/branches` | `routes/branch.ts` | Branch | `branchId` | `parseInt(req.params.id)` |
| `/api/headquarters` | `routes/headquarters.ts` | Headquarters | `headquartersId` | `parseInt(req.params.id)` |
| `/api/suppliers` | `routes/supplier.ts` | Supplier | `supplierId` | `parseInt(req.params.id)` |
| `/api/products` | `routes/product.ts` | Product | `productId` | `parseInt(req.params.id)` |
| `/api/orders` | `routes/order.ts` | Order | `orderId` | `parseInt(req.params.id)` |
| `/api/order-details` | `routes/orderDetail.ts` | OrderDetail | `orderDetailId` | `parseInt(req.params.id)` |
| `/api/deliveries` | `routes/delivery.ts` | Delivery | `deliveryId` | `parseInt(req.params.id)` |
| `/api/order-detail-deliveries` | `routes/orderDetailDelivery.ts` | OrderDetailDelivery | `orderDetailDeliveryId` | `parseInt(req.params.id)` |

### 5.4 Static File Serving (Production)

When `api/dist/public/` exists:
- Serves static files from that directory
- All non-API, non-Swagger routes serve `public/index.html` (SPA fallback)

### 5.5 Root Route

- `GET /` returns plain text: `"Hello, world!"`

---

## 6. Seed Data

All seed data is defined in `api/src/seedData.ts` and loaded into mutable in-memory arrays at import time. Data resets on server restart.

### 6.1 Suppliers (3 records)

| supplierId | name | contactPerson | email |
|---|---|---|---|
| 1 | PurrTech Innovations | Felix Whiskerton | felix@purrtech.co |
| 2 | WhiskerWare Systems | Tabitha Pawson | tabitha@whiskerware.com |
| 3 | CatNip Creations | Nina Nibbles | nina@catnip.com |

### 6.2 Products (13 records)

| productId | supplierId | name | price | sku | discount |
|---|---|---|---|---|---|
| 13 | 1 | GitHub Copilot Chef's Hat | $72.99 | GHCP-HAT-001 | — |
| 1 | 3 | SmartFeeder One | $129.99 | CAT-FEED-001 | 25% |
| 2 | 3 | AutoClean Litter Dome | $199.99 | CAT-LITTER-001 | 25% |
| 3 | 2 | CatFlix Entertainment Portal | $89.99 | CAT-FLIX-001 | — |
| 4 | 2 | PawTrack Smart Collar | $79.99 | CAT-COLLAR-001 | — |
| 5 | 1 | SleepNest ThermoPod | $149.99 | CAT-BED-001 | — |
| 6 | 1 | ClawMate Auto Groomer | $119.99 | CAT-GROOM-001 | — |
| 7 | 3 | Smart Fountain Flow+ | $69.99 | CAT-FOUNTAIN-001 | 25% |
| 8 | 2 | ScratchPad Pro | $59.99 | CAT-SCRATCH-001 | — |
| 9 | 2 | ChirpCam Window Mount | $99.99 | CAT-CAM-001 | — |
| 10 | 3 | SnackVault Puzzle Dispenser | $49.99 | CAT-SNACK-001 | 25% |
| 11 | 1 | DoorDash Pet Portal | $159.99 | CAT-DOOR-001 | — |
| 12 | 2 | ZoomieTracker AI Mat | $79.99 | CAT-TRACKER-001 | — |

All products have `unit: "piece"` and a corresponding `imgName` (e.g., `"feeder.png"`, `"litter-box.png"`, `"GHCP_ChefsHat.png"`).

### 6.3 Headquarters (1 record)

| headquartersId | name | contactPerson | address |
|---|---|---|---|
| 1 | CatTech Global HQ | Catherine Purrston | 123 Whisker Lane, Purrington District |

### 6.4 Branches (2 records)

| branchId | headquartersId | name | contactPerson |
|---|---|---|---|
| 1 | 1 | Meowtown Branch | Chloe Whiskers |
| 2 | 1 | Tabby Terrace Branch | Tom Pouncer |

### 6.5 Orders (2 records)

| orderId | branchId | name | status |
|---|---|---|---|
| 1 | 1 | Q2 Feline Tech Refresh | pending |
| 2 | 2 | Cat Enrichment Bundle | processing |

Both orders have `orderDate` set to `new Date().toISOString()` at startup time.

### 6.6 OrderDetails (3 records)

| orderDetailId | orderId | productId | quantity | unitPrice |
|---|---|---|---|---|
| 1 | 1 | 2 (AutoClean Litter Dome) | 5 | $199.99 |
| 2 | 1 | 3 (CatFlix) | 5 | $89.99 |
| 3 | 2 | 4 (PawTrack Collar) | 20 | $79.99 |

### 6.7 Deliveries (2 records)

| deliveryId | supplierId | name | status | deliveryDate |
|---|---|---|---|---|
| 1 | 1 | PurrTech Smart Home Bundle | pending | +7 days from startup |
| 2 | 2 | WhiskerWare Entertainment Package | in-transit | +2 days from startup |

### 6.8 OrderDetailDeliveries (3 records)

| orderDetailDeliveryId | orderDetailId | deliveryId | quantity |
|---|---|---|---|
| 1 | 1 | 1 | 5 |
| 2 | 2 | 1 | 5 |
| 3 | 3 | 2 | 20 |

---

## 7. Frontend Specification

### 7.1 Application Shell

**Entry point:** `main.tsx` renders `<App />` into `#root`.

**Provider hierarchy (outermost → innermost):**
1. `AuthProvider` — authentication state
2. `ThemeProvider` — dark/light mode
3. `CartProvider` — shopping cart state
4. `Router` (BrowserRouter)

**Layout structure:**
```
<div className="flex flex-col min-h-screen">
  <Navigation />        {/* Fixed, top, z-50, backdrop-blur */}
  <main className="flex-grow">
    <Routes>...</Routes>
  </main>
  <Footer />
</div>
```

### 7.2 Routes

| Path | Component | Auth Required | Admin Required |
|---|---|---|---|
| `/` | `Welcome` | No | No |
| `/products` | `Products` | No | No |
| `/about` | `About` | No | No |
| `/cart` | `Cart` | No | No |
| `/checkout` | `Checkout` | No | No |
| `/login` | `Login` | No | No |
| `/admin/products` | `AdminProducts` | Yes | Yes (redirects if not admin) |
| `/launch` | `LandingPage` | No | No |

**Missing:** No 404 catch-all route. Invalid paths render blank.

### 7.3 Component Specifications

#### 7.3.1 Navigation (`Navigation.tsx`)

- Fixed position, top of page, z-50, backdrop-blur
- **Left:** Logo (`/copilot.png`) + "OctoCAT Supply" text + "Smart Cat Tech, Powered by AI" tagline
- **Center links:** Home, Products, About us
- **Admin dropdown:** Visible only when `isAdmin === true`. Contains "Manage Products" link. Toggled by click with chevron rotation animation.
- **Right side:**
  - Cart icon (SVG shopping cart) with badge showing `totalItems` count (green circle)
  - Theme toggle button (sun icon for dark mode, moon icon for light mode)
  - Login/Logout state: shows "Login" button when logged out, shows "(Admin) Welcome!" + "Logout" button when logged in
- **Responsive:** Desktop only. No hamburger menu. Links overflow on mobile (known bug).

#### 7.3.2 Welcome / Home Page (`Welcome.tsx`)

- **Hero Section:** Full-width image (`/hero.png`) with overlay text panel on the right. Panel has backdrop-blur, green glow shadow, "Powered by Advanced AI" badge, headline "Smart Cat Tech. Purrsonalized.", description text, and "Explore Products" button.
- **Partner Logos:** "Trusted By Cat Lovers Everywhere" section with react-slick carousel showing 6 SVG logos: Whiskers Cafe, PawTech Solutions, Feline Innovations, CatHealth AI, PurrTech Innovations, WhiskerWare Systems. Carousel auto-plays every 3 seconds, shows 6/4/3/2 slides at different breakpoints.
- **Product Categories:** "Smart Solutions for Modern Cats" section with 3 category cards (implied categories, uses SVG icons).

#### 7.3.3 Products Page (`Products.tsx`)

- **Search bar:** Text input with search icon. Filters products by name or description using `toLowerCase().includes()`.
- **Promo popup:** Shows on initial load. Promotes "GitHub Copilot Chef's Hat" with "30% OFF", "For Microsoft Tech Connect Attendees Only", promo code "TechConnect". Dismissible with "OK" button.
- **Product grid:** 1/2/3/4 columns responsive grid. Each product card:
  - Product image (clickable → opens modal) with gradient background
  - Discount badge rotated left (-90deg) showing "X% OFF" for discounted products
  - Product name, description, price (with strikethrough + discounted price if applicable)
  - Quantity stepper: minus button, count display, plus button
  - "Add to Cart" button: disabled (gray) when quantity is 0, green when quantity > 0
  - Hover effect: scale 1.05 + green glow shadow
- **Product modal:** Appears when clicking product image. Shows large product image, name, description. Closeable by X button or clicking overlay.
- **Data fetching:** `useQuery('products', fetchProducts)` from react-query v3. Fetches from `GET {baseURL}/api/products`.
- **Loading state:** Spinning green circle
- **Error state:** Red text "Failed to fetch products"

#### 7.3.4 Cart Page (`Cart.tsx`)

- **Empty cart:** Shows cart SVG icon, "Your cart is empty" message, "Browse Products" link.
- **Cart table:** Full table with columns: S. No., Product Image, Product Name, Unit Price, Quantity (editable number input), Total, Remove (trash icon button).
- **Coupon section:** Text input + "Apply Coupon" button. Valid code: `"techconnect"` (case-insensitive) → applies 10% coupon discount. Invalid shows "Invalid coupon code" error.
- **"Update Cart" button:** Present but has no click handler (visual only).
- **Order Summary sidebar (right, 1/4 width on desktop):**
  - Subtotal: sum of (price × quantity)
  - Discount (5%): always applied, `subtotal * 0.05`
  - Coupon (10%): shown only if coupon applied, `subtotal * 0.10`
  - Shipping: flat $10 when items exist
  - Grand Total: `subtotal - discount - couponDiscount + shipping`
  - "Proceed To Checkout" gradient button → navigates to `/checkout`

#### 7.3.5 Checkout Page (`Checkout.tsx`)

- **Empty state:** "No items to checkout" with "Browse Products" link.
- **Order Review:** Lists each cart item with image, name, qty × price, and line total.
- **Summary:** Subtotal, Discount (5%), Shipping ($10), Total. **Note:** Checkout does NOT carry over the coupon discount from Cart.
- **Buttons:** "Back to Cart" (outlined) and "Place Order" (gradient).
- **Place Order behavior:** Calls `clearCart()` and shows `alert('Order placed successfully!')`. **Does NOT call any API endpoint.** No order is created server-side.

#### 7.3.6 Admin Products (`AdminProducts.tsx`)

- **Access control:** Uses `useAuth()` — if `!isAdmin`, renders `<Navigate to="/" replace />`.
- **Data fetching:** Fetches products via `axios.get` on mount, then fetches each product's supplier individually (N+1 query pattern — known issue).
- **Table:** Sortable columns: Name, Supplier, Price, SKU, Unit, Discount, Description, Actions (Edit/Delete).
- **Sort:** Click column header to sort. Toggle asc/desc. Shows ↕/↑/↓ icons.
- **Add New Product:** Opens `ProductForm` modal in create mode.
- **Edit:** Opens `ProductForm` modal with existing product data.
- **Delete:** `window.confirm()` → `DELETE /api/products/:id` → refetch.

#### 7.3.7 Product Form (`ProductForm.tsx`)

- **Modal overlay** with form fields: Name, Description, Price, SKU, Unit, Image Name, Supplier (dropdown from suppliers list), Discount (%).
- **Discount input:** Accepts percentage (e.g., 25), converts to decimal for API (0.25). "Leave empty for no discount."
- **Submit:** Creates (`POST /api/products`) or updates (`PUT /api/products/:id`).
- **Cancel:** Closes modal without saving.

#### 7.3.8 About Page (`About.tsx`)

- Static content page. "About OctoCAT Supply" heading.
- Sections: "Our Meow-ssion", "Our Purr-pose", "Key Features of Our Products" (bullet list).
- Founder quote: "Our cats tested every product in our catalog extensively..." — Felix Whiskerton, Founder.

#### 7.3.9 Login Page (`Login.tsx`)

- Simple form: email input, password input, "Login" button.
- Reads `error` query param from URL and displays it (using `dangerouslySetInnerHTML` — **XSS vulnerability per issue backlog**).
- On submit: calls `login(email, password)` from AuthContext → navigates to `/`.
- **Login logic:** Any non-empty email + password succeeds. Admin access if email ends with `@github.com`.

#### 7.3.10 Footer (`Footer.tsx`)

- 4-column grid: About (description text), Account (links), Helpful Links (links), Social Media (links).
- **All links point to `#`** — they are non-functional placeholders.
- Copyright: "Copyright © 2025 OctoCAT Supply. All Rights Reserved" (**year is outdated**).

#### 7.3.11 Landing Page (`LandingPage.tsx`)

- Dark-themed (`bg-[#0A0A0A]`) standalone page at `/launch`.
- **Hero:** "CATAPULT SUPPLY" headline, "Now in Private Beta" badge, animated glow orbs, stats bar (13+ products, 3 suppliers, 99.9% SLA, 50K+ cats).
- **Brand A/B Test:** 6 potential brand names with voting. Single vote per session (in-memory state only).
- **Features section:** 4 feature cards with tab-like navigation (AI Product Discovery, Enterprise Procurement, Real-Time Health Telemetry, Multi-Branch Logistics).
- **Product Showcase:** 6 product cards with hover effects.
- **Testimonials:** 4 testimonial cards with avatars (emoji).
- **Customer Segments:** 6 segment cards (Veterinary, Multi-Cat, Enterprise, Premium, Creators, Eco-Conscious).
- **Waitlist signup:** Email input form (client-side only, no API call).
- **All state is client-side only** — no server persistence for votes, waitlist, etc.

### 7.4 Context Providers

#### 7.4.1 AuthContext

```typescript
interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
```

- `login()`: Sets `isLoggedIn = true`. Sets `isAdmin = true` if email ends with `@github.com`.
- `logout()`: Resets both to `false`.
- **No persistence** — auth state resets on page refresh.
- **No real validation** — any email+password combo works.

#### 7.4.2 CartContext

```typescript
interface CartItem {
    productId: number;
    name: string;
    price: number;
    imgName: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
}
```

- **Persistence:** `localStorage` key `"octocat-cart"`. Loads on mount, saves on every change via `useEffect`.
- `addToCart()`: If product exists in cart, increments quantity. Otherwise, adds new item.
- `updateQuantity()`: If quantity ≤ 0, removes item.
- `totalItems`: Sum of all item quantities.

#### 7.4.3 ThemeContext

```typescript
interface ThemeContextType {
    darkMode: boolean;
    toggleTheme: () => void;
}
```

- **Persistence:** `localStorage` key `"theme"`. Values: `"dark"` or `"light"`.
- **Default:** Light mode.
- **DOM effect:** Adds/removes `dark`/`light` class on `document.documentElement`.
- Uses Tailwind `darkMode: 'class'` strategy.

### 7.5 API Configuration (`api/config.ts`)

Runtime base URL detection priority:
1. `window.RUNTIME_CONFIG?.API_URL` — injected at runtime
2. `process.env.CODESPACE_NAME` — GitHub Codespaces URL pattern
3. Same-origin (non-localhost production)
4. Default: `http://localhost:3000`

**Endpoints:**
```typescript
{
    products: '/api/products',
    suppliers: '/api/suppliers',
    orders: '/api/orders',
    branches: '/api/branches',
    headquarters: '/api/headquarters',
    deliveries: '/api/deliveries',
    orderDetails: '/api/order-details',
    orderDetailDeliveries: '/api/order-detail-deliveries'
}
```

---

## 8. Authentication & Authorization

### Current Implementation (Minimal/Demo)

- **No server-side authentication** — API endpoints are completely open. No JWT, no sessions, no API keys.
- **Client-side only auth:** `AuthContext` stores `isLoggedIn` and `isAdmin` in React state.
- **Admin determination:** Email ending in `@github.com` grants admin access.
- **No user model** — no registration, no user database.
- **No auth persistence** — refreshing the page logs the user out.
- **Admin route protection:** `AdminProducts.tsx` checks `isAdmin` and redirects non-admins to `/`.

### Security Notes (from Issue Backlog)

The GitHub issue backlog (Epic #55) identifies critical security gaps:
- XSS vulnerability in `Login.tsx` via `dangerouslySetInnerHTML` on the `error` query param
- No API authentication middleware
- No input validation on API routes
- A previously identified RCE command injection vulnerability in the delivery route (may or may not still exist — flagged for audit)

---

## 9. Theming & Design System

### Color Palette

| Name | Hex | Usage |
|---|---|---|
| Primary | `#76B852` | Buttons, links, badges, accents, CTAs |
| Accent | `#8BC34A` | Hover states for primary buttons |
| Dark | `#0A0A0A` | Dark mode background |
| Light | `#F5F5F5` | Light text on dark backgrounds |
| Gray scale | `#f5f5f5` to `#171717` | UI surfaces, text, borders |

### Dark Mode

- Tailwind `darkMode: 'class'` strategy
- Toggle via `useTheme()` hook
- Every component manually applies conditional classes: `${darkMode ? 'bg-dark' : 'bg-gray-100'}`
- Dark mode is NOT implemented via Tailwind's `dark:` prefix — it uses runtime boolean checks

### Typography

- Default system font stack (via Tailwind defaults)
- Landing page uses `font-['Inter']`
- No custom fonts loaded

### Spacing & Layout

- Max width containers: `max-w-7xl` (main content), `max-w-6xl` (landing), `max-w-4xl` (about), `max-w-3xl` (checkout), `max-w-md` (login/forms)
- Padding top: `pt-20` on content pages (to account for fixed nav height of `h-16`)
- Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` for product cards

### Animations

- `transition-colors duration-300` on most interactive elements
- `transform transition-all duration-300 hover:scale-105` on product cards
- `hover:shadow-[0_0_25px_rgba(118,184,82,0.3)]` green glow on hover
- `animate-spin` for loading spinner
- `animate-pulse` for glow orbs on landing page

### Responsive Breakpoints (Tailwind defaults)

| Prefix | Min Width |
|---|---|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

---

## 10. Testing

### Test Framework

- **Runner:** Vitest 3.0.5
- **API Tests:** Supertest 7.0.0 for HTTP request simulation
- **Test location:** Co-located with route files (`api/src/routes/*.test.ts`)
- **Vitest config:** `api/vitest.config.ts`

### Test Pattern (Canonical: `branch.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import branchRouter, { resetBranches } from './branch';
import { branches as seedBranches } from '../seedData';

let app: express.Express;

describe('Branch API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/branches', branchRouter);
        resetBranches();  // Reset to seed data before each test
    });

    it('should create a new branch', async () => { /* POST test */ });
    it('should get all branches', async () => { /* GET all test */ });
    it('should get a branch by ID', async () => { /* GET by ID test */ });
    it('should update a branch by ID', async () => { /* PUT test */ });
    it('should delete a branch by ID', async () => { /* DELETE test */ });
    it('should return 404 for non-existing branch', async () => { /* 404 test */ });
});
```

### Key Testing Conventions

- Each test file creates its own Express app instance in `beforeEach`
- Seed data is reset before each test via exported `reset*()` functions
- Tests assert status codes: `expect(response.status).toBe(201)`
- Tests assert response bodies: `expect(response.body).toMatchObject(expected)`
- No frontend tests exist currently (testing libraries are installed but unused)

### Test Commands

```bash
npm run test          # All workspaces
npm run test:api      # API only
```

---

## 11. Build & Development

### Prerequisites

- Node.js >= 18
- npm (ships with Node)

### Commands

| Command | Description |
|---|---|
| `npm install` | Install all workspace dependencies from root |
| `npm run dev` | Run API + Frontend concurrently |
| `npm run dev:api` | API only with tsx hot reload (port 3000) |
| `npm run dev:frontend` | Vite dev server only (port 5137) |
| `npm run build` | Build all workspaces (tsc for API, tsc+vite for frontend) |
| `npm run test` | Run all tests (Vitest) |
| `npm run test:api` | API tests only |
| `npm run lint` | Lint frontend (ESLint flat config) |

### Build Outputs

- **API:** `api/dist/` — compiled JavaScript
- **Frontend:** `frontend/dist/` — static HTML/CSS/JS bundle

### TypeScript Configuration

Both workspaces use `strict: true` in their tsconfig.

---

## 12. Deployment & Infrastructure

### Azure Developer CLI (azd)

Configuration in `azure.yaml`:

```yaml
name: octocat-supply
services:
  api:
    project: ./api
    language: js
    host: appservice
```

**Pre-package hook:**
1. `npm install` from root
2. Build frontend (`npm run build --workspace=frontend`)
3. Build API (`npm run build --workspace=api`)
4. Copy `frontend/dist/*` → `api/dist/public/` for co-hosting

### Azure Resources (Bicep)

| Resource | SKU | Purpose |
|---|---|---|
| App Service Plan | F1 (Free) | Linux hosting |
| App Service | Node 20 LTS | Runs `node dist/index.js` |
| Application Insights | web | Monitoring/telemetry |
| Log Analytics Workspace | PerGB2018 | Log storage (30-day retention) |
| User-Assigned Managed Identity | — | Azure identity |

**App Settings:**
- `PORT=8080`
- `APPLICATIONINSIGHTS_CONNECTION_STRING` — auto-wired
- `SCM_DO_BUILD_DURING_DEPLOYMENT=true`

### Production URL Pattern

`https://azapp{uniqueToken}.azurewebsites.net`

---

## 13. Known Issues & Quality Gaps

Compiled from direct code analysis and the GitHub issue backlog:

| # | Issue | Severity | Location |
|---|---|---|---|
| 1 | **XSS vulnerability** — Login.tsx uses `dangerouslySetInnerHTML` for error URL param | Critical | `Login.tsx` line ~46 |
| 2 | **No API authentication** — all endpoints are fully open | Critical | `api/src/index.ts` |
| 3 | **No input validation** — API accepts any body shape without validation | High | All route files |
| 4 | **Checkout doesn't create orders** — "Place Order" only clears cart + shows alert | High | `Checkout.tsx` |
| 5 | **No mobile navigation** — links overflow, no hamburger menu | High | `Navigation.tsx` |
| 6 | **No 404 page** — invalid routes show blank | Medium | `App.tsx` |
| 7 | **Footer links all `#`** — non-functional placeholder links | Medium | `Footer.tsx` |
| 8 | **Copyright year 2025** — should be 2026 or dynamic | Low | `Footer.tsx` |
| 9 | **N+1 query in AdminProducts** — fetches supplier per product | Medium | `AdminProducts.tsx` |
| 10 | **Dead file `useTheme.tsx`** — empty file, hook lives in ThemeContext | Low | `context/useTheme.tsx` |
| 11 | **Auth resets on refresh** — no token or session persistence | High | `AuthContext.tsx` |
| 12 | **Swagger schema mismatches** — JSDoc schemas differ from TS interfaces | Low | Models |
| 13 | **Checkout ignores coupon** — Cart coupon discount not carried to Checkout | Medium | `Checkout.tsx` |
| 14 | **"Update Cart" button does nothing** | Low | `Cart.tsx` |

---

## 14. GitHub Issue Backlog (Prioritized)

### Phased Delivery Plan (from Epic #55)

#### Phase 0: Security (Highest Priority)
- Fix RCE command injection in delivery route
- Fix XSS vulnerability in Login component
- Add API authentication middleware
- Add input validation across all routes

#### Phase 1: Revenue Enablement (RICE 8.0-10.0)

| # | Title | RICE | Labels |
|---|---|---|---|
| 57 | Complete Checkout Flow — Ship Address, Payment, Confirmation | 10.0 | critical |
| 54 | Cart Persistence — Survive Refresh & Browser Close | 8.0 | critical (NOTE: Already implemented via localStorage) |
| 60 | Guest Checkout — Purchase Without Account Creation | 8.0 | high |
| 62 | Mobile Navigation Fix — Hamburger Menu | 5.0 | high, bug |

#### Phase 2: Product Discovery (RICE 4.0-9.0)

| # | Title | RICE | Labels |
|---|---|---|---|
| 56 | Product Search with Autocomplete + Category Filtering | 9.0 | high |
| 36/30 | Product Categories & Faceted Filtering | 9.0 | enhancement |
| 61 | Order History & Tracking | 7.0 | high |
| 50 | Frontend Error Handling — Error Boundaries, Toasts | 6.0 | enhancement |
| 47 | Enhanced Product Search — Autocomplete, Recent Searches | 5.4 | enhancement |
| 43 | Favorites & Wishlist — Save Products for Later | 5.0 | enhancement |
| 37/29 | Quality Fixes — 404, Footer, Dead Code, N+1, Copyright | 5.0 | bug |

#### Phase 3: Retention (RICE 3.0-7.2)

| # | Title | RICE | Labels |
|---|---|---|---|
| 45 | Quick Reorder — One-Click Repeat Purchasing | 7.2 | enhancement |
| 59 | Abandoned Cart Recovery — Email Reminders | 7.0 | feature |
| 58 | B2B Payment Terms — PO Numbers, Net-30/60/90 | 6.5 | high |
| 64 | AI Product Recommendations | 5.8 | feature |
| 42 | Product Bundles — Grouped with Discounts | 4.5 | enhancement |
| 41 | Product Reviews & Ratings | 4.0 | enhancement |
| 40/27 | Accessibility Audit & WCAG 2.1 AA | 4.1 | enhancement |
| 49 | Supplier Collaboration Portal | 4.0 | enhancement |

#### Phase 4: Expansion (RICE 1.8-3.6)

| # | Title | RICE | Labels |
|---|---|---|---|
| 48 | Autoship / Subscription Ordering | 3.6 | enhancement |
| 38/26 | Audit Logging — Track All Mutations | 3.6 | enhancement |
| 39/28 | Admin UI for All Entities | 3.0 | enhancement |
| 46 | Paw Points Loyalty Program | 3.0 | enhancement |
| 63 | Supplier Scorecard Dashboard | 2.8 | feature |
| 65 | Volume & Bulk Pricing — Tiered Discounts | 2.6 | feature |
| 66 | Approval Workflows — Order Threshold Approvals | 1.9 | feature |
| 67 | Email Marketing Integration | 1.8 | feature |

#### Noise Issues (Low-quality, vague, or invalid)

| # | Title | Assessment |
|---|---|---|
| 35 | "API returns data???" | Vague, no actionable ask |
| 34 | Footer overlap on iPad mini iOS 16.3 | Overly specific, no repro data |
| 33 | "Q2 2025 planning" | Generic tracking, no spec |
| 32 | "add AI, blockchain, IoT, crypto" | Wishlist spam, no spec |
| 31 | "URGENT login broken!!! (maybe)" | User error, self-resolved |
| 25 | "asdf test issue DO NOT DELETE" | Test data |
| 24 | "add button" | Vague, no spec |
| 23 | "database optimization and architecture overhaul" | Scope creep, no DB exists |

---

## 15. Appendix: File Inventory

### API Files

```
api/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── api-swagger.json
└── src/
    ├── index.ts                    # Express app, middleware, routes
    ├── seedData.ts                 # All in-memory seed data
    ├── models/
    │   ├── branch.ts               # Branch interface + Swagger schema
    │   ├── delivery.ts             # Delivery interface + Swagger schema
    │   ├── headquarters.ts         # Headquarters interface + Swagger schema
    │   ├── order.ts                # Order interface + Swagger schema
    │   ├── orderDetail.ts          # OrderDetail interface + Swagger schema
    │   ├── orderDetailDelivery.ts  # OrderDetailDelivery interface + Swagger schema
    │   ├── product.ts              # Product interface + Swagger schema
    │   └── supplier.ts             # Supplier interface + Swagger schema
    └── routes/
        ├── branch.ts               # Branch CRUD router
        ├── branch.test.ts          # Branch API tests
        ├── delivery.ts             # Delivery CRUD router
        ├── headquarters.ts         # Headquarters CRUD router
        ├── order.ts                # Order CRUD router
        ├── orderDetail.ts          # OrderDetail CRUD router
        ├── orderDetailDelivery.ts  # OrderDetailDelivery CRUD router
        ├── product.ts              # Product CRUD router
        └── supplier.ts             # Supplier CRUD router
```

### Frontend Files

```
frontend/
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── index.html
├── entrypoint.sh
├── nginx.conf
├── public/                         # Static assets (product images, hero.png, copilot.png)
└── src/
    ├── main.tsx                    # ReactDOM entry point
    ├── App.tsx                     # Root component, routing, providers
    ├── index.css                   # Tailwind imports
    ├── vite-env.d.ts               # Vite type declarations
    ├── api/
    │   └── config.ts               # API base URL detection + endpoint map
    ├── assets/
    │   └── react.svg
    ├── components/
    │   ├── About.tsx               # About page
    │   ├── Footer.tsx              # Footer with social/account links
    │   ├── LandingPage.tsx         # Catapult Supply launch page
    │   ├── Login.tsx               # Login form
    │   ├── Navigation.tsx          # Top nav bar
    │   ├── Welcome.tsx             # Home page with hero + carousel
    │   ├── admin/
    │   │   └── AdminProducts.tsx   # Product management table
    │   └── entity/
    │       ├── cart/
    │       │   ├── Cart.tsx        # Shopping cart page
    │       │   └── Checkout.tsx    # Checkout summary + place order
    │       └── product/
    │           ├── Products.tsx    # Product catalog grid
    │           └── ProductForm.tsx # Create/edit product modal form
    └── context/
        ├── AuthContext.tsx          # Auth state provider
        ├── CartContext.tsx          # Cart state provider (localStorage)
        ├── ThemeContext.tsx         # Theme state provider (localStorage)
        ├── themeContextUtils.tsx    # ThemeContext createContext
        └── useTheme.tsx            # Empty/dead file (hook is in ThemeContext)
```

### Infrastructure Files

```
infra/
├── main.bicep                      # Subscription-scoped entry point
├── main.json                       # ARM template (compiled)
├── main.parameters.json            # Parameter defaults
├── resources.bicep                 # All Azure resources
└── configure-deployment.sh         # Post-deploy config script
azure.yaml                          # Azure Developer CLI config
```

### Required Static Assets (in `frontend/public/`)

Product images referenced by seed data:
- `GHCP_ChefsHat.png`
- `feeder.png`
- `litter-box.png`
- `catflix.png`
- `smart-collar.png`
- `sleep-nest.png`
- `auto-groomer.png`
- `smart-fountain.png`
- `scratch-pad.png`
- `chirp-cam.png`
- `snack-vault.png`
- `door-dash.png`
- `tracker-mat.png`

Other assets:
- `hero.png` — hero image for Welcome page
- `copilot.png` — logo icon for navigation

---

## End of Specification

This document captures the full state of the OctoCAT Supply application as of March 2026. An agent or developer should be able to recreate the complete application — backend, frontend, tests, deployment infrastructure, seed data, and UI behaviors — using only this specification.
