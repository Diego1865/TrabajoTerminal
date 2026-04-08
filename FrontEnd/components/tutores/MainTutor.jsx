import { useEffect, useState } from "react";
// import NavbarTutor from "./NavbarTutor";
import AlumnosEnRiesgo from "./AlumnosEnRiesgo";
import ProgresoAlumnos from "./ProgresoAlumnos";
import { LogOut } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getTutorId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id_usuario;
};

const getNombreTutor = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.nombre || "Tutor";
};

export default function MainTutor({ onLogout }) {
  const idTutor = getTutorId();
  const nombreTutor = getNombreTutor();

  const [alumnosEnRiesgo, setAlumnosEnRiesgo] = useState([]);
  const [loadingRiesgo, setLoadingRiesgo] = useState(true);
  const [errorRiesgo, setErrorRiesgo] = useState(null);

  const [alumnosProgreso, setAlumnosProgreso] = useState([]);
  const [loadingProgreso, setLoadingProgreso] = useState(true);
  const [errorProgreso, setErrorProgreso] = useState(null);

  const fecha = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });


  useEffect(() => {
    if (!idTutor) return;

    const fetchAlumnosEnRiesgo = async () => {
      setLoadingRiesgo(true);
      setErrorRiesgo(null);
      try {
        const res = await fetch(`${API_URL}/api/alumnos/riesgo/${idTutor}`);
        if (!res.ok) throw new Error("Error al obtener alumnos en riesgo");
        const data = await res.json();
        setAlumnosEnRiesgo(data);
      } catch (err) {
        setErrorRiesgo(err.message);
      } finally {
        setLoadingRiesgo(false);
      }
    };

    fetchAlumnosEnRiesgo();
  }, [idTutor]);

  useEffect(() => {
    if (!idTutor) return;

    const fetchProgreso = async () => {
      setLoadingProgreso(true);
      setErrorProgreso(null);
      try {
        const res = await fetch(`${API_URL}/api/alumnos/progreso/${idTutor}`);
        if (!res.ok) throw new Error("Error al obtener progreso de alumnos");
        const data = await res.json();
        console.log("Progreso recibido del backend:", data);
        setAlumnosProgreso(data);
      } catch (err) {
        setErrorProgreso(err.message);
      } finally {
        setLoadingProgreso(false);
      }
    };

    fetchProgreso();
  }, [idTutor]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      {/* <NavbarTutor /> */}

      {/* Cerrar sesión */}
      <button
        onClick={onLogout}
        className="absolute top-6 right-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Saludo */}
        <div className="mb-6">
          <p className="text-sm text-gray-400">{fecha}</p>
          <h1 className="text-4xl font-bold mt-1">
            <span className="text-blue-500">Hola </span>
            <span className="text-blue-900">{nombreTutor}</span>
          </h1>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alumnos en riesgo */}
          <div className="bg-white rounded-2xl shadow-sm">
            {loadingRiesgo ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Cargando alumnos en riesgo...
              </div>
            ) : errorRiesgo ? (
              <div className="flex items-center justify-center h-48 text-red-400 text-sm">
                {errorRiesgo}
              </div>
            ) : (
              <AlumnosEnRiesgo alumnos={alumnosEnRiesgo} />
            )}
          </div>

          {/* Progreso alumnos */}
          <div className="bg-white rounded-2xl shadow-sm">
            {loadingProgreso ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Cargando progreso...
              </div>
            ) : errorProgreso ? (
              <div className="flex items-center justify-center h-48 text-red-400 text-sm">
                {errorProgreso}
              </div>
            ) : (
              <ProgresoAlumnos progreso={alumnosProgreso} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}