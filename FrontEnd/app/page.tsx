'use client';
import { useState, useEffect } from 'react';
import CapturaEscritura from "@/components/CapturaEscritura";
import LienzoDigital from "@/components/LienzoDigital";
import Login from "@/components/Login";
import Registro from "@/components/Registro";
//import DashboardTutor from "@/components/DashboardTutor";
import MainTutor from "@/components/tutores/MainTutor";
import DashboardAlumno from "@/components/alumnos/DashboardAlumno";
import { LogOut } from 'lucide-react';

// --- Componente Principal (Dashboard Alumno) ---
const MainApp = ({ onLogout }: { onLogout: () => void }) => {
  const [modo, setModo] = useState('lienzo');

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
      <button 
        onClick={onLogout}
        className="absolute top-6 right-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>

      <h1 className="text-3xl font-bold text-blue-800 mb-2 mt-8">
        Aprende a Escribir
      </h1>
      <p className="text-gray-600 mb-8">Práctica para 3º y 4º de Primaria</p>

      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-blue-100 mb-8">
        <button
          onClick={() => setModo('lienzo')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${modo === 'lienzo' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Escribir Aquí
        </button>
        <button
          onClick={() => setModo('camara')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${modo === 'camara' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Subir Foto
        </button>
      </div>

      <div className="w-full max-w-2xl">
        {modo === 'camara' ? (
          <CapturaEscritura />
        ) : (
          <LienzoDigital alTerminar={(img: string) => console.log("Imagen recibida:", img)} />
        )}
      </div>
    </main>
  );
};

const decodificarJwt = (token: string) => {
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

// --- Enrutador Principal ---
export default function App() {
  const [vistaActual, setVistaActual] = useState('login'); // 'login', 'registro', 'dashboard'
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null); // 'tutor' o 'alumno'

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodificarJwt(token);
      if (payload && payload.tipo_usuario) {
        // Extrae el rol del token decodificado
        setTipoUsuario(payload.tipo_usuario);
        setVistaActual('dashboard');
      } else {
        handleLogout(); // Token inválido o sin rol
      }
    }
  };

  const handleLogout = () => {
    // Cambiar la clave eliminada a 'token'
    localStorage.removeItem('token');
    setTipoUsuario(null);
    setVistaActual('login');
  };

  // Verificar sesión activa al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      handleLogin();
    }
  }, []);

  if (vistaActual === 'login') {
    return (
      <Login 
        onLogin={handleLogin} 
        onNavigateRegister={() => setVistaActual('registro')} 
      />
    );
  }

  if (vistaActual === 'registro') {
    return (
      <Registro 
        onRegister={() => setVistaActual('login')} 
        onNavigateLogin={() => setVistaActual('login')} 
      />
    );
  }

  if (vistaActual === 'dashboard') {
    // Si el tipo de usuario es tutor, muestra el panel del profesor
    if (tipoUsuario === 'tutor') {
      return <MainTutor onLogout={handleLogout} />;
    }
    // De lo contrario, muestra el lienzo de dibujo para el alumno
    //return <MainApp onLogout={handleLogout} />;
    return <DashboardAlumno onLogout={handleLogout} />;
  }

  return null;
}