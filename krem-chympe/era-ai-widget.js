/**
 * era-ai-widget.js
 * Drop this on any site (after booking-bridge.js, before app.js closes —
 * see index.html). Renders a small floating "ERA AI" chat bubble and
 * talks to the same Cloudflare Worker as booking-bridge.js. No React,
 * no build step — plain DOM, matches the site's dark glassmorphism look.
 */
(function () {
  const API_BASE = "https://chympe-booking-backend.senlysuchiang87.workers.dev";
  const SITE_ID = window.KC_SITE_ID || "root";
  const sessionId = (window.KCBridge && window.KCBridge.sessionId) || Math.random().toString(36).slice(2, 10);

  const GREETING = "Hi, I'm ERA AI 🌿 Ask me about packages, pricing, what to bring, or how booking works.";

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
    .era-msg.typing{align-self:flex-start;background:rgba(255,255,255,0.08);opacity:.7;}
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
  bubble.setAttribute("aria-label", "Chat with ERA AI");
  bubble.textContent = "🌿";

  const panel = document.createElement("div");
  panel.id = "era-ai-panel";
  panel.innerHTML = `
    <div id="era-ai-head">
      <div class="title">🌿 ERA AI</div>
      <button id="era-ai-close" aria-label="Close chat">✕</button>
    </div>
    <div id="era-ai-body"></div>
    <form id="era-ai-form">
      <input id="era-ai-input" type="text" autocomplete="off" placeholder="Ask ERA AI something…" />
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
  // Persists across panel open/close within this page load, so
  // re-opening the panel still picks up anything that arrived while it
  // was shut. Resets to 0 on a fresh page load (acceptable — the poll
  // window is short-lived server-side too, see conversations.js).
  let lastPollTs = 0;
  let pollTimer = null;
  let currentStatus = "ai"; // "ai" | "human" | "paused" | "closed" — mirrors the conversation's Telegram-side status

  function wire() {
    const body = panel.querySelector("#era-ai-body");
    const form = panel.querySelector("#era-ai-form");
    const input = panel.querySelector("#era-ai-input");
    const send = panel.querySelector("#era-ai-send");
    const closeBtn = panel.querySelector("#era-ai-close");

    function addMessage(text, who) {
      const el = document.createElement("div");
      el.className = "era-msg " + who;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    // A human took over / paused the chat since the last message —
    // say so once, quietly, instead of leaving the visitor guessing
    // why ERA suddenly stopped answering instantly.
    function noteStatusChange(nextStatus) {
      if (nextStatus === currentStatus) return;
      if (nextStatus === "human" || nextStatus === "paused") {
        addMessage("Connecting you with our team — someone will reply here shortly.", "bot");
      } else if (nextStatus === "ai" && (currentStatus === "human" || currentStatus === "paused")) {
        addMessage("I'm back on this — feel free to keep asking.", "bot");
      }
      currentStatus = nextStatus;
    }

    function startPolling() {
      if (pollTimer) return;
      pollTimer = setInterval(poll, 4000);
      poll();
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
          if (Array.isArray(data.messages)) {
            for (const m of data.messages) {
              addMessage(m.text, "bot");
              if (m.ts > lastPollTs) lastPollTs = m.ts;
            }
          }
          if (data.status) noteStatusChange(data.status);
        })
        .catch(() => {}); // silent — this is a background refresh, not a user action
    }

    function openPanel() {
      panel.classList.add("open");
      opened = true;
      if (!body.childElementCount) addMessage(GREETING, "bot");
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
      send.disabled = true;
      const typingEl = addMessage("…", "typing");
      const sentAt = Date.now();

      fetch(`${API_BASE}/api/era/message`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site: SITE_ID, sessionId, message: text }),
      })
        .then((r) => r.json())
        .then((data) => {
          typingEl.remove();
          if (!data || data.ok === false) {
            addMessage("Sorry, I couldn't reach the team's system just now — please try again in a moment.", "bot");
            return;
          }
          if (data.reply) addMessage(data.reply, "bot");
          // Don't re-fetch anything from before this message via
          // polling — avoids ever double-showing a reply the request
          // itself just delivered.
          if (sentAt > lastPollTs) lastPollTs = sentAt;
          if (data.status) noteStatusChange(data.status);
        })
        .catch(() => {
          typingEl.remove();
          addMessage("I'm having trouble connecting right now — please try again in a moment, or tap Book Now for direct help.", "bot");
        })
        .finally(() => {
          send.disabled = false;
        });
    });
  }
})();
