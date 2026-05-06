import { useState, useEffect, useRef } from "react";
import { DonutChart } from "./DonutChart";
import { BarChart } from "./BarChart";

const BREAKPOINT_MOBILE = 431;
const LEYENDA_COLORS = ["#6EE7B7", "#FDE68A", "#FCA5A5"];

function transformarDatos(datos) {
  return datos.map((d) => ({ name: d.categoria, value: d.cantidad_alumnos }));
}

export default function ProgresoAlumnos({ progreso = { ortografia: [], legibilidad: [] }, onCategoriaClick }) {
  const [tab, setTab] = useState("ortografia");
  const [ancho, setAncho] = useState(500);
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!contenedorRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) setAncho(entry.contentRect.width);
    });
    observer.observe(contenedorRef.current);
    return () => observer.disconnect();
  }, []);

  const data = transformarDatos(tab === "ortografia" ? progreso.ortografia : progreso.legibilidad);
  const sinDatos = data.length === 0;
  const esMobile = ancho <= BREAKPOINT_MOBILE;
  const altoDonut = Math.min(Math.max(ancho * 0.65, 260), 380);
  const altoBar = 260;

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }} className="p-5">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span style={{ fontSize: "1.4rem" }}>📊</span>
        <h2 className="font-black text-center" style={{ fontSize: "1.2rem", color: "#1E3A5F" }}>
          Progreso de Alumnos
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-4">
        <div className="flex p-1.5 gap-1"
          style={{ background: "#EDE9FE", borderRadius: "20px", border: "2px solid #DDD6FE" }}>
          {[
            { key: "ortografia", label: "✍️ Ortografía" },
            { key: "legibilidad", label: "👁️ Legibilidad" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="px-4 py-2 font-black text-sm transition-all"
              style={{
                borderRadius: "14px",
                background: tab === key ? "#7C3AED" : "transparent",
                color: tab === key ? "white" : "#7C3AED",
                boxShadow: tab === key ? "0 3px 0 #4C1D95" : "none",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div ref={contenedorRef} className="w-full">
        {sinDatos ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div style={{ fontSize: "3rem" }}>📈</div>
            <p className="font-bold text-gray-300">Sin datos de progreso aún.</p>
          </div>
        ) : esMobile ? (
          <>
            <BarChart width={ancho} height={altoBar} data={data} />
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {data.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: LEYENDA_COLORS[i % LEYENDA_COLORS.length] }} />
                  <span className="text-xs font-bold text-gray-500">{d.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <DonutChart width={ancho} height={altoDonut} data={data} onSliceClick={onCategoriaClick} />
        )}
      </div>
    </div>
  );
}