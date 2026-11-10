/* ==========================================================================
   about.js — About page: animate the skill bars when they scroll into view.
   Each bar's target width is stored in its data-level attribute (e.g. 85).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const bars = document.querySelectorAll(".skill-fill");

  function fill(bar) { bar.style.width = bar.dataset.level + "%"; }

  if (!("IntersectionObserver" in window)) {
    bars.forEach(fill);
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        fill(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(function (bar) { observer.observe(bar); });
});
