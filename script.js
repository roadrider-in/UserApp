/* ==========================================================================
   RoadRider – Landing Page Script (Vanilla JS)
   ========================================================================== */

/* -------------------------------------------------------------------------
   Configuration (edit these values only)
   ------------------------------------------------------------------------- */

// Centralized APK download URL – every download button uses this value.
const APP_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=163OKRAtnbN1K3KMx6xvNk_xaKSqi_BWZ";

// Configurable placeholders. Leave as empty strings until real values exist.
// Example: const SUPPORT_EMAIL = "support@your-domain.com";
const SUPPORT_EMAIL = "";
const PRIVACY_POLICY_URL = "";
const TERMS_URL = "";

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* -----------------------------------------------------------------------
     Download buttons -> APP_DOWNLOAD_URL (opens in a new tab)
     ----------------------------------------------------------------------- */
  const downloadButtons = document.querySelectorAll("[data-download]");

  downloadButtons.forEach(function (button) {
    button.setAttribute("href", APP_DOWNLOAD_URL);
    button.setAttribute("target", "_blank");
    button.setAttribute("rel", "noopener noreferrer");
  });

  /* -----------------------------------------------------------------------
     Support email (placeholder until SUPPORT_EMAIL is configured)
     ----------------------------------------------------------------------- */
  const emailLink = document.getElementById("support-email-link");

  if (emailLink) {
    if (SUPPORT_EMAIL.trim()) {
      emailLink.textContent = SUPPORT_EMAIL.trim();
      emailLink.setAttribute("href", "mailto:" + SUPPORT_EMAIL.trim());
      emailLink.removeAttribute("data-placeholder");
    } else {
      emailLink.setAttribute("aria-disabled", "true");
      emailLink.addEventListener("click", function (event) {
        event.preventDefault();
      });
    }
  }

  /* -----------------------------------------------------------------------
     Policy links (Privacy Policy / Terms & Conditions)
     ----------------------------------------------------------------------- */
  function configurePolicyLink(id, url) {
    const link = document.getElementById(id);
    if (!link) return;

    if (url.trim()) {
      link.setAttribute("href", url.trim());
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    } else {
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "Coming soon");
      link.addEventListener("click", function (event) {
        event.preventDefault();
      });
    }
  }

  configurePolicyLink("privacy-link", PRIVACY_POLICY_URL);
  configurePolicyLink("terms-link", TERMS_URL);

  /* -----------------------------------------------------------------------
     Mobile navigation
     ----------------------------------------------------------------------- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) setMenu(false);
    });

    window.matchMedia("(min-width: 881px)").addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* -----------------------------------------------------------------------
     Header shadow on scroll
     ----------------------------------------------------------------------- */
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -----------------------------------------------------------------------
     Active nav link highlighting
     ----------------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sectionMap = navLinks
    .map(function (link) {
      const target = document.querySelector(link.getAttribute("href"));
      return target ? { link: link, target: target } : null;
    })
    .filter(Boolean);

  function setActive(activeLink) {
    navLinks.forEach(function (link) {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sectionMap.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const match = sectionMap.find(function (item) {
              return item.target === entry.target;
            });
            if (match) setActive(match.link);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sectionMap.forEach(function (item) {
      navObserver.observe(item.target);
    });
  }

  /* -----------------------------------------------------------------------
     Scroll reveal animations (lightweight)
     ----------------------------------------------------------------------- */
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Stagger siblings slightly for a refined entrance
  revealItems.forEach(function (item) {
    const siblings = item.parentElement ? Array.from(item.parentElement.children).filter(function (el) {
      return el.classList.contains("reveal");
    }) : [];
    const index = siblings.indexOf(item);
    item.style.setProperty("--delay", (Math.max(index, 0) * 0.09).toFixed(2) + "s");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }
})();
