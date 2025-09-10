const I18N = { current: 'pl', dict: {} };

async function loadLocale(lang){
  const res = await fetch(`i18n/${lang}.json`);
  I18N.dict = await res.json(); I18N.current = lang;
  applyI18N();
}
function applyI18N(){
  // teksty
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if (I18N.dict[key]) el.textContent = I18N.dict[key];
  });
  // placeholdery
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    if (I18N.dict[key]) el.setAttribute('placeholder', I18N.dict[key]);
  });
  // title
  if (I18N.dict['site.title']) document.title = I18N.dict['site.title'];
}
(function initI18N(){
  const user = (new URL(location.href)).searchParams.get('lang')
            || localStorage.getItem('lang')
            || (navigator.language||'pl').slice(0,2);
  const lang = ['pl','en','no'].includes(user) ? user : 'pl';
  const sel = document.getElementById('lang'); if (sel){ sel.value = lang; sel.onchange=()=>{ localStorage.setItem('lang', sel.value); loadLocale(sel.value); }; }
  loadLocale(lang);
})();

// Opcjonalny autotranslator (klient): odkomentuj, jeśli chcesz Google Translate widget
// (wymaga połączenia z ich skryptem – pamiętaj o banerze cookies/RODO jeśli używasz).
// (function addGoogleTranslate(){
//   const s=document.createElement('script');
//   s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//   document.body.appendChild(s);
//   window.googleTranslateElementInit=function(){ new google.translate.TranslateElement({pageLanguage: 'pl'}, 'google_translate_element'); };
// })();
