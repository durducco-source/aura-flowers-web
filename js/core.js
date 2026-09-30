/* ==========================================================================
   AURA FLOWERS · Núcleo compartido
   Carrito, stock, cabecera, animaciones, redes, seguimiento y consentimiento.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.AURA_CONFIG || {};
  var CAT = window.AURA_CATALOGO || { categorias: [], productos: [] };
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Utilidades ---------------- */
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function get(path) { return path.split(".").reduce(function (o, k) { return o && o[k]; }, CFG); }
  function store(kind) {
    var s; try { s = window[kind]; } catch (e) { s = null; }
    return {
      get: function (k, d) { try { var v = s && s.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
      set: function (k, v) { try { s && s.setItem(k, JSON.stringify(v)); } catch (e) {} },
      del: function (k) { try { s && s.removeItem(k); } catch (e) {} }
    };
  }
  var LS = store("localStorage"), SS = store("sessionStorage");

  /* ---------------- Catálogo y stock ---------------- */
  var remote = SS.get("aura_stock", null);
  if (remote && Date.now() - remote.t > 5 * 60 * 1000) remote = null;

  function product(id) {
    for (var i = 0; i < CAT.productos.length; i++) if (CAT.productos[i].id === id) return CAT.productos[i];
    return null;
  }
  // Estado real: combina catálogo + stock remoto (Google Sheets) si existe
  function status(p) {
    var estado = (p.estado || "disponible").toLowerCase();
    var stock = typeof p.stock === "number" ? p.stock : 1;
    var r = remote && remote.data && remote.data[p.id];
    if (r) {
      if (r.estado) estado = String(r.estado).toLowerCase();
      if (r.stock !== "" && r.stock != null && !isNaN(r.stock)) stock = Number(r.stock);
    }
    if (estado.indexOf("pr") === 0) estado = "proximamente";
    if (estado === "disponible" && stock <= 0) estado = "agotado";
    return { estado: estado, stock: Math.max(0, stock), unica: stock === 1, comprable: estado === "disponible" && stock > 0 };
  }
  function catName(id) { var c = CAT.categorias.filter(function (x) { return x.id === id; })[0]; return c ? c.nombre : ""; }
  function sortProducts(list) {
    var rank = { disponible: 0, proximamente: 1, agotado: 2 };
    return list.slice().sort(function (a, b) { return rank[status(a).estado] - rank[status(b).estado]; });
  }

  function syncStock() {
    var url = get("pedidos.endpoint");
    if (!url || remote) return Promise.resolve(false);
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { ctrl && ctrl.abort(); }, 6000);
    return fetch(url + (url.indexOf("?") > -1 ? "&" : "?") + "accion=stock", { signal: ctrl && ctrl.signal })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(t);
        if (j && j.ok && j.stock) { remote = { t: Date.now(), data: j.stock }; SS.set("aura_stock", remote); cart.clean(); emit("aura:stock"); return true; }
        return false;
      })
      .catch(function () { clearTimeout(t); return false; });
  }
  function forgetStock() { remote = null; SS.del("aura_stock"); }

  /* ---------------- Eventos ---------------- */
  function emit(name, detail) { doc.dispatchEvent(new CustomEvent(name, { detail: detail })); }

  /* ---------------- Carrito ---------------- */
  var cart = {
    items: function () { return LS.get("aura_cart", []); },
    save: function (items) { LS.set("aura_cart", items); emit("aura:cart"); },
    qty: function (id) { var it = this.items().filter(function (x) { return x.id === id; })[0]; return it ? it.qty : 0; },
    count: function () { return this.items().reduce(function (n, x) { return n + x.qty; }, 0); },
    add: function (id, qty) {
      var p = product(id); if (!p) return { ok: false, msg: "Esta pieza ya no está en el catálogo." };
      var s = status(p);
      if (!s.comprable) return { ok: false, msg: s.estado === "proximamente" ? "Esta pieza estará disponible muy pronto." : "Esta pieza ya se ha vendido." };
      qty = qty || 1;
      var items = this.items(), it = items.filter(function (x) { return x.id === id; })[0];
      var current = it ? it.qty : 0;
      if (current >= s.stock) return { ok: false, msg: s.stock === 1 ? "Es una pieza única: ya está en tu carrito." : "Ya tienes todas las unidades disponibles en tu carrito." };
      var n = Math.min(s.stock, current + qty);
      if (it) it.qty = n; else items.push({ id: id, qty: n });
      this.save(items);
      track("add_to_cart", { id: id, nombre: p.nombre, cantidad: n - current });
      return { ok: true, capped: n < current + qty };
    },
    set: function (id, qty) {
      var p = product(id), items = this.items();
      if (!p) { this.remove(id); return; }
      var max = status(p).stock;
      items.forEach(function (x) { if (x.id === id) x.qty = Math.max(1, Math.min(max, qty)); });
      this.save(items);
    },
    remove: function (id) { this.save(this.items().filter(function (x) { return x.id !== id; })); },
    clear: function () { this.save([]); },
    // Quita piezas que se han agotado o ya no existen y ajusta cantidades
    clean: function () {
      var removed = [], changed = false;
      var items = this.items().filter(function (x) {
        var p = product(x.id);
        if (!p || !status(p).comprable) { removed.push(p ? p.nombre : x.id); changed = true; return false; }
        var st = status(p).stock; if (x.qty > st) { x.qty = st; changed = true; }
        return true;
      });
      if (changed) this.save(items);
      return removed;
    },
    detail: function () {
      return this.items().map(function (x) { var p = product(x.id); return p ? { p: p, qty: x.qty, s: status(p) } : null; }).filter(Boolean);
    }
  };

  /* ---------------- WhatsApp / redes ---------------- */
  function wa(msg) {
    var n = get("contacto.whatsapp");
    return n ? "https://wa.me/" + n + "?text=" + encodeURIComponent(msg || "") : "";
  }
  var MSG = {
    general: "¡Hola Aura Flowers! 🌸 Me encantaría saber más sobre vuestras piezas.",
    medida: "¡Hola Aura Flowers! 🌸 Tengo unas flores especiales y me gustaría convertirlas en una joya a medida.",
    regalo: "¡Hola Aura Flowers! 🌸 Busco un regalo especial, ¿me ayudáis a elegir?"
  };

  function bindLinks(scope) {
    $$("[data-wa]", scope).forEach(function (a) {
      var m = a.getAttribute("data-wa-text") || MSG[a.getAttribute("data-wa")] || MSG.general;
      var u = wa(m); if (!u) { a.hidden = true; return; }
      a.href = u; a.target = "_blank"; a.rel = "noopener";
      a.addEventListener("click", function () { track("contact", { canal: "whatsapp" }); });
    });
    $$("[data-social]", scope).forEach(function (a) {
      var u = get("redes." + a.getAttribute("data-social"));
      var wrap = a.closest("[data-social-wrap]") || a;
      if (!u) { wrap.hidden = true; return; }
      a.href = u; a.target = "_blank"; a.rel = "noopener";
    });
    $$("[data-need]", scope).forEach(function (el) { if (!get(el.getAttribute("data-need"))) el.hidden = true; });
    $$("[data-cfg]", scope).forEach(function (el) { var v = get(el.getAttribute("data-cfg")); if (v) el.textContent = v; });
    $$("[data-tel]", scope).forEach(function (a) { var t = get("contacto.telefono"); if (t) { a.textContent = t; a.href = "tel:" + t.replace(/\s/g, ""); } });
    $$("[data-mail]", scope).forEach(function (a) { var m = get("contacto.email"); if (m) { a.textContent = m; a.href = "mailto:" + m; } });
    $$("[data-year]", scope).forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------------- Campañas: UTM y origen ---------------- */
  (function captureSource() {
    try {
      var q = new URLSearchParams(location.search), src = {};
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ttclid"].forEach(function (k) { if (q.get(k)) src[k] = q.get(k).slice(0, 120); });
      if (Object.keys(src).length || !SS.get("aura_src")) {
        src.landing = location.pathname + location.search.slice(0, 200);
        src.referrer = (doc.referrer || "").slice(0, 200);
        if (Object.keys(src).length > 2 || !SS.get("aura_src")) SS.set("aura_src", src);
      }
    } catch (e) {}
  })();

  /* ---------------- Seguimiento (solo con consentimiento) ---------------- */
  var T = CFG.seguimiento || {};
  var hasTracking = !!(T.metaPixelId || T.googleAnalyticsId || T.googleAdsId || T.tiktokPixelId);
  var consent = LS.get("aura_consent", null); // "si" | "no"
  var trackingOn = false;

  function loadScript(src) { var s = doc.createElement("script"); s.async = true; s.src = src; doc.head.appendChild(s); }
  function startTracking() {
    if (trackingOn || !hasTracking) return; trackingOn = true;
    if (T.googleAnalyticsId || T.googleAdsId) {
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(T.googleAnalyticsId || T.googleAdsId));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag("js", new Date());
      if (T.googleAnalyticsId) gtag("config", T.googleAnalyticsId);
      if (T.googleAdsId) gtag("config", T.googleAdsId);
    }
    if (T.metaPixelId) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, doc, "script", "https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", T.metaPixelId); fbq("track", "PageView");
    }
    if (T.tiktokPixelId) {
      !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"]; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; }; ttq.load = function (e, n) { var i = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = i; ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {}; var o = d.createElement("script"); o.type = "text/javascript"; o.async = !0; o.src = i + "?sdkid=" + e + "&lib=" + t; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a); }; ttq.load(T.tiktokPixelId); ttq.page(); }(window, doc, "ttq");
    }
    (window.__auraQueue || []).forEach(function (e) { track(e[0], e[1]); });
    window.__auraQueue = [];
  }

  // Eventos: view_item, add_to_cart, begin_checkout, add_payment_info, order (pedido realizado), contact
  function track(ev, d) {
    d = d || {};
    if (!hasTracking) return;
    if (!trackingOn) { (window.__auraQueue = window.__auraQueue || []).push([ev, d]); return; }
    var items = d.items || (d.id ? [{ item_id: d.id, item_name: d.nombre, quantity: d.cantidad || 1 }] : []);
    try {
      if (window.gtag) {
        var map = { view_item: "view_item", add_to_cart: "add_to_cart", begin_checkout: "begin_checkout", add_payment_info: "add_payment_info", order: "purchase", contact: "generate_lead" };
        var params = { items: items };
        if (ev === "order") { params.transaction_id = d.numero; params.currency = "EUR"; }
        if (ev === "add_payment_info") params.payment_type = d.pago;
        gtag("event", map[ev] || ev, params);
        if (ev === "order" && T.googleAdsId && T.googleAdsEtiquetaPedido) gtag("event", "conversion", { send_to: T.googleAdsId + "/" + T.googleAdsEtiquetaPedido, transaction_id: d.numero });
      }
      if (window.fbq) {
        var fmap = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", add_payment_info: "AddPaymentInfo", order: "Lead", contact: "Contact" };
        var ids = items.map(function (i) { return i.item_id; });
        if (fmap[ev]) fbq("track", fmap[ev], { content_ids: ids, content_type: "product", num_items: items.length }, d.numero ? { eventID: d.numero } : undefined);
        if (ev === "order") fbq("trackCustom", "PedidoRealizado", { order_id: d.numero, pago: d.pago });
      }
      if (window.ttq) {
        var tmap = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", add_payment_info: "AddPaymentInfo", order: "PlaceAnOrder", contact: "Contact" };
        if (tmap[ev]) ttq.track(tmap[ev], { contents: items.map(function (i) { return { content_id: i.item_id, content_name: i.item_name, quantity: i.quantity }; }) });
      }
    } catch (e) {}
  }

  function consentBanner() {
    if (!hasTracking) return;
    if (consent === "si") { startTracking(); return; }
    if (consent === "no") return;
    var b = doc.createElement("div");
    b.className = "consent"; b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Cookies");
    b.innerHTML = '<p>Usamos cookies propias y de terceros (Meta, Google, TikTok) para medir visitas y mostrarte publicidad relevante. Solo se activan si las aceptas. <a href="legal.html#cookies">Más información</a></p>' +
      '<div class="consent-btns"><button class="btn btn--sm" data-c="si">Aceptar</button><button class="btn btn--line btn--sm" data-c="no">Rechazar</button></div>';
    doc.body.appendChild(b);
    b.addEventListener("click", function (e) {
      var v = e.target.getAttribute && e.target.getAttribute("data-c"); if (!v) return;
      LS.set("aura_consent", v); consent = v; b.remove(); if (v === "si") startTracking();
    });
  }

  /* ---------------- Cabecera y menú ---------------- */
  function header() {
    var h = $(".header"), bar = $(".progress span"), last = 0, ticking = false;
    var mbar = $("[data-mbar]");
    function onScroll() {
      var y = window.scrollY || 0, max = doc.documentElement.scrollHeight - innerHeight;
      if (h) {
        h.classList.toggle("is-solid", y > 30 || h.hasAttribute("data-solid"));
        h.classList.toggle("is-hidden", y > 500 && y > last && !root.classList.contains("menu-open") && !root.classList.contains("cart-open"));
      }
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      if (mbar) mbar.classList.toggle("show", y > innerHeight * .6);
      last = y; ticking = false;
    }
    addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    var burger = $(".burger");
    if (burger) burger.addEventListener("click", function () {
      var open = root.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    $$(".mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { root.classList.remove("menu-open"); burger && burger.setAttribute("aria-expanded", "false"); }); });
  }

  /* ---------------- Cajón del carrito ---------------- */
  var drawer, toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = doc.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); doc.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  function buildDrawer() {
    if ($(".drawer") || !$("[data-cart-open]")) return;
    var bg = doc.createElement("div"); bg.className = "drawer-bg"; bg.setAttribute("data-cart-close", "");
    drawer = doc.createElement("aside"); drawer.className = "drawer"; drawer.setAttribute("aria-label", "Tu carrito"); drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = '<div class="drawer-head"><h2>Tu selección <small data-cart-n></small></h2><button class="icon-btn" data-cart-close aria-label="Cerrar carrito"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>' +
      '<div class="drawer-body" data-cart-body></div><div class="drawer-foot" data-cart-foot></div>';
    doc.body.appendChild(bg); doc.body.appendChild(drawer);
    doc.addEventListener("click", function (e) {
      if (e.target.closest("[data-cart-open]")) { e.preventDefault(); openCart(); }
      else if (e.target.closest("[data-cart-close]")) closeCart();
    });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); root.classList.remove("menu-open"); } });
    drawer.addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]"); if (b) { var id = b.getAttribute("data-id"); cart.set(id, cart.qty(id) + Number(b.getAttribute("data-q"))); return; }
      var r = e.target.closest("[data-rm]"); if (r) cart.remove(r.getAttribute("data-rm"));
    });
    renderDrawer();
  }
  function openCart() { if (!drawer) return; cart.clean(); renderDrawer(); root.classList.add("cart-open"); drawer.setAttribute("aria-hidden", "false"); setTimeout(function () { var c = $("[data-cart-close]", drawer); c && c.focus(); }, 300); }
  function closeCart() { if (!drawer) return; root.classList.remove("cart-open"); drawer.setAttribute("aria-hidden", "true"); }
  function renderDrawer() {
    if (!drawer) return;
    var list = cart.detail(), body = $("[data-cart-body]", drawer), foot = $("[data-cart-foot]", drawer), n = cart.count();
    $("[data-cart-n]", drawer).textContent = n ? "(" + n + ")" : "";
    if (!list.length) {
      body.innerHTML = '<div class="empty"><img src="assets/brand/aura-orquidea-dorado.png" alt="" width="70" height="65"><h3>Tu carrito está vacío</h3><p>Cada pieza es única. Descubre las que están disponibles ahora.</p><a class="btn btn--line" href="index.html#coleccion" data-cart-close>Ver la colección</a></div>';
      foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = list.map(function (x) {
      return '<div class="line"><a href="producto.html?id=' + esc(x.p.id) + '"><img src="' + esc(x.p.imagenes[0]) + '" alt="' + esc(x.p.nombre) + '" loading="lazy"></a><div>' +
        '<h3>' + esc(x.p.nombre) + '</h3><p class="meta">' + esc(catName(x.p.categoria)) + (x.s.unica ? " · Pieza única" : "") + '</p>' +
        '<div class="line-row"><div class="qty" aria-label="Cantidad"><button data-q="-1" data-id="' + esc(x.p.id) + '" aria-label="Quitar una"' + (x.qty <= 1 ? " disabled" : "") + '>−</button><span>' + x.qty + '</span><button data-q="1" data-id="' + esc(x.p.id) + '" aria-label="Añadir una"' + (x.qty >= x.s.stock ? " disabled" : "") + '>+</button></div>' +
        '<button class="remove" data-rm="' + esc(x.p.id) + '">Eliminar</button></div></div></div>';
    }).join("");
    foot.innerHTML = '<p>Al recibir tu pedido te confirmamos disponibilidad, importe total y envío. Después pagas cómodamente por Bizum o transferencia.</p>' +
      '<a class="btn btn--full" href="checkout.html">Finalizar pedido <i class="arr"></i></a><button class="btn btn--line btn--full" data-cart-close>Seguir mirando</button>';
  }
  function updateCount(bump) {
    var n = cart.count();
    $$("[data-cart-count]").forEach(function (el) { el.textContent = n; el.classList.toggle("has", n > 0); if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); } });
  }

  // Botones de compra en cualquier parte de la web
  doc.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]"), buy = e.target.closest("[data-buy]");
    var el = add || buy; if (!el || el.disabled) return;
    e.preventDefault();
    var id = el.getAttribute("data-add") || el.getAttribute("data-buy");
    var q = Number(el.getAttribute("data-qty") || 1);
    var inCart = cart.qty(id);
    var res = cart.add(id, q);
    if (buy) {
      if (res.ok || inCart > 0) { location.href = "checkout.html"; return; }
      toast(res.msg); return;
    }
    if (!res.ok) { toast(res.msg); return; }
    updateCount(true);
    var p = product(id);
    toast((p ? p.nombre : "Pieza") + " se ha añadido a tu carrito");
    if (drawer) setTimeout(openCart, 250);
  });
  doc.addEventListener("aura:cart", function () { updateCount(); renderDrawer(); });

  /* ---------------- Tarjeta de producto (compartida) ---------------- */
  function card(p, i) {
    var s = status(p), img = p.imagenes || [], url = "producto.html?id=" + encodeURIComponent(p.id);
    var badge = s.estado === "disponible" ? (p.etiqueta || (s.unica ? "Pieza única" : "")) : "";
    var over = s.estado === "agotado" ? "Vendida" : s.estado === "proximamente" ? "Próximamente" : "";
    var mats = p.materiales ? Object.keys(p.materiales).slice(0, 2).map(function (k) { return p.materiales[k]; }).join(" · ") : "";
    var actions;
    if (s.comprable) {
      actions = '<div class="card-actions"><button class="btn btn--sm" data-buy="' + esc(p.id) + '">Comprar</button><button class="btn btn--line btn--sm" data-add="' + esc(p.id) + '">Añadir al carrito</button></div>';
    } else if (s.estado === "proximamente") {
      actions = '<div class="card-actions"><button class="btn btn--sm" disabled>Próximamente</button><a class="btn btn--line btn--sm" data-wa data-wa-text="' + esc("¡Hola Aura Flowers! 🌸 Avisadme cuando esté disponible: " + p.nombre) + '" href="#">Avísame</a></div>';
    } else {
      actions = '<div class="card-actions card-actions--one"><a class="btn btn--line btn--sm" data-wa data-wa-text="' + esc("¡Hola Aura Flowers! 🌸 Me encanta la pieza «" + p.nombre + "». ¿Podríais crear una similar para mí?") + '" href="#">Encargar una similar</a></div>';
    }
    return '<article class="card reveal ' + (s.estado !== "disponible" ? "is-" + s.estado : "") + '" style="--d:' + ((i || 0) % 3) * .08 + 's" data-cat="' + esc(p.categoria) + '" data-estado="' + s.estado + '">' +
      '<a class="card-media" href="' + url + '" aria-label="' + esc(p.nombre) + '">' +
      '<img src="' + esc(img[0]) + '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async" width="900" height="1200"' + (p.foco ? ' style="object-position:' + esc(p.foco) + '"' : "") + '>' +
      (img[1] ? '<img class="alt" src="' + esc(img[1]) + '" alt="" loading="lazy" decoding="async">' : "") +
      (badge ? '<span class="badge' + (p.etiqueta ? "" : " badge--gold") + '">' + esc(badge) + "</span>" : "") +
      (over ? '<span class="state"><span>' + over + "</span></span>" : "") +
      "</a>" +
      '<div class="card-body"><p class="card-cat">' + esc(catName(p.categoria)) + '</p><h3 class="card-title"><a href="' + url + '">' + esc(p.nombre) + "</a></h3>" +
      '<p class="card-desc">' + esc(p.resumen) + "</p>" + (mats ? '<p class="card-mat">' + esc(mats) + "</p>" : "") + actions + "</div></article>";
  }

  /* ---------------- Animaciones ---------------- */
  function splitText(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(" ")); return; }
            var w = doc.createElement("span"); w.className = "w";
            var inner = doc.createElement("span"); inner.textContent = part; inner.style.setProperty("--wi", i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    })(el);
    el.classList.add("split");
  }

  var io;
  function observe(scope) {
    var els = $$(".reveal:not(.is-in), .reveal-img:not(.is-in), .fade:not(.is-in), .split:not(.is-in)", scope);
    if (!("IntersectionObserver" in window) || reduce) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    els.forEach(function (el) { io.observe(el); });
  }

  function parallax() {
    var els = $$("[data-parallax]");
    if (!els.length || reduce) return;
    var active = new Set(), ticking = false, small = matchMedia("(max-width: 900px)").matches;
    var vio = new IntersectionObserver(function (en) { en.forEach(function (e) { e.isIntersecting ? active.add(e.target) : active.delete(e.target); }); tick(); }, { rootMargin: "20% 0px" });
    els.forEach(function (el) { vio.observe(el); });
    function update() {
      var vh = innerHeight;
      active.forEach(function (el) {
        var sp = parseFloat(el.getAttribute("data-parallax")) * (small ? .5 : 1);
        var r = el.parentElement.getBoundingClientRect();
        var d = (r.top + r.height / 2 - vh / 2);
        el.style.translate = "0 " + (-d * sp).toFixed(1) + "px";
      });
      ticking = false;
    }
    function tick() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
  }

  function animations() {
    $$("[data-split]").forEach(splitText);
    observe(doc);
    parallax();
  }

  /* ---------------- Arranque ---------------- */
  function init() {
    bindLinks(doc);
    header();
    buildDrawer();
    updateCount();
    animations();
    consentBanner();
    cart.clean();
    syncStock();
    var loaded = function () { root.classList.add("is-loaded"); };
    requestAnimationFrame(loaded); setTimeout(loaded, 120);
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();

  window.Aura = {
    cfg: CFG, cat: CAT, get: get, $: $, $$: $$, esc: esc, LS: LS, SS: SS,
    product: product, status: status, catName: catName, sortProducts: sortProducts,
    cart: cart, card: card, wa: wa, bindLinks: bindLinks, observe: observe, splitText: splitText,
    toast: toast, openCart: openCart, track: track, syncStock: syncStock, forgetStock: forgetStock, reduce: reduce
  };
})();
