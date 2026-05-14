'use client';
import { useState, useEffect } from 'react';
import { LogOut, ArrowLeft, AlertTriangle } from 'lucide-react';
import TabProximos from './TabProximos';
import TabCompletados from './TabCompletados';
import TabVencidos from './TabVencidos';
import LienzoDigital from './LienzoDigital';
import CapturaEscritura from './CapturaEscritura';
import PerfilAlumno from './PerfilAlumno';

const TABS = [
  { id: 'proximos',    label: '📋 Próximos',    color: '#3B82F6', shadow: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'completados', label: '✅ Completados',  color: '#10B981', shadow: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'vencidos',    label: '⏰ Vencidos',    color: '#F97316', shadow: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'perfil',      label: '👤 Perfil',       color: '#8B5CF6', shadow: '#4C1D95', bg: '#F5F3FF', border: '#DDD6FE' },
];

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

const MainAlumno = ({ onLogout }) => {
  const [pestañaActiva, setPestañaActiva] = useState('proximos');
  const [idAlumno, setIdAlumno] = useState(null);
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [modoVista, setModoVista] = useState('tabs');
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [tutorActivo, setTutorActivo] = useState(true);

  useEffect(() => {
    const verificarTutor = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/estado-tutor`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTutorActivo(data.tutor_activo);
        }
      } catch (err) {
        console.error("No se pudo verificar el estado del tutor");
      }
    };
    verificarTutor();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodificarJwt(token);
      if (payload) {
        if (payload.tipo_usuario !== 'alumno') {
          console.warn('Acceso denegado: usuario no es alumno.');
          onLogout();
          return;
        }
        setIdAlumno(payload.id_usuario);
        setNombreAlumno(payload.nombre || 'Alumno');
        setTipoUsuario(payload.tipo_usuario);
      } else {
        onLogout();
      }
    } else {
      onLogout();
    }
  }, [onLogout]);

  const handleRealizarEjercicio = (ejercicio) => {
    setEjercicioActivo(ejercicio);
    setModoVista('lienzo');
  };

  const handleTerminarEjercicio = (img) => {
    alert("¡Ejercicio completado con éxito!");
    setEjercicioActivo(null);
    setModoVista('tabs');
    setPestañaActiva('completados');
  };

  if (!idAlumno) return null;

  // Vista de resolución de ejercicio
  if (modoVista !== 'tabs') {
    return (
      <div style={{ fontFamily: "'Nunito', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
        <div className="min-h-screen flex flex-col items-center p-6 relative"
          style={{ background: 'linear-gradient(145deg, #F5F0FF 0%, #EFF6FF 60%, #F0FDF4 100%)' }}>

          <button
            onClick={() => setModoVista('tabs')}
            className="absolute top-5 left-5 flex items-center gap-2 font-bold px-4 py-2 transition-all hover:scale-105"
            style={{ color: '#6D28D9', background: '#EDE9FE', borderRadius: '14px', border: '2px solid #DDD6FE' }}>
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Volver</span>
          </button>

          <h1 className="font-black text-center mt-14 mb-1" style={{ fontSize: '1.8rem', color: '#4C1D95' }}>
            {ejercicioActivo?.titulo}
          </h1>
          <p className="text-gray-500 font-semibold mb-6 text-center max-w-2xl text-sm">
            {ejercicioActivo?.descripcion}
          </p>

          {/* Selector de modo */}
          <div className="flex p-1.5 gap-1 mb-6"
            style={{ background: '#EDE9FE', borderRadius: '20px', border: '2px solid #DDD6FE' }}>
            {[
              { mode: 'lienzo', label: '✏️ Escribir Aquí' },
              { mode: 'camara', label: '📷 Subir Foto' }
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setModoVista(mode)}
                className="px-5 py-2.5 font-black transition-all text-sm"
                style={{
                  borderRadius: '14px',
                  background: modoVista === mode ? '#7C3AED' : 'transparent',
                  color: modoVista === mode ? 'white' : '#7C3AED',
                  boxShadow: modoVista === mode ? '0 3px 0 #4C1D95' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>

          <div className="w-full max-w-2xl">
            {modoVista === 'camara' ? (
              <CapturaEscritura idEjercicioTutor={ejercicioActivo?.id_ejercicio_tutor} alTerminar={handleTerminarEjercicio} />
            ) : (
              <LienzoDigital alTerminar={handleTerminarEjercicio} idEjercicioTutor={ejercicioActivo?.id_ejercicio_tutor} />
            )}
          </div>
        </div>
      </div>
    );
  }

  const tabActual = TABS.find(t => t.id === pestañaActiva);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes wave { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(10deg)} }
        .wave-hand { display:inline-block; animation: wave 0.8s ease-in-out 3; }
        .tab-btn { transition: all 0.15s ease; }
        .tab-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div className="min-h-screen flex flex-col p-5 relative"
        style={{ background: 'linear-gradient(160deg, #FEFCE8 0%, #EFF6FF 50%, #F0FDF4 100%)' }}>

        {/* Botón cerrar sesión */}
        <button
          onClick={onLogout}
          className="absolute top-5 right-5 flex items-center gap-2 font-bold px-4 py-2 transition-all hover:scale-105"
          style={{ color: '#DC2626', background: '#FEF2F2', borderRadius: '14px', border: '2px solid #FECACA' }}>
          <LogOut size={18} />
          <span className="hidden sm:inline">Salir</span>
        </button>

        {/* Encabezado de bienvenida */}
        <div className="mb-5 mt-3 max-w-4xl mx-auto w-full">
          <h1 className="font-black" style={{ fontSize: '2rem', color: '#1E3A5F' }}>
            ¡Hola, <span style={{ color: '#7C3AED' }}>{nombreAlumno}</span>! <span className="wave-hand">👋</span>
          </h1>
          <p className="font-semibold text-gray-500 mt-0.5">¿Qué vamos a practicar hoy?</p>
        </div>

        {/* Tabs coloridas */}
        <div className="flex justify-center mb-7 px-2 w-full">
          <div className="flex gap-2 p-2 overflow-x-auto max-w-full"
            style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '22px', border: '2px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', scrollbarWidth: 'none' }}>
            {TABS.map((tab) => {
              const isActive = pestañaActiva === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPestañaActiva(tab.id)}
                  className="tab-btn px-4 py-2.5 font-black text-sm whitespace-nowrap"
                  style={{
                    borderRadius: '15px',
                    background: isActive ? tab.color : 'transparent',
                    color: isActive ? 'white' : tab.color,
                    boxShadow: isActive ? `0 4px 0 ${tab.shadow}` : 'none',
                    border: isActive ? 'none' : `2px solid ${tab.border}`,
                    transform: isActive ? 'translateY(-2px)' : 'none',
                  }}>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido */}
        <div className="w-full max-w-4xl mx-auto">
          {pestañaActiva === 'perfil' ? (
            <PerfilAlumno />
          ) : !tutorActivo ? (
            <div className="p-8 text-center mt-6"
              style={{ background: '#FFF7ED', border: '3px solid #FED7AA', borderRadius: '24px' }}>
              <div style={{ fontSize: '4rem' }} className="mb-4">😔</div>
              <h2 className="font-black mb-2" style={{ fontSize: '1.5rem', color: '#C2410C' }}>Plataforma No Disponible</h2>
              <p className="font-semibold" style={{ color: '#EA580C' }}>
                Tu profesor ya no está activo en la plataforma. Contacta a tu escuela para ser reasignado.
              </p>
            </div>
          ) : (
            <>
              {pestañaActiva === 'proximos'    && <TabProximos idAlumno={idAlumno} onRealizar={handleRealizarEjercicio} />}
              {pestañaActiva === 'completados' && <TabCompletados idAlumno={idAlumno} />}
              {pestañaActiva === 'vencidos'    && <TabVencidos idAlumno={idAlumno} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainAlumno;