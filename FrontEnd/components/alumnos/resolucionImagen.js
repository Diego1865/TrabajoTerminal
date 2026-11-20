/*
 * Contiene funciones auxiliares relacionadas con resolucionImagen.
 */

export const LADO_LARGO_MINIMO = 1024;
export const LADO_CORTO_MINIMO = 768;
export const MENSAJE_RESOLUCION = 'Usa una imagen de al menos 1024 × 768 píxeles (o 768 × 1024 en vertical).';

export function tieneResolucionMinima(ancho, alto) {
  return Math.max(ancho, alto) >= LADO_LARGO_MINIMO && Math.min(ancho, alto) >= LADO_CORTO_MINIMO;
}
