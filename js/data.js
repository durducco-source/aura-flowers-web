/* ==========================================================
   AURA FLOWERS · Contenido
   Las fotos son reales (assets/ig). Los NOMBRES Y PRECIOS de las piezas son
   provisionales: Amanda debe confirmarlos o cambiarlos aquí (name, price, stock).
   Para añadir más fotos a una pieza: images: ['assets/a.jpg', 'assets/b.jpg']
   ========================================================== */
(function () {
  const M = 'Acero inoxidable bañado en oro';
  const RESIN = 'Resina epoxi con protección UV';
  const IG = (n) => 'assets/ig/ig-' + n + '.jpg';

  SV.categories = [
    { id: 'collares', name: 'Collares', blurb: 'Una flor real que late sobre tu pecho.', cover: 'collar-rosa-eterna' },
    { id: 'pendientes', name: 'Pendientes', blurb: 'Ligeros, luminosos y cada par distinto.', cover: 'pendientes-margarita-lila' },
    { id: 'anillos', name: 'Anillos', blurb: 'Una flor diminuta, siempre a la vista.', cover: 'anillos-de-resina' },
    { id: 'personalizados', name: 'Personalizados', blurb: 'Tu flor, tu recuerdo, tu joya.', cover: 'tu-flor-en-resina' },
    { id: 'colecciones', name: 'Colecciones', blurb: 'Sets pensados para regalar (o regalarte).', cover: 'set-regalo-flores-secas' }
  ];

  SV.products = [
    /* ───────── COLLARES ───────── */
    {
      id: 'collar-rosa-eterna', no: 1, name: 'Collar Rosa Eterna', cat: 'collares', price: 69, badge: 'Pieza única', stock: 1,
      images: [IG('03')], flowers: ['rosa'],
      short: 'Una rosa natural preservada en resina, sobre cadena dorada con corazones.',
      desc: 'Una rosa natural, con su color intenso y sus pétalos intactos, preservada en resina para que dure para siempre. Cuelga de una cadena dorada con pequeños corazones. Una pieza que habla de amor y de recuerdos que no se marchitan.',
      details: { 'Flor': 'Rosa natural', 'Cadena': 'Dorada con corazones', 'Herrajes': M, 'Acabado': RESIN },
      art: { seed: 3 }
    },
    /* ───────── PENDIENTES ───────── */
    {
      id: 'pendientes-margaritas', no: 2, name: 'Pendientes Margaritas Naturales', cat: 'pendientes', price: 45, badge: 'Novedad', stock: 2,
      images: [IG('04')], flowers: ['margarita'],
      short: 'Margaritas naturales de verdad, ligeras como un día de primavera.',
      desc: 'Pequeñas margaritas naturales, recogidas y secadas a mano, con su centro dorado y sus pétalos blancos. Ligeros, frescos y muy alegres: se llevan con todo.',
      details: { 'Flor': 'Margaritas naturales', 'Herrajes': M, 'Acabado': RESIN },
      art: { seed: 4 }
    },
    {
      id: 'pendientes-flores-rosas', no: 3, name: 'Pendientes Redondos Flores Rosas', cat: 'pendientes', price: 48, stock: 1, badge: 'Pieza única',
      images: [IG('05')], flowers: ['helecho', 'rosa'],
      short: 'Flores rosas y hojas de helecho en un círculo de resina con borde dorado.',
      desc: 'Un pequeño jardín en cada pendiente: florecillas rosas y hojas de helecho dentro de un círculo de resina con borde dorado, con pendiente dorado martillado. Cada uno es diferente al otro, como en la naturaleza.',
      details: { 'Flores': 'Flores rosas y helecho', 'Forma': 'Redondos con borde dorado', 'Herrajes': M, 'Acabado': RESIN },
      art: { seed: 5 }
    },
    {
      id: 'pendientes-margarita-lila', no: 4, name: 'Pendientes Margarita Lila', cat: 'pendientes', price: 46, stock: 1, badge: 'Pieza única',
      images: [IG('07')], flowers: ['margarita'],
      short: 'Margaritas lilas enteras dentro de la resina, con brillo de cristal.',
      desc: 'Dos margaritas de color lila, enteras y con todos sus pétalos, en resina transparente. Un color suave y muy especial que recuerda a las orquídeas favoritas de Amanda.',
      details: { 'Flor': 'Margaritas lilas', 'Herrajes': M, 'Acabado': RESIN },
      art: { seed: 7 }
    },
    {
      id: 'pendientes-gota-flor-blanca', no: 5, name: 'Pendientes Gota y Flor Blanca', cat: 'pendientes', price: 52, stock: 2,
      images: [IG('09')], flowers: ['gipsofila', 'helecho'],
      short: 'Aro en forma de gota que sostiene un círculo de resina con flores blancas.',
      desc: 'Un aro dorado en forma de gota del que cuelga un círculo de resina con diminutas flores blancas y un toque verde. Elegantes y muy ligeros, para un día especial o para todos los días.',
      details: { 'Flores': 'Flores blancas y hojas verdes', 'Herrajes': M, 'Acabado': RESIN },
      art: { seed: 9 }
    },
    /* ───────── ANILLOS ───────── */
    {
      id: 'anillos-de-resina', no: 6, name: 'Anillos de Resina', cat: 'anillos', price: 32, stock: 5, badge: 'Ajustables',
      images: [IG('08')], flowers: ['gipsofila', 'rosa'],
      short: 'Anillos ajustables con cabujón de resina, en tonos perla y granate.',
      desc: 'Anillos ajustables con cabujón redondo de resina, en tonos perlados y granates. Se combinan entre sí para crear tu propia colección. Precio por anillo.',
      details: { 'Talla': 'Ajustable', 'Herrajes': M, 'Acabado': RESIN, 'Precio': 'Por anillo' },
      art: { seed: 11 }
    },
    {
      id: 'anillo-ovalado-azul', no: 7, name: 'Anillo Ovalado Azul', cat: 'anillos', price: 38, stock: 1, badge: 'Pieza única',
      images: [IG('11')], flowers: ['nomeolvides'],
      short: 'Flores azules y toques dorados en un cabujón ovalado, con aro ajustable.',
      desc: 'Un cabujón ovalado con pétalos azules y destellos dorados, sobre un aro ajustable dorado. Parece un pequeño cielo de noche en tu mano.',
      details: { 'Flores': 'Pétalos azules', 'Talla': 'Ajustable', 'Herrajes': M, 'Acabado': RESIN },
      art: { seed: 13 }
    },
    /* ───────── PERSONALIZADOS ───────── */
    {
      id: 'tu-flor-en-resina', no: 8, name: 'Tu Flor en Resina · a medida', cat: 'personalizados', price: 79, priceFrom: true, stock: 99, avail: 'custom', badge: 'A medida',
      images: [IG('06')], flowers: ['rosa', 'nomeolvides', 'gipsofila'],
      short: 'Convierto la flor de tu ramo, tu boda o un recuerdo en una joya única.',
      desc: 'Una orquídea, un ramo de boda, una flor de un día que no quieres olvidar. Cuéntame su historia y la transformo en una joya única, conservando sus colores y su forma. Precio orientativo desde 79 €, según flor y tamaño.',
      details: { 'Precio': 'Desde 79 € (orientativo)', 'Proceso': 'Diseño previo con tu aprobación', 'Plazo': 'Te lo indico al conocer tus flores', 'Herrajes': M },
      art: { seed: 17 }
    },
    /* ───────── COLECCIONES ───────── */
    {
      id: 'set-regalo-flores-secas', no: 9, name: 'Set Regalo · pendientes y caja', cat: 'colecciones', price: 58, stock: 1, badge: 'Para regalar',
      images: [IG('05'), IG('10')], flowers: ['helecho', 'rosa', 'gipsofila'],
      short: 'Pendientes de flores rosas en una caja de regalo con gipsófila seca.',
      desc: 'Los pendientes redondos de flores rosas presentados en una caja de regalo atada con cordel y decorada con un ramito de gipsófila seca. Listo para regalar, o para regalarte.',
      details: { 'Incluye': 'Pendientes + caja de regalo', 'Presentación': 'Cordel y flores secas', 'Herrajes': M },
      art: { seed: 21 }
    }
  ];

  SV.process = [
    { n: '01', title: 'Selección de las flores', scene: 'select', time: 'Con calma y cariño', text: 'Todo empieza con la flor. Elijo cada una a mano, cuando los pétalos están firmes y el color más vivo. Trabajo con flores naturales de temporada y con las que mis clientas me confían.' },
    { n: '02', title: 'Preparación y secado', scene: 'dry', time: 'Semanas de paciencia', text: 'Las flores se prensan y se secan despacio para conservar su forma y su color. Este paso no se puede acelerar: la paciencia es parte del oficio.' },
    { n: '03', title: 'Diseño de la pieza', scene: 'design', time: 'Con pinzas y mucho mimo', text: 'Coloco los pétalos, pruebo composiciones y elijo hacia dónde mira cada flor. Cada joya se diseña pensando en la flor. Si un pétalo no encaja, se cambia.' },
    { n: '04', title: 'Encapsulado en resina', scene: 'resin', time: 'Capa a capa', text: 'Mezclo la resina sin prisas y la vierto capa a capa, colocando la flor en su sitio con precisión. Cada capa se cura con cuidado para no atrapar ni una burbuja.' },
    { n: '05', title: 'Pulido y acabado', scene: 'polish', time: 'A mano, con amor', text: 'Una vez curada, lijo y pulo a mano hasta lograr un brillo de cristal. Después añado los herrajes dorados y reviso la pieza una última vez.' },
    { n: '06', title: 'Preparación del pedido', scene: 'pack', time: 'Lista para regalar', text: 'Cada pieza se envuelve con cariño en su caja, atada con cordel y con un toque de flores secas. Sale del taller lista para regalar… o para regalarte.' }
  ];

  /* Historias: la primera es la historia real de Amanda; las demás cuentan lo que simboliza cada flor. */
  SV.stories = [
    { flower: 'rosa', product: 'tu-flor-en-resina', who: 'Amanda · Lloret de Mar', title: 'Las orquídeas del jardín de mi infancia', img: IG('06'),
      text: 'Las flores de mi vida son las orquídeas Cattleya lilas. Crecí viéndolas en el jardín de mi casa, en Cuba, y fueron las protagonistas del ramo de boda de mi mamá. Por eso llamé a mi marca Aura Flowers: para mí, las flores capturan la energía de nuestros recuerdos más bonitos, y quiero inmortalizarla.' },
    { flower: 'margarita', product: 'pendientes-margaritas', who: 'Simbolismo · Margarita', title: 'Margaritas: el campo de la infancia',
      text: 'La margarita habla de inocencia y de nuevos comienzos. Para muchas personas es la primera flor que recogieron de niñas, en un paseo o en un jardín. Convertirla en joya es guardar ese primer recuerdo de verano en la forma más delicada.' },
    { flower: 'rosa', product: 'collar-rosa-eterna', who: 'Simbolismo · Rosa', title: 'La rosa que no quisiste soltar',
      text: 'Una rosa de un aniversario, de una despedida o de un “sí, quiero”. Casi siempre acabamos guardándola entre las páginas de un libro. En resina, esa rosa conserva su color y su forma, y deja de ser un recuerdo escondido para ser algo que puedes llevar contigo.' }
  ];

  /* Reseñas: vacío hasta que haya opiniones reales (la sección se oculta sola).
     Ejemplo: { name: 'Nombre', city: 'Ciudad', product: 'collar-rosa-eterna', stars: 5, text: 'Opinión real…' } */
  SV.reviews = [];

  SV.faq = [
    ['¿Las flores son reales?', 'Sí, al 100 %. Cada pieza contiene flores naturales que se recogen, se secan y se encapsulan a mano. Por eso ninguna joya es igual a otra: los tonos y las formas pueden variar ligeramente respecto a las fotos.'],
    ['¿Cuánto tarda en llegar mi pedido?', 'Cada pieza se prepara a mano y sale desde Lloret de Mar (Cataluña). Al confirmar el pedido te indico el plazo estimado y, cuando salga, el número de seguimiento.'],
    ['¿Cómo cuido mi joya?', 'Evita el contacto prolongado con agua, perfumes y cremas, y no la expongas al sol directo durante horas. Guárdala en su caja y límpiala con un paño suave. Bien cuidada, dura muchísimo tiempo.'],
    ['¿Puedo cancelar o devolver mi pedido?', 'Puedes cancelar en las 48 horas siguientes a la compra. Si algo no es como esperabas, escríbeme y lo solucionamos. Las piezas personalizadas se hacen a tu medida y no admiten devolución salvo defecto.'],
    ['¿Puedo encargar una pieza con mis propias flores?', 'Claro, es lo que más me gusta. Cuéntame qué flores tienes y su historia en el formulario de “Crea tu pieza”. Te explico cómo conservarlas y diseñamos juntas la joya antes de empezar.']
  ];

  SV.shipZones = { ES: 0, EU: 1, INT: 2 };
  SV.countries = [
    ['ES', 'España', 'ES'], ['PT', 'Portugal', 'EU'], ['FR', 'Francia', 'EU'], ['IT', 'Italia', 'EU'], ['DE', 'Alemania', 'EU'],
    ['NL', 'Países Bajos', 'EU'], ['BE', 'Bélgica', 'EU'], ['IE', 'Irlanda', 'EU'], ['GB', 'Reino Unido', 'INT'], ['US', 'Estados Unidos', 'INT'],
    ['MX', 'México', 'INT'], ['CU', 'Cuba', 'INT'], ['AR', 'Argentina', 'INT'], ['CO', 'Colombia', 'INT'], ['CL', 'Chile', 'INT'], ['OT', 'Otro país', 'INT']
  ];
  // [España, UE, resto del mundo] — tarifas provisionales, ajústalas a tus costes reales
  SV.shipping = { standard: { label: 'Estándar', eta: '2–4 días', prices: [4.9, 8.9, 14.9] }, express: { label: 'Exprés', eta: '24–48 h', prices: [8.9, 14.9, 24.9] } };
})();
