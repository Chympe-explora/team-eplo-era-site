/**
 * booking-bridge.js
 * Drop this on any destination site (after config.js, before app.js closes).
 * Talks silently to the shared Cloudflare Worker. No UI of its own except
 * the status screen shown after Submit.
 */
window.KCBridge = (function () {
  const API_BASE = "https://chympe-booking-backend.senlysuchiang87.workers.dev";
  const SITE_ID = window.KC_SITE_ID || "krem-chympe"; // set this per site before loading

  const sessionId =
    sessionStorage.getItem("kc_session") ||
    (() => {
      const id = crypto.randomUUID().slice(0, 8);
      sessionStorage.setItem("kc_session", id);
      return id;
    })();

  // Fires once per browser tab session, the moment the page loads (or the
  // visitor first scrolls, whichever happens first) — silent, no UI, never
  // shown to the visitor. Lets the admin see traffic in Telegram in real time.
  let visitSent = false;
  function trackVisit() {
    if (visitSent) return;
    visitSent = true;
    fetch(`${API_BASE}/api/visit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId, siteId: SITE_ID,
        path: location.pathname, referrer: document.referrer || "",
      }),
    }).catch(() => {});
  }

  // Call when a visitor taps a specific destination/package card. Silent —
  // fire-and-forget, never blocks or shows anything to the visitor.
  function trackTap(destination) {
    fetch(`${API_BASE}/api/tap`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, siteId: SITE_ID, destination }),
    }).catch(() => {});
  }

  let draftTimer = null;

  // Call on every form change. Debounced + silent — no visible effect to visitor.
  function sendDraft(data) {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      fetch(`${API_BASE}/api/draft`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, siteId: SITE_ID, data }),
      }).catch(() => {}); // fail silently, never interrupt the visitor
    }, 1500);
  }

  // Call the moment a visitor taps "Pay Now" — sends everything collected
  // so far as a fresh, distinct Telegram message (separate from the
  // live-editing draft) so the admin sees it right away.
  function notifyPayNow(data) {
    return fetch(`${API_BASE}/api/paynow`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, siteId: SITE_ID, data }),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "network error" }));
  }

  // Call with a File object from the receipt <input type="file">.
  function uploadReceipt(file, caption) {
    const form = new FormData();
    form.append("sessionId", sessionId);
    form.append("siteId", SITE_ID);
    form.append("caption", caption || "");
    form.append("file", file);
    return fetch(`${API_BASE}/api/receipt`, { method: "POST", body: form })
      .then(r => r.json())
      .catch(() => ({ ok: false, error: "network error" }));
  }

  // Call on final Submit. Returns { bookingId }.
  function submitBooking(data) {
    return fetch(`${API_BASE}/api/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, siteId: SITE_ID, data }),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "network error" }));
  }

  // Poll status. onUpdate(status) called whenever it changes.
  // Returns a stop() function.
  function watchStatus(bookingId, onUpdate) {
    let stopped = false;
    let last = null;
    let timer = null;
    async function poll() {
      if (stopped) return;
      try {
        const r = await fetch(`${API_BASE}/api/status/${bookingId}`);
        const { status } = await r.json();
        if (status && status !== last) {
          last = status;
          onUpdate(status);
        }
      } catch (e) {}
      if (!stopped && last !== "confirmed" && last !== "cancelled") {
        // 1s while the tab is actually visible (feels close to instant
        // once the guide taps Confirm/Reject — the webhook flips the KV
        // status right away, so this interval is basically the only
        // remaining delay). Backs off to 5s if the visitor switches tabs,
        // then re-polls immediately the moment they come back.
        timer = setTimeout(poll, document.hidden ? 5000 : 1000);
      }
    }
    function onVisible() {
      if (!document.hidden && !stopped && last !== "confirmed" && last !== "cancelled") {
        clearTimeout(timer);
        poll(); // immediate re-check the instant the visitor looks back at the tab
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    poll();
    return () => { stopped = true; clearTimeout(timer); document.removeEventListener("visibilitychange", onVisible); };
  }

  return { trackVisit, trackTap, sendDraft, notifyPayNow, uploadReceipt, submitBooking, watchStatus, sessionId };
})();

// Fire the silent visit ping as soon as this script loads, and again on
// the visitor's first scroll if load somehow didn't fire it (belt & braces).
// Neither ever shows anything to the visitor.
window.KCBridge.trackVisit();
window.addEventListener("scroll", function onFirstScroll() {
  window.KCBridge.trackVisit();
  window.removeEventListener("scroll", onFirstScroll);
}, { once: true, passive: true });
