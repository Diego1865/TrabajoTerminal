'use client';
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, CheckCircle2, Circle, Loader2, Tag, X } from 'lucide-react';
import CrearDictado from './CrearDictado';
import { METODOS, ERRORES, MODALIDADES, leerContenido, leerPedagogia } from '../pedagogiaEjercicio';

const Seccion = ({ titulo, children }) => (
  <section className="mb-5 p-4" style={{ background: '#FAFAFF', border: '2px solid #EDE9FE', borderRadius: '16px' }}>
    <h4 className="font-black uppercase text-xs tracking-wider mb-3" style={{ color: '#8B5CF6' }}>{titulo}</h4>
    {children}
  </section>
);

// Lo esencial de contenido_base: lo que ve el alumno y contra qué se compara su escritura.
const VistaAlumno = ({ ejercicio }) => {
  const contenido = leerContenido(ejercicio);
  const pista = contenido.pedagogia?.pista;
  const modo = contenido.evaluacion?.modo;
  const respuestas = contenido.evaluacion?.respuestas_aceptadas ?? [];
  return (
    <>
      <Seccion titulo="Lo que verá el alumno">
        <p className="text-xs font-black text-violet-900 mb-1">Instrucción</p>
        <p className="font-semibold text-gray-700 text-sm leading-relaxed mb-3">{ejercicio.descripcion}</p>
        {pista && (
          <p className="mb-3 px-3 py-2 text-sm font-bold"
            style={{ background: '#FFFBEB', border: '2px solid #FDE68A', borderRadius: '12px', color: '#92400E' }}>
            💡 <span className="font-black">Pista:</span> {pista}
          </p>
        )}
        {contenido.imagen_guia && (
          <div className="mb-3 p-2 flex justify-center bg-white" style={{ border: '2px solid #EDE9FE', borderRadius: '12px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={contenido.imagen_guia} alt="Imagen de referencia del ejercicio"
              className="max-w-full object-contain" style={{ maxHeight: '120px' }} />
          </div>
        )}
        {contenido.texto_guia && (
          <div className="px-3 py-2 bg-white" style={{ border: '2px solid #EDE9FE', borderRadius: '12px' }}>
            <p className="text-xs font-black text-violet-400 mb-1">Modelo</p>
            <p className="font-black text-center text-gray-800 whitespace-pre-wrap" style={{ fontSize: '1.15rem' }}>
              {contenido.texto_guia}
            </p>
          </div>
        )}
      </Seccion>
      {respuestas.length > 0 && (
        <Seccion titulo="Cómo se evalúa">
          {MODALIDADES[modo] && <p className="text-sm font-semibold text-gray-600 mb-2">{MODALIDADES[modo]}.</p>}
          <p className="text-xs font-black text-violet-900 mb-1">
            {respuestas.length > 1 ? 'Respuestas aceptadas' : 'Respuesta esperada'}
          </p>
          <ul className="flex flex-col gap-1">
            {respuestas.map(r => (
              <li key={r} className="px-3 py-1.5 text-sm font-black text-green-900"
                style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '10px' }}>
                ✓ {r}
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-gray-400 mt-2">
            {respuestas.length > 1 ? 'El CLS compara la escritura del alumno con la respuesta aceptada más parecida' : 'El CLS compara la escritura del alumno con esta respuesta'}; tú confirmas el resultado al calificar.
          </p>
        </Seccion>
      )}
    </>
  );
};

const ChipMetodo = ({ metodo }) => {
  const m = METODOS[metodo];
  return (
    <span className="px-2 py-0.5 text-xs font-black whitespace-nowrap"
      style={{ background: m.bg, border: `1.5px solid ${m.borde}`, borderRadius: '8px', color: m.color }}>
      {m.etiqueta}
    </span>
  );
};

const ChipError = ({ error }) => {
  const e = ERRORES[error];
  if (!e) return null;
  return (
    <span className="px-2 py-0.5 text-xs font-black whitespace-nowrap text-gray-600"
      style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: '8px' }}>
      <span aria-hidden="true">{e.emoji}</span> {e.etiqueta}
    </span>
  );
};

const Filtro = ({ etiqueta, valor, opciones, onCambiar }) => (
  <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={etiqueta}>
    <span className="text-xs font-black uppercase tracking-wider text-gray-400 mr-1">{etiqueta}</span>
    {[['todos', 'Todos'], ...opciones].map(([clave, texto]) => (
      <button key={clave} type="button" aria-pressed={valor === clave} onClick={() => onCambiar(clave)}
        className="px-3 py-1 text-xs font-black transition-all"
        style={{
          borderRadius: '10px',
          background: valor === clave ? '#7C3AED' : 'white',
          color: valor === clave ? 'white' : '#6D28D9',
          border: `2px solid ${valor === clave ? '#7C3AED' : '#DDD6FE'}`,
        }}>
        {texto}
      </button>
    ))}
  </div>
);

const TabEjercicios = ({ idTutor }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [activados, setActivados] = useState(new Set());
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState(null);
  const [error, setError] = useState('');
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [fechaFin, setFechaFin] = useState('');
  const [token, setToken] = useState('');
  const [crearDictado, setCrearDictado] = useState(false);
  const [aviso, setAviso] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('todos');
  const [filtroError, setFiltroError] = useState('todos');

  // Dictados propios primero; luego el catálogo en el orden de la ruta pedagógica.
  const ejerciciosVisibles = useMemo(() => ejercicios
    .map(e => ({ ...e, pedagogia: leerPedagogia(e) }))
    .filter(e => (filtroMetodo === 'todos' || e.pedagogia?.metodo === filtroMetodo)
      && (filtroError === 'todos' || e.pedagogia?.error_objetivo === filtroError))
    .sort((a, b) => (a.pedagogia?.orden ?? 0) - (b.pedagogia?.orden ?? 0)),
  [ejercicios, filtroMetodo, filtroError]);
  const erroresPresentes = useMemo(() => {
    const claves = new Set(ejercicios.map(e => leerPedagogia(e)?.error_objetivo).filter(Boolean));
    return Object.entries(ERRORES).filter(([clave]) => claves.has(clave)).map(([clave, e]) => [clave, e.etiqueta]);
  }, [ejercicios]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || '');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoadingPage(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [resEjercicios, resActivados] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutor/ejercicios`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutor/ejercicios/${idTutor}`, { headers }),
        ]);
        if (!resEjercicios.ok || !resActivados.ok) throw new Error('Error al cargar los ejercicios');
        const dataEjercicios = await resEjercicios.json();
        const dataActivados = await resActivados.json();
        setEjercicios(dataEjercicios.map(e => ({ ...e, fecha_fin: dataActivados.find(a => a.id_ejercicio === e.id_ejercicio)?.fecha_fin })));
        setActivados(new Set(dataActivados.map((e) => e.id_ejercicio)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPage(false);
      }
    };
    if (idTutor && token) fetchData();
  }, [idTutor, token]);

  const formatearFechaParaSQL = (fecha) => {
    if (!fecha) return null;
    return fecha.length === 16 ? `${fecha}:00` : fecha;
  };

  const handleToggle = async (id_ejercicio) => {
    setLoadingToggle(id_ejercicio);
    const estaActivado = activados.has(id_ejercicio);
    try {
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      if (estaActivado) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tutor/ejercicio/desactivar/${idTutor}/${id_ejercicio}`,
          { method: 'DELETE', headers }
        );
        if (!res.ok) throw new Error('No se pudo desactivar el ejercicio');
        setActivados((prev) => { const next = new Set(prev); next.delete(id_ejercicio); return next; });
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tutor/ejercicio/activar`,
          {
            method: 'POST', headers,
            body: JSON.stringify({ id_ejercicio, id_usuario: idTutor,
              fecha_fin: ejercicioSeleccionado?.tipo === 'dictado' && fechaFin ? new Date(fechaFin).toISOString() : formatearFechaParaSQL(fechaFin) }),
          }
        );
        if (!res.ok) throw new Error('No se pudo activar el ejercicio');
        setActivados((prev) => new Set(prev).add(id_ejercicio));
        const fechaGuardada = fechaFin ? new Date(fechaFin).toISOString() : null;
        setEjercicios(prev => prev.map(e => e.id_ejercicio === id_ejercicio ? { ...e, fecha_fin: fechaGuardada } : e));
        setEjercicioSeleccionado(prev => prev ? { ...prev, fecha_fin: fechaGuardada } : prev);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingToggle(null);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div style={{ fontSize: '3rem' }}>📚</div>
        <Loader2 className="animate-spin" size={32} style={{ color: '#8B5CF6' }} />
        <p className="font-bold text-gray-400">Cargando ejercicios...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .exercise-card { transition: transform 0.15s, box-shadow 0.15s; }
        .exercise-card:hover { transform: translateY(-3px); }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.8rem' }}>📚</span>
          <div>
            <h2 className="font-black" style={{ fontSize: '1.5rem', color: '#1E3A5F' }}>Ejercicios Disponibles</h2>
            <p className="font-semibold text-gray-400 text-sm">Activa ejercicios para tus alumnos</p>
          </div>
        </div>
        <button onClick={() => setCrearDictado(true)} className="rounded-xl bg-violet-700 px-4 py-3 font-black text-white">
          + Nuevo dictado
        </button>
        <span className="font-black text-sm px-4 py-2"
          style={{ background: '#EDE9FE', color: '#6D28D9', borderRadius: '20px', border: '2px solid #DDD6FE' }}>
          ✅ {activados.size} / {ejercicios.length} activados
        </span>
      </div>

      {aviso && <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 font-bold text-green-800">{aviso}</p>}
      {crearDictado && <CrearDictado token={token} onCerrar={() => setCrearDictado(false)} onCreado={ejercicio => {
        setEjercicios(prev => [ejercicio, ...prev]);
        setActivados(prev => new Set(prev).add(ejercicio.id_ejercicio));
        setCrearDictado(false);
        setAviso('Dictado creado y activado para tus alumnos.');
      }} />}

      {error && (
        <div className="mb-4 p-4 font-bold text-sm"
          style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
          😅 {error}
        </div>
      )}

      {/* Filtros del catálogo */}
      {erroresPresentes.length > 0 && (
        <div className="mb-5 flex flex-col gap-2.5 p-4"
          style={{ background: '#FAFAFF', border: '2px solid #EDE9FE', borderRadius: '18px' }}>
          <Filtro etiqueta="Método" valor={filtroMetodo} onCambiar={setFiltroMetodo}
            opciones={Object.entries(METODOS).map(([clave, m]) => [clave, m.etiqueta])} />
          <Filtro etiqueta="Error" valor={filtroError} onCambiar={setFiltroError} opciones={erroresPresentes} />
        </div>
      )}

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ejerciciosVisibles.map((ejercicio) => {
          const activo = activados.has(ejercicio.id_ejercicio);
          return (
            <div
              key={ejercicio.id_ejercicio}
              onClick={() => { setFechaFin(''); setEjercicioSeleccionado(ejercicio); }}
              className="exercise-card relative cursor-pointer select-none"
              style={{
                padding: '20px',
                borderRadius: '20px',
                border: activo ? '2.5px solid #C4B5FD' : '2.5px solid #E5E7EB',
                background: activo ? '#F5F3FF' : 'white',
                boxShadow: activo ? '0 4px 0 #C4B5FD' : '0 4px 0 #E5E7EB',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = activo ? '0 7px 0 #A78BFA' : '0 7px 0 #D1D5DB';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = activo ? '0 4px 0 #C4B5FD' : '0 4px 0 #E5E7EB';
              }}>

              {/* Indicador activo */}
              <div className="absolute top-4 right-4">
                {activo
                  ? <CheckCircle2 size={20} style={{ color: '#7C3AED' }} />
                  : <Circle size={20} style={{ color: '#D1D5DB' }} />}
              </div>

              {/* Tipo */}
              <div className="flex items-center gap-1.5 mb-3">
                <Tag size={11} style={{ color: activo ? '#A78BFA' : '#D1D5DB' }} />
                <span className="font-bold uppercase text-xs tracking-wider"
                  style={{ color: activo ? '#8B5CF6' : '#9CA3AF' }}>
                  {ejercicio.tipo}
                </span>
              </div>
              {ejercicio.pedagogia && (
                <div className="flex flex-wrap gap-1.5 mb-3 pr-6">
                  <ChipMetodo metodo={ejercicio.pedagogia.metodo} />
                  <ChipError error={ejercicio.pedagogia.error_objetivo} />
                </div>
              )}

              {/* Contenido */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2.5 flex items-center justify-center"
                  style={{ background: activo ? '#EDE9FE' : '#F3F4F6', borderRadius: '14px', fontSize: '1.3rem' }}>
                  {activo ? '📖' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm leading-tight mb-1"
                    style={{ color: activo ? '#4C1D95' : '#374151' }}>
                    {ejercicio.titulo}
                  </h4>
                  <p className="text-xs font-semibold text-gray-400 line-clamp-2 leading-relaxed">
                    {ejercicio.descripcion}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 text-xs font-black text-center"
                style={{
                  borderTop: activo ? '2px dashed #DDD6FE' : '2px dashed #F3F4F6',
                  color: activo ? '#7C3AED' : '#9CA3AF',
                }}>
                {activo ? '✅ Visible para tus alumnos' : '👆 Ver detalle'}
              </div>
            </div>
          );
        })}
      </div>

      {ejercicios.length > 0 && ejerciciosVisibles.length === 0 && (
        <p className="text-center py-10 font-black text-gray-400">No hay ejercicios con esos filtros.</p>
      )}

      {ejercicios.length === 0 && (
        <div className="text-center py-16">
          <div style={{ fontSize: '4rem' }} className="mb-4">📚</div>
          <p className="font-black text-gray-400 text-lg">No hay ejercicios disponibles aún</p>
        </div>
      )}

      {/* Modal de detalle */}
      {ejercicioSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setEjercicioSeleccionado(null)}>
          <div className="bg-white w-full max-w-lg relative flex flex-col overflow-hidden max-h-[calc(100dvh-2rem)]"
            style={{ borderRadius: '28px', border: '3px solid #DDD6FE', boxShadow: '0 10px 0 #C4B5FD' }}
            onClick={(e) => e.stopPropagation()}>

            <button onClick={() => setEjercicioSeleccionado(null)} aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 p-3"
              style={{ background: '#F3F4F6', borderRadius: '12px', color: '#6B7280' }}>
              <X size={20} />
            </button>

            {/* Contenido con scroll propio; Activar/Desactivar queda fijo abajo. */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 pb-2 sm:pb-2">
            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={13} style={{ color: '#A78BFA' }} />
              <span className="font-black uppercase text-xs tracking-wider" style={{ color: '#8B5CF6' }}>
                {ejercicioSeleccionado.tipo}
              </span>
            </div>

            <div style={{ fontSize: '2.5rem' }} className="mb-2">
              {activados.has(ejercicioSeleccionado.id_ejercicio) ? '📖' : '📄'}
            </div>
            <h3 className="font-black mb-3 pr-8" style={{ fontSize: '1.4rem', color: '#1E3A5F' }}>
              {ejercicioSeleccionado.titulo}
            </h3>
            {ejercicioSeleccionado.tipo !== 'dictado' && (
              <VistaAlumno ejercicio={ejercicioSeleccionado} />
            )}
            {ejercicioSeleccionado.tipo === 'dictado' && (
              <p className="font-semibold text-gray-500 text-sm leading-relaxed mb-5">
                {ejercicioSeleccionado.descripcion}
              </p>
            )}

            {ejercicioSeleccionado.pedagogia && (() => {
              const p = ejercicioSeleccionado.pedagogia;
              return (
                <Seccion titulo="Propósito pedagógico">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <ChipMetodo metodo={p.metodo} />
                    <ChipError error={p.error_objetivo} />
                    <span className="px-2 py-0.5 text-xs font-black text-gray-500">Nivel {p.nivel}</span>
                  </div>
                  <dl className="grid grid-cols-1 gap-2 text-sm">
                    <div><dt className="font-black text-violet-900">Método</dt>
                      <dd className="font-semibold text-gray-600">{METODOS[p.metodo].detalle}</dd></div>
                    <div><dt className="font-black text-violet-900">Habilidad que fortalece</dt>
                      <dd className="font-semibold text-gray-600">{p.habilidad}</dd></div>
                    <div><dt className="font-black text-violet-900">Estrategia</dt>
                      <dd className="font-semibold text-gray-600">{p.estrategia}</dd></div>
                  </dl>
                </Seccion>
              );
            })()}

            {ejercicioSeleccionado.tipo === 'dictado' && <div className="mb-5 rounded-xl bg-violet-50 p-3">
              <h4 className="font-bold text-violet-900">Palabras del dictado (en orden)</h4>
              <ol className="mt-2 list-inside list-decimal text-sm text-gray-700">
                {JSON.parse(ejercicioSeleccionado.contenido_base).dictado.palabras.map((palabra, i) => <li key={i}>{palabra}</li>)}
              </ol>
            </div>}

            {/* Fecha límite */}
            <div className="mb-6">
              <label className="block text-sm font-black mb-2" style={{ color: '#6D28D9' }}>
                📅 Fecha límite de entrega
              </label>
              {activados.has(ejercicioSeleccionado.id_ejercicio) && ejercicioSeleccionado.fecha_fin ? (
                <p className="font-bold text-sm p-3"
                  style={{ background: '#EDE9FE', borderRadius: '14px', color: '#6D28D9' }}>
                  📅 {new Date(ejercicioSeleccionado.fecha_fin).toLocaleDateString('es-MX', {
                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              ) : (
                <input
                  type="datetime-local"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full p-3 font-bold text-sm"
                  style={{
                    border: '2.5px solid #DDD6FE', borderRadius: '14px',
                    background: '#FAFAFA', color: '#4C1D95', outline: 'none',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                />
              )}
            </div>
            </div>

            {/* Botón activar/desactivar */}
            <div className="shrink-0 px-5 sm:px-7 pt-2 pb-5 sm:pb-7">
            <button
              disabled={loadingToggle === ejercicioSeleccionado.id_ejercicio}
              onClick={() => handleToggle(ejercicioSeleccionado.id_ejercicio)}
              className="w-full py-4 font-black text-lg flex items-center justify-center gap-2"
              style={{
                borderRadius: '18px',
                background: activados.has(ejercicioSeleccionado.id_ejercicio)
                  ? 'linear-gradient(135deg, #F87171, #EF4444)'
                  : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                color: 'white',
                boxShadow: activados.has(ejercicioSeleccionado.id_ejercicio)
                  ? '0 5px 0 #B91C1C' : '0 5px 0 #4C1D95',
                opacity: loadingToggle === ejercicioSeleccionado.id_ejercicio ? 0.6 : 1,
                cursor: loadingToggle === ejercicioSeleccionado.id_ejercicio ? 'wait' : 'pointer',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => { if (loadingToggle !== ejercicioSeleccionado.id_ejercicio) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {loadingToggle === ejercicioSeleccionado.id_ejercicio
                ? <><Loader2 className="animate-spin" size={20} /> Procesando...</>
                : activados.has(ejercicioSeleccionado.id_ejercicio)
                  ? '🚫 Desactivar ejercicio'
                  : '🚀 Activar para mis alumnos'
              }
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabEjercicios;
