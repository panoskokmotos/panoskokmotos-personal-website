# Panos Kokmotos – Personal Website

This repository contains the source code for **panoskokmotos.com**, your personal brand website.

## Tech stack

- **HTML / CSS / JavaScript** for the main single-page site (`index.html`, `style.css`, `script.js`, `chat.js`).
- **Cloudflare Worker** (`cloudflare-worker.js`) for edge routing/proxying between the front-end chat UI and AI backend.
- **GitHub Pages** + `CNAME` for deployment with custom domain.

## Main sections

- Hero + personal intro
- Journey / milestones (gamified timeline)
- Experience + media + LinkedIn cards
- Companies (formerly “Projects”)
- Press, education, books, skills, contact form

## Setup

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Brand & content checklist

- [x] Use real profile photo in hero, about, and favicon/apple touch icon.
- [x] Navigation order optimized (LinkedIn appears before Watch).
- [x] “Based in San Francisco, USA & Athens/Patras, Greece” copy update.
- [x] Skills expanded with AI-related tools.
- [x] Hobbies expanded (HYROX, CrossFit, Triathlon, Trail Running, Piano).
- [x] Better emoji usage and footer readability.
- [x] Improved subtle animations across cards.
- [x] “Projects” renamed to **Companies**.
- [ ] Replace LinkedIn card links with your **exact post URLs**.
- [ ] Replace Formspree endpoint if you want a different inbox owner.

## Analytics

This site uses **Plausible Analytics** via script in `index.html`.

Where to see analytics:
1. Sign in at `https://plausible.io`.
2. Open the site project for `panoskokmotos.com`.
3. See dashboard metrics (visitors, top pages, referrers, countries, goals).

## GitHub recommendations

### Protect main branch
On GitHub: **Settings → Branches → Add branch protection rule** for `main`.
Recommended:
- Require pull request before merging.
- Require at least 1 approval.
- Require status checks to pass (if CI enabled).
- Restrict direct pushes.

### Extra content suggestions
- Add 3–6 high-quality lifestyle/professional photos (speaking, team, events).
- Keep one clean profile portrait and one “in-action” photo for social previews.
- Create a dedicated 1200×630 OG banner image for better LinkedIn/Twitter shares.
