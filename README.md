# IN SYNC

Content-first Astro 5 static site deployed on Netlify. Built with minimal dependencies — no frontend JS frameworks, no database.

## Local Development

**Prerequisites:** Node 20 (use [nvm](https://github.com/nvm-sh/nvm): `nvm use`)

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`. Changes to `.astro`, `.md`, and `.css` files hot-reload automatically.

### Other commands

| Command             | Action                                      |
| :------------------ | :------------------------------------------ |
| `npm run dev`       | Start dev server at `localhost:4321`        |
| `npm run build`     | Build production site to `./dist/`          |
| `npm run preview`   | Preview the production build locally        |

## Deployment (CI/CD via Netlify)

The site deploys automatically — **pushing to `main` triggers a production build and deploy on Netlify**. No manual steps required after a push.

### How it works

1. Push commits to `main` on GitHub
2. Netlify detects the push via a webhook
3. Netlify runs `npm run build` (Node 20, outputs to `dist/`)
4. If the build succeeds, the new version goes live

Build config is in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

### First-time Netlify setup

If connecting a new Netlify site to this repo:

1. In Netlify, go to **Add new site → Import an existing project** and connect the GitHub repo
2. Build settings are auto-detected from `netlify.toml` — no changes needed
3. Enable **Netlify Identity** (required for the CMS): Site Settings → Identity → Enable
4. Under Identity → Services, enable **Git Gateway**
5. Invite editors via Identity → Invite users; they access the CMS at `/admin/`

### CMS (Decap CMS)

Content editors can manage blog posts and events at `/admin/`. Authentication is handled by Netlify Identity. Changes made through the CMS are committed directly to `main` and trigger an automatic deploy.

## Project Structure

```
src/
├── content/          # Markdown content (blog posts, events)
├── pages/            # File-based routes
├── components/       # Astro components (Nav, Footer, BlogCard, EventCard)
├── layouts/          # BaseLayout.astro
└── styles/           # global.css (design tokens)
public/
└── admin/            # Decap CMS admin UI (config.yml + index.html)
```
