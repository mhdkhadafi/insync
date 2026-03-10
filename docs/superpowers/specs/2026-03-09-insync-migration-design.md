# IN SYNC — Squarespace Migration Design

**Date:** 2026-03-09
**Site:** https://www.insyncnyc.com
**Goal:** Migrate from Squarespace to a self-owned static site with full layout control

---

## Context

IN SYNC ("With Creative Minds in Diaspora") is a 5-page website featuring a blog, events calendar, video interview series (Half The Sky), and a contact form. Currently hosted on Squarespace.

**Migration drivers:**
- Full design control — Squarespace templates are too constraining, especially for LLM-agent-driven frontend updates
- Ownership & portability — own all code and content, no vendor lock-in

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro** | Purpose-built for content sites. Clean file structure, pure static HTML output, zero JS by default. Ideal for LLM agents to read and modify. |
| CMS | **Tina CMS** | Git-based visual editor. Content stored as Markdown files in repo. Editors see live previews while editing. No database. |
| Contact Form | **Formspree** | Free tier (50 submissions/mo). HTML form posts to Formspree endpoint, arrives by email. No backend code. |
| Hosting | **Netlify** | Free tier, auto-deploys on git push, branch preview deploys, easy custom domain setup. |
| Domain | **insyncnyc.com** | DNS updated to point to Netlify after launch. |
| Analytics | **Google Analytics** (UA-122812824-2) | Carried over from existing site. |

---

## Pages & Content Sources

| Page | Route | Content Source | Notes |
|---|---|---|---|
| Home | `/` | Static Astro file | Hero section + featured posts pulled from blog collection |
| Half The Sky | `/halfthesky` | Static Astro file | 4 YouTube-embedded episodes |
| Blog | `/blog` | Tina CMS → Markdown | Post grid, category filters, individual post pages |
| Events | `/events` | Tina CMS → Markdown | Event cards with ICS / Google Calendar export links |
| Get In Touch | `/getintouch` | Static Astro file | Contact form (Formspree), founder bio, social links |

---

## Architecture

```
GitHub repo (code + Markdown content)
    ↓ push to main
Netlify builds Astro → static HTML/CSS/JS
    ↓ deploy
insyncnyc.com (served from Netlify CDN)

Tina CMS editor → commits Markdown to GitHub → triggers Netlify rebuild
Contact form → Formspree → email to Qionglu
```

---

## Phase 1 Scope

**In scope:**
- Pixel-faithful recreation of all 5 pages
- Assets downloaded from live site (insyncnyc.com)
- All blog posts (~10) migrated as Markdown files in Tina CMS
- All events migrated as Markdown files in Tina CMS
- Contact form via Formspree (replaces newsletter signup)
- Social links: Instagram (@insync_nyc), LinkedIn, Facebook (@insyncnewyork)
- Google Analytics carry-over
- YouTube embeds for Half The Sky episodes (4)
- insyncnyc.com domain pointed to Netlify

**Out of scope (Phase 1):**
- Newsletter / mailing list
- New design or layout changes
- New pages or features
- Event registration / RSVP
- Blog comments
- Search functionality

---

## Content to Migrate

### Blog Posts (~10 articles)
Reverse-chronological, Oct 2018 – Nov 2019. Topics: immigration, identity, professional development, diaspora. Each post: title, date, author, excerpt, body, category tags.

### Events (2 documented)
- "Dinner and Design (of Life) workshop" — Jul 7, 2019, 6:00 PM
- "The Art of Waiting" — Nov 15, 2018

### Half The Sky Episodes (4)
- Ep 1: Designer Junwei Lin
- Ep 2: Jazz singer Vivi Hu
- Ep 3: Game composer Sharon Kho
- Ep 4: IMBA Interactive co-founders (game sound design)

---

## Third-Party Integrations

| Service | Purpose | Config |
|---|---|---|
| Tina CMS | Content editing | GitHub OAuth, cloud hosted editor |
| Formspree | Contact form | Free tier, email forwarding |
| Netlify | Hosting + CI/CD | GitHub repo connected, auto-deploy on push |
| Google Analytics | Analytics | UA-122812824-2 |
| YouTube | Video embeds | No API key needed, standard iframes |
| Instagram / LinkedIn / Facebook | Social footer links | Static links only |
