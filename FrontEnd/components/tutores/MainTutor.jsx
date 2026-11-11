'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LogOut, UserPlus, Trash2, Loader2, Eye, X, Image as ImageIcon, CheckCircle, Award, KeyRound } from "lucide-react";
import AlumnosCategoria from "./AlumnosCategoria";
import ProgresoAlumnos from "./ProgresoAlumnos";
import { clasificar, categoriaInicial } from "./categoriasProgreso";
import TabEjercicios from "./TabEjercicios";
import PerfilTutor from "./PerfilTutor";
import EvaluacionPreliminar from "./EvaluacionPreliminar";
import ModalPasswordAlumno from "./ModalPasswordAlumno";

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

// Medidas de legibilidad (0-10) sugeridas por el sistema y confirmadas por el tutor.
const MEDIDAS_LEGIBILIDAD = [
  { clave: "alineacion", etiqueta: "Alineación", ayuda: "¿Las letras siguen una línea recta?" },
  { clave: "tamano", etiqueta: "Tamaño", ayuda: "¿Las letras chicas tienen la misma altura?" },
  { clave: "espaciado", etiqueta: "Espaciado", ayuda: "¿La separación entre palabras es pareja?" },
  { clave: "inclinacion", etiqueta: "Inclinación", ayuda: "¿Las letras están derechas?" },
];
const LEGIBILIDAD_VACIA = { alineacion: "", tamano: "", espaciado: "", inclinacion: "" };

// --- Componente Modal para Detalle y Calificación ---
const ModalDetalleAlumno = ({ alumno, onClose }) => {
  const [intentos, setIntentos] = useState([]);
  // La lista llega sin imágenes; cada una se pide al abrir su intento y se guarda aquí.
  const [imagenes, setImagenes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [intentoActivo, setIntentoActivo] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [calificacion, setCalificacion] = useState("");
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [clsCorrectas, setClsCorrectas] = useState("");
  const [legibilidad, setLegibilidad] = useState(LEGIBILIDAD_VACIA);
  const [guardando, setGuardando] = useState(false);

  // Las secuencias posibles son fijas (dependen de la respuesta esperada); el tutor solo corrige las correctas.
  // El CLS confirmado tiene prioridad; si no hay, se propone el sugerido por el OCR.
  const clsBase = intentoActivo?.cls_confirmado || intentoActivo?.cls_sugerido;
  const clsPosibles = clsBase?.posibles > 0 ? Number(clsBase.posibles) : null;
  const cargarImagen = async (idIntento, forzar = false) => {
    if (!forzar && imagenes[idIntento] !== undefined) return;
    setImagenes(prev => ({ ...prev, [idIntento]: "cargando" }));
    try {
      const res = await fetch(`${API_URL}/api/tutor/intentos/${idIntento}/imagen`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImagenes(prev => ({ ...prev, [idIntento]: data.imagen_codificada || null }));
    } catch {
      setImagenes(prev => ({ ...prev, [idIntento]: "error" }));
    }
  };

  const seleccionarIntento = (intento) => {
    const cls = intento.cls_confirmado || intento.cls_sugerido;
    setIntentoActivo(intento);
    cargarImagen(intento.id_intento);
    setCalificacion(intento.puntuacion ?? "");
    setRetroalimentacion(intento.retroalimentacion || "");
    setClsCorrectas(cls?.posibles > 0 ? String(cls.correctas) : "");
    // Lo confirmado tiene prioridad; si no, se propone lo sugerido. Lo que no se pudo medir queda vacío.
    const legi = intento.legibilidad_confirmada || intento.legibilidad_sugerida || {};
    setLegibilidad(Object.fromEntries(MEDIDAS_LEGIBILIDAD.map(({ clave }) =>
      [clave, legi[clave] === null || legi[clave] === undefined ? "" : String(legi[clave])])));
  };
  const clsValido = clsPosibles !== null && clsCorrectas !== "" && Number.isInteger(Number(clsCorrectas))
    && Number(clsCorrectas) >= 0 && Number(clsCorrectas) <= clsPosibles;
  const valoresLegibilidad = MEDIDAS_LEGIBILIDAD.map(({ clave }) => legibilidad[clave]);
  const legibilidadVacia = valoresLegibilidad.every(v => v === "");
  const legibilidadValida = valoresLegibilidad.every(v => v !== "" && Number(v) >= 0 && Number(v) <= 10);
  const promedioLegibilidad = legibilidadValida
    ? valoresLegibilidad.reduce((suma, v) => suma + Number(v), 0) / valoresLegibilidad.length : null;
  // Puntuación sugerida (0-100) = promedio de las notas (0-10) de ortografía y legibilidad que haya.
  const notaOrtografia = clsValido ? Number(clsCorrectas) / clsPosibles * 10 : null;
  const notaLegibilidad = promedioLegibilidad;
  const notasDisponibles = [notaOrtografia, notaLegibilidad].filter(n => n !== null);
  const calificacionSugerida = notasDisponibles.length
    ? Math.round(notasDisponibles.reduce((suma, n) => suma + n, 0) / notasDisponibles.length * 10) : null;
  const resumenNotas = `Ortografía ${notaOrtografia !== null ? notaOrtografia.toFixed(1) : "—"} · Legibilidad ${notaLegibilidad !== null ? notaLegibilidad.toFixed(1) : "—"}`;

  useEffect(() => {
    const fetchIntentos = async () => {
      setLoading(true);
      try {
        // Solo los intentos de este alumno y sin imágenes: la respuesta ya no crece con toda la clase.
        const res = await fetch(`${API_URL}/api/tutor/alumnos/${alumno.id_alumno}/intentos`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (!res.ok) throw new Error("Error al obtener intentos del alumno.");
        setIntentos(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIntentos();
  }, [alumno.id_alumno]);

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
    if (clsCorrectas !== "" && !clsValido) {
      alert(`Revisa el CLS: las secuencias correctas deben ser un número entero entre 0 y ${clsPosibles}, o deja el campo vacío.`);
      return;
    }
    if (!legibilidadVacia && !legibilidadValida) {
      alert("Revisa la legibilidad: llena las 4 medidas con números entre 0 y 10, o deja las 4 vacías.");
      return;
    }
    const legibilidadConfirmada = legibilidadValida
      ? Object.fromEntries(MEDIDAS_LEGIBILIDAD.map(({ clave }) => [clave, Number(legibilidad[clave])]))
      : null;
    const clsConfirmado = clsValido
      ? { metrica: "CLS", correctas: Number(clsCorrectas), posibles: clsPosibles, confirmado_por_tutor: true }
      : intentoActivo.cls_confirmado;
    setGuardando(true);
    try {
      const res = await fetch(`${API_URL}/api/tutor/calificar/${intentoActivo.id_intento}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          calificacion: Number(calificacion),
          retroalimentacion: retroalimentacion,
          ...(clsValido ? { cls_correctas: Number(clsCorrectas) } : {}),
          ...(legibilidadConfirmada ? { legibilidad: legibilidadConfirmada } : {})
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.detail === "string" ? data.detail : "Error al guardar la calificación.");
      }
      
      alert("Calificación guardada correctamente.");
      
      setIntentos(prev => prev.map(i => 
        i.id_intento === intentoActivo.id_intento 
          ? { ...i, puntuacion: calificacion, retroalimentacion, cls_confirmado: clsConfirmado,
              legibilidad_confirmada: legibilidadConfirmada || i.legibilidad_confirmada }
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 sm:p-4 [@media(max-height:560px)]:p-0" onClick={onClose}>
      {/* En celular (o con poca altura, p. ej. celular horizontal) ocupa toda la pantalla; dvh descuenta la barra del navegador. */}
      <div className="bg-white sm:rounded-2xl shadow-xl w-full max-w-5xl h-[100dvh] sm:h-[85vh] [@media(max-height:560px)]:h-[100dvh] [@media(max-height:560px)]:rounded-none flex flex-col overflow-hidden relative" onClick={(e) => e.stopPropagation()}>

        {imagenAmpliada && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-2" onClick={() => setImagenAmpliada(null)}
            role="dialog" aria-label="Imagen del intento ampliada">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagenAmpliada} alt="Intento del alumno ampliado" className="max-w-full max-h-full object-contain" />
            <button type="button" onClick={() => setImagenAmpliada(null)} aria-label="Cerrar imagen"
              className="absolute top-3 right-3 p-3 rounded-full bg-white/90 text-gray-800 shadow">
              <X size={22} />
            </button>
          </div>
        )}

        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center gap-3 bg-gray-50">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-800">Expediente del Alumno</h2>
            <p className="text-sm text-gray-500">{alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar expediente" className="shrink-0 text-gray-400 hover:text-gray-700 bg-white p-2.5 rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col md:flex-row">
          <div className={`${intentoActivo ? 'hidden md:flex' : 'flex'} flex-1 min-h-0 md:flex-none w-full md:w-1/3 flex-col border-r border-gray-100 bg-white`}>
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
                    onClick={() => seleccionarIntento(intento)}
                    className={`p-3 border rounded-xl cursor-pointer transition-colors ${intentoActivo?.id_intento === intento.id_intento ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <p className="font-semibold text-sm text-gray-800 mb-1">{intento.titulo_ejercicio}</p>
                    <p className="text-xs text-gray-500">{formatearFecha(intento.fecha_envio)}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${intento.puntuacion !== undefined && intento.puntuacion !== null ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {intento.puntuacion !== undefined && intento.puntuacion !== null ? `${intento.puntuacion} pts` : 'Sin calificar'}
                      </span>
                      {intento.cls_confirmado && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          CLS confirmado
                        </span>
                      )}
                      {intento.legibilidad_confirmada && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          Legibilidad confirmada
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${!intentoActivo ? 'hidden md:flex' : 'flex'} flex-1 min-h-0 md:flex-none w-full md:w-2/3 flex-col bg-gray-50`}>
            {intentoActivo ? (<>
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
                <button onClick={() => setIntentoActivo(null)} className="md:hidden min-h-11 text-blue-600 font-medium mb-2 flex items-center gap-1 text-sm">
                  ← Volver a la lista
                </button>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{intentoActivo.titulo_ejercicio}</h3>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1"><CheckCircle size={14}/> Enviado el {formatearFecha(intentoActivo.fecha_envio)}</p>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 bg-gray-50 flex justify-center min-h-[250px] relative">
                    {imagenes[intentoActivo.id_intento] === "cargando" ? (
                      <div className="flex items-center justify-center text-gray-400">
                        <Loader2 size={28} className="animate-spin" />
                      </div>
                    ) : imagenes[intentoActivo.id_intento] === "error" ? (
                      <div className="flex flex-col items-center justify-center text-red-400 gap-2">
                        <p className="text-sm">No se pudo cargar la imagen.</p>
                        <button type="button" className="text-sm text-blue-600 hover:underline"
                          onClick={() => cargarImagen(intentoActivo.id_intento, true)}>
                          Reintentar
                        </button>
                      </div>
                    ) : imagenes[intentoActivo.id_intento] ? (
                      <button type="button" onClick={() => setImagenAmpliada(obtenerSrcImagen(imagenes[intentoActivo.id_intento]))}
                        className="group relative cursor-zoom-in" aria-label="Ampliar imagen del intento">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={obtenerSrcImagen(imagenes[intentoActivo.id_intento])} alt="Intento del alumno" className="max-w-full max-h-[50dvh] md:max-h-[300px] object-contain rounded" />
                        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">Toca para ampliar</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">Sin imagen</p>
                      </div>
                    )}
                  </div>

                  <EvaluacionPreliminar evaluacion={intentoActivo.evaluacion_preliminar}
                    cls={intentoActivo.cls_sugerido}
                    calificacionSugerida={calificacionSugerida}
                    notaOrtografia={notaOrtografia}
                    notaLegibilidad={notaLegibilidad}
                    onUsarCalificacion={() => setCalificacion(String(calificacionSugerida))}
                    onUsarSugerencia={(texto) => setRetroalimentacion(actual => actual ? `${actual}\n\n${texto}` : texto)} />
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
                  <form id="form-calificacion" onSubmit={handleGuardarCalificacion}>
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
                        <p className="text-xs text-gray-500 mt-1">
                          {resumenNotas}{calificacionSugerida !== null ? ` → sugerida ${calificacionSugerida}` : ""}
                        </p>
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
                    <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Ortografía · CLS (secuencias de letras correctas). Revisa la propuesta del OCR con la imagen; solo cuenta para el progreso al guardar.
                      </p>
                      {clsPosibles === null ? (
                        <p className="text-sm text-gray-500">Este ejercicio no tiene respuesta configurada; no se puede calcular el CLS.</p>
                      ) : (
                        <div className="flex flex-wrap items-end gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Secuencias correctas</label>
                            <input type="number" min="0" max={clsPosibles} step="1" value={clsCorrectas}
                              onChange={(e) => setClsCorrectas(e.target.value)}
                              className="w-28 p-2 border border-gray-300 rounded outline-none focus:border-blue-500 bg-white text-gray-900" />
                          </div>
                          <p className="text-sm text-gray-700 pb-2">
                            de <strong>{clsPosibles}</strong> posibles
                          </p>
                          <p className="text-sm text-gray-700 pb-2">
                            {clsValido ? `→ Ortografía: ${(Number(clsCorrectas) / clsPosibles * 10).toFixed(1)} / 10`
                              : clsCorrectas === "" ? "Sin CLS (no cambia el progreso)" : `Debe ser un entero entre 0 y ${clsPosibles}`}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Legibilidad (0 a 10). {intentoActivo.legibilidad_confirmada ? "Valores confirmados; puedes corregirlos."
                          : intentoActivo.legibilidad_sugerida ? "Propuesta calculada con los recuadros del OCR; compárala con la imagen."
                          : "El sistema no pudo medirla en este intento; puedes capturarla a mano."} Solo cuenta para el progreso al guardar.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {MEDIDAS_LEGIBILIDAD.map(({ clave, etiqueta, ayuda }) => (
                          <div key={clave}>
                            <label className="block text-xs text-gray-600 mb-1" title={ayuda}>{etiqueta}</label>
                            <input type="number" min="0" max="10" step="0.5" value={legibilidad[clave]} title={ayuda}
                              onChange={(e) => setLegibilidad(prev => ({ ...prev, [clave]: e.target.value }))}
                              placeholder="—"
                              className="w-full p-2 border border-gray-300 rounded outline-none focus:border-blue-500 bg-white text-gray-900" />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        {legibilidadValida ? `→ Legibilidad: ${promedioLegibilidad.toFixed(1)} / 10`
                          : legibilidadVacia ? "Sin legibilidad (no cambia el progreso)"
                          : "Llena las 4 medidas (0 a 10) para que cuente."}
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              {/* Fuera del área con scroll: el botón siempre está a la vista. */}
              <div className="shrink-0 flex justify-end px-4 sm:px-6 py-3 border-t border-gray-200 bg-white">
                <button
                  type="submit"
                  form="form-calificacion"
                  disabled={guardando}
                  className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-60"
                >
                  {guardando && <Loader2 size={16} className="animate-spin" />}
                  Guardar Evaluación
                </button>
              </div>
            </>) : (
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
  // Inicio: promedios de todos los alumnos en una sola petición; contadores, barra y lista
  // se calculan aquí con la misma clasificación (categoriasProgreso.js).
  const [resumen, setResumen] = useState([]);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [errorResumen, setErrorResumen] = useState(null);
  const [metrica, setMetrica] = useState("general");
  const [categoriaElegida, setCategoriaElegida] = useState(null);
  const grupos = useMemo(() => clasificar(resumen, metrica), [resumen, metrica]);
  // Sin elección del tutor, se abre la primera categoría con alumnos (riesgo primero).
  const categoriaActiva = categoriaElegida ?? categoriaInicial(grupos);

  const [alumnos, setAlumnos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [errorAlumnos, setErrorAlumnos] = useState("");
  
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [alumnoPassword, setAlumnoPassword] = useState(null);

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

  // Perfil desde la API: el nombre del token no cambia hasta el próximo inicio de sesión.
  const [perfil, setPerfil] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState("");

  const idTutor = getTutorId();
  const nombreTutor = perfil?.nombre || getNombreTutor();
  const tipoUsuario = getTipoUsuario();

  const cargarPerfil = useCallback(async () => {
    setErrorPerfil("");
    try {
      const res = await fetch(`${API_URL}/api/tutor/perfil`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("No se pudo cargar tu perfil.");
      setPerfil(await res.json());
    } catch (err) {
      setErrorPerfil(err.message);
    }
  }, []);

  useEffect(() => {
    if (tipoUsuario === "tutor") cargarPerfil();
  }, [tipoUsuario, cargarPerfil]);

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
    // Se vuelve a pedir cada vez que se entra a Inicio, para ver las calificaciones recientes.
    const fetchResumen = async () => {
      setLoadingResumen(true);
      setErrorResumen(null);
      try {
        const res = await fetch(`${API_URL}/api/tutor/resumen-progreso`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Error al obtener el progreso de los alumnos");
        setResumen(Array.isArray(data.alumnos) ? data.alumnos : []);
      } catch (err) {
        setErrorResumen(err.message);
        setResumen([]);
      } finally {
        setLoadingResumen(false);
      }
    };
    fetchResumen();
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
          onClose={() => setAlumnoSeleccionado(null)} 
        />
      )}
      {alumnoPassword && (
        <ModalPasswordAlumno alumno={alumnoPassword} onClose={() => setAlumnoPassword(null)} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Saludo y cierre de sesión en la misma fila: un nombre largo ya no se encima con el botón. */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-gray-400">{fecha}</p>
            <h1 className="text-2xl sm:text-4xl font-bold mt-1 break-words">
              <span className="text-blue-500">Hola </span>
              <span className="text-blue-900">{nombreTutor}</span>
            </h1>
          </div>
          <button
            onClick={onLogout}
            aria-label="Cerrar sesión"
            className="shrink-0 flex items-center gap-2 min-h-11 min-w-11 justify-center px-2 sm:px-3 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

        <div className="flex justify-center mb-8">
          {/* En celular las 4 pestañas se reparten el ancho; desde sm vuelven a su tamaño natural. */}
          <div className="grid grid-cols-4 w-full sm:flex sm:w-auto bg-gray-200 p-1 rounded-full shadow-inner">
            {tabs.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                aria-pressed={tab === item.key}
                className={`min-w-0 px-1 sm:px-5 py-2.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all ${
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
          loadingResumen ? (
            <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center h-48 text-gray-400 text-sm gap-2">
              <Loader2 className="animate-spin" size={18} /> Cargando progreso de tus alumnos...
            </div>
          ) : errorResumen ? (
            <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center h-48 text-red-400 text-sm">
              {errorResumen}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm">
                <ProgresoAlumnos grupos={grupos} total={resumen.length}
                  metrica={metrica} onMetrica={setMetrica}
                  categoria={categoriaActiva} onCategoria={setCategoriaElegida} />
              </div>
              <div className="bg-white rounded-2xl shadow-sm">
                <AlumnosCategoria key={`${categoriaActiva}-${metrica}`} alumnos={grupos[categoriaActiva]}
                  categoria={categoriaActiva} metrica={metrica} />
              </div>
            </div>
          )
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
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => setAlumnoSeleccionado(alumno)}
                          className="min-h-11 min-w-11 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver intentos y calificar"
                          type="button"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => setAlumnoPassword(alumno)}
                          className="min-h-11 min-w-11 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Restablecer contraseña"
                          type="button"
                        >
                          <KeyRound size={18} />
                        </button>
                        <button
                          onClick={() => handleDarDeBaja(alumno.id_alumno)}
                          className="min-h-11 min-w-11 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
          <PerfilTutor perfil={perfil} errorPerfil={errorPerfil} onRecargarPerfil={cargarPerfil} onLogout={onLogout} />
        )}
      </main>
    </div>
  );
}
