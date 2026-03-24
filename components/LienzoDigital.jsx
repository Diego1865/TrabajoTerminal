'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Eraser, Pen, RotateCcw, CheckCircle, Trash2 } from 'lucide-react';

const ReactSketchCanvas = dynamic(
  () => import('react-sketch-canvas').then((mod) => mod.ReactSketchCanvas),
  { ssr: false }
);

const LienzoDigital = ({ alTerminar }) => {
  const canvasRef = useRef(null);
  const [esBorrador, setEsBorrador] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setListo(true);
  }, []);

  const exportarDibujo = async () => {
    try {
      const imagenDataUrl = await canvasRef.current.exportImage('png');
      if (alTerminar) alTerminar(imagenDataUrl);
    } catch (e) {
      console.error("Error al exportar", e);
    }
  };

  const GROSOR_LAPIZ = 4;
  const GROSOR_GOMA = 30;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      
      {/* Barra de Herramientas */}
      <div className="flex gap-4 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200 z-10">
        <button
          onClick={() => { setEsBorrador(false); canvasRef.current.eraseMode(false); }}
          className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${!esBorrador ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`}
        >
          <Pen size={20} />
          <span className="text-xs">Escribir</span>
        </button>

        <button
          onClick={() => { setEsBorrador(true); canvasRef.current.eraseMode(true); }}
          className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${esBorrador ? 'bg-pink-100 text-pink-700 font-bold' : 'hover:bg-gray-100'}`}
        >
          <Eraser size={20} />
          <span className="text-xs">Borrar</span>
        </button>

        <div className="w-px bg-gray-300 mx-2"></div>

        <button
          onClick={() => canvasRef.current.undo()}
          className="p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-gray-100 text-gray-600"
        >
          <RotateCcw size={20} />
          <span className="text-xs">Deshacer</span>
        </button>

        <button
          onClick={() => canvasRef.current.clearCanvas()}
          className="p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-red-50 text-red-500"
        >
          <Trash2 size={20} />
          <span className="text-xs">Limpiar</span>
        </button>
      </div>

      {/* Área de dibujo */}
      <div 
        className="w-full h-80 relative bg-white rounded-xl shadow-inner border-4 border-gray-300 overflow-hidden"
        style={{ 
          backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', 
          backgroundSize: '100% 40px',
          backgroundPosition: '0 30px',
          touchAction: 'none',
          userSelect: 'none',         
          MozUserSelect: 'none',      
          WebkitUserSelect: 'none',   
          msUserSelect: 'none',
        }}
      >
        {listo && (
          <ReactSketchCanvas
            ref={canvasRef}
            style={{
              position: 'absolute', 
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none' 
            }}
            width="100%"
            height="100%"
            strokeWidth={GROSOR_LAPIZ} 
            eraserWidth={GROSOR_GOMA}
            strokeColor="black"
            canvasColor="transparent"
          />
        )}
      </div>

      <button
        onClick={exportarDibujo}
        className="mt-6 w-full max-w-xs py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
      >
        <CheckCircle />
        Terminar y Revisar
      </button>
    </div>
  );
};

export default LienzoDigital;