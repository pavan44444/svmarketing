/* =========================================================
   SV MARKETING — MAIN JAVASCRIPT
   ========================================================= */

/* Global: image fallback, callable inline via onerror="" before DOM ready */
function handleImageError(img) {
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "true";

  const wrapper = document.createElement("div");
  wrapper.className = "img-placeholder";
  wrapper.style.aspectRatio = img.dataset.ratio || "4 / 3";

  const path = img.getAttribute("src");
  wrapper.innerHTML =
    '<span class="img-placeholder-icon" aria-hidden="true">🖼️</span>' +
    '<span class="img-placeholder-text">Add image here<br><code>' + path + '</code></span>';

  img.replaceWith(wrapper);
}
window.handleImageError = handleImageError;


document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  initializeFAQ();
  initializeMobileMenu();
  initializeScrollTop();
  initializeScrollSpy();
  initializeCurrentYear();
  initializeContactForm();
});


/* =========================================================
   DARK / LIGHT THEME
   ========================================================= */

function initializeTheme() {
  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  if (!themeButton) return;

  const savedTheme = localStorage.getItem("sv-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-theme");
  }

  updateThemeIcon();

  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("sv-theme", isDark ? "dark" : "light");
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (!themeIcon) return;
    const isDark = document.body.classList.contains("dark-theme");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    const label = isDark ? "Switch to light theme" : "Switch to dark theme";
    themeButton.setAttribute("aria-label", label);
    themeButton.setAttribute("title", label);
  }
}


/* =========================================================
   FAQ ACCORDION
   ========================================================= */

/* =========================================================
   FAQ ACCORDION + VIEW ALL
   ========================================================= */

function initializeFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  const faqToggle = document.getElementById("faqToggle");
  const faqExtra = document.querySelector(".faq-extra");

  // FAQ accordion
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.removeAttribute("open");
          }
        });
      }
    });
  });

  // View All FAQs
  if (faqToggle && faqExtra) {
    faqToggle.addEventListener("click", function () {

      if (faqExtra.hasAttribute("hidden")) {

        // Show all FAQs
        faqExtra.removeAttribute("hidden");
        faqToggle.textContent = "Show Less ↑";

      } else {

        // Hide additional FAQs
        faqExtra.setAttribute("hidden", "");

        // Close any open extra FAQ
        faqExtra.querySelectorAll(".faq-item").forEach(function (item) {
          item.removeAttribute("open");
        });

        faqToggle.textContent = "View All FAQs →";
      }

    });
  }
}



/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");
  if (!menuButton || !navbar) return;

  menuButton.addEventListener("click", function () {
    const isOpen = navbar.classList.toggle("mobile-open");
    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navbar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navbar.classList.remove("mobile-open");
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}


/* =========================================================
   SCROLL TO TOP
   ========================================================= */

function initializeScrollTop() {
  const scrollTopButton = document.querySelector(".scroll-top");
  if (!scrollTopButton) return;

  function updateScrollButton() {
    scrollTopButton.classList.toggle("show", window.scrollY > 500);
  }

  window.addEventListener("scroll", updateScrollButton, { passive: true });
  scrollTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateScrollButton();
}


/* =========================================================
   SCROLL SPY (active nav link on this single page)
   ========================================================= */

function initializeScrollSpy() {
  const sections = document.querySelectorAll("main [id]");
  const navLinks = document.querySelectorAll(".navbar a");
  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  const linkFor = (id) =>
    Array.from(navLinks).find(function (link) {
      return link.getAttribute("href") === "#" + id;
    });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (section) { observer.observe(section); });
}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initializeCurrentYear() {
  document.querySelectorAll(".current-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
}


/* =========================================================
   CONTACT FORM -> WHATSAPP
   ========================================================= */

function initializeContactForm() {
  const contactForm = document.querySelector("#contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("#name")?.value.trim();
    const mobile = document.querySelector("#mobile")?.value.trim();
    const location = document.querySelector("#location")?.value.trim();
    const requirement = document.querySelector("#requirement")?.value;
    const message = document.querySelector("#message")?.value.trim();

    if (!name || !mobile || !location || !requirement) {
      alert("Please fill in all the required fields.");
      return;
    }

    const whatsappMessage =
      "Hello SV Marketing,\n\n" +
      "Name: " + name + "\n" +
      "Mobile: " + mobile + "\n" +
      "Location: " + location + "\n" +
      "Requirement: " + requirement + "\n" +
      "Message: " + (message || "No additional message.");

    const whatsappURL = "https://wa.me/919902340759?text=" + encodeURIComponent(whatsappMessage);
    window.open(whatsappURL, "_blank");
  });
}