'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Clock, Loader2, Tag, X } from 'lucide-react';

const TabProximos = ({ idAlumno, onRealizar }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState('');
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchEjercicios = async () => {
      setLoadingPage(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/ejercicios/proximos`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Error al cargar los ejercicios');
        const data = await res.json();
        setEjercicios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPage(false);
      }
    };
    if (idAlumno) fetchEjercicios();
  }, [idAlumno]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha límite';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const diasRestantes = (fecha) => {
    if (!fecha) return null;
    const hoy = new Date();
    const fin = new Date(fecha);
    return Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
  };

  const getBadgeStyle = (dias) => {
    if (dias === null) return null;
    if (dias <= 0) return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', emoji: '🔥', text: '¡Hoy!' };
    if (dias <= 1) return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', emoji: '🔥', text: '¡Mañana!' };
    if (dias <= 3) return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', emoji: '⚡', text: `${dias}d` };
    return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', emoji: '✅', text: `${dias}d` };
  };

  if (loadingPage) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div style={{ fontSize: '3rem' }}>📚</div>
        <Loader2 className="animate-spin" size={32} style={{ color: '#3B82F6' }} />
        <p className="font-bold text-gray-400">Cargando ejercicios...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div style={{ fontSize: '2rem' }}>📋</div>
        <div>
          <h2 className="font-black" style={{ fontSize: '1.6rem', color: '#1E3A5F' }}>Ejercicios Próximos</h2>
          <p className="font-semibold text-gray-400 text-sm">
            Tienes <span style={{ color: '#3B82F6', fontWeight: 900 }}>{ejercicios.length}</span> ejercicio{ejercicios.length !== 1 ? 's' : ''} pendiente{ejercicios.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 font-bold text-sm" style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
          😅 {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ejercicios.map((ejercicio) => {
          const dias = diasRestantes(ejercicio.fecha_desactivacion);
          const badge = getBadgeStyle(dias);

          return (
            <div
              key={ejercicio.id_ejercicio_tutor}
              onClick={() => setEjercicioSeleccionado(ejercicio)}
              className="relative cursor-pointer select-none"
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '2.5px solid #BFDBFE',
                boxShadow: '0 4px 0 #BFDBFE',
                padding: '20px',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 7px 0 #93C5FD'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #BFDBFE'; }}>

              {/* Badge días restantes */}
              {badge && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 font-black text-xs"
                  style={{ background: badge.bg, color: badge.color, border: `2px solid ${badge.border}`, borderRadius: '20px' }}>
                  <span>{badge.emoji}</span> {badge.text}
                </div>
              )}

              {/* Tipo */}
              <div className="flex items-center gap-1.5 mb-3">
                <Tag size={11} style={{ color: '#93C5FD' }} />
                <span className="font-bold uppercase text-xs tracking-wider" style={{ color: '#93C5FD' }}>
                  {ejercicio.tipo}
                </span>
              </div>

              {/* Contenido */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2.5 flex items-center justify-center"
                  style={{ background: '#EFF6FF', borderRadius: '14px', fontSize: '1.4rem' }}>
                  📝
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm leading-tight mb-1 text-gray-800">{ejercicio.titulo}</h4>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed line-clamp-2">{ejercicio.descripcion}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 flex items-center gap-1.5" style={{ borderTop: '2px dashed #DBEAFE' }}>
                <Clock size={12} style={{ color: '#93C5FD' }} />
                <span className="text-xs font-bold text-gray-400">{formatearFecha(ejercicio.fecha_desactivacion)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {ejercicios.length === 0 && !loadingPage && (
        <div className="text-center py-16">
          <div style={{ fontSize: '4rem' }} className="mb-4">🎉</div>
          <p className="font-black text-gray-400 text-lg">¡No tienes ejercicios pendientes!</p>
          <p className="font-semibold text-gray-300 text-sm mt-1">¡Buen trabajo! 🌟</p>
        </div>
      )}

      {/* Modal detalle */}
      {ejercicioSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setEjercicioSeleccionado(null)}>
          <div className="bg-white w-full max-w-lg p-7 relative"
            style={{ borderRadius: '28px', border: '3px solid #BFDBFE', boxShadow: '0 10px 0 #93C5FD' }}
            onClick={(e) => e.stopPropagation()}>

            <button onClick={() => setEjercicioSeleccionado(null)}
              className="absolute top-4 right-4 p-2 font-bold"
              style={{ background: '#F3F4F6', borderRadius: '12px', color: '#6B7280' }}>
              <X size={20} />
            </button>

            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={13} style={{ color: '#93C5FD' }} />
              <span className="font-black uppercase text-xs tracking-wider" style={{ color: '#93C5FD' }}>
                {ejercicioSeleccionado.tipo}
              </span>
            </div>

            <div style={{ fontSize: '2.5rem' }} className="mb-2">📝</div>
            <h3 className="font-black mb-3 pr-8" style={{ fontSize: '1.4rem', color: '#1E3A5F' }}>
              {ejercicioSeleccionado.titulo}
            </h3>
            <p className="font-semibold text-gray-500 text-sm leading-relaxed mb-5">
              {ejercicioSeleccionado.descripcion}
            </p>

            <div className="flex items-center gap-3 mb-6 p-4"
              style={{ background: '#EFF6FF', borderRadius: '16px', border: '2px solid #BFDBFE' }}>
              <span style={{ fontSize: '1.4rem' }}>⏰</span>
              <div>
                <p className="text-xs font-black" style={{ color: '#93C5FD' }}>FECHA LÍMITE</p>
                <p className="font-bold text-gray-700 text-sm">{formatearFecha(ejercicioSeleccionado.fecha_desactivacion)}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEjercicioSeleccionado(null);
                onRealizar(ejercicioSeleccionado);
              }}
              className="w-full py-4 font-black text-xl text-white"
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                boxShadow: '0 5px 0 #1E40AF',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 7px 0 #1E40AF'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 0 #1E40AF'; }}>
              ¡Hacer ejercicio! ✏️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabProximos;