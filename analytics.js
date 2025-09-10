// Minimalny logger lokalny + hook do Plausible/Umami.
// Uwaga: "kto/ skąd/ jak długo" – rzetelnie przez zewnętrzny system (Plausible/Umami/Matomo).
// Ten plik loguje lok. zdarzenia (per urządzenie). Admin embed – ustaw poniżej.

window.CFG = window.CFG || {};
window.CFG.analytics = Object.assign({
  enableLocal: true,
  provider: "plausible",               // "plausible" | "umami" | null
  embedUrl: "",                        // np. prywatny link do dashboardu (iframe)
}, window.CFG.analytics||{});

const LOG_KEY='pf_local_log';

function addLocal(entry){
  if (!window.CFG.analytics.enableLocal) return;
  const arr = JSON.parse(localStorage.getItem(LOG_KEY)||'[]');
  arr.push(Object.assign({t: new Date().toISOString()}, entry));
  localStorage.setItem(LOG_KEY, JSON.stringify(arr));
}

window.logVisit = function(){
  const payload = {
    type:'visit',
    ref: document.referrer || null,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ua: navigator.userAgent,
    wh: { w: window.innerWidth, h: window.innerHeight },
  };
  addLocal(payload);
  // Plausible custom event
  if (window.plausible) plausible("Site Visit", { props: { lang: payload.lang }});
  // Umami (jeśli używasz) – domyślny tracker zadziała sam, jeśli skrypt dodasz w <head>
};

window.logEvent = function(name, props={}){
  addLocal({ type:'event', name, props });
  if (window.plausible) plausible(name.replaceAll(' ','_'), { props });
};

// Czas sesji (very rough)
let _start = Date.now();
window.addEventListener('beforeunload', ()=>{
  const dur = Math.round((Date.now()-_start)/1000);
  addLocal({ type:'duration', sec: dur });
  if (window.plausible) plausible("Session Duration", { props: { sec: dur }});
});

// Kliknięcia w karty/CTA (delegacja)
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a,button');
  if (!a) return;
  const label = a.textContent.trim().slice(0,80);
  window.logEvent('click', { label, href: a.href||null });
});
