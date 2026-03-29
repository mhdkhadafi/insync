# IN SYNC Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the IN SYNC site from a content/media platform into an event promotion hub with dark wine + coral palette, Cormorant Garamond typography, and a workshop-poster-forward homepage.

**Architecture:** Replace CSS variables and fonts site-wide; rewrite Nav/Footer components; rebuild homepage as 6-section layout; restyle all secondary pages to match dark wine theme; add `/about` page; extend events content schema with `rsvpUrl` and `series` fields.

**Tech Stack:** Astro 4.x, Astro Content Collections (Zod), Netlify, Decap CMS, Formspree, Google Fonts (Cormorant Garamond)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/styles/global.css` | Replace color vars + remove Proxima Nova @font-face |
| Modify | `src/layouts/BaseLayout.astro` | Add Google Fonts `<link>` tags |
| Modify | `src/content/config.ts` | Add `rsvpUrl` and `series` to events schema |
| Modify | `src/components/Nav.astro` | Complete rewrite: 3-link sticky dark nav |
| Modify | `src/components/Footer.astro` | Complete rewrite: dark theme text links |
| Modify | `src/components/BlogCard.astro` | Update for dark-background rendering |
| Modify | `src/pages/index.astro` | Complete rewrite: 6-section homepage |
| Modify | `src/pages/events/index.astro` | Restyle with dark wine theme |
| Modify | `src/pages/events/[slug].astro` | Restyle + portrait poster + CTA buttons |
| Modify | `src/pages/blog/index.astro` | Restyle with dark wine theme |
| Modify | `src/pages/blog/[slug].astro` | Restyle with dark wine theme |
| Modify | `src/pages/halfthesky.astro` | Restyle with dark wine theme |
| Modify | `src/pages/getintouch.astro` | Restyle form with dark wine theme |
| Create | `src/pages/about.astro` | New about page |
| Create | `src/content/events/upcoming-workshop.md` | Test event with future date |
| Delete | `public/fonts/` | Remove 14 unused Proxima Nova .otf files |

---

## Task 1: Foundation — global.css, Google Fonts, content schema

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/content/config.ts`

- [ ] **Step 1: Replace src/styles/global.css**

Replace the entire file contents with:

```css
/* ===========================================
   IN SYNC — Global Styles
   =========================================== */

:root {
  /* Color palette — Dark Wine + Coral */
  --color-dark:       #2A0E18;
  --color-dark-deep:  #170910;
  --color-dark-mid:   #1e0812;
  --color-wine:       #5c2234;
  --color-coral:      #E8624A;
  --color-cream:      #FAF6F1;
  --color-off-white:  #F5EDE8;
  --color-text:       #2A0E18;
  --color-text-light: #5c2234;
  --color-bg:         #FAF6F1;
  --color-border:     rgba(255,255,255,0.07);

  /* Typography */
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans:  Helvetica, Arial, sans-serif;

  /* Layout */
  --max-width:  1200px;
  --gutter:     20px;
  --nav-height: 54px;
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; }

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
```

This removes all `@font-face` Proxima Nova declarations, removes `--color-accent` and `--color-overlay`, updates `--nav-height` from `60px` to `54px`, and establishes the new Dark Wine palette.

- [ ] **Step 2: Add Google Fonts to src/layouts/BaseLayout.astro**

In `BaseLayout.astro`, add these two lines immediately before `</head>`:

```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Extend events schema in src/content/config.ts**

In the `events` collection's `z.object({...})`, add after the existing `image` field:

```typescript
    rsvpUrl: z.string().url().optional(),
    series: z.string().optional(),
```

- [ ] **Step 4: Verify build passes**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Build completes without errors. TypeScript validates the new optional schema fields.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro src/content/config.ts
git commit -m "feat: replace color palette, add Cormorant Garamond, extend events schema"
```

---

## Task 2: Nav and Footer components

**Files:**
- Modify: `src/components/Nav.astro` (complete rewrite)
- Modify: `src/components/Footer.astro` (complete rewrite)

- [ ] **Step 1: Replace src/components/Nav.astro**

Replace the entire file:

```astro
---
const currentPath = Astro.url.pathname;
const isActive = (href: string) =>
  href === '/events' ? currentPath.startsWith('/events') :
  currentPath === href;
---

<nav class="nav">
  <a href="/" class="nav-logo">In Sync</a>
  <ul class="nav-links">
    <li><a href="/events" class:list={['nav-link', { active: isActive('/events') }]}>Events</a></li>
    <li><a href="/about" class:list={['nav-link', { active: isActive('/about') }]}>About</a></li>
    <li><a href="/getintouch" class:list={['nav-link', { active: isActive('/getintouch') }]}>Contact</a></li>
  </ul>
</nav>

<style>
  .nav {
    background: var(--color-dark);
    padding: 0 48px;
    height: var(--nav-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-logo {
    font-family: var(--font-serif);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 5px;
    color: var(--color-cream);
    text-transform: uppercase;
    text-decoration: none;
  }
  .nav-logo:hover { text-decoration: none; }
  .nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }
  .nav-link {
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--color-wine);
    transition: color 0.2s;
  }
  .nav-link:hover { color: var(--color-cream); text-decoration: none; }
  .nav-link.active { color: var(--color-coral); }

  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .nav-links { gap: 16px; }
    .nav-link { font-size: 9px; }
  }
</style>
```

- [ ] **Step 2: Replace src/components/Footer.astro**

Replace the entire file:

```astro
---
---

<footer class="footer">
  <div class="footer-inner">
    <span class="footer-logo">In Sync</span>
    <nav class="footer-links">
      <a href="/events" class="footer-link">Events</a>
      <a href="/about" class="footer-link">About</a>
      <a href="/getintouch" class="footer-link">Contact</a>
      <a href="/blog" class="footer-link">Essays &amp; Videos</a>
      <a href="https://www.instagram.com/insync_nyc/" class="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a>
    </nav>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-dark-deep);
    padding: 24px 48px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }
  .footer-logo {
    font-family: var(--font-serif);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 4px;
    color: var(--color-wine);
    text-transform: uppercase;
  }
  .footer-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  .footer-link {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--color-wine);
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--color-cream); text-decoration: none; }

  @media (max-width: 768px) {
    .footer { padding: 24px 20px; }
    .footer-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
    .footer-links { gap: 16px; }
  }
</style>
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: rewrite Nav and Footer with dark wine theme"
```

---

## Task 3: Homepage

**Files:**
- Modify: `src/pages/index.astro` (complete rewrite)

The homepage does not use a `.container` wrapper — all sections are full-bleed. The featured event is computed once and reused in both the Hero and Event Strip.

- [ ] **Step 1: Replace src/pages/index.astro**

Replace the entire file:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const allEvents = await getCollection('events');
// Note: .getTime() used for TypeScript strict-mode compatibility (direct Date subtraction can error)
// Note: descending sort + .find returns the furthest-future upcoming event, not the soonest.
// With only 1 upcoming event at a time this is fine. If multiple are ever added,
// switch to ascending sort (.sort((a,b) => a.data.date.getTime() - b.data.date.getTime()))
// and remove the ?? sorted[0] fallback direction reversal.
const sorted = allEvents.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const today = new Date();
const featuredEvent = sorted.find(e => e.data.date >= today) ?? sorted[0];
const isUpcoming = featuredEvent ? featuredEvent.data.date >= today : false;
const pastEvents = sorted.filter(e => e.data.date < today && e.data.image);

const heroDateStr = featuredEvent
  ? featuredEvent.data.date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
  : '';
const heroTimeStr = featuredEvent
  ? featuredEvent.data.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  : '';
const heroSubtitle = featuredEvent?.data.series || featuredEvent?.data.category || '';
---

<BaseLayout title="Home" description="IN SYNC — Writing workshops for creative minds in diaspora">

  <!-- 1. HERO -->
  <section class="hero">

    <!-- Left: blurred poster + event card -->
    <div class="hero-event">
      {featuredEvent?.data.image && (
        <div class="hero-bg" style={`background-image: url('${featuredEvent.data.image}')`}></div>
      )}
      <div class="hero-tint"></div>

      <div class="hero-card">
        <span class="hero-eyebrow">
          {isUpcoming ? 'Upcoming Workshop' : 'Past Workshop'}
        </span>
        <h1 class="hero-title">{featuredEvent?.data.title}</h1>
        <div class="hero-rule"></div>
        {heroSubtitle && <p class="hero-series">{heroSubtitle}</p>}
        <p class="hero-meta">{heroDateStr}</p>
        {heroTimeStr && <p class="hero-meta">{heroTimeStr}</p>}
        {featuredEvent?.data.location && (
          <p class="hero-meta hero-location">{featuredEvent.data.location}</p>
        )}
        <div class="hero-btns">
          {featuredEvent && (
            <a href={`/events/${featuredEvent.slug}`} class="btn btn-outline">
              {isUpcoming ? 'More Info' : 'View Recap'}
            </a>
          )}
          {isUpcoming && featuredEvent?.data.rsvpUrl && (
            <a href={featuredEvent.data.rsvpUrl} target="_blank" rel="noopener noreferrer" class="btn btn-solid">
              Register
            </a>
          )}
        </div>
      </div>
    </div>

    <!-- Right: 2 workshop photos (hardcoded placeholders until real photos provided) -->
    <div class="hero-photos">
      <div class="hero-photo">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=400&fit=crop&crop=faces,center"
          alt="Workshop participants"
          crossorigin="anonymous"
        />
        <span class="hero-photo-caption">Mar 2026</span>
      </div>
      <div class="hero-photo">
        <img
          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=400&fit=crop&crop=faces,center"
          alt="Writing session"
          crossorigin="anonymous"
        />
        <span class="hero-photo-caption">Jan 2026</span>
      </div>
    </div>
  </section>

  <!-- 2. EVENT STRIP -->
  {featuredEvent && (
    <div class="event-strip">
      <div class="strip-left">
        <p class="strip-eyebrow">Next Workshop</p>
        <p class="strip-title">{featuredEvent.data.title}</p>
        <p class="strip-meta">
          {heroDateStr}
          {heroTimeStr && ` · ${heroTimeStr}`}
          {featuredEvent.data.location && ` · ${featuredEvent.data.location}`}
        </p>
      </div>
      {isUpcoming && featuredEvent.data.rsvpUrl && (
        <a href={featuredEvent.data.rsvpUrl} target="_blank" rel="noopener noreferrer" class="strip-btn">
          REGISTER →
        </a>
      )}
    </div>
  )}

  <!-- 3. INSIDE THE ROOM -->
  <section class="photos-section">
    <p class="eyebrow">Inside the Room</p>
    <div class="photos-row">
      <div class="photo-thumb">
        <img src="https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=500&h=375&fit=crop" alt="Workshop" crossorigin="anonymous" />
      </div>
      <div class="photo-thumb">
        <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&h=375&fit=crop" alt="Workshop" crossorigin="anonymous" />
      </div>
      <div class="photo-thumb">
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=375&fit=crop" alt="Workshop" crossorigin="anonymous" />
      </div>
      <div class="photo-thumb">
        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=375&fit=crop" alt="Workshop" crossorigin="anonymous" />
      </div>
    </div>
  </section>

  <!-- 4. ABOUT QUOTE -->
  <section class="about-section">
    <div class="about-rule"></div>
    <p class="about-quote">
      A writing workshop for <strong>creative minds in diaspora</strong> —
      to explore cultural identity, find your voice, and write toward authenticity.
    </p>
    <a href="/about" class="about-cta">Our Story →</a>
  </section>

  <!-- 5. PAST WORKSHOPS -->
  {pastEvents.length > 0 && (
    <section class="past-section">
      <p class="eyebrow">Past Workshops</p>
      <div class="past-grid">
        {pastEvents.map(event => {
          const cardDate = event.data.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          return (
            <a href={`/events/${event.slug}`} class="past-card">
              <img src={event.data.image} alt={event.data.title} class="past-card-img" />
              <div class="past-card-body">
                <p class="past-card-name">{event.data.title}</p>
                <p class="past-card-date">{cardDate}</p>
                <span class="past-card-link">View recap →</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  )}

</BaseLayout>

<style>
  /* ── HERO ─────────────────────────────── */
  .hero {
    background: var(--color-dark);
    display: flex;
    min-height: 580px;
  }

  .hero-event {
    flex: 0 0 58%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: top center;
    filter: blur(10px) brightness(0.70);
    transform: scale(1.12);
  }
  .hero-tint {
    position: absolute;
    inset: 0;
    background: rgba(42, 14, 24, 0.45);
  }
  .hero-card {
    position: relative;
    z-index: 2;
    background: rgba(23, 9, 16, 0.6);
    backdrop-filter: blur(2px);
    border: 1px solid rgba(255,255,255,0.12);
    border-top: 2px solid var(--color-coral);
    padding: 32px 28px;
    width: 100%;
    max-width: 380px;
  }
  .hero-eyebrow {
    display: block;
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--color-coral);
    margin-bottom: 12px;
  }
  .hero-title {
    font-family: var(--font-serif);
    font-size: 52px;
    font-weight: 600;
    color: var(--color-cream);
    line-height: 1.05;
    margin-bottom: 16px;
  }
  .hero-rule {
    width: 32px;
    height: 1px;
    background: var(--color-coral);
    margin-bottom: 14px;
  }
  .hero-series {
    font-family: var(--font-serif);
    font-size: 14px;
    font-weight: 300;
    font-style: italic;
    color: var(--color-wine);
    margin-bottom: 10px;
  }
  .hero-meta {
    font-family: var(--font-sans);
    font-size: 10px;
    color: var(--color-wine);
    margin-bottom: 4px;
  }
  .hero-location { margin-bottom: 28px; }
  .hero-btns {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;
  }
  .btn {
    display: block;
    text-align: center;
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 12px 16px;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .btn:hover { opacity: 0.8; text-decoration: none; }
  .btn-outline {
    border: 1px solid rgba(255,255,255,0.3);
    color: var(--color-cream);
  }
  .btn-solid {
    background: var(--color-coral);
    color: var(--color-cream);
  }

  .hero-photos {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: var(--color-dark-deep);
    padding: 3px;
  }
  .hero-photo {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
  }
  .hero-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    filter: grayscale(20%) contrast(105%) brightness(0.85);
  }
  .hero-photo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(150deg, rgba(42,14,24,0.55) 0%, rgba(232,98,74,0.20) 100%);
    pointer-events: none;
  }
  .hero-photo-caption {
    position: absolute;
    bottom: 10px;
    left: 12px;
    font-family: var(--font-sans);
    font-size: 8px;
    letter-spacing: 2px;
    color: rgba(250,246,241,0.55);
    z-index: 2;
    text-transform: uppercase;
  }

  /* ── EVENT STRIP ──────────────────────── */
  .event-strip {
    background: var(--color-coral);
    padding: 16px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .strip-eyebrow {
    font-family: var(--font-sans);
    font-size: 8px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(250,246,241,0.65);
    margin-bottom: 5px;
  }
  .strip-title {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 600;
    color: var(--color-cream);
  }
  .strip-meta {
    font-family: var(--font-sans);
    font-size: 11px;
    color: rgba(250,246,241,0.75);
    margin-top: 3px;
  }
  .strip-btn {
    flex-shrink: 0;
    border: 1px solid var(--color-cream);
    color: var(--color-cream);
    background: transparent;
    padding: 10px 24px;
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .strip-btn:hover { opacity: 0.8; text-decoration: none; }

  /* ── INSIDE THE ROOM ──────────────────── */
  .photos-section {
    background: var(--color-off-white);
    padding: 64px 48px 48px;
  }
  .eyebrow {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--color-coral);
    text-transform: uppercase;
    margin-bottom: 28px;
  }
  .photos-row {
    display: flex;
    gap: 12px;
  }
  .photo-thumb {
    flex: 1;
    overflow: hidden;
  }
  .photo-thumb img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    display: block;
    filter: saturate(80%) contrast(105%);
    transition: transform 0.5s ease;
  }
  .photo-thumb:hover img { transform: scale(1.04); }

  /* ── ABOUT QUOTE ──────────────────────── */
  .about-section {
    background: var(--color-off-white);
    padding: 0 48px 72px;
  }
  .about-rule {
    width: 40px;
    height: 2px;
    background: var(--color-coral);
    margin-bottom: 28px;
  }
  .about-quote {
    font-family: var(--font-serif);
    font-size: 26px;
    font-weight: 300;
    font-style: italic;
    line-height: 1.65;
    color: var(--color-text);
    max-width: 640px;
  }
  .about-quote strong {
    font-style: normal;
    font-weight: 600;
    color: var(--color-wine);
  }
  .about-cta {
    display: inline-block;
    margin-top: 24px;
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--color-coral);
    border-bottom: 1px solid var(--color-coral);
    padding-bottom: 3px;
    text-decoration: none;
  }
  .about-cta:hover { opacity: 0.8; text-decoration: none; }

  /* ── PAST WORKSHOPS ───────────────────── */
  .past-section {
    background: var(--color-dark);
    padding: 64px 48px;
  }
  .past-section .eyebrow { color: var(--color-coral); }
  .past-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 32px;
  }
  .past-card {
    border: 1px solid rgba(255,255,255,0.07);
    background: var(--color-dark-mid);
    overflow: hidden;
    display: block;
    text-decoration: none;
    transition: border-color 0.2s;
  }
  .past-card:hover { border-color: var(--color-coral); text-decoration: none; }
  .past-card-img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
  }
  .past-card-body {
    padding: 14px 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .past-card-name {
    font-family: var(--font-serif);
    font-size: 15px;
    font-weight: 600;
    color: var(--color-cream);
    margin-bottom: 5px;
  }
  .past-card-date {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--color-coral);
    text-transform: uppercase;
  }
  .past-card-link {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 1px;
    color: var(--color-wine);
    margin-top: 8px;
    display: block;
  }

  /* ── RESPONSIVE ──────────────────────── */
  @media (max-width: 768px) {
    .hero { flex-direction: column; min-height: unset; }
    .hero-event {
      flex: unset;
      width: 100%;
      min-height: 400px;
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .hero-photos { flex-direction: row; height: 260px; }
    .hero-photo { flex: 1; }

    .event-strip { flex-direction: column; align-items: flex-start; padding: 16px 20px; }

    .photos-section { padding: 48px 20px 32px; }
    .photos-row { flex-wrap: wrap; }
    .photo-thumb { flex: 0 0 calc(50% - 6px); }

    .about-section { padding: 0 20px 48px; }
    .about-quote { font-size: 20px; }

    .past-section { padding: 48px 20px; }
    .past-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Build succeeds, homepage compiles, no TypeScript errors.

- [ ] **Step 3: Start dev server and visually check homepage**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run dev
```

Open http://localhost:4321 and verify:
- Hero left panel shows dark wine background (no blurred image yet since existing events have old dates and no `rsvpUrl`)
- "Past Workshop" eyebrow shown (fallback path — all 3 events are in the past)
- Event strip (coral bar) appears below hero
- "Inside the Room" photos load from Unsplash
- About quote section appears in `#F5EDE8` off-white
- Past Workshops grid shows 2 cards (dinner-and-design, art-of-waiting — know-thyself excluded, has no image)

Stop the dev server before committing.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rebuild homepage as 6-section event promotion hub"
```

---

## Task 4: About page (new)

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create src/pages/about.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="About IN SYNC — A writing and community series for creative minds in diaspora">

  <div class="about-header">
    <div class="about-header-inner">
      <h1 class="about-heading">About IN SYNC</h1>
    </div>
  </div>

  <section class="about-body">
    <div class="about-body-inner">
      <div class="about-photo-col">
        <img src="/assets/qionglu-portrait.jpg" alt="Qiong Lu" class="about-portrait" />
      </div>
      <div class="about-text-col">
        <p class="about-p">
          IN SYNC is a writing and community series for creative minds navigating diaspora. Founded by Qiong Lu, it brings together writers, artists, and thinkers to explore cultural identity, voice, and what it means to live authentically across worlds.
        </p>
        <p class="about-p">
          Our writing workshops are spaces to write, share, and find each other — for people of all writing levels.
        </p>
      </div>
    </div>
  </section>

</BaseLayout>

<style>
  .about-header {
    background: var(--color-dark);
    padding: 80px 48px 56px;
  }
  .about-header-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .about-heading {
    font-family: var(--font-serif);
    font-size: 48px;
    font-weight: 600;
    color: var(--color-cream);
    line-height: 1.1;
  }

  .about-body {
    background: var(--color-off-white);
    padding: 64px 48px 80px;
  }
  .about-body-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    gap: 64px;
    align-items: flex-start;
  }
  .about-photo-col { flex: 0 0 320px; }
  .about-portrait { width: 100%; display: block; }
  .about-text-col { flex: 1; padding-top: 8px; }
  .about-p {
    font-family: var(--font-serif);
    font-size: 20px;
    font-weight: 400;
    line-height: 1.75;
    color: var(--color-text);
    margin-bottom: 24px;
  }

  @media (max-width: 768px) {
    .about-header { padding: 48px 20px 40px; }
    .about-heading { font-size: 36px; }
    .about-body { padding: 48px 20px 64px; }
    .about-body-inner { flex-direction: column; gap: 32px; }
    .about-photo-col { flex: unset; width: 100%; max-width: 320px; }
  }
</style>
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Build succeeds; `/about` static route is generated.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add /about page with dark wine theme"
```

---

## Task 5: Events pages

**Files:**
- Modify: `src/pages/events/index.astro` (complete rewrite)
- Modify: `src/pages/events/[slug].astro` (complete rewrite)

- [ ] **Step 1: Replace src/pages/events/index.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const allEvents = await getCollection('events');
const sorted = allEvents.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const today = new Date();
const upcoming = sorted.filter(e => e.data.date >= today);
const past = sorted.filter(e => e.data.date < today);
---

<BaseLayout title="Events" description="IN SYNC Events — Writing workshops for creative minds in diaspora">

  <div class="events-header">
    <div class="events-header-inner">
      <h1 class="events-heading">Events</h1>
    </div>
  </div>

  <section class="events-body">
    <div class="events-inner">

      {upcoming.length > 0 && (
        <div class="events-group">
          <p class="group-label">Upcoming</p>
          <div class="events-list">
            {upcoming.map(event => {
              const dateStr = event.data.date.toLocaleDateString('en-US', {
                weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
              });
              return (
                <div class="event-row">
                  {event.data.image && (
                    <a href={`/events/${event.slug}`} class="event-row-img-link">
                      <img src={event.data.image} alt={event.data.title} class="event-row-img" />
                    </a>
                  )}
                  <div class="event-row-info">
                    <p class="event-row-date">{dateStr}</p>
                    <h2 class="event-row-title">
                      <a href={`/events/${event.slug}`}>{event.data.title}</a>
                    </h2>
                    {event.data.location && <p class="event-row-location">{event.data.location}</p>}
                    <div class="event-row-btns">
                      <a href={`/events/${event.slug}`} class="event-btn event-btn-outline">More Info</a>
                      {event.data.rsvpUrl && (
                        <a href={event.data.rsvpUrl} target="_blank" rel="noopener noreferrer" class="event-btn event-btn-solid">Register</a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div class="events-group">
          <p class="group-label">Past</p>
          <div class="events-list">
            {past.map(event => {
              const dateStr = event.data.date.toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              });
              return (
                <div class="event-row">
                  {event.data.image && (
                    <a href={`/events/${event.slug}`} class="event-row-img-link">
                      <img src={event.data.image} alt={event.data.title} class="event-row-img" />
                    </a>
                  )}
                  <div class="event-row-info">
                    <p class="event-row-date">{dateStr}</p>
                    <h2 class="event-row-title">
                      <a href={`/events/${event.slug}`}>{event.data.title}</a>
                    </h2>
                    {event.data.location && <p class="event-row-location">{event.data.location}</p>}
                    <div class="event-row-btns">
                      <a href={`/events/${event.slug}`} class="event-btn event-btn-outline">View Recap</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  </section>

</BaseLayout>

<style>
  .events-header {
    background: var(--color-dark);
    padding: 80px 48px 56px;
  }
  .events-header-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .events-heading {
    font-family: var(--font-serif);
    font-size: 48px;
    font-weight: 600;
    color: var(--color-cream);
  }

  .events-body {
    background: var(--color-dark);
    min-height: 60vh;
    padding: 0 48px 80px;
  }
  .events-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }

  .group-label {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--color-coral);
    margin-bottom: 24px;
    padding-top: 32px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .events-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .event-row {
    display: flex;
    gap: 32px;
    align-items: flex-start;
    padding: 20px;
    background: var(--color-dark-mid);
    border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.2s;
  }
  .event-row:hover { border-color: var(--color-wine); }

  .event-row-img-link { flex-shrink: 0; }
  .event-row-img {
    width: 160px;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
  }

  .event-row-info { flex: 1; }
  .event-row-date {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-coral);
    margin-bottom: 8px;
  }
  .event-row-title {
    font-family: var(--font-serif);
    font-size: 24px;
    font-weight: 600;
    color: var(--color-cream);
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .event-row-title a { text-decoration: none; color: inherit; }
  .event-row-title a:hover { text-decoration: underline; }
  .event-row-location {
    font-family: var(--font-sans);
    font-size: 10px;
    color: var(--color-wine);
    margin-bottom: 16px;
  }
  .event-row-btns {
    display: flex;
    gap: 12px;
  }
  .event-btn {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 9px 20px;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .event-btn:hover { opacity: 0.8; text-decoration: none; }
  .event-btn-outline {
    border: 1px solid rgba(255,255,255,0.3);
    color: var(--color-cream);
  }
  .event-btn-solid {
    background: var(--color-coral);
    color: var(--color-cream);
  }

  @media (max-width: 768px) {
    .events-header { padding: 48px 20px 40px; }
    .events-heading { font-size: 36px; }
    .events-body { padding: 0 20px 64px; }
    .event-row { flex-direction: column; gap: 16px; }
    .event-row-img { width: 100%; aspect-ratio: 3/2; }
  }
</style>
```

- [ ] **Step 2: Replace src/pages/events/[slug].astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const events = await getCollection('events');
  return events.map(event => ({ params: { slug: event.slug }, props: { event } }));
}

const { event } = Astro.props;
const { Content } = await event.render();

const today = new Date();
const isUpcoming = event.data.date >= today;

const dateStr = event.data.date.toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});
const startTime = event.data.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const endTime = event.data.endDate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
---

<BaseLayout title={event.data.title} description={`${event.data.title} — IN SYNC Workshop`}>

  <div class="event-header">
    <div class="event-header-inner">
      <span class="event-category">{event.data.category}</span>
      <h1 class="event-title">{event.data.title}</h1>
      <p class="event-date">{dateStr}</p>
      <p class="event-time">{startTime}{endTime ? ` – ${endTime}` : ''}</p>
      {event.data.location && <p class="event-location">{event.data.location}</p>}
    </div>
  </div>

  <section class="event-body">
    <div class="event-body-inner">

      {event.data.image && (
        <img src={event.data.image} alt={event.data.title} class="event-poster" />
      )}

      <div class="event-content">
        <Content />
      </div>

      <div class="event-actions">
        {isUpcoming && event.data.rsvpUrl && (
          <a href={event.data.rsvpUrl} target="_blank" rel="noopener noreferrer" class="action-btn action-btn-solid">
            Register
          </a>
        )}
        <a href="/events" class="action-btn action-btn-outline">← Back to Events</a>
      </div>

    </div>
  </section>

</BaseLayout>

<style>
  .event-header {
    background: var(--color-dark);
    padding: 80px 48px 56px;
  }
  .event-header-inner {
    max-width: 720px;
    margin: 0 auto;
  }
  .event-category {
    display: block;
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--color-coral);
    margin-bottom: 12px;
  }
  .event-title {
    font-family: var(--font-serif);
    font-size: 48px;
    font-weight: 600;
    color: var(--color-cream);
    line-height: 1.1;
    margin-bottom: 20px;
  }
  .event-date,
  .event-time,
  .event-location {
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-wine);
    margin-bottom: 5px;
    letter-spacing: 1px;
  }

  .event-body {
    background: var(--color-dark);
    padding: 0 48px 80px;
  }
  .event-body-inner {
    max-width: 720px;
    margin: 0 auto;
    padding-top: 40px;
  }
  .event-poster {
    /* Natural portrait aspect ratio — no forced crop */
    width: auto;
    max-width: 100%;
    display: block;
    margin: 0 auto 40px;
  }
  .event-content {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 400;
    line-height: 1.75;
    color: var(--color-cream);
    margin-bottom: 48px;
  }
  .event-content :global(p) { margin-bottom: 20px; }
  .event-content :global(a) { color: var(--color-coral); text-decoration: underline; }

  .event-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .action-btn {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 12px 24px;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .action-btn:hover { opacity: 0.8; text-decoration: none; }
  .action-btn-solid {
    background: var(--color-coral);
    color: var(--color-cream);
  }
  .action-btn-outline {
    border: 1px solid rgba(255,255,255,0.3);
    color: var(--color-cream);
  }

  @media (max-width: 768px) {
    .event-header { padding: 48px 20px 40px; }
    .event-title { font-size: 36px; }
    .event-body { padding: 0 20px 64px; }
  }
</style>
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Build succeeds; all event slugs generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/events/index.astro src/pages/events/[slug].astro
git commit -m "feat: restyle events pages with dark wine theme"
```

---

## Task 6: Blog pages and BlogCard

**Files:**
- Modify: `src/components/BlogCard.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[slug].astro`

`BlogCard.astro` uses the old `--font-heading` and `--font-size-sm` variables that no longer exist. Update it first.

- [ ] **Step 1: Update src/components/BlogCard.astro styles**

The existing `<style>` block in BlogCard uses `--font-heading`, `--font-size-sm`, `--line-height-body`. Replace the `<style>` block with:

```css
<style>
  .blog-card { margin-bottom: 16px; }
  .blog-card__image {
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: cover;
    margin-bottom: 16px;
  }
  .blog-card__meta {
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-wine);
    margin-bottom: 8px;
  }
  .blog-card__cat-link { color: var(--color-coral); text-decoration: none; }
  .blog-card__cat-link:hover { text-decoration: underline; }
  .blog-card__title {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-cream);
    margin-bottom: 12px;
  }
  .blog-card__title a { color: inherit; }
  .blog-card__title a:hover { text-decoration: underline; }
  .blog-card__excerpt {
    font-family: var(--font-serif);
    font-size: 15px;
    color: rgba(250,246,241,0.7);
    margin-bottom: 12px;
    line-height: 1.7;
  }
  .blog-card__read-more {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-coral);
  }
  .blog-card__read-more:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Replace src/pages/blog/index.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const sortedPosts = allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<BaseLayout title="Essays &amp; Videos" description="Essays and videos from IN SYNC — With Creative Minds in Diaspora">

  <div class="blog-header">
    <div class="blog-header-inner">
      <h1 class="blog-heading">Essays &amp; Videos</h1>
    </div>
  </div>

  <section class="blog-body">
    <div class="blog-inner">
      <div class="blog-list">
        {sortedPosts.map(post => (
          <BlogCard
            title={post.data.title}
            date={post.data.date}
            author={post.data.author}
            excerpt={post.data.excerpt}
            slug={post.slug}
            image={post.data.image}
            categories={post.data.categories}
          />
        ))}
      </div>
    </div>
  </section>

</BaseLayout>

<style>
  .blog-header {
    background: var(--color-dark);
    padding: 80px 48px 56px;
  }
  .blog-header-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .blog-heading {
    font-family: var(--font-serif);
    font-size: 48px;
    font-weight: 600;
    color: var(--color-cream);
  }

  .blog-body {
    background: var(--color-dark);
    min-height: 60vh;
    padding: 48px 48px 80px;
  }
  .blog-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .blog-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  @media (max-width: 768px) {
    .blog-header { padding: 48px 20px 40px; }
    .blog-heading { font-size: 36px; }
    .blog-body { padding: 32px 20px 64px; }
    .blog-list { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 3: Replace src/pages/blog/[slug].astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await post.render();

const formattedDate = post.data.date.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});

const postUrl = `https://insyncnyc.netlify.app/blog/${post.slug}`;
const shareText = encodeURIComponent(post.data.title);
const shareUrl = encodeURIComponent(postUrl);
---

<BaseLayout title={post.data.title} description={post.data.excerpt}>
  <article class="post">
    {post.data.image && (
      <div class="post-cover">
        <img src={post.data.image} alt={post.data.title} />
      </div>
    )}

    <div class="post-body">
      <header class="post-header">
        <p class="post-meta">
          {post.data.categories && post.data.categories.length > 0 && (
            <span class="post-cats">
              {post.data.categories.map((cat, i) => (
                <><a href={`/blog/category/${cat}`} class="post-cat-link">{cat}</a>{i < post.data.categories.length - 1 && ', '}</>
              ))}
              <span> · </span>
            </span>
          )}
          {formattedDate}
        </p>
        <h1 class="post-title">{post.data.title}</h1>
      </header>

      <div class="post-content">
        <Content />
      </div>

      <div class="post-share">
        <span class="post-share-label">Share</span>
        <div class="post-share-links">
          <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X/Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        </div>
      </div>

      {post.data.categories && post.data.categories.length > 0 && (
        <div class="post-tags">
          {post.data.categories.map(cat => (
            <a href={`/blog/category/${cat}`} class="post-tag">{cat}</a>
          ))}
        </div>
      )}

      <a href="/blog" class="post-back">← Back to Essays &amp; Videos</a>
    </div>
  </article>
</BaseLayout>

<style>
  .post-cover img {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
  }
  .post-body {
    background: var(--color-dark);
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 48px 80px;
  }
  .post-meta {
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--color-wine);
    margin-bottom: 12px;
  }
  .post-cat-link { color: var(--color-coral); text-decoration: none; }
  .post-cat-link:hover { text-decoration: underline; }
  .post-title {
    font-family: var(--font-serif);
    font-size: 42px;
    font-weight: 600;
    color: var(--color-cream);
    line-height: 1.15;
    margin-bottom: 32px;
  }
  .post-content {
    font-family: var(--font-serif);
    font-size: 18px;
    font-weight: 400;
    line-height: 1.8;
    color: var(--color-cream);
  }
  .post-content :global(h2) {
    font-family: var(--font-serif);
    font-size: 28px;
    font-weight: 600;
    color: var(--color-cream);
    margin: 40px 0 16px;
  }
  .post-content :global(p) { margin-bottom: 20px; }
  .post-content :global(a) { color: var(--color-coral); text-decoration: underline; }
  .post-content :global(img) { max-width: 100%; margin: 24px auto; display: block; }
  .post-content :global(blockquote) {
    border-left: 3px solid var(--color-wine);
    padding-left: 20px;
    color: var(--color-wine);
    font-style: italic;
    margin: 24px 0;
  }

  .post-share {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .post-share-label {
    font-family: var(--font-sans);
    font-size: 9px;
    color: var(--color-wine);
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .post-share-links { display: flex; gap: 12px; }
  .post-share-links a { color: var(--color-wine); transition: color 0.2s; }
  .post-share-links a:hover { color: var(--color-cream); text-decoration: none; }

  .post-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; }
  .post-tag {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 10px;
    border: 1px solid rgba(255,255,255,0.07);
    color: var(--color-wine);
    text-decoration: none;
  }
  .post-tag:hover { border-color: var(--color-wine); text-decoration: none; }

  .post-back {
    display: inline-block;
    margin-top: 32px;
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-wine);
  }
  .post-back:hover { color: var(--color-cream); text-decoration: none; }

  @media (max-width: 768px) {
    .post-body { padding: 32px 20px 64px; }
    .post-title { font-size: 32px; }
  }
</style>
```

- [ ] **Step 4: Verify build passes**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/BlogCard.astro src/pages/blog/index.astro src/pages/blog/[slug].astro
git commit -m "feat: restyle blog pages and BlogCard with dark wine theme"
```

---

## Task 7: halfthesky and getintouch

**Files:**
- Modify: `src/pages/halfthesky.astro`
- Modify: `src/pages/getintouch.astro`

- [ ] **Step 1: Update halfthesky.astro**

The content (episodes array, body text) is preserved. Only the `<style>` block changes. Replace the existing `<style>` block with:

```css
<style>
  .hts-wrap { background: var(--color-dark); min-height: 100vh; }

  .hts-hero {
    max-width: 780px;
    margin: 0 auto;
    padding: 80px 48px 48px;
  }
  .hts-hero__title {
    font-family: var(--font-serif);
    font-size: 32px;
    font-weight: 600;
    color: var(--color-cream);
    margin-bottom: 24px;
    line-height: 1.3;
  }
  .hts-hero__body {
    font-family: var(--font-serif);
    font-size: 17px;
    font-weight: 400;
    line-height: 1.8;
    color: rgba(250,246,241,0.8);
    margin-bottom: 20px;
  }

  .episodes {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 48px 80px;
    display: flex;
    flex-direction: column;
    gap: 64px;
  }
  .episode__title {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 600;
    color: var(--color-cream);
    margin-bottom: 20px;
  }
  .episode__thumbnail { width: 100%; margin-bottom: 20px; }
  .episode__video { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
  .episode__video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

  .closing {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 48px 80px;
    text-align: center;
  }
  .closing__gifs {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }
  .closing__gifs img { max-width: 360px; width: 100%; }
  .closing__text {
    font-family: var(--font-serif);
    font-size: 20px;
    color: var(--color-cream);
    margin-bottom: 12px;
  }
  .closing__cta {
    font-family: var(--font-serif);
    font-size: 18px;
    color: var(--color-wine);
  }

  @media (max-width: 768px) {
    .hts-hero { padding: 48px 20px 32px; }
    .episodes { padding: 0 20px 64px; }
    .closing { padding: 0 20px 64px; }
  }
</style>
```

- [ ] **Step 2: Replace src/pages/getintouch.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreypzoq';
---

<BaseLayout title="Contact" description="Get in touch with IN SYNC">

  <div class="contact-header">
    <div class="contact-header-inner">
      <h1 class="contact-heading">Get In Touch</h1>
    </div>
  </div>

  <section class="contact-body">
    <div class="contact-inner">

      <form action={FORMSPREE_ENDPOINT} method="POST" class="contact-form">
        <div class="form-group">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" name="first-name" required />
        </div>
        <div class="form-group">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" name="last-name" required />
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="6"></textarea>
        </div>
        <button type="submit" class="contact-submit">Send</button>
      </form>

      <div class="contact-bio">
        <div class="contact-bio-text">
          <h2 class="contact-bio-title">Hi!</h2>
          <p>Thanks for being interested in who's behind the scenes.</p>
          <p>I'm Qionglu, I'm feeding pigeons so maybe once a while they will bring my some messages...or you can email me, like we all do in this digital world. Don't hesitate to reach out If you'd like to be featured in the untitled.</p>
          <p>Enjoy the rest of your day</p>
        </div>
        <div class="contact-bio-photo">
          <img src="/assets/qionglu-portrait.jpg" alt="Qionglu" class="contact-portrait" />
        </div>
      </div>

    </div>
  </section>

</BaseLayout>

<style>
  .contact-header {
    background: var(--color-dark);
    padding: 80px 48px 56px;
  }
  .contact-header-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .contact-heading {
    font-family: var(--font-serif);
    font-size: 48px;
    font-weight: 600;
    color: var(--color-cream);
  }

  .contact-body {
    background: var(--color-dark);
    padding: 0 48px 80px;
  }
  .contact-inner {
    max-width: 780px;
    margin: 0 auto;
    padding-top: 40px;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 64px;
  }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group label {
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-wine);
  }
  .form-group input,
  .form-group textarea {
    border: none;
    border-bottom: 1px solid var(--color-wine);
    padding: 12px 0;
    background: transparent;
    font-family: var(--font-serif);
    font-size: 16px;
    color: var(--color-cream);
    width: 100%;
    transition: border-color 0.2s;
  }
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-bottom-color: var(--color-coral);
  }
  .form-group textarea {
    border: 1px solid rgba(255,255,255,0.12);
    padding: 12px 16px;
    resize: vertical;
  }
  .contact-submit {
    align-self: flex-start;
    background: var(--color-coral);
    color: var(--color-cream);
    border: none;
    padding: 14px 32px;
    font-family: var(--font-sans);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .contact-submit:hover { opacity: 0.8; }

  .contact-bio {
    padding-top: 48px;
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }
  .contact-bio-text { flex: 1; }
  .contact-bio-title {
    font-family: var(--font-serif);
    font-size: 26px;
    font-weight: 600;
    font-style: italic;
    color: var(--color-cream);
    margin-bottom: 16px;
  }
  .contact-bio-text p {
    font-family: var(--font-serif);
    font-size: 16px;
    color: rgba(250,246,241,0.75);
    line-height: 1.75;
    margin-bottom: 16px;
  }
  .contact-bio-photo { flex-shrink: 0; width: 280px; }
  .contact-portrait { width: 100%; display: block; }

  @media (max-width: 768px) {
    .contact-header { padding: 48px 20px 40px; }
    .contact-heading { font-size: 36px; }
    .contact-body { padding: 0 20px 64px; }
    .contact-bio { flex-direction: column; }
    .contact-bio-photo { width: 100%; max-width: 320px; }
  }
</style>
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/halfthesky.astro src/pages/getintouch.astro
git commit -m "feat: restyle halfthesky and contact pages with dark wine theme"
```

---

## Task 8: Test event + font cleanup

**Files:**
- Create: `src/content/events/upcoming-workshop.md`
- Create: `public/assets/poster-mar29.png` (copy from brainstorm dir if not present)
- Delete: `public/fonts/` directory (14 Proxima Nova .otf files)

- [ ] **Step 1: Check if poster already exists in public/assets**

```bash
ls /Users/qionglu/Documents/Claude/insync/public/assets/
```

If `poster-mar29.png` is not listed, copy it:

```bash
cp "/Users/qionglu/Documents/Claude/insync/.superpowers/brainstorm/5812-1774755280/poster-mar29.png" \
   "/Users/qionglu/Documents/Claude/insync/public/assets/poster-mar29.png"
```

- [ ] **Step 2: Create src/content/events/upcoming-workshop.md**

```markdown
---
title: "Write About NYC — The World's Borough"
date: 2026-06-15T11:00:00
endDate: 2026-06-15T13:00:00
location: "Jackson Heights, Queens"
category: Workshop
series: "Writing Workshop Series"
image: /assets/poster-mar29.png
rsvpUrl: https://lu.ma/insync
---

A writing workshop for creative minds in diaspora. Bring a pen, bring your stories, and find your voice in the borough that holds the world.
```

> **Note:** This file uses `2026-06-15` (future date). It enables testing the "upcoming workshop" hero flow including blurred poster background, "More Info" + "Register" buttons, and event strip with RSVP. **Replace with a real event when one is scheduled, or remove this file.**

- [ ] **Step 3: Delete public/fonts/ directory**

```bash
rm -rf /Users/qionglu/Documents/Claude/insync/public/fonts
```

Verify:
```bash
ls /Users/qionglu/Documents/Claude/insync/public/
```

Expected: No `fonts/` directory. All 14 Proxima Nova `.otf` files are gone.

- [ ] **Step 4: Full build + visual check**

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run build
```

Expected: Clean build. No missing font errors (the `@font-face` declarations referencing these files were removed in Task 1).

```bash
cd /Users/qionglu/Documents/Claude/insync && npm run dev
```

Open http://localhost:4321 and verify:
- Hero shows **"Upcoming Workshop"** eyebrow (not "Past Workshop")
- Title: "Write About NYC — The World's Borough"
- Blurred poster image visible behind the dark event card
- **Both** "More Info" and "Register" buttons visible
- Event strip shows "REGISTER →" button linking to `https://lu.ma/insync`
- Past Workshops grid still shows dinner-and-design and art-of-waiting cards

Also check `/events` — the new event should appear in the "Upcoming" section.

- [ ] **Step 5: Commit**

```bash
git add src/content/events/upcoming-workshop.md public/assets/poster-mar29.png
git rm -r public/fonts/
git commit -m "feat: add test upcoming event, copy poster asset, remove Proxima Nova fonts"
```

---

## Final Checklist

After all 8 tasks complete:

- [ ] `npm run build` — clean build, zero errors
- [ ] All routes respond: `/`, `/events`, `/events/write-about-nyc-the-worlds-borough`, `/events/dinner-and-design`, `/about`, `/getintouch`, `/blog`, `/blog/belonging-nowhere`, `/halfthesky`
- [ ] Nav shows exactly 3 links: **Events · About · Contact**
- [ ] Footer shows: **Events · About · Contact · Essays & Videos · Instagram**
- [ ] `/blog` accessible only via Footer "Essays & Videos" link (not in main nav)
- [ ] `/halfthesky` accessible via direct URL (not in nav or footer — pre-existing quirk; it's fine)
- [ ] `/admin` still accessible (Decap CMS — unchanged)
- [ ] Deploy to Netlify (push to `main`) and verify production build
