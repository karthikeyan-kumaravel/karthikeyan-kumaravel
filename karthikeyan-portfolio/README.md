# Karthikeyan Kumaravel — Portfolio

**Team Lead | Senior Software Engineer**
**BUILD SCALABLE SOFTWARE** · Exploring AI-Native Engineering

The online home of Karthikeyan Kumaravel: a single-page portfolio about building scalable business software, leading engineering teams, and applying AI coding agents inside a disciplined engineering process.

## About

I build scalable business software, lead engineering teams, solve complex engineering problems, and explore how AI agents and modern developer tools can transform software development. My work runs from requirements to production: requirement analysis, domain design, implementation, validation, testing and deployment.

## Engineering focus

- Scalable, maintainable business applications with explicit domain workflows
- Validation, automated testing, security practices and production reliability
- Engineering leadership: task breakdown, code review, mentoring, delivery
- Business-driven engineering: real requirements over technology for its own sake

## Featured project

**RailERP — Enterprise railway project management platform.** End-to-end engineering and team leadership across LOA workflows, procurement and purchase orders, material supply, inspection, project execution (Gantt), master data, RBAC, validation and business rules, an AI Copilot and document AI. Built with Laravel, React, MariaDB and Redis. (Private enterprise codebase.)

## AI-native engineering

> AI should not replace engineering discipline. It should amplify it.

Exploring AI coding agents, context engineering, MCP, RAG, multi-agent systems, AI evaluations, observability and security — with planning, testing, evaluation and human review kept in the loop.

## Technology stack

React · TypeScript · JavaScript · Tailwind · Laravel · PHP · REST APIs · MariaDB · MySQL · Redis · Docker · Linux · Nginx · Git · GitHub · CI/CD · Claude · ChatGPT · GitHub Copilot · Ollama · RAG · MCP

---

## Project structure

```
.
├── index.html                  # The whole page (semantic HTML, SEO + OG + JSON-LD)
├── assets/
│   ├── css/styles.css          # Design tokens, layout, components, motion
│   ├── js/config.js            # ← ALL personal info, links, career, projects
│   ├── js/main.js              # Nav, tabs, stack filter, timeline, GitHub repos
│   ├── img/                    # favicon.svg, favicon-32.png, apple-touch-icon.png, og-image.png
│   └── resume/                 # Resume PDF (placeholder — replace it)
├── scripts/check.mjs           # Zero-dependency validation (npm run check)
├── .github/workflows/pages.yml # Validate + deploy to GitHub Pages on push to main
├── robots.txt, sitemap.xml
└── .nojekyll
```

No framework, no build step, no runtime dependencies. Fonts load from Google Fonts with system fallbacks.

## Personalising

1. **`assets/js/config.js`** — set `links.linkedin`, `links.github`, `links.email`, `siteUrl`, the `career` entries (title, company, dates) and any real extra `projects`. Set `showPlaceholders: false` once everything is filled in.
2. **Resume** — replace `assets/resume/Karthikeyan-Kumaravel-Resume.pdf` (or change `resume.path`).
3. **SEO tags** — in `index.html` `<head>`, `robots.txt` and `sitemap.xml`, replace `https://your-username.github.io/` with your real URL. (These must be static so link previews and crawlers see them.)

`npm run check` lists any placeholders still left.

## Running locally

```bash
# any static server works
python3 -m http.server 8080
# or
npm run serve
```

Open http://localhost:8080.

```bash
npm run check   # JS syntax, anchors, ids, ARIA refs, assets, SEO tags, placeholders
```

## Deployment (GitHub Pages)

**Option A — GitHub Actions (recommended, included)**

1. Push this repository to GitHub (e.g. `your-username.github.io` for a root URL, or any repo name for `/repo-name/`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow runs `npm run check`, then deploys.

**Option B — Deploy from branch**

1. **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
2. Save. `.nojekyll` is already included.

All asset paths are relative, so the site works both at a root domain and under a `/repo-name/` subpath. For a custom domain, add a `CNAME` file containing the domain and configure DNS per GitHub's docs.

## License

Code: MIT (see `LICENSE`). Personal content, resume and images: all rights reserved.
