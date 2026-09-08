'use client';
import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Circle, Loader2, Tag, X } from 'lucide-react';

const TabEjercicios = ({ idTutor }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [activados, setActivados] = useState(new Set());
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState(null);
  const [error, setError] = useState('');
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [fechaFin, setFechaFin] = useState('');
  const [token, setToken] = useState('');

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
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutor/ejercicios/`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutor/ejercicios/${idTutor}`, { headers }),
        ]);
        if (!resEjercicios.ok || !resActivados.ok) throw new Error('Error al cargar los ejercicios');
        const dataEjercicios = await resEjercicios.json();
        const dataActivados = await resActivados.json();
        setEjercicios(dataEjercicios);
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/tutor/ejercicio/activar/`,
          {
            method: 'POST', headers,
            body: JSON.stringify({ id_ejercicio, id_usuario: idTutor, fecha_fin: formatearFechaParaSQL(fechaFin) }),
          }
        );
        if (!res.ok) throw new Error('No se pudo activar el ejercicio');
        setActivados((prev) => new Set(prev).add(id_ejercicio));
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
        <span className="font-black text-sm px-4 py-2"
          style={{ background: '#EDE9FE', color: '#6D28D9', borderRadius: '20px', border: '2px solid #DDD6FE' }}>
          ✅ {activados.size} / {ejercicios.length} activados
        </span>
      </div>

      {error && (
        <div className="mb-4 p-4 font-bold text-sm"
          style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
          😅 {error}
        </div>
      )}

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ejercicios.map((ejercicio) => {
          const activo = activados.has(ejercicio.id_ejercicio);
          return (
            <div
              key={ejercicio.id_ejercicio}
              onClick={() => setEjercicioSeleccionado(ejercicio)}
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
          <div className="bg-white w-full max-w-lg p-7 relative"
            style={{ borderRadius: '28px', border: '3px solid #DDD6FE', boxShadow: '0 10px 0 #C4B5FD' }}
            onClick={(e) => e.stopPropagation()}>

            <button onClick={() => setEjercicioSeleccionado(null)}
              className="absolute top-4 right-4 p-2"
              style={{ background: '#F3F4F6', borderRadius: '12px', color: '#6B7280' }}>
              <X size={20} />
            </button>

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
            <p className="font-semibold text-gray-500 text-sm leading-relaxed mb-5">
              {ejercicioSeleccionado.descripcion}
            </p>

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
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full p-3 font-bold text-sm"
                  style={{
                    border: '2.5px solid #DDD6FE', borderRadius: '14px',
                    background: '#FAFAFA', color: '#4C1D95', outline: 'none',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                />
              )}
            </div>

            {/* Botón activar/desactivar */}
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
      )}
    </div>
  );
};

export default TabEjercicios;