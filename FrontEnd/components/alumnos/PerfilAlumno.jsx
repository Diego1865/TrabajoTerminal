'use client';
import { useState } from 'react';
import { Save, Lock, User } from 'lucide-react';

export default function PerfilAlumno() {
  const [formData, setFormData] = useState({ nombre: '', apellido_paterno: '', apellido_materno: '', grupo: '' });
  const [passwordActual, setPasswordActual] = useState('');
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

  const handleActualizarInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/perfil/alumno/info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Error al actualizar tu información');
      mostrarMensaje('exito', '¡Tus datos se actualizaron correctamente! 🎉');
      setFormData({ nombre: '', apellido_paterno: '', apellido_materno: '', grupo: '' });
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(passwordNueva);
    if (passwordError) return mostrarMensaje('error', passwordError);
    try {
      const res = await fetch(`${API_URL}/api/perfil/alumno/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ contrasena_actual: passwordActual, nueva_contrasena: passwordNueva })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al actualizar contraseña');
      mostrarMensaje('exito', '¡Contraseña actualizada de forma segura! 🔒');
      setPasswordActual('');
      setPasswordNueva('');
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const inputStyle = {
    border: '2.5px solid #DDD6FE',
    borderRadius: '14px',
    background: '#FAFAFA',
    padding: '12px 16px',
    width: '100%',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#1F2937',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const inputGreenStyle = {
    ...inputStyle,
    border: '2.5px solid #A7F3D0',
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .kids-input-p:focus { border-color: #8B5CF6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.18); }
        .kids-input-lock:focus { border-color: #10B981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.18); }
        .btn-save { transition: transform 0.1s, box-shadow 0.1s; }
        .btn-save:hover { transform: translateY(-2px); }
        .btn-save:active { transform: translateY(3px) !important; }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div style={{ fontSize: '2.2rem' }}>👤</div>
          <h2 className="font-black" style={{ fontSize: '1.8rem', color: '#1E3A5F' }}>Mi Perfil</h2>
        </div>

        {/* Mensaje de éxito o error */}
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

        {/* Sección: Actualizar datos */}
        <div className="bg-white p-6"
          style={{ borderRadius: '24px', border: '2.5px solid #DDD6FE', boxShadow: '0 6px 0 #DDD6FE' }}>

          <div className="flex items-center gap-2 mb-5">
            <div style={{ fontSize: '1.6rem' }}>✏️</div>
            <h3 className="font-black" style={{ fontSize: '1.2rem', color: '#6D28D9' }}>Actualizar Mis Datos</h3>
          </div>

          <form onSubmit={handleActualizarInfo} className="space-y-4">
            <div>
              <label className="block text-sm font-black mb-1.5" style={{ color: '#7C3AED' }}>😊 Nombre(s)</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="kids-input-p"
                style={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black mb-1.5" style={{ color: '#7C3AED' }}>Apellido Paterno</label>
                <input
                  type="text"
                  placeholder="Paterno"
                  value={formData.apellido_paterno}
                  onChange={e => setFormData({ ...formData, apellido_paterno: e.target.value })}
                  required
                  className="kids-input-p"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-1.5" style={{ color: '#7C3AED' }}>Apellido Materno</label>
                <input
                  type="text"
                  placeholder="Materno"
                  value={formData.apellido_materno}
                  onChange={e => setFormData({ ...formData, apellido_materno: e.target.value })}
                  className="kids-input-p"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black mb-1.5" style={{ color: '#7C3AED' }}>🏫 Grupo (Ej: A, B)</label>
              <input
                type="text"
                placeholder="Ej: A"
                value={formData.grupo}
                onChange={e => setFormData({ ...formData, grupo: e.target.value })}
                className="kids-input-p"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              className="btn-save w-full py-3.5 font-black text-lg text-white flex items-center justify-center gap-2"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                boxShadow: '0 5px 0 #4C1D95',
              }}>
              <Save size={18} /> Guardar Datos 💾
            </button>
          </form>
        </div>

        {/* Sección: Cambiar contraseña */}
        <div className="bg-white p-6"
          style={{ borderRadius: '24px', border: '2.5px solid #A7F3D0', boxShadow: '0 6px 0 #A7F3D0' }}>

          <div className="flex items-center gap-2 mb-5">
            <div style={{ fontSize: '1.6rem' }}>🔒</div>
            <h3 className="font-black" style={{ fontSize: '1.2rem', color: '#059669' }}>Cambiar Contraseña</h3>
          </div>

          <form onSubmit={handleActualizarPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-black mb-1.5" style={{ color: '#059669' }}>🔑 Contraseña Actual</label>
              <input
                type="password"
                placeholder="Tu contraseña actual"
                value={passwordActual}
                onChange={e => setPasswordActual(e.target.value)}
                required
                className="kids-input-lock"
                style={inputGreenStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-black mb-1.5" style={{ color: '#059669' }}>✨ Nueva Contraseña</label>
              <input
                type="password"
                placeholder="Tu nueva contraseña"
                value={passwordNueva}
                onChange={e => setPasswordNueva(e.target.value)}
                required
                className="kids-input-lock"
                style={inputGreenStyle}
              />
            </div>

            <button
              type="submit"
              className="btn-save w-full py-3.5 font-black text-lg text-white flex items-center justify-center gap-2"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                boxShadow: '0 5px 0 #065F46',
              }}>
              <Lock size={18} /> Actualizar Contraseña 🔐
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}