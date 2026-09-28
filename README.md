# SMARTCASEBD — Flagship Smartphone Case E-Commerce Platform

---

## 1. Project Overview

**SMARTCASEBD** is a production-grade, flagship smartphone case e-commerce application designed specifically for the Bangladeshi market. Built with a focus on luxury aesthetic, trust, ultra-fast performance, and security, SmartCaseBD provides a high-end retail experience for premium smartphone owners (iPhone, Samsung Galaxy S/Z Series, Google Pixel, OnePlus, Xiaomi Flagship, etc.).

The system features a complete customer storefront, responsive shopping experience, dynamic multi-tiered product and phone compatibility management system (Brand → Series → Model → Product → Variant), Bangladesh-localized checkout (Cash on Delivery + prepared payment gateway interfaces), persistent cart/wishlist, customer account tracking, and a comprehensive role-based Admin Management Portal with real-time analytics, inventory logging, order processing, and audit capabilities.

---

## 2. Business Goal

- **Positioning**: Establish SMARTCASEBD as Bangladesh's most trusted, premium flagship smartphone case brand.
- **Conversion-Driven UX**: Eliminate friction between discovering a compatible case for a specific phone model and completing an order.
- **Brand Trust**: Deliver a visual aesthetic comparable to global flagship brand stores (e.g., Apple, Nomad, Spigen) with transparent pricing, delivery schedules, and clear warranty/return policies.
- **Scalable Retail Engine**: Provide admins with seamless inventory tracking, model-variant association, coupon management, customer analytics, and audit logging to manage rapid growth without technical bottlenecks.

---

## 3. Target Customers

1. **Flagship Smartphone Owners**: Users carrying high-end devices (iPhone 15/16/17 series, Samsung S24/S25/S26 series, Pixel, Foldables) looking for stylish, heavy-duty, or MagSafe protection.
2. **Aesthetic & Minimalist Enthusiasts**: Customers who prioritize slim profile, premium materials (Aramid Fiber, Premium Leather, Crystal Clear Anti-Yellowing Polycarbonate, MagSafe).
3. **Gift Buyers**: Customers looking for high-quality, presentable tech accessories for loved ones.
4. **Tech & Gadget Enthusiasts**: Early adopters looking for cutting-edge protective gear, camera lens protection, and heat-dissipating cases.

---

## 4. Brand Identity & Visual Language

- **Brand Name**: SMARTCASEBD
- **Tagline**: *Premium Protection for Flagship Devices*
- **Visual Aesthetic**: Minimalist, clean, modern, dark-accented premium tech vibe. Generous whitespace, crisp product photography, restrained brand accents.
- **Typography**: Clean sans-serif font stack (Inter / Plus Jakarta Sans) optimized for both English and Bangla readability.
- **Color System (Design Tokens)**:
  - `--background`: Light clean neutral `#FAFAFC` / Dark `#09090B`
  - `--foreground`: Deep obsidian `#09090B` / White `#F4F4F5`
  - `--primary`: Deep Matte Black `#111111` / Metallic Slate `#1E293B`
  - `--accent`: Premium Gold Amber `#D97706` / Electric Cyan `#0284C7` (Restrained highlights)
  - `--muted`: Soft Charcoal `#71717A`
  - `--border`: Fine subtle border `#E4E4E7`
- **Micro-Interactions**: Subtle, smooth 150ms-250ms transitions (card zoom, button press feedback, skeleton loading, cart drawer slide, sticky purchase bar).

---

## 5. Technology Stack

### Frontend & Architecture
- **Framework**: Next.js 15 (App Router, Server Components & Client Components)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS v4 / Custom CSS Variables (Design Tokens)
- **Icons**: Lucide React
- **Component Primitives**: Radix UI / Custom accessible headless patterns
- **Animation**: Framer Motion (for drawer, modals, subtle page transitions with reduced-motion support)

### Backend & API
- **API Architecture**: Next.js API Route Handlers / Server Actions
- **Validation**: Zod (Client-side & Server-side schema validation)
- **Authentication**: Custom JWT Session cookies with Argon2/Bcrypt password hashing & HttpOnly, Secure, SameSite flags.
- **ORM & Database**: Prisma ORM with SQLite (Development) / PostgreSQL (Production ready)

### Infrastructure & Utilities
- **State Management**: Zustand / React Context for Cart, Wishlist & Filters
- **Form Handling**: React Hook Form + Zod Resolver
- **Notifications**: Sonner / Custom accessible Toast system
- **Image Optimization**: Next.js Image component with WebP/AVIF format conversions and blur placeholders.

---

## 6. Architecture Overview

```
                          ┌───────────────────────────┐
                          │   SMARTCASEBD Storefront   │
                          │   (Next.js App Router)    │
                          └─────────────┬─────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
  ┌──────────────────┐       ┌────────────────────┐      ┌───────────────────┐
  │ Customer Routes  │       │  API Handlers /    │      │    Admin Portal   │
  │ /shop, /product, │       │  Server Actions    │      │ /admin/dashboard, │
  │ /cart, /checkout │       │                    │      │ /admin/products   │
  └──────────┬───────┘       └──────────┬─────────┘      └─────────┬─────────┘
             │                          │                          │
             │                          ▼                          │
             │                 ┌─────────────────┐                 │
             └────────────────►│ Zod Validation  │◄────────────────┘
                               │ Authorization   │
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Prisma ORM Layer│
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ SQLite / Postgres│
                               └─────────────────┘
```

---

## 7. Folder Structure

```
smartcasebd/
├── README.md
├── FLOW.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts / postcss.config.js
├── next.config.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── (storefront)/
    │   │   ├── shop/
    │   │   │   └── page.tsx
    │   │   ├── product/[slug]/
    │   │   │   └── page.tsx
    │   │   ├── brand/[slug]/
    │   │   │   └── page.tsx
    │   │   ├── model/[slug]/
    │   │   │   └── page.tsx
    │   │   ├── cart/
    │   │   │   └── page.tsx
    │   │   ├── checkout/
    │   │   │   └── page.tsx
    │   │   ├── order-confirmation/[orderId]/
    │   │   │   └── page.tsx
    │   │   ├── track-order/
    │   │   │   └── page.tsx
    │   │   ├── wishlist/
    │   │   │   └── page.tsx
    │   │   ├── account/
    │   │   │   └── page.tsx
    │   │   ├── login/
    │   │   └── register/
    │   ├── admin/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx (Dashboard redirect)
    │   │   ├── login/
    │   │   ├── dashboard/
    │   │   ├── products/
    │   │   ├── brands/
    │   │   ├── series/
    │   │   ├── models/
    │   │   ├── categories/
    │   │   ├── orders/
    │   │   ├── inventory/
    │   │   ├── customers/
    │   │   ├── coupons/
    │   │   ├── reviews/
    │   │   ├── banners/
    │   │   ├── audit-logs/
    │   │   └── settings/
    │   └── api/
    │       ├── auth/
    │       ├── products/
    │       ├── brands/
    │       ├── models/
    │       ├── cart/
    │       ├── orders/
    │       ├── coupons/
    │       └── admin/
    ├── components/
    │   ├── ui/ (Button, Input, Modal, Badge, Toast, Drawer, Skeleton)
    │   ├── storefront/ (Header, Footer, ProductCard, Hero, FilterDrawer, StickyPurchaseBar)
    │   ├── admin/ (Sidebar, Header, AnalyticsCard, DataTables, StatusBadge)
    │   └── common/ (SEO, ErrorBoundary, ImageUpload)
    ├── lib/
    │   ├── prisma.ts
    │   ├── auth.ts
    │   ├── utils.ts
    │   ├── constants.ts
    │   └── validations/
    ├── services/
    │   ├── product.service.ts
    │   ├── order.service.ts
    │   ├── inventory.service.ts
    │   └── analytics.service.ts
    └── types/
        ├── index.ts
        ├── product.ts
        └── order.ts
```

---

## 8. Database Architecture

The database schema is fully normalized and supports hierarchical brand-to-model filtering, variants, inventory audit history, coupons, reviews, and admin audit logging.

### Data Model Entity Hierarchy
- **User**: (id, name, phone, email, passwordHash, role [SUPER_ADMIN, ADMIN, MANAGER, EDITOR, CUSTOMER], status)
- **Address**: (id, userId, fullName, phone, division, district, upazila, streetAddress, isDefault)
- **Brand**: (id, name, slug, logo, description, status, sortOrder)
- **Series**: (id, brandId, name, slug, status, sortOrder)
- **PhoneModel**: (id, seriesId, name, slug, image, releaseYear, status, sortOrder)
- **Category**: (id, name, slug, description, image, status)
- **Product**: (id, name, slug, sku, categoryId, brandId, phoneModelId, description, shortDescription, basePrice, compareAtPrice, costPrice, status, isFeatured, isBestseller, isNewArrival, material, color, finish, magSafeCompatible, warrantyInfo, seoTitle, seoDescription)
- **ProductVariant**: (id, productId, phoneModelId, colorName, colorHex, sku, price, compareAtPrice, stock, image)
- **ProductImage**: (id, productId, url, altText, isThumbnail, sortOrder)
- **InventoryLog**: (id, productId, variantId, quantityChange, previousStock, newStock, reason, adminUserId, createdAt)
- **Cart & CartItem**: Persistent cart storage for guest (session token) and authenticated users.
- **Wishlist & WishlistItem**: Customer wishlist association.
- **Order & OrderItem**: Complete Bangladesh shipping address, payment method (COD/Digital), status enum (PENDING, CONFIRMED, PROCESSING, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED, REFUNDED), tracking number, notes.
- **Coupon & CouponUsage**: Discount rules (% or fixed BDT), min order value, max usage limit, per-customer cap.
- **Review**: Product review with rating (1-5 stars), comment, status (PENDING, APPROVED, REJECTED), verifiedPurchase flag.
- **AuditLog**: Comprehensive log of admin activity (action, entity, entityId, payload, ipAddress, adminId).

---

## 9. Authentication Architecture

- **Customer Auth**: Phone / Email registration and password authentication. JWT stored in HttpOnly secure cookies.
- **Guest Access**: Full browse, cart management, and checkout capabilities supported with session tokens stored in local storage / cookies.
- **Admin Auth & RBAC**: Dedicated `/admin/login` page with strict server-side middleware enforcement (`/admin/*` API and route protection). Role checks: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`.

---

## 10. Customer Features

- **Storefront & Navigation**: Sticky transparent-to-solid header, fast search modal, clear categories & brand grid.
- **Smart Compatibility Finder**: Filter products instantly by selecting Phone Brand → Series → Specific Phone Model.
- **Rich Product Details**: High-resolution gallery with image zoom, real-time stock indicator, clear phone compatibility badge, material/feature breakdown, customer reviews, dynamic variant selector, sticky mobile purchase bar.
- **Cart Drawer & Page**: Slide-over quick cart drawer with real-time delivery calculation, coupon code applier, and free shipping progress indicator.
- **Localized Checkout**: Frictionless 1-page checkout optimized for Bangladesh address format (Division, District, Upazila, Area, Street address), phone number validation, COD option, order summary card.
- **Order Tracking**: Live status tracker by Order ID & Phone number.
- **Wishlist & Account**: Saved items, address book, past order status history.

---

## 11. Admin Features

- **Executive Analytics Dashboard**: Sales over time, daily orders, revenue metrics, conversion statistics, low-stock alerts, popular phone models.
- **Multi-Level Phone Architecture**: Dynamic management of Phone Brands, Series, and Models.
- **Product Management**: Multi-step wizard or comprehensive editor with image gallery ordering, variant pricing, MagSafe toggles, compatibility linkage, SEO metadata, soft deletion.
- **Order Processing Hub**: Bulk status updates, printable invoice view, delivery notes, audit note log, customer notification state.
- **Real-Time Inventory Manager**: Stock adjustment logs, reserved stock alerts, low-stock threshold triggers.
- **Coupon & Marketing**: Custom promo code creation with usage limits and BDT/Percentage rules.
- **Review Moderation**: Approve/reject customer reviews with verified purchase flags.
- **Audit Logger**: Action logs recording any price change, order alteration, or stock update.

---

## 12. Product Architecture

Products support both primary model assignment and multi-variant compatibility:
```
[Brand: Apple] ➔ [Series: iPhone] ➔ [Model: iPhone 17 Pro Max]
                                         │
                        [Product: Carbon Shield Ultra MagSafe]
                                         │
                      ┌──────────────────┴──────────────────┐
                      ▼                                     ▼
           [Variant: Obsidian Black]              [Variant: Titanium Gray]
           - SKU: CS-i17pm-BLK                    - SKU: CS-i17pm-GRY
           - Stock: 45                            - Stock: 20
```

---

## 13. Order Architecture

Orders follow a strict state machine lifecycle:
`PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `PACKED` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`
*(Branch options: `CANCELLED`, `RETURNED`, `REFUNDED`)*

Every status transition creates a history record and updates inventory appropriately (e.g., reserving stock on `CONFIRMED`, releasing stock on `CANCELLED`).

---

## 14. Inventory Architecture

- **Stock States**: Total Stock, Reserved Stock (in active checkouts), Available Stock.
- **Low Stock Threshold**: Default set to 5 units. Emits visual badges in admin table and dashboard alerts.
- **Audit Logging**: Any manual modification logs `previousStock`, `newStock`, `reason`, and `adminUserId`.

---

## 15. SEO Architecture

- Dynamic Metadata generation for every product, brand, and phone model route (`title`, `description`, `openGraph`, `canonical`).
- JSON-LD Structured Data: `Product`, `BreadcrumbList`, `Organization`, and `WebSite` schemas.
- Clean SEO URL hierarchy: `/shop`, `/product/[slug]`, `/brand/[slug]`, `/model/[slug]`.
- Auto-generated `sitemap.xml` and `robots.txt`.

---

## 16. Security Architecture

- **Input Sanitization & Schema Validation**: Strict Zod validation on every API endpoint.
- **Password Security**: Argon2id / Bcrypt with salt rounds.
- **Rate Limiting**: Protection against brute-force attacks on `/api/auth/*` and coupon endpoints.
- **HTTP Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, Content Security Policy.
- **CSRF & XSS Safeguards**: HttpOnly cookies, escaped output in React, sanitized html content.

---

## 17. Performance Strategy

- Server-side rendering (SSR) for static/dynamic product pages with ISR (Incremental Static Regeneration) where optimal.
- Responsive image sizes using standard `<Image>` tags with WebP format.
- Code-splitting & dynamic imports for admin charts and heavy modals.
- Skeleton UI fallbacks for seamless page transition feel.

---

## 18. Responsive Design Strategy

- **Mobile First**: Optimized touch target sizes (minimum 44x44px), sticky bottom buy bar on product pages, compact filter drawer.
- **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.
- Desktop spaciously spaced layouts with micro-hover zoom and sticky order summaries.

---

## 19. Image Strategy

- Standardized aspect ratio (1:1 square for product gallery and cards; 16:9 for banners).
- Next.js Image component optimization with placeholder blur effects.
- Direct fallbacks for missing images with styled brand logo graphics.

---

## 20. Error Handling & User Feedback

- Global Error Boundaries & 404 / 500 error pages.
- Clear error toast notifications for client actions (e.g., "Out of stock", "Invalid promo code").
- Detailed server logs with masked sensitive credentials. No raw SQL or stack traces exposed to end users.

---

## 21. Validation Strategy

- Dual-layer validation (Client-side instant feedback + Server-side Zod validation).
- Standardized phone number regex validator for Bangladesh (`/^(?:\+88|88)?01[3-9]\d{8}$/`).

---

## 22. Deployment Strategy

- **Platform**: Vercel / Node.js Server Environment.
- **Database**: PostgreSQL (Supabase / Neon / Railway) or SQLite for standalone deployment.
- Production build verified via `npm run build`.

---

## 23. Environment Variables (.env.example)

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="SMARTCASEBD"

# Database
DATABASE_URL="file:./dev.db"

# Authentication & Security
JWT_SECRET=super_secret_jwt_key_smartcasebd_2026_change_in_prod
ADMIN_JWT_SECRET=super_secret_admin_jwt_key_smartcasebd_2026

# Local / Cloud Image Storage Configuration
NEXT_PUBLIC_IMAGE_HOST=http://localhost:3000
```

---

## 24. Future Scalability

- Ready for online payment gateway extensions (SSLCommerz, bKash Merchant API, Nagad API).
- Modular architecture allowing multi-warehouse inventory management and automated SMS notifications (SteadFast / Pathao Courier API integration).

---

## 25. Development Checklist

- [x] Phase 0: Workspace Inspection & Verification
- [x] Phase 1: Master Documentation (`README.md` & `FLOW.md`)
- [ ] Phase 2: Tech Stack Setup, Prisma Schema & Database Initialization
- [ ] Phase 3: Auth System & Authorization Middleware (Customer & Admin)
- [ ] Phase 4: UI Design System & Shared Components (Design Tokens)
- [ ] Phase 5: Customer Storefront Layout, Navigation & Hero Experience
- [ ] Phase 6: Brand & Phone Model Filter Architecture + Product Listing Page
- [ ] Phase 7: Product Detail Page with Variant Selection & Phone Compatibility Badge
- [ ] Phase 8: Cart Drawer & Wishlist Persistence
- [ ] Phase 9: Bangladesh Localized Checkout & Order Confirmation Flow
- [ ] Phase 10: Admin Dashboard & Analytics Engine
- [ ] Phase 11: Admin Product Management (CRUD, Gallery, SEO)
- [ ] Phase 12: Admin Phone Architecture (Brand, Series, Model CRUD)
- [ ] Phase 13: Order Processing Hub & Inventory Audit Logs
- [ ] Phase 14: Coupon & Customer Review System
- [ ] Phase 15: SEO Metadata, Schema.org & Performance Tuning
- [ ] Phase 16: Security Hardening & Rate Limiting
- [ ] Phase 17: End-to-End Testing & Responsive QA
- [ ] Phase 18: Final Polish & Seed Data Verification

---

## 26. Testing Strategy

- **API Tests**: Validating payload schemas for product creation, cart additions, and order processing.
- **Auth Guard Tests**: Verifying non-authenticated requests to `/api/admin/*` return HTTP 401/403.
- **Cart & Checkout Tests**: Ensuring correct item count, total price calculations, discount subtractions, and delivery charge additions.
