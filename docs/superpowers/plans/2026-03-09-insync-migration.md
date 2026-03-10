# IN SYNC Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate insyncnyc.com from Squarespace to a self-owned static site — pixel-faithful recreation of all 5 pages using Astro + Tina CMS + Formspree + Netlify.

**Architecture:** Astro generates static HTML/CSS from `.astro` components and Markdown content files. Tina CMS provides a visual web editor that commits Markdown directly to the GitHub repo. Netlify auto-deploys on every push to `main`.

**Tech Stack:** Astro (SSG), Tina CMS (Git-based headless CMS), Formspree (contact form), Netlify (hosting + CI/CD), TypeScript, CSS custom properties

---

## Reference Data

### Blog Posts (8 to migrate)
| Date | Title | Slug |
|------|-------|------|
| Nov 5, 2019 | Manage Expectations So You Can Do More | `nothing-to-lose` |
| Oct 31, 2019 | Define Your Own Success. With Jilly Traganou. Part III | `define-your-own-success` |
| Oct 23, 2019 | The Personal Boundaries In America. With Jilly Traganou. Part II | `the-personal-boundaries-in-america` |
| Sep 20, 2019 | Does Our English Accent Matter? With Jilly Traganou. Part I | `does-our-english-accent-matter` |
| Aug 22, 2019 | Belonging Nowhere Makes Me Who I Am | `belonging-nowhere` |
| Jun 24, 2019 | The Falling of Elizabeth Holmes | `elizabeth-holmes` |
| Jun 13, 2019 | Tonight, I Came Out To My (Asian) Parents | `came-out-to-parents` |
| Oct 6, 2018 | Why I Created IN SYNC | `why-i-created-in-sync` |

### Events (3 to migrate)
| Date | Title | Category |
|------|-------|----------|
| Jul 7, 2019, 6–8:30 PM | Dinner and Design (of Life) | Workshop |
| Nov 15, 2018, 7–9 PM | The Art of Waiting | Forum |
| Oct 17, 2018, 7–9 PM | Know Thyself | Forum |

### Assets to Download
- Logo: `https://images.squarespace-cdn.com/content/v1/5ba7cbdeb91449215ec1cecb/1537826991356-768CDPCUYAZ8AVNI6LWR/WechatIMG6762.png`
- Hero GIF: `https://images.squarespace-cdn.com/content/v1/5ba7cbdeb91449215ec1cecb/1573087284143-ZQ1LDG7HG2Q672MK6CLN/Website-Concept_1_1.gif`
- Blog post images: fetch URLs from each post page during content migration (Task 9)
- Event images: fetch URLs from each event page during content migration (Task 10)

### Known Design Tokens
- Dark text: `rgba(34, 34, 34, 1)` → `#222222`
- White: `rgba(255, 255, 255, 1)` → `#ffffff`
- Overlay: `rgba(0, 0, 0, 0.7)`
- Grid max-width: `320px` columns, `20px` gutter
- Gallery aspect ratio: 3:2
- **Action required:** Open https://www.insyncnyc.com in browser dev tools before starting Task 3 to extract: font family name(s), body font size, heading sizes, nav height, link color, accent color.

### Third-Party Keys Needed
- Formspree: create free account at formspree.io, get endpoint URL
- Tina CMS: create free account at tina.io, get `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN`
- Google Analytics: existing ID `UA-122812824-2` (carry over as-is)
- Netlify: connect GitHub repo after Task 1 is pushed

---

## File Structure

```
insync/
├── src/
│   ├── content/
│   │   ├── config.ts              # Astro content collection schemas
│   │   ├── blog/                  # Markdown blog posts (edited via Tina)
│   │   │   └── *.md               # One file per post
│   │   └── events/                # Markdown events (edited via Tina)
│   │       └── *.md               # One file per event
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell: <head>, nav, footer, slot
│   ├── components/
│   │   ├── Nav.astro              # Top navigation bar
│   │   ├── Footer.astro           # Footer: social icons, copyright
│   │   ├── BlogCard.astro         # Blog post preview card (used on /blog and home)
│   │   └── EventCard.astro        # Event listing card (used on /events)
│   ├── pages/
│   │   ├── index.astro            # Home page
│   │   ├── halfthesky.astro       # Half The Sky video series
│   │   ├── getintouch.astro       # Contact form (Formspree)
│   │   ├── blog/
│   │   │   ├── index.astro        # Blog listing with category filter
│   │   │   └── [slug].astro       # Individual blog post
│   │   └── events/
│   │       ├── index.astro        # Events listing
│   │       └── [slug].astro       # Individual event page
│   └── styles/
│       └── global.css             # CSS custom properties, reset, typography
├── public/
│   └── assets/                    # Downloaded images (logo, post/event images)
├── tina/
│   └── config.ts                  # Tina CMS collection definitions
├── astro.config.mjs
├── netlify.toml
└── package.json
```

---

## Chunk 1: Project Setup & Configuration

### Task 1: Initialize Astro Project

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json`
- Create: `netlify.toml`
- Create: `tsconfig.json`

- [ ] **Step 1: Scaffold Astro project**

Run in `/Users/dafidafidafidafidafi/Documents/Projects/insync`:
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --git false
```
Expected: Astro scaffold created. Files: `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, `src/pages/index.astro`.

- [ ] **Step 2: Install dependencies**
```bash
npm install
```
Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Verify Astro dev server starts**
```bash
npm run dev
```
Expected: `http://localhost:4321` responds. Stop server (Ctrl+C).

- [ ] **Step 4: Create netlify.toml**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 5: Verify build**
```bash
npm run build
```
Expected: `dist/` created, `dist/index.html` exists. No errors.

- [ ] **Step 6: Commit**
```bash
git add astro.config.mjs tsconfig.json package.json package-lock.json netlify.toml src/
git commit -m "feat: scaffold Astro project"
```

---

### Task 2: Set Up Tina CMS

**Files:**
- Create: `tina/config.ts`
- Modify: `package.json` (scripts updated by Tina init)

- [ ] **Step 1: Run Tina init**
```bash
npx @tinacms/cli@latest init
```
When prompted:
- Framework: **Other**
- Package manager: **npm**

Expected: `tina/` directory created with `config.ts`. `package.json` scripts updated:
```json
"dev": "tinacms dev -c \"astro dev\"",
"build": "tinacms build && astro build"
```

- [ ] **Step 2: Verify Tina added its scripts**
```bash
cat package.json | grep -A5 '"scripts"'
```
Expected: Both `dev` and `build` scripts reference `tinacms`.

- [ ] **Step 3: Create Astro content collections schema**

Create `src/content/config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Qionglu Lei'),
    excerpt: z.string().optional(),
    categories: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    category: z.enum(['Workshop', 'Forum', 'Talk', 'Other']),
    image: z.string().optional(),
  }),
});

export const collections = { blog, events };
```

- [ ] **Step 4: Replace tina/config.ts with full schema**

Replace the contents of `tina/config.ts`:
```typescript
import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.HEAD || 'main',
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'assets',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        fields: [
          { name: 'title', type: 'string', label: 'Title', required: true },
          { name: 'date', type: 'datetime', label: 'Date', required: true },
          { name: 'author', type: 'string', label: 'Author' },
          { name: 'excerpt', type: 'string', label: 'Excerpt', ui: { component: 'textarea' } },
          { name: 'categories', type: 'string', label: 'Categories', list: true },
          { name: 'image', type: 'image', label: 'Cover Image' },
          { name: 'body', type: 'rich-text', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'event',
        label: 'Events',
        path: 'src/content/events',
        format: 'md',
        fields: [
          { name: 'title', type: 'string', label: 'Title', required: true },
          { name: 'date', type: 'datetime', label: 'Start Date & Time', required: true },
          { name: 'endDate', type: 'datetime', label: 'End Date & Time' },
          { name: 'location', type: 'string', label: 'Location' },
          {
            name: 'category',
            type: 'string',
            label: 'Category',
            options: ['Workshop', 'Forum', 'Talk', 'Other'],
          },
          { name: 'image', type: 'image', label: 'Event Image' },
          { name: 'body', type: 'rich-text', label: 'Description', isBody: true },
        ],
      },
    ],
  },
});
```

- [ ] **Step 5: Create placeholder content directories**
```bash
mkdir -p src/content/blog src/content/events public/assets
```

- [ ] **Step 6: Verify build still passes**
```bash
npm run build
```
Expected: Build completes without errors. (Tina generates `public/admin/` during build.)

- [ ] **Step 7: Commit**
```bash
git add tina/ src/content/ public/ package.json package-lock.json
git commit -m "feat: add Tina CMS with blog and events schemas"
```

---

## Chunk 2: Design System & Layout

### Task 3: Document Design Tokens from Live Site

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Inspect live site in browser**

Open https://www.insyncnyc.com in Chrome/Firefox. Open DevTools → Elements panel. Record:
- Nav font family (inspect `<nav>` or logo element)
- Body font family (inspect `<p>` elements in blog/home)
- Heading font family (inspect `<h1>`, `<h2>`)
- Link color (hover and default)
- Background color of page
- Nav background color
- Nav link font size

Note: Known values already captured:
- Dark text: `#222222`
- Grid gutter: `20px`

- [ ] **Step 2: Create global.css with design tokens**

Create `src/styles/global.css` using the values from Step 1. Replace `<FONT_FAMILY_*>` with actual values found:
```css
/* ============================================
   Design Tokens — IN SYNC
   Values extracted from insyncnyc.com
   ============================================ */
:root {
  /* Colors */
  --color-text: #222222;
  --color-text-light: #666666;
  --color-bg: #ffffff;
  --color-overlay: rgba(0, 0, 0, 0.7);
  --color-border: #e8e8e8;
  --color-accent: #222222; /* Update with actual accent color from live site */

  /* Typography — fill in after inspecting live site */
  --font-heading: <FONT_FAMILY_HEADING>, serif;
  --font-body: <FONT_FAMILY_BODY>, sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-lg: 20px;
  --font-size-xl: 28px;
  --font-size-xxl: 40px;
  --line-height-body: 1.7;
  --line-height-heading: 1.2;

  /* Layout */
  --max-width: 1200px;
  --gutter: 20px;
  --nav-height: 60px; /* Update from live site inspection */
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: var(--font-size-base); }
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: var(--line-height-body);
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; }

/* Container */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
```

- [ ] **Step 3: Add Google Font imports (if applicable)**

If the live site uses Google Fonts (inspect the `<head>` for `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` or `@import url(...)`), add the corresponding import at the top of `global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=<FONT_NAME>:wght@400;600;700&display=swap');
```

- [ ] **Step 4: Verify no placeholders remain before committing**
```bash
grep '<FONT_' src/styles/global.css
```
Expected: **no output**. If any `<FONT_FAMILY_*>` or `<FONT_NAME>` strings appear, return to Step 1 and complete the browser inspection before continuing.

- [ ] **Step 5: Commit**
```bash
git add src/styles/global.css
git commit -m "feat: add design system — CSS custom properties and reset"
```

---

### Task 4: Build Nav Component

**Files:**
- Create: `src/components/Nav.astro`

Reference the live site nav: Logo left, links right: Home | Half The Sky | Blog | Events | Get In Touch.

- [ ] **Step 1: Create Nav.astro**

Create `src/components/Nav.astro`:
```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/halfthesky', label: 'Half The Sky' },
  { href: '/blog', label: 'Blog' },
  { href: '/events', label: 'Events' },
  { href: '/getintouch', label: 'Get In Touch' },
];

const currentPath = Astro.url.pathname;
---

<nav class="nav">
  <div class="nav__inner container">
    <a href="/" class="nav__logo">
      <img src="/assets/logo.png" alt="IN SYNC" height="40" />
    </a>
    <ul class="nav__links">
      {navLinks.map(link => (
        <li>
          <a
            href={link.href}
            class:list={['nav__link', { 'nav__link--active': currentPath === link.href }]}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    height: var(--nav-height);
  }
  .nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .nav__logo img { height: 40px; width: auto; }
  .nav__links {
    display: flex;
    list-style: none;
    gap: 32px;
  }
  .nav__link {
    font-size: var(--font-size-sm);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text);
    transition: opacity 0.2s;
  }
  .nav__link:hover { opacity: 0.6; text-decoration: none; }
  .nav__link--active { border-bottom: 1px solid var(--color-text); }

  @media (max-width: 768px) {
    .nav__links { gap: 16px; }
    .nav__link { font-size: 11px; }
  }
</style>
```

- [ ] **Step 2: Start dev server and compare nav against live site**
```bash
npm run dev
```
Open http://localhost:4321 and https://www.insyncnyc.com side by side. Adjust spacing, font-size, and colors in the `<style>` block until the following match:
- Nav height matches `--nav-height` value from `global.css`
- Link font-size matches `--font-size-sm`
- Link color, hover opacity, and active underline all match the live site
Stop server (Ctrl+C) when satisfied.

- [ ] **Step 3: Verify build passes**
```bash
npm run build
```
Expected: No errors. `dist/index.html` exists.

- [ ] **Step 4: Commit**
```bash
git add src/components/Nav.astro
git commit -m "feat: add Nav component"
```

---

### Task 5: Build Footer Component

**Files:**
- Create: `src/components/Footer.astro`

Live site footer: Instagram (@insync_nyc), LinkedIn, Facebook (@insyncnewyork). "Powered by Squarespace" line will be removed.

- [ ] **Step 1: Create Footer.astro**

Create `src/components/Footer.astro`:
```astro
---
const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/insync_nyc/',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/insync-nyc/',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/insyncnewyork/',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  },
];
---

<footer class="footer">
  <div class="footer__inner container">
    <div class="footer__social">
      {socialLinks.map(link => (
        <a href={link.href} class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label={link.label}>
          <Fragment set:html={link.icon} />
        </a>
      ))}
    </div>
    <p class="footer__copy">&copy; {new Date().getFullYear()} IN SYNC. All rights reserved.</p>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--color-border);
    padding: 40px 0;
    margin-top: 80px;
  }
  .footer__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .footer__social {
    display: flex;
    gap: 20px;
  }
  .footer__social-link {
    color: var(--color-text);
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .footer__social-link:hover { opacity: 1; text-decoration: none; }
  .footer__copy {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
  }
</style>
```

- [ ] **Step 2: Verify build passes**
```bash
npm run build
```
Expected: No errors. If SVG strings or template syntax are malformed, the build will fail with a clear error message.

- [ ] **Step 3: Commit**
```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component with social links"
```

---

### Task 6: Build BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Download logo asset**
```bash
curl -L "https://images.squarespace-cdn.com/content/v1/5ba7cbdeb91449215ec1cecb/1537826991356-768CDPCUYAZ8AVNI6LWR/WechatIMG6762.png" -o public/assets/logo.png
```
Expected: `public/assets/logo.png` exists and is a valid PNG.

- [ ] **Step 2: Create BaseLayout.astro**

Create `src/layouts/BaseLayout.astro`:
```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'IN SYNC — With Creative Minds in Diaspora' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | IN SYNC</title>
    <link rel="icon" type="image/png" href="/assets/logo.png" />
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-122812824-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-122812824-2');
    </script>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: Replace placeholder index.astro to test layout**

Replace `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <div class="container" style="padding-top: 80px;">
    <h1>IN SYNC</h1>
    <p>With Creative Minds in Diaspora</p>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Verify dev server renders nav + footer**
```bash
npm run dev
```
Open http://localhost:4321. Confirm: nav visible with logo and links, footer visible with social icons. Stop server.

- [ ] **Step 5: Verify build**
```bash
npm run build
```
Expected: No errors.

- [ ] **Step 6: Commit**
```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro public/assets/logo.png
git commit -m "feat: add BaseLayout with nav, footer, and GA"
```

---

## Chunk 3: Static Pages

### Task 7: Build Home Page

**Files:**
- Modify: `src/pages/index.astro`

The home page on the live site has: tagline hero, animated GIF CTA for Half The Sky, and a grid of featured blog post cards.

- [ ] **Step 1: Download hero GIF**
```bash
curl -L "https://images.squarespace-cdn.com/content/v1/5ba7cbdeb91449215ec1cecb/1573087284143-ZQ1LDG7HG2Q672MK6CLN/Website-Concept_1_1.gif" -o public/assets/hero.gif
```

- [ ] **Step 2: Create BlogCard component**

Create `src/components/BlogCard.astro`:
```astro
---
interface Props {
  title: string;
  date: Date;
  author: string;
  excerpt?: string;
  slug: string;
  image?: string;
}
const { title, date, author, excerpt, slug, image } = Astro.props;
const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---

<article class="blog-card">
  {image && <a href={`/blog/${slug}`}><img src={image} alt={title} class="blog-card__image" /></a>}
  <div class="blog-card__body">
    <p class="blog-card__meta">{formattedDate} · {author}</p>
    <h2 class="blog-card__title"><a href={`/blog/${slug}`}>{title}</a></h2>
    {excerpt && <p class="blog-card__excerpt">{excerpt}</p>}
    <a href={`/blog/${slug}`} class="blog-card__read-more">Read More →</a>
  </div>
</article>

<style>
  .blog-card { margin-bottom: 48px; }
  .blog-card__image { width: 100%; aspect-ratio: 3/2; object-fit: cover; margin-bottom: 16px; }
  .blog-card__meta { font-size: var(--font-size-sm); color: var(--color-text-light); margin-bottom: 8px; }
  .blog-card__title { font-family: var(--font-heading); font-size: var(--font-size-xl); line-height: var(--line-height-heading); margin-bottom: 12px; }
  .blog-card__title a:hover { text-decoration: underline; }
  .blog-card__excerpt { color: var(--color-text-light); margin-bottom: 12px; line-height: var(--line-height-body); }
  .blog-card__read-more { font-size: var(--font-size-sm); letter-spacing: 0.05em; }
  .blog-card__read-more:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 3: Build index.astro with hero and featured posts**

Replace `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import BlogCard from '../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const featuredPosts = allPosts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 4);
---

<BaseLayout title="Home" description="IN SYNC — With Creative Minds in Diaspora">

  <!-- Hero -->
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__text">
        <h1 class="hero__title">IN SYNC</h1>
        <p class="hero__tagline">With Creative Minds in Diaspora</p>
      </div>
      <a href="/halfthesky" class="hero__cta">
        <img src="/assets/hero.gif" alt="Check out interview series Half The Sky" class="hero__gif" />
        <span class="hero__cta-label">Check out interview series Half The Sky →</span>
      </a>
    </div>
  </section>

  <!-- Featured Stories -->
  <section class="featured">
    <div class="container">
      <h2 class="featured__heading">Stories</h2>
      <div class="featured__grid">
        {featuredPosts.map(post => (
          <BlogCard
            title={post.data.title}
            date={post.data.date}
            author={post.data.author}
            excerpt={post.data.excerpt}
            slug={post.slug}
            image={post.data.image}
          />
        ))}
      </div>
      <a href="/blog" class="featured__all-link">View all stories →</a>
    </div>
  </section>

</BaseLayout>

<style>
  .hero { padding: 80px 0 60px; }
  .hero__inner { display: flex; flex-direction: column; gap: 40px; }
  .hero__title { font-family: var(--font-heading); font-size: var(--font-size-xxl); line-height: var(--line-height-heading); }
  .hero__tagline { font-size: var(--font-size-lg); color: var(--color-text-light); margin-top: 8px; }
  .hero__cta { display: inline-flex; flex-direction: column; gap: 12px; }
  .hero__gif { max-width: 400px; }
  .hero__cta-label { font-size: var(--font-size-sm); letter-spacing: 0.05em; }
  .hero__cta:hover .hero__cta-label { text-decoration: underline; }

  .featured { padding: 60px 0; }
  .featured__heading { font-family: var(--font-heading); font-size: var(--font-size-xl); margin-bottom: 40px; }
  .featured__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px; }
  .featured__all-link { display: inline-block; margin-top: 32px; font-size: var(--font-size-sm); letter-spacing: 0.05em; }
  .featured__all-link:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 4: Verify dev server — compare home page against live site**
```bash
npm run dev
```
Open http://localhost:4321 and https://www.insyncnyc.com side by side. Adjust styles until layout matches.

- [ ] **Step 5: Verify build**
```bash
npm run build
```
Expected: Build succeeds. (Note: no blog posts exist yet — `featuredPosts` will be empty. That's fine for now.)

- [ ] **Step 6: Commit**
```bash
git add src/pages/index.astro src/components/BlogCard.astro public/assets/hero.gif
git commit -m "feat: build home page with hero and featured posts grid"
```

---

### Task 8: Build Half The Sky & Get In Touch Pages

**Files:**
- Create: `src/pages/halfthesky.astro`
- Create: `src/pages/getintouch.astro`

- [ ] **Step 1: Create halfthesky.astro**

Create `src/pages/halfthesky.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const episodes = [
  {
    number: 4,
    title: 'IMBA Interactive — Game Sound Design',
    description: 'Co-founders of IMBA Interactive discuss game sound design.',
    youtubeId: '', // TODO: find YouTube video ID from the live site /halfthesky page
  },
  {
    number: 3,
    title: 'Sharon Kho — From Fashion to Game Composer',
    description: 'Game composer Sharon Kho\'s transition from fashion design.',
    youtubeId: '', // TODO: find YouTube video ID
  },
  {
    number: 2,
    title: 'Vivi Hu — Jazz Singer in New York',
    description: 'Jazz singer Vivi Hu\'s journey establishing herself in New York.',
    youtubeId: '', // TODO: find YouTube video ID
  },
  {
    number: 1,
    title: 'Junwei Lin — Designer Across Cultures',
    description: 'Designer Junwei Lin\'s experiences across multiple countries.',
    youtubeId: '', // TODO: find YouTube video ID
  },
];
---

<BaseLayout title="Half The Sky" description="Half The Sky — A video interview series featuring Asian women with unconventional career paths.">
  <div class="container">
    <section class="hts-hero">
      <h1 class="hts-hero__title">Half The Sky</h1>
      <p class="hts-hero__intro">Women hold up half the sky! Documenting stories of Asian women who pursued non-traditional careers.</p>
    </section>

    <section class="episodes">
      {episodes.map(ep => (
        <article class="episode">
          <div class="episode__number">Episode {ep.number}</div>
          <h2 class="episode__title">{ep.title}</h2>
          <p class="episode__description">{ep.description}</p>
          {ep.youtubeId ? (
            <div class="episode__video">
              <iframe
                src={`https://www.youtube.com/embed/${ep.youtubeId}`}
                title={ep.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          ) : (
            <p class="episode__video-placeholder">Video coming soon</p>
          )}
        </article>
      ))}
    </section>
  </div>
</BaseLayout>

<style>
  .hts-hero { padding: 80px 0 60px; }
  .hts-hero__title { font-family: var(--font-heading); font-size: var(--font-size-xxl); margin-bottom: 16px; }
  .hts-hero__intro { font-size: var(--font-size-lg); color: var(--color-text-light); max-width: 600px; line-height: var(--line-height-body); }

  .episodes { display: flex; flex-direction: column; gap: 64px; padding-bottom: 80px; }
  .episode__number { font-size: var(--font-size-sm); letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-light); margin-bottom: 8px; }
  .episode__title { font-family: var(--font-heading); font-size: var(--font-size-xl); margin-bottom: 12px; }
  .episode__description { color: var(--color-text-light); margin-bottom: 20px; }
  .episode__video { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 720px; }
  .episode__video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
  .episode__video-placeholder { color: var(--color-text-light); font-style: italic; }
</style>
```

**Note:** After creating this file, visit https://www.insyncnyc.com/halfthesky and inspect the YouTube links to find the actual video IDs. Replace the empty `youtubeId` strings with the real IDs (the part after `youtube.com/watch?v=`).

- [ ] **Step 2: Find YouTube video IDs from live site**

Visit https://www.insyncnyc.com/halfthesky. Click each "Watch This Episode" link. Extract the `v=` parameter from each YouTube URL and update the `youtubeId` fields in `halfthesky.astro`.

- [ ] **Step 3: Create getintouch.astro**

Create `src/pages/getintouch.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
// Replace FORMSPREE_ID with your actual Formspree form ID from formspree.io/dashboard
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/FORMSPREE_ID';
---

<BaseLayout title="Get In Touch" description="Reach out to IN SYNC — With Creative Minds in Diaspora">
  <div class="container">
    <section class="contact">
      <h1 class="contact__title">Get In Touch</h1>
      <p class="contact__tagline">With Creative Minds in Diaspora</p>

      <form
        action={FORMSPREE_ENDPOINT}
        method="POST"
        class="contact__form"
      >
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required placeholder="Your name" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" required rows="6" placeholder="Say hello..."></textarea>
        </div>
        <button type="submit" class="contact__submit">Send Message</button>
      </form>

      <div class="contact__bio">
        <p>You can also reach Qionglu directly by email. She invites submissions for the site's featured content.</p>
      </div>
    </section>
  </div>
</BaseLayout>

<style>
  .contact { padding: 80px 0; max-width: 560px; }
  .contact__title { font-family: var(--font-heading); font-size: var(--font-size-xxl); margin-bottom: 8px; }
  .contact__tagline { color: var(--color-text-light); margin-bottom: 48px; }
  .contact__form { display: flex; flex-direction: column; gap: 24px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-size: var(--font-size-sm); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  .form-group input,
  .form-group textarea {
    border: 1px solid var(--color-border);
    padding: 12px 16px;
    font-family: var(--font-body);
    font-size: var(--font-size-base);
    color: var(--color-text);
    background: var(--color-bg);
    width: 100%;
    transition: border-color 0.2s;
  }
  .form-group input:focus,
  .form-group textarea:focus { outline: none; border-color: var(--color-text); }
  .contact__submit {
    background: var(--color-text);
    color: var(--color-bg);
    border: none;
    padding: 14px 32px;
    font-family: var(--font-body);
    font-size: var(--font-size-sm);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    align-self: flex-start;
    transition: opacity 0.2s;
  }
  .contact__submit:hover { opacity: 0.75; }
  .contact__bio { margin-top: 48px; padding-top: 48px; border-top: 1px solid var(--color-border); color: var(--color-text-light); line-height: var(--line-height-body); }
</style>
```

**Action required:** Create a free Formspree account at https://formspree.io, create a new form, and replace `FORMSPREE_ID` in `getintouch.astro` with your actual form ID.

- [ ] **Step 4: Verify no empty YouTube IDs remain**
```bash
grep "youtubeId: ''" src/pages/halfthesky.astro
```
Expected: **no output**. If any empty IDs appear, complete Step 2 before continuing.

- [ ] **Step 5: Verify Formspree ID is set**
```bash
grep 'FORMSPREE_ID' src/pages/getintouch.astro
```
Expected: **no output**. If the literal string `FORMSPREE_ID` appears, create your Formspree account and replace the placeholder before continuing.

- [ ] **Step 6: Verify both pages build**
```bash
npm run build
```
Expected: `dist/halfthesky/index.html` and `dist/getintouch/index.html` exist. No errors.

- [ ] **Step 7: Compare pages against live site visually**
```bash
npm run dev
```
Open http://localhost:4321/halfthesky and http://localhost:4321/getintouch side by side with the live equivalents. Adjust styles to match. Stop server.

- [ ] **Step 8: Commit**
```bash
git add src/pages/halfthesky.astro src/pages/getintouch.astro
git commit -m "feat: add Half The Sky and Get In Touch pages"
```

---

## Chunk 4: Blog System

### Task 9: Migrate Blog Content

**Files:**
- Create: `src/content/blog/*.md` (8 files)

- [ ] **Step 1: Fetch full content of each blog post**

For each post URL below, fetch the full body text:
- https://www.insyncnyc.com/stories-a/nothing-to-lose
- https://www.insyncnyc.com/stories-a/2019/10/2/define-your-own-success
- https://www.insyncnyc.com/stories-a/2019/10/2/the-personal-boundaries-in-america
- https://www.insyncnyc.com/stories-a/2019/9/19/does-our-english-accent-matter-a-conversation-with-jilly-traganou-part-i
- https://www.insyncnyc.com/stories-a/2019/8/22/video-series-belonging-nowhere-makes-me-who-i-am
- https://www.insyncnyc.com/stories-a/2019/6/24/the-falling-of-elizabeth-holmes-and-what-we-learn-from-it
- https://www.insyncnyc.com/stories-a/2019/6/13/tonight-i-came-out-to-my-asian-parents
- https://www.insyncnyc.com/stories-a/2018/10/5/why-i-created-in-sync10

Use the browser (or curl) to load each page and copy the article body text.

- [ ] **Step 2: Download any post cover images found**

For each post that has a cover image, download it:
```bash
curl -L "<IMAGE_URL>" -o "public/assets/<slug>-cover.jpg"
```

- [ ] **Step 3: Create Markdown file for each post**

Use the content fetched in Step 1 to create each file. Example structure for `src/content/blog/nothing-to-lose.md` — **replace everything below the `---` with the actual article body text you fetched**:
```markdown
---
title: "Manage Expectations So You Can Do More - You Have Nothing To Lose"
date: 2019-11-05
author: Qionglu Lei
excerpt: "One of the 10% of international students who pursue art and learn how to manage her expectations so that she can do more."
categories: ["Identity", "Professional Development"]
image: "/assets/nothing-to-lose-cover.jpg"
---

Actual article body goes here — copied from the live post page.
```

Repeat for all 8 posts using the slugs and titles in the Reference Data table at the top of this plan. Omit the `image` field if no cover image was found for that post.

- [ ] **Step 4: Verify blog content collection loads**
```bash
npm run build
```
Expected: Build completes. `dist/blog/` directory created with subdirectories for each post slug.

- [ ] **Step 5: Commit**
```bash
git add src/content/blog/ public/assets/
git commit -m "feat: migrate all blog posts to Markdown content collection"
```

---

### Task 10: Build Blog Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Build blog listing page**

Create `src/pages/blog/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const sortedPosts = allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

// Get unique categories
const allCategories = [...new Set(sortedPosts.flatMap(p => p.data.categories ?? []))].sort();
---

<BaseLayout title="Blog" description="Stories from IN SYNC — With Creative Minds in Diaspora">
  <div class="container">
    <section class="blog-header">
      <h1 class="blog-header__title">Stories</h1>
    </section>

    <!-- Category filter — Phase 1: cosmetic only (links render correctly but don't filter,
         since Astro SSG doesn't process query strings at runtime). Matches live site appearance. -->
    <nav class="category-filter" aria-label="Filter by category">
      <a href="/blog" class="category-filter__link category-filter__link--active">All</a>
      {allCategories.map(cat => (
        <a href={`/blog?category=${encodeURIComponent(cat)}`} class="category-filter__link">{cat}</a>
      ))}
    </nav>

    <div class="blog-grid">
      {sortedPosts.map(post => (
        <BlogCard
          title={post.data.title}
          date={post.data.date}
          author={post.data.author}
          excerpt={post.data.excerpt}
          slug={post.slug}
          image={post.data.image}
        />
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .blog-header { padding: 80px 0 40px; }
  .blog-header__title { font-family: var(--font-heading); font-size: var(--font-size-xxl); }

  .category-filter { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 48px; border-bottom: 1px solid var(--color-border); padding-bottom: 16px; }
  .category-filter__link { font-size: var(--font-size-sm); letter-spacing: 0.05em; text-transform: uppercase; color: var(--color-text-light); transition: color 0.2s; }
  .category-filter__link:hover,
  .category-filter__link--active { color: var(--color-text); text-decoration: none; border-bottom: 1px solid var(--color-text); }

  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 48px; padding-bottom: 80px; }
</style>
```

- [ ] **Step 2: Build individual blog post page**

Create `src/pages/blog/[slug].astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await post.render();

const formattedDate = post.data.date.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});
---

<BaseLayout title={post.data.title} description={post.data.excerpt}>
  <article class="post">
    {post.data.image && (
      <div class="post__cover">
        <img src={post.data.image} alt={post.data.title} />
      </div>
    )}
    <div class="container post__body-wrap">
      <header class="post__header">
        <p class="post__meta">{formattedDate} · {post.data.author}</p>
        <h1 class="post__title">{post.data.title}</h1>
        {post.data.categories && (
          <div class="post__categories">
            {post.data.categories.map(cat => <span class="post__category">{cat}</span>)}
          </div>
        )}
      </header>
      <div class="post__content">
        <Content />
      </div>
      <a href="/blog" class="post__back">← Back to Stories</a>
    </div>
  </article>
</BaseLayout>

<style>
  .post__cover img { width: 100%; max-height: 500px; object-fit: cover; }
  .post__body-wrap { max-width: 720px; padding-top: 48px; padding-bottom: 80px; }
  .post__meta { font-size: var(--font-size-sm); color: var(--color-text-light); margin-bottom: 12px; }
  .post__title { font-family: var(--font-heading); font-size: var(--font-size-xxl); line-height: var(--line-height-heading); margin-bottom: 16px; }
  .post__categories { display: flex; gap: 8px; margin-bottom: 40px; }
  .post__category { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--color-border); }
  .post__content { line-height: var(--line-height-body); }
  .post__content h2 { font-family: var(--font-heading); font-size: var(--font-size-xl); margin: 40px 0 16px; }
  .post__content p { margin-bottom: 20px; }
  .post__content a { text-decoration: underline; }
  .post__content blockquote { border-left: 3px solid var(--color-border); padding-left: 20px; color: var(--color-text-light); font-style: italic; margin: 24px 0; }
  .post__back { display: inline-block; margin-top: 48px; font-size: var(--font-size-sm); letter-spacing: 0.05em; }
  .post__back:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 3: Verify all blog pages build**
```bash
npm run build
```
Expected: `dist/blog/index.html` exists. One `dist/blog/<slug>/index.html` per post. No errors.

- [ ] **Step 4: Compare blog pages against live site**
```bash
npm run dev
```
Open http://localhost:4321/blog and https://www.insyncnyc.com/blog side by side. Check: card layout, typography, category filter appearance. Open a single post and compare against its live equivalent.

- [ ] **Step 5: Commit**
```bash
git add src/pages/blog/
git commit -m "feat: add blog listing and individual post pages"
```

---

## Chunk 5: Events System & Deployment

### Task 11: Migrate Events Content

**Files:**
- Create: `src/content/events/*.md` (3 files)

- [ ] **Step 1: Create event Markdown files**

Create `src/content/events/dinner-and-design.md`:
```markdown
---
title: "Dinner and Design (of Life) Workshop"
date: 2019-07-07T18:00:00
endDate: 2019-07-07T20:30:00
location: "Downtown Brooklyn, TBD"  # "TBD" is accurate — location was not confirmed on the live site
category: Workshop
---

Participants learn design thinking approaches to navigate career uncertainty. Shanfan Huang guides attendees through a fun hands-on life designing activity focused on anticipating changes and still feeling in control.
```

Create `src/content/events/art-of-waiting.md`:
```markdown
---
title: "The Art of Waiting"
date: 2018-11-15T19:00:00
endDate: 2018-11-15T21:00:00
location: "Pivotal Software, 636 6th Avenue, New York, NY 10011"
category: Forum
---

Panel discussion featuring product experts discussing how we build and earn trust through our communication within product teams and with stakeholders.
```

Create `src/content/events/know-thyself.md`:
```markdown
---
title: "Know Thyself"
date: 2018-10-17T19:00:00
endDate: 2018-10-17T21:00:00
location: "Pivotal Software, 636 6th Avenue, New York, NY 10011"
category: Forum
---

Explores strategies for maintaining fact-based decisions rather than giving in to pressure or power from stakeholders, and finding professional paths beyond mere likability.
```

- [ ] **Step 2: Verify events content loads**
```bash
npm run build
```
Expected: No TypeScript errors on the content schema. Build succeeds.

- [ ] **Step 3: Commit**
```bash
git add src/content/events/
git commit -m "feat: migrate all events to Markdown content collection"
```

---

### Task 12: Build Events Pages

**Files:**
- Create: `src/components/EventCard.astro`
- Create: `src/pages/events/index.astro`
- Create: `src/pages/events/[slug].astro`

- [ ] **Step 1: Create EventCard component**

Create `src/components/EventCard.astro`:
```astro
---
interface Props {
  title: string;
  date: Date;
  endDate?: Date;
  location?: string;
  category: string;
  slug: string;
  image?: string;
}
const { title, date, endDate, location, category, slug, image } = Astro.props;

const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const startTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const endTime = endDate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// ICS download URL (Google Calendar and ICS handled on detail page)
---

<article class="event-card">
  {image && <img src={image} alt={title} class="event-card__image" />}
  <div class="event-card__body">
    <span class="event-card__category">{category}</span>
    <h2 class="event-card__title"><a href={`/events/${slug}`}>{title}</a></h2>
    <p class="event-card__date">{dateStr}</p>
    <p class="event-card__time">{startTime}{endTime ? ` – ${endTime}` : ''}</p>
    {location && <p class="event-card__location">{location}</p>}
    <a href={`/events/${slug}`} class="event-card__link">View Event →</a>
  </div>
</article>

<style>
  .event-card { display: flex; flex-direction: column; gap: 12px; padding: 32px 0; border-bottom: 1px solid var(--color-border); }
  .event-card__image { width: 100%; aspect-ratio: 3/2; object-fit: cover; max-width: 300px; }
  .event-card__category { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-light); }
  .event-card__title { font-family: var(--font-heading); font-size: var(--font-size-xl); line-height: var(--line-height-heading); }
  .event-card__title a:hover { text-decoration: underline; }
  .event-card__date,
  .event-card__time,
  .event-card__location { font-size: var(--font-size-sm); color: var(--color-text-light); }
  .event-card__link { font-size: var(--font-size-sm); letter-spacing: 0.05em; margin-top: 4px; }
  .event-card__link:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Create events listing page**

Create `src/pages/events/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import EventCard from '../../components/EventCard.astro';
import { getCollection } from 'astro:content';

const allEvents = await getCollection('events');
const sortedEvents = allEvents.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<BaseLayout title="Events" description="IN SYNC Events — Workshops, forums, and gatherings for creative minds in diaspora">
  <div class="container">
    <section class="events-header">
      <h1 class="events-header__title">Events</h1>
    </section>
    <div class="events-list">
      {sortedEvents.map(event => (
        <EventCard
          title={event.data.title}
          date={event.data.date}
          endDate={event.data.endDate}
          location={event.data.location}
          category={event.data.category}
          slug={event.slug}
          image={event.data.image}
        />
      ))}
    </div>
  </div>
</BaseLayout>

<style>
  .events-header { padding: 80px 0 40px; }
  .events-header__title { font-family: var(--font-heading); font-size: var(--font-size-xxl); }
  .events-list { padding-bottom: 80px; }
</style>
```

- [ ] **Step 3: Create individual event page**

Create `src/pages/events/[slug].astro`:
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

const dateStr = event.data.date.toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});
const startTime = event.data.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const endTime = event.data.endDate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// Generate ICS content
function toICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
const icsContent = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  `DTSTART:${toICSDate(event.data.date)}`,
  event.data.endDate ? `DTEND:${toICSDate(event.data.endDate)}` : '',
  `SUMMARY:${event.data.title}`,
  event.data.location ? `LOCATION:${event.data.location}` : '',
  'END:VEVENT',
  'END:VCALENDAR',
].filter(Boolean).join('\r\n');

const icsDataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

const googleCalUrl = new URL('https://www.google.com/calendar/render');
googleCalUrl.searchParams.set('action', 'TEMPLATE');
googleCalUrl.searchParams.set('text', event.data.title);
googleCalUrl.searchParams.set('dates', `${toICSDate(event.data.date)}/${toICSDate(event.data.endDate ?? event.data.date)}`);
if (event.data.location) googleCalUrl.searchParams.set('location', event.data.location);
---

<BaseLayout title={event.data.title}>
  <div class="container">
    <article class="event-detail">
      {event.data.image && <img src={event.data.image} alt={event.data.title} class="event-detail__image" />}
      <header class="event-detail__header">
        <span class="event-detail__category">{event.data.category}</span>
        <h1 class="event-detail__title">{event.data.title}</h1>
        <p class="event-detail__date">{dateStr}</p>
        <p class="event-detail__time">{startTime}{endTime ? ` – ${endTime}` : ''}</p>
        {event.data.location && <p class="event-detail__location">{event.data.location}</p>}
        <div class="event-detail__cal-links">
          <a href={googleCalUrl.toString()} target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
          <a href={icsDataUrl} download={`${event.slug}.ics`}>Download ICS</a>
        </div>
      </header>
      <div class="event-detail__content">
        <Content />
      </div>
      <a href="/events" class="event-detail__back">← Back to Events</a>
    </article>
  </div>
</BaseLayout>

<style>
  .event-detail { max-width: 720px; padding: 80px 0; }
  .event-detail__image { width: 100%; aspect-ratio: 3/2; object-fit: cover; margin-bottom: 32px; }
  .event-detail__category { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-light); }
  .event-detail__title { font-family: var(--font-heading); font-size: var(--font-size-xxl); line-height: var(--line-height-heading); margin: 12px 0 20px; }
  .event-detail__date,
  .event-detail__time,
  .event-detail__location { font-size: var(--font-size-sm); color: var(--color-text-light); margin-bottom: 4px; }
  .event-detail__cal-links { display: flex; gap: 16px; margin-top: 16px; margin-bottom: 40px; }
  .event-detail__cal-links a { font-size: var(--font-size-sm); text-decoration: underline; }
  .event-detail__content { line-height: var(--line-height-body); }
  .event-detail__content p { margin-bottom: 20px; }
  .event-detail__back { display: inline-block; margin-top: 48px; font-size: var(--font-size-sm); }
  .event-detail__back:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 4: Verify all events pages build**
```bash
npm run build
```
Expected: `dist/events/index.html` and three event slug pages exist. No errors.

- [ ] **Step 5: Compare against live site**
```bash
npm run dev
```
Open http://localhost:4321/events and https://www.insyncnyc.com/events side by side. Adjust styles to match.

- [ ] **Step 6: Commit**
```bash
git add src/components/EventCard.astro src/pages/events/
git commit -m "feat: add events listing, detail pages, and ICS/Google Calendar export"
```

---

### Task 13: Netlify Deployment & DNS Cutover

**Files:**
- None (configuration done in Netlify dashboard and domain registrar)

- [ ] **Step 1: Push current branch to GitHub**
```bash
git push origin main
```

- [ ] **Step 2: Connect repo to Netlify**

1. Log in to https://app.netlify.com
2. Click "Add new site" → "Import an existing project" → GitHub
3. Select the `insync` repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables (Site settings → Environment variables):
   - `TINA_PUBLIC_CLIENT_ID` — from https://app.tina.io
   - `TINA_TOKEN` — from https://app.tina.io
6. Click "Deploy site"

Expected: First deploy completes. Netlify provides a `*.netlify.app` URL.

- [ ] **Step 3: Verify deployed site**

Open the Netlify URL. Check all 5 pages load correctly. Submit a test contact form — verify email arrives via Formspree.

- [ ] **Step 4: Set up Tina CMS cloud**

1. Log in to https://app.tina.io
2. Create a new project connected to the `insync` GitHub repo
3. Copy `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` to Netlify environment variables (if not already done)
4. Trigger a new Netlify deploy (Deploys → Trigger deploy)
5. Visit `https://<your-netlify-url>/admin` — confirm Tina CMS editor loads

- [ ] **Step 5: Add custom domain in Netlify**

1. Netlify → Site settings → Domain management → Add custom domain
2. Enter `insyncnyc.com`
3. Netlify will show required DNS records

- [ ] **Step 6: Update DNS at domain registrar**

Log in to the domain registrar for insyncnyc.com. Update DNS records as instructed by Netlify:
- If using Netlify DNS: update nameservers to Netlify's nameservers
- If keeping existing DNS: add the CNAME/A records Netlify provides

Expected: DNS propagation takes 5–60 minutes. Site becomes available at https://www.insyncnyc.com.

- [ ] **Step 7: Verify HTTPS and all pages on live domain**

Once DNS propagates, visit https://www.insyncnyc.com. Check:
- All 5 pages load
- SSL certificate is valid (padlock in browser)
- Contact form submits correctly
- Tina CMS editor accessible at https://www.insyncnyc.com/admin

- [ ] **Step 8: Final commit**
```bash
git add -A
git status  # Verify nothing unexpected
git commit -m "feat: complete Phase 1 migration — all pages live on insyncnyc.com"
git push origin main
```

---

## Post-Launch Checklist

After deployment, verify each item manually:

- [ ] Home page matches live Squarespace site visually
- [ ] Half The Sky page shows all 4 episodes with working YouTube embeds
- [ ] Blog listing shows all 8 posts with correct dates and excerpts
- [ ] Each individual blog post renders full content with correct formatting
- [ ] Events listing shows all 3 events with correct dates, times, and locations
- [ ] Each individual event page has working "Add to Google Calendar" and "Download ICS" links
- [ ] Get In Touch form submits and email arrives at correct inbox
- [ ] Google Analytics is firing (check GA dashboard or browser Network tab for `gtag` requests)
- [ ] Social links (Instagram, LinkedIn, Facebook) open correct profiles
- [ ] Tina CMS editor accessible at `/admin` and can edit a blog post
- [ ] Netlify deploy triggers automatically on `git push`
