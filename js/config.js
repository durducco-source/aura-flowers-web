/* ==========================================================================
   AURA FLOWERS · CONFIGURACIÓN
   --------------------------------------------------------------------------
   Todo lo que Aura Flowers puede cambiar sin tocar el diseño.
   · Respeta las comillas "" y las comas del final de cada línea.
   · Un valor vacío ("") desactiva / oculta lo que depende de él.
   · NUNCA pongas aquí contraseñas ni claves privadas: este archivo es público.
   Guía completa: CONFIGURACION.md
   ========================================================================== */

window.AURA_CONFIG = {

  marca: {
    nombre: "Aura Flowers",
    creadora: "Amanda",
    ciudad: "Lloret de Mar",
    url: "https://durducco-source.github.io/aura-flowers-web"
  },

  contacto: {
    // WhatsApp: número internacional sin "+" ni espacios
    whatsapp: "34633847052",
    telefono: "+34 633 84 70 52",
    // Email público de atención al cliente (vacío = no se muestra)
    email: ""
  },

  /* Redes sociales: pega la URL completa del perfil. Vacío = el botón no aparece. */
  redes: {
    instagram: "https://www.instagram.com/aura_flowers21/",
    instagramUsuario: "aura_flowers21",
    // Reel destacado en la sección de Instagram (enlace de la publicación). Vacío = no se muestra.
    reelDestacado: "https://www.instagram.com/p/DYVdzbTidy3/",
    tiktok: "",      // p. ej. "https://www.tiktok.com/@tu_usuario"
    facebook: "",    // p. ej. "https://www.facebook.com/tu_pagina"
    pinterest: ""
  },

  /* ------------------------------------------------------------------------
     PEDIDOS
     endpoint: URL de la "Aplicación web" de Google Apps Script que guarda los
     pedidos en Google Sheets y descuenta el stock (ver CONFIGURACION.md, paso 2).
     Mientras esté vacío, el cliente completa todo el checkout y el pedido se
     envía a Aura Flowers por WhatsApp con todos sus datos (no se simula nada).
     ------------------------------------------------------------------------ */
  pedidos: {
    endpoint: "",
    prefijo: "AF",
    // Horas en las que Aura Flowers se compromete a confirmar el pedido
    horasConfirmacion: 24
  },

  /* ------------------------------------------------------------------------
     PAGOS · Bizum y transferencia bancaria
     Rellena estos datos cuando quieras que aparezcan en la confirmación del
     pedido. Si están vacíos, al cliente se le indica que los recibirá junto
     con la confirmación (por email o WhatsApp).
     ------------------------------------------------------------------------ */
  pagos: {
    bizum: {
      activo: true,
      telefono: "",        // Teléfono asociado a Bizum de Aura Flowers
      titular: ""          // Nombre que verá el cliente al enviar el Bizum
    },
    transferencia: {
      activo: true,
      iban: "",            // IBAN de la cuenta de Aura Flowers
      titular: "",         // Titular de la cuenta
      banco: ""            // Opcional
    },
    // Texto adicional que se muestra junto a las instrucciones de pago (opcional)
    instrucciones: "",
    // Plazo para realizar el pago una vez confirmado el pedido
    plazoPagoHoras: 48
  },

  /* ------------------------------------------------------------------------
     SEGUIMIENTO Y PUBLICIDAD
     Pega solo el ID (no el script completo). Solo se cargan si el visitante
     acepta las cookies en el aviso que aparece automáticamente.
     ------------------------------------------------------------------------ */
  seguimiento: {
    metaPixelId: "",               // Meta (Facebook/Instagram) Pixel, p. ej. "123456789012345"
    googleAnalyticsId: "",         // Google Analytics 4, empieza por "G-"
    googleAdsId: "",               // Google Ads, empieza por "AW-"
    googleAdsEtiquetaPedido: "",   // Etiqueta de la conversión "Pedido" de Google Ads
    tiktokPixelId: ""              // TikTok Pixel
  },

  /* Datos legales (obligatorios en una tienda online en España: LSSI-CE). */
  legal: {
    titular: "",       // Nombre y apellidos o razón social
    nif: "",
    domicilio: "",
    email: ""
  }
};
