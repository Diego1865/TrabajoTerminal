'use client';
import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Circle, Loader2, Tag, X } from 'lucide-react';

const TabEjercicios = ({ idTutor }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [activados, setActivados] = useState(new Set());
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState(null);
  const [error, setError] = useState('');
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null); // ← modal
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPage(true);
      try {
        const [resEjercicios, resActivados] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ejercicios`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ejercicios/tutor/${idTutor}`),
        ]);

        if (!resEjercicios.ok || !resActivados.ok)
          throw new Error('Error al cargar los ejercicios');

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

    if (idTutor) fetchData();
  }, [idTutor]);

  const formatearFechaParaSQL = (fecha) => {
    if (!fecha) return null;
    return fecha.length === 16 ? `${fecha}:00` : fecha;
  };

  const handleToggle = async (id_ejercicio) => {
    setLoadingToggle(id_ejercicio);
    const estaActivado = activados.has(id_ejercicio);

    try {
      if (estaActivado) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ejercicios/tutor/${idTutor}/${id_ejercicio}`,
          { method: 'DELETE' }
        );
        if (!res.ok) throw new Error('No se pudo desactivar el ejercicio');
        setActivados((prev) => {
          const next = new Set(prev);
          next.delete(id_ejercicio);
          return next;
        });
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ejercicios/tutor`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ejercicios Disponibles</h2>
          <p className="text-sm text-gray-500 mt-1">
            Abre un ejercicio para ver su detalle y activarlo para tus alumnos
          </p>
        </div>
        <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {activados.size} / {ejercicios.length} activados
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── Tarjetas ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ejercicios.map((ejercicio) => {
          const activo = activados.has(ejercicio.id_ejercicio);

          return (
            <div
              key={ejercicio.id_ejercicio}
              onClick={() => setEjercicioSeleccionado(ejercicio)} // ← abre modal
              className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                ${activo
                  ? 'border-blue-400 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
                }
              `}
            >
              {/* Indicador activo */}
              <div className="absolute top-4 right-4">
                {activo
                  ? <CheckCircle2 className="text-blue-500" size={20} />
                  : <Circle className="text-gray-300" size={20} />
                }
              </div>

              {/* Tipo badge */}
              <div className="flex items-center gap-1.5 mb-3">
                <Tag size={12} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {ejercicio.tipo}
                </span>
              </div>

              {/* Contenido */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activo ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <BookOpen size={18} className={activo ? 'text-blue-600' : 'text-gray-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm leading-tight mb-1 ${activo ? 'text-blue-800' : 'text-gray-800'}`}>
                    {ejercicio.titulo}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {ejercicio.descripcion}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className={`mt-4 pt-3 border-t text-xs font-medium text-center
                ${activo ? 'border-blue-200 text-blue-600' : 'border-gray-100 text-gray-400'}
              `}>
                {activo ? 'Visible para tus alumnos' : 'Ver detalle'}
              </div>
            </div>
          );
        })}
      </div>

      {ejercicios.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No hay ejercicios disponibles aún</p>
        </div>
      )}

      {/* ── Modal de detalle ── */}
      {ejercicioSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEjercicioSeleccionado(null)} // cierra al hacer clic fuera
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
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
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {ejercicioSeleccionado.descripcion}
            </p>

            {/* Fecha límite */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha límite de entrega
              </label>

              {/* Si ya tiene fecha solo la muestra, si no muestra el input */}
              {activados.has(ejercicioSeleccionado.id_ejercicio) && ejercicioSeleccionado.fecha_fin ? (
                <p className="text-sm text-blue-600 font-medium">
                  {new Date(ejercicioSeleccionado.fecha_fin).toLocaleDateString('es-MX', {
                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              ) : (
                <input
                  type="datetime-local"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)} // no permite fechas pasadas
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400"
                />
              )}
            </div>

            {/* Botón activar/desactivar */}
            <button
              disabled={loadingToggle === ejercicioSeleccionado.id_ejercicio}
              onClick={() => handleToggle(ejercicioSeleccionado.id_ejercicio)}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors
                ${activados.has(ejercicioSeleccionado.id_ejercicio)
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
                ${loadingToggle === ejercicioSeleccionado.id_ejercicio ? 'opacity-60 cursor-wait' : ''}
              `}
            >
              {loadingToggle === ejercicioSeleccionado.id_ejercicio
                ? <Loader2 className="animate-spin" size={18} />
                : activados.has(ejercicioSeleccionado.id_ejercicio)
                  ? 'Desactivar ejercicio'
                  : 'Activar para mis alumnos'
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabEjercicios;