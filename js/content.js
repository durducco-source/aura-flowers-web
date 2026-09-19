/* ==========================================================
   Aplica sobre la web los cambios hechos desde el editor (admin.html).
   Lee content.json (lo escribe el editor) y lo mezcla con los datos base.
   ========================================================== */
(function () {
  var c;
  try {
    var x = new XMLHttpRequest();
    x.open('GET', 'content.json?v=' + Date.now(), false);
    x.send();
    if (x.status !== 200) return;
    c = JSON.parse(x.responseText);
  } catch (e) { return; }
  if (!c || typeof c !== 'object') return;

  var cfg = c.config || {};
  Object.keys(cfg).forEach(function (k) {
    if (cfg[k] === undefined || cfg[k] === null) return;
    if (k === 'promo' && typeof cfg[k] === 'object') SV.promo = Object.assign({}, SV.promo, cfg[k]);
    else SV[k] = cfg[k];
  });

  var ph = c.photos || {};
  ['hero', 'heroMobile', 'creator'].forEach(function (k) { if (ph[k]) SV.photos[k] = ph[k]; });

  var edits = c.products || {};
  SV.products.forEach(function (p) { if (edits[p.id]) Object.assign(p, edits[p.id]); });
  (c.added || []).forEach(function (n, i) {
    SV.products.push(Object.assign({ no: 100 + i, cat: 'collares', price: 0, stock: 1, flowers: [], images: [], details: {}, short: '', desc: '', art: { seed: 40 + i } }, n));
  });
  SV.products = SV.products.filter(function (p) { return !p.hidden; });

  if (Array.isArray(c.reviews)) SV.reviews = c.reviews;
})();
