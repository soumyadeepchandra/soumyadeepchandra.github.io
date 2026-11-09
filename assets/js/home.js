// Home page interactions: scroll reveals, nav progress/active state, research filters,
// abstract toggles, stat count-up, theme toggle, mobile menu.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

  /* ---------- Scroll reveal (staggered per batch) ---------- */
  function settle(el) {
    el.removeAttribute("data-reveal");
    el.classList.remove("is-visible");
    el.style.removeProperty("--rd");
  }

  function revealNow(el, delay) {
    el.style.setProperty("--rd", delay + "s");
    el.classList.add("is-visible");
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      settle(el);
    };
    el.addEventListener("transitionend", function onEnd(e) {
      if (e.target === el && e.propertyName === "transform") {
        el.removeEventListener("transitionend", onEnd);
        finish();
      }
    });
    setTimeout(finish, (delay + 1.2) * 1000);
  }

  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(settle);
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        var batch = entries
          .filter(function (e) { return e.isIntersecting; })
          .map(function (e) { return e.target; })
          .sort(function (a, b) {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
          });
        batch.forEach(function (el, i) {
          io.unobserve(el);
          var extra = parseFloat(el.getAttribute("data-delay") || "0");
          revealNow(el, Math.min(i * 0.08, 0.48) + extra);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Nav: progress bar + shadow ---------- */
  var nav = document.querySelector("[data-nav]");
  var bar = document.querySelector("[data-progress]");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = root.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (bar) bar.style.transform = "scaleX(" + p + ")";
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Nav: active section ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
  if ("IntersectionObserver" in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove("is-active"); });
          var a = byId[e.target.id];
          if (a) a.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  var top = document.querySelector("[data-scroll-top]");
  if (top) {
    top.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("[data-nav]")) setMenu(false);
    });
  }

  /* ---------- Theme toggle (shares al-folio's localStorage key) ---------- */
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Research filters with sliding pill ---------- */
  var filterBar = document.querySelector("[data-filters]");
  var grid = document.querySelector("[data-filter-grid]");
  if (filterBar && grid) {
    var pill = filterBar.querySelector("[data-pill]");
    var buttons = Array.prototype.slice.call(filterBar.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-cat]"));
    var busy = false;

    var movePill = function (btn) {
      if (!pill || !btn) return;
      pill.style.width = btn.offsetWidth + "px";
      pill.style.height = btn.offsetHeight + "px";
      pill.style.transform = "translate(" + btn.offsetLeft + "px," + btn.offsetTop + "px)";
    };
    var active = function () { return filterBar.querySelector(".filter.is-active"); };
    movePill(active());
    window.addEventListener("resize", function () { movePill(active()); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(active()); });

    var animate = function (el, frames, opts) {
      if (reduceMotion || !el.animate) return Promise.resolve();
      return el.animate(frames, opts).finished.catch(function () {});
    };

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (busy || btn.classList.contains("is-active")) return;
        busy = true;
        buttons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        movePill(btn);

        var f = btn.getAttribute("data-filter");
        var match = function (c) { return f === "all" || c.getAttribute("data-cat") === f; };
        var leaving = cards.filter(function (c) { return !c.classList.contains("is-hidden"); });
        cards.forEach(settle); // finish any pending scroll-reveal so filtering owns the cards

        Promise.all(
          leaving.map(function (c) {
            return animate(c, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.96)" }], { duration: 220, easing: "ease-in", fill: "forwards" });
          })
        ).then(function () {
          cards.forEach(function (c) {
            c.getAnimations && c.getAnimations().forEach(function (a) { a.cancel(); });
            c.classList.toggle("is-hidden", !match(c));
          });
          var shown = cards.filter(match);
          shown.forEach(function (c, i) {
            animate(c, [{ opacity: 0, transform: "translateY(18px) scale(0.98)" }, { opacity: 1, transform: "none" }], { duration: 560, delay: i * 70, easing: EASE, fill: "backwards" });
          });
          busy = false;
        });
      });
    });
  }

  /* ---------- Publication abstracts ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-abstract-toggle]");
    if (!t) return;
    var card = t.closest(".pub-card");
    var box = card && card.querySelector("[data-abstract]");
    if (!box) return;
    var open = !box.classList.contains("is-open");
    box.classList.toggle("is-open", open);
    t.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Stat count-up ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (!reduceMotion && "IntersectionObserver" in window && counters.length) {
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          countIO.unobserve(e.target);
          countUp(e.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countIO.observe(el); });
  }

  function countUp(el) {
    var text = el.textContent.trim();
    var m = text.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return;
    var prefix = m[1], numStr = m[2], suffix = m[3];
    var target = parseFloat(numStr.replace(/,/g, ""));
    var decimals = (numStr.split(".")[1] || "").length;
    var useCommas = numStr.indexOf(",") !== -1;
    var dur = 1400, start = null;
    var fmt = function (v) {
      var s = v.toFixed(decimals);
      if (useCommas) {
        var parts = s.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        s = parts.join(".");
      }
      return prefix + s + suffix;
    };
    var step = function (ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = text;
    };
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  }
})();
