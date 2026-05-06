import { useState } from "react";
import { AlertCircle, Star, TrendingUp, Tag, User } from "lucide-react";

const VISIBLE_INICIAL = 4;

const CONFIG = {
  riesgo: {
    titulo: "Alumnos en Riesgo",
    descripcion: "con promedio bajo",
    emoji: "⚠️",
    border: "#FCA5A5",
    shadow: "#FCA5A5",
    bgCard: "#FFF0F0",
    bgIcon: "#FEE2E2",
    iconColor: "#EF4444",
    tagColor: "#F87171",
    btnBg: "linear-gradient(135deg, #F87171, #EF4444)",
    btnShadow: "#B91C1C",
    verMenosColor: "#EF4444",
    mensajeVacio: "🎉 ¡Ningún alumno está en riesgo actualmente!",
    Icono: AlertCircle,
  },
  regular: {
    titulo: "Alumnos Regulares",
    descripcion: "con promedio regular",
    emoji: "📈",
    border: "#FDE68A",
    shadow: "#FDE68A",
    bgCard: "#FFFBEB",
    bgIcon: "#FEF3C7",
    iconColor: "#D97706",
    tagColor: "#F59E0B",
    btnBg: "linear-gradient(135deg, #FBBF24, #D97706)",
    btnShadow: "#92400E",
    verMenosColor: "#D97706",
    mensajeVacio: "Sin alumnos en rango regular actualmente.",
    Icono: TrendingUp,
  },
  excelencia: {
    titulo: "Alumnos de Excelencia",
    descripcion: "con promedio sobresaliente",
    emoji: "🌟",
    border: "#A7F3D0",
    shadow: "#A7F3D0",
    bgCard: "#ECFDF5",
    bgIcon: "#D1FAE5",
    iconColor: "#059669",
    tagColor: "#10B981",
    btnBg: "linear-gradient(135deg, #34D399, #059669)",
    btnShadow: "#065F46",
    verMenosColor: "#059669",
    mensajeVacio: "Sin alumnos de excelencia actualmente.",
    Icono: Star,
  },
};

function colorScore(valor) {
  if (valor >= 8) return "#059669";
  if (valor >= 6) return "#D97706";
  return "#EF4444";
}

export default function AlumnosCategoria({ alumnos = [], categoria = "riesgo" }) {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const config = CONFIG[categoria] ?? CONFIG.riesgo;
  const { titulo, descripcion, emoji, border, shadow, bgCard, bgIcon, iconColor,
    tagColor, btnBg, btnShadow, verMenosColor, mensajeVacio, Icono } = config;

  const extras = alumnos.length - VISIBLE_INICIAL;
  const visibles = mostrarTodos ? alumnos : alumnos.slice(0, VISIBLE_INICIAL);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }} className="p-5">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span style={{ fontSize: "1.4rem" }}>{emoji}</span>
        <h2 className="font-black" style={{ fontSize: "1.2rem", color: "#1E3A5F" }}>{titulo}</h2>
        {!mostrarTodos && extras > 0 && (
          <button
            onClick={() => setMostrarTodos(true)}
            className="text-white text-xs font-black w-7 h-7 flex items-center justify-center transition-all hover:scale-110"
            style={{ background: btnBg, borderRadius: "50%", boxShadow: `0 3px 0 ${btnShadow}` }}>
            +{extras}
          </button>
        )}
      </div>
      <p className="font-semibold text-gray-400 text-sm mb-4">
        {alumnos.length} alumno{alumnos.length !== 1 ? "s" : ""} {descripcion}
      </p>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibles.map((alumno) => (
          <div
            key={alumno.id_alumno}
            className="relative select-none"
            style={{
              padding: "16px",
              borderRadius: "18px",
              border: `2.5px solid ${border}`,
              background: bgCard,
              boxShadow: `0 4px 0 ${shadow}`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>

            {/* Icono categoría */}
            <div className="absolute top-3 right-3">
              <Icono size={18} style={{ color: iconColor }} />
            </div>

            {/* Etiqueta */}
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={11} style={{ color: tagColor }} />
              <span className="font-bold uppercase text-xs tracking-wider" style={{ color: tagColor }}>Alumno</span>
            </div>

            {/* Contenido */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 flex items-center justify-center"
                style={{ background: bgIcon, borderRadius: "12px" }}>
                <User size={16} style={{ color: iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm leading-tight mb-2 text-gray-800">
                  {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}
                </h4>
                <div className="flex flex-col gap-0.5">
                  {[
                    { label: "Ortografía", val: alumno.promedio_ortografia },
                    { label: "Legibilidad", val: alumno.promedio_legibilidad },
                    { label: "Promedio", val: (Number(alumno.promedio_ortografia) + Number(alumno.promedio_legibilidad)) / 2 },
                  ].map(({ label, val }) => (
                    <p key={label} className="text-xs font-semibold text-gray-500">
                      {label}:{" "}
                      <span className="font-black" style={{ color: colorScore(Number(val)) }}>
                        {Number(val).toFixed(1)}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ver menos */}
      {mostrarTodos && extras > 0 && (
        <button onClick={() => setMostrarTodos(false)}
          className="mt-4 text-sm font-black underline transition-colors"
          style={{ color: verMenosColor }}>
          Ver menos ↑
        </button>
      )}

      {alumnos.length === 0 && (
        <div className="text-center mt-6">
          <div style={{ fontSize: "2.5rem" }} className="mb-2">🎉</div>
          <p className="font-bold text-gray-400 text-sm">{mensajeVacio}</p>
        </div>
      )}
    </div>
  );
}