# Guía para las próximas webs

Todo lo que se diseñó, se decidió y se aprendió creando **Aura Flowers**, para reutilizarlo en las webs de otros clientes.
Web de referencia: https://durducco-source.github.io/aura-flowers-web/

> Cómo usarla: en una conversación nueva con Claude, di *«usa como base la web de Aura Flowers y su GUIA-PROXIMAS-WEBS.md»* e indica la carpeta `Descargas\aura-flowers-web` o el repositorio.

---

## 1. Forma de trabajar (checklist de entrega)

1. **Analizar primero** la web actual del cliente y conservar lo que funciona.
2. **Fotos reales siempre**, nunca de banco. Optimizarlas (JPG de 900–1080 px de ancho, 50–300 KB).
3. **Logo real** con fondo transparente, en versión dorada y en versión clara para fondos oscuros.
4. **No simular nada**: si algo necesita cuenta, servidor o pago (pedidos, pagos, anuncios), dejarlo preparado y explicar qué falta.
5. **No inventar datos**: IBAN, Bizum, NIF o IDs de píxeles se dejan como campos vacíos en `js/config.js`.
6. **Guardar y publicar**: copia en `Descargas\<proyecto>`, `git push` a GitHub y esperar a que GitHub Pages termine de publicar.
7. **Comprobar en el enlace real** en móvil (375 px) y en ordenador: nada descuadrado, ninguna imagen rota, sin errores, botones y checkout funcionando.
8. **Entregar**: enlace a la web, enlace al repositorio, ubicación de la copia local y lista de lo que falta configurar.

## 2. Estilo visual «joyería artesanal de lujo»

| Elemento | Decisión |
|---|---|
| Colores | Marfil `#f8f4ed`, papel `#fffdf9`, tinta `#241d1a`, dorado `#a8823a`, dorado claro `#f3dfb4` |
| Tipografías | Cormorant Garamond (títulos, cursivas doradas) + Jost (textos y botones en mayúsculas espaciadas) |
| Formas | Marcos en **arco** para fotos y vídeo, líneas doradas finas, rombos como viñetas |
| Fotos | Grandes, verticales (formato 3:4 en tarjetas); encuadre por pieza con `foco` |
| Texto | Poco y evocador. Titulares cortos con una parte en cursiva dorada |
| Botones | Relleno que sube al pasar el ratón, flecha que se alarga |

Todo se cambia en las variables al principio de `css/aura.css`.

## 3. Estructura de la portada (en este orden)

1. **Intro**: el logo aparece y se desvanece (solo en la primera visita de la sesión).
2. **Portada con vídeo**:
   - En móvil el vídeo ocupa toda la pantalla.
   - En ordenador va nítido en un arco central, con el mismo vídeo desenfocado de fondo. Así un vídeo vertical no se ve borroso ni recortado.
   - Encima, solo lo imprescindible: una línea pequeña, el titular y un botón.
   - Botón «Activar sonido» con barras animadas; la música entra y sale con fundido.
   - Al hacer scroll el vídeo se reduce y la sección siguiente sube por encima con bordes redondeados.
3. **Sección de marca**: logo, frase, carrusel de fotos en arco y sello giratorio («Piezas únicas · Flores naturales · Hecho a mano»).
4. **Cinta** en movimiento con los valores de la marca.
5. **Colección** (tienda o portfolio).
6. **Manifiesto** a pantalla completa con parallax.
7. **Historia** en capítulos I–V, con fotos tipo polaroid (infancia, familia, primeras piezas, hoy) y una línea dorada que avanza con el scroll.
8. **El taller**: 4 pasos del proceso con foto.
9. **A medida**: fondo oscuro, 3 pasos y botón a WhatsApp.
10. **Instagram**: vídeo destacado propio y un carrusel infinito de fotos.
11. **Preguntas frecuentes** y **contacto**.

Animaciones: aparición al hacer scroll, fotos que se destapan de abajo arriba, parallax suave, titulares palabra a palabra y pétalos flotando. Todo respeta la opción del sistema «reducir movimiento».

## 4. Tienda sin precios (y portfolio)

- **Sin precios en ninguna parte.** El importe se confirma al cliente después del pedido.
- **Estados por pieza** en `js/productos.js`: `disponible`, `agotado` (se muestra «Vendida») y `proximamente` (botón «Avísame»). Con `stock: 1` aparece la etiqueta «Pieza única».
- **Las piezas vendidas no se borran**: siguen como portfolio, con la foto a todo color, una etiqueta discreta y el botón «Encargar una similar» (WhatsApp).
- **Si todo está vendido**, aparece solo el aviso «Estas piezas ya tienen dueña… encarga la tuya» y se ocultan los filtros que quedarían vacíos.
- **Ficha por pieza** `producto.html?id=...`, pensada como destino de anuncios.
- **Carrito** lateral y **checkout en 5 pasos**:
  - Pasos: carrito → datos → envío → pago (Bizum o transferencia) → confirmación.
  - Valida los campos y rellena la provincia a partir del código postal.
- **Pedidos sin servidor**: el pedido completo se envía por WhatsApp. Es honesto: no queda registrado hasta que el cliente lo envía.
- **Pedidos con servidor (gratis)**: Google Sheets + Apps Script (`backend/google-apps-script/Code.gs`). Guarda los pedidos, descuenta el stock, marca las piezas como vendidas y envía emails. Instrucciones en `CONFIGURACION.md`.

## 5. Preparada para anuncios

- Los IDs de Meta Pixel, TikTok Pixel, Google Analytics 4 y Google Ads se pegan en `js/config.js`. Solo se cargan si el visitante acepta las cookies.
- Eventos ya preparados: vista de pieza, añadir al carrito, inicio del pedido, método de pago y pedido realizado.
- Se guarda el origen de cada visita (UTM, fbclid, gclid, ttclid) junto al pedido.
- **Kit de anuncios** (`/anuncios/`):
  - Diseños en 5 formatos: feed 4:5, story 9:16, cuadrado, horizontal 1200×628 y Pinterest 2:3.
  - 4 vídeos para Reels con los textos en la zona segura.
  - Textos con contador de caracteres, enlaces con UTM, público, calendario (San Valentín, Sant Jordi, Día de la Madre, bodas, Navidad) y pasos para publicar.
- **Importante**: los anuncios los publica y paga el cliente desde sus cuentas. Cuando una pieza se vende, hay que cambiar el enlace del anuncio.

## 6. Música y derechos

- **Nunca** usar canciones de la biblioteca de Instagram o TikTok en la web: su licencia solo vale dentro de esas apps.
- Usar música con licencia para web, por ejemplo Pixabay Music (uso comercial gratis, sin atribución obligatoria). En Aura Flowers: «Chillout Lounge» de Good_B_Music.
- La música va en un archivo aparte (`.m4a`, fragmento de 1 minuto en bucle, menos de 1 MB) y suena solo si el visitante la activa.
- Si un vídeo es una colaboración con otra cuenta, confirmar que esa persona está de acuerdo.
- Pedir siempre permiso antes de descargar archivos de terceros.

## 7. Vídeo de calidad

- Pedir siempre el **archivo original** (exportado de CapCut o del móvil, enviado como documento o por Drive). WhatsApp lo comprime a unos 480×850 y se ve borroso.
- Si solo está en Instagram, el reel suele tener versión de 1080p (pedir permiso antes de descargarla).
- Convertir a **MP4 H.264** (los vídeos HEVC/H.265 de iPhone y CapCut no funcionan en todos los navegadores). Hacer dos versiones:
  - **1080p para ordenador** (~4 Mbps).
  - **720p para móvil** (~2,3 Mbps).
- Herramienta: `herramientas/convertir-video.html`.

## 8. Herramientas incluidas (`herramientas/`)

Este ordenador no tiene Python, Node ni ffmpeg, así que todo se hace con PowerShell y con el navegador.

| Archivo | Para qué |
|---|---|
| `convertir-video.html` | Cualquier vídeo → MP4 H.264 1080p + 720p + portada. Se abre en Chrome o Edge; el vídeo no se sube a ningún sitio |
| `recortar-musica.html` | Recorta una pista, añade fundidos y la comprime a `.m4a` |
| `logo-transparente.ps1` | Quita el fondo liso de un logo y genera versiones dorada y marfil, el símbolo solo, el texto solo y el favicon |
| `fotos-productos.ps1`, `fotos-recortar.ps1` | Convierte WEBP/PNG a JPG optimizado y recorta collages en fotos sueltas |
| `imagen-compartir.ps1` | Imagen para compartir en redes (1200×630) e icono para móvil |
| `anuncios-generador.cs` + `anuncios-crear.ps1` | Genera los 25 diseños de anuncios (5 ideas × 5 formatos) con fotos, logo y textos |
| `servidor-local.ps1` | Servidor de pruebas local. Permite que las páginas del navegador guarden archivos generados en el proyecto |

Los scripts `.ps1` tienen las rutas de Aura Flowers escritas dentro: hay que cambiarlas por las del nuevo proyecto. Si contienen tildes, guárdalos en UTF-8 con BOM.

## 9. Qué suele faltar configurar (preguntar al cliente)

- Bizum (teléfono y titular) e IBAN.
- Datos legales: titular, NIF, domicilio y email. Son obligatorios para vender en España.
- Conexión con Google Sheets para los pedidos.
- IDs de los píxeles y de Google Ads.
- Enlaces de TikTok, Facebook y Pinterest.
- Qué piezas están disponibles y cuáles vendidas.
- Fotos originales en buena calidad.
