/* ============================================================
   typography-system.js — admin-editable heading/body text colors,
   site-wide and (on sites that support it) per-section.

   Scope, on purpose: this only overrides the light-on-dark text
   utility classes used for content sitting over the background video
   (text-white and its /NN opacity variants — "text-white/80" etc).
   It deliberately leaves text-gray-900/700/600 etc. alone, since
   those are used for dark-on-light surfaces (the notice popup,
   buttons, form fields) where "site typography" doesn't apply and
   swapping them would break contrast/readability there.

   Config lives at window.KC_CONTENT.typography (global) and, where a
   section has a stable DOM id to scope to, window.KC_CONTENT
   .sectionStyles[key].typography (per-section override) — set in
   config.js and overridable per-site from Telegram Admin (via
   live-content.js, which has already run by the time this executes —
   see index.html's script order: config.js → live-content.js →
   background-system.js → typography-system.js → app.js).

   If this fails for any reason, it fails silently and the site just
   shows its normal hard-coded text colors — nothing ever breaks
   because of this file.
   ============================================================ */
(function () {
  "use strict";

  // Section ids this site actually renders with a matching DOM id —
  // only these get a per-section override rule. (Root's named
  // sections match 1:1; the numbered-page sites don't expose a stable
  // per-page DOM id yet, so they only get the global colors below.)
  var SCOPABLE_SECTIONS = ["hero", "home", "destinations", "experiences", "booking", "about", "ratings", "footer"];

  // The exact opacity variants used across app.js for secondary/muted
  // text — kept as real opacity steps (not one flat body color) so
  // "80% white" stays visibly lighter than "60% white" after an admin
  // sets a custom body color, same relationship as the defaults.
  var OPACITY_STEPS = [90, 80, 75, 70, 60, 50, 40, 30, 25];

  function esc(s) {
    return String(s || "").replace(/[^#a-zA-Z0-9(),.%\s\/-]/g, "");
  }

  function rule(selectorPrefix, heading, body) {
    var css = "";
    if (heading) css += selectorPrefix + ".text-white{color:" + esc(heading) + " !important;}\n";
    if (body) {
      OPACITY_STEPS.forEach(function (pct) {
        css += selectorPrefix + ".text-white\\/" + pct + "{color:color-mix(in srgb," + esc(body) + " " + pct + "%,transparent) !important;}\n";
      });
      // The bare (100%) muted case some elements use directly as body copy.
      css += selectorPrefix + ".text-white\\/95{color:color-mix(in srgb," + esc(body) + " 95%,transparent) !important;}\n";
    }
    return css;
  }

  function apply() {
    var CONTENT = window.KC_CONTENT || {};
    var typo = CONTENT.typography || {};
    var css = rule("", typo.headingColor, typo.bodyColor);

    var sectionStyles = CONTENT.sectionStyles || {};
    SCOPABLE_SECTIONS.forEach(function (key) {
      var t = sectionStyles[key] && sectionStyles[key].typography;
      if (!t || (!t.headingColor && !t.bodyColor)) return;
      css += rule("#" + key + " ", t.headingColor, t.bodyColor);
    });

    if (!css) return;

    var tag = document.getElementById("kc-typography");
    if (!tag) {
      tag = document.createElement("style");
      tag.id = "kc-typography";
      document.head.appendChild(tag);
    }
    tag.textContent = css;
  }

  try {
    apply();
  } catch (e) {
    console.warn("Typography system: failed to apply config, skipping.", e);
  }
})();
