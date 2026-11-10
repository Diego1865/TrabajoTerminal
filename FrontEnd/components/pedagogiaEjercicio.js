// Lectura de contenido_base.pedagogia (catálogo de ejercicios). Los dictados del tutor no la traen.

export const METODOS = {
  sintetico: { etiqueta: 'Sintético', detalle: 'De la letra a la sílaba y la palabra', bg: '#EFF6FF', borde: '#BFDBFE', color: '#1D4ED8' },
  analitico: { etiqueta: 'Analítico', detalle: 'De la palabra con significado a sus partes', bg: '#ECFDF5', borde: '#A7F3D0', color: '#065F46' },
  eclectico: { etiqueta: 'Ecléctico', detalle: 'Combina ambos caminos', bg: '#FFF7ED', borde: '#FED7AA', color: '#9A3412' },
};

export const ERRORES = {
  grafias_dudosas: { etiqueta: 'Grafías dudosas', emoji: '🔤' },
  inversion: { etiqueta: 'Inversión b/d p/q', emoji: '🔄' },
  omision_adicion: { etiqueta: 'Omisión o adición', emoji: '🧩' },
  tildes: { etiqueta: 'Tildes', emoji: '✏️' },
  trazo: { etiqueta: 'Trazo', emoji: '✍️' },
  integracion: { etiqueta: 'Integración', emoji: '🎯' },
};

export const MODALIDADES = {
  copia: 'Copia el modelo tal como está',
  completar: 'Escribe completo lo que falta (palabras u oración)',
  imagen: 'Escribe el nombre de cada dibujo, en orden',
  dictado: 'Escribe las palabras que escucha',
};

export function leerContenido(ejercicio) {
  const valor = ejercicio?.contenido_base;
  if (!valor) return {};
  if (typeof valor === 'object') return valor;
  try { return JSON.parse(valor); } catch { return {}; }
}

/** pedagogia válida o null. */
export function leerPedagogia(ejercicio) {
  const p = leerContenido(ejercicio).pedagogia;
  return p && METODOS[p.metodo] ? p : null;
}
