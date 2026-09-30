/* ==========================================================================
   AURA FLOWERS · Backend de pedidos con Google Sheets (Google Apps Script)
   --------------------------------------------------------------------------
   Qué hace:
   · Recibe los pedidos de la web (checkout.html) y los guarda en la hoja "Pedidos".
   · Comprueba el stock en la hoja "Stock" y lo descuenta. Si una pieza llega
     a 0 unidades, la marca como "agotado" automáticamente (la web la muestra
     como AGOTADO y deja de poder comprarse).
   · Envía un email a Aura Flowers con el pedido y otro al cliente con el
     resumen y las instrucciones de pago.
   · Devuelve el stock actual a la web (la web lo consulta al cargar).

   Instalación: sigue CONFIGURACION.md (paso 2). En resumen:
   1. Crea una Hoja de cálculo de Google → Extensiones → Apps Script.
   2. Pega este archivo completo, rellena AJUSTES y guarda.
   3. Ejecuta una vez la función "prepararHojas" (acepta los permisos).
   4. Implementar → Nueva implementación → Aplicación web
      · Ejecutar como: Yo   · Quién tiene acceso: Cualquier usuario
   5. Copia la URL que termina en /exec y pégala en js/config.js → pedidos.endpoint
   ========================================================================== */

const AJUSTES = {
  // Email donde Aura Flowers recibe los avisos de pedido (vacío = el de la cuenta de Google)
  emailAvisos: "",
  // Nombre que aparece como remitente en los emails al cliente
  nombreTienda: "Aura Flowers",
  // Datos de pago que se envían al cliente en el email (NO los inventes: rellénalos tú)
  bizumTelefono: "",
  bizumTitular: "",
  iban: "",
  titularCuenta: "",
  // Horas para confirmar el pedido (se menciona en el email)
  horasConfirmacion: 24,
  // WhatsApp de contacto que aparece en el email
  whatsapp: "+34 633 84 70 52"
};

// Piezas iniciales para la hoja "Stock" (mismos "id" que js/productos.js)
const PIEZAS_INICIALES = [
  ["colgante-orquidea-fucsia", "Colgante Orquídea Fucsia", 1, "disponible"],
  ["collar-orquidea-burdeos", "Collar Orquídea Burdeos", 1, "disponible"],
  ["conjunto-orquidea-burdeos", "Conjunto Orquídea Burdeos", 1, "disponible"],
  ["collar-rosa-eterna", "Collar Rosa Eterna", 1, "disponible"],
  ["collar-narciso", "Collar Narciso", 1, "disponible"],
  ["colgante-narciso-libelula", "Colgante Narciso y Libélula", 1, "disponible"],
  ["colgante-buganvilla", "Colgante Buganvilla", 1, "disponible"],
  ["pendientes-jardin-azul", "Pendientes Jardín Azul", 1, "disponible"],
  ["anillo-cielo-azul", "Anillo Cielo Azul", 1, "disponible"],
  ["anillos-perla-granate", "Anillos Pétalo", 1, "disponible"],
  ["colgante-orquidea-lila", "Colgante Orquídea Lila", 1, "disponible"],
  ["pendientes-margarita-lila", "Pendientes Margarita Lila", 1, "disponible"],
  ["pendientes-margaritas", "Pendientes Margaritas", 1, "disponible"],
  ["pendientes-jardin-rosa", "Pendientes Jardín Rosa", 1, "disponible"],
  ["pendientes-gota-flor-blanca", "Pendientes Gota Flor Blanca", 1, "disponible"],
  ["caja-regalo-flores", "Caja Regalo Flores", 1, "disponible"]
];

const HOJA_PEDIDOS = "Pedidos";
const HOJA_STOCK = "Stock";
const COLUMNAS_PEDIDOS = ["Fecha", "Nº pedido", "Estado", "Nombre", "Apellidos", "Email", "Teléfono", "Dirección", "Código postal", "Ciudad", "Provincia", "País", "Método de pago", "Piezas", "Unidades", "Notas", "Origen (campaña)", "Importe confirmado (€)", "Notas internas"];
const ESTADOS_PEDIDO = ["Pendiente de confirmación", "Confirmado · esperando pago", "Pagado", "Enviado", "Entregado", "Cancelado"];

/* ---------- Preparación (ejecutar una vez) ---------- */
function prepararHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let p = ss.getSheetByName(HOJA_PEDIDOS) || ss.insertSheet(HOJA_PEDIDOS);
  if (p.getLastRow() === 0) {
    p.appendRow(COLUMNAS_PEDIDOS);
    p.getRange(1, 1, 1, COLUMNAS_PEDIDOS.length).setFontWeight("bold").setBackground("#f3ece0");
    p.setFrozenRows(1);
  }
  const regla = SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS_PEDIDO, true).build();
  p.getRange(2, 3, 1000, 1).setDataValidation(regla);

  let s = ss.getSheetByName(HOJA_STOCK) || ss.insertSheet(HOJA_STOCK);
  if (s.getLastRow() === 0) {
    s.appendRow(["id", "Nombre", "Stock", "Estado"]);
    s.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3ece0");
    s.setFrozenRows(1);
    if (PIEZAS_INICIALES.length) s.getRange(2, 1, PIEZAS_INICIALES.length, 4).setValues(PIEZAS_INICIALES);
  }
  const reglaStock = SpreadsheetApp.newDataValidation().requireValueInList(["disponible", "agotado", "proximamente"], true).build();
  s.getRange(2, 4, 500, 1).setDataValidation(reglaStock);
}

/* ---------- GET: stock para la web ---------- */
function doGet() {
  return json({ ok: true, stock: leerStock() });
}

function leerStock() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_STOCK);
  const out = {};
  if (!s) return out;
  s.getDataRange().getValues().slice(1).forEach(function (r) {
    const id = String(r[0]).trim();
    if (id) out[id] = { stock: r[2] === "" ? "" : Number(r[2]), estado: String(r[3] || "disponible").trim().toLowerCase() };
  });
  return out;
}

/* ---------- POST: nuevo pedido ---------- */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const o = JSON.parse(e.postData.contents);
    const err = validar(o);
    if (err) return json({ ok: false, error: err });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName(HOJA_STOCK);
    const filas = hoja.getDataRange().getValues();
    const indice = {};
    filas.forEach(function (r, i) { if (i > 0) indice[String(r[0]).trim()] = i; });

    // 1. Comprobar stock de todas las piezas antes de tocar nada
    const sinStock = [];
    o.items.forEach(function (it) {
      const i = indice[it.id];
      if (i === undefined) return; // pieza sin control de stock
      const stock = filas[i][2], estado = String(filas[i][3] || "disponible").toLowerCase();
      if (estado !== "disponible" || (stock !== "" && Number(stock) < it.cantidad)) sinStock.push(it.id);
    });
    if (sinStock.length) return json({ ok: false, error: "sin_stock", items: sinStock });

    // 2. Descontar stock y marcar agotadas
    o.items.forEach(function (it) {
      const i = indice[it.id];
      if (i === undefined || filas[i][2] === "") return;
      const nuevo = Number(filas[i][2]) - it.cantidad;
      hoja.getRange(i + 1, 3).setValue(nuevo);
      if (nuevo <= 0) hoja.getRange(i + 1, 4).setValue("agotado");
    });

    // 3. Guardar el pedido
    const numero = numeroUnico(o.numero);
    const piezas = o.items.map(function (it) { return it.cantidad + " × " + it.nombre + " (" + it.id + ")"; }).join("\n");
    const unidades = o.items.reduce(function (n, it) { return n + it.cantidad; }, 0);
    const origen = o.origen ? Object.keys(o.origen).map(function (k) { return k + ": " + o.origen[k]; }).join(" | ") : "";
    ss.getSheetByName(HOJA_PEDIDOS).appendRow([
      new Date(), numero, ESTADOS_PEDIDO[0],
      o.cliente.nombre, o.cliente.apellidos, o.cliente.email, "'" + o.cliente.telefono,
      o.envio.direccion, "'" + o.envio.cp, o.envio.ciudad, o.envio.provincia, o.envio.pais,
      o.pago === "bizum" ? "Bizum" : "Transferencia bancaria", piezas, unidades, o.notas || "", origen, "", ""
    ]);

    // 4. Emails (si falla el email, el pedido ya está guardado)
    try { avisarTienda(o, numero, piezas); } catch (x) { console.error(x); }
    try { confirmarCliente(o, numero); } catch (x) { console.error(x); }

    return json({ ok: true, pedido: numero });
  } catch (x) {
    console.error(x);
    return json({ ok: false, error: "error_servidor" });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function validar(o) {
  if (!o || typeof o !== "object") return "datos_invalidos";
  if (o.empresa) return "spam";
  const c = o.cliente || {}, d = o.envio || {};
  if (!c.nombre || !c.apellidos || !c.telefono) return "faltan_datos";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email || "")) return "email_invalido";
  if (!d.direccion || !d.ciudad || !d.cp || !d.pais) return "falta_direccion";
  if (["bizum", "transferencia"].indexOf(o.pago) < 0) return "pago_invalido";
  if (!Array.isArray(o.items) || !o.items.length || o.items.length > 30) return "sin_piezas";
  for (let i = 0; i < o.items.length; i++) {
    const it = o.items[i];
    it.cantidad = Math.floor(Number(it.cantidad));
    if (!it.id || !(it.cantidad >= 1 && it.cantidad <= 20)) return "cantidad_invalida";
  }
  return "";
}

function numeroUnico(n) {
  n = String(n || "").replace(/[^A-Z0-9-]/gi, "").slice(0, 24) || "AF-" + Date.now();
  const col = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_PEDIDOS).getRange("B:B").getValues().flat();
  return col.indexOf(n) > -1 ? n + "-" + Math.floor(Math.random() * 90 + 10) : n;
}

/* ---------- Emails ---------- */
function avisarTienda(o, numero, piezas) {
  const to = AJUSTES.emailAvisos || Session.getEffectiveUser().getEmail();
  const c = o.cliente, d = o.envio;
  MailApp.sendEmail({
    to: to,
    replyTo: c.email,
    subject: "🌸 Nuevo pedido " + numero + " · " + c.nombre + " " + c.apellidos,
    body:
      "Nuevo pedido en la web de Aura Flowers\n\n" +
      "Pedido: " + numero + "\nPago: " + (o.pago === "bizum" ? "Bizum" : "Transferencia") + "\n\n" +
      "PIEZAS\n" + piezas + "\n\n" +
      "CLIENTE\n" + c.nombre + " " + c.apellidos + "\n" + c.email + "\n" + c.telefono + "\n\n" +
      "ENVÍO\n" + d.direccion + "\n" + d.cp + " " + d.ciudad + " (" + (d.provincia || "") + ")\n" + d.pais + "\n\n" +
      (o.notas ? "NOTAS\n" + o.notas + "\n\n" : "") +
      "Siguiente paso: confirma disponibilidad e importe total al cliente y cambia el estado en la hoja \"Pedidos\".\n" +
      SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });
}

function confirmarCliente(o, numero) {
  const c = o.cliente;
  let pago;
  if (o.pago === "bizum") {
    pago = AJUSTES.bizumTelefono
      ? "Bizum al teléfono " + AJUSTES.bizumTelefono + (AJUSTES.bizumTitular ? " (" + AJUSTES.bizumTitular + ")" : "") + ", con el concepto " + numero + "."
      : "Te enviaremos el número de Bizum junto con la confirmación del importe.";
  } else {
    pago = AJUSTES.iban
      ? "Transferencia al IBAN " + AJUSTES.iban + (AJUSTES.titularCuenta ? " (titular: " + AJUSTES.titularCuenta + ")" : "") + ", con el concepto " + numero + "."
      : "Te enviaremos los datos bancarios junto con la confirmación del importe.";
  }
  const lineas = o.items.map(function (it) { return "· " + it.cantidad + " × " + it.nombre; }).join("\n");
  MailApp.sendEmail({
    to: c.email,
    name: AJUSTES.nombreTienda,
    subject: "Hemos recibido tu pedido " + numero + " · Aura Flowers",
    body:
      "¡Hola " + c.nombre + "!\n\n" +
      "Gracias por tu pedido en Aura Flowers. Lo hemos recibido correctamente.\n\n" +
      "Pedido: " + numero + "\n" + lineas + "\n\n" +
      "Próximos pasos:\n" +
      "1. En un máximo de " + AJUSTES.horasConfirmacion + " horas te confirmamos el importe total con el envío.\n" +
      "2. Realizas el pago: " + pago + "\n   Por favor, espera a nuestra confirmación antes de pagar.\n" +
      "3. Preparamos tu pieza a mano y te enviamos el número de seguimiento.\n\n" +
      "Dirección de envío:\n" + o.envio.direccion + ", " + o.envio.cp + " " + o.envio.ciudad + ", " + o.envio.pais + "\n\n" +
      "¿Alguna duda? Responde a este email o escríbenos por WhatsApp al " + AJUSTES.whatsapp + ".\n\n" +
      "Con cariño,\nAmanda · Aura Flowers"
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
