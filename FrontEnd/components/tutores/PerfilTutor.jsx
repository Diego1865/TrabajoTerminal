'use client';
import { useState } from 'react';
import { Save, Lock, User, Trash2 } from 'lucide-react';

export default function PerfilTutor({ onLogout }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [passwordActualCorreo, setPasswordActualCorreo] = useState('');
  const [passwordActualClave, setPasswordActualClave] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const token = localStorage.getItem('token');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/(?=.*[a-z])/.test(password)) return "La contraseña debe contener al menos una letra minúscula.";
    if (!/(?=.*[A-Z])/.test(password)) return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/(?=.*\d)/.test(password)) return "La contraseña debe contener al menos un número.";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "La contraseña debe contener al menos un carácter especial (@$!%*?&).";
    return "";
  };

  const handleActualizarNombre = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/perfil/tutor/nombre`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nombre })
      });
      if (!res.ok) throw new Error('Error al actualizar nombre');
      mostrarMensaje('exito', 'Nombre actualizado. Los cambios se verán en tu próximo inicio de sesión. 🎉');
      setNombre('');
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleActualizarCorreo = async (e) => {
    e.preventDefault();
    if (!passwordActualCorreo) return mostrarMensaje('error', 'Se requiere contraseña actual para cambiar el correo.');
    try {
      const res = await fetch(`${API_URL}/api/perfil/tutor/correo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ correo, contrasena_actual: passwordActualCorreo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al actualizar correo');
      mostrarMensaje('exito', '📧 Correo actualizado correctamente.');
      setCorreo(''); setPasswordActualCorreo('');
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(passwordNueva);
    if (passwordError) return mostrarMensaje('error', passwordError);
    try {
      const res = await fetch(`${API_URL}/api/perfil/tutor/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ contrasena_actual: passwordActualClave, nueva_contrasena: passwordNueva })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al actualizar contraseña');
      mostrarMensaje('exito', '🔒 Contraseña actualizada correctamente.');
      setPasswordActualClave(''); setPasswordNueva('');
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleBorrarCuenta = async () => {
    const pass = prompt('Para desactivar tu cuenta, ingresa tu contraseña actual:');
    if (!pass) return;
    try {
      const res = await fetch(`${API_URL}/api/perfil/tutor/cuenta`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ contrasena_actual: pass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al borrar cuenta');
      alert('Tu cuenta ha sido desactivada. Se cerrará la sesión.');
      onLogout();
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const inputStyle = (borderColor = '#DDD6FE') => ({
    border: `2.5px solid ${borderColor}`,
    borderRadius: '14px',
    background: '#FAFAFA',
    padding: '12px 16px',
    width: '100%',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#1F2937',
    outline: 'none',
  });

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .tutor-input:focus { border-color: #8B5CF6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.18); }
        .tutor-input-blue:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.18); }
        .btn-kids-t { transition: transform 0.1s, box-shadow 0.1s; }
        .btn-kids-t:hover { transform: translateY(-2px); }
        .btn-kids-t:active { transform: translateY(3px) !important; }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span style={{ fontSize: '2.2rem' }}>⚙️</span>
          <h2 className="font-black" style={{ fontSize: '1.8rem', color: '#1E3A5F' }}>Configuración de Perfil</h2>
        </div>

        {/* Mensaje */}
        {mensaje.texto && (
          <div className="p-4 font-bold text-sm flex items-center gap-2"
            style={{
              background: mensaje.tipo === 'error' ? '#FFF0F0' : '#ECFDF5',
              border: `2px solid ${mensaje.tipo === 'error' ? '#FCA5A5' : '#A7F3D0'}`,
              borderRadius: '16px',
              color: mensaje.tipo === 'error' ? '#DC2626' : '#059669',
            }}>
            {mensaje.tipo === 'error' ? '😅' : '🎉'} {mensaje.texto}
          </div>
        )}

        {/* Cambiar Nombre */}
        <div className="bg-white p-6"
          style={{ borderRadius: '24px', border: '2.5px solid #BFDBFE', boxShadow: '0 6px 0 #BFDBFE' }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: '1.4rem' }}>👤</span>
            <h3 className="font-black" style={{ fontSize: '1.1rem', color: '#1D4ED8' }}>Cambiar Nombre de Tutor</h3>
          </div>
          <form onSubmit={handleActualizarNombre} className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Nuevo nombre completo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="tutor-input-blue flex-1 min-w-0"
              style={inputStyle('#BFDBFE')}
            />
            <button type="submit"
              className="btn-kids-t flex items-center gap-2 font-black text-white px-5 py-3"
              style={{ borderRadius: '14px', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', boxShadow: '0 4px 0 #1E40AF', whiteSpace: 'nowrap' }}>
              <Save size={16} /> Guardar
            </button>
          </form>
        </div>

        {/* Seguridad y Acceso */}
        <div className="bg-white p-6"
          style={{ borderRadius: '24px', border: '2.5px solid #DDD6FE', boxShadow: '0 6px 0 #DDD6FE' }}>
          <div className="flex items-center gap-2 mb-5">
            <span style={{ fontSize: '1.4rem' }}>🔐</span>
            <h3 className="font-black" style={{ fontSize: '1.1rem', color: '#6D28D9' }}>Seguridad y Acceso</h3>
          </div>

          {/* Cambiar correo */}
          <div className="mb-6 pb-6" style={{ borderBottom: '2px dashed #EDE9FE' }}>
            <p className="font-semibold text-gray-400 text-sm mb-3">
              📧 Para cambiar tu correo electrónico, confirma tu contraseña actual.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input type="email" placeholder="Nuevo correo" value={correo}
                onChange={e => setCorreo(e.target.value)}
                className="tutor-input" style={inputStyle()} />
              <input type="password" placeholder="Contraseña actual" value={passwordActualCorreo}
                onChange={e => setPasswordActualCorreo(e.target.value)}
                className="tutor-input" style={inputStyle()} />
            </div>
            <button onClick={handleActualizarCorreo}
              className="btn-kids-t font-black text-white px-5 py-3"
              style={{ borderRadius: '14px', background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', boxShadow: '0 4px 0 #4C1D95' }}>
              📧 Actualizar Correo
            </button>
          </div>

          {/* Cambiar contraseña */}
          <div>
            <p className="font-semibold text-gray-400 text-sm mb-3">🔑 Cambiar contraseña de acceso.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input type="password" placeholder="Contraseña actual" value={passwordActualClave}
                onChange={e => setPasswordActualClave(e.target.value)}
                className="tutor-input" style={inputStyle()} />
              <input type="password" placeholder="Nueva contraseña" value={passwordNueva}
                onChange={e => setPasswordNueva(e.target.value)}
                className="tutor-input" style={inputStyle()} />
            </div>
            <button onClick={handleActualizarPassword}
              className="btn-kids-t font-black text-white px-5 py-3"
              style={{ borderRadius: '14px', background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', boxShadow: '0 4px 0 #4C1D95' }}>
              🔒 Actualizar Contraseña
            </button>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className="p-6"
          style={{ borderRadius: '24px', background: '#FFF7ED', border: '2.5px solid #FED7AA', boxShadow: '0 6px 0 #FED7AA' }}>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <h3 className="font-black" style={{ fontSize: '1.1rem', color: '#C2410C' }}>Zona de Peligro</h3>
          </div>
          <p className="font-semibold text-sm mb-4" style={{ color: '#EA580C' }}>
            Al desactivar tu cuenta, tus alumnos no podrán recibir nuevos ejercicios ni ser evaluados.
          </p>
          <button onClick={handleBorrarCuenta}
            className="btn-kids-t flex items-center gap-2 font-black text-white px-5 py-3"
            style={{ borderRadius: '14px', background: 'linear-gradient(135deg, #F87171, #EF4444)', boxShadow: '0 4px 0 #B91C1C' }}>
            <Trash2 size={16} /> Desactivar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}