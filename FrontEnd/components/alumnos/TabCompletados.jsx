'use client';
import { useState, useEffect } from 'react';
import { Loader2, Tag, X, Image as ImageIcon, Award, Clock, CheckCircle2 } from 'lucide-react';

const TabCompletados = ({ idAlumno }) => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/ejercicios/alumno/${idAlumno}/completados`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Error al cargar los ejercicios completados');
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

  const obtenerSrcImagen = (ejercicio) => {
    if (!ejercicio) return null;
    const imgData = ejercicio.imagen_codificada || ejercicio.imagen || ejercicio.imagen_base64;
    if (!imgData) return null;
    if (imgData.startsWith('data:image')) return imgData;
    return `data:image/jpeg;base64,${imgData}`;
  };

  if (loadingPage) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div style={{ fontSize: '3rem' }}>🏆</div>
        <Loader2 className="animate-spin" size={32} style={{ color: '#10B981' }} />
        <p className="font-bold text-gray-400">Cargando logros...</p>
      </div>
    );
  }

  const imagenSrc = obtenerSrcImagen(ejercicioSeleccionado);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div style={{ fontSize: '2rem' }}>🏆</div>
        <div>
          <h2 className="font-black" style={{ fontSize: '1.6rem', color: '#1E3A5F' }}>Ejercicios Completados</h2>
          <p className="font-semibold text-gray-400 text-sm">
            ¡Completaste <span style={{ color: '#10B981', fontWeight: 900 }}>{ejercicios.length}</span> ejercicio{ejercicios.length !== 1 ? 's' : ''}! 🌟
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 font-bold text-sm" style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
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
              background: '#ECFDF5',
              borderRadius: '20px',
              border: '2.5px solid #A7F3D0',
              boxShadow: '0 4px 0 #A7F3D0',
              padding: '20px',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 7px 0 #6EE7B7'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #A7F3D0'; }}>

            {/* Badge completado */}
            <div className="absolute top-4 right-4" style={{ fontSize: '1.4rem' }}>✅</div>

            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={11} style={{ color: '#6EE7B7' }} />
              <span className="font-bold uppercase text-xs tracking-wider" style={{ color: '#34D399' }}>{ejercicio.tipo}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2.5 flex items-center justify-center"
                style={{ background: '#D1FAE5', borderRadius: '14px', fontSize: '1.4rem' }}>
                📖
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm leading-tight mb-1 text-gray-800">{ejercicio.titulo}</h4>
                <p className="text-xs font-semibold text-gray-400 line-clamp-2 leading-relaxed">{ejercicio.descripcion}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '2px dashed #A7F3D0' }}>
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: '0.9rem' }}>✅</span>
                <span className="text-xs font-bold" style={{ color: '#10B981' }}>
                  {formatearFecha(ejercicio.fecha_envio)}
                </span>
              </div>
              {(ejercicio.puntuacion !== undefined || ejercicio.calificacion !== undefined) && (
                <span className="font-black text-xs px-2.5 py-1"
                  style={{ background: '#DBEAFE', color: '#1D4ED8', borderRadius: '20px', border: '2px solid #BFDBFE' }}>
                  ⭐ {ejercicio.puntuacion ?? ejercicio.calificacion} pts
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {ejercicios.length === 0 && !loadingPage && (
        <div className="text-center py-16">
          <div style={{ fontSize: '4rem' }} className="mb-4">📝</div>
          <p className="font-black text-gray-400 text-lg">Aún no has completado ejercicios</p>
          <p className="font-semibold text-gray-300 text-sm mt-1">¡Tú puedes! 💪</p>
        </div>
      )}

      {/* Modal detalle */}
      {ejercicioSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setEjercicioSeleccionado(null)}>
          <div className="bg-white w-full max-w-3xl p-7 relative max-h-[90vh] overflow-y-auto"
            style={{ borderRadius: '28px', border: '3px solid #A7F3D0', boxShadow: '0 10px 0 #6EE7B7' }}
            onClick={(e) => e.stopPropagation()}>

            <button onClick={() => setEjercicioSeleccionado(null)}
              className="absolute top-4 right-4 p-2"
              style={{ background: '#F3F4F6', borderRadius: '12px', color: '#6B7280' }}>
              <X size={20} />
            </button>

            <div className="mb-5 pb-4" style={{ borderBottom: '2px dashed #A7F3D0' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={13} style={{ color: '#34D399' }} />
                <span className="font-black uppercase text-xs tracking-wider" style={{ color: '#34D399' }}>
                  {ejercicioSeleccionado.tipo}
                </span>
              </div>
              <h3 className="font-black pr-8" style={{ fontSize: '1.5rem', color: '#1E3A5F' }}>
                {ejercicioSeleccionado.titulo}
              </h3>
              <p className="font-semibold text-gray-500 text-sm mt-2 leading-relaxed">
                {ejercicioSeleccionado.descripcion}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Columna izquierda */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3" style={{ background: '#F9FAFB', borderRadius: '14px', border: '2px solid #E5E7EB' }}>
                    <p className="text-xs font-black text-gray-400 mb-1 flex items-center gap-1">
                      <Clock size={11} /> Fecha límite
                    </p>
                    <p className="text-sm font-bold text-gray-700">{formatearFecha(ejercicioSeleccionado.fecha_desactivacion)}</p>
                  </div>
                  <div className="p-3" style={{ background: '#ECFDF5', borderRadius: '14px', border: '2px solid #A7F3D0' }}>
                    <p className="text-xs font-black mb-1 flex items-center gap-1" style={{ color: '#10B981' }}>
                      ✅ Enviado
                    </p>
                    <p className="text-sm font-bold" style={{ color: '#059669' }}>
                      {formatearFecha(ejercicioSeleccionado.fecha_envio)}
                    </p>
                  </div>
                </div>

                {/* Calificación */}
                <div className="p-5 flex-grow" style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: '18px', border: '2px solid #BFDBFE' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '1.4rem' }}>🏆</span>
                    <p className="font-black uppercase tracking-wide text-sm" style={{ color: '#1D4ED8' }}>Calificación</p>
                  </div>
                  <p className="font-black mb-2" style={{ fontSize: '2.8rem', color: '#2563EB' }}>
                    {ejercicioSeleccionado.puntuacion ?? ejercicioSeleccionado.calificacion ?? 'Pendiente ⏳'}
                  </p>

                  {ejercicioSeleccionado.retroalimentacion && (
                    <div className="mt-3 pt-3" style={{ borderTop: '2px solid #BFDBFE' }}>
                      <p className="text-xs font-black mb-1" style={{ color: '#1D4ED8' }}>💬 Comentarios:</p>
                      <p className="text-sm font-semibold" style={{ color: '#1E40AF' }}>{ejercicioSeleccionado.retroalimentacion}</p>
                    </div>
                  )}

                  {ejercicioSeleccionado.texto_detectado_ocr && (
                    <div className="mt-3 pt-3" style={{ borderTop: '2px solid #BFDBFE' }}>
                      <p className="text-xs font-black mb-1" style={{ color: '#1D4ED8' }}>🔍 Texto detectado:</p>
                      <p className="text-sm font-mono p-2" style={{ color: '#1E40AF', background: 'rgba(219,234,254,0.5)', borderRadius: '8px' }}>
                        {ejercicioSeleccionado.texto_detectado_ocr}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna imagen */}
              <div className="flex flex-col h-full min-h-[200px]">
                <p className="text-sm font-black text-gray-600 mb-2 flex items-center gap-2">
                  <ImageIcon size={15} /> Trabajo enviado
                </p>
                <div className="flex-grow flex items-center justify-center relative overflow-hidden"
                  style={{ border: '2.5px dashed #A7F3D0', borderRadius: '16px', background: '#F0FDF4', minHeight: '180px' }}>
                  {imagenSrc ? (
                    <img src={imagenSrc} alt="Intento completado"
                      className="absolute inset-0 w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center text-gray-300">
                      <div style={{ fontSize: '2.5rem' }} className="mb-2">🖼️</div>
                      <p className="text-sm font-bold">Sin imagen</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full py-3 font-black flex items-center justify-center gap-2 text-sm"
              style={{ background: '#ECFDF5', borderRadius: '16px', border: '2.5px solid #A7F3D0', color: '#059669' }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span> ¡Ejercicio completado y registrado!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabCompletados;