'use client';
import { useState } from 'react';
import { Save, Lock, AlertTriangle, User, Trash2 } from 'lucide-react';

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

  // Función de validación de contraseña extraída de Registro.jsx
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
      mostrarMensaje('exito', 'Nombre actualizado correctamente. Los cambios se reflejarán en tu próximo inicio de sesión.');
      setNombre('');
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleActualizarCorreo = async (e) => {
    e.preventDefault();
    if(!passwordActualCorreo) return mostrarMensaje('error', 'Se requiere contraseña actual para cambiar el correo.');
    try {
      const res = await fetch(`${API_URL}/api/perfil/tutor/correo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ correo, contrasena_actual: passwordActualCorreo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al actualizar correo');
      mostrarMensaje('exito', 'Correo actualizado correctamente.');
      setCorreo('');
      setPasswordActualCorreo('');
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
      const res = await fetch(`${API_URL}/api/perfil/tutor/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ contrasena_actual: passwordActualClave, nueva_contrasena: passwordNueva })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al actualizar contraseña');
      mostrarMensaje('exito', 'Contraseña actualizada correctamente.');
      setPasswordActualClave('');
      setPasswordNueva('');
    } catch (err) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleBorrarCuenta = async () => {
    const pass = prompt('Para eliminar o desactivar su cuenta definitivamente, ingrese su contraseña actual:');
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

  const inputClasses = "w-full p-2.5 border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Perfil</h2>

      {mensaje.texto && (
        <div className={`p-4 rounded-lg text-sm font-medium ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Cambiar Nombre */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><User size={20}/> Cambiar Nombre de Tutor</h3>
        <form onSubmit={handleActualizarNombre} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Nuevo nombre completo" 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
            required 
            className={inputClasses} 
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2"><Save size={18}/> Guardar</button>
        </form>
      </div>

      {/* Cambiar Correo o Contraseña */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><Lock size={20}/> Seguridad y Acceso</h3>
        
        <div className="space-y-4 mb-6 pb-6 border-b">
          <p className="text-sm text-gray-500">Para cambiar tu correo electrónico, debes confirmar tu contraseña actual.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="email" 
              placeholder="Nuevo correo" 
              value={correo} 
              onChange={e => setCorreo(e.target.value)} 
              className={inputClasses} 
            />
            <input 
              type="password" 
              placeholder="Contraseña actual" 
              value={passwordActualCorreo} 
              onChange={e => setPasswordActualCorreo(e.target.value)} 
              className={inputClasses} 
            />
          </div>
          <button onClick={handleActualizarCorreo} className="bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 w-full md:w-auto">Actualizar Correo</button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">Cambiar contraseña de acceso.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input 
               type="password" 
               placeholder="Contraseña actual" 
               value={passwordActualClave} 
               onChange={e => setPasswordActualClave(e.target.value)} 
               className={inputClasses} 
             />
             <input 
               type="password" 
               placeholder="Nueva contraseña" 
               value={passwordNueva} 
               onChange={e => setPasswordNueva(e.target.value)} 
               className={inputClasses} 
             />
          </div>
          <button onClick={handleActualizarPassword} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 w-full md:w-auto">Actualizar Contraseña</button>
        </div>
      </div>

      {/* Zona de Peligro */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 mt-8">
        <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle size={20}/> Zona de Peligro</h3>
        <p className="text-sm text-red-600 mb-4">Una vez que elimines o desactives tu cuenta, tus alumnos ya no podrán recibir nuevos ejercicios ni ser evaluados.</p>
        <button onClick={handleBorrarCuenta} className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 flex items-center gap-2"><Trash2 size={18}/> Desactivar Cuenta</button>
      </div>
    </div>
  );
}