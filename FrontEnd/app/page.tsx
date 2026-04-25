'use client';
import { useState, useEffect } from 'react';
import CapturaEscritura from "@/components/CapturaEscritura";
import LienzoDigital from "@/components/LienzoDigital";
import Login from "@/components/Login";
import Registro from "@/components/Registro";
//import DashboardTutor from "@/components/DashboardTutor";
import MainTutor from "@/components/tutores/MainTutor";
import DashboardAlumno from "@/components/alumnos/DashboardAlumno";

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

  const handleLogout = () => {
    // Cambiar la clave eliminada a 'token'
    localStorage.removeItem('token');
    setTipoUsuario(null);
    setVistaActual('login');
  };

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodificarJwt(token);
      
      if (payload && payload.tipo_usuario) {
        // Extrae el tipo de usuario del token decodificado ('tutor' o 'alumno')
        setTipoUsuario(payload.tipo_usuario);
        setVistaActual('dashboard');
      } else {
        console.warn('Token inválido o sin tipo_usuario');
        handleLogout(); // Token inválido o sin tipo_usuario
      }
    }
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
    // Enrutamiento basado en el tipo de usuario
    
    if (tipoUsuario === 'tutor') {
      return <MainTutor onLogout={handleLogout} />;
    } else if (tipoUsuario === 'alumno') {
      return <DashboardAlumno onLogout={handleLogout} />;
    } else {
      console.warn('tipoUsuario inválido:', tipoUsuario);
      // Si no hay tipo_usuario válido, volver al login
      return (
        <Login 
          onLogin={handleLogin} 
          onNavigateRegister={() => setVistaActual('registro')} 
        />
      );
    }
  }

  return null;
}