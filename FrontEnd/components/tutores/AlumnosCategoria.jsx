import { useState } from "react";
import { AlertCircle, Star, TrendingUp, Tag, User } from "lucide-react";

const VISIBLE_INICIAL = 4;

const CONFIG = {
  riesgo: {
    titulo: "Alumnos en riesgo",
    descripcion: "con promedio bajo",
    borderColor: "border-red-200",
    bgCard: "bg-red-50",
    bgIcon: "bg-red-100",
    iconColor: "text-red-400",
    btnColor: "bg-red-400 hover:bg-red-500",
    verMenosColor: "text-red-400 hover:text-red-500",
    mensajeVacio: "Ningún alumno está en riesgo actualmente.",
    Icono: AlertCircle,
  },
  regular: {
    titulo: "Alumnos regulares",
    descripcion: "con promedio regular",
    borderColor: "border-amber-200",
    bgCard: "bg-amber-50",
    bgIcon: "bg-amber-100",
    iconColor: "text-amber-400",
    btnColor: "bg-amber-400 hover:bg-amber-500",
    verMenosColor: "text-amber-400 hover:text-amber-500",
    mensajeVacio: "Ningún alumno en rango regular actualmente.",
    Icono: TrendingUp,
  },
  excelencia: {
    titulo: "Alumnos de excelencia",
    descripcion: "con promedio sobresaliente",
    borderColor: "border-green-200",
    bgCard: "bg-green-50",
    bgIcon: "bg-green-100",
    iconColor: "text-green-400",
    btnColor: "bg-green-400 hover:bg-green-500",
    verMenosColor: "text-green-400 hover:text-green-500",
    mensajeVacio: "Ningún alumno de excelencia actualmente.",
    Icono: Star,
  },
};

function colorScore(valor) {
  if (valor >= 8) return "text-green-600";
  if (valor >= 6) return "text-amber-600";
  return "text-red-500";
}

export default function AlumnosCategoria({ alumnos = [], categoria = "riesgo" }) {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const config = CONFIG[categoria] ?? CONFIG.riesgo;
  const { titulo, descripcion, borderColor, bgCard, bgIcon, iconColor,
          btnColor, verMenosColor, mensajeVacio, Icono } = config;

  const extras = alumnos.length - VISIBLE_INICIAL;
  const visibles = mostrarTodos ? alumnos : alumnos.slice(0, VISIBLE_INICIAL);

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
        {!mostrarTodos && extras > 0 && (
          <button
            onClick={() => setMostrarTodos(true)}
            className={`${btnColor} text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-200`}
          >
            +{extras}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4">
        {alumnos.length} alumno{alumnos.length !== 1 ? "s" : ""} {descripcion}
      </p>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibles.map((alumno) => (
          <div
            key={alumno.id_alumno}
            className={`relative p-5 rounded-xl border-2 ${borderColor} ${bgCard} hover:shadow-sm cursor-pointer transition-all duration-200 select-none`}
          >
            {/* Indicador categoría */}
            <div className="absolute top-4 right-4">
              <Icono className={iconColor} size={20} />
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
              <div className={`p-2 rounded-lg ${bgIcon}`}>
                <User size={18} className={iconColor} />
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
                  <p className="text-xs text-gray-500">
                    Promedio general:{" "}
                    <span className={`font-bold ${colorScore((Number(alumno.promedio_ortografia) + Number(alumno.promedio_legibilidad)) / 2)}`}>
                      {((Number(alumno.promedio_ortografia) + Number(alumno.promedio_legibilidad)) / 2).toFixed(1)}
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
          className={`mt-4 text-sm ${verMenosColor} font-semibold underline transition-colors`}
        >
          Ver menos
        </button>
      )}

      {/* Sin alumnos */}
      {alumnos.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-4">
          {mensajeVacio}
        </p>
      )}
    </div>
  );
}