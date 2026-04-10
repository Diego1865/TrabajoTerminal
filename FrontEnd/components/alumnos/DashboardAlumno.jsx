'use client';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import TabProximos from './TabProximos';
import TabCompletados from './TabCompletados';
import TabVencidos from './TabVencidos';

const TABS = [
  { id: 'proximos',    label: 'Próximos' },
  { id: 'completados', label: 'Completados' },
  { id: 'vencidos',    label: 'Vencidos' },
];

const DashboardAlumno = ({ onLogout }) => {
  const [pestañaActiva, setPestañaActiva] = useState('proximos');

  const getAlumnoId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id_usuario;
  };

  const idAlumno = getAlumnoId();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 relative">

      {/* Cerrar sesión */}
      <button
        onClick={onLogout}
        className="absolute top-6 right-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>

      {/* Tabs */}
      <div className="flex justify-center mb-10 mt-4">
        <div className="flex bg-gray-200 p-1 rounded-full shadow-inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPestañaActiva(tab.id)}
              className={`px-8 py-2 rounded-full font-medium transition-all ${
                pestañaActiva === tab.id
                  ? 'bg-blue-400 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="w-full max-w-4xl mx-auto">
        {pestañaActiva === 'proximos'    && <TabProximos    idAlumno={idAlumno} />}
        {pestañaActiva === 'completados' && <TabCompletados idAlumno={idAlumno} />}
        {pestañaActiva === 'vencidos'    && <TabVencidos    idAlumno={idAlumno} />}
      </div>

    </div>
  );
};

export default DashboardAlumno;