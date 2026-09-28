# SMARTCASEBD — Application Flow & Architecture Workflows

---

## Overview

This document is the official Source of Truth for all Customer, Admin, and System workflows of **SMARTCASEBD**. Every feature, page transition, validation step, and API handling logic implemented in the application must strictly adhere to the flows outlined below.

---

## 1. CUSTOMER WORKFLOWS

### 1.1 Storefront Journey Map

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│  Home Page   │ ──► │  Shop Page   │ ──► │ Product Detail   │ ──► │  Cart Drawer   │
└──────┬───────┘     └──────┬───────┘     └────────┬─────────┘     └───────┬────────┘
       │                    │                      │                       │
       ▼                    ▼                      ▼                       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│ Brand Select │     │ Model Filter │     │ Variant Selector │     │ One-Page       │
│ & Series     │     │ & Materials  │     │ & Compatibility  │     │ Checkout       │
└──────────────┘     └──────────────┘     └──────────────────┘     └───────┬────────┘
                                                                           │
                                                                           ▼
                                                                  ┌────────────────┐
                                                                  │ Order Success  │
                                                                  │ & Tracking ID  │
                                                                  └────────────────┘
```

---

### 1.2 Customer Flow Breakdown

#### A. Home Page Flow
1. **Entry Point**: Customer visits `/`
2. **Components**:
   - Announcement Bar (Free shipping alert / Promos)
   - Sticky Navigation Header with Brand Logo, Smart Search, Wishlist Badge, Cart Badge
   - Hero Banner with Call To Action ("Shop Cases", "Explore Flagship Series")
   - Featured Brand Grid (Apple, Samsung, Google, OnePlus, Xiaomi)
   - Popular Phone Models Quick-Bar (e.g. iPhone 17 Pro, S26 Ultra, Pixel 9 Pro)
   - Bestsellers & New Arrivals Grid
   - "Why SmartCaseBD" Trust Grid (100% Fit Guarantee, Premium Protection, Fast Shipping across BD, Cash on Delivery)
   - Customer Review Highlights & FAQ Section
   - Footer Links
3. **Input**: Mouse click / Mobile touch on CTA, Category, Brand, Model card, or Search bar.
4. **Success State**: Smooth client transition to target shop or detail page.
5. **Edge Cases**: Slow network connection displays skeleton screens instead of unstyled content.

---

#### B. Brand, Series & Phone Model Selection Flow
1. **Entry Points**: `/brand/[brandSlug]`, `/model/[modelSlug]`, or Shop sidebar filter.
2. **User Path**:
   - Customer selects **Brand** (e.g. *Apple*)
   - System displays available **Series** (e.g. *iPhone 17 Series*, *iPhone 16 Series*)
   - Customer selects specific **Phone Model** (e.g. *iPhone 17 Pro Max*)
3. **Result**: Displays only cases specifically compatible with that phone model.
4. **Validation**: Model selection updates URL search parameters cleanly (`?brand=apple&model=iphone-17-pro-max`).
5. **Success State**: Filtered grid updates dynamically with match count badge (e.g., "Showing 18 cases for iPhone 17 Pro Max").
6. **Failure State**: No matching cases available for a selected phone model.
   - *UI Behavior*: Friendly empty state with "Request Case for this Model" or "View Universal Accessories" CTA.

---

#### C. Search & Filter Flow
1. **Search Input**: Header search bar or full-screen search modal (`/api/products/search`).
2. **Queries**: Supports matching product title, SKU, brand name, phone model, material tag.
3. **Instant Autocomplete**: Displays top 4 matching products + matching phone models as user types (debounce 250ms).
4. **Filter Drawer / Sidebar Controls**:
   - Phone Brand & Model dropdown / pill selector
   - Price range slider / min-max input
   - Material filters (Aramid Fiber, Premium Leather, Silicone, Transparent Polycarbonate, MagSafe)
   - Color selection swatches
   - Availability toggle ("In Stock Only")
   - Sort order (Newest, Price: Low to High, Price: High to Low, Popularity)
5. **Validation**: Invalid price bounds (e.g., Min > Max) auto-corrected silently.
6. **Success State**: Instant grid refresh, updating browser history state for bookmarkable URLs.

---

#### D. Product Details Page (PDP) & Variant Selection Flow
1. **Route**: `/product/[slug]`
2. **Visual Hierarchy**:
   - Breadcrumb Trail: `Home > Shop > Apple > iPhone 17 Pro Max > Carbon Shield Case`
   - High-Res Image Gallery: Main preview image with thumbnail gallery + image hover zoom modal.
   - Phone Compatibility Badge (Highlighted box confirming device match: `✓ Guaranteed Fit for iPhone 17 Pro Max`).
   - Title, Price, Compare-At Price (Strikethrough), Discount Badge (e.g. `15% OFF`).
   - Stock Status Indicator (`In Stock (12 available)` or `Only 2 left - Order soon!`).
   - Color / Material Variant Selector.
   - Quantity selector (+/- controls with max capped at current stock).
   - Action Buttons: `Add to Cart` (Primary), `Buy Now` (Direct Checkout), `Wishlist` (Heart icon).
   - Accordion Info: Highlights, Protection Specs, Materials & Care, Delivery & Return Policy.
   - Customer Ratings & Verified Reviews section.
   - Recommended / Compatible Accessories carousel.
3. **Validation**: Attempting to add item when variant is out of stock disables button and shows "Out of Stock".
4. **Success State**: Clicking `Add to Cart` triggers cart drawer opening + toast alert (`Added to cart`).

---

#### E. Cart Management Flow (Drawer & Full Page)
1. **Entry Point**: Click Cart icon in header, or click `Add to Cart` on PDP.
2. **Cart Operations**:
   - Increment / Decrement item quantity (live stock verification).
   - Remove item (with subtle undo toast option).
   - Display dynamic subtotal, calculated delivery fee (Dhaka vs Outside Dhaka toggle), and final total.
   - Coupon Input field: Enter promo code ➔ Click `Apply`.
3. **Coupon Validation**:
   - Checks code existence, active status, start/end dates, minimum cart value, usage limits.
   - *Success*: Deducts coupon discount and displays green savings tag (`COUPON10 applied: -৳150`).
   - *Failure*: Shows error message (`Coupon expired` or `Minimum order value ৳1,000 required`).
4. **Persistence**: Cart synchronized to `localStorage` for guests and synced to backend DB for logged-in users.

---

#### F. Checkout Flow (Bangladesh Optimized)
1. **Route**: `/checkout`
2. **Steps**:
   - **Step 1: Contact Information**
     - Full Name (Required)
     - Phone Number (Required, BD regex format: `013/014/015/016/017/018/019xxxxxxxx`)
     - Email Address (Optional, for digital receipt)
   - **Step 2: Shipping Address**
     - Division (Dropdown: Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, Mymensingh)
     - District & Upazila / City Area
     - Full Street Address (House/Road/Block details)
     - Delivery Note (Optional: e.g., "Deliver after 4 PM")
   - **Step 3: Delivery Options**
     - Inside Dhaka (৳60 / Standard 24-48 Hours)
     - Outside Dhaka (৳120 / Courier Delivery 2-4 Days)
   - **Step 4: Payment Method**
     - Cash on Delivery (COD) - Default & Active
     - bKash / Nagad / Card (Marked as Gateway Ready)
   - **Step 5: Order Review & Confirmation**
     - Clear list of items with selected phone model compatibility summary.
     - Final Total Breakdown: Subtotal + Delivery Fee - Coupon Discount = **Total Payable BDT**.
     - Explicit button: `Place Order (Cash on Delivery)`.
3. **Validation & Security**:
   - Server-side Zod validation of all address and phone inputs.
   - Inventory check before order placement (re-validates item availability).
4. **Success State**:
   - Orders saved to DB with unique Order ID (e.g. `SCBD-2026-8942`).
   - Redirect to `/order-confirmation/[orderId]`.
   - Cart automatically cleared.

---

#### G. Order Tracking & Customer Account Flow
1. **Guest Tracking Route**: `/track-order`
   - Input: Order ID + Phone Number
   - Result: Visual progress tracker displaying current status (`PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
2. **Customer Account Route**: `/account`
   - Order history table, delivery addresses, profile details update.

---

## 2. ADMIN WORKFLOWS

### 2.1 Admin Navigation Map

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ADMIN DASHBOARD PANEL                           │
├──────────────┬──────────────┬──────────────┬─────────────┬─────────────┤
│ Products     │ Phone Models │ Orders       │ Inventory   │ Analytics   │
│ Management   │ Architecture │ Processing   │ & Audit Logs│ & Settings  │
└──────────────┴──────────────┴──────────────┴─────────────┴─────────────┘
```

---

### 2.2 Admin Flow Breakdown

#### A. Authentication & Authorization Flow
1. **Entry Point**: `/admin/login`
2. **Inputs**: Email/Username + Password.
3. **Validation**:
   - Verifies credentials against DB using password hashing (Argon2/Bcrypt).
   - Checks User Role (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`).
4. **Security Middleware**: Non-admin attempts to access `/admin/*` routes are intercepted and redirected to `/admin/login` with HTTP 403 / 401 response.
5. **Session**: Secure JWT token set in HttpOnly cookie (`smartcasebd_admin_token`).

---

#### B. Admin Dashboard Flow
1. **Route**: `/admin/dashboard`
2. **Metrics Overview Cards**:
   - Total Revenue (BDT) & Today's Sales
   - Total Orders Count (Filterable by status)
   - Low Stock Alert Count
   - Active Phone Models & Total Products
3. **Visual Charts**: Sales trend chart, top-selling case models, recent order stream.
4. **Quick Actions**: "Add New Product", "Add Phone Model", "Process Orders".

---

#### C. Phone Model & Brand Architecture Management Flow
1. **Routes**: `/admin/brands`, `/admin/series`, `/admin/models`
2. **Brand Operations**:
   - Add Brand (Name, Slug, Logo URL, Sort Order, Active Status).
3. **Series Operations**:
   - Add Series under Brand (e.g. Brand: *Samsung* ➔ Series: *Galaxy S Series*).
4. **Phone Model Operations**:
   - Add Phone Model under Series (e.g. Series: *Galaxy S Series* ➔ Model: *Galaxy S26 Ultra*).
   - Set status to Active / Inactive.
5. **Impact**: Newly created phone models immediately become selectable in the Product Management interface and Customer compatibility dropdowns.

---

#### D. Product Management Flow (CRUD)
1. **Route**: `/admin/products`
2. **Product List View**: Filterable data table by Brand, Phone Model, Category, Price, Stock Status, and Search.
3. **Product Creation Wizard** (`/admin/products/new`):
   - **Step 1: Basic Info**: Product Name, Slug (auto-generated), Description, Short Description, Category.
   - **Step 2: Compatibility Assignment**: Select Brand ➔ Series ➔ Phone Model(s).
   - **Step 3: Pricing & Inventory**: Base Price, Compare-At Price, Cost Price (Admin confidential), Stock Quantity, Low-Stock Threshold.
   - **Step 4: Image Management**: Primary thumbnail upload + Gallery image array ordering.
   - **Step 5: Attributes & MagSafe**: Material tag, Color hex, MagSafe toggle, Warranty details.
   - **Step 6: SEO Settings**: SEO Title, SEO Description metadata.
   - **Step 7: Publish Status**: Draft / Published / Hidden.
4. **Soft Delete**: Product removal sets `deletedAt` timestamp instead of hard deleting to preserve historical order references.

---

#### E. Order Management & Processing Flow
1. **Route**: `/admin/orders`
2. **Order List**: Filter by Status (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), Date Range, Customer Phone, Order ID.
3. **Order Action Modal**:
   - Update Order Status with status change notes.
   - Print Invoice / Packing Slip generator.
   - Assign Courier Tracking ID (e.g. Steadfast / Pathao tracking number).
4. **Audit Trail**: Every status change records timestamp and admin user ID.

---

#### F. Inventory & Audit Logging Flow
1. **Route**: `/admin/inventory` & `/admin/audit-logs`
2. **Stock Adjustments**:
   - Admin updates variant stock count.
   - System prompts for adjustment reason (*Restock, Damaged Goods, Customer Return, Manual Audit*).
   - Creates an entry in `InventoryLog` database table.
3. **System Audit Logs**:
   - Tracks critical admin actions: Price modifications, Product deletions, Order status overrides, User permission updates.

---

#### G. Coupon & Marketing Flow
1. **Route**: `/admin/coupons`
2. **Coupon Creation**:
   - Code (e.g. `WELCOME10`), Discount Type (Percentage or Fixed BDT), Discount Value.
   - Minimum Order Requirement (e.g. ৳1,000).
   - Usage Limit per Customer & Global Usage Cap.
   - Expiration Date Picker.

---

## 3. ERROR & EDGE CASE HANDLING MATRIX

| Scenario | Trigger / Cause | System Behavior & UX Response |
| :--- | :--- | :--- |
| **Out of Stock Purchase** | Item stock reaches 0 during cart checkout session. | System re-validates stock at checkout submission, flags item, updates button to "Out of Stock", and prompts user to modify cart. |
| **Invalid BD Phone Number** | Customer enters malformed phone number at checkout. | Form highlights input in red with explicit error: "Enter valid 11-digit Bangladesh phone number (017xxxxxxxx)". |
| **Admin Route Unauthorized Access** | Non-authenticated user opens `/admin/dashboard`. | Server middleware intercepts request immediately and redirects to `/admin/login`. |
| **Network Failure during Checkout** | Connection drops while placing order. | Submit button shows loading spinner, retries gracefully, and alerts user with non-blocking error toast without clearing form fields. |
| **Broken Image Links** | Product image CDN or asset missing. | Next.js image component renders styled fallback asset with SMARTCASEBD logo graphic. |
| **Concurrent Stock Depletion** | Two users buy last unit simultaneously. | Database transaction locks stock record; second order fails gracefully with stock alert. |
