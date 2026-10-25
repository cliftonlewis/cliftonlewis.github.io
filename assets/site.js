// ============================================================
//  EDIT YOUR DETAILS HERE. They appear on every page.
//  Leave a link as "" to hide it.
// ============================================================
const SITE = {
  name: "Clifton Lewis",
  role: "Postdoctoral researcher, Gahan Lab",
  place: "Centre for Chromosome Biology, University of Galway",
  photo: "", // e.g. "assets/headshot.jpg" once you add a photo
  orcid: "0000-0002-3077-8150",
  // Contact form: FormSubmit's private key for your inbox, so your email address never appears in
  // the site's code. To send messages to a different address, put that address in formTo and
  // clear formKey; FormSubmit will email it a new activation link and key.
  formKey: "939f255b85ea038589ea553b19eb6ad1",
  formTo: "",
  links: {
    github: "https://github.com/cliftonlewis",
    scholar: "https://scholar.google.com/citations?user=1SMK8UIAAAAJ&hl=en",
    orcid: "https://orcid.org/0000-0002-3077-8150",
    bluesky: "https://bsky.app/profile/cliftonlewis.bsky.social",
    linkedin: "https://www.linkedin.com/in/clifton-lewis97",
    researchgate: "https://www.researchgate.net/profile/Clifton-Lewis-2",
    lab: "https://chromosome.ie/groups/gahan/"
  },
  // Visit counting with GoatCounter (free, no cookies, no banner needed). Sign up at goatcounter.com,
  // then put your site code here, e.g. "cliftonlewis" for cliftonlewis.goatcounter.com. Leave "" for off.
  goatcounter: "",
  updated: "October 2026"
};
// ============================================================

// [file, tab label, colour, shape, shape tint]. The shape is the page's header art and its footer icon.
const PAGES = [
  ["index.html", "Home", "tomato", "net", "peach"],
  ["research.html", "Research", "magenta", "halves", "blush"],
  ["publications.html", "Papers", "forest", "sheets", "mint"],
  ["resources.html", "Resources", "marigold", "dots", "orange"],
  ["cv.html", "CV", "cornflower", "steps", "sky"],
  ["contact.html", "Contact", "orange", "clover", "marigold"]
];
const LABELS = { lab: "Lab", github: "GitHub", scholar: "Google Scholar", orcid: "ORCID", bluesky: "Bluesky", linkedin: "LinkedIn", researchgate: "ResearchGate" };

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// Links shown as buttons in the homepage header (after "Message me"); the full list is on the Contact page and in the footer.
const HEADER_LINKS = ["scholar", "bluesky", "linkedin"];

function linkItems(only) {
  return Object.entries(SITE.links).filter(([k, v]) => v && (!only || only.includes(k))).map(([k, v]) =>
    `<li><a href="${esc(v)}" target="_blank" rel="noopener">${esc(LABELS[k])} ↗</a></li>`).join("");
}

// Animals I've worked with: PhyloPic silhouettes (public domain / CC0), each in its own circle.
// [file, common name, scientific name, circle colour, silhouette colour]
const ANIMALS = [
  ["sycon", "Sponge", "Sycon ciliatum", "#22805f", "#c8ebd9"],
  ["nematostella", "Sea anemone", "Nematostella vectensis", "#ef5f3c", "#f7b8d3"],
  ["locust", "Desert locust", "Schistocerca gregaria", "#f7b93e", "#c4431f"],
  ["bushcricket", "Bush cricket", "Mecopoda elongata", "#b5a136", "#3d3710"],
  ["cicada", "Periodical cicada", "Magicicada septendecula", "#5a7fc4", "#c9e3f6"],
  ["drosophila", "Fruit fly", "Drosophila melanogaster", "#d64d8c", "#f7b8d3"],
  ["mosquito", "Mosquitoes", "Aedes japonicus and Aedes koreicus", "#c9e3f6", "#3c62a8"]
];
function animalsHTML() {
  return `<ul class="critters" aria-label="Animals I've worked with">${ANIMALS.map(([f, n, sci, c]) =>
    `<li title="${esc(sci)}"><span class="disc" style="background:${c}"><span class="sil" style="-webkit-mask-image:url(assets/animals/${f}.svg);mask-image:url(assets/animals/${f}.svg)"></span></span><span class="nm">${esc(n)}</span></li>`).join("")}</ul>`;
}

// Homepage art: a nerve net, the kind of nervous system Nematostella has.
// Neurons are placed with a seeded random generator, so the pattern is the same on every visit.
function nerveNet(W, H) {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const inks = ANIMALS.map(a => a[3]);
  const pts = [];
  const cols = 9, rows = 7;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    pts.push({ x: (c + .5 + (rnd() - .5) * .9) * W / cols, y: (r + .5 + (rnd() - .5) * .9) * H / rows, k: rnd() });
  }
  let edges = "", seen = new Set();
  pts.forEach((p, i) => {
    const near = pts.map((q, j) => [j, Math.hypot(p.x - q.x, p.y - q.y)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3);
    near.forEach(([j, d], n) => {
      const key = i < j ? i + "-" + j : j + "-" + i;
      if (seen.has(key) || (n === 2 && rnd() < .5)) return; seen.add(key);
      const q = pts[j], mx = (p.x + q.x) / 2 + (rnd() - .5) * d * .5, my = (p.y + q.y) / 2 + (rnd() - .5) * d * .5;
      edges += `<path d="M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}" />`;
    });
  });
  // Seven of the neurons carry the animals I've worked with (PhyloPic silhouettes).
  // Animation delays are negative so every neuron starts mid-cycle and the net is already firing on load;
  // the animals' halos then pulse one after another, the first within half a second.
  const spots = { 12: 0, 15: 1, 31: 5, 34: 3, 48: 4, 50: 2, 52: 6 };   // grid index -> ANIMALS index
  let cells = "", big = "", tags = "";
  pts.forEach((p, i) => {
    const a = spots[i];
    if (a !== undefined) {
      const [f, n, sci, c, tint] = ANIMALS[a], R = 27;
      // Hover/focus label: common name plus scientific name(s) in italics.
      const col = i % cols, anchor = col >= 7 ? "end" : col <= 1 ? "start" : "middle";
      const tx = anchor === "end" ? p.x + R : anchor === "start" ? p.x - R : p.x;
      tags += `<g class="tag" data-a="${a}"><text x="${tx.toFixed(1)}" y="${(p.y + R + 22).toFixed(1)}" text-anchor="${anchor}">${esc(n)} <tspan class="sci">${sci.split(" and ").map(x => `<tspan font-style="italic">${esc(x)}</tspan>`).join(" and ")}</tspan></text></g>`;
      // Each animal is focusable and named for screen readers; the rest of the net is decoration.
      big += `<g class="soma big" data-a="${a}" tabindex="0" role="img" aria-label="${esc(n)}, ${esc(sci)}" style="animation-delay:-${(5.6 - a * 0.9).toFixed(1)}s">
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R + 6}" style="fill:${c}" opacity=".25"/>
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R}" style="fill:${c}"/>
        <filter id="tint${a}" color-interpolation-filters="sRGB"><feFlood flood-color="${tint}"/><feComposite in2="SourceAlpha" operator="in"/></filter>
        <image href="assets/animals/${f}.svg" filter="url(#tint${a})" x="${(p.x - R * .66).toFixed(1)}" y="${(p.y - R * .66).toFixed(1)}" width="${(R * 1.32).toFixed(1)}" height="${(R * 1.32).toFixed(1)}" preserveAspectRatio="xMidYMid meet"/></g>`;
    } else if (p.k > .62) {
      const ink = inks[Math.floor(rnd() * inks.length)], r = 4 + p.k * 5;
      cells += `<circle class="soma" style="animation-delay:-${(rnd() * 6).toFixed(2)}s;fill:${ink}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r.toFixed(1)}"/>`;
    } else {
      cells += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.8" fill="var(--ink)" opacity=".3"/>`;
    }
  });
  return `<div class="net"><svg role="group" aria-label="Animals I've worked with" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
    <g aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="1.1" stroke-linecap="round" opacity=".2">${edges}</g><g aria-hidden="true">${cells}</g>${big}<g class="tags" aria-hidden="true">${tags}</g></svg></div>`;
}

// Page-header art: a flat colour circle with a lighter abstract shape inside (viewBox 0 0 200 200).
const SHAPES = {
  net: `<path d="M60 70Q84 62 100 92M100 92Q118 80 140 66M100 92Q96 118 72 136M100 92Q124 110 134 136M72 136Q104 152 134 136" fill="none" stroke="FG" stroke-width="8" stroke-linecap="round"/><circle cx="60" cy="70" r="15"/><circle cx="140" cy="66" r="15"/><circle cx="72" cy="136" r="15"/><circle cx="134" cy="136" r="15"/><circle cx="100" cy="92" r="22"/>`,
  halves: `<path d="M52 58H148A48 40 0 0 1 52 58Z"/><path d="M52 150A48 40 0 0 1 148 150Z"/>`,
  sheets: `<rect x="50" y="60" width="100" height="34" rx="17"/><path d="M50 106H133A17 17 0 0 1 133 140H50Z"/>`,
  dots: [64, 100, 136].map((y, r) => [64, 100, 136].map((x, c) => `<circle cx="${x}" cy="${y}" r="16" style="--i:${r + c}"/>`).join("")).join(""),
  steps: `<rect x="54" y="88" width="58" height="58"/><path d="M98 54H146V102Z"/>`,
  clover: `<circle cx="100" cy="66" r="28"/><circle cx="134" cy="100" r="28"/><circle cx="100" cy="134" r="28"/><circle cx="66" cy="100" r="28"/><rect x="78" y="78" width="44" height="44"/><rect x="86" y="86" width="28" height="28" fill="BG"/>`,
  // Research themes: chromatin as beads on a string, regeneration as a regrowing half,
  // specification as a progenitor branching into cell types (flower = evolution, diversification).
  beads: `<path d="M48 136L152 64" stroke="FG" stroke-width="7" stroke-linecap="round"/><circle class="b" cx="62" cy="126" r="21"/><circle class="b" cx="100" cy="100" r="21"/><circle class="b" cx="138" cy="74" r="21"/>`,
  split: `<path d="M93 54A46 46 0 0 0 93 146Z"/><path class="regrow" d="M107 54A46 46 0 0 1 107 146Z" opacity=".55"/>`,
  lineage: ["M100 64L58 136", "M100 64V136", "M100 64L142 136"].map(d => `<path class="ln" d="${d}" pathLength="1" stroke="FG" stroke-width="7" stroke-linecap="round"/>`).join("") +
    `<circle class="pg" cx="100" cy="62" r="22"/><circle class="d" cx="58" cy="138" r="16"/><circle class="d" cx="100" cy="138" r="16"/><circle class="d" cx="142" cy="138" r="16"/>`,
  flower: `<g class="petals">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="100" cy="64" rx="12" ry="32" transform="rotate(${i * 45} 100 100)"/>`).join("")}</g><circle class="core" cx="100" cy="100" r="16"/>`
};
function shapeSVG(kind, bg, fg) {
  // The inner group carries each shape's gentle idle motion (see style.css); the outer one its entrance.
  return `<svg viewBox="0 0 200 200" data-kind="${kind}"><circle cx="100" cy="100" r="100" fill="${bg}"/><g fill="${fg}"><g class="in">${SHAPES[kind].replace(/BG/g, bg).replace(/FG/g, fg)}</g></g></svg>`;
}

function renderChrome() {
  // "Skip to content" link: the first thing keyboard and screen-reader users reach on every page.
  const main = document.querySelector("main");
  if (main) {
    main.id = main.id || "main"; main.tabIndex = -1;
    document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#${main.id}">Skip to content</a>`);
  }
  const here = (location.pathname.split("/").pop() || "index.html");
  const known = PAGES.find(p => p[0] === here);
  const cur = known || PAGES[0];
  document.body.dataset.ink = document.documentElement.dataset.ink = cur[2];   // on <html> too, so the scrollbar takes the page colour
  const mast = document.getElementById("mast");
  if (mast) {
    mast.innerHTML = `<div class="wrap">
      <div class="mast-top"><a href="${PAGES[0][0]}">${esc(SITE.name)}</a><span>${esc(SITE.place)}</span></div>
      <nav class="tabs" aria-label="Main">${PAGES.map(([href, label, ink]) =>
        `<a href="${href}" data-ink="${ink}"${known && href === cur[0] ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    </div>`;
  }
  const links = document.getElementById("links");
  if (links) links.innerHTML = `<li><a href="contact.html">Message me →</a></li>` + linkItems(HEADER_LINKS) + `<li><a href="contact.html#find-me">All links →</a></li>`;

  document.querySelectorAll("[data-shape]").forEach(el => el.innerHTML = shapeSVG(el.dataset.shape, el.dataset.bg || "var(--tomato)", el.dataset.fg || "var(--marigold)"));
  const prints = document.getElementById("prints");
  const inner = document.querySelector(".band-inner");
  if (!prints && inner) inner.insertAdjacentHTML("beforeend", `<div class="art" aria-hidden="true">${shapeSVG(known ? cur[3] : "flower", "var(--page)", "var(--page-soft)")}</div>`);
  if (prints) { const band = prints.closest(".band"); prints.remove(); band.insertAdjacentHTML("beforeend", nerveNet(640, 460));   // after the header text, so Tab reaches the links first
    band.querySelectorAll(".net .big").forEach(g => {
      const tag = band.querySelector(`.net .tag[data-a="${g.dataset.a}"]`);
      for (const ev of ["pointerenter", "focus"]) g.addEventListener(ev, () => tag.classList.add("on"));
      for (const ev of ["pointerleave", "blur"]) g.addEventListener(ev, () => tag.classList.remove("on"));
    });
    // Put an off-white pill behind each label (re-measured once the web fonts have loaded).
    const pills = () => band.querySelectorAll(".net .tag").forEach(t => {
      const b = t.querySelector("text").getBBox();
      let r = t.querySelector("rect");
      if (!r) { r = document.createElementNS("http://www.w3.org/2000/svg", "rect"); t.prepend(r); }
      r.setAttribute("x", b.x - 9); r.setAttribute("y", b.y - 4); r.setAttribute("width", b.width + 18); r.setAttribute("height", b.height + 8); r.setAttribute("rx", (b.height + 8) / 2);
    });
    pills(); if (document.fonts) document.fonts.ready.then(pills);
  }
  // 404 page: every page as a pill with its shape, tinted in that page's colour.
  const lost = document.getElementById("lost");
  if (lost) lost.innerHTML = PAGES.map(([href, label, ink, shape, tint]) =>
    `<a class="go-pill" href="${href}" style="--c:var(--${ink})">${shapeSVG(shape, `var(--${ink})`, `var(--${tint})`)}<span>${label}</span></a>`).join("");
  const foot = document.getElementById("footer");
  if (foot) foot.innerHTML = `<div class="wrap foot-inner">
      <div><nav class="shapes" aria-label="Pages">${PAGES.map(([href, label, ink, shape, tint]) =>
        `<a href="${href}" title="${label}" aria-label="${label}"${known && href === cur[0] ? ' aria-current="page"' : ""}>${shapeSVG(shape, `var(--${ink})`, `var(--${tint})`)}</a>`).join("")}</nav><div class="big">${esc(SITE.name)}</div>${esc(SITE.role)} · ${esc(SITE.place)}</div>
      <div><ul>${linkItems()}</ul><p style="margin:10px 0 0">© ${new Date().getFullYear()} · Updated ${esc(SITE.updated)} · Animal silhouettes from <a href="https://www.phylopic.org" target="_blank" rel="noopener">PhyloPic</a> · Built with Claude Opus 5.5</p></div>
    </div>`;
}


// ============================================================
//  PUBLICATIONS: edit this list to add or update papers.
//  status: "" for published, or e.g. "Preprint · under revision".
//  featured: true puts a paper in the Highlights section.
// ============================================================
const PUBS = [
  { year: 2025, title: "Evolutionarily conserved transcriptional regulators control monoaminergic neuron development",
    authors: "Lewis C, Goulty M, Wroblewska A, Croxall N, Onion D, Robinson S, Zinzen RP, Solana J, Kyriacou CP, Rosato E, Feuda R",
    venue: "bioRxiv", doi: "10.1101/2025.10.29.685200", status: "Preprint · under revision", first: true, featured: true,
    blurb: "The transcription factors that build dopamine- and serotonin-making neurons in the fly embryo are shared across animals." },
  { year: 2025, title: "Monoaminergic neurons share transcriptional identity across Bilaterian animals",
    authors: "Goulty M, Lewis C, Nicolini F, Khalid R, Syed H, Oliveri P, Thomas MG, Rosato E, Feuda R",
    venue: "bioRxiv", doi: "10.1101/2025.10.10.679534", status: "Preprint · under revision", featured: true,
    blurb: "Monoaminergic neurons from very different animals turn out to share a common gene-expression identity." },
  { year: 2024, title: "The origin, evolution, and molecular diversity of the chemokine system",
    authors: "Aleotti A, Goulty M, Lewis C, Giorgini F, Feuda R",
    venue: "Life Science Alliance 7(3): e202302471", short: "Life Science Alliance", doi: "10.26508/lsa.202302471", status: "", featured: true,
    blurb: "Tracing where the chemokine signalling system came from and how it diversified across animals." },
  { year: 2023, title: "Shallow whole-genome sequencing of Aedes japonicus and Aedes koreicus from Italy and an updated picture of their evolution based on mitogenomics and barcoding",
    authors: "Zadra N, Tatti A, Silverj A, Piccinno R, Devilliers J, Lewis C, Arnoldi D, Montarsi F, Escuer P, Fusco G, De Sanctis V, Feuda R, Sánchez-Gracia A, Rizzoli A, Rota-Stabelli O",
    venue: "Insects 14(12): 904", doi: "10.3390/insects14120904", status: "" },
  { year: 2023, title: "Metabolic decline in an insect ear: correlative or causative for age-related auditory decline?",
    authors: "Austin TT, Thomas CL, Lewis C, Blockley A, Warren B",
    venue: "Frontiers in Cell and Developmental Biology 11: 1138392", doi: "10.3389/fcell.2023.1138392", status: "" },
  { year: 2019, title: "Draft genome sequences of two isolates of the yeast Kazachstania servazzii recovered from soil in Ireland",
    authors: "Faherty L, Lewis C, McElheron M, Garvey N, Duggan R, Shovlin B, Ó Cróinín T, Byrne KP, O’Brien CE, Wolfe KH, Butler G",
    venue: "Microbiology Resource Announcements 8(44): e01257-19", doi: "10.1128/MRA.01257-19", status: "" }
];

const SPECIES = ["Aedes japonicus", "Aedes koreicus", "Schistocerca gregaria", "Mecopoda elongata", "Magicicada septendecula", "Kazachstania servazzii", "Drosophila melanogaster", "Nematostella vectensis"];
const italics = (t) => SPECIES.reduce((acc, sp) => acc.split(sp).join(`<em>${sp}</em>`), esc(t));
function pubItem(p) {
  const authors = esc(p.authors).replace(/Lewis C/, '<strong class="me">Lewis C</strong>');
  const tags = [p.first ? "First author" : "", p.status].filter(Boolean).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  return `<li><span class="y">${p.year}</span><div>
    <a class="t" href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${italics(p.title)}</a>
    ${p.authors ? `<span class="a">${authors}</span>` : ""}
    <span class="m"><em>${esc(p.venue)}</em>${tags}</span></div></li>`;
}
function renderPubs() {
  document.querySelectorAll("[data-pubs]").forEach(el => {
    const list = el.dataset.pubs === "featured" ? PUBS.filter(p => p.featured) : PUBS;
    if (el.dataset.pubs === "featured") {
      el.innerHTML = `<div class="cards">${list.map(p => `<a class="card paper" href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">
        <span class="k">${p.year} · ${esc(p.short || p.venue.split(" ")[0])}${p.status ? " · " + esc(p.status.split(" · ")[0]) : ""}</span>
        <h3>${italics(p.title)}</h3><p>${esc(p.blurb || "")}</p><span class="go">Read ${p.status ? "the preprint" : "the paper"} ↗</span></a>`).join("")}</div>`;
    } else {
      el.innerHTML = `<ol class="pubs">${list.map(pubItem).join("")}</ol>`;
    }
  });
}

// Keeping the Papers list up to date: on load, look online for papers that aren't in PUBS yet and add
// them to the full lists. Sources are Crossref (papers whose publisher recorded my ORCID iD) and my
// public ORCID record. A paper counts as known if its DOI or title matches, so a preprint of a
// published paper isn't listed twice. Copy anything that appears into PUBS to add authors and a blurb.
const norm = (t) => String(t).toLowerCase().replace(/[^a-z0-9]/g, "");
async function findNewPubs() {
  const [cr, oc] = await Promise.allSettled([
    fetch(`https://api.crossref.org/works?filter=orcid:${SITE.orcid}&rows=100&select=DOI,title,type,issued,container-title,author`).then(r => r.json()),
    fetch(`https://pub.orcid.org/v3.0/${SITE.orcid}/works`, { headers: { Accept: "application/json" } }).then(r => r.json())
  ]);
  const found = [];
  if (cr.status === "fulfilled") for (const w of cr.value.message.items) found.push({
    year: w.issued["date-parts"][0][0], title: (w.title || [""])[0], doi: w.DOI,
    venue: (w["container-title"] || [])[0] || (w.DOI.startsWith("10.1101/") ? "bioRxiv" : ""),
    status: w.type === "posted-content" ? "Preprint" : "",
    authors: (w.author || []).map(a => `${a.family || ""} ${(a.given || "").split(/[\s.-]+/).map(x => x[0] || "").join("")}`.trim()).join(", ")
  });
  if (oc.status === "fulfilled") for (const g of oc.value.group || []) {
    const w = g["work-summary"][0], id = ((w["external-ids"] || {})["external-id"] || []).find(i => i["external-id-type"] === "doi");
    if (id) found.push({ year: +((w["publication-date"] || {}).year || {}).value || "", title: ((w.title || {}).title || {}).value || "",
      doi: id["external-id-value"], venue: (w["journal-title"] || {}).value || "", status: w.type === "preprint" ? "Preprint" : "", authors: "" });
  }
  const known = new Set(PUBS.flatMap(p => [p.doi.toLowerCase(), norm(p.title)]));
  return found.filter(p => {
    const keys = [p.doi.toLowerCase(), norm(p.title)];
    if (!p.title || keys.some(k => known.has(k))) return false;
    keys.forEach(k => known.add(k)); return true;
  });
}

renderChrome();
renderPubs();

// Items fade gently up as they scroll into view (once each), on every page. Off for reduced motion.
// Lists filled in after load (papers, contact links) are picked up as well.
function revealOnScroll(selector) {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add("in");
    setTimeout(() => { el.classList.remove("rv", "in"); el.style.removeProperty("--d"); }, 1200);
  }), { rootMargin: "0px 0px -8% 0px" });
  const watch = () => document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.rv) return; el.dataset.rv = "1";
    const i = [...el.parentElement.children].indexOf(el);
    el.classList.add("rv"); el.style.setProperty("--d", `${Math.min(i, 5) * 70}ms`);
    io.observe(el);
  });
  watch();
  new MutationObserver(watch).observe(document.querySelector("main"), { childList: true, subtree: true });
}
if (document.querySelector("main")) revealOnScroll("main .entries > li, main .skill, main .pubs > li, main .card, main .tile, main .social > li, main .upcoming > li, main .cta, main .go-pill");
if (SITE.goatcounter && location.hostname !== "localhost") {
  const gc = document.createElement("script");
  gc.async = true; gc.src = "https://gc.zgo.at/count.js";
  gc.dataset.goatcounter = `https://${SITE.goatcounter}.goatcounter.com/count`;
  document.head.appendChild(gc);
}
if (document.querySelector('[data-pubs="all"]')) findNewPubs().then(extra => {
  if (!extra.length) return;
  const all = [...PUBS, ...extra].sort((a, b) => (b.year || 0) - (a.year || 0));
  document.querySelectorAll('[data-pubs="all"]').forEach(el => el.innerHTML = `<ol class="pubs">${all.map(pubItem).join("")}</ol>`);
}).catch(() => {});   // offline or the services are down: the hand-written list stays as it is

// Contact page: social links plus a message form.
// The form sends through FormSubmit (formsubmit.co), a free service that works on GitHub Pages.
// Messages go through FormSubmit using SITE.formKey (or SITE.formTo, whose first message triggers a one-time activation email).
function renderContact() {
  const soc = document.getElementById("social");
  if (soc) {
    const keys = ["bluesky", "linkedin", "researchgate", "github", "orcid", "scholar", "lab"];
    soc.innerHTML = keys.filter(k => SITE.links[k]).map(k =>
      `<li><a href="${esc(SITE.links[k])}" target="_blank" rel="noopener"><span>${esc(LABELS[k])}</span><span class="arr">↗</span></a></li>`).join("");
    const missing = keys.filter(k => !SITE.links[k]).map(k => LABELS[k]);
    const note = document.getElementById("social-todo");
    if (note) note.hidden = !missing.length, note.textContent = `Add your ${missing.join(", ")} in assets/site.js and they'll appear here.`;
  }
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.elements["name"], email = form.elements["email"], msg = form.elements["message"];
    if (form.elements["_honey"].value) return;   // spam bots fill the hidden field; people never see it
    for (const f of [name, email, msg]) f.removeAttribute("aria-invalid");
    let bad = null;
    if (!name.value.trim()) bad = [name, "Add your name."];
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) bad = [email, "Add an email address I can reply to."];
    else if (msg.value.trim().length < 5) bad = [msg, "Write a short message first."];
    if (bad) { bad[0].setAttribute("aria-invalid", "true"); bad[0].focus(); status.textContent = bad[1]; status.dataset.state = "error"; return; }
    if (!SITE.formKey && !SITE.formTo) { status.textContent = "The form isn't connected yet: add your email address in assets/site.js."; status.dataset.state = "error"; return; }
    const btn = form.querySelector("button"); btn.disabled = true; status.textContent = "Sending…"; status.dataset.state = "";
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SITE.formKey || SITE.formTo)}`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: name.value.trim(), email: email.value.trim(), message: msg.value.trim(), _subject: `Website message from ${name.value.trim()}`, _template: "table", _blacklist: "casino, crypto, bitcoin, seo, backlinks, viagra, loan", _replyto: email.value.trim() })
      });
      // FormSubmit answers 200 even when it didn't deliver (e.g. before activation), so check its own flag too.
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== "true") throw new Error(data.message || res.status);
      form.reset(); status.textContent = "Message sent. Thanks, I'll get back to you soon."; status.dataset.state = "ok";
    } catch (err) {
      console.warn("Contact form:", err.message);
      status.textContent = /activat/i.test(err.message)
        ? "This form is waiting for its one-time activation. If this is your site, check your inbox (and spam) for an email from FormSubmit and click Activate Form."
        : "That didn't send. Please try again in a minute, or message me on Bluesky or LinkedIn (links below).";
      status.dataset.state = "error";
    } finally { btn.disabled = false; }
  });
}
renderContact();
