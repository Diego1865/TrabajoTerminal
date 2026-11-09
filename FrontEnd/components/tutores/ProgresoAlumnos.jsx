import { useState } from "react";
import { CATEGORIAS, METRICAS, metricaPorClave } from "./categoriasProgreso";

// Resumen del grupo: métrica, contadores por categoría (también sirven para elegir la lista)
// y una barra segmentada con la proporción de cada categoría.
export default function ProgresoAlumnos({ grupos, total, metrica, onMetrica, categoria, onCategoria }) {
  const [hover, setHover] = useState(null);
  const enBarra = CATEGORIAS.filter((c) => grupos[c.clave].length > 0);
  const porcentaje = (n) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }} className="p-5">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Encabezado + métrica */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "1.4rem" }}>📊</span>
            <h2 className="font-black whitespace-nowrap" style={{ fontSize: "1.2rem", color: "#1E3A5F" }}>Progreso de Alumnos</h2>
          </div>
          <p className="text-sm font-semibold text-gray-400">{total} alumno{total !== 1 ? "s" : ""} activo{total !== 1 ? "s" : ""}</p>
        </div>
        <div role="radiogroup" aria-label="Métrica" className="flex p-1 gap-1"
          style={{ background: "#EDE9FE", borderRadius: "16px", border: "2px solid #DDD6FE" }}>
          {METRICAS.map(({ clave, etiqueta }) => (
            <button key={clave} type="button" role="radio" aria-checked={metrica === clave}
              onClick={() => onMetrica(clave)}
              className="px-3 py-1.5 font-black text-sm transition-all"
              style={{
                borderRadius: "12px",
                background: metrica === clave ? "#7C3AED" : "transparent",
                color: metrica === clave ? "white" : "#7C3AED",
                boxShadow: metrica === clave ? "0 3px 0 #4C1D95" : "none",
              }}>
              {etiqueta}
            </button>
          ))}
        </div>
      </div>

      {/* Contadores: siempre visibles, aunque estén en 0 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {CATEGORIAS.map(({ clave, etiqueta, rango, color, Icono }) => {
          const activa = categoria === clave;
          const n = grupos[clave].length;
          return (
            <button key={clave} type="button" aria-pressed={activa} onClick={() => onCategoria(clave)}
              className="text-left p-3 transition-all hover:-translate-y-0.5"
              style={{
                borderRadius: "16px",
                background: activa ? "#FFFFFF" : "#F9FAFB",
                border: `2px solid ${activa ? color : "#E5E7EB"}`,
                boxShadow: activa ? `0 4px 0 ${color}` : "none",
              }}>
              <span className="flex items-center gap-1.5 text-sm font-black text-gray-700">
                <Icono size={16} style={{ color }} aria-hidden="true" /> {etiqueta}
              </span>
              <span className="block font-black text-gray-900" style={{ fontSize: "1.7rem", lineHeight: 1.2 }}>{n}</span>
              <span className="block text-xs font-semibold text-gray-400">{rango}</span>
            </button>
          );
        })}
      </div>

      {/* Barra segmentada (proporción del grupo) */}
      {total === 0 ? (
        <p className="text-center font-bold text-gray-300 py-4">Aún no hay alumnos activos.</p>
      ) : (
        <div className="relative">
          <div className="flex w-full gap-[2px]" style={{ height: "44px" }} role="group" aria-label="Distribución de alumnos">
            {enBarra.map(({ clave, etiqueta, color, tinta }, i) => {
              const n = grupos[clave].length;
              const p = porcentaje(n);
              const elegida = categoria === clave;
              return (
                <button key={clave} type="button" onClick={() => onCategoria(clave)}
                  onMouseEnter={() => setHover(clave)} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(clave)} onBlur={() => setHover(null)}
                  aria-label={`${etiqueta}: ${n} alumno${n !== 1 ? "s" : ""}, ${p}%`}
                  aria-pressed={elegida}
                  className="flex items-center justify-center font-black text-sm min-w-[6px] hover:brightness-95 focus-visible:outline-none"
                  style={{
                    flexGrow: n, flexBasis: 0, background: color, color: tinta,
                    outline: elegida || hover === clave ? "3px solid #1E3A5F" : "none",
                    outlineOffset: "2px", position: "relative", zIndex: elegida ? 1 : 0,
                    borderTopLeftRadius: i === 0 ? 6 : 0, borderBottomLeftRadius: i === 0 ? 6 : 0,
                    borderTopRightRadius: i === enBarra.length - 1 ? 6 : 0,
                    borderBottomRightRadius: i === enBarra.length - 1 ? 6 : 0,
                  }}>
                  {/* El número solo se escribe si cabe; si no, lo dicen el contador y el tooltip. */}
                  {p >= 12 ? `${p}%` : ""}
                </button>
              );
            })}
          </div>
          {/* Detalle del segmento señalado; si no hay, la explicación de la métrica. */}
          <p className="text-xs font-semibold text-gray-500 mt-2 min-h-[2.5em]" aria-live="polite">
            {hover ? (
              <span className="font-black text-gray-700">
                {CATEGORIAS.find((c) => c.clave === hover).etiqueta}: {grupos[hover].length} alumno{grupos[hover].length !== 1 ? "s" : ""} · {porcentaje(grupos[hover].length)}%
              </span>
            ) : (
              <>Según {metricaPorClave(metrica).frase} que confirmas al calificar. Toca una categoría para ver a sus alumnos.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
