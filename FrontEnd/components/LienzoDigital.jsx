'use client';
import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Eraser, Pen, RotateCcw, Trash2 } from 'lucide-react';

// --- Componente LienzoDigital (Modificado para usar HTML5 Canvas Nativo) ---
const LienzoDigital = ({ alTerminar }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [esBorrador, setEsBorrador] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    // Ajustar la resolución del canvas al tamaño real del contenedor
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;
    guardarEstado(); // Guardar el lienzo vacío inicial
  }, []);

  const guardarEstado = () => {
    if (!canvasRef.current) return;
    setHistorial(prev => [...prev, canvasRef.current.toDataURL()]);
  };

  const deshacer = () => {
    if (historial.length <= 1) return;
    const nuevoHistorial = [...historial];
    nuevoHistorial.pop(); // Remover el estado actual
    const estadoAnterior = nuevoHistorial[nuevoHistorial.length - 1];
    setHistorial(nuevoHistorial);
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = estadoAnterior;
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
    };
  };

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    guardarEstado();
  };

  const obtenerCoordenadas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
  };

  const iniciarDibujo = (e) => {
    // Evita el comportamiento de arrastrar la pantalla en móviles
    if (e.cancelable) e.preventDefault(); 
    const { x, y } = obtenerCoordenadas(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const dibujar = (e) => {
    if (e.cancelable) e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = obtenerCoordenadas(e);
    
    if (esBorrador) {
      contextRef.current.globalCompositeOperation = "destination-out";
      contextRef.current.lineWidth = 30;
    } else {
      contextRef.current.globalCompositeOperation = "source-over";
      contextRef.current.strokeStyle = "black";
      contextRef.current.lineWidth = 4;
    }
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const terminarDibujo = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    guardarEstado();
  };

  const exportarDibujo = () => {
    try {
      if (canvasRef.current) {
        const imagenDataUrl = canvasRef.current.toDataURL('image/png');
        if (alTerminar) alTerminar(imagenDataUrl);
        alert("¡Dibujo enviado correctamente!");
      }
    } catch (e) {
      console.error("Error al exportar", e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="flex gap-4 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200 z-10 w-full overflow-x-auto justify-center">
        <button
          onClick={() => setEsBorrador(false)}
          className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors min-w-[64px] ${!esBorrador ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`}
        >
          <Pen size={20} />
          <span className="text-xs">Escribir</span>
        </button>

        <button
          onClick={() => setEsBorrador(true)}
          className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors min-w-[64px] ${esBorrador ? 'bg-pink-100 text-pink-700 font-bold' : 'hover:bg-gray-100'}`}
        >
          <Eraser size={20} />
          <span className="text-xs">Borrar</span>
        </button>

        <div className="w-px bg-gray-300 mx-2"></div>

        <button
          onClick={deshacer}
          className="p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-gray-100 text-gray-600 min-w-[64px]"
        >
          <RotateCcw size={20} />
          <span className="text-xs">Deshacer</span>
        </button>

        <button
          onClick={limpiarCanvas}
          className="p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-red-50 text-red-500 min-w-[64px]"
        >
          <Trash2 size={20} />
          <span className="text-xs">Limpiar</span>
        </button>
      </div>

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
        <canvas
          ref={canvasRef}
          onMouseDown={iniciarDibujo}
          onMouseMove={dibujar}
          onMouseUp={terminarDibujo}
          onMouseLeave={terminarDibujo}
          onTouchStart={iniciarDibujo}
          onTouchMove={dibujar}
          onTouchEnd={terminarDibujo}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
        />
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