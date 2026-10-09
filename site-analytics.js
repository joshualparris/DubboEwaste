/* Shared anonymous analytics for the legacy GitHub Pages pages.
   Never reads inputs, form data, accounts, URLs with query strings or user identifiers. */
(function () {
  if (navigator.globalPrivacyControl || navigator.doNotTrack === "1") return;
  const endpoint = "https://dubbo-ewaste-app.vercel.app/api/analytics";
  const pathname = location.pathname;
  const page = pathname.includes("/DubboEwasteApp/admin") ? "/legacy-admin"
             : pathname.includes("/DubboEwasteApp/") ? "/legacy-gateway"
             : pathname.endsWith("/glossary.html") ? "/glossary"
             : pathname.endsWith("/itad-deep-research.html") ? "/itad-research"
             : pathname.endsWith("/multimeter-training.html") ? "/multimeter-training"
             : "/field-school";
  function send(event, target) {
    try {
      const body = JSON.stringify({event,page,target});
      if (navigator.sendBeacon?.(endpoint,new Blob([body],{type:"text/plain"}))) return;
      fetch(endpoint,{method:"POST",headers:{"Content-Type":"text/plain"},body,
        mode:"cors",credentials:"omit",keepalive:true}).catch(function(){});
    } catch (_) {}
  }
  send("page_view");
  document.addEventListener("click", function (e) {
    const el = e.target.closest?.("a,button,[data-analytics-event]");
    if (!el || el.closest("[data-no-analytics]")) return;
    let target = el.getAttribute("data-analytics-event") || "button";
    if (el.tagName === "A") {
      try { const href = new URL(el.href,location.href);
        target = href.origin === location.origin ? "internal_link" : "external:"+href.hostname;
      } catch (_) { target="link"; }
    }
    send("click",target);
  }, true);
})();
