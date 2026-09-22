# Aura Flowers

Web de **Aura Flowers**: flores naturales convertidas en joyas y regalos hechos a mano por Amanda en Lloret de Mar.
Sitio estático (HTML, CSS y JavaScript sin dependencias), publicado con GitHub Pages desde la rama `main`.

**Web:** https://durducco-source.github.io/aura-flowers-web/

## Dónde se edita cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| WhatsApp, Instagram, email, precio "desde", envío gratis, formas de pago | `js/config.js` |
| Piezas del catálogo (nombre, precio, foto, textos), galería y preguntas frecuentes | `js/data.js` |
| Textos de las secciones (portada, marca, regalar, a medida…) | `index.html` |
| Colores, tipografías y diseño | `css/styles.css` (variables al principio) |

## Añadir una pieza

1. Guarda la foto en `assets/` (vertical 4:5, mínimo 800 px de ancho).
2. En `js/data.js`, copia un bloque de `productos`, pégalo debajo y cambia sus datos.
3. Para marcarla como agotada: `disponible: false`.

## Fotos

- `assets/aura/` y `assets/ig/`: fotos reales de Aura Flowers.
- `assets/img/`: fotografías de ambiente (Unsplash, licencia libre) para la portada y las secciones.
- Las fotos de Instagram son de baja resolución (360×640): conviene sustituirlas por los originales para que las fichas se vean aún más nítidas.

La versión anterior de la web (con tienda, carrito y editor `admin.html`) sigue disponible en el historial de Git.
