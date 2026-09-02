/* ============================================================
   ✏️  WILDERNESS EXPEDITION — EDIT-THIS-FILE
   ============================================================

   THIS IS THE ONLY FILE YOU NEED TO OPEN TO CHANGE:
     • Prices               (window.KC_PRICES  below)
     • Photos                (window.KC_IMAGES  below)
     • Text on the website   (window.KC_CONTENT below)

   You do NOT need to open index.html, app.js, or admin.html for
   any of that. Leave those files alone.

   ⚠️  PHOTOS — READ THIS FIRST
   Every image file below named "waterfall-*.jpg" or "gallery-*.jpg"
   or "hero-*.jpg" etc. is currently a PLACEHOLDER graphic (a plain
   dark background with a camera icon and a label) — it is NOT a
   real photograph. This was done deliberately: no real photo was
   supplied for these spots, and a fake/stock waterfall photo should
   never be shown pretending to be Butterfly Falls, Langam Falls,
   etc. As you get real photos, drop the image files into this same
   folder and just change the filename here (Section 2 below) to
   match. Nothing else needs to change.

   ------------------------------------------------------------
   HOW TO EDIT SAFELY — read this once before touching anything
   ------------------------------------------------------------
   1. Only change the part AFTER the colon ( : ).
   2. Numbers have NO ₹ symbol, NO commas, NO quote marks.
   3. Text (words/sentences) DOES need quote marks around it.
   4. Every line (except the very last one in a { } group) must
      end with a comma ,
   5. Anything after // is just a note for humans.
   6. Save + upload to GitHub the same way as before.
   7. A red banner at the top will warn you if something breaks.
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // 💰 SECTION 1 — PRICES
  // ============================================================
  window.KC_PRICES = {
    // ---- Expedition Package (the only package this site sells —
    // the whole 6-day/5-night trip, one flat per-person price) ----
    sharedTour: {
      perPerson: 4999,                  // ₹ per paying person — the 6-day expedition
      maxPeople: 5,                     // hard cap on people per booking — the stepper won't go above this
      additionalDayPerPersonPerDay: 1000, // ₹ per person, per extra day added beyond day 6
      // kept empty/unused on purpose — this package has no lunch add-on
      lunchThaliPrice: 0,
      thaliTypes: []
    },

    // ---- Unused on this site (kept only so shared app.js code
    // that references these paths never breaks) — no camping tier
    // or private tour is sold separately, since camping is already
    // included in the one Expedition Package above. ----
    guideOnly: { flat: 0 },
    privatePackage: {
      jeep: 0, guide: 0, adventurePerPerson: 0, lunchThaliPrice: 0, thaliTypes: [],
      campingTent: 0, campingMealsPerPerson: 0, overnightGuide: 0
    },
    camping: {
      tent: 0, tentUnit: 0, tentCapacity: 2, mealsPerPerson: 0, overnightGuide: 0,
      jeep: 0, activitiesPerPerson: 0
    },
    bambooMenu: [],

    // Not used (no children on this package) — kept only so the
    // shared app.js validation checks below don't error out.
    childFreeAge: 10,
    childJacketFee: 0,
    childEntryFee: 0,

    // ---- Minimum advance payment (₹) required to submit a booking ----
    minAdvance: 500
  };

  // ============================================================
  // 🖼️  SECTION 2 — PHOTOS
  // Every "..." below is a placeholder graphic — see the note at
  // the top of this file. Replace the filename with your own real
  // photo once you upload it into this same folder.
  // ============================================================
  window.KC_IMAGES = {
    // Rotating homepage background photos
    heroBg1: "hero-river-aerial.jpg",
    heroBg2: "hero-bg-2.jpg",

    heroSide: "hero-side.jpg",
    trekCard: "trek-card.jpg",
    expeditionPackageCard: "expedition-package-card.jpg",

    // Guide photo and site logo (kept from the existing brand)
    guide: "guide.jpg",
    logo: "logo.png",

    // ---- Highlight photo (About The Wilderness Expedition section) ----
    highlightRiverCrossing: "highlight-river-crossing.jpg",

    // ---- Waterfall photos ----
    waterfallButterfly: "waterfall-butterfly-real.jpg",
    waterfallButterfly2: "waterfall-butterfly-real-2.jpg",
    waterfallLangam: "waterfall-langam.jpg",
    // Linching Falls & the Unnamed Waterfall: no photo exists yet on
    // purpose (per your instructions) — these stay as the "no
    // photograph, only the destination" placeholder graphics.
    waterfallLinching: "waterfall-linching.jpg",
    waterfallUnnamed: "waterfall-unnamed.jpg",

    // ---- Gallery photos ----
    gallery0: "gallery-route.jpg",
    gallery1: "gallery-waterfall-real.jpg",
    gallery2: "gallery-trek.jpg",
    gallery3: "gallery-camp.jpg",
    gallery4: "gallery-river.jpg",
    gallery5: "gallery-trek2.jpg",
    gallery6: "gallery-route2.jpg",
    gallery7: "gallery-camp2.jpg",

    // Your UPI payment QR code image (kept from the existing brand)
    qrCode: "GooglePay_QR.png"
  };

  // ============================================================
  // 📝 SECTION 3 — TEXT ON THE WEBSITE
  // ============================================================
  window.KC_CONTENT = {
    // ---- Site identity ----
    siteName: "WILDERNESS EXPEDITION",
    siteSub: "SIX-DAY MEGHALAYA EXPEDITION",

    // ---- Contact & payment details (kept from the existing brand —
    // change these if this trip is booked through a different
    // account) ----
    instagram: "https://www.instagram.com/unexplored_meghalaya?igsh=ZHZpODB3aXl0bXBu",
    whatsappNumber: "916001877518",
    upiId: "kremchympe@upi",
    bank: {
      name: "Krem Chympe Adventure",
      account: "123456789012",
      ifsc: "SBIN0001234",
      bankName: "SBI, Cherrapunji Branch"
    },

    // ---- Prices shown around the site (kept for compatibility with
    // shared app.js code — not the main price, see KC_PRICES above) ----
    prices: {
      trek: 16999, camping: 16999, guide: 0, campingBase: 0,
      vehicleRainy: 0, vehicleWinter: 0, boat: 0, jacket: 0, parking: 0, entry: 0
    },

    meals: [],
    campingItems: [],

    // ---- On/off switches for whole sections ----
    sections: {
      trustBar: false,          // moved to the main home page (combined with Krem Chympe's)
      visitorGuide: true,      // "Know Before You Go"
      activitiesFacilities: true,
      ourStory: true,           // the "Our Story" timeline block, about how the expedition's waterfalls were found
      statsRow: true,
      meetGuide: true,
      waterfalls: true,        // NEW — "The Waterfalls of the Expedition"
      sharedTourCard: true,    // the one "Expedition Package" card
      campingCard: false,      // removed — camping is already included in the package
      privatePackageCard: false, // removed — no private tour on this site
      packagesTrustRow: true,
      gallery: true
    },

    nav: {
      items: [
        { label: "Home", target: "home" },
        { label: "Explore", target: "explore" },
        { label: "Package", target: "packages" },
        { label: "Gallery", target: "gallery" },
        { label: "Booking", target: "booking" },
        { label: "Contact", target: "contact" }
      ],
      mobileItems: [
        { label: "Home", target: "home" },
        { label: "Package", target: "packages" },
        { label: "Gallery", target: "gallery" }
      ]
    },

    trustBar: {
      trustedText: "Trusted by 100+",
      travelersText: "Travelers",
      googleRatingText: "Visitors Rating 4.9",
      safetyCertifiedText: "Safety Briefed",
      ecoTourismText: "Leave No Trace"
    },

    storyTimeline: [
      { year: "Discovery", title: "Found By Chance", desc: "Butterfly Falls was never part of the original route — it was found later, while an explorer searched the surrounding forest for firewood after planning to camp nearby." },
      { year: "The Naming", title: "Named By Hunters", desc: "Langam Falls takes its name from the isolation and disorientation local hunters felt on first encountering it — the only name this waterfall has ever been known by." },
      { year: "Local Knowledge", title: "Passed Down, Not Mapped", desc: "Linching Falls and the unnamed waterfall beyond it remain known chiefly through the hunters who have moved through this wilderness for years, rather than through any official map." },
      { year: "Today", title: "The Expedition", desc: "These waterfalls now form the heart of a six-day wilderness expedition — reached only after real distance on foot, with camps pitched along the way." }
    ],

    // ---- "About The Wilderness Expedition" (home page info block) ----
    destinationDetails: {
      title: "About The Wilderness Expedition",
      subtitle: "A Six-Day Journey Beyond The Usual Tourist Trail",
      highlights: [
        {
          icon: "mountain",
          label: "Not A Conventional Sightseeing Tour",
          description: "This is a six-day journey into the remote landscapes of Meghalaya, beginning at Brichyrnot Village and continuing from Khaddum into forests, rivers, rocky terrain and secluded wilderness camps.",
          images: []
        },
        {
          icon: "water",
          label: "Toward The Meghalaya–Assam Border",
          description: "The route gradually leaves the familiar tourist trail and moves toward the Meghalaya–Assam border, passing remote waterfalls and landscapes that are known primarily through local exploration and hunter knowledge.",
          images: []
        },
        {
          icon: "leaf",
          label: "The Wilderness Experience",
          description: "The journey is about the experience of being in the wilderness — thick jungle, wildlife sounds, slippery rocks, serene rivers, hidden waterfalls, changing landscapes and nights spent away from the ordinary tourist environment.",
          images: []
        },
        {
          icon: "eco",
          label: "Rarely Visited, Not Unexplored",
          description: "This is offbeat, rarely visited terrain — remote and secluded, but not unknown. The route, the waterfalls and the camps are locally known, guided by people who have moved through this wilderness for years.",
          images: []
        }
      ]
    },

    // ---- "The Waterfalls Of The Expedition" — NEW section: one large
    // card per waterfall, story first, photo (or honest placeholder)
    // below, and a Google Maps link button below the photo. ----
    waterfalls: {
      title: "The Waterfalls Of The Expedition",
      subtitle: "Four waterfalls, each reached only after real distance on foot",
      locations: [
        {
          emoji: "🦋",
          title: "Butterfly Falls",
          subtitle: "The hidden waterfall, found while gathering firewood",
          story: "Butterfly Falls is a hidden waterfall discovered during an earlier exploration of the area. According to the explorer's account, the waterfall was not noticed during the main exploration — it was found later, while the explorer was searching the surrounding area for firewood after planning to camp nearby. The large number of butterflies around the waterfall inspired its name.",
          image: window.KC_IMAGES.waterfallButterfly,
          images: [window.KC_IMAGES.waterfallButterfly, window.KC_IMAGES.waterfallButterfly2],
          hasPhoto: true, // set to false and it will show the "no photo" style instead
          // Paste the Google Maps share link for this location here:
          mapLink: ""
        },
        {
          emoji: "🌫️",
          title: "Langam Falls",
          subtitle: "Named for a first impression, not a story",
          story: "Langam Falls was named by hunters based on their first impression of the place. The surrounding environment created an unsettling yet fascinating feeling — a combination of isolation, unfamiliarity and disorientation. The name reflects that first impression of the waterfall and its surroundings.",
          image: window.KC_IMAGES.waterfallLangam,
          hasPhoto: true,
          mapLink: ""
        },
        {
          emoji: "🌊",
          title: "Linching Falls",
          subtitle: "No photograph. Only the destination.",
          story: "Linching Falls is a remote waterfall known through the knowledge of hunters who travel through the surrounding wilderness. It is one of the major destinations of the expedition. The name \u2014 given by hunters \u2014 is the only name this waterfall is known by.",
          image: window.KC_IMAGES.waterfallLinching,
          hasPhoto: false,
          mapLink: ""
        },
        {
          emoji: "❓",
          title: "The Unnamed Waterfall",
          subtitle: "3 km beyond Linching Falls",
          story: "Beyond Linching Falls, approximately 3 km ahead, lies another waterfall that currently has no established name. There is no official photograph of this waterfall \u2014 it remains the expedition's final discovery point.",
          image: window.KC_IMAGES.waterfallUnnamed,
          hasPhoto: false,
          mapLink: ""
        }
      ]
    },

    // ---- "Why Go" — full narrative section (replaces the old journey
    // cards). Content is a list of blocks rendered top to bottom:
    //   { type: "heading",  text: "..." }
    //   { type: "paragraph", text: "..." }
    //   { type: "list", items: ["...", "..."] }
    //   { type: "quote", text: "...", attribution: "— Name" }
    //   { type: "divider" }
    whyVisit: {
      title: "WHY GO FOR WILDERNESS EXPEDITION",
      blocks: [
        { type: "heading", text: "Step Outside the Ordinary" },
        { type: "paragraph", text: "Most people will never know what it feels like to be truly alive. Not the kind of alive that comes from a workout or a weekend getaway. The kind that comes from your heartbeat being the only sound for miles. The kind that comes from building fire with your own hands, not a lighter." },
        { type: "paragraph", text: "This isn't a tour. This is a return." },
        { type: "list", items: [
          "Trade screens for survival. No notifications. No emails. Just you, the canopy, and instincts you forgot you had.",
          "Earn your meals. Not from a menu. From your own skill, your own effort, your own two hands.",
          "Find silence that actually silences. The jungle doesn't ask about your job title. It doesn't care about your deadlines. It just asks you to be present.",
          "Come back with more than photos. Come back with a scar, a story, and a version of yourself that knows what it can survive."
        ] },

        { type: "heading", text: "Come Back Changed" },
        { type: "paragraph", text: "The jungle doesn't care about your resume. It doesn't care about your mortgage, your Instagram followers, or that email you've been dreading to send. It cares about one thing: whether you can survive." },
        { type: "paragraph", text: "Most of your life has been cushioned. Heated. Delivered to your door. This isn't a complaint\u2014it's an observation. And if you're honest with yourself, you already know something is missing." },
        { type: "quote", text: "The wilderness is not a luxury but a necessity of the human spirit.", attribution: "\u2014 Edward Abbey" },

        { type: "divider" },
        { type: "paragraph", text: "This isn't a vacation. It's a reckoning." },
        { type: "paragraph", text: "There's no cell service. No room service. No Wi-Fi. Just you, the canopy, and a version of yourself you've never met\u2014the one who builds fire from nothing, who reads the forest floor like a newspaper, who sleeps under stars that don't compete with city lights." },
        { type: "paragraph", text: "Here's what you'll find out there:" },
        { type: "list", items: [
          "That you're more capable than you think. Not in a gym. In a place that actually pushes back. Where every meal is earned, every step is a choice, and every night is a victory.",
          "That silence isn't empty\u2014it's full. The jungle hums. It breathes. It teaches you to listen in ways your city ears have forgotten.",
          "That fear is just excitement in disguise. Your heart will race. Your palms will sweat. And you'll realize that feeling means you're finally, actually alive.",
          "That you don't need much to be content. No gadgets. No luxuries. Just water, shelter, and the quiet satisfaction of knowing you made it through."
        ] },

        { type: "divider" },
        { type: "quote", text: "There are no shortcuts to any place worth going.", attribution: "\u2014 Beverly Sills" },

        { type: "divider" },
        { type: "paragraph", text: "But here's the truth no one tells you:" },
        { type: "paragraph", text: "The jungle won't change you. It will only reveal you. Strip away the noise, the distractions, the comfortable lies you tell yourself\u2014and show you exactly who you are when no one's watching." },
        { type: "paragraph", text: "That might terrify you." },
        { type: "paragraph", text: "Or it might be exactly what you've been looking for." },

        { type: "divider" },
        { type: "quote", text: "The world is big and I want to have a good look at it before it gets dark.", attribution: "\u2014 John Muir" },

        { type: "divider" },
        { type: "paragraph", text: "The question isn't whether you're fit enough, brave enough, or rich enough." },
        { type: "paragraph", text: "The question is: Can you afford to go your whole life without knowing?" }
      ]
    },

    // ---- Activities & Facilities ----
    activitiesFacilities: {
      title: "Activities & Facilities",
      subtitle: "Everything you'll do here, and everything provided for you",
      activitiesTitle: "Expedition Activities",
      activities: [
        "4×4 Off-Roading (Brichyrnot → Khaddum)",
        "Multi-Day Forest Trekking",
        "River & Stream Crossings",
        "Rocky & Slippery Terrain Navigation",
        "Waterfall Exploration",
        "Wilderness Camping (5 Nights)",
        "Remote Route Navigation"
      ],
      facilitiesTitle: "Facilities & Equipment Provided",
      facilities: [
        "Guided Expedition (Guide-Led Route Management)",
        "4×4 Transfer, Brichyrnot → Khaddum",
        "Camping Equipment",
        "Headlamps / Torches",
        "Basic Navigation Equipment",
        "Shared Expedition Equipment",
        "Meals & Drinking Water",
        "Basic First-Aid Kit",
        "Pre-Expedition Safety Briefing",
        "Emergency Communication Method"
      ]
    },

    // ---- "Know Before You Go" ----
    visitorGuide: {
      title: "Know Before You Go",
      subtitle: "Simple, honest information every first-time expedition member should read before booking",
      cards: [
        {
          icon: "mappin",
          title: "The Route",
          items: [
            "Brichyrnot Village ➡️ Khaddum Village (4×4 jeep).",
            "Khaddum Village ➡️ Radeh (trek).",
            "Radeh ➡️ Meghalaya–Assam Border ➡️ Butterfly Falls ➡️ Langam Falls ➡️ Linching Falls.",
            "From Linching Falls, roughly 3 km further to the unnamed waterfall — the expedition's final point before the return journey."
          ]
        },
        {
          icon: "calendar",
          title: "Duration & Structure",
          items: [
            "6 days, 5 nights — wilderness camping every night of the route.",
            "This is a genuine multi-day expedition, not a single-day sightseeing trip.",
            "The itinerary can be extended beyond 6 days, subject to conditions and availability, at ₹1,000/person/day."
          ]
        },
        {
          icon: "backpack",
          title: "Equipment Provided",
          items: [
            "Headlamps / torches.",
            "Basic navigation equipment.",
            "Basic camping equipment.",
            "Shared expedition equipment."
          ]
        },
        {
          icon: "shield",
          title: "Safety & Terrain",
          items: [
            "This is a genuine wilderness environment — expect uneven terrain, slippery rocks, mud, streams, river crossings, rain and dense vegetation.",
            "A basic first-aid kit, pre-expedition safety briefing, weather and route assessment are all part of the expedition.",
            "The route is guide-led — participants must follow the guide's instructions at all times.",
            "Emergency communication method and contingency planning are in place throughout."
          ]
        },
        {
          icon: "users",
          title: "Connectivity & Communication",
          items: [
            "Mobile network availability may be limited or unavailable across portions of the route.",
            "Wildlife encounters cannot be guaranteed — you may hear wildlife or see signs of it without seeing it directly.",
            "Weather can change quickly in this terrain, so be prepared for changing conditions day to day."
          ]
        },
        {
          icon: "leaf",
          title: "Flexibility & Conditions",
          items: [
            "The route can change — weather, water levels, terrain, access and safety conditions can all require changes to the plan.",
            "Safety takes priority over completing the itinerary exactly as planned.",
            "This is remote, rarely visited, offbeat terrain — but it is locally known, not unexplored."
          ]
        }
      ]
    },

    packagesPage: {
      subtitle: "The complete six-day wilderness expedition",
      trustRow: ["Guide-Led", "Genuine Wilderness", "Safety Briefed", "4.9 Rating"]
    },

    // ---- Package card (the one Expedition Package) ----
    packages: {
      sharedTour: {
        badge: "6-Day Expedition",
        name: "Expedition Package",
        priceUnit: "Per Person",
        features: [
          "Guided expedition (guide-led route management)",
          "4×4 transfer, Brichyrnot → Khaddum",
          "5 nights wilderness camping",
          "Camping equipment",
          "Meals",
          "Drinking water",
          "Waterfall exploration",
          "Jungle trekking",
          "First-aid support",
          "Expedition navigation",
          "Additional day: ₹1,000/person/day",
          "Max 5 people per booking"
        ]
      },
      camping: { badge: "", name: "", priceUnit: "", features: [] },
      guideOnly: { badge: "", name: "", priceUnit: "", features: [] },
      privatePackage: { badge: "", name: "", priceUnit: "", features: [] }
    },

    galleryPage: {
      subtitle: "Moments from the wilderness expedition route",
      filters: ["All", "Route", "Waterfall", "Trek", "Camping", "River"],
      viewAllLabel: " View All Photos"
    },

    // ---- Expedition Package booking form text ----
    sharedTourBooking: {
      includedTitle: "Included in your package",
      includesLabel: "Includes:",
      includedItems: [
        "Guided expedition (guide-led route management)",
        "4×4 transfer, Brichyrnot → Khaddum",
        "5 nights wilderness camping & camping equipment",
        "Meals & drinking water",
        "Waterfall exploration & jungle trekking",
        "First-aid support & expedition navigation",
        "Additional day (optional): ₹1,000/person/day"
      ],
      childFreeText: "",
      batchText: [
        "Note: Advance booking must be completed at least 3 days before the expedition.",
        "Booking is confirmed only after advance payment.",
        "The route and itinerary can change due to weather, water levels, terrain, access or safety conditions."
      ],
      adultsLabel: "People",
      maxPeopleNote: "Max 5 people per booking.",
      childrenLabel: "",
      lunchTitle: "",
      lunchPriceUnit: "",
      lunchSubtitle: "",
      lunchIncludes: [],

      // ---- Additional Day add-on (new, replaces the lunch add-on
      // used on the Krem Chympe site) ----
      additionalDaysTitle: "Additional Days (optional)",
      additionalDaysNote: "Extend your expedition beyond the standard 6 days, subject to conditions and availability.",
      additionalDaysLabel: "Extra Days"
    },

    campingBooking: {},
    privatePackageBooking: {},

    payment: {
      accountNameLabel: "Account Name",
      accountNumberLabel: "Account Number",
      ifscLabel: "IFSC",
      bankLabel: "Bank",
      advanceHelperText: "Minimum advance ₹500 required",
      advanceNote: "Advance min ₹500 to confirm",
      submitWhatsappLabel: " Submit via WhatsApp"
    },

    // ---- Homepage hero text ----
    hero: {
      badge: "MEGHALAYA — SIX-DAY WILDERNESS EXPEDITION",
      title: "A Six-Day Journey Into Remote Meghalaya",
      sub: "This is not a conventional sightseeing tour. Beginning at Brichyrnot Village and continuing from Khaddum into forests, rivers, rocky terrain and secluded wilderness camps, the route gradually leaves the familiar tourist trail and moves toward the Meghalaya–Assam border — passing remote waterfalls known primarily through local exploration and hunter knowledge.",
      visitorsLabel: "Members",
      duration: "6 Days, 5 Nights",
      priceLabel: "₹4,999 Per Person",
      quote: "Symphony in the mist.", // Editable from the Telegram admin bot → ✏️ Edit Website Text → Hero → Quote
      videoUrl: "",
      videoEnabled: true, // Telegram admin bot → ✏️ Edit Website Text → Hero → Video Enabled (tap to switch on/off)
      fallbackImage: window.KC_IMAGES.heroBg1,
      enabled: true,
      discoverLabel: "Discover"
    },

    // Public notice popup — fully controlled from the Telegram admin bot
    // (✏️ Edit Website Text → Notice). When "enabled" is off, this
    // renders nothing at all — exactly as if it never existed.
    notice: {
      enabled: false,
      title: "PUBLIC NOTICE",
      subtitle: "",
      text: "",
      buttonText: "Got it",
      iconBg: "#2E8B57",
      showAgain: ""
    },

    backgrounds: [window.KC_IMAGES.heroBg1, window.KC_IMAGES.heroBg2],

    // ---- Guide bio (kept from the existing / old website) ----
    guide: {
      name: "Senly Suchiang",
      role: "Lead Guide & Conservationist",
      bio: "Born in the hills of Meghalaya, Senly has explored these wilderness routes and waterfalls for years. He is a certified local guide, and leads every expedition's route management and safety briefing.",
      image: window.KC_IMAGES.guide
    },

    logoImage: window.KC_IMAGES.logo,

    sectionImages: {
      heroCave: window.KC_IMAGES.highlightRiverCrossing, // moved here from the "About The Wilderness" highlight card
      trekCard: window.KC_IMAGES.trekCard,
      campingCard: window.KC_IMAGES.expeditionPackageCard,
      sharedPackageCard: window.KC_IMAGES.expeditionPackageCard,
      privatePackageCard: window.KC_IMAGES.expeditionPackageCard
    },

    galleryImages: [
      { id: 0, cat: "Route",      src: window.KC_IMAGES.gallery0, span: "col-span-8 row-span-2" },
      { id: 1, cat: "Waterfall",  src: window.KC_IMAGES.gallery1, span: "col-span-4" },
      { id: 2, cat: "Trek",       src: window.KC_IMAGES.gallery2, span: "col-span-4" },
      { id: 3, cat: "Camping",    src: window.KC_IMAGES.gallery3, span: "col-span-4" },
      { id: 4, cat: "River",      src: window.KC_IMAGES.gallery4, span: "col-span-4" },
      { id: 5, cat: "Trek",       src: window.KC_IMAGES.gallery5, span: "col-span-4" },
      { id: 6, cat: "Route",      src: window.KC_IMAGES.gallery6, span: "col-span-8" },
      { id: 7, cat: "Camping",    src: window.KC_IMAGES.gallery7, span: "col-span-4" }
    ],

    footer: {
      brandName: "TEAM CHYMPE EXPLORA",
      locationLine: "Brishyrnot, Hno: 34, Near Football Ground, Po: Lumshonong, East Jaintia Hills, Meghalaya, 793000, India",
      contactTitle: "Contact Us",
      phone: "+91 8787679579",
      email: "chympeexplora@gmail.com",
      followTitle: "Follow Us On",
      importantLinkTitle: "Important Link",
      refundPolicyLabel: "Refund Policy",
      copyright: "Copyright © Team explo era. All rights reserved."
    },

    // ---- Refund Policy page ----
    refundPolicy: {
      title: "Refund Policy",
      intro: "This is a genuine wilderness expedition — plans can change and multi-day outdoor routes can be affected by weather and natural conditions.",
      sections: [
        {
          number: "1",
          heading: "Cancellation By The Expedition Team",
          blocks: [
            { type: "text", text: "Your safety comes first." },
            { type: "text", text: "The expedition may be cancelled, postponed or modified if heavy rainfall, flooding, high water levels, unsafe river crossings, dangerous trail conditions or other natural circumstances make the route unsafe." },
            { type: "list", lead: "In such cases, you may be offered:", items: [
              "Rescheduling to another available date; or",
              "A refund for the cancelled service where rescheduling or an appropriate alternative is not possible."
            ] },
            { type: "text", text: "The final decision to proceed rests with the local guide when safety is concerned." }
          ]
        },
        {
          number: "2",
          heading: "Partial Route Changes",
          blocks: [
            { type: "text", text: "If only part of the route is affected by weather, safety or other unavoidable circumstances, the rest of the expedition may continue." },
            { type: "list", lead: "For the affected portion, you may be offered:", items: [
              "An alternative route or activity;",
              "Rescheduling; or",
              "A refund for the affected portion, where applicable."
            ] }
          ]
        },
        {
          number: "3",
          heading: "Weather & Monsoon",
          blocks: [
            { type: "text", text: "This expedition passes through rivers, streams and rocky terrain where conditions can change rapidly with rainfall." },
            { type: "text", text: "If an activity is stopped or cancelled because continuing would create a safety risk, it will be handled under the Cancellation section of this policy." }
          ]
        },
        {
          number: "4",
          heading: "How To Request A Cancellation",
          blocks: [
            { type: "text", text: "To cancel your booking, contact us using the contact details provided on the website or your booking confirmation." },
            { type: "list", lead: "Please provide:", items: [
              "Booking name",
              "Booking/reference number",
              "Expedition start date",
              "Contact number",
              "Cancellation request"
            ] },
            { type: "text", text: "Your cancellation will be considered based on the time the request is received." }
          ]
        },
        {
          number: "5",
          heading: "Important Safety Notice",
          blocks: [
            { type: "text", text: "This is a genuine multi-day wilderness expedition involving trekking, river crossings, camping and remote terrain." },
            { type: "text", text: "Safety takes priority over completing the itinerary exactly as planned." },
            { type: "text", text: "If the guide determines that a section of the route is unsafe, it may be changed, postponed or skipped even if it was originally included in your booking." },
            { type: "text", text: "By booking this expedition, you acknowledge and accept this condition." }
          ]
        }
      ],
      promiseTitle: "Our Promise",
      promiseText: [
        "We would rather change the route than compromise your safety.",
        "When nature changes the plan, we'll do our best to provide a suitable alternative, reschedule your expedition, or provide an applicable refund."
      ],
      whatsapp: {
        buttonLabel: "Chat With Us For A Refund",
        referenceLabel: "Your Booking Reference Number",
        referencePlaceholder: "e.g. 0001",
        referenceHelperNote: "This was given to you on WhatsApp right after you booked. Refunds can only be requested with a valid reference number.",
        referenceMissingError: "Please enter your booking reference number first — this was sent to you on WhatsApp after you booked.",
        message: "Hello, I would like to request a refund / cancellation for my Wilderness Expedition booking.\n\nBooking Reference Number: {referenceNumber}\nBooking name: \nExpedition start date: \nContact number: \nReason for refund request: "
      }
    },

    // ---- Fixed interface words ----
    ui: {
      bookNow: "Book Now",
      payNow: "Pay Now",
      next: "Next ",
      nextViewPricing: "Next — View Pricing ",
      back: " Back",
      backToHome: "Back to Home",

      fullName: "Full Name",
      whatsappNumberLabel: "WhatsApp Number",
      numberOfPeople: "Number of People",
      dateLabel: "Date",
      peopleLabel: "People",
      packageLabel: "Package",
      totalLabel: "Total",

      guideMandatory: "Guide Mandatory",
      vehicleLabel: "4x4 Vehicle",
      campingGear: " Camping Gear",
      mealOptions: " Meal Options",
      noVehicleLabel: "No Vehicle",
      freeWalkLabel: "Free / Walk",
      rainyHalfWayLabel: "Rainy Half Way",
      winterFullWayLabel: "Winter Full Way",

      visitors: " Members",
      duration: " Duration",
      price: " Price",
      visitorRange: "Small Groups",

      paymentOptionsTitle: "Payment Options",
      orderSummary: "Order Summary",
      qrScannerLabel: "QR Scanner",
      upiIdLabel: "UPI ID",
      bankTransferLabel: "Bank Transfer",
      scanToPayLabel: "Scan to Pay ₹",
      downloadQr: " Download QR",
      balanceLeftLabel: "Balance left to pay on arrival: ₹",

      bookingConfirmedTitle: "Booking Confirmed!",
      thankYouPrefix: "Thank you ",
      thankYouMiddle: "! Your expedition is secured. We have received advance ₹",
      thankYouBalanceMid: ". Balance ₹",
      thankYouSuffix: " to be paid on arrival.",

      ourStory: "Our Story",
      meetYourGuide: "Meet Your Guide",
      ourGallery: "Our Gallery",
      ourAdventurePackages: "Expedition Package",
      pricingFacilities: "Pricing & Facilities",
      totalCalculator: "Total Calculator",
      totalAmount: "Total Amount",

      statForestTrailLabel: "Day Expedition",
      statAverageTrekLabel: "Nights Camping",
      statSpeciesLabel: "Waterfalls",
      statGoogleRatingLabel: "Visitors Rating"
    }
  };

  // ============================================================
  // 🛑 DO NOT EDIT ANYTHING BELOW THIS LINE
  // ============================================================
  var problems = [];
  function need(obj, path, type) {
    var parts = path.split(".");
    var v = obj;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) { problems.push(path + " is missing."); return; }
      v = v[parts[i]];
    }
    if (v == null) { problems.push(path + " is missing."); return; }
    if (type === "number" && (typeof v !== "number" || isNaN(v))) {
      problems.push(path + " should be a plain number (no ₹, no quotes, no commas) — got: " + JSON.stringify(v));
    }
    if (type === "string" && typeof v !== "string") {
      problems.push(path + " should be text in quotes — got: " + JSON.stringify(v));
    }
  }

  need(window.KC_PRICES, "sharedTour.perPerson", "number");
  need(window.KC_PRICES, "sharedTour.additionalDayPerPersonPerDay", "number");
  need(window.KC_PRICES, "minAdvance", "number");
  need(window.KC_CONTENT, "siteName", "string");
  need(window.KC_CONTENT, "whatsappNumber", "string");
  if (window.KC_CONTENT && window.KC_CONTENT.whatsappNumber && !/^\d{10,15}$/.test(window.KC_CONTENT.whatsappNumber)) {
    problems.push("whatsappNumber should be digits only, with country code, no + or spaces (e.g. 916001877518) — got: " + JSON.stringify(window.KC_CONTENT.whatsappNumber));
  }

  if (problems.length && typeof window.showConfigError === "function") {
    window.showConfigError(
      "Found " + problems.length + " problem(s) in config.js: " + problems.join(" | ")
    );
  }
})();
