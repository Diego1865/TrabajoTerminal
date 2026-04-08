import { useState } from "react";
import { DonutChart } from "./DonutChart";

// Transforma el formato del backend { categoria, cantidad_alumnos }
// al formato que espera DonutChart { name, value }
function transformarDatos(datos) {
  return datos.map((d) => ({
    name: d.categoria,
    value: d.cantidad_alumnos,
  }));
}

// Props:
// progreso: { ortografia: [...], legibilidad: [...] }
export default function ProgresoAlumnos({ progreso = { ortografia: [], legibilidad: [] } }) {
  const [tab, setTab] = useState("ortografia");

  const data = transformarDatos(
    tab === "ortografia" ? progreso.ortografia : progreso.legibilidad
  );

  const sinDatos = data.length === 0;
  console.log("Datos para gráfica:", data);
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

      {/* Gráfica */}
      {sinDatos ? (
        <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
          Sin datos de progreso aún.
        </div>
      ) : (
        <div className="flex justify-center">
          <DonutChart width={650} height={300} data={data} />
        </div>
      )}
    </div>
  );
}