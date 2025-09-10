/* ========= CONFIG ========= */
const CFG = {
  siteTitle: "Portfolio 3D – Łukasz Kmiecik",
  plausibleEnabled: true,     // set to false if not using Plausible
  projectsUrl: "projects.json"
};

/* ========= STATE ========= */
let ALL = [];
let FILTER = { cat: "all", q: "" };

/* ========= HELPERS ========= */
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function on(el, ev, fn){ el.addEventListener(ev, fn); }
function emitPlausible(event, props={}){
  try {
    if (CFG.plausibleEnabled && typeof window.plausible === "function") {
      window.plausible(event, { props });
    }
  } catch(e){ /* noop */ }
}
function fmtDate(iso){ try{ return new Date(iso).toLocaleDateString(); } catch{ return ""; } }

/* ========= ANALYTICS (localStorage fallback) ========= */
const LS_KEYS = {
  visits: "stats_visits",
  viewedModels: "stats_model_views" // object: {id: count}
};

function bumpVisit(){
  const v = Number(localStorage.getItem(LS_KEYS.visits) || "0") + 1;
  localStorage.setItem(LS_KEYS.visits, String(v));
  emitPlausible("Site Visit", {});
  return v;
}
function bumpModelView(id){
  const raw = localStorage.getItem(LS_KEYS.viewedModels) || "{}";
  const obj = JSON.parse(raw);
  obj[id] = (obj[id] || 0) + 1;
  localStorage.setItem(LS_KEYS.viewedModels, JSON.stringify(obj));
  emitPlausible("Model Viewed", { id });
  return obj[id];
}
function getModelViews(){
  try { return JSON.parse(localStorage.getItem(LS_KEYS.viewedModels) || "{}"); }
  catch { return {}; }
}

/* ========= RENDER ========= */
function renderCards(){
  const host = $("#cards");
  host.innerHTML = "";
  const q = FILTER.q.trim().toLowerCase();
  const cat = FILTER.cat;

  const items = ALL.filter(p => {
    const inCat = (cat === "all") || (p.category === cat);
    const hay = (p.title + " " + (p.tags||[]).join(" ") + " " + (p.description||"")).toLowerCase();
    const inQ = !q || hay.includes(q);
    return inCat && inQ;
  });

  for(const p of items){
    host.appendChild(cardNode(p));
  }
}
function cardNode(p){
  const div = document.createElement("div");
  div.className = "card";
  const poster = p.poster || "https://modelviewer.dev/assets/poster-damagedhelmet.png";
  div.innerHTML = `
    <img src="${poster}" alt="${p.title}" loading="lazy" />
    <div class="body">
      <h3>${p.title}</h3>
      <div class="meta">
        <span class="badge">${p.category}</span>
        ${p.year ? `<span class="ml-2">rok: ${p.year}</span>`:""}
      </div>
      <p>${p.description||""}</p>
      <div class="actions">
        <button class="btn" data-open="${p.id}">👁️ Podgląd</button>
        <a class="btn" href="${p.page || "#"}" target="_blank" rel="noopener">📄 Szczegóły</a>
      </div>
    </div>
  `;
  on(div.querySelector("[data-open]"), "click", () => openModal(p));
  return div;
}

/* ========= MODAL ========= */
function openModal(p){
  const modal = $("#modal");
  $("#modalTitle").textContent = p.title;
  const mv = $("#mv");
  mv.src = p.model;
  mv.poster = p.poster || "";
  $("#modelMeta").textContent = [p.client ? `klient: ${p.client}`:"", p.software ? `CAD: ${p.software}`:"", p.year?`rok: ${p.year}`:""].filter(Boolean).join(" • ");
  $("#dlModel").href = p.model;
  $("#openPage").href = p.page || "#";

  // stats
  const views = bumpModelView(p.id);
  $("#modelMeta").textContent += (views ? ` • wyświetlenia (lokalnie): ${views}` : "");

  document.body.classList.add("modal-open");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}
function closeModal(){
  const modal = $("#modal");
  $("#mv").pause && $("#mv").pause();
  document.body.classList.remove("modal-open");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

/* ========= INIT ========= */
async function init(){
  document.title = CFG.siteTitle;
  $("#year").textContent = new Date().getFullYear();

  // visits
  bumpVisit();

  // load projects
  const res = await fetch(CFG.projectsUrl);
  ALL = await res.json();

  // URL filter ?cat=&q=
  const url = new URL(location.href);
  const c = url.searchParams.get("cat"); if (c) FILTER.cat = c;
  const q = url.searchParams.get("q"); if (q) FILTER.q = q;

  // wire filters
  $all(".chip").forEach(btn => {
    on(btn, "click", () => {
      $all(".chip").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      FILTER.cat = btn.dataset.cat;
      renderCards();
      const u = new URL(location.href); u.searchParams.set("cat", FILTER.cat); history.replaceState({}, "", u);
    });
    if (btn.dataset.cat === FILTER.cat) btn.classList.add("active");
  });

  const search = $("#search");
  search.value = FILTER.q;
  on(search, "input", () => {
    FILTER.q = search.value;
    renderCards();
  });
  on($("#clearSearch"), "click", () => {
    search.value = ""; FILTER.q = ""; renderCards();
  });

  // nav
  on($("#aboutLink"), "click", (e)=>{ e.preventDefault(); alert("To jest statyczne portfolio 3D. Modele w GLB/GLTF. Włączone zdarzenia Plausible: 'Site Visit' i 'Model Viewed'."); });
  on($("#statsLink"), "click", (e)=>{
    e.preventDefault();
    const views = getModelViews();
    const total = Object.values(views).reduce((a,b)=>a+b,0);
    alert(`Wizyty (lokalnie): ${localStorage.getItem("stats_visits")||0}\nWyświetlenia modeli (lokalnie): ${total}\nSzczegóły: ${JSON.stringify(views, null, 2)}`);
  });
  on($("#contactLink"), "click", (e)=>{ e.preventDefault(); alert("Kontakt: kontakt@twojadomena.pl"); });

  // modal
  on($("#closeModal"), "click", closeModal);
  on($("#modal"), "click", (ev)=>{ if (ev.target.id === "modal") closeModal(); });

  renderCards();
}

init();
