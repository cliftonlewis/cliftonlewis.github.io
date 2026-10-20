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
  links: {
    email: "clifton.lewis@universityofgalway.ie",
    github: "https://github.com/cliftonlewis",
    scholar: "https://scholar.google.com/citations?user=1SMK8UIAAAAJ&hl=en",
    orcid: "https://orcid.org/0000-0002-3077-8150",
    bluesky: "https://bsky.app/profile/cliftonlewis.bsky.social",
    linkedin: "https://www.linkedin.com/in/clifton-lewis97",
    researchgate: "https://www.researchgate.net/profile/Clifton-Lewis-2",
    lab: "https://chromosome.ie/groups/gahan/"
  },
  updated: "October 2026"
};
// ============================================================

const PAGES = [
  ["index.html", "Home", "blue"],
  ["research.html", "Research", "pink"],
  ["publications.html", "Papers", "green"],
  ["resources.html", "Resources", "yellow"],
  ["cv.html", "CV", "teal"],
  ["contact.html", "Contact", "ink"]
];
const LABELS = { email: "Email", lab: "Lab", github: "GitHub", scholar: "Scholar", orcid: "ORCID", bluesky: "Bluesky", linkedin: "LinkedIn", researchgate: "ResearchGate" };

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// Links shown as buttons in the homepage header; the full list is on the Contact page and in the footer.
const HEADER_LINKS = ["email", "scholar", "bluesky", "linkedin"];

function linkItems(only) {
  return Object.entries(SITE.links).filter(([k, v]) => v && (!only || only.includes(k))).map(([k, v]) => {
    const href = k === "email" ? `mailto:${v}` : v;
    return `<li><a href="${esc(href)}"${k === "email" ? "" : ' target="_blank" rel="noopener"'}>${esc(LABELS[k])} ↗</a></li>`;
  }).join("");
}

// Animals I've worked with: PhyloPic silhouettes (public domain / CC0), each in its own circle.
const ANIMALS = [
  ["sycon", "Sponge", "Sycon", "#5a9a74"],
  ["nematostella", "Sea anemone", "Nematostella vectensis", "#c97467"],
  ["locust", "Locust", "Acrididae", "#d9a94e"],
  ["bushcricket", "Bush cricket", "Tettigoniidae", "#a9b873"],
  ["cicada", "Cicada", "Cicadidae", "#4d93a3"],
  ["drosophila", "Fruit fly", "Drosophila melanogaster", "#c99aac"],
  ["mosquito", "Mosquito", "Culicidae", "#8eb0c4"]
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
  const inks = ["#c97467", "#d9a94e", "#5a9a74", "#4d93a3", "#a9b873", "#c99aac", "#8eb0c4"];
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
  const spots = { 12: 0, 15: 1, 31: 2, 34: 3, 48: 4, 50: 5, 52: 6 };   // grid index -> ANIMALS index
  let cells = "", big = "";
  pts.forEach((p, i) => {
    const a = spots[i];
    if (a !== undefined) {
      const [f, n, sci, c] = ANIMALS[a], R = 27;
      big += `<g class="soma big" style="animation-delay:${(a * 0.9).toFixed(1)}s"><title>${n} (${sci})</title>
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R + 6}" fill="${c}" opacity=".25"/>
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R}" fill="${c}"/>
        <image href="assets/animals/${f}.svg" x="${(p.x - R * .66).toFixed(1)}" y="${(p.y - R * .66).toFixed(1)}" width="${(R * 1.32).toFixed(1)}" height="${(R * 1.32).toFixed(1)}" preserveAspectRatio="xMidYMid meet"/></g>`;
    } else if (p.k > .62) {
      const ink = inks[Math.floor(rnd() * inks.length)], r = 4 + p.k * 5;
      cells += `<circle class="soma" style="animation-delay:${(rnd() * 6).toFixed(2)}s" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${ink}"/>`;
    } else {
      cells += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.8" fill="var(--on-page)" opacity=".7"/>`;
    }
  });
  cells += big;
  return `<div class="net" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
    <g fill="none" stroke="var(--on-page)" stroke-width="1.1" stroke-linecap="round" opacity=".42">${edges}</g>${cells}</svg></div>`;
}

function renderChrome() {
  const here = (location.pathname.split("/").pop() || "index.html");
  const cur = PAGES.find(p => p[0] === here) || PAGES[0];
  document.body.dataset.ink = cur[2];
  const mast = document.getElementById("mast");
  if (mast) {
    mast.innerHTML = `<div class="wrap">
      <div class="mast-top"><a href="${PAGES[0][0]}">${esc(SITE.name)}</a><span>${esc(SITE.place)}</span></div>
      <nav class="tabs" aria-label="Main">${PAGES.map(([href, label, ink]) =>
        `<a href="${href}" data-ink="${ink}"${href === cur[0] ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    </div>`;
  }
  const links = document.getElementById("links");
  if (links) links.innerHTML = linkItems(HEADER_LINKS) + `<li><a href="contact.html">All links →</a></li>`;

  const prints = document.getElementById("prints");
  if (prints) { const band = prints.closest(".band"); prints.remove(); band.insertAdjacentHTML("afterbegin", nerveNet(640, 460)); }
  const foot = document.getElementById("footer");
  if (foot) foot.innerHTML = `<div class="wrap foot-inner">
      <div><div class="big">${esc(SITE.name)}</div>${esc(SITE.role)} · ${esc(SITE.place)}</div>
      <div><ul>${linkItems()}</ul><p style="margin:10px 0 0">© ${new Date().getFullYear()} · Updated ${esc(SITE.updated)} · Animal silhouettes from <a href="https://www.phylopic.org" target="_blank" rel="noopener">PhyloPic</a></p></div>
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

const SPECIES = ["Aedes japonicus", "Aedes koreicus", "Kazachstania servazzii", "Drosophila melanogaster", "Nematostella vectensis"];
const italics = (t) => SPECIES.reduce((acc, sp) => acc.split(sp).join(`<em>${sp}</em>`), esc(t));
function pubItem(p) {
  const authors = esc(p.authors).replace(/Lewis C/, '<strong class="me">Lewis C</strong>');
  const tags = [p.first ? "First author" : "", p.status].filter(Boolean).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  return `<li><span class="y">${p.year}</span><div>
    <a class="t" href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${italics(p.title)}</a>
    <span class="a">${authors}</span>
    <span class="m"><em>${esc(p.venue)}</em>${tags}</span></div></li>`;
}
function renderPubs() {
  document.querySelectorAll("[data-pubs]").forEach(el => {
    const list = el.dataset.pubs === "featured" ? PUBS.filter(p => p.featured) : PUBS;
    if (el.dataset.pubs === "featured") {
      el.innerHTML = `<div class="cards">${list.map(p => `<a class="card paper" href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">
        <span class="k">${p.year} · ${esc(p.short || p.venue.split(" ")[0])}${p.status ? " · " + esc(p.status.split(" · ")[0]) : ""}</span>
        <h3>${italics(p.title)}</h3><p>${esc(p.blurb || "")}</p></a>`).join("")}</div>`;
    } else {
      el.innerHTML = `<ol class="pubs">${list.map(pubItem).join("")}</ol>`;
    }
  });
}

// Publications: read live from your public ORCID record, so new papers appear automatically.
async function loadOrcid(target) {
  const el = document.getElementById(target);
  if (!el) return;
  el.innerHTML = `<p class="status">Loading publications from ORCID…</p>`;
  try {
    const res = await fetch(`https://pub.orcid.org/v3.0/${SITE.orcid}/works`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const works = (data.group || []).map(g => {
      const w = g["work-summary"][0];
      const ids = (w["external-ids"] && w["external-ids"]["external-id"]) || [];
      const doi = ids.find(i => i["external-id-type"] === "doi");
      return {
        title: w.title && w.title.title ? w.title.title.value : "Untitled",
        journal: w["journal-title"] ? w["journal-title"].value : "",
        year: w["publication-date"] && w["publication-date"].year ? w["publication-date"].year.value : "",
        type: w.type || "",
        url: doi ? `https://doi.org/${doi["external-id-value"]}` : (w.url ? w.url.value : "")
      };
    }).sort((a, b) => (b.year || 0) - (a.year || 0));
    if (!works.length) throw new Error("empty");
    el.innerHTML = `<ol class="pubs">${works.map(w => `<li><span class="y">${esc(w.year)}</span><div>
      ${w.url ? `<a class="t" href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.title)}</a>` : `<span class="t">${esc(w.title)}</span>`}
      <span class="m">${w.journal ? `<em>${esc(w.journal)}</em>` : ""}${w.type === "preprint" ? '<span class="tag">Preprint</span>' : ""}</span>
    </div></li>`).join("")}</ol>`;
  } catch (e) {
    el.innerHTML = `<p class="status">Publications couldn't load here. See the full list on <a href="https://orcid.org/${SITE.orcid}" target="_blank" rel="noopener">ORCID</a>.</p>`;
  }
}

renderChrome();
renderPubs();

// Contact page: social links plus a message form.
// The form sends through FormSubmit (formsubmit.co), a free service that works on GitHub Pages.
// The first message triggers a one-time confirmation email to SITE.links.email.
function renderContact() {
  const soc = document.getElementById("social");
  if (soc) {
    const keys = ["email", "bluesky", "linkedin", "researchgate", "github", "orcid", "scholar", "lab"];
    soc.innerHTML = keys.filter(k => SITE.links[k]).map(k => {
      const v = SITE.links[k], href = k === "email" ? `mailto:${v}` : v;
      return `<li><a href="${esc(href)}"${k === "email" ? "" : ' target="_blank" rel="noopener"'}><span>${esc(LABELS[k])}</span><span class="arr">${k === "email" ? esc(v) : "↗"}</span></a></li>`;
    }).join("");
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
    for (const f of [name, email, msg]) f.removeAttribute("aria-invalid");
    let bad = null;
    if (!name.value.trim()) bad = [name, "Add your name."];
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) bad = [email, "Add an email address I can reply to."];
    else if (msg.value.trim().length < 5) bad = [msg, "Write a short message first."];
    if (bad) { bad[0].setAttribute("aria-invalid", "true"); bad[0].focus(); status.textContent = bad[1]; status.dataset.state = "error"; return; }
    if (!SITE.links.email) { status.textContent = "The form isn't connected yet: add your email address in assets/site.js."; status.dataset.state = "error"; return; }
    const btn = form.querySelector("button"); btn.disabled = true; status.textContent = "Sending…"; status.dataset.state = "";
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SITE.links.email)}`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: name.value.trim(), email: email.value.trim(), message: msg.value.trim(), _subject: `Website message from ${name.value.trim()}`, _template: "table" })
      });
      if (!res.ok) throw new Error(res.status);
      form.reset(); status.textContent = "Message sent. Thanks, I'll get back to you soon."; status.dataset.state = "ok";
    } catch (err) {
      status.textContent = `That didn't send. Please email me directly at ${SITE.links.email}.`; status.dataset.state = "error";
    } finally { btn.disabled = false; }
  });
}
renderContact();
