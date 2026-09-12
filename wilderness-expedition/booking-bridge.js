/**
 * booking-bridge.js
 * Drop this on any destination site (after config.js, before app.js closes).
 * Talks silently to the shared Cloudflare Worker. No UI of its own except
 * the status screen shown after Submit.
 *
 * Consent gate: nothing here sends anything until window.KCConsent says the
 * visitor accepted (see consent.js, which must load before this file). If
 * consent isn't accepted, every function below is a silent no-op.
 */
window.KCBridge = (function () {
  const API_BASE = "https://chympe-booking-backend.book-and-explore.workers.dev";
  const SITE_ID = window.KC_SITE_ID || "krem-chympe"; // set this per site before loading

  function consentOk() {
    return !!(window.KCConsent && window.KCConsent.isAccepted());
  }

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
  // Gated on consent: does nothing until the visitor has accepted.
  let visitSent = false;
  function trackVisit() {
    if (!consentOk() || visitSent) return;
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
    if (!consentOk()) return;
    fetch(`${API_BASE}/api/tap`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, siteId: SITE_ID, destination }),
    }).catch(() => {});
  }

  // 🍯 Honeypot field — invisible to a real visitor, but a lot of dumb
  // auto-fill/spam bots fill in every input they find regardless of
  // visibility. Positioned off-screen (not display:none — some bots
  // skip display:none fields on purpose) and kept out of the tab order
  // and screen-reader tree so it never affects a real person. If this
  // ever comes back non-empty, the backend silently drops the booking
  // instead of forwarding it to Telegram — see security.js#honeypotTripped.
  const honeypotEl = (function () {
    try {
      const el = document.createElement("input");
      el.type = "text";
      el.name = "website_url";
      el.autocomplete = "off";
      el.tabIndex = -1;
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
      (document.body || document.documentElement).appendChild(el);
      return el;
    } catch (e) {
      return null;
    }
  })();

  let draftTimer = null;

  // Call on every form change. Debounced (silent, no visible effect to
  // the visitor) by default. Pass immediate=true to send right away
  // instead — used when the visitor taps Next/Back between booking
  // steps, so the admin sees a fresh line in Telegram exactly at that
  // moment rather than waiting out the debounce.
  function sendDraft(data, immediate) {
    if (!consentOk()) return;
    if (immediate) {
      clearTimeout(draftTimer);
      fetch(`${API_BASE}/api/draft`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, siteId: SITE_ID, data }),
      }).catch(() => {});
      return;
    }
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      if (!consentOk()) return;
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
    if (!consentOk()) {
      return Promise.resolve({ ok: false, error: "consent required" });
    }
    return fetch(`${API_BASE}/api/paynow`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, siteId: SITE_ID, data }),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "network error" }));
  }

  // Call with a File object from the receipt <input type="file">.
  function uploadReceipt(file, caption) {
    if (!consentOk()) {
      return Promise.resolve({ ok: false, error: "consent required" });
    }
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
    if (!consentOk()) {
      return Promise.resolve({ ok: false, error: "consent required" });
    }
    const payload = Object.assign({}, data, {
      website_url: honeypotEl ? honeypotEl.value : "",
    });
    return fetch(`${API_BASE}/api/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, siteId: SITE_ID, data: payload }),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "network error" }));
  }

  // Poll status. onUpdate(status) called whenever it changes.
  // Returns a stop() function. Only ever called with a bookingId that was
  // itself returned from a consented submitBooking(), so no extra gate here.
  function watchStatus(bookingId, onUpdate) {
    let stopped = false;
    let last = null;
    let timer = null;
    let polls = 0;
    async function poll() {
      if (stopped) return;
      polls++;
      try {
        const r = await fetch(`${API_BASE}/api/status/${bookingId}`);
        const { status } = await r.json();
        if (status && status !== last) {
          last = status;
          onUpdate(status);
        }
      } catch (e) {}
      if (!stopped && last !== "confirmed" && last !== "cancelled") {
        // 500ms for the first ~22s (matches the visitor-facing 20s
        // countdown) so a guide's Confirm/Reject tap — or a receipt
        // landing — feels live/instant right when it matters most.
        // Backs off to 1s after that, and to 5s if the visitor switches
        // tabs, re-polling immediately the moment they come back.
        const fast = polls < 44;
        timer = setTimeout(poll, document.hidden ? 5000 : (fast ? 500 : 1000));
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

  // 📵 Manual WhatsApp Mode — GET /api/mode tells the frontend whether
  // the admin has switched the whole site into manual mode (see
  // manual-mode.js on the backend). Cached for this page load. Not gated:
  // it carries no visitor data, just a site-wide on/off flag.
  let modeCache = null;
  function getMode() {
    if (modeCache) return modeCache;
    modeCache = fetch(`${API_BASE}/api/mode`)
      .then(r => r.json())
      .catch(() => ({ ok: false, manualMode: false }));
    return modeCache;
  }

  return { getMode, trackVisit, trackTap, sendDraft, notifyPayNow, uploadReceipt, submitBooking, watchStatus, sessionId };
})();

// Fire the silent visit ping only once the visitor has accepted data
// collection (see consent.js). If they've already accepted (returning
// visitor), this fires right away; otherwise it waits for KCConsent to
// report a change and fires the instant they accept. Declining does
// nothing, ever.
window.KCBridge.trackVisit();
window.addEventListener("scroll", function onFirstScroll() {
  window.KCBridge.trackVisit();
  window.removeEventListener("scroll", onFirstScroll);
}, { once: true, passive: true });
if (window.KCConsent && typeof window.KCConsent.onChange === "function") {
  window.KCConsent.onChange(function (state) {
    if (state === "accepted") window.KCBridge.trackVisit();
  });
}
