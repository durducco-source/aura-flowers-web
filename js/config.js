/* ==========================================================
   AURA FLOWERS · Configuración de la marca
   Todo lo que necesitas cambiar para hacerla tuya está aquí.
   ========================================================== */
window.SV = {
  brand: 'Aura Flowers',
  tagline: 'Joyería botánica',
  creator: 'Amanda',                      // creadora y artesana
  city: 'Lloret de Mar',
  instagram: 'aura_flowers21',   // usuario de Instagram (sin @)
  email: '',                             // ← pon aquí su email real (si está vacío no se muestra)
  whatsapp: '',                          // ← con prefijo de país, sin + (p. ej. 34600123456). Vacío = no se muestra
  demo: true,                            // (en desuso) el pago se acuerda tras confirmar el pedido
  freeShippingFrom: 70,                  // envío gratis en España a partir de (€)

  /* Formularios: pega aquí la URL de tu endpoint (Formspree, Getform, Basin…).
     Si está vacío, la web funciona en modo demostración y guarda el mensaje en el navegador. */
  formEndpoint: '',

  promo: { code: 'AURA10', pct: 10 },

  /* ── FOTOGRAFÍAS PROPIAS ─────────────────────────────────
     Mientras estén en null, la web usa las ilustraciones de ejemplo.
     Para usar tus fotos: copia los archivos a /assets y escribe la ruta,
     p. ej.  hero: 'assets/portada.jpg'                                 */
  photos: {
    hero: 'assets/aura/ella-espaldas.jpg',   // foto de la portada (cuadrada o vertical)
    heroMobile: null,      // portada móvil (vertical, 2:3)
    creator: 'assets/ig/ig-01.jpg',   // retrato de Amanda (sustituir por una foto en alta resolución)
    process: ['assets/aura/orquideas-mesa.jpg', null, null, null, 'assets/aura/collar-orquidea.jpg', null], // 6 fotos del proceso (4:3); null = ilustración
    // Cuadrícula de Instagram (6): {img, href}. Puedes usar {video, poster, href} para vídeos.
    instagram: [
      { img: 'assets/ig/ig-06.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/Db9DN8BiWmf/', alt: 'Flor de orquídea encapsulada en resina' },
      { img: 'assets/ig/ig-03.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DZYOJOmi8QK/', alt: 'Rosa preservada en collar con cadena dorada' },
      { img: 'assets/ig/ig-05.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DcGXQXEqncV/', alt: 'Pendientes redondos con flores secas en resina' },
      { img: 'assets/ig/ig-07.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DZqXknVizhz/', alt: 'Pendientes con margarita morada en resina' },
      { img: 'assets/ig/ig-08.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DZdmEl-C7SU/', alt: 'Anillos de resina con flores en una mano' },
      { img: 'assets/ig/ig-11.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DYhBfWRicv3/', alt: 'Anillo ovalado con flores azules en resina' }
    ],
    // Tira vertical (9:16) bajo la cuadrícula: {img|src, poster, href}
    reels: [
      { img: 'assets/ig/ig-04.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DcLUJV3CDBl/', alt: 'Pendientes de margaritas naturales' },
      { img: 'assets/ig/ig-10.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DYpg5l6CsyH/', alt: 'Caja de regalo con gipsofila seca' },
      { img: 'assets/ig/ig-09.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DZN-Mu8id9Y/', alt: 'Pendientes de flores en resina' },
      { img: 'assets/ig/ig-01.jpg', href: 'https://www.instagram.com/aura_flowers21/reel/DcgFKEJCL7K/', alt: 'Colgante de margarita y una flor de hibisco' }
    ]
  }
};
