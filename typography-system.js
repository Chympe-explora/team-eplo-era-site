/* ============================================================
   typography-system.js — per-page/per-section font SIZE and COLOR
   overrides, set from the Telegram Admin (🔤 Fonts & Colors).

   Config lives at window.KC_CONTENT.sectionStyles[key].typography
   (same "sectionStyles" object background-system.js already reads
   for background/overlay/glass per section — see config.js). Each
   entry looks like:

     { headingSize: "2.5rem", headingColor: "#ffcc00",
       bodySize: "1rem",      bodyColor: "" }

   An empty string means "leave that alone" — the page's normal
   Tailwind classes keep controlling it, so a partially-configured
   entry never breaks anything.

   HOW IT APPLIES: rather than touching every heading/paragraph
   element individually (which would mean hunting down every h1–h5,
   p, span and li across every page, in three separate app.js
   files), this injects ONE <style> tag with selectors scoped to
   each page/section's own container and !important, the same way a
   no-code site builder's "custom CSS" panel works. That container is:
     - the numbered pages ("1".."7") in krem-chympe/wilderness-expedition
       → selected via the data-kc-page="N" attribute added to that
         page's <main> wrapper (see app.js)
     - the named sections on the root site ("hero", "about", ...)
       → selected via that section's own existing id="..." (already
         present on every <section>/<footer> wrapper in app.js)

   Load order: config.js → live-content.js → background-system.js →
   typography-system.js → app.js. live-content.js's fetch is
   synchronous on purpose (see its own header comment) specifically
   so every script after it already sees the admin's saved overrides
   — so a single apply() at load time is enough; no event/listener
   needed.

   A bad/missing value never breaks the page — it just means that
   one rule is skipped and the normal styling shows through.
   ============================================================ */
(function () {
  "use strict";

  function styleTag() {
    var el = document.getElementById("kc-typography-overrides");
    if (!el) {
      el = document.createElement("style");
      el.id = "kc-typography-overrides";
      document.head.appendChild(el);
    }
    return el;
  }

  // Only accept values that can't be used to break out of the
  // stylesheet (no admin-typed value ever reaches raw CSS unescaped
  // otherwise). Sizes: plain numbers/units. Colors: hex, rgb()/rgba(),
  // or a plain CSS color keyword — nothing else.
  function safeSize(v) {
    if (typeof v !== "string") return "";
    v = v.trim();
    return /^[0-9]{1,4}(\.[0-9]{1,3})?(px|rem|em|%)$/.test(v) ? v : "";
  }
  function safeColor(v) {
    if (typeof v !== "string") return "";
    v = v.trim();
    if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v)) return v;
    if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/.test(v)) return v;
    if (/^[a-zA-Z]{3,20}$/.test(v)) return v; // e.g. "white", "gold"
    return "";
  }

  function ruleFor(selectorPrefix, typo) {
    if (!typo) return "";
    var headingSize = safeSize(typo.headingSize);
    var headingColor = safeColor(typo.headingColor);
    var bodySize = safeSize(typo.bodySize);
    var bodyColor = safeColor(typo.bodyColor);

    var css = "";
    var hDecls = [];
    if (headingSize) hDecls.push("font-size:" + headingSize + " !important");
    if (headingColor) hDecls.push("color:" + headingColor + " !important");
    if (hDecls.length) {
      css += selectorPrefix + " h1, " + selectorPrefix + " h2, " + selectorPrefix + " h3, " +
             selectorPrefix + " h4, " + selectorPrefix + " h5 { " + hDecls.join(";") + "; }\n";
    }

    var bDecls = [];
    if (bodySize) bDecls.push("font-size:" + bodySize + " !important");
    if (bodyColor) bDecls.push("color:" + bodyColor + " !important");
    if (bDecls.length) {
      css += selectorPrefix + " p, " + selectorPrefix + " li, " + selectorPrefix + " span, " +
             selectorPrefix + " a { " + bDecls.join(";") + "; }\n";
    }
    return css;
  }

  function apply() {
    try {
      var CONTENT = window.KC_CONTENT || {};
      var styles = CONTENT.sectionStyles || {};
      var css = "";
      Object.keys(styles).forEach(function (key) {
        var typo = styles[key] && styles[key].typography;
        if (!typo) return;
        // Numbered keys ("1".."7") are whole pages (krem-chympe /
        // wilderness-expedition) — the root site's named keys
        // ("hero", "about", ...) already match that section's own
        // element id, no separate attribute needed there.
        var selector = /^[0-9]+$/.test(key) ? '[data-kc-page="' + key + '"]' : "#" + key;
        css += ruleFor(selector, typo);
      });
      styleTag().textContent = css;
    } catch (e) {
      // A bad config value should never take the whole page down.
      console.warn("Typography system: failed to apply config, skipping.", e);
    }
  }

  window.KCTypography = { apply: apply };
  apply();
})();
