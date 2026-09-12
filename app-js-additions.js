/**
 * CODE ADDITIONS FOR app.js
 * 
 * WHERE TO ADD THESE:
 * 1. Add VideoHero and NoticePopup components after the icon definitions (around line 55)
 * 2. Add showNotice state to the App function (around line 81)
 * 3. Update the main return statement to render VideoHero and NoticePopup
 */

// ===== ADD THESE COMPONENTS (after icon definitions, around line 55) =====

/**
 * VideoHero Component
 * Full-width video background with brand logo and Book Now button
 * 
 * Props:
 *   - hero: { videoUrl, fallbackImage } from CONTENT
 *   - logo: logo image URL
 *   - siteId: "root" | "krem-chympe" | "wilderness-expedition"
 *   - onBookNow: callback when Book Now is clicked
 */
function VideoHero(props) {
  var videoUrl = (props.hero && props.hero.videoUrl) || "";
  var fallbackImage = (props.hero && props.hero.fallbackImage) || "Trek Trail Mist.jpg";
  var logoUrl = props.logo || "logo.png";
  var siteId = props.siteId || "root";
  
  // Construct proper image path based on site
  var imagePath = siteId && siteId !== "root" 
    ? "/" + siteId + "/" + fallbackImage 
    : "/" + fallbackImage;
  
  return h(
    "div",
    {
      className: "relative w-full h-screen bg-cover bg-center overflow-hidden flex flex-col",
      style: {
        backgroundImage: "url('" + imagePath + "')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover"
      }
    },
    
    // Video element (overlaid on background, with lower opacity)
    videoUrl && h("video", {
      autoPlay: true,
      muted: true,
      loop: true,
      playsInline: true,
      className: "absolute inset-0 w-full h-full object-cover",
      style: { opacity: 0.85 },
      onError: function() {
        // If video fails to load, the background image will show instead
        console.warn("Video failed to load, using fallback image");
      }
    }, 
      h("source", { src: videoUrl, type: "video/mp4" })
    ),
    
    // Dark overlay for better text readability over video
    h("div", { className: "absolute inset-0 bg-black/30 z-[1]" }),
    
    // Content container (centered, overlaid on video)
    h(
      "div",
      {
        className: "relative z-10 flex flex-col items-center justify-between h-full p-6 md:p-10 md:p-12"
      },
      
      // TOP: Brand Logo
      h(
        "div",
        { 
          className: "flex-shrink-0 pt-4 md:pt-8"
        },
        h("img", {
          src: logoUrl,
          alt: "Team Explo Era",
          className: "h-14 md:h-20 lg:h-24 object-contain drop-shadow-lg"
        })
      ),
      
      // MIDDLE: Book Now Button (centered vertically)
      h(
        "div",
        { className: "flex-grow flex items-center justify-center px-4" },
        h(
          "button",
          {
            onClick: props.onBookNow,
            className: "bg-white text-gray-900 font-bold px-10 md:px-14 py-4 md:py-5 rounded-full shadow-xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-200 text-base md:text-lg lg:text-xl whitespace-nowrap"
          },
          "Book Now"
        )
      ),
      
      // BOTTOM: Empty spacer (for visual balance)
      h("div", { className: "flex-shrink-0 h-8" })
    )
  );
}

/**
 * NoticePopup Component
 * Modal popup displayed to new visitors on the main home page
 * Stores close state in localStorage so it only shows once
 * 
 * Props:
 *   - notice: { enabled, title, subtitle, text, buttonText, iconBg } from CONTENT
 *   - logo: logo image URL
 *   - onClose: callback when user closes the popup
 */
function NoticePopup(props) {
  var onClose = props.onClose;
  var notice = props.notice || {};
  
  // Don't render if notice is disabled
  if (!notice || !notice.enabled) return null;
  
  return h(
    "div",
    {
      className: "fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm",
      onClick: onClose // Close when clicking outside the modal
    },
    h(
      "div",
      {
        className: "bg-white rounded-3xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in-95 duration-300",
        onClick: function(e) { 
          e.stopPropagation(); // Don't close when clicking the modal itself
        }
      },
      
      // CLOSE BUTTON (X in top-right)
      h(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-2xl transition-colors",
          aria-label: "Close"
        },
        "✕"
      ),
      
      // MODAL CONTENT
      h(
        "div",
        { className: "p-6 md:p-8 text-center" },
        
        // LOGO (if available)
        h("img", {
          src: props.logo || "logo.png",
          alt: "Logo",
          className: "h-12 md:h-14 object-contain mx-auto mb-5",
          onError: function(e) {
            // If logo fails, just hide it
            e.target.style.display = "none";
          }
        }),
        
        // TITLE
        h(
          "h2",
          { 
            className: "text-lg md:text-2xl font-bold text-gray-900 mb-2"
          },
          notice.title || "PUBLIC NOTICE"
        ),
        
        // SUBTITLE (optional, smaller text)
        notice.subtitle && h(
          "p",
          { className: "text-sm md:text-base text-gray-600 font-semibold mb-4" },
          notice.subtitle
        ),
        
        // MAIN TEXT (with line breaks preserved)
        h(
          "div",
          {
            className: "text-gray-700 text-sm md:text-base leading-relaxed mb-6 whitespace-pre-wrap font-normal"
          },
          notice.text || ""
        ),
        
        // ACTION BUTTON
        h(
          "button",
          {
            onClick: onClose,
            style: { 
              backgroundColor: notice.iconBg || "#2E8B57",
              color: "#fff"
            },
            className: "w-full font-bold py-3 md:py-4 rounded-full hover:opacity-90 transition-opacity duration-200 text-sm md:text-base"
          },
          notice.buttonText || "Got it"
        )
      )
    )
  );
}

// ===== UPDATE APP FUNCTION (around line 81) =====

/**
 * CHANGES TO App() FUNCTION:
 * 
 * 1. Add these state hooks after the existing menuState and pageState:
 */

function App() {
  var menuState = useState(false); 
  var mobileMenuOpen = menuState[0], setMobileMenuOpen = menuState[1];
  
  var pageState = useState("home"); 
  var page = pageState[0], setPage = pageState[1];
  
  // ← ADD THIS NEW STATE FOR NOTICE POPUP:
  var noticeState = useState(function() {
    // Check if user already closed the notice
    // (only shows once per browser/device)
    if (typeof localStorage !== "undefined") {
      var isClosed = localStorage.getItem("era_notice_closed") === "true";
      return !isClosed; // Return true if should show, false if already closed
    }
    return true; // Show by default if localStorage unavailable
  });
  var showNotice = noticeState[0], setShowNotice = noticeState[1];
  
  // Callback to close notice and persist the choice
  function closeNotice() {
    setShowNotice(false);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("era_notice_closed", "true");
    }
  }
  
  // ... rest of App function continues ...
  
  // ===== IN THE MAIN RETURN STATEMENT =====
  // 
  // Add VideoHero and NoticePopup before the header and other content.
  // The structure should be:
  //
  // h("div", { className: "..." },
  //   
  //   // RENDER VIDEO HERO (on home page of all sites)
  //   page === "home" && h(
  //     VideoHero,
  //     {
  //       hero: CONTENT.hero,
  //       logo: CONTENT.header && CONTENT.header.logo,
  //       siteId: window.KC_SITE_ID,
  //       onBookNow: function() {
  //         setPage("booking");
  //         window.scrollTo(0, 0);
  //       }
  //     }
  //   ),
  //   
  //   // RENDER NOTICE POPUP (only on main home page, only if should show)
  //   page === "home" && window.KC_SITE_ID === "root" && showNotice && h(
  //     NoticePopup,
  //     {
  //       notice: CONTENT.notice,
  //       logo: CONTENT.header && CONTENT.header.logo,
  //       onClose: closeNotice
  //     }
  //   ),
  //   
  //   // Header, navigation, etc.
  //   // ... rest of page content ...
  // )
}

// ===== EXAMPLE: Full render structure =====
/*

In the App function's return statement:

return h(
  "div",
  { className: "min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white" },
  
  // VIDEO HERO (all home pages)
  page === "home" && h(VideoHero, {
    hero: CONTENT.hero,
    logo: CONTENT.header && CONTENT.header.logo,
    siteId: window.KC_SITE_ID,
    onBookNow: function() { setPage("booking"); window.scrollTo(0, 0); }
  }),
  
  // NOTICE POPUP (main home only, once per visitor)
  page === "home" && window.KC_SITE_ID === "root" && showNotice && h(NoticePopup, {
    notice: CONTENT.notice,
    logo: CONTENT.header && CONTENT.header.logo,
    onClose: closeNotice
  }),
  
  // HEADER
  header,
  
  // PAGE CONTENT
  page === "home" && h("div", { className: "px-4 md:px-8 py-8 md:py-12 mx-auto max-w-6xl" }, home),
  page === "destinations" && destinations,
  page === "experiences" && experiences,
  page === "booking" && booking,
  page === "refund-policy" && refundPolicyPage,
  
  // FOOTER
  footer
);

*/
