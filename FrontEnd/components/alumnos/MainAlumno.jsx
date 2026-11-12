'use client';
import { useState, useEffect } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import TabProximos      from './TabProximos';
import TabCompletados   from './TabCompletados';
import TabVencidos      from './TabVencidos';
import TabProgreso      from './TabProgreso';
import LienzoDigital    from './LienzoDigital';
import CapturaEscritura from './CapturaEscritura';
import PerfilAlumno     from './PerfilAlumno';

const TABS = [
  { id: 'proximos',    emoji: '📋', label: 'Próximos',    color: '#3B82F6', shadow: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'completados', emoji: '✅', label: 'Completados', color: '#10B981', shadow: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'vencidos',    emoji: '⏰', label: 'Vencidos',    color: '#F97316', shadow: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'progreso',    emoji: '📈', label: 'Mi Progreso', color: '#EC4899', shadow: '#9D174D', bg: '#FDF2F8', border: '#FBCFE8' },
  { id: 'perfil',      emoji: '👤', label: 'Perfil',      color: '#8B5CF6', shadow: '#4C1D95', bg: '#F5F3FF', border: '#DDD6FE' },
];

const decodificarJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const MainAlumno = ({ onLogout }) => {
  const [pestañaActiva,   setPestañaActiva]   = useState('proximos');
  const [idAlumno,        setIdAlumno]        = useState(null);
  const [nombreAlumno,    setNombreAlumno]    = useState('');
  const [modoVista,       setModoVista]       = useState('tabs');
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [tutorActivo,     setTutorActivo]     = useState(true);

  useEffect(() => {
    const verificarTutor = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/estado-tutor`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) { const d = await res.json(); setTutorActivo(d.tutor_activo); }
      } catch { /* silencioso */ }
    };
    verificarTutor();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { onLogout(); return; }
    const payload = decodificarJwt(token);
    if (!payload) { onLogout(); return; }
    if (payload.tipo_usuario !== 'alumno') { onLogout(); return; }
    setIdAlumno(payload.id_usuario);
    setNombreAlumno(payload.nombre || 'Alumno');
  }, [onLogout]);

  const handleRealizarEjercicio = (ejercicio) => {
    setEjercicioActivo(ejercicio);
    setModoVista('lienzo');
  };

  const handleTerminarEjercicio = () => {
    alert('¡Ejercicio completado con éxito!');
    setEjercicioActivo(null);
    setModoVista('tabs');
    setPestañaActiva('completados');
  };

  if (!idAlumno) return null;

  /* ══════════════════════════════════════════════
     VISTA DE RESOLUCIÓN DE EJERCICIO
  ══════════════════════════════════════════════ */
  if (modoVista !== 'tabs') {
    return (
      <div className="letra-escolar">

        <div className="min-h-screen flex flex-col items-center p-6 relative"
          style={{ background: 'linear-gradient(145deg, #F5F0FF 0%, #EFF6FF 60%, #F0FDF4 100%)' }}>

          {/* Botón volver */}
          <button
            onClick={() => { setModoVista('tabs'); setEjercicioActivo(null); }}
            aria-label="Volver" className="absolute top-5 left-5 flex items-center justify-center gap-2 font-bold min-h-11 min-w-11 px-3 sm:px-4 py-2 transition-all hover:scale-105"
            style={{ color: '#6D28D9', background: '#EDE9FE', borderRadius: '14px', border: '2px solid #DDD6FE' }}>
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Volver</span>
          </button>

          {/* Selector lienzo / cámara */}
          <div className="flex p-1.5 gap-1 mt-14 mb-6"
            style={{ background: '#EDE9FE', borderRadius: '20px', border: '2px solid #DDD6FE' }}>
            {[
              { mode: 'lienzo', label: '✏️ Escribir Aquí' },
              { mode: 'camara', label: '📷 Subir Foto'    },
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setModoVista(mode)}
                className="px-5 py-2.5 font-black transition-all text-sm"
                style={{
                  borderRadius: '14px',
                  background: modoVista === mode ? '#7C3AED' : 'transparent',
                  color:      modoVista === mode ? 'white'   : '#7C3AED',
                  boxShadow:  modoVista === mode ? '0 3px 0 #4C1D95' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Componente de ejercicio
              Se pasa el objeto ejercicioActivo completo para que
              LienzoDigital / CapturaEscritura muestren
              título, descripción, texto guía e imagen */}
          <div className="w-full max-w-2xl">
            {modoVista === 'camara' ? (
              <CapturaEscritura
                idEjercicioTutor={ejercicioActivo?.id_ejercicio_tutor}
                alTerminar={handleTerminarEjercicio}
                ejercicio={ejercicioActivo}                           // ← NUEVO
              />
            ) : (
              <LienzoDigital
                idEjercicioTutor={ejercicioActivo?.id_ejercicio_tutor}
                alTerminar={handleTerminarEjercicio}
                ejercicio={ejercicioActivo}                           // ← NUEVO
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     VISTA PRINCIPAL (TABS)
  ══════════════════════════════════════════════ */
  return (
    <div className="letra-escolar">
      <style>{`
        @keyframes wave { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(10deg)} }
        .wave-hand { display:inline-block; animation: wave 0.8s ease-in-out 3; }
        .tab-btn { transition: all 0.15s ease; }
        .tab-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div className="min-h-screen flex flex-col p-5 relative"
        style={{ background: 'linear-gradient(160deg, #FEFCE8 0%, #EFF6FF 50%, #F0FDF4 100%)' }}>

        {/* Encabezado: saludo y "Salir" en la misma fila, así un nombre largo no queda debajo del botón */}
        <div className="mb-5 mt-3 max-w-4xl mx-auto w-full flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-black break-words" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', color: '#1E3A5F', lineHeight: 1.2 }}>
              ¡Hola, <span style={{ color: '#7C3AED' }}>{nombreAlumno}</span>! <span className="wave-hand">👋</span>
            </h1>
            <p className="font-semibold text-gray-500 mt-0.5">¿Qué vamos a practicar hoy?</p>
          </div>
          <button
            onClick={onLogout}
            aria-label="Salir"
            className="shrink-0 flex items-center justify-center gap-2 font-bold min-h-11 min-w-11 px-3 sm:px-4 transition-all hover:scale-105"
            style={{ color: '#DC2626', background: '#FEF2F2', borderRadius: '14px', border: '2px solid #FECACA' }}>
            <LogOut size={18} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

        {/* Tabs: en celular, cuadrícula 3 + 2 (centrada) con el emoji arriba; desde sm, una sola fila. */}
        <div className="flex justify-center mb-7 w-full">
          <div className="grid grid-cols-6 gap-2 p-2 w-full max-w-md sm:flex sm:w-auto sm:max-w-full [&>*]:col-span-2 [&>*:nth-child(4)]:col-start-2"
            style={{
              background: 'rgba(255,255,255,0.7)', borderRadius: '22px',
              border: '2px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
            {TABS.map((tab) => {
              const isActive = pestañaActiva === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPestañaActiva(tab.id)}
                  aria-pressed={isActive}
                  className="tab-btn min-w-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-4 py-2 sm:py-2.5 font-black text-xs sm:text-sm whitespace-nowrap"
                  style={{
                    borderRadius: '15px',
                    background: isActive ? tab.color : 'transparent',
                    color:      isActive ? 'white'   : tab.color,
                    boxShadow:  isActive ? `0 4px 0 ${tab.shadow}` : 'none',
                    border:     isActive ? 'none'    : `2px solid ${tab.border}`,
                    transform:  isActive ? 'translateY(-2px)' : 'none',
                  }}>
                  <span aria-hidden="true" className="text-lg sm:text-sm leading-none">{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido por tab */}
        <div className="w-full max-w-4xl mx-auto">
          {pestañaActiva === 'perfil' ? (
            <PerfilAlumno />
          ) : pestañaActiva === 'progreso' ? (
            <TabProgreso idAlumno={idAlumno} />
          ) : !tutorActivo ? (
            <div className="p-8 text-center mt-6"
              style={{ background: '#FFF7ED', border: '3px solid #FED7AA', borderRadius: '24px' }}>
              <div style={{ fontSize: '4rem' }} className="mb-4">😔</div>
              <h2 className="font-black mb-2" style={{ fontSize: '1.5rem', color: '#C2410C' }}>
                Plataforma No Disponible
              </h2>
              <p className="font-semibold" style={{ color: '#EA580C' }}>
                Tu profesor ya no está activo en la plataforma. Contacta a tu escuela para ser reasignado.
              </p>
            </div>
          ) : (
            <>
              {pestañaActiva === 'proximos'    && <TabProximos    idAlumno={idAlumno} onRealizar={handleRealizarEjercicio} />}
              {pestañaActiva === 'completados' && <TabCompletados idAlumno={idAlumno} />}
              {pestañaActiva === 'vencidos'    && <TabVencidos    idAlumno={idAlumno} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainAlumno;