/*
 * Contiene funciones auxiliares relacionadas con rutaEjercicios.
 */

import { leerPedagogia } from './pedagogiaEjercicio.js';

// Los primeros lotes solo traen pedagogia.orden; estas claves conservan su ubicación.
const GRUPOS = [
  {
    id: 'vocales', titulo: 'Vocalización inicial', icono: '📖',
    letras: 'a · e · i · o · u', fondo: '#FEF3C7', acento: '#F4D686',
    ordenes: { 1: 1 },
  },
  {
    id: 'primer-grupo', titulo: 'Primer grupo consonántico', icono: '🧠',
    letras: 'm · s · t · l · r · p · n · c · d · v', fondo: '#FFEDD5', acento: '#F6C39B',
    ordenes: { 4: 1, 5: 20 },
  },
  {
    id: 'segundo-grupo', titulo: 'Segundo grupo', icono: '🎯',
    letras: 'b · f · r suave · j · g · h · ch · ñ · y', fondo: '#DCFCE7', acento: '#A8D8B9',
    ordenes: { 17: 1, 9: 2, 10: 3, 11: 4, 25: 8, 26: 9, 27: 10, 28: 11, 29: 12,
      30: 13, 31: 14, 32: 15, 33: 16, 34: 17, 43: 20 },
  },
  {
    id: 'tercer-grupo', titulo: 'Tercer grupo', icono: '🔎',
    letras: 'k · q · z · x · w', fondo: '#E0F2FE', acento: '#A7D5E4',
    ordenes: { 14: 1, 2: 7, 3: 8, 15: 9, 16: 10, 18: 11, 12: 12, 13: 13 },
  },
  {
    id: 'avanzado', titulo: 'Grupo avanzado', icono: '⚡',
    letras: 'Sílabas trabadas · br, bl, tr, dr, fr, fl, cr, cl, gr…', fondo: '#F3E8FF', acento: '#DCC3EA',
    ordenes: { 7: 19, 8: 20 },
  },
  {
    id: 'complementarios', titulo: 'Ejercicios complementarios', icono: '📝',
    fondo: '#F1F5F9', acento: '#CBD5E1',
  },
  {
    id: 'dictados', titulo: 'Dictados', icono: '🎧',
    fondo: '#EEF2FF', acento: '#C7D2FE',
  },
];

const ubicaciones = new Map(GRUPOS.flatMap(({ id, ordenes = {} }) =>
  Object.entries(ordenes).map(([orden, posicion]) => [Number(orden), { id, posicion }])
));

export function agruparEjercicios(ejercicios) {
  const grupos = GRUPOS.map(grupo => ({ ...grupo, ejercicios: [] }));
  const gruposPorId = new Map(grupos.map(grupo => [grupo.id, grupo]));

  for (const ejercicio of ejercicios) {
    const pedagogia = leerPedagogia(ejercicio);
    const orden = Number(pedagogia?.orden) || 0;
    const ubicacion = ubicaciones.get(orden);
    const id = ejercicio.tipo === 'dictado' ? 'dictados' : pedagogia?.grupo ?? ubicacion?.id;
    const grupo = gruposPorId.get(id) ?? gruposPorId.get('complementarios');
    grupo.ejercicios.push({ ejercicio, orden: pedagogia?.orden_grupo ?? ubicacion?.posicion ?? orden });
  }

  return grupos.filter(({ ejercicios }) => ejercicios.length > 0).map(grupo => ({
    ...grupo,
    ejercicios: grupo.ejercicios
      .sort((a, b) => a.orden - b.orden)
      .map(({ ejercicio }) => ejercicio),
  }));
}
