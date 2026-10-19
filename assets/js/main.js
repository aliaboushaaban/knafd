(function () {
  "use strict";

  var config = window.KNAFD_CONFIG || {};

  function validUrl(value, hostPattern) {
    try {
      var url = new URL(value);
      return url.protocol === "https:" && (!hostPattern || hostPattern.test(url.hostname));
    } catch (e) {
      return false;
    }
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
  }

  var mailBody = [
    "Hi Knaf'd team,",
    "",
    "I'd love to bring Knaf'd to an event.",
    "",
    "Type of event:",
    "Date:",
    "City / venue:",
    "Estimated number of guests:",
    "",
    "Thanks!",
  ].join("\n");

  var links = {
    instagram: validUrl(config.instagramUrl, /(^|\.)instagram\.com$/i) ? config.instagramUrl : null,
    inquiry: validUrl(config.inquiryFormUrl)
      ? config.inquiryFormUrl
      : validEmail(config.inquiryEmail)
        ? "mailto:" + config.inquiryEmail +
          "?subject=" + encodeURIComponent("Private event inquiry") +
          "&body=" + encodeURIComponent(mailBody)
        : null,
    review: validUrl(config.googleReviewUrl, /(^|\.)(google\.[a-z.]+|g\.page)$/i) ? config.googleReviewUrl : null,
  };

  // Wire up configurable links. Unconfigured links show a "coming soon" label.
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var href = links[el.getAttribute("data-link")];
    if (href) {
      el.setAttribute("href", href);
      if (!href.startsWith("mailto:")) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-pending");
      var label = el.querySelector("[data-label]") || el;
      if (el.dataset.pending) label.textContent = el.dataset.pending;
    }
  });

  // Elements that only make sense once a link exists (e.g. Google Reviews).
  document.querySelectorAll("[data-requires]").forEach(function (el) {
    el.hidden = !links[el.getAttribute("data-requires")];
  });

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  // Subtle header rule once the page scrolls
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
