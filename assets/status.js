// Live server status in the navigation's top right corner: GET /api/status on the game server (public, read-only)
// every minute. Needs assets/config.js loaded first, and a <span class="nav-status" id="server-status"> in the page.
(() => {
  const api = (window.HEARTWOOD_API || "").replace(/\/+$/, ""), el = document.getElementById("server-status");
  if (!api || !el) return;
  const text = el.querySelector("b"); el.hidden = false; let first = true;
  function show(state, word, title) { el.className = "nav-status " + state; text.textContent = word; el.title = title; }
  async function check() {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 6000);
    try {
      const r = await fetch(api + "/api/status?page=" + encodeURIComponent(location.pathname) + "&first=" + (first ? "1" : "0"), { signal: ctl.signal, cache: "no-store" }); const j = await r.json();
      if (!j.online) throw new Error("offline");
      show("online", "online", "The game server is online");
    } catch (e) { show("offline", "offline", "The game server is offline, back soon"); }
    finally { clearTimeout(t); first = false; }
  }
  check(); setInterval(check, 60000);
})();
// Android build number and download address: read from assets/android.json (the same file the sign-in page uses
// for its update prompt), so the pages cannot fall behind a new build. The numbers written in the pages are the fallback.
(() => {
  const builds = document.querySelectorAll("[data-android-build]"), links = document.querySelectorAll("a[data-android-apk]");
  if (!builds.length && !links.length) return;
  fetch("assets/android.json", { cache: "no-store" }).then(r => r.json()).then(j => {
    if (Number.isInteger(j.build)) builds.forEach(e => { e.textContent = j.build; });
    if (typeof j.apk === "string" && j.apk.startsWith("https://")) links.forEach(a => { a.href = j.apk; });
  }).catch(() => {});
})();
