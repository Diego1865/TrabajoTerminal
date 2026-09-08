'use client';
import { useState, useEffect } from 'react';
import { Clock, Loader2, Tag, X } from 'lucide-react';

const TabVencidos = ({ idAlumno }) => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/ejercicios/vencidos`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Error al cargar los ejercicios vencidos');
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
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loadingPage) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div style={{ fontSize: '3rem' }}>⏰</div>
        <Loader2 className="animate-spin" size={32} style={{ color: '#F97316' }} />
        <p className="font-bold text-gray-400">Cargando ejercicios...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div style={{ fontSize: '2rem' }}>⏰</div>
        <div>
          <h2 className="font-black" style={{ fontSize: '1.6rem', color: '#1E3A5F' }}>Ejercicios Vencidos</h2>
          <p className="font-semibold text-gray-400 text-sm">
            <span style={{ color: '#F97316', fontWeight: 900 }}>{ejercicios.length}</span> ejercicio{ejercicios.length !== 1 ? 's' : ''} sin completar
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 font-bold text-sm"
          style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
          😅 {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ejercicios.map((ejercicio) => (
          <div
            key={ejercicio.id_ejercicio_tutor}
            onClick={() => setEjercicioSeleccionado(ejercicio)}
            className="relative cursor-pointer select-none"
            style={{
              background: '#FFF7ED',
              borderRadius: '20px',
              border: '2.5px solid #FED7AA',
              boxShadow: '0 4px 0 #FED7AA',
              padding: '20px',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 7px 0 #FDBA74'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #FED7AA'; }}>

            {/* Indicador vencido */}
            <div className="absolute top-4 right-4" style={{ fontSize: '1.3rem' }}>😔</div>

            {/* Tipo */}
            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={11} style={{ color: '#FDBA74' }} />
              <span className="font-bold uppercase text-xs tracking-wider" style={{ color: '#FB923C' }}>
                {ejercicio.tipo}
              </span>
            </div>

            {/* Contenido */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2.5 flex items-center justify-center"
                style={{ background: '#FEF3C7', borderRadius: '14px', fontSize: '1.4rem' }}>
                📄
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm leading-tight mb-1 text-gray-800">{ejercicio.titulo}</h4>
                <p className="text-xs font-semibold text-gray-400 line-clamp-2 leading-relaxed">{ejercicio.descripcion}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 flex items-center gap-1.5" style={{ borderTop: '2px dashed #FED7AA' }}>
              <Clock size={12} style={{ color: '#FDBA74' }} />
              <span className="text-xs font-bold" style={{ color: '#F97316' }}>
                Venció: {formatearFecha(ejercicio.fecha_desactivacion)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {ejercicios.length === 0 && !loadingPage && (
        <div className="text-center py-16">
          <div style={{ fontSize: '4rem' }} className="mb-4">🎉</div>
          <p className="font-black text-gray-400 text-lg">¡No tienes ejercicios vencidos!</p>
          <p className="font-semibold text-gray-300 text-sm mt-1">¡Eres muy responsable! ⭐</p>
        </div>
      )}

      {/* Modal detalle */}
      {ejercicioSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setEjercicioSeleccionado(null)}>
          <div className="bg-white w-full max-w-lg p-7 relative"
            style={{ borderRadius: '28px', border: '3px solid #FED7AA', boxShadow: '0 10px 0 #FDBA74' }}
            onClick={(e) => e.stopPropagation()}>

            <button onClick={() => setEjercicioSeleccionado(null)}
              className="absolute top-4 right-4 p-2"
              style={{ background: '#F3F4F6', borderRadius: '12px', color: '#6B7280' }}>
              <X size={20} />
            </button>

            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={13} style={{ color: '#FDBA74' }} />
              <span className="font-black uppercase text-xs tracking-wider" style={{ color: '#FB923C' }}>
                {ejercicioSeleccionado.tipo}
              </span>
            </div>

            <div style={{ fontSize: '2.5rem' }} className="mb-2">😔</div>
            <h3 className="font-black mb-3 pr-8" style={{ fontSize: '1.4rem', color: '#1E3A5F' }}>
              {ejercicioSeleccionado.titulo}
            </h3>
            <p className="font-semibold text-gray-500 text-sm leading-relaxed mb-5">
              {ejercicioSeleccionado.descripcion}
            </p>

            <div className="flex items-center gap-3 mb-6 p-4"
              style={{ background: '#FFF7ED', borderRadius: '16px', border: '2px solid #FED7AA' }}>
              <span style={{ fontSize: '1.4rem' }}>📅</span>
              <div>
                <p className="text-xs font-black" style={{ color: '#FDBA74' }}>FECHA DE VENCIMIENTO</p>
                <p className="font-bold text-sm" style={{ color: '#EA580C' }}>
                  {formatearFecha(ejercicioSeleccionado.fecha_desactivacion)}
                </p>
              </div>
            </div>

            <div className="w-full py-4 font-black flex items-center justify-center gap-2"
              style={{ background: '#FFF7ED', borderRadius: '18px', border: '2.5px solid #FED7AA', color: '#F97316' }}>
              <span style={{ fontSize: '1.2rem' }}>🚫</span> Este ejercicio ya no está disponible
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabVencidos;