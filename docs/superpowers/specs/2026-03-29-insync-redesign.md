# IN SYNC Website Redesign — Design Spec
**Date:** 2026-03-29
**Status:** Approved for implementation

---

## Overview

Redesign insyncnyc.netlify.app from a content/media platform into an **event promotion hub** for IN SYNC's writing workshop series. The primary audience is prospective workshop attendees. Workshop posters are the dominant visual identity. Blog and video content is preserved but de-emphasized.

---

## Purpose Shift

| Before | After |
|---|---|
| Content platform (blog + video series) | Event promotion hub |
| Blog grid as homepage hero | Upcoming workshop as homepage hero |
| Events buried at bottom | Events lead everything |
| 5-item nav | 3-item nav |

---

## Color Palette

Replace all existing CSS variables in `global.css` with:

| Token | Value | Use |
|---|---|---|
| `--color-dark` | `#2A0E18` | Nav, hero, past workshops, footer backgrounds |
| `--color-dark-deep` | `#170910` | Photo panels, deepest footer |
| `--color-dark-mid` | `#1e0812` | Card backgrounds |
| `--color-wine` | `#5c2234` | Secondary text on dark, card borders, hover states |
| `--color-coral` | `#E8624A` | Primary accent — CTAs, eyebrow labels, rules, active nav |
| `--color-cream` | `#FAF6F1` | Primary text on dark, light backgrounds |
| `--color-off-white` | `#F5EDE8` | Alternate light sections (photos, about) |
| `--color-text` | `#2A0E18` | Body text on light backgrounds |
| `--color-text-light` | `#5c2234` | Secondary text on light backgrounds |
| `--color-bg` | `#FAF6F1` | Default page background |
| `--color-border` | `rgba(255,255,255,0.07)` | Borders on dark backgrounds |

Remove `--color-accent`, `--color-overlay` variables.

---

## Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Headings | Cormorant Garamond | 600 | Workshop titles, section heads, card names, logo |
| Display / quotes | Cormorant Garamond | 300 italic | About section quote, pull quotes |
| Body copy | Cormorant Garamond | 400 | Event descriptions, blog body |
| Labels / meta / nav | Helvetica, Arial, sans-serif | 400 | Eyebrow labels, dates, locations, nav links, buttons |

**Loading:** Add to `BaseLayout.astro` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap" rel="stylesheet">
```

**Remove** Proxima Nova `@font-face` declarations from `global.css`. Keep system font stack as ultimate fallback: `Georgia, serif` for Cormorant, `Helvetica, Arial, sans-serif` for labels.

---

## Navigation

```
[IN SYNC]                    Events   About   Contact
```

- Logo: "IN SYNC" in Cormorant Garamond, 15px, 5px letter-spacing, cream
- 3 nav items only: **Events** (`/events`) · **About** (`/about`) · **Contact** (`/getintouch`)
- Active state: coral `#E8624A`
- Background: `#2A0E18`, height 54px, **sticky** (position: sticky, top: 0, z-index: 100)
- Link style: 10px Helvetica, 2px letter-spacing, uppercase, muted wine tone at rest

**Remove from nav:** Blog, Half The Sky (previously linked pages)

---

## Events Content Schema

Add one new optional field to `src/content/config.ts` events schema:

```typescript
rsvpUrl: z.string().url().optional()
```

Also add an optional `series` field (used as subtitle in the hero card):

```typescript
series: z.string().optional()
```

If `series` is not set on an event, the hero card subtitle falls back to displaying the `category` field value.

The `description` field is the **markdown body** of each event file (not frontmatter). No schema change needed for description.

**Test event:** Add a placeholder event file `src/content/events/upcoming-workshop.md` with a future date during development so the "upcoming" hero path can be validated. This file should not be committed to production until a real event is scheduled.

---

## Homepage Sections

### 1. Hero

**Layout:** Two-column flex, ~580px height.

#### Left panel (58% width) — Featured event

The featured event is the **next upcoming event** (date ≥ today). If no upcoming events exist, fall back to the most recent past event.

**Background layer:**
- Workshop poster image fills the panel: `object-fit: cover`, `object-position: top center`
- CSS: `filter: blur(10px) brightness(0.70)`, `transform: scale(1.12)` (prevents blur-edge bleed)
- Dark wine tint overlay on top: `background: rgba(42, 14, 24, 0.45)`

**Event card layer** (centered, z-index 2):
- `background: rgba(23, 9, 16, 0.6)`, `backdrop-filter: blur(2px)`
- `border: 1px solid rgba(255,255,255,0.12)`
- Coral top-border rule (2px absolute)
- Eyebrow: "Upcoming Workshop" or "Past Workshop" if fallback (9px Helvetica, coral, 4px letter-spacing)
- Title: workshop name in Cormorant Garamond 52px, weight 600, cream
- Thin 32px coral rule
- Series/subtitle: Cormorant Garamond 300 italic, muted
- Date: 10px Helvetica, muted wine tone
- Location: 10px Helvetica, muted wine tone, margin-bottom 28px
- **Two buttons** (full width, stacked, 8px gap):
  1. **"More Info"** (outlined: `border: 1px solid rgba(255,255,255,0.3)`, cream text) → `/events/[slug]`
     - Label changes to **"View Recap"** when showing a past event fallback
  2. **"Register"** (solid coral background, cream text) → `rsvpUrl` (external)
     - **Hidden** if `rsvpUrl` is not set on the event, or if showing a past event fallback

#### Right panel (remaining width) — Workshop photos

- 2 workshop photos stacked with 3px gap, background `#170910`, 3px padding
- `object-fit: cover`, `object-position: center` — landscape crop, no tall distortion
- Filter: `grayscale(20%) contrast(105%) brightness(0.85)`
- Gradient overlay: `linear-gradient(150deg, rgba(42,14,24,0.55), rgba(232,98,74,0.20))`
- Small date caption (8px Helvetica, 2px letter-spacing) bottom-left of each photo
- **Photo source:** Hardcoded image paths in the homepage template for now. Placeholder Unsplash images until real workshop photos are provided by client (see Assets Needed).

### 2. Event Strip

Full-width coral bar (`#E8624A`), 16px vertical padding.
- **Same event as the hero** (next upcoming, or most recent past as fallback)
- Left: eyebrow "Next Workshop" (8px Helvetica) + event title (Cormorant 18px, 600) + date · time · location (11px Helvetica)
- Right: outlined "REGISTER →" button → `rsvpUrl`; **hidden** if no `rsvpUrl`

### 3. Inside the Room

Background: `#F5EDE8`, 64px top padding, 48px bottom padding.
- Eyebrow: "Inside the Room" (9px Helvetica, coral, 4px letter-spacing)
- 4-column flex row of workshop photos, 12px gap
- Each photo: `aspect-ratio: 4/3`, `object-fit: cover`, `filter: saturate(80%) contrast(105%)`
- Subtle scale on hover (`transform: scale(1.04)`, `transition: 0.5s`)
- **Photo source:** Hardcoded image paths, stubbed with placeholders until client provides real photos

### 4. About

Background: `#F5EDE8`, continuation of photos section, 72px bottom padding.
- 40px × 2px coral rule, margin-bottom 28px
- Single quote, Cormorant Garamond 26px, weight 300, italic, max-width 640px:
  > *"A writing workshop for **creative minds in diaspora** — to explore cultural identity, find your voice, and write toward authenticity."*
- **"Our Story →"** text link in coral → `/about`
- Quote text is hardcoded in the template

### Data fetching note

Compute the featured event **once** in the homepage frontmatter and pass it to both the Hero and Event Strip — do not query `getCollection('events')` twice with duplicated logic:

```js
const allEvents = await getCollection('events');
const sorted = allEvents.sort((a, b) => b.data.date - a.data.date);
const today = new Date();
const featuredEvent = sorted.find(e => e.data.date >= today) ?? sorted[0];
const isUpcoming = featuredEvent.data.date >= today;
```

### 5. Past Workshops

Background: `#2A0E18`, 64px padding.
- Eyebrow: "Past Workshops" (9px Helvetica, coral)
- **Query:** all events where `date < today`, sorted by date descending, no limit
- 3-column grid, 16px gap
- Each card:
  - Background `#1e0812`, border `rgba(255,255,255,0.07)`, border highlights coral on hover
  - Poster image at `aspect-ratio: 3/4`, `object-fit: cover`
  - Card body: workshop name (Cormorant 15px, 600, cream), date (9px Helvetica, coral), "View recap →" link (→ `/events/[slug]`)
- **Events without an `image` field are omitted from this grid entirely** (currently: `know-thyself` has no poster image)

### 6. Footer

Background: `#170910`, 24px padding.
- Left: "IN SYNC" logotype (Cormorant Garamond, 12px, 4px letter-spacing, wine mid tone)
- Right nav links (9px Helvetica, 2px letter-spacing, uppercase, muted wine tone):
  `Events` · `About` · `Contact` · **`Essays & Videos`** · `Instagram`
- "Essays & Videos" → `/blog` (only entry point for blog/video content — not in main nav)
- Instagram → external Instagram URL
- Remove LinkedIn and Facebook links (not carried over)

---

## New Page: `/about`

Create `src/pages/about.astro`.

**Layout:**
- Nav + footer matching site theme (dark wine)
- Page header: dark wine background, Cormorant Garamond heading "About IN SYNC", 80px top padding
- Body section: cream/off-white background, two-column layout — portrait photo left (`/assets/qionglu-portrait.jpg`), text right
- Mobile: single column, photo above text

**Placeholder copy (hardcoded until client provides final copy):**
> IN SYNC is a writing and community series for creative minds navigating diaspora. Founded by Qiong Lu, it brings together writers, artists, and thinkers to explore cultural identity, voice, and what it means to live authentically across worlds.
>
> Our writing workshops are spaces to write, share, and find each other — for people of all writing levels.

Copy is hardcoded initially; can be made CMS-editable in a future iteration.

---

## Updated Pages

### `/events` (index)

Restyle to match dark wine theme:
- Background: `#2A0E18`
- Page title: Cormorant Garamond, cream
- Event cards: poster image + title + date + location
- Upcoming events show Register button (if `rsvpUrl` set); past events show "View Recap"

### `/events/[slug]` (detail)

- Full poster image at top, **natural portrait aspect ratio** (no forced landscape crop), max-width contained
- Event details: title, date/time, location, category tag, description (markdown body rendered)
- Two CTA buttons:
  1. "Register" → `rsvpUrl` (shown only if `rsvpUrl` set and event is upcoming)
  2. "← Back to Events" → `/events`
- All styled in dark wine theme

### `/blog` and `/blog/[slug]`

Restyle to match dark wine theme. No structural changes. Accessible via "Essays & Videos" footer link only.

### `/halfthesky`

Restyle to match dark wine theme. No structural changes. Accessible via "Essays & Videos" footer link only (or direct URL).

### `/getintouch`

Restyle form to match dark wine theme. Form inputs and submit button updated to use new color tokens. No structural changes.

---

## Mobile / Responsive

Breakpoint: `max-width: 768px` (matching existing codebase convention).

| Section | Mobile behavior |
|---|---|
| Hero | Stack vertically: poster panel full width on top, photos panel below (height ~260px) |
| Hero photos panel | 2 photos side by side (not stacked) at mobile |
| Event strip | Stack title/meta above button |
| Inside the Room photos | 2-column grid (not 4-column) |
| Past workshops grid | 1-column |
| Nav | Logo left, hamburger or inline links right (keep simple — inline at smaller size) |
| Footer | Stack left/right sections vertically |

---

## Assets Needed from Client

- Workshop photos for "Inside the Room" and hero right panel (placeholder Unsplash images used until provided)
- Workshop poster for `know-thyself` event (currently no `image` field)
- `rsvpUrl` values for any events with active registration
- About page body copy

---

## global.css Implementation Notes

- Update `--nav-height` from `60px` to `54px`
- Remove `--color-accent` and `--color-overlay` variables — search codebase for any usages before deleting (currently unused in components, safe to remove)
- Remove all `@font-face` Proxima Nova declarations
- **Delete `/public/fonts/` directory entirely** — 14 unused `.otf` files, no longer needed after Proxima Nova removal

## Known Issues (pre-existing, not introduced by this redesign)

- **Analytics:** `BaseLayout.astro` uses a Universal Analytics ID (`UA-122812824-2`) which has been defunct since July 2023. Client should provide a GA4 measurement ID to replace it in a future iteration.
- **Blog category routes:** `/blog/category/[category]` links exist in the blog filter nav but the category page (`src/pages/blog/category/[category].astro`) does not exist. Leave as-is — pre-existing issue.
- **Blog share buttons:** `/blog/[slug].astro` contains Facebook and LinkedIn share buttons. These remain unchanged even though LinkedIn/Facebook are removed from the footer — intentional inconsistency (article-level sharing vs. site nav).

## What Does NOT Change

- Astro + Netlify + Decap CMS stack
- Content collection schema (except adding `rsvpUrl` and `series` optional fields)
- URL structure: `/events/[slug]`, `/blog/[slug]`, `/getintouch`
- Decap CMS admin panel (`/admin`)
- Blog article share buttons (Facebook, LinkedIn, Twitter remain on article pages)
