/* ==========================================================================
   AURA FLOWERS · CATÁLOGO Y CONTENIDO
   --------------------------------------------------------------------------
   Para AÑADIR una pieza: copia un bloque { ... } de "productos", pégalo
   debajo (separado por una coma) y cambia sus datos.
   - categoria: "collares", "pendientes", "anillos", "regalos" o "a-medida"
   - precio: número en euros. desde: true muestra "Desde XX €"
   - disponible: false muestra la pieza como "Agotada"
   ========================================================================== */

window.AURA_DATA = {

  categorias: [
    { id: "collares", nombre: "Collares" },
    { id: "pendientes", nombre: "Pendientes" },
    { id: "anillos", nombre: "Anillos" },
    { id: "regalos", nombre: "Para regalar" },
    { id: "a-medida", nombre: "A medida" }
  ],

  productos: [
    {
      id: "colgante-orquidea-lila",
      nombre: "Colgante Orquídea Lila",
      categoria: "collares",
      precio: 25, desde: true,
      etiqueta: "Firma de la casa",
      imagen: "assets/aura/collar-orquidea.jpg",
      corto: "Una orquídea Phalaenopsis natural, entera, en resina sobre cadena de acero.",
      descripcion: "Una orquídea natural entera, con sus pétalos lilas y su corazón magenta, preservada en resina para que su color no se apague. Es la pieza que define a Aura Flowers: una flor grande, delicada y única, tal y como la recogió la naturaleza.",
      detalles: { "Flor": "Orquídea Phalaenopsis natural", "Cadena": "Acero inoxidable", "Acabado": "Resina con protección UV" }
    },
    {
      id: "colgante-orquidea-fucsia",
      nombre: "Colgante Orquídea Fucsia",
      categoria: "collares",
      precio: 25, desde: true,
      etiqueta: "Novedad",
      imagen: "assets/aura/colgante-fucsia.jpg",
      corto: "Orquídea fucsia natural en resina, con cadena dorada.",
      descripcion: "Una orquídea de un fucsia intenso, con su centro lleno de detalles, sobre una cadena dorada. Un color vibrante que recuerda a las buganvillas y a los atardeceres de verano.",
      detalles: { "Flor": "Orquídea fucsia natural", "Cadena": "Dorada", "Acabado": "Resina con protección UV" }
    },
    {
      id: "collar-rosa-eterna",
      nombre: "Collar Rosa Eterna",
      categoria: "collares",
      precio: 25, desde: true,
      etiqueta: "Pieza única",
      imagen: "assets/ig/ig-03.jpg",
      corto: "Una rosa natural preservada, sobre cadena dorada con corazones.",
      descripcion: "Una rosa natural, con su color intenso y sus pétalos intactos, preservada en resina para que dure para siempre. Cuelga de una cadena dorada con pequeños corazones. Una pieza que habla de amor y de recuerdos que no se marchitan.",
      detalles: { "Flor": "Rosa natural", "Cadena": "Dorada con corazones", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-margaritas",
      nombre: "Pendientes Margaritas Naturales",
      categoria: "pendientes",
      precio: 25, desde: true,
      etiqueta: "Novedad",
      imagen: "assets/ig/ig-04.jpg",
      corto: "Margaritas naturales de verdad, ligeras como un día de primavera.",
      descripcion: "Pequeñas margaritas naturales, recogidas y secadas a mano, con su centro dorado y sus pétalos blancos. Ligeros, frescos y muy alegres: se llevan con todo.",
      detalles: { "Flor": "Margaritas naturales", "Herrajes": "Acero inoxidable bañado en oro", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-flores-rosas",
      nombre: "Pendientes Redondos Flores Rosas",
      categoria: "pendientes",
      precio: 25, desde: true,
      etiqueta: "Pieza única",
      imagen: "assets/ig/ig-05.jpg",
      corto: "Flores rosas y helecho en un círculo de resina con borde dorado.",
      descripcion: "Un pequeño jardín en cada pendiente: florecillas rosas y hojas de helecho dentro de un círculo de resina con borde dorado. Cada uno es diferente del otro, como en la naturaleza.",
      detalles: { "Flores": "Flores rosas y helecho", "Forma": "Redondos con borde dorado", "Herrajes": "Acero inoxidable bañado en oro" }
    },
    {
      id: "pendientes-margarita-lila",
      nombre: "Pendientes Margarita Lila",
      categoria: "pendientes",
      precio: 25, desde: true,
      etiqueta: "Pieza única",
      imagen: "assets/ig/ig-07.jpg",
      corto: "Margaritas lilas enteras en resina, con brillo de cristal.",
      descripcion: "Dos margaritas de color lila, enteras y con todos sus pétalos, en resina transparente. Un color suave y muy especial que recuerda a las orquídeas favoritas de Amanda.",
      detalles: { "Flor": "Margaritas lilas", "Herrajes": "Acero inoxidable bañado en oro", "Acabado": "Resina con protección UV" }
    },
    {
      id: "pendientes-gota-flor-blanca",
      nombre: "Pendientes Gota y Flor Blanca",
      categoria: "pendientes",
      precio: 25, desde: true,
      imagen: "assets/ig/ig-09.jpg",
      corto: "Aro dorado en forma de gota con flores blancas en resina.",
      descripcion: "Un aro dorado en forma de gota del que cuelga un círculo de resina con diminutas flores blancas y un toque verde. Elegantes y muy ligeros, para un día especial o para todos los días.",
      detalles: { "Flores": "Flores blancas y hojas verdes", "Herrajes": "Acero inoxidable bañado en oro" }
    },
    {
      id: "anillos-de-resina",
      nombre: "Anillos de Resina",
      categoria: "anillos",
      precio: 25, desde: true,
      etiqueta: "Ajustables",
      imagen: "assets/ig/ig-08.jpg",
      corto: "Anillos ajustables con cabujón de resina, en tonos perla y granate.",
      descripcion: "Anillos ajustables con cabujón redondo de resina, en tonos perlados y granates. Se combinan entre sí para crear tu propia colección. Precio por anillo.",
      detalles: { "Talla": "Ajustable", "Precio": "Por anillo", "Acabado": "Resina con protección UV" }
    },
    {
      id: "anillo-ovalado-azul",
      nombre: "Anillo Ovalado Azul",
      categoria: "anillos",
      precio: 25, desde: true,
      etiqueta: "Pieza única",
      imagen: "assets/ig/ig-11.jpg",
      corto: "Pétalos azules y destellos dorados en un cabujón ovalado.",
      descripcion: "Un cabujón ovalado con pétalos azules y destellos dorados, sobre un aro ajustable dorado. Parece un pequeño cielo de noche en tu mano.",
      detalles: { "Flores": "Pétalos azules", "Talla": "Ajustable", "Aro": "Dorado" }
    },
    {
      id: "set-regalo",
      nombre: "Set Regalo · pendientes y caja",
      categoria: "regalos",
      precio: 45, desde: false,
      etiqueta: "Para regalar",
      imagen: "assets/ig/ig-10.jpg",
      corto: "Pendientes de flores en caja de regalo con gipsófila seca.",
      descripcion: "Unos pendientes de flores presentados en una caja de regalo atada con cordel y decorada con un ramito de gipsófila seca. Listo para regalar, o para regalarte.",
      detalles: { "Incluye": "Pendientes + caja de regalo", "Presentación": "Cordel y flores secas" }
    },
    {
      id: "tu-flor-en-resina",
      nombre: "Tu flor en resina · a medida",
      categoria: "a-medida",
      precio: 79, desde: true,
      etiqueta: "A medida",
      imagen: "assets/ig/ig-06.jpg",
      corto: "La flor de tu ramo, tu boda o un recuerdo, convertida en una joya única.",
      descripcion: "Una orquídea, un ramo de boda, una flor de un día que no quieres olvidar. Cuéntale su historia a Amanda y la transformará en una joya única, conservando sus colores y su forma. Precio orientativo según flor y tamaño.",
      detalles: { "Proceso": "Diseño previo con tu aprobación", "Plazo": "Se indica al conocer tus flores" }
    }
  ],

  galeria: [
    { img: "assets/ig/ig-06.jpg", alt: "Orquídea natural encapsulada en resina", forma: "alta" },
    { img: "assets/aura/collar-orquidea.jpg", alt: "Colgante de orquídea lila sobre fondo blanco con gipsófila", forma: "cuadrada" },
    { img: "assets/ig/ig-10.jpg", alt: "Caja de regalo con cordel y gipsófila seca", forma: "alta" },
    { img: "assets/ig/ig-07.jpg", alt: "Pendientes de margarita lila en resina", forma: "alta" },
    { img: "assets/aura/cattleya.jpg", alt: "Orquídea Cattleya lila, la flor favorita de Amanda", forma: "cuadrada" },
    { img: "assets/aura/orquideas-mesa.jpg", alt: "Orquídeas de colores en macetas", forma: "alta" },
    { img: "assets/ig/ig-03.jpg", alt: "Collar con rosa natural preservada y cadena de corazones", forma: "alta" },
    { img: "assets/aura/orquidea-fucsia.jpg", alt: "Orquídea fucsia envuelta para regalo", forma: "cuadrada" },
    { img: "assets/ig/ig-05.jpg", alt: "Pendientes redondos con flores rosas y helecho", forma: "alta" },
    { img: "assets/aura/phalaenopsis.jpg", alt: "Flores de orquídea Phalaenopsis lila", forma: "cuadrada" }
  ],

  preguntas: [
    ["¿Las flores son reales?", "Sí, al 100 %. Cada pieza contiene flores naturales que se recogen, se secan y se encapsulan a mano. Por eso ninguna joya es igual a otra: los tonos y las formas pueden variar ligeramente respecto a las fotos."],
    ["¿Cuánto tarda en llegar mi pedido?", "Cada pieza se prepara a mano y sale desde Lloret de Mar. Al confirmar el pedido te indicamos el plazo estimado y, cuando salga, el número de seguimiento."],
    ["¿Cómo cuido mi joya?", "Evita el contacto prolongado con agua, perfumes y cremas, y no la expongas al sol directo durante horas. Guárdala en su caja y límpiala con un paño suave. Bien cuidada, dura muchísimo tiempo."],
    ["¿Puedo cancelar o devolver mi pedido?", "Puedes cancelar en las 48 horas siguientes a la compra. Si algo no es como esperabas, escríbenos y lo solucionamos. Las piezas personalizadas se hacen a tu medida y no admiten devolución salvo defecto."],
    ["¿Puedo encargar una pieza con mis propias flores?", "Claro, es lo que más le gusta a Amanda. Cuéntanos qué flores tienes y su historia por WhatsApp o Instagram: te explicamos cómo conservarlas y diseñamos juntas la joya antes de empezar."]
  ]
};
