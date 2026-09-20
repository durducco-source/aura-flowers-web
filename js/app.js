/* ==========================================================
   AURA FLOWERS · Aplicación (rutas, tienda, carrito, checkout)
   ========================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const A = window.SV_ART, FL = A.FL;
  const P = SV.products;
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const fmt = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const igUrl = 'https://www.instagram.com/' + SV.instagram + '/';
  const fmtPhone = (n) => { n = String(n || '').replace(/\D/g, ''); return n.length === 11 ? '+' + n.slice(0, 2) + ' ' + n.slice(2, 5) + ' ' + n.slice(5, 7) + ' ' + n.slice(7, 9) + ' ' + n.slice(9) : '+' + n; };
  const waUrl = (t) => 'https://wa.me/' + SV.whatsapp + (t ? '?text=' + encodeURIComponent(t) : '');

  /* ── almacenamiento seguro ── */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* noop */ } },
    sget(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    sset(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* noop */ } }
  };

  /* ── iconos ── */
  const I = {
    arrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 12h17M14 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".8" fill="currentColor"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.3l-4.5 1.2z"/><path d="M9 8.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-.8.7c-.8-.3-1.6-1.1-1.9-1.9l.7-.8-1-2L9 8.5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="3.5" y="9" width="17" height="11" rx="1"/><path d="M2.5 9h19v-3h-19zM12 6v14M12 6C9 6 8 3 10 3s2 3 2 3zm0 0c3 0 4-3 2-3s-2 3-2 3z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    flower: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="16" cy="16" r="3"/><path d="M16 13c-3-3-3-8 0-10 3 2 3 7 0 10zM16 19c3 3 3 8 0 10-3-2-3-7 0-10zM13 16c-3 3-8 3-10 0 2-3 7-3 10 0zM19 16c3-3 8-3 10 0-2 3-7 3-10 0z"/></svg>',
    bouquet: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><circle cx="10" cy="9" r="3.5"/><circle cx="22" cy="9" r="3.5"/><circle cx="16" cy="6" r="3"/><path d="M10 12.5l6 15 6-15M16 9l0 18.5M8 28h16"/></svg>',
    cal: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><rect x="5" y="7" width="22" height="20" rx="2"/><path d="M5 13h22M11 4v5M21 4v5"/><path d="M16 22c-3-2-4-3.5-4-5a2.3 2.3 0 0 1 4-1.3 2.3 2.3 0 0 1 4 1.3c0 1.5-1 3-4 5z"/></svg>',
    rings: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="19" r="7"/><circle cx="21" cy="19" r="7"/><path d="M9 8l3-4 3 4-3 3zM18 8l3-4 3 4-3 3z" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M16 27C6 20 4 13 8 9.5c3-2.5 6.500-1 8 2 1.500-3 5-4.500 8-2C28 13 26 20 16 27z"/></svg>',
    flourish: '<svg viewBox="0 0 90 20" fill="none" stroke="currentColor" stroke-width="1"><path d="M2 10h30M58 10h30"/><path d="M45 3c-3 4-3 10 0 14 3-4 3-10 0-14zM38 10c2-3 5-4 7 0-2 4-5 3-7 0zM52 10c-2-3-5-4-7 0 2 4 5 3 7 0z"/></svg>'
  };
  const stars = (n) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);

  /* ── fotografías (propias o de ejemplo) ── */
  const hasReal = (p) => p.images && p.images.length;
  const productImg = (p, v) => (hasReal(p) ? (v >= 3 ? A.product(p, 3) : p.images[Math.min(v, p.images.length - 1)]) : A.product(p, v));
  const hoverImg = (p) => (hasReal(p) ? p.images[1] || (p.flowers.length ? A.product(p, 3) : p.images[0]) : A.product(p, 2));
  const heroImg = (m) => (m ? SV.photos.heroMobile : SV.photos.hero) || A.hero(m ? 'mobile' : 'desktop');
  const sceneImg = (i) => SV.photos.process[i] || A.scene(SV.process[i].scene);
  const flowerNames = (p) => p.flowers.map((f) => FL[f].label.toLowerCase()).join(', ');

  /* ── disponibilidad ── */
  function availInfo(p) {
    if (p.stock <= 0) return { cls: 'out', txt: 'Agotado' };
    if (p.avail === 'custom') return { cls: 'made', txt: 'A medida · 3–4 semanas' };
    if (p.avail === 'made') return { cls: 'made', txt: 'Bajo pedido · 5–10 días' };
    if (p.stock === 1) return { cls: 'low', txt: 'Pieza única · 1 disponible' };
    if (p.stock <= 3) return { cls: 'low', txt: 'Quedan ' + p.stock + ' disponibles' };
    return { cls: '', txt: 'Disponible · sale en 24–48 h' };
  }
  const maxQty = (p) => (p.avail === 'made' ? Math.min(p.stock, 5) : p.stock);
  const priceHTML = (p) => (p.was ? `<s>${fmt(p.was)}</s>` : '') + (p.priceFrom ? '<small style="font-size:.7em;font-family:var(--sans);letter-spacing:.06em">desde </small>' : '') + fmt(p.price);

  /* ── rasterizado de las ilustraciones (rendimiento) ──
     Las ilustraciones SVG con filtros son pesadas de pintar; se convierten una vez
     a JPEG y se reutilizan. Las fotos reales no pasan por aquí. */
  const rcache = new Map();
  function rasterize(uri) {
    if (rcache.has(uri)) return rcache.get(uri);
    const p = new Promise((res) => {
      const im = new Image();
      im.onload = () => {
        try {
          const s = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight));
          const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          c.toBlob((b) => res(b ? URL.createObjectURL(b) : uri), 'image/jpeg', 0.9);
        } catch (e) { res(uri); }
      };
      im.onerror = () => res(uri);
      im.src = uri;
    });
    rcache.set(uri, p); return p;
  }
  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAAACwAAAAAAQABAAACAUwAOw==';
  let rio;
  function hydrate(root) {
    const imgs = $$('img[src^="data:image/svg"]', root);
    if (!imgs.length) return;
    if (!rio) rio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; const im = e.target; rio.unobserve(im);
      rasterize(im.dataset.svg).then((u) => { im.src = u; im.classList.add('ld'); });
    }), { rootMargin: '900px 0px' });
    imgs.forEach((im) => { im.dataset.svg = im.src; im.removeAttribute('loading'); im.src = BLANK; rio.observe(im); });
  }

  /* ══════════ CARRITO ══════════ */
  let cart = store.get('af_cart', []).filter((l) => byId[l.id]);
  const saveCart = () => store.set('af_cart', cart);
  const cartCount = () => cart.reduce((s, l) => s + l.qty, 0);
  const subtotal = () => cart.reduce((s, l) => s + byId[l.id].price * l.qty, 0);

  function addToCart(id, qty) {
    const p = byId[id]; if (!p || p.stock <= 0) return false;
    const line = cart.find((l) => l.id === id);
    const cur = line ? line.qty : 0;
    if (cur + (qty || 1) > maxQty(p)) { toast(maxQty(p) === 1 ? 'Es una pieza única: ya está en tu carrito ✿' : 'Solo quedan ' + maxQty(p) + ' unidades de esta pieza'); return false; }
    if (line) line.qty += qty || 1; else cart.push({ id, qty: qty || 1 });
    saveCart(); updateCartUI(); return true;
  }
  function setQty(id, q) {
    const p = byId[id]; const line = cart.find((l) => l.id === id); if (!line) return;
    if (q <= 0) cart = cart.filter((l) => l.id !== id);
    else line.qty = Math.min(q, maxQty(p));
    saveCart(); updateCartUI();
  }
  function updateCartUI() {
    const n = cartCount(); const c = $('#cartCount');
    c.textContent = n; c.hidden = n === 0;
    c.classList.remove('bump'); void c.offsetWidth; if (n) c.classList.add('bump');
    renderDrawer();
    if (current === 'checkout') renderSummary();
  }
  function renderDrawer() {
    const d = $('#drawer'); const sub = subtotal(); const n = cartCount();
    const left = Math.max(0, SV.freeShippingFrom - sub);
    let body;
    if (!n) {
      body = `<div class="dr-body"><div class="empty">${I.bag}<h4>Tu carrito está vacío</h4><p>Todavía no has elegido ninguna flor. Descubre las piezas del taller.</p><a class="btn btn-primary" href="#/tienda" data-close-drawer>Ver la colección</a></div></div>`;
    } else {
      body = `<div class="free-ship">${left > 0 ? `Te faltan <b>${fmt(left)}</b> para el envío gratuito en España` : '<b>¡Tienes el envío gratuito en España!</b>'}<div class="bar"><i style="width:${Math.min(100, sub / SV.freeShippingFrom * 100)}%"></i></div></div>
<div class="dr-body">${cart.map((l) => { const p = byId[l.id]; return `<div class="ci"><a class="ci-img" href="#/producto/${p.id}"><img src="${productImg(p, 0)}" alt="${esc(p.name)}"></a><div><h4>${esc(p.name)}</h4><small>${p.flowers.map((f) => FL[f].label).join(' · ')}</small><div class="qty" role="group" aria-label="Cantidad"><button data-dec="${p.id}" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-inc="${p.id}" aria-label="Añadir uno" ${l.qty >= maxQty(p) ? 'disabled' : ''}>+</button></div><br><button class="rm" data-rm="${p.id}">Quitar</button></div><div class="ci-price">${fmt(p.price * l.qty)}</div></div>`; }).join('')}</div>`;
    }
    d.innerHTML = `<div class="dr-head"><h3>Tu selección<small>(${n})</small></h3><button class="dr-close" data-close-drawer aria-label="Cerrar carrito">×</button></div>${body}${n ? `<div class="dr-foot"><div class="line"><span>Subtotal</span><b>${fmt(sub)}</b></div><small>Envío e impuestos incluidos en el siguiente paso. Cada pieza es única y se reserva al pagar.</small><a class="btn btn-primary btn-block" href="#/checkout" data-close-drawer>Finalizar compra ${I.arrow}</a><a class="btn btn-ghost btn-block" href="#/tienda" data-close-drawer>Seguir viendo piezas</a></div>` : ''}`; hydrate(d);
  }
  function openDrawer() { $('#drawer').classList.add('on'); $('#scrim').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); setTimeout(() => { const c = $('#drawer .dr-close'); c && c.focus({ preventScroll: true }); }, 400); }
  function closeDrawer() { $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); $('#drawer').setAttribute('aria-hidden', 'true'); if (!$('#mobileMenu').classList.contains('open')) document.body.classList.remove('lock'); }

  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3200); }

  /* ══════════ PLANTILLAS ══════════ */
  function card(p, i) {
    const a = availInfo(p), out = p.stock <= 0;
    const action = out ? `<a class="btn-add" href="#/personalizar">Encargar una parecida</a>`
      : p.avail === 'custom' ? `<a class="btn-add" href="#/personalizar">Solicitar mi pieza</a>`
      : `<button class="btn-add" data-add="${p.id}">Añadir al carrito</button>`;
    return `<article class="card reveal" style="--d:${(i % 4) * 0.08}s">
<a class="card-media" href="#/producto/${p.id}" aria-label="Ver ${esc(p.name)}">${p.badge ? `<span class="badge ${out ? 'sold' : ''}">${esc(p.badge)}</span>` : ''}
<img class="a" loading="lazy" decoding="async" src="${productImg(p, 0)}" alt="${esc(p.name)}: joya de resina con ${flowerNames(p)}"><img class="b" loading="lazy" decoding="async" src="${hoverImg(p)}" alt="" aria-hidden="true"></a>
<div class="card-body"><div class="card-top"><h3 class="card-name"><a href="#/producto/${p.id}">${esc(p.name)}</a></h3><div class="card-price">${priceHTML(p)}</div></div>
<div class="card-flowers">${p.flowers.map((f) => `<span>${A.flowerIcon(f)}${FL[f].label}</span>`).join('')}</div>
<p class="card-desc">${esc(p.short)}</p><span class="avail ${a.cls}">${a.txt}</span>${action}</div></article>`;
  }

  function footer() {
    $('#footer').innerHTML = `<div class="container"><div class="foot-grid">
<div class="foot-brand"><a class="logo" href="#/"><svg class="logo-mark" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="1.1"><path d="M20 20C20 12 20 8 20 3M20 20C26 14 29 11 34 7M20 20C14 14 11 11 6 7"/><circle cx="20" cy="22" r="10"/><path d="M20 32v6"/></g></svg><span class="logo-word"><b>Aura</b><em>Flowers</em></span></a><p>Joyas hechas a mano con flores naturales reales encapsuladas en resina. Cada pieza es única, como cada flor.</p></div>
<div><h4>Tienda</h4><ul>${SV.categories.map((c) => `<li><a href="#/tienda/${c.id}">${c.name}</a></li>`).join('')}</ul></div>
<div><h4>Aura Flowers</h4><ul><li><a href="#/creador">El creador</a></li><li><a href="#/proceso">El proceso</a></li><li><a href="#/historias">Historias</a></li><li><a href="#/personalizar">Crea tu pieza</a></li><li><a href="#/faq">Envíos y cuidados</a></li><li><a href="#/contacto">Contacto</a></li></ul></div>
<div><h4>Flores en tu bandeja de entrada</h4><p style="font-weight:300;font-size:14.5px;margin:0">Novedades y piezas nuevas del taller, directamente en tu correo.</p><form class="news" data-form="news" novalidate><input type="email" name="email" placeholder="Tu correo" aria-label="Correo electrónico" required><button type="submit">Unirme</button></form><ul style="margin-top:22px"><li><a href="${igUrl}" target="_blank" rel="noopener">Instagram · @${SV.instagram}</a></li>${SV.whatsapp ? `<li><a href="${waUrl()}" target="_blank" rel="noopener">WhatsApp</a></li>` : ''}${SV.email ? `<li><a href="mailto:${SV.email}">${SV.email}</a></li>` : ''}</ul></div></div>
<div class="foot-bot"><span>© ${new Date().getFullYear()} ${SV.brand}. Hecho a mano, con flores de verdad.</span><div class="pays"><span>Visa</span><span>Mastercard</span><span>PayPal</span><span>Bizum</span><span>Apple Pay</span></div></div></div>`;
    $('#mmIg').href = igUrl;
    $('#freeFrom').textContent = fmt(SV.freeShippingFrom).replace(',00', '');
  }

  /* ══════════ INICIO ══════════ */
  function tile(i) {
    const custom = SV.photos.instagram[i];
    if (custom && typeof custom === 'object' && custom.video)
      return `<a href="${custom.href || igUrl}" target="_blank" rel="noopener" aria-label="Ver en Instagram"><video muted loop playsinline preload="metadata" ${custom.poster ? `poster="${custom.poster}"` : ''} src="${custom.video}" data-hover-play></video>${I.ig}</a>`;
    if (custom && typeof custom === 'object' && custom.img)
      return `<a href="${custom.href || igUrl}" target="_blank" rel="noopener" aria-label="Ver en Instagram: ${esc(custom.alt || '')}"><img loading="lazy" decoding="async" src="${custom.img}" alt="${esc(custom.alt || 'Publicación de Instagram')}">${I.ig}</a>`;
    const src = typeof custom === 'string' ? custom : productImg(P[i % P.length], 0);
    return `<a href="${igUrl}" target="_blank" rel="noopener" aria-label="Ver en Instagram"><img loading="lazy" decoding="async" src="${src}" alt="Creación reciente de ${SV.brand}">${I.ig}</a>`;
  }
  const occ = [
    ['flower', 'Una flor especial', 'Esa flor que tiene un significado solo para ti.'],
    ['bouquet', 'Flores de un ramo', 'El ramo de una boda, un cumpleaños o un regalo inolvidable.'],
    ['cal', 'Una fecha importante', 'Un aniversario, un nacimiento, un primer encuentro.'],
    ['rings', 'Una flor de boda', 'El ramo de novia o la flor del ojal, para siempre.'],
    ['heart', 'Un recuerdo especial', 'Una flor de un lugar, de una persona, de un momento.']
  ];

  function homeHTML() {
    const featIds = ['collar-rosa-eterna', 'pendientes-margaritas', 'pendientes-flores-rosas', 'anillo-ovalado-azul'];
    const feat = featIds.map((id) => byId[id]).filter(Boolean);
    P.forEach((p) => { if (feat.length < 4 && !feat.includes(p)) feat.push(p); });
    const marquee = ['Flores naturales reales', 'Hecho a mano, pieza a pieza', 'Ninguna joya es igual', 'Resina cristalina', 'Acero bañado en oro', 'Envíos a todo el mundo', 'Empaquetado para regalo'];
    return `
<section class="hero2" id="inicio">
  <div class="h2-bg" style="background-image:url('${SV.photos.hero || 'assets/aura/ella-espaldas.jpg'}')"></div>
  <div class="container h2-grid">
    <div class="h2-copy">
      <p class="eyebrow">Joyería botánica · Hecha a mano</p>
      <h1>Flores que nunca <em>dejan de florecer.</em></h1>
      <p class="lead">Joyas artesanales creadas a mano con flores naturales reales encapsuladas en resina.</p>
      <div class="hero-btns"><a class="btn btn-primary" href="#/tienda">Ver colección</a><a class="btn btn-ghost" href="#/proceso">Conoce el proceso</a></div>
    </div>
    <figure class="h2-arch">
      <div class="h2-frame"><img src="${SV.photos.hero || 'assets/aura/ella-espaldas.jpg'}" alt="${esc(SV.creator)} de espaldas ante una buganvilla en flor"></div>
      <div class="h2-orb"><img src="assets/aura/cattleya.jpg" alt="Orquídea Cattleya lila" loading="lazy"></div>
      <figcaption>Las flores de mi vida son las orquídeas.</figcaption>
    </figure>
  </div>
</section>
<div class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map(() => marquee.map((m) => `<span>${m}</span>`).join('')).join('')}</div></div>

<section class="manifesto container reveal">
  <div class="flourish">${I.flourish}</div>
  <p>Cada flor tiene su momento. Yo la <em>guardo</em> en resina para que ese momento no se acabe nunca.</p>
  <small>${esc(SV.creator)}</small>
</section>

<section class="tiles4 container reveal" aria-label="El mundo de Aura">
  <figure><img loading="lazy" src="assets/aura/cattleya.jpg" alt="Orquídea Cattleya lila"><figcaption>Cattleya</figcaption></figure>
  <figure><img loading="lazy" src="assets/aura/phalaenopsis.jpg" alt="Orquídeas Phalaenopsis lilas"><figcaption>Phalaenopsis</figcaption></figure>
  <figure><img loading="lazy" src="assets/aura/colgante-fucsia.jpg" alt="Colgante de orquídea fucsia en resina"><figcaption>En resina</figcaption></figure>
  <figure><img loading="lazy" src="assets/aura/orquidea-fucsia.jpg" alt="Orquídea fucsia en maceta"><figcaption>Fucsia</figcaption></figure>
</section>

<section class="section-sm" id="coleccion">
  <div class="container">
    <div class="sec-head split reveal"><div><span class="eyebrow">Piezas destacadas</span><h2 class="title">Las más <em>queridas</em> del taller</h2></div><a class="link-arrow" href="#/tienda">Ver toda la tienda ${I.arrow}</a></div>
    <div class="grid-products">${feat.map(card).join('')}</div>
  </div>
</section>

<section class="section" id="creador">
  <div class="container creator">
    <div class="creator-media reveal">
      <div class="frame reveal-img"><img loading="lazy" src="${SV.photos.creator || A.scene('bench')}" alt="El taller: moldes, flores secas y piezas terminadas"></div>
      <div class="frame-2 reveal-img" style="--d:.3s"><img loading="lazy" src="${productImg(byId['pendientes-margaritas'] || P[0], 0)}" alt="Pendientes de margaritas naturales en resina"></div>
      <div class="seal">Hecho a mano<br>con cariño</div>
    </div>
    <div class="creator-copy">
      <span class="eyebrow reveal">Sobre el creador</span>
      <h2 class="title reveal">Hola, soy ${esc(SV.creator)}. Las flores capturan <em>la energía de nuestros recuerdos.</em></h2>
      <p class="reveal">Soy la creadora y artesana de ${SV.brand}. Llamé así a mi marca porque el <b>aura</b> es la esencia, la energía que transmite algo. Para mí, las flores capturan la energía de nuestros recuerdos más bonitos.</p>
      <p class="reveal">Las flores de mi vida son las <b>orquídeas Cattleya lilas</b>. Crecí viéndolas en el jardín de mi casa, en Cuba, y fueron las protagonistas del ramo de boda de mi mamá. Por eso quise inmortalizar la belleza de la naturaleza y de nuestros recuerdos en piezas únicas.</p>
      <p class="reveal">Cada joya pasa por mis manos <b>de principio a fin</b>, desde la elección de la flor hasta el pulido final, en mi taller de ${esc(SV.city)}. Nada se fabrica en serie: no compras un producto, te llevas una creación hecha con tiempo y con cariño.</p>
      <div class="stats reveal"><div><b>100%</b><span>flores naturales reales</span></div><div><b>1</b><span>par de manos en todo el proceso</span></div><div><b>0</b><span>piezas fabricadas en serie</span></div></div>
      <div class="signature reveal">${esc(SV.creator)}</div>
    </div>
  </div>
</section>

<section class="section process" id="proceso">
  <div class="container">
    <div class="sec-head center reveal"><span class="eyebrow center">El proceso</span><h2 class="title">Lo que hay detrás <em>de cada pieza.</em></h2><p class="lead" style="margin-top:22px">Seis pasos, semanas de trabajo y ninguna prisa. Así nace cada joya de ${SV.brand}.</p></div>
    <div class="steps" id="steps"><div class="process-line"><i></i></div>
    ${SV.process.map((s, i) => `<article class="step ${i % 2 ? 'rev' : ''}">
      <div class="step-media reveal-img"><img loading="lazy" decoding="async" data-par src="${sceneImg(i)}" alt="${esc(s.title)}"></div>
      <div class="step-copy reveal"><span class="step-num">${s.n}</span><h3>${s.title}</h3><p>${s.text}</p><span class="step-time">${s.time}</span></div>
    </article>`).join('')}</div>
    <div class="process-cta reveal"><a class="btn btn-primary" href="#/tienda">Descubre las piezas ${I.arrow}</a></div>
  </div>
</section>

<section class="section-sm">
  <div class="container">
    <div class="sec-head center reveal"><span class="eyebrow center">La tienda</span><h2 class="title">Explora por <em>categoría</em></h2></div>
    <div class="cats">${SV.categories.filter((c) => byId[c.cover] || P.some((p) => p.cat === c.id)).map((c, i) => `<a class="cat reveal" style="--d:${(i % 3) * 0.1}s" href="#/tienda/${c.id}"><img loading="lazy" decoding="async" src="${productImg(byId[c.cover] || P.find((p) => p.cat === c.id), 0)}" alt="${c.name}"><div class="cat-label"><div><h3>${c.name}</h3><small>${c.blurb}</small></div><i>→</i></div></a>`).join('')}</div>
  </div>
</section>

<section class="section" id="historias">
  <div class="container">
    <div class="sec-head center reveal"><span class="eyebrow center">Historias</span><h2 class="title">Cada flor guarda <em>una historia.</em></h2><p class="lead" style="margin-top:22px">Una joya se lleva. Una flor con historia se siente. Estas son algunas de las que me han confiado.</p></div>
    <div class="stories">${SV.stories.map((s, i) => { const p = byId[s.product] || P[0]; return `<article class="story">
      <div class="story-media reveal-img"><img loading="lazy" decoding="async" src="${s.img || productImg(p, 0)}" alt="${esc(s.title)}"></div>
      <div class="story-copy reveal"><div class="story-tag">${A.flowerIcon(s.flower)}Historia 0${i + 1} · ${FL[s.flower].label}</div><h3>${esc(s.title)}</h3><span class="story-who">${esc(s.who)} · <i>${FL[s.flower].meaning}</i></span><p>${esc(s.text)}</p><br><a class="link-arrow" href="#/producto/${p.id}">Ver una pieza así ${I.arrow}</a></div></article>`; }).join('')}</div>
  </div>
</section>

<section class="section custom" id="personalizar">
  <div class="container custom-grid">
    <div>
      <span class="eyebrow reveal">A medida</span>
      <h2 class="title reveal">Crea tu <em>pieza</em></h2>
      <p class="lead reveal" style="margin-top:22px">Una flor que significa algo para ti merece convertirse en algo que puedas llevar contigo. Cuéntame su historia y la convertiré en una joya única.</p>
      <div class="occasions">${occ.map((o, i) => `<button class="occ reveal" style="--d:${i * 0.06}s" data-occ="${o[1]}" type="button">${I[o[0]]}<b>${o[1]}</b><span>${o[2]}</span></button>`).join('')}</div>
      <ol class="custom-steps reveal"><li>Me cuentas tu historia y qué flores tienes.</li><li>Te explico cómo conservarlas y enviármelas (o las elijo yo).</li><li>Te enseño el diseño antes de empezar.</li><li>Creo tu joya en 3–4 semanas y te la envío lista para regalar.</li></ol>
      <button class="btn btn-light reveal" data-open-custom type="button">Quiero crear una pieza personalizada</button>
    </div>
    <div class="reveal">
      <div class="custom-form-panel" id="customPanel"><div>
        <div class="form-wrap" id="customForm">${customFormHTML()}</div>
      </div></div>
      <div id="customTeaser" class="custom-teaser"><img loading="lazy" src="${productImg(byId['tu-flor-en-resina'] || P[0], 0)}" alt="Orquídea lila encapsulada en resina" style="width:100%;aspect-ratio:4/5;object-fit:cover;box-shadow:0 40px 80px -40px rgba(0,0,0,.6)"></div>
    </div>
  </div>
</section>

${SV.reviews.length ? `<section class="section" id="resenas">
  <div class="container">
    <div class="sec-head center reveal"><span class="eyebrow center">Opiniones</span><h2 class="title">Palabras de quienes ya llevan <em>una flor consigo.</em></h2></div>
    <div class="reviews">${SV.reviews.filter((r) => byId[r.product]).map((r, i) => { const p = byId[r.product]; return `<article class="review reveal" style="--d:${(i % 3) * 0.1}s"><div class="rv-media"><img loading="lazy" decoding="async" src="${productImg(p, r.view || 0)}" alt="${esc(p.name)}"></div><div class="rv-body"><div class="stars" aria-label="${r.stars} de 5 estrellas">${stars(r.stars)}</div><blockquote>“${esc(r.text)}”</blockquote><div class="rv-who"><div><b>${esc(r.name)}</b>${esc(r.city)}</div><div style="text-align:right"><span class="rv-ok">${I.check} Compra verificada</span><br><a class="rv-prod" href="#/producto/${p.id}">${esc(p.name)}</a></div></div></div></article>`; }).join('')}</div>
  </div>
</section>` : ''}

<section class="section-sm insta" id="instagram">
  <div class="container">
    <div class="reveal"><span class="eyebrow center">Instagram</span><h2 class="title">El taller, <em>día a día</em></h2><a class="handle" href="${igUrl}" target="_blank" rel="noopener">@${SV.instagram}</a></div>
    <div class="insta-grid reveal">${[0, 1, 2, 3, 4, 5].map(tile).join('')}</div>
    ${reelsHTML()}
    <a class="btn btn-primary reveal" href="${igUrl}" target="_blank" rel="noopener">${I.ig.replace('<svg', '<svg width="18" height="18"')} Seguir en Instagram</a>
  </div>
</section>

<section class="section-sm" id="faq">
  <div class="container"><div class="sec-head center reveal"><span class="eyebrow center">Dudas frecuentes</span><h2 class="title">Antes de <em>comprar</em></h2></div>
  <div class="faq reveal">${SV.faq.map((f) => `<details class="faq-item"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div></div>
</section>

<section class="section" id="contacto">
  <div class="container contact">
    <div class="reveal"><span class="eyebrow">Contacto</span><h2 class="title">Hablemos de <em>flores.</em></h2><p class="lead" style="margin-top:22px">¿Dudas sobre una pieza, un regalo o un encargo? Respondo personalmente, normalmente en menos de 24 horas.</p>
      <div class="c-cards">
        <a class="c-card" href="${igUrl}" target="_blank" rel="noopener">${I.ig}<div><small>Instagram · mensaje directo</small><b>@${SV.instagram}</b></div></a>
        ${SV.email ? `<a class="c-card" href="mailto:${SV.email}">${I.mail}<div><small>Email</small><b>${SV.email}</b></div></a>` : ''}
        ${SV.whatsapp ? `<a class="c-card" href="${waUrl('Hola, me gustaría preguntar por una pieza de ' + SV.brand)}" target="_blank" rel="noopener">${I.wa}<div><small>WhatsApp</small><b>${fmtPhone(SV.whatsapp)}</b></div></a>` : ''}
      </div></div>
    <div class="reveal"><div class="form-wrap" id="contactForm" style="background:var(--paper);border:1px solid var(--line);box-shadow:none">
      <h3>Escríbeme</h3><p>Cuéntame en qué puedo ayudarte.</p><br>${contactFormHTML()}</div></div>
  </div>
</section>`;
  }

  function reelsHTML() {
    const reels = (SV.photos.reels || []).filter(Boolean);
    if (!reels.length) return '';
    return `<div class="reels reveal">${reels.map((r) => r.src
      ? `<a href="${r.href || igUrl}" target="_blank" rel="noopener"><video muted loop playsinline preload="metadata" ${r.poster ? `poster="${r.poster}"` : ''} src="${r.src}" data-hover-play></video></a>`
      : `<a href="${r.href || igUrl}" target="_blank" rel="noopener" aria-label="Ver en Instagram: ${esc(r.alt || '')}"><img loading="lazy" decoding="async" src="${r.img}" alt="${esc(r.alt || '')}"></a>`).join('')}</div>`;
  }

  function customFormHTML() {
    return `<h3>Cuéntame tu idea</h3><p>Cuanto más me cuentes, mejor será tu pieza. Te respondo en menos de 24 horas con una propuesta.</p><br>
<form data-form="custom" novalidate>
<div class="hp"><label>No rellenar<input name="website" tabindex="-1" autocomplete="off"></label></div>
<div class="row2"><div class="field"><label for="c-name">Tu nombre <i>*</i></label><input id="c-name" name="nombre" autocomplete="name" required></div>
<div class="field"><label for="c-mail">Email <i>*</i></label><input id="c-mail" name="email" type="email" autocomplete="email" required></div></div>
<div class="row2"><div class="field"><label for="c-tel">WhatsApp / teléfono</label><input id="c-tel" name="telefono" type="tel" autocomplete="tel"></div>
<div class="field"><label for="c-type">Tipo de pieza</label><select id="c-type" name="tipo"><option>Colgante / collar</option><option>Pulsera</option><option>Anillo</option><option>Pendientes</option><option>Llavero</option><option>Otra pieza</option></select></div></div>
<div class="field"><span class="lbl">¿Qué quieres conservar?</span><div class="chips">${occ.map((o, i) => `<label class="chip"><input type="radio" name="ocasion" value="${o[1]}" ${i === 0 ? 'checked' : ''}><span>${o[1]}</span></label>`).join('')}</div></div>
<div class="field"><label for="c-msg">Cuéntame su historia <i>*</i></label><textarea id="c-msg" name="historia" required placeholder="¿Qué flor es? ¿Qué significa para ti? ¿Tienes ya las flores o prefieres que las elija yo?"></textarea></div>
<div class="field"><span class="lbl">Las flores…</span><div class="chips"><label class="chip"><input type="radio" name="flores" value="Las tengo y te las envío" checked><span>Las tengo y te las envío</span></label><label class="chip"><input type="radio" name="flores" value="Elige tú las flores"><span>Elige tú las flores</span></label><label class="chip"><input type="radio" name="flores" value="Aún no lo sé"><span>Aún no lo sé</span></label></div></div>
<div class="row2"><div class="field"><label for="c-date">¿Para cuándo la necesitas?</label><input id="c-date" name="fecha" type="date"></div>
<div class="field"><label for="c-bud">Presupuesto orientativo</label><select id="c-bud" name="presupuesto"><option>Desde 79 €</option><option>80 – 120 €</option><option>120 – 180 €</option><option>Más de 180 €</option></select></div></div>
<div class="field"><span class="lbl">Fotos de referencia (opcional)</span><label class="file-drop"><input type="file" name="fotos" accept="image/*" multiple><span data-file-label>Toca para adjuntar fotos de las flores o de la inspiración</span></label></div>
<label class="consent"><input type="checkbox" name="consent" required> Acepto que uses mis datos para responder a mi solicitud.</label>
<button class="btn btn-primary btn-block" type="submit">Enviar mi idea</button></form>`;
  }
  function contactFormHTML() {
    return `<form data-form="contact" novalidate><div class="hp"><label>No rellenar<input name="website" tabindex="-1" autocomplete="off"></label></div>
<div class="row2"><div class="field"><label for="k-name">Nombre <i>*</i></label><input id="k-name" name="nombre" autocomplete="name" required></div><div class="field"><label for="k-mail">Email <i>*</i></label><input id="k-mail" name="email" type="email" autocomplete="email" required></div></div>
<div class="field"><label for="k-sub">Asunto</label><select id="k-sub" name="asunto"><option>Pregunta sobre una pieza</option><option>Mi pedido</option><option>Regalo o colaboración</option><option>Otro</option></select></div>
<div class="field"><label for="k-msg">Mensaje <i>*</i></label><textarea id="k-msg" name="mensaje" required></textarea></div>
<button class="btn btn-primary btn-block" type="submit">Enviar mensaje</button></form>`;
  }

  /* ══════════ TIENDA ══════════ */
  let shopSort = 'destacados';
  function shopHTML(cat) {
    const c = SV.categories.find((x) => x.id === cat);
    let list = P.filter((p) => !c || p.cat === c.id);
    if (shopSort === 'precio-asc') list = list.slice().sort((a, b) => a.price - b.price);
    if (shopSort === 'precio-desc') list = list.slice().sort((a, b) => b.price - a.price);
    if (shopSort === 'nuevo') list = list.slice().sort((a, b) => b.no - a.no);
    return `<div class="container"><div class="crumbs"><a href="#/">Inicio</a><i>/</i><a href="#/tienda">Tienda</a>${c ? `<i>/</i>${c.name}` : ''}</div>
<div class="page-head"><h1>${c ? c.name : 'La colección'}</h1><p class="lead">${c ? c.blurb : 'Joyas únicas hechas a mano con flores naturales reales. Ninguna se repite.'}</p></div>
<div class="toolbar"><nav class="tabs" aria-label="Categorías"><a class="tab ${!c ? 'on' : ''}" href="#/tienda">Todo</a>${SV.categories.map((x) => `<a class="tab ${c && c.id === x.id ? 'on' : ''}" href="#/tienda/${x.id}">${x.name}</a>`).join('')}</nav>
<label class="sort">Ordenar<select id="sortSel" aria-label="Ordenar por"><option value="destacados">Destacados</option><option value="nuevo">Novedades</option><option value="precio-asc">Precio: menor a mayor</option><option value="precio-desc">Precio: mayor a menor</option></select></label></div>
<div class="grid-products" id="shopGrid">${list.map(card).join('')}</div>
<p class="shop-note reveal">¿No encuentras lo que buscas? Puedo crear una pieza con tu flor. <a class="link-arrow" href="#/personalizar" style="margin-left:6px">Crear pieza a medida</a></p></div><br><br>`;
  }

  /* ══════════ PRODUCTO ══════════ */
  function productHTML(p) {
    const a = availInfo(p), cat = SV.categories.find((c) => c.id === p.cat);
    const out = p.stock <= 0, custom = p.avail === 'custom';
    const views = hasReal(p) ? p.images.concat(p.flowers.length ? [A.product(p, 3)] : []) : [0, 1, 2, 3].map((v) => productImg(p, v));
    const gal = views.map((src, i) => `<div class="g" data-lb><img src="${src}" alt="${esc(p.name)}${i === views.length - 1 && hasReal(p) ? ': flores utilizadas' : ' — vista ' + (i + 1)}" ${i > 1 ? 'loading="lazy"' : ''}></div>`).join('');
    const related = P.filter((x) => x.cat === p.cat && x.id !== p.id).concat(P.filter((x) => x.cat !== p.cat && x.id !== p.id)).slice(0, 4);
    const buy = out ? `<a class="btn btn-primary btn-block" href="#/personalizar">Encargar una pieza parecida</a>`
      : custom ? `<a class="btn btn-primary btn-block" href="#/personalizar">Solicitar mi pieza a medida</a>`
      : `${maxQty(p) > 1 ? `<div class="qty" id="pdpQty"><button data-q="-1" aria-label="Menos">−</button><span id="qv">1</span><button data-q="1" aria-label="Más">+</button></div>` : ''}<button class="btn btn-primary" id="buyMain" data-add-main="${p.id}">Añadir al carrito · ${fmt(p.price)}</button>`;
    return `<div class="container"><div class="crumbs"><a href="#/">Inicio</a><i>/</i><a href="#/tienda">Tienda</a><i>/</i><a href="#/tienda/${p.cat}">${cat.name}</a></div></div>
<div class="container pdp" style="padding-top:26px">
<div><div class="pdp-gallery ${hasReal(p) ? 'real' : ''}" id="gallery">${gal}</div><div class="pdp-dots" id="dots">${views.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div>
<div class="pdp-info">
<span class="cat-l">${cat.name}${p.badge ? ' · ' + esc(p.badge) : ''}</span>
<h1>${esc(p.name)}</h1>
<div class="pdp-price">${priceHTML(p)}<small>IVA incluido</small></div>
<p class="pdp-desc">${esc(p.desc)}</p>
<div class="flower-list"><h4>Flores en esta pieza</h4>${p.flowers.map((f) => `<div class="fl">${A.flowerIcon(f)}<div><b>${FL[f].label}</b><small>${FL[f].meaning}</small></div></div>`).join('')}</div>
<div class="pdp-avail"><span class="avail ${a.cls}">${a.txt}</span></div>
<div class="pdp-buy">${buy}</div>
<div class="trust"><div>${I.leaf}<span>Flores naturales reales, recogidas y secadas a mano</span></div><div>${I.gift}<span>Envío en caja de regalo con tarjeta escrita a mano</span></div><div>${I.truck}<span>Envío en 24–48 h · gratis en España desde ${fmt(SV.freeShippingFrom).replace(',00', '')}</span></div><div>${I.refresh}<span>14 días para devolver (piezas no personalizadas)</span></div></div>
<details class="acc" open><summary>Detalles de la pieza</summary><div class="acc-b"><dl class="spec">${Object.entries(p.details).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div></details>
<details class="acc"><summary>Envíos y devoluciones</summary><div class="acc-b">Las piezas disponibles salen del taller en 1–3 días laborables. España: 24–72 h. Europa: 3–7 días. Resto del mundo: 7–14 días. Con número de seguimiento. Devoluciones en 14 días desde la recepción.</div></details>
<details class="acc"><summary>Cuidados</summary><div class="acc-b">Evita el agua prolongada, los perfumes y el sol directo durante horas. Límpiala con un paño suave y guárdala en su bolsita. Bien cuidada, dura muchísimos años.</div></details>
<details class="acc"><summary>Cada pieza es única</summary><div class="acc-b">Como las flores son naturales, los tonos y las formas pueden variar ligeramente respecto a las fotografías. Esa es su magia: la tuya no se repetirá.</div></details>
</div></div>
<section class="pdp-story"><div class="container reveal"><div class="flourish">${I.flourish}</div><p>“${esc(p.short)}”</p><a class="link-arrow" href="#/historias">Descubre las historias detrás de las piezas ${I.arrow}</a></div></section>
<section class="related"><div class="container"><div class="sec-head reveal"><span class="eyebrow">También te puede gustar</span><h2 class="title">Más flores <em>para ti</em></h2></div><div class="grid-products">${related.map(card).join('')}</div></div></section><br><br>
${!out && !custom ? `<div class="sticky-buy" id="stickyBuy"><div class="sb-t"><b>${esc(p.name)}</b><span>${fmt(p.price)}</span></div><button class="btn btn-primary" data-add="${p.id}">Añadir</button></div>` : ''}`;
  }

  /* ══════════ CHECKOUT ══════════ */
  let co = { country: 'ES', ship: 'standard', promo: null };
  const zoneOf = (c) => (SV.countries.find((x) => x[0] === c) || [0, 0, 'INT'])[2];
  function shipCost(sub) {
    const z = zoneOf(co.country);
    if (co.ship === 'standard' && ((z === 'ES' && sub >= SV.freeShippingFrom) || (z === 'EU' && sub >= 120))) return 0;
    return SV.shipping[co.ship].prices[SV.shipZones[z]];
  }
  function totals() {
    const sub = subtotal();
    const disc = co.promo ? Math.round(sub * SV.promo.pct) / 100 : 0;
    const ship = cart.length ? shipCost(sub) : 0;
    return { sub, disc, ship, total: Math.max(0, sub - disc + ship) };
  }
  function checkoutHTML() {
    if (!cart.length) return `<div class="container"><div class="empty" style="padding:120px 0">${I.bag}<h4>Tu carrito está vacío</h4><p>Elige alguna pieza para continuar con la compra.</p><a class="btn btn-primary" href="#/tienda">Ver la colección</a></div></div>`;
    const z = zoneOf(co.country);
    return `<div class="container"><div class="co-steps"><span>Carrito</span><i></i><b>Datos, envío y pago</b><i></i><span>Confirmación</span></div>
<div class="page-head" style="padding:20px 0 30px"><h1 style="font-size:clamp(2.4rem,5vw,3.8rem)">Finalizar compra</h1></div>
<div class="checkout"><form id="coForm" novalidate>
<div class="co-sec"><h2><span>1</span>Tus datos</h2>
<div class="field"><label for="f-email">Email <i>*</i></label><input id="f-email" name="email" type="email" autocomplete="email" required placeholder="Para enviarte la confirmación y el seguimiento"></div>
<div class="row2"><div class="field"><label for="f-name">Nombre <i>*</i></label><input id="f-name" name="nombre" autocomplete="given-name" required></div><div class="field"><label for="f-last">Apellidos <i>*</i></label><input id="f-last" name="apellidos" autocomplete="family-name" required></div></div>
<div class="field"><label for="f-tel">Teléfono <i>*</i></label><input id="f-tel" name="telefono" type="tel" autocomplete="tel" required placeholder="Solo para el envío"></div></div>
<div class="co-sec"><h2><span>2</span>Dirección de envío</h2>
<div class="field"><label for="f-country">País <i>*</i></label><select id="f-country" name="pais" autocomplete="country">${SV.countries.map((c) => `<option value="${c[0]}" ${c[0] === co.country ? 'selected' : ''}>${c[1]}</option>`).join('')}</select></div>
<div class="field"><label for="f-addr">Dirección <i>*</i></label><input id="f-addr" name="direccion" autocomplete="address-line1" required placeholder="Calle y número"></div>
<div class="field"><label for="f-addr2">Piso, puerta, otros datos</label><input id="f-addr2" name="direccion2" autocomplete="address-line2"></div>
<div class="row3"><div class="field"><label for="f-zip">C. postal <i>*</i></label><input id="f-zip" name="cp" autocomplete="postal-code" required></div><div class="field" style="grid-column:span 2"><label for="f-city">Ciudad <i>*</i></label><input id="f-city" name="ciudad" autocomplete="address-level2" required></div></div>
<div class="gift-box"><label class="consent" style="margin:0 0 10px"><input type="checkbox" id="giftChk" name="regalo"> Es un regalo: envolver con tarjeta escrita a mano (gratis)</label><div class="field" id="giftMsg" hidden><label for="f-gift">Mensaje para la tarjeta</label><textarea id="f-gift" name="mensaje_regalo" style="min-height:90px" maxlength="240"></textarea></div></div></div>
<div class="co-sec" id="shipSec"><h2><span>3</span>Método de envío</h2>${shipOptions()}</div>
<div class="co-sec"><h2><span>4</span>Forma de pago</h2>
<p style="color:var(--ink-2);font-weight:300;margin:-6px 0 16px">Los pedidos se confirman personalmente: ${esc(SV.creator)} te escribirá con los datos para pagar. <b>No se te cobra nada al enviar la solicitud.</b></p>
<label class="radio-card" id="bizumCard" ${z !== 'ES' ? 'hidden' : ''}><input type="radio" name="pago" value="bizum" checked><div class="rc-t"><b>Bizum</b><small>Solo España · pago inmediato desde tu móvil</small></div></label>
<label class="radio-card"><input type="radio" name="pago" value="paypal" ${z !== 'ES' ? 'checked' : ''}><div class="rc-t"><b>PayPal</b><small>Te envío un enlace de pago</small></div></label>
<label class="radio-card"><input type="radio" name="pago" value="transfer"><div class="rc-t"><b>Transferencia bancaria</b><small>Te envío los datos por mensaje</small></div></label></div>
<label class="consent"><input type="checkbox" name="terminos" required> He leído y acepto las condiciones de compra y la política de privacidad.</label>
<button class="btn btn-primary btn-block" type="submit" id="payBtn" style="min-height:60px"></button>
<p class="sum-trust">${I.lock}<span>Sin cobro al enviar · Pagas cuando ${esc(SV.creator)} confirme tu pedido</span></p></form>
<aside class="co-summary" id="coSummary"></aside></div></div>`;
  }
  function shipOptions() {
    const sub = subtotal(), z = SV.shipZones[zoneOf(co.country)];
    return ['standard', 'express'].map((k) => {
      const s = SV.shipping[k]; const save = co.ship; co.ship = k; const cost = shipCost(sub); co.ship = save;
      return `<label class="radio-card"><input type="radio" name="envio" value="${k}" ${co.ship === k ? 'checked' : ''}><div class="rc-t"><b>${s.label}</b><small>${s.eta} laborables · con seguimiento</small></div><span class="rc-p">${cost === 0 ? 'Gratis' : fmt(cost)}</span></label>`;
    }).join('');
  }
  function renderSummary() {
    const el = $('#coSummary'); if (!el) return;
    const t = totals();
    el.innerHTML = `<details class="sum-d" ${window.innerWidth > 900 ? 'open' : ''}><summary><h2 style="display:inline">Tu pedido (${cartCount()})</h2><b class="sum-tot">${fmt(t.total)}</b></summary>
${cart.map((l) => { const p = byId[l.id]; return `<div class="si"><div class="im"><img src="${productImg(p, 0)}" alt=""><em>${l.qty}</em></div><div><b>${esc(p.name)}</b><small style="color:var(--ink-2)">${p.flowers.map((f) => FL[f].label).join(' · ')}</small></div><span>${fmt(p.price * l.qty)}</span></div>`; }).join('')}
<div class="promo"><input id="promoIn" placeholder="Código de descuento" aria-label="Código de descuento" value="${co.promo ? SV.promo.code : ''}"><button type="button" id="promoBtn">Aplicar</button></div><div class="promo-msg ${co.promo ? 'ok' : ''}" id="promoMsg">${co.promo ? '✓ ' + SV.promo.pct + ' % de descuento aplicado' : ''}</div>
<div class="line"><span>Subtotal</span><span>${fmt(t.sub)}</span></div>${t.disc ? `<div class="line" style="color:var(--sage-d)"><span>Descuento</span><span>−${fmt(t.disc)}</span></div>` : ''}
<div class="line"><span>Envío</span><span>${t.ship === 0 ? 'Gratis' : fmt(t.ship)}</span></div><div class="line total"><span>Total</span><span>${fmt(t.total)}</span></div><small style="color:var(--ink-2)">IVA incluido</small></details>`;
    const b = $('#payBtn'); if (b) b.innerHTML = `${I.lock.replace('<svg', '<svg width="18" height="18"')} Enviar solicitud de pedido · ${fmt(t.total)}`; hydrate(el);
  }

  function confirmHTML(o) {
    return `<div class="container"><div class="confirm"><div class="ok-ring">${I.check}</div><span class="eyebrow center">Solicitud de pedido</span>
<h1>¡Gracias, ${esc(o.nombre)}!</h1><p class="lead" style="margin:0 auto">${o.sent ? `Tu solicitud ya ha llegado al taller. ${esc(SV.creator)} te escribirá a <b>${esc(o.email)}</b> para confirmar la pieza y acordar el pago.` : `Último paso: envíale tu pedido a ${esc(SV.creator)} para que lo confirme y acordéis el pago. No se te ha cobrado nada.`}</p>
${o.sent ? '' : `<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:26px 0 0"><button class="btn btn-primary" data-copy-order type="button">Copiar mi pedido</button>${SV.whatsapp ? `<a class="btn btn-ghost" target="_blank" rel="noopener" href="${waUrl(o.text)}">Enviar por WhatsApp</a>` : ''}<a class="btn btn-ghost" target="_blank" rel="noopener" href="${igUrl}">Abrir Instagram (mensaje directo)</a></div><p style="font-size:13px;color:var(--ink-2);margin-top:12px">Copia el pedido y pégalo en el mensaje directo de Instagram.</p>`}
<div class="order-no">Pedido ${o.no}</div>
<div class="summary">${o.items.map((l) => `<div class="line"><span>${esc(l.name)} × ${l.qty}</span><span>${fmt(l.price * l.qty)}</span></div>`).join('')}<div class="line"><span>Envío</span><span>${o.ship === 0 ? 'Gratis' : fmt(o.ship)}</span></div>${o.disc ? `<div class="line"><span>Descuento</span><span>−${fmt(o.disc)}</span></div>` : ''}<div class="line total"><span>Total</span><span>${fmt(o.total)}</span></div><small style="color:var(--ink-2)">Envío a: ${esc(o.direccion)}, ${esc(o.cp)} ${esc(o.ciudad)}</small></div>
<div class="timeline"><div><em>1</em><b>Confirmo tu pieza</b>Compruebo la disponibilidad y te escribo para acordar el pago.</div><div><em>2</em><b>Preparo tu pedido</b>La envuelvo a mano y te aviso cuando salga del taller.</div><div><em>3</em><b>Llega a tus manos</b>Plazo estimado de envío: ${o.eta}. Si es un regalo, con tarjeta escrita a mano.</div></div>
<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="#/tienda">Seguir descubriendo</a><a class="btn btn-ghost" href="${igUrl}" target="_blank" rel="noopener">Síguenos en Instagram</a></div></div></div>`;
  }

  /* ══════════ RENDER + RUTAS ══════════ */
  let current = '';
  const main = $('#main');
  const HOME_ANCHORS = ['inicio', 'coleccion', 'proceso', 'creador', 'historias', 'personalizar', 'resenas', 'instagram', 'faq', 'contacto'];
  let io, heroObs;

  function mount(html, name) {
    main.innerHTML = html; current = name;
    document.body.dataset.page = name;
    hydrate(main); initReveal(); initMedia();
    $$('.nav a').forEach((a) => a.classList.toggle('on', a.dataset.nav === (name === 'shop' || name === 'product' ? 'tienda' : '')));
    headerState();
  }
  function initReveal() {
    if (io) io.disconnect();
    const els = $$('.reveal, .reveal-img', main);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }
  function initMedia() {
    $$('video[data-hover-play]', main).forEach((v) => {
      v.addEventListener('mouseenter', () => v.play().catch(() => {})); v.addEventListener('mouseleave', () => v.pause());
      if (matchMedia('(hover: none)').matches) { new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())), { threshold: 0.6 }).observe(v); }
    });
    const st = $('#stickyBuy'), buy = $('#buyMain');
    if (st && buy) new IntersectionObserver((es) => es.forEach((e) => st.classList.toggle('on', !e.isIntersecting && e.boundingClientRect.top < 0)), { threshold: 0 }).observe(buy);
    const gal = $('#gallery');
    if (gal) gal.addEventListener('scroll', () => { const i = Math.round(gal.scrollLeft / gal.clientWidth); $$('#dots i').forEach((d, k) => d.classList.toggle('on', k === i)); }, { passive: true });
  }

  function scrollToSection(id, smooth) {
    const el = document.getElementById(id); if (!el) return;
    if (id === 'personalizar') { /* mantiene el formulario cerrado hasta que se pida */ }
    requestAnimationFrame(() => el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' }));
  }
  function route() {
    const h = location.hash.replace(/^#\/?/, '').split('?')[0];
    const seg = h.split('/').filter(Boolean); const first = seg[0] || '';
    closeDrawer(); closeMenu();
    if (!first || HOME_ANCHORS.includes(first)) {
      const wasHome = current === 'home';
      if (!wasHome) mount(homeHTML(), 'home');
      if (first && first !== 'inicio') { scrollToSection(first, wasHome); if (first === 'personalizar' && location.hash.includes('abrir')) openCustom(); }
      else top0();
    } else if (first === 'tienda') { mount(shopHTML(seg[1]), 'shop'); const s = $('#sortSel'); if (s) s.value = shopSort; top0(); document.title = (seg[1] ? (SV.categories.find((c) => c.id === seg[1]) || { name: 'Tienda' }).name : 'Tienda') + ' · ' + SV.brand; return; }
    else if (first === 'producto' && byId[seg[1]]) { mount(productHTML(byId[seg[1]]), 'product'); top0(); document.title = byId[seg[1]].name + ' · ' + SV.brand; return; }
    else if (first === 'checkout') { mount(checkoutHTML(), 'checkout'); renderSummary(); initCheckoutInputs(); top0(); document.title = 'Finalizar compra · ' + SV.brand; return; }
    else if (first === 'confirmacion') { const o = store.sget('af_order', null); if (!o) { location.hash = '#/'; return; } mount(confirmHTML(o), 'confirm'); top0(); document.title = 'Pedido confirmado · ' + SV.brand; return; }
    else { location.hash = '#/'; return; }
    document.title = 'Aura Flowers · Joyería artesanal con flores naturales en resina';
  }

  function top0() { window.scrollTo({ top: 0, behavior: 'instant' }); }

  /* ── cabecera ── */
  function headerState() {
    const h = $('#header'); const solid = current !== 'home' || window.scrollY > 40;
    h.classList.toggle('solid', solid);
  }
  function openMenu() { $('#mobileMenu').classList.add('open'); $('#mobileMenu').setAttribute('aria-hidden', 'false'); $('#menuBtn').setAttribute('aria-expanded', 'true'); document.body.classList.add('lock'); $('#header').classList.add('solid'); $('#menuBtn').innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>'; }
  function closeMenu() { const m = $('#mobileMenu'); if (!m.classList.contains('open')) return; m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); $('#menuBtn').setAttribute('aria-expanded', 'false'); if (!$('#drawer').classList.contains('on')) document.body.classList.remove('lock'); $('#menuBtn').innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>'; headerState(); }

  /* ── personalizar ── */
  function openCustom() {
    const p = $('#customPanel'); if (!p) return;
    p.classList.add('open'); const t = $('#customTeaser'); if (t) t.style.display = 'none';
    setTimeout(() => { const f = $('#customForm'); f && f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 250);
  }

  /* ── scroll: parallax y línea del proceso ── */
  let ticking = false;
  /* Respaldo del revelado: garantiza que ningún bloque se quede oculto aunque el observador tarde */
  function revealCheck() {
    const vh = innerHeight;
    $$('.reveal:not(.in), .reveal-img:not(.in)', main).forEach((e) => { const r = e.getBoundingClientRect(); if (r.top < vh * 0.92 && r.bottom > 0) e.classList.add('in'); });
  }
  function onScroll() {
    headerState(); revealCheck();
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const vh = innerHeight, y = scrollY;
      if (current === 'home' && y < vh) $$('.hero-media img').forEach((im) => { im.style.transform = `translateY(${y * 0.16}px)`; });
      $$('img[data-par]').forEach((im) => { const r = im.parentElement.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return; const off = (r.top + r.height / 2 - vh / 2) * -0.07; im.style.transform = `translateY(${Math.max(-24, Math.min(24, off)).toFixed(1)}px)`; });
      const steps = $('#steps'); if (steps) { const r = steps.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (vh * 0.55 - r.top) / r.height)); const li = $('.process-line', steps); li && li.style.setProperty('--p', (p * 100).toFixed(1) + '%'); }
    });
  }

  /* ══════════ FORMULARIOS ══════════ */
  const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function validate(form) {
    let bad = null;
    $$('[required]', form).forEach((f) => {
      const v = f.type === 'checkbox' ? f.checked : f.value.trim();
      let ok = !!v; if (ok && f.type === 'email') ok = mailOk(f.value.trim());
      f.classList.toggle('err', !ok); if (!ok && !bad) bad = f;
    });
    return bad;
  }
  async function sendForm(kind, form) {
    const data = new FormData(form); data.append('_tipo', kind);
    if (SV.formEndpoint) {
      const res = await fetch(SV.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('send');
    } else {
      const obj = {}; data.forEach((v, k) => { obj[k] = v instanceof File ? v.name : v; });
      const all = store.get('af_msgs', []); all.push(Object.assign({ fecha: new Date().toISOString() }, obj)); store.set('af_msgs', all);
      await new Promise((r) => setTimeout(r, 700));
    }
    return Object.fromEntries(Array.from(data.entries()).map(([k, v]) => [k, v instanceof File ? v.name : v]));
  }
  async function submitForm(form) {
    const kind = form.dataset.form;
    if (kind === 'news') { const i = form.email; if (!mailOk(i.value.trim())) { i.classList.add('err'); toast('Escribe un correo válido'); return; } i.classList.remove('err'); i.value = ''; toast('¡Gracias! Te avisaré de las novedades del taller ✿'); return; }
    const bad = validate(form);
    if (bad) { bad.focus(); toast(bad.type === 'email' ? 'Revisa el correo electrónico' : 'Completa los campos marcados'); return; }
    if (form.website && form.website.value) return; // antispam
    const btn = $('button[type=submit]', form); const txt = btn.textContent; btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      const d = await sendForm(kind, form);
      const box = form.closest('.form-wrap');
      const wa = kind === 'custom' ? (SV.whatsapp
        ? `<a class="btn btn-ghost" style="margin-top:8px" target="_blank" rel="noopener" href="${waUrl('Hola, soy ' + d.nombre + '. Acabo de enviar mi idea para una pieza personalizada (' + d.tipo + ') y me gustaría comentarla.')}">Continuar por WhatsApp</a>`
        : `<a class="btn btn-ghost" style="margin-top:8px" target="_blank" rel="noopener" href="${igUrl}">Escríbeme también por Instagram</a>`) : '';
      box.innerHTML = `<div class="form-ok">${I.check}<h3>${kind === 'custom' ? '¡Gracias, ' + esc(d.nombre) + '!' : 'Mensaje enviado'}</h3><p style="color:var(--ink-2)">${kind === 'custom' ? 'He recibido tu idea. Te responderé en menos de 24 horas con una propuesta y los siguientes pasos.' : 'Gracias por escribirme. Te responderé lo antes posible.'}</p>${wa}</div>`;
    } catch (e) { btn.disabled = false; btn.textContent = txt; toast('No se pudo enviar. Inténtalo de nuevo o escríbeme por WhatsApp.'); }
  }

  /* ── checkout ── */
  function initCheckoutInputs() { /* sin campos de tarjeta: el pago se acuerda tras confirmar el pedido */ }
  function placeOrder(form) {
    const req = $$('[required]', form); let bad = null;
    req.forEach((f) => { const v = f.type === 'checkbox' ? f.checked : f.value.trim(); let ok = !!v; if (ok && f.type === 'email') ok = mailOk(f.value.trim()); f.classList.toggle('err', !ok); if (!ok && !bad) bad = f; });
    const pay = form.pago.value;
    if (bad) { bad.scrollIntoView({ behavior: 'smooth', block: 'center' }); bad.focus({ preventScroll: true }); toast(bad.type === 'checkbox' ? 'Acepta las condiciones para continuar' : 'Revisa los campos marcados'); return; }
    const btn = $('#payBtn'); btn.disabled = true; btn.textContent = 'Enviando solicitud…';
    const t = totals();
    setTimeout(() => {
      const no = 'AF-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      const country = SV.countries.find((c) => c[0] === form.pais.value);
      const order = { no, nombre: form.nombre.value.trim(), email: form.email.value.trim(), direccion: form.direccion.value.trim(), cp: form.cp.value.trim(), ciudad: form.ciudad.value.trim() + (country ? ', ' + country[1] : ''), items: cart.map((l) => ({ name: byId[l.id].name, qty: l.qty, price: byId[l.id].price })), ship: t.ship, disc: t.disc, total: t.total, eta: SV.shipping[co.ship].eta + ' laborables', pago: pay, tel: form.telefono.value.trim(), regalo: form.regalo.checked ? (form.mensaje_regalo.value.trim() || 'Sí, envolver para regalo') : '', sent: !!SV.formEndpoint };
      order.text = ['Hola, quiero hacer este pedido en ' + SV.brand + ' (' + no + '):', ''].concat(order.items.map((l) => '• ' + l.name + ' × ' + l.qty + ' — ' + fmt(l.price * l.qty)), ['', 'Envío: ' + (order.ship === 0 ? 'Gratis' : fmt(order.ship)) + (order.disc ? ' · Descuento: −' + fmt(order.disc) : ''), 'Total: ' + fmt(order.total), 'Pago preferido: ' + pay, '', 'Nombre: ' + order.nombre + ' ' + form.apellidos.value.trim(), 'Email: ' + order.email, 'Teléfono: ' + order.tel, 'Dirección: ' + order.direccion + ', ' + order.cp + ' ' + order.ciudad, order.regalo ? 'Regalo: ' + order.regalo : '']).filter((x, i, a) => x !== '' || (a[i - 1] !== '' && i)).join('\n');
      if (SV.formEndpoint) { const fd = new FormData(); fd.append('_tipo', 'pedido'); fd.append('pedido', order.text); fd.append('email', order.email); fetch(SV.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }).catch(() => {}); }
      // Los datos de tarjeta nunca se guardan.
      store.sset('af_order', order);
      const orders = store.get('af_orders', []); orders.push(Object.assign({ fecha: new Date().toISOString() }, order)); store.set('af_orders', orders);
      cart = []; saveCart(); co.promo = null; updateCartUI();
      location.hash = '#/confirmacion';
    }, 1400);
  }

  /* ══════════ EVENTOS ══════════ */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const add = t.closest('[data-add]');
    if (add) { const ok = addToCart(add.dataset.add, 1); if (ok) { const p = byId[add.dataset.add]; add.classList.add('done'); const o = add.textContent; if (add.classList.contains('btn-add')) { add.textContent = 'Añadido ✓'; setTimeout(() => { add.classList.remove('done'); add.textContent = o; }, 1600); } openDrawer(); } return; }
    const am = t.closest('[data-add-main]');
    if (am) { const q = parseInt(($('#qv') || { textContent: '1' }).textContent, 10) || 1; if (addToCart(am.dataset.addMain, q)) openDrawer(); return; }
    const qb = t.closest('[data-q]'); if (qb) { const el = $('#qv'), p = byId[location.hash.split('/')[2]]; const n = Math.max(1, Math.min(maxQty(p), parseInt(el.textContent, 10) + parseInt(qb.dataset.q, 10))); el.textContent = n; return; }
    const inc = t.closest('[data-inc]'); if (inc) { const l = cart.find((x) => x.id === inc.dataset.inc); setQty(inc.dataset.inc, l.qty + 1); return; }
    const dec = t.closest('[data-dec]'); if (dec) { const l = cart.find((x) => x.id === dec.dataset.dec); setQty(dec.dataset.dec, l.qty - 1); return; }
    const rm = t.closest('[data-rm]'); if (rm) { setQty(rm.dataset.rm, 0); return; }
    if (t.closest('[data-close-drawer]')) { closeDrawer(); return; }
    if (t.closest('#cartBtn')) { openDrawer(); return; }
    if (t === $('#scrim')) { closeDrawer(); return; }
    if (t.closest('#menuBtn')) { $('#mobileMenu').classList.contains('open') ? closeMenu() : openMenu(); return; }
    if (t.closest('#mobileMenu a')) { closeMenu(); return; }
    if (t.closest('[data-copy-order]')) { const o = store.sget('af_order', null); if (o) { (navigator.clipboard ? navigator.clipboard.writeText(o.text) : Promise.reject()).then(() => toast('Pedido copiado ✿ Pégalo en el mensaje'), () => toast('No se pudo copiar automáticamente')); } return; }
    if (t.closest('[data-open-custom]')) { openCustom(); return; }
    const oc = t.closest('[data-occ]');
    if (oc) { openCustom(); const r = $(`input[name=ocasion][value="${oc.dataset.occ}"]`); if (r) r.checked = true; return; }
    const lb = t.closest('[data-lb]'); if (lb) { const im = lb.querySelector('img'); const L = $('#lightbox'); $('img', L).src = im.src; L.classList.add('on'); return; }
    if (t.closest('#lightbox')) { $('#lightbox').classList.remove('on'); return; }
    if (t.id === 'promoBtn') { const v = $('#promoIn').value.trim().toUpperCase(); const m = $('#promoMsg'); if (v === SV.promo.code) { co.promo = true; renderSummary(); } else { co.promo = null; m.className = 'promo-msg bad'; m.textContent = v ? 'Ese código no es válido' : 'Escribe un código'; } return; }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target;
    if (f.id === 'coForm') { e.preventDefault(); placeOrder(f); return; }
    if (f.dataset.form) { e.preventDefault(); submitForm(f); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.id === 'sortSel') { shopSort = t.value; const seg = location.hash.replace(/^#\/?/, '').split('/'); mount(shopHTML(seg[1]), 'shop'); const s = $('#sortSel'); s.value = shopSort; return; }
    if (t.id === 'f-country') { co.country = t.value; if (zoneOf(co.country) !== 'ES') { const b = $('#bizumCard'); b.hidden = true; if (b.querySelector('input').checked) $('input[name=pago][value=card]').checked = true; } else $('#bizumCard').hidden = false; $('#shipSec').innerHTML = `<h2><span>3</span>Método de envío</h2>${shipOptions()}`; renderSummary(); return; }
    if (t.name === 'envio') { co.ship = t.value; renderSummary(); return; }
    if (t.id === 'giftChk') { $('#giftMsg').hidden = !t.checked; return; }
    if (t.type === 'file') { const l = t.parentElement.querySelector('[data-file-label]'); if (l) l.textContent = t.files.length ? t.files.length + ' archivo(s) seleccionado(s)' : 'Toca para adjuntar fotos de las flores o de la inspiración'; }
  });
  document.addEventListener('input', (e) => { if (e.target.classList && e.target.classList.contains('err')) e.target.classList.remove('err'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); closeMenu(); $('#lightbox').classList.remove('on'); } });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('hashchange', route);

  /* ── arranque ── */
  if (SV.whatsapp) { const w = document.createElement('a'); w.className = 'wa-fab'; w.href = waUrl('Hola, me gustaría preguntar por una pieza de ' + SV.brand); w.target = '_blank'; w.rel = 'noopener'; w.setAttribute('aria-label', 'Escribir por WhatsApp'); w.innerHTML = I.wa; document.body.appendChild(w); }
  footer(); updateCartUI(); route(); onScroll();
})();
