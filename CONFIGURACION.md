# Aura Flowers · Configuración pendiente

La web ya funciona y se puede comprar de principio a fin. Esto es lo que **todavía tienes que configurar tú**, porque son datos o cuentas tuyas que no se pueden inventar.

## Cómo funciona hoy (sin configurar nada)

GitHub Pages solo sirve páginas estáticas: **no tiene servidor ni base de datos**. Por eso, mientras no conectes el paso 2:

1. El cliente elige sus piezas, rellena nombre, apellidos, teléfono, email, dirección, ciudad, código postal, provincia y país, y elige Bizum o transferencia.
2. Al pulsar **Enviar pedido**, se abre WhatsApp con el pedido completo ya escrito (número de pedido, piezas, cantidades, datos, dirección, método de pago y fecha). El cliente solo pulsa enviar.
3. Tú recibes el pedido en tu WhatsApp **+34 633 84 70 52**, confirmas el importe y le pasas los datos de pago.

⚠️ En este modo **el pedido no queda guardado en ningún sitio hasta que el cliente envía el WhatsApp**, y **el stock no se descuenta solo**: cuando vendas una pieza, márcala como agotada en `js/productos.js` (`estado: "agotado"`).

---

## 1. Datos de pago (Bizum y transferencia) · 2 minutos

En `js/config.js` → `pagos`:

```js
bizum: { activo: true, telefono: "TU TELÉFONO BIZUM", titular: "TU NOMBRE" },
transferencia: { activo: true, iban: "ES00 0000 ...", titular: "TU NOMBRE", banco: "" },
```

Si los dejas vacíos, al cliente se le dice que recibirá los datos de pago junto con la confirmación. Con ellos rellenos, aparecen en la pantalla final con botón de copiar y el número de pedido como concepto.

> Bizum y la transferencia **no se pueden cobrar automáticamente desde una web**: no existe una API pública de Bizum para particulares. Siempre tendrás que comprobar en tu banco que el pago ha llegado y entonces marcar el pedido como *Pagado*. Si en el futuro quieres cobro automático con tarjeta, hace falta una pasarela (Stripe, Redsys de tu banco o Shopify Payments) y **precios en la web**, porque una pasarela no puede cobrar sin un importe.

## 2. Guardar pedidos y descontar stock automáticamente (recomendado) · 15 minutos, gratis

Usa **Google Sheets + Google Apps Script** como backend. Con esto:
- cada pedido se guarda en una hoja **Pedidos** (con fecha, estado, cliente, dirección, teléfono, email, piezas, cantidades, método de pago y origen de la campaña);
- el stock de la hoja **Stock** se descuenta solo y las piezas que llegan a 0 pasan a **agotado** automáticamente en la web;
- recibes un email por cada pedido y el cliente recibe otro con el resumen e instrucciones de pago;
- si dos personas intentan comprar la misma pieza única, la segunda recibe un aviso y no se registra.

Pasos:
1. Entra en https://sheets.google.com con la cuenta de Google de Aura Flowers y crea una hoja nueva llamada *Aura Flowers · Pedidos*.
2. Menú **Extensiones → Apps Script**. Borra lo que haya y pega el contenido completo de `backend/google-apps-script/Code.gs`.
3. Rellena el bloque `AJUSTES` del principio (email de avisos, Bizum, IBAN, titular). Guarda (icono del disquete).
4. Arriba, elige la función **prepararHojas** y pulsa **Ejecutar**. Google te pedirá permisos: acéptalos (es tu propio script). Se crearán las hojas *Pedidos* y *Stock* con las piezas actuales.
5. **Implementar → Nueva implementación →** tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Copia la URL que termina en `/exec` y pégala en `js/config.js`:
   ```js
   pedidos: { endpoint: "https://script.google.com/macros/s/XXXX/exec", ... }
   ```
7. Sube el cambio a GitHub. Haz un pedido de prueba y comprueba que aparece en la hoja y que te llega el email.

Gestión diaria: en la hoja **Pedidos** cambia la columna *Estado* (Pendiente de confirmación → Confirmado · esperando pago → Pagado → Enviado → Entregado / Cancelado). En la hoja **Stock** puedes cambiar unidades y estado de cualquier pieza; la web lo lee al cargar. Si cancelas un pedido, vuelve a subir el stock a mano.

**Cada pieza nueva** debe estar en `js/productos.js` (fotos y textos) **y** en la hoja *Stock* (mismo `id`).

> Si cambias `Code.gs`, tienes que hacer **Implementar → Gestionar implementaciones → Editar → Nueva versión** para que se aplique.

## 3. Píxeles y analítica para campañas

En `js/config.js` → `seguimiento`, pega **solo el ID**:

| Herramienta | Dónde se consigue | Campo |
|---|---|---|
| Meta Pixel (Instagram/Facebook) | Meta Business Suite → Administrador de eventos → Orígenes de datos | `metaPixelId` |
| Google Analytics 4 | analytics.google.com → Administrar → Flujos de datos (empieza por `G-`) | `googleAnalyticsId` |
| Google Ads | Google Ads → Objetivos → Conversiones → etiqueta (`AW-…` y la etiqueta de conversión) | `googleAdsId`, `googleAdsEtiquetaPedido` |
| TikTok Pixel | TikTok Ads Manager → Herramientas → Eventos → Web | `tiktokPixelId` |

En cuanto pongas cualquier ID, aparece automáticamente el aviso de cookies y los píxeles solo se cargan si el visitante acepta (obligatorio en la UE).

Eventos que ya envía la web: vista de pieza (`ViewContent`/`view_item`), añadir al carrito (`AddToCart`), inicio del pedido (`InitiateCheckout`), elección de pago (`AddPaymentInfo`) y pedido realizado (Meta `Lead` + evento propio `PedidoRealizado`, GA4 `purchase`, TikTok `PlaceAnOrder`, conversión de Google Ads). Como la web no muestra precios, los eventos no llevan importe.

**Enlaces para anuncios:** enlaza cada anuncio a la ficha de la pieza y añade parámetros UTM, por ejemplo:
`https://durducco-source.github.io/aura-flowers-web/producto.html?id=colgante-orquidea-lila&utm_source=instagram&utm_medium=paid&utm_campaign=orquideas`
El origen de la campaña se guarda con cada pedido (columna *Origen* de la hoja).

## 4. Redes sociales

En `js/config.js` → `redes`, pega las URL de **TikTok**, **Facebook** y **Pinterest** cuando las tengas. Los botones aparecen solos; vacíos, no se muestran. Instagram ya está configurado (@aura_flowers21).

## 5. Datos legales (obligatorio para vender)

En `js/config.js` → `legal`: nombre completo o razón social, NIF, domicilio y email. Mientras estén vacíos, la página legal muestra «pendiente de completar». Te recomiendo que un asesor revise `legal.html` (condiciones de venta, desistimiento y privacidad) antes de lanzar campañas.

## 6. Recomendado

- **Email de contacto** en `contacto.email` (aparece en el pie y en la confirmación).
- **Fotos de producto nuevas**: las de `assets/ig/` son de 360×640 píxeles y se ven algo blandas en pantallas grandes. Sustitúyelas por las originales (mínimo 1000 px de ancho).
- **Dominio propio** (p. ej. auraflowers.es): da más confianza en los anuncios. Se configura en GitHub → Settings → Pages → Custom domain. Si lo cambias, actualiza `marca.url` en `js/config.js`, las URL de `index.html` (canonical y og:image) y `sitemap.xml`.
- **Google Search Console**: da de alta la web y envía `sitemap.xml`.
- **Revisa el stock** de cada pieza en `js/productos.js`: ahora todas están como pieza única (`stock: 1`).
