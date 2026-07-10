# Images — nepalidirectory.com

**Score: 78/100**

## What works
- All 301 `<img>` tags across the 103 crawled pages have non-empty `alt` text (0 missing, verified via crawl-data.json).
- Images are served through `next/image` (`data-nimg="fill"`), with full responsive `srcset` (384w–3840w breakpoints), `loading="lazy"`, and `decoding="async"`.
- Automatic modern-format negotiation confirmed: requesting `/_next/image?...` with `Accept: image/avif,image/webp` returns `Content-Type: image/webp` — no manual WebP/AVIF conversion needed.
- OG image tags are present with explicit `width`/`height`/`alt` on both the homepage and blog posts (e.g. `/blog/kathmandu-newari-food` → 1200×675 Unsplash photo, proper alt text).

## Findings

### High — All imagery is generic stock photography, not real business/local photos
**Description:** Every hero/card image sampled (homepage city cards, blog post covers, category images) is sourced from `images.unsplash.com` — stock photography, not photos of actual Nepali businesses, dishes, or locations. This is consistent across city pages, compare-business category pages, and blog posts.
**Recommendation:** Once real business listings exist (see Critical sitemap/routing finding), prioritize owner-uploaded photos for listing pages — stock imagery undermines trust/E-E-A-T for a "verified local directory" positioning and is a missed differentiation opportunity against generic aggregators. Keep stock photography only for illustrative blog/editorial content where it's clearly editorial rather than representing a specific business.

### Medium — Homepage OG image is just the 512×512 logo, not a branded social card
**Description:** `og:image` on the homepage is `logo.svg` at 512×512 — undersized and generic for link previews on X/Facebook/LinkedIn/WhatsApp (Nepal has high WhatsApp link-sharing usage), which render best at 1200×630.
**Recommendation:** Generate a dedicated 1200×630 branded OG image for the homepage (and any page currently falling back to the logo) showing the product value prop, not just the logo mark.

### Low — Reliance on a third-party image host (Unsplash) for production imagery
**Description:** All current images are hotlinked/proxied from `images.unsplash.com` via `next/image`'s remote pattern allowlist. This is fine for placeholder/demo content but creates a dependency on Unsplash's availability and licensing terms for what may become permanent content (e.g., city hero images).
**Recommendation:** Migrate city/category hero images to self-hosted or CDN-owned assets before this becomes permanent production content; reserve Unsplash for clearly-attributed editorial use only.

## Quick wins
1. Generate a proper 1200×630 branded OG/social image for the homepage and key static pages.
2. Add an explicit `sizes` audit pass once real listing photos exist, to avoid over-fetching large breakpoints on listing card grids.
3. Plan owner-photo-upload as part of the listing-claim flow so real listings ship with real photos from day one, not stock placeholders.
