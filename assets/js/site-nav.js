// Shared nav: profile switch, scroll progress, active section, mobile menu, theme toggle.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.querySelector("[data-nav]");
  if (!nav) return;

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) {}
    return null;
  }

  /* ---------- Profile switch ---------- */
  var sw = nav.querySelector("[data-profile-switch]");
  var pill = nav.querySelector("[data-switch-pill]");
  var current = nav.getAttribute("data-profile-current");
  if (current) {
    store("profile", current);
  } else {
    current = store("profile") || "both";
  }
  var opts = sw ? Array.prototype.slice.call(sw.querySelectorAll("[data-profile]")) : [];
  var activeOpt = null;
  opts.forEach(function (a) {
    var on = a.getAttribute("data-profile") === current;
    a.classList.toggle("is-active", on);
    if (on) activeOpt = a;
  });

  function movePill(a, instant) {
    if (!pill || !a) return;
    if (instant) pill.style.transition = "none";
    pill.style.width = a.offsetWidth + "px";
    pill.style.height = a.offsetHeight + "px";
    pill.style.transform = "translate(" + a.offsetLeft + "px," + a.offsetTop + "px)";
    pill.classList.add("is-ready");
    if (instant) {
      pill.offsetWidth; // flush
      pill.style.transition = "";
    }
  }
  movePill(activeOpt, true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(activeOpt, true); });
  window.addEventListener("resize", function () { movePill(activeOpt, true); });

  opts.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var key = a.getAttribute("data-profile");
      var onHome = !!nav.getAttribute("data-profile-current");
      if (onHome && key === current) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }
      store("profile", key);
      if (reduceMotion) return; // follow the link right away
      e.preventDefault();
      opts.forEach(function (o) { o.classList.toggle("is-active", o === a); });
      activeOpt = a;
      movePill(a);
      setTimeout(function () { window.location.href = a.href; }, 260);
    });
  });

  // Off the home pages, point section links at the remembered profile's page.
  if (!nav.getAttribute("data-profile-current")) {
    var target = opts.filter(function (o) { return o.getAttribute("data-profile") === current; })[0];
    if (target) {
      var base = new URL(target.href, location.href).pathname;
      document.querySelectorAll("[data-base-link]").forEach(function (l) {
        var u = new URL(l.href, location.href);
        l.href = base + u.hash;
      });
    }
  }

  /* ---------- Scroll progress + shadow ---------- */
  var bar = nav.querySelector("[data-progress]");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = root.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (bar) bar.style.transform = "scaleX(" + p + ")";
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active section (same-page links only) ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll("[data-nav-link]")).filter(function (a) {
    var u = new URL(a.href, location.href);
    return u.pathname === location.pathname && u.hash;
  });
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[new URL(a.href, location.href).hash.slice(1)] = a; });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var a = byId[e.target.id];
          if (!a) return;
          links.forEach(function (l) { l.classList.remove("is-active"); });
          a.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = nav.querySelector("[data-menu-toggle]");
  var menu = nav.querySelector("[data-menu]");
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) { if (!e.target.closest("[data-nav]")) setMenu(false); });
  }

  /* ---------- Theme toggle ---------- */
  // On al-folio pages, theme.js already handles #light-toggle (light/dark/system cycle).
  if (typeof toggleThemeSetting !== "function") {
    var themeBtn = document.getElementById("light-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        store("theme", next);
      });
    }
  }
})();
