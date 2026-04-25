import { useState, useEffect, useRef } from "react";
import { DonutChart } from "./DonutChart";
import { BarChart } from "./BarChart";

const BREAKPOINT_MOBILE = 431;

const LEYENDA_COLORS = ["#a3e635", "#fbbf24", "#f87171"];

function transformarDatos(datos) {
  return datos.map((d) => ({
    name: d.categoria,
    value: d.cantidad_alumnos,
  }));
}

export default function ProgresoAlumnos({ progreso = { ortografia: [], legibilidad: [] }, onCategoriaClick }) {
  const [tab, setTab] = useState("ortografia");
  const [ancho, setAncho] = useState(500);
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!contenedorRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setAncho(entry.contentRect.width);
      }
    });
    observer.observe(contenedorRef.current);
    return () => observer.disconnect();
  }, []);

  const data = transformarDatos(
    tab === "ortografia" ? progreso.ortografia : progreso.legibilidad
  );

  const sinDatos = data.length === 0;
  const esMobile = ancho <= BREAKPOINT_MOBILE;

  // Alturas según modo
  const altoDonut = Math.min(Math.max(ancho * 0.65, 260), 380);
  const altoBar = 260;

  return (
    <div className="p-5">
      {/* Header */}
      <h2 className="text-xl font-bold text-blue-900 text-center mb-4">
        Progreso alumnos
      </h2>

      {/* Selector tabs */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          <button
            onClick={() => setTab("ortografia")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              tab === "ortografia"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Ortografía
          </button>
          <button
            onClick={() => setTab("legibilidad")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              tab === "legibilidad"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Legibilidad
          </button>
        </div>
      </div>

      {/* Contenedor responsive */}
      <div ref={contenedorRef} className="w-full">
        {sinDatos ? (
          <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
            Sin datos de progreso aún.
          </div>
        ) : esMobile ? (
        
          <>
            <BarChart width={ancho} height={altoBar} data={data} />
            {/* Leyenda con colores */}
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {data.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: LEYENDA_COLORS[i % LEYENDA_COLORS.length] }}
                  />
                  <span className="text-xs text-gray-500">{d.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
        
          <DonutChart width={ancho}
           height={altoDonut}
           data={data}
           onSliceClick={onCategoriaClick} 
          />
        )}
      </div>
    </div>
  );
}