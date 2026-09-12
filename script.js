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
  initializeSiteSearch();
  initializeSolutionFinder();
  initializeTestimonialCarousel();
  initializeJourneyReveal();
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
   FAQ ACCORDION + VIEW ALL
   ========================================================= */

function initializeFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  const faqToggle = document.getElementById("faqToggle");
  const faqExtra = document.querySelector(".faq-extra");

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

  if (faqToggle && faqExtra) {
    faqToggle.addEventListener("click", function () {
      if (faqExtra.hasAttribute("hidden")) {
        faqExtra.removeAttribute("hidden");
        faqToggle.textContent = "Show Less ↑";
      } else {
        faqExtra.setAttribute("hidden", "");
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
   CONTACT FORM -> WHATSAPP (with inline validation)
   ========================================================= */

function initializeContactForm() {
  const contactForm = document.querySelector("#contactForm");
  if (!contactForm) return;

  const fields = {
    name: { el: document.querySelector("#name"), error: document.querySelector("#nameError") },
    mobile: { el: document.querySelector("#mobile"), error: document.querySelector("#mobileError") },
    location: { el: document.querySelector("#location"), error: document.querySelector("#locationError") },
    requirement: { el: document.querySelector("#requirement"), error: document.querySelector("#requirementError") }
  };

  function validateField(key) {
    const field = fields[key];
    if (!field || !field.el) return true;
    const value = field.el.value.trim();
    let message = "";

    if (key === "name" && value.length < 2) message = "Please enter your name.";
    if (key === "mobile" && !/^[0-9]{10}$/.test(value)) message = "Enter a valid 10-digit mobile number.";
    if (key === "location" && value.length < 2) message = "Please tell us your area.";
    if (key === "requirement" && !value) message = "Please choose an option.";

    field.el.classList.toggle("is-invalid", Boolean(message));
    if (field.error) field.error.textContent = message;
    return !message;
  }

  Object.keys(fields).forEach(function (key) {
    const field = fields[key];
    if (!field.el) return;
    field.el.addEventListener("blur", function () { validateField(key); });
    field.el.addEventListener("input", function () {
      if (field.el.classList.contains("is-invalid")) validateField(key);
    });
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const validations = Object.keys(fields).map(validateField);
    if (validations.includes(false)) {
      const firstInvalid = contactForm.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = fields.name.el.value.trim();
    const mobile = fields.mobile.el.value.trim();
    const location = fields.location.el.value.trim();
    const requirement = fields.requirement.el.value;
    const message = document.querySelector("#message")?.value.trim();

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


/* =========================================================
   SITE SEARCH
   ========================================================= */

const SITE_SEARCH_INDEX = [
  { title: "Water Softener", tag: "Solution", href: "#solutions", snippet: "Removes calcium and magnesium that cause scale, film and appliance wear.", keywords: "softener hardness scale ion exchange calcium magnesium" },
  { title: "Water Purifier", tag: "Solution", href: "#solutions", snippet: "Matched to your TDS and source for safer drinking water.", keywords: "purifier RO drinking water TDS taste smell" },
  { title: "Find my solution", tag: "Tool", href: "#finder", snippet: "Answer three quick questions for a starting recommendation.", keywords: "finder tool recommendation quiz source property problem" },
  { title: "Scale on taps & fittings", tag: "Problem", href: "#top", snippet: "Chalky white deposits building up around taps and shower heads.", keywords: "scale white deposits taps shower hard water" },
  { title: "Soap won't lather", tag: "Problem", href: "#top", snippet: "Hardness minerals bind with soap before it can work.", keywords: "soap lather detergent hard water" },
  { title: "Water heaters scaling up", tag: "Problem", href: "#top", snippet: "Sediment builds inside geysers, cutting efficiency.", keywords: "geyser heater scale sediment efficiency" },
  { title: "Why SV Marketing", tag: "About", href: "#why-us", snippet: "ZeroB systems sized to your water, not a fixed package.", keywords: "why us zerob local experience service" },
  { title: "Installation gallery", tag: "Gallery", href: "#gallery", snippet: "Recent softener and purifier installs across Bengaluru.", keywords: "gallery installation photos apartments office" },
  { title: "Customer reviews", tag: "Reviews", href: "#testimonials", snippet: "What Bengaluru households and offices say about us.", keywords: "testimonials reviews customers feedback" },
  { title: "Service areas in Bengaluru", tag: "Areas", href: "#areas", snippet: "Rajajinagar, Whitefield, Jayanagar, Electronic City and more.", keywords: "areas bengaluru rajajinagar whitefield jayanagar electronic city magadi road service area" },
  { title: "What is a water softener?", tag: "FAQ", href: "#faq", snippet: "A system designed primarily to reduce hardness-causing minerals.", keywords: "faq what is water softener" },
  { title: "Is a softener the same as an RO purifier?", tag: "FAQ", href: "#faq", snippet: "No — they address different needs.", keywords: "faq softener vs purifier ro difference" },
  { title: "How much does a water softener cost?", tag: "FAQ", href: "#faq", snippet: "Depends on hardness, household size and capacity.", keywords: "faq cost price water softener" },
  { title: "Can softeners be installed in apartments?", tag: "FAQ", href: "#faq", snippet: "Yes, subject to installation space and plumbing.", keywords: "faq apartment installation villa" },
  { title: "Get a free water consultation", tag: "Contact", href: "#contact", snippet: "Call, WhatsApp, or send us your details for a free test.", keywords: "contact whatsapp call phone free test consultation" }
];

function initializeSiteSearch() {
  const toggle = document.querySelector(".search-toggle");
  const panel = document.getElementById("siteSearchPanel");
  const input = document.getElementById("siteSearchInput");
  const resultsList = document.getElementById("siteSearchResults");
  const closeBtn = document.querySelector(".search-close");
  if (!toggle || !panel || !input || !resultsList) return;

  function openSearch() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closeSearch() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    if (panel.hidden) openSearch(); else closeSearch();
  });

  closeBtn?.addEventListener("click", closeSearch);

  document.addEventListener("click", function (event) {
    if (!panel.hidden && !panel.contains(event.target) && event.target !== toggle && !toggle.contains(event.target)) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) closeSearch();
  });

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    resultsList.innerHTML = "";

    if (!q) return;

    const matches = SITE_SEARCH_INDEX.filter(function (item) {
      return (item.title + " " + item.snippet + " " + item.keywords).toLowerCase().includes(q);
    }).slice(0, 8);

    if (!matches.length) {
      const li = document.createElement("li");
      li.className = "search-empty";
      li.textContent = "No matches — try “softener”, “purifier” or an area name.";
      resultsList.appendChild(li);
      return;
    }

    matches.forEach(function (item) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.href;
      a.innerHTML =
        '<span class="search-result-title">' + item.title + '</span>' +
        '<span class="search-result-snippet">' + item.snippet + '</span>' +
        '<span class="search-result-tag">' + item.tag + '</span>';
      a.addEventListener("click", function () {
        closeSearch();
        input.value = "";
        resultsList.innerHTML = "";
        if (item.tag === "FAQ") {
          setTimeout(function () { highlightFaqMatch(item.title); }, 350);
        }
      });
      li.appendChild(a);
      resultsList.appendChild(li);
    });
  }

  input.addEventListener("input", function () { renderResults(input.value); });
}

function highlightFaqMatch(title) {
  const summaries = document.querySelectorAll(".faq-item summary");
  summaries.forEach(function (summary) {
    if (summary.textContent.trim().toLowerCase() === title.trim().toLowerCase()) {
      const parent = summary.closest(".faq-item");
      const extraWrap = parent.closest(".faq-extra");
      if (extraWrap && extraWrap.hasAttribute("hidden")) {
        extraWrap.removeAttribute("hidden");
        const toggleBtn = document.getElementById("faqToggle");
        if (toggleBtn) toggleBtn.textContent = "Show Less ↑";
      }
      parent.setAttribute("open", "");
      parent.classList.add("is-highlighted");
      setTimeout(function () { parent.classList.remove("is-highlighted"); }, 2000);
    }
  });
}


/* =========================================================
   INTERACTIVE SOLUTION FINDER
   ========================================================= */

function initializeSolutionFinder() {
  const tool = document.getElementById("finderTool");
  if (!tool) return;

  const panels = tool.querySelectorAll(".finder-panel");
  const dots = tool.querySelectorAll(".finder-dot");
  const restartBtn = document.getElementById("finderRestart");
  const resultTitle = document.getElementById("finderResultTitle");
  const resultText = document.getElementById("finderResultText");
  const finderWhatsapp = document.getElementById("finderWhatsapp");

  const answers = { source: null, property: null, problem: null };

  function goToPanel(step) {
    panels.forEach(function (panel) {
      panel.classList.toggle("is-active", Number(panel.dataset.panel) === step);
    });
    dots.forEach(function (dot) {
      const dotStep = Number(dot.dataset.dot);
      dot.classList.toggle("is-active", dotStep === step);
      dot.classList.toggle("is-done", dotStep < step);
    });
  }

  tool.querySelectorAll(".finder-options").forEach(function (group) {
    group.addEventListener("click", function (event) {
      const button = event.target.closest(".finder-option");
      if (!button) return;

      const question = group.dataset.question;
      answers[question] = button.dataset.value;

      group.querySelectorAll(".finder-option").forEach(function (b) { b.classList.remove("is-selected"); });
      button.classList.add("is-selected");

      const currentPanel = button.closest(".finder-panel");
      const currentStep = Number(currentPanel.dataset.panel);

      setTimeout(function () {
        if (currentStep < 3) {
          goToPanel(currentStep + 1);
        } else {
          buildRecommendation();
          goToPanel(4);
        }
      }, 220);
    });
  });

  function buildRecommendation() {
    const { source, property, problem } = answers;
    let system = "a ZeroB water softener";
    let reason = "to reduce the hardness minerals causing your issue";

    if (problem === "taste" || problem === "tds") {
      system = "a ZeroB water purifier, sized to your TDS reading";
      reason = "since your concern is with drinking water quality rather than hardness";
    } else if (problem === "scale" || problem === "soap") {
      system = "a ZeroB water softener";
      reason = "since your concern points to hardness in the supply";
    }

    if (source === "borewell" && (problem === "taste" || problem === "tds")) {
      system = "a ZeroB softener paired with a purifier";
      reason = "borewell water with taste or TDS concerns often needs both stages";
    }

    const propertyLabel = { apartment: "an apartment", house: "an independent house", office: "an office or institution" }[property] || "your property";
    const sourceLabel = { borewell: "borewell", municipal: "municipal / Cauvery", mixed: "mixed / tanker" }[source] || "your";

    resultTitle.textContent = "Starting point: " + system;
    resultText.textContent =
      "For " + propertyLabel + " on " + sourceLabel + " supply, we'd typically start with " + system + " — " + reason + ". " +
      "We'll confirm the exact model and capacity after an on-site water test.";

    const waMessage =
      "Hello SV Marketing, I used the Solution Finder on your website.\n" +
      "Water source: " + sourceLabel + "\n" +
      "Property type: " + propertyLabel + "\n" +
      "Main concern: " + (problem || "not specified") + "\n" +
      "Suggested starting point: " + system + "\n" +
      "Could you help confirm the right system for me?";
    finderWhatsapp.href = "https://wa.me/919902340759?text=" + encodeURIComponent(waMessage);
  }

  restartBtn?.addEventListener("click", function () {
    answers.source = null; answers.property = null; answers.problem = null;
    tool.querySelectorAll(".finder-option.is-selected").forEach(function (b) { b.classList.remove("is-selected"); });
    goToPanel(1);
  });
}


/* =========================================================
   TESTIMONIAL CAROUSEL
   ========================================================= */

function initializeTestimonialCarousel() {
  const carousel = document.getElementById("testimonialCarousel");
  if (!carousel) return;

  const track = carousel.querySelector(".testimonial-track");
  const cards = carousel.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  if (!track || !cards.length) return;

  let index = 0;

  function update() {
    track.style.transform = "translateX(-" + (index * 100) + "%)";
  }

  nextBtn?.addEventListener("click", function () {
    index = (index + 1) % cards.length;
    update();
  });

  prevBtn?.addEventListener("click", function () {
    index = (index - 1 + cards.length) % cards.length;
    update();
  });

  let autoplay = setInterval(function () {
    index = (index + 1) % cards.length;
    update();
  }, 6000);

  carousel.addEventListener("mouseenter", function () { clearInterval(autoplay); });
  carousel.addEventListener("mouseleave", function () {
    autoplay = setInterval(function () {
      index = (index + 1) % cards.length;
      update();
    }, 6000);
  });
}


/* =========================================================
   JOURNEY SCROLL REVEAL
   ========================================================= */

function initializeJourneyReveal() {
  const steps = document.querySelectorAll(".journey-step");
  if (!steps.length) return;

  if (!("IntersectionObserver" in window)) {
    steps.forEach(function (step) { step.classList.add("in-view"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const step = entry.target;
        const delay = (Number(step.dataset.step) - 1) * 90;
        setTimeout(function () { step.classList.add("in-view"); }, delay);
        observer.unobserve(step);
      }
    });
  }, { threshold: 0.3 });

  steps.forEach(function (step) { observer.observe(step); });
}
