'use client';
import { useCallback, useEffect, useState } from 'react';
import RetroalimentacionEjercicio from '../RetroalimentacionEjercicio';

export function useRetroalimentacion(idAlumno) {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const actualizar = useCallback(() => setRevision(v => v + 1), []);
  const guardarEstadoPractica = (practica) => {
    setRecomendaciones(lista => lista.map(item =>
      item.practica?.id_recomendacion === practica.id_recomendacion ? { ...item, practica } : item));
    actualizar();
  };

  useEffect(() => {
    if (!idAlumno) return;
    const controller = new AbortController();
    let enCurso = false;
    const cargar = async () => {
      if (enCurso || controller.signal.aborted) return;
      enCurso = true;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/retroalimentacion`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('No se pudo cargar tu retroalimentación. Intenta de nuevo.');
        const data = await res.json();
        if (!controller.signal.aborted) {
          setRecomendaciones(data);
          setError('');
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message);
      } finally {
        enCurso = false;
        if (!controller.signal.aborted) setCargando(false);
      }
    };
    const refrescar = () => { if (!document.hidden) cargar(); };
    cargar();
    const intervalo = setInterval(refrescar, 60000);
    window.addEventListener('focus', refrescar);
    return () => {
      controller.abort();
      clearInterval(intervalo);
      window.removeEventListener('focus', refrescar);
    };
  }, [idAlumno, revision]);
  return { recomendaciones, cargando, error, actualizar, guardarEstadoPractica };
}

export default function TabRetroalimentacion({ recomendaciones, cargando, error, actualizar, guardarEstadoPractica }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-800">Mi retroalimentación</h2>
      <p className="mt-2 mb-5 text-sm text-slate-600">Aquí encontrarás prácticas recomendadas después de que tu tutor califique tus intentos. Tu tutor también puede consultarlas.</p>
      {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <p>{error}</p>
        <button type="button" onClick={actualizar} className="mt-2 min-h-11 underline font-bold">Volver a intentar</button>
      </div>}
      {cargando ? <p role="status" className="p-6 text-slate-600">Cargando recomendaciones...</p> : (
        <div className="space-y-6">
          {!error && recomendaciones.length === 0 && <p className="rounded-2xl bg-white border border-violet-200 p-6 text-slate-700">
            Aún no tienes recomendaciones. Aparecerán aquí si un promedio confirmado de legibilidad u ortografía es menor a 6/10.
          </p>}
          {recomendaciones.map(item => <article key={item.practica?.id_recomendacion ?? item.id_intento}>
            <p className="mb-2 text-sm font-semibold text-slate-600">
              {item.titulo_ejercicio} · Intento del {new Date(item.fecha_envio).toLocaleString('es-MX')}
            </p>
            <RetroalimentacionEjercicio recomendacion={item.recomendacion} idIntento={item.id_intento}
              practica={item.practica} onPracticaGuardada={guardarEstadoPractica} />
          </article>)}
        </div>
      )}
    </div>
  );
}
