/* ==========================================================================
   AURA FLOWERS · CATÁLOGO
   --------------------------------------------------------------------------
   AÑADIR UNA PIEZA NUEVA
   1. Sube sus fotos a assets/productos/ (verticales, mínimo 900 px de ancho).
   2. Copia un bloque { ... } de "productos", pégalo ARRIBA del todo (las más
      nuevas primero) y cambia sus datos. Separa cada bloque con una coma.
   3. "id": único, en minúsculas y con guiones (se usa en el enlace de la pieza:
      producto.html?id=tu-id → ideal para anuncios).
   4. "foco" (opcional): qué parte de la foto se prioriza al recortarla en la
      tarjeta, p. ej. "50% 40%" (horizontal vertical).

   ESTADO DE CADA PIEZA
   · estado: "disponible"   → se puede comprar.
   · estado: "agotado"      → se muestra "Vendida", no se puede comprar y la
                              pieza sigue visible como parte del portfolio.
   · estado: "proximamente" → se muestra "Próximamente" con botón "Avísame".
   · stock: unidades disponibles. Si llega a 0, la pieza se muestra vendida.
     Con stock: 1 aparece la etiqueta "Pieza única".

   Si tienes conectado Google Sheets (CONFIGURACION.md), el stock y el estado
   de la hoja "Stock" mandan sobre lo que pongas aquí y se actualizan solos
   con cada pedido.
   ========================================================================== */

window.AURA_CATALOGO = {

  categorias: [
    { id: "collares", nombre: "Collares" },
    { id: "pendientes", nombre: "Pendientes" },
    { id: "anillos", nombre: "Anillos" },
    { id: "regalos", nombre: "Para regalar" }
  ],

  productos: [
    {
      id: "colgante-orquidea-fucsia",
      nombre: "Colgante Orquídea Fucsia",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      destacado: true,
      etiqueta: "Firma de la casa",
      foco: "50% 42%",
      imagenes: ["assets/productos/colgante-orquidea-fucsia.jpg", "assets/hero/colgante-orquidea-fucsia.jpg"],
      resumen: "Una orquídea Phalaenopsis fucsia, entera y natural, preservada en resina sobre cadena dorada.",
      descripcion: "Una orquídea de un fucsia intenso, con el corazón lleno de detalles y las venas de sus pétalos intactas. Preservada a mano para que su color no se apague, cuelga de una fina cadena dorada. Grande, luminosa y única.",
      materiales: { "Flor": "Orquídea Phalaenopsis natural", "Cadena": "Dorada", "Acabado": "Resina con protección UV" }
    },
    {
      id: "collar-orquidea-burdeos",
      nombre: "Collar Orquídea Burdeos",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      destacado: true,
      etiqueta: "Nueva",
      foco: "50% 45%",
      imagenes: ["assets/productos/collar-orquidea-burdeos.jpg"],
      resumen: "Una orquídea Cymbidium burdeos en collar en Y, con cadena dorada de pequeñas mariposas.",
      descripcion: "Una orquídea Cymbidium de color burdeos, con sus cinco pétalos abiertos y el centro moteado, preservada en resina. Se lleva en un collar en Y con cadena dorada salpicada de mariposas que cae con delicadeza sobre el escote.",
      materiales: { "Flor": "Orquídea Cymbidium natural", "Cadena": "Dorada con mariposas, en Y", "Acabado": "Resina con protección UV" }
    },
    {
      id: "conjunto-orquidea-burdeos",
      nombre: "Conjunto Orquídea Burdeos",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      foco: "50% 35%",
      imagenes: ["assets/productos/conjunto-orquidea-burdeos.jpg"],
      resumen: "Collar de orquídea burdeos con doble cadena y anillo en forma de gota con pétalos de orquídea.",
      descripcion: "Un conjunto pensado para llevar juntos: una orquídea burdeos natural en collar de doble cadena larga y un anillo en forma de gota con pétalos de la misma orquídea encapsulados. Dos piezas que nacen de la misma flor.",
      materiales: { "Flor": "Orquídea Cymbidium natural", "Incluye": "Collar y anillo en gota", "Acabado": "Resina con protección UV" }
    },
    {
      id: "collar-rosa-eterna",
      nombre: "Collar Rosa Eterna",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      destacado: true,
      foco: "50% 45%",
      imagenes: ["assets/productos/collar-rosa-eterna.jpg", "assets/ig/ig-03.jpg"],
      resumen: "Una rosa natural preservada en collar en Y, con cadena dorada de corazones.",
      descripcion: "Una rosa natural de color vino, con sus pétalos y hojas intactos, preservada para que dure para siempre. Cuelga de un collar en Y con cadena dorada salpicada de corazones. Una pieza que habla de amor y de recuerdos que no se marchitan.",
      materiales: { "Flor": "Rosa natural", "Cadena": "Dorada con corazones, en Y", "Acabado": "Resina con protección UV" }
    },
    {
      id: "collar-narciso",
      nombre: "Collar Narciso",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      foco: "55% 45%",
      imagenes: ["assets/productos/collar-narciso.jpg"],
      resumen: "Un narciso blanco natural con corazón dorado, sobre collar largo de doble cadena.",
      descripcion: "Un narciso de pétalos blancos y corazón amarillo, preservado a mano con todo su volumen. Se lleva sobre una cadena larga doble, como un lazo, para un look luminoso y primaveral.",
      materiales: { "Flor": "Narciso natural", "Cadena": "Dorada, doble y larga", "Acabado": "Resina con protección UV" }
    },
    {
      id: "colgante-narciso-libelula",
      nombre: "Colgante Narciso y Libélula",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      foco: "50% 50%",
      imagenes: ["assets/productos/colgante-narciso-libelula.jpg"],
      resumen: "Un narciso natural dentro de un aro dorado, con una libélula dorada colgando.",
      descripcion: "Un narciso natural enmarcado en un gran aro dorado, del que cuelga una libélula de alas texturizadas. Una pieza escultórica y llena de luz, para quien quiere llevar la primavera puesta.",
      materiales: { "Flor": "Narciso natural", "Detalles": "Aro y libélula dorados", "Acabado": "Resina con protección UV" }
    },
    {
      id: "colgante-buganvilla",
      nombre: "Colgante Buganvilla",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      foco: "40% 45%",
      imagenes: ["assets/productos/colgante-buganvilla.jpg"],
      resumen: "Una bráctea de buganvilla natural bajo un disco dorado martelé y un aro fino.",
      descripcion: "La flor de las paredes mediterráneas, convertida en joya: una bráctea de buganvilla fucsia con todas sus venas, colgando de un aro fino y un disco dorado martelé. Ligero, moderno y lleno de verano.",
      materiales: { "Flor": "Buganvilla natural", "Detalles": "Disco martelé y aro dorados", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-jardin-azul",
      nombre: "Pendientes Jardín Azul",
      categoria: "pendientes",
      estado: "disponible",
      stock: 1,
      destacado: true,
      foco: "50% 42%",
      imagenes: ["assets/productos/pendientes-jardin-azul.jpg"],
      resumen: "Diminutas flores blancas sobre pétalos azules, en círculo de resina con borde dorado.",
      descripcion: "Un pequeño cielo en cada pendiente: flores blancas diminutas sobre pétalos azules, encapsuladas en un círculo de resina con borde dorado y botón martelé. Cada pendiente es ligeramente distinto, como en la naturaleza.",
      materiales: { "Flores": "Flores blancas y pétalos azules", "Herrajes": "Botón martelé dorado", "Acabado": "Resina con protección UV" }
    },
    {
      id: "anillo-cielo-azul",
      nombre: "Anillo Cielo Azul",
      categoria: "anillos",
      estado: "disponible",
      stock: 1,
      foco: "50% 38%",
      imagenes: ["assets/productos/anillo-cielo-azul.jpg", "assets/ig/ig-11.jpg"],
      resumen: "Pétalos azules y destellos dorados en un gran cabujón ovalado, sobre aro ajustable.",
      descripcion: "Un cabujón ovalado lleno de pétalos azules y toques dorados, sobre un aro ajustable dorado. Parece un pequeño cielo de noche en tu mano.",
      materiales: { "Flores": "Pétalos azules naturales", "Talla": "Ajustable", "Aro": "Dorado" }
    },
    {
      id: "anillos-perla-granate",
      nombre: "Anillos Pétalo",
      categoria: "anillos",
      estado: "disponible",
      stock: 1,
      foco: "45% 55%",
      imagenes: ["assets/productos/anillos-perla-granate.jpg", "assets/ig/ig-08.jpg"],
      resumen: "Anillos finos con una esfera de resina con pétalos en rosa, granate o bicolor.",
      descripcion: "Anillos finos y ajustables con una pequeña esfera de resina que guarda pétalos naturales en tonos rosa, granate o bicolor. Se combinan entre sí para crear tu propia colección.",
      materiales: { "Flores": "Pétalos naturales", "Talla": "Ajustable", "Aro": "Dorado" }
    },
    {
      id: "colgante-orquidea-lila",
      nombre: "Colgante Orquídea Lila",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      imagenes: ["assets/aura/collar-orquidea.jpg"],
      resumen: "Una orquídea lila entera, tal y como la creó la naturaleza, en colgante de acero.",
      descripcion: "Una orquídea natural entera, con sus pétalos lilas y su corazón magenta, preservada en resina para que su color no se apague. La flor favorita de Amanda convertida en joya.",
      materiales: { "Flor": "Orquídea Phalaenopsis natural", "Cadena": "Acero inoxidable", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-margarita-lila",
      nombre: "Pendientes Margarita Lila",
      categoria: "pendientes",
      estado: "disponible",
      stock: 1,
      imagenes: ["assets/ig/ig-07.jpg"],
      resumen: "Dos margaritas lilas enteras en resina transparente, con brillo de cristal.",
      descripcion: "Dos margaritas de color lila, enteras y con todos sus pétalos, en resina transparente sobre botón dorado.",
      materiales: { "Flor": "Margaritas lilas naturales", "Herrajes": "Acero inoxidable bañado en oro", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-margaritas",
      nombre: "Pendientes Margaritas",
      categoria: "pendientes",
      estado: "disponible",
      stock: 1,
      imagenes: ["assets/ig/ig-04.jpg"],
      resumen: "Margaritas naturales de verdad, ligeras como un día de primavera.",
      descripcion: "Pequeñas margaritas naturales, recogidas y secadas a mano, con su centro dorado y sus pétalos blancos.",
      materiales: { "Flor": "Margaritas naturales", "Herrajes": "Acero inoxidable bañado en oro", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-jardin-rosa",
      nombre: "Pendientes Jardín Rosa",
      categoria: "pendientes",
      estado: "disponible",
      stock: 1,
      imagenes: ["assets/ig/ig-05.jpg"],
      resumen: "Florecillas rosas y helecho en un círculo de resina con borde dorado.",
      descripcion: "Un pequeño jardín en cada pendiente: florecillas rosas y hojas de helecho dentro de un círculo de resina con borde dorado.",
      materiales: { "Flores": "Flores rosas y helecho", "Forma": "Círculo con borde dorado", "Herrajes": "Acero inoxidable bañado en oro" }
    },
    {
      id: "pendientes-gota-flor-blanca",
      nombre: "Pendientes Gota Flor Blanca",
      categoria: "pendientes",
      estado: "disponible",
      stock: 1,
      imagenes: ["assets/ig/ig-09.jpg"],
      resumen: "Aro dorado en forma de gota con diminutas flores blancas en resina.",
      descripcion: "Un aro dorado en forma de gota del que cuelga un círculo de resina con diminutas flores blancas y un toque verde.",
      materiales: { "Flores": "Flores blancas y hojas verdes", "Herrajes": "Acero inoxidable bañado en oro" }
    },
    {
      id: "caja-regalo-flores",
      nombre: "Caja Regalo Flores",
      categoria: "regalos",
      estado: "disponible",
      stock: 1,
      etiqueta: "Lista para regalar",
      foco: "50% 70%",
      imagenes: ["assets/productos/caja-regalo.jpg", "assets/productos/caja-regalo-2.jpg", "assets/ig/ig-10.jpg"],
      resumen: "Tu pieza en caja de regalo atada con cordel y decorada con gipsófila seca.",
      descripcion: "Cada pieza de Aura Flowers puede viajar en su caja de regalo blanca, atada a mano con cordel de algodón y un ramito de gipsófila seca. Lista para regalar, o para regalarte.",
      materiales: { "Incluye": "Pendientes + caja de regalo", "Presentación": "Cordel de algodón y flores secas" }
    }
  ]
};
