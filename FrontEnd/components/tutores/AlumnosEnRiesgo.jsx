import { useState } from "react";
import { AlertCircle, Tag, User } from "lucide-react";

const VISIBLE_INICIAL = 4;

function colorScore(valor) {
  if (valor >= 80) return "text-green-600";
  if (valor >= 60) return "text-amber-600";
  return "text-red-500";
}

export default function AlumnosEnRiesgo({ alumnos = [] }) {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const extras = alumnos.length - VISIBLE_INICIAL;
  const visibles = mostrarTodos ? alumnos : alumnos.slice(0, VISIBLE_INICIAL);

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-gray-800">Alumnos en riesgo</h2>
        {!mostrarTodos && extras > 0 && (
          <button
            onClick={() => setMostrarTodos(true)}
            className="bg-red-400 hover:bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-200"
          >
            +{extras}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4">
        {alumnos.length} alumno{alumnos.length !== 1 ? "s" : ""} con promedio bajo
      </p>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibles.map((alumno) => (
          <div
            key={alumno.id_alumno}
            className="relative p-5 rounded-xl border-2 border-red-200 bg-red-50 hover:shadow-sm cursor-pointer transition-all duration-200 select-none"
          >
            {/* Indicador riesgo */}
            <div className="absolute top-4 right-4">
              <AlertCircle className="text-red-400" size={20} />
            </div>

            {/* Etiqueta */}
            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={12} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Alumno
              </span>
            </div>

            {/* Contenido */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <User size={18} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight mb-2 text-gray-800">
                  {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}
                </h4>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">
                    Ortografía:{" "}
                    <span className={`font-bold ${colorScore(alumno.promedio_ortografia)}`}>
                      {Number(alumno.promedio_ortografia).toFixed(1)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Legibilidad:{" "}
                    <span className={`font-bold ${colorScore(alumno.promedio_legibilidad)}`}>
                      {Number(alumno.promedio_legibilidad).toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ver menos */}
      {mostrarTodos && extras > 0 && (
        <button
          onClick={() => setMostrarTodos(false)}
          className="mt-4 text-sm text-red-400 font-semibold underline hover:text-red-500 transition-colors"
        >
          Ver menos
        </button>
      )}

      {/* Sin alumnos */}
      {alumnos.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-4">
          Ningún alumno está en riesgo actualmente.
        </p>
      )}
    </div>
  );
}