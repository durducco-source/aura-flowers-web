/* ==========================================================================
   AURA FLOWERS · CATÁLOGO
   --------------------------------------------------------------------------
   AÑADIR UNA PIEZA NUEVA
   1. Sube sus fotos a assets/productos/ (verticales 4:5, mínimo 1000 px de ancho).
   2. Copia un bloque { ... } de "productos", pégalo ARRIBA del todo (las más
      nuevas primero) y cambia sus datos. Separa cada bloque con una coma.
   3. "id": único, en minúsculas y con guiones (se usa en el enlace de la pieza:
      producto.html?id=tu-id → ideal para anuncios).

   ESTADO DE CADA PIEZA
   · estado: "disponible"   → se puede comprar.
   · estado: "agotado"      → se muestra "Agotado", no se puede comprar y la
                              pieza sigue visible como parte del archivo.
   · estado: "proximamente" → se muestra "Próximamente" con botón "Avísame".
   · stock: unidades disponibles. Si llega a 0, la pieza se muestra agotada.
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
      etiqueta: "Nueva",
      imagenes: ["assets/hero/colgante-orquidea-fucsia.jpg", "assets/aura/colgante-fucsia.jpg"],
      resumen: "Una orquídea fucsia natural, entera, preservada en resina sobre doble cadena dorada.",
      descripcion: "Una orquídea de un fucsia intenso, con el corazón lleno de detalles, sobre una doble cadena dorada. Un color vibrante que recuerda a las buganvillas y a los atardeceres de verano en la Costa Brava.",
      materiales: { "Flor": "Orquídea Phalaenopsis natural", "Cadena": "Doble cadena dorada", "Acabado": "Resina con protección UV" }
    },
    {
      id: "colgante-orquidea-lila",
      nombre: "Colgante Orquídea Lila",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      destacado: true,
      etiqueta: "Firma de la casa",
      imagenes: ["assets/aura/collar-orquidea.jpg"],
      resumen: "La pieza que define a Aura Flowers: una orquídea lila entera, tal y como la creó la naturaleza.",
      descripcion: "Una orquídea natural entera, con sus pétalos lilas y su corazón magenta, preservada en resina para que su color no se apague. Grande, delicada y única: la flor favorita de Amanda convertida en joya.",
      materiales: { "Flor": "Orquídea Phalaenopsis natural", "Cadena": "Acero inoxidable", "Acabado": "Resina con protección UV" }
    },
    {
      id: "collar-rosa-eterna",
      nombre: "Collar Rosa Eterna",
      categoria: "collares",
      estado: "disponible",
      stock: 1,
      destacado: true,
      imagenes: ["assets/ig/ig-03.jpg"],
      resumen: "Una rosa natural preservada, sobre cadena dorada con pequeños corazones.",
      descripcion: "Una rosa natural, de color intenso y pétalos intactos, preservada para que dure para siempre. Cuelga de una cadena dorada salpicada de corazones: una pieza que habla de amor y de recuerdos que no se marchitan.",
      materiales: { "Flor": "Rosa natural", "Cadena": "Dorada con corazones", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-margarita-lila",
      nombre: "Pendientes Margarita Lila",
      categoria: "pendientes",
      estado: "disponible",
      stock: 1,
      destacado: true,
      imagenes: ["assets/ig/ig-07.jpg"],
      resumen: "Dos margaritas lilas enteras en resina transparente, con brillo de cristal.",
      descripcion: "Dos margaritas de color lila, enteras y con todos sus pétalos, en resina transparente sobre botón dorado. Un tono suave y muy especial, hermano de las orquídeas Cattleya que inspiran la marca.",
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
      descripcion: "Pequeñas margaritas naturales, recogidas y secadas a mano, con su centro dorado y sus pétalos blancos. Ligeras, frescas y luminosas: se llevan con todo.",
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
      descripcion: "Un pequeño jardín en cada pendiente: florecillas rosas y hojas de helecho dentro de un círculo de resina con borde dorado. Cada uno es distinto del otro, como en la naturaleza.",
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
      descripcion: "Un aro dorado en forma de gota del que cuelga un círculo de resina con diminutas flores blancas y un toque verde. Elegantes y muy ligeros, para un día especial o para todos los días.",
      materiales: { "Flores": "Flores blancas y hojas verdes", "Herrajes": "Acero inoxidable bañado en oro" }
    },
    {
      id: "anillos-perla-granate",
      nombre: "Anillos Perla y Granate",
      categoria: "anillos",
      estado: "disponible",
      stock: 1,
      imagenes: ["assets/ig/ig-08.jpg"],
      resumen: "Anillos ajustables con cabujón de resina en tonos perla y granate.",
      descripcion: "Anillos ajustables con cabujón redondo de resina, en tonos perlados y granates. Se combinan entre sí para crear tu propia colección.",
      materiales: { "Talla": "Ajustable", "Acabado": "Resina con protección UV" }
    },
    {
      id: "anillo-cielo-azul",
      nombre: "Anillo Cielo Azul",
      categoria: "anillos",
      estado: "disponible",
      stock: 1,
      imagenes: ["assets/ig/ig-11.jpg"],
      resumen: "Pétalos azules y destellos dorados en un cabujón ovalado.",
      descripcion: "Un cabujón ovalado con pétalos azules y destellos dorados, sobre un aro ajustable dorado. Un pequeño cielo de noche en tu mano.",
      materiales: { "Flores": "Pétalos azules naturales", "Talla": "Ajustable", "Aro": "Dorado" }
    },
    {
      id: "caja-regalo-flores",
      nombre: "Caja Regalo Flores",
      categoria: "regalos",
      estado: "disponible",
      stock: 1,
      etiqueta: "Lista para regalar",
      imagenes: ["assets/ig/ig-10.jpg"],
      resumen: "Pendientes de flores en caja de regalo con cordel y gipsófila seca.",
      descripcion: "Unos pendientes de flores presentados en una caja de regalo atada con cordel y decorada con un ramito de gipsófila seca. Lista para regalar, o para regalarte.",
      materiales: { "Incluye": "Pendientes + caja de regalo", "Presentación": "Cordel y flores secas" }
    }
  ]
};
