// Shell pages (home profiles + publications): scroll reveals, research filters,
// publication tabs and abstract toggles. Nav behaviour lives in site-nav.js.
(function () {
  "use strict";

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

  /* ---------- Sliding pill helper ---------- */
  function pillTo(pill, btn, instant) {
    if (!pill || !btn) return;
    if (instant) pill.style.transition = "none";
    pill.style.width = btn.offsetWidth + "px";
    pill.style.height = btn.offsetHeight + "px";
    pill.style.transform = "translate(" + btn.offsetLeft + "px," + btn.offsetTop + "px)";
    if (instant) {
      pill.offsetWidth; // flush
      pill.style.transition = "";
    }
  }
  function keepPill(bar) {
    var pill = bar.querySelector("[data-pill]");
    var place = function () { pillTo(pill, bar.querySelector(".filter.is-active"), true); };
    place();
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    return pill;
  }
  function animate(el, frames, opts) {
    if (reduceMotion || !el.animate) return Promise.resolve();
    return el.animate(frames, opts).finished.catch(function () {});
  }

  /* ---------- Research filters ---------- */
  var filterBar = document.querySelector("[data-filters]");
  var grid = document.querySelector("[data-filter-grid]");
  if (filterBar && grid) {
    var fPill = keepPill(filterBar);
    var buttons = Array.prototype.slice.call(filterBar.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-cat]"));
    var busy = false;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (busy || btn.classList.contains("is-active")) return;
        busy = true;
        buttons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        pillTo(fPill, btn);

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
            if (c.getAnimations) c.getAnimations().forEach(function (a) { a.cancel(); });
            c.classList.toggle("is-hidden", !match(c));
          });
          cards.filter(match).forEach(function (c, i) {
            animate(c, [{ opacity: 0, transform: "translateY(18px) scale(0.98)" }, { opacity: 1, transform: "none" }], { duration: 560, delay: i * 70, easing: EASE, fill: "backwards" });
          });
          busy = false;
        });
      });
    });
  }

  /* ---------- Publication tabs ---------- */
  var tabBar = document.querySelector("[data-tabs]");
  if (tabBar) {
    var tabs = Array.prototype.slice.call(tabBar.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));
    var tPill = tabBar.querySelector("[data-pill]");

    var select = function (key, opts) {
      opts = opts || {};
      var btn = tabs.filter(function (t) { return t.getAttribute("data-tab") === key; })[0];
      if (!btn) return;
      tabs.forEach(function (t) {
        var on = t === btn;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      pillTo(tPill, btn, opts.instant);
      panels.forEach(function (p) {
        var on = p.getAttribute("data-panel") === key;
        p.hidden = !on;
        p.classList.toggle("is-current", on);
        if (on && !opts.instant && !reduceMotion) {
          p.classList.remove("is-entering");
          p.offsetWidth; // restart animation
          p.classList.add("is-entering");
        }
      });
      if (opts.updateHash && history.replaceState) history.replaceState(null, "", "#" + key);
    };

    var initial = (location.hash || "").slice(1);
    if (!tabs.some(function (t) { return t.getAttribute("data-tab") === initial; })) {
      var prof = null;
      try { prof = localStorage.getItem("profile"); } catch (e) {}
      initial = prof === "video" ? "video" : "thermal";
    }
    select(initial, { instant: true });
    keepPill(tabBar);

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        if (!t.classList.contains("is-active")) select(t.getAttribute("data-tab"), { updateHash: true });
      });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus();
        select(n.getAttribute("data-tab"), { updateHash: true });
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
})();
