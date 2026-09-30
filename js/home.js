/* AURA FLOWERS · Portada: colección, presentación de imágenes, historia e Instagram */
(function () {
  "use strict";
  var A = window.Aura, $ = A.$, $$ = A.$$;

  /* ---------- Portada con vídeo + música ---------- */
  (function videoHero() {
    var hero = $("[data-vhero]"); if (!hero) return;
    var main = $("[data-vmain]", hero), bg = $("[data-vbg]", hero), music = $("[data-vaudio]", hero);
    var btn = $("[data-vsound]", hero), label = $("[data-vsound-label]", hero), prog = $("[data-vprog]", hero);
    var desktop = matchMedia("(min-width: 901px)");
    var soundOn = false, inView = true, fadeT, MAXV = .6, scrollGain = 1;

    // Calidad según pantalla: 1080p en ordenador, 720p en móvil
    main.src = desktop.matches ? main.getAttribute("data-src-hd") : main.getAttribute("data-src-sd");

    // Fondo desenfocado (solo escritorio): el mismo archivo, sin sonido
    function startBg() {
      if (!desktop.matches || A.reduce) { bg.pause(); return; }
      if (!bg.getAttribute("src")) bg.src = main.currentSrc || main.src;
      try { bg.currentTime = main.currentTime || 0; } catch (e) {}
      var p = bg.play(); if (p && p.catch) p.catch(function () {});
    }
    function ui() {
      var paused = main.paused;
      btn.classList.toggle("is-on", soundOn && !paused); btn.classList.toggle("is-paused", paused);
      label.textContent = paused ? "Ver vídeo" : (soundOn ? "Silenciar" : "Activar sonido");
      btn.setAttribute("aria-label", label.textContent);
    }
    // Fundido de volumen de la música
    function fadeTo(target, done) {
      clearInterval(fadeT);
      fadeT = setInterval(function () {
        var cur = music.volume, step = target > cur ? .04 : -.06, v = cur + step;
        if ((step > 0 && v >= target) || (step < 0 && v <= target)) { music.volume = Math.max(0, Math.min(1, target)); clearInterval(fadeT); done && done(); }
        else music.volume = Math.max(0, Math.min(1, v));
      }, 50);
    }
    function musicOn() { music.volume = 0; var p = music.play(); if (p && p.catch) p.catch(function () { soundOn = false; ui(); }); fadeTo(MAXV * scrollGain); }
    function musicOff(keepWish) { fadeTo(0, function () { music.pause(); }); if (!keepWish) soundOn = false; }
    function play() { var p = main.play(); if (p && p.catch) p.catch(function () { ui(); }); startBg(); }

    btn.addEventListener("click", function () {
      if (main.paused) { play(); soundOn = true; musicOn(); }
      else if (!soundOn) { soundOn = true; musicOn(); }
      else musicOff();
      ui();
    });
    main.addEventListener("play", ui); main.addEventListener("pause", ui);
    main.addEventListener("timeupdate", function () {
      if (main.duration) prog.style.transform = "scaleX(" + (main.currentTime / main.duration).toFixed(4) + ")";
      if (!bg.paused && Math.abs(bg.currentTime - main.currentTime) > .35) bg.currentTime = main.currentTime;
    });
    desktop.addEventListener && desktop.addEventListener("change", startBg);

    // Movimiento reducido: sin reproducción automática
    if (A.reduce) { main.removeAttribute("autoplay"); main.pause(); }
    else play();
    ui();

    // Pausa vídeo y música al salir de pantalla o de la pestaña; vuelven al regresar
    function away() { main.pause(); bg.pause(); if (soundOn) musicOff(true); }
    function back() { if (A.reduce) return; play(); if (soundOn) musicOn(); }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) {
      var was = inView; inView = en[0].isIntersecting;
      if (!inView && was) away(); else if (inView && !was) back();
    }, { threshold: .12 }).observe(hero);
    document.addEventListener("visibilitychange", function () { if (document.hidden) away(); else if (inView) back(); });

    // Transición al hacer scroll (--p de 0 a 1) y la música baja poco a poco
    var ticking = false;
    function onScroll() {
      var p = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight || innerHeight)));
      hero.style.setProperty("--p", p.toFixed(3));
      scrollGain = Math.max(0, 1 - p * 1.3);
      if (soundOn && !music.paused) { clearInterval(fadeT); music.volume = MAXV * scrollGain; }
      ticking = false;
    }
    addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  })();

  /* ---------- Colección ---------- */
  var grid = $("[data-grid]"), filtersEl = $("[data-filters]"), current = "todas";

  function buildFilters() {
    var used = {};
    A.cat.productos.forEach(function (p) { used[p.categoria] = true; });
    var anyAvail = A.cat.productos.some(function (p) { return A.status(p).comprable; });
    var anySold = A.cat.productos.some(function (p) { return A.status(p).estado === "agotado"; });
    var opts = [{ id: "todas", nombre: "Todas" }].concat(anyAvail ? [{ id: "disponibles", nombre: "Disponibles" }] : [])
      .concat(A.cat.categorias.filter(function (c) { return used[c.id]; }));
    // "Vendidas" solo tiene sentido si conviven piezas disponibles y vendidas
    if (anySold && anyAvail) opts.push({ id: "archivo", nombre: "Vendidas" });
    if (!opts.some(function (o) { return o.id === current; })) current = "todas";
    var note = $("[data-shop-note]"); if (note) note.hidden = anyAvail;
    filtersEl.innerHTML = opts.map(function (o) {
      return '<button class="filter' + (o.id === current ? " is-active" : "") + '" data-f="' + o.id + '" aria-pressed="' + (o.id === current) + '">' + A.esc(o.nombre) + "</button>";
    }).join("");
  }
  function render() {
    var list = A.sortProducts(A.cat.productos).filter(function (p) {
      var s = A.status(p);
      if (current === "todas") return true;
      if (current === "disponibles") return s.comprable;
      if (current === "archivo") return s.estado === "agotado";
      return p.categoria === current;
    });
    grid.innerHTML = list.length ? list.map(A.card).join("") : '<p class="center" style="grid-column:1/-1;color:var(--muted)">Muy pronto habrá nuevas piezas en esta sección.</p>';
    A.bindLinks(grid);
    A.observe(grid);
  }
  if (grid) {
    buildFilters(); render();
    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-f]"); if (!b) return;
      current = b.getAttribute("data-f");
      $$(".filter", filtersEl).forEach(function (x) { var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on); });
      render();
    });
    document.addEventListener("aura:stock", function () { buildFilters(); render(); });
  }

  /* ---------- Presentación del hero ---------- */
  var slides = $$("[data-slides] .slide"), dots = $("[data-dots]"), idx = 0, timer;
  if (slides.length > 1) {
    dots.innerHTML = slides.map(function (_, i) { return '<button aria-label="Imagen ' + (i + 1) + '"' + (i === 0 ? ' class="is-active"' : "") + "></button>"; }).join("");
    var dotEls = $$("button", dots);
    function go(n) {
      slides[idx].classList.remove("is-active"); dotEls[idx].classList.remove("is-active");
      idx = (n + slides.length) % slides.length;
      var img = $("img", slides[idx]); if (img.loading === "lazy") img.loading = "eager";
      slides[idx].classList.add("is-active"); void dotEls[idx].offsetWidth; dotEls[idx].classList.add("is-active");
    }
    function play() { clearInterval(timer); if (!A.reduce) timer = setInterval(function () { go(idx + 1); }, 6000); }
    dots.addEventListener("click", function (e) { var i = dotEls.indexOf(e.target); if (i > -1) { go(i); play(); } });
    document.addEventListener("visibilitychange", function () { document.hidden ? clearInterval(timer) : play(); });
    // precarga la siguiente imagen cuando el navegador esté libre
    setTimeout(function () { slides.forEach(function (s) { var im = $("img", s); im.loading = "eager"; }); }, 2500);
    play();
  }

  /* ---------- Línea de la historia ---------- */
  var line = $("[data-story-line]"), chapters = $("[data-chapters]");
  if (line && chapters && !A.reduce) {
    var t = false;
    function upd() {
      var r = chapters.getBoundingClientRect(), vh = innerHeight;
      var p = Math.min(1, Math.max(0, (vh * .6 - r.top) / r.height));
      line.style.transform = "scaleY(" + p.toFixed(3) + ")"; t = false;
    }
    addEventListener("scroll", function () { if (!t) { t = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- Vídeo destacado (reproductor propio, se carga al pulsar) ---------- */
  var videoSrc = A.get("redes.videoDestacado"), reelUrl = A.get("redes.reelDestacado"), reel = $("[data-reel]");
  var link = $("[data-reel-link]");
  if (link) { if (reelUrl) link.href = reelUrl; else link.hidden = true; }
  if (videoSrc && reel) {
    var poster = A.get("redes.videoPortada") || "";
    $("[data-reel-play]", reel).addEventListener("click", function () {
      var box = document.createElement("div"); box.className = "reel-video is-playing";
      box.innerHTML = '<video src="' + A.esc(videoSrc) + '"' + (poster ? ' poster="' + A.esc(poster) + '"' : "") + ' playsinline muted loop preload="auto" aria-label="Vídeo de Aura Flowers"></video>' +
        '<button class="reel-toggle" type="button" aria-label="Pausar"><svg viewBox="0 0 24 24"><path class="i-pause" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/><path class="i-play" d="M8 5.5v13l10.5-6.5z"/></svg></button>';
      reel.innerHTML = ""; reel.appendChild(box);
      var v = $("video", box), btn = $(".reel-toggle", box);
      var sync = function () { var on = !v.paused; box.classList.toggle("is-playing", on); btn.setAttribute("aria-label", on ? "Pausar" : "Reproducir"); };
      v.addEventListener("play", sync); v.addEventListener("pause", sync);
      box.addEventListener("click", function () { v.paused ? v.play() : v.pause(); });
      var p = v.play(); if (p && p.catch) p.catch(sync);
      // Pausa automática al salir de pantalla
      var seen = false;
      if ("IntersectionObserver" in window) new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) seen = true; else if (seen && !v.paused) v.pause();
      }, { threshold: .2 }).observe(box);
    });
  }

  /* ---------- Carrusel de Instagram ---------- */
  var insta = $("[data-insta]");
  if (insta) {
    var imgs = [
      ["assets/hero/jardin-sonrisa.jpg", "Amanda en un jardín entre flores amarillas"],
      ["assets/ig/ig-06.jpg", "Orquídea natural encapsulada en resina"],
      ["assets/aura/orquideas-mesa.jpg", "Orquídeas de colores en maceta"],
      ["assets/ig/ig-07.jpg", "Pendientes de margarita lila"],
      ["assets/hero/buganvilla.jpg", "Pared de buganvillas"],
      ["assets/ig/ig-01.jpg", "Amanda con una flor de hibisco"],
      ["assets/ig/ig-05.jpg", "Pendientes con flores rosas"],
      ["assets/taller/orquideas-estante.jpg", "Orquídeas en el estudio"],
      ["assets/ig/ig-03.jpg", "Collar con rosa natural"],
      ["assets/hero/phalaenopsis-cesta.jpg", "Orquídeas Phalaenopsis"]
    ];
    var ig = A.get("redes.instagram") || "#";
    var html = imgs.map(function (x) { return '<a href="' + A.esc(ig) + '" target="_blank" rel="noopener" aria-label="Ver en Instagram"><img src="' + x[0] + '" alt="' + A.esc(x[1]) + '" loading="lazy" decoding="async"></a>'; }).join("");
    insta.innerHTML = html + html.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ');
  }
})();
