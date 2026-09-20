/* ==========================================================
   SIEMPREVIVA · Motor de imágenes de ejemplo
   Genera "fotografías" de joyas de resina con flores reales
   como SVG (data-URI). Sustituibles por fotos propias vía
   config.js (photos) o product.images.
   ========================================================== */
(function () {
  'use strict';
  const A = (window.SV_ART = {});
  let UID = 0;
  const uid = () => 'i' + ++UID;
  const r2 = (n) => Math.round(n * 100) / 100;
  const TAU = Math.PI * 2;

  function rng(seed) {
    let s = (Math.imul(seed | 0, 2654435761) ^ 0x9e3779b9) >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  const rr = (rnd, a, b) => a + (b - a) * rnd();

  /* ---------------- catálogo de flores ---------------- */
  const FL = {
    orquidea:    { label: 'Orquídea',    kind: 'bloom', meaning: 'Belleza única y elegancia', latin: 'Phalaenopsis / Cattleya' },
    margarita:   { label: 'Margarita',   kind: 'bloom', meaning: 'Inocencia y nuevos comienzos', latin: 'Leucanthemum vulgare' },
    nomeolvides: { label: 'Nomeolvides', kind: 'bloom', meaning: 'Recuerdo eterno',              latin: 'Myosotis sylvatica' },
    rosa:        { label: 'Rosa',        kind: 'bloom', meaning: 'Amor y gratitud',              latin: 'Rosa × damascena' },
    hortensia:   { label: 'Hortensia',   kind: 'bloom', meaning: 'Gratitud y abundancia',        latin: 'Hydrangea macrophylla' },
    calendula:   { label: 'Caléndula',   kind: 'bloom', meaning: 'Calidez y alegría',            latin: 'Calendula officinalis' },
    lavanda:     { label: 'Lavanda',     kind: 'sprig', meaning: 'Calma y serenidad',            latin: 'Lavandula angustifolia' },
    gipsofila:   { label: 'Gipsófila',   kind: 'sprig', meaning: 'Amor puro y ternura',          latin: 'Gypsophila paniculata' },
    helecho:     { label: 'Helecho',     kind: 'sprig', meaning: 'Protección y refugio',         latin: 'Nephrolepis exaltata' },
    eucalipto:   { label: 'Eucalipto',   kind: 'sprig', meaning: 'Renovación',                   latin: 'Eucalyptus cinerea' }
  };
  A.FL = FL;

  const petal = (len, w, base) =>
    `M0,${-base}C${w},${-base - len * 0.22} ${w * 0.9},${-len * 0.82} 0,${-len}C${-w * 0.9},${-len * 0.82} ${-w},${-base - len * 0.22} 0,${-base}Z`;

  /* ---------------- dibujo de flores (espacio unitario) ---------------- */
  const DR = {
    orquidea() {
      let s = '';
      s += `<ellipse cx="0" cy="-.6" rx=".26" ry=".42" fill="#EEDFF2" stroke="#B48ACB" stroke-width=".02"/>`;
      s += `<ellipse cx="-.3" cy=".44" rx=".26" ry=".42" transform="rotate(-32 -.3 .44)" fill="#EBD9F0" stroke="#B48ACB" stroke-width=".02"/>`;
      s += `<ellipse cx=".3" cy=".44" rx=".26" ry=".42" transform="rotate(32 .3 .44)" fill="#EBD9F0" stroke="#B48ACB" stroke-width=".02"/>`;
      s += `<ellipse cx="-.52" cy="-.08" rx=".5" ry=".4" transform="rotate(-10 -.52 -.08)" fill="#F4E9F7" stroke="#B48ACB" stroke-width=".02"/>`;
      s += `<ellipse cx=".52" cy="-.08" rx=".5" ry=".4" transform="rotate(10 .52 -.08)" fill="#F4E9F7" stroke="#B48ACB" stroke-width=".02"/>`;
      s += `<path d="M-.5,-.22C-.3,-.05 -.28,.02 -.36,.1M.5,-.22C.3,-.05 .28,.02 .36,.1" stroke="#C4A0D6" stroke-width=".02" fill="none"/>`;
      s += `<path d="M0,.02C-.2,.08 -.24,.32 -.1,.52C-.04,.6 .04,.6 .1,.52C.24,.32 .2,.08 0,.02Z" fill="#C2308A" stroke="#8F1F62" stroke-width=".02"/>`;
      s += `<ellipse cx="0" cy="-.02" rx=".11" ry=".14" fill="#F3E3A0" stroke="#D3B96A" stroke-width=".015"/><circle cx="0" cy="-.05" r=".05" fill="#fff"/>`;
      return s;
    },
    margarita() {
      let s = ''; const n = 14;
      for (let i = 0; i < n; i++) s += `<path d="${petal(1, 0.17, 0.1)}" transform="rotate(${r2((i + 0.5) * 360 / n)})" fill="#F1EBDA" stroke="#D6CCB5" stroke-width=".016"/>`;
      for (let i = 0; i < n; i++) s += `<path d="${petal(0.95, 0.17, 0.1)}" transform="rotate(${r2(i * 360 / n)})" fill="#FFFEFA" stroke="#DDD4C0" stroke-width=".016"/><path d="M0,-.2L0,-.78" stroke="#E6DECB" stroke-width=".012" transform="rotate(${r2(i * 360 / n)})"/>`;
      s += `<circle r=".26" fill="#BE8425"/><circle r=".22" fill="#E6B341"/><circle cx="-.06" cy="-.07" r=".09" fill="#F6D989" opacity=".8"/>`;
      for (let i = 0; i < 7; i++) s += `<circle cx="${r2(Math.cos(i * 0.9) * 0.12)}" cy="${r2(Math.sin(i * 0.9) * 0.12)}" r=".018" fill="#A9701B"/>`;
      return s;
    },
    nomeolvides() {
      let s = '';
      for (let i = 0; i < 5; i++) {
        const a = (i * 72 - 90) * Math.PI / 180;
        s += `<circle cx="${r2(Math.cos(a) * 0.5)}" cy="${r2(Math.sin(a) * 0.5)}" r=".42" fill="#A4BCEB" stroke="#7E98CF" stroke-width=".02"/>`;
        s += `<circle cx="${r2(Math.cos(a) * 0.55)}" cy="${r2(Math.sin(a) * 0.55)}" r=".2" fill="#B9CDF3" opacity=".7"/>`;
      }
      s += `<circle r=".2" fill="#FBFAF2" stroke="#D9DFEE" stroke-width=".02"/><circle r=".1" fill="#F0CB55"/><circle cx="-.03" cy="-.03" r=".035" fill="#FBE9A0"/>`;
      return s;
    },
    rosa() {
      let s = '';
      for (let i = 0; i < 6; i++) { const a = i * 60 * Math.PI / 180; s += `<circle cx="${r2(Math.cos(a) * 0.52)}" cy="${r2(Math.sin(a) * 0.52)}" r=".46" fill="#EBC1BC" stroke="#CE8E92" stroke-width=".025"/>`; }
      for (let i = 0; i < 5; i++) { const a = (i * 72 + 25) * Math.PI / 180; s += `<circle cx="${r2(Math.cos(a) * 0.3)}" cy="${r2(Math.sin(a) * 0.3)}" r=".38" fill="#E3A5A8" stroke="#C4767E" stroke-width=".025"/>`; }
      s += `<circle r=".34" fill="#D68A92" stroke="#B86068" stroke-width=".025"/><circle r=".2" fill="#C4737C"/>`;
      s += `<path d="M-.02,-.02 m-.09,0 a.09,.09 0 1 1 .18,0 a.17,.17 0 1 1 -.34,0 a.26,.26 0 1 1 .52,0" fill="none" stroke="#A54F5A" stroke-width=".03" stroke-linecap="round"/>`;
      s += `<path d="M-.5,-.3 A.6,.6 0 0 1 .05,-.6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".04" stroke-linecap="round"/>`;
      return s;
    },
    hortensia() {
      const pos = [[0, 0], [0.52, 0.05], [-0.5, -0.04], [0.27, 0.48], [-0.28, 0.46], [0.26, -0.47], [-0.26, -0.48], [0.78, -0.33], [-0.78, 0.3]];
      const col = [['#B7C7F0', '#9DB0E2'], ['#D9BEE8', '#BF9BD6'], ['#C3D0F2', '#A7B7E6']];
      let s = '';
      pos.forEach((p, i) => {
        const c = col[i % 3];
        s += `<g transform="translate(${p[0]} ${p[1]}) rotate(${i * 23}) scale(.3)">`;
        for (let k = 0; k < 4; k++) s += `<ellipse cx="0" cy="-.55" rx=".5" ry=".62" transform="rotate(${k * 90})" fill="${c[0]}" stroke="${c[1]}" stroke-width=".07"/>`;
        s += `<circle r=".16" fill="#EEE9C3"/></g>`;
      });
      return s;
    },
    calendula() {
      let s = ''; const n = 22;
      for (let i = 0; i < n; i++) s += `<path d="${petal(1, 0.12, 0.1)}" transform="rotate(${r2((i + 0.5) * 360 / n)})" fill="#F0A034" stroke="#D0741A" stroke-width=".016"/>`;
      for (let i = 0; i < n; i++) s += `<path d="${petal(0.78, 0.13, 0.08)}" transform="rotate(${r2(i * 360 / n)})" fill="#F7B54D" stroke="#DB8524" stroke-width=".014"/>`;
      for (let i = 0; i < 14; i++) s += `<path d="${petal(0.5, 0.1, 0.05)}" transform="rotate(${r2(i * 360 / 14)})" fill="#FAC96A" stroke="#E29A34" stroke-width=".012"/>`;
      s += `<circle r=".2" fill="#8A4E1D"/><circle r=".13" fill="#6E3A12"/>`;
      return s;
    },
    lavanda() {
      let s = `<path d="M0,1C.05,.4 -.04,-.3 0,-1" stroke="#7D8E6B" stroke-width=".05" fill="none" stroke-linecap="round"/>`;
      const n = 8;
      for (let i = 0; i < n; i++) {
        const y = 0.1 - i * 0.135;
        const sc = 0.85 + 0.15 * Math.sin(i / n * Math.PI);
        const col = i % 2 ? '#8E79B9' : '#A48FCB';
        s += `<ellipse cx="-.075" cy="${r2(y)}" rx="${r2(0.075 * sc)}" ry="${r2(0.125 * sc)}" transform="rotate(-32 -.075 ${r2(y)})" fill="${col}" stroke="#6F5B9B" stroke-width=".012"/>`;
        s += `<ellipse cx=".075" cy="${r2(y - 0.03)}" rx="${r2(0.075 * sc)}" ry="${r2(0.125 * sc)}" transform="rotate(32 .075 ${r2(y - 0.03)})" fill="${i % 2 ? '#A48FCB' : '#8E79B9'}" stroke="#6F5B9B" stroke-width=".012"/>`;
      }
      s += `<ellipse cx="0" cy="-.98" rx=".06" ry=".11" fill="#9A85C4" stroke="#6F5B9B" stroke-width=".012"/>`;
      return s;
    },
    gipsofila(rnd) {
      rnd = rnd || rng(5);
      let s = '';
      const ends = [-0.85, -0.5, -0.16, 0.18, 0.52, 0.86];
      ends.forEach((x, i) => {
        const y = -0.85 + Math.abs(x) * 0.45 + rnd() * 0.18;
        s += `<path d="M0,1Q${r2(x * 0.25)},.15 ${x},${r2(y)}" stroke="#9FB08E" stroke-width=".022" fill="none"/>`;
        const mx = x * 0.62, my = y + (1 - y) * 0.38;
        s += `<path d="M${r2(mx)},${r2(my)}l${x > 0 ? 0.2 : -0.2},-.16" stroke="#9FB08E" stroke-width=".018" fill="none"/>`;
        const dots = [[x, y, 0.105], [x + (x > 0 ? 0.2 : -0.2) * 1.0 + mx - x + x * 0 , my - 0.16, 0.08], [x * 0.9, y + 0.16, 0.075]];
        dots.forEach((d) => {
          s += `<circle cx="${r2(d[0])}" cy="${r2(d[1])}" r="${d[2]}" fill="#FFFFFF" stroke="#D9D3C0" stroke-width=".014"/><circle cx="${r2(d[0])}" cy="${r2(d[1])}" r="${r2(d[2] * 0.3)}" fill="#EFE6B8"/>`;
        });
      });
      return s;
    },
    helecho() {
      let s = `<path d="M0,1C.07,.4 -.05,-.4 0,-1" stroke="#6F8858" stroke-width=".035" fill="none" stroke-linecap="round"/>`;
      for (let k = 0; k < 9; k++) {
        const y = 0.85 - k * 0.19, len = 0.62 * (1 - k * 0.085);
        s += `<path d="${petal(len, 0.11, 0)}" transform="translate(0 ${r2(y)}) rotate(64)" fill="#84A06B" stroke="#65814F" stroke-width=".012"/>`;
        s += `<path d="${petal(len, 0.11, 0)}" transform="translate(0 ${r2(y - 0.06)}) rotate(-64)" fill="#7A9862" stroke="#65814F" stroke-width=".012"/>`;
      }
      s += `<path d="${petal(0.32, 0.07, 0)}" transform="translate(0 -.93)" fill="#84A06B" stroke="#65814F" stroke-width=".012"/>`;
      return s;
    },
    eucalipto() {
      let s = `<path d="M0,1C.1,.3 -.1,-.4 0,-1" stroke="#8B7F63" stroke-width=".035" fill="none" stroke-linecap="round"/>`;
      for (let k = 0; k < 6; k++) {
        const y = 0.8 - k * 0.32, side = k % 2 ? 1 : -1;
        s += `<g transform="translate(${side * 0.02} ${r2(y)}) rotate(${side * 58})"><ellipse cx="0" cy="-.26" rx=".23" ry=".28" fill="#9DB39A" stroke="#7C947B" stroke-width=".016"/><path d="M0,0L0,-.5" stroke="#86A085" stroke-width=".014"/></g>`;
        s += `<g transform="translate(${-side * 0.02} ${r2(y - 0.14)}) rotate(${-side * 58})"><ellipse cx="0" cy="-.24" rx=".21" ry=".26" fill="#8FA88E" stroke="#7C947B" stroke-width=".016"/></g>`;
      }
      s += `<ellipse cx="0" cy="-1" rx=".16" ry=".2" fill="#9DB39A" stroke="#7C947B" stroke-width=".016"/>`;
      return s;
    },
    hoja() {
      return `<path d="${petal(1, 0.36, 0.05)}" fill="#86A26F" stroke="#66824F" stroke-width=".02"/><path d="M0,-.05L0,-.92" stroke="#6C8856" stroke-width=".025"/>`;
    }
  };
  function flowerMarkup(t, rnd) { return (DR[t] || DR.hoja)(rnd); }
  function place(t, x, y, r, rot, rnd) {
    return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${r2(r)})" opacity=".97">${flowerMarkup(t, rnd)}</g>`;
  }
  A.flowerIcon = function (t) {
    const rot = FL[t] && FL[t].kind === 'sprig' ? 35 : 0;
    return `<svg viewBox="-1.12 -1.12 2.24 2.24" aria-hidden="true"><g transform="rotate(${rot})">${flowerMarkup(t, rng(3))}</g></svg>`;
  };

  /* ---------------- composición de flores dentro de la resina ---------------- */
  function arrange(kind, types, rx, ry, rnd) {
    const blooms = types.filter((t) => FL[t] && FL[t].kind === 'bloom');
    const sprigs = types.filter((t) => FL[t] && FL[t].kind !== 'bloom');
    if (!blooms.length) blooms.push('margarita');
    const m = Math.min(rx, ry);
    const inside = (x, y, pad) => (x * x) / Math.pow(Math.max(rx - pad, 1), 2) + (y * y) / Math.pow(Math.max(ry - pad, 1), 2) <= 1;
    const items = [];
    // ramitas / follaje al fondo
    const ns = kind === 'meadow' ? 5 : kind === 'wreath' ? 3 : 3;
    for (let i = 0; i < ns; i++) {
      const t = sprigs.length ? sprigs[i % sprigs.length] : 'hoja';
      const ang = rr(rnd, 0, TAU), dist = rr(rnd, 0.05, 0.55);
      const r = m * rr(rnd, 0.6, 0.95) * (t === 'gipsofila' ? 1.05 : 0.9);
      items.push({ t, x: Math.cos(ang) * rx * dist, y: Math.sin(ang) * ry * dist, r, rot: rr(rnd, -70, 70) + (i % 2) * 180 });
    }
    const placed = [];
    function pack(n, rmin, rmax) {
      let guard = 0, k = 0;
      while (k < n && guard++ < 400) {
        const r = m * rr(rnd, rmin, rmax);
        const x = rr(rnd, -rx, rx), y = rr(rnd, -ry, ry);
        if (!inside(x, y, r * 0.55)) continue;
        if (placed.some((p) => Math.hypot(p.x - x, p.y - y) < (p.r + r) * 0.72)) continue;
        placed.push({ x, y, r }); k++;
        items.push({ t: blooms[k % blooms.length], x, y, r, rot: rr(rnd, 0, 360) });
      }
    }
    if (kind === 'single') {
      items.push({ t: blooms[0], x: rr(rnd, -0.05, 0.05) * rx, y: rr(rnd, -0.05, 0.03) * ry, r: m * 0.62, rot: rr(rnd, 0, 360) });
      if (blooms[1]) items.push({ t: blooms[1], x: rx * 0.55, y: ry * 0.48, r: m * 0.2, rot: 20 });
    } else if (kind === 'cluster') {
      items.push({ t: blooms[0], x: -rx * 0.1, y: -ry * 0.08, r: m * 0.46, rot: rr(rnd, 0, 360) });
      items.push({ t: blooms[1 % blooms.length], x: rx * 0.42, y: ry * 0.3, r: m * 0.32, rot: rr(rnd, 0, 360) });
      items.push({ t: blooms[2 % blooms.length], x: -rx * 0.36, y: ry * 0.42, r: m * 0.26, rot: rr(rnd, 0, 360) });
      items.push({ t: blooms[0], x: rx * 0.3, y: -ry * 0.52, r: m * 0.2, rot: rr(rnd, 0, 360) });
    } else if (kind === 'wreath') {
      const n = 7;
      for (let i = 0; i < n; i++) {
        const a = i / n * TAU + rr(rnd, -0.1, 0.1) - Math.PI / 2;
        items.push({ t: blooms[i % blooms.length], x: Math.cos(a) * rx * 0.62, y: Math.sin(a) * ry * 0.62, r: m * rr(rnd, 0.22, 0.3), rot: rr(rnd, 0, 360) });
      }
    } else if (kind === 'meadow') {
      pack(13, 0.13, 0.22);
    } else {
      pack(6, 0.2, 0.34);
    }
    return items;
  }

  /* ---------------- formas ---------------- */
  const SIZES = { circle: [380, 380], oval: [330, 440], drop: [330, 460], arch: [330, 450], rounded: [340, 370], heart: [400, 372], organic: [340, 380] };
  function shapePath(shape, cx, cy, w, h, rnd) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
    switch (shape) {
      case 'circle': case 'oval':
        return `M${x0},${cy}A${w / 2},${h / 2} 0 1 1 ${x1},${cy}A${w / 2},${h / 2} 0 1 1 ${x0},${cy}Z`;
      case 'drop': {
        const r = w / 2, yc = y1 - r, k = yc - y0;
        return `M${cx},${y0}C${r2(cx + w * 0.06)},${r2(y0 + k * 0.42)} ${x1},${r2(yc - k * 0.32)} ${x1},${r2(yc)}A${r},${r} 0 0 1 ${x0},${r2(yc)}C${x0},${r2(yc - k * 0.32)} ${r2(cx - w * 0.06)},${r2(y0 + k * 0.42)} ${cx},${y0}Z`;
      }
      case 'arch':
        return `M${x0},${y1 - 26}Q${x0},${y1} ${x0 + 26},${y1}L${x1 - 26},${y1}Q${x1},${y1} ${x1},${y1 - 26}L${x1},${y0 + w / 2}A${w / 2},${w / 2} 0 0 0 ${x0},${y0 + w / 2}Z`;
      case 'rounded': {
        const r = Math.min(w, h) * 0.22;
        return `M${x0 + r},${y0}H${x1 - r}A${r},${r} 0 0 1 ${x1},${y0 + r}V${y1 - r}A${r},${r} 0 0 1 ${x1 - r},${y1}H${x0 + r}A${r},${r} 0 0 1 ${x0},${y1 - r}V${y0 + r}A${r},${r} 0 0 1 ${x0 + r},${y0}Z`;
      }
      case 'heart': {
        const P = [[0.5, 0.95], [0.04, 0.62], [-0.02, 0.24], [0.2, 0.08], [0.36, -0.03], [0.5, 0.1], [0.5, 0.2], [0.5, 0.1], [0.64, -0.03], [0.8, 0.08], [1.02, 0.24], [0.96, 0.62], [0.5, 0.95]];
        const q = (p) => `${r2(x0 + p[0] * w)},${r2(y0 + p[1] * h)}`;
        return `M${q(P[0])}C${q(P[1])} ${q(P[2])} ${q(P[3])}C${q(P[4])} ${q(P[5])} ${q(P[6])}C${q(P[7])} ${q(P[8])} ${q(P[9])}C${q(P[10])} ${q(P[11])} ${q(P[12])}Z`;
      }
      default: { // organic
        const n = 9, pts = [];
        for (let i = 0; i < n; i++) { const a = i / n * TAU, k = 0.9 + 0.13 * rnd(); pts.push([cx + Math.cos(a) * w / 2 * k, cy + Math.sin(a) * h / 2 * k]); }
        const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        let m0 = mid(pts[n - 1], pts[0]);
        let d = `M${r2(m0[0])},${r2(m0[1])}`;
        for (let i = 0; i < n; i++) { const mm = mid(pts[i], pts[(i + 1) % n]); d += `Q${r2(pts[i][0])},${r2(pts[i][1])} ${r2(mm[0])},${r2(mm[1])}`; }
        return d + 'Z';
      }
    }
  }

  /* ---------------- pieza de resina ---------------- */
  function piece(o) {
    const rnd = rng(o.seed || 1);
    const id = uid();
    const { cx, cy, w, h } = o;
    const d = shapePath(o.shape, cx, cy, w, h, rng((o.seed || 1) + 99));
    const fcy = cy + (o.shape === 'drop' ? h * 0.1 : o.shape === 'heart' ? h * 0.02 : 0);
    const frx = w / 2 * (o.shape === 'drop' ? 0.86 : 0.93), fry = h / 2 * (o.shape === 'drop' ? 0.74 : 0.92);
    const items = arrange(o.kind || 'cluster', o.flowers, frx, fry, rnd);
    let fl = '';
    for (const it of items) fl += place(it.t, cx + it.x, fcy + it.y, it.r, it.rot, rnd);
    const bz = o.bezel === 'none' ? 0 : (o.bezel === 'thin' ? 4.5 : 9) * Math.min(1.3, w / 330);
    const metal = o.metal === 'silver' ? 'url(#silver)' : 'url(#gold)';
    let flakes = '';
    if (o.flakes) for (let i = 0; i < 7; i++) {
      const fx = cx + rr(rnd, -0.4, 0.4) * w, fy = cy + rr(rnd, -0.4, 0.4) * h, s = rr(rnd, 3, 7);
      flakes += `<path d="M${r2(fx)} ${r2(fy)}l${r2(s)} ${r2(-s * 0.4)}l${r2(s * 0.6)} ${r2(s)}l${r2(-s)} ${r2(s * 0.5)}z" fill="url(#gold)" opacity=".85"/>`;
    }
    const sp = `<ellipse cx="${r2(cx - w * 0.2)}" cy="${r2(cy - h * 0.27)}" rx="${r2(w * 0.1)}" ry="${r2(h * 0.028)}" transform="rotate(-36 ${r2(cx - w * 0.2)} ${r2(cy - h * 0.27)})" fill="#fff" opacity=".85" filter="url(#b2)"/><circle cx="${r2(cx + w * 0.22)}" cy="${r2(cy + h * 0.27)}" r="${r2(w * 0.025)}" fill="#fff" opacity=".6" filter="url(#b2)"/>`;
    return `<g${o.rot ? ` transform="rotate(${o.rot} ${cx} ${cy})"` : ''}>
<path d="${d}" transform="translate(${r2(w * 0.035)} ${r2(h * 0.06)})" fill="#33240f" opacity=".38" filter="url(#b14)"/>
<path d="${d}" transform="translate(${r2(w * 0.008)} ${r2(h * 0.02)})" fill="#9c8a68" opacity=".5"/>
<path d="${d}" fill="#FAF6EA" opacity=".92"/>
<path d="${d}" fill="url(#resin)"/>
<clipPath id="${id}"><path d="${d}"/></clipPath>
<g clip-path="url(#${id})"><g filter="url(#fs)">${fl}</g>${flakes}<path d="${d}" fill="url(#edge)"/><path d="${d}" fill="url(#refl)"/><path d="${d}" fill="url(#gloss)"/></g>
${sp}
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
${bz ? `<path d="${d}" fill="none" stroke="${metal}" stroke-width="${r2(bz)}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.1" transform="translate(-1 -1.4)"/><path d="${d}" fill="none" stroke="#5b4620" stroke-opacity=".25" stroke-width="1" transform="translate(${r2(bz / 2)} ${r2(bz / 2)})"/>` : ''}
</g>`;
  }
  A._piece = piece;

  function chain(d, o) {
    o = o || {};
    const w = o.w || 5;
    if (o.cord) {
      return `<path d="${d}" fill="none" stroke="#2c1e0e" stroke-opacity=".25" stroke-width="${w + 2}" transform="translate(5 9)" filter="url(#b3)" stroke-linecap="round"/>
<path d="${d}" fill="none" stroke="#8a6f52" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c9b08c" stroke-width="${w * 0.35}" stroke-dasharray="3 6" stroke-linecap="round"/>`;
    }
    const c = o.color || 'url(#gold)';
    return `<path d="${d}" fill="none" stroke="#2c1e0e" stroke-opacity=".22" stroke-width="${w + 2}" transform="translate(5 9)" filter="url(#b3)" stroke-linecap="round"/>
<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${w * 1.9} ${w * 0.6}" stroke-linecap="round"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${w * 0.22}" stroke-dasharray="${w * 0.8} ${w * 1.7}" stroke-linecap="round" transform="translate(-.4 -1.2)"/>`;
  }
  const ringLoop = (x, y, r, w) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#2c1e0e" stroke-opacity=".2" stroke-width="${w + 1}" transform="translate(3 6)" filter="url(#b3)"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="url(#gold)" stroke-width="${w}"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${r * 0.8}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1" stroke-dasharray="${r * 0.9} 100"/>`;

  /* ---------------- fondos "fotográficos" ---------------- */
  const BGS = {
    linen: ['#F5EEF4', '#DCCCDD', 'linen'], cream: ['#F9F4F9', '#E5D8E9', 'grain'], stone: ['#E4DCE6', '#BAAFC0', 'stone'],
    sage: ['#DCCFEA', '#B79FD3', 'grain'], wood: ['#CBA985', '#9C7550', 'wood'], sand: ['#EBDDEE', '#CDB8D3', 'grain'], blush: ['#F3DEEA', '#DDBCD2', 'grain'], moss: ['#A48BC4', '#7A5E9F', 'grain']
  };
  function background(kind, W, H, seed) {
    const b = BGS[kind] || BGS.linen;
    const rnd = rng(seed + 31);
    let s = `<radialGradient id="bgg" cx=".38" cy=".3" r="1"><stop offset="0" stop-color="${b[0]}"/><stop offset="1" stop-color="${b[1]}"/></radialGradient><rect width="${W}" height="${H}" fill="url(#bgg)"/>`;
    s += `<rect width="${W}" height="${H}" filter="url(#tx-${b[2]})" opacity="${b[2] === 'wood' ? 0.75 : b[2] === 'stone' ? 0.6 : 0.5}"/>`;
    // luz de ventana
    s += `<g filter="url(#b40)" opacity=".5" fill="#fff"><path d="M${W * 0.05},-40L${W * 0.42},-40L${W * 0.95},${H * 0.7}L${W * 0.55},${H * 0.85}Z"/></g>`;
    // sombras de hojas (luz natural)
    s += `<g filter="url(#b18)" opacity=".16" fill="#3a2d1c" stroke="#3a2d1c">`;
    for (let i = 0; i < 6; i++) {
      const x = rr(rnd, -0.05, 0.55) * W, y = rr(rnd, -0.05, 0.42) * H, sc = rr(rnd, 150, 300), rot = rr(rnd, -60, 120);
      s += `<path d="${petal(1, 0.34, 0)}" transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${r2(sc)})" stroke-width=".01"/>`;
    }
    s += `</g>`;
    s += `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
    return s;
  }
  function defs() {
    const turb = (id, freq, oct, seed, mat) => `<filter id="tx-${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}"/><feColorMatrix type="matrix" values="${mat}"/></filter>`;
    return `<defs>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E7B8"/><stop offset=".3" stop-color="#D2AE66"/><stop offset=".62" stop-color="#A5843F"/><stop offset="1" stop-color="#EBD597"/></linearGradient>
<linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F4F2"/><stop offset=".4" stop-color="#B9BBB9"/><stop offset=".7" stop-color="#8C8F8E"/><stop offset="1" stop-color="#E4E5E3"/></linearGradient>
<radialGradient id="resin" cx=".36" cy=".28" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#FBF7EA" stop-opacity=".18"/><stop offset="1" stop-color="#E6DCC3" stop-opacity=".5"/></radialGradient>
<radialGradient id="edge" cx=".5" cy=".5" r=".5"><stop offset=".78" stop-color="#7a6238" stop-opacity="0"/><stop offset="1" stop-color="#7a6238" stop-opacity=".22"/></radialGradient>
<linearGradient id="gloss" x1=".1" y1="0" x2=".72" y2=".95"><stop offset="0" stop-color="#fff" stop-opacity=".82"/><stop offset=".26" stop-color="#fff" stop-opacity=".2"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="refl" x1="0" y1="1" x2="0" y2=".55"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#3a2b18" stop-opacity="0"/><stop offset="1" stop-color="#3a2b18" stop-opacity=".22"/></radialGradient>
<filter id="fs" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="1.5" dy="3.5" stdDeviation="2.4" flood-color="#4a3b28" flood-opacity=".3"/></filter>
<filter id="ds" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="4" dy="9" stdDeviation="6" flood-color="#2f2110" flood-opacity=".32"/></filter>
<filter id="b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="b14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="b18" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="b40" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="bk" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
${turb('linen', '.9 .05', 3, 3, '0 0 0 0 .42  0 0 0 0 .34  0 0 0 0 .24  1.7 0 0 0 -.7')}
${turb('grain', '.85', 2, 6, '0 0 0 0 .4  0 0 0 0 .34  0 0 0 0 .26  1.5 0 0 0 -.62')}
${turb('stone', '.012 .02', 4, 9, '0 0 0 0 .38  0 0 0 0 .34  0 0 0 0 .28  1.9 0 0 0 -.78')}
${turb('wood', '.012 .26', 4, 12, '0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  2.1 0 0 0 -.85')}
</defs>`;
  }

  function loose(types, rnd, spots, scale) {
    let s = '';
    spots.forEach((p, i) => {
      const t = types[i % types.length];
      const k = FL[t] && FL[t].kind === 'sprig';
      s += `<g filter="url(#ds)">${place(t, p[0], p[1], (p[2] || 80) * (scale || 1) * (k ? 1.25 : 1), rr(rnd, 0, 360), rnd)}</g>`;
    });
    return s;
  }

  const uri = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const wrap = (W, H, body, vb, extra) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb || `0 0 ${W} ${H}`}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${defs()}${body}${extra || ''}</svg>`;

  /* ---------------- disposiciones por tipo de joya ---------------- */
  function dims(a) { const s = SIZES[a.shape] || SIZES.circle; return [s[0] * (a.size || 1), s[1] * (a.size || 1)]; }

  function stageNecklace(a, view, mini) {
    const [w, h] = dims(a);
    const cx = 400, cy = mini ? 480 : 620, top = cy - h / 2, yb = top - 16;
    const L = `M-40,-40C50,220 300,${r2(yb - 110)} 400,${r2(yb)}`, R = `M840,-40C750,220 500,${r2(yb - 110)} 400,${r2(yb)}`;
    let s = chain(L, { cord: a.cord }) + chain(R, { cord: a.cord });
    s += a.cord ? '' : ringLoop(400, r2(yb + 8), 14, 6);
    s += piece({ shape: a.shape, cx, cy, w, h, seed: a.seed, flowers: a.flowers, kind: a.kind, bezel: a.bezel, flakes: a.flakes, metal: a.metal });
    return { svg: s, fx: cx, fy: cy, fw: Math.max(w, h) * 1.18 };
  }
  function stageRing(a) {
    const cx = 400, cy = 690, R = 172;
    let s = `<ellipse cx="${cx}" cy="${cy + 200}" rx="200" ry="30" fill="#2c1e0e" opacity=".3" filter="url(#b14)"/>`;
    s += `<ellipse cx="${cx + 8}" cy="${cy + 10}" rx="${R}" ry="${R * 0.9}" fill="none" stroke="#2c1e0e" stroke-opacity=".25" stroke-width="30" filter="url(#b6)"/>`;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * 0.9}" fill="none" stroke="url(#gold)" stroke-width="28"/>`;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${R - 13}" ry="${R * 0.9 - 13}" fill="none" stroke="#5b4620" stroke-opacity=".3" stroke-width="2"/>`;
    s += `<ellipse cx="${cx - 3}" cy="${cy - 3}" rx="${R + 8}" ry="${R * 0.9 + 8}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="120 900" />`;
    const [w, h] = [a.shape === 'oval' ? 210 : 230, a.shape === 'oval' ? 250 : 230];
    s += piece({ shape: a.shape, cx, cy: cy - R * 0.9 - 30, w, h, seed: a.seed, flowers: a.flowers, kind: a.kind || 'meadow', bezel: a.bezel || 'gold', flakes: a.flakes });
    return { svg: s, fx: cx, fy: cy - R * 0.9 - 30, fw: 330 };
  }
  function earHook(x, yTop, mirror) {
    const m = mirror ? -1 : 1;
    const d = `M${x},${yTop - 14}C${x},${yTop - 120} ${x + m * 84},${yTop - 140} ${x + m * 88},${yTop - 84}C${x + m * 90},${yTop - 56} ${x + m * 72},${yTop - 40} ${x + m * 62},${yTop - 50}`;
    return chain(d, { w: 5, color: 'url(#gold)' }).replace(/stroke-dasharray="[^"]*"/g, '') + ringLoop(x, yTop - 6, 11, 5);
  }
  function stageEarrings(a, view, y0, mini) {
    const sc = mini ? 0.72 : 1;
    const w = 200 * sc, h = 300 * sc;
    const cy = (y0 || 600);
    const shape = a.shape === 'heart' ? 'drop' : a.shape;
    const [ww, hh] = shape === 'circle' ? [230 * sc, 230 * sc] : [w, h];
    const x1 = mini ? 250 : 275, x2 = mini ? 550 : 525;
    let s = earHook(x1, cy - hh / 2, false) + earHook(x2, cy - hh / 2 + 22, true);
    s += piece({ shape, cx: x1, cy, w: ww, h: hh, seed: a.seed, flowers: a.flowers, kind: a.kind, bezel: a.bezel, rot: -4, flakes: a.flakes });
    s += piece({ shape, cx: x2, cy: cy + 22, w: ww, h: hh, seed: a.seed + 5, flowers: a.flowers.slice().reverse(), kind: a.kind, bezel: a.bezel, rot: 4, flakes: a.flakes });
    return { svg: s, fx: 400, fy: cy, fw: 640 };
  }
  function stageBracelet(a) {
    const cx = 400, cy = 500, rx = 300, ry = 250;
    const d = `M${cx - rx},${cy}A${rx},${ry} 0 1 1 ${cx + rx},${cy}A${rx},${ry} 0 1 1 ${cx - rx},${cy}Z`;
    let s = chain(d, { w: 6 });
    // cierre
    s += `<g transform="translate(${cx} ${cy - ry})"><rect x="-26" y="-12" width="52" height="24" rx="12" fill="url(#gold)" stroke="#8d6f33" stroke-width="1"/><circle cx="0" cy="0" r="5" fill="#8d6f33"/></g>`;
    const angs = [38, 64, 90, 116, 142], sizes = [128, 150, 168, 150, 128];
    angs.forEach((g, i) => {
      const t = g * Math.PI / 180;
      s += piece({ shape: 'circle', cx: cx + Math.cos(t) * rx, cy: cy + Math.sin(t) * ry, w: sizes[i], h: sizes[i], seed: a.seed + i * 3, flowers: i % 2 ? a.flowers.slice().reverse() : a.flowers, kind: 'single', bezel: 'thin', flakes: a.flakes });
    });
    return { svg: s, fx: cx, fy: cy + ry - 10, fw: 560 };
  }
  function stageKeychain(a) {
    const cx = 400;
    let s = ringLoop(cx, 150, 74, 10);
    s += chain(`M${cx},224L${cx},330`, { w: 6 });
    s += `<rect x="${cx - 18}" y="318" width="36" height="34" rx="8" fill="url(#gold)" stroke="#8d6f33"/>`;
    const py = 590;
    // borla
    let tas = '';
    for (let i = 0; i < 9; i++) { const dx = (i - 4) * 9; tas += `<path d="M${cx + dx * 0.4},${py + 190}C${cx + dx},${py + 240} ${cx + dx * 1.4},${py + 290} ${cx + dx * 1.6},${py + 335}" stroke="${i % 2 ? '#8FA283' : '#A4B598'}" stroke-width="6" fill="none" stroke-linecap="round"/>`; }
    s += `<g filter="url(#fs)">${tas}</g><rect x="${cx - 24}" y="${py + 176}" width="48" height="22" rx="8" fill="url(#gold)" stroke="#8d6f33"/>`;
    s += piece({ shape: a.shape || 'rounded', cx, cy: py, w: 300, h: 360, seed: a.seed, flowers: a.flowers, kind: a.kind || 'meadow', bezel: a.bezel || 'gold', flakes: a.flakes });
    s += `<circle cx="${cx}" cy="${py - 165}" r="9" fill="url(#gold)" stroke="#8d6f33"/>`;
    return { svg: s, fx: cx, fy: py, fw: 440 };
  }
  function stageSet(a, view) {
    const n = stageNecklace(Object.assign({}, a, { size: 0.68 }), view, true);
    const e = stageEarrings(Object.assign({}, a, { shape: 'drop', kind: 'cluster' }), view, 830, true);
    return { svg: n.svg + e.svg, fx: 400, fy: 620, fw: 700 };
  }
  const STAGES = { necklace: stageNecklace, ring: stageRing, earrings: stageEarrings, bracelet: stageBracelet, keychain: stageKeychain, set: stageSet };

  /* ---------------- vistas de producto ---------------- */
  function herbarium(p) {
    const rnd = rng(p.art.seed + 7);
    let s = `<rect width="800" height="1000" fill="#EFE8D6"/><rect width="800" height="1000" filter="url(#tx-grain)" opacity=".6"/>`;
    s += `<g filter="url(#ds)"><rect x="80" y="70" width="640" height="860" fill="#FBF7EC" transform="rotate(-1.2 400 500)"/></g>`;
    s += `<g transform="rotate(-1.2 400 500)"><rect x="80" y="70" width="640" height="860" fill="#FBF7EC"/><rect x="80" y="70" width="640" height="860" filter="url(#tx-grain)" opacity=".35"/><rect x="104" y="94" width="592" height="812" fill="none" stroke="#C9B48A" stroke-width="1.2"/>`;
    s += `<text x="400" y="150" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="40" fill="#5C4B36">Herbario ${window.SV && SV.brand ? '· ' + SV.brand : ''}</text>`;
    s += `<text x="400" y="185" text-anchor="middle" font-family="Georgia,serif" font-size="15" letter-spacing="5" fill="#9B8560">FLORES DE ESTA PIEZA</text>`;
    const list = p.flowers.slice(0, 4);
    const cols = list.length > 2 ? 2 : 1, rows = Math.ceil(list.length / cols);
    list.forEach((t, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const cw = 592 / cols, ch = (600) / rows;
      const x = 104 + cw * (c + 0.5), y = 230 + ch * (r + 0.42);
      const rad = Math.min(cw, ch) * 0.34;
      s += `<g filter="url(#fs)">${place(t, x, y, rad, FL[t].kind === 'sprig' ? 25 : rr(rnd, 0, 40), rnd)}</g>`;
      s += `<text x="${r2(x)}" y="${r2(y + rad + 46)}" text-anchor="middle" font-family="Georgia,serif" font-size="32" fill="#4E3F2C">${FL[t].label}</text>`;
      s += `<text x="${r2(x)}" y="${r2(y + rad + 76)}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="21" fill="#8A7654">${FL[t].latin}</text>`;
    });
    s += `<text x="400" y="868" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="21" fill="#7A6A4C">Pieza nº ${String(p.no || 1).padStart(3, '0')} · hecha a mano</text>`;
    s += `<g transform="translate(400 892)"><path d="M-60,0L60,0" stroke="#C9B48A"/><circle r="4" fill="#C9A45C"/></g></g>`;
    return wrap(800, 1000, s);
  }

  A.product = function (p, view) {
    const key = 'p:' + p.id + ':' + view;
    if (A._c[key]) return A._c[key];
    const a = p.art;
    let out;
    if (!a.type || view === 3) out = uri(herbarium(p));
    else {
      const stage = STAGES[a.type](a, view);
      const bgk = view === 2 ? a.bg2 || 'wood' : a.bg || 'linen';
      const rnd = rng(a.seed + view * 17);
      let body = background(bgk, 800, 1000, a.seed + view);
      if (view === 2) {
        body += `<g filter="url(#ds)"><path d="M-80,470C120,430 300,520 520,470S820,440 900,500L900,1100L-80,1100Z" fill="#EDE3CF"/></g><path d="M-80,470C120,430 300,520 520,470S820,440 900,500L900,1100L-80,1100Z" fill="url(#bgg)" opacity=".0"/><rect x="-80" y="470" width="1000" height="640" filter="url(#tx-linen)" opacity=".5" clip-path="none" style="display:none"/>`;
      }
      const spots = view === 0
        ? [[70, 930, 64], [745, 84, 58]]
        : view === 2 ? [[90, 190, 96], [720, 900, 100], [700, 150, 70], [140, 880, 74], [420, 940, 60]] : [];
      body += loose(a.flowers, rnd, spots, 1);
      body += `<g${view === 2 ? ' transform="rotate(-5 400 600)"' : ''}>${stage.svg}</g>`;
      let vb;
      if (view === 1) { const w = stage.fw, hh = w * 1.25; vb = `${r2(Math.min(Math.max(stage.fx - w / 2, -60), 860 - w))} ${r2(Math.min(Math.max(stage.fy - hh / 2, -40), 1040 - hh))} ${r2(w)} ${r2(hh)}`; }
      out = uri(wrap(800, 1000, body, vb));
    }
    A._c[key] = out;
    return out;
  };
  A._c = {};

  /* ---------------- portada ---------------- */
  A.hero = function (layout) {
    const key = 'hero:' + layout;
    if (A._c[key]) return A._c[key];
    const mobile = layout === 'mobile';
    const W = mobile ? 900 : 1600, H = mobile ? 1350 : 1000;
    const rnd = rng(mobile ? 71 : 42);
    let body = background('cream', W, H, mobile ? 8 : 4);
    const px = mobile ? 450 : 1150, py = mobile ? 640 : 520, ps = mobile ? 1.3 : 1.55;
    const w = 300 * ps, h = 350 * ps;
    // flores desenfocadas (profundidad)
    body += `<g filter="url(#bk)" opacity=".85">${place('margarita', mobile ? 60 : 1560, mobile ? 1290 : 930, mobile ? 220 : 300, 20, rnd)}${place('nomeolvides', mobile ? 860 : 1290, mobile ? 90 : 60, mobile ? 150 : 200, 0, rnd)}${place('rosa', mobile ? 780 : 640, mobile ? 1250 : 1000, mobile ? 170 : 210, 0, rnd)}</g>`;
    // cadena
    const yb = py - h / 2 - 16;
    const c1 = `M${px - 520},-40C${px - 400},${r2(yb * 0.5)} ${px - 160},${r2(yb - 90)} ${px},${r2(yb)}`;
    const c2 = `M${px + 520},-40C${px + 400},${r2(yb * 0.5)} ${px + 160},${r2(yb - 90)} ${px},${r2(yb)}`;
    body += chain(c1, { w: 7 }) + chain(c2, { w: 7 }) + ringLoop(px, r2(yb + 10), 20, 8);
    body += piece({ shape: 'organic', cx: px, cy: py, w, h, seed: 12, flowers: ['nomeolvides', 'margarita', 'gipsofila', 'helecho'], kind: 'cluster', bezel: 'gold', flakes: true });
    // pendientes y flores sueltas
    if (!mobile) {
      const e = stageEarrings({ shape: 'drop', flowers: ['lavanda', 'gipsofila', 'nomeolvides'], kind: 'cluster', seed: 33, bezel: 'thin' }, 0, 600, true);
      body += `<g transform="translate(1280 430) scale(.44)">${e.svg}</g>`;
    }
    body += loose(['lavanda', 'gipsofila', 'margarita', 'nomeolvides'], rnd, mobile ? [[110, 300, 90], [800, 1080, 100], [140, 1120, 80]] : [[760, 130, 110], [1500, 300, 90], [1420, 880, 110], [960, 930, 70]], 1);
    A._c[key] = uri(wrap(W, H, body));
    return A._c[key];
  };

  /* ---------------- escenas del proceso y del taller ---------------- */
  function stem(x0, y0, x1, y1, bend) {
    const mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2;
    return `<path d="M${r2(x0)},${r2(y0)}Q${r2(mx)},${r2(my)} ${r2(x1)},${r2(y1)}" fill="none" stroke="#7C9468" stroke-width="7" stroke-linecap="round"/><path d="M${r2(x0)},${r2(y0)}Q${r2(mx)},${r2(my)} ${r2(x1)},${r2(y1)}" fill="none" stroke="#A7BD8F" stroke-width="2" stroke-linecap="round" transform="translate(-1.5 -1.5)"/>`;
  }
  function scissors(x, y, rot) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})" filter="url(#ds)">
<path d="M0,0L250,-14L256,-4Z" fill="#D9DBD9" stroke="#8E9190"/><path d="M0,0L250,16L256,6Z" fill="#C9CBC9" stroke="#8E9190"/>
<ellipse cx="-46" cy="-30" rx="46" ry="30" fill="none" stroke="url(#gold)" stroke-width="12" transform="rotate(14 -46 -30)"/><ellipse cx="-46" cy="34" rx="46" ry="30" fill="none" stroke="url(#gold)" stroke-width="12" transform="rotate(-14 -46 34)"/><circle cx="20" cy="1" r="7" fill="#8E9190"/></g>`;
  }
  function tweezers(x, y, rot) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})" filter="url(#ds)"><path d="M0,0L330,-8L330,-2Z" fill="#C9CBC9" stroke="#8E9190" stroke-width="1.5"/><path d="M0,0L330,12L330,6Z" fill="#DADCDA" stroke="#8E9190" stroke-width="1.5"/><path d="M-4,-6C-60,-14 -60,20 -4,10" fill="none" stroke="#B7BAB8" stroke-width="10" stroke-linecap="round"/></g>`;
  }
  function sparkle(x, y, s, o) {
    return `<path d="M${x},${y - s}Q${x + s * 0.12},${y - s * 0.12} ${x + s},${y}Q${x + s * 0.12},${y + s * 0.12} ${x},${y + s}Q${x - s * 0.12},${y + s * 0.12} ${x - s},${y}Q${x - s * 0.12},${y - s * 0.12} ${x},${y - s}Z" fill="#fff" opacity="${o || 0.95}"/>`;
  }
  function sheet(x, y, w, h, rot, col) {
    return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 6}" y="${y + 10}" width="${w}" height="${h}" fill="#2c1e0e" opacity=".3" filter="url(#b14)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col || '#FBF7EC'}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#tx-grain)" opacity=".4"/></g>`;
  }

  const SCENES = {
    select(rnd) {
      let s = background('linen', 1200, 900, 21);
      s += sheet(120, 90, 960, 720, -3, '#D4BC94');
      const heads = [['margarita', 330, 260, 92], ['nomeolvides', 560, 220, 76], ['rosa', 800, 300, 100], ['margarita', 470, 420, 84], ['hortensia', 700, 500, 98], ['calendula', 300, 520, 78], ['nomeolvides', 930, 470, 66]];
      heads.forEach((h, i) => { s += stem(h[1] + (i % 2 ? -260 : 240), 880, h[1], h[2], (i % 2 ? 40 : -40)); });
      s += `<g filter="url(#ds)">`;
      s += place('lavanda', 180, 560, 150, 30, rnd) + place('gipsofila', 1020, 330, 150, -20, rnd) + place('eucalipto', 240, 250, 130, 60, rnd);
      heads.forEach((h) => { s += place(h[0], h[1], h[2], h[3], rr(rnd, 0, 360), rnd); });
      s += `</g>` + scissors(560, 730, -18);
      return s;
    },
    dry(rnd) {
      let s = background('sand', 1200, 900, 25);
      s += sheet(90, 110, 520, 690, -4, '#FBF7EC') + sheet(560, 70, 540, 700, 3, '#F5EFDF');
      s += `<g filter="url(#fs)">${place('nomeolvides', 240, 300, 62, 10, rnd)}${place('nomeolvides', 400, 360, 50, 40, rnd)}${place('margarita', 260, 500, 84, 0, rnd)}${place('lavanda', 450, 540, 110, 20, rnd)}${place('gipsofila', 350, 690, 96, 0, rnd)}
${place('rosa', 780, 260, 92, 0, rnd)}${place('helecho', 950, 350, 130, 20, rnd)}${place('calendula', 800, 500, 76, 0, rnd)}${place('hortensia', 980, 620, 80, 0, rnd)}${place('eucalipto', 700, 650, 120, -40, rnd)}</g>`;
      s += `<g font-family="Georgia,serif" font-style="italic" font-size="22" fill="#6a5738"><g transform="rotate(-4 110 110)"><rect x="150" y="740" width="200" height="46" fill="#EFE3C4" stroke="#B49B68"/><text x="166" y="770">nomeolvides · junio</text></g><g transform="rotate(3 700 60)"><rect x="850" y="700" width="200" height="46" fill="#EFE3C4" stroke="#B49B68"/><text x="864" y="730">rosa · mayo</text></g></g>`;
      s += `<g filter="url(#ds)"><path d="M1090,760C1130,690 1170,700 1160,780C1150,820 1110,830 1090,760Z" fill="#B7AC9A"/><path d="M1090,760C1110,720 1140,715 1150,740" stroke="#D5CCBC" stroke-width="6" fill="none"/></g>`;
      return s;
    },
    design(rnd) {
      let s = background('wood', 1200, 900, 29);
      s += sheet(170, 90, 860, 720, 2, '#F7F2E5');
      s += `<g stroke="#8A7A5A" stroke-width="2.2" fill="none" stroke-dasharray="10 8"><circle cx="360" cy="290" r="130"/><path d="${shapePath('drop', 690, 300, 210, 300, rnd)}"/><path d="${shapePath('oval', 420, 620, 220, 260, rnd)}"/><circle cx="760" cy="640" r="90"/></g>`;
      s += `<g filter="url(#fs)">${place('margarita', 340, 290, 66, 0, rnd)}${place('nomeolvides', 420, 260, 42, 0, rnd)}${place('gipsofila', 320, 340, 84, 30, rnd)}${place('lavanda', 690, 320, 120, 0, rnd)}${place('nomeolvides', 660, 370, 40, 0, rnd)}${place('rosa', 420, 620, 62, 0, rnd)}${place('helecho', 430, 650, 90, 60, rnd)}${place('calendula', 760, 640, 56, 0, rnd)}</g>`;
      s += tweezers(760, 200, 158) + `<g transform="translate(150 730) rotate(-8)" filter="url(#ds)"><rect width="330" height="34" rx="3" fill="#D8B77E"/><g stroke="#7a5f2c" stroke-width="1.5">${Array.from({ length: 22 }, (_, i) => `<path d="M${i * 15},0v${i % 5 ? 10 : 18}"/>`).join('')}</g></g>`;
      s += `<g transform="translate(830 780) rotate(-22)" filter="url(#ds)"><rect width="230" height="16" rx="5" fill="#C9A45C"/><path d="M230,0L262,8L230,16Z" fill="#E7D3AE"/><path d="M256,6L262,8L256,10Z" fill="#4a3b28"/></g>`;
      return s;
    },
    resin(rnd) {
      let s = background('sage', 1200, 900, 33);
      s += `<g filter="url(#ds)"><rect x="150" y="380" width="820" height="420" rx="44" fill="#DCE4DA"/></g><rect x="150" y="380" width="820" height="420" rx="44" fill="#DCE4DA" stroke="#fff" stroke-opacity=".6" stroke-width="3"/><rect x="150" y="380" width="820" height="200" rx="44" fill="#fff" opacity=".18"/>`;
      const cav = [[290, 490], [470, 490], [650, 490], [830, 490], [290, 690], [470, 690], [650, 690], [830, 690]];
      cav.forEach((c, i) => {
        const filled = i < 5;
        s += `<circle cx="${c[0]}" cy="${c[1] + 3}" r="76" fill="#9CAA9B" opacity=".55"/><circle cx="${c[0]}" cy="${c[1]}" r="72" fill="#C6D1C4" stroke="#A9B7A7" stroke-width="3"/>`;
        if (filled) s += piece({ shape: 'circle', cx: c[0], cy: c[1], w: 130, h: 130, seed: 40 + i, flowers: [['nomeolvides', 'gipsofila'], ['margarita', 'helecho'], ['lavanda', 'gipsofila'], ['rosa', 'eucalipto'], ['hortensia', 'gipsofila']][i], kind: 'single', bezel: 'none' });
      });
      s += `<g transform="rotate(-38 690 220)"><path d="M620,90L760,90L740,300Q738,320 720,320L660,320Q642,320 640,300Z" fill="#EAF0E8" fill-opacity=".7" stroke="#fff" stroke-width="3"/><path d="M632,190L748,190L740,290Q738,306 722,306L662,306Q646,306 644,290Z" fill="#F4EFD8" opacity=".9"/><path d="M640,110L640,300" stroke="#fff" stroke-width="5" stroke-opacity=".6" transform="translate(12 0)"/></g>`;
      s += `<path d="M566,318C556,350 548,380 545,470" fill="none" stroke="#F6F0D6" stroke-width="10" stroke-linecap="round" opacity=".95"/><path d="M563,330C556,360 550,390 548,450" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
      s += `<g filter="url(#ds)" transform="translate(120 140) rotate(24)"><rect width="300" height="18" rx="9" fill="#D9BE94"/><rect width="300" height="18" rx="9" fill="none" stroke="#B89A6B"/></g>`;
      return s;
    },
    polish(rnd) {
      let s = background('cream', 1200, 900, 37);
      s += `<g filter="url(#ds)"><path d="M90,250C300,190 700,230 1110,190L1130,760C800,820 400,790 80,810Z" fill="#E7DCC4"/></g><path d="M90,250C300,190 700,230 1110,190L1130,760C800,820 400,790 80,810Z" fill="#EBE1CB"/><path d="M90,250C300,190 700,230 1110,190L1130,760C800,820 400,790 80,810Z" filter="url(#tx-linen)" opacity=".7"/>`;
      s += piece({ shape: 'drop', cx: 330, cy: 500, w: 220, h: 320, seed: 51, flowers: ['nomeolvides', 'gipsofila'], kind: 'cluster', bezel: 'gold', rot: -8 });
      s += piece({ shape: 'circle', cx: 640, cy: 470, w: 280, h: 280, seed: 52, flowers: ['margarita', 'helecho'], kind: 'single', bezel: 'gold' });
      s += piece({ shape: 'oval', cx: 900, cy: 520, w: 200, h: 270, seed: 53, flowers: ['lavanda', 'gipsofila'], kind: 'cluster', bezel: 'gold', rot: 10 });
      s += sparkle(420, 330, 34) + sparkle(560, 330, 22, 0.9) + sparkle(760, 330, 40) + sparkle(1000, 400, 28) + sparkle(250, 620, 24, 0.8) + sparkle(820, 680, 20, 0.8);
      s += `<g filter="url(#ds)"><rect x="380" y="690" width="240" height="70" rx="14" fill="#9AAE8E" transform="rotate(-6 500 725)"/><rect x="380" y="690" width="240" height="70" rx="14" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" transform="rotate(-6 500 725)"/></g>`;
      s += `<g filter="url(#ds)"><circle cx="1010" cy="690" r="52" fill="#EFE7D2"/><circle cx="1010" cy="690" r="52" fill="none" stroke="#C7B892" stroke-width="3"/><circle cx="1010" cy="690" r="18" fill="#C7B892" opacity=".6"/></g>`;
      return s;
    },
    pack(rnd) {
      let s = background('sand', 1200, 900, 41);
      s += `<g filter="url(#ds)"><rect x="240" y="150" width="720" height="600" rx="14" fill="#E9DFC9"/></g><rect x="240" y="150" width="720" height="600" rx="14" fill="#F1E9D6"/><rect x="240" y="150" width="720" height="600" rx="14" filter="url(#tx-grain)" opacity=".5"/><rect x="266" y="176" width="668" height="548" rx="8" fill="#E3D8BF"/>`;
      s += `<path d="M266,300C380,260 460,340 600,300S820,270 934,320L934,724L266,724Z" fill="#FBF8EF" stroke="#E7DFC9" stroke-width="2"/><path d="M266,420C400,380 500,460 640,420S840,400 934,440L934,724L266,724Z" fill="#F7F2E6" opacity=".9"/>`;
      s += `<g transform="translate(470 400)"><ellipse cx="0" cy="18" rx="140" ry="20" fill="#2c1e0e" opacity=".25" filter="url(#b6)"/><rect x="-120" y="-30" width="240" height="60" rx="30" fill="#FFFEFA" stroke="#E8E1CD"/></g>`;
      s += chain(`M500,300C480,340 470,370 470,400`, { w: 4 });
      s += piece({ shape: 'circle', cx: 600, cy: 470, w: 210, h: 210, seed: 61, flowers: ['nomeolvides', 'margarita', 'gipsofila'], kind: 'cluster', bezel: 'gold' });
      s += `<g filter="url(#ds)"><rect x="240" y="415" width="720" height="34" fill="#9AAE8E"/><rect x="240" y="415" width="720" height="34" fill="#fff" opacity=".16"/><rect x="560" y="150" width="34" height="600" fill="#9AAE8E"/><path d="M577,430C520,360 450,380 480,440C500,470 560,450 577,430ZM577,430C640,350 710,380 680,440C660,470 600,450 577,430Z" fill="#A9BC9C" stroke="#7F9473" stroke-width="2"/><circle cx="577" cy="432" r="18" fill="#93A886"/></g>`;
      s += `<g transform="translate(830 590) rotate(6)" filter="url(#ds)"><rect width="240" height="170" fill="#FFFDF6"/><rect width="240" height="170" filter="url(#tx-grain)" opacity=".4"/><text x="26" y="72" font-family="Georgia,serif" font-style="italic" font-size="34" fill="#6a5738">Gracias,</text><text x="26" y="118" font-family="Georgia,serif" font-style="italic" font-size="28" fill="#6a5738">de corazón ♡</text></g>`;
      s += `<g filter="url(#ds)">${place('gipsofila', 160, 730, 130, 30, rnd)}${place('lavanda', 1060, 250, 120, -30, rnd)}</g>`;
      return s;
    },
    bench(rnd) {
      let s = background('wood', 1000, 1250, 45);
      s += sheet(90, 640, 460, 340, -6, '#F6F0E0');
      s += `<g font-family="Georgia,serif" font-style="italic" font-size="26" fill="#6a5738" transform="rotate(-6 320 800)"><text x="120" y="720">Cuaderno de taller</text><path d="M120,740L500,740" stroke="#C9B48A"/><text x="120" y="790" font-size="21">14 jun · nomeolvides secas ✓</text><text x="120" y="830" font-size="21">resina, 2 capas, luz UV 4 min</text><text x="120" y="870" font-size="21">pulido grano 2000 → 3000</text></g>`;
      s += `<g filter="url(#ds)"><path d="M660,120L840,120L830,430Q828,470 790,470L710,470Q672,470 670,430Z" fill="#fff" fill-opacity=".4" stroke="#fff" stroke-width="3"/><g>${place('lavanda', 720, 300, 120, 0, rnd)}${place('gipsofila', 790, 330, 100, 20, rnd)}${place('margarita', 750, 420, 46, 0, rnd)}</g><rect x="654" y="102" width="192" height="26" rx="6" fill="#B08D57"/></g>`;
      s += `<g filter="url(#ds)"><rect x="80" y="140" width="460" height="380" rx="30" fill="#DCE4DA"/></g><rect x="80" y="140" width="460" height="380" rx="30" fill="#DCE4DA" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>`;
      [[190, 250], [310, 250], [430, 250], [190, 380], [310, 380], [430, 380]].forEach((c, i) => {
        s += `<circle cx="${c[0]}" cy="${c[1]}" r="52" fill="#C3CEC1" stroke="#A9B7A7" stroke-width="3"/>`;
        if (i < 4) s += piece({ shape: 'circle', cx: c[0], cy: c[1], w: 92, h: 92, seed: 70 + i, flowers: [['nomeolvides', 'gipsofila'], ['margarita', 'helecho'], ['rosa', 'eucalipto'], ['hortensia', 'gipsofila']][i], kind: 'single', bezel: 'none' });
      });
      s += tweezers(180, 560, -14);
      s += piece({ shape: 'drop', cx: 690, cy: 700, w: 210, h: 300, seed: 81, flowers: ['nomeolvides', 'gipsofila', 'helecho'], kind: 'cluster', bezel: 'gold', rot: 12 });
      s += piece({ shape: 'circle', cx: 720, cy: 1000, w: 230, h: 230, seed: 82, flowers: ['margarita', 'lavanda'], kind: 'cluster', bezel: 'gold', rot: -6 });
      s += `<g filter="url(#ds)"><rect x="110" y="1010" width="360" height="130" rx="12" fill="#EDE4CE" transform="rotate(4 290 1075)"/><rect x="110" y="1010" width="360" height="130" rx="12" fill="none" stroke="#C7B892" transform="rotate(4 290 1075)"/><text x="150" y="1085" font-family="Georgia,serif" font-style="italic" font-size="30" fill="#6a5738" transform="rotate(4 290 1075)">hecho a mano, una a una</text></g>`;
      s += `<g filter="url(#ds)">${place('eucalipto', 480, 570, 120, 80, rnd)}${place('calendula', 520, 1110, 60, 0, rnd)}</g>`;
      return s;
    }
  };
  A.scene = function (name) {
    const key = 'scene:' + name;
    if (A._c[key]) return A._c[key];
    const isBench = name === 'bench';
    const W = isBench ? 1000 : 1200, H = isBench ? 1250 : 900;
    A._c[key] = uri(wrap(W, H, SCENES[name](rng(name.length * 13 + 5))));
    return A._c[key];
  };
  A.scenes = Object.keys(SCENES);
})();
