import { useId } from 'react';

export const CUADRO = 40;

export default function FondoCuaderno({ cuadro = CUADRO, ancho, alto }) {
  const id = useId();
  const escala = cuadro / CUADRO;

  return (
    <svg aria-hidden="true" viewBox={ancho && alto ? `0 0 ${ancho} ${alto}` : undefined}
      preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <pattern id={`${id}-cuadros`} width={cuadro} height={cuadro} patternUnits="userSpaceOnUse">
          <path d={`M${cuadro} 0H0V${cuadro}`} stroke="#EDE9FE" strokeWidth={2 * escala} fill="none" />
        </pattern>
        <pattern id={`${id}-margen`} width={cuadro} height={3 * cuadro} patternUnits="userSpaceOnUse">
          <g transform={`scale(${escala})`}>
            <circle cx="20" cy="20" r="3.5" fill="#A78BFA" />
            <circle cx="20" cy="60" r="3.5" fill="#A78BFA" />
            <path d="M12 92l16 16M28 92l-16 16" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-cuadros)`} />
      <rect width={cuadro} height="100%" fill={`url(#${id}-margen)`} />
      <rect x={cuadro - escala} width={2 * escala} height="100%" fill="#C4B5FD" />
    </svg>
  );
}
