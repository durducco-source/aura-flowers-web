# Aura Flowers · Web de joyería artesanal

Web estática (HTML + CSS + JS), sin instalación. Abre `index.html` o sirve la carpeta con cualquier hosting estático (Netlify, Vercel, GitHub Pages…).

## Estructura
- `index.html` — esqueleto (cabecera, menú, carrito, pie).
- `css/styles.css` — todo el diseño (paleta y tipografías en `:root`).
- `js/config.js` — **datos de la marca**: nombre, Instagram, email, WhatsApp, envío gratis, código promo, fotos propias.
- `js/data.js` — **contenido**: productos, proceso, historias, reseñas, FAQ, tarifas de envío.
- `js/art.js` — generador de las ilustraciones de ejemplo (se pueden ignorar cuando uses fotos reales).
- `js/app.js` — rutas, tienda, ficha de producto, carrito, checkout, formularios.
- `serve.ps1` — servidor local opcional para Windows (`powershell -File serve.ps1` → http://localhost:5173).

## Poner tus fotos y vídeos reales
1. Copia los archivos a `assets/`.
2. **Portada, retrato y proceso**: en `js/config.js` → `photos` (`hero`, `heroMobile`, `creator`, `process[0..5]`).
3. **Productos**: en `js/data.js`, añade a cada producto `images: ['assets/collar-1.jpg', 'assets/collar-2.jpg', 'assets/collar-3.jpg', 'assets/collar-4.jpg']` (4 fotos: principal, detalle, ambiente y extra).
4. **Instagram**: `photos.instagram` acepta fotos (`'assets/ig1.jpg'`) o vídeos (`{ video: 'assets/ig2.mp4', poster: 'assets/ig2.jpg' }`). Para una tira de reels verticales: `photos.reels = [{ src: 'assets/reel1.mp4', poster: '...' }]`.
   Formatos recomendados: fotos JPG/WebP ≤ 400 KB; vídeos MP4 (H.264) cortos y sin sonido.

## Antes de publicar
- **Pagos**: la web NO cobra. Cada compra se envía como "solicitud de pedido" (por Instagram, WhatsApp si lo configuras, o a tu `formEndpoint`) y el pago (Bizum, PayPal, transferencia) se acuerda después. Para cobrar en la propia web hay que conectar Stripe Checkout o PayPal.
- **Formularios**: pega la URL de Formspree/Getform/Basin en `formEndpoint` (`config.js`). Sin ella, los mensajes solo se guardan en el navegador.
- **Stock**: se controla con `stock` en cada producto. Al vender una pieza única hay que actualizarlo (con un backend real se automatiza).
- **Textos de ejemplo**: reseñas, historias y datos de contacto son de ejemplo. Sustitúyelos por los reales. Revisa también envíos, devoluciones y políticas legales (aviso legal, privacidad, cookies).
- Comprueba el usuario de Instagram, el email y el WhatsApp en `config.js`.

## Contenido real de Instagram (@aura_flowers21)
- `assets/ig/ig-01.jpg … ig-11.jpg`: miniaturas de 360×640 descargadas del perfil público (con permiso de la autora). Se usan en la sección Instagram (`photos.instagram` y `photos.reels` en `js/config.js`), cada una enlaza a su publicación.
- `ig-02.jpg` es un collage personal y no se usa en la web.
- Son de baja resolución: para portada, fichas de producto y vídeos hacen falta los archivos originales.

## Versión personalizada para Amanda (Aura Flowers)
- Historia y datos reales: creadora **Amanda**, taller en **Lloret de Mar**, orquídeas Cattleya de Cuba (fuente: presentación de su tienda de Etsy).
- Catálogo con sus fotos reales de Instagram. **Nombres y precios son provisionales**: confírmalos en `js/data.js` (name, price, stock). Su tienda de Etsy no tiene aún artículos publicados, por eso no hay precios reales que copiar.
- **Reseñas**: la sección está oculta hasta que haya opiniones reales (`SV.reviews` en `js/data.js`).
- **Contacto**: email y WhatsApp están vacíos en `js/config.js`; no se muestran hasta que los rellenes. Ahora mismo el contacto es por Instagram.
- Revisa envíos, plazos, umbral de envío gratis, código `AURA10` y textos legales antes de publicar.
- Mejora pendiente: fotos originales en alta resolución (las de Instagram son miniaturas de 360×640), vídeos de los reels y una foto de portada real.
