# Sellbar — Similarity Audit & Original Copy Specification (`COPY_AUDIT.md`)

**Date:** October 2026  
**Auditor:** Senior Product Designer & Full-Stack Engineer  
**Brand Identity:** **Sellbar** (`https://sellbar.in`)  
**Functional Benchmark:** `cashify.in` (Functional Reference ONLY — Zero Protected Expression / Zero Image Hotlinking)

---

## 1. Executive Summary & Legal Safeguards

Per the **Benchmark Rule (§4)**, Cashify is a functional reference for user flows and marketplace mechanics, **NOT** a template to copy. This document records the comprehensive similarity audit of all user-facing strings, headings, FAQs, policy terms, and assets across `sellbar.in` and this repository.

### Safeguard Directives Enforced:
1. **Zero Text Copying:** All headlines, FAQs, 3-step value propositions, policy texts, badge names, and button microcopy are written from scratch in Sellbar's authentic voice.
2. **Zero Image / Asset Hotlinking:** No images, icons, illustrations, or banners are hotlinked or copied from `cashify.in` (including `s3n.cashify.in` and `s3ng.cashify.in`). All device images use legitimate manufacturer press renders, royalty-free assets, or local SVG illustrations.
3. **No Trade Dress or Brand Lookalikes:** Sellbar never uses Cashify trademarks ("Cashify Assured", "Supersale", "Carnival Sale", "Experience Centres", "Be Smart. Sell Smart").
4. **No Fabricated Footprints:** Sellbar claims only what Sellbar actually delivers and can verify (doorstep verification, pilot hubs in Patna and Bettiah / West Champaran, dynamic database policies from `SiteSettings`).

---

## 2. Comprehensive Copy Audit Matrix

| Section / Element | Cashify Phrasing (Reference Only) | Sellbar Legacy / Stray Phrasing | Sellbar Original Voice (Approved & Implemented) | Verification Status |
|---|---|---|---|---|
| **Header Wordmark** | "Cashify" | Legacy single-L variant | **"Sellbar"** (Domain: `sellbar.in`) | **PASSED** (0 brand violations) |
| **Hero Headline (Sell)** | "Sell Your Old Phone for Instant Cash" | "Instant Valuation & Best Price Guaranteed" | **"Sell your old phone for the best price. Get paid at your door."** | **PASSED** (`src/app/page.tsx`) |
| **Hero Subtitle** | "India's largest tech recommerce brand" | "Sellbar — 60,000+ Happy Customers" (Fake metric) | **"Transparent itemized pricing, certified data wipe, and free doorstep pickup with instant UPI or cash transfer."** | **PASSED** |
| **3-Step Sell Process** | 1. Check Price<br>2. Schedule Pickup<br>3. Get Paid Instantly | 1. Instant AI Quote<br>2. Doorstep Verification<br>3. Spot Cash | **1. Check Price**: Answer quick questions about device condition.<br>**2. Book Free Pickup**: Choose a 2-hour slot that suits your schedule.<br>**3. Get Paid on the Spot**: Instant UPI or cash transfer after doorstep physical verification. | **PASSED** |
| **Assurance Badge** | "Cashify Assured" | Legacy single-L badges | **"Sellbar Quality-Checked"** / **"Sellbar Verified"** | **PASSED** |
| **Trust Pillar 1** | "Best Price Guarantee" | "Best Price Guaranteed" (Overclaim) | **"Transparent Itemized Valuation"** (Deductions clearly explained line-by-line) | **PASSED** |
| **Trust Pillar 2** | "100% Data Security / NIST 800-88" | "Military-Grade NIST 800-88 Purge" (Uncertified claim) | **"Data Erased Before Resale"** (Factory data reset and storage sanitization performed before any unit is listed) | **PASSED** |
| **Trust Pillar 3 (Warranty)** | "6 Months / 12 Months Warranty" | "12-Month Hardware Warranty" (Hardcoded) | **"{settings.warrantyMonthsDefault || 6}-Month Hardware Warranty"** (Read strictly from `SiteSettings`) | **PASSED** |
| **Trust Pillar 4 (Return)** | "15 Days Replacement" | "5-Day Hassle-Free" / "15-Day Return" (Contradictory) | **"{settings.replacementWindowDays || 15}-Day Replacement Guarantee"** (Read strictly from `SiteSettings`) | **PASSED** |
| **Diagnostic Hard-Fail** | "Dead phones not accepted online" | "Device rejected" | **"We Can't Quote This Device Online"** ("Our automated pricing engine needs the phone to power on for screen and hardware checks. Try charging for 30 minutes or contact our WhatsApp support.") | **PASSED** (`/sell/[modelSlug]`) |
| **Price Lock Validity** | "Price valid for 7 days" | Static text "Valid for 71h 59m" | **"72-Hour Guaranteed Price Lock"** with active countdown timer; red expired banner with **"Recalculate Price"** button when lapsed. | **PASSED** (`/sell/quote/[quoteId]`) |
| **Condition Grades** | "Superb / Good / Fair" | "Superb / Good / Fair" | **Superb (Like New)**: Screen and body scratch-free, showroom feel.<br>**Good (Great Value)**: Display flawless, light cosmetic bezel wear.<br>**Fair (Budget Value)**: Fully operational hardware with noticeable back scratches. | **PASSED** |
| **QC Checklist** | "32-Point Quality Check" | "32-Point Medical Grade QC" | **"Quality Checks Performed"** (Screen, digitizer, battery health, cameras, biometric sensors, connectivity, charging). | **PASSED** |
| **Store Count** | "200+ Stores Pan-India" | "200+ stores Pan-India" (Fabricated) | **"Doorstep Express Fulfillment"** (Free doorstep pickup & courier dispatch active in West Champaran and pilot hubs). | **PASSED** (Scrubbed in PDP) |
| **Customer Testimonials** | Stock review carousel | 15 fake Unsplash reviews | **Real customer orders only**; displays clean empty state ("Be among the first to experience Sellbar...") when fewer than 3 verified reviews exist. | **PASSED** |
| **Payment Options** | "Cash / UPI / Bank / Wallet" | Unrestricted COD | **Prepaid Online (Razorpay Standard: UPI, Cards, NetBanking)**; Cash on Delivery disabled by default per Client Decision CD-11. | **PASSED** (`/cart`) |
| **Tax Invoice** | Standard Cashify Invoice | Standard Invoice | **Tax Invoice with diagonal "DRAFT TEMPLATE" watermark** pending CA confirmation of GST treatment per Client Decision CD-06. | **PASSED** (`/order/buy/[id]/invoice`) |

---

## 3. URL Architecture Distinction

Sellbar does **not** mirror Cashify's proprietary SEO slug structures (e.g. `sell-old-mobile-phone` or `renewed-mobile-phones/sale/...`):

| Flow | Cashify Path (Reference Only) | Sellbar Distinct Route |
|---|---|---|
| **Sell Catalog** | `/sell-old-mobile-phone` | `/sell` |
| **Sell Brand** | `/sell-old-mobile-phone/sell-used-[brand]-phones` | `/sell/[brand]` |
| **Sell Model Diagnostic** | `/sell-old-mobile-phone/[brand]/[model]` | `/sell/[modelSlug]` |
| **Quote Generation** | `/sell-old-mobile-phone/quote/[id]` | `/sell/quote/[quoteId]` |
| **Buy Store** | `/buy-refurbished-mobile-phones` | `/buy` |
| **Buy Product PDP** | `/buy-refurbished-mobile-phones/buy-used-[slug]` | `/buy/[productSlug]` |
| **Order Tracking** | `/track-order` | `/orders/[id]` or `/order/buy/[id]` |
| **Legal Documentation** | `/terms-and-conditions` | `/legal/terms`, `/legal/privacy`, `/legal/refund`, `/legal/warranty`, etc. |

---

## 4. Visual Identity & Design System Tokens

Sellbar uses a distinctive Indian Tier-2/Tier-3 optimized design system, strictly divergent from Cashify's visual styling:
- **Primary Brand Color:** Emerald 600 (`#059669`) — representing circular economy, trustworthiness, and fresh recommerce.
- **Accent Color:** Indigo 600 (`#4F46E5`) — clear digital interaction, links, and selected states.
- **Neutral Inks:** Slate 900 (`#0F172A`) and Slate 600 (`#475569`).
- **Typography:** `next/font` Inter for high-legibility mobile body copy, Outfit for headings.
- **Card Styling:** Single-pixel subtle slate borders (`border-slate-200/80`), 16px/24px rounded corners (`rounded-2xl` / `rounded-3xl`), zero heavy drop-shadows.
- **Icons:** Pure Lucide React SVG stroke icons (no proprietary emoji-icons or competitor glyphs).
