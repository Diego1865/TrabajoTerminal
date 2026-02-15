'use client';

import React, { useRef, useState } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { Eraser, Pen, RotateCcw, CheckCircle, Trash2 } from 'lucide-react';

const LienzoDigital = ({ alTerminar }) => {
  const canvasRef = useRef(null);
  const [esBorrador, setEsBorrador] = useState(false);

  // Configuración del pincel
  const estilos = {
    border: '4px solid #d1d5db',
    borderRadius: '10px',
  };

  // Función para obtener la imagen y enviarla
  const exportarDibujo = async () => {
    try {
      // Exporta el dibujo como imagen PNG
      const imagenDataUrl = await canvasRef.current.exportImage('png');
      console.log("Dibujo exportado para OCR");
      
      // Aquí pasaríamos la imagen al componente padre o al backend
      if (alTerminar) {
        alTerminar(imagenDataUrl);
      } else {
        alert("¡Dibujo capturado! Listo para enviar al modelo de IA.");
      }
    } catch (e) {
      console.error("Error al exportar", e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      
      {/* Barra de Herramientas */}
      <div className="flex gap-4 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
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

      {/* Área de Dibujo */}
      <div className="w-full h-80 shadow-inner bg-white rounded-xl overflow-hidden relative">
        {/* Fondo opcional de líneas tipo cuaderno para guiar al niño */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 40px', marginTop: '30px' }}>
        </div>

        <ReactSketchCanvas
          ref={canvasRef}
          style={estilos}
          strokeWidth={4}
          strokeColor="black"
          canvasColor="transparent" // Transparente para ver las líneas de fondo
        />
      </div>

      {/* Botón de Enviar */}
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