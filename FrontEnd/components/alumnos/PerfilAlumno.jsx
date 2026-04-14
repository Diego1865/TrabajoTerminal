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

  // Función de validación de contraseña extraída de Registro.jsx
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
      mostrarMensaje('exito', 'Tus datos se actualizaron correctamente.');
      setFormData({ nombre: '', apellido_paterno: '', apellido_materno: '', grupo: '' });
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    
    // Validación local de formato antes de enviar al servidor
    const passwordError = validatePassword(passwordNueva);
    if (passwordError) {
      return mostrarMensaje('error', passwordError);
    }

    try {
      const res = await fetch(`${API_URL}/api/perfil/alumno/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ contrasena_actual: passwordActual, nueva_contrasena: passwordNueva })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al actualizar contraseña');
      mostrarMensaje('exito', 'Contraseña actualizada de forma segura.');
      setPasswordActual('');
      setPasswordNueva('');
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const inputClasses = "w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>

      {mensaje.texto && (
        <div className={`p-4 rounded-lg text-sm font-medium ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><User size={20}/> Actualizar Mis Datos</h3>
        <form onSubmit={handleActualizarInfo} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre(s)" 
            value={formData.nombre} 
            onChange={e => setFormData({...formData, nombre: e.target.value})} 
            required 
            className={inputClasses} 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Apellido Paterno" 
              value={formData.apellido_paterno} 
              onChange={e => setFormData({...formData, apellido_paterno: e.target.value})} 
              required 
              className={inputClasses} 
            />
            <input 
              type="text" 
              placeholder="Apellido Materno" 
              value={formData.apellido_materno} 
              onChange={e => setFormData({...formData, apellido_materno: e.target.value})} 
              className={inputClasses} 
            />
          </div>
          <input 
            type="text" 
            placeholder="Nuevo Grupo (Ej. A, B)" 
            value={formData.grupo} 
            onChange={e => setFormData({...formData, grupo: e.target.value})} 
            className={inputClasses} 
          />
          <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-bold">
            <Save size={18}/> Guardar Datos
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Lock size={20}/> Cambiar Contraseña</h3>
        <form onSubmit={handleActualizarPassword} className="space-y-4">
          <input 
            type="password" 
            placeholder="Contraseña Actual" 
            value={passwordActual} 
            onChange={e => setPasswordActual(e.target.value)} 
            required 
            className={inputClasses} 
          />
          <input 
            type="password" 
            placeholder="Nueva Contraseña" 
            value={passwordNueva} 
            onChange={e => setPasswordNueva(e.target.value)} 
            required 
            className={inputClasses} 
          />
          <button type="submit" className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 font-bold">
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}