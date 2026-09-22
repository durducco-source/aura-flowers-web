/* ==========================================================================
   AURA FLOWERS · FUNCIONAMIENTO
   Catálogo, filtros, ficha de producto, pedidos por WhatsApp/Instagram,
   galería, preguntas frecuentes y animaciones. Normalmente no hay que tocarlo.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.AURA_CONFIG || {};
  var DATA = window.AURA_DATA || { categorias: [], productos: [], galeria: [], preguntas: [] };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function get(path) {
    return path.split(".").reduce(function (o, k) { return o && o[k] != null ? o[k] : undefined; }, CFG);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn("[Aura]", e); } }
  function euros(n) { return (Math.round(n * 100) / 100).toString().replace(".", ",") + " €"; }
  function priceText(p) { return (p.desde ? "Desde " : "") + euros(p.precio); }
  function catName(id) { var c = DATA.categorias.filter(function (x) { return x.id === id; })[0]; return c ? c.nombre : ""; }
  function joinList(arr) { return arr.length > 1 ? arr.slice(0, -1).join(", ") + " o " + arr[arr.length - 1] : (arr[0] || ""); }

  /* ---------- Enlaces de contacto ---------- */
  var MSG = {
    general: "Hola Amanda, he visto la web de Aura Flowers y me gustaría hacer un pedido.",
    regalo: "Hola Amanda, quiero hacer un regalo especial. ¿Me ayudas a elegir la pieza perfecta?",
    medida: "Hola Amanda, me gustaría encargar una pieza a medida con una flor especial. Te cuento su historia:"
  };
  function waLink(text) {
    var n = String(get("contacto.whatsapp") || "").replace(/\D/g, "");
    return n ? "https://wa.me/" + n + "?text=" + encodeURIComponent(text) : "";
  }
  function productMsg(p) {
    return "Hola Amanda, me encanta la pieza «" + p.nombre + "» (" + priceText(p).toLowerCase() + ") que he visto en la web. ¿Está disponible?";
  }
  var igUser = String(get("contacto.instagram") || "").replace(/^@/, "");
  var igUrl = igUser ? "https://www.instagram.com/" + igUser + "/" : "";
  var igDm = igUser ? "https://ig.me/m/" + igUser : "";

  function applyConfig() {
    var desde = get("precioDesde");
    if (desde != null) $$("[data-precio-desde]").forEach(function (el) { el.textContent = euros(desde); });
    var medida = DATA.productos.filter(function (p) { return p.categoria === "a-medida"; })[0];
    $$("[data-precio-medida]").forEach(function (el) { if (medida) el.textContent = euros(medida.precio); else el.closest("p").hidden = true; });
    var envio = get("pedidos.envioGratisDesde");
    $$("[data-envio-gratis]").forEach(function (el) { el.hidden = !envio; });
    $$("[data-envio-importe]").forEach(function (el) { if (envio) el.textContent = euros(envio); });
    var pagos = get("pedidos.pagos") || [];
    $$("[data-pagos]").forEach(function (el) { if (pagos.length) el.textContent = joinList(pagos); });
    var ciudad = get("marca.ciudad");
    $$("[data-ciudad]").forEach(function (el) { if (ciudad) el.textContent = ciudad; });

    $$("[data-show-if]").forEach(function (el) { el.hidden = !get(el.getAttribute("data-show-if")); });
    $$("[data-wa]").forEach(function (a) {
      var href = waLink(MSG[a.getAttribute("data-wa-msg")] || MSG.general);
      if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; } else a.hidden = true;
    });
    $$("[data-ig]").forEach(function (a) { if (igUrl) a.href = igUrl; else a.hidden = true; });
    $$("[data-ig-dm]").forEach(function (a) { if (igDm) a.href = igDm; else a.hidden = true; });
    $$("[data-ig-user]").forEach(function (el) { if (igUser) el.textContent = "@" + igUser; });
    var tel = get("contacto.telefono");
    $$("[data-tel]").forEach(function (a) { if (tel) { a.href = "tel:" + tel.replace(/[^\d+]/g, ""); a.textContent = tel; } });
    var mail = get("contacto.email");
    $$("[data-mail]").forEach(function (a) { if (mail) { a.href = "mailto:" + mail; a.textContent = mail; } });
    $$("[data-mail-plain]").forEach(function (a) { if (mail) a.href = "mailto:" + mail; });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Catálogo ---------- */
  function renderProducts() {
    var box = $("[data-products]"); if (!box) return;
    box.innerHTML = DATA.productos.map(function (p, i) {
      var agotada = p.disponible === false;
      var price = (p.desde ? "<small>Desde</small>" : "") + euros(p.precio);
      return '<article class="product reveal" style="--d:' + ((i % 4) * 0.06).toFixed(2) + 's" data-cat="' + esc(p.categoria) + '">' +
        '<button type="button" class="product-media" data-open="' + esc(p.id) + '" aria-label="Ver ' + esc(p.nombre) + '">' +
          (p.etiqueta || agotada ? '<span class="product-badge">' + esc(agotada ? "Agotada" : p.etiqueta) + '</span>' : '') +
          '<img src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async">' +
          '<span class="product-quick">Ver detalles</span>' +
        '</button>' +
        '<div class="product-info">' +
          '<h3><button type="button" data-open="' + esc(p.id) + '">' + esc(p.nombre) + '</button></h3>' +
          '<p class="product-short">' + esc(p.corto) + '</p>' +
          '<div class="product-foot"><span class="price">' + price + '</span>' +
          (agotada ? '' : '<a class="product-order" href="' + esc(waLink(productMsg(p))) + '" target="_blank" rel="noopener">Pedir</a>') +
          '</div>' +
        '</div></article>';
    }).join("");

    var chips = $("[data-chips]");
    var used = DATA.categorias.filter(function (c) { return DATA.productos.some(function (p) { return p.categoria === c.id; }); });
    chips.innerHTML = '<button type="button" class="is-active" data-filter="todo" aria-pressed="true">Todo</button>' +
      used.map(function (c) { return '<button type="button" data-filter="' + esc(c.id) + '" aria-pressed="false">' + esc(c.nombre) + '</button>'; }).join("");
    $$("button", chips).forEach(function (b) { b.addEventListener("click", function () { filter(b.getAttribute("data-filter")); }); });

    $$("[data-filter-go]").forEach(function (a) {
      a.addEventListener("click", function () { filter(a.getAttribute("data-filter-go")); });
    });
  }
  function filter(cat) {
    $$("[data-chips] button").forEach(function (b) { var on = b.getAttribute("data-filter") === cat; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
    $$(".product").forEach(function (el) {
      var show = cat === "todo" || el.getAttribute("data-cat") === cat;
      el.classList.toggle("is-hidden", !show);
      if (show) el.classList.add("is-in");
    });
  }

  /* ---------- Ficha de producto ---------- */
  var lastFocus = null;
  function initModal() {
    var d = $("#product-modal"); if (!d) return;
    document.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-open]"); if (!t) return;
      var p = DATA.productos.filter(function (x) { return x.id === t.getAttribute("data-open"); })[0]; if (!p) return;
      $("#pm-cat").textContent = catName(p.categoria);
      $("#pm-name").textContent = p.nombre;
      $("#pm-price").innerHTML = (p.desde ? "<small>Desde</small>" : "") + esc(euros(p.precio));
      $("#pm-desc").textContent = p.descripcion || p.corto || "";
      var det = p.detalles || {};
      $("#pm-details").innerHTML = Object.keys(det).map(function (k) { return "<dt>" + esc(k) + "</dt><dd>" + esc(det[k]) + "</dd>"; }).join("");
      $("#pm-details").hidden = !Object.keys(det).length;
      var img = $("#pm-img"); img.src = p.imagen; img.alt = p.nombre;
      var wa = $("#pm-wa"), link = waLink(productMsg(p));
      wa.hidden = !link || p.disponible === false; if (link) wa.href = link;
      var ig = $("#pm-ig"); ig.hidden = !igDm; if (igDm) ig.href = igDm;
      lastFocus = document.activeElement;
      if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
      document.documentElement.style.overflow = "hidden";
    });
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { d.close(); }); });
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    d.addEventListener("close", function () { document.documentElement.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); });
  }

  /* ---------- Galería y preguntas ---------- */
  function renderGallery() {
    var box = $("[data-gallery]"); if (!box) return;
    box.innerHTML = (DATA.galeria || []).map(function (g, i) {
      return '<figure class="gal gal--' + esc(g.forma || "cuadrada") + ' reveal" style="--d:' + ((i % 5) * 0.06).toFixed(2) + 's"><img src="' + esc(g.img) + '" alt="' + esc(g.alt) + '" loading="lazy" decoding="async"></figure>';
    }).join("");
  }
  function renderFaq() {
    var box = $("[data-faq]"); if (!box) return;
    box.innerHTML = (DATA.preguntas || []).map(function (q) {
      return "<details><summary>" + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>";
    }).join("");
  }

  /* ---------- Cabecera, menú y barra móvil ---------- */
  function initHeader() {
    var header = $(".header"), burger = $(".burger"), mbar = $("[data-mbar]"), hero = $(".hero");
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
      if (mbar && hero) {
        var past = window.scrollY > hero.offsetHeight * 0.6;
        var nearEnd = (window.innerHeight + window.scrollY) > document.body.scrollHeight - 520;
        mbar.classList.toggle("is-on", past && !nearEnd);
      }
    }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    function setMenu(open) {
      document.body.classList.toggle("nav-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }
    burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("nav-open")); });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    if (!("IntersectionObserver" in window)) return;
    var links = {};
    $$(".nav a:not(.btn)").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$(".nav a").forEach(function (a) { a.classList.remove("is-active"); });
        if (links[en.target.id]) links[en.target.id].classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { io.observe(s); });
  }

  function initReveal() {
    var els = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- SEO: datos estructurados y analítica ---------- */
  function injectSchema() {
    var base = get("marca.url") || "";
    var prices = DATA.productos.map(function (p) { return p.precio; });
    var data = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "Aura Flowers",
      "description": "Flores naturales convertidas en joyas y regalos hechos a mano.",
      "url": base,
      "image": base + "/assets/img/og-image.jpg",
      "address": { "@type": "PostalAddress", "addressLocality": get("marca.ciudad") || "", "addressCountry": "ES" },
      "priceRange": prices.length ? euros(Math.min.apply(null, prices)) + " – " + euros(Math.max.apply(null, prices)) : undefined,
      "telephone": get("contacto.telefono") || undefined,
      "sameAs": igUrl ? [igUrl] : undefined,
      "makesOffer": DATA.productos.map(function (p) {
        return { "@type": "Offer", "priceCurrency": "EUR", "price": p.precio, "itemOffered": { "@type": "Product", "name": p.nombre, "image": base + "/" + p.imagen, "description": p.corto } };
      })
    };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
  function injectAnalytics() {
    var id = get("analitica.googleAnalyticsId"); if (!id) return;
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", id, { anonymize_ip: true });
  }

  safe(renderProducts);
  safe(renderGallery);
  safe(renderFaq);
  safe(applyConfig);
  safe(initModal);
  safe(initHeader);
  safe(initReveal);
  safe(injectSchema);
  safe(injectAnalytics);
})();
