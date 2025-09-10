const CFG = {
  projectsUrl: "projects.json",
  analytics: { provider: "plausible" } // hook – prawdziwe dane w analytics.js
};

let ALL=[], FILTER={cat:"all", q:""};

function $(s,r=document){ return r.querySelector(s); }
function $all(s,r=document){ return [...r.querySelectorAll(s)]; }
function on(el,ev,fn){ el.addEventListener(ev,fn); }

function cardNode(p){
  const div=document.createElement("div"); div.className="card";
  const poster=p.poster || "assets/thumb-fallback.webp";
  div.innerHTML = `
    <img src="${poster}" class="thumb" alt="${p.title}" loading="lazy">
    <div class="body">
      <h3>${p.title}</h3>
      <div class="meta">
        <span>${p.category}</span> ${p.year?`• ${p.year}`:""} ${p.software?`• ${p.software}`:""}
      </div>
      <div class="actions">
        <button class="btn btn-primary" data-open="${p.id}">Podgląd</button>
        <a class="btn" href="${p.page||"#"}" target="_blank" rel="noopener">Szczegóły</a>
      </div>
    </div>`;
  on(div.querySelector("[data-open]"),"click",()=>openModal(p));
  return div;
}

function render(){
  const host=$("#cards"); host.innerHTML="";
  const q=FILTER.q.trim().toLowerCase();
  const cat=FILTER.cat;
  const items = ALL.filter(p=>{
    const inCat=(cat==="all")||(p.category===cat);
    const hay=(p.title+" "+(p.tags||[]).join(" ")+" "+(p.description||"")).toLowerCase();
    const inQ=!q || hay.includes(q);
    return inCat && inQ;
  });
  items.forEach(p=> host.appendChild(cardNode(p)));
}

function openModal(p){
  $("#modalTitle").textContent=p.title;
  const mv=$("#mv"); mv.src=p.model; mv.poster=p.poster||"";
  $("#modelMeta").textContent=[p.client?`klient: ${p.client}`:"", p.software?`CAD: ${p.software}`:"", p.year?`rok: ${p.year}`:""].filter(Boolean).join(" • ");
  $("#dlModel").href=p.model;
  $("#openPage").href=p.page||"#";
  window.logEvent && window.logEvent("model_view", {id:p.id, title:p.title, cat:p.category});
  $("#modal").classList.remove("hidden");
}
function closeModal(){ $("#modal").classList.add("hidden"); }

async function init(){
  // load projects
  const res=await fetch(CFG.projectsUrl);
  ALL=await res.json();

  // url filters
  const u=new URL(location.href);
  const c=u.searchParams.get("cat"); if(c){ FILTER.cat=c; }
  const q=u.searchParams.get("q"); if(q){ FILTER.q=q; }

  // ui filters
  $all(".chip").forEach(btn=>{
    on(btn,"click",()=>{
      $all(".chip").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      FILTER.cat=btn.dataset.cat; render();
    });
    if (btn.dataset.cat===FILTER.cat) btn.classList.add("active");
  });
  const search=$("#search");
  if (search){ search.value=FILTER.q||""; on(search,"input",()=>{ FILTER.q=search.value; render(); }); }
  on($("#clearSearch"),"click",()=>{ if(search){ search.value=""; } FILTER.q=""; render(); });

  // modal wiring
  on($("#closeModal"),"click",closeModal);
  on($("#modal"),"click",(e)=>{ if(e.target.id==="modal") closeModal(); });

  render();
  window.logVisit && window.logVisit(); // analytics hook
}
init();
