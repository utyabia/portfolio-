/* ==========================================================================
   home.js — Homepage only
   1. Typing effect that cycles through an array of roles
   2. Animated counters in the stats strip
   3. Audio introduction player (animated sound wave + missing-file message)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  startTypingEffect();
  animateCounters();
  setupAudioIntro();
});

/* 1. TYPING EFFECT -------------------------------------------------------- */
const roles = [
  "Lead Trainer, Fabulous Data School",
  "Data Scientist in Training"
];

function startTypingEffect() {
  const target = document.querySelector(".typed-text");
  if (!target) return;

  let roleIndex = 0;   // which role in the array
  let charIndex = 0;   // how many letters are showing
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = word.substring(0, charIndex);

    let delay = deleting ? 45 : 90;
    if (!deleting && charIndex === word.length) {        // finished typing: pause
      delay = 1600;
      deleting = true;
    } else if (deleting && charIndex === 0) {            // finished deleting: next word
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;        // wrap back to the first role
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  tick();
}

/* 2. ANIMATED COUNTERS ---------------------------------------------------- */
function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach(function (el) {
    const target = Number(el.dataset.count);
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * progress) + (el.dataset.suffix || "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* 3. AUDIO INTRODUCTION --------------------------------------------------- */
function setupAudioIntro() {
  const audio = document.getElementById("intro-audio");
  const wave = document.querySelector(".wave");
  const note = document.querySelector(".audio-note");
  if (!audio || !wave) return;

  audio.addEventListener("play", function () { wave.classList.add("playing"); });
  audio.addEventListener("pause", function () { wave.classList.remove("playing"); });
  audio.addEventListener("ended", function () { wave.classList.remove("playing"); });

  // If the recording is missing, explain instead of showing a dead player.
  const source = audio.querySelector("source");
  (source || audio).addEventListener("error", function () {
    if (note) note.textContent = "The voice recording is being updated — please read the transcript below.";
  });
}
