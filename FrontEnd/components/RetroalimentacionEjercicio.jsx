'use client';
import { useState } from 'react';
import { Download, Loader2, NotebookPen } from 'lucide-react';
import FichaMotricidad from './FichaMotricidad';
import SeguimientoPractica from './SeguimientoPractica';

export default function RetroalimentacionEjercicio({ recomendacion, idIntento, rol = 'alumno', practica, onPracticaGuardada }) {
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState('');
  if (!recomendacion) return null;
  const descargar = async () => {
    setDescargando(true);
    setError('');
    try {
      const ruta = rol === 'tutor' ? `/api/tutor/intentos/${idIntento}/retroalimentacion/pdf`
        : `/api/alumno/retroalimentacion/${idIntento}/pdf`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ruta}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        const respuesta = await res.json().catch(() => ({}));
        throw new Error(typeof respuesta.detail === 'string' ? respuesta.detail : 'No se pudo descargar la ficha. Intenta de nuevo.');
      }
      const archivo = await res.blob();
      const url = URL.createObjectURL(archivo);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = `practica-${idIntento}.pdf`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDescargando(false);
    }
  };
  return (
    <section className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 sm:p-5 text-slate-800">
      <div className="flex items-center gap-2 text-violet-800 text-sm font-bold">
        <NotebookPen size={20} aria-hidden="true" /> Retroalimentación · Práctica opcional
      </div>
      <h3 className="mt-2 text-lg font-black">{recomendacion.titulo}</h3>
      <p className="mt-2 text-sm">{recomendacion.motivo}</p>
      <p className="mt-2 text-sm text-violet-800">Puedes practicar a tu ritmo y compartir una foto con el tutor. La práctica es opcional y no afecta tu calificación.</p>
      <p className="mt-3 text-sm font-semibold">{recomendacion.objetivo}</p>
      <p className="mt-2 text-sm"><strong>Materiales:</strong> {recomendacion.materiales?.join(', ')}.</p>
      <p className="mt-1 text-sm"><strong>Tiempo sugerido:</strong> {recomendacion.duracion}.</p>
      {recomendacion.texto_practica && <div className="mt-4 rounded-xl border border-violet-200 bg-white p-3">
        <p className="text-xs font-bold text-violet-800 mb-2">Texto de práctica</p>
        <p className="whitespace-pre-wrap break-words text-lg leading-8">{recomendacion.texto_practica}</p>
      </div>}
      <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm">
        {recomendacion.pasos.map((paso, i) => <li key={i}>{paso}</li>)}
      </ol>
      {recomendacion.ficha?.tipo !== 'planas' && <div className="mt-4 rounded-xl bg-white border border-violet-200 p-3">
        <p className="text-xs font-bold text-violet-800 mb-2">Modelo para practicar en papel</p>
        <FichaMotricidad ficha={recomendacion.ficha} />
      </div>}
      <p className="mt-4 text-sm"><strong>Para terminar:</strong> {recomendacion.cierre}</p>
      <button type="button" onClick={descargar} disabled={descargando || !idIntento}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-4 py-2 font-bold text-sm text-white hover:bg-violet-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
        {descargando ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
        {descargando ? 'Preparando ficha...' : 'Descargar ficha PDF'}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <p className="mt-2 text-xs text-slate-600">La ficha se genera aquí. Puedes imprimirla o seguir las instrucciones con materiales que tengas en casa.</p>
      <SeguimientoPractica key={recomendacion.generada_en ?? idIntento} idIntento={idIntento} rol={rol}
        practicaAlumno={practica} onPracticaGuardada={onPracticaGuardada} />
    </section>
  );
}
