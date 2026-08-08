/* Landing – JS puro: scroll reveal, progresso dos 7 passos, barra de leitura */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Scroll reveal suave */
  var revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduced) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = parseFloat(entry.target.getAttribute("data-delay") || "0");
            setTimeout(function () { entry.target.classList.add("is-visible"); }, delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* 2. Barra de progresso de leitura */
  var bar = document.getElementById("progressBar");
  var track = document.getElementById("stepsTrack");

  function onScroll() {
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct.toFixed(2) + "%";
    }
    /* 3. Progresso "construção passo a passo" nos 7 passos */
    if (track) {
      var rect = track.getBoundingClientRect();
      var start = window.innerHeight * 0.75;
      var total = rect.height + start * 0.4;
      var done = Math.min(Math.max(start - rect.top, 0), total);
      track.style.setProperty("--steps-progress", ((done / total) * 100).toFixed(1) + "%");
    }
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () { onScroll(); ticking = false; });
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
  onScroll();
})();
