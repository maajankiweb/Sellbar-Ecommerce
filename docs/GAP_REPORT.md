# Sellbar — Comprehensive Phase 0 Audit & Gap Report

**Audit Date:** October 2026  
**Auditor:** Senior Full-Stack Engineering Agent (Antigravity)  
**Target Repository:** `maajankiweb/Sellbar-Ecommerce`  
**Brand & Production Host:** **Sellbar** (`https://sellbar.in`)  
**Reference Baselines:** `docs/PRD.md` (Product Requirements) & `docs/TRD.md` (Technical Architecture)

---

## 1. Executive Audit Summary & Production Deployment Status

Sellbar has a rich, modern Next.js 16 (App Router) codebase with UI prototypes, Argon2id auth, rate limiting, and extensive schema definitions. However, the audit reveals critical gaps:

> [!WARNING]
> **CRITICAL DISCREPANCY: LOCAL REPO VS LIVE PRODUCTION SERVER**
> - The live production site at `https://sellbar.in` is **still running an earlier unpatched deployment**.
> - The live site still contains uppercase `SELBAR` in titles, header, and footer, fabricated reviews, live ticker, unverified claims ("NIST 800-88", "Best Price Guaranteed", "12-Month Warranty"), and the "Rent PS5 → /screener" link.
> - **Fixes previously committed to git (such as removing secrets from README or fixing 404 routes in code) are committed and pushed to GitHub (`origin/main`), but HAVE NOT YET BEEN DEPLOYED TO PRODUCTION.**
> - **Real credential rotation must be performed directly on the production database by the client.** Scrubbing credentials from repo files does not invalidate live MongoDB users or rotate compromised API keys.

---

## 2. Deployment & Remediation Status of Previous Findings

| Item / Finding | In Local Code? | Committed to Git? | Pushed to GitHub? | Deployed to Prod? | Real Credentials Rotated on Prod DB/Server? | Action Required |
|---|---|---|---|---|---|---|
| **Master API Key in README** | Scrubbed | Yes (`df4c0b7`) | Yes (`origin/main`) | **NO (Not Deployed)** | **NO (Pending Client)** | Client must rotate master key on server; git purge history via `git filter-repo`. |
| **Admin Password in seed file & README** | Scrubbed | Yes (`df4c0b7`) | Yes (`origin/main`) | **NO (Not Deployed)** | **NO (Pending Client)** | Client must immediately change admin password on production database and revoke active sessions. |
| **Homepage 404 links (`/buy/[slug]`)** | Fixed in code | Yes (`df4c0b7`) | Yes (`origin/main`) | **NO (Not Deployed)** | N/A | Will take effect upon deployment of Phase 1 to staging and then production. |
| **Purge fake reviews, ticker, counters** | Pending Phase 1 Hotfix | No | No | **NO (Visible on Prod)** | N/A | Step C hotfix in Phase 1 to replace with honest empty states. |
| **Single Policy Source (`SiteSettings`)** | Pending Phase 1 | No | No | **NO (Not Deployed)** | N/A | Step D in Phase 1. |
| **Brand Rename to Sellbar / sellbar.in** | Pending Phase 1 | No | No | **NO (Not Deployed)** | N/A | Step D in Phase 1 across UI, meta, and configs. |
| **Dedicated `/legal/*` pages** | Pending Phase 1 | No | No | **NO (Not Deployed)** | N/A | Step D in Phase 1. |

---

## 3. Comprehensive Area Audit Matrix

### 3.1 Public Site & Storefront

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-C1** (Public landing & category pages) | Yes | **Partial** | Convert `/sell`, `/buy`, and `/warranty` to Server Components (RSC + ISR) with client islands. Remove non-phone categories from active navigation. |
| **FR-C2** (Trust strip) | Yes | **Broken** | Currently displays hardcoded contradictory claims. Wire to `SiteSettings` singleton (Free Pickup, Instant Valuation, Certified Data Wipe, 6-Month Warranty). |
| **FR-C3** (Testimonials & Social Proof) | Yes | **Broken** | Currently displays 15 fake hardcoded testimonials with Unsplash photos and a fake scrolling marquee. Replace with real admin-moderated reviews tied to completed orders; render empty state when no reviews exist. |
| **TRD §2.3** (ISR / SSR Architecture) | No | **Broken** | Root `page.tsx` and catalog pages use `'use client'`, causing poor LCP and blank crawler indexing. Implement ISR (1 hour revalidation) on static storefront pages and SSR with query parameters on `/buy`. |
| **P0-12** (Brand Spelling & Domain) | Yes | **Broken** | Root layout, navigation, and footer show `SELBAR`. Standardize to **Sellbar** and `https://sellbar.in` across all UI and metadata. |
| **Homepage Links** | Yes | **Partial** | Fixed 404 links on `/buy/[slug]` in code. "Rent PS5" points to `/screener` (must be removed or mapped to disabled category with email capture). |

### 3.2 Sell Flow (Mobile Phones: FR-S1 – FR-S13)

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-S1** (Searchable brand/model catalog) | Yes | **Partial** | Currently reads from static `data.ts`. Connect to `CatalogModel` MongoDB collection with Redis caching (1h TTL). |
| **FR-S2** (Variant pill selection) | Yes | **OK** | RAM/Storage pill selector exists in `DeviceDiagnosticWizard.tsx`. Verify price reactivity against server-side base prices. |
| **FR-S3** (Condition questionnaire wizard) | Yes | **Partial** | Wizard exists in client UI, but questions are hardcoded in `data.ts`. Implement `ConditionQuestion` database model and `/api/v1/pricing/questions` endpoint (FR-AD1). |
| **FR-S4** (Server-side pricing engine) | Partial | **Partial** | `calculateQuote` in `engine.ts` computes prices in-memory. Shift calculation entirely to `POST /api/v1/pricing/quote`, generate cryptographic `Quote` document with integer paise amounts and 72-hour expiry. |
| **FR-S5** (Itemized quote breakdown) | Yes | **OK** | UI displays collapsible deduction line items. Ensure amounts strictly reflect server-generated quote. |
| **FR-S6** (Inline pincode serviceability check) | Yes | **Partial** | Currently validates against hardcoded `AUTHORIZED_LOCATIONS` array in `config.ts`. Migrate to `ServiceablePincode` DB model; add `POST /serviceability/waitlist` for unsupported pincodes. Serviceable pincodes strictly limited to cities client confirms they can staff. |
| **FR-S7** (Pickup schedule & payout mode) | Yes | **OK** | Calendar picker and UPI/Bank/Cash selection exist. Verify payout details are sanitized and stored securely. |
| **FR-S8** (Late OTP authentication) | Yes | **Partial** | Sell funnel allows quote generation before login, but state preservation across modal OTP login needs hardening against page refresh. |
| **FR-S9** (Order confirmation & checklist) | Yes | **OK** | Confirmation page exists. Ensure atomic order number generation with prefix **`SB-`** (`SB-YYYY-XXXXXX`). |
| **FR-S10** (Order tracking timeline) | Yes | **Partial** | Sell timeline exists. Add support for `REVISED_PRICE_PENDING` and `EXECUTIVE_ASSIGNED` transitions. |
| **FR-S11** (Physical inspection price revision) | Partial | **Broken** | Customer acceptance/rejection flow for revised prices lacks dedicated API endpoint (`POST /orders/:id/revised-price/accept|reject`) and responsive modal. |
| **FR-S12** (Receipt & Data Wipe PDF) | Partial | **Partial** | PDF generator exists in `src/lib/pdf`, but certificates are generated prematurely without an actual ops wipe log (`Inspection.wipeLog`). |
| **FR-S13** (Post-sale rating & referral) | No | **Broken** | Rating prompt after pickup completion is missing; must link to verified `Review` collection. |

### 3.3 Buy Flow (Refurbished Phones: FR-B1 – FR-B5)

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-B1** (Listing with multi-facet filters) | Yes | **Partial** | Filters exist on `/buy`, but filter logic runs client-side over in-memory `REFURB_PRODUCTS`. Move to server-side query on `RefurbDevice` (grade, brand, price, storage). |
| **FR-B2** (PDP with grade tabs, QC, warranty) | Yes | **OK** | PDP at `/buy/[slug]` has grade tabs (Fair/Good/Superb), battery health, and 32-point checklist. Replace hardcoded badges with `SiteSettings` policy values. |
| **FR-B3** (Cart, reservation & checkout) | Partial | **Partial** | Cart exists in `CartContext.tsx`. Must enforce atomic stock reservation (`findOneAndUpdate` with `status: 'RESERVED'`, 15-minute TTL) before Razorpay order initialization. |
| **FR-B4** (Delivery tracking timeline) | Yes | **Partial** | Tracking page exists. Add Server-Sent Events (SSE) endpoint `GET /api/v1/orders/:id/stream` for live courier updates. |
| **FR-B5** (Return / replacement request) | Partial | **Partial** | Model supports `returnRequest`, but user interface inside `/account/orders` is incomplete and does not validate against the 15-day policy window. |

### 3.4 Authentication & Security

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-A1** (Mobile OTP first, staff password) | Yes | **OK** | Argon2id + HMAC-SHA256 OTP lifecycle is built and passes tests (`npm run test:auth`). MSG91 production SMS integration required with header `SLLBAR`. |
| **TRD §3.2** (Dual token rotation & anti-reuse) | Yes | **OK** | 25-second multi-tab rotation grace window implemented to prevent accidental session revocation. |
| **TRD §3.4** (Rate limiting & brute force guards) | Yes | **Partial** | Redis rate limiter implemented; fallback in-memory cache needs strict production fail-safe check in `env.ts`. |
| **TRD §3.5** (RBAC & Admin MFA) | Yes | **Partial** | Role hierarchy (`customer`, `executive`, `admin`, `super_admin`) defined. TOTP 2FA required for admin roles. |
| **P0-1** (Secrets & Master API Key Removal) | Partial | **Scrubbed in Code Only** | Scrubbed from repo files in git commit `df4c0b7`. Production server database MUST be scrubbed and credentials rotated by the client. Replace static keys with hashed, scoped `ApiKey` documents. |

### 3.5 User Panel (`/account`)

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-A2** (Unified Sell + Buy order history) | Yes | **Partial** | Tabbed list exists. Needs live data wiring to `/api/v1/orders/me` and status badge unification. |
| **FR-A3** (Saved addresses & masked payout) | Yes | **Partial** | Address CRUD exists. Bank/UPI payout details must be encrypted at rest and masked in UI. |
| **FR-A4** (Session management & revocation) | Yes | **OK** | Active sessions screen allows remote revocation via `Session` collection. |
| **DPDP Compliance** (Account deletion & export) | Partial | **Broken** | Add `POST /api/v1/users/me/data-request` for DPDP 2023 right-to-erasure and data export. |

### 3.6 Executive App (`/executive`)

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **Section 10** (Today's Assigned Jobs) | Yes | **Partial** | Mobile UI exists in `src/app/delivery`. Route to `/executive` with role-based guard. |
| **Section 10** (Diagnostic Inspection) | Yes | **Partial** | Checklist UI exists. Add camera capture to Cloudflare R2 and IMEI verification hook (`ImeiCheckProvider`). Operational claims to be verified with client. |
| **Section 10** (On-spot Price Revision) | No | **Broken** | Executive app must generate itemized deduction adjustments and trigger instant customer authorization link/OTP. |
| **Section 10** (Handover OTP & Seller ID Proof) | Partial | **Partial** | Handover OTP verification exists in stub; wire to order status change to `PAYMENT_PENDING`. Securely store encrypted ID proofs. |
| **Section 10** (Manual Doorstep Payout Entry) | Partial | **Partial** | Add UTR recording input for UPI transactions and cash receipt confirmation. |

### 3.7 Admin Panel (`/admin`)

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-AD1** (Pricing engine & deduction editor) | Partial | **Partial** | Admin pricing view exists. Build interactive condition question editor and price simulation sandbox. |
| **FR-AD2** (Order management & dispatch) | Yes | **OK** | Order list, filtering, and executive assignment views exist. Enforce atomic state transitions and audit logging with prefix `SB-`. |
| **FR-AD3** (Refurb inventory intake & QC) | Yes | **Partial** | Inventory intake screen exists in `src/app/admin/warehouse`. Connect to `RefurbDevice` unit-level stock tracking. |
| **FR-AD4** (Reporting & analytics dashboard) | Yes | **Partial** | Dashboard charts exist. Ensure numbers derive from real DB aggregations rather than static demo fixtures. |
| **FR-AD5** (Dispute & refund queue) | Partial | **Partial** | Build dedicated dispute queue with one-click Razorpay refund integration and mandatory admin notes. |
| **Site Settings** (Policy singleton editor) | No | **Broken** | Build `SiteSettings` editor for warranty, replacement days, support phone/email, and enabled categories. Ensure legal entity placeholders never render publicly. |
| **Audit Log Viewer** | Partial | **Partial** | `AuthAuditLog` exists. Expand to track all price adjustments, refunds, and order status overrides. |

### 3.8 Payments & Payouts (Razorpay)

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **TRD §5.1** (Server-side order creation) | Yes | **OK** | Razorpay order created server-side from calculated cart total (paise integer). |
| **TRD §5.2** (Payment verification & HMAC) | Yes | **OK** | Verification endpoint uses `crypto.timingSafeEqual` to validate SHA-256 signatures. |
| **TRD §5.3** (Webhook processor & idempotency) | Yes | **Partial** | Webhook endpoint exists. Ensure raw-body parsing, signature validation, and queue dispatch to BullMQ (`payment.captured`, `payment.failed`). |
| **TRD §5.4** (Sell Payouts Provider) | Partial | **Partial** | Implement `PayoutProvider` interface with default `ManualPayoutAdapter` and disabled `RazorpayXAdapter`. |

### 3.9 Inventory & Stock Management

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **Section 13** (Unit-level stock tracking) | Yes | **Partial** | `RefurbDevice` tracks IMEI, grade, and status. Refactor to derive listing availability (`N left`) purely from `status: 'LISTED'` units. |
| **Section 13** (Atomic reservation & 15m TTL) | Partial | **Broken** | Implement atomic unit reservation on checkout start with BullMQ cron releasing expired reservations every minute. |
| **Section 13** (Stock movement ledger) | Partial | **Partial** | Create `StockMovement` audit entries on every inventory state change. |

### 3.10 Shipping & Tracking

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **Section 14** (ShippingProvider interface) | Partial | **Partial** | Implement `ShippingProvider` with `ManualShippingAdapter` (default) and `ShiprocketAdapter` (flagged off). |
| **Section 14** (Tracking webhook & SSE) | Partial | **Partial** | Create inbound tracking webhook updating `buyDetails.shipment` and streaming to customer via SSE. |

### 3.11 Notifications & Messaging

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-N1** (SMS dispatch via MSG91) | Partial | **Partial** | SMS service exists. Enforce OTP-only rule with header `SLLBAR`; guard transactional SMS behind `SMS_TRANSACTIONAL=false`. |
| **FR-N2** (Push & in-app notifications) | Partial | **Partial** | In-app notification schema exists. Wire FCM push adapter for Capacitor Android app. |
| **BullMQ Worker** (Queue processing) | Yes | **Partial** | `queueManager.ts` defines email and notification queues. Create standalone worker entrypoint (`src/worker/index.ts`). |

### 3.12 SEO, Meta & Structured Data

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **Section 17** (Dynamic per-page metadata) | No | **Broken** | Storefront pages share static layout metadata. Implement `generateMetadata` for all routes. |
| **Section 17** (JSON-LD Structured Data) | Partial | **Partial** | Add `Organization`, `WebSite`, `Product`, `Offer`, `FAQPage`, and `BreadcrumbList` schemas. |
| **Section 17** (Sitemap & Robots) | Partial | **Partial** | Generate dynamic `sitemap.ts` and `robots.ts` referencing live products and catalog models. Remove meta keywords (including competitor terms). |

### 3.13 Legal, Compliance & Trust

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **FR-C1 / P0-8** (Dedicated legal pages) | No | **Broken** | Currently footer links redirect to `/faq` and `/data-wipe`. Create `/legal/terms`, `/legal/privacy`, `/legal/refund`, `/legal/warranty`, `/legal/cookies`, `/legal/e-waste`, and `/legal/grievance`. Marked as templates for client's lawyer review. |
| **DPDP Act 2023** (Consent & Cookie Banner) | No | **Broken** | Implement cookie consent banner; block analytics scripts until explicit consent is granted. |
| **E-Waste & Data Wipe Compliance** | Partial | **Partial** | Revise marketing copy to reflect verified operational procedures; generate PDF certificates only from verified wipe logs. |

### 3.14 DevOps, Deployment & CI/CD

| Requirement ID | Exists? | Quality | Action Required |
|---|---|---|---|
| **TRD §7.1** (Docker Compose stack) | Partial | **Partial** | Create production `docker-compose.yml` for `web`, `worker`, `redis`, `mongo`, and `nginx`. |
| **TRD §7.2** (CI/CD Pipeline) | Partial | **Partial** | Complete GitHub Actions workflow (`lint`, `typecheck`, `test:auth`, `build`, `smoke-test`). |
| **TRD §7.3** (Backup automation) | No | **Broken** | Create shell script for automated nightly `mongodump` with AES-256 encryption and Cloudflare R2 upload. **Conduct restore drill before launch.** |
| **TRD §7.4** (Health & Monitoring) | Partial | **Partial** | Implement `/api/health` checking MongoDB, Redis, and Queue status for UptimeRobot. |

---

## 4. Inventory of Fabricated & Hardcoded Claims in UI

| Location | Component / File | Hardcoded Text / Value | Classification | Action |
|---|---|---|---|---|
| **Homepage Ticker** | `LiveActivityTicker.tsx` | `"Sold iPhone 13 128GB, 2m ago, Patna, ₹28,400 Cash Payout"` | Fabricated live activity | **Remove component**. |
| **Homepage Ticker** | `LiveActivityTicker.tsx` | `"Bought Refurbished MacBook Air M1, 4m ago, Bettiah, ₹42,999 (Saved 52%)"` | Fabricated live activity | **Remove component**. |
| **Homepage Marquee** | `CustomerReviewsCarousel.tsx` | `"4.9 / 5 Overall Customer Rating"` | Unverified rating | **Replace** with dynamic average from approved `Review` documents or hide. |
| **Homepage Marquee** | `CustomerReviewsCarousel.tsx` | `"60,000+ Verified Transactions"` | Fabricated metric | **Replace** with dynamic count from `Order` DB; hide if count < 100. |
| **Homepage Marquee** | `CustomerReviewsCarousel.tsx` | `"₹85 Cr+ Instant UPI Disbursed"` | Fabricated metric | **Replace** with dynamic sum or remove entirely. |
| **Reviews Grid** | `CustomerReviewsCarousel.tsx` | 15 fake reviews (Alok Sharma, Pooja Verma, Rajesh Mishra) with Unsplash profile images | Fabricated testimonials | **Purge fake reviews**. Display genuine customer reviews from completed orders; show honest empty state if none exist. |
| **Impact Ribbon** | `EcoImpactCounter.tsx` | `"14,800+ kg E-Waste Diverted"` | Fabricated claim | **Remove** or compute based on actual devices recycled in DB. |
| **Impact Ribbon** | `EcoImpactCounter.tsx` | `"34,200+ L Clean Water Conserved"` | Fabricated claim | **Remove**. |
| **Impact Ribbon** | `EcoImpactCounter.tsx` | `"50,000+ Devices Recommerce Life"` | Fabricated metric | **Replace** with real DB count or hide below threshold. |
| **Impact Ribbon** | `EcoImpactCounter.tsx` | `"₹12.5 Cr+ Cash Returned to Sellers"` | Fabricated metric | **Replace** with real DB sum or hide. |
| **Footer Links** | `Footer.tsx` | Terms, Privacy, Cookies redirecting to `/faq` and `/data-wipe` | Broken navigation | **Create dedicated `/legal/*` pages**. |
| **Footer Social** | `Footer.tsx` | Bare `facebook.com`, `instagram.com`, `youtube.com` links | Incomplete links | **Wire to `SiteSettings.socialLinks`**. |
| **Services Rail** | `page.tsx` (Line 233) | `"Rent PS5" -> href: "/screener"` | Misleading link | **Remove** "Rent PS5" service tile. |
| **SEO Meta** | `layout.tsx` | `keywords: "... cashify alternative ..."` | Competitor keyword spam | **Remove competitor keywords**; focus on brand and recommerce terms. |
| **Root Layout** | `layout.tsx` | `title: "SELBAR — Sell Old Electronics..."` | Incorrect brand casing | **Rename to "Sellbar"**. |
| **Warranty Claims** | Multiple components | Mixed claims of "12-Month Warranty", "6-Month Warranty", "15-Day Return", "5-Day Replacement" | Contradictory policies | **Normalize to `SiteSettings`** (Defaults: 6 Months Warranty, 15 Days Replacement). |
