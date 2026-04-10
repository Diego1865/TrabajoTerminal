import { useEffect, useState, useRef } from "react";
import { LogOut, UserPlus, Trash2, Loader2 } from "lucide-react";
import AlumnosEnRiesgo from "./AlumnosEnRiesgo";
import ProgresoAlumnos from "./ProgresoAlumnos";
import TabEjercicios from "../TabEjercicios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getTutorFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const getTutorId = () => getTutorFromStorage()?.id_usuario;
const getNombreTutor = () => getTutorFromStorage()?.nombre || "Tutor";

export default function MainTutor({ onLogout }) {
  const [tab, setTab] = useState("inicio");
  const [alumnosEnRiesgo, setAlumnosEnRiesgo] = useState([]);
  const [loadingRiesgo, setLoadingRiesgo] = useState(true);
  const [errorRiesgo, setErrorRiesgo] = useState(null);

  const [alumnosProgreso, setAlumnosProgreso] = useState([]);
  const [loadingProgreso, setLoadingProgreso] = useState(true);
  const [errorProgreso, setErrorProgreso] = useState(null);

  const [alumnos, setAlumnos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [errorAlumnos, setErrorAlumnos] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    usuario: "",
    contrasena: "",
    grado: "",
    grupo: "",
  });
  const [usuarioManual, setUsuarioManual] = useState(false);
  const sufijoAleatorio = useRef(Math.floor(Math.random() * 90) + 10);

  const idTutor = getTutorId();
  const nombreTutor = getNombreTutor();

  const fecha = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!idTutor || tab !== "inicio") return;

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

    const fetchProgreso = async () => {
      setLoadingProgreso(true);
      setErrorProgreso(null);
      try {
        const res = await fetch(`${API_URL}/api/alumnos/progreso/${idTutor}`);
        if (!res.ok) throw new Error("Error al obtener progreso de alumnos");
        const data = await res.json();
        setAlumnosProgreso(data);
      } catch (err) {
        setErrorProgreso(err.message);
      } finally {
        setLoadingProgreso(false);
      }
    };

    fetchAlumnosEnRiesgo();
    fetchProgreso();
  }, [idTutor, tab]);

  useEffect(() => {
    if (tab !== "alumnos") return;
    fetchAlumnos();
  }, [tab]);

  const fetchAlumnos = async () => {
    if (!idTutor) return;
    setLoadingAlumnos(true);
    setErrorAlumnos("");

    try {
      const response = await fetch(`${API_URL}/api/alumnos/tutor/${idTutor}`);
      if (!response.ok) throw new Error("Error al obtener la lista de alumnos");
      const data = await response.json();
      setAlumnos(data);
    } catch (err) {
      setErrorAlumnos(err.message);
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "usuario") {
      setUsuarioManual(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!usuarioManual && formData.nombre && formData.apellido_paterno) {
      const normalizar = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

      const primerNombre = normalizar(formData.nombre).split(" ")[0];
      const prefijoApellido = normalizar(formData.apellido_paterno).substring(0, 2);

      if (primerNombre && prefijoApellido) {
        setFormData((prev) => ({
          ...prev,
          usuario: `${primerNombre}${prefijoApellido}${sufijoAleatorio.current}`,
        }));
      }
    } else if (!usuarioManual && (!formData.nombre || !formData.apellido_paterno)) {
      setFormData((prev) => ({ ...prev, usuario: "" }));
    }
  }, [formData.nombre, formData.apellido_paterno, usuarioManual]);

  const handleAgregarAlumno = async (e) => {
    e.preventDefault();
    setErrorAlumnos("");

    if (!idTutor) {
      setErrorAlumnos("No se encontró la sesión del tutor.");
      return;
    }

    try {
      setLoadingAlumnos(true);
      const response = await fetch(`${API_URL}/api/alumnos/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id_tutor: idTutor }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Error al registrar alumno");
      }

      setFormData({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        usuario: "",
        contrasena: "",
        grado: "",
        grupo: "",
      });
      setUsuarioManual(false);
      sufijoAleatorio.current = Math.floor(Math.random() * 90) + 10;
      await fetchAlumnos();
      alert("Alumno registrado con éxito");
    } catch (err) {
      setErrorAlumnos(err.message);
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleDarDeBaja = async (id_alumno) => {
    if (!confirm("¿Está seguro de que desea dar de baja a este alumno?")) return;

    try {
      const response = await fetch(`${API_URL}/api/alumnos/baja/${id_alumno}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Error al procesar la baja");
      await fetchAlumnos();
    } catch (err) {
      alert(err.message);
    }
  };

  const tabs = [
    { key: "inicio", label: "Inicio" },
    { key: "ejercicios", label: "Ejercicios" },
    { key: "alumnos", label: "Agregar alumnos" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <button
        onClick={onLogout}
        className="absolute top-6 right-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-400">{fecha}</p>
          <h1 className="text-4xl font-bold mt-1">
            <span className="text-blue-500">Hola </span>
            <span className="text-blue-900">{nombreTutor}</span>
          </h1>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-200 p-1 rounded-full shadow-inner">
            {tabs.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  tab === item.key
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "inicio" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        )}

        {tab === "ejercicios" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <TabEjercicios idTutor={idTutor} />
          </div>
        )}

        {tab === "alumnos" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <UserPlus className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Alta de Alumno</h3>
              </div>
              <form onSubmit={handleAgregarAlumno} className="space-y-4">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre(s)"
                  required
                  className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleInputChange}
                    placeholder="Apellido Paterno"
                    required
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleInputChange}
                    placeholder="Apellido Materno"
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg outline-none"
                  />
                </div>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  placeholder="Usuario de acceso"
                  required
                  className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg outline-none"
                />
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  placeholder="Contraseña temporal"
                  required
                  className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="grado"
                    value={formData.grado}
                    onChange={handleInputChange}
                    placeholder="Grado"
                    required
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleInputChange}
                    placeholder="Grupo"
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingAlumnos}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-60"
                >
                  {loadingAlumnos && <Loader2 className="animate-spin" size={20} />}
                  {loadingAlumnos ? "Registrando..." : "Registrar Alumno"}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Alumnos Inscritos</h3>
                <span className="text-sm text-gray-500">{alumnos.length} alumno(s)</span>
              </div>
              {errorAlumnos && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {errorAlumnos}
                </div>
              )}
              <div className="space-y-3 overflow-y-auto max-h-[560px]">
                {loadingAlumnos ? (
                  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    Cargando lista de alumnos...
                  </div>
                ) : alumnos.length === 0 ? (
                  <p className="text-center text-gray-500">No hay alumnos registrados aún.</p>
                ) : (
                  alumnos.map((alumno) => (
                    <div key={alumno.id_alumno} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {alumno.nombre} {alumno.apellido_paterno}
                        </p>
                        <p className="text-xs text-gray-500">
                          Usr: {alumno.usuario} | {alumno.grado} "{alumno.grupo}"
                        </p>
                      </div>
                      <button
                        onClick={() => handleDarDeBaja(alumno.id_alumno)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
