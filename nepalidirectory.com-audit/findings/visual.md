# Visual / Mobile — nepalidirectory.com

**Score: 68/100**

Screenshots captured (desktop/laptop/tablet/mobile) for homepage, `/city/kathmandu`,
`/compare-business/restaurants`, and `/business/newa-lahana` — saved under
`nepalidirectory.com-audit/screenshots/`.

## What works
- **Homepage above-the-fold is strong**: full-bleed hero photo (Boudhanath Stupa), clear
  headline ("Find trusted local businesses across Nepal"), a functional-looking 3-field search bar
  (what/where/category) with a high-contrast yellow CTA, and quick popular-search chips
  ("Restaurants near me," "Emergency plumbers," "Dentists open now"). This reads as a credible,
  modern directory homepage on both desktop and mobile.
- **The one live business page (`/business/newa-lahana`) is genuinely well-designed**: verified
  badge, "18 years in business" trust signal, breadcrumb navigation, rating/review count, hours
  with live open/closed state, amenity tags, deals/coupons block, owner profile card ("Sumesh
  Maharjan, Chef-owner, Claimed and owner-managed listing"), and clear contact/directions/quote
  CTAs in a sticky-feeling sidebar. If this is the template for future listings once the routing
  bug is fixed, the visual design bar is already high.
- Category hub pages (e.g. `/compare-business/restaurants`) use a "Quick answer" callout pattern
  on mobile that summarizes the page's recommendation up front — good for scannable mobile UX and
  doubles as AI-citable content (ties into the GEO findings).

## Findings

### High — "Super Admin" is a persistent link in the public mobile navigation menu on every page
**Description:** Confirmed across all 4 captured mobile screenshots (homepage, business page,
compare-restaurants page, city page) — the mobile nav menu renders "Super Admin" as a top-level
item alongside "Find People," "Deals," "Add Business," etc., visible to any visitor who opens the
mobile menu. It is **not** present in the equivalent desktop header (desktop shows Find People,
Deals, Add Business, Advertise, Write a Review, Log In, Sign Up — no Super Admin link visible).
This is inconsistent between breakpoints and, more importantly, puts a direct link to the internal
admin panel in front of every mobile visitor. The page itself is `noindex,nofollow` and appears to
have a client-side auth gate (per the Technical findings), but a public nav link actively invites
exploration/probing of an admin surface that should not be discoverable at all outside an internal
tool or bookmark.
**Recommendation:** Remove the "Super Admin" link from the public mobile nav entirely; access it
via a direct URL known only to admins, or gate the nav item itself behind an authenticated session
check so it only renders for logged-in admins.

### High — The `priceRange` schema bug is also a visible, customer-facing UI bug
**Description:** The business page displays **"Rs Rs Rs"** directly in the UI next to the rating
(next to "4.7 ★★★★★ (842 reviews)"). This is the same malformed value flagged in
`findings/schema.md` as a structured-data issue — but it's not schema-only, real users see this
exact broken-looking price-tier indicator on the page. It reads as a bug, not a stylistic choice
(compare to the universally-understood "$$$" convention).
**Recommendation:** Same fix as the schema finding — this is one bug with two symptoms (visible
UI + structured data), fix it once at the source (likely a shared price-tier formatting helper).

### Medium — Mobile nav menu is a full-page stacked list, not a compact overlay/drawer
**Description:** On mobile, opening the nav pushes 8 stacked items (Find People, Deals, Add
Business, Advertise, Write a Review, Super Admin, Log In, Sign Up) plus a full-width "Sign Up"
button before any page content is visible — roughly 580px of vertical space on a 750px-wide
screenshot before the hero/search content begins. This is usable but heavier than a typical
compact mobile drawer/hamburger pattern, and increases the scroll distance to reach primary
content when the menu is engaged.
**Recommendation:** Consider a more compact mobile menu treatment (e.g. two-column icon+label
grid is already used, which helps, but could be tightened further, or consider a slide-in drawer
that overlays rather than pushes content).

### Low — "24 photos" badge on the business page hero image, but photos are stock (Unsplash), not real business photos
**Description:** Ties to the Images findings (`findings/images.md`) — the visual polish of the
listing template (photo count badge, gallery affordance) implies real photo galleries per
business, which will matter for user trust once real listings launch with owner-uploaded photos
rather than placeholder stock imagery.
**Recommendation:** No visual/template change needed — flagging so photo-upload UX is prioritized
alongside the core listings-page fix, since the template is already built to showcase real photos
well.

## Quick wins
1. Remove "Super Admin" from the public mobile navigation.
2. Fix the "Rs Rs Rs" price display (shared root cause with the schema finding).
3. Evaluate a more compact mobile menu pattern to reduce pre-content scroll distance.
