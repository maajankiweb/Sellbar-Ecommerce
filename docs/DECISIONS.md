# Sellbar — Technical & Business Architecture Decisions

This document records all architectural decisions, overrides to the original Technical Requirements Document (`docs/TRD.md`), and the default stances applied for pending **[CLIENT DECISION]** items.

---

## 1. Architectural Overrides to the TRD

The original TRD (`SELBAR-TRD.md`) specified enterprise-scale infrastructure (separate Express backend, Vercel frontend, MongoDB Atlas M10+, AWS S3, Amazon SES, Twilio, RazorpayX, Native Android). To adhere to the strict budget constraint (**total build under ₹50,000**) and leverage the **already-purchased client VPS and domain**, the following overrides have been adopted:

| # | TRD Requirement | Approved Decision | Rational & Budget Impact |
|---|---|---|---|
| **AD-01** | Separate Express backend (`selbar-backend`) | **Unified Next.js Route Handlers** (`src/app/api/v1/*`) with modular domain services (`src/modules/*`) + Node background worker process. | Eliminates dual-repo complexity, halves VPS memory usage, simplifies zero-downtime deployment. |
| **AD-02** | Frontend on Vercel | **Self-hosted on client VPS** via Docker Compose + Nginx proxy behind Cloudflare (Free CDN/SSL/WAF). | Vercel Free tier prohibits commercial commerce. VPS is already paid by client. Saves ₹1,800/mo ($20/mo). |
| **AD-03** | MongoDB Atlas M10+ (₹4,500/mo) | **Staging: Atlas M0 (Free)**.<br>**Production: Self-hosted MongoDB on VPS** in Docker with automated nightly `mongodump` encrypted and uploaded to Cloudflare R2 (14 daily + 8 weekly retention). **A full backup restore drill is REQUIRED before production launch.** | Eliminates recurring ₹4,000–₹5,000/mo database cost. Zero-cost production DB with proven restore capability verified before live traffic. *(Client can upgrade to Atlas M10 later).* |
| **AD-04** | Redis Cloud / Upstash (Paid) | **Self-hosted Redis container** on the same VPS, powering BullMQ and rate-limiting. | Free self-hosted container. Saves ~₹800–₹1,500/mo. |
| **AD-05** | AWS S3 for storage | **Cloudflare R2** (S3-compatible API, zero egress fees, 10GB free storage). | Eliminates AWS S3 storage and egress charges. Saves ~₹500/mo. |
| **AD-06** | Amazon SES / SendGrid | **Resend or Brevo Free Tier** (3,000 emails/mo free) behind an abstract `EmailProvider` interface. | Free for initial transaction volumes. Zero credit card required on start. |
| **AD-07** | MSG91 / Twilio for all SMS | **MSG91 for OTP ONLY**. Order status updates delivered via Email, In-App Notifications, and Push Notifications. Transactional SMS behind `SMS_TRANSACTIONAL=false` flag. | Drastically reduces DLT SMS costs (~₹0.15/SMS + DLT registration fees). Client only pays for verification OTPs. |
| **AD-08** | Redux Toolkit + Axios + React Query | **Native React Context + Fetch Layer**. Add React Query only if caching complexity warrants it. | Avoids redundant architectural churn and library bundle overhead. |
| **AD-09** | RazorpayX Automated Payouts | **Manual Doorstep UPI / Cash Payout**: Executive pays seller directly or via company UPI, records UTR in Executive App; Admin reconciles. RazorpayX implemented behind `PayoutProvider` interface, **disabled by default**. | RazorpayX requires specialized current account approvals, KYC, and transaction surcharges. Manual payout is zero-cost and standard in Indian recommerce pilots. |
| **AD-10** | Native Android App (Kotlin) | **Capacitor Hybrid Mobile App** wrapping Next.js with FCM Push, Deep Linking, and Camera inspection. | Native build exceeds the ₹50,000 budget and timeline. Capacitor utilizes existing codebase with 95%+ feature parity. |
| **AD-11** | Route `/buy/product/[id]` | **Keep route `/buy/[slug]`** with 301 redirects from legacy paths. | Preserves existing SEO indexing and user bookmarks. |
| **AD-12** | Seller Central Multi-Vendor | **Retain code, but hide from navigation and feature-flag off** (`SELLER_PORTAL_ENABLED=false`). | Out of scope for PRD MVP. Avoids multi-seller inventory conflict. |
| **AD-13** | Multi-Category Scope | **MVP Category Scope: Mobile Phones Only** for Sell and Buy. Tablets, laptops, smartwatches, TV, repair, recycle are disabled via `SiteSettings.enabledCategories`. Disabled categories display "Coming Soon" with email capture. | PRD §5.1 explicit MVP constraint. Focuses inventory and logistics on mobile phones. |

---

## 2. [CLIENT DECISION] Default Stances & Resolution Log

The following defaults are **to be applied in Phase 1** pending formal client sign-off:

1. **Warranty & Replacement Policy:**
   - *Default to apply in Phase 1:* **6 Months Warranty** on certified refurbished phones; **15 Days Replacement Window**.
   - *Harmonization:* All conflicting mentions of 12-month / 5-day / 7-day will be normalized to read strictly from `SiteSettings`.

2. **Database Hosting for Production:**
   - *Default to apply in Phase 1:* **Self-hosted MongoDB on VPS** with nightly R2 automated backups. **A live restore drill is mandatory prior to public traffic.**
   - *Alternative:* Atlas M10 (if client approves ~₹4,500/month recurring cost).

3. **Active Categories at Launch:**
   - *Default to apply in Phase 1:* **Mobile Phones only** (Sell & Buy). Laptops/Tablets disabled unless client confirms immediate refurbished stock.

4. **Shipping Logistics Provider (Buy Flow):**
   - *Default to apply in Phase 1:* **Manual Courier Adapter** (Admin enters courier name, AWB tracking number, tracking URL).
   - *Alternative:* Shiprocket automated dispatch (activated when client provides Shiprocket API keys and funds wallet).

5. **Seller Doorstep Payout Method:**
   - *Default to apply in Phase 1:* **Manual Executive UPI / Cash with UTR tracking** and Admin verification queue. RazorpayX disabled.

6. **Order Number Prefix:**
   - *Default to apply in Phase 1:* **`SB-`** (e.g., `SB-2026-000101`). This format is consistently applied across both documentation and state machines.

7. **SMS DLT 6-Letter Header & OTP Template:**
   - *Rule:* Must NOT use `SELBAR` (brand violation).
   - *Proposal:* Propose **`SLLBAR`** (or approved 6-character variant like `SLBARS`), subject to availability verification on the operator DLT portal. OTP template text will match:
     `{#var#} is your verification code for Sellbar. Valid for 5 minutes. Do not share this OTP with anyone.`

8. **Legal Entity & Compliance Defaults:**
   - *Strict Rule:* Placeholder legal entity names (e.g. "Sellbar Technologies Pvt. Ltd.") must **NEVER render on public-facing pages**.
   - *Behavior:* Until the client provides their actual registered corporate name, GSTIN, and Grievance Officer details, those specific fields remain hidden from the UI.

9. **Serviceable Pincodes & Pilot Cities:**
   - *Strict Rule:* Serviceable pincodes must be **strictly limited to cities where the client confirms active, staffed executives**.
   - *Behavior:* In production, the serviceable pincode list remains empty (or contains only explicitly confirmed pincodes). All other locations show the inline "Notify Me When Available" waitlist form so customers never book unserviceable pickups.

10. **Marketing Claims Governance:**
    - *Rule:* Reword "AI-driven valuation" to "Transparent Pricing Engine". Remove unverified "Best Price Guaranteed" and "NIST 800-88 military grade" claims.
    - *Operational Claims:* Claims regarding "32-Point Diagnostic Inspection" and "Certified Data Wipe Process" will only be published if the client explicitly confirms these operational capabilities and SOPs exist. Otherwise, use factual, conservative descriptions of functional checks.

11. **Android Application Delivery:**
    - *Default to apply in Phase 1:* Capacitor wrapper (`appName: "Sellbar"`, `appId: "in.sellbar.app"`).

12. **Cash on Delivery (COD) for Refurbished Purchases:**
    - *Default to apply in Phase 1:* **Disabled (`codEnabled: false`)** to prevent RTO (Return to Origin) losses during pilot. Pre-paid only via Razorpay Standard Checkout.

---

## 3. Brand Identity Enforcement

- **Brand Name:** Strictly **"Sellbar"** (Title Case: capital `S`, double `l`, lowercase `bar`).
- **Domain:** **`sellbar.in`** (no other domain or sub-brand).
- **Zero Tolerance Policy:** No occurrences of `SELBAR`, `Selbar`, `selbar.in` in public UI, meta tags, JSON-LD, emails, invoices, or customer-facing documentation.
