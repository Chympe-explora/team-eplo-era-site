/* Krem Chympe — Home page only.
   Rebuilt as a single-page site: Home (introduction), Destinations
   (Krem Chympe Waterfall & Cave, Wilderness Expedition), Experiences,
   Booking (empty — fill in later), About Us (empty — fill in later).
   All content/photos live in config.js — this file is the engine room.
*/
(function () {
  "use strict";
  var h = React.createElement;
  var useState = React.useState;

  var CONTENT = window.KC_CONTENT || {};

  // Telegram admin edits are saved as plain text, so a boolean toggle
  // can come back as the string "false" (which is truthy in JS) — this
  // treats "false"/false as off and everything else as on, so on/off
  // switches edited from the bot actually work.
  function isOn(v, defaultOn) {
    if (v === false || v === "false") return false;
    if (v === true || v === "true") return true;
    return defaultOn;
  }

  // ---------------------------------------------------------------------
  // Icons (lucide-style inline SVGs)
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

  var Menu = makeIcon([["line", { x1: 4, x2: 20, y1: 12, y2: 12 }], ["line", { x1: 4, x2: 20, y1: 6, y2: 6 }], ["line", { x1: 4, x2: 20, y1: 18, y2: 18 }]]);
  var X = makeIcon([["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]]);
  var ArrowRight = makeIcon([["path", { d: "M5 12h14" }], ["path", { d: "m12 5 7 7-7 7" }]]);
  var Mountain = makeIcon([["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }]]);
  var Phone = makeIcon([["path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }]]);
  var Mail = makeIcon([["rect", { width: 20, height: 16, x: 2, y: 4, rx: 2 }], ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }]]);
  var InstagramIcon = makeIcon([["rect", { width: 20, height: 20, x: 2, y: 2, rx: 5 }], ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }], ["line", { x1: 17.5, x2: 17.51, y1: 6.5, y2: 6.5 }]]);
  var Star = makeIcon([["path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" }]]);
  var Shield = makeIcon([["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }]]);
  var Award = makeIcon([
    ["path", { d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" }],
    ["circle", { cx: 12, cy: 8, r: 6 }]
  ]);
  var ChevronDown = makeIcon([["path", { d: "m6 9 6 6 6-6" }]]);

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

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------------------------------------------------------------------
  // VideoHero — full-width video background with logo + Book Now button.
  // Shown at the top of the home page. Falls back to a static image if
  // no video URL is set (or the video fails to load).
  // ---------------------------------------------------------------------
  function VideoHero(props) {
    var hero = props.hero || {};
    var videoUrl = hero.videoUrl || "";
    // A separate on/off switch from "enabled" (which hides the whole
    // hero) — turning this off just removes the <video> tag, so the
    // static fallback image shows through exactly as if a video had
    // never been set at all. Admin-controlled from Telegram.
    var videoOn = isOn(hero.videoEnabled, true);
    var fallbackImage = hero.fallbackImage || "Trek Trail Mist.jpg";
    var logoUrl = props.logo || "logo.png";
    var phone = (props.phone || "").trim();
    var telHref = phone ? "tel:" + phone.replace(/[^\d+]/g, "") : "";
    var navItems = props.navItems || [];

    return h(
      "div",
      {
        className: "relative w-full h-screen bg-cover bg-center overflow-hidden flex flex-col",
        style: {
          backgroundImage: "url('" + fallbackImage + "')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover"
        }
      },

      // Video element (overlaid on background; if it fails — or if the
      // admin has switched it off — the background image set above
      // shows through instead, indistinguishable from no video ever
      // being set)
      videoOn && videoUrl && h(
        "video",
        {
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          className: "absolute inset-0 w-full h-full object-cover",
          style: { opacity: 0.85 },
          onError: function () { console.warn("Hero video failed to load, using fallback image"); }
        },
        h("source", { src: videoUrl, type: "video/mp4" })
      ),

      // Dark overlay for text readability
      h("div", { className: "absolute inset-0 bg-black/30 z-[1]" }),

      // Content: top bar (logo left, call + menu right), quote + Book
      // Now in the middle, Discover pinned to the bottom
      h(
        "div",
        { className: "relative z-10 flex flex-col h-full p-5 md:p-8 lg:p-10" },

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
          navItems.map(function (item) {
            return h("button", {
              key: item.id,
              onClick: function () { props.onGoTo(item.id); },
              className: "w-full text-left px-4 py-3 rounded-xl text-white bg-white/5 hover:bg-white/15 transition"
            }, item.label);
          }),
          h("button", { onClick: props.onBookNow, className: "w-full bg-[#2E8B57] hover:bg-[#257a4b] text-white py-3 rounded-full font-medium mt-1 transition" }, "Book Now")
        ),

        // ---- quote + Book Now ----
        h(
          "div", { className: "flex-grow flex flex-col items-center justify-center gap-6 md:gap-8 px-4 text-center" },
          hero.quote && h(
            "p",
            { className: "italic font-semibold text-white text-[26px] leading-[1.15] md:text-5xl lg:text-6xl max-w-[260px] md:max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]" },
            hero.quote
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

        // ---- Discover, bottom of hero — scrolls to destinations ----
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
  // NoticePopup — one-time modal for new visitors (main home page only).
  // Close state is stored in localStorage so it only shows once per
  // browser; admin can broadcast a fresh notice via the "showAgain"
  // flag from Telegram, which the caller compares against.
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

  var FOOTER = CONTENT.footer || { brandName: "", locationLine: "", contactTitle: "Contact Us", phone: "", email: "", followTitle: "Follow Us On", importantLinkTitle: "Important Link", refundPolicyLabel: "Refund Policy", copyright: "" };
  var REFUND_POLICY = CONTENT.refundPolicy || { title: "Refund Policy", intro: "", sections: [], promiseTitle: "", promiseText: [] };

  function toLines(v) {
    if (Array.isArray(v)) return v;
    if (typeof v === "string" && v) return [v];
    return [];
  }

  function App() {
    var menuState = useState(false); var mobileMenuOpen = menuState[0], setMobileMenuOpen = menuState[1];
    var pageState = useState("home"); var page = pageState[0], setPage = pageState[1];

    // ---- Notice popup: shows once per visitor, closable, admin-resettable ----
    var NOTICE = CONTENT.notice || {};
    var noticeState = useState(function () {
      if (typeof localStorage === "undefined") return true;
      var closedVersion = localStorage.getItem("era_notice_closed");
      // If the admin bumps notice.showAgain, a stale closedVersion no
      // longer matches, so the notice shows again for everyone.
      return closedVersion !== String(NOTICE.showAgain || "");
    });
    var showNotice = noticeState[0], setShowNotice = noticeState[1];

    function closeNotice() {
      setShowNotice(false);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("era_notice_closed", String(NOTICE.showAgain || ""));
      }
    }

    function goToRefundPolicy() {
      setMobileMenuOpen(false);
      setPage("refund-policy");
      window.scrollTo(0, 0);
    }

    function goHome() {
      setPage("home");
      window.scrollTo(0, 0);
    }

    var navItems = (CONTENT.nav && CONTENT.nav.items) || [
      { label: "Home", id: "home" },
      { label: "Destinations", id: "destinations" },
      { label: "Experiences", id: "experiences" },
      { label: "Booking", id: "booking" },
      { label: "About Us", id: "about" }
    ];

    function goTo(id) {
      setMobileMenuOpen(false);
      if (page !== "home") {
        setPage("home");
        setTimeout(function () { scrollToId(id); }, 0);
      } else {
        scrollToId(id);
      }
    }

    // ---- Header ----------------------------------------------------
    var header = h(
      "header", { className: "sticky top-0 z-40 p-3 md:p-4" },
      h(
        GlassCard, { className: "max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between" },
        h(
          "div", { className: "flex items-center gap-3 cursor-pointer", onClick: function () { goTo("home"); } },
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
          navItems.map(function (item) {
            return h("button", {
              key: item.id,
              onClick: function () { goTo(item.id); },
              className: "px-4 py-1.5 rounded-full text-[13px] transition text-white/80 hover:text-white hover:bg-white/10"
            }, item.label);
          })
        ),
        h(
          "div", { className: "flex items-center gap-2" },
          h("button", { onClick: function () { goTo("booking"); }, className: "hidden md:block bg-[#2E8B57] hover:bg-[#257a4b] px-5 py-2 rounded-full text-sm font-medium transition" }, "Book Now"),
          h("button", { onClick: function () { setMobileMenuOpen(!mobileMenuOpen); }, className: "md:hidden w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center" }, mobileMenuOpen ? h(X, { size: 18 }) : h(Menu, { size: 18 }))
        )
      ),
      mobileMenuOpen && h(
        GlassCard, { className: "md:hidden mt-3 p-4 max-w-[1280px] mx-auto space-y-2" },
        navItems.map(function (item) {
          return h("button", {
            key: item.id,
            onClick: function () { goTo(item.id); },
            className: "w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10"
          }, item.label);
        }),
        h("button", { onClick: function () { goTo("booking"); }, className: "w-full bg-[#2E8B57] py-3 rounded-full font-medium" }, "Book Now")
      )
    );

    // ---- Home / introduction ----------------------------------------
    var HERO = CONTENT.hero || { badge: "", title: "", sub: "" };
    var home = h(
      "section", { id: "home", className: "scroll-mt-24" },
      h(
        GlassCard, { className: "p-8 md:p-12" },
        HERO.badge && h("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] tracking-widest" }, HERO.badge),
        h("h1", { className: "mt-6 text-[32px] md:text-[56px] font-bold leading-[0.95] tracking-tight max-w-[720px]" }, HERO.title),
        h("p", { className: "mt-5 text-white/70 text-[15px] leading-relaxed max-w-[600px]" }, HERO.sub),
        h(
          "div", { className: "mt-8 flex flex-wrap gap-3" },
          h("button", { onClick: function () { goTo("destinations"); }, className: "bg-[#2E8B57] hover:bg-[#257a4b] px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2" }, "Explore Destinations ", h(ArrowRight, { size: 16 }))
        )
      )
    );

    // ---- Visitors Rating (shown above Destinations) --------------------
    var RATING = CONTENT.visitorsRating || {};
    var visitorsRating = h(
      "section", { className: "scroll-mt-24" },
      h(
        GlassCard, { className: "px-6 py-4 flex flex-wrap items-center justify-between gap-4" },
        h(
          "div", { className: "flex items-center gap-3" },
          h("div", { className: "flex -space-x-2" }, [0, 1, 2, 3].map(function (p) { return h("img", { key: p, src: "https://i.pravatar.cc/100?img=" + (10 + p), className: "w-8 h-8 rounded-full border-2 border-black/30" }); })),
          h("div", { className: "text-[13px]" }, h("span", { className: "font-semibold" }, RATING.trustedText), " ", h("span", { className: "text-white/60" }, RATING.travelersText))
        ),
        h(
          "div", { className: "flex flex-wrap gap-6 text-[13px]" },
          RATING.googleRatingText && h("span", { className: "flex items-center gap-2" }, h(Star, { size: 14, className: "text-amber-400" }), " " + RATING.googleRatingText),
          RATING.safetyCertifiedText && h("span", { className: "flex items-center gap-2" }, h(Shield, { size: 14, className: "text-emerald-400" }), " " + RATING.safetyCertifiedText),
          RATING.ecoTourismText && h("span", { className: "flex items-center gap-2" }, h(Award, { size: 14 }), " " + RATING.ecoTourismText)
        )
      )
    );

    // ---- Destinations -------------------------------------------------
    var DEST = CONTENT.destinations || { title: "Destinations", subtitle: "", items: [] };
    var destinations = h(
      "section", { id: "destinations", className: "scroll-mt-24" },
      h(
        "div", { className: "mb-4 md:mb-6" },
        h("h2", { className: "text-2xl md:text-3xl font-bold tracking-tight" }, DEST.title),
        DEST.subtitle && h("p", { className: "mt-1 text-white/60 text-sm" }, DEST.subtitle)
      ),
      h(
        "div", { className: "grid md:grid-cols-2 gap-6" },
        (DEST.items || []).map(function (d) {
          return h(
            GlassCard, { key: d.id, id: "dest-" + d.id, className: "overflow-hidden flex flex-col" },
            d.image && h("img", { src: d.image, className: "w-full h-[220px] object-cover" }),
            h(
              "div", { className: "p-6 flex flex-col flex-1" },
              h("h3", { className: "text-lg font-semibold" }, d.name),
              h("p", { className: "mt-3 text-white/70 text-sm leading-relaxed flex-1" }, d.description),
              h("button", { onClick: function () { if (d.link) { window.location.href = d.link; } else { goTo("booking"); } }, className: "mt-6 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full text-sm font-semibold" }, d.buttonLabel || "Book Now")
            )
          );
        })
      )
    );

    // ---- Experiences — full narrative section ---------------------------
    var EXP = CONTENT.experiences || { title: "The Experience", blocks: [] };
    function renderBlock(block, i) {
      if (block.type === "heading") {
        return h("h3", { key: i, className: "text-lg md:text-xl font-semibold text-white pt-2" }, block.text);
      }
      if (block.type === "subheading") {
        return h("div", { key: i, className: "text-white/80 text-[15px] font-medium italic" }, block.text);
      }
      if (block.type === "paragraph") {
        return h("p", { key: i, className: "text-[14px] text-white/70 leading-relaxed" }, block.text);
      }
      if (block.type === "list") {
        return h(
          "ul", { key: i, className: "space-y-3 pl-1" },
          (block.items || []).map(function (item, j) {
            return h("li", { key: j, className: "flex gap-2.5 text-[14px] text-white/70 leading-relaxed" }, h("span", { className: "text-emerald-400 font-bold flex-shrink-0" }, "•"), h("span", null, item));
          })
        );
      }
      if (block.type === "quote") {
        return h(
          "blockquote", { key: i, className: "border-l-2 border-emerald-400/50 pl-4 py-1 italic text-white/85 text-[15px] leading-relaxed" },
          "\u201C" + block.text + "\u201D",
          block.attribution && h("div", { className: "mt-2 text-[12px] not-italic text-white/50 tracking-wide" }, block.attribution)
        );
      }
      if (block.type === "divider") {
        return h("div", { key: i, className: "border-t border-white/10 my-2" });
      }
      return null;
    }
    var experiences = h(
      "section", { id: "experiences", className: "scroll-mt-24" },
      h(
        GlassCard, { className: "p-6 md:p-10" },
        h("h2", { className: "text-2xl md:text-3xl font-bold tracking-tight text-center" }, EXP.title),
        h(
          "div", { className: "mt-8 max-w-[720px] mx-auto space-y-5" },
          (EXP.blocks || []).map(renderBlock)
        )
      )
    );

    // ---- Booking / "Why Book Us" ---------------------------------------
    var BOOKING = CONTENT.booking || { title: "WHY BOOK US?", subtitle: "", intro: "", reasons: [], closing: [] };
    var booking = h(
      "section", { id: "booking", className: "scroll-mt-24" },
      h(
        GlassCard, { className: "p-8 md:p-12" },
        h("h2", { className: "text-2xl md:text-3xl font-bold tracking-tight text-center" }, BOOKING.title),
        BOOKING.subtitle && h("p", { className: "mt-2 text-white/80 text-base font-medium text-center" }, BOOKING.subtitle),
        BOOKING.intro && h("p", { className: "mt-4 text-white/60 text-sm leading-relaxed text-center max-w-[640px] mx-auto" }, BOOKING.intro),
        h(
          "div", { className: "mt-10 space-y-6 max-w-[720px] mx-auto" },
          (BOOKING.reasons || []).map(function (r, i) {
            return h(
              "div", { key: i, className: "pt-6 border-t border-white/10 first:pt-0 first:border-t-0" },
              h(
                "div", { className: "flex items-center gap-3" },
                r.emoji && h("span", { className: "text-2xl" }, r.emoji),
                h("h3", { className: "font-semibold text-[15px]" }, r.title)
              ),
              r.description && h("p", { className: "mt-3 text-[13px] text-white/70 leading-relaxed" }, r.description)
            );
          })
        ),
        BOOKING.closing && BOOKING.closing.length > 0 && h(
          "div", { className: "mt-10 pt-8 border-t border-white/10 max-w-[640px] mx-auto text-center" },
          BOOKING.closing.map(function (line, i) {
            return h("p", { key: i, className: "text-white/70 text-sm leading-relaxed mt-2" }, line);
          })
        )
      )
    );

    // ---- About Us -------------------------------------------------------
    var ABOUT = CONTENT.about || { title: "About Us", blocks: [] };
    var about = h(
      "section", { id: "about", className: "scroll-mt-24" },
      h(
        GlassCard, { className: "p-8 md:p-12" },
        h("h2", { className: "text-2xl md:text-3xl font-bold tracking-tight text-center" }, ABOUT.title),
        h(
          "div", { className: "mt-8 max-w-[720px] mx-auto space-y-5" },
          (ABOUT.blocks || []).map(function (block, i) {
            if (block.type === "heading") {
              return h("h3", { key: i, className: "text-lg md:text-xl font-semibold text-white pt-2" }, block.text);
            }
            if (block.type === "paragraph") {
              return h("p", { key: i, className: "text-[14px] text-white/70 leading-relaxed" }, block.text);
            }
            if (block.type === "list") {
              return h(
                "ul", { key: i, className: "space-y-3 pl-1" },
                (block.items || []).map(function (item, j) {
                  return h("li", { key: j, className: "flex gap-2.5 text-[14px] text-white/70 leading-relaxed" }, h("span", null, item));
                })
              );
            }
            if (block.type === "divider") {
              return h("div", { key: i, className: "border-t border-white/10 my-2" });
            }
            return null;
          })
        )
      )
    );

    // ---- Footer -------------------------------------------------------
    var footer = h(
      "footer", { className: "pt-6" },
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
            h("a", { href: CONTENT.instagram, target: "_blank", rel: "noopener noreferrer", className: "inline-flex w-9 h-9 rounded-full bg-white/10 border border-white/10 items-center justify-center hover:bg-white/15" }, h(InstagramIcon, { size: 16 }))
          ),
          h(
            "div", null,
            h("div", { className: "font-semibold mb-3" }, FOOTER.importantLinkTitle),
            h("button", { onClick: goToRefundPolicy, className: "text-white/70 hover:text-white underline underline-offset-2" }, FOOTER.refundPolicyLabel)
          )
        ),
        h("div", { className: "mt-10 pt-6 border-t border-white/10 text-center text-[12px] text-white/40" }, FOOTER.copyright)
      )
    );

    // ---- Refund Policy page (only reachable via the footer link) ------
    var refundPolicyPage = h(
      "main", { className: "max-w-[760px] mx-auto px-4 md:px-6 pb-32 pt-6" },
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
        h("button", { onClick: goHome, className: "mt-8 w-full bg-white/5 border border-white/10 py-3 rounded-full font-semibold" }, "Back to Home")
      )
    );

    return h(
      "div", { className: "min-h-screen text-white font-[Inter,Poppins,sans-serif] relative selection:bg-emerald-500/30" },
      h(
        "div", { className: "fixed inset-0 -z-10" },
        h("img", { src: CONTENT.backgroundImage, className: "w-full h-full object-cover" }),
        h("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-[1px]" }),
        h("div", { className: "absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" })
      ),
      page === "home" && isOn(CONTENT.hero && CONTENT.hero.enabled, true) && h(VideoHero, {
        hero: CONTENT.hero,
        logo: CONTENT.logoImage,
        phone: FOOTER.phone,
        navItems: navItems,
        menuOpen: mobileMenuOpen,
        onToggleMenu: function () { setMobileMenuOpen(!mobileMenuOpen); },
        onGoTo: goTo,
        onBookNow: function () { goTo("booking"); },
        onDiscover: function () { goTo((CONTENT.hero && CONTENT.hero.discoverTargetId) || "destinations"); }
      }),
      page === "home" && showNotice && h(NoticePopup, {
        notice: CONTENT.notice,
        logo: CONTENT.logoImage,
        onClose: closeNotice
      }),
      header,
      page === "home"
        ? h("main", { className: "max-w-[1280px] mx-auto px-4 md:px-6 pb-32 space-y-16 pt-6" }, home, visitorsRating, destinations, experiences, booking, about, footer)
        : refundPolicyPage,
      h("style", null, "\n        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap');\n        *{font-family:Inter, Poppins, sans-serif}\n        ::-webkit-scrollbar{width:6px;height:6px}\n        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:99px}\n        .scroll-mt-24{scroll-margin-top:6rem}\n      ")
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
})();
