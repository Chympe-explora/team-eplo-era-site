/* ============================================================
   ✏️  KREM CHYMPE — EDIT-THIS-FILE
   ============================================================

   THIS IS THE ONLY FILE YOU NEED TO OPEN TO CHANGE:
     • Prices               (window.KC_PRICES  below)
     • Photos                (window.KC_IMAGES  below)
     • Text on the website   (window.KC_CONTENT below)

   You do NOT need to open index.html, app.js, or admin.html for
   any of that. Leave those files alone.

   ------------------------------------------------------------
   HOW TO EDIT SAFELY — read this once before touching anything
   ------------------------------------------------------------
   1. Only change the part AFTER the colon ( : ).
      Example:  perPerson: 2600,
                            ^^^^ change this number only.
                Never delete or rename the word before the colon
                (e.g. "perPerson") — the website looks for that
                exact word.

   2. Numbers are written with NO ₹ symbol, NO commas inside them,
      and NO quote marks around them.
         Correct:    perPerson: 2600,
         Wrong:      perPerson: "₹2,600",

   3. Text (words/sentences) DOES need quote marks around it.
         Correct:    siteName: "KREM CHYMPE",
         Wrong:      siteName: KREM CHYMPE,

   4. Every line (except the very last one in a { } group) must
      end with a comma  ,   — this is the single most common
      mistake. If the site breaks after an edit, check that you
      didn't delete a comma or accidentally leave a trailing
      comma after the LAST item in a group.

   5. Anything after // on a line is just a note for humans —
      the website ignores it completely. Feel free to read them,
      never worry about breaking them.

   6. When you're done editing, save the file and push/upload it
      to GitHub the same way as before. That's the only extra
      step — GitHub Pages does the rest automatically within a
      minute or two.

   7. If something looks wrong after you publish, a red banner
      will appear at the top of the site telling you this file
      has a mistake in it, instead of the site just going blank.
      Undo your last change, save, and republish.
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // 💰 SECTION 1 — PRICES
  // Every price shown anywhere on the site comes from here.
  // ============================================================
    window.KC_PRICES = {
      // ---- Shared Tour Package ----
      sharedTour: {
        perPerson: 2600,          // ₹ per paying person
        lunchThaliPrice: 380,     // ₹ per thali — optional add-on (veg/chicken/pork same price)
        thaliTypes: [
          { id: "veg",     name: "Veg Thali" },
          { id: "chicken", name: "Chicken Thali" },
          { id: "pork",    name: "Pork Thali" }
        ]
      },

      // ---- Guide Only Package ----
      // NOTE: this package was removed from the site (replaced by the
      // Private Package below) but the price is kept here in case you
      // ever want to bring it back — it isn't read by app.js anymore.
      guideOnly: {
        flat: 1500 // ₹ per group, fixed — no add-ons, no customization
      },

      // ---- Private Package (custom group tour, optional camping) ----
      privatePackage: {
        jeep: 4000,               // ₹ per group — optional 4x4 jeep
        guide: 1500,               // ₹ per group — mandatory local guide
        adventurePerPerson: 1500,  // ₹ per person — optional adventure activities
        lunchThaliPrice: 380,      // ₹ per thali (veg / chicken / pork all same price)
        thaliTypes: [
          { id: "veg",     name: "Veg Thali" },
          { id: "chicken", name: "Chicken Thali" },
          { id: "pork",    name: "Pork Thali" }
        ],
        // ---- Camping add-on (only charged if Camping = yes) ----
        campingTent: 1000,          // ₹ per tent
        campingMealsPerPerson: 380, // ₹ per person — veg only, dinner + breakfast
        overnightGuide: 2000        // ₹ per booking, mandatory once camping is chosen
      },

      // ---- Traditional Bamboo Dishes (Private Package camping add-on menu) ----
      bambooMenu: [
        { id: "chicken500",   name: "Fresh Bamboo Chicken (500g)",     price: 699 },
        { id: "chicken1kg",   name: "Fresh Bamboo Chicken (1kg)",      price: 890 },
        { id: "pork500",      name: "Fresh Bamboo Pork (500g)",        price: 799 },
        { id: "pork1kg",      name: "Fresh Bamboo Pork (1kg)",         price: 1000 },
        { id: "porkbelly500", name: "Roasted Pork Belly Salad (500g)", price: 599 },
        { id: "porkbelly1kg", name: "Roasted Pork Belly Salad (1kg)",  price: 900 },
        { id: "fish",         name: "Boiled Fish (Zero Oil)",          price: 250 },
        { id: "vegsabji",     name: "Veg Bamboo Sabji",                price: 300 },
        { id: "egg",          name: "Boiled Egg",                     price: 20 },
        { id: "chai",         name: "Bamboo Chai",                    price: 20 }
      ],

      // ---- Editable child free age — changing this updates every
      // calculation that checks whether a child is charged. ----
      childFreeAge: 10,

      // ---- Children under childFreeAge are free of charge for the
      // package price / adventure activities themselves, but they still
      // use a life jacket and still go through the entry gate, so these
      // two small per-child fees are charged even for a "free" child
      // whenever activities are part of the booking (Shared Tour always
      // includes activities; Camping only when "Adventure Activities" is
      // selected). Adjust these two numbers any time. ----
      childJacketFee: 100,  // ₹ per free child — life jacket
      childEntryFee: 50,    // ₹ per free child — entry fee

      // ---- Minimum advance payment (₹) required to submit a booking ----
      minAdvance: 500
    };

  // ============================================================
  // 🖼️  SECTION 2 — PHOTOS
  // Filenames of the images used around the site. To change a
  // photo: upload your new image file into the frontend folder
  // (same place as this file), then type its exact filename here
  // (must match exactly, including capital letters and spaces).
  // ============================================================
    window.KC_IMAGES = {
      // Rotating homepage background photos
      heroBg1: "Blue watefall.jpg",
      heroBg2: "Blue watefall.jpg",

      // Section photos
      // heroCave was still pointing at a missing "images/hero-cave.jpg" —
      // set to "Cave entrance.jpg" for now. Change this to whichever photo
      // you'd rather use for the cave hero section.
      heroCave:    "Blue water cave.jpg",
      trekCard:    "Trekking.jpg",
      privatePackageCard: "River Confluence.jpg",
      caveEntranceCard: "Cave entrance.jpg",

      // Guide photo and site logo
      guide: "guide.jpg",
      logo:  "logo.png",

      // Gallery photos (id 0-9, matches the categories shown on the site)
      gallery0: "Cave entrance.jpg",
      gallery0New: "Cave Entrance Falls.jpg",
      gallery1: "Blue watefall.jpg",
      gallery2: "Trekking.jpg",
      gallery2New: "Trek Trail Mist.jpg",
      gallery3: "Camping un ex m.jpg",
      gallery3New: "Camping Deck View.jpg",
      gallery4: "Rafting.jpg",
      gallery5: "Cave diving.jpg",
      gallery6: "Blue water cave.jpg",
      gallery7: "Rock formations.jpg",
      gallery8: "Happy waterfall.jpg",
      gallery9: "Camping.jpg",

      // Your UPI payment QR code image (shown on the Pricing / Pay page).
      // Leave blank ("") to keep the plain text placeholder instead.
      qrCode: "GooglePay_QR.png"
    };

  // ============================================================
  // 📝 SECTION 3 — TEXT ON THE WEBSITE
  // Every sentence, label, and button on the site comes from here.
  // ============================================================
    window.KC_CONTENT = {
      // ---- Site identity ----
      siteName: "KREM CHYMPE",
      siteSub: "ADVENTURE & CAMPING",

      // ---- Contact & payment details ----
      instagram: "https://www.instagram.com/unexplored_meghalaya?igsh=ZHZpODB3aXl0bXBu",
      whatsappNumber: "916001877518",
      upiId: "kremchympe@upi",
      bank: {
        name: "Krem Chympe Adventure",
        account: "123456789012",
        ifsc: "SBIN0001234",
        bankName: "SBI, Cherrapunji Branch"
      },

      // ---- Prices (in ₹) ----
      prices: {
        trek: 1500,          // shown as the "starting from" trek price
        guide: 1500,         // mandatory guide fee, charged on every booking
        vehicleRainy: 2000,  // 4x4 vehicle - Rainy Half Way option
        vehicleWinter: 4000, // 4x4 vehicle - Winter Full Way option
        boat: 1000,          // reserved, not currently charged
        jacket: 100,         // reserved, not currently charged
        parking: 100,        // charged once per booking
        entry: 50             // charged per person
      },

      // ---- Meal options (shown with a quantity picker) ----
      meals: [
        { id: "bamboo_pork",  name: "Bamboo Pork",   price: 300, type: "non-veg" },
        { id: "chicken_curry",name: "Chicken Curry", price: 250, type: "non-veg" },
        { id: "maggie",       name: "Maggie",         price: 80, type: "veg" },
        { id: "tea",          name: "Red Tea",        price: 30, type: "veg" },
        { id: "rice",         name: "Steamed Rice",  price: 120, type: "veg" },
        { id: "salad",        name: "Local Salad",    price: 60, type: "veg" },
        { id: "pork_fry",     name: "Pork Fry",      price: 320, type: "non-veg" },
        { id: "egg_curry",    name: "Egg Curry",     price: 150, type: "non-veg" }
      ],

      // ---- On/off switches for whole sections. Set any of these to
      // false to remove that section from the site — no other file
      // needs to be touched. ----
      sections: {
        trustBar: false,      // moved to the main home page (combined with Wilderness Expedition's)
        visitorGuide: true,   // the "Know Before You Go" first-time-visitor info block
        activitiesFacilities: true, // the "Activities & Facilities" block
        ourStory: true,       // the "Our Story" timeline block
        statsRow: true,       // the 10.5KM / 3-4 Hrs / 50+ / 4.9 stat tiles
        meetGuide: true,      // the "Meet Your Guide" card
        sharedTourCard: true, // the "Shared Tour" package card
        privatePackageCard: true, // the "Private Package" package card
        packagesTrustRow: true, // "Safe & Secure / Local Guides / Eco Friendly / 4.9 Rating" strip
        gallery: true         // the whole "Our Gallery" block
      },

      // ---- Navigation menu labels (top bar + mobile menu) ----
      nav: {
        items: ["Home", "Explore", "Packages", "Gallery", "Booking", "Contact"],
        mobileItems: ["Home", "Packages", "Gallery"]
      },

      // ---- "Trusted by..." strip under the hero ----
      trustBar: {
        trustedText: "Trusted by 100+",
        travelersText: "Travelers",
        googleRatingText: "Visitors Rating 4.9",
        safetyCertifiedText: "Safety Certified",
        ecoTourismText: "Eco Tourism"
      },

      // ---- "Our Story" timeline entries ----
      storyTimeline: [
        { year: "1990", title: "Cave Discovery", desc: "Local hunters discovered the massive cave system while tracking in the dense forests." },
        { year: "2015", title: "Tourism Began", desc: "Opened for eco-tourism with strict conservation guidelines and local community involvement." },
        { year: "2018", title: "Local Guides", desc: "Trained 25+ local guides from nearby villages, creating sustainable livelihoods." },
        { year: "Today", title: "Conservation", desc: "Protecting 12km trail, 100+ species, with zero-plastic and leave-no-trace policy." }
      ],

      // ---- Destination Details (featured on home page) ----
      //
      // ⚠️  IMPORTANT — a rule just for THIS section:
      // Inside any "description" text below, never type a straight double
      // quote mark ( " ) — the website uses " " to mark where text starts
      // and ends, so a second one in the middle of your sentence breaks
      // the whole site (blank page). If you want to quote a word inside a
      // description, use single quotes instead, like this: 'Krem'
      //
      // Each highlight card can also show a little auto-sliding photo
      // strip under its text. Just list image file names (same folder as
      // this file, spelling/CAPS must match exactly) inside that
      // highlight's "images": [ ... ] list, in the order you want them to
      // slide. Leave it as images: [] (empty) to show no photos for that
      // card. You can list 1 photo (no sliding, just shows it) or many.
      destinationDetails: {
        title: "About Krem Chympe",
        subtitle: "India's Fifth-Longest Cave System",
        highlights: [
          {
            icon: "mountain",
            label: "India's 5th Longest Cave",
            description: "Krem Chympe is India's fifth-longest cave system, with approximately 10.5 kilometers of mapped passages. 'Krem,' in the local Khasi language, means 'cave.' This massive river cave system is also known as the 'Elephant Cave' due to the discovery of elephant bones in the area. Located in the Jaintia Hills district, which is home to more than 1,200 caves—the highest concentration on the Indian subcontinent—Krem Chympe stands out as a unique 'resurgent cave' where an underground river emerges after its subterranean journey.",
            images: ["Cave Lagoon.jpg"]
          },
          {
            icon: "water",
            label: "Golden Orchid Chamber",
            description: "Within the cave system lies the stunning 'Golden Orchid Chamber,' featuring magnificent stalactites and stalagmites with golden-hued mineral deposits that shimmer like a field of flowers under torchlight.",
            images: ["Golden Orchid Formation.jpg"]
          },
          {
            icon: "users",
            label: "50+ Natural Limestone Dams",
            description: "The cave is renowned for over 50 natural limestone dams known locally as 'gours.' These formations, some reaching heights of 12 meters, are created by the high concentration of calcium carbonate in the cave water—a testament to millions of years of geological transformation.",
            images: ["Limestone Dam Pool.jpg"]
          },
          {
            icon: "leaf",
            label: "World's Largest Blind Cavefish",
            description: "The cave is home to the world's largest species of blind cavefish (Neolissochilus pnar), reaching lengths of up to 40 centimeters. These eyeless, albino giants represent a remarkable example of evolution in extreme environments.",
            images: ["Blind Cavefish.jpg"]
          },
          {
            icon: "cave",
            label: "Cave-Adapted Bat Colonies",
            description: "Multiple bat species find refuge within the cave, their guano providing essential nutrients for the subterranean food chain.",
            images: ["Bat Colony.jpg"]
          },
          {
            icon: "eco",
            label: "Delicate Ecosystem",
            description: "The cave's unique environment supports organisms that have evolved to survive in total darkness and isolation, making it a living laboratory of evolutionary adaptation.",
            images: ["Cave Ecosystem.jpg", "Cave Ecosystem 2.jpg"]
          }
        ]
      },

      // ---- "Why Visit Krem Chympe?" — the 4 big adventure-journey cards
      // (home page, right after "About Krem Chympe"). Each journey needs
      // an "emoji", "number" (01–04), "title", "tagline" (bold one-liner),
      // "description", and "experience" (short list of activity tags
      // shown at the bottom of the card). Reword any of it the same way
      // as everything else in this file.
      whyVisit: {
        title: "WHY VISIT KREM CHYMPE?",
        subtitle: "Not Just a Place. A Story You'll Tell Forever.",
        intro: "Deep in the wild landscapes of Meghalaya, Krem Chympe isn't another tourist spot on a checklist. It's where adventure lives. Where nature shows off. Where you leave the ordinary world behind and step into something raw, real, and unforgettable. From the moment you leave the road, everything changes. The 4×4 rattles through rugged terrain that GPS doesn't even recognize. The trek pulls you into ancient forests where sunlight filters through leaves like gold dust. Waterfalls appear like secrets, hidden until you're standing right in front of them. And then — the cave.",
        journeys: [
          {
            emoji: "🛻",
            number: "01",
            title: "The Journey",
            tagline: "The road becomes part of the story.",
            description: "4×4 off-roading that's an adventure in itself. Mud, bumps, adrenaline — the road becomes part of the story before the trek even begins.",
            experience: ["4×4 Off-Roading", "Rugged Terrain"]
          },
          {
            emoji: "🌿",
            number: "02",
            title: "The Trek",
            tagline: "Walk through forests that feel prehistoric.",
            description: "Walk through forests that feel prehistoric. Bridges over rushing water. Trails that lead to the unknown, with waterfalls appearing like secrets along the way.",
            experience: ["Forest Trekking", "Bridge Crossing", "Hidden Waterfalls"]
          },
          {
            emoji: "🕳️",
            number: "03",
            title: "The Cave",
            tagline: "Not a walk-through. A journey.",
            description: "Raft on crystal-clear waters beneath ancient limestone. Explore passages that few have seen. Swim in hidden pools glowing in the darkness, beneath limestone cathedrals carved by time itself.",
            experience: ["Cave Exploration", "Bamboo Rafting", "Natural Pools"]
          },
          {
            emoji: "🌊",
            number: "04",
            title: "The Thrill",
            tagline: "Live the adventure.",
            description: "Jump off cliffs into water so pure it feels like liquid glass. Float in natural infinity pools. Sleep under a sky so full of stars you forget the city ever existed.",
            experience: ["Cliff Jumping", "Overnight Camping", "Stargazing"]
          }
        ]
      },

      // ---- "Activities & Facilities" — what visitors can do and what's
      // provided (home page). Each item just needs a short "text". Add,
      // remove, or reword any line the same way as everything else here.
      activitiesFacilities: {
        title: "Activities & Facilities",
        subtitle: "Everything you can do here, and everything we provide",
        activitiesTitle: "Adventure Activities",
        activities: [
          "4×4 Off-Roading",
          "Cave Exploration (700m+)",
          "Cave Cliff Jumping",
          "Bamboo Rafting",
          "Underground Natural Pool Swimming",
          "Chympe Waterfall Visit",
          "Forest Trekking",
          "Bridge Crossing",
          "Overnight Camping"
        ],
        facilitiesTitle: "Facilities Provided",
        facilities: [
          "4×4 Vehicle Pickup & Drop",
          "Homestay (for overnight stays)",
          "Life Jacket for Every Visitor",
          "Certified Local Guide",
          "Basic First Aid Service",
          "Local, Freshly Cooked Food"
        ]
      },

      // ---- "Know Before You Go" — first-time visitor guide (home page) ----
      // This is the plain-English information block for people who have
      // never been to Krem Chympe before. Each card in "cards" needs an
      // "icon" (one of: mappin, calendar, users, backpack, shield, leaf),
      // a "title", and a list of short "items" (bullet points). Add,
      // remove, or reword any card or item the same way as everything
      // else in this file — just keep the commas.
      visitorGuide: {
        title: "Know Before You Go",
        subtitle: "Simple, honest information every first-time visitor should read before booking",
        cards: [
          {
            icon: "mappin",
            title: "How To Reach",
            items: [
              "Nearest big city: Shillong, about 120 km away.",
              "Starting point: Shillong ➡️ East Jaintia Hills ➡️ Brishyrnot ➡️ Krem Chympe waterfall.",
              "From Brishyrnot it's roughly a 7 km forest trek (about 3–4 hours one way) to the cave entrance at khaddum.",
              "There are no signboards on the trail — this is an offbeat place, so a local guide is required, not optional."
            ]
          },
          {
            icon: "calendar",
            title: "Best Time To Visit",
            items: [
              "Best months: October to April.",
              "In this season the river is low and calm, so swimming, rafting and canoeing are much safer.",
              "The trail is dry and less slippery, which makes trekking easier and safer.",
              "Please avoid the monsoon (June to September) — heavy rain floods the river fast, water visibility drops, and cave exploration becomes dangerous."
            ]
          },
          {
            icon: "users",
            title: "Who Can Come",
            items: [
              "You should have moderate to good fitness — this is a real forest trek, not a short walk.",
              "You should be comfortable swimming, since part of the trip involves rafting and swimming through cold cave water.",
              "Recommended age: 16 years and above.",
              "Not recommended if you have claustrophobia, a heart condition, or breathing problems — please check with a doctor if you're unsure, and tell your guide beforehand."
            ]
          },
          {
            icon: "backpack",
            title: "What To Pack",
            items: [
              "Wear quick-dry clothes and water shoes or sandals with a good grip; a wetsuit is a good idea in the cave water.",
              "Bring a dry change of clothes, a towel, and a waterproof bag or pouch for your phone and wallet.",
              "Safety gear such as a helmet, life jacket, and waterproof torch is provided — please ask your guide if you don't see it.",
              "Also pack sunscreen, insect repellent, a small first-aid kit, drinking water, and some snacks for the trek."
            ]
          },
          {
            icon: "shield",
            title: "Safety & Timing",
            items: [
              "Always follow your local guide's instructions — they know the trail, the cave, and the river conditions best.",
              "Start early, around 7–8 AM, so you have enough daylight for the full trip.",
              "Plan for a full day out: 3–4 hours trekking in, 3–4 hours exploring the cave, then the trek back.",
              "Weather in the hills can change quickly, so carry a rain jacket even in the dry season."
            ]
          },
          {
            icon: "leaf",
            title: "Please Respect Nature",
            items: [
              "Carry back everything you bring in — there are no bins on the trail, so please don't litter.",
              "Krem Chympe is home to the world's largest blind cavefish and rare bat colonies found almost nowhere else — please don't touch or disturb any wildlife.",
              "Stay on the path your guide shows you, to protect the forest and the delicate cave floor.",
              "Visitor numbers are deliberately kept low to protect this fragile ecosystem — thank you for helping us keep it that way."
            ]
          }
        ]
      },

      // ---- Packages page header + trust strip ----
      packagesPage: {
        subtitle: "Choose your perfect adventure • 3 curated experiences",
        trustRow: ["Safe & Secure", "Local Guides", "Eco Friendly", "4.9 Rating"]
      },

      // ---- Package cards (Shared Tour / Guide Only) ----
      packages: {
        sharedTour: {
          badge: "Most Popular",
          name: "Shared Package",
          priceUnit: "Per Person",
          features: [
            "4×4 Vehicle Pickup & Drop",
            "Chympe Waterfall Visit",
            "Waterfall and Cave Swimming",
            "700m Cave Exploration",
            "Boat Rafting",
            "Entry Fee, Life Jacket & Basic First Aid",
            "Lunch thali optional",
            "Children under {childFreeAge} free (life jacket & entry fee still apply)"
          ]
        },
        guideOnly: {
          badge: "Guide Only",
          name: "Guide Only",
          priceUnit: "Per Group",
          features: [
            "Certified local guide (mandatory)",
            "Basic first aid kit included"
          ]
        },
        privatePackage: {
          badge: "Private Tour",
          name: "Private Package",
          priceUnit: "Fully customizable",
          features: [
            "Optional 4×4 jeep",
            "lunch thalis",
            "Mandatory local guide",
            "Adventure activities",
            "Bamboo rafting",
            "Cave expedition & cave entry",
            "Swimming (cave & waterfall)",
            "Cliff jumping at Khaddum Fall",
            "Visit to Khaddum Fall (Chympe Fall)",
            "Add overnight camping with bamboo-cooked dishes"
          ]
        }
      },

      // ---- Gallery section ----
      galleryPage: {
        subtitle: "Moments from Krem Chympe",
        filters: ["All", "Cave", "Waterfall", "Camping", "Trek", "Bamboo rafting"],
        viewAllLabel: " View All Photos"
      },

      // ---- Shared Tour booking form text ----
      sharedTourBooking: {
        includedTitle: "Included in your package",
        includesLabel: "Includes:",
        includedItems: [
"Guide",
"Bamboo Rafting",
"Life Jacket",
"Basic First Aid",
"Entry Fee Included",
        "Adventure Activities Include:",
"Shared 4×4 Off-Roading",
"Scenic Forest Drive",
"Short Forest Trek",
"Bridge Viewpoint",
"Bamboo Rafting",
"700m Cave Exploration",
"Cave Cliff Jumping",
"Cave Swimming",
"Khaddum (Chympe) Waterfall Visit",
"Waterfall Swimming"
        ],
        childFreeText: "Note: Children under {childFreeAge} are free of charge, except for a small life jacket ({childJacketFee}) and entry fee ({childEntryFee}).",
        batchText: [
          "Note: One shared batch consists of 8 members.",
          "Advance booking must be completed at least 3 days before the tour.",
          "Booking is confirmed only after advance payment."
        ],
        adultsLabel: "Adults",
        childrenLabel: "Children",
        lunchTitle: "Lunch (optional)",
        lunchPriceUnit: " Per Person",
        lunchSubtitle: "Select your thali(s) and choose the quantity for each.",
        lunchIncludes: [
          "Includes chutney and pickle.",
          "All thali variants are priced equally."
        ]
      },

      // ---- Private Package booking form text ----
      privatePackageBooking: {
        peopleLabel: "Number of People",

        jeepTitle: "4×4 Jeep",
        jeepPriceUnit: " Per Group",
        jeepNote1: "Note: Without the 4×4 jeep, the trekking distance is approximately 20 km (round trip).",
        jeepNote2: "Note: The 4x4 jeep is charged per group, not per person.",
        jeepYesLabel: "yes",
        jeepNoLabel: "No",

        guideTitle: "Local Guide",
        guideNote1: "Note: A local guide is mandatory for all visitors, as this is an offbeat destination. The guide ensures your safety throughout the adventure activities.",
        guideNote2: "Note: The local guide is charged per group, not per person.",
        guideMandatoryLabel: "yes (mandatory)",

        adventureTitle: "Adventure Activities & Facilities",
        adventurePriceUnit: " Per Person",
        adventureIncludesLabel: "Includes:",
        adventureIncludes: [
    "Guide",
    "Bamboo Rafting",
    "Life Jacket",
    "Basic First Aid",
    "Entry Fee Included",
    "Scenic Forest Drive",
    "Forest Trek",
    "Bridge Viewpoint",
    "Private Bamboo Rafting",
    "700m Cave Exploration",
    "Cave Cliff Jumping",
    "Cave Swimming",
    "Khaddum (Chympe) Waterfall Visit",
    "Waterfall Swimming"
],
        adventureNote: "Note: If activities cannot be conducted due to weather or safety conditions, only the entry fee and life jacket fee will be charged.",
        adventureYesLabel: "yes",
        adventureNoLabel: "No",

        lunchTitle: "Lunch",
        lunchPriceUnit: " Per Person",
        lunchSubtitle: "Select your thali(s) and choose the quantity for each.",
        lunchIncludes: "Includes chutney and pickle. All thali variants are priced equally.",
        lunchEachSuffix: " each",

        campingTitle: "Camping",
        campingYesLabel: "yes",
        campingNoLabel: "No",

        campingDetailsTitle: "Camping Details",
        campingDetailsSubtitle: "Please fill in the details below to book your camping experience.",

        tentTitle: "Camping Tent Rental",
        tentPriceUnit: " Per Tent",
        tentIncludes: "Includes: Blanket, Pillows, Camping chairs.",
        tentNote: "Note: One tent can comfortably accommodate 2 people.",
        tentsLabel: "Number of tents",

        campingMealsTitle: "Meals",
        campingMealsPriceUnit: " Per Person",
        campingMealsIncludes: "Includes — Dinner: Veg Thali, Breakfast: 2 servings of Maggi.",
        campingMealsNote: "Note: Vegetarian meals only.",
        campingMealsYesLabel: "yes",
        campingMealsNoLabel: "No",

        overnightGuideTitle: "Overnight Guide",
        overnightGuideNote: "Important Note: An overnight guide is mandatory for all camping bookings, as the campsite is located far from the nearest village. For your safety and assistance, camping without a guide is not permitted. The guide will also prepare your dinner and breakfast.",
        overnightGuideMandatoryLabel: "yes (mandatory)",

        bambooDishesTitle: " Traditional Bamboo Dishes (Zero Oil)",
        bambooDishesDesc: "Available only with camping, as it requires extra preparation time and fresh ingredients."
      },

      // ---- Payment page text ----
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
        badge: "MEGHALAYA — CHYMPE FALL & CAVE ADVENTURE",
        title: "Discover Meghalaya's Hidden Paradise",
        sub: "Krem Chympe is India's 5th-longest cave system, with about 10.5 km of mapped passages (explorers have surveyed close to 19 km so far). A short forest trek from Khaddum Village leads you past the beautiful Chympe (Pieltleng) Waterfall to a hidden cave, an underground lake, golden mineral formations, and rare wildlife found almost nowhere else on Earth — all still untouched by crowds.",
        visitorsLabel: "Visitors",
        duration: "Full-Day Trip (3–4 Hrs Trek Each Way)",
        priceLabel: "Starts ₹1500 Per Guide"
      },

      // Homepage rotating background photos (file names come from KC_IMAGES above)
      backgrounds: [window.KC_IMAGES.heroBg1, window.KC_IMAGES.heroBg2],

      // ---- Guide bio ----
      guide: {
        name: "Senly Suchiang",
        role: "Lead Guide & Conservationist",
        bio: "Born in the hills of Meghalaya, Senly is a local and he has explored Krem Chympe cave and chympe waterfall since childhood. He is a certified caver and guide.",
        image: window.KC_IMAGES.guide
      },

      logoImage: window.KC_IMAGES.logo,

      // Section photos (file names come from KC_IMAGES above)
      sectionImages: {
        heroCave: window.KC_IMAGES.heroCave,
        trekCard: window.KC_IMAGES.trekCard,
        sharedPackageCard: window.KC_IMAGES.caveEntranceCard,
        privatePackageCard: window.KC_IMAGES.privatePackageCard
      },

      // ---- Gallery: category label + photo for each tile ----
      // "span" controls the tile's size in the grid — leave as-is unless
      // you want to change the layout.
      galleryImages: [
        { id: 0, cat: "Cave",      src: window.KC_IMAGES.gallery0New, span: "col-span-8 row-span-2" },
        { id: 1, cat: "Waterfall", src: window.KC_IMAGES.gallery1, span: "col-span-4" },
        { id: 2, cat: "Trek",      src: window.KC_IMAGES.gallery2New, span: "col-span-4" },
        { id: 3, cat: "Camping",   src: window.KC_IMAGES.gallery3New, span: "col-span-4" },
        { id: 4, cat: "Bamboo rafting",     src: window.KC_IMAGES.gallery4, span: "col-span-4" },
        { id: 5, cat: "Cave",      src: window.KC_IMAGES.gallery5, span: "col-span-4" },
        { id: 6, cat: "Cave", src: window.KC_IMAGES.gallery6, span: "col-span-8" },
        { id: 7, cat: "Rock formation",      src: window.KC_IMAGES.gallery7, span: "col-span-4" },
        { id: 8, cat: "Waterfall",      src: window.KC_IMAGES.gallery8, span: "col-span-4" },
        { id: 9, cat: "Camping",   src: window.KC_IMAGES.gallery9, span: "col-span-4" }
      ],

      // ---- Site footer (shown at the very bottom of the home page) ----
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

      // ---- Refund Policy page (opens only when "Refund Policy" is tapped
      // in the footer — it is not part of the normal booking flow). Each
      // section can mix plain paragraphs and bullet lists: give each
      // section a "blocks" list where every block is either
      // { type: "text", text: "..." } or
      // { type: "list", lead: "optional line before the list", items: [...] }.
      // Reword or add to any of it the same way as everything else here.
      refundPolicy: {
        title: "Refund Policy",
        intro: "At Krem Chympe, we understand that plans can change and that outdoor adventures can sometimes be affected by weather and natural conditions.",
        sections: [
          {
            number: "1",
            heading: "Cancellation by Krem Chympe",
            blocks: [
              { type: "text", text: "Your safety comes first." },
              { type: "text", text: "Krem Chympe may cancel, postpone or modify an activity if heavy rainfall, flooding, high water levels, unsafe cave conditions, dangerous trails or other natural circumstances make the experience unsafe." },
              { type: "list", lead: "In such cases, you may be offered:", items: [
                "Rescheduling to another available date; or",
                "A refund for the cancelled service where rescheduling or an appropriate alternative is not possible."
              ] },
              { type: "text", text: "The final decision to proceed with an activity rests with the local guide/operator when safety is concerned." }
            ]
          },
          {
            number: "2",
            heading: "Partial Activity Cancellation",
            blocks: [
              { type: "text", text: "If only part of your booking is affected by weather, safety or other unavoidable circumstances, unaffected activities may continue." },
              { type: "list", lead: "For the cancelled activity, Krem Chympe may offer:", items: [
                "An alternative activity;",
                "Rescheduling; or",
                "A refund for the affected portion, where applicable."
              ] },
              { type: "text", text: "For example, if water conditions make bamboo rafting or cave water activities unsafe, other suitable activities may still continue." }
            ]
          },
          {
            number: "3",
            heading: "Weather & Monsoon",
            blocks: [
              { type: "text", text: "Krem Chympe is a natural adventure destination where weather and water conditions can change rapidly." },
              { type: "text", text: "During heavy rainfall, water levels around and inside the cave may rise, making certain activities unsafe." },
              { type: "text", text: "If an activity is stopped or cancelled because continuing would create a safety risk, it will be handled under the Cancellation by Krem Chympe section of this policy." }
            ]
          },
          {
            number: "4",
            heading: "Homestay, Camping & Additional Services",
            blocks: [
              { type: "text", text: "Bookings may include services such as:" },
              { type: "list", items: [
                "Homestay",
                "4×4 pickup and drop",
                "Guide",
                "Camping equipment",
                "Overnight guide",
                "Local food",
                "Life jackets and other equipment"
              ] },
              { type: "text", text: "Refund eligibility for these services may depend on whether the service has already been provided or whether non-refundable arrangements have already been made." },
              { type: "text", text: "Any specific conditions will be communicated during the booking process where applicable." }
            ]
          },
          {
            number: "5",
            heading: "Refund Processing",
            blocks: [
              { type: "text", text: "Approved refunds will normally be returned through the original payment method." },
              { type: "text", text: "The time required for the refund to appear in your account may depend on the bank or payment provider." }
            ]
          },
          {
            number: "6",
            heading: "How to Request a Cancellation",
            blocks: [
              { type: "text", text: "To cancel your booking, contact Krem Chympe using the contact details provided on the website or your booking confirmation." },
              { type: "list", lead: "Please provide:", items: [
                "Booking name",
                "Booking/reference number",
                "Visit date",
                "Contact number",
                "Cancellation request"
              ] },
              { type: "text", text: "Your cancellation will be considered based on the time the cancellation request is received." }
            ]
          },
          {
            number: "7",
            heading: "Important Safety Notice",
            blocks: [
              { type: "text", text: "Krem Chympe is an adventure destination involving trekking, cave exploration, water activities, off-roading, camping and other outdoor experiences." },
              { type: "text", text: "Safety takes priority over completing an itinerary." },
              { type: "text", text: "If a guide or operator determines that an activity is unsafe, the activity may be changed, postponed or cancelled even if it was originally included in your booking." },
              { type: "text", text: "By booking with Krem Chympe, you acknowledge and accept this condition." }
            ]
          }
        ],
        promiseTitle: "Our Promise",
        promiseText: [
          "We would rather change an adventure than compromise your safety.",
          "When nature changes the plan, we'll do our best to provide a suitable alternative, reschedule your experience, or provide an applicable refund."
        ],
        // ---- WhatsApp refund request (bottom of this page) ----
        // A visitor MUST type in their booking reference number before the
        // "Chat With Us" button will work — this is the only way we can
        // require a real reference number on a website with no backend/
        // login system. {referenceNumber} in the message is automatically
        // replaced with whatever the visitor types into that box.
        whatsapp: {
          buttonLabel: "Chat With Us For A Refund",
          referenceLabel: "Your Booking Reference Number",
          referencePlaceholder: "e.g. 0001",
          referenceHelperNote: "This was given to you on WhatsApp right after you booked. Refunds can only be requested with a valid reference number — if you don't have one, you haven't completed a booking with us.",
          referenceMissingError: "Please enter your booking reference number first — this was sent to you on WhatsApp after you booked.",
          message: "Hello Krem Chympe, I would like to request a refund / cancellation for my booking.\n\nBooking Reference Number: {referenceNumber}\nBooking name: \nVisit date: \nContact number: \nReason for refund request: "
        }
      },

      // ---- Fixed interface words (button labels, headings, form labels) ----
      // These used to be hard-coded inside the app itself. Now every one of
      // them reads from here first, so you can reword any of them the same
      // way as everything else above — change the text, save, refresh.
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
        mealOptions: " Meal Options",
        noVehicleLabel: "No Vehicle",
        freeWalkLabel: "Free / Walk",
        rainyHalfWayLabel: "Rainy Half Way",
        winterFullWayLabel: "Winter Full Way",

        visitors: " Visitors",
        duration: " Duration",
        price: " Price",
        visitorRange: "1 - 5 People",

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
        thankYouMiddle: "! Your adventure is secured. We have received advance ₹",
        thankYouBalanceMid: ". Balance ₹",
        thankYouSuffix: " to be paid on arrival.",

        ourStory: "Our Story",
        meetYourGuide: "Meet Your Guide",
        ourGallery: "Our Gallery",
        ourAdventurePackages: "Our Adventure Packages",
        pricingFacilities: "Pricing & Facilities",
        totalCalculator: "Total Calculator",
        totalAmount: "Total Amount",

        statForestTrailLabel: "Forest Trail",
        statAverageTrekLabel: "Average Trek",
        statSpeciesLabel: "Species",
        statGoogleRatingLabel: "Visitors Rating"
      }
    };

  // ============================================================
  // 🛑 DO NOT EDIT ANYTHING BELOW THIS LINE
  // ============================================================
  // This part double-checks your edits above and shows a clear
  // warning banner on the website if something looks wrong,
  // instead of the site just breaking silently.
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
  need(window.KC_PRICES, "sharedTour.lunchThaliPrice", "number");
  need(window.KC_PRICES, "privatePackage.jeep", "number");
  need(window.KC_PRICES, "privatePackage.guide", "number");
  need(window.KC_PRICES, "childFreeAge", "number");
  need(window.KC_PRICES, "childJacketFee", "number");
  need(window.KC_PRICES, "childEntryFee", "number");
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
