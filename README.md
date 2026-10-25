# Clifton Lewis: personal website

Live at **https://cliftonlewis.github.io**. A plain static site on GitHub Pages: HTML pages, one stylesheet (`assets/style.css`) and one script (`assets/site.js`). There's no build step, so editing a file and pushing it to `main` updates the site within a minute or two.

## Editing

Most settings live at the top of `assets/site.js`.

| What | Where |
| --- | --- |
| Name, job title, place, social links | `SITE` block at the top of `assets/site.js`. Leave a link as `""` to hide it everywhere. |
| Home header buttons | `HEADER_LINKS` in `assets/site.js` |
| Contact form | Sends through FormSubmit using the private key in `formKey`, so your email address isn't anywhere in the site's code. To use a different inbox, put the new address in `formTo`, clear `formKey`, send one message, click FormSubmit's activation link, then put the new key in `formKey` and clear `formTo` again. The address is never shown on the site, to keep spam down. |
| Visit counting | Sign up (free) at [goatcounter.com](https://www.goatcounter.com), then put your site code in `goatcounter`, e.g. `"cliftonlewis"`. Visits then show at `https://cliftonlewis.goatcounter.com`. |
| Papers | The `PUBS` list in `assets/site.js` (title, authors, venue, DOI, blurb; `featured: true` puts a paper in the Papers page highlights). New papers on your public ORCID record, or in Crossref with your ORCID iD, also appear automatically on the Papers page and CV. Copy them into `PUBS` to add a blurb or feature them. |
| Species names in italics in paper titles | `SPECIES` in `assets/site.js` |
| Page text | `index.html`, `research.html`, `publications.html`, `resources.html`, `cv.html`, `contact.html` |
| Research tiles on Home | The `tiles` block in `index.html`. Each tile names its shape and colours with `data-shape`, `data-bg` and `data-fg`. |
| Your photo | Add `assets/headshot.jpg` and set `photo: "assets/headshot.jpg"` |
| Colours and fonts | Tokens at the top of `assets/style.css` (Jost for headings, Instrument Sans for text) |
| Footer "Updated" date | Automatic: it shows the month the site was last published. `updated` in `SITE` is only a fallback. |

## How the design works

- **One colour and one shape per page**, set in `PAGES` in `assets/site.js`: Home tomato with the nerve net, Research magenta with halves, Papers forest with pills, Resources marigold with dots, CV cornflower with a square and triangle, Contact orange with a clover. The shape appears in the page header and as that page's footer link.
- **Shapes** are drawn in `SHAPES` in `assets/site.js` on a 200 × 200 grid. The four research themes have their own animated shapes (beads, split, lineage, flower), which loop on the Research page and the Home tiles.
- **Home nerve net**: `nerveNet()` in `assets/site.js`. The seven animals and their colours are in `ANIMALS`; `spots` places them on the net. Hovering or tabbing to an animal shows its name.
- **Motion** is switched off for visitors who ask their device for reduced motion.
- The site has a light look only, by choice.

## Sharing and search

- **Share preview**: `assets/og.png` (1200 × 630) appears when a link is posted on Bluesky, LinkedIn, Slack and similar. It's a screenshot of the Home header, so if the name or tagline changes, ask for it to be regenerated.
- **Search engines**: each page has a canonical address; `index.html` describes you as a person to Google (ORCID, Scholar, Bluesky, LinkedIn, ResearchGate, GitHub); `sitemap.xml` and `robots.txt` list the pages. Add any new page to `sitemap.xml`.
- To speed up indexing, add the site in [Google Search Console](https://search.google.com/search-console) and submit `https://cliftonlewis.github.io/sitemap.xml`.

## Credits

Animal silhouettes in `assets/animals/` come from [PhyloPic](https://www.phylopic.org) and are public domain (CC0 or Public Domain Mark). Contributors: Jake Warner (*Nematostella*), Maarten van der Sande (*Drosophila*), Andy Wilson (Acrididae), Birgit Lang (Tettigoniidae), Caleb Gordon (Cicadidae), Brian Bourke (Culicidae); *Sycon* is uncredited. The insect silhouettes are family-level drawings standing in for the species named on the site.
