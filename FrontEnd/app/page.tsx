'use client';

/*
 * Representa la pagina principal del Frontend.
 */

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Login from "@/components/Login";
import Registro from "@/components/Registro";
import RecuperarPassword from "@/components/RecuperarPassword";
import MainTutor from "@/components/tutores/MainTutor";
import MainAlumno from "@/components/alumnos/MainAlumno";
import AvisoDePrivacidad from "@/components/Aviso";

type Sesion = {
  id_usuario: number;
  tipo_usuario: 'alumno' | 'tutor';
  nombre?: string;
};

const EVENTO_SESION = 'grafia:sesion';
const leerToken = () => localStorage.getItem('token');
const leerTokenServidor = () => null;
const notificarSesion = () => window.dispatchEvent(new Event(EVENTO_SESION));

function suscribirSesion(notificar: () => void) {
  window.addEventListener(EVENTO_SESION, notificar);
  return () => window.removeEventListener(EVENTO_SESION, notificar);
}

// El payload orienta la navegación. La API valida el JWT en cada solicitud protegida.
function decodificarSesion(token: string): Sesion | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const { id_usuario, tipo_usuario, nombre } = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (typeof id_usuario !== 'number' || (tipo_usuario !== 'alumno' && tipo_usuario !== 'tutor')) return null;
    return { id_usuario, tipo_usuario, nombre: typeof nombre === 'string' ? nombre : undefined };
  } catch {
    return null;
  }
}

export default function App() {
  const [vistaActual, setVistaActual] = useState('login');
  const token = useSyncExternalStore(suscribirSesion, leerToken, leerTokenServidor);
  const sesion = useMemo(() => token ? decodificarSesion(token) : null, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setVistaActual('login');
    notificarSesion();
  };

  useEffect(() => {
    if (token && !sesion) {
      localStorage.removeItem('token');
      notificarSesion();
    }
  }, [token, sesion]);

  if (sesion?.tipo_usuario === 'tutor') {
    return <MainTutor key={sesion.id_usuario} sesion={sesion} onLogout={handleLogout} />;
  }

  if (sesion?.tipo_usuario === 'alumno') {
    return <MainAlumno key={sesion.id_usuario} sesion={sesion} onLogout={handleLogout} />;
  }

  if (vistaActual === 'recuperar') {
    return <RecuperarPassword onNavigateLogin={() => setVistaActual('login')} />;
  }

  if (vistaActual === 'aviso') {
    return <AvisoDePrivacidad onNavigateBack={() => setVistaActual('registro')} />;
  }

  if (vistaActual === 'registro') {
  return (
    <Registro 
      onRegister={() => setVistaActual('login')} 
      onNavigateLogin={() => setVistaActual('login')} 
      onNavigateAviso={() => setVistaActual('aviso')} 
      />
    );
  }

  return (
    <Login
      onLogin={notificarSesion}
      onNavigateRegister={() => setVistaActual('registro')}
      onNavigateRecuperar={() => setVistaActual('recuperar')}
    />
  );
}
