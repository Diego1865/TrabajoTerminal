'use client';
import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Clock, Loader2, Tag, X } from 'lucide-react';

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

  if (loadingPage) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

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
            <div className="mt-4 pt-3 border-t border-green-100 flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-green-400" />
              <span className="text-xs text-green-600 font-medium">
                Enviado: {formatearFecha(ejercicio.fecha_envio)}
              </span>
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

      {/* Modal detalle */}
      {ejercicioSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEjercicioSeleccionado(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={() => setEjercicioSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            {/* Tipo */}
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={13} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {ejercicioSeleccionado.tipo}
              </span>
            </div>

            {/* Título */}
            <h3 className="text-xl font-bold text-gray-800 mb-3 pr-6">
              {ejercicioSeleccionado.titulo}
            </h3>

            {/* Descripción */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {ejercicioSeleccionado.descripcion}
            </p>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Fecha límite</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatearFecha(ejercicioSeleccionado.fecha_desactivacion)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Fecha de envío</p>
                <p className="text-sm font-medium text-green-700">
                  {formatearFecha(ejercicioSeleccionado.fecha_envio)}
                </p>
              </div>
            </div>

            {/* Badge completado */}
            <div className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-green-50 text-green-600 border border-green-200">
              <CheckCircle2 size={18} />
              Ejercicio completado
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabCompletados;