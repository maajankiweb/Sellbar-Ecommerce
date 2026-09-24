# React Bits Pro: @reactbits-pro/prompt-ecommerce-brand

High-converting Direct-to-Consumer (DTC) E-Commerce Brand Page Prompt & Blueprint.

## Overview
This prompt guides AI assistants and engineers to construct high-converting product pages with:
- **Conversion Levers:** Warranty, return policy, delivery times, price comparison vs new retail.
- **Variant Selectors:** Grade condition, storage, RAM, color swatches.
- **Trust & Social Proof:** 32-point diagnostics checklist, unboxing videos, customer marquee wall of love.
- **Mobile-First UX:** Sticky bottom Add-to-Cart bar for seamless one-thumb checkout.

## Registry Integration
Configured in `components.json`:
```json
"registries": {
  "@reactbits-pro": {
    "url": "https://pro.reactbits.dev/r/{name}.json",
    "headers": {
      "Authorization": "Bearer $REACTBITS_LICENSE_KEY"
    }
  }
}
```
