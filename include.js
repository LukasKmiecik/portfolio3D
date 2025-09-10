<!-- include.js -->
<script>
(async function injectPartials(){
  const hosts = document.querySelectorAll("[data-include]");
  await Promise.all([...hosts].map(async (el)=>{
    const url = el.getAttribute("data-include");
    const res = await fetch(url);
    el.innerHTML = await res.text();
  }));

  // Po wstrzyknięciu menu: podświetl aktywną kategorię (jeśli jest ?cat=)
  const url = new URL(location.href);
  const cat = url.searchParams.get("cat");
  if (cat){
    document.querySelectorAll('[data-cat="'+cat+'"]').forEach(a=>{
      a.classList.add("active");
    });
  }
})();
</script>
