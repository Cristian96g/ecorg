export const educationCategories = [
  { id: "todos", label: "Todos" },
  { id: "reciclaje", label: "Reciclaje" },
  { id: "residuos-especiales", label: "Residuos especiales" },
  { id: "habitos-sustentables", label: "Hábitos sustentables" },
  { id: "comunidad", label: "Comunidad" },
];

export const mockEducation = [
  {
    _id: "separacion-residuos",
    title: "Separación de residuos en casa",
    description:
      "Una guía simple para separar materiales reciclables y evitar que se contaminen antes de llegar al punto verde.",
    category: "reciclaje",
    categoryLabel: "Reciclaje",
    icon: "♻️",
    accent: "#EAF6DE",
    readingTime: "3 min",
    details:
      "Separar los residuos en casa es el primer paso para que el reciclaje funcione. Si los materiales llegan limpios y secos, se pueden recuperar con mayor facilidad y tienen más valor para la cadena de reciclado.",
    practicalSteps: [
      "Reservá un recipiente para reciclables limpios y secos.",
      "Separá plástico, vidrio, papel y cartón del resto de los residuos.",
      "Antes de guardarlos, vaciá y enjuagá envases y botellas.",
      "Llevá los materiales al punto verde más cercano cuando juntes una cantidad útil.",
    ],
    usefulTips: [
      "Aplastá botellas o cajas para ocupar menos espacio.",
      "Si el cartón está muy mojado o con grasa, ya no sirve para reciclar.",
    ],
    commonMistakes: [
      "Mezclar reciclables con restos de comida.",
      "Guardar materiales húmedos dentro de bolsas cerradas.",
    ],
    cta: { label: "Buscá un punto verde cercano", to: "/mapa" },
  },
  {
    _id: "plastico",
    title: "Qué hacer con el plástico",
    description:
      "Aprendé qué plásticos conviene recuperar, cómo prepararlos y por qué es importante reducir su uso.",
    category: "reciclaje",
    categoryLabel: "Reciclaje",
    icon: "🥤",
    accent: "#E6F8EE",
    readingTime: "2 min",
    details:
      "No todos los plásticos tienen el mismo tratamiento, pero muchos envases de consumo cotidiano pueden recuperarse si están limpios. Cuanto mejor se separen, más simple será su clasificación posterior.",
    practicalSteps: [
      "Separá botellas, bidones, envases de limpieza y recipientes plásticos rígidos.",
      "Enjuagá los envases para quitar restos de comida o líquidos.",
      "Sacá tapas o elementos de otro material si es posible.",
      "Reducí el uso de descartables y elegí envases reutilizables cuando puedas.",
    ],
    usefulTips: [
      "Si tenés dudas, priorizá envases rígidos y limpios.",
      "Guardá tapas aparte si en tu punto verde también las reciben.",
    ],
    commonMistakes: [
      "Enviar plásticos sucios o con restos de aceite.",
      "Mezclar films muy sucios con envases listos para reciclar.",
    ],
    cta: { label: "Buscá un punto verde cercano", to: "/mapa" },
  },
  {
    _id: "vidrio",
    title: "Reciclaje de vidrio",
    description:
      "El vidrio puede reciclarse muchas veces. La clave es llevarlo separado y manipularlo con cuidado.",
    category: "reciclaje",
    categoryLabel: "Reciclaje",
    icon: "🍾",
    accent: "#EAF4FF",
    readingTime: "2 min",
    details:
      "Botellas y frascos de vidrio son materiales muy valiosos porque pueden volver a convertirse en nuevos envases. Para que el proceso sea seguro, es importante entregarlos vacíos y evitar roturas innecesarias.",
    practicalSteps: [
      "Enjuagá botellas y frascos antes de separarlos.",
      "Retirá tapas metálicas o plásticas si es posible.",
      "Guardalos en una caja o bolsa resistente para transportarlos.",
      "Si se rompe un envase, embolsá los restos con cuidado antes de descartarlos.",
    ],
    usefulTips: [
      "Separar por color ayuda, aunque no siempre es obligatorio.",
      "Los frascos de conservas suelen ser buenos candidatos para reutilizar primero.",
    ],
    commonMistakes: [
      "Llevar vidrio con restos orgánicos adentro.",
      "Mezclar vidrios rotos sueltos con otros residuos sin protección.",
    ],
    cta: { label: "Buscá un punto verde cercano", to: "/mapa" },
  },
  {
    _id: "papel-carton",
    title: "Papel y cartón sin contaminar",
    description:
      "Los papeles y cartones secos son reciclables, pero pierden valor cuando se mojan o se ensucian con comida.",
    category: "reciclaje",
    categoryLabel: "Reciclaje",
    icon: "📦",
    accent: "#FFF6E6",
    readingTime: "2 min",
    details:
      "El papel y el cartón tienen buena recuperación cuando están limpios. En una casa o comercio se pueden separar con facilidad y compactar para ahorrar espacio.",
    practicalSteps: [
      "Separá cajas, diarios, folletos y hojas limpias.",
      "Plegá o atalas para que ocupen menos lugar.",
      "Mantenelos lejos de la humedad y del piso.",
      "Llevalos al punto verde cuando ya tengas una cantidad ordenada.",
    ],
    usefulTips: [
      "Las cajas de envío se pueden reutilizar antes de reciclar.",
      "Retirá cintas o plásticos grandes si salen fácilmente.",
    ],
    commonMistakes: [
      "Guardar cartón mojado.",
      "Reciclar cajas con grasa, salsa o restos de comida.",
    ],
    cta: { label: "Buscá un punto verde cercano", to: "/mapa" },
  },
  {
    _id: "pilas",
    title: "Dónde llevar pilas usadas",
    description:
      "Las pilas no van en la basura común. Requieren una disposición especial por los materiales que contienen.",
    category: "residuos-especiales",
    categoryLabel: "Residuos especiales",
    icon: "🔋",
    accent: "#FCE9EF",
    readingTime: "2 min",
    details:
      "Las pilas agotadas pueden contener sustancias que no deben mezclarse con los residuos domiciliarios. Guardarlas aparte y llevarlas a un punto habilitado reduce riesgos para el ambiente y para el personal de recolección.",
    practicalSteps: [
      "Juntá las pilas usadas en un frasco o recipiente seco.",
      "Mantenelas fuera del alcance de niñas y niños.",
      "Cuando tengas varias, consultá los puntos de recepción habilitados.",
      "No las abras, pinches ni las tires al fuego.",
    ],
    usefulTips: [
      "Elegí pilas recargables cuando el dispositivo lo permita.",
      "Si una pila está sulfatada, manipulala con más cuidado.",
    ],
    commonMistakes: [
      "Tirar pilas usadas junto con residuos comunes.",
      "Guardarlas sueltas con objetos metálicos.",
    ],
    cta: { label: "Buscá un punto verde cercano", to: "/mapa" },
  },
  {
    _id: "aceite-usado",
    title: "Aceite usado de cocina",
    description:
      "Un solo litro de aceite puede contaminar muchísima agua. Guardarlo y entregarlo correctamente hace la diferencia.",
    category: "residuos-especiales",
    categoryLabel: "Residuos especiales",
    icon: "🫙",
    accent: "#EEF6FF",
    readingTime: "3 min",
    details:
      "El aceite usado nunca debe ir por la pileta o el inodoro. Cuando se enfría y se guarda en una botella cerrada, puede entregarse en puntos específicos para su tratamiento.",
    practicalSteps: [
      "Dejá enfriar el aceite después de cocinar.",
      "Colalo si tiene restos grandes de comida.",
      "Guardalo en una botella plástica bien cerrada.",
      "Llevalo a un punto que reciba aceite usado.",
    ],
    usefulTips: [
      "Usá siempre el mismo envase para ir juntando aceite en casa.",
      "Etiquetá la botella para no confundirla con otro líquido.",
    ],
    commonMistakes: [
      "Volcar el aceite en la bacha.",
      "Entregar recipientes abiertos o que pierden contenido.",
    ],
    cta: { label: "Buscá un punto verde cercano", to: "/mapa" },
  },
  {
    _id: "compostaje",
    title: "Compostaje en casa",
    description:
      "Una forma simple de reducir residuos orgánicos y generar abono para plantas y huertas.",
    category: "habitos-sustentables",
    categoryLabel: "Hábitos sustentables",
    icon: "🌱",
    accent: "#EAF6DE",
    readingTime: "4 min",
    details:
      "Compostar ayuda a reducir la cantidad de residuos que generamos y transforma restos orgánicos en un recurso útil. Con una compostera simple se puede empezar desde casa.",
    practicalSteps: [
      "Separá restos de frutas, verduras, yerba, café y cáscaras de huevo.",
      "Alterná capas húmedas con hojas secas, cartón o aserrín limpio.",
      "Aireá el material cada tanto para evitar malos olores.",
      "Usá el compost maduro en macetas, jardín o huerta.",
    ],
    usefulTips: [
      "Empezá de a poco para encontrar el equilibrio entre secos y húmedos.",
      "Si tiene mal olor, suele faltar material seco o aireación.",
    ],
    commonMistakes: [
      "Agregar carne, lácteos o grandes cantidades de aceite.",
      "Dejar la compostera totalmente cerrada y sin ventilación.",
    ],
    cta: { label: "Conocé hábitos sustentables", to: "/educacion" },
  },
  {
    _id: "residuos-electronicos",
    title: "Qué hacer con residuos electrónicos",
    description:
      "Celulares, cables, cargadores y pequeños aparatos no deben terminar en un basural común.",
    category: "residuos-especiales",
    categoryLabel: "Residuos especiales",
    icon: "💻",
    accent: "#EEF6FF",
    readingTime: "3 min",
    details:
      "Los residuos electrónicos contienen materiales aprovechables y otros que requieren tratamiento especial. Si todavía funcionan, también pueden tener una segunda vida mediante reparación o donación.",
    practicalSteps: [
      "Revisá si el equipo puede repararse o donarse primero.",
      "Separá cables, cargadores y accesorios en una bolsa aparte.",
      "Borrá datos personales de computadoras o celulares antes de entregarlos.",
      "Consultá campañas o puntos de recepción de electrónicos.",
    ],
    usefulTips: [
      "Guardar equipos en desuso por años no resuelve el problema.",
      "La reparación suele ser una opción sustentable y económica.",
    ],
    commonMistakes: [
      "Desechar aparatos electrónicos con la basura común.",
      "Entregarlos sin revisar datos personales o baterías dañadas.",
    ],
    cta: { label: "Buscá un punto verde cercano", to: "/mapa" },
  },
  {
    _id: "mini-basurales",
    title: "Mini basurales y responsabilidad ciudadana",
    description:
      "Cómo prevenir focos de residuos en la vía pública y qué hacer si detectás uno en tu barrio.",
    category: "comunidad",
    categoryLabel: "Comunidad",
    icon: "🏘️",
    accent: "#F3F8EC",
    readingTime: "3 min",
    details:
      "Los mini basurales afectan la salud, el paisaje urbano y la convivencia. Detectarlos a tiempo y reportarlos ayuda a que el municipio pueda actuar mejor, pero también es clave evitar prácticas que los generan.",
    practicalSteps: [
      "Sacá residuos solo en los horarios de recolección correspondientes.",
      "No dejes restos voluminosos en esquinas o baldíos.",
      "Si ves un foco de residuos, registrá la ubicación y hacé un reporte.",
      "Conversá con tu entorno sobre formas correctas de disposición.",
    ],
    usefulTips: [
      "Un barrio limpio también depende de hábitos cotidianos sostenidos.",
      "Las fotos claras ayudan a ubicar mejor el problema cuando se reporta.",
    ],
    commonMistakes: [
      "Asumir que otra persona o el municipio lo resolverán sin aviso.",
      "Dejar ramas, escombros o bolsas fuera de lugar de forma reiterada.",
    ],
    cta: { label: "Reportá un problema ambiental", to: "/reportes" },
  },
];

export function loadEducationContent() {
  return Promise.resolve(mockEducation);
}
