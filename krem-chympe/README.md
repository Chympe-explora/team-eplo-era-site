# Krem Chympe — Adventure & Camping (Static Site)

This is now a **fully static site** — no backend, no Render, no Cloudflare
Workers, no Telegram bot. Everything lives in `frontend/` and can be hosted
anywhere that serves static files (GitHub Pages, Netlify, any web host, or
just opened locally).

## ✏️ Changing prices, photos, or text — permanently, for every visitor

Open **`config.js`** — that's the only file you need to touch. It has
plain-English instructions at the top, is split into three clearly labeled
sections (Prices / Photos / Text), and checks itself for common mistakes
(like a missing comma) — if something's wrong, the live site shows a red
warning banner instead of silently breaking.

Edit the number/text after the colon, save, and push to GitHub — GitHub
Pages redeploys automatically and the change is live for everyone within a
minute or two. Don't edit `index.html`, `app.js`, or `admin.html` for this —
they're the site's engine room and don't need to change.

## How booking works
A visitor fills in their details, picks a package, and selects their items.
Tapping **Submit** opens WhatsApp (`wa.me`) with a prefilled message
containing their contact info, package, every selected item, and the total —
ready to send to the number set in `config.js` (`window.KC_CONTENT.whatsappNumber`).
There is no server-side booking storage; the conversation happens on WhatsApp.

Every prefilled message includes a running reference code (`0001`, `0002`,
`0003`, ...). It's a simple visit counter stored in the browser
(`localStorage`), incremented once per visit — it is **per-device**, not a
global counter across all visitors, since there's no server to share it from.

## Admin Dashboard (`admin.html`)
A separate, password-protected dashboard for the admin/guide:
- **Prices** — every price on the site (per-package, per-item)
- **Items** — add/edit/remove bamboo-menu add-ons
- **Content** — WhatsApp number, UPI ID, bank details, Instagram link
- **Visitors** — the running visitor counter
- **Bookings** — view, edit, delete, or export (CSV) submitted bookings
- **Settings** — change the admin password, reset everything to defaults

⚠️ **Important:** this dashboard only saves to *your own browser's*
`localStorage`, on the one device you're using it from. It's useful for a
quick preview/test, but it does **not** change what other visitors see, and
it does **not** collect bookings made on customers' own phones — those stay
on the customer's device. For a change (or booking list) that's real and
visible everywhere, edit **`config.js`** and push to GitHub instead (see
above) — or if you want bookings/prices genuinely shared across every
device, that needs a real backend (e.g. Supabase) added later.

Since there's no server validating the admin password either, treat it as a
"keep casual visitors out" gate, not real security — anyone who reads the
page's source could bypass it.

## Files
- `config.js` — **edit this one.** All prices, photos, and text, in one
  self-checking, plainly-commented file
- `index.html` — the booking site's engine room (React, no build step,
  loaded via CDN) — loads `config.js` and shows a warning banner if it has
  a mistake in it
- `app.js` — booking flow logic
- `admin.html` — the admin/guide dashboard (browser-local preview/testing
  tool — see warning above)
- `editor.js` — an additional in-page content editor (long-press logo /
  Ctrl+Shift+E / `?admin=krem2024`) for tweaking text/images directly on the
  live page — separate tool from `admin.html`, also `localStorage`-based
- `safelinks.js` — makes external links open in a new tab
- `styles.css`, images — assets
