"use client";
import { useState } from "react";
import { X, Eye, EyeOff, Loader2, KeyRound, CheckCircle, Copy } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Los alumnos no tienen correo: su tutor les asigna una contraseña nueva desde aquí.
export default function ModalPasswordAlumno({ alumno, onClose }) {
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [visible, setVisible] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const nombre = [alumno.nombre, alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(" ");

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    if (nueva.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (nueva !== confirmacion) return setError("Las contraseñas no coinciden.");
    setGuardando(true);
    try {
      const response = await fetch(`${API_URL}/api/tutor/alumno/${alumno.id_alumno}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ nueva_contrasena: nueva })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Error al restablecer la contraseña");
      setListo(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`Usuario: ${alumno.usuario}\nContraseña: ${nueva}`);
      setCopiado(true);
    } catch {
      setError("No se pudo copiar; anota los datos a mano.");
    }
  };

  const campo = "w-full p-3 pr-11 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>

        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-full"><KeyRound size={20} /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Restablecer contraseña</h2>
              <p className="text-sm text-gray-500">{nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-white p-2 rounded-full shadow-sm" type="button">
            <X size={20} />
          </button>
        </div>

        {listo ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle size={20} /> Contraseña actualizada
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 font-mono text-gray-800">
              <p><span className="text-gray-500 font-sans text-sm">Usuario:</span> {alumno.usuario}</p>
              <p><span className="text-gray-500 font-sans text-sm">Contraseña:</span> {nueva}</p>
            </div>
            <p className="text-sm text-gray-500">
              Compártela con el alumno. El alumno entra con su <strong>usuario</strong>, no con su nombre.
              Por seguridad, esta contraseña no se volverá a mostrar.
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={copiar} type="button"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                <Copy size={16} /> {copiado ? "¡Copiado!" : "Copiar datos"}
              </button>
              <button onClick={onClose} type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={guardar} className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              El alumno inicia sesión con el usuario <strong className="font-mono">{alumno.usuario}</strong>.
            </p>
            <div className="relative">
              <input type={visible ? "text" : "password"} placeholder="Nueva contraseña (mínimo 6 caracteres)"
                value={nueva} onChange={(e) => setNueva(e.target.value)} maxLength={72}
                className={campo} disabled={guardando} autoFocus required />
              <button type="button" onClick={() => setVisible(!visible)} title={visible ? "Ocultar" : "Mostrar"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <input type={visible ? "text" : "password"} placeholder="Confirmar contraseña"
              value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} maxLength={72}
              className={campo} disabled={guardando} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} type="button" disabled={guardando}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60">
                {guardando && <Loader2 size={16} className="animate-spin" />} Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
