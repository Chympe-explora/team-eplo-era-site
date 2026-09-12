/**
 * consent.js — visitor data-collection consent banner.
 * Must load BEFORE booking-bridge.js on every page.
 *
 * Nothing in booking-bridge.js sends data until window.KCConsent.isAccepted()
 * is true. Choice is remembered in localStorage so returning visitors aren't
 * asked again, and visitors can change their mind at any time.
 */
window.KCConsent = (function () {
  const KEY = "kc_consent"; // "accepted" | "declined"
  const listeners = [];

  function get() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function isAccepted() { return get() === "accepted"; }

  function set(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    listeners.forEach(function (fn) { fn(value); });
    render();
  }

  function onChange(fn) { listeners.push(fn); }

  function injectStyles() {
    if (document.getElementById("kc-consent-style")) return;
    const style = document.createElement("style");
    style.id = "kc-consent-style";
    style.textContent =
      "#kc-consent-banner{position:fixed;left:0;right:0;bottom:0;z-index:99999;" +
      "background:#132015;color:#eef5ee;padding:16px 18px;" +
      "box-shadow:0 -2px 16px rgba(0,0,0,.35);" +
      'font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}' +
      "#kc-consent-banner p{margin:0 0 12px;max-width:760px;}" +
      "#kc-consent-banner .kc-btns{display:flex;gap:10px;flex-wrap:wrap;}" +
      "#kc-consent-banner button{border:none;border-radius:999px;padding:10px 18px;" +
      "font-weight:600;font-size:14px;cursor:pointer;}" +
      "#kc-consent-accept{background:#3fae5c;color:#fff;}" +
      "#kc-consent-decline{background:transparent;color:#cfe9d4;border:1px solid #4b6b50 !important;}" +
      "#kc-consent-declined-note{position:fixed;left:12px;bottom:12px;z-index:99999;" +
      "background:#2a1414;color:#f5d6d6;padding:10px 14px;border-radius:10px;" +
      'font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      "max-width:280px;box-shadow:0 2px 10px rgba(0,0,0,.35);}" +
      "#kc-consent-declined-note a{color:#8fd6ff;}" +
      "#kc-consent-declined-note button{margin-top:6px;background:none;border:none;" +
      "color:#f5d6d6;text-decoration:underline;font-size:12px;padding:0;cursor:pointer;}";
    document.head.appendChild(style);
  }

  function render() {
    const existingBanner = document.getElementById("kc-consent-banner");
    const existingNote = document.getElementById("kc-consent-declined-note");
    if (existingBanner) existingBanner.remove();
    if (existingNote) existingNote.remove();

    const state = get();
    if (state === "accepted") return;

    injectStyles();

    if (state === "declined") {
      const note = document.createElement("div");
      note.id = "kc-consent-declined-note";
      note.innerHTML =
        "You chose not to share booking data here \u2014 online booking is off for you. " +
        'Message us on <a href="https://wa.me/919414715405" target="_blank" rel="noopener">WhatsApp</a> instead.' +
        '<br><button id="kc-consent-reopen" type="button">Change my choice</button>';
      document.body.appendChild(note);
      document.getElementById("kc-consent-reopen").onclick = function () {
        try { localStorage.removeItem(KEY); } catch (e) {}
        render();
      };
      return;
    }

    const banner = document.createElement("div");
    banner.id = "kc-consent-banner";
    banner.innerHTML =
      "<p>\uD83D\uDD12 <strong>Before you continue:</strong> to plan your trip and confirm a booking, we " +
      "collect what you type into this form (name, WhatsApp number, chosen package and dates), any " +
      "payment receipt image you upload, and basic visit info (page viewed, referring site). This is " +
      "sent to our team on Telegram to arrange your booking and payment \u2014 it isn't sold or shared " +
      "with anyone else. You can decline and still browse, or book directly over WhatsApp instead.</p>" +
      '<div class="kc-btns">' +
      '<button id="kc-consent-accept" type="button">Accept &amp; continue</button>' +
      '<button id="kc-consent-decline" type="button">Decline</button>' +
      "</div>";
    document.body.appendChild(banner);
    document.getElementById("kc-consent-accept").onclick = function () { set("accepted"); };
    document.getElementById("kc-consent-decline").onclick = function () { set("declined"); };
  }

  if (document.body) render();
  else document.addEventListener("DOMContentLoaded", render);

  return { isAccepted: isAccepted, onChange: onChange, get: get, set: set };
})();
