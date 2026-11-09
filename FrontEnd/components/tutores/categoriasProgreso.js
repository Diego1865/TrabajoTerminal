// Clasificación de alumnos por promedio (0-10). Una sola definición para los contadores,
// la gráfica y la lista, así siempre coinciden. Los colores van por clave, nunca por posición.
import { AlertCircle, TrendingUp, Star, Clock } from "lucide-react";

export const METRICAS = [
  { clave: "general", etiqueta: "General", campo: "promedio_general", frase: "el promedio general" },
  { clave: "ortografia", etiqueta: "Ortografía", campo: "promedio_ortografia", frase: "el promedio de ortografía" },
  { clave: "legibilidad", etiqueta: "Legibilidad", campo: "promedio_legibilidad", frase: "el promedio de legibilidad" },
];

// Colores de estado (crítico, advertencia, bueno) y gris neutro; siempre van con ícono y nombre.
export const CATEGORIAS = [
  { clave: "riesgo", etiqueta: "En riesgo", rango: "Menos de 6", color: "#d03b3b", tinta: "#ffffff",
    Icono: AlertCircle, cumple: (v) => v < 6 },
  { clave: "regular", etiqueta: "Regular", rango: "De 6 a 8", color: "#fab219", tinta: "#0b0b0b",
    Icono: TrendingUp, cumple: (v) => v >= 6 && v <= 8 },
  { clave: "excelencia", etiqueta: "Excelencia", rango: "Más de 8", color: "#0ca30c", tinta: "#ffffff",
    Icono: Star, cumple: (v) => v > 8 },
  { clave: "sin_calificar", etiqueta: "Sin calificar", rango: "Sin notas confirmadas", color: "#c3c2b7", tinta: "#0b0b0b",
    Icono: Clock, cumple: () => false },
];

export const metricaPorClave = (clave) => METRICAS.find((m) => m.clave === clave) ?? METRICAS[0];

export const valorDe = (alumno, metrica) => {
  const valor = alumno[metricaPorClave(metrica).campo];
  return valor === null || valor === undefined ? null : Number(valor);
};

/** { riesgo: [...], regular: [...], excelencia: [...], sin_calificar: [...] }: siempre las 4 claves. */
export function clasificar(alumnos, metrica) {
  const grupos = Object.fromEntries(CATEGORIAS.map((c) => [c.clave, []]));
  for (const alumno of alumnos) {
    const valor = valorDe(alumno, metrica);
    const categoria = valor === null ? "sin_calificar" : CATEGORIAS.find((c) => c.cumple(valor))?.clave;
    grupos[categoria ?? "sin_calificar"].push(alumno);
  }
  // Dentro de cada grupo, primero quien más atención necesita (promedio más bajo).
  for (const clave of Object.keys(grupos)) {
    grupos[clave].sort((a, b) => (valorDe(a, metrica) ?? 99) - (valorDe(b, metrica) ?? 99));
  }
  return grupos;
}

/** Primera categoría con alumnos, en orden de prioridad (riesgo primero). */
export const categoriaInicial = (grupos) =>
  CATEGORIAS.find((c) => grupos[c.clave]?.length)?.clave ?? "riesgo";
