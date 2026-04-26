'use client';
import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Clock, Loader2, Tag, X, Image as ImageIcon, Award } from 'lucide-react';

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
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  const imagenSrc = obtenerSrcImagen(ejercicioSeleccionado);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ejercicios Completados</h2>
        <p className="text-sm text-gray-500 mt-1">
          Has completado {ejercicios.length} ejercicio{ejercicios.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ejercicios.map((ejercicio) => (
          <div
            key={ejercicio.id_ejercicio_tutor}
            onClick={() => setEjercicioSeleccionado(ejercicio)}
            className="relative p-5 rounded-xl border-2 border-green-200 bg-green-50 hover:shadow-sm cursor-pointer transition-all duration-200 select-none"
          >
            {/* Indicador completado */}
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="text-green-500" size={20} />
            </div>

            {/* Tipo */}
            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={12} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {ejercicio.tipo}
              </span>
            </div>

            {/* Contenido */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <BookOpen size={18} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight mb-1 text-gray-800">
                  {ejercicio.titulo}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {ejercicio.descripcion}
                </p>
              </div>
            </div>

            {/* Footer fecha envío */}
            <div className="mt-4 pt-3 border-t border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-green-400" />
                <span className="text-xs text-green-600 font-medium">
                  Enviado: {formatearFecha(ejercicio.fecha_envio)}
                </span>
              </div>
              
              {/* Previsualización rápida de puntuación si existe en la lista */}
              {(ejercicio.puntuacion !== undefined || ejercicio.calificacion !== undefined) && (
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  {ejercicio.puntuacion ?? ejercicio.calificacion} pts
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {ejercicios.length === 0 && !loadingPage && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle2 size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aún no has completado ningún ejercicio</p>
        </div>
      )}

      {/* Modal detalle ampliado */}
      {ejercicioSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEjercicioSeleccionado(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={() => setEjercicioSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Cabecera del modal */}
            <div className="mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={14} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {ejercicioSeleccionado.tipo}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 pr-8">
                {ejercicioSeleccionado.titulo}
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {ejercicioSeleccionado.descripcion}
              </p>
            </div>

            {/* Contenido dividido: Fechas/Puntos y Previsualización de Imagen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Columna Izquierda: Información */}
              <div className="flex flex-col gap-4">
                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                      <Clock size={12} /> Fecha límite
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatearFecha(ejercicioSeleccionado.fecha_desactivacion)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-600 mb-1 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Fecha de envío
                    </p>
                    <p className="text-sm font-bold text-green-700">
                      {formatearFecha(ejercicioSeleccionado.fecha_envio)}
                    </p>
                  </div>
                </div>

                {/* Puntuación y Retroalimentación */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={20} className="text-blue-600" />
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-wide">Calificación</p>
                  </div>
                  <p className="text-3xl font-black text-blue-700 mb-2">
                    {ejercicioSeleccionado.puntuacion ?? ejercicioSeleccionado.calificacion ?? 'Pendiente'}
                  </p>
                  
                  {ejercicioSeleccionado.retroalimentacion && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Comentarios:</p>
                      <p className="text-sm text-blue-900 leading-relaxed">
                        {ejercicioSeleccionado.retroalimentacion}
                      </p>
                    </div>
                  )}
                  
                  {ejercicioSeleccionado.texto_detectado_ocr && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Texto detectado:</p>
                      <p className="text-sm font-mono text-blue-900 bg-blue-100/50 p-2 rounded">
                        {ejercicioSeleccionado.texto_detectado_ocr}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Imagen */}
              <div className="flex flex-col h-full min-h-[200px]">
                <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon size={16} className="text-gray-500" /> Archivo enviado
                </p>
                <div className="flex-grow border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative">
                  {imagenSrc ? (
                    <img 
                      src={imagenSrc} 
                      alt="Intento completado" 
                      className="absolute inset-0 w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Imagen no disponible</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Badge estado final */}
            <div className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-100 text-green-700 border border-green-200">
              <CheckCircle2 size={20} />
              Ejercicio completado y registrado
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabCompletados;