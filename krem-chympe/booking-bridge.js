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

  // Call with a File object from the receipt <input type="file">.
  function uploadReceipt(file, caption) {
    const form = new FormData();
    form.append("sessionId", sessionId);
    form.append("siteId", SITE_ID);
    form.append("caption", caption || "");
    form.append("file", file);
    return fetch(`${API_BASE}/api/receipt`, { method: "POST", body: form })
      .then(r => r.json())
      .catch(() => ({ ok: false }));
  }

  // Call on final Submit. Returns { bookingId }.
  function submitBooking(data) {
    return fetch(`${API_BASE}/api/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, siteId: SITE_ID, data }),
    }).then(r => r.json());
  }

  // Poll status. onUpdate(status) called whenever it changes.
  // Returns a stop() function.
  function watchStatus(bookingId, onUpdate) {
    let stopped = false;
    let last = null;
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
        setTimeout(poll, 4000);
      }
    }
    poll();
    return () => { stopped = true; };
  }

  return { sendDraft, uploadReceipt, submitBooking, watchStatus, sessionId };
})();
