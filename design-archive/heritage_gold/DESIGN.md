---
name: Heritage Gold
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4d4632'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#7f775f'
  outline-variant: '#d0c6ab'
  surface-tint: '#715d00'
  primary: '#715d00'
  on-primary: '#ffffff'
  primary-container: '#ffd400'
  on-primary-container: '#705c00'
  inverse-primary: '#ebc300'
  secondary: '#0062a0'
  on-secondary: '#ffffff'
  secondary-container: '#64b3ff'
  on-secondary-container: '#004472'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#d8d8d8'
  on-tertiary-container: '#5c5e5e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe177'
  primary-fixed-dim: '#ebc300'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#554500'
  secondary-fixed: '#d0e4ff'
  secondary-fixed-dim: '#9ccaff'
  on-secondary-fixed: '#001d35'
  on-secondary-fixed-variant: '#00497a'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality for this design system is rooted in utility and local expertise. It is designed to feel authoritative yet highly accessible, mirroring the heritage of classic physical directories while utilizing modern digital efficiencies. The target audience includes local residents seeking reliable services and business owners looking for professional visibility.

The design style follows a **Modern Corporate** approach with a utility-first mindset. It prioritizes information density and clarity through a structured grid, high-contrast typography, and a "search-centric" interface. The UI evokes a sense of organized abundance—providing deep archives of data without overwhelming the user through clear visual grouping and logical information architecture.

## Colors

The palette is anchored by a high-visibility Golden Yellow, used strategically for primary search actions and brand identifiers to drive immediate focus. 

- **Primary (Golden Yellow):** Reserved for the main 'Find' or 'Search' actions and key brand touchpoints.
- **Secondary (Professional Blue):** Used for links, business-critical CTAs (e.g., "Claim Listing"), and secondary navigation to establish professional trust.
- **Surface:** A "Clean White" (#FFFFFF) base for primary content, contrasted with "Soft Slate" (#F8F9FA) for background containers and sidebar areas to define sections without heavy lines.
- **Text:** Headlines use a deep "Onyx Black" (#1A1A1A) for maximum legibility. Body copy uses "Charcoal" (#4A4A4A) to reduce visual fatigue during long browsing sessions.

## Typography

This design system utilizes a dual-font strategy to balance character with utility. **Manrope** provides a modern, geometric feel for headlines, ensuring business names and section titles appear bold and definitive. **Inter** is used for all functional text, data points, and body copy due to its exceptional legibility at small sizes.

- **Headlines:** Use Bold or Extra-Bold weights. High contrast in size between business titles and supporting metadata is required to aid quick scanning.
- **Links:** Always rendered in Secondary Blue, typically in the `body-md` role with a semibold weight.
- **Data Labels:** Use `label-bold` for metadata headers (e.g., "CUISINES", "HOURS") to create a structured, "directory" feel.

## Layout & Spacing

The layout uses a **Fixed Grid** system for desktop (12 columns) and a **Fluid Grid** for mobile (4 columns). 

- **The Main Search Bar:** Centrally featured in the hero or top-pinned in results pages, utilizing a dual-input model (Service/What | Location/Where).
- **Result Layout:** A two-column structure on desktop where the left column (approx. 70%) houses business listings and the right column (30%) is reserved for filters, maps, or featured local ads.
- **Vertical Rhythm:** A strict 8px-based spacing system is used to maintain a clean, professional density. Business cards are separated by 16px of vertical space to ensure individual cards are easily distinguishable.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 

- **Primary Surface:** White (#FFFFFF) cards sit on a Light Gray (#F2F2F2) background.
- **Borders:** Subtle 1px borders (#E0E0E0) define the edges of cards and input fields.
- **Active State:** A subtle "lifting" effect is achieved using a very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) when a user hovers over a business listing, signaling interactivity without breaking the flat aesthetic.
- **Search Header:** Uses a solid bottom border or a direct tonal change to separate the navigation/search area from the results content.

## Shapes

The shape language is conservative and professional. A **Soft** roundedness (0.25rem / 4px) is applied to all standard UI elements including cards, input fields, and standard buttons. 

- **Buttons:** Primary and secondary buttons use the standard 4px radius.
- **Input Groups:** Search inputs that are joined (What + Where + Find) should have rounded outer corners and sharp inner corners where they meet, creating a single cohesive unit.
- **Tags/Chips:** Category labels (e.g., "Restaurants") may use a slightly higher radius (8px) to distinguish them from functional buttons.

## Components

### Business Cards
The core of the directory. Features a 100x100px thumbnail on the left, followed by the business name (Headline-md in Blue), Star Rating (Primary Yellow), and Category. Contact info and "View Details" CTA sit on the right-hand side or bottom depending on screen width.

### Dual-Input Search Bar
A prominent component where the 'Service' input and 'Location' input are separated by a vertical divider. The 'Find' button is pinned to the right, styled in Primary Golden Yellow with bold black text.

### Buttons
- **Primary:** Golden Yellow background, Black text. Used for Search.
- **Secondary:** Professional Blue background, White text. Used for "Claim Listing" or "Contact."
- **Outline:** 1px gray border, Blue text. Used for "View Details" or secondary actions.

### Sidebar Filters
Clean vertical lists with checkboxes for categories, ratings, and features. Headers for filter groups use the `label-bold` typography style.

### Star Ratings
Icons should be solid Primary Yellow (#FFD400). Empty stars use a light gray outline. Display the numeric count of reviews in `body-sm` next to the stars.