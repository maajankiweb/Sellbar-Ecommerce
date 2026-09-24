---
name: ecommerce-brand
description: React Bits Pro Agent Kit prompt for building high-converting e-commerce brand pages, product detail pages (PDP), and Direct-to-Consumer (DTC) storefront layouts with conversion levers, social proof, and mobile-first UX.
---

# React Bits Pro: Ecommerce Brand Agent Prompt

Use this architectural recipe and prompt guideline whenever designing or building high-converting Direct-to-Consumer (DTC) product pages, category showcases, or branded recommerce store layouts.

---

## 1. Core Conversion Philosophy

Every e-commerce brand page must balance **high visual desire** with **zero cognitive friction**:
1. **Answer Questions Before They Are Asked:** Clearly display warranty, return policy, delivery times, and grading criteria above the fold.
2. **Prominent Conversion Levers:** Instant savings badges, EMI calculator, trade-in bonus credits, and price comparisons against brand new retail.
3. **Unshakable Trust & Social Proof:** Verified customer ratings, certified lab test badges (e.g. 32-Point Quality Diagnostics), and authentic unboxing media.
4. **Mobile-First Ergonomics:** Sticky bottom action bar for effortless one-thumb checkout on mobile devices.

---

## 2. Standard Section Architecture

### A. Hero Section (Above the Fold)
- **Gallery:** Multi-angle image carousel with zoom capability, video unboxing preview tab, and condition grade badge overlay.
- **Product Title & Rating:** Clear model name, SKU/storage/colorway, and star rating badge (`★ 4.9 (420+ reviews)`).
- **Pricing & Value Proposition:**
  - Active Deal Price in bold (`₹XX,XXX`)
  - MRP / Showroom Price with strikethrough (`₹XX,XXX`)
  - Percentage Savings Tag (`SAVE 45%`)
  - No-Cost EMI options (`Starting at ₹X,XXX/mo`)
- **Variant Selectors:**
  - Condition Grade (e.g., *Fair*, *Superb*, *Like New*)
  - Storage / RAM configurations
  - Curated Colorway swatches
- **Primary CTA:** High-contrast `Buy Now` and `Add to Cart` buttons.
- **Micro-Assurances:** Bullet ribbon beneath CTA:
  - ✓ 1-Year Comprehensive Warranty
  - ✓ 15-Day Hassle-Free Replacement
  - ✓ Free Express Delivery & COD Available

### B. Sticky Mobile Action Bar
- On viewport scroll past the hero CTA:
  - Fix a clean floating bottom bar on mobile viewports (`z-40 fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3`).
  - Displays: Mini product thumbnail, active selected price, and full-width instant `Buy Now` CTA button.

### C. 32-Point Inspection & Certification Breakdown
- Interactive accordion or bento grid showing tested hardware components:
  - Display & Touch (TrueTone, Refresh Rate, Dead Pixels)
  - Camera & Sensors (Optical Stabilization, LiDAR, FaceID)
  - Battery Health Audit (90%+ OEM capacity verified)
  - Connectivity & Ports (5G bands, WiFi 6, Type-C charging speed)

### D. Social Proof & Unboxing Video Reviews
- Curated video unboxing player with duration, view counts, and tested pros/cons.
- Wall of Love / Marquee ticker of verified buyers and sellers with photos and city locations.

### E. Frequently Asked Questions (Objection Handling)
- Targeted Q&A addressing:
  - *"How does the 1-year warranty work?"*
  - *"What accessories are included in the box?"*
  - *"How is my old device data wiped before resale?"*

---

## 3. Implementation Code Checklist

When implementing an E-Commerce Brand block or page:
- [ ] Ensure **Accessible ARIA labels** on all variant selectors, quantity toggles, and image thumbnails.
- [ ] Implement **Schema.org Product & Offer structured JSON-LD markup** for Google Rich Results.
- [ ] Use **Native Image Optimization** (`next/image` or responsive `srcset`) to avoid layout shifts (CLS < 0.05).
- [ ] Provide **Cart State Reactivity** via React context or state management for real-time item counter updates.
