(function () {
  "use strict";

  // ---------- Contact details: change them here, in one place ----------
  // The address is built in the browser from two parts, so basic scrapers that read the HTML do not find it.
  var EMAIL_NAME = "chakradharkute1199";
  var EMAIL_DOMAIN = "gmail.com";

  var root = document.documentElement;

  // ---------- Email link ----------
  var emailAddress = EMAIL_NAME + "@" + EMAIL_DOMAIN;
  var emailLinks = document.querySelectorAll("[data-email]");
  for (var i = 0; i < emailLinks.length; i++) {
    emailLinks[i].setAttribute("href", "mailto:" + emailAddress);
    emailLinks[i].setAttribute("title", emailAddress);
  }

  // ---------- Footer year ----------
  var yearNodes = document.querySelectorAll("[data-year]");
  for (var y = 0; y < yearNodes.length; y++) {
    yearNodes[y].textContent = String(new Date().getFullYear());
  }

  // ---------- Theme toggle ----------
  var themeButton = document.querySelector(".theme-toggle");
  function syncThemeButton() {
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", root.getAttribute("data-theme") === "dark" ? "true" : "false");
    }
  }
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("theme", next);
      } catch (error) {
        /* private mode: the choice just is not remembered */
      }
      syncThemeButton();
    });
  }
  syncThemeButton();

  // ---------- Mobile menu ----------
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  function setMenu(open) {
    if (!navToggle || !navLinks) {
      return;
    }
    navLinks.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });
    navLinks.addEventListener("click", function (event) {
      if (event.target && event.target.tagName === "A") {
        setMenu(false);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });
  }

  // ---------- Highlight the nav link of the section on screen ----------
  var sections = document.querySelectorAll("main section[id]");
  var links = {};
  var navAnchors = document.querySelectorAll(".nav-links a");
  for (var a = 0; a < navAnchors.length; a++) {
    links[navAnchors[a].getAttribute("href").slice(1)] = navAnchors[a];
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && links[entry.target.id]) {
            for (var key in links) {
              if (Object.prototype.hasOwnProperty.call(links, key)) {
                links[key].classList.remove("is-active");
              }
            }
            links[entry.target.id].classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (var s = 0; s < sections.length; s++) {
      spy.observe(sections[s]);
    }

    // ---------- Reveal blocks as they scroll into view ----------
    var reveal = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    var blocks = document.querySelectorAll(".reveal");
    for (var b = 0; b < blocks.length; b++) {
      reveal.observe(blocks[b]);
    }
  } else {
    // very old browsers: show everything at once
    var all = document.querySelectorAll(".reveal");
    for (var r = 0; r < all.length; r++) {
      all[r].classList.add("is-visible");
    }
  }
})();
