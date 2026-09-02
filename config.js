/* ============================================================
   ✏️  MAIN HOME PAGE (root) — EDIT-THIS-FILE
   ============================================================

   THIS IS THE ONLY FILE YOU NEED TO OPEN TO CHANGE:
     • Photos                (window.KC_IMAGES  below)
     • Text on the website   (window.KC_CONTENT below)

   This is the home page shown at the site's root URL — the one
   with the "Destinations" cards linking out to Krem Chympe and
   Wilderness Expedition. It has its own siteName/siteSub/logo,
   separate from krem-chympe/config.js and
   wilderness-expedition/config.js, so you can brand it
   differently from either destination page.

   There's no KC_PRICES here — this page has no booking form of
   its own, just links to the two destination sites.

   You do NOT need to open index.html or app.js for any of this.
   Leave those files alone.

   ------------------------------------------------------------
   HOW TO EDIT SAFELY — read this once before touching anything
   ------------------------------------------------------------
   1. Only change the part AFTER the colon ( : ).
      Example:  siteName: "TEAM CHYMPE EXPLORA",
                           ^^^^^^^^^^^^^^^^^^^^^ change this text only.
                Never delete or rename the word before the colon
                (e.g. "siteName") — the website looks for that
                exact word.

   2. Text (words/sentences) needs quote marks around it.
         Correct:    siteName: "TEAM CHYMPE EXPLORA",
         Wrong:      siteName: TEAM CHYMPE EXPLORA,

   3. Every line (except the very last one in a { } group) must
      end with a comma  ,   — this is the single most common
      mistake. If the site breaks after an edit, check that you
      didn't delete a comma or accidentally leave a trailing
      comma after the LAST item in a group.

   4. When you're done editing, save the file and push/upload it
      to GitHub (or wherever this site is deployed) the same way
      as before.

   5. If something looks wrong after you publish, a red banner
      will appear at the top of the site telling you this file
      has a mistake in it, instead of the site just going blank.
      Undo your last change, save, and republish.

   ⚠️ Note: this site also pulls in any changes made through the
   Telegram admin bot (live-content.js merges those on top of
   whatever is set here). If a field here doesn't seem to be
   taking effect, check whether the bot has an override saved for
   it — Main Menu → 🖼️ Change Photos / ✏️ Edit Website Text →
   🏠 Home site.
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // 📝 SECTION 1 — TEXT CONTENT
  // Every heading, paragraph, and label on the home page.
  // ============================================================
  window.KC_CONTENT = {
  "siteName": "TEAM EXPLO ERA",
  "siteSub": "ADVENTURE ERA AWAITS",
  "whatsappNumber": "916001877518",
  "logoImage": "logo.png",
  "backgroundImage": "Blue watefall.jpg",
  "instagram": "https://www.instagram.com/unexplored_meghalaya?igsh=ZHZpODB3aXl0bXBu",
  "nav": {
    "items": [
      {
        "label": "Home",
        "id": "home"
      },
      {
        "label": "Destinations",
        "id": "destinations"
      },
      {
        "label": "Experiences",
        "id": "experiences"
      },
      {
        "label": "Booking",
        "id": "booking"
      },
      {
        "label": "About Us",
        "id": "about"
      },
      {
        "label": "Ratings",
        "id": "ratings"
      }
    ]
  },
  "hero": {
    "badge": "MEGHALAYA — WATERFALLS, CAVES & WILDERNESS TRAILS",
    "title": "Your Gateway to Meghalaya's Untouched Corners",
    "sub": "From a hidden waterfall and cave system a short trek from Khaddum Village, to a 6-day wilderness expedition into untouched landscapes — we design guided trips into Meghalaya's least-visited corners.",
    "quote": "Symphony in the mist.",
    "videoUrl": "https://github.com/Chympe-explora/team-eplo-era-site/main/hero-video.mp4",
    "videoEnabled": true,
    "fallbackImage": "Trek Trail Mist.jpg",
    "enabled": true,
    "discoverLabel": "Discover",
    "discoverTargetId": "destinations"
  },
  "notice": {
    "enabled": false,
    "title": "PUBLIC NOTICE",
    "subtitle": "",
    "text": "",
    "buttonText": "Got it",
    "iconBg": "#2E8B57",
    "showAgain": ""
  },
  "visitorsRating": {
    "trustedText": "Trusted by 100+",
    "travelersText": "Travelers",
    "googleRatingText": "Visitors Rating 4.9",
    "safetyCertifiedText": "Safety Certified",
    "ecoTourismText": "Eco Tourism"
  },
  "destinations": {
    "title": "Destinations",
    "subtitle": "Two ways to explore Meghalaya with us",
    "items": [
      {
        "id": "krem-chympe",
        "name": "Krem Chympe Waterfall & Cave",
        "image": "Cave Entrance Falls.jpg",
        "description": "Book a guided package tour to Krem Chympe. A forest trek from Khaddum Village leads to the Chympe (Pieltleng) Waterfall and into the Krem Chympe cave system — one of Meghalaya's longest, with underground pools, golden mineral formations, and rare cave wildlife.",
        "buttonLabel": "Book Now",
        "link": "krem-chympe/index.html"
      },
      {
        "id": "wilderness-expedition",
        "name": "Wilderness Expedition",
        "image": "Trek Trail Mist.jpg",
        "description": "Book the 6-day Wilderness Expedition — a multi-day journey deep into Meghalaya's backcountry, trekking to waterfalls and landscapes most visitors never reach, with camping along the way.",
        "buttonLabel": "Book Now",
        "link": "wilderness-expedition/index.html"
      }
    ]
  },
  "experiences": {
    "title": "THE EXPERIENCE",
    "blocks": [
      {
        "type": "subheading",
        "text": "Not a Tour. Not a Trip. A Homecoming."
      },
      {
        "type": "paragraph",
        "text": "Most travel shows you things. This experience shows you yourself."
      },
      {
        "type": "paragraph",
        "text": "From the moment you leave the road behind, you'll feel something shift. The air gets thicker. The sounds get wilder. And somewhere between the first cave entrance and the first waterfall spray, you'll realize you've stepped into a world that doesn't care about your Wi-Fi signal or your email inbox."
      },
      {
        "type": "paragraph",
        "text": "This is what awaits you."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "🌑 The Cave Experience"
      },
      {
        "type": "subheading",
        "text": "Step Into the Unknown"
      },
      {
        "type": "paragraph",
        "text": "700 meters of limestone passage. Carved by water over millions of years. Dark. Silent. Ancient."
      },
      {
        "type": "paragraph",
        "text": "You'll wade through underground streams. You'll duck beneath limestone arches. You'll stand in chambers that have never seen sunlight. And when you turn off your torch—just for a moment—you'll experience a darkness so complete, so absolute, that you'll hear your own heartbeat for the first time in years."
      },
      {
        "type": "paragraph",
        "text": "This isn't a tourist cave with handrails and lights. This is the real thing."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "💦 The Waterfall Experience"
      },
      {
        "type": "subheading",
        "text": "Stand Where Thunder Lives"
      },
      {
        "type": "paragraph",
        "text": "Krem Chympe Falls isn't something you watch from a viewpoint. It's something you feel."
      },
      {
        "type": "paragraph",
        "text": "The spray hits your face before you see it. The roar fills your chest. And when you step into that pool—cold, powerful, alive—you'll understand why our ancestors called these waters sacred."
      },
      {
        "type": "paragraph",
        "text": "Swim beneath the cascade. Let it pound your shoulders. Let it wash away every stress you brought with you."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "🌿 The Jungle Experience"
      },
      {
        "type": "subheading",
        "text": "Remember What It Means to Be Alive"
      },
      {
        "type": "paragraph",
        "text": "No roads. No signs. No marked trails."
      },
      {
        "type": "paragraph",
        "text": "Just you, your guide, and a forest that has stood here for centuries."
      },
      {
        "type": "paragraph",
        "text": "You'll learn to read the leaves. To follow animal tracks. To identify edible plants. To build shelter. To start fire without a lighter. You'll sleep under a canopy of stars so bright, so dense, that you'll forget city lights ever existed."
      },
      {
        "type": "paragraph",
        "text": "You won't just walk through the jungle. You'll become part of it."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "🏡 The Homestay Experience"
      },
      {
        "type": "subheading",
        "text": "Not a Guest. Family."
      },
      {
        "type": "paragraph",
        "text": "Hotels have walls. Homestays have hearts."
      },
      {
        "type": "paragraph",
        "text": "You'll sleep in our homes. Eat meals cooked in our kitchens. Share stories around our fires. You'll taste food made with ingredients grown in our gardens—not flown in from somewhere else."
      },
      {
        "type": "paragraph",
        "text": "You'll wake to the sound of our village coming alive. Children laughing. Chickens clucking. The distant roar of the falls. And you'll realize that some of the best travel memories aren't made in famous places—they're made in small ones."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "🔥 The Survival Experience"
      },
      {
        "type": "subheading",
        "text": "Find Out What You're Made Of"
      },
      {
        "type": "paragraph",
        "text": "This is the one that changes people."
      },
      {
        "type": "paragraph",
        "text": "Five nights in the wilderness. No shortcuts. No backups. Just you, your team, and the raw, untamed jungle."
      },
      {
        "type": "paragraph",
        "text": "You'll navigate without GPS. You'll cook over open fires. You'll sleep under tarps you pitched yourself. You'll face the elements—rain, heat, cold—and discover that you're stronger than you ever knew."
      },
      {
        "type": "paragraph",
        "text": "Because the jungle doesn't care about your excuses."
      },
      {
        "type": "paragraph",
        "text": "It only cares if you survive."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "🚣 The Water Experience"
      },
      {
        "type": "subheading",
        "text": "Glide Where Few Have Glided"
      },
      {
        "type": "paragraph",
        "text": "Boat rafting across pristine waters. The falls towering above. The cave mouth gaping ahead. The reflection of the cliffs rippling beneath you."
      },
      {
        "type": "paragraph",
        "text": "This isn't a theme park ride. It's ancient. Unspoiled. Yours."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "✨ The Night Experience"
      },
      {
        "type": "subheading",
        "text": "Remember the Stars"
      },
      {
        "type": "paragraph",
        "text": "No city lights. No light pollution. No distractions."
      },
      {
        "type": "paragraph",
        "text": "Just you, a campfire, and a sky so packed with stars that it feels like you could reach up and scoop them out."
      },
      {
        "type": "paragraph",
        "text": "You'll hear the jungle come alive at night. The insects. The birds. The distant calls of creatures you can't name. And you'll realize that darkness isn't scary—it's beautiful."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "🍛 The Food Experience"
      },
      {
        "type": "subheading",
        "text": "Taste Our Home"
      },
      {
        "type": "paragraph",
        "text": "Simple. Honest. Made with love."
      },
      {
        "type": "paragraph",
        "text": "Meals cooked over open fires. Local ingredients. Traditional recipes passed down through generations."
      },
      {
        "type": "paragraph",
        "text": "You'll eat with your hands. You'll share from common plates. You'll taste flavors that don't exist in any city restaurant."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "What You Take Home"
      },
      {
        "type": "paragraph",
        "text": "Not souvenirs. Not photos."
      },
      {
        "type": "paragraph",
        "text": "You'll take home:"
      },
      {
        "type": "list",
        "items": [
          "A deeper knowledge of your own strength",
          "Stories that make strangers lean in at dinner parties",
          "Friendships that cross borders and languages",
          "A longing for simplicity that will never quite leave you",
          "A piece of Meghalaya that now lives in your heart"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "This Is What It Feels Like"
      },
      {
        "type": "paragraph",
        "text": "To be awake. To be alive. To be truly, completely present."
      }
    ]
  },
  "booking": {
    "title": "WHY BOOK US?",
    "subtitle": "Book Direct. Skip the Middleman.",
    "intro": "You've done the research. You've compared the options. Now here's why booking straight through us is the smartest move you'll make.",
    "reasons": [
      {
        "emoji": "💰",
        "title": "Best Price. No Surprises.",
        "description": "No third-party markups. No hidden fees. No \"convenience charges\" that feel anything but convenient. When you book direct, you get the best possible rate—period. What we quote is what you pay."
      },
      {
        "emoji": "📞",
        "title": "Talk to Us. Not a Bot.",
        "description": "Have a question at 2 AM? Worried about your gear? Want to know if you can handle the altitude? When you book through our website, you're talking directly to our local team. People who've walked the trail. People who know the jungle like their own backyard. Not a call center in another time zone."
      },
      {
        "emoji": "🌿",
        "title": "Exclusive Access. Limited Spots.",
        "description": "We keep our groups intentionally small—never more than 8 people. Book direct and you get first pick of departure dates, not the leftovers. Because this experience was never meant to be mass-produced."
      },
      {
        "emoji": "🔄",
        "title": "Book with Confidence. Change with Ease.",
        "description": "Life happens. We get it. That's why we offer free date changes and a flexible cancellation policy when you book direct. No endless forms. No runaround. Just a real person on the other end who actually wants to help."
      },
      {
        "emoji": "🤝",
        "title": "100% Locally-Led. Zero Corporate Overlay.",
        "description": "This isn't a franchise. It's not a global chain with a logo plastered on a jeep. We're a small, local team who lives and breathes this jungle. When you book with us, your money stays here. Your experience is guided by people who call this place home. And your adventure is authentic—not manufactured."
      }
    ],
    "closing": [
      "Still have questions? So did everyone who's ever gone. The difference is they picked up the phone and asked.",
      "Reach out to us directly. We're here. We're real. And we can't wait to meet you."
    ]
  },
  "about": {
    "title": "ABOUT US",
    "blocks": [
      {
        "type": "heading",
        "text": "Meet Team Explo Era"
      },
      {
        "type": "paragraph",
        "text": "We weren't born in a boardroom. We were born in these hills."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "We Are Local. We Are Family. We Are Your Guides."
      },
      {
        "type": "paragraph",
        "text": "Team Explo Era isn't a corporation with a logo and a mission statement written by consultants. We're a group of friends, brothers, cousins, and neighbors who grew up swimming in the pools of Krem Chympe, climbing these limestone cliffs, and mapping these caves before they were ever on any tourist map."
      },
      {
        "type": "paragraph",
        "text": "This isn't our job. This is our home."
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "What We Offer:"
      },
      {
        "type": "list",
        "items": [
          "🏞️ Krem Chympe Falls & Caves – Explore ancient limestone caves carved by water over millennia. Wade through underground streams. Stand beneath waterfalls that few outsiders have ever seen.",
          "🌿 Wilderness Expedition – Real jungle survival. Not a theme park. Learn to read the forest, build shelter, identify plants, and navigate like the locals do.",
          "🏡 Homestay Experience – Sleep in our homes. Eat our food. Hear our stories. Not in a hotel. Not in a resort. In the heart of our community.",
          "🔥 Real Connection – No scripts. No rehearsed performances. Just us, sharing our world with you."
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "heading",
        "text": "Our Promise: Tourism That Gives Back"
      },
      {
        "type": "paragraph",
        "text": "We've watched too many places become playgrounds for outsiders while the locals get left behind. We refuse to let that happen here."
      },
      {
        "type": "paragraph",
        "text": "We're building something different."
      },
      {
        "type": "list",
        "items": [
          "Eco-friendly – Every trail we clear. Every cave we open. Every guest we host. We do it with minimal impact. We clean more than we leave behind.",
          "Community-driven – Your visit supports our families, our schools, our future. Not a corporation in a faraway city.",
          "Sustainable – We're not here for a quick buck. We're here to build something that lasts. For our children. For yours. For this land that has given us everything.",
          "Local knowledge – You won't get a scripted tour. You'll get the real stories. The ones passed down through generations. The ones that don't exist in any guidebook."
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "paragraph",
        "text": "We don't want you to just see our home."
      },
      {
        "type": "paragraph",
        "text": "We want you to feel it. Taste it. Breathe it."
      },
      {
        "type": "paragraph",
        "text": "We want you to leave with more than photos. We want you to leave with a piece of this place in your heart."
      },
      {
        "type": "paragraph",
        "text": "And we want you to come back."
      },
      {
        "type": "paragraph",
        "text": "Because when you visit us, you're not a tourist. You're family."
      },
      {
        "type": "divider"
      },
      {
        "type": "paragraph",
        "text": "Welcome to Explo Era. Welcome to our world."
      }
    ]
  },
  "footer": {
    "brandName": "Team explo era",
    "locationLine": "Brishyrnot, Hno: 34, Near Football Ground, Po: Lumshonong, East Jaintia Hills, Meghalaya, 793000, India",
    "contactTitle": "Contact Us",
    "phone": "+91 8787679579",
    "email": "chympeexplora@gmail.com",
    "followTitle": "Follow Us On",
    "importantLinkTitle": "Important Link",
    "refundPolicyLabel": "Refund Policy",
    "copyright": "Copyright © Team explo era. All rights reserved."
  },
  "refundPolicy": {
    "title": "Refund Policy",
    "intro": "At Team explo era, we understand that plans can change and that outdoor adventures can sometimes be affected by weather and natural conditions.",
    "sections": [
      {
        "number": "1",
        "heading": "Cancellation by Team Chympe Explora",
        "blocks": [
          {
            "type": "text",
            "text": "Your safety comes first."
          },
          {
            "type": "text",
            "text": "We may cancel, postpone or modify an activity if heavy rainfall, flooding, high water levels, unsafe trail or cave conditions, or other natural circumstances make the experience unsafe."
          },
          {
            "type": "list",
            "lead": "In such cases, you may be offered:",
            "items": [
              "Rescheduling to another available date; or",
              "A refund for the cancelled service where rescheduling or an appropriate alternative is not possible."
            ]
          },
          {
            "type": "text",
            "text": "The final decision to proceed with an activity rests with the local guide/operator when safety is concerned."
          }
        ]
      },
      {
        "number": "2",
        "heading": "Partial Activity Cancellation",
        "blocks": [
          {
            "type": "text",
            "text": "If only part of your booking is affected by weather, safety or other unavoidable circumstances, unaffected activities may continue."
          },
          {
            "type": "list",
            "lead": "For the cancelled activity, we may offer:",
            "items": [
              "An alternative activity;",
              "Rescheduling; or",
              "A refund for the affected portion, where applicable."
            ]
          },
          {
            "type": "text",
            "text": "For example, if water conditions make bamboo rafting or cave water activities unsafe, other suitable activities may still continue."
          }
        ]
      },
      {
        "number": "3",
        "heading": "Weather & Monsoon",
        "blocks": [
          {
            "type": "text",
            "text": "Both Krem Chympe and the Wilderness Expedition are natural adventure destinations where weather and water conditions can change rapidly."
          },
          {
            "type": "text",
            "text": "During heavy rainfall, water levels around trails, rivers and cave systems may rise, making certain activities unsafe."
          },
          {
            "type": "text",
            "text": "If an activity is stopped or cancelled because continuing would create a safety risk, it will be handled under the Cancellation section of this policy."
          }
        ]
      },
      {
        "number": "4",
        "heading": "Homestay, Camping & Additional Services",
        "blocks": [
          {
            "type": "text",
            "text": "Bookings may include services such as:"
          },
          {
            "type": "list",
            "items": [
              "Homestay",
              "4×4 pickup and drop",
              "Guide",
              "Camping equipment",
              "Overnight guide",
              "Local food",
              "Life jackets and other equipment"
            ]
          },
          {
            "type": "text",
            "text": "Refund eligibility for these services may depend on whether the service has already been provided or whether non-refundable arrangements have already been made."
          },
          {
            "type": "text",
            "text": "Any specific conditions will be communicated during the booking process where applicable."
          }
        ]
      },
      {
        "number": "5",
        "heading": "Refund Processing",
        "blocks": [
          {
            "type": "text",
            "text": "Approved refunds will normally be returned through the original payment method."
          },
          {
            "type": "text",
            "text": "The time required for the refund to appear in your account may depend on the bank or payment provider."
          }
        ]
      },
      {
        "number": "6",
        "heading": "How to Request a Cancellation",
        "blocks": [
          {
            "type": "text",
            "text": "To cancel your booking, contact us using the contact details provided on the website or your booking confirmation."
          },
          {
            "type": "list",
            "lead": "Please provide:",
            "items": [
              "Booking name",
              "Booking/reference number",
              "Visit date",
              "Contact number",
              "Cancellation request"
            ]
          },
          {
            "type": "text",
            "text": "Your cancellation will be considered based on the time the cancellation request is received."
          }
        ]
      },
      {
        "number": "7",
        "heading": "Important Safety Notice",
        "blocks": [
          {
            "type": "text",
            "text": "Our trips involve trekking, cave exploration, water activities, off-roading, camping and other outdoor experiences."
          },
          {
            "type": "text",
            "text": "Safety takes priority over completing an itinerary."
          },
          {
            "type": "text",
            "text": "If a guide or operator determines that an activity is unsafe, the activity may be changed, postponed or cancelled even if it was originally included in your booking."
          },
          {
            "type": "text",
            "text": "By booking with us, you acknowledge and accept this condition."
          }
        ]
      }
    ],
    "promiseTitle": "Our Promise",
    "promiseText": [
      "We would rather change an adventure than compromise your safety.",
      "When nature changes the plan, we'll do our best to provide a suitable alternative, reschedule your experience, or provide an applicable refund."
    ]
  }
};

  // ============================================================
  // 🖼️  SECTION 2 — PHOTOS
  // Every "..." below is a placeholder graphic — see the note at
  // the top of this file. Replace the filename with your own real
  // photo once you upload it into this same folder.
  // ============================================================
  window.KC_IMAGES = {
  "heroBg": "Blue watefall.jpg",
  "logo": "logo.png",
  "kremChympeCard": "Cave Entrance Falls.jpg",
  "wildernessCard": "Trek Trail Mist.jpg",
  "exp1": "Cave diving.jpg",
  "exp2": "Camping Deck View.jpg",
  "exp3": "Rafting.jpg",
  "exp4": "Trekking.jpg",
  "exp5": "Rock formations.jpg",
  "exp6": "Happy waterfall.jpg"
};
})();
