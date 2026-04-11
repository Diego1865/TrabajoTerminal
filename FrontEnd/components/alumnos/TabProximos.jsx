'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Clock, Loader2, Tag, X } from 'lucide-react';

const TabProximos = ({ idAlumno , onRealizar}) => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/ejercicios/alumno/${idAlumno}/proximos`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
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
    const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return diff;
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
        <h2 className="text-2xl font-bold text-gray-800">Ejercicios Próximos</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tienes {ejercicios.length} ejercicio{ejercicios.length !== 1 ? 's' : ''} pendiente{ejercicios.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ejercicios.map((ejercicio) => {
          const dias = diasRestantes(ejercicio.fecha_desactivacion);

          return (
            <div
              key={ejercicio.id_ejercicio_tutor}
              onClick={() => setEjercicioSeleccionado(ejercicio)}
              className="relative p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all duration-200 select-none"
            >
              {/* Badge días restantes */}
              {dias !== null && (
                <div className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full
                  ${dias <= 1 ? 'bg-red-100 text-red-600' :
                    dias <= 3 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'}
                `}>
                  {dias <= 0 ? 'Vence hoy' : `${dias}d`}
                </div>
              )}

              {/* Tipo */}
              <div className="flex items-center gap-1.5 mb-3">
                <Tag size={12} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {ejercicio.tipo}
                </span>
              </div>

              {/* Contenido */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <BookOpen size={18} className="text-gray-500" />
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

              {/* Footer fecha */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                <Clock size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  {formatearFecha(ejercicio.fecha_desactivacion)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {ejercicios.length === 0 && !loadingPage && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No tienes ejercicios pendientes</p>
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

            {/* Fecha límite */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
              <Clock size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Fecha límite</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatearFecha(ejercicioSeleccionado.fecha_fin)}
                </p>
              </div>
            </div>

            {/* Botón realizar en el modal */}
            <button
              onClick={() => {
                setEjercicioSeleccionado(null); // Cierra el modal
                onRealizar(ejercicioSeleccionado); // Activa el lienzo/cámara
              }}
              className="w-full py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Realizar ejercicio →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabProximos;