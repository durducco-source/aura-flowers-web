/* AURA FLOWERS · Ficha de producto (producto.html?id=...) */
(function () {
  "use strict";
  var A = window.Aura, $ = A.$, $$ = A.$$, esc = A.esc;
  var box = $("[data-pdp]"), bar = $("[data-pbar]");
  var id = new URLSearchParams(location.search).get("id");
  var p = id && A.product(id);
  var qty = 1, tracked = false, first = true;

  if (!p) {
    document.title = "Pieza no encontrada · Aura Flowers";
    box.innerHTML = '<div class="empty" style="padding:120px 0"><img src="assets/brand/aura-orquidea-dorado.png" alt="" width="70" height="65"><h1 class="h2" style="margin-bottom:14px">Esta pieza ya no está aquí</h1><p>Puede que el enlace haya cambiado. Descubre las piezas disponibles ahora.</p><a class="btn" href="index.html#coleccion">Ver la colección</a></div>';
    if (bar) bar.remove();
    related();
    return;
  }

  // SEO y redes
  document.title = p.nombre + " · Aura Flowers";
  var abs = function (u) { return A.get("marca.url") + "/" + u; };
  setMeta('meta[name="description"]', p.resumen + " Joya artesanal de Aura Flowers hecha a mano con flores naturales.");
  setMeta('meta[property="og:title"]', p.nombre + " · Aura Flowers");
  setMeta('meta[property="og:description"]', p.resumen);
  setMeta('meta[property="og:image"]', abs(p.imagenes[0]));
  var canon = document.createElement("link"); canon.rel = "canonical"; canon.href = abs("producto.html?id=" + encodeURIComponent(p.id)); document.head.appendChild(canon);
  function setMeta(sel, v) { var m = $(sel); if (m) m.setAttribute("content", v); }

  function render() {
    var s = A.status(p), imgs = p.imagenes || [];
    var inCart = A.cart.qty(p.id), maxAdd = Math.max(0, s.stock - inCart);
    qty = Math.max(1, Math.min(qty, maxAdd || 1));
    var tags = "";
    if (s.estado === "agotado") tags += '<span class="tag tag--off">Agotado</span>';
    else if (s.estado === "proximamente") tags += '<span class="tag tag--off">Próximamente</span>';
    else {
      tags += '<span class="tag tag--gold">Disponible</span>';
      tags += s.unica ? '<span class="tag">Pieza única</span>' : '<span class="tag">' + s.stock + " unidades</span>";
    }
    if (p.etiqueta && s.estado === "disponible") tags += '<span class="tag">' + esc(p.etiqueta) + "</span>";

    var buy;
    if (s.comprable) {
      buy = (s.stock > 1 ? '<div class="pdp-buy"><div class="qty" aria-label="Cantidad"><button data-pq="-1" aria-label="Quitar una"' + (qty <= 1 ? " disabled" : "") + '>−</button><span data-pqv>' + qty + '</span><button data-pq="1" aria-label="Añadir una"' + (qty >= maxAdd ? " disabled" : "") + '>+</button></div>' +
        '<button class="btn" data-buy="' + esc(p.id) + '" data-qty="' + qty + '">Comprar ahora <i class="arr"></i></button></div>' :
        '<div class="pdp-actions"><button class="btn btn--full" data-buy="' + esc(p.id) + '">Comprar ahora <i class="arr"></i></button></div>') +
        '<div class="pdp-actions"><button class="btn btn--line btn--full" data-add="' + esc(p.id) + '" data-qty="' + qty + '"' + (maxAdd <= 0 ? " disabled" : "") + '>' + (maxAdd <= 0 ? "Ya está en tu carrito" : "Añadir al carrito") + "</button></div>" +
        '<p class="pdp-note">Al hacer tu pedido te confirmamos disponibilidad, importe y envío. Pago por Bizum o transferencia.</p>';
    } else if (s.estado === "proximamente") {
      buy = '<div class="pdp-actions"><button class="btn btn--full" disabled>Próximamente</button><a class="btn btn--line btn--full" data-wa data-wa-text="' + esc("¡Hola Aura Flowers! 🌸 Avisadme cuando esté disponible: " + p.nombre) + '" href="#">Avísame cuando esté disponible</a></div>';
    } else {
      buy = '<div class="pdp-actions"><button class="btn btn--full" disabled>Agotado · Pieza vendida</button><a class="btn btn--line btn--full" data-wa data-wa-text="' + esc("¡Hola Aura Flowers! 🌸 Me encanta la pieza «" + p.nombre + "». ¿Podríais crear una similar?") + '" href="#">Encargar una pieza similar</a></div>' +
        '<p class="pdp-note">Esta pieza ya encontró su dueña. La mantenemos aquí como parte del archivo de Aura Flowers.</p>';
    }

    var specs = p.materiales ? '<dl class="specs">' + Object.keys(p.materiales).map(function (k) { return "<dt>" + esc(k) + "</dt><dd>" + esc(p.materiales[k]) + "</dd>"; }).join("") + "</dl>" : "";

    box.innerHTML =
      '<nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a><span>/</span><a href="index.html#coleccion">Colección</a><span>/</span><span>' + esc(A.catName(p.categoria)) + "</span></nav>" +
      '<div class="pdp-grid"><div class="pdp-gallery">' +
        '<div class="gallery-main' + (s.estado !== "disponible" ? " card is-" + s.estado : "") + '">' +
          imgs.map(function (src, i) { return '<img src="' + esc(src) + '" alt="' + esc(p.nombre) + (i ? " · vista " + (i + 1) : "") + '" style="opacity:' + (i ? 0 : 1) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' data-gi="' + i + '">'; }).join("") +
          (s.estado === "agotado" ? '<span class="state"><span>Agotado</span></span>' : s.estado === "proximamente" ? '<span class="state"><span>Próximamente</span></span>' : "") +
        "</div>" +
        (imgs.length > 1 ? '<div class="thumbs">' + imgs.map(function (src, i) { return '<button class="' + (i ? "" : "is-active") + '" data-thumb="' + i + '" aria-label="Ver imagen ' + (i + 1) + '"><img src="' + esc(src) + '" alt=""></button>'; }).join("") + "</div>" : "") +
      "</div>" +
      '<div class="pdp-info">' +
        '<span class="card-cat">' + esc(A.catName(p.categoria)) + "</span>" +
        "<h1>" + esc(p.nombre) + "</h1>" +
        '<div class="pdp-tags">' + tags + "</div>" +
        '<p class="pdp-desc">' + esc(p.descripcion || p.resumen) + "</p>" +
        buy +
        '<ul class="pdp-trust">' +
          '<li><svg viewBox="0 0 40 40"><path d="M20 34V14M20 22c-6 0-10-4-10-10 6 0 10 4 10 10zm0-4c5 0 8-3 8-8-5 0-8 3-8 8z"/></svg>Flores<br>naturales</li>' +
          '<li><svg viewBox="0 0 40 40"><path d="M9 31c5-2 9-7 11-13l4 4c-6 2-11 6-13 11zM24 22l6-6a2.8 2.8 0 0 0-4-4l-6 6"/></svg>Hecha<br>a mano</li>' +
          '<li><svg viewBox="0 0 40 40"><rect x="8" y="15" width="24" height="17"/><path d="M6 11h28v4H6zM20 11v21M20 11c-3-5-8-5-8-2s5 2 8 2c3 0 8 1 8-2s-5-3-8 2"/></svg>Lista para<br>regalar</li>' +
        "</ul>" +
        '<div class="acc">' +
          (specs ? '<details open><summary>Materiales y detalles<i></i></summary><div class="acc-body">' + specs + "</div></details>" : "") +
          '<details><summary>Cuidados<i></i></summary><div class="acc-body">Evita el contacto prolongado con agua, perfumes y cremas, y no la dejes al sol directo durante horas. Guárdala en su caja y límpiala con un paño suave. Al ser una flor natural, su tono puede variar ligeramente respecto a la foto.</div></details>' +
          '<details><summary>Envío y pago<i></i></summary><div class="acc-body">Sale desde ' + esc(A.get("marca.ciudad") || "Lloret de Mar") + ' envuelta y lista para regalar. Tras tu pedido te confirmamos el importe total con el envío y te indicamos cómo pagar por Bizum o transferencia bancaria. <a href="legal.html#condiciones" style="border-bottom:1px solid var(--gold)">Condiciones de venta</a>.</div></details>' +
        "</div>" +
      "</div></div>";

    if (!first) $$(".fade, .reveal", box).forEach(function (el) { el.classList.add("is-in"); });
    first = false;
    A.bindLinks(box); A.observe(box);

    // Barra fija en móvil
    if (bar) {
      bar.innerHTML = s.comprable
        ? '<button class="btn btn--sm" data-buy="' + esc(p.id) + '">Comprar</button><button class="btn btn--line btn--sm" data-add="' + esc(p.id) + '"' + (maxAdd <= 0 ? " disabled" : "") + ">" + (maxAdd <= 0 ? "En tu carrito" : "Añadir al carrito") + "</button>"
        : '<button class="btn btn--sm" disabled>' + (s.estado === "agotado" ? "Agotado" : "Próximamente") + '</button><a class="btn btn--line btn--sm" data-wa data-wa-text="' + esc("¡Hola Aura Flowers! 🌸 Me interesa la pieza «" + p.nombre + "».") + '" href="#">Consultar</a>';
      A.bindLinks(bar);
    }

    if (!tracked) { tracked = true; A.track("view_item", { id: p.id, nombre: p.nombre }); }
  }

  box.addEventListener("click", function (e) {
    var t = e.target.closest("[data-thumb]");
    if (t) {
      var i = t.getAttribute("data-thumb");
      $$("[data-gi]", box).forEach(function (im) { im.style.opacity = im.getAttribute("data-gi") === i ? 1 : 0; });
      $$("[data-thumb]", box).forEach(function (b) { b.classList.toggle("is-active", b === t); });
      return;
    }
    var q = e.target.closest("[data-pq]");
    if (q) { qty += Number(q.getAttribute("data-pq")); render(); watch(); }
  });

  // Mostrar barra inferior en móvil cuando los botones principales no se ven
  var io = bar && "IntersectionObserver" in window ? new IntersectionObserver(function (en) { bar.classList.toggle("show", !en[0].isIntersecting); }) : null;
  function watch() { var el = io && ($(".pdp-buy", box) || $(".pdp-actions", box)); if (el) { io.disconnect(); io.observe(el); } }
  document.addEventListener("aura:cart", function () { render(); watch(); });
  document.addEventListener("aura:stock", function () { render(); watch(); related(); });

  render();
  watch();
  related();

  function related() {
    var el = $("[data-related]"); if (!el) return;
    var others = A.sortProducts(A.cat.productos.filter(function (x) { return !p || x.id !== p.id; }));
    if (p) others.sort(function (a, b) { return (b.categoria === p.categoria) - (a.categoria === p.categoria); });
    others = A.sortProducts(others.slice(0, 3));
    el.innerHTML = others.map(A.card).join("");
    A.bindLinks(el); A.observe(el);
  }
})();
