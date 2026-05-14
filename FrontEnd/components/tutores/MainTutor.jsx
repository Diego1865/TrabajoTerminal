'use client';
import { useState, useEffect, useRef } from "react";
import { LogOut, UserPlus, Trash2, Loader2, Eye, X, Image as ImageIcon, CheckCircle, Award } from "lucide-react";
import AlumnosCategoria from "./AlumnosCategoria";
import ProgresoAlumnos from "./ProgresoAlumnos";
import TabEjercicios from "./TabEjercicios";
import PerfilTutor from "./PerfilTutor";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función para decodificar el payload del JWT
const decodificarJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const getTutorFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return decodificarJwt(token);
  } catch {
    return null;
  }
};

const getTipoUsuario = () => getTutorFromStorage()?.tipo_usuario;
const getToken = () => localStorage.getItem("token");
const getTutorId = () => getTutorFromStorage()?.id_usuario;
const getNombreTutor = () => getTutorFromStorage()?.nombre || "Tutor";

// --- Componente Modal para Detalle y Calificación ---
const ModalDetalleAlumno = ({ alumno, idTutor, onClose }) => {
  const [intentos, setIntentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [intentoActivo, setIntentoActivo] = useState(null);
  const [calificacion, setCalificacion] = useState("");
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchIntentos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/intentos/tutor/${idTutor}`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (!res.ok) throw new Error("Error al obtener intentos del alumno.");
        const data = await res.json();
        const intentosDelAlumno = data.filter(i => i.id_usuario === alumno.id_alumno);
        setIntentos(intentosDelAlumno);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIntentos();
  }, [idTutor, alumno.id_alumno]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const obtenerSrcImagen = (imgData) => {
    if (!imgData) return null;
    if (imgData.startsWith('data:image')) return imgData;
    return `data:image/jpeg;base64,${imgData}`;
  };

  const handleGuardarCalificacion = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await fetch(`${API_URL}/api/intentos/calificar/${intentoActivo.id_intento}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          calificacion: Number(calificacion),
          retroalimentacion: retroalimentacion
        })
      });
      
      if (!res.ok) throw new Error("Error al guardar la calificación.");
      
      alert("Calificación guardada correctamente.");
      
      setIntentos(prev => prev.map(i => 
        i.id_intento === intentoActivo.id_intento 
          ? { ...i, puntuacion: calificacion, retroalimentacion } 
          : i
      ));
      setIntentoActivo(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Expediente del Alumno</h2>
            <p className="text-sm text-gray-500">{alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-white p-2 rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className={`${intentoActivo ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col border-r border-gray-100 bg-white`}>
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-semibold text-gray-700">Historial de Ejercicios</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
              ) : error ? (
                <p className="text-sm text-red-500 p-2">{error}</p>
              ) : intentos.length === 0 ? (
                <p className="text-sm text-gray-500 text-center p-4">El alumno no ha enviado ejercicios aún.</p>
              ) : (
                intentos.map(intento => (
                  <div 
                    key={intento.id_intento} 
                    onClick={() => {
                      setIntentoActivo(intento);
                      setCalificacion(intento.puntuacion || "");
                      setRetroalimentacion(intento.retroalimentacion || "");
                    }}
                    className={`p-3 border rounded-xl cursor-pointer transition-colors ${intentoActivo?.id_intento === intento.id_intento ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <p className="font-semibold text-sm text-gray-800 mb-1">{intento.titulo_ejercicio}</p>
                    <p className="text-xs text-gray-500">{formatearFecha(intento.fecha_envio)}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${intento.puntuacion !== undefined && intento.puntuacion !== null ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {intento.puntuacion !== undefined && intento.puntuacion !== null ? `${intento.puntuacion} pts` : 'Sin calificar'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${!intentoActivo ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 flex-col bg-gray-50`}>
            {intentoActivo ? (
              <div className="flex-1 overflow-y-auto p-6">
                <button onClick={() => setIntentoActivo(null)} className="md:hidden text-blue-600 font-medium mb-4 flex items-center gap-1 text-sm">
                  ← Volver a la lista
                </button>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{intentoActivo.titulo_ejercicio}</h3>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1"><CheckCircle size={14}/> Enviado el {formatearFecha(intentoActivo.fecha_envio)}</p>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 bg-gray-50 flex justify-center min-h-[250px] relative">
                    {intentoActivo.imagen_codificada ? (
                      <img src={obtenerSrcImagen(intentoActivo.imagen_codificada)} alt="Intento del alumno" className="max-w-full max-h-[300px] object-contain rounded" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">Sin imagen</p>
                      </div>
                    )}
                  </div>

                  {intentoActivo.texto_detectado_ocr && (
                    <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                      <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wide">Texto Detectado (OCR)</p>
                      <p className="text-sm font-mono text-gray-700">{intentoActivo.texto_detectado_ocr}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="text-blue-600" size={20}/>
                    <h3 className="font-bold text-gray-800">Asignar Calificación</h3>
                  </div>
                  <form onSubmit={handleGuardarCalificacion}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Puntuación (0-100)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          required
                          value={calificacion}
                          onChange={(e) => setCalificacion(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded outline-none focus:border-blue-500 bg-gray-50 text-gray-900 font-medium"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Retroalimentación (Opcional)</label>
                        <textarea 
                          rows="2"
                          value={retroalimentacion}
                          onChange={(e) => setRetroalimentacion(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded outline-none focus:border-blue-500 bg-gray-50 resize-none text-gray-900"
                          placeholder="Comentarios sobre el trazo, ortografía, etc."
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={guardando}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-60"
                      >
                        {guardando && <Loader2 size={16} className="animate-spin" />}
                        Guardar Evaluación
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <Award size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-500">Seleccione un intento</p>
                <p className="text-sm mt-2">Haga clic en un ejercicio de la lista para ver la imagen y asignar una calificación.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function MainTutor({ onLogout }) {
  const [tab, setTab] = useState("inicio");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("riesgo"); 
  const [alumnosCategoria, setAlumnosCategoria] = useState([]);
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const [errorCategoria, setErrorCategoria] = useState(null);

  const [alumnosProgreso, setAlumnosProgreso] = useState([]);
  const [loadingProgreso, setLoadingProgreso] = useState(true);
  const [errorProgreso, setErrorProgreso] = useState(null);

  const [alumnos, setAlumnos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [errorAlumnos, setErrorAlumnos] = useState("");
  
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

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
  const tipoUsuario = getTipoUsuario();

  const fecha = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!tipoUsuario) return;
    if (tipoUsuario !== 'tutor') {
      onLogout();
    }
  }, [tipoUsuario, onLogout]);

  useEffect(() => {
    if (!idTutor || tab !== "inicio") return;

    const fetchAlumnosPorCategoria = async () => {
      setLoadingCategoria(true);
      setErrorCategoria(null);
      try {
        const res = await fetch(`${API_URL}/api/tutor/${categoriaSeleccionada}/${idTutor}`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await res.json();
        console.log(`Alumnos categoría ${categoriaSeleccionada}:`, data);
        setAlumnosCategoria(data);
      } catch (err) {
        setErrorCategoria(err.message);
      } finally {
        setLoadingCategoria(false);
      }
    };

    const fetchProgreso = async () => {
      setLoadingProgreso(true);
      setErrorProgreso(null);
      try {
        const res = await fetch(`${API_URL}/api/tutor/progreso/${idTutor}`, {
          headers: { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Error al obtener progreso de alumnos");
        const data = await res.json();
        setAlumnosProgreso(data);
      } catch (err) {
        setErrorProgreso(err.message);
      } finally {
        setLoadingProgreso(false);
      }
    };

    fetchAlumnosPorCategoria();
    fetchProgreso();
  }, [idTutor, tab, categoriaSeleccionada]);

  useEffect(() => {
    if (tab !== "alumnos") return;
    fetchAlumnos();
  }, [tab]);

  const fetchAlumnos = async () => {
    if (!idTutor) return;
    setLoadingAlumnos(true);
    setErrorAlumnos("");

    try {
      const response = await fetch(`${API_URL}/api/tutor/alumnos/${idTutor}`, {
        headers: { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" }
      });
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
      const response = await fetch(`${API_URL}/api/tutor/registrar`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
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
      const response = await fetch(`${API_URL}/api/tutor/baja/${id_alumno}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${getToken()}` }
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
    { key: "alumnos", label: "Alumnos" },
    { key: "perfil", label: "Perfil" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {alumnoSeleccionado && (
        <ModalDetalleAlumno 
          alumno={alumnoSeleccionado} 
          idTutor={idTutor} 
          onClose={() => setAlumnoSeleccionado(null)} 
        />
      )}

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
              {loadingCategoria ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                  Cargando alumnos en riesgo...
                </div>
              ) : errorCategoria ? (
                <div className="flex items-center justify-center h-48 text-red-400 text-sm">
                  {errorCategoria}
                </div>
              ) : (
                <AlumnosCategoria alumnos={alumnosCategoria}
                 categoria={categoriaSeleccionada}
                 />
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
                <ProgresoAlumnos progreso={alumnosProgreso}
                 onCategoriaClick={(cat) => setCategoriaSeleccionada(cat)}
                />
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
                  className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleInputChange}
                    placeholder="Apellido Paterno"
                    required
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleInputChange}
                    placeholder="Apellido Materno"
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg outline-none"
                  />
                </div>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  placeholder="Usuario de acceso"
                  required
                  className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg outline-none"
                />
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  placeholder="Contraseña temporal"
                  required
                  className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="grado"
                    value={formData.grado}
                    onChange={handleInputChange}
                    placeholder="Grado"
                    required
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleInputChange}
                    placeholder="Grupo"
                    className="w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg outline-none"
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
                    <div key={alumno.id_alumno} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:border-blue-200 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {alumno.nombre} {alumno.apellido_paterno}
                        </p>
                        <p className="text-xs text-gray-500">
                          Usr: {alumno.usuario} | {alumno.grado} "{alumno.grupo}"
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAlumnoSeleccionado(alumno)}
                          className="text-blue-500 hover:bg-blue-100 p-2 rounded transition-colors"
                          title="Ver intentos y calificar"
                          type="button"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDarDeBaja(alumno.id_alumno)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Dar de baja"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "perfil" && (
          <PerfilTutor onLogout={onLogout} />
        )}
      </main>
    </div>
  );
}