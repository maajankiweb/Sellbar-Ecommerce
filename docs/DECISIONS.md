# Sellbar — Technical & Business Architecture Decisions

This document records all architectural decisions, overrides to the original Technical Requirements Document (`docs/TRD.md`), and the formal resolutions of client decision gates.

---

## 1. Architectural Overrides to the TRD

The original TRD specified enterprise-scale infrastructure (separate Express backend, Vercel frontend, MongoDB Atlas M10+, AWS S3, Amazon SES, Twilio, RazorpayX, Native Android). To adhere to the strict budget constraint (**total build under ₹50,000**) and leverage the **already-purchased client VPS and domain**, the following overrides have been adopted:

| # | TRD Requirement | Approved Decision | Rational & Budget Impact |
|---|---|---|---|
| **AD-01** | Separate Express backend (`sellbar-backend`) | **Unified Next.js Route Handlers** (`src/app/api/v1/*`) with modular domain services + Node background worker process. | Eliminates dual-repo complexity, halves VPS memory usage, simplifies zero-downtime deployment. |
| **AD-02** | Frontend on Vercel | **Self-hosted on client VPS** via Docker Compose + Nginx proxy behind Cloudflare (Free CDN/SSL/WAF). | Vercel Free tier prohibits commercial commerce. VPS is already paid by client. Saves ₹1,800/mo ($20/mo). |
| **AD-03** | MongoDB Atlas M10+ (₹4,500/mo) | **Staging: Atlas M0 (Free)**.<br>**Production: Self-hosted MongoDB on VPS** in Docker with automated nightly `mongodump` encrypted and uploaded to Cloudflare R2 (14 daily + 8 weekly retention). **A full backup restore drill is REQUIRED and must be logged before production launch.** | Eliminates recurring ₹4,000–₹5,000/mo database cost. Zero-cost production DB with proven restore capability verified before live traffic. *(Client can upgrade to Atlas M10 later).* |
| **AD-04** | Redis Cloud / Upstash (Paid) | **Self-hosted Redis container** on the same VPS, powering BullMQ and rate-limiting. | Free self-hosted container. Saves ~₹800–₹1,500/mo. |
| **AD-05** | AWS S3 for storage | **Cloudflare R2** (S3-compatible API, zero egress fees, 10GB free storage). | Eliminates AWS S3 storage and egress charges. Saves ~₹500/mo. |
| **AD-06** | Amazon SES / SendGrid | **Resend or Brevo Free Tier** (3,000 emails/mo free) behind an abstract `EmailProvider` interface. | Free for initial transaction volumes. Zero credit card required on start. |
| **AD-07** | MSG91 / Twilio for all SMS | **MSG91 for OTP ONLY**. Order status updates delivered via Email, In-App Notifications, and Push Notifications. Transactional SMS behind `SMS_TRANSACTIONAL=false` flag. | Drastically reduces DLT SMS costs (~₹0.15/SMS + DLT registration fees). Client only pays for verification OTPs. |
| **AD-08** | Redux Toolkit + Axios + React Query | **Native React Context + Fetch Layer**. Add React Query only if caching complexity warrants it. | Avoids redundant architectural churn and library bundle overhead. |
| **AD-09** | RazorpayX Automated Payouts | **Manual Doorstep UPI / Cash Payout**: Executive pays seller directly or via company UPI, records UTR in Executive App; Admin reconciles. RazorpayX implemented behind `PayoutProvider` interface, **disabled by default**. | RazorpayX requires specialized current account approvals, KYC, and transaction surcharges. Manual payout is zero-cost and standard in Indian recommerce pilots. |
| **AD-10** | Native Android App (Kotlin) | **Capacitor Hybrid Mobile App** wrapping Next.js with FCM Push, Deep Linking, and Camera inspection (`appName: "Sellbar"`, `appId: "in.sellbar.app"`). Play Console account in client's name. | Native build exceeds budget and timeline. Capacitor utilizes existing codebase with 95%+ feature parity. |
| **AD-11** | Route `/buy/product/[id]` | **Keep route `/buy/[slug]`** with 301 redirects from legacy paths. | Preserves existing SEO indexing and user bookmarks. |
| **AD-12** | Seller Central Multi-Vendor | **Retain code, but hide from navigation and feature-flag off** (`SELLER_PORTAL_ENABLED=false`). | Out of scope for PRD MVP. Avoids multi-seller inventory conflict. |
| **AD-13** | Multi-Category Scope | **MVP Category Scope: Mobile Phones Only** for Sell and Buy. Tablets, laptops, smartwatches, TV, repair, recycle show "Coming Soon" with email capture. | PRD §5.1 explicit MVP constraint. Focuses inventory and logistics on mobile phones. |

---

## 2. Client Decision Resolution Log

| # | Topic | Status | Formal Resolution & Operational Rule |
|---|---|---|---|
| **CD-01** | **Warranty & Replacement** | **APPROVED** | **6 months warranty**, **15-day replacement window**, both strictly read from `SiteSettings`. Replacement covers dead-on-arrival and covered defects; exclusions match `/legal/warranty` (physical damage, liquid, unauthorized repair, rooting). **No hardcoded policy numbers permitted anywhere.** |
| **CD-02** | **MongoDB Hosting** | **APPROVED** | **Self-hosted MongoDB on VPS**; Atlas M0 for staging only. Conditions before go-live: authentication enabled, port not exposed publicly, encrypted nightly `mongodump` to Cloudflare R2 (14 daily + 8 weekly retention), and a **documented RESTORE DRILL performed and logged**. Revisit Atlas M10 when real order volume justifies. |
| **CD-03** | **Category Scope** | **APPROVED** | **Mobile phones only for Sell and Buy**. Remove all demo laptops, accessories, gaming, and "new device" listings from production. Show real inventory only. All other categories show **"Coming Soon" with email waitlist capture**. |
| **CD-04** | **Logistics** | **APPROVED** | **Manual courier adapter**. Courier name, AWB tracking number, and tracking URL are **mandatory** before an order can transition to `SHIPPED`. Shiprocket adapter stays behind a feature flag (`ENABLE_SHIPROCKET=false`). |
| **CD-05** | **Seller Payout** | **APPROVED** | **Manual UPI / Cash with controls**. UTR is mandatory for UPI payouts. Cash payouts require customer handover OTP plus seller ID proof capture. Admin reconciliation queue with mismatch flags. Configurable per-order payout limit requiring admin approval: **`[FILL]`** *(Safe default: ₹10,000 threshold)*. |
| **CD-06** | **GST Treatment** | **PARTIALLY APPROVED** | Keep `SiteSettings.gstScheme` (`STANDARD_GST` \| `MARGIN_SCHEME`). Invoices generated before CA confirmation must carry a prominent **"Draft / template" watermark marker** and must not be used for real customer orders. **Launch Gate:** CA confirmation recorded in `docs/DECISIONS.md`. CA's answer: **`[FILL]`**. |
| **CD-07** | **Legal Entity Display** | **CHANGED** | **Placeholder entity details must NEVER render on any public page.** Until real values are entered, hide the legal-entity block. **Block production go-live** if these `SiteSettings` fields are empty: Legal name, trade name, GSTIN, registered address, support email, support phone, grievance officer name/email/phone. Real values: **`[FILL from client's registration certificate]`**. |
| **CD-08** | **Claims & Copy** | **PARTIALLY APPROVED** | "Transparent Pricing Engine" approved. Use "32-Point Diagnostic Inspection" and "Certified Data Wipe" **ONLY if client confirms the checklist and wipe process really exist and are documented**. Until confirmed, use safe defaults: **"Quality-checked before sale"** and **"Data erased before resale"**. **Never use** "NIST 800-88", "military-grade", "Best Price Guarantee", or "100% factory-level functionality". Client confirmation: **`[FILL: yes/no for checklist, yes/no for wipe process]`**. |
| **CD-09** | **Pilot Serviceable Pincodes** | **CHANGED** | **Do not assume cities.** Production starts with an **EMPTY serviceable list**. Add only cities/pincodes where the client has active pickup executives: **`[FILL]`**. Staging may be seeded with Patna and Bettiah for testing only. All other pincodes show the "Notify me" waitlist. |
| **CD-10** | **Android App Delivery** | **APPROVED** | Capacitor wrapper (`appName: "Sellbar"`, `appId: "in.sellbar.app"`). Play Console account must be registered in the client's name. |
| **CD-11** | **Cash on Delivery (COD)** | **APPROVED** | **Disabled for the pilot (`codEnabled: false`)** to eliminate RTO risk. Prepaid orders only via Razorpay Standard. Revisit after measuring prepaid baseline. |
| **CD-12** | **SMS & DLT Infrastructure** | **APPROVED WITH CHANGES** | MSG91 for OTP only (`SMS_TRANSACTIONAL=false`), with email OTP fallback while DLT is pending. DLT entity and MSG91 account in client's name. Sender ID must NOT use single-L legacy variant; propose **`SLLBAR`** (6 chars), confirm availability on operator DLT portal, and register OTP template text: `"{#var#} is your verification code for Sellbar. Valid for 5 minutes. Do not share this OTP with anyone."` |

---

## 3. Order Prefix & Identifiers

- **Order Prefix Rule:** All order numbers must use the unified prefix format:
  $$\text{SB-YYYY-XXXXXX}$$
  *(e.g., `SB-2026-104928`)*.
- **Tracking Prefix:** Manual courier tracking records use `SB-TRK-XXXXXX` or the actual carrier AWB.
- **API Key Format:** Hashed, scoped keys formatted as `sb_live_sk_[16char]` (with only SHA-256 hash stored in DB).
- **Rule for Pending `[FILL]` Items:** Any item marked `[FILL]` stays on its safe default (hidden, disabled, or empty) until formally provided by the client.

---

## 4. Brand Identity Enforcement

- **Brand Name:** Strictly **"Sellbar"** (Title Case: capital `S`, double `l`, lowercase `bar`).
- **Domain:** **`sellbar.in`** (no other domain or sub-brand).
- **Zero Tolerance Policy:** No occurrences of legacy single-L spelling or variants in public UI, meta tags, JSON-LD, emails, invoices, or customer-facing documentation.
