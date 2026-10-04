export default function EvaluacionPreliminar({ evaluacion, onUsarSugerencia }) {
  if (!evaluacion) return <p className="mt-4 text-sm text-gray-500">Este intento es anterior a la evaluación automática.</p>;
  const observaciones = evaluacion.observaciones || [];
  const sugerencia = [evaluacion.resumen, ...observaciones.map(o =>
    `${o.tipo}: se esperaba «${o.esperado || 'sin texto adicional'}» y se reconoció «${o.detectado || 'sin texto'}».`
  ), evaluacion.aviso].filter(Boolean).join('\n');
  return (
    <section className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-gray-800">
      <h3 className="font-bold">Evaluación preliminar · Pendiente de revisión</h3>
      <p className="text-sm mt-2">{evaluacion.resumen}</p>
      {evaluacion.texto_esperado && <p className="text-sm mt-2"><strong>Respuesta esperada:</strong> {evaluacion.texto_esperado}</p>}
      {evaluacion.simbolos_baja_confianza > 0 && <p className="text-sm mt-2">Hay caracteres con reconocimiento incierto. Contrasta la transcripción con la imagen.</p>}
      {observaciones.length > 0 && (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm text-left">
            <thead><tr><th className="p-2">Posible diferencia</th><th className="p-2">Esperado</th><th className="p-2">Reconocido</th></tr></thead>
            <tbody>{observaciones.map((o, i) => <tr key={i} className="border-t border-amber-200">
              <td className="p-2">{o.tipo}</td><td className="p-2">{o.esperado || '—'}</td><td className="p-2">{o.detectado || '—'}</td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
      {evaluacion.aviso && <p className="text-xs mt-3">{evaluacion.aviso}</p>}
      {evaluacion.estado === 'preliminar' && <button type="button" onClick={() => onUsarSugerencia(sugerencia)}
        className="mt-3 px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-bold">
        Copiar propuesta a comentarios
      </button>}
    </section>
  );
}
