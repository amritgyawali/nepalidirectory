# Visual / Mobile — nepalidirectory.com

**Score: 87/100** (up from 68/100 on 2026-07-11)

**Re-audit date:** 2026-07-16. Fresh screenshots (desktop 1920x1080, laptop 1366x768, tablet
768x1024, mobile 375x812) captured for homepage, `/category/restaurants`,
`/business/newa-lahana`, and `/blog/annapurna-circuit-guide`, saved under
`nepalidirectory.com-audit/screenshots/2026-07-16/` (old 2026-07-11 screenshots left in place
under `screenshots/homepage`, `screenshots/city-kathmandu`, `screenshots/compare-restaurants`,
`screenshots/business-newa-lahana` for before/after comparison). Analysis combined
`scripts/analyze_visual.py` output with direct visual review of each screenshot and a source-code
check of `lib/routes.ts`, `components/layout/Header.tsx`, `components/layout/layout.css`, and
`app/login/page.tsx`.

## What works
- **Homepage above-the-fold is strong on every breakpoint, including mobile.** On the 375x812
  mobile screenshot the H1 ("Nepali Directory: find trusted local businesses across Nepal"),
  supporting copy, and the **full 3-field search bar (what/where/category) with the yellow "FIND"
  button are entirely visible with zero scrolling** — the core "search/browse businesses" value
  prop is immediately actionable. Desktop (1920x1080) fits the hero, search bar, the
  deals/add-business/write-a-review row, and the "Popular: Restaurants near me / Emergency
  plumbers / Dentists open now" quick-search chips all above the fold.
- **Category page (`/category/restaurants`) mobile above-the-fold also leads with two clear CTAs**
  ("Search restaurants" and "Add or claim a business") directly under the H1, plus the
  GEO-friendly "Quick answer" scannable summary block — consistent with the 07-11 findings.
- `analyze_visual.py` confirms `viewport_meta: true`, no horizontal scroll, and
  `touch_targets_ok: true` on homepage, category, and business pages; base font size is 16px
  (readable without zoom) on all three. No overlapping elements or text-overflow were detected by
  the tool on any of the three pages analyzed.
- Blog post page (`/blog/annapurna-circuit-guide`) above-the-fold is clean on mobile: breadcrumb,
  category tag, H1, dek, byline/date/read-time, and hero image, in that order — appropriate for a
  content page where a hard CTA isn't expected above the fold.

## Findings

### FIXED — "Super Admin" link removed from public nav (was High, 2026-07-11)
**Then:** Mobile nav rendered "Super Admin" as a top-level item alongside Find People, Deals, Add
Business, etc., on every page, giving every visitor a direct pointer to the admin panel.
**Now:** Confirmed both visually (desktop and mobile screenshots of all 4 re-audited pages show
only Categories / Cities / Guides / Compare / Add Business / Log In / Sign Up) and at the source —
`lib/routes.ts`'s `primaryNav` array (consumed by the sole `components/layout/Header.tsx`, used
for both desktop and mobile since there is no separate mobile-nav component) no longer contains a
Super Admin entry, and `components/layout/Footer.tsx` has no Super Admin link either. The
`superAdmin` route still exists in `routes` (used only for post-login role redirect logic in
`app/login/page.tsx`) but is no longer linked from anywhere in the public UI. **Status: FIXED.**

### FIXED — Mobile nav is no longer a heavy full-page stacked list (was Medium, 2026-07-11)
**Then:** Opening the mobile menu pushed ~580px of stacked links (8 items + full-width Sign Up
button) before any page content appeared.
**Now:** The nav has been rebuilt as a single always-visible horizontally-scrolling pill bar
(`.site-nav { overflow-x: auto; flex-wrap: nowrap }` at `max-width: 760px` in
`components/layout/layout.css`) with only 7 items, no toggle/overlay, and no vertical push at all
— page content starts immediately below the header on mobile. This also incidentally removes the
"is Super Admin visible when the menu opens" attack surface entirely, since there's no longer a
hidden expandable menu to open. **Status: FIXED**, and resolves the finding more thoroughly than
the "compact drawer" recommendation asked for.

### FIXED (product behavior changed) — "Rs Rs Rs" broken price display no longer reproducible (was High, 2026-07-11)
**Then:** The business page showed a literal "Rs Rs Rs" price-tier string next to the rating.
**Now:** On `/business/newa-lahana`, no price tier, star rating, "verified" badge, or "photos"
count badge renders at all. Instead the page now shows an explicit yellow **"Preview profile"**
banner: *"This record is available for product review but is excluded from search indexing,
sitemaps and business ranking schema until its source and public details pass review,"* plus a
"Data status: Not eligible for search indexing / Facts last checked: 7/11/2026 / Claim or correct
this listing" sidebar card. The malformed price string can't be reproduced because that entire
class of unverified fields (price, rating, verified badge) is no longer rendered for
not-yet-reviewed listings — so this is fixed at the root cause, not patched. **Status: FIXED**;
verify on a second/third listing once more records exist to confirm the gating is systematic and
not specific to this one record.

### NEW (Low-Medium) — The previously-praised rich listing template (trust badges, deals, owner profile) is now absent on the one live listing
**Description:** The 2026-07-11 audit praised `/business/newa-lahana` for its "18 years in
business" trust signal, verified badge, rating/review count, live open/closed hours, amenity tags,
deals/coupons block, and an owner profile card ("Sumesh Maharjan, Chef-owner..."). None of that
renders now — the page is visibly plainer: hero image, name, breadcrumb-style category tags, a
one-paragraph description, a Directions/Request details button pair, an About block, a Services
tag list, and a Contact/Data-status sidebar. This is very likely the correct trade-off (the richer
template was apparently showing fabricated/placeholder trust signals for an unverified record,
which is worse than showing none), but it does mean the current live example undersells how
polished the eventual "verified" listing template can look. Not a regression in correctness, but
worth tracking now that the "preview" state is the default experience for real visitors landing on
this URL.
**Recommendation:** Confirm a fully-reviewed/published listing (once one exists) still renders the
richer trust-signal template, and that the "Preview profile" banner doesn't become the permanent
end-state for most listings — if most businesses stay in preview indefinitely, this plainer
template becomes the default customer experience, which undercuts the directory's credibility
value prop.

### NEW (Low) — Mobile nav pill tap targets are 38px tall, below the 48px recommended minimum
**Description:** `components/layout/layout.css` sets `.site-nav__link { min-height: 38px; padding:
8px 11px }` for both desktop and the mobile horizontal-scroll variant. 38px is under the commonly-
cited 44-48px minimum touch-target guidance (WCAG 2.5.5 / Material Design). The links are still
usable (adequate horizontal padding, no adjacent-link crowding) and `analyze_visual.py` reported
`touch_targets_ok: true`, but the automated check may not be catching this specific sub-threshold
height.
**Recommendation:** Bump `.site-nav__link` `min-height` to 44-48px at the `max-width: 760px`
breakpoint specifically, since desktop doesn't need the same touch accommodation.

### NEW (Low) — Site-wide floating AI-assistant button present on every page/breakpoint; overlap risk unverified
**Description:** A black circular floating-action button (`components/ai/AiAssistant.tsx`, mounted
once in the root layout, so it appears on literally every page) sits fixed bottom-right with an
orange notification dot, visible in every screenshot captured (homepage, category, business, blog;
all 4 breakpoints). It did not visibly overlap any primary CTA in the screenshots reviewed (e.g.,
it sits clear of the "Directions"/"Request details" sidebar buttons on the business page), but it
occupies the same bottom-right corner mobile users' thumbs naturally rest on, and wasn't part of
the 2026-07-11 audit — it appears to be a new addition.
**Recommendation:** Spot-check that this FAB never overlaps sticky/bottom CTAs on longer pages
(e.g., a mobile checkout-style flow or the dashboard), and confirm its tap target is ≥48x48px.

### Caveat — `analyze_visual.py`'s automated `cta_visible` check is a false negative here
**Description:** The script's CTA heuristic only matches `a[href*='signup']`,
`a[href*='contact']`, `a[href*='demo']`, or buttons literally labeled "Get Started"/"Sign
Up"/"Contact", plus `.cta`/`[class*='cta']` class selectors. It reported `cta_visible: false` for
the homepage, category, and business pages even though direct visual inspection confirms a
functional primary CTA (FIND / Search restaurants / Directions+Request details) is clearly visible
above the fold on all three. This is a tooling limitation, not a site defect — flagging so it
isn't misread as a real finding in the aggregated `audit-data.json`.

## Quick wins
1. None outstanding for the Super Admin link or mobile nav weight — both fully resolved.
2. Increase `.site-nav__link` min-height to 44-48px at the mobile breakpoint only.
3. Confirm the AI assistant FAB doesn't overlap CTAs on any page not covered in this pass, and
   meets the 48x48px touch-target minimum.
4. Once more listings exist, verify the richer "verified" business template (badges, deals, owner
   profile) still renders for published/reviewed records, so the "Preview profile" plain state
   isn't the permanent default experience.
