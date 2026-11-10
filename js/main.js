/* ==========================================================================
   main.js — behaviour shared by every page
   1. Mobile navigation toggle      5. Back-to-top button
   2. Highlight the current page    6. Footer year
   3. Light / dark theme switch     7. Image fallback (profile photo)
   4. Scroll-reveal animations
   ========================================================================== */

// Wait until the HTML has been parsed before touching the DOM.
document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  highlightCurrentPage();
  setupThemeToggle();
  setupScrollReveal();
  setupBackToTop();
  setFooterYear();
  setupImageFallbacks();
  disablePlaceholderLinks();
});

/* Simulated links (marked aria-disabled) should not jump to the top of the page. */
function disablePlaceholderLinks() {
  document.querySelectorAll('a[aria-disabled="true"]').forEach(function (link) {
    link.addEventListener("click", function (event) { event.preventDefault(); });
  });
}

/* 1. MOBILE NAVIGATION ---------------------------------------------------- */
function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");          // add/remove the class
    toggle.setAttribute("aria-expanded", String(isOpen));  // tell screen readers
  });

  // Close the menu after a link is chosen (useful on phones).
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close the menu with the Escape key.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* 2. HIGHLIGHT CURRENT PAGE ----------------------------------------------- */
function highlightCurrentPage() {
  // e.g. "/portfolio/about.html" -> "about.html"; the site root counts as index.html
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (link) {
    if (link.getAttribute("href") === currentFile) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* 3. THEME TOGGLE (saved between visits) ---------------------------------- */
function setupThemeToggle() {
  const button = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  // Use the saved choice; otherwise follow the device setting.
  const saved = readStorage("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  if (!button) return;
  button.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    writeStorage("theme", next);
  });

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (button) {
      button.textContent = theme === "dark" ? "☀️" : "🌙";
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }
}

/* 4. SCROLL REVEAL -------------------------------------------------------- */
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  // Older browsers without IntersectionObserver simply show everything.
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { observer.observe(el); });
}

/* 5. BACK TO TOP ---------------------------------------------------------- */
function setupBackToTop() {
  const button = document.querySelector(".to-top");
  if (!button) return;
  window.addEventListener("scroll", function () {
    button.classList.toggle("show", window.scrollY > 500);
  });
  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* 6. FOOTER YEAR ---------------------------------------------------------- */
function setFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

/* 7. IMAGE FALLBACK -------------------------------------------------------
   If an image (e.g. the profile photo) fails to load, swap in the file named
   in its data-fallback attribute instead of showing a broken image. */
function setupImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    function useFallback() {
      if (img.src.indexOf(img.dataset.fallback) === -1) img.src = img.dataset.fallback;
    }
    img.addEventListener("error", useFallback);
    if (img.complete && img.naturalWidth === 0) useFallback(); // failed before JS ran
  });
}

/* localStorage helpers ----------------------------------------------------
   Wrapped in try/catch because storage can be blocked (e.g. private mode). */
function readStorage(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}
