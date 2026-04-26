export const scheduleTypes = [
  { id: "todos", label: "Todos" },
  { id: "reciclables", label: "Reciclables" },
  { id: "residuos-secos", label: "Residuos secos" },
  { id: "residuos-especiales", label: "Residuos especiales" },
];

export const scheduleData = [
  {
    id: 1,
    barrio: "Centro",
    dias: ["Lunes", "Miércoles", "Viernes"],
    horario: "08:00 a 12:00",
    tipo: "reciclables",
    tipoLabel: "Reciclables",
    observaciones:
      "Sacá los materiales limpios y secos en bolsas diferenciadas o cajas cerradas.",
  },
  {
    id: 2,
    barrio: "Belgrano",
    dias: ["Martes", "Jueves"],
    horario: "14:00 a 18:00",
    tipo: "residuos-secos",
    tipoLabel: "Residuos secos",
    observaciones:
      "Incluye papel, cartón, envases y plásticos secos listos para recuperar.",
  },
  {
    id: 3,
    barrio: "San Benito",
    dias: ["Martes", "Sábado"],
    horario: "09:00 a 13:00",
    tipo: "reciclables",
    tipoLabel: "Reciclables",
    observaciones:
      "Priorizá separar vidrio, plástico y cartón para facilitar el circuito de reciclaje.",
  },
  {
    id: 4,
    barrio: "San Benito",
    dias: ["Miércoles"],
    horario: "15:00 a 17:00",
    tipo: "residuos-especiales",
    tipoLabel: "Residuos especiales",
    observaciones:
      "Recepción programada para pilas, aceite usado y pequeños residuos especiales del hogar.",
  },
  {
    id: 5,
    barrio: "Jorge Newbery",
    dias: ["Lunes", "Jueves"],
    horario: "13:00 a 17:00",
    tipo: "residuos-secos",
    tipoLabel: "Residuos secos",
    observaciones:
      "No mezclar con restos húmedos ni residuos orgánicos para evitar contaminación.",
  },
  {
    id: 6,
    barrio: "Bicentenario",
    dias: ["Miércoles", "Viernes"],
    horario: "10:00 a 14:00",
    tipo: "reciclables",
    tipoLabel: "Reciclables",
    observaciones:
      "Podés complementar esta recolección con entrega en puntos verdes cercanos.",
  },
  {
    id: 7,
    barrio: "2 de Abril",
    dias: ["Sábado"],
    horario: "10:00 a 13:00",
    tipo: "residuos-especiales",
    tipoLabel: "Residuos especiales",
    observaciones:
      "Jornada barrial orientada a aceite usado, pilas y residuos electrónicos pequeños.",
  },
  {
    id: 8,
    barrio: "Evita",
    dias: ["Martes", "Viernes"],
    horario: "08:30 a 12:30",
    tipo: "reciclables",
    tipoLabel: "Reciclables",
    observaciones:
      "Recomendado dejar los materiales separados por tipo y sin restos orgánicos.",
  },
];

// Preparado para que a futuro el contenido se reemplace por una llamada real a ScheduleAPI.
export function loadScheduleData() {
  return Promise.resolve(scheduleData);
}
