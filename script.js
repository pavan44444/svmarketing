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

  let successNote = contactForm.querySelector(".form-success");
  if (!successNote) {
    successNote = document.createElement("p");
    successNote.className = "form-success";
    successNote.innerHTML = '<span aria-hidden="true">✓</span><span>Opening WhatsApp with your details filled in — just hit send there.</span>';
    contactForm.appendChild(successNote);
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const validations = Object.keys(fields).map(validateField);
    if (validations.includes(false)) {
      const firstInvalid = contactForm.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      successNote.classList.remove("show");
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
    successNote.classList.add("show");
  });
}


/* =========================================================
   SITE SEARCH — fully dynamic, built from the live page
   ========================================================= */

/* Blocks worth indexing as one search "card". Each entry: the CSS
   selector for a repeating content block, and a human tag label used
   when we can't find one nearby. Every word on the page that lives
   inside one of these blocks becomes searchable — nothing hardcoded. */
const SEARCH_BLOCKS = [
  { selector: ".hero-copy", tag: "Home" },
  { selector: ".journey-step", tag: "How it works" },
  { selector: ".solution-copy", tag: "Solution" },
  { selector: ".finder .section-heading", tag: "Tool" },
  { selector: ".problem-item", tag: "Problem" },
  { selector: ".why-us-copy", tag: "About" },
  { selector: ".gallery-item", tag: "Gallery" },
  { selector: ".testimonial-card", tag: "Review" },
  { selector: ".location-copy", tag: "Location" },
  { selector: ".area-chips", tag: "Areas" },
  { selector: ".faq-item", tag: "FAQ" },
  { selector: ".contact-copy", tag: "Contact" }
];

const SECTION_LABELS = {
  top: "Home", journey: "How it works", solutions: "Solutions",
  finder: "Solution Finder", problems: "Common problems", "why-us": "Why us",
  gallery: "Installations", testimonials: "Reviews", areas: "Service areas",
  faq: "FAQ", contact: "Contact"
};

let siteSearchIndex = null;

function buildSiteSearchIndex() {
  const index = [];
  const seen = new Set();

  SEARCH_BLOCKS.forEach(function (block) {
    document.querySelectorAll("main " + block.selector).forEach(function (el) {
      const headingEl = el.querySelector("h1, h2, h3, summary, figcaption, strong");
      let title = headingEl ? headingEl.textContent.trim() : "";
      const fullText = el.textContent.replace(/\s+/g, " ").trim();

      if (!title) {
        title = fullText.slice(0, 60) + (fullText.length > 60 ? "…" : "");
      }

      let snippet = fullText;
      if (headingEl) snippet = snippet.replace(headingEl.textContent.trim(), "").trim();
      snippet = snippet.slice(0, 150) + (snippet.length > 150 ? "…" : "");

      const sectionEl = el.closest("section[id], [id]");
      const sectionId = sectionEl ? sectionEl.id : "top";
      const href = "#" + (sectionId || "top");
      const tag = SECTION_LABELS[sectionId] || block.tag;

      const dedupeKey = title + "|" + href;
      if (seen.has(dedupeKey) || !fullText) return;
      seen.add(dedupeKey);

      index.push({ title: title, snippet: snippet, fullText: fullText.toLowerCase(), href: href, tag: tag, targetEl: el });
    });
  });

  /* Also sweep any remaining headings in main that weren't captured above,
     so nothing on the page is unsearchable even if new sections get added
     later without updating this list. */
  document.querySelectorAll("main h2, main h3").forEach(function (heading) {
    const title = heading.textContent.trim();
    const already = index.some(function (item) { return item.title === title; });
    if (already || !title) return;

    const container = heading.closest("section") || heading.parentElement;
    const fullText = container ? container.textContent.replace(/\s+/g, " ").trim() : title;
    const sectionEl = heading.closest("section[id], [id]");
    const sectionId = sectionEl ? sectionEl.id : "top";

    index.push({
      title: title,
      snippet: fullText.replace(title, "").trim().slice(0, 150),
      fullText: fullText.toLowerCase(),
      href: "#" + (sectionId || "top"),
      tag: SECTION_LABELS[sectionId] || "Page",
      targetEl: container
    });
  });

  return index;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("(" + safeQuery + ")", "ig");
  return escaped.replace(re, "<mark>$1</mark>");
}

function initializeSiteSearch() {
  const toggle = document.querySelector(".search-toggle");
  const panel = document.getElementById("siteSearchPanel");
  const input = document.getElementById("siteSearchInput");
  const resultsList = document.getElementById("siteSearchResults");
  const closeBtn = document.querySelector(".search-close");
  if (!toggle || !panel || !input || !resultsList) return;

  function ensureIndex() {
    if (!siteSearchIndex) siteSearchIndex = buildSiteSearchIndex();
    return siteSearchIndex;
  }

  function openSearch() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    ensureIndex();
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

    const index = ensureIndex();
    const words = q.split(/\s+/).filter(Boolean);

    const matches = index
      .map(function (item) {
        const haystack = (item.title + " " + item.snippet + " " + item.fullText).toLowerCase();
        const hitCount = words.reduce(function (sum, w) { return sum + (haystack.includes(w) ? 1 : 0); }, 0);
        return { item: item, hitCount: hitCount, exact: item.title.toLowerCase().includes(q) };
      })
      .filter(function (m) { return m.hitCount === words.length; })
      .sort(function (a, b) { return (b.exact - a.exact) || (b.hitCount - a.hitCount); })
      .slice(0, 8);

    if (!matches.length) {
      const li = document.createElement("li");
      li.className = "search-empty";
      li.textContent = "No matches — try “softener”, “purifier” or an area name.";
      resultsList.appendChild(li);
      return;
    }

    matches.forEach(function (m) {
      const item = m.item;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.href;
      a.innerHTML =
        '<span class="search-result-title">' + highlightMatch(item.title, q) + '</span>' +
        (item.snippet ? '<span class="search-result-snippet">' + highlightMatch(item.snippet, q) + '</span>' : "") +
        '<span class="search-result-tag">' + escapeHtml(item.tag) + '</span>';
      a.addEventListener("click", function () {
        closeSearch();
        input.value = "";
        resultsList.innerHTML = "";
        if (item.tag === "FAQ" && item.targetEl && item.targetEl.tagName === "DETAILS") {
          setTimeout(function () { revealAndOpenFaq(item.targetEl); }, 350);
        }
      });
      li.appendChild(a);
      resultsList.appendChild(li);
    });
  }

  input.addEventListener("input", function () { renderResults(input.value); });
}

function revealAndOpenFaq(detailsEl) {
  const extraWrap = detailsEl.closest(".faq-extra");
  if (extraWrap && extraWrap.hasAttribute("hidden")) {
    extraWrap.removeAttribute("hidden");
    const toggleBtn = document.getElementById("faqToggle");
    if (toggleBtn) toggleBtn.textContent = "Show Less ↑";
  }
  detailsEl.setAttribute("open", "");
  detailsEl.classList.add("is-highlighted");
  detailsEl.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(function () { detailsEl.classList.remove("is-highlighted"); }, 2000);
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
   JOURNEY SCROLL REVEAL (+ flowing connector line)
   ========================================================= */

function initializeJourneyReveal() {
  const steps = document.querySelectorAll(".journey-step");
  const track = document.querySelector(".journey-track");
  if (!steps.length) return;

  if (!("IntersectionObserver" in window)) {
    steps.forEach(function (step) { step.classList.add("in-view"); });
    if (track) track.classList.add("in-view");
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const step = entry.target;
        const delay = (Number(step.dataset.step) - 1) * 90;
        setTimeout(function () { step.classList.add("in-view"); }, delay);
        if (track && !track.classList.contains("in-view")) track.classList.add("in-view");
        observer.unobserve(step);
      }
    });
  }, { threshold: 0.3 });

  steps.forEach(function (step) { observer.observe(step); });
}
