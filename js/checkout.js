/* ==========================================================================
   AURA FLOWERS · Checkout
   Carrito → Datos → Envío → Pago → Confirmación
   · Con pedidos.endpoint configurado: el pedido se guarda en Google Sheets,
     se descuenta el stock y se envían los emails (ver backend/).
   · Sin endpoint: el pedido completo se envía a Aura Flowers por WhatsApp.
   ========================================================================== */
(function () {
  "use strict";
  var A = window.Aura, $ = A.$, $$ = A.$$, esc = A.esc, get = A.get;
  var form = $("[data-form]"), stepsNav = $$("[data-steps] li");
  var step = 1, sending = false;
  var ENDPOINT = get("pedidos.endpoint");

  var PROVINCIAS = ["A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Jaén", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Melilla", "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Bizkaia", "Zamora", "Zaragoza"];
  // Prefijo del código postal (01–52) → provincia
  var CP_PROV = { "01": "Álava", "02": "Albacete", "03": "Alicante", "04": "Almería", "05": "Ávila", "06": "Badajoz", "07": "Baleares", "08": "Barcelona", "09": "Burgos", "10": "Cáceres", "11": "Cádiz", "12": "Castellón", "13": "Ciudad Real", "14": "Córdoba", "15": "A Coruña", "16": "Cuenca", "17": "Girona", "18": "Granada", "19": "Guadalajara", "20": "Gipuzkoa", "21": "Huelva", "22": "Huesca", "23": "Jaén", "24": "León", "25": "Lleida", "26": "La Rioja", "27": "Lugo", "28": "Madrid", "29": "Málaga", "30": "Murcia", "31": "Navarra", "32": "Ourense", "33": "Asturias", "34": "Palencia", "35": "Las Palmas", "36": "Pontevedra", "37": "Salamanca", "38": "Santa Cruz de Tenerife", "39": "Cantabria", "40": "Segovia", "41": "Sevilla", "42": "Soria", "43": "Tarragona", "44": "Teruel", "45": "Toledo", "46": "Valencia", "47": "Valladolid", "48": "Bizkaia", "49": "Zamora", "50": "Zaragoza", "51": "Ceuta", "52": "Melilla" };

  /* ---------- Datos guardados del formulario (solo en esta sesión) ---------- */
  var saved = A.SS.get("aura_checkout", {});
  function field(n) { return form.elements[n]; }
  function val(n) { var f = field(n); return f ? String(f.value || "").trim() : ""; }
  function persist() {
    var d = {};
    ["nombre", "apellidos", "email", "telefono", "direccion", "cp", "ciudad", "pais", "provincia", "paisOtro", "notas", "pago"].forEach(function (n) { d[n] = n === "pago" ? payChoice() : val(n); });
    A.SS.set("aura_checkout", d);
  }

  /* ---------- Provincia / país ---------- */
  var prov = field("provincia"), pais = field("pais"), provWrap = $("[data-prov-wrap]"), otroWrap = $("[data-otro-pais]");
  function fillProvinces() {
    var es = pais.value === "España";
    provWrap.querySelector("label").innerHTML = es ? "Provincia <i>*</i>" : "Provincia / región";
    if (es) {
      prov.outerHTML = '<select id="f-provincia" name="provincia" autocomplete="address-level1" required><option value="">Elige…</option>' +
        PROVINCIAS.slice().sort(function (a, b) { return a.localeCompare(b, "es"); }).map(function (p) { return "<option>" + p + "</option>"; }).join("") + "</select>";
    } else {
      prov.outerHTML = '<input id="f-provincia" name="provincia" autocomplete="address-level1" maxlength="80">';
    }
    prov = field("provincia");
    otroWrap.hidden = pais.value !== "Otro";
    field("paisOtro").required = pais.value === "Otro";
  }
  pais.addEventListener("change", function () { fillProvinces(); persist(); });
  form.addEventListener("input", function (e) {
    var f = e.target.closest(".field"); if (f) f.classList.remove("has-error");
    if (e.target.name === "cp" && pais.value === "España") {
      var cp = e.target.value.replace(/\D/g, "");
      if (cp.length >= 2 && CP_PROV[cp.slice(0, 2)] && prov.tagName === "SELECT") prov.value = CP_PROV[cp.slice(0, 2)];
    }
    persist();
  });
  form.addEventListener("change", persist);

  /* ---------- Métodos de pago ---------- */
  var payOpts = $("[data-pay-opts]");
  var METHODS = [];
  if (get("pagos.bizum.activo") !== false) METHODS.push({ id: "bizum", nombre: "Bizum", txt: "Pago inmediato desde la app de tu banco, con tu número de pedido como concepto." });
  if (get("pagos.transferencia.activo") !== false) METHODS.push({ id: "transferencia", nombre: "Transferencia bancaria", txt: "Transferencia a la cuenta de Aura Flowers indicando tu número de pedido." });
  payOpts.innerHTML = METHODS.map(function (m, i) {
    return '<label class="pay-opt"><input type="radio" name="pago" value="' + m.id + '"' + ((saved.pago ? saved.pago === m.id : i === 0) ? " checked" : "") + '><span class="dot"></span><span><strong>' + m.nombre + "</strong><small>" + m.txt + '</small></span><span class="pay-logo">' + (m.id === "bizum" ? "BIZUM" : "IBAN") + "</span></label>";
  }).join("");
  function payChoice() { var r = form.querySelector('input[name="pago"]:checked'); return r ? r.value : ""; }
  function payName(id) { var m = METHODS.filter(function (x) { return x.id === id; })[0]; return m ? m.nombre : id; }
  var horas = get("pedidos.horasConfirmacion");
  $("[data-horas]").textContent = horas ? "en un máximo de " + horas + " horas" : "lo antes posible";

  // Restaurar datos
  if (saved.pais) pais.value = saved.pais;
  fillProvinces();
  Object.keys(saved).forEach(function (k) { if (k !== "pago" && k !== "pais" && field(k) && saved[k]) field(k).value = saved[k]; });

  /* ---------- Paso 1: líneas del carrito y resumen ---------- */
  function renderLines() {
    var list = A.cart.detail(), el = $("[data-lines]"), next = $('[data-step="1"] [data-next]');
    if (!list.length) {
      el.innerHTML = '<div class="empty" style="padding:40px 0"><img src="assets/brand/aura-orquidea-dorado.png" alt="" width="70" height="65"><h3>Tu carrito está vacío</h3><p>Descubre las piezas disponibles ahora.</p><a class="btn btn--line" href="index.html#coleccion">Ver la colección</a></div>';
      next.hidden = true;
    } else {
      next.hidden = false;
      el.innerHTML = list.map(function (x) {
        return '<div class="line"><a href="producto.html?id=' + esc(x.p.id) + '"><img src="' + esc(x.p.imagenes[0]) + '" alt="' + esc(x.p.nombre) + '"></a><div>' +
          "<h3>" + esc(x.p.nombre) + '</h3><p class="meta">' + esc(A.catName(x.p.categoria)) + (x.s.unica ? " · Pieza única" : " · " + x.s.stock + " disponibles") + "</p>" +
          '<div class="line-row"><div class="qty"><button type="button" data-q="-1" data-id="' + esc(x.p.id) + '" aria-label="Quitar una"' + (x.qty <= 1 ? " disabled" : "") + ">−</button><span>" + x.qty + '</span><button type="button" data-q="1" data-id="' + esc(x.p.id) + '" aria-label="Añadir una"' + (x.qty >= x.s.stock ? " disabled" : "") + '>+</button></div><button type="button" class="remove" data-rm="' + esc(x.p.id) + '">Eliminar</button></div></div></div>';
      }).join("");
    }
    renderSummary();
  }
  function renderSummary() {
    var list = A.cart.detail();
    $("[data-summary-items]").innerHTML = list.length ? list.map(function (x) {
      return '<div class="s-item"><img src="' + esc(x.p.imagenes[0]) + '" alt=""><div><h3>' + esc(x.p.nombre) + "</h3><span>" + esc(A.catName(x.p.categoria)) + '</span></div><span class="q">× ' + x.qty + "</span></div>";
    }).join("") : '<p style="padding:16px 0;color:var(--muted);font-size:14px">Sin piezas todavía.</p>';
    $("[data-summary-toggle]").textContent = "Ver detalle (" + A.cart.count() + ")";
  }
  $("[data-lines]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-q]"); if (b) { var id = b.getAttribute("data-id"); A.cart.set(id, A.cart.qty(id) + Number(b.getAttribute("data-q"))); return; }
    var r = e.target.closest("[data-rm]"); if (r) A.cart.remove(r.getAttribute("data-rm"));
  });
  document.addEventListener("aura:cart", function () { if (step < 5) renderLines(); });
  document.addEventListener("aura:stock", function () {
    if (step >= 5) return;
    renderLines();
  });
  var summary = $("[data-summary]");
  $("[data-summary-toggle]").addEventListener("click", function () { summary.classList.toggle("is-collapsed"); });
  if (innerWidth < 900) summary.classList.add("is-collapsed");

  /* ---------- Validación ---------- */
  function check(n, ok) {
    var f = field(n); if (!f) return true;
    var wrap = f.closest(".field");
    var good = ok !== undefined ? ok : f.checkValidity() && (!f.required || val(n) !== "");
    if (wrap) wrap.classList.toggle("has-error", !good);
    return good;
  }
  function validate(s, quiet) {
    var bad = [];
    if (s === 1) return A.cart.count() > 0;
    if (s === 2) {
      ["nombre", "apellidos"].forEach(function (n) { if (!check(n)) bad.push(n); });
      if (!check("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("email")))) bad.push("email");
      if (!check("telefono", val("telefono").replace(/\D/g, "").length >= 9)) bad.push("telefono");
    }
    if (s === 3) {
      ["direccion", "ciudad"].forEach(function (n) { if (!check(n)) bad.push(n); });
      var cpOk = pais.value === "España" ? /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(val("cp")) : val("cp").length >= 3;
      if (!check("cp", cpOk)) bad.push("cp");
      if (pais.value === "España" && !check("provincia", val("provincia") !== "")) bad.push("provincia");
      if (pais.value === "Otro" && !check("paisOtro", val("paisOtro") !== "")) bad.push("paisOtro");
    }
    if (s === 4) {
      var acc = form.elements.acepto.checked;
      $("[data-accept-err]").hidden = acc;
      if (!acc || !payChoice()) bad.push("acepto");
    }
    if (!quiet && bad.length && field(bad[0]) && field(bad[0]).focus) field(bad[0]).focus();
    return !bad.length;
  }

  /* ---------- Navegación entre pasos ---------- */
  function go(n, push) {
    step = n;
    $$(".co-step", form).forEach(function (s) { s.classList.toggle("is-active", Number(s.getAttribute("data-step")) === n); });
    stepsNav.forEach(function (li, i) { li.classList.toggle("is-done", i + 1 < n); li.classList.toggle("is-current", i + 1 === n); });
    if (n === 4) renderReview();
    if (push !== false) try { history.pushState({ paso: n }, "", "#paso-" + n); } catch (e) {}
    var top = $(".co-steps").getBoundingClientRect().top + scrollY - 20;
    if (scrollY > top) scrollTo({ top: top, behavior: A.reduce ? "auto" : "smooth" });
    var h = $('[data-step="' + n + '"] h1, [data-step="' + n + '"] h2'); if (h && n > 1) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  addEventListener("popstate", function (e) {
    if (step === 5) return;
    var n = (e.state && e.state.paso) || 1;
    go(Math.min(n, 4), false);
  });
  form.addEventListener("click", function (e) {
    if (e.target.closest("[data-next]")) {
      if (!validate(step)) return;
      if (step === 1) A.track("begin_checkout", { items: items() });
      go(step + 1);
    } else if (e.target.closest("[data-prev]")) {
      go(Math.max(1, step - 1));
    } else if (e.target.closest("[data-edit]")) {
      go(Number(e.target.closest("[data-edit]").getAttribute("data-edit")));
    }
  });
  payOpts.addEventListener("change", function () { A.track("add_payment_info", { pago: payChoice(), items: items() }); });

  function items() { return A.cart.detail().map(function (x) { return { item_id: x.p.id, item_name: x.p.nombre, quantity: x.qty }; }); }
  function paisFinal() { return pais.value === "Otro" ? val("paisOtro") : pais.value; }

  function renderReview() {
    var addr = esc(val("direccion")) + "<br>" + esc(val("cp")) + " " + esc(val("ciudad")) + (val("provincia") ? " (" + esc(val("provincia")) + ")" : "") + "<br>" + esc(paisFinal());
    $("[data-review]").innerHTML =
      '<div class="review-block"><h3>Contacto <button type="button" data-edit="2">Editar</button></h3>' + esc(val("nombre")) + " " + esc(val("apellidos")) + "<br>" + esc(val("email")) + " · " + esc(val("telefono")) + "</div>" +
      '<div class="review-block"><h3>Envío <button type="button" data-edit="3">Editar</button></h3>' + addr + (val("notas") ? '<br><span style="color:var(--muted)">Notas: ' + esc(val("notas")) + "</span>" : "") + "</div>";
  }

  /* ---------- Pedido ---------- */
  function orderNumber() {
    var d = new Date(), chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", r = "";
    for (var i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
    var pad = function (x) { return ("0" + x).slice(-2); };
    return (get("pedidos.prefijo") || "AF") + "-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + r;
  }
  function buildOrder() {
    return {
      numero: orderNumber(),
      fecha: new Date().toISOString(),
      estado: "Pendiente de confirmación",
      cliente: { nombre: val("nombre"), apellidos: val("apellidos"), email: val("email"), telefono: val("telefono") },
      envio: { direccion: val("direccion"), ciudad: val("ciudad"), cp: val("cp"), provincia: val("provincia"), pais: paisFinal() },
      pago: payChoice(),
      items: A.cart.detail().map(function (x) { return { id: x.p.id, nombre: x.p.nombre, cantidad: x.qty }; }),
      notas: val("notas"),
      origen: A.SS.get("aura_src", {}),
      web: location.origin + location.pathname.replace(/checkout\.html$/, ""),
      empresa: val("empresa") // campo trampa anti-spam
    };
  }
  function orderText(o) {
    var f = new Date(o.fecha);
    return "¡Hola Aura Flowers! 🌸 Quiero hacer este pedido:\n\n" +
      "Pedido: " + o.numero + "\nFecha: " + f.toLocaleDateString("es-ES") + " " + f.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) + "\n\n" +
      "PIEZAS\n" + o.items.map(function (i) { return "• " + i.cantidad + " × " + i.nombre + " (" + i.id + ")"; }).join("\n") + "\n\n" +
      "MIS DATOS\n" + o.cliente.nombre + " " + o.cliente.apellidos + "\n" + o.cliente.email + "\n" + o.cliente.telefono + "\n\n" +
      "ENVÍO\n" + o.envio.direccion + "\n" + o.envio.cp + " " + o.envio.ciudad + (o.envio.provincia ? " (" + o.envio.provincia + ")" : "") + "\n" + o.envio.pais + "\n\n" +
      "PAGO: " + payName(o.pago) + (o.notas ? "\n\nNOTAS: " + o.notas : "") +
      "\n\n¿Me confirmáis disponibilidad, importe total y envío? ¡Gracias!";
  }
  function trackOrder(o) {
    A.track("order", { numero: o.numero, pago: o.pago, items: o.items.map(function (i) { return { item_id: i.id, item_name: i.nombre, quantity: i.cantidad }; }) });
  }

  function showError(msg) { $("[data-submit-err]").innerHTML = msg ? '<div class="co-error" role="alert">' + msg + "</div>" : ""; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    if (!validate(4)) return;
    if (!validate(2, true)) { go(2); validate(2); return; }
    if (!validate(3, true)) { go(3); validate(3); return; }
    if (!A.cart.count()) { go(1); return; }
    var removed = A.cart.clean();
    if (removed.length) { go(1); A.toast("Se han retirado piezas que ya no están disponibles."); return; }
    showError("");
    var order = buildOrder();
    if (order.empresa) return;
    delete order.empresa;
    if (ENDPOINT) sendToServer(order); else prepareWhatsApp(order);
  });

  function setSending(on) {
    sending = on;
    var b = $("[data-submit]");
    b.disabled = on;
    b.innerHTML = on ? '<span class="spinner"></span> Enviando pedido…' : 'Enviar pedido <i class="arr"></i>';
  }

  function sendToServer(order) {
    setSending(true);
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { ctrl && ctrl.abort(); }, 25000);
    fetch(ENDPOINT, { method: "POST", body: JSON.stringify(order), signal: ctrl && ctrl.signal })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        clearTimeout(t); setSending(false);
        if (res && res.ok) {
          order.numero = res.pedido || order.numero;
          trackOrder(order);
          A.cart.clear(); A.forgetStock(); A.SS.del("aura_checkout");
          done(order, true);
        } else if (res && res.error === "sin_stock") {
          A.forgetStock();
          var names = (res.items || []).map(function (id) { var p = A.product(id); return p ? p.nombre : id; }).join(", ");
          (res.items || []).forEach(function (id) { A.cart.remove(id); });
          A.syncStock();
          go(1);
          $("[data-lines]").insertAdjacentHTML("afterbegin", '<div class="co-error" role="alert" style="margin-bottom:10px">Lo sentimos, estas piezas se acaban de vender y se han retirado de tu carrito: ' + esc(names) + ".</div>");
        } else {
          showError("No hemos podido registrar tu pedido. Puedes intentarlo de nuevo o enviárnoslo por WhatsApp.");
          offerWhatsApp(order);
        }
      })
      .catch(function () {
        clearTimeout(t); setSending(false);
        showError("Parece que hay un problema de conexión y el pedido no se ha registrado. Puedes intentarlo de nuevo o enviárnoslo por WhatsApp.");
        offerWhatsApp(order);
      });
  }
  function offerWhatsApp(order) {
    var u = A.wa(orderText(order)); if (!u) return;
    $("[data-submit-err]").insertAdjacentHTML("beforeend", '<a class="btn btn--line btn--full" style="margin-top:10px" target="_blank" rel="noopener" href="' + esc(u) + '">Enviar pedido por WhatsApp</a>');
  }

  // Sin servidor: el pedido queda preparado y el cliente lo envía por WhatsApp
  function prepareWhatsApp(order) {
    A.SS.set("aura_pending_order", order);
    done(order, false);
  }

  /* ---------- Paso 5 ---------- */
  function payBlock(o) {
    var P = get("pagos") || {}, rows = [], title;
    if (o.pago === "bizum") {
      title = "Pago por Bizum";
      if (P.bizum && P.bizum.telefono) { rows.push(["Teléfono", P.bizum.telefono, true]); if (P.bizum.titular) rows.push(["Titular", P.bizum.titular]); }
    } else {
      title = "Pago por transferencia";
      if (P.transferencia && P.transferencia.iban) {
        rows.push(["IBAN", P.transferencia.iban, true]);
        if (P.transferencia.titular) rows.push(["Titular", P.transferencia.titular]);
        if (P.transferencia.banco) rows.push(["Banco", P.transferencia.banco]);
      }
    }
    var body = rows.length
      ? "<dl>" + rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + (r[2] ? ' <button type="button" class="copy" data-copy="' + esc(r[1]) + '">Copiar</button>' : "") + "</dd>"; }).join("") +
        "<dt>Concepto</dt><dd>" + esc(o.numero) + ' <button type="button" class="copy" data-copy="' + esc(o.numero) + '">Copiar</button></dd></dl>' +
        '<p style="margin-top:12px;color:var(--muted);font-size:13px">Espera a recibir nuestra confirmación con el importe total antes de pagar' + (P.plazoPagoHoras ? ". Después tendrás " + P.plazoPagoHoras + " horas para realizar el pago" : "") + ".</p>"
      : '<p style="color:var(--ink-2)">Te enviaremos los datos de pago junto con la confirmación del importe total. Usa <b>' + esc(o.numero) + "</b> como concepto.</p>";
    if (P.instrucciones) body += '<p style="margin-top:10px;color:var(--ink-2)">' + esc(P.instrucciones) + "</p>";
    return '<div class="paydata"><h3>' + title + "</h3>" + body + "</div>";
  }

  function done(o, registered) {
    var el = $("[data-done]"), nombre = esc(o.cliente.nombre);
    var next = '<ol class="next-steps">' +
      "<li><b>1</b><span><strong>Te confirmamos tu pedido</strong>Revisamos tus piezas y te enviamos el importe total con el envío por email o WhatsApp" + (horas ? " (máx. " + horas + " h)" : "") + ".</span></li>" +
      "<li><b>2</b><span><strong>Realizas el pago</strong>Por " + esc(payName(o.pago)) + ", indicando tu número de pedido como concepto.</span></li>" +
      "<li><b>3</b><span><strong>Preparamos tu pieza</strong>La envolvemos con mimo y te enviamos el número de seguimiento.</span></li></ol>";
    var mark = '<div class="done-mark"><svg viewBox="0 0 30 30"><path d="M6 15.5l6 6L24 9"/></svg></div>';

    if (registered) {
      el.innerHTML = '<div class="done">' + mark +
        "<h2>¡Gracias, " + nombre + '!</h2><p class="sub" style="margin:10px 0 0">Hemos recibido tu pedido correctamente.</p>' +
        '<span class="order-no">Pedido ' + esc(o.numero) + "</span>" +
        '<p style="color:var(--ink-2)">Te hemos enviado un email a <b>' + esc(o.cliente.email) + "</b> con el resumen. Si no lo ves, revisa la carpeta de spam.</p>" +
        next + payBlock(o) + '<a class="btn btn--line" href="index.html">Volver a Aura Flowers</a></div>';
    } else {
      var u = A.wa(orderText(o));
      el.innerHTML = '<div class="done">' + mark +
        "<h2>Casi listo, " + nombre + '</h2><p class="sub" style="margin:10px 0 0">Tu pedido está preparado. <b>Falta un último paso:</b> envíanoslo por WhatsApp.</p>' +
        '<span class="order-no">Pedido ' + esc(o.numero) + "</span>" +
        '<a class="btn btn--gold btn--full" data-send-wa target="_blank" rel="noopener" href="' + esc(u) + '">Enviar mi pedido por WhatsApp <i class="arr"></i></a>' +
        '<p style="margin-top:12px;font-size:13px;color:var(--muted)">Se abrirá WhatsApp con todos los datos de tu pedido ya escritos: solo tienes que pulsar enviar. Tu pedido no queda registrado hasta que lo envíes.</p>' +
        '<div data-after-wa hidden><div class="notice" style="text-align:left"><span>✦</span><p><b>¿No se ha abierto WhatsApp?</b> Copia tu pedido y envíanoslo por Instagram' + (get("contacto.email") ? " o por email a " + esc(get("contacto.email")) : "") + '. <button type="button" class="copy" data-copy-order>Copiar pedido</button></p></div></div>' +
        next + payBlock(o) + '<a class="btn btn--line" href="index.html">Volver a Aura Flowers</a></div>';
      var btn = $("[data-send-wa]", el);
      btn.addEventListener("click", function () {
        trackOrder(o);
        A.cart.clear(); A.SS.del("aura_checkout");
        $("[data-after-wa]", el).hidden = false;
        btn.innerHTML = 'Abrir WhatsApp de nuevo <i class="arr"></i>';
      });
      $("[data-copy-order]", el).addEventListener("click", function () { copy(orderText(o)); });
    }
    go(5, false);
    try { history.replaceState({ paso: 5 }, "", "#pedido-" + o.numero); } catch (e) {}
  }

  function copy(text) {
    var ok = function () { A.toast("Copiado"); };
    var fallback = function () { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); ok(); } catch (e) {} t.remove(); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  }
  $("[data-done]").addEventListener("click", function (e) { var c = e.target.closest("[data-copy]"); if (c) copy(c.getAttribute("data-copy")); });

  /* ---------- Inicio ---------- */
  renderLines();
  var pending = A.SS.get("aura_pending_order", null);
  if (pending && /#pedido-/.test(location.hash) && !ENDPOINT) done(pending, false);
  else { go(1, false); try { history.replaceState({ paso: 1 }, "", location.pathname); } catch (e) {} }
})();
