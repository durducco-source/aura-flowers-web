# Aura Flowers

Tienda online de **Aura Flowers**: joyería artesanal con flores naturales, hecha a mano por Amanda en Lloret de Mar.
Web estática (HTML, CSS y JavaScript, sin dependencias) publicada con GitHub Pages desde la rama `main`.

**Web:** https://durducco-source.github.io/aura-flowers-web/

📣 **Kit de anuncios (diseños, textos, enlaces y segmentación):** https://durducco-source.github.io/aura-flowers-web/anuncios/ — archivos en `anuncios/`

➡️ **Qué falta configurar (pagos, pedidos, píxeles, datos legales): [CONFIGURACION.md](CONFIGURACION.md)**

## Páginas

| Página | Para qué |
|---|---|
| `index.html` | Portada, colección, historia, taller, a medida, Instagram, preguntas y contacto |
| `producto.html?id=ID` | Ficha de cada pieza (enlace ideal para anuncios) |
| `checkout.html` | Carrito → datos → envío → pago → confirmación |
| `legal.html` | Aviso legal, condiciones de venta, privacidad y cookies |

## Dónde se edita cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Piezas: fotos, nombre, descripción, categoría, stock, estado (disponible / agotado / próximamente) | `js/productos.js` |
| WhatsApp, redes sociales, datos de Bizum/IBAN, conexión de pedidos, píxeles, datos legales | `js/config.js` |
| Textos de la portada y la historia | `index.html` |
| Colores, tipografías y diseño | `css/aura.css` (variables al principio) |
| Backend de pedidos (Google Sheets) | `backend/google-apps-script/Code.gs` |

## Añadir una pieza nueva (2 minutos)

1. Sube sus fotos a `assets/productos/` (verticales 4:5, mínimo 1000 px de ancho).
2. En `js/productos.js`, copia un bloque `{ ... }`, pégalo arriba del todo y cambia sus datos.
3. `estado: "disponible"`, `stock: 1` (pieza única). Guarda y sube el cambio.
4. Si usas Google Sheets, añade también una fila en la hoja **Stock** con el mismo `id`.

## Marcar una pieza como vendida

- **Con Google Sheets conectado:** se marca sola como `agotado` al recibir el pedido. También puedes cambiar la columna *Estado* de la hoja **Stock**.
- **Sin Google Sheets:** en `js/productos.js`, cambia `estado: "agotado"` (o `stock: 0`).

La pieza sigue visible en la web con la etiqueta **AGOTADO**, sin botón de compra, como parte del archivo de Aura Flowers.

## Fotos

- `assets/brand/`: logotipo real (dorado y marfil con fondo transparente), favicon e imagen para compartir.
- `assets/hero/`, `assets/taller/`: fotos de la portada, del taller y de ambiente.
- `assets/historia/`: fotos de infancia (solo se usan en la historia).
- `assets/aura/`, `assets/ig/`: fotos de las piezas. Las de `assets/ig/` son de baja resolución (360×640); conviene sustituirlas por fotos originales.
