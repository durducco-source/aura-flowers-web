/* AURA FLOWERS · Portada: colección, presentación de imágenes, historia e Instagram */
(function () {
  "use strict";
  var A = window.Aura, $ = A.$, $$ = A.$$;

  /* ---------- Colección ---------- */
  var grid = $("[data-grid]"), filtersEl = $("[data-filters]"), current = "todas";

  function buildFilters() {
    var used = {};
    A.cat.productos.forEach(function (p) { used[p.categoria] = true; });
    var opts = [{ id: "todas", nombre: "Todas" }, { id: "disponibles", nombre: "Disponibles" }]
      .concat(A.cat.categorias.filter(function (c) { return used[c.id]; }));
    if (A.cat.productos.some(function (p) { return A.status(p).estado === "agotado"; })) opts.push({ id: "archivo", nombre: "Archivo" });
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
