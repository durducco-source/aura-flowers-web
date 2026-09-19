/* ==========================================================
   EDITOR DE LA WEB · Aura Flowers
   Edita contactos, productos, fotos y opiniones desde el navegador.
   Al publicar, guarda content.json (y las fotos nuevas) en el repositorio
   de GitHub; GitHub Pages actualiza la web en 1–2 minutos.
   El token de GitHub solo se guarda en este navegador.
   ========================================================== */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const FL = SV_ART.FL;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const base = Object.fromEntries(SV.products.map((p) => [p.id, p]));
  const ls = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* noop */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* noop */ } }
  };

  let content = { config: {}, products: {}, added: [], reviews: null, photos: {} };
  const uploads = {};      // ruta -> dataURL (fotos nuevas aún no subidas)
  const uploaded = {};     // rutas ya subidas
  let dirty = false, tab = 'datos', busy = false;

  const guessRepo = () => { const h = location.hostname; return h.endsWith('.github.io') ? h.split('.')[0] + '/' + (location.pathname.split('/')[1] || '') : 'durducco-source/aura-flowers-web'; };
  let repo = ls.get('af_repo', guessRepo());
  let token = ls.get('af_token', '') || (function () { try { return sessionStorage.getItem('af_token_s') || ''; } catch (e) { return ''; } })();

  let toastT;
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3200); }
  function touch() { dirty = true; $('#dirtyMsg').hidden = false; }
  const cfg = (k) => (content.config[k] !== undefined ? content.config[k] : SV[k]);
  const promo = () => Object.assign({}, SV.promo, content.config.promo || {});
  const prev = (path) => uploads[path] || path;
  const isAdded = (id) => content.added.some((a) => a.id === id);
  const allProducts = () => SV.products.map((p) => Object.assign({}, p, content.products[p.id] || {})).concat(content.added);
  function setField(id, f, v) {
    const a = content.added.find((x) => x.id === id);
    if (a) a[f] = v; else (content.products[id] = content.products[id] || {})[f] = v;
    touch();
  }

  /* ── imágenes ── */
  function fileToJpeg(file, max) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          const s = Math.min(1, (max || 1600) / Math.max(im.width, im.height));
          const c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          res(c.toDataURL('image/jpeg', 0.86));
        };
        im.onerror = () => rej(new Error('img')); im.src = r.result;
      };
      r.onerror = () => rej(new Error('read')); r.readAsDataURL(file);
    });
  }
  async function addImages(files, max) {
    const paths = [];
    for (const f of files) {
      try {
        const d = await fileToJpeg(f, max);
        const p = 'assets/uploads/' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6) + '.jpg';
        uploads[p] = d; paths.push(p);
      } catch (e) { toast('No pude leer «' + f.name + '». Usa fotos JPG o PNG.'); }
    }
    return paths;
  }

  /* ── vistas ── */
  const TABS = [['datos', 'Datos y contacto'], ['productos', 'Productos'], ['fotos', 'Portada y retrato'], ['opiniones', 'Opiniones'], ['publicar', 'Publicar']];
  function renderTabs() {
    $('#tabs').innerHTML = TABS.map((t) => `<button type="button" data-tab="${t[0]}" class="${tab === t[0] ? 'on' : ''}">${t[1]}</button>`).join('');
  }
  const inp = (label, key, val, extra) => `<div class="field"><label>${label}</label><input data-cfg="${key}" value="${esc(val)}" ${extra || ''}></div>`;

  function viewDatos() {
    const pr = promo();
    return `<div class="ad-card"><h2>Datos y contacto</h2><p class="hint">Lo que pongas aquí aparece en la web. Si dejas el email o el WhatsApp vacíos, simplemente no se muestran.</p>
<div class="ad-grid">${inp('Nombre de la creadora', 'creator', cfg('creator'))}${inp('Ciudad del taller', 'city', cfg('city'))}
${inp('Usuario de Instagram (sin @)', 'instagram', cfg('instagram'))}${inp('Email de contacto', 'email', cfg('email'), 'type="email" placeholder="hola@…"')}
${inp('WhatsApp (con prefijo, sin +)', 'whatsapp', cfg('whatsapp'), 'inputmode="numeric" placeholder="34600123456"')}${inp('Envío gratis a partir de (€, España)', 'freeShippingFrom', cfg('freeShippingFrom'), 'inputmode="decimal"')}
${inp('Código de descuento', 'promo.code', pr.code)}${inp('Descuento del código (%)', 'promo.pct', pr.pct, 'inputmode="decimal"')}</div>
<div class="field"><label>Dirección del formulario (Formspree u otro) — para recibir pedidos y mensajes</label><input data-cfg="formEndpoint" value="${esc(cfg('formEndpoint'))}" placeholder="https://formspree.io/f/xxxxxxx"></div>
<p class="hint">Sin dirección de formulario, la clienta copia su pedido y te lo envía por Instagram o WhatsApp. Puedes crear una gratis en formspree.io.</p></div>`;
  }

  function photosBlock(p) {
    const list = (p.images || []);
    return `<div class="photos">${list.map((src, i) => `<div class="photo"><img src="${esc(prev(src))}" alt="">${i === 0 ? '<em>Principal</em>' : ''}<button type="button" data-rmphoto="${i}" aria-label="Quitar foto">×</button></div>`).join('')}
<label class="add-photo"><input type="file" accept="image/*" multiple data-addphoto><span>+ Añadir<br>fotos</span></label></div>
${list.length > 1 ? '<p class="hint" style="margin:0">La primera foto es la principal. Toca «Hacer principal» en otra si quieres cambiarla.</p><div class="row-actions">' + list.map((_, i) => (i ? `<button type="button" class="link-btn" data-firstphoto="${i}">Hacer principal la foto ${i + 1}</button>` : '')).join('') + '</div>' : ''}`;
  }

  function viewProductos() {
    const list = allProducts();
    return `<div class="ad-card"><h2>Productos</h2><p class="hint">Toca un producto para editarlo. Los nombres y precios actuales son provisionales: cámbialos por los reales.</p>
${list.map((p) => {
      const added = isAdded(p.id), st = p.stock;
      const th = (p.images && p.images[0]) ? prev(p.images[0]) : '';
      const hid = (content.products[p.id] || {}).hidden;
      return `<details class="pcard" data-pid="${esc(p.id)}"><summary>${th ? `<img class="th" src="${esc(th)}" alt="">` : '<span class="th"></span>'}<div><div class="nm">${esc(p.name)}</div><div class="sm">${esc((SV.categories.find((c) => c.id === p.cat) || {}).name || '')} · ${p.price} €</div></div>
<div class="tags">${hid ? '<span class="tag grey">Oculto</span>' : ''}${added ? '<span class="tag">Nuevo</span>' : ''}${st <= 0 ? '<span class="tag red">Agotado</span>' : ''}</div></summary>
<div class="pbody"><div class="ad-grid">
<div class="field"><label>Nombre</label><input data-pf="name" value="${esc(p.name)}"></div>
<div class="field"><label>Categoría</label><select data-pf="cat">${SV.categories.map((c) => `<option value="${c.id}" ${p.cat === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
<div class="field"><label>Precio (€)</label><input data-pf="price" data-num inputmode="decimal" value="${esc(p.price)}"></div>
<div class="field"><label>Unidades disponibles (0 = agotado)</label><input data-pf="stock" data-num inputmode="numeric" value="${esc(p.stock)}"></div>
<div class="field"><label>Etiqueta (opcional)</label><input data-pf="badge" value="${esc(p.badge || '')}" placeholder="Novedad, Pieza única…"></div>
<div class="field"><label>Tipo de venta</label><select data-pf="avail"><option value="" ${!p.avail ? 'selected' : ''}>Pieza lista para enviar</option><option value="made" ${p.avail === 'made' ? 'selected' : ''}>Bajo pedido</option><option value="custom" ${p.avail === 'custom' ? 'selected' : ''}>A medida (se pide por formulario)</option></select></div></div>
<label class="consent"><input type="checkbox" data-pf="priceFrom" data-bool ${p.priceFrom ? 'checked' : ''}> Mostrar el precio como «desde»</label>
<div class="field"><label>Descripción corta (aparece en la tienda)</label><input data-pf="short" value="${esc(p.short || '')}"></div>
<div class="field"><label>Descripción completa</label><textarea data-pf="desc">${esc(p.desc || '')}</textarea></div>
<div class="field"><span class="lbl">Flores de la pieza</span><div class="chips small">${Object.keys(FL).map((k) => `<label class="chip"><input type="checkbox" data-flower="${k}" ${(p.flowers || []).includes(k) ? 'checked' : ''}><span>${FL[k].label}</span></label>`).join('')}</div></div>
<div class="field"><span class="lbl">Fotos</span>${photosBlock(p)}</div>
<div class="row-actions"><a class="link-btn" href="./#/producto/${esc(p.id)}" target="_blank" rel="noopener">Ver en la web</a>
${added ? '<button type="button" class="link-btn danger" data-delprod>Eliminar producto</button>' : `<label class="consent" style="margin:0"><input type="checkbox" data-pf="hidden" data-bool ${hid ? 'checked' : ''}> Ocultar en la web</label>`}</div></div></details>`;
    }).join('')}
<div class="row-actions"><button class="btn btn-ghost btn-sm" type="button" data-addprod>+ Añadir producto</button></div></div>`;
  }

  function slot(key, title, hint, current) {
    const src = content.photos[key] || SV.photos[key];
    return `<div class="slot" data-slot="${key}">${src ? `<img src="${esc(prev(src))}" alt="">` : '<div class="ph-empty">Ilustración de ejemplo</div>'}
<div><b>${title}</b><p class="hint" style="margin:4px 0 12px">${hint}</p><div class="row-actions" style="margin:0"><label class="btn btn-ghost btn-sm" style="cursor:pointer">Subir foto<input type="file" accept="image/*" data-slotfile style="display:none"></label>${content.photos[key] ? '<button class="link-btn" type="button" data-slotclear>Quitar y volver a la anterior</button>' : ''}</div></div></div>`;
  }
  function viewFotos() {
    return `<div class="ad-card"><h2>Portada y retrato</h2><p class="hint">Sube fotos de alta calidad. Se ajustan solas al tamaño de la web.</p>
${slot('hero', 'Portada (ordenador)', 'Foto horizontal grande: una joya sobre un fondo claro. Deja libre el lado izquierdo, donde va el texto.')}
${slot('heroMobile', 'Portada (móvil)', 'Foto vertical (2:3). Si no subes ninguna se usa la ilustración.')}
${slot('creator', 'Retrato de la creadora', 'Foto vertical (4:5) en su taller o con sus piezas.')}</div>`;
  }

  function reviews() { if (!content.reviews) content.reviews = SV.reviews.slice(); return content.reviews; }
  function viewOpiniones() {
    const list = content.reviews || SV.reviews;
    return `<div class="ad-card"><h2>Opiniones de clientas</h2><p class="hint">Añade solo opiniones <b>reales</b> de clientas (con su permiso). Mientras no haya ninguna, la sección no se muestra en la web.</p>
${list.map((r, i) => `<div class="pcard" style="padding:16px 18px" data-ri="${i}"><div class="ad-grid">
<div class="field"><label>Nombre</label><input data-rv="name" value="${esc(r.name)}"></div><div class="field"><label>Ciudad</label><input data-rv="city" value="${esc(r.city)}"></div>
<div class="field"><label>Pieza</label><select data-rv="product">${allProducts().map((p) => `<option value="${esc(p.id)}" ${r.product === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></div>
<div class="field"><label>Estrellas</label><select data-rv="stars">${[5, 4, 3].map((n) => `<option value="${n}" ${+r.stars === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>
<div class="field"><label>Opinión</label><textarea data-rv="text">${esc(r.text)}</textarea></div><button class="link-btn danger" type="button" data-delreview>Eliminar opinión</button></div>`).join('') || '<p class="hint">Todavía no hay opiniones.</p>'}
<div class="row-actions"><button class="btn btn-ghost btn-sm" type="button" data-addreview>+ Añadir opinión</button></div></div>`;
  }

  function changeSummary() {
    const np = Object.keys(content.products).length, na = content.added.length, nu = Object.keys(uploads).length;
    return `Cambios en ${np} producto(s) · ${na} producto(s) nuevo(s) · ${nu} foto(s) nueva(s)`;
  }
  function viewPublicar() {
    return `<div class="ad-card"><h2>Publicar los cambios</h2><p class="hint">${changeSummary()}. Al publicar, la web se actualiza sola en 1–2 minutos.</p>
<ol class="ad-steps"><li>Necesitas un «token» de GitHub (una contraseña especial solo para este editor). Se crea una vez: <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">crear token</a>.</li>
<li>Ponle un nombre (p. ej. «Editor Aura Flowers»), caducidad de 1 año y, en <i>Repository access</i>, elige <b>Only select repositories</b> → el repositorio de la web.</li>
<li>En <i>Repository permissions</i> → <b>Contents</b> → <b>Read and write</b>. Pulsa <i>Generate token</i> y copia el código.</li>
<li>Pégalo aquí abajo y pulsa <b>Publicar</b>.</li></ol>
<div class="ad-grid"><div class="field"><label>Repositorio</label><input id="repoIn" value="${esc(repo)}"></div>
<div class="field"><label>Token de GitHub</label><input id="tokIn" type="password" autocomplete="off" value="${esc(token)}" placeholder="github_pat_…"></div></div>
<label class="consent"><input type="checkbox" id="remTok" ${ls.get('af_token', '') ? 'checked' : ''}> Recordar el token en este dispositivo (no lo hagas en un ordenador compartido)</label>
<button class="btn btn-primary" id="doPublish" type="button" ${busy ? 'disabled' : ''}>Publicar cambios</button>
<div class="ad-log" id="log" hidden></div></div>`;
  }

  function render() {
    renderTabs();
    $('#panel').innerHTML = { datos: viewDatos, productos: viewProductos, fotos: viewFotos, opiniones: viewOpiniones, publicar: viewPublicar }[tab]();
  }

  /* ── publicar ── */
  const b64 = (s) => btoa(unescape(encodeURIComponent(s)));
  async function gh(path, opts) {
    return fetch('https://api.github.com/repos/' + repo + path, Object.assign({}, opts, {
      headers: Object.assign({ Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + token, 'X-GitHub-Api-Version': '2022-11-28' }, (opts && opts.headers) || {})
    }));
  }
  async function putFile(path, contentB64, message) {
    let sha;
    const cur = await gh('/contents/' + path + '?ref=main');
    if (cur.ok) sha = (await cur.json()).sha;
    const body = { message, content: contentB64, branch: 'main' }; if (sha) body.sha = sha;
    const r = await gh('/contents/' + path, { method: 'PUT', body: JSON.stringify(body) });
    if (!r.ok) { let m = r.status; try { m = (await r.json()).message; } catch (e) { /* noop */ } throw new Error(m); }
  }
  function usedUploads() {
    const used = new Set();
    Object.values(content.products).forEach((p) => (p.images || []).forEach((s) => used.add(s)));
    content.added.forEach((p) => (p.images || []).forEach((s) => used.add(s)));
    Object.values(content.photos).forEach((s) => s && used.add(s));
    return Array.from(used).filter((s) => uploads[s] && !uploaded[s]);
  }
  function log(msg, cls) { const l = $('#log'); if (!l) return; l.hidden = false; l.className = 'ad-log ' + (cls || ''); l.textContent = msg; }
  async function publish() {
    if (busy) return;
    repo = ($('#repoIn').value || '').trim(); token = ($('#tokIn').value || '').trim();
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return log('El repositorio debe tener el formato usuario/nombre.', 'bad');
    if (!token) return log('Pega tu token de GitHub (paso 1–3).', 'bad');
    ls.set('af_repo', repo);
    if ($('#remTok').checked) ls.set('af_token', token); else { ls.del('af_token'); try { sessionStorage.setItem('af_token_s', token); } catch (e) { /* noop */ } }
    busy = true; $('#doPublish').disabled = true;
    try {
      log('Comprobando el acceso a GitHub…');
      const me = await gh('', {});
      if (me.status === 401) throw new Error('El token no es válido o ha caducado.');
      if (!me.ok) throw new Error('No encuentro el repositorio «' + repo + '» con ese token (' + me.status + ').');
      const info = await me.json();
      if (info.permissions && !info.permissions.push) throw new Error('Ese token no tiene permiso de escritura. Revisa «Contents: Read and write».');
      const ups = usedUploads();
      for (let i = 0; i < ups.length; i++) {
        log('Subiendo fotos… (' + (i + 1) + ' de ' + ups.length + ')');
        await putFile(ups[i], uploads[ups[i]].split(',')[1], 'Nueva foto desde el editor');
        uploaded[ups[i]] = true;
      }
      log('Guardando los cambios…');
      const out = JSON.parse(JSON.stringify(content));
      await putFile('content.json', b64(JSON.stringify(out, null, 2) + '\n'), 'Actualizar contenido desde el editor');
      dirty = false; $('#dirtyMsg').hidden = true;
      log('✓ Publicado. La web se actualizará en 1–2 minutos.\nRecarga la web (Ctrl+F5) pasado ese tiempo para ver los cambios.', 'ok');
    } catch (e) {
      log('No se pudo publicar: ' + (e.message || e) + '\nNo se ha perdido nada: puedes volver a intentarlo.', 'bad');
    } finally { busy = false; const b = $('#doPublish'); if (b) b.disabled = false; }
  }

  /* ── eventos ── */
  document.addEventListener('click', async (e) => {
    const t = e.target;
    const tb = t.closest('[data-tab]'); if (tb) { tab = tb.dataset.tab; render(); window.scrollTo(0, 0); return; }
    if (t.closest('#goPublish')) { tab = 'publicar'; render(); window.scrollTo(0, 0); return; }
    if (t.id === 'doPublish') { publish(); return; }
    const card = t.closest('[data-pid]');
    if (card) {
      const id = card.dataset.pid, p = allProducts().find((x) => x.id === id);
      const rm = t.closest('[data-rmphoto]'); if (rm) { setField(id, 'images', p.images.filter((_, i) => i !== +rm.dataset.rmphoto)); const open = card.open; render(); const c = $(`[data-pid="${id}"]`); if (c) c.open = open; return; }
      const fp = t.closest('[data-firstphoto]'); if (fp) { const i = +fp.dataset.firstphoto; const im = p.images.slice(); im.unshift(im.splice(i, 1)[0]); setField(id, 'images', im); render(); $(`[data-pid="${id}"]`).open = true; return; }
      if (t.closest('[data-delprod]')) { if (confirm('¿Eliminar este producto de la web?')) { content.added = content.added.filter((a) => a.id !== id); touch(); render(); } return; }
    }
    if (t.closest('[data-addprod]')) {
      const id = 'pieza-' + Date.now().toString(36);
      content.added.push({ id, name: 'Nueva pieza', cat: 'collares', price: 30, stock: 1, badge: 'Novedad', flowers: [], images: [], short: '', desc: '', details: {}, art: { seed: 50 + content.added.length } });
      touch(); render(); const c = $(`[data-pid="${id}"]`); if (c) { c.open = true; c.scrollIntoView({ block: 'center' }); } return;
    }
    if (t.closest('[data-addreview]')) { reviews().push({ name: '', city: '', product: allProducts()[0].id, stars: 5, text: '' }); touch(); render(); return; }
    const dr = t.closest('[data-delreview]'); if (dr) { const i = +dr.closest('[data-ri]').dataset.ri; reviews().splice(i, 1); touch(); render(); return; }
    if (t.closest('[data-slotclear]')) { const k = t.closest('[data-slot]').dataset.slot; delete content.photos[k]; touch(); render(); return; }
  });

  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.cfg) {
      const k = t.dataset.cfg; let v = t.value.trim();
      if (k === 'freeShippingFrom') v = v === '' ? 0 : Number(v.replace(',', '.')) || 0;
      if (k.startsWith('promo.')) { const f = k.split('.')[1]; content.config.promo = Object.assign({}, promo(), { [f]: f === 'pct' ? Number(v.replace(',', '.')) || 0 : v.toUpperCase() }); }
      else content.config[k] = k === 'instagram' ? v.replace(/^@/, '') : v;
      touch(); return;
    }
    const card = t.closest('[data-pid]');
    if (card && t.dataset.pf && t.type !== 'checkbox') {
      let v = t.value; if (t.hasAttribute('data-num')) v = Number(String(v).replace(',', '.')) || 0;
      setField(card.dataset.pid, t.dataset.pf, v); return;
    }
    const rv = t.closest('[data-ri]');
    if (rv && t.dataset.rv) { reviews()[+rv.dataset.ri][t.dataset.rv] = t.dataset.rv === 'stars' ? +t.value : t.value; touch(); }
  });

  document.addEventListener('change', async (e) => {
    const t = e.target;
    const card = t.closest('[data-pid]');
    if (card) {
      const id = card.dataset.pid;
      if (t.dataset.pf && t.tagName === 'SELECT') { setField(id, t.dataset.pf, t.value); return; }
      if (t.dataset.pf && t.hasAttribute('data-bool')) { setField(id, t.dataset.pf, t.checked); return; }
      if (t.dataset.flower) { const p = allProducts().find((x) => x.id === id); const s = new Set(p.flowers || []); t.checked ? s.add(t.dataset.flower) : s.delete(t.dataset.flower); setField(id, 'flowers', Object.keys(FL).filter((k) => s.has(k))); return; }
      if (t.hasAttribute('data-addphoto') && t.files.length) {
        const p = allProducts().find((x) => x.id === id); toast('Preparando fotos…');
        const paths = await addImages(t.files, 1600); setField(id, 'images', (p.images || []).concat(paths));
        render(); const c = $(`[data-pid="${id}"]`); if (c) c.open = true; return;
      }
    }
    if (t.hasAttribute('data-slotfile') && t.files.length) {
      const k = t.closest('[data-slot]').dataset.slot; toast('Preparando foto…');
      const [p] = await addImages(t.files, 2000); if (p) { content.photos[k] = p; touch(); render(); } return;
    }
    if (t.dataset.rv) { const rv = t.closest('[data-ri]'); reviews()[+rv.dataset.ri][t.dataset.rv] = t.dataset.rv === 'stars' ? +t.value : t.value; touch(); }
  });

  window.addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ── arranque: parte de lo último publicado ── */
  (async function () {
    try {
      const r = await fetch('content.json?v=' + Date.now());
      if (r.ok) { const c = await r.json(); content = Object.assign(content, c); content.config = content.config || {}; content.products = content.products || {}; content.added = content.added || []; content.photos = content.photos || {}; }
    } catch (e) { /* primera vez */ }
    render();
  })();
})();
