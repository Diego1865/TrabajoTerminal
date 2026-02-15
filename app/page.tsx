'use client';
import { useState } from 'react';
import CapturaEscritura from "@/components/CapturaEscritura";
import LienzoDigital from "@/components/LienzoDigital";

export default function Home() {
  const [modo, setModo] = useState('camara'); // 'camara' o 'lienzo'

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">
        Aprende a Escribir
      </h1>
      <p className="text-gray-600 mb-8">Práctica para 3º y 4º de Primaria</p>

      {/* Selector de Modo */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-blue-100 mb-8">
        <button
          onClick={() => setModo('camara')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${modo === 'camara' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Subir Foto
        </button>
        <button
          onClick={() => setModo('lienzo')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${modo === 'lienzo' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Escribir Aquí
        </button>
      </div>

      {/* Renderizado Condicional */}
      <div className="w-full max-w-2xl">
        {modo === 'camara' ? (
          <CapturaEscritura />
        ) : (
          <LienzoDigital alTerminar={(img) => console.log("Imagen recibida:", img)} />
        )}
      </div>
      
    </main>
  );
}