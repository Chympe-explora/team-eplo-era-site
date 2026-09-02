# ✅ Team Explo Era - Frontend Setup Instructions

## 🎯 What This Is

This is the **complete fixed frontend** for your Team Explo Era adventure website.

**Status:** ✅ Ready to deploy to GitHub Pages

---

## 🚀 Quick Deploy (2 minutes)

### Step 1: Push to GitHub

```bash
# Navigate to this folder
cd team-eplo-era-site

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - fixed website"

# Add your GitHub remote
git remote add origin https://github.com/chympe-explora/team-eplo-era-site.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/chympe-explora/team-eplo-era-site
2. Click **Settings** (top menu)
3. Scroll to **Pages** (left sidebar)
4. Set:
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Wait & Test

Wait 1-2 minutes, then visit:
```
https://chympe-explora.github.io/team-explo-era-site/
```

It should load with:
- ✅ Navigation menu
- ✅ Hero image
- ✅ Destinations section
- ✅ Booking form
- ✅ No blank page
- ✅ No red error banner

---

## 📝 How to Edit Content

### Edit Prices, Text, Images, Phone Number

**File to edit:** `config.js`

**Example changes:**

```javascript
// Change WhatsApp number
"whatsappNumber": "916001877518"  // ← Change this

// Change Instagram link
"instagram": "https://www.instagram.com/your-handle"

// Change site name
"siteName": "TEAM EXPLO ERA"

// Change prices
"packages": {
  "cave-expedition": {
    "title": "Cave Expedition",
    "price": 2500  // ← Change price here
  }
}

// Change images
"backgroundImage": "Blue watefall.jpg"  // File must exist in this folder
```

**After editing:**
```bash
git add config.js
git commit -m "Update prices and content"
git push origin main
```

Wait 1-2 minutes for GitHub Pages to rebuild.

---

## 📁 What's Included

```
team-explo-era-site/
├── index.html           ← Main website page (don't edit)
├── config.js            ← 👈 EDIT THIS for content/prices
├── app.js               ← React app logic (don't edit)
├── styles.css           ← Website styling
├── logo.png             ← Your logo
├── admin.html           ← Admin dashboard
├── editor.js            ← Content editor tool
├── live-content.js      ← Fetches updates from backend
├── booking-bridge.js    ← Booking integration
├── era-ai-widget.js     ← AI chat assistant
├── safelinks.js         ← Link handler
│
├── krem-chympe/         ← First destination variant
│   ├── index.html
│   ├── config.js
│   └── [images]
│
├── wilderness-expedition/ ← Second destination variant
│   ├── index.html
│   ├── config.js
│   └── [images]
│
└── [many image files]
    ├── Blue watefall.jpg
    ├── Camping.jpg
    ├── Cave Ecosystem.jpg
    └── ... (all your destination images)
```

---

## 🔧 Important Files

### `config.js` - YOUR MAIN CONFIG FILE

This file contains everything that appears on the website:

- Site name and tagline
- All prices
- Package descriptions
- Image filenames
- Phone numbers
- Instagram link
- Highlights and banners
- Footer content

**Edit this file to change anything on your website!**

### `index.html` - Don't Edit This

This is the website engine. It:
- Loads React from CDN
- Loads your config.js
- Renders everything
- Shows error banner if config.js has typos

### `admin.html` - Admin Dashboard

Visit: `https://chympe-explora.github.io/team-explo-era-site/admin.html`

**Note:** Admin changes only work on YOUR computer's browser (localStorage).
For real changes, edit `config.js` and push to GitHub.

---

## ⚠️ Common Issues

### "Page is blank"
1. Press **F12** (Developer Tools)
2. Click **Console** tab
3. Look for red error messages
4. Check `config.js` for syntax errors (missing commas)

### "Red error banner appears"
There's a typo in `config.js` (usually a missing comma or quote).
- The banner tells you which line
- Open `config.js` and fix it
- Save and push to GitHub

### "Images don't show"
1. Check image filename in `config.js` matches exactly (case-sensitive!)
2. Verify image file exists in the folder
3. Push changes to GitHub

### "WhatsApp link doesn't work"
- Check `"whatsappNumber"` in `config.js` is correct
- Make sure it's a valid phone number with country code (e.g., `916001877518`)

---

## 🎨 Customization

### Add New Destination

In `config.js`, find the `destinations` section and add:

```javascript
{
  "id": "my-destination",
  "name": "My New Destination",
  "tagline": "Short description",
  "image": "my-image.jpg",  // Must exist in folder
  "description": "Full description here...",
  "highlights": ["Feature 1", "Feature 2"],
  "price": 3000
}
```

### Add New Package Item

In `config.js`, find `packages` and add new items:

```javascript
{
  "key": "item-name",
  "label": "Item Name",
  "price": 500,
  "category": "add-ons"
}
```

### Change Theme Colors

Edit `styles.css` - look for color definitions:

```css
/* Find and change colors */
--primary-color: #2E86AB;
--accent-color: #06A77D;
--background: #0a0e27;
```

---

## 📱 Testing Locally

Before pushing to GitHub, test your changes:

```bash
# Start local server
python3 -m http.server 8000

# Visit in browser
http://localhost:8000

# Check that:
# ✅ Page loads (not blank)
# ✅ No red error banner
# ✅ Images display
# ✅ F12 console shows no red errors
```

Stop server: Press **Ctrl+C**

---

## 🔄 Deployment Checklist

Before pushing to GitHub, verify:

- [ ] `config.js` has no syntax errors
- [ ] All image files exist in the folder
- [ ] Image filenames in `config.js` match exactly
- [ ] `whatsappNumber` is valid
- [ ] Prices are numbers, not text
- [ ] No missing commas in JSON
- [ ] Tested locally and works

Then:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Wait 1-2 minutes for GitHub Pages to rebuild.

---

## 🤖 Admin Dashboard

The admin panel lets you preview changes before pushing to GitHub.

Visit: `https://chympe-explora.github.io/team-explo-era-site/admin.html`

**Important:** Changes here only affect YOUR browser. For real changes visible to all:
1. Edit `config.js`
2. Push to GitHub
3. Wait 1-2 minutes

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page | Press F12, check console for errors |
| Red error banner | Fix typo in `config.js` (check for missing commas) |
| Images missing | Check filename matches in `config.js` (case-sensitive!) |
| Changes not showing | Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac) |
| WhatsApp doesn't open | Check phone number format in `config.js` |

---

## 📞 Quick Reference

**Your Website:** `https://chympe-explora.github.io/team-eplo-era-site/`

**Edit File:** `config.js`

**Test Locally:** `python3 -m http.server 8000`

**Push Changes:**
```bash
git add .
git commit -m "Description"
git push origin main
```

**View Logs:** GitHub Settings → Actions

---

## ✨ You're All Set!

This frontend is completely fixed and ready to deploy.

**Next step:** Push this to GitHub Pages (Step 1-2 above) and it will be live!

For the backend, see the `Camping-booking-backend/SETUP_INSTRUCTIONS.md` file.

---

**Version:** 1.0 - September 2, 2026  
**Status:** ✅ Ready to Deploy  
