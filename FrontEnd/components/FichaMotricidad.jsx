export default function FichaMotricidad({ ficha }) {
  if (!ficha || ficha.tipo === 'planas') return null;
  if (ficha.tipo === 'laberinto') {
    const u = 40, margen = 55, ancho = ficha.columnas * u, alto = ficha.filas * u;
    return (
      <svg viewBox={`0 0 ${ancho + margen * 2} ${alto + 30}`} role="img" aria-label="Laberinto: entrada a la izquierda y salida a la derecha. Descarga la ficha para trazar el recorrido."
        className="w-full max-w-xl mx-auto text-slate-700">
        <g transform={`translate(${margen}, 15)`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {ficha.paredes.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1 * u} y1={y1 * u} x2={x2 * u} y2={y2 * u} />)}
        </g>
        <g fill="currentColor" fontSize="11" fontFamily="sans-serif">
          <text x={margen - 7} y={15 + u / 2 + 4} textAnchor="end">Entrada</text>
          <text x={margen + ancho + 7} y={15 + alto - u / 2 + 4}>Salida</text>
        </g>
      </svg>
    );
  }
  if (ficha.tipo === 'bolitas') {
    return (
      <svg viewBox="0 0 520 210" role="img" aria-label="Diez círculos numerados para colocar bolitas de papel."
        className="w-full max-w-xl mx-auto text-slate-700">
        {Array.from({ length: 10 }, (_, i) => {
          const columna = i < 5 ? i % 5 : 4 - i % 5;
          const x = 52 + columna * 104, y = i < 5 ? 52 : 156;
          return <g key={i}>
            <circle cx={x} cy={y} r="28" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fill="currentColor">{i + 1}</text>
          </g>;
        })}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 520 210" role="img" aria-label="Hoja con cinco líneas verticales como guía para rasgar tiras con las manos."
      className="w-full max-w-xl mx-auto text-slate-700">
      <rect x="10" y="10" width="500" height="190" fill="none" stroke="#9ca3af" />
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={10 + (i + 1) * 500 / 6} x2={10 + (i + 1) * 500 / 6}
        y1="10" y2="200" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5" />)}
    </svg>
  );
}
