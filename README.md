# Clifton Lewis: personal website

A plain static site for GitHub Pages. No build step is needed.

## Put it online

1. On GitHub, create a public repository named exactly **cliftonlewis.github.io**.
2. Upload everything in this folder to it (keep the `assets` folder). You can drag the files into "Add file → Upload files".
3. Go to **Settings → Pages**, set Source to "Deploy from a branch", pick `main` and `/ (root)`, then save.
4. After a minute or two the site is live at **https://cliftonlewis.github.io**.

## Editing

| What | Where |
| --- | --- |
| Name, job title, links (email, Bluesky, LinkedIn, ResearchGate, Scholar) | `assets/site.js`, the `SITE` block at the top |
| Contact form | Works once your email is set in `assets/site.js`. The first message sends you a one-time FormSubmit confirmation email; click its link to switch the form on. |
| Your photo | Add `assets/headshot.jpg`, then set `photo: "assets/headshot.jpg"` in `assets/site.js` |
| Page text | `index.html`, `research.html`, `resources.html`, `cv.html`, `contact.html` |
| CV PDF | Add `assets/Clifton_Lewis_CV.pdf` |
| Publications | Nothing to do. They load from your public ORCID record, so keep ORCID up to date. |
| Colours and fonts | `assets/style.css`, the tokens at the top |

Orange dashed boxes (class `todo`) mark places waiting for your details. Delete each one once it's filled in.

Light and dark mode follow the visitor's system setting.

Animal silhouettes in `assets/animals/` come from [PhyloPic](https://www.phylopic.org) and are public domain (CC0 or Public Domain Mark). Contributors: Jake Warner (*Nematostella*), Andy Wilson (*Drosophila*), Andy Wilson (Acrididae), Birgit Lang (Tettigoniidae), Caleb Gordon (Cicadidae), Brian Bourke (Culicidae); *Sycon* is uncredited.
