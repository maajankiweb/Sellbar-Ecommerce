# SELBAR Mobile-First Responsive Design System & Breakpoint Architecture

## 1. Executive Summary & Design Preservation Guarantee

This document defines the responsive architecture for the SELBAR recommerce platform.
The primary directive is **Strict Desktop Design Preservation**:
- The desktop viewport (**1024px and above**) remains **100% pixel-perfect and visually identical** to the existing production specification.
- No colors, typography, desktop margins, grid structures, or desktop mega-menus have been altered.
- Responsive behavior is achieved purely through a **Mobile-First progressive enhancement strategy**, establishing base styles for 320px+ viewports and progressively expanding for tablet (768px–1023px) and desktop (1024px+).

---

## 2. Breakpoint Specifications

| Viewport Category | Breakpoint Range | Target Devices | Layout Adaptation Strategy |
| :--- | :--- | :--- | :--- |
| **Mobile (Base)** | `0px – 767px` | iPhone SE (320px), iPhone 13/14/15/16 (375–393px), Samsung Galaxy S-series, Pixel | Single-column & 2-column fluid grids, full-width search, collapsible slide-over menu drawer, persistent thumb-friendly bottom bar. |
| **Tablet** | `768px – 1023px` (`md:`) | iPad Mini, iPad 10.2", iPad Air, Android Tablets | 2 to 4 column grids, horizontal scroll carousels with arrow navigation, compact search bar, collapsible hamburger navigation. |
| **Desktop (Untouched)** | `1024px – 1279px` (`lg:`) | MacBooks, 13"/14" Laptops, Desktop Monitors | **Identical to original desktop specification**: Full multi-tier mega navigation, central search bar, multi-column desktop grids. |
| **Large Desktop** | `1280px+` (`xl:` & `2xl:`) | High-resolution displays, iMacs, 4K monitors | Centered container (`max-w-7xl` / `1280px`), balanced margins, identical visual hierarchy. |

---

## 3. Touch-Friendly Interactions & Accessibility (WCAG 2.5.5)

### 3.1 44×44px Minimum Tap Targets
In adherence to WCAG 2.5.5 Target Size guidelines and Apple Human Interface Guidelines:
- Mobile bottom navigation bar items adhere to `min-height: 44px`.
- Hamburger menu toggles and drawer action buttons enforce `min-height: 44px` and `min-width: 44px`.
- All touch interactive elements on mobile devices receive:
  ```css
  @media (pointer: coarse) {
    button, [role="button"], .touch-target {
      min-height: 44px;
      min-width: 44px;
    }
  }
  ```

### 3.2 iOS Safari Auto-Zoom Prevention
On mobile viewports (`< 768px`), iOS Safari automatically zooms in on any input element with a font size smaller than 16px, causing page layout disorientation.
- Global rule configured in [globals.css](file:///f:/Project%20My%20Agency/SELBAR/Website/src/app/globals.css):
  ```css
  @media (max-width: 767px) {
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="number"],
    input[type="tel"],
    input[type="search"],
    select,
    textarea {
      font-size: 16px !important;
    }
  }
  ```
- On desktop viewports (`>= 768px` / `1024px`), inputs revert to their intended desktop sizing (`text-xs` / `text-sm`).

### 3.3 Modern Bezel-Less Safe Area Insets
Modern smartphones (iPhone notch/Dynamic Island and Android gesture bars) require safe area clearance:
```css
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```
The mobile sticky navigation bar integrates `pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]` so touch gestures never collide with the OS home indicator.

---

## 4. Responsive Image & Media Architecture

To prevent Cumulative Layout Shift (CLS) and horizontal overflow:
1. **Fluid Containment**:
   ```css
   img, video, canvas, svg {
     max-width: 100%;
     height: auto;
     vertical-align: middle;
   }
   ```
2. **Aspect Ratio Preservation**:
   - Product thumbnails and banners maintain explicit aspect ratios (`aspect-square`, `aspect-[4/3]`, `aspect-[16/9]`).
   - Image elements utilize `object-contain` or `object-cover` to prevent distortion across device orientations.
3. **Remote CDN Optimization**:
   - [next.config.ts](file:///f:/Project%20My%20Agency/SELBAR/Website/next.config.ts) configured with `remotePatterns` supporting all image domains over HTTPS without quality degradation or blocking.

---

## 5. Navigation Strategy Across Breakpoints

### Mobile & Tablet (< 1024px)
- **Top Bar**: Simplified brand logo, location picker, login/profile avatar, and 44x44px hamburger toggle.
- **Secondary Search**: Full-width compact search bar below the top bar.
- **Drawer**: Slide-out panel featuring direct category links, account links, and support options with touch targets.
- **Bottom Navigation**: Persistent 5-button bottom bar (Home, Sell, Buy, Repair, Cart) placed in the ergonomic thumb zone.

### Desktop (1024px+)
- **Desktop Mega Navigation**: Full Cashify-style 2-panel flyout mega menu strip with All, Sell, Buy, Repair, and Services.
- **Central Search Bar**: Integrated voice search, scanner icon, and autocomplete dropdown.
- **Bottom Navigation**: Automatically hidden (`lg:hidden`), restoring normal full-page footer layout.

---

## 6. Zero Horizontal Overflow Guarantee

Horizontal scrolling on mobile breaks user trust and fails accessibility tests:
- `html` and `body` configured with `overflow-x: hidden; max-width: 100vw;`.
- Container wrappers utilize `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` to ensure consistent horizontal margins across all viewports.
