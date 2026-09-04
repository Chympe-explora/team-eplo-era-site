/* ============================================================
   background-system.js — the site-wide cinematic background video.

   Mounted ONCE, directly in the DOM (not inside the React app), so it
   never restarts or flickers when React re-renders, when sections
   scroll in/out of view, or when the page changes between "home" and
   "refund-policy". React only ever tells it which page is active via
   window.KCBackgrounds.setPage(pageId).

   Config lives at window.KC_CONTENT.background — set in config.js and
   overridable per-site from Telegram Admin (via live-content.js, which
   has already run by the time this file executes — see index.html's
   script order: config.js → live-content.js → background-system.js).

   Fallback chain: page-specific video → global video → static
   fallback image → nothing. A missing/broken video never breaks the
   page — it just quietly falls back to the next thing in that chain.
   ============================================================ */
(function () {
  "use strict";

  function isOn(v, def) {
    if (v === false || v === "false") return false;
    if (v === true || v === "true") return true;
    return def;
  }

  function clampPct(v, fallback) {
    var n = typeof v === "number" ? v : parseFloat(v);
    if (isNaN(n)) n = fallback;
    return Math.max(0, Math.min(100, n)) / 100;
  }

  var layer, videoEl, imgEl, overlayEl;
  var currentVideoSrc = null;

  function ensureLayer() {
    if (layer) return layer;

    layer = document.createElement("div");
    layer.id = "kc-bg-layer";
    // Fixed + inset:0 (not width/height:100vw/vh) so it can never cause
    // horizontal overflow, and negative z-index so it always stays
    // behind the React root regardless of render order.
    layer.style.cssText = "position:fixed;inset:0;z-index:-100;overflow:hidden;pointer-events:none;background:#0b0f0d;";

    imgEl = document.createElement("div");
    imgEl.id = "kc-bg-image";
    imgEl.style.cssText = "position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity .4s ease;";

    videoEl = document.createElement("video");
    videoEl.id = "kc-bg-video";
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.loop = true;
    videoEl.playsInline = true;
    videoEl.setAttribute("muted", "");
    videoEl.setAttribute("playsinline", "");
    videoEl.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none;transition:opacity .4s ease;";
    videoEl.addEventListener("error", function () {
      // Video failed to load/decode — quietly fall back to the image.
      videoEl.style.display = "none";
      imgEl.style.display = "block";
    });

    overlayEl = document.createElement("div");
    overlayEl.id = "kc-bg-overlay";
    overlayEl.style.cssText = "position:absolute;inset:0;transition:opacity .4s ease;";

    layer.appendChild(imgEl);
    layer.appendChild(videoEl);
    layer.appendChild(overlayEl);

    function attach() {
      // First child of <body> so it's behind everything in normal flow
      // too, not just by z-index.
      document.body.insertBefore(layer, document.body.firstChild);
    }
    if (document.body) attach();
    else document.addEventListener("DOMContentLoaded", attach);

    // Respect reduced-motion preferences: keep the still image, skip
    // the moving video, without disabling the feature outright.
    try {
      var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq && mq.matches) {
        layer.setAttribute("data-reduced-motion", "1");
      }
    } catch (e) { /* matchMedia unsupported — ignore, video plays normally */ }

    return layer;
  }

  function apply(cfg, siteFallbackImage) {
    ensureLayer();
    cfg = cfg || {};
    var overlay = cfg.overlay || {};
    var enabled = isOn(cfg.enabled, true);
    var reducedMotion = layer.getAttribute("data-reduced-motion") === "1";
    var videoOn = enabled && !reducedMotion && isOn(cfg.videoEnabled, true) && !!cfg.videoUrl;
    var videoOpacity = clampPct(cfg.videoOpacity, 100);

    imgEl.style.backgroundImage = "url('" + (cfg.fallbackImage || siteFallbackImage || "") + "')";
    imgEl.style.display = enabled ? "block" : "none";
    imgEl.style.opacity = String(videoOpacity);

    if (videoOn) {
      if (currentVideoSrc !== cfg.videoUrl) {
        try {
          videoEl.pause();
          while (videoEl.firstChild) videoEl.removeChild(videoEl.firstChild);
          var source = document.createElement("source");
          source.src = cfg.videoUrl;
          source.type = "video/mp4";
          videoEl.appendChild(source);
          videoEl.load();
          var playPromise = videoEl.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
              // Autoplay blocked by the browser — the fallback image
              // underneath stays visible, nothing breaks.
              videoEl.style.display = "none";
            });
          }
          currentVideoSrc = cfg.videoUrl;
        } catch (e) {
          videoEl.style.display = "none";
          currentVideoSrc = null;
        }
      }
      videoEl.style.display = "block";
      videoEl.style.opacity = String(videoOpacity);
    } else {
      videoEl.style.display = "none";
      videoEl.pause && videoEl.pause();
      currentVideoSrc = null;
    }

    var overlayOn = isOn(overlay.enabled, true);
    overlayEl.style.background = !overlayOn
      ? "transparent"
      : overlay.gradient
      ? "linear-gradient(to bottom, transparent, " + (overlay.color || "#000000") + ")"
      : (overlay.color || "#000000");
    overlayEl.style.opacity = overlayOn ? String(clampPct(overlay.opacity, 40)) : "0";
  }

  // Section-specific → page-specific → global → static: this function
  // implements the "page vs global" half of that chain. The
  // "section-specific" half is handled separately, per-section, inside
  // app.js's SectionBG component — a section left "transparent" simply
  // lets this global layer show through underneath it.
  function resolveGlobal(pageId) {
    var CONTENT = window.KC_CONTENT || {};
    var bg = CONTENT.background || {};
    var g = bg.global || {};
    var pageCfg = (bg.pages && bg.pages[pageId]) || {};
    if (!isOn(pageCfg.enabled, false)) return g;
    var merged = Object.assign({}, g, pageCfg);
    merged.overlay = Object.assign({}, g.overlay, pageCfg.overlay || {});
    return merged;
  }

  function resolveSection(sectionKey) {
    var CONTENT = window.KC_CONTENT || {};
    return (CONTENT.sectionStyles && CONTENT.sectionStyles[sectionKey]) || {};
  }

  function setPage(pageId) {
    var CONTENT = window.KC_CONTENT || {};
    try {
      apply(resolveGlobal(pageId || "home"), CONTENT.backgroundImage);
    } catch (e) {
      // A bad config value should never take the whole site down —
      // worst case, no background renders and the page's own solid
      // color/background shows instead.
      console.warn("Background system: failed to apply config, skipping.", e);
    }
  }

  window.KCBackgrounds = {
    setPage: setPage,
    resolveGlobal: resolveGlobal,
    resolveSection: resolveSection
  };

  setPage("home");
})();
