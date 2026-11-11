'use client';
import { useState } from 'react';
import { User, Mail, Lock, AlertTriangle, Save, Loader2, Eye, EyeOff, CalendarDays, AtSign, CheckCircle, RefreshCw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Mismo estilo que el resto del panel del tutor (MainTutor, ModalPasswordAlumno).
const tarjeta = 'bg-white p-6 rounded-xl shadow-md border border-gray-100';
const campo = 'w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500';
const botonPrimario = 'bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors';
const botonSecundario = 'text-gray-600 hover:text-gray-800 font-medium px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors';

const peticion = async (ruta, metodo, cuerpo) => {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Revisa los datos e inténtalo de nuevo.');
  return data;
};

const validarPassword = (password) => {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (!/[a-z]/.test(password)) return 'La contraseña debe contener al menos una letra minúscula.';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula.';
  if (!/\d/.test(password)) return 'La contraseña debe contener al menos un número.';
  if (!/[@$!%*?&]/.test(password)) return 'La contraseña debe contener al menos un carácter especial (@$!%*?&).';
  return '';
};

const formatearFecha = (valor) => {
  const fecha = valor ? new Date(valor) : null;
  return fecha && !Number.isNaN(fecha.getTime())
    ? fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
};

const Encabezado = ({ icono: Icono, titulo, descripcion, color = 'text-blue-600' }) => (
  <div className="flex items-start gap-2 mb-5">
    <Icono className={`${color} shrink-0 mt-1`} size={22} />
    <div>
      <h3 className="text-xl font-bold text-gray-800">{titulo}</h3>
      {descripcion && <p className="text-sm text-gray-500 mt-0.5">{descripcion}</p>}
    </div>
  </div>
);

const CampoPassword = ({ valor, onChange, placeholder, autoComplete }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input type={visible ? 'text' : 'password'} value={valor} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoComplete={autoComplete} className={`${campo} pr-11`} />
      <button type="button" onClick={() => setVisible(v => !v)}
        className="absolute right-0 top-1/2 -translate-y-1/2 min-h-11 min-w-11 flex items-center justify-center text-gray-400 hover:text-gray-700"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

// Se monta con key = nombre actual: al recargar el perfil, los campos toman los datos nuevos.
const DatosPersonales = ({ perfil, avisar, onGuardado }) => {
  const [nombre, setNombre] = useState(perfil.nombre || '');
  const [apellido, setApellido] = useState(perfil.apellido_paterno || '');
  const [guardando, setGuardando] = useState(false);
  const sinCambios = nombre.trim() === (perfil.nombre || '') && apellido.trim() === (perfil.apellido_paterno || '');

  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return avisar('error', 'Escribe tu nombre.');
    setGuardando(true);
    try {
      await peticion('/api/tutor/act/nombre', 'PUT', { nombre, apellido_paterno: apellido });
      avisar('exito', 'Tus datos se actualizaron correctamente.');
      await onGuardado();
    } catch (err) {
      avisar('error', err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={guardar} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-600 mb-1">Nombre(s)</span>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} maxLength={50} required className={campo} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-gray-600 mb-1">Apellido</span>
          <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} maxLength={50} className={campo} />
        </label>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={guardando || sinCambios} className={botonPrimario}>
          {guardando ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
};

export default function PerfilTutor({ perfil, errorPerfil, onRecargarPerfil, onLogout }) {
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [correo, setCorreo] = useState('');
  const [codigoCorreo, setCodigoCorreo] = useState('');
  const [tokenCorreo, setTokenCorreo] = useState('');
  const [passwordCorreo, setPasswordCorreo] = useState('');
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmacion, setPasswordConfirmacion] = useState('');
  const [guardandoPassword, setGuardandoPassword] = useState(false);

  const [confirmandoBaja, setConfirmandoBaja] = useState(false);
  const [passwordBaja, setPasswordBaja] = useState('');
  const [procesandoBaja, setProcesandoBaja] = useState(false);

  const avisar = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(actual => (actual.texto === texto ? { tipo: '', texto: '' } : actual)), 6000);
  };

  const cancelarCorreo = () => {
    setCorreo(''); setCodigoCorreo(''); setTokenCorreo(''); setPasswordCorreo('');
  };

  const enviarCodigo = async (e) => {
    e.preventDefault();
    if (!correo.trim()) return avisar('error', 'Escribe el nuevo correo.');
    setEnviandoCorreo(true);
    try {
      const data = await peticion('/api/tutor/act/correo/codigo', 'POST', { correo });
      setTokenCorreo(data.token_verificacion);
      avisar('exito', `Te enviamos un código a ${correo}. Revisa también la carpeta de spam.`);
    } catch (err) {
      avisar('error', err.message);
    } finally {
      setEnviandoCorreo(false);
    }
  };

  const confirmarCorreo = async (e) => {
    e.preventDefault();
    if (codigoCorreo.length !== 6) return avisar('error', 'Escribe el código de 6 dígitos.');
    if (!passwordCorreo) return avisar('error', 'Escribe tu contraseña actual para confirmar.');
    setEnviandoCorreo(true);
    try {
      await peticion('/api/tutor/act/correo', 'PUT', {
        correo, contrasena_actual: passwordCorreo, codigo: codigoCorreo, token_verificacion: tokenCorreo,
      });
      avisar('exito', 'Correo actualizado correctamente.');
      cancelarCorreo();
      await onRecargarPerfil();
    } catch (err) {
      avisar('error', err.message);
    } finally {
      setEnviandoCorreo(false);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    if (!passwordActual) return avisar('error', 'Escribe tu contraseña actual.');
    const problema = validarPassword(passwordNueva);
    if (problema) return avisar('error', problema);
    if (passwordNueva !== passwordConfirmacion) return avisar('error', 'Las contraseñas nuevas no coinciden.');
    setGuardandoPassword(true);
    try {
      await peticion('/api/tutor/act/password', 'PUT', { contrasena_actual: passwordActual, nueva_contrasena: passwordNueva });
      avisar('exito', 'Contraseña actualizada correctamente.');
      setPasswordActual(''); setPasswordNueva(''); setPasswordConfirmacion('');
    } catch (err) {
      avisar('error', err.message);
    } finally {
      setGuardandoPassword(false);
    }
  };

  const desactivarCuenta = async (e) => {
    e.preventDefault();
    if (!passwordBaja) return avisar('error', 'Escribe tu contraseña para confirmar.');
    setProcesandoBaja(true);
    try {
      await peticion('/api/tutor/eliminar', 'DELETE', { contrasena_actual: passwordBaja });
      onLogout();
    } catch (err) {
      avisar('error', err.message);
      setProcesandoBaja(false);
    }
  };

  if (!perfil) {
    return (
      <div className={`${tarjeta} max-w-3xl mx-auto flex flex-col items-center justify-center gap-3 h-48 text-sm`}>
        {errorPerfil ? (
          <>
            <p className="text-red-500">{errorPerfil}</p>
            <button type="button" onClick={onRecargarPerfil} className="text-blue-600 hover:underline font-medium flex items-center gap-1">
              <RefreshCw size={16} /> Reintentar
            </button>
          </>
        ) : (
          <p className="text-gray-400 flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Cargando perfil...</p>
        )}
      </div>
    );
  }

  const nombreCompleto = [perfil.nombre, perfil.apellido_paterno].filter(Boolean).join(' ');
  const iniciales = [perfil.nombre, perfil.apellido_paterno].filter(Boolean).map(p => p.trim()[0]).join('').toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {mensaje.texto && (
        <div role="status" className={`p-3 rounded-lg text-sm border flex items-center gap-2 ${
          mensaje.tipo === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
        }`}>
          {mensaje.tipo === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          {mensaje.texto}
        </div>
      )}

      {/* Resumen */}
      <div className={tarjeta}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold shrink-0">
            {iniciales || <User size={28} />}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-blue-900 break-words">{nombreCompleto}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1"><AtSign size={14} /> {perfil.usuario}</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <dt className="text-xs text-gray-500 flex items-center gap-1"><Mail size={14} /> Correo</dt>
            <dd className="font-semibold text-gray-800 break-all">{perfil.correo || 'Sin correo registrado'}</dd>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <dt className="text-xs text-gray-500 flex items-center gap-1"><CalendarDays size={14} /> Miembro desde</dt>
            <dd className="font-semibold text-gray-800">{formatearFecha(perfil.fecha_registro)}</dd>
          </div>
        </dl>
      </div>

      {/* Datos personales */}
      <div className={tarjeta}>
        <Encabezado icono={User} titulo="Datos personales" descripcion="Así te verán tus alumnos." />
        <DatosPersonales key={`${perfil.nombre}|${perfil.apellido_paterno}`} perfil={perfil} avisar={avisar} onGuardado={onRecargarPerfil} />
      </div>

      {/* Correo */}
      <div className={tarjeta}>
        <Encabezado icono={Mail} titulo="Correo electrónico"
          descripcion="Te enviaremos un código al correo nuevo; después confirma con tu contraseña actual." />
        <form onSubmit={tokenCorreo ? confirmarCorreo : enviarCodigo} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Nuevo correo</span>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} disabled={!!tokenCorreo}
              placeholder="nuevo@correo.com" autoComplete="email" className={campo} />
          </label>
          {tokenCorreo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-600 mb-1">Código de 6 dígitos</span>
                <input type="text" inputMode="numeric" maxLength={6} value={codigoCorreo}
                  onChange={e => setCodigoCorreo(e.target.value.replace(/\D/g, ''))} autoComplete="one-time-code" className={campo} />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-600 mb-1">Contraseña actual</span>
                <CampoPassword valor={passwordCorreo} onChange={setPasswordCorreo} autoComplete="current-password" />
              </label>
            </div>
          )}
          <div className="flex justify-end gap-2 flex-wrap">
            {tokenCorreo && <button type="button" onClick={cancelarCorreo} className={botonSecundario}>Usar otro correo</button>}
            <button type="submit" disabled={enviandoCorreo} className={botonPrimario}>
              {enviandoCorreo ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
              {tokenCorreo ? 'Confirmar correo' : 'Enviar código'}
            </button>
          </div>
        </form>
      </div>

      {/* Contraseña */}
      <div className={tarjeta}>
        <Encabezado icono={Lock} titulo="Contraseña"
          descripcion="Mínimo 8 caracteres, con mayúscula, minúscula, número y un carácter especial (@$!%*?&)." />
        <form onSubmit={cambiarPassword} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-600 mb-1">Contraseña actual</span>
            <CampoPassword valor={passwordActual} onChange={setPasswordActual} autoComplete="current-password" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">Nueva contraseña</span>
              <CampoPassword valor={passwordNueva} onChange={setPasswordNueva} autoComplete="new-password" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-600 mb-1">Confirmar nueva contraseña</span>
              <CampoPassword valor={passwordConfirmacion} onChange={setPasswordConfirmacion} autoComplete="new-password" />
            </label>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={guardandoPassword} className={botonPrimario}>
              {guardandoPassword ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
              Actualizar contraseña
            </button>
          </div>
        </form>
      </div>

      {/* Zona de peligro */}
      <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-200">
        <Encabezado icono={AlertTriangle} color="text-red-600" titulo="Desactivar cuenta"
          descripcion="Tus alumnos ya no podrán recibir ejercicios ni ser evaluados. Se cerrará tu sesión." />
        {confirmandoBaja ? (
          <form onSubmit={desactivarCuenta} className="space-y-3">
            <label className="block">
              <span className="block text-sm font-medium text-red-700 mb-1">Escribe tu contraseña para confirmar</span>
              <CampoPassword valor={passwordBaja} onChange={setPasswordBaja} autoComplete="current-password" />
            </label>
            <div className="flex justify-end gap-2 flex-wrap">
              <button type="button" onClick={() => { setConfirmandoBaja(false); setPasswordBaja(''); }} className={botonSecundario}>
                Cancelar
              </button>
              <button type="submit" disabled={procesandoBaja}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-lg flex items-center gap-2 disabled:opacity-60 transition-colors">
                {procesandoBaja && <Loader2 className="animate-spin" size={18} />}
                Sí, desactivar mi cuenta
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <button type="button" onClick={() => setConfirmandoBaja(true)}
              className="border border-red-300 text-red-600 hover:bg-red-100 font-bold px-5 py-3 rounded-lg transition-colors">
              Desactivar cuenta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
