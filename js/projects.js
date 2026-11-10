/* ==========================================================================
   projects.js — Projects page: filter project cards by category.
   Each card has data-category="automation | data | web".
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const countEl = document.getElementById("project-count");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const category = button.dataset.filter;
      let shown = 0;

      cards.forEach(function (card) {
        const match = category === "all" || card.dataset.category === category;
        card.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });

      buttons.forEach(function (b) {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      countEl.textContent = "Showing " + shown + " of " + cards.length + " projects";
    });
  });
});
