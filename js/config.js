/* ==========================================================================
   AURA FLOWERS · CONFIGURACIÓN
   Datos de contacto y de pedidos. Respeta las comillas "" y las comas.
   Si dejas un valor vacío (""), lo que depende de él se oculta solo.
   ========================================================================== */

window.AURA_CONFIG = {

  marca: {
    nombre: "Aura Flowers",
    creadora: "Amanda",
    ciudad: "Lloret de Mar",
    url: "https://durducco-source.github.io/aura-flowers-web"
  },

  /* Precio de entrada que se destaca en toda la web */
  precioDesde: 25,

  contacto: {
    // WhatsApp: número internacional sin "+" ni espacios
    whatsapp: "34633847052",
    // Cómo se muestra el teléfono
    telefono: "+34 633 84 70 52",
    // Usuario de Instagram sin @
    instagram: "aura_flowers21",
    // Email público (vacío = no se muestra)
    email: ""
  },

  pedidos: {
    // Envío gratuito en España a partir de este importe (€). 0 = no se muestra.
    envioGratisDesde: 70,
    // Formas de pago que se acuerdan al confirmar el pedido
    pagos: ["Bizum", "PayPal", "transferencia"]
  },

  analitica: {
    // Google Analytics 4 (empieza por "G-"). Vacío = desactivado.
    googleAnalyticsId: ""
  },

  legal: {
    nombreCompleto: "",
    nif: ""
  }
};
