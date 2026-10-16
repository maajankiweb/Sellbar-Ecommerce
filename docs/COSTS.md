# Sellbar — Infrastructure & Operating Costs

This document outlines the complete cost breakdown for **Sellbar** (https://sellbar.in), enforcing the strict project constraint that the total development and launch expenditure remains **under ₹50,000**.

---

## 1. Cost Summary Overview

| Category | Provider / Service | Monthly Cost (₹) | Annual / Setup Cost (₹) | Payer | Notes |
|---|---|---|---|---|---|
| **Domain** | Pre-purchased Domain (`sellbar.in`) | ₹0 (Pre-paid) | ~₹899 / yr | **Client** | Already purchased by client. Registrar and exact renewal cycle to be verified: **[CONFIRM WITH CLIENT]**. |
| **Server / VPS** | Client VPS (Linux KVM) | ₹0 (Pre-paid) | Pre-paid by client | **Client** | Pre-purchased by client with host-level backup. Exact plan, RAM (assumed 8–16GB), and vCPU to be confirmed: **[CONFIRM WITH CLIENT]**. |
| **DNS, CDN, SSL & WAF** | Cloudflare Free Plan | **₹0** | **₹0** | N/A (Free) | Free DDoS protection, SSL termination, Edge caching. |
| **Object Storage & Backups** | Cloudflare R2 | **₹0** | **₹0** | **Client** (Free Tier) | 10 GB free storage, 0 egress fee. Used for device photos, KYC ID scans & DB dumps. |
| **Staging Database** | MongoDB Atlas M0 | **₹0** | **₹0** | N/A (Free) | 512MB shared cluster for staging / dev testing. |
| **Production Database** | Self-hosted MongoDB on VPS | **₹0** | **₹0** | N/A (Host) | Containerized MongoDB with automated encrypted dumps to Cloudflare R2. Restore drill required before launch. *(Optional Atlas M10 upgrade: ~₹4,500/mo if client chooses)*. |
| **Cache & Queue** | Self-hosted Redis + BullMQ | **₹0** | **₹0** | N/A (Host) | Containerized Redis on client VPS. |
| **Email Dispatcher** | Resend / Brevo (Free Tier) | **₹0** | **₹0** | **Client** (Free Tier) | 3,000 emails/month free. Sufficient for MVP order confirmations and receipts. |
| **SMS Gateway (OTP Only)** | MSG91 + DLT Registration | ~₹500 / mo (OTP wallet) | ~₹5,000–₹6,000 (One-time) | **Client** | DLT entity & header registration fee varies by telecom operator (Jio / Airtel / Vodafone-Idea) — **verify exact fee on operator portal**. Prepaid OTP SMS bundle (~₹0.15/SMS). |
| **Payment Gateway** | Razorpay Standard Checkout | **₹0 Setup** | Standard PG fee (up to 2% + GST per txn) | **Client** | Standard transaction commission deducted automatically per successful buyer transaction. No fixed monthly fee. |
| **Push Notifications** | Google Firebase Cloud Messaging (FCM) | **₹0** | **₹0** | N/A (Free) | Free unlimited mobile push notifications for Capacitor Android app. |
| **Error Monitoring** | Sentry (Developer Free Plan) | **₹0** | **₹0** | N/A (Free) | 5,000 events/month free. Real-time exception capture on web and worker. |
| **Uptime Monitoring** | UptimeRobot | **₹0** | **₹0** | N/A (Free) | 50 monitors at 5-minute intervals checking `/api/health`. |
| **Google Play Console** | Google Play Developer Account | ₹0 | ₹2,100 ($25 one-time) | **Client** | One-time developer fee for publishing the Android APK/AAB. |
| **Legal Review of Terms & Policies** | Independent Legal Counsel | ₹0 | ~₹5,000–₹10,000 (One-time) | **Client** | Professional review of Privacy Policy (DPDP Act 2023), Terms of Use, and Return/Refund terms. |
| **Shiprocket Prepaid Wallet** *(Optional)* | Shiprocket | As used | ~₹1,000–₹2,000 (Initial recharge) | **Client** | Optional shipping wallet buffer for initial Buy order fulfillment if automated courier used. |
| **Operating & Scaling Contingency** | Unforeseen operational expenses | — | ~₹5,000–₹10,000 | **Client** | Safety buffer for server tuning, additional SMS credits, or emergency tooling. |
| **Total Estimated Launch Budget** | — | **~₹500 / mo** | **~₹18,000–₹29,000** | **Within ₹50k Cap** | **Fully compliant with the total ₹50,000 budget constraint.** |

---

## 2. Detailed Service Tier Specifications

### 2.1 Compute & Hosting (Client VPS)
- **Host:** Client-purchased VPS (KVM Linux, Ubuntu).
- **Plan & Specs:** **[CONFIRM WITH CLIENT]** (Targeting at least 4 vCPU, 8–16GB RAM for running Dockerized web, worker, redis, and mongo).
- **Topology:** Single-server containerized Docker Compose architecture:
  - `web`: Next.js standalone server
  - `worker`: Node.js BullMQ async worker
  - `redis`: Redis 7 alpine with AOF persistence (internal network only)
  - `mongo`: MongoDB 7 community edition with authentication (internal network only)
  - `nginx`: Reverse proxy with SSL renewal and gzip/brotli compression
- **Monthly Cost:** ₹0 (Pre-paid by client).

### 2.2 Cloudflare R2 (Asset & Backup Storage)
- **S3 API Compatibility:** Works with `@aws-sdk/client-s3`.
- **Free Tier Allowances:**
  - Storage: 10 GB-months free.
  - Class A Operations (Upload/Write): 1,000,000 operations/month free.
  - Class B Operations (Read/Download): 10,000,000 operations/month free.
  - Egress Fees: **₹0.00 (Zero Egress)**.
- **Monthly Cost:** ₹0.

### 2.3 MSG91 SMS & DLT Compliance
- **DLT Entity Approval:** Mandatory under TRAI regulations. One-time fee typically ranges between ~₹5,000–₹6,000 depending on the principal operator portal (Vilpower, Jio DLT, Airtel). Must be verified directly on the chosen portal.
- **DLT Headers:** Proposed 6-character header **`SLLBAR`** (or approved variant; must check availability on operator portal). Do not use `Sellbar`.
- **DLT Template:** Approved transactional/service implicit OTP template:
  > `{#var#} is your verification code for Sellbar. Valid for 5 minutes. Do not share this OTP with anyone.`
- **Monthly Cost:** ~₹500 (Pay-as-you-go prepaid wallet for verification OTPs only).

### 2.4 Resend Email Service
- **Free Allowance:** 100 emails/day (3,000 emails/month).
- **Domain Authentication:** SPF, DKIM, DMARC configured via Cloudflare DNS for `sellbar.in`.
- **Monthly Cost:** ₹0.

### 2.5 Razorpay Payment Gateway
- **Merchant Account:** Onboarded under client's company name and current bank account.
- **Fees:** Standard gateway pricing applies (up to 2% + 18% GST on transactions).
- **Monthly Cost:** ₹0 fixed.
