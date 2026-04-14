'use client';
import { useState, useEffect } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import TabProximos from './TabProximos';
import TabCompletados from './TabCompletados';
import TabVencidos from './TabVencidos';
import LienzoDigital from '../LienzoDigital';
import CapturaEscritura from '../CapturaEscritura';
import PerfilAlumno from './PerfilAlumno';
import { AlertTriangle } from 'lucide-react';

const TABS = [
  { id: 'proximos',    label: 'Próximos' },
  { id: 'completados', label: 'Completados' },
  { id: 'vencidos',    label: 'Vencidos' },
  { id: 'perfil',      label: 'Mi perfil' },
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

const DashboardAlumno = ({ onLogout }) => {
  const [pestañaActiva, setPestañaActiva] = useState('proximos');
  const [idAlumno, setIdAlumno] = useState(null);
  const [nombreAlumno, setNombreAlumno] = useState('');
  
  // Estados para manejar el flujo del ejercicio
  const [modoVista, setModoVista] = useState('tabs'); // 'tabs', 'lienzo', 'camara'
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [tutorActivo, setTutorActivo] = useState(true);

  // Agregar este useEffect junto a los otros
  useEffect(() => {
    const verificarTutor = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/perfil/alumno/estado-tutor`, {
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
        setIdAlumno(payload.id_usuario);
        setNombreAlumno(payload.nombre || 'Alumno');
      }
    }
  }, []);

  const handleRealizarEjercicio = (ejercicio) => {
    setEjercicioActivo(ejercicio);
    setModoVista('lienzo'); // Por defecto abre el lienzo digital
  };

  const handleTerminarEjercicio = (img) => {
    // Aquí posteriormente se implementará la llamada a la API para guardar el intento
    console.log("Imagen generada del ejercicio:", img);
    alert("¡Ejercicio completado con éxito!");
    
    // Regresar a la vista principal
    setEjercicioActivo(null);
    setModoVista('tabs');
    setPestañaActiva('completados');
  };

  if (!idAlumno) return null;

  // Renderizado de la vista de resolución de ejercicio
  if (modoVista !== 'tabs') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
        <button
          onClick={() => setModoVista('tabs')}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Volver</span>
        </button>

        <h1 className="text-3xl font-bold text-blue-800 mb-2 mt-8 text-center">
          {ejercicioActivo?.titulo}
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-2xl">
          {ejercicioActivo?.descripcion}
        </p>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-blue-100 mb-8">
          <button
            onClick={() => setModoVista('lienzo')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${modoVista === 'lienzo' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Escribir Aquí
          </button>
          <button
            onClick={() => setModoVista('camara')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${modoVista === 'camara' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Subir Foto
          </button>
        </div>

        <div className="w-full max-w-2xl">
          {modoVista === 'camara' ? (
            <CapturaEscritura />
          ) : (
            <LienzoDigital alTerminar={handleTerminarEjercicio} />
          )}
        </div>
      </div>
    );
  }

  // Renderizado del Dashboard principal
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 relative">
      <button
        onClick={onLogout}
        className="absolute top-6 right-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>

      <div className="mb-2 mt-4 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          Hola, <span className="text-blue-600">{nombreAlumno}</span>
        </h1>
      </div>

      <div className="flex justify-center mb-8 mt-4">
        <div className="flex bg-gray-200 p-1 rounded-full shadow-inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPestañaActiva(tab.id)}
              className={`px-8 py-2 rounded-full font-medium transition-all ${
                pestañaActiva === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {pestañaActiva === 'perfil' ? (
          <PerfilAlumno />
        ) : !tutorActivo ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center mt-10">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Plataforma No Disponible</h2>
            <p className="text-red-600 text-lg">
              Tu profesor actual ya no se encuentra activo en la plataforma. 
              Por el momento no puedes realizar ejercicios ni ser evaluado. Contacta a tu escuela para ser reasignado.
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
  );
};

export default DashboardAlumno;