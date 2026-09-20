/* ==========================================================
   PROTOTIPO · Aura Flowers — scroll a pantalla completa
   Usa los mismos datos que la web (config.js, data.js y los cambios del
   editor en content.json). Tienda, fichas y carrito se abren en la web principal.
   ========================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const P = SV.products;
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n).replace(',00', '');
  const igUrl = 'https://www.instagram.com/' + SV.instagram + '/';
  const fmtPhone = (n) => { n = String(n || '').replace(/\D/g, ''); return n.length === 11 ? '+' + n.slice(0, 2) + ' ' + n.slice(2, 5) + ' ' + n.slice(5, 7) + ' ' + n.slice(7, 9) + ' ' + n.slice(9) : '+' + n; };
  const waUrl = (t) => 'https://wa.me/' + SV.whatsapp + (t ? '?text=' + encodeURIComponent(t) : '');
  const pimg = (p) => (p.images && p.images[0]) || SV_ART.product(p, 0);
  const priceTxt = (p) => (p.priceFrom ? 'Desde ' : '') + fmt(p.price);
  const HERO = SV.photos.hero || 'assets/aura/ella-espaldas.jpg';
  const STORY = 'assets/aura/orquideas-mesa.jpg';

  /* ── secciones ── */
  const secs = [];
  const add = (name, tone, html, cls, nologo) => secs.push({ name, tone, html, cls: cls || '', nologo: !!nologo });

  // 1 · Portada
  add('Inicio', 'light', `
    <div class="hero-bg" style="background-image:url('${HERO}')"></div>
    ${SV.photos.heroVideo ? `<video class="hero-vid" src="${SV.photos.heroVideo}" autoplay muted loop playsinline></video>` : ''}
    <div class="hero-shade"></div>
    <div class="hero-c">
      <div class="wordmark wipe"><b>Aura</b><em>Flowers</em></div>
      <p class="hero-tag rv" style="--d:1.3s">Flores que nunca dejan de florecer.</p>
      <a class="pbtn rv" style="--d:1.6s" href="./#/tienda">Ver productos</a>
    </div>
    <button class="cue rf" style="--d:2.2s" data-go="1" aria-label="Bajar">↓</button>`, 'ps-hero on');

  // 2-3 · Categorías a pantalla dividida
  const cats = SV.categories.filter((c) => byId[c.cover] || P.some((p) => p.cat === c.id)).slice(0, 4);
  const pane = (c, i) => {
    const p = byId[c.cover] || P.find((x) => x.cat === c.id);
    const src = pimg(p);
    return `<a class="pane rv" style="--d:${i * 0.25}s" href="./#/tienda/${c.id}"><div class="bgb" style="background-image:url('${src}')"></div><img class="fg" src="${src}" alt="${esc(c.name)}"><div class="pane-l"><div><span>${esc(c.name)}</span><small>${esc(c.blurb)}</small></div><i>→</i></div></a>`;
  };
  for (let i = 0; i < cats.length; i += 2) add(i ? 'Más piezas' : 'Colecciones', 'light', cats.slice(i, i + 2).map((c, k) => pane(c, k)).join(''), 'ps-split');

  // 4 · Historia
  add('Historia', 'light', `
    <div class="story-bg zoom" style="background-image:url('${STORY}')"></div>
    ${SV.photos.storyVideo ? `<video class="story-vid" src="${SV.photos.storyVideo}" autoplay muted loop playsinline></video>` : ''}
    <div class="story-shade"></div>
    <div class="story-c">
      <span class="eyebrow-s rv">Nuestra historia</span>
      <h2 class="rv" style="--d:.2s">Las flores capturan <em>la energía de nuestros recuerdos.</em></h2>
      <p class="rv" style="--d:.4s">Llamé a mi marca Aura Flowers porque el aura es la esencia, la energía que transmite algo. Mis flores favoritas son las orquídeas Cattleya lilas del jardín de mi casa, en Cuba: las mismas que llevó mi madre en su ramo de boda.</p>
      <a class="pbtn rv" style="--d:.6s" href="#" data-go-name="Proceso">Conoce el proceso</a>
    </div>`, 'ps-story');

  // 5 · Best sellers
  add('Más queridas', 'dark', `
    <div class="car-head rv"><div><span class="eyebrow-s">Best sellers</span><h2>Las más <em>queridas</em></h2></div><div class="arrows"><button data-car="-1" aria-label="Anterior">←</button><button data-car="1" aria-label="Siguiente">→</button></div></div>
    <div class="car rv" style="--d:.25s">${P.map((p) => `<a class="pc" href="./#/producto/${p.id}"><div class="pc-i">${p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ''}<img loading="lazy" src="${pimg(p)}" alt="${esc(p.name)}"></div><h3>${esc(p.name)}</h3><p>${priceTxt(p)}</p></a>`).join('')}</div>
    <div class="car-foot rv" style="--d:.5s"><a class="tlink" href="./#/tienda">Descubre más</a></div>`, 'ps-car');

  // 6 · Proceso
  add('Proceso', 'dark', `
    <div class="car-head rv"><div><span class="eyebrow-s">El proceso</span><h2>Lo que hay detrás <em>de cada pieza</em></h2></div><div class="arrows"><button data-car="-1" aria-label="Anterior">←</button><button data-car="1" aria-label="Siguiente">→</button></div></div>
    <div class="car rv" style="--d:.25s">${SV.process.map((s, i) => `<article class="sc"><div class="sc-i"><img loading="lazy" src="${SV.photos.process[i] || SV_ART.scene(s.scene)}" alt="${esc(s.title)}"></div><div class="sc-b"><div class="sc-n">${s.n}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></article>`).join('')}</div>`, 'ps-car alt');

  // 7 · Amanda
  add('Amanda', 'dark', `
    <div class="about-t"><div>
      <span class="eyebrow-s rv">Sobre la creadora</span>
      <h2 class="rv" style="--d:.15s">Hola, soy ${esc(SV.creator)}. <em>Cada joya pasa por mis manos.</em></h2>
      <p class="rv" style="--d:.3s">Desde la elección de la flor hasta el pulido final, en mi taller de ${esc(SV.city)}. Nada se fabrica en serie: cada pieza es única, como cada flor.</p>
      <p class="rv" style="--d:.4s">Trabajo con orquídeas, margaritas, rosas y flores de tus recuerdos, encapsuladas en resina para que no se marchiten.</p>
      <div class="benef rv" style="--d:.5s"><div><b>100 % naturales</b><span>Flores reales, secadas y encapsuladas a mano.</span></div><div><b>Piezas únicas</b><span>Ninguna joya es igual a otra.</span></div><div><b>A tu medida</b><span>Convierto la flor de tu ramo o de tu recuerdo en joya.</span></div></div>
      <a class="pbtn solid rv" style="--d:.6s" href="./#/personalizar">Crear una pieza personalizada</a>
    </div></div>
    <div class="about-p"><div class="bgb" style="background-image:url('${HERO}')"></div><img class="zoom" src="${HERO}" alt="${esc(SV.creator)} ante una buganvilla en flor"></div>`, 'ps-about', true);

  // 8 · Instagram
  const igItems = (SV.photos.instagram || []).concat(SV.photos.reels || []).filter((x) => x && typeof x === 'object');
  add('Instagram', 'dark', `
    <div class="car-head rv"><div><span class="eyebrow-s">Instagram · @${esc(SV.instagram)}</span><h2>El taller, <em>día a día</em></h2></div><div class="arrows"><button data-car="-1" aria-label="Anterior">←</button><button data-car="1" aria-label="Siguiente">→</button></div></div>
    <div class="car rv" style="--d:.25s">${igItems.map((x) => `<a class="ig" href="${esc(x.href || igUrl)}" target="_blank" rel="noopener" aria-label="${esc(x.alt || 'Ver en Instagram')}">${x.video ? `<video muted loop playsinline preload="metadata" ${x.poster ? `poster="${x.poster}"` : ''} src="${x.video}" data-hp></video>` : `<img loading="lazy" src="${x.img}" alt="${esc(x.alt || '')}">`}</a>`).join('')}</div>
    <div class="car-foot rv" style="--d:.5s"><a class="tlink" href="${igUrl}" target="_blank" rel="noopener">Seguir en Instagram</a></div>`, 'ps-car');

  // 9 · Contacto
  add('Contacto', 'light', `
    <span class="eyebrow-s rv">Contacto</span>
    <h2 class="rv" style="--d:.15s">Hablemos de <em>flores.</em></h2>
    <p class="sub rv" style="--d:.3s">¿Dudas sobre una pieza, un regalo o un encargo a medida? Escríbeme y te respondo personalmente.</p>
    <div class="c-row rv" style="--d:.45s">
      ${SV.whatsapp ? `<a class="pbtn solid" href="${waUrl('Hola, me gustaría preguntar por una pieza de ' + SV.brand)}" target="_blank" rel="noopener">WhatsApp · ${fmtPhone(SV.whatsapp)}</a>` : ''}
      <a class="pbtn" href="${igUrl}" target="_blank" rel="noopener">Instagram · @${esc(SV.instagram)}</a>
      ${SV.email ? `<a class="pbtn" href="mailto:${esc(SV.email)}">${esc(SV.email)}</a>` : ''}
    </div>
    <div class="foot-s"><a href="./#/tienda">Tienda</a><a href="./#/personalizar">A medida</a><a href="./#/faq">Envíos y cuidados</a><a href="./">Web actual</a><span>© ${new Date().getFullYear()} ${esc(SV.brand)}</span></div>`, 'ps-contact');

  const snap = $('#snap');
  snap.innerHTML = secs.map((s, i) => `<section class="ps ${s.cls}" data-i="${i}" data-tone="${s.tone}" aria-label="${esc(s.name)}">${s.html}</section>`).join('');
  const nodes = $$('.ps', snap);

  /* ── imágenes SVG de ejemplo → JPEG (rendimiento) y detección de fotos pequeñas ── */
  const rc = new Map(); const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAAACwAAAAAAQABAAACAUwAOw==';
  const raster = (u) => { if (rc.has(u)) return rc.get(u); const p = new Promise((res) => { const im = new Image(); im.onload = () => { try { const s = Math.min(1, 1200 / Math.max(im.naturalWidth, im.naturalHeight)); const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); c.toBlob((b) => res(b ? URL.createObjectURL(b) : u), 'image/jpeg', 0.88); } catch (e) { res(u); } }; im.onerror = () => res(u); im.src = u; }); rc.set(u, p); return p; };
  $$('img[src^="data:image/svg"]', snap).forEach((im) => { const u = im.src; im.src = BLANK; im.removeAttribute('loading'); raster(u).then((b) => { im.src = b; }); });
  $$('.pane img.fg, .about-p img', snap).forEach((im) => {
    const chk = () => { if (im.naturalWidth && im.naturalWidth < 900) im.closest('.pane, .about-p').classList.add('lo'); };
    if (im.complete) chk(); else im.addEventListener('load', chk);
  });

  /* ── estado: sección activa, cabecera, indicador ── */
  const ph = $('#ph'), dots = $('#dots');
  dots.innerHTML = secs.map((s, i) => `<button type="button" data-go="${i}" title="${esc(s.name)}" aria-label="${esc(s.name)}"></button>`).join('');
  let cur = -1;
  function update() {
    const i = Math.max(0, Math.min(secs.length - 1, Math.round(snap.scrollTop / snap.clientHeight)));
    if (i === cur) return; cur = i;
    nodes.forEach((n, k) => n.classList.toggle('on', k === i));
    const tone = secs[i].tone;
    ph.classList.toggle('light', tone === 'light'); ph.classList.toggle('dark', tone === 'dark');
    dots.classList.toggle('light', tone === 'light'); dots.classList.toggle('dark', tone === 'dark');
    ph.classList.toggle('show-logo', i > 0 && !secs[i].nologo);
    $$('button', dots).forEach((b, k) => b.classList.toggle('on', k === i));
    $$('video[data-hp]', snap).forEach((v) => v.pause());
  }
  snap.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => { cur = -1; update(); });
  const goTo = (i) => { const n = nodes[Math.max(0, Math.min(nodes.length - 1, i))]; if (n) snap.scrollTo({ top: n.offsetTop, behavior: 'smooth' }); };
  update(); snap.focus({ preventScroll: true });

  /* ── menú ── */
  const menu = $('#pmenu');
  const idx = (name) => secs.findIndex((s) => s.name === name);
  const items = [['Inicio', 'go', 0], ['Tienda', 'href', './#/tienda'], ['Colecciones', 'go', idx('Colecciones')], ['El proceso', 'go', idx('Proceso')], ['Nuestra historia', 'go', idx('Historia')], ['Amanda', 'go', idx('Amanda')], ['Crea tu pieza', 'href', './#/personalizar'], ['Instagram', 'go', idx('Instagram')], ['Contacto', 'go', idx('Contacto')]];
  $('#pmenuNav').innerHTML = items.map((it, i) => it[1] === 'href' ? `<a style="--i:${i}" href="${it[2]}">${it[0]}</a>` : `<button style="--i:${i}" type="button" data-go="${it[2]}">${it[0]}</button>`).join('');
  function setMenu(open) { menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', String(!open)); $('#phMenu').setAttribute('aria-expanded', String(open)); ph.classList.toggle('dark', open || secs[cur].tone === 'dark'); ph.classList.toggle('light', !open && secs[cur].tone === 'light'); }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('#phMenu')) { setMenu(!menu.classList.contains('open')); return; }
    const g = t.closest('[data-go]');
    if (g) { e.preventDefault(); if (menu.classList.contains('open')) setMenu(false); goTo(+g.dataset.go); return; }
    const gn = t.closest('[data-go-name]'); if (gn) { e.preventDefault(); goTo(idx(gn.dataset.goName)); return; }
    const c = t.closest('[data-car]');
    if (c) { const car = c.closest('.ps').querySelector('.car'); const w = (car.firstElementChild ? car.firstElementChild.getBoundingClientRect().width : 300) + 24; car.scrollBy({ left: w * 2 * +c.dataset.car, behavior: 'smooth' }); return; }
    if (menu.classList.contains('open') && t.closest('#pmenu a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); if (e.key === 'PageDown') { e.preventDefault(); goTo(cur + 1); } if (e.key === 'PageUp') { e.preventDefault(); goTo(cur - 1); } });

  // vídeos de Instagram: se reproducen al pasar el ratón
  $$('video[data-hp]', snap).forEach((v) => { v.addEventListener('mouseenter', () => v.play().catch(() => {})); v.addEventListener('mouseleave', () => v.pause()); });

  // cesta
  try { const c = JSON.parse(localStorage.getItem('af_cart') || '[]'); $('#phCart').textContent = '(' + c.reduce((s, l) => s + (l.qty || 0), 0) + ')'; } catch (e) { /* noop */ }
})();
