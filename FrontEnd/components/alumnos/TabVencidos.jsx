'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Clock, Loader2, Tag, X, AlertCircle } from 'lucide-react';

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/ejercicios/alumno/${idAlumno}/vencidos`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ejercicios Vencidos</h2>
        <p className="text-sm text-gray-500 mt-1">
          {ejercicios.length} ejercicio{ejercicios.length !== 1 ? 's' : ''} sin completar
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
            className="relative p-5 rounded-xl border-2 border-red-200 bg-red-50 hover:shadow-sm cursor-pointer transition-all duration-200 select-none"
          >
            {/* Indicador vencido */}
            <div className="absolute top-4 right-4">
              <AlertCircle className="text-red-400" size={20} />
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
              <div className="p-2 rounded-lg bg-red-100">
                <BookOpen size={18} className="text-red-400" />
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

            {/* Footer fecha vencimiento */}
            <div className="mt-4 pt-3 border-t border-red-100 flex items-center gap-1.5">
              <Clock size={12} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">
                Venció: {formatearFecha(ejercicio.fecha_desactivacion)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {ejercicios.length === 0 && !loadingPage && (
        <div className="text-center py-16 text-gray-400">
          <AlertCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p>No tienes ejercicios vencidos</p>
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

            {/* Fecha vencimiento */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 rounded-lg">
              <Clock size={16} className="text-red-400" />
              <div>
                <p className="text-xs text-gray-400">Fecha de vencimiento</p>
                <p className="text-sm font-medium text-red-600">
                  {formatearFecha(ejercicioSeleccionado.fecha_desactivacion)}
                </p>
              </div>
            </div>

            {/* Badge vencido */}
            <div className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-200">
              <AlertCircle size={18} />
              Este ejercicio ya no está disponible
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabVencidos;