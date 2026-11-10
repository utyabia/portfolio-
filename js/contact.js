/* ==========================================================================
   contact.js — Contact form validation
   Rules required by the brief:
     1. No field may be empty
     2. Email must have a valid format
     3. Phone number must contain digits only
   Each field is checked live (as the user types / leaves a field) and again
   when the form is submitted.
   ========================================================================== */

const contactForm = document.getElementById("contact-form");
const successBox = document.getElementById("form-success");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const MAX_MESSAGE = 500;

// Regular expressions (patterns) used by the rules.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;  // something@something.domain
const DIGITS_ONLY = /^[0-9]+$/;                          // one or more digits, nothing else

// Each rule returns an error message, or "" when the value is valid.
const validators = {
  name: function (value) {
    if (value === "") return "Please enter your name.";
    if (value.length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email: function (value) {
    if (value === "") return "Please enter your email address.";
    if (!EMAIL_PATTERN.test(value)) return "Enter a valid email, e.g. name@example.com.";
    return "";
  },
  phone: function (value) {
    if (value === "") return "Please enter your phone number.";
    if (!DIGITS_ONLY.test(value)) return "Phone number must contain digits only (no spaces, + or -).";
    if (value.length < 7 || value.length > 15) return "Phone number should be 7–15 digits long.";
    return "";
  },
  message: function (value) {
    if (value === "") return "Please write a message.";
    if (value.length < 10) return "Message should be at least 10 characters.";
    return "";
  }
};

// Check one field, show/hide its error message, and return true if valid.
function validateField(input) {
  const value = input.value.trim();
  const error = validators[input.name](value);
  const row = input.closest(".form-row");
  const errorEl = document.getElementById(input.name + "-error");

  errorEl.textContent = error;
  row.classList.toggle("invalid", error !== "");
  row.classList.toggle("valid", error === "");
  input.setAttribute("aria-invalid", String(error !== ""));
  return error === "";
}

const fields = Array.from(contactForm.querySelectorAll("input, textarea"));

fields.forEach(function (input) {
  // Validate when the user leaves the field ...
  input.addEventListener("blur", function () { validateField(input); });
  // ... and keep re-checking while they fix a field already marked invalid.
  input.addEventListener("input", function () {
    if (input.closest(".form-row").classList.contains("invalid")) validateField(input);
  });
});

// Live character counter for the message box.
messageInput.addEventListener("input", function () {
  const length = messageInput.value.length;
  charCount.textContent = length + " / " + MAX_MESSAGE;
  charCount.style.color = length > MAX_MESSAGE * 0.9 ? "var(--red)" : "";
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Validate every field (map runs them all, so every error is shown at once).
  const results = fields.map(validateField);
  const allValid = results.every(function (ok) { return ok; });

  if (!allValid) {
    successBox.classList.remove("show");
    const firstInvalid = contactForm.querySelector(".invalid input, .invalid textarea");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // No server is connected, so the "send" is simulated: show a confirmation.
  const name = document.getElementById("name").value.trim().split(" ")[0];
  successBox.querySelector("strong").textContent = "Thank you, " + name + "!";
  successBox.classList.add("show");
  successBox.scrollIntoView({ behavior: "smooth", block: "center" });

  contactForm.reset();
  charCount.textContent = "0 / " + MAX_MESSAGE;
  fields.forEach(function (input) { input.closest(".form-row").classList.remove("valid", "invalid"); });
});
