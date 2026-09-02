/* Krem Chympe — Adventure & Camping
   Rebuilt, human-readable app.js (previous app.js was a minified/bundled
   production build with no available source — this replaces it with an
   equivalent, editable implementation, reproducing the same visual design,
   plus the centralized Price Settings and three-package booking system).
*/
(function () {
  "use strict";
  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useRef = React.useRef;

  var CONTENT = window.KC_CONTENT;

  // Telegram admin edits are saved as plain text, so a boolean toggle
  // can come back as the string "false" (which is truthy in JS) — this
  // treats "false"/false as off and everything else as on, so on/off
  // switches edited from the bot actually work.
  function isOn(v, defaultOn) {
    if (v === false || v === "false") return false;
    if (v === true || v === "true") return true;
    return defaultOn;
  }

  // Scrolls so the target section sits just below the sticky header,
  // computed from the header's real rendered height each time (rather
  // than relying on the CSS scroll-margin-top trick, which some mobile
  // webviews such as Telegram's in-app browser don't honor — leaving
  // the header covering the top of the section after the jump).
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) { window.scrollTo(0, 0); return; }
    var header = document.querySelector("header");
    var headerHeight = header ? header.getBoundingClientRect().height : 0;
    var extraGap = 16; // breathing room so the heading isn't flush against the header edge
    var targetY = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraGap;
    window.scrollTo({ top: Math.max(targetY, 0), behavior: "smooth" });
  }
  var PRICES = window.KC_PRICES;
  var ui = CONTENT.ui || {};
  var t = function (key, fallback) { return (ui && ui[key]) || fallback; };

  // Section on/off switches (edit window.KC_CONTENT.sections in config.js)
  var SECTIONS = Object.assign({
    trustBar: true, visitorGuide: true, activitiesFacilities: true, ourStory: true, statsRow: true, meetGuide: true,
    destinationDetails: true,
    sharedTourCard: true, privatePackageCard: true,
    packagesTrustRow: true, gallery: true
  }, CONTENT.sections || {});

  var VISITOR_GUIDE = CONTENT.visitorGuide || { title: "", subtitle: "", cards: [] };
  var ACT_FAC = CONTENT.activitiesFacilities || { title: "", subtitle: "", activitiesTitle: "", activities: [], facilitiesTitle: "", facilities: [] };
  var WHY_VISIT = CONTENT.whyVisit || { title: "", subtitle: "", intro: "", journeys: [] };
  var FOOTER = CONTENT.footer || { brandName: "", locationLine: "", contactTitle: "Contact Us", phone: "", email: "", followTitle: "Follow Us On", importantLinkTitle: "Important Link", refundPolicyLabel: "Refund Policy", copyright: "" };
  var REFUND_POLICY = CONTENT.refundPolicy || { title: "Refund Policy", intro: "", sections: [], promiseTitle: "", promiseText: [] };

  var TRUST = Object.assign({
    trustedText: "Trusted by 1000+", travelersText: "Travelers",
    googleRatingText: "Google Rating 4.9", safetyCertifiedText: "Safety Certified",
    ecoTourismText: "Eco Tourism"
  }, CONTENT.trustBar || {});

  var STORY_TIMELINE = CONTENT.storyTimeline || [];

  // Fills "{token}" placeholders in a template string with values from a map
  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (m, key) {
      return values.hasOwnProperty(key) ? values[key] : m;
    });
  }

  // Normalizes a content field that may be authored as either a single
  // string or an array of strings (one per line) into an array.
  function toLines(v) {
    return Array.isArray(v) ? v : (v ? [v] : []);
  }

  // ---------------------------------------------------------------------
  // Icons (lucide-style inline SVGs, matching the icon set already in use)
  // ---------------------------------------------------------------------
  function makeIcon(paths) {
    return function (props) {
      props = props || {};
      var size = props.size || 24;
      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: props.className || ""
        },
        paths.map(function (p, i) {
          return h(p[0], Object.assign({ key: i }, p[1]));
        })
      );
    };
  }

  var ArrowLeft = makeIcon([["path", { d: "m12 19-7-7 7-7" }], ["path", { d: "M19 12H5" }]]);
  var ArrowRight = makeIcon([["path", { d: "M5 12h14" }], ["path", { d: "m12 5 7 7-7 7" }]]);
  var Award = makeIcon([
    ["path", { d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" }],
    ["circle", { cx: 12, cy: 8, r: 6 }]
  ]);
  var Building2 = makeIcon([
    ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" }],
    ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" }],
    ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M10 6h4" }], ["path", { d: "M10 10h4" }], ["path", { d: "M10 14h4" }], ["path", { d: "M10 18h4" }]
  ]);
  var Camera = makeIcon([
    ["path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }],
    ["circle", { cx: 12, cy: 13, r: 3 }]
  ]);
  var Check = makeIcon([["path", { d: "M20 6 9 17l-5-5" }]]);
  var X = makeIcon([["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]]);
  var ChevronDown = makeIcon([["path", { d: "m6 9 6 6 6-6" }]]);
  var Clock = makeIcon([["circle", { cx: 12, cy: 12, r: 10 }], ["polyline", { points: "12 6 12 12 16 14" }]]);
  var Compass = makeIcon([
    ["path", { d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" }],
    ["circle", { cx: 12, cy: 12, r: 10 }]
  ]);
  var Copy = makeIcon([
    ["rect", { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
  ]);
  var CreditCard = makeIcon([["rect", { width: 20, height: 14, x: 2, y: 5, rx: 2 }], ["line", { x1: 2, x2: 22, y1: 10, y2: 10 }]]);
  var Download = makeIcon([
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "7 10 12 15 17 10" }],
    ["line", { x1: 12, x2: 12, y1: 15, y2: 3 }]
  ]);
  var IndianRupee = makeIcon([
    ["path", { d: "M6 3h12" }], ["path", { d: "M6 8h12" }], ["path", { d: "m6 13 8.5 8" }],
    ["path", { d: "M6 13h3" }], ["path", { d: "M9 13c6.667 0 6.667-10 0-10" }]
  ]);
  var Leaf = makeIcon([
    ["path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" }],
    ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" }]
  ]);
  var MapPin = makeIcon([
    ["path", { d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" }],
    ["circle", { cx: 12, cy: 10, r: 3 }]
  ]);
  var Menu = makeIcon([["line", { x1: 4, x2: 20, y1: 12, y2: 12 }], ["line", { x1: 4, x2: 20, y1: 6, y2: 6 }], ["line", { x1: 4, x2: 20, y1: 18, y2: 18 }]]);
  var Minus = makeIcon([["path", { d: "M5 12h14" }]]);
  var Mountain = makeIcon([["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }]]);
  var Phone = makeIcon([["path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }]]);
  var Plus = makeIcon([["path", { d: "M5 12h14" }], ["path", { d: "M12 5v14" }]]);
  var QrCode = makeIcon([
    ["rect", { width: 5, height: 5, x: 3, y: 3, rx: 1 }], ["rect", { width: 5, height: 5, x: 16, y: 3, rx: 1 }],
    ["rect", { width: 5, height: 5, x: 3, y: 16, rx: 1 }], ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M21 21v.01" }], ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7" }], ["path", { d: "M3 12h.01" }],
    ["path", { d: "M12 3h.01" }], ["path", { d: "M12 16v.01" }], ["path", { d: "M16 12h1" }],
    ["path", { d: "M21 12v.01" }], ["path", { d: "M12 21v-1" }]
  ]);
  var Shield = makeIcon([["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }]]);
  var Star = makeIcon([["path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" }]]);
  var Tent = makeIcon([["path", { d: "M3.5 21 14 3" }], ["path", { d: "M20.5 21 10 3" }], ["path", { d: "M15.5 21 12 15l-3.5 6" }], ["path", { d: "M2 21h20" }]]);
  var Upload = makeIcon([
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "17 8 12 3 7 8" }],
    ["line", { x1: 12, x2: 12, y1: 3, y2: 15 }]
  ]);
  var Users = makeIcon([
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["circle", { cx: 9, cy: 7, r: 4 }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }], ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }]
  ]);
  var Utensils = makeIcon([
    ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" }], ["path", { d: "M7 2v20" }],
    ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" }]
  ]);
  var X = makeIcon([["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]]);
  // "Cave" icon — a simple tunnel/arch shape, used for cave-themed highlight
  // cards (icon: "cave" in config.js)
  var CaveIcon = makeIcon([["path", { d: "M3 21h18" }], ["path", { d: "M5 21V10a7 7 0 0 1 14 0v11" }]]);
  var CalendarIcon = makeIcon([["rect", { width: 18, height: 18, x: 3, y: 4, rx: 2 }], ["path", { d: "M16 2v4" }], ["path", { d: "M8 2v4" }], ["path", { d: "M3 10h18" }]]);
  var Backpack = makeIcon([["path", { d: "M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" }], ["path", { d: "M8 21V13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" }], ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]]);
  var Mail = makeIcon([["rect", { width: 20, height: 16, x: 2, y: 4, rx: 2 }], ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }]]);
  var InstagramIcon = makeIcon([["rect", { width: 20, height: 20, x: 2, y: 2, rx: 5 }], ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }], ["line", { x1: 17.5, x2: 17.51, y1: 6.5, y2: 6.5 }]]);

  // ---------------------------------------------------------------------
  // Shared little components
  // ---------------------------------------------------------------------
  function GlassCard(props) {
    return h(
      "div",
      { className: "backdrop-blur-[24px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] " + (props.className || "") },
      props.children
    );
  }

  // ---------------------------------------------------------------------
  // VideoHero — full-width video background with logo, call + menu
  // buttons, an admin-editable quote, Book Now, and a Discover button
  // that scrolls to the content just below the hero. Shown at the top
  // of page 1 (home). Falls back to a static image if no video URL is
  // set, or if the admin has switched the video off, or if it fails to
  // load.
  // ---------------------------------------------------------------------
  function VideoHero(props) {
    var hero = props.hero || {};
    var videoUrl = hero.videoUrl || "";
    // A separate on/off switch from "enabled" (which hides the whole
    // hero) — turning this off just removes the <video> tag, so the
    // static fallback image shows through exactly as if a video had
    // never been set at all. Admin-controlled from Telegram.
    var videoOn = isOn(hero.videoEnabled, true);
    var fallbackImage = hero.fallbackImage || (CONTENT.backgrounds && CONTENT.backgrounds[0]) || "";
    var logoUrl = props.logo || "logo.png";
    var phone = (props.phone || "").trim();
    var telHref = phone ? "tel:" + phone.replace(/[^\d+]/g, "") : "";
    var navItems = props.navItems || [];

    return h(
      "div",
      {
        className: "relative w-full h-screen bg-cover bg-center overflow-hidden flex flex-col",
        style: { backgroundImage: "url('" + fallbackImage + "')", backgroundAttachment: "fixed", backgroundSize: "cover" }
      },

      // Video element (overlaid on background; if it fails — or if the
      // admin has switched it off — the background image set above
      // shows through instead, indistinguishable from no video ever
      // being set)
      videoOn && videoUrl && h(
        "video",
        {
          autoPlay: true, muted: true, loop: true, playsInline: true,
          className: "absolute inset-0 w-full h-full object-cover",
          style: { opacity: 1 },
          onError: function () { console.warn("Hero video failed to load, using fallback image"); }
        },
        h("source", { src: videoUrl, type: "video/mp4" })
      ),

      h("div", { className: "absolute inset-0 bg-black/30 z-[1]" }),

      // Content: top bar (logo left, call + menu right), quote + Book
      // Now in the middle, Discover pinned to the bottom
      h(
        "div", { className: "relative z-10 flex flex-col h-full p-5 md:p-8 lg:p-10" },

        // ---- top bar ----
        h(
          "div", { className: "flex-shrink-0 flex items-center justify-between" },
          h(
            "div", { className: "flex items-center gap-2.5" },
            h("img", { src: logoUrl, alt: CONTENT.siteName || "Logo", className: "h-9 md:h-12 object-contain drop-shadow-lg" }),
            h(
              "div", { className: "leading-tight" },
              h("div", { className: "font-bold tracking-[0.12em] text-[13px] md:text-base text-white drop-shadow" }, CONTENT.siteName),
              h("div", { className: "text-[10px] md:text-xs tracking-[0.18em] text-white/75 -mt-0.5" }, CONTENT.siteSub)
            )
          ),
          h(
            "div", { className: "flex items-center gap-2.5" },
            telHref && h(
              "a",
              {
                href: telHref,
                "aria-label": "Call us",
                className: "w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition"
              },
              h(Phone, { size: 18 })
            ),
            h(
              "button",
              {
                onClick: props.onToggleMenu,
                "aria-label": "Menu",
                className: "w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition"
              },
              props.menuOpen ? h(X, { size: 18 }) : h(Menu, { size: 18 })
            )
          )
        ),

        // ---- dropdown menu, opened from the hero's own hamburger ----
        props.menuOpen && h(
          GlassCard, { className: "flex-shrink-0 mt-3 p-3 space-y-1" },
          navItems.map(function (item, i) {
            var label = typeof item === "string" ? item : (item && item.label) || "";
            return h("button", {
              key: label + i,
              onClick: function () { props.onNavClick(item); },
              className: "w-full text-left px-4 py-3 rounded-xl text-white bg-white/5 hover:bg-white/15 transition"
            }, label);
          }),
          h("button", { onClick: props.onBookNow, className: "w-full bg-[#2E8B57] hover:bg-[#257a4b] text-white py-3 rounded-full font-medium mt-1 transition" }, "Book Now")
        ),

        // ---- quote + Book Now ----
        h(
          "div", { className: "flex-grow flex flex-col items-center justify-center gap-6 md:gap-8 px-4 text-center" },
          hero.quote && h(
            "p",
            { className: "italic font-semibold text-white text-[24px] leading-[1.25] md:text-5xl lg:text-6xl max-w-[320px] md:max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]" },
            h("span", null, hero.quote.split("—")[0].trim()),
            hero.quote.indexOf("—") !== -1 && h(
              "span",
              { className: "block mt-3 text-[16px] md:text-2xl not-italic font-normal text-white/80" },
              "— " + hero.quote.split("—").slice(1).join("—").trim()
            )
          ),
          h(
            "button",
            {
              onClick: props.onBookNow,
              className: "bg-white text-gray-900 font-bold px-10 md:px-14 py-4 md:py-5 rounded-full shadow-xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-200 text-base md:text-lg lg:text-xl whitespace-nowrap"
            },
            "Book Now"
          )
        ),

        // ---- Discover, bottom of hero — scrolls to the content below ----
        h(
          "button",
          {
            onClick: props.onDiscover,
            className: "flex-shrink-0 mx-auto flex flex-col items-center gap-0.5 pb-1 text-white/90 hover:text-white transition"
          },
          h("span", { className: "text-[13px] md:text-sm tracking-[0.2em] font-medium" }, hero.discoverLabel || "Discover"),
          h(ChevronDown, { size: 22 })
        )
      )
    );
  }

  // ---------------------------------------------------------------------
  // NoticePopup — one-time modal for new visitors. Close state is stored
  // in localStorage (keyed per site) so it only shows once per browser;
  // admin can broadcast a fresh notice via the "showAgain" flag from
  // Telegram, which the caller compares against. Fully admin-controlled:
  // when notice.enabled is off, this renders nothing at all — exactly
  // as if no notice ever existed.
  // ---------------------------------------------------------------------
  function NoticePopup(props) {
    var onClose = props.onClose;
    var notice = props.notice || {};

    if (!isOn(notice.enabled, false)) return null;

    return h(
      "div",
      {
        className: "fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm",
        onClick: onClose
      },
      h(
        "div",
        {
          className: "bg-white rounded-3xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in-95 duration-300",
          onClick: function (e) { e.stopPropagation(); }
        },
        h(
          "button",
          {
            onClick: onClose,
            className: "absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-2xl transition-colors",
            "aria-label": "Close"
          },
          "\u2715"
        ),
        h(
          "div", { className: "p-6 md:p-8 text-center" },
          h("img", {
            src: props.logo || "logo.png",
            alt: "Logo",
            className: "h-12 md:h-14 object-contain mx-auto mb-5",
            onError: function (e) { e.target.style.display = "none"; }
          }),
          h("h2", { className: "text-lg md:text-2xl font-bold text-gray-900 mb-2" }, notice.title || "PUBLIC NOTICE"),
          notice.subtitle && h("p", { className: "text-sm md:text-base text-gray-600 font-semibold mb-4" }, notice.subtitle),
          h("div", { className: "text-gray-700 text-sm md:text-base leading-relaxed mb-6 whitespace-pre-wrap font-normal" }, notice.text || ""),
          h(
            "button",
            {
              onClick: onClose,
              style: { backgroundColor: notice.iconBg || "#2E8B57", color: "#fff" },
              className: "w-full font-bold py-3 md:py-4 rounded-full hover:opacity-90 transition-opacity duration-200 text-sm md:text-base"
            },
            notice.buttonText || "Got it"
          )
        )
      )
    );
  }

  function Stepper(props) {
    var value = props.value, onChange = props.onChange, min = props.min == null ? 0 : props.min;
    return h(
      "div",
      { className: "flex items-center gap-2 bg-white/10 rounded-full p-1 border border-white/10" },
      h("button", { onClick: function () { onChange(Math.max(min, value - 1)); }, className: "w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white" }, h(Minus, { size: 14 })),
      h("span", { className: "w-6 text-center text-white text-sm font-medium" }, value),
      h("button", { onClick: function () { onChange(value + 1); }, className: "w-7 h-7 rounded-full bg-[#2E8B57] hover:bg-[#257a4b] flex items-center justify-center text-white" }, h(Plus, { size: 14 }))
    );
  }

  function money(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }

  // A small auto-sliding photo strip. Give it a list of image file names
  // via the "images" prop (e.g. from a highlight's images: [...] list in
  // config.js) and it slides to the next one every few seconds. Shows
  // nothing if the list is empty; shows a single still photo (no arrows/
  // dots/sliding) if there's only one.
  function ImageSlider(props) {
    var images = (props.images || []).filter(Boolean);
    var idxState = useState(0);
    var idx = idxState[0], setIdx = idxState[1];

    useEffect(function () {
      if (images.length < 2) return undefined;
      var timer = setInterval(function () {
        setIdx(function (i) { return (i + 1) % images.length; });
      }, props.intervalMs || 5500);
      return function () { clearInterval(timer); };
    }, [images.length]);

    if (images.length === 0) return null;

    var safeIdx = idx % images.length;

    return h(
      "div", { className: "relative mt-4 rounded-xl overflow-hidden aspect-[16/9] bg-black/20" },
      images.map(function (src, i) {
        return h("img", {
          key: i,
          src: src,
          className: "absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out " + (i === safeIdx ? "opacity-100" : "opacity-0")
        });
      }),
      images.length > 1 && h(
        "div", { className: "absolute inset-0 flex items-center justify-between px-2" },
        h(
          "button",
          {
            onClick: function () { setIdx(function (i) { return (i - 1 + images.length) % images.length; }); },
            className: "w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white",
            "aria-label": "Previous photo"
          },
          h(ArrowLeft, { size: 14 })
        ),
        h(
          "button",
          {
            onClick: function () { setIdx(function (i) { return (i + 1) % images.length; }); },
            className: "w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white",
            "aria-label": "Next photo"
          },
          h(ArrowRight, { size: 14 })
        )
      ),
      images.length > 1 && h(
        "div", { className: "absolute bottom-1.5 inset-x-0 flex justify-center gap-1.5" },
        images.map(function (_, i) {
          return h("span", { key: i, className: "w-1.5 h-1.5 rounded-full " + (i === safeIdx ? "bg-white" : "bg-white/40") });
        })
      )
    );
  }

  // ---------------------------------------------------------------------
  // Pricing logic — every number below is read from window.KC_PRICES only
  // ---------------------------------------------------------------------
  function payingChildrenCount(childAges) {
    return childAges.filter(function (a) { return Number(a) >= PRICES.childFreeAge; }).length;
  }

  // A child under childFreeAge doesn't pay the package/activities price,
  // but still uses a life jacket and still goes through the entry gate —
  // so this small flat fee is charged per free child whenever activities
  // are actually part of the booking.
  function freeChildFee() {
    return Number(PRICES.childJacketFee || 0) + Number(PRICES.childEntryFee || 0);
  }

  function sharedTourTotals(f) {
    var payingChildren = payingChildrenCount(f.childAges);
    var payingPersons = Number(f.adults || 0) + payingChildren;
    var freeChildren = f.childAges.length - payingChildren;
    var ST = PRICES.sharedTour;
    var lunchLines = (ST.thaliTypes || []).map(function (th) {
      var qty = Number((f.lunchQty || {})[th.id] || 0);
      return { id: th.id, name: th.name, qty: qty, price: ST.lunchThaliPrice, cost: qty * ST.lunchThaliPrice };
    });
    var lunchCost = lunchLines.reduce(function (s, l) { return s + l.cost; }, 0);
    // Shared Tour always includes the adventure activities, so every free
    // child on this package is charged the life jacket + entry fee.
    var childFeeCost = freeChildren * freeChildFee();
    return {
      adults: Number(f.adults || 0),
      freeChildren: freeChildren,
      payingPersons: payingPersons,
      pricePerPerson: ST.perPerson,
      lunchLines: lunchLines, lunchCost: lunchCost,
      childFeeCost: childFeeCost,
      grandTotal: payingPersons * ST.perPerson + lunchCost + childFeeCost
    };
  }

  function guideOnlyTotals() {
    return { price: PRICES.guideOnly.flat, grandTotal: PRICES.guideOnly.flat };
  }

  function privatePackageTotals(f) {
    var PP = PRICES.privatePackage;
    var people = Math.max(1, Number(f.people || 1));

    var jeepCost = f.jeep === "yes" ? PP.jeep : 0;
    var campingOn = f.camping === "yes";
    // The day-guide fee only applies when the group is NOT camping. Once
    // camping is chosen, the (mandatory) Overnight Guide fee below covers
    // guiding instead, so the separate Local Guide fee must not be charged.
    var guideCost = campingOn ? 0 : PP.guide;
    var activitiesCost = f.adventure === "yes" ? people * PP.adventurePerPerson : 0;

    var lunchLines = PP.thaliTypes.map(function (th) {
      var qty = Number((f.lunchQty || {})[th.id] || 0);
      return { id: th.id, name: th.name, qty: qty, price: PP.lunchThaliPrice, cost: qty * PP.lunchThaliPrice };
    });
    var lunchCost = lunchLines.reduce(function (s, l) { return s + l.cost; }, 0);

    var tentCost = campingOn ? Number(f.tents || 0) * PP.campingTent : 0;
    var campingMealsCost = campingOn && f.campingMeals === "yes" ? people * PP.campingMealsPerPerson : 0;
    var overnightGuideCost = campingOn ? PP.overnightGuide : 0;
    var bambooLines = campingOn ? PRICES.bambooMenu.map(function (item) {
      var qty = Number((f.bambooQty || {})[item.id] || 0);
      return { id: item.id, name: item.name, qty: qty, price: item.price, cost: qty * item.price };
    }) : [];
    var bambooCost = bambooLines.reduce(function (s, l) { return s + l.cost; }, 0);

    return {
      people: people, jeepCost: jeepCost, guideCost: guideCost, activitiesCost: activitiesCost,
      lunchLines: lunchLines, lunchCost: lunchCost,
      campingOn: campingOn, tentCost: tentCost, campingMealsCost: campingMealsCost,
      overnightGuideCost: overnightGuideCost, bambooLines: bambooLines, bambooCost: bambooCost,
      grandTotal: jeepCost + guideCost + activitiesCost + lunchCost + tentCost + campingMealsCost + overnightGuideCost + bambooCost
    };
  }

  // ---------------------------------------------------------------------
  // Child-age inputs (shared by Shared Tour & Camping forms)
  // ---------------------------------------------------------------------
  function ChildAgesInput(props) {
    var count = props.count, ages = props.ages, onChange = props.onChange;
    if (!count) return null;
    return h(
      "div", { className: "mt-3 grid grid-cols-2 md:grid-cols-4 gap-2" },
      Array.from({ length: count }).map(function (_, i) {
        return h(
          "label", { key: i, className: "block" },
          h("span", { className: "text-[11px] text-white/50" }, "Child " + (i + 1) + " age"),
          h("input", {
            type: "number", min: 0, max: 17, value: ages[i] == null ? "" : ages[i],
            onChange: function (e) {
              var next = ages.slice(); next[i] = e.target.value; onChange(next);
            },
            className: "mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-400/50 text-sm"
          })
        );
      })
    );
  }

  function syncAges(ages, count) {
    var next = ages.slice(0, count);
    while (next.length < count) next.push("");
    return next;
  }

  // ---------------------------------------------------------------------
  // Root App
  // ---------------------------------------------------------------------
  function App() {
    var pageState = useState(1); var page = pageState[0], setPage = pageState[1];
    var pkgState = useState(null); var pkg = pkgState[0], setPkg = pkgState[1];
    var menuState = useState(false); var mobileMenuOpen = menuState[0], setMobileMenuOpen = menuState[1];

    // ---- Notice popup: shows once per visitor, closable, admin-resettable ----
    var NOTICE = CONTENT.notice || {};
    var noticeState = useState(function () {
      if (typeof localStorage === "undefined") return true;
      var closedVersion = localStorage.getItem("era_notice_closed_" + (window.KC_SITE_ID || "site"));
      // If the admin bumps notice.showAgain, a stale closedVersion no
      // longer matches, so the notice shows again for everyone.
      return closedVersion !== String(NOTICE.showAgain || "");
    });
    var showNotice = noticeState[0], setShowNotice = noticeState[1];

    function closeNotice() {
      setShowNotice(false);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("era_notice_closed_" + (window.KC_SITE_ID || "site"), String(NOTICE.showAgain || ""));
      }
    }

    var galleryState = useState("All"); var galleryFilter = galleryState[0], setGalleryFilter = galleryState[1];
    var GALLERY_PAGE = CONTENT.galleryPage || { subtitle: "", filters: ["All"], viewAllLabel: "" };
    var lightboxState = useState(null); var lightboxImage = lightboxState[0], setLightboxImage = lightboxState[1];
    function toggleLightbox(src) { setLightboxImage(function (cur) { return cur === src ? null : src; }); }

    var contactState = useState({ name: "", whatsapp: "", date: "", specialRequest: "" });
    var contact = contactState[0], setContact = contactState[1];

    var sharedTourState = useState({ adults: 2, children: 0, childAges: [], lunchQty: {} });
    var sharedTourForm = sharedTourState[0], setSharedTourForm = sharedTourState[1];


    var privateState = useState({ people: 1, jeep: "no", adventure: "yes", lunchQty: {}, camping: "no", tents: 1, campingMeals: "yes", bambooQty: {} });
    var privateForm = privateState[0], setPrivateForm = privateState[1];

    // Minimum advance is read from PRICES.minAdvance (admin-editable) so
    // it stays in sync everywhere it's shown or enforced — falls back to
    // 500 if an older/incomplete PRICES object doesn't define it.
    var minAdvance = PRICES.minAdvance || 500;
    var advanceState = useState(""); var advance = advanceState[0], setAdvance = advanceState[1];
    var payTabState = useState("qr"); var payTab = payTabState[0], setPayTab = payTabState[1];
    var copiedState = useState(""); var copied = copiedState[0], setCopied = copiedState[1];

    // ---- WhatsApp booking submission (no backend — submitting a booking
    // just opens WhatsApp with everything prefilled) ----------------------
    // bookingCode here is the visitor reference code (0001, 0002, 0003…),
    // assigned from the local visitor counter — see visitorCodeRef below.
    var bookingCodeState = useState(""); var bookingCode = bookingCodeState[0], setBookingCode = bookingCodeState[1];
    var submitErrorState = useState(""); var submitError = submitErrorState[0], setSubmitError = submitErrorState[1];
    // Whether the visitor has tapped Submit and been handed off to WhatsApp.
    var submittedState = useState(false); var submitted = submittedState[0], setSubmitted = submittedState[1];

    // ---- Telegram backend booking state (silent, background) ------------
    // trackingId is the backend's own booking id used to poll status; it's
    // separate from bookingCode (the human-facing 0001/0002/... reference).
    var trackingIdState = useState(""); var trackingId = trackingIdState[0], setTrackingId = trackingIdState[1];
    var bookingStatusState = useState("pending"); var bookingStatus = bookingStatusState[0], setBookingStatus = bookingStatusState[1];
    var stopWatchRef = useRef(null);
    // Highlights the WhatsApp escape-hatch button if a booking sits
    // "pending" for more than 5 minutes without the guide confirming.
    var waitingLongState = useState(false); var waitingLong = waitingLongState[0], setWaitingLong = waitingLongState[1];
    useEffect(function () {
      if (bookingStatus !== "pending" || !trackingId) { setWaitingLong(false); return; }
      var timer = setTimeout(function () { setWaitingLong(true); }, 5 * 60 * 1000);
      return function () { clearTimeout(timer); };
    }, [bookingStatus, trackingId]);

    // Silently mirror the in-progress form to the guide's Telegram as the
    // visitor fills it in. Fails silently if the bridge/backend is
    // unreachable — never interrupts the booking flow.
    useEffect(function () {
      if (!window.KCBridge) return;
      window.KCBridge.sendDraft({
        destination: CONTENT.siteName,
        package: packageLabelForDraft(),
        name: contact.name, whatsapp: contact.whatsapp, date: contact.date,
        specialRequest: contact.specialRequest,
      });
    }, [contact.name, contact.whatsapp, contact.date, contact.specialRequest, pkg]);

    // Separate, IMMEDIATE (non-debounced) ping the moment the visitor
    // moves between booking steps — tapping Next or Back — so the admin
    // sees a fresh line in Telegram right at that moment, not just while
    // someone is actively typing. Always includes the destination and
    // package name for context, plus whatever's been filled in so far.
    var lastAnnouncedStepRef = useRef(null);
    useEffect(function () {
      if (!window.KCBridge) return;
      if (page < 2 || page > 5) return; // only the booking-flow steps
      if (lastAnnouncedStepRef.current === page) return;
      lastAnnouncedStepRef.current = page;
      var stepNames = { 2: "Choosing package", 3: "Filling booking form", 4: "Reviewing price", 5: "Payment" };
      window.KCBridge.sendDraft({
        step: stepNames[page] || ("Page " + page),
        destination: CONTENT.siteName,
        package: packageLabelForDraft(),
        name: contact.name, whatsapp: contact.whatsapp, date: contact.date,
        specialRequest: contact.specialRequest,
      }, true);
    }, [page]);

    function packageLabelForDraft() {
      return pkg === "sharedTour" ? (CONTENT.packages.sharedTour && CONTENT.packages.sharedTour.name) || "Shared Package"
        : pkg === "privatePackage" ? (CONTENT.packages.privatePackage && CONTENT.packages.privatePackage.name) || "Private Package"
        : "";
    }

    var receiptErrorState = useState(""); var receiptError = receiptErrorState[0], setReceiptError = receiptErrorState[1];
    var receiptOkState = useState(false); var receiptOk = receiptOkState[0], setReceiptOk = receiptOkState[1];
    var receiptUploadingState = useState(false); var receiptUploading = receiptUploadingState[0], setReceiptUploading = receiptUploadingState[1];

    // Phone camera receipt photos are often 3-8MB, and that whole file has
    // to travel over (often slow) mobile data, then get relayed again by
    // the backend to Telegram — that round trip is most of why receipt
    // upload felt slow. Downscaling to a still very readable ~1600px on
    // the long edge before upload cuts a typical receipt photo down to a
    // few hundred KB, which is the biggest lever we have on upload speed.
    function compressReceiptImage(file) {
      return new Promise(function (resolve) {
        if (!file || !/^image\//.test(file.type || "") || typeof document === "undefined") { resolve(file); return; }
        var img = new Image();
        var url = URL.createObjectURL(file);
        img.onload = function () {
          URL.revokeObjectURL(url);
          var maxSide = 1600;
          var scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          if (scale >= 1) { resolve(file); return; }
          var canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(function (blob) {
            if (!blob) { resolve(file); return; }
            resolve(new File([blob], file.name || "receipt.jpg", { type: "image/jpeg" }));
          }, "image/jpeg", 0.8);
        };
        img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
        img.src = url;
      });
    }

    function handleReceiptUpload(file) {
      if (!file) return;
      if (!window.KCBridge) { setReceiptError("Couldn't reach the booking system — please send your receipt on WhatsApp instead."); return; }
      setReceiptError(""); setReceiptOk(false); setReceiptUploading(true);
      compressReceiptImage(file).then(function (toSend) {
        return window.KCBridge.uploadReceipt(toSend, packageLabelForDraft() + " — " + money(grandTotal) + " (advance " + money(advance) + ")");
      }).then(function (res) {
        setReceiptUploading(false);
        if (res && res.ok) { setReceiptOk(true); }
        else { setReceiptError("Receipt upload failed — please try again or send it on WhatsApp."); }
      });
    }

    // Fired the moment the visitor taps "Pay Now" on the pricing page —
    // sends everything collected so far straight to the admin's Telegram,
    // separate from (and in addition to) the live draft that's already
    // been mirrored as they typed.
    function handlePayNowTapped() {
      if (window.KCBridge) {
        window.KCBridge.notifyPayNow({
          name: contact.name, whatsapp: contact.whatsapp, date: contact.date,
          specialRequest: contact.specialRequest, package: packageLabelForDraft(),
          total: grandTotal,
        }).catch(function () {});
      }
      setPage(5);
    }

    // ---- Refund Policy page: the reference number the visitor types in
    // before the "Chat With Us" WhatsApp button will work ----
    var refundRefState = useState(""); var refundRefCode = refundRefState[0], setRefundRefCode = refundRefState[1];
    var refundRefErrorState = useState(""); var refundRefError = refundRefErrorState[0], setRefundRefError = refundRefErrorState[1];
    function openRefundWhatsapp() {
      var RW = REFUND_POLICY.whatsapp || {};
      if (!refundRefCode || !refundRefCode.trim()) {
        setRefundRefError(RW.referenceMissingError || "Please enter your booking reference number first.");
        return;
      }
      setRefundRefError("");
      var msg = fill(RW.message || "", { referenceNumber: refundRefCode.trim() });
      window.open("https://wa.me/" + CONTENT.whatsappNumber + "?text=" + encodeURIComponent(msg), "_blank");
    }

    // PRICES (declared near the top of this file) is a plain mutable object,
    // not React state — mutating its fields via Object.assign doesn't by
    // itself trigger a re-render. priceVersion exists purely to force one:
    // bump it whenever the admin dashboard's saved prices differ from what's
    // currently loaded, so every price shown on screen (calculator totals,
    // per-item price tags, etc.) picks up the change without needing a
    // page reload.
    var priceVersionState = useState(0); var priceVersion = priceVersionState[0], setPriceVersion = priceVersionState[1];

    // ---- Visitor reference code (0001, 0002, 0003…) ----------------------
    // A simple running counter saved in this browser's localStorage,
    // incremented once per visit. Used as the reference code included in
    // every prefilled WhatsApp message. It's per-device (there's no server
    // to share a single count across every visitor's browser) — the admin
    // dashboard's Visitors tab reads the same counter.
    var VISITOR_SEQ_KEY = "kc_visitor_seq";
    var visitorCodeRef = React.useRef(null);
    if (!visitorCodeRef.current) {
      var nextSeq = 1;
      try {
        nextSeq = (parseInt(localStorage.getItem(VISITOR_SEQ_KEY), 10) || 0) + 1;
        localStorage.setItem(VISITOR_SEQ_KEY, String(nextSeq));
      } catch (e) { /* localStorage unavailable — fall back to 1 for this visit */ }
      visitorCodeRef.current = String(nextSeq).padStart(4, "0");
    }

    // ---- Live prices/content from the Admin Dashboard (localStorage) ----
    // admin.html saves whatever the admin edits into localStorage under
    // these keys. Read them on load, and also on every "storage" event so
    // a change saved on the Admin Dashboard in another tab of the SAME
    // browser applies here immediately without a reload. This only syncs
    // within one device/browser — there's no server to broadcast it wider.
    var PRICES_KEY = "kc_admin_prices";
    var CONTENT_KEY = "kc_admin_content";
    function applyStoredOverrides() {
      var changed = false;
      try {
        var storedPrices = JSON.parse(localStorage.getItem(PRICES_KEY) || "null");
        if (storedPrices) { Object.assign(PRICES, storedPrices); changed = true; }
      } catch (e) { /* ignore malformed data */ }
      try {
        var storedContent = JSON.parse(localStorage.getItem(CONTENT_KEY) || "null");
        if (storedContent) {
          Object.assign(CONTENT, storedContent);
          if (storedContent.bank) Object.assign(CONTENT.bank, storedContent.bank);
          changed = true;
        }
      } catch (e) { /* ignore malformed data */ }
      if (changed) setPriceVersion(function (v) { return v + 1; }); // force re-render so new numbers/content actually show
    }
    useEffect(function () {
      applyStoredOverrides();
      function onStorage(e) {
        if (e.key === PRICES_KEY || e.key === CONTENT_KEY) applyStoredOverrides();
      }
      window.addEventListener("storage", onStorage);
      return function () { window.removeEventListener("storage", onStorage); };
    }, []);

    // Builds the prefilled WhatsApp message from the selected package +
    // items + contact details, opens it in a new tab/app, and moves the
    // visitor on to the confirmation page. No server round-trip — WhatsApp
    // *is* the submission.
    function submitBookingViaWhatsApp() {
      if (!pkg) { setSubmitError("Please choose a package before submitting."); return false; }
      if (!contact.name || !contact.whatsapp || !contact.date) { setSubmitError("Please fill in your name, WhatsApp number, and date first."); return false; }
      setSubmitError("");

      // Send the finished booking to the guide's Telegram FIRST, and only
      // move the visitor on to the confirmation page once we know it
      // actually reached the admin. Previously the visitor was always
      // shown "submitted" immediately, even if the Telegram send failed —
      // so a booking could vanish with no error and no record anywhere.
      if (!window.KCBridge) {
        setSubmitError("Couldn't reach the booking system. Please use the WhatsApp button below to send your booking directly.");
        return false;
      }

      window.KCBridge.submitBooking({
        name: contact.name, whatsapp: contact.whatsapp, date: contact.date,
        specialRequest: contact.specialRequest, package: packageLabelForDraft(),
        reference: visitorCodeRef.current, advance: advance, total: grandTotal, balance: balanceLeft,
        paymentMethod: payTab === "qr" ? "QR Code" : payTab === "upi" ? "UPI" : "Bank Transfer",
        // Full pretty-formatted text (ref no, itemized breakdown, totals —
        // identical to the WhatsApp message) so the Telegram booking
        // message the guide sees matches it exactly, with the payment
        // receipt (if one was uploaded) attached to the same message.
        message: buildBookingMessageText(),
      }).then(function (res) {
        if (res && res.ok && res.bookingId) {
          setBookingCode(visitorCodeRef.current);
          setSubmitted(true);
          saveBookingRecord(visitorCodeRef.current);
          setBookingStatus("pending");
          setPage(6);
          setTrackingId(res.bookingId);
          if (stopWatchRef.current) stopWatchRef.current();
          stopWatchRef.current = window.KCBridge.watchStatus(res.bookingId, function (status) {
            setBookingStatus(status);
          });
        } else {
          setSubmitError("Your booking couldn't be sent to the admin (" + ((res && res.error) || "unknown error") + "). Please use the WhatsApp button below instead.");
        }
      });
      return true;
    }

    // ---- Booking record, saved for the Super Admin dashboard -------------
    // No backend — bookings are written to this browser's localStorage under
    // BOOKINGS_KEY as a simple array. Same per-device limitation as prices
    // and the visitor counter: admin.html reads this list on the SAME
    // device/browser the booking was made on. Each record starts with
    // status "pending"; the admin can update status/edit/delete/export from
    // the Bookings tab in admin.html.
    var BOOKINGS_KEY = "kc_bookings";
    function saveBookingRecord(code) {
      try {
        var list = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
        list.push({
          code: code,
          createdAt: new Date().toISOString(),
          status: "pending",
          name: contact.name,
          whatsapp: contact.whatsapp,
          date: contact.date,
          package: packageLabel,
          people:
            pkg === "sharedTour" ? (totals.payingPersons || 0) + (totals.freeChildren || 0) :
            pkg === "privatePackage" ? totals.people :
            null,
          total: grandTotal,
          advance: advance,
          balance: balanceLeft
        });
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
      } catch (e) { console.error("Couldn't save booking record:", e); }
    }

    var packageLabel = pkg === "sharedTour" ? (CONTENT.packages.sharedTour && CONTENT.packages.sharedTour.name) || "Shared Package"
      : pkg === "privatePackage" ? (CONTENT.packages.privatePackage && CONTENT.packages.privatePackage.name) || "Private Package"
      : "";

    var totals = useMemo(function () {
      if (pkg === "sharedTour") return sharedTourTotals(sharedTourForm);
      if (pkg === "privatePackage") return privatePackageTotals(privateForm);
      return { grandTotal: 0 };
    }, [pkg, sharedTourForm, privateForm]);

    var grandTotal = totals.grandTotal || 0;
    var balanceLeft = Math.max(0, grandTotal - Number(advance || 0));

    function copyToClipboard(text, key) {
      navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(function () { setCopied(""); }, 1500);
    }

    function goToPackage(which) {
      setPkg(which);
      setPage(3);
    }

    function invoiceLines() {
      if (pkg === "sharedTour") {
        var stLines = [
          ["Adults", totals.adults],
          ["Children (Free)", totals.freeChildren],
          ["Paying Persons", totals.payingPersons],
          ["Price Per Person", money(totals.pricePerPerson)]
        ];
        (totals.lunchLines || []).forEach(function (l) { if (l.qty > 0) stLines.push([l.name + " x" + l.qty, money(l.cost)]); });
        if (totals.childFeeCost > 0) stLines.push(["Life Jacket & Entry Fee (" + totals.freeChildren + " free child" + (totals.freeChildren === 1 ? "" : "ren") + ")", money(totals.childFeeCost)]);
        return stLines;
      }
      if (pkg === "privatePackage") {
        var ppLines = [];
        if (totals.jeepCost > 0) ppLines.push(["4x4 Jeep", money(totals.jeepCost)]);
        ppLines.push(
          totals.campingOn
            ? ["Local Guide (waived — covered by Overnight Guide)", "₹0"]
            : ["Local Guide (mandatory)", money(totals.guideCost)]
        );
        if (totals.activitiesCost > 0) ppLines.push(["Adventure Activities (" + totals.people + " people)", money(totals.activitiesCost)]);
        totals.lunchLines.forEach(function (l) { if (l.qty > 0) ppLines.push([l.name + " x" + l.qty, money(l.cost)]); });
        if (totals.campingOn) {
          ppLines.push(["Camping Tent Rental", money(totals.tentCost)]);
          if (totals.campingMealsCost > 0) ppLines.push(["Camping Meals", money(totals.campingMealsCost)]);
          ppLines.push(["Overnight Guide (mandatory)", money(totals.overnightGuideCost)]);
          totals.bambooLines.forEach(function (l) { if (l.qty > 0) ppLines.push([l.name + " x" + l.qty, money(l.cost)]); });
        }
        return ppLines;
      }
      if (pkg === "guideOnly") {
        return [["Package Name", "Guide Only"], ["Price", money(totals.price)]];
      }
      return [];
    }

    function formatGroup(adults, childAges) {
      var kids = (childAges || []).filter(function (a) { return a !== "" && a !== null && a !== undefined; });
      var adultStr = adults + " Adult" + (adults === 1 ? "" : "s");
      if (kids.length === 0) return adultStr;
      var ages = kids.join(", ");
      var childStr = kids.length + " Child" + (kids.length === 1 ? "" : "ren") + " (" + ages + " " + (kids.length === 1 ? "year" : "years") + ")";
      return adultStr + " + " + childStr;
    }

    var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function formatDate(d) {
      if (!d) return "";
      var parts = d.split("-");
      if (parts.length !== 3) return d;
      var day = parseInt(parts[2], 10);
      var month = MONTH_NAMES[parseInt(parts[1], 10) - 1];
      if (!month) return d;
      return day + " " + month + " " + parts[0];
    }

    // Builds the exact same nicely-formatted booking text used for the
    // WhatsApp prefill — also sent to the backend on Submit so the
    // Telegram message the guide sees matches this format 1:1 (ref no,
    // itemized breakdown, totals, payment method, everything).
    function buildBookingMessageText() {
      var group = pkg === "sharedTour" ? formatGroup(sharedTourForm.adults, sharedTourForm.childAges)
        : pkg === "privatePackage" ? (privateForm.people + " Guest" + (privateForm.people === 1 ? "" : "s"))
        : "";
      var paymentMethod = payTab === "qr" ? "QR Code" : payTab === "upi" ? "UPI" : "Bank Transfer";
      var detailLines = invoiceLines().map(function (l) { return "• " + l[0] + ": " + l[1]; }).join("\n");
      return "🏔️ Booking Request — Krem Chympe Adventure\n\n" +
        "Hi! I'd like to make a booking with the following details:\n" +
        "🖊️ Ref no: " + visitorCodeRef.current + "\n" +
        "👤 Name: " + contact.name + "\n" +
        "📱 WhatsApp: " + contact.whatsapp + "\n" +
        "📅 Visit: " + formatDate(contact.date) + "\n" +
        "🎒 Package: " + packageLabel + "\n" +
        "👥 Group: " + group + "\n\n" +
        "📋 Booking Details:\n" + detailLines + "\n\n" +
        "💰 Grand Total: " + money(grandTotal) + "\n" +
        "💵 Advance: " + money(advance) + "\n" +
        "⚖️ Balance Left: " + money(balanceLeft) + "\n" +
        "💳 Payment: " + paymentMethod + "\n\n" +
        (contact.specialRequest ? "📝 Special Request: " + contact.specialRequest + "\n\n" : "") +
        "Please confirm the availability and booking. Thank you!";
    }

    function whatsappLink() {
      return "https://wa.me/" + CONTENT.whatsappNumber + "?text=" + encodeURIComponent(buildBookingMessageText());
    }

    // ---- Nav items shared by the header and the hero's own dropdown ----
    // Each item can be admin-configured (via the Telegram bot) as either
    // a plain string (old format — always routes non-Home items to the
    // Packages page, for backward compatibility) or a { label, target }
    // object where target is the page number to jump to. This is what
    // lets the admin point "Gallery" or "Contact" somewhere other than
    // Packages without touching this file again.
    function navLabel(item) { return typeof item === "string" ? item : (item && item.label) || ""; }
    // Maps a nav item's target to a { page, scrollId } destination.
    // "target" can be a section keyword ("home" | "explore" | "gallery" |
    // "contact" | "packages" | "booking") which scrolls to that exact
    // section - jumping to the right wizard page first if it isn't the
    // current one - editable from the Telegram bot without touching this
    // file. Legacy values (a plain string label, or a numeric 1/2 target
    // from older content) still work, falling back to the old "jump to
    // page 2" behavior.
    var NAV_DESTINATIONS = {
      home: { page: 1, scrollId: null },
      explore: { page: 1, scrollId: "kc-explore" },
      gallery: { page: 1, scrollId: "kc-gallery" },
      contact: { page: 1, scrollId: "kc-contact" },
      packages: { page: 2, scrollId: "kc-packages" },
      booking: { page: 2, scrollId: "kc-packages" }
    };
    function resolveNavTarget(item) {
      var raw = typeof item === "string" ? null : (item && item.target);
      if (typeof raw === "string" && NAV_DESTINATIONS[raw.toLowerCase()]) return NAV_DESTINATIONS[raw.toLowerCase()];
      if (typeof item === "string") return item === "Home" ? NAV_DESTINATIONS.home : NAV_DESTINATIONS.packages;
      var n = item && Number(item.target);
      if (n === 1) return NAV_DESTINATIONS.home;
      return NAV_DESTINATIONS.packages;
    }
    // Handles the two extra destination kinds the admin bot can set on a
    // nav item beyond a section jump: an external "url", or
    // "whatsapp": true to open a WhatsApp chat.
    function navigateItem(item) {
      if (item && typeof item === "object") {
        if (item.url) { setMobileMenuOpen(false); window.open(item.url, item.newTab === false ? "_self" : "_blank"); return; }
        if (item.whatsapp) { setMobileMenuOpen(false); window.open("https://wa.me/" + (CONTENT.whatsappNumber || ""), "_blank"); return; }
      }
      setMobileMenuOpen(false);
      var dest = resolveNavTarget(item);
      function scroll() {
        if (!dest.scrollId) { window.scrollTo(0, 0); return; }
        scrollToId(dest.scrollId);
      }
      if (page !== dest.page) { setPage(dest.page); setTimeout(scroll, 60); }
      else scroll();
    }
    var navItems = (CONTENT.nav && CONTENT.nav.items) || ["Home", "Explore", "Packages", "Gallery", "Booking", "Contact"];
    function onHeroNavClick(item) { navigateItem(item); }

    // ---- Header ----------------------------------------------------
    var header = h(
      "header", { className: "sticky top-0 z-40 p-3 md:p-4" },
      h(
        GlassCard, { className: "max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between" },
        h(
          "div", { className: "flex items-center gap-3" },
          CONTENT.logoImage
            ? h("img", { src: CONTENT.logoImage, className: "w-9 h-9 rounded-full object-cover border border-white/20" })
            : h("div", { className: "w-9 h-9 rounded-full bg-[#2E8B57] flex items-center justify-center" }, h(Mountain, { size: 18 })),
          h(
            "div", { className: "leading-tight" },
            h("div", { className: "font-bold tracking-[0.12em] text-[13px]" }, CONTENT.siteName),
            h("div", { className: "text-[10px] tracking-[0.18em] text-white/70 -mt-0.5" }, CONTENT.siteSub)
          )
        ),
        h(
          "nav", { className: "hidden md:flex items-center gap-1 bg-white/[0.06] border border-white/10 rounded-full p-1.5 backdrop-blur-xl" },
          navItems.map(function (p, i) {
            return h("button", {
              key: navLabel(p) + i,
              onClick: function () { navigateItem(p); },
              className: "px-4 py-1.5 rounded-full text-[13px] transition " + (i === 0 && page === 1 ? "bg-white text-black" : "text-white/80 hover:text-white hover:bg-white/10")
            }, navLabel(p));
          })
        ),
        h(
          "div", { className: "flex items-center gap-2" },
          h("button", { onClick: function () { setPage(2); }, className: "hidden md:block bg-[#2E8B57] hover:bg-[#257a4b] px-5 py-2 rounded-full text-sm font-medium transition" }, t("bookNow", "Book Now")),
          h("button", { onClick: function () { setMobileMenuOpen(!mobileMenuOpen); }, className: "md:hidden w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center" }, mobileMenuOpen ? h(X, { size: 18 }) : h(Menu, { size: 18 }))
        )
      ),
      mobileMenuOpen && h(
        GlassCard, { className: "md:hidden mt-3 p-4 max-w-[1280px] mx-auto space-y-2" },
        (CONTENT.nav && CONTENT.nav.mobileItems || ["Home", "Packages", "Gallery"]).map(function (p) {
          return h("button", {
            key: navLabel(p),
            onClick: function () { navigateItem(p); },
            className: "w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10"
          }, navLabel(p));
        }),
        h("button", { onClick: function () { setPage(2); setMobileMenuOpen(false); }, className: "w-full bg-[#2E8B57] py-3 rounded-full font-medium" }, t("bookNow", "Book Now")),
        h("a", { href: "admin.html", className: "block text-center text-[11px] text-white/30 pt-1" }, "Admin")
      )
    );

    // ---- Page 1: Home ------------------------------------------------
    var titleWords = CONTENT.hero.title.split(" ");
    var page1 = page === 1 && h(
      "main", { id: "kc-content-start", className: "max-w-[1280px] mx-auto px-4 md:px-6 pb-32 space-y-6 scroll-mt-24" },
      h(
        "div", { className: "grid md:grid-cols-[1.15fr_0.85fr] gap-6" },
        h(
          GlassCard, { className: "p-8 md:p-12" },
          h("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] tracking-widest" }, CONTENT.hero.badge),
          h(
            "h1", { className: "mt-6 text-[32px] md:text-[56px] font-bold leading-[0.95] tracking-tight" },
            titleWords.slice(0, 2).join(" "), h("br"), h("span", { className: "text-white/70" }, titleWords.slice(2).join(" "))
          ),
          h("p", { className: "mt-5 text-white/70 text-[15px] leading-relaxed max-w-[520px]" }, CONTENT.hero.sub),
          h("div", { className: "mt-8 flex gap-3" }, h("button", { onClick: function () { setPage(2); }, className: "bg-[#2E8B57] hover:bg-[#257a4b] px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2" }, "Book Now ", h(ArrowRight, { size: 16 })))
        ),
        h(
          GlassCard, { className: "p-5 md:p-6 flex flex-col justify-between" },
          h(
            "div", { className: "space-y-4" },
            h("div", { className: "flex items-center justify-between" }, h("span", { className: "text-sm text-white/70 flex items-center gap-2" }, h(Users, { size: 16 }), t("visitors", " Visitors")), h("span", { className: "text-sm font-medium" }, t("visitorRange", "1 - 5 People"))),
            h("div", { className: "h-px bg-white/10" }),
            h("div", { className: "flex items-center justify-between" }, h("span", { className: "text-sm text-white/70 flex items-center gap-2" }, h(Clock, { size: 16 }), t("duration", " Duration")), h("span", { className: "text-sm font-medium" }, CONTENT.hero.duration)),
            h("div", { className: "h-px bg-white/10" }),
            h("div", { className: "flex items-center justify-between" }, h("span", { className: "text-sm text-white/70 flex items-center gap-2" }, h(IndianRupee, { size: 16 }), t("price", " Price")), h("span", { className: "text-sm font-medium" }, CONTENT.hero.priceLabel)),
            h("div", { className: "mt-6 rounded-[16px] overflow-hidden border border-white/10" }, h("img", { src: CONTENT.sectionImages.heroCave, className: "w-full h-[180px] object-cover" }))
          ),
          h("button", { onClick: function () { setPage(2); }, className: "mt-6 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full text-sm font-semibold" }, t("bookNow", "Book Now"))
        )
      ),
      SECTIONS.trustBar && h(
        GlassCard, { className: "px-6 py-4 flex flex-wrap items-center justify-between gap-4" },
        h(
          "div", { className: "flex items-center gap-3" },
          h("div", { className: "flex -space-x-2" }, [0, 1, 2, 3].map(function (p) { return h("img", { key: p, src: "https://i.pravatar.cc/100?img=" + (10 + p), className: "w-8 h-8 rounded-full border-2 border-black/30" }); })),
          h("div", { className: "text-[13px]" }, h("span", { className: "font-semibold" }, TRUST.trustedText), " ", h("span", { className: "text-white/60" }, TRUST.travelersText))
        ),
        h(
          "div", { className: "flex gap-6 text-[13px]" },
          h("span", { className: "flex items-center gap-2" }, h(Star, { size: 14, className: "text-amber-400" }), " " + TRUST.googleRatingText),
          h("span", { className: "flex items-center gap-2" }, h(Shield, { size: 14, className: "text-emerald-400" }), " " + TRUST.safetyCertifiedText),
          h("span", { className: "flex items-center gap-2" }, h(Award, { size: 14 }), " " + TRUST.ecoTourismText)
        )
      ),
      SECTIONS.visitorGuide && VISITOR_GUIDE.cards && VISITOR_GUIDE.cards.length > 0 && h(
        GlassCard, { className: "p-6 md:p-10" },
        h("h2", { className: "text-2xl md:text-3xl font-semibold text-center" }, VISITOR_GUIDE.title),
        VISITOR_GUIDE.subtitle && h("p", { className: "mt-2 text-white/60 text-sm text-center max-w-[560px] mx-auto" }, VISITOR_GUIDE.subtitle),
        h(
          "div", { className: "mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5" },
          VISITOR_GUIDE.cards.map(function (card) {
            var icons = { mappin: MapPin, calendar: CalendarIcon, users: Users, backpack: Backpack, shield: Shield, leaf: Leaf };
            var Icon = icons[card.icon] || Mountain;
            return h(
              "div", { key: card.title, className: "" },
              h(
                "div", { className: "flex items-center gap-3 mb-3" },
                h("div", { className: "w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0" }, h(Icon, { size: 18, className: "text-emerald-400" })),
                h("h3", { className: "font-semibold text-[15px]" }, card.title)
              ),
              h(
                "ul", { className: "space-y-2" },
                (card.items || []).map(function (item, i) {
                  return h("li", { key: i, className: "flex gap-2 text-[13px] text-white/70 leading-relaxed" }, h("span", { className: "text-emerald-400 font-bold" }, "•"), item);
                })
              )
            );
          })
        )
      ),
      (SECTIONS.ourStory || SECTIONS.statsRow) && h(
        "div", { className: "grid md:grid-cols-[1.1fr_0.9fr] gap-6" },
        SECTIONS.ourStory && h(
          GlassCard, { className: "p-8 md:p-10" },
          h("h2", { className: "text-2xl font-semibold" }, t("ourStory", "Our Story")),
          h(
            "div", { className: "mt-8 space-y-6 border-l border-white/10 pl-6 relative" },
            STORY_TIMELINE.map(function (p) {
              return h(
                "div", { key: p.title, className: "relative" },
                h("div", { className: "absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#2E8B57] border-2 border-white/20" }),
                h("div", { className: "text-[11px] tracking-widest text-white/50" }, p.year),
                h("div", { className: "font-medium mt-1" }, p.title),
                h("div", { className: "text-[13px] text-white/60 mt-1" }, p.desc)
              );
            })
          )
        ),
        SECTIONS.statsRow && h(
          GlassCard, { className: "p-6 grid grid-cols-2 gap-4 content-start" },
          [
            { k: "10.5KM", v: t("statForestTrailLabel", "Mapped Cave") },
            { k: "3-4 Hrs", v: t("statAverageTrekLabel", "Trek Each Way") },
            { k: "50+", v: t("statSpeciesLabel", "Limestone Dams") },
            { k: "4.9", v: t("statGoogleRatingLabel", "Visitor Rating") }
          ].map(function (p) {
            return h("div", { key: p.v, className: "rounded-[16px] bg-white/5 border border-white/10 p-5" }, h("div", { className: "text-2xl font-bold" }, p.k), h("div", { className: "text-[12px] text-white/60 mt-1" }, p.v));
          })
        )
      ),
      SECTIONS.destinationDetails && h(
        "div", { id: "kc-explore", className: "space-y-6 scroll-mt-24" },
        h(
          GlassCard, { className: "p-8 md:p-10 text-center" },
          h("h2", { className: "text-3xl font-semibold" }, CONTENT.destinationDetails.title),
          h("p", { className: "mt-2 text-white/60 text-sm" }, CONTENT.destinationDetails.subtitle)
        ),
        h("div", { className: "grid md:grid-cols-2 gap-6" },
          (CONTENT.destinationDetails.highlights || []).map(function (highlight) {
            var icons = { mountain: Mountain, water: Compass, users: Users, leaf: Leaf, cave: CaveIcon, eco: Leaf };
            var Icon = icons[highlight.icon] || Mountain;
            return h(
              GlassCard, { key: highlight.label, className: "p-6" },
              h("div", { className: "flex gap-3 items-start" },
                h("div", { className: "w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0" },
                  h(Icon, { size: 20, className: "text-emerald-400" })
                ),
                h("div", null,
                  h("div", { className: "font-semibold text-sm" }, highlight.label),
                  h("div", { className: "text-[13px] text-white/60 mt-1" }, highlight.description)
                )
              ),
              h(ImageSlider, { images: highlight.images || [] })
            );
          })
        )
      ),
      WHY_VISIT.journeys && WHY_VISIT.journeys.length > 0 && h(
        GlassCard, { className: "p-6 md:p-10" },
        h("h2", { className: "text-2xl md:text-3xl font-semibold text-center tracking-tight" }, WHY_VISIT.title),
        WHY_VISIT.subtitle && h("p", { className: "mt-2 text-white/80 text-base font-medium text-center" }, WHY_VISIT.subtitle),
        WHY_VISIT.intro && h("p", { className: "mt-4 text-white/60 text-sm leading-relaxed text-center max-w-[720px] mx-auto" }, WHY_VISIT.intro),
        h(
          "div", { className: "mt-8 grid md:grid-cols-2 gap-5" },
          WHY_VISIT.journeys.map(function (j) {
            return h(
              "div", { key: j.number, className: "" },
              h(
                "div", { className: "flex items-center gap-3" },
                h("span", { className: "text-2xl" }, j.emoji),
                h("span", { className: "text-[11px] tracking-widest text-white/40 font-semibold" }, j.number, " —"),
                h("h3", { className: "font-semibold text-[15px]" }, j.title)
              ),
              j.tagline && h("div", { className: "mt-3 text-white/80 text-[13px] font-medium italic" }, j.tagline),
              j.description && h("p", { className: "mt-2 text-[13px] text-white/60 leading-relaxed" }, j.description),
              j.experience && j.experience.length > 0 && h(
                "div", { className: "mt-4 flex flex-wrap gap-2" },
                j.experience.map(function (tag) {
                  return h("span", { key: tag, className: "px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[11px] text-emerald-300" }, tag);
                })
              )
            );
          })
        )
      ),
      SECTIONS.activitiesFacilities && h(
        GlassCard, { className: "p-6 md:p-10" },
        h("h2", { className: "text-2xl md:text-3xl font-semibold text-center" }, ACT_FAC.title),
        ACT_FAC.subtitle && h("p", { className: "mt-2 text-white/60 text-sm text-center max-w-[560px] mx-auto" }, ACT_FAC.subtitle),
        h(
          "div", { className: "mt-8 grid md:grid-cols-2 gap-6" },
          h(
            "div", { className: "md:pr-6" },
            h(
              "div", { className: "flex items-center gap-3 mb-4" },
              h("div", { className: "w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0" }, h(Mountain, { size: 18, className: "text-emerald-400" })),
              h("h3", { className: "font-semibold text-[15px]" }, ACT_FAC.activitiesTitle)
            ),
            h(
              "ul", { className: "grid sm:grid-cols-2 gap-x-4 gap-y-2" },
              (ACT_FAC.activities || []).map(function (item) {
                return h("li", { key: item, className: "flex gap-2 text-[13px] text-white/70" }, h(Check, { size: 14, className: "text-emerald-400 mt-0.5 flex-shrink-0" }), item);
              })
            )
          ),
          h(
            "div", { className: "md:pl-6 md:border-l md:border-white/10" },
            h(
              "div", { className: "flex items-center gap-3 mb-4" },
              h("div", { className: "w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0" }, h(Shield, { size: 18, className: "text-emerald-400" })),
              h("h3", { className: "font-semibold text-[15px]" }, ACT_FAC.facilitiesTitle)
            ),
            h(
              "ul", { className: "grid sm:grid-cols-2 gap-x-4 gap-y-2" },
              (ACT_FAC.facilities || []).map(function (item) {
                return h("li", { key: item, className: "flex gap-2 text-[13px] text-white/70" }, h(Check, { size: 14, className: "text-emerald-400 mt-0.5 flex-shrink-0" }), item);
              })
            )
          )
        )
      ),
      SECTIONS.meetGuide && h(
        GlassCard, { className: "p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-center" },
        h("img", { src: CONTENT.guide.image, className: "w-20 h-20 rounded-full object-cover border border-white/20 flex-shrink-0" }),
        h(
          "div", { className: "text-center sm:text-left" },
          h("div", { className: "font-semibold text-lg" }, t("meetYourGuide", "Meet Your Guide")),
          h("div", { className: "text-[13px] text-white/80 mt-0.5" }, CONTENT.guide.name, " • ", CONTENT.guide.role),
          h("div", { className: "text-[13px] text-white/60 mt-1.5 max-w-[560px]" }, CONTENT.guide.bio)
        )
      ),
      SECTIONS.gallery && h(
        GlassCard, { id: "kc-gallery", className: "p-6 md:p-8 scroll-mt-24" },
        h(
          "div", { className: "flex flex-wrap justify-between items-center gap-4" },
          h("h3", { className: "text-2xl font-semibold" }, t("ourGallery", "Our Gallery"), h("br"), h("span", { className: "text-white/50 text-base font-normal" }, GALLERY_PAGE.subtitle)),
          h("div", { className: "flex gap-2 flex-wrap" }, GALLERY_PAGE.filters.map(function (p) {
            return h("button", { key: p, onClick: function () { setGalleryFilter(p); }, className: "px-4 py-1.5 rounded-full text-xs border transition " + (galleryFilter === p ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10") }, p);
          }))
        ),
        h("div", { className: "mt-6 grid grid-cols-12 gap-3 auto-rows-[140px]" }, CONTENT.galleryImages.filter(function (p) { return galleryFilter === "All" || p.cat === galleryFilter; }).map(function (p) {
          return h(
            "div", {
              key: p.id,
              className: p.span + " rounded-[16px] overflow-hidden border border-white/10 relative group cursor-pointer",
              onClick: function () { toggleLightbox(p.src); }
            },
            h("img", { src: p.src, className: "w-full h-full object-cover group-hover:scale-110 transition duration-700" }),
            h("div", { className: "absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" }),
            h("div", { className: "absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] border border-white/10" }, p.cat)
          );
        })),
        h("div", { className: "mt-6 flex justify-center" }, h("a", { href: CONTENT.instagram, target: "_blank", className: "px-6 py-2.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 text-sm flex items-center gap-2" }, h(Camera, { size: 16 }), GALLERY_PAGE.viewAllLabel))
      ),
      h(
        "footer", { id: "kc-contact", className: "pt-6 scroll-mt-24" },
        h(
          GlassCard, { className: "p-8 md:p-10" },
          h("h3", { className: "text-center tracking-[0.15em] text-lg font-semibold" }, FOOTER.brandName),
          FOOTER.locationLine && h("p", { className: "mt-3 text-center text-white/60 text-sm max-w-[480px] mx-auto" }, FOOTER.locationLine),
          h("div", { className: "mt-8 grid sm:grid-cols-3 gap-8 text-sm" },
            h(
              "div", null,
              h("div", { className: "font-semibold mb-3" }, FOOTER.contactTitle),
              FOOTER.phone && h("a", { href: "tel:" + FOOTER.phone.replace(/\s+/g, ""), className: "flex items-center gap-2 text-white/70 hover:text-white mb-2" }, h(Phone, { size: 14 }), FOOTER.phone),
              FOOTER.email && h("a", { href: "mailto:" + FOOTER.email, className: "flex items-center gap-2 text-white/70 hover:text-white break-all" }, h(Mail, { size: 14 }), FOOTER.email)
            ),
            h(
              "div", null,
              h("div", { className: "font-semibold mb-3" }, FOOTER.followTitle),
              h("a", { href: CONTENT.instagram, target: "_blank", className: "inline-flex w-9 h-9 rounded-full bg-white/10 border border-white/10 items-center justify-center hover:bg-white/15" }, h(InstagramIcon, { size: 16 }))
            ),
            h(
              "div", null,
              h("div", { className: "font-semibold mb-3" }, FOOTER.importantLinkTitle),
              h("button", { onClick: function () { setPage(7); window.scrollTo(0, 0); }, className: "text-white/70 hover:text-white underline underline-offset-2" }, FOOTER.refundPolicyLabel)
            )
          ),
          h("div", { className: "mt-10 pt-6 border-t border-white/10 text-center text-[12px] text-white/40" }, FOOTER.copyright)
        )
      )
    );

    // ---- Package cards -------------------------------------------------
    function IncludedItem(text) {
      return h("li", { key: text, className: "flex gap-2" }, h(Check, { size: 14, className: "text-emerald-400 mt-0.5" }), " " + text);
    }

    var PKG = CONTENT.packages || {};
    var pkgFillValues = { childFreeAge: PRICES.childFreeAge, childJacketFee: money(PRICES.childJacketFee), childEntryFee: money(PRICES.childEntryFee) };
    var PACKAGES_PAGE = CONTENT.packagesPage || { subtitle: "", trustRow: [] };

    var sharedTourCard = SECTIONS.sharedTourCard && h(
      GlassCard, { className: "overflow-hidden group" },
      h(
        "div", { className: "relative h-[220px] overflow-hidden" },
        h("img", { src: CONTENT.sectionImages.sharedPackageCard, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700" }),
        h("div", { className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur text-xs border border-white/10" }, PKG.sharedTour.badge),
        h("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" })
      ),
      h(
        "div", { className: "p-6" },
        h(
          "div", { className: "flex justify-between items-start" },
          h("h3", { className: "text-xl font-semibold" }, PKG.sharedTour.name),
          h("div", { className: "text-right" }, h("div", { className: "text-xl font-bold" }, money(PRICES.sharedTour.perPerson)), h("div", { className: "text-[11px] text-white/50" }, PKG.sharedTour.priceUnit))
        ),
        h(
          "ul", { className: "mt-4 space-y-2 text-[13px] text-white/70" },
          PKG.sharedTour.features.map(function (f) { return IncludedItem(fill(f, pkgFillValues)); })
        ),
        h("button", { onClick: function () { goToPackage("sharedTour"); }, className: "mt-6 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full font-medium flex items-center justify-center gap-2" }, t("bookNow", "Book Now"), " ", h(ArrowRight, { size: 16 }))
      )
    );

    var guideOnlyCard = false; // Guide Only package removed — kept as `false` so any
    // stray reference elsewhere renders nothing instead of throwing.

    var PPB = CONTENT.privatePackageBooking || {};
    var privatePackageCard = SECTIONS.privatePackageCard && h(
      GlassCard, { className: "overflow-hidden group" },
      h(
        "div", { className: "relative h-[220px] overflow-hidden" },
        h("img", { src: CONTENT.sectionImages.privatePackageCard, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700" }),
        h("div", { className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur text-xs border border-white/10" }, PKG.privatePackage.badge),
        h("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" })
      ),
      h(
        "div", { className: "p-6" },
        h(
          "div", { className: "flex justify-between items-start" },
          h("h3", { className: "text-xl font-semibold" }, PKG.privatePackage.name),
          h("div", { className: "text-right" }, h("div", { className: "text-[11px] text-white/50" }, PKG.privatePackage.priceUnit))
        ),
        h(
          "ul", { className: "mt-4 space-y-2 text-[13px] text-white/70" },
          PKG.privatePackage.features.map(function (f) { return IncludedItem(f); })
        ),
        h("button", { onClick: function () { goToPackage("privatePackage"); }, className: "mt-6 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full font-medium flex items-center justify-center gap-2" }, t("bookNow", "Book Now"), " ", h(ArrowRight, { size: 16 }))
      )
    );

    // ---- Page 2: Packages & Gallery ------------------------------------
    var page2 = page === 2 && h(
      "main", { id: "kc-packages", className: "max-w-[1280px] mx-auto px-4 md:px-6 pb-32 space-y-6 scroll-mt-24" },
      h(
        GlassCard, { className: "p-8 md:p-10 text-center" },
        h("h2", { className: "text-3xl md:text-4xl font-bold" }, t("ourAdventurePackages", "Our Adventure Packages")),
        h("p", { className: "text-white/60 mt-3 text-sm" }, PACKAGES_PAGE.subtitle)
      ),
      h("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6" }, sharedTourCard, privatePackageCard),
      SECTIONS.packagesTrustRow && h(
        GlassCard, { className: "px-6 py-4 flex flex-wrap justify-center gap-6 text-[13px] text-white/70" },
        PACKAGES_PAGE.trustRow.map(function (label, i) {
          var icons = [Shield, Users, Leaf, Star];
          var Icon = icons[i] || Shield;
          return h("span", { key: label, className: "flex items-center gap-2" }, h(Icon, { size: 14 }), " " + label);
        })
      )
    );

    // ---- Page 3: Booking form (varies by package) ----------------------
    var contactFields = h(
      "div", { className: "grid md:grid-cols-2 gap-5" },
      h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, t("fullName", "Full Name")), h("input", { value: contact.name, onChange: function (e) { setContact(Object.assign({}, contact, { name: e.target.value })); }, placeholder: "Your name", className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-400/50 text-sm" })),
      h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, t("whatsappNumberLabel", "WhatsApp Number")), h("input", { value: contact.whatsapp, onChange: function (e) { setContact(Object.assign({}, contact, { whatsapp: e.target.value })); }, placeholder: "+91 98765 43210", className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-400/50 text-sm" })),
      h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, t("dateLabel", "Date")), h("input", { type: "date", value: contact.date, onChange: function (e) { setContact(Object.assign({}, contact, { date: e.target.value })); }, className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm [color-scheme:dark]" })),
      h("label", { className: "space-y-2 block md:col-span-2" }, h("span", { className: "text-xs text-white/60" }, "Special Request (optional)"), h("textarea", { value: contact.specialRequest, onChange: function (e) { setContact(Object.assign({}, contact, { specialRequest: e.target.value })); }, rows: 3, placeholder: "Anything else we should know?", className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-400/50 text-sm resize-none" }))
    );

    var STB = CONTENT.sharedTourBooking || {};
    var sharedTourForm2 = pkg === "sharedTour" && h(
      "div", { className: "mt-8 space-y-5" },
      h(
        GlassCard, { className: "p-5 !rounded-[16px] text-[13px] text-white/70" },
        h("div", { className: "font-medium text-white mb-2" }, STB.includedTitle),
        h("div", { className: "text-white/70" }, STB.includesLabel || "Includes:"),
        h("ul", { className: "mt-1 text-xs text-white/50 list-disc pl-5 space-y-0.5" }, (STB.includedItems || []).map(function (it) { return h("li", { key: it }, it); })),
        h("div", { className: "mt-3 text-white/50" }, fill(STB.childFreeText, pkgFillValues)),
        toLines(STB.batchText).map(function (line, i) { return h("div", { key: i, className: "mt-2 text-white/50" }, fill(line, pkgFillValues)); })
      ),
      h(
        "div", { className: "grid md:grid-cols-2 gap-5" },
        h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, STB.adultsLabel), h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" }, h("span", { className: "text-sm" }, sharedTourForm.adults, " " + STB.adultsLabel), h(Stepper, { value: sharedTourForm.adults, min: 1, onChange: function (v) { setSharedTourForm(Object.assign({}, sharedTourForm, { adults: v })); } }))),
        h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, STB.childrenLabel), h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" }, h("span", { className: "text-sm" }, sharedTourForm.children, " " + STB.childrenLabel), h(Stepper, { value: sharedTourForm.children, onChange: function (v) { setSharedTourForm(Object.assign({}, sharedTourForm, { children: v, childAges: syncAges(sharedTourForm.childAges, v) })); } })))
      ),
      h(ChildAgesInput, { count: sharedTourForm.children, ages: sharedTourForm.childAges, onChange: function (ages) { setSharedTourForm(Object.assign({}, sharedTourForm, { childAges: ages })); } }),
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, STB.lunchTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.sharedTour.lunchThaliPrice) + STB.lunchPriceUnit)),
        h("div", { className: "text-xs text-white/50" }, STB.lunchSubtitle),
        toLines(STB.lunchIncludes).map(function (line, i) { return h("div", { key: i, className: "text-xs text-white/50" }, line); }),
        h("div", { className: "space-y-2" }, (PRICES.sharedTour.thaliTypes || []).map(function (th) {
          var qty = (sharedTourForm.lunchQty || {})[th.id] || 0;
          return h(ThaliRow, {
            key: th.id, name: th.name, price: PRICES.sharedTour.lunchThaliPrice, qty: qty,
            onChange: function (v) { var next = Object.assign({}, sharedTourForm.lunchQty); next[th.id] = v; setSharedTourForm(Object.assign({}, sharedTourForm, { lunchQty: next })); }
          });
        }))
      )
    );

    // ---- Private Package booking form ------------------------------------
    function RadioRow(props) {
      // props: selected (bool), label, priceLabel, disabled, onClick
      return h(
        "button", {
          type: "button",
          disabled: props.disabled,
          onClick: props.onClick,
          className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm " +
            (props.selected ? "bg-white/10 border-emerald-400/50" : "bg-white/5 border-white/10") +
            (props.disabled ? " opacity-70 cursor-default" : " hover:bg-white/10")
        },
        h("span", { className: "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 " + (props.selected ? "border-emerald-400" : "border-white/30") }, props.selected && h("span", { className: "w-2 h-2 rounded-full bg-emerald-400" })),
        h("span", null, props.label),
        props.priceLabel && h("span", { className: "text-white/50 text-xs" }, props.priceLabel)
      );
    }

    function ThaliRow(props) {
      // props: name, price, qty, onChange
      return h(
        "div", { className: "flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10" },
        h("div", null, h("div", { className: "text-sm" }, props.name), h("div", { className: "text-xs text-white/50" }, money(props.price) + (PPB.lunchEachSuffix || " each"))),
        h(Stepper, { value: props.qty, onChange: props.onChange }),
        h("div", { className: "w-14 text-right text-xs text-white/60" }, money(props.qty * props.price))
      );
    }

    var privatePackageForm2 = pkg === "privatePackage" && h(
      "div", { className: "mt-8 space-y-5" },

      // Number of people
      h(
        "label", { className: "space-y-2 block" },
        h("span", { className: "text-xs text-white/60" }, PPB.peopleLabel),
        h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" },
          h("span", { className: "text-sm" }, privateForm.people, " " + PPB.peopleLabel),
          h(Stepper, { value: privateForm.people, min: 1, onChange: function (v) { setPrivateForm(Object.assign({}, privateForm, { people: v })); } })
        )
      ),

      // 4x4 Jeep
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.jeepTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.jeep) + PPB.jeepPriceUnit)),
        h("div", { className: "text-xs text-white/50" }, PPB.jeepNote1),
        h("div", { className: "text-xs text-white/50" }, PPB.jeepNote2),
        h("div", { className: "space-y-2" },
          h(RadioRow, { selected: privateForm.jeep === "yes", label: PPB.jeepYesLabel, priceLabel: "(+" + money(PRICES.privatePackage.jeep) + ")", onClick: function () { setPrivateForm(Object.assign({}, privateForm, { jeep: "yes" })); } }),
          h(RadioRow, { selected: privateForm.jeep === "no", label: PPB.jeepNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { jeep: "no" })); } })
        )
      ),

      // Local Guide (mandatory)
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.guideTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.guide))),
        h("div", { className: "text-xs text-white/50" }, PPB.guideNote1),
        h("div", { className: "text-xs text-white/50" }, PPB.guideNote2),
        h(RadioRow, { selected: true, disabled: true, label: PPB.guideMandatoryLabel })
      ),

      // Adventure Activities
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.adventureTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.adventurePerPerson) + PPB.adventurePriceUnit)),
        h("div", { className: "text-xs text-white/50" }, PPB.adventureIncludesLabel),
        h("ul", { className: "text-xs text-white/50 list-disc pl-5 space-y-0.5" }, (PPB.adventureIncludes || []).map(function (it) { return h("li", { key: it }, it); })),
        h("div", { className: "text-xs text-white/50" }, PPB.adventureNote),
        h("div", { className: "space-y-2" },
          h(RadioRow, { selected: privateForm.adventure === "yes", label: PPB.adventureYesLabel, priceLabel: "(+" + money(PRICES.privatePackage.adventurePerPerson) + "/person)", onClick: function () { setPrivateForm(Object.assign({}, privateForm, { adventure: "yes" })); } }),
          h(RadioRow, { selected: privateForm.adventure === "no", label: PPB.adventureNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { adventure: "no" })); } })
        )
      ),

      // Lunch — thali quantities
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.lunchTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.lunchThaliPrice) + PPB.lunchPriceUnit)),
        h("div", { className: "text-xs text-white/50" }, PPB.lunchSubtitle),
        h("div", { className: "space-y-2" }, PRICES.privatePackage.thaliTypes.map(function (th) {
          var qty = (privateForm.lunchQty || {})[th.id] || 0;
          return h(ThaliRow, {
            key: th.id, name: th.name, price: PRICES.privatePackage.lunchThaliPrice, qty: qty,
            onChange: function (v) { var next = Object.assign({}, privateForm.lunchQty); next[th.id] = v; setPrivateForm(Object.assign({}, privateForm, { lunchQty: next })); }
          });
        }))
      ),

      // Camping toggle
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "font-medium" }, PPB.campingTitle),
        h("div", { className: "space-y-2" },
          h(RadioRow, { selected: privateForm.camping === "yes", label: PPB.campingYesLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { camping: "yes" })); } }),
          h(RadioRow, { selected: privateForm.camping === "no", label: PPB.campingNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { camping: "no" })); } })
        )
      ),

      // Camping Details — only shown if Camping = yes; otherwise the form
      // goes straight from the toggle above to Next -> pricing -> payment.
      privateForm.camping === "yes" && h(
        "div", { className: "space-y-5" },
        h(
          GlassCard, { className: "!rounded-[16px] overflow-hidden" },
          h("div", { className: "px-5 py-3 bg-[#2E8B57]" }, h("div", { className: "font-semibold" }, PPB.campingDetailsTitle)),
          h("div", { className: "px-5 py-3 text-xs text-white/60" }, PPB.campingDetailsSubtitle)
        ),
        h(
          GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
          h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.tentTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.campingTent) + PPB.tentPriceUnit)),
          h("div", { className: "text-xs text-white/50" }, PPB.tentIncludes),
          h("div", { className: "text-xs text-white/50" }, PPB.tentNote),
          h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" },
            h("span", { className: "text-sm" }, PPB.tentsLabel),
            h(Stepper, { value: privateForm.tents, min: 0, onChange: function (v) { setPrivateForm(Object.assign({}, privateForm, { tents: v })); } })
          )
        ),
        h(
          GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
          h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.campingMealsTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.campingMealsPerPerson) + PPB.campingMealsPriceUnit)),
          h("div", { className: "text-xs text-white/50" }, PPB.campingMealsIncludes),
          h("div", { className: "text-xs text-white/50" }, PPB.campingMealsNote),
          h("div", { className: "space-y-2" },
            h(RadioRow, { selected: privateForm.campingMeals === "yes", label: PPB.campingMealsYesLabel, priceLabel: "(+" + money(PRICES.privatePackage.campingMealsPerPerson) + "/person)", onClick: function () { setPrivateForm(Object.assign({}, privateForm, { campingMeals: "yes" })); } }),
            h(RadioRow, { selected: privateForm.campingMeals === "no", label: PPB.campingMealsNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { campingMeals: "no" })); } })
          )
        ),
        h(
          GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
          h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.overnightGuideTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.overnightGuide))),
          h("div", { className: "text-xs text-white/50" }, PPB.overnightGuideNote),
          h(RadioRow, { selected: true, disabled: true, label: PPB.overnightGuideMandatoryLabel })
        ),
        h(
          "details", { className: "group p-4 rounded-[16px] bg-white/5 border border-white/10" },
          h("summary", { className: "flex justify-between items-center cursor-pointer list-none" }, h("div", null, h("span", { className: "text-sm font-medium flex items-center gap-2" }, h(Utensils, { size: 16 }), PPB.bambooDishesTitle), h("div", { className: "text-xs text-white/50 mt-1 font-normal" }, PPB.bambooDishesDesc)), h(ChevronDown, { size: 16, className: "group-open:rotate-180 transition flex-shrink-0" })),
          h("div", { className: "mt-4 grid md:grid-cols-2 gap-3" }, PRICES.bambooMenu.map(function (item) {
            var qty = (privateForm.bambooQty || {})[item.id] || 0;
            return h(
              "div", { key: item.id, className: "flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10" },
              h("div", null, h("div", { className: "text-[13px]" }, item.name), h("div", { className: "text-xs text-white/50" }, money(item.price))),
              h(Stepper, { value: qty, onChange: function (v) { var next = Object.assign({}, privateForm.bambooQty); next[item.id] = v; setPrivateForm(Object.assign({}, privateForm, { bambooQty: next })); } })
            );
          }))
        )
      )
    );

    var page3 = page === 3 && h(
      "main", { className: "max-w-[900px] mx-auto px-4 md:px-6 pb-32 space-y-6" },
      h(
        GlassCard, { className: "p-6 md:p-8" },
        h("div", { className: "flex items-center gap-3" }, h("div", { className: "w-8 h-8 rounded-full flex items-center justify-center bg-[#2E8B57]" }, h(Compass, { size: 16 })), h("h2", { className: "text-2xl font-semibold" }, packageLabel, " Booking")),
        h("div", { className: "mt-8" }, contactFields),
        sharedTourForm2, privatePackageForm2,
        h(
          "button",
          {
            disabled: !contact.name || !contact.whatsapp || !contact.date,
            onClick: function () { setPage(4); },
            className: "mt-8 w-full bg-[#2E8B57] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#257a4b] py-3.5 rounded-full font-semibold flex items-center justify-center gap-2"
          },
          t("nextViewPricing", "Next — View Pricing "), h(ArrowRight, { size: 18 })
        )
      )
    );

    // ---- Page 4: Pricing / invoice calculator --
    var page4 = page === 4 && h(
      "main", { className: "max-w-[1280px] mx-auto px-4 md:px-6 pb-32 space-y-6" },
      h(GlassCard, { className: "p-8 text-center" }, h("h2", { className: "text-3xl font-bold" }, t("pricingFacilities", "Pricing & Facilities")), h("p", { className: "text-white/60 text-sm mt-2" }, packageLabel, " — itemized invoice")),
      h(
        "div", { className: "grid md:grid-cols-[1fr_380px] gap-6" },
        h(
          GlassCard, { className: "p-6" },
          h("h4", { className: "font-semibold mb-4" }, "Invoice"),
          h(
            "div", { className: "space-y-2" },
            invoiceLines().map(function (l, i) {
              return h("div", { key: i, className: "flex justify-between text-[13px] py-1 border-b border-white/5" }, h("span", { className: "text-white/60" }, l[0]), h("span", null, l[1]));
            })
          )
        ),
        h(
          GlassCard, { className: "p-6 h-fit sticky top-24" },
          h("h4", { className: "font-semibold" }, t("totalCalculator", "Total Calculator")),
          h("div", { className: "mt-4 flex justify-between font-bold text-lg" }, h("span", null, t("totalAmount", "Total Amount")), h("span", null, money(grandTotal))),
          h("button", { onClick: handlePayNowTapped, className: "mt-4 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full font-semibold" }, t("payNow", "Pay Now")),
          h("div", { className: "text-[11px] text-white/40 text-center mt-2" }, (CONTENT.payment || {}).advanceNote)
        )
      )
    );

    // ---- Page 5: Payment -----------------------------------------------
    var PAY = CONTENT.payment || {};
    var page5 = page === 5 && h(
      "main", { className: "max-w-[900px] mx-auto px-4 md:px-6 pb-32" },
      h(
        GlassCard, { className: "p-6 md:p-8" },
        h("h2", { className: "text-2xl font-semibold" }, t("paymentOptionsTitle", "Payment Options")),
        h(
          "div", { className: "mt-6 flex gap-2 p-1 bg-white/5 rounded-full w-fit border border-white/10" },
          [{ id: "qr", label: t("qrScannerLabel", "QR Scanner"), icon: QrCode }, { id: "upi", label: t("upiIdLabel", "UPI ID"), icon: CreditCard }, { id: "bank", label: t("bankTransferLabel", "Bank Transfer"), icon: Building2 }].map(function (p) {
            return h("button", { key: p.id, onClick: function () { setPayTab(p.id); }, className: "px-5 py-2 rounded-full text-sm flex items-center gap-2 transition " + (payTab === p.id ? "bg-white text-black" : "text-white/60 hover:text-white") }, h(p.icon, { size: 14 }), p.label);
          })
        ),
        h(
          "div", { className: "mt-8 grid md:grid-cols-[320px_1fr] gap-8" },
          h(
            "div", null,
            payTab === "qr" && h(
              "div", { className: "space-y-4" },
              h(
                "div", { className: "aspect-square rounded-[20px] bg-white p-4 flex items-center justify-center relative overflow-hidden border border-white/10" },
                h(
                  "div", { className: "relative text-center" },
                  window.KC_IMAGES.qrCode
                    ? h("img", { src: window.KC_IMAGES.qrCode, className: "w-full h-full max-w-[280px] max-h-[280px] mx-auto object-contain rounded-[8px]" })
                    : h("div", { className: "w-40 h-40 mx-auto bg-black text-white flex items-center justify-center text-[10px] font-mono p-2" }, "UPI QR", h("br"), CONTENT.upiId, h("br"), money(grandTotal)),
                  h("div", { className: "mt-3 text-black text-xs font-semibold" }, t("scanToPayLabel", "Scan to Pay ₹"), grandTotal)
                )
              ),
              window.KC_IMAGES.qrCode && h(
                "a", {
                  href: window.KC_IMAGES.qrCode,
                  download: "krem-chympe-upi-qr.png",
                  className: "flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
                },
                h(Download, { size: 14 }), PAY.downloadQr || " Download QR"
              )
            ),
            payTab === "upi" && h(
              GlassCard, { className: "p-5 !rounded-[16px]" },
              h("div", { className: "text-xs text-white/50" }, t("upiIdLabel", "UPI ID")),
              h("div", { className: "mt-2 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2.5" }, h("span", { className: "text-sm font-mono" }, CONTENT.upiId), h("button", { onClick: function () { copyToClipboard(CONTENT.upiId, "upi"); }, className: "w-7 h-7 rounded-full bg-white text-black flex items-center justify-center" }, copied === "upi" ? h(Check, { size: 14 }) : h(Copy, { size: 14 }))),
              h("div", { className: "mt-3 text-xs text-white/50" }, "Amount: ", money(grandTotal))
            ),
            payTab === "bank" && h(
              GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
              [{ label: PAY.accountNameLabel, value: CONTENT.bank.name }, { label: PAY.accountNumberLabel, value: CONTENT.bank.account }, { label: PAY.ifscLabel, value: CONTENT.bank.ifsc }, { label: PAY.bankLabel, value: CONTENT.bank.bankName }].map(function (p) {
                return h(
                  "div", { key: p.label, className: "flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2" },
                  h("div", null, h("div", { className: "text-[10px] text-white/40" }, p.label), h("div", { className: "text-xs font-mono" }, p.value)),
                  h("button", { onClick: function () { copyToClipboard(p.value, p.label); }, className: "w-7 h-7 rounded-full bg-white/10 flex items-center justify-center" }, copied === p.label ? h(Check, { size: 12 }) : h(Copy, { size: 12 }))
                );
              })
            )
          ),
          h(
            "div", { className: "space-y-6" },
            h(
              GlassCard, { className: "p-5 !rounded-[16px]" },
              h("div", { className: "text-sm font-medium" }, t("orderSummary", "Order Summary")),
              h(
                "div", { className: "mt-3 space-y-2 text-[13px]" },
                h("div", { className: "flex justify-between" }, h("span", { className: "text-white/60" }, t("packageLabel", "Package")), h("span", null, packageLabel)),
                h("div", { className: "flex justify-between font-bold pt-2 border-t border-white/10" }, h("span", null, t("totalLabel", "Total")), h("span", null, money(grandTotal)))
              )
            ),
            h(
              "div", null,
              h("label", { className: "text-xs text-white/60" }, "Advance Payment (Min " + money(minAdvance) + ")"),
              h("input", { type: "number", min: minAdvance, value: advance, placeholder: "Min " + minAdvance, onChange: function (e) { var v = e.target.value; setAdvance(v === "" ? "" : Math.max(0, Number(v))); }, className: "mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm" }),
              advance < minAdvance && h("div", { className: "text-[11px] text-red-300 mt-2" }, PAY.advanceHelperText),
              h("div", { className: "mt-2 text-xs text-white/50" }, t("balanceLeftLabel", "Balance left to pay on arrival: ₹"), balanceLeft)
            ),
            h(
              GlassCard, { className: "p-4 !rounded-[16px] flex gap-3" },
              h("div", { className: "w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center" }, h(Shield, { size: 14, className: "text-emerald-400" })),
              h("div", { className: "text-[12px] text-white/60" }, "Pay using any of the methods above, then tap Submit — when you are ready to chat with your tour guide.")
            ),
            h(
              GlassCard, { className: "p-4 !rounded-[16px]" },
              h("label", { className: "text-xs text-white/60 block mb-2" }, "Upload Payment Receipt / Screenshot (optional)"),
              h("input", {
                type: "file", accept: "image/*",
                onChange: function (e) { handleReceiptUpload(e.target.files && e.target.files[0]); e.target.value = ""; },
                className: "w-full text-[12px] text-white/70 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-emerald-500/20 file:text-emerald-300 file:text-[12px]"
              }),
              h("div", { className: "text-[11px] text-white/40 mt-2" }, "If this opens your camera instead of your gallery, open this page in Chrome/Safari (not inside the Telegram/Instagram/Facebook app) and try again."),
              receiptUploading && h("div", { className: "text-[11px] text-white/60 mt-2" }, "⏳ Uploading receipt…"),
              receiptOk && h("div", { className: "text-[11px] text-emerald-300 mt-2" }, "✅ Receipt received."),
              receiptError && h("div", { className: "text-[11px] text-amber-300 mt-2" }, receiptError)
            ),
            submitError && h(
              "div", { className: "space-y-2" },
              h("div", { className: "text-[12px] text-amber-300" }, submitError),
              h("a", { href: whatsappLink(), target: "_blank", rel: "noopener", className: "kc-whatsapp-btn block text-center" }, "Send via WhatsApp instead")
            ),
            h("button", {
              onClick: submitBookingViaWhatsApp,
              disabled: advance < minAdvance,
              className: "kc-whatsapp-btn"
            }, h(Phone, { size: 18 }), t("submitBookingButton", "Submit"))
          )
        )
      )
    );

    // ---- Page 6: Live booking status --------------------------------
    // Three states, driven silently by KCBridge.watchStatus() polling
    // the backend, which flips only once the guide taps Confirm/Cancel
    // in Telegram. Nothing here ever shows a browser notification —
    // it's just this card re-rendering with new state.
    var statusVisual =
      bookingStatus === "confirmed"
        ? { icon: h(Check, { size: 36, className: "text-emerald-400" }), ring: "bg-emerald-500/20 border-emerald-400/30", title: "Booking Confirmed!", badge: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300", badgeText: "Your guide has confirmed this booking ✅" }
        : bookingStatus === "cancelled"
        ? { icon: h(X, { size: 36, className: "text-red-400" }), ring: "bg-red-500/20 border-red-400/30", title: "Not Confirmed", badge: "bg-red-500/15 border-red-400/30 text-red-300", badgeText: "Your guide couldn't confirm this — please message them below" }
        : { icon: h("div", { className: "w-8 h-8 rounded-full border-2 border-emerald-400/60 border-t-transparent animate-spin" }), ring: "bg-emerald-500/10 border-emerald-400/20", title: "Booking In Progress", badge: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300", badgeText: "Sent to your tour guide — waiting for their confirmation" };

    var page6 = page === 6 && h(
      "main", { className: "max-w-[600px] mx-auto px-4 md:px-6 pb-32" },
      h(
        GlassCard, { className: "p-10 text-center" },
        h("div", { className: "w-20 h-20 mx-auto rounded-full border flex items-center justify-center " + statusVisual.ring }, statusVisual.icon),
        h("h2", { className: "mt-6 text-3xl font-bold" }, statusVisual.title),
        h(
          "div",
          { className: "mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs border " + statusVisual.badge },
          h("span", { className: "w-2 h-2 rounded-full bg-current" }),
          statusVisual.badgeText
        ),
        h("p", { className: "mt-3 text-white/60 text-sm" }, t("thankYouPrefix", "Thank you "), contact.name, t("thankYouMiddle", "! Your adventure is secured. We have received advance ₹"), advance, t("thankYouBalanceMid", ". Balance ₹"), balanceLeft, t("thankYouSuffix", " to be paid on arrival.")),
        bookingCode && h(
          "div", { className: "mt-4 inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-mono" },
          "Reference: #", bookingCode
        ),
        submitError && h("p", { className: "mt-3 text-amber-300 text-xs" }, submitError),
        h(
          "div", { className: "mt-8 text-left p-4 rounded-xl bg-white/5 border border-white/10 text-[13px] space-y-2" },
          h("div", { className: "flex justify-between" }, h("span", { className: "text-white/50" }, t("packageLabel", "Package")), h("span", null, packageLabel)),
          h("div", { className: "flex justify-between" }, h("span", { className: "text-white/50" }, t("dateLabel", "Date")), h("span", null, contact.date)),
          h("div", { className: "flex justify-between" }, h("span", { className: "text-white/50" }, t("totalLabel", "Total")), h("span", null, money(grandTotal)))
        ),
        (waitingLong || bookingStatus === "cancelled") && h(
          "p", { className: "mt-4 text-[12px] text-amber-300" },
          bookingStatus === "cancelled" ? "Chat with us to sort this out." : "This is taking a little longer than usual — feel free to message us directly."
        ),
        h(
          "div", { className: "mt-6 flex flex-col gap-3" },
          h(
            "a", {
              href: whatsappLink(),
              target: "_blank",
              className: "kc-whatsapp-btn" + (waitingLong || bookingStatus === "cancelled" ? " ring-2 ring-amber-400/60" : "")
            },
            h(Phone, { size: 18 }),
            bookingStatus === "confirmed" ? "Message Your Guide" : "WhatsApp"
          )
        ),
        h("button", { onClick: function () { if (stopWatchRef.current) stopWatchRef.current(); setPage(1); setPkg(null); setBookingCode(""); setTrackingId(""); setBookingStatus("pending"); setSubmitError(""); setSubmitted(false); }, className: "mt-4 w-full bg-white/5 border border-white/10 py-3 rounded-full font-semibold" }, t("backToHome", "Back to Home"))
      )
    );

    // ---- Page 7: Refund Policy (only reachable via the footer link) ----
    var page7 = page === 7 && h(
      "main", { className: "max-w-[760px] mx-auto px-4 md:px-6 pb-32" },
      h(
        GlassCard, { className: "p-6 md:p-10" },
        h("h1", { className: "text-2xl md:text-3xl font-bold" }, REFUND_POLICY.title),
        REFUND_POLICY.intro && h("p", { className: "mt-4 text-white/70 text-sm leading-relaxed" }, REFUND_POLICY.intro),
        h(
          "div", { className: "mt-8 space-y-8" },
          (REFUND_POLICY.sections || []).map(function (sec) {
            return h(
              "div", { key: sec.number, className: "border-t border-white/10 pt-6" },
              h("h2", { className: "text-lg font-semibold" }, sec.number, ". ", sec.heading),
              h(
                "div", { className: "mt-3 space-y-3" },
                (sec.blocks || []).map(function (block, i) {
                  if (block.type === "list") {
                    return h(
                      "div", { key: i },
                      block.lead && h("p", { className: "text-white/70 text-[13px] leading-relaxed mb-2" }, block.lead),
                      h(
                        "ul", { className: "space-y-1.5 pl-1" },
                        (block.items || []).map(function (item, j) {
                          return h("li", { key: j, className: "flex gap-2 text-[13px] text-white/70 leading-relaxed" }, h("span", { className: "text-emerald-400 font-bold" }, "•"), item);
                        })
                      )
                    );
                  }
                  return h("p", { key: i, className: "text-white/70 text-[13px] leading-relaxed" }, block.text);
                })
              )
            );
          })
        ),
        (REFUND_POLICY.promiseTitle || (REFUND_POLICY.promiseText && REFUND_POLICY.promiseText.length > 0)) && h(
          "div", { className: "mt-10 p-6 rounded-[18px] bg-emerald-500/10 border border-emerald-400/20" },
          REFUND_POLICY.promiseTitle && h("h3", { className: "font-semibold text-emerald-300" }, REFUND_POLICY.promiseTitle),
          toLines(REFUND_POLICY.promiseText).map(function (line, i) {
            return h("p", { key: i, className: "mt-2 text-white/80 text-[13px] leading-relaxed" }, line);
          })
        ),
        REFUND_POLICY.whatsapp && h(
          "div", { className: "mt-10 p-6 rounded-[18px] bg-white/5 border border-white/10" },
          h("label", { className: "block text-sm font-medium mb-2" }, REFUND_POLICY.whatsapp.referenceLabel || "Booking Reference Number"),
          h("input", {
            type: "text",
            value: refundRefCode,
            onChange: function (e) { setRefundRefCode(e.target.value); if (refundRefError) setRefundRefError(""); },
            placeholder: REFUND_POLICY.whatsapp.referencePlaceholder || "e.g. 0001",
            className: "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm placeholder-white/30 focus:outline-none focus:border-emerald-400/50"
          }),
          REFUND_POLICY.whatsapp.referenceHelperNote && h("p", { className: "mt-2 text-[12px] text-white/50 leading-relaxed" }, REFUND_POLICY.whatsapp.referenceHelperNote),
          refundRefError && h("p", { className: "mt-2 text-[12px] text-amber-300" }, refundRefError),
          h(
            "button", { onClick: openRefundWhatsapp, className: "kc-whatsapp-btn mt-4" },
            h(Phone, { size: 18 }),
            REFUND_POLICY.whatsapp.buttonLabel || "Chat With Us"
          )
        ),
        h("button", { onClick: function () { setPage(1); window.scrollTo(0, 0); }, className: "mt-4 w-full bg-white/5 border border-white/10 py-3 rounded-full font-semibold" }, t("backToHome", "Back to Home"))
      )
    );

    // ---- Bottom nav -------------------------------------------------
    // Pages 2 and 3 each have their own dedicated call-to-action button
    // (package cards, and the booking form's "Next" submit button), so the
    // generic bottom-nav "Next" only needs to handle page 1.
    var bottomNav = page !== 7 && h(
      "div", { className: "fixed bottom-0 inset-x-0 z-30 p-3 md:p-4 pointer-events-none" },
      h(
        GlassCard, { className: "max-w-[1280px] mx-auto px-4 py-3 flex justify-between items-center pointer-events-auto" },
        h("button", {
          onClick: function () {
            if (page === 1) { window.location.href = "../index.html"; return; }
            setPage(Math.max(1, page - 1));
          },
          className: "px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm flex items-center gap-2"
        }, h(ArrowLeft, { size: 16 }), t("back", " Back")),
        page === 1 && h("button", {
          onClick: function () { setPage(2); },
          className: "px-6 py-2 rounded-full bg-[#2E8B57] hover:bg-[#257a4b] text-sm font-medium flex items-center gap-2"
        }, t("next", "Next "), h(ArrowRight, { size: 16 })),
        page !== 1 && h("div", { className: "w-[92px]" })
      )
    );

    // ---- Gallery lightbox (tap a gallery photo to expand it to full
    // size with a smooth scale/fade transition; tap again to shrink it
    // back down). Stays mounted at all times so the CSS transition can
    // animate both opening and closing instead of popping in/out.
    var lightbox = h(
      "div",
      {
        className: "fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 transition-opacity duration-300 ease-out " + (lightboxImage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"),
        onClick: function () { setLightboxImage(null); },
        "aria-hidden": lightboxImage ? "false" : "true"
      },
      h("div", { className: "absolute inset-0 bg-black/85 backdrop-blur-sm" }),
      h("img", {
        src: lightboxImage || "",
        onClick: function (e) { e.stopPropagation(); setLightboxImage(null); },
        className: "relative max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 ease-out cursor-pointer " + (lightboxImage ? "scale-100 opacity-100" : "scale-75 opacity-0")
      })
    );

    return h(
      "div", { className: "min-h-screen text-white font-[Inter,Poppins,sans-serif] relative selection:bg-emerald-500/30" },
      h(
        "div", { className: "fixed inset-0 -z-10" },
        h("img", { src: CONTENT.backgrounds[0], className: "w-full h-full object-cover" }),
        h("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-[1px]" }),
        h("div", { className: "absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" })
      ),
      page === 1 && isOn(CONTENT.hero && CONTENT.hero.enabled, true) && h(VideoHero, {
        hero: CONTENT.hero,
        logo: CONTENT.logoImage,
        phone: FOOTER.phone,
        navItems: navItems,
        menuOpen: mobileMenuOpen,
        onToggleMenu: function () { setMobileMenuOpen(!mobileMenuOpen); },
        onNavClick: onHeroNavClick,
        onBookNow: function () { setPage(2); },
        onDiscover: function () { scrollToId("kc-content-start"); }
      }),
      page === 1 && showNotice && h(NoticePopup, {
        notice: CONTENT.notice,
        logo: CONTENT.logoImage,
        onClose: closeNotice
      }),
      header, page1, page2, page3, page4, page5, page6, page7, bottomNav, lightbox,
      h("style", null, "\n        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap');\n        *{font-family:Inter, Poppins, sans-serif}\n        ::-webkit-scrollbar{width:6px;height:6px}\n        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:99px}\n      ")
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
})();
