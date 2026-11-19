export function inicialMayuscula(palabra) {
  return palabra.replace(/^\p{L}/u, letra => letra.toLocaleUpperCase('es'));
}
