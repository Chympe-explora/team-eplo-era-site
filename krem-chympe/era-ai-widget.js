/**
 * era-ai-widget.js — the visitor-facing live chat box.
 *
 * This is a direct chat line to a real person on the team, NOT an
 * automatic chatbot: whatever the visitor types is forwarded straight to
 * the admin's Telegram, and whatever the admin types back in Telegram
 * (or a "🤖 AI" conversation explicitly switched on from Telegram) shows
 * up here. Nothing replies on its own unless the admin has turned the
 * optional AI assistant on for that specific conversation.
 *
 * FIXES APPLIED (kept from the previous version):
 * 1. SessionID now persists in localStorage across page reloads
 *    → Solves: Chat reset when visitor closes/reopens widget
 * 2. Polling frequency increases to 800ms for 30 seconds after sending
 *    → Solves: Slow admin reply delivery (KV eventual consistency)
 *
 * Drop this on any site (after booking-bridge.js, before app.js closes —
 * see index.html). Renders a small floating chat bubble and talks to the
 * same Cloudflare Worker as booking-bridge.js. No React, no build step —
 * plain DOM, matches the site's dark glassmorphism look.
 */
(function () {
  const API_BASE = "https://chympe-booking-backend.senlysuchiang87.workers.dev";
  const SITE_ID = window.KC_SITE_ID || "root";
  
  // ===== FIX #1: Persistent Session ID =====
  function getOrCreateSessionId() {
    // 1. Try KCBridge first (if site provides it)
    if (window.KCBridge && window.KCBridge.sessionId) {
      const kbSessionId = window.KCBridge.sessionId;
      // Store it in localStorage in case KCBridge stops being available later
      try {
        localStorage.setItem("era_ai_session_id", kbSessionId);
      } catch (e) {
        // localStorage might be disabled (Firefox private mode, etc)
      }
      return kbSessionId;
    }
    
    // 2. Check localStorage for previously stored ID
    try {
      const stored = localStorage.getItem("era_ai_session_id");
      if (stored && stored.length > 4) {
        return stored;
      }
    } catch (e) {
      // localStorage disabled, fall back to memory
    }
    
    // 3. Generate new ID and try to persist it
    const newId = Math.random().toString(36).slice(2, 10);
    try {
      localStorage.setItem("era_ai_session_id", newId);
      localStorage.setItem("era_ai_created_at", Date.now().toString());
    } catch (e) {
      // localStorage disabled — session will only last this page load
    }
    return newId;
  }
  
  const sessionId = getOrCreateSessionId();

  const GREETING = "Hi 👋 Send us a message here and a real person on our team will reply to you right in this chat.";

  // =====================================================================
  // 🧭 NAV HELP — "where do I find X on this site" questions, answered
  // instantly and entirely client-side (no network round-trip, never
  // forwarded to Telegram). Two ways in:
  //   1. Tap one of the ready-made questions shown when the chat opens
  //      (or via the "🧭 Where can I find...?" toggle).
  //   2. Type a navigation question normally — matchNavHelp() below
  //      checks it against this list first, before falling back to the
  //      normal human/AI chat flow, so typing "where's the gallery" gets
  //      the same instant answer as tapping it would.
  // Every answer names the exact section/page and offers a one-tap
  // "📍 Take me there" button. Add more entries here any time — no admin
  // bot round-trip needed since this is just page navigation, not
  // content that changes.
  // =====================================================================
  const NAV_HELP = {
    root: [
      { q: "Where do I see your destinations?", kw: "destination destinations trips places locations see view krem chympe wilderness expedition", a: "That's the <b>Destinations</b> section on this page — Krem Chympe Falls & Caves and Wilderness Expedition are both listed there. Tap \u201cExplore Destination\u201d on either card to open that trip's own site.", href: "#destinations" },
      { q: "Where do I actually book a trip?", kw: "book booking reserve reservation how do i book", a: "Booking happens on each destination's own site. In the <b>Destinations</b> section, tap \u201cExplore Destination\u201d on Krem Chympe or Wilderness Expedition, then pick a package there.", href: "#destinations" },
      { q: "Where can I read about what a trip includes?", kw: "experience included what happens itinerary details activities", a: "That's the <b>The Experience</b> section on this page.", href: "#experiences" },
      { q: "Why should I book with you?", kw: "why book us trust safe safety reasons choose", a: "See the <b>Why Book Us</b> section on this page — safety, local guides, what makes us different.", href: "#booking" },
      { q: "Where can I learn about your company?", kw: "about us who are you company team story", a: "That's the <b>About Us</b> section further down this page.", href: "#about" },
      { q: "How do I contact you?", kw: "contact phone number email whatsapp reach call", a: "Scroll to the very bottom of this page — the footer has our phone, email and social links.", href: "#footer" },
      { q: "Where's your refund policy?", kw: "refund policy cancel cancellation", a: "Tap <b>Refund Policy</b> in the footer at the bottom of this page.", href: "#footer" }
    ],
    "krem-chympe": [
      { q: "Where do I see packages and prices?", kw: "package packages price prices pricing cost how much", a: "That's the <b>Packages</b> page — I can take you straight there.", href: "index.html?page=2#kc-packages" },
      { q: "Where's the photo gallery?", kw: "photo photos gallery pictures images", a: "That's the <b>Gallery</b> section on the Home page.", href: "index.html?page=1#kc-gallery" },
      { q: "Where can I read the full story about Krem Chympe?", kw: "story about explore what is krem chympe waterfall cave", a: "That's the <b>Explore</b> section on the Home page.", href: "index.html?page=1#kc-explore" },
      { q: "How do I contact you / get your phone number?", kw: "contact phone number whatsapp email reach call", a: "That's the <b>Contact</b> section at the bottom of the Home page.", href: "index.html?page=1#kc-contact" },
      { q: "Where do I book the Shared Package?", kw: "shared package book booking group tour", a: "Go to the <b>Packages</b> page and tap \u201cBook Now\u201d on the Shared Package card.", href: "index.html?page=2#kc-packages" },
      { q: "Where do I book the Private Package?", kw: "private package book booking custom camping jeep", a: "Go to the <b>Packages</b> page and tap \u201cBook Now\u201d on the Private Package card.", href: "index.html?page=2#kc-packages" },
      { q: "Where's the refund policy?", kw: "refund policy cancel cancellation", a: "Tap <b>Refund Policy</b> in the footer on the Home page.", href: "index.html?page=1#kc-contact" },
      { q: "Where's the Wilderness Expedition site?", kw: "wilderness expedition other site trek", a: "That's a separate destination site — go to the main hub page and tap \u201cExplore Destination\u201d on Wilderness Expedition.", href: "../index.html#destinations" }
    ],
    "wilderness-expedition": [
      { q: "Where do I see packages and prices?", kw: "package packages price prices pricing cost how much expedition", a: "That's the <b>Packages</b> page — I can take you straight there.", href: "index.html?page=2#kc-packages" },
      { q: "Where's the photo gallery?", kw: "photo photos gallery pictures images", a: "That's the <b>Gallery</b> section on the Home page.", href: "index.html?page=1#kc-gallery" },
      { q: "Where can I read the full story about the expedition?", kw: "story about explore what is wilderness expedition trek route", a: "That's the <b>Explore</b> section on the Home page.", href: "index.html?page=1#kc-explore" },
      { q: "How do I contact you / get your phone number?", kw: "contact phone number whatsapp email reach call", a: "That's the <b>Contact</b> section at the bottom of the Home page.", href: "index.html?page=1#kc-contact" },
      { q: "Where do I book the Expedition Package?", kw: "book booking expedition package", a: "Go to the <b>Packages</b> page and tap \u201cBook Now\u201d on the Expedition Package card.", href: "index.html?page=2#kc-packages" },
      { q: "Where's the refund policy?", kw: "refund policy cancel cancellation", a: "Tap <b>Refund Policy</b> in the footer on the Home page.", href: "index.html?page=1#kc-contact" },
      { q: "Where's the Krem Chympe site?", kw: "krem chympe other site cave waterfall", a: "That's a separate destination — go to the main hub page and tap \u201cExplore Destination\u201d on Krem Chympe.", href: "../index.html#destinations" }
    ]
  };

  function navTokenize(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  }

  // Matches typed free text against the current site's NAV_HELP list by
  // simple keyword overlap (same approach as the backend KB, kept tiny
  // and local on purpose — this never needs to learn or grow, it's just
  // page navigation). Returns the best entry, or null if nothing clears
  // the confidence bar.
  function matchNavHelp(text) {
    const list = NAV_HELP[SITE_ID] || [];
    const queryTokens = navTokenize(text);
    if (!queryTokens.length) return null;
    let best = null, bestScore = 0;
    for (const entry of list) {
      const bag = new Set(navTokenize(entry.q + " " + (entry.kw || "")));
      const matched = queryTokens.filter((t) => bag.has(t));
      const score = matched.length / queryTokens.length;
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    return bestScore >= 0.5 ? best : null;
  }

  const style = document.createElement("style");
  style.textContent = `
    #era-ai-bubble{position:fixed;right:16px;bottom:88px;z-index:45;width:56px;height:56px;border-radius:9999px;
      background:#2E8B57;border:1px solid rgba(255,255,255,0.2);box-shadow:0 8px 24px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .2s ease,background .2s ease;
      font:600 22px/1 "Inter",sans-serif;color:#fff;}
    #era-ai-bubble:hover{transform:scale(1.06);background:#257a4b;}
    #era-ai-panel{position:fixed;right:16px;bottom:154px;z-index:45;width:min(340px,calc(100vw - 32px));
      max-height:min(480px,calc(100vh - 220px));display:flex;flex-direction:column;overflow:hidden;
      border-radius:20px;border:1px solid rgba(255,255,255,0.14);background:rgba(20,22,20,0.82);
      backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 20px 50px rgba(0,0,0,0.5);
      opacity:0;transform:translateY(12px) scale(.97);pointer-events:none;
      transition:opacity .25s ease, transform .25s ease;font:400 13px/1.5 "Inter",sans-serif;color:#fff;}
    #era-ai-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}
    #era-ai-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;
      border-bottom:1px solid rgba(255,255,255,0.1);}
    #era-ai-head .title{font-weight:700;font-size:14px;display:flex;align-items:center;gap:6px;}
    #era-ai-close{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);color:#fff;
      width:26px;height:26px;border-radius:9999px;cursor:pointer;font-size:14px;line-height:1;}
    #era-ai-body{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px;}
    .era-msg{max-width:85%;padding:8px 12px;border-radius:14px;font-size:12.5px;white-space:pre-wrap;word-break:break-word;}
    .era-msg.bot{align-self:flex-start;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.08);}
    .era-msg.user{align-self:flex-end;background:#2E8B57;color:#fff;}
    .era-msg.typing{align-self:flex-start;background:rgba(255,255,255,0.08);display:flex;gap:4px;padding:11px 14px;}
    .era-msg.typing .era-dot{width:6px;height:6px;border-radius:9999px;background:rgba(255,255,255,0.55);
      animation:era-typing-bounce 1.2s infinite ease-in-out;}
    .era-msg.typing .era-dot:nth-child(2){animation-delay:.15s;}
    .era-msg.typing .era-dot:nth-child(3){animation-delay:.3s;}
    @keyframes era-typing-bounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}
    #era-nav-bar{padding:8px 12px;border-top:1px solid rgba(255,255,255,0.1);flex-shrink:0;}
    #era-nav-toggle{width:100%;background:rgba(46,139,87,0.16);border:1px solid rgba(46,139,87,0.4);
      color:#a8ffcf;font:600 12px/1 "Inter",sans-serif;padding:9px 12px;border-radius:9999px;cursor:pointer;
      transition:background .15s ease;}
    #era-nav-toggle:hover{background:rgba(46,139,87,0.28);}
    .era-nav-chips{display:flex;flex-direction:column;gap:6px;align-self:stretch;
      background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:8px;}
    .era-nav-chip{text-align:left;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
      color:#fff;font:500 12px/1.4 "Inter",sans-serif;padding:8px 10px;border-radius:10px;cursor:pointer;
      transition:background .15s ease;}
    .era-nav-chip:hover{background:rgba(255,255,255,0.14);}
    .era-goto-btn{margin-top:8px;background:#2E8B57;border:none;color:#fff;font:600 11.5px/1 "Inter",sans-serif;
      padding:8px 12px;border-radius:9999px;cursor:pointer;}
    .era-goto-btn:hover{background:#257a4b;}
    #era-ai-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,0.1);}
    #era-ai-input{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);
      border-radius:9999px;padding:8px 14px;color:#fff;font-size:12.5px;outline:none;}
    #era-ai-input::placeholder{color:rgba(255,255,255,0.4);}
    #era-ai-send{background:#2E8B57;border:none;color:#fff;width:34px;height:34px;border-radius:9999px;
      cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;}
    #era-ai-send:disabled{opacity:.5;cursor:default;}
  `;
  document.head.appendChild(style);

  const bubble = document.createElement("div");
  bubble.id = "era-ai-bubble";
  bubble.setAttribute("aria-label", "Chat with our team");
  bubble.textContent = "🌿";

  const panel = document.createElement("div");
  panel.id = "era-ai-panel";
  panel.innerHTML = `
    <div id="era-ai-head">
      <div class="title">🌿 Chat with Us</div>
      <button id="era-ai-close" aria-label="Close chat">✕</button>
    </div>
    <div id="era-ai-body"></div>
    <div id="era-nav-bar">
      <button id="era-nav-toggle" type="button">🧭 Where can I find...?</button>
    </div>
    <form id="era-ai-form">
      <input id="era-ai-input" type="text" autocomplete="off" placeholder="Type a message…" />
      <button id="era-ai-send" type="submit" aria-label="Send">➤</button>
    </form>
  `;

  document.addEventListener("DOMContentLoaded", mount);
  if (document.readyState !== "loading") mount();
  function mount() {
    if (document.getElementById("era-ai-bubble")) return;
    document.body.appendChild(bubble);
    document.body.appendChild(panel);
    wire();
  }

  let opened = false;
  let lastPollTs = 0;
  let pollTimer = null;
  let currentStatus = "ai"; // "ai" | "human" | "paused" | "closed"

  // ===== FIX #2: Aggressive polling after message sent =====
  let lastMessageTime = 0;
  const FAST_POLL_INTERVAL = 800;   // 800ms while waiting for reply
  const SLOW_POLL_INTERVAL = 4000;  // 4s default (original behavior)
  const FAST_POLL_DURATION = 30000; // 30 seconds of fast polling after sending

  function wire() {
    const body = panel.querySelector("#era-ai-body");
    const form = panel.querySelector("#era-ai-form");
    const input = panel.querySelector("#era-ai-input");
    const send = panel.querySelector("#era-ai-send");
    const closeBtn = panel.querySelector("#era-ai-close");
    const navToggle = panel.querySelector("#era-nav-toggle");

    // ===== Live "…is typing" bubble in the admin's Telegram, WhatsApp-
    // style, while the visitor is composing a message (before they hit
    // Send). Throttled to roughly once every 4s while they keep typing —
    // Telegram's own typing bubble already lasts ~5s, so this just keeps
    // re-triggering it without hammering the API on every keystroke.
    let lastTypingPing = 0;
    const TYPING_PING_INTERVAL = 4000;
    function pingTyping() {
      const now = Date.now();
      if (now - lastTypingPing < TYPING_PING_INTERVAL) return;
      lastTypingPing = now;
      fetch(`${API_BASE}/api/era/typing`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site: SITE_ID, sessionId }),
      }).catch(() => {}); // silent — a missed typing bubble should never matter
    }
    input.addEventListener("input", () => {
      if (input.value.trim()) pingTyping();
    });

    function addMessage(text, who) {
      const el = document.createElement("div");
      el.className = "era-msg " + who;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    // Jumps to a nav-help target: a plain "#id" scrolls smoothly if that
    // section already exists on the current page (true on the hub site,
    // and true on a sub-site when the target section is on whichever
    // page is currently showing); anything else (a relative URL, or a
    // "#id" that isn't in the current DOM because it lives on a
    // different numbered page) does a real navigation — the small
    // deep-link effect added to each sub-site's app.js then finishes the
    // job by scrolling to the hash once that page has mounted.
    function goToPlace(href) {
      if (href.charAt(0) === "#") {
        const el = document.getElementById(href.slice(1));
        if (el) {
          const header = document.querySelector("header");
          const headerH = header ? header.getBoundingClientRect().height : 0;
          const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
          window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
          closePanel();
          return;
        }
      }
      window.location.href = href;
    }

    function addNavAnswer(entry) {
      const el = document.createElement("div");
      el.className = "era-msg bot";
      el.innerHTML = entry.a + (entry.href ? '<br><button type="button" class="era-goto-btn">📍 Take me there</button>' : "");
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      if (entry.href) {
        el.querySelector(".era-goto-btn").addEventListener("click", function () { goToPlace(entry.href); });
      }
    }

    function renderNavChips() {
      const wrap = document.createElement("div");
      wrap.className = "era-nav-chips";
      (NAV_HELP[SITE_ID] || []).forEach(function (entry) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "era-nav-chip";
        chip.textContent = entry.q;
        chip.addEventListener("click", function () {
          addMessage(entry.q, "user");
          addNavAnswer(entry);
        });
        wrap.appendChild(chip);
      });
      return wrap;
    }

    let navOpen = false;
    let navBlock = null;
    function showNavChips() {
      if (navBlock) return;
      navBlock = renderNavChips();
      body.appendChild(navBlock);
      body.scrollTop = body.scrollHeight;
      navOpen = true;
      navToggle.textContent = "✕ Hide questions";
    }
    function hideNavChips() {
      if (navBlock) { navBlock.remove(); navBlock = null; }
      navOpen = false;
      navToggle.textContent = "🧭 Where can I find...?";
    }
    navToggle.addEventListener("click", function () {
      if (navOpen) hideNavChips(); else showNavChips();
    });

    // ===== Persistent "waiting for a reply" bubble =====
    // Shows an animated three-dot bubble (the same visual idiom WhatsApp
    // uses) from the moment a message is sent until a real reply arrives
    // via poll — instead of flashing briefly and vanishing before anyone
    // has actually replied. We can't detect the admin's literal typing
    // state (Telegram's Bot API doesn't expose that for a human texting a
    // bot), so this bubble means "delivered, a reply is expected" rather
    // than a live keystroke signal — but it stays up for as long as that's
    // true, which is what actually reads as "live" to a visitor.
    let waitingEl = null;
    let waitingForReply = false;
    function showWaitingBubble() {
      if (waitingEl) return;
      waitingForReply = true;
      waitingEl = document.createElement("div");
      waitingEl.className = "era-msg typing";
      waitingEl.innerHTML = '<span class="era-dot"></span><span class="era-dot"></span><span class="era-dot"></span>';
      body.appendChild(waitingEl);
      body.scrollTop = body.scrollHeight;
      updatePollFrequency();
    }
    function hideWaitingBubble() {
      waitingForReply = false;
      if (waitingEl) { waitingEl.remove(); waitingEl = null; }
    }

    function noteStatusChange(nextStatus) {
      if (nextStatus === currentStatus) return;
      if (nextStatus === "human" || nextStatus === "paused") {
        addMessage("Thanks — that's been sent to our team. They'll reply to you right here.", "bot");
      } else if (nextStatus === "ai" && (currentStatus === "human" || currentStatus === "paused")) {
        hideWaitingBubble(); // the AI won't retroactively answer an already-sent message
        addMessage("Our assistant will help you from here — feel free to keep asking.", "bot");
      }
      currentStatus = nextStatus;
    }

    // ===== IMPROVED POLLING LOGIC =====
    // Stays on the fast interval for as long as a reply is genuinely
    // pending (waitingForReply), not just for a fixed 30s window — so a
    // reply typed a minute later still arrives at the fast cadence.
    function getDesiredPollInterval() {
      if (waitingForReply) return FAST_POLL_INTERVAL;
      const timeSinceMessage = Date.now() - lastMessageTime;
      return timeSinceMessage < FAST_POLL_DURATION
        ? FAST_POLL_INTERVAL
        : SLOW_POLL_INTERVAL;
    }

    function updatePollFrequency() {
      // If we need to change polling frequency, reset the timer
      const currentInterval = pollTimer ? (pollTimer._interval || SLOW_POLL_INTERVAL) : SLOW_POLL_INTERVAL;
      const desiredInterval = getDesiredPollInterval();
      
      if (currentInterval !== desiredInterval) {
        if (pollTimer) clearInterval(pollTimer);
        pollTimer = setInterval(poll, desiredInterval);
        pollTimer._interval = desiredInterval;
      }
    }

    function startPolling() {
      if (pollTimer) return;
      const interval = getDesiredPollInterval();
      pollTimer = setInterval(() => {
        updatePollFrequency(); // Check if frequency should change
        poll();
      }, interval);
      pollTimer._interval = interval;
      poll(); // Immediate first poll
    }

    function stopPolling() {
      if (!pollTimer) return;
      clearInterval(pollTimer);
      pollTimer = null;
    }

    function poll() {
      fetch(`${API_BASE}/api/era/poll?site=${encodeURIComponent(SITE_ID)}&sessionId=${encodeURIComponent(sessionId)}&since=${lastPollTs}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data || !data.ok) return;
          if (Array.isArray(data.messages) && data.messages.length) {
            hideWaitingBubble();
            for (const m of data.messages) {
              addMessage(m.text, "bot");
              if (m.ts > lastPollTs) lastPollTs = m.ts;
            }
            updatePollFrequency(); // drop back off the fast interval now that the reply landed
          }
          if (data.status) noteStatusChange(data.status);
        })
        .catch(() => {}); // silent — this is a background refresh
    }

    function openPanel() {
      panel.classList.add("open");
      opened = true;
      if (!body.childElementCount) {
        addMessage(GREETING, "bot");
        showNavChips(); // surface the navigation FAQ right away, nothing to tap first
      }
      setTimeout(() => input.focus(), 150);
      startPolling();
    }

    function closePanel() {
      panel.classList.remove("open");
      stopPolling();
    }

    bubble.addEventListener("click", () => {
      if (panel.classList.contains("open")) closePanel();
      else openPanel();
    });
    closeBtn.addEventListener("click", closePanel);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, "user");
      input.value = "";

      // Typed navigation questions ("where's the gallery", "how do I
      // book") get the same instant local answer as tapping a chip
      // would — no network call, nothing forwarded to Telegram, since
      // this is just page navigation, not something a human needs to
      // field.
      const navMatch = matchNavHelp(text);
      if (navMatch) {
        addNavAnswer(navMatch);
        return;
      }

      send.disabled = true;
      
      // ===== FIX #2: Track message time and update polling =====
      lastMessageTime = Date.now();
      updatePollFrequency(); // Switch to fast polling immediately
      
      showWaitingBubble();
      const sentAt = Date.now();

      fetch(`${API_BASE}/api/era/message`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site: SITE_ID, sessionId, message: text }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data || data.ok === false) {
            hideWaitingBubble();
            addMessage("Sorry, I couldn't reach the team's system just now — please try again in a moment.", "bot");
            return;
          }
          if (data.reply) {
            // AI answered inline — no human reply pending.
            hideWaitingBubble();
            addMessage(data.reply, "bot");
          }
          // else: no reply yet (human/paused mode) — leave the waiting
          // bubble up; poll() will replace it with the real reply.
          if (sentAt > lastPollTs) lastPollTs = sentAt;
          if (data.status) noteStatusChange(data.status);
        })
        .catch(() => {
          hideWaitingBubble();
          addMessage("I'm having trouble connecting right now — please try again in a moment, or tap Book Now for direct help.", "bot");
        })
        .finally(() => {
          send.disabled = false;
        });
    });
  }
})();
