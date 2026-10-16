# SELBAR — Product Requirements Document (PRD)
**Product:** SELBAR — Sell, Buy, Repair & Recycle Electronics Platform
**Platforms:** Responsive Website + Native Android App
**Version:** 1.0 (MVP → v1.1 roadmap included)
**Prepared for:** Maajanki Web Tech
**Reference model:** Cashify.in teardown (see companion research doc)

---

## 1. EXECUTIVE SUMMARY

SELBAR is a recommerce platform for India that lets users **sell** old smartphones/laptops/tablets/gadgets for instant cash via doorstep pickup, **buy** quality-checked refurbished devices at a discount, **repair** devices at authorized centres, and **recycle** end-of-life electronics responsibly. The platform launches as a **website (web-first, mobile-responsive)** plus a **native Android app**, sharing one backend and one pricing engine.

**Samjho (Hinglish):** SELBAR bilkul Cashify jaisa hi model follow karega — lekin apni brand identity, apna pricing engine config, aur shuruaat mein 1-2 focus cities/states (jaise Bihar/UP) ke saath launch karenge, phir scale karenge. MVP mein "Sell Phone" + "Buy Refurbished Phone" hi core hoga; baaki (laptop, TV, repair, B2B) phase-2/3 mein add hoga.

---

## 2. PRODUCT VISION & GOALS

**Vision:** "Har purana device SELBAR par ek fair price paaye — bina bhaag-daud, bina bargaining, bina wait ke."

**Goals (Year 1):**
- G1: Launch Sell + Buy flow for mobile phones in target cities within MVP timeline.
- G2: Achieve <5-minute average time-to-quote and <3% sell-flow abandonment increase per screen.
- G3: Build trust fast — data-wipe guarantee, transparent pricing, instant payment — to compete credibly against Cashify/local dealers from day one.
- G4: Android app parity with web for the sell-flow within 60 days of web launch.
- G5: Lay groundwork for B2B/franchise ("SELBAR Partner") model by Q3.

---

## 3. TARGET USERS / PERSONAS

| Persona | Description | Key need |
|---|---|---|
| **Seller Suresh** | 25–40, tier-2/3 city, owns 1–2 old phones lying unused | Fair price, no bargaining, doorstep convenience, trust that data is wiped |
| **Buyer Priya** | Budget-conscious student/young professional | Affordable phone with real warranty, confidence it's not "junk" |
| **Repair Ramesh** | Cracked screen/battery issue, wants quick fix | Nearby service point, transparent pricing, quick turnaround |
| **Partner Praveen** | Local mobile-shop owner | Wants SELBAR's pricing engine/API to quote confidently to his own walk-in customers (Phase 2/3) |

---

## 4. BUSINESS MODEL & REVENUE STREAMS

1. **Buyback spread** — buy low (from sellers), refurbish, resell higher.
2. **Refurbished device sales margin** (B2C).
3. **Repair service fees.**
4. **Recycle** — compliance-linked revenue + material recovery (low priority in MVP).
5. **Phase 3: B2B/Partner API licensing** — white-labelled pricing engine for local shops (SELBAR Partner Program).

---

## 5. SCOPE

### 5.1 MVP scope (Phase 1 — Website + Android App)
**In scope:**
- Sell flow: Mobile phones only (brand → model → variant → condition questionnaire → instant quote → pincode check → schedule pickup → OTP login → order confirmation → order tracking).
- Buy flow: Refurbished mobile phones listing + PDP + cart + checkout + order tracking.
- Account: OTP-based login/signup, order history (sell + buy), saved addresses.
- Admin panel: pricing config, order management, executive assignment, inventory/condition-grading for refurb stock.
- Content: Homepage, FAQ, About, Terms/Privacy/Refund/Warranty/E-waste policy pages, basic store locator (if physical presence exists) or "no stores yet" state.
- Notifications: SMS + push (Android) at each order-state change.

**Out of scope for MVP** (explicitly deferred):
- Laptop/tablet/smartwatch/TV/gaming console sell & buy categories (Phase 2).
- Repair service booking flow (Phase 2).
- Recycle flow (Phase 2).
- B2B/Corporate/Partner program & franchise API (Phase 3).
- iOS app (decide post Android traction).
- AI photo-based condition assessment (Phase 2/3 innovation feature).
- Carbon-footprint tracker, subscription upgrade program (Phase 3 innovation features).
- Multi-language UI beyond English + Hindi (Phase 2).

### 5.2 Phase 2 (Months 4–6)
- Add device categories: Laptop, Tablet, Smartwatch.
- Repair booking flow (screen/battery/charging port — top 3 issues first).
- Recycle flow.
- Hindi language toggle.
- Referral & Earn program.
- Basic AI photo-upload for condition pre-check (reduce questionnaire length).

### 5.3 Phase 3 (Months 7–12)
- B2B/Partner program (SELBAR Partner) with pricing-engine API.
- Additional categories: TV, DSLR, gaming consoles, smart speakers, earbuds.
- iOS app.
- Carbon-footprint tracker + shareable impact card.
- Subscription-based upgrade program.
- Corporate/enterprise buyback contracts.

---

## 6. FUNCTIONAL REQUIREMENTS

### 6.1 Sell Flow (Web + Android — MVP, mobile phones)
| ID | Requirement |
|---|---|
| FR-S1 | User can search/select brand and model from a searchable, image-backed list. |
| FR-S2 | User selects storage/RAM variant via pill buttons; price context updates accordingly. |
| FR-S3 | Condition questionnaire presented one-question-per-screen (mobile) with large tappable option cards; auto-advance on single-select answers. |
| FR-S4 | System computes an instant price using the pricing engine (base price table + deduction rules based on condition answers). |
| FR-S5 | Price screen shows collapsible itemized breakdown (base value, deductions, final price) and a quote-validity window (e.g., 72 hours). |
| FR-S6 | Pincode/serviceability check runs inline without page reload; non-serviceable pincodes show a "notify me" capture instead of a dead end. |
| FR-S7 | User schedules pickup: date (next 5 days), time slot (Morning/Afternoon/Evening), address (saved or new), preferred payout mode (UPI/Bank/Cash/Voucher). |
| FR-S8 | Authentication (mobile OTP) required only at final confirmation step, not earlier in the funnel. |
| FR-S9 | Order confirmation screen shows Order ID, pickup window, "what to keep ready" checklist. |
| FR-S10 | Order tracking timeline: Order Placed → Pickup Scheduled → Executive Assigned → Device Inspected → Payment Completed, each with timestamp. |
| FR-S11 | At physical inspection, if declared condition doesn't match actual condition, ops app generates a line-item revised price; user (via app/SMS link) accepts or cancels with no penalty. |
| FR-S12 | On payment completion, system emails/SMS a receipt and a data-wipe certificate PDF. |
| FR-S13 | Post-sale: rating/review prompt + referral-code nudge. |

### 6.2 Buy Flow (Web + Android — MVP, refurbished mobile phones)
| ID | Requirement |
|---|---|
| FR-B1 | Listing page with filters: brand, price range, condition grade (Fair/Good/Superb), RAM/storage, discount %, and sort options. |
| FR-B2 | Product detail page shows condition-grade tabs each with its own price, star rating, 32-point QC badge, warranty badge, replacement-window badge, image gallery, full specs, and reviews. |
| FR-B3 | Add to cart → mini-cart drawer → checkout (address, delivery slot, payment mode: UPI/card/COD-if-supported/EMI-phase2). |
| FR-B4 | Order confirmation + delivery tracking timeline (Packed → Shipped → Out for Delivery → Delivered). |
| FR-B5 | Post-delivery return/replacement request flow within the stated window (e.g., 15 days), reachable from order details. |

### 6.3 Account & Auth
| ID | Requirement |
|---|---|
| FR-A1 | Mobile-OTP-first login/signup; email as fallback. |
| FR-A2 | "My Orders" unifies sell orders, buy orders (Phase 2: repair tickets) with status badges. |
| FR-A3 | Saved addresses, masked payment-method history. |
| FR-A4 | Logout, session expiry, re-auth via OTP. |

### 6.4 Admin/Ops Panel (internal, web-only)
| ID | Requirement |
|---|---|
| FR-AD1 | Pricing config: base price table per model/variant, deduction rules per condition answer — editable without a code deploy. |
| FR-AD2 | Order management: view/filter all sell & buy orders, assign pickup executive, update order state. |
| FR-AD3 | Refurb inventory management: intake device, assign condition grade after QC, set resale price, publish/unpublish listing. |
| FR-AD4 | Basic reporting: daily orders, GMV, funnel drop-off by step (from analytics events). |
| FR-AD5 | Dispute/refund workflow queue. |

### 6.5 Content & Trust
| ID | Requirement |
|---|---|
| FR-C1 | Homepage, category landing pages, FAQ (segmented: Sell/Buy/Repair), About, Terms, Privacy, Refund, Warranty, E-waste policy pages. |
| FR-C2 | Trust strip (Free Pickup / Instant Payment / Data Wipe Certified / Warranty) present on homepage, sell-flow, and buy PDP. |
| FR-C3 | Testimonials with photo, name, city, rating — manageable via admin. |

### 6.6 Notifications
| ID | Requirement |
|---|---|
| FR-N1 | SMS notification at: order placed, pickup confirmed, executive assigned, payment completed, delivery shipped/delivered. |
| FR-N2 | Android push notification mirrors all SMS events for app users, plus in-app notification center. |

---

## 7. KEY USER FLOWS (summary — full step detail in companion research doc, Part 3)
1. **Sell flow:** Brand→Model→Variant → Condition Q&A → Price reveal → Pincode check → Schedule pickup → OTP login → Confirmation → Tracking → Inspection/Payout → Post-sale.
2. **Buy flow:** Browse/filter → PDP → Cart → Checkout → Confirmation → Delivery tracking → (optional) Return/Replace.

---

## 8. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|---|---|
| **Performance** | Web: LCP <2.5s, CLS <0.1 on 4G mobile. Android app: cold start <2.5s, screen transitions <300ms. |
| **Availability** | 99.5% uptime target for MVP (single-region), 99.9% target post Phase-2 scale-out. |
| **Security** | HTTPS everywhere, OTP-based auth, PII encryption at rest (address, phone, ID scans), PCI-DSS-compliant payment handling via gateway (no card data touches SELBAR servers), role-based access for admin panel. |
| **Data privacy** | Compliant with India's DPDP Act 2023 — consent capture, data retention policy, right-to-erasure support for user data on request. |
| **Accessibility** | WCAG 2.1 AA on web; Android app follows Android Accessibility guidelines (TalkBack support, min 48dp touch targets, content descriptions on all icons). |
| **Scalability** | Architecture must support horizontal scaling of the pricing/quote service and order service independently (these are the two highest-traffic paths). |
| **Localization** | English at MVP; Hindi toggle in Phase 2; architecture must support i18n from day one (no hardcoded strings). |
| **Auditability** | All price overrides, refunds, and manual order-state changes logged with admin user ID + timestamp. |

---

## 9. SUCCESS METRICS / KPIs

| Metric | MVP target |
|---|---|
| Time-to-quote (median) | < 90 seconds |
| Sell-flow completion rate (quote → pickup scheduled) | ≥ 35% |
| Quote-to-inspection price variance | < 10% of orders with >15% price revision |
| Buy-flow conversion (PDP view → order) | ≥ 2% |
| Android app crash-free sessions | ≥ 99% |
| App install → first sell-quote generated | ≥ 20% of installs within 7 days |
| Customer support first-response time | < 4 business hours |

---

## 10. ASSUMPTIONS & CONSTRAINTS

- MVP launches in a limited set of cities/pincodes (owner-defined at launch) where doorstep pickup can be reliably staffed — either via in-house executives or a third-party logistics/gig partner.
- Refurbished inventory at MVP launch will be sourced from SELBAR's own buyback pipeline plus a small seed stock (owner to confirm sourcing plan) — buy-flow cannot outpace actual inventory.
- Payment payouts require a business current account + payment gateway merchant account (Razorpay/Cashfree) to be active before launch.
- IMEI blacklist-check API and data-wipe certification tooling are third-party dependencies — must be contracted before Phase 1 code-complete.
- Android app is native (not a WebView wrapper) for MVP to ensure push notifications, camera-based condition photo capture (Phase 2), and offline order-status caching work reliably.

---

## 11. OUT OF SCOPE (MVP)
- iOS app
- Multi-language beyond English/Hindi
- B2B/enterprise portal
- AI-based image condition scoring
- Carbon-footprint tracking
- Subscription/EMI-based upgrade program
- Physical retail store management module

---

## 12. RELEASE PLAN / MILESTONES (indicative)

| Milestone | Scope | Target |
|---|---|---|
| M0 — Design freeze | Final Stitch/Figma designs, DESIGN.md locked | Week 2 |
| M1 — Backend + pricing engine MVP | Auth, pricing config, order service | Week 6 |
| M2 — Website MVP | Sell + Buy flow live on web (staging) | Week 9 |
| M3 — Android app MVP | Sell + Buy flow parity on Android | Week 13 |
| M4 — Private beta | Limited pincodes, real transactions | Week 14 |
| M5 — Public launch | Web + Android live, marketing push | Week 16 |
| M6 — Phase 2 kickoff | Repair + Recycle + new categories | Week 20 |

---

*Companion document: SELBAR-TRD.md (Technical Requirements Document) — covers architecture, API design, database schema, Android app tech stack, and third-party integrations in implementation detail.*
