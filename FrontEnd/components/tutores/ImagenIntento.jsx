import { useState } from 'react';
import FondoCuaderno, { CUADRO } from '../FondoCuaderno';

export default function ImagenIntento({ src, cuadroPx, ampliada = false }) {
  const [dimensiones, setDimensiones] = useState(null);
  // Las entregas anteriores del lienzo son PNG. Sin la escala original, se usan cuadros aproximados.
  const esLienzo = cuadroPx > 0 || src.startsWith('data:image/png;base64,');
  const conCuadricula = esLienzo && dimensiones;

  return (
    <span className="relative isolate inline-block max-w-full overflow-hidden rounded bg-white align-middle">
      {conCuadricula && (
        <FondoCuaderno ancho={dimensiones.ancho} alto={dimensiones.alto} cuadro={cuadroPx || CUADRO} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={ampliada ? 'Intento del alumno ampliado' : 'Intento del alumno'}
        className={`relative block max-w-full object-contain ${ampliada ? 'max-h-[calc(100dvh-1rem)]' : 'max-h-[50dvh] md:max-h-[300px]'}`}
        style={{ mixBlendMode: conCuadricula ? 'multiply' : undefined }}
        onLoad={({ currentTarget }) => setDimensiones({ ancho: currentTarget.naturalWidth, alto: currentTarget.naturalHeight })} />
    </span>
  );
}
