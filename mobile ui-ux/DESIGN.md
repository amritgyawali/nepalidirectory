---
name: Optical Precision
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464650'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777681'
  outline-variant: '#c7c5d1'
  surface-tint: '#555996'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0f134f'
  on-primary-container: '#7a7fbe'
  inverse-primary: '#bfc2ff'
  secondary: '#006a62'
  on-secondary: '#ffffff'
  secondary-container: '#91f4e8'
  on-secondary-container: '#007169'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bfc2ff'
  on-primary-fixed: '#0f134f'
  on-primary-fixed-variant: '#3d417c'
  secondary-fixed: '#91f4e8'
  secondary-fixed-dim: '#74d7cc'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  border-subtle: '#E2E8F0'
  surface-muted: '#FBFBFC'
  accent-gold: '#B3905F'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  stack-sm: 0.5rem
  stack-md: 1.5rem
  stack-lg: 4rem
---

## Brand & Style

This design system is built for a high-performance e-commerce environment, prioritizing clarity, trust, and fashion-forward utility. The brand personality is **Professional, Curated, and Accessible**, blending the precision of optometry with the vibrancy of a lifestyle brand.

The chosen aesthetic is **Minimalist / Corporate Modern**. It utilizes a rigorous layout structure, generous whitespace, and a high-contrast palette to ensure the product (eyewear) remains the hero. The interface is intentionally "invisible," serving as a clean gallery that guides the user through complex choices without cognitive overload. It avoids decorative clutter in favor of crisp borders, purposeful typography, and a systematic approach to density.

## Colors

The palette is anchored by a deep **Navy Primary (#000042)**, which provides a sense of authority and traditional reliability. This is contrasted against a stark **High-Contrast White** background to maintain a "clean-room" medical feel. 

- **Primary:** Used for the brand header, primary buttons, and critical UI anchors.
- **Secondary:** A vibrant teal used sparingly for accents, "Virtual Try-On" indicators, or price callouts.
- **Neutral:** A range of cool grays used for hair-line borders and background sectioning to distinguish different product categories without using heavy shadows.

## Typography

The typography system relies exclusively on **Plus Jakarta Sans** for its contemporary, geometric, yet friendly personality. The scale is designed to create a strong editorial hierarchy.

- **Headlines:** Large and assertive. For promotional sections, headlines use negative letter-spacing to feel more compact and fashionable.
- **Body:** Optimized for legibility at 16px, with ample line height to ensure ease of reading during long browsing sessions.
- **Labels:** Small-caps or heavy-weight uppercase labels are used for metadata, such as frame size or material details, to distinguish them from descriptive copy.

## Layout & Spacing

The design system employs a **Fixed Grid** model on desktop and a **Fluid Grid** on mobile. 

- **Grid:** A 12-column system is used for product listings, where cards typically span 3 columns (4 per row) on desktop, 4 columns (3 per row) on tablet, and 6 columns (2 per row) on mobile.
- **Rhythm:** Vertical spacing is generous. Large "stack-lg" units are used between major content sections (e.g., between the hero banner and the category icons) to allow the design to "breathe."
- **Promotional Banners:** These are always full-width to break the grid's vertical flow and create high-impact visual moments.

## Elevation & Depth

This system avoids heavy shadows to maintain its minimalist aesthetic. Instead, it uses **Tonal Layers** and **Low-contrast outlines**.

- **Cards:** Product cards sit on the base background with a 1px border (#E2E8F0). They do not have shadows in their resting state.
- **Hover States:** On hover, cards may receive a very soft, diffused ambient shadow (10% opacity) to indicate interactivity.
- **Header:** The header is fixed to the top and uses a subtle bottom border rather than a shadow to separate itself from the scrolling content.
- **Modals:** Use a heavy backdrop blur (12px) to focus the user’s attention on the selection process (e.g., lens selection).

## Shapes

The shape language is primarily **Soft (Level 1)**. 

While the general UI (buttons, cards, inputs) uses subtle 4px corner radii, specific elements like **Category Icons** are strictly circular (pill-shaped) to provide a friendly, organic contrast to the rigid grid. This mix of geometric precision and circular accents mirrors the product itself: the structure of frames and the curves of lenses.

## Components

### Header & Navigation
The header is a multi-tier component. The top tier contains utilities (Track Order, Sign In). The middle tier contains the logo and a wide, centered search bar with an internal search icon. The bottom tier is a clean text-link navigation for categories (Eyeglasses, Sunglasses, etc.).

### Category Icons
Represented as circles with minimalist line-art iconography of different frame styles. Labels are centered directly beneath the circle in `label-md`.

### Product Cards
Cards feature a high-resolution image on a light gray or white background. Product details (Brand, Title, Price) are left-aligned. A "Heart" icon for favorites is positioned in the top-right corner.

### Buttons
- **Primary:** Solid Primary Navy background with white text. No border.
- **Secondary:** White background with a 1px Primary Navy border.
- **CTAs on Banners:** Pill-shaped buttons with high-contrast colors (e.g., White on dark images).

### Input Fields
Search and form inputs use the `surface-muted` background with a subtle border. Focus states are indicated by a 1px Primary Navy border and no "glow" effect.

### Promotional Banners
Full-bleed images with center-aligned or left-aligned typography. Typography on banners should use `headline-xl` to create immediate visual impact.