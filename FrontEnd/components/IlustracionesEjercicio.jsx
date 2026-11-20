/*
 * Implementa el componente IlustracionesEjercicio y muestra una parte de la interfaz.
 */

export default function IlustracionesEjercicio({ src, tarjetas, alturaMaxima }) {
  if (!tarjetas?.length) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="Imagen de referencia" className="max-w-full rounded-lg object-contain"
        style={{ maxHeight: alturaMaxima }} />
    );
  }

  return (
    <ul className="letra-escolar flex flex-wrap justify-center gap-2">
      {tarjetas.map(({ dibujo, palabra }) => (
        <li key={palabra} className="flex min-w-24 flex-col items-center rounded-xl border-2 border-amber-400 bg-amber-50 px-2.5 py-2 text-stone-900">
          <span aria-hidden="true" className="text-4xl leading-tight">{dibujo}</span>
          <span className="font-black">{palabra}</span>
        </li>
      ))}
    </ul>
  );
}
