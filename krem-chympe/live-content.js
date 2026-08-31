/* ============================================================
   live-content.js — pulls in whatever the Telegram admin bot has
   changed (text, photos, prices, discounts, highlights) and merges it
   on top of the static config.js defaults, BEFORE app.js renders the
   page. If this fails for any reason (offline, backend down), it
   fails silently and the site just shows the static config.js content
   — nothing ever breaks because of this file.

   Load order matters:
     config.js  →  live-content.js  →  app.js

   ⚠️ Update API_BASE below to match the URL in booking-bridge.js.
   ============================================================ */
(function () {
  "use strict";

  var API_BASE = "https://chympe-booking-backend.senlysuchiang87.workers.dev";
  var SITE = window.KC_SITE_ID || "root";

  function getJSON(path) {
    try {
      var xhr = new XMLHttpRequest();
      // Synchronous on purpose: this has to finish before app.js reads
      // window.KC_CONTENT a few lines below in the page. Keep whatever
      // this returns tiny (it only ever contains admin edits, not the
      // whole site) so this stays fast.
      xhr.open("GET", API_BASE + path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        var data = JSON.parse(xhr.responseText);
        return data.ok ? data : null;
      }
    } catch (e) {
      /* offline / backend down — fall back to static config.js content */
    }
    return null;
  }

  function deepMerge(base, override) {
    if (override === undefined || override === null) return base;
    if (Array.isArray(override)) return override;
    if (typeof override !== "object") return override;
    if (typeof base !== "object" || base === null || Array.isArray(base)) base = {};
    var out = {};
    for (var k in base) out[k] = base[k];
    for (var k2 in override) out[k2] = deepMerge(base[k2], override[k2]);
    return out;
  }

  // ---- text content ----
  var contentRes = getJSON("/api/content?site=" + SITE);
  if (contentRes && contentRes.content) {
    window.KC_CONTENT = deepMerge(window.KC_CONTENT || {}, contentRes.content);
  }

  // ---- prices ----
  var pricesRes = getJSON("/api/prices?site=" + SITE);
  if (pricesRes && pricesRes.prices && window.KC_PRICES) {
    window.KC_PRICES = deepMerge(window.KC_PRICES, pricesRes.prices);
  }

  // ---- images (only keys the admin has actually changed) ----
  // config.js copies each KC_IMAGES filename into KC_CONTENT by value
  // at parse time (e.g. destinations.items[0].image = KC_IMAGES.card),
  // so simply overwriting KC_IMAGES here wouldn't update anything
  // already baked into KC_CONTENT. Instead: remember each key's OLD
  // filename, then swap every matching string found anywhere in
  // KC_CONTENT for the new photo URL.
  var imagesRes = getJSON("/api/images?site=" + SITE);
  if (imagesRes && imagesRes.images) {
    var oldFilenames = {}; // oldFilename -> newUrl
    window.KC_IMAGES = window.KC_IMAGES || {};
    for (var key in imagesRes.images) {
      var newUrl = imagesRes.images[key];
      var oldFilename = window.KC_IMAGES[key];
      if (oldFilename) oldFilenames[oldFilename] = newUrl;
      window.KC_IMAGES[key] = newUrl;
    }
    if (window.KC_CONTENT) replaceStringsDeep(window.KC_CONTENT, oldFilenames);
  }

  function replaceStringsDeep(obj, replacements) {
    if (!obj || typeof obj !== "object") return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = obj[k];
      if (typeof v === "string" && Object.prototype.hasOwnProperty.call(replacements, v)) {
        obj[k] = replacements[v];
      } else if (v && typeof v === "object") {
        replaceStringsDeep(v, replacements);
      }
    }
  }

  // ---- expose a price calculator the booking UI can call ----
  // Usage: KC_calculatePrice({ packageKey, unitPrice, persons, addons,
  // code }, function (result) { ... })   — result: { subtotal, breakdown, total, savings }
  window.KC_calculatePrice = function (params, callback) {
    fetch(API_BASE + "/api/calculate-price", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.assign({ site: SITE, dateISO: new Date().toISOString() }, params)),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) { callback(data.ok ? data : null); })
      .catch(function () { callback(null); });
  };

  // ---- highlight banner (site-wide announcement bar set from Telegram) ----
  document.addEventListener("DOMContentLoaded", function () {
    fetch(API_BASE + "/api/highlights?site=" + SITE)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok || !data.highlights || !data.highlights.length) return;
        var bar = document.createElement("div");
        bar.style.cssText =
          "position:sticky;top:0;z-index:9998;background:#111827;color:#fff;" +
          "padding:8px 14px;text-align:center;font:600 13px/1.5 system-ui,-apple-system,sans-serif;";
        bar.textContent = "🌟 " + data.highlights.map(function (h) { return h.text; }).join("   •   ");
        document.body.insertBefore(bar, document.body.firstChild);
      })
      .catch(function () {});
  });
})();
