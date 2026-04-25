import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Eraser, Pen, RotateCcw, Trash2, Maximize2, Minimize2, AlertTriangle } from 'lucide-react';

const LienzoDigital = ({ alTerminar, idEjercicioTutor }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [esBorrador, setEsBorrador] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [esFullscreen, setEsFullscreen] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [grosurLapiz, setGrosurLapiz] = useState(4);
  const [grosurGoma, setGrosurGoma] = useState(15);
  const [cursorPos, setCursorPos] = useState(null);
  const [mostrarMenuLapiz, setMostrarMenuLapiz] = useState(false);
  const [mostrarMenuGoma, setMostrarMenuGoma] = useState(false);
  const [mostrarAvisoFullscreen, setMostrarAvisoFullscreen] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const opcionesGrosurLapiz = [2, 4, 6, 10];
  const opcionesGrosurGoma = [5, 10, 15, 20, 30];

  const guardarEstado = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setHistorial((prev) => [...prev, canvas.toDataURL()]);
    }
  };

  const inicializarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;
    
    setHistorial([canvas.toDataURL()]);
  };

  // Inicialización y re-cálculo al cambiar de modo de visualización
  useEffect(() => {
    if (esFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const timer = setTimeout(() => {
      inicializarCanvas();
    }, 150);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [esFullscreen]);

  // Cierre de menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mostrarMenuLapiz || mostrarMenuGoma) {
        if (!e.target.closest('[data-menu-area]')) {
          setMostrarMenuLapiz(false);
          setMostrarMenuGoma(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mostrarMenuLapiz, mostrarMenuGoma]);

  const manejarClickLapiz = () => {
    if (!esBorrador) {
      setMostrarMenuLapiz(!mostrarMenuLapiz);
      setMostrarMenuGoma(false);
    } else {
      setEsBorrador(false);
      setMostrarMenuLapiz(false);
      setMostrarMenuGoma(false);
    }
  };

  const manejarClickGoma = () => {
    if (esBorrador) {
      setMostrarMenuGoma(!mostrarMenuGoma);
      setMostrarMenuLapiz(false);
    } else {
      setEsBorrador(true);
      setMostrarMenuGoma(false);
      setMostrarMenuLapiz(false);
    }
  };

  const deshacer = () => {
    if (historial.length <= 1) return;
    const nuevoHistorial = [...historial];
    nuevoHistorial.pop();
    const estadoAnterior = nuevoHistorial[nuevoHistorial.length - 1];
    setHistorial(nuevoHistorial);
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = estadoAnterior;
    img.onload = () => {
      context.save();
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
      context.restore();
    };
  };

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();
    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    guardarEstado();
  };

  const obtenerCoordenadas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const mostrarBorrador = (e) => {
    if (!esBorrador) {
      setCursorPos(null);
      return;
    }
    const { x, y } = obtenerCoordenadas(e);
    setCursorPos({ x, y });
  };

  const iniciarDibujo = (e) => {
    if (e.cancelable) e.preventDefault(); 
    const { x, y } = obtenerCoordenadas(e);
    
    if (esBorrador) {
      contextRef.current.globalCompositeOperation = "destination-out";
      contextRef.current.lineWidth = grosurGoma;
    } else {
      contextRef.current.globalCompositeOperation = "source-over";
      contextRef.current.strokeStyle = "black";
      contextRef.current.lineWidth = grosurLapiz;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const dibujar = (e) => {
    if (e.cancelable) e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = obtenerCoordenadas(e);
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const terminarDibujo = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    contextRef.current.globalCompositeOperation = "source-over";
    setIsDrawing(false);
    guardarEstado();
  };

  const solicitarCambioFullscreen = () => {
    if (historial.length > 1) {
      setMostrarAvisoFullscreen(true);
    } else {
      setEsFullscreen(!esFullscreen);
    }
  };

  const confirmarCambioFullscreen = () => {
    setMostrarAvisoFullscreen(false);
    setEsFullscreen(!esFullscreen);
  };

  const mostrarMensaje = (texto, tipo) => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 4000);
  };

  const exportarDibujo = async () => {
    try {
      if (!canvasRef.current) return;
      
      setEnviando(true);
      const imagenDataUrl = canvasRef.current.toDataURL('image/png');
      
      if (!idEjercicioTutor) {
        mostrarMensaje("Error: No se especificó el ejercicio.", "error");
        setEnviando(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        mostrarMensaje("Error: Sesión expirada.", "error");
        setEnviando(false);
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/intentos/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_ejercicio_tutor: idEjercicioTutor,
          imagen_codificada: imagenDataUrl
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al enviar el intento');
      }
      
      mostrarMensaje("¡Intento enviado correctamente!", "exito");
      if (alTerminar) alTerminar(imagenDataUrl);
      
    } catch (error) {
      console.error("Error al exportar:", error);
      mostrarMensaje(`Error: ${error.message || 'No se pudo enviar el intento'}`, "error");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={`flex flex-col items-center bg-white ${esFullscreen ? 'fixed inset-0 z-[9999] w-full h-full p-4 pt-12 overflow-hidden' : 'relative w-full max-w-2xl mx-auto rounded-xl'}`}>

      {/* Notificaciones */}
      {notificacion && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[10000] font-medium transition-all ${
          notificacion.tipo === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {notificacion.texto}
        </div>
      )}

      {/* Modal Aviso Fullscreen */}
      {mostrarAvisoFullscreen && (
        <div className="fixed inset-0 z-[10000] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-200">
            <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h3 className="text-lg font-bold mb-2 text-gray-800">¿Cambiar de vista?</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Al modificar el tamaño de la pantalla, el lienzo actual se limpiará para adaptar la resolución y evitar distorsiones.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setMostrarAvisoFullscreen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium w-full"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioFullscreen}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium w-full"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de herramientas */}
      <div data-menu-area className="flex gap-2 sm:gap-4 mb-4 bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-200 z-10 w-full justify-center flex-wrap">
        
        <div className="relative">
          <button
            onClick={manejarClickLapiz}
            className={`p-2 sm:p-3 rounded-lg flex flex-col items-center gap-1 transition-colors min-w-[64px] ${!esBorrador ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Pen size={esFullscreen ? 24 : 20} />
            <span className="text-xs">Lápiz</span>
          </button>
          {mostrarMenuLapiz && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[80px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 text-center uppercase border-b border-gray-100">Grosor</div>
              {opcionesGrosurLapiz.map((grosor) => (
                <button
                  key={grosor}
                  onClick={() => {
                    setGrosurLapiz(grosor);
                    setMostrarMenuLapiz(false);
                  }}
                  className={`w-full px-4 py-2 text-center text-sm hover:bg-blue-50 ${grosurLapiz === grosor ? 'bg-blue-100 font-bold text-blue-700' : 'text-gray-700'}`}
                >
                  {grosor}px
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={manejarClickGoma}
            className={`p-2 sm:p-3 rounded-lg flex flex-col items-center gap-1 transition-colors min-w-[64px] ${esBorrador ? 'bg-pink-100 text-pink-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Eraser size={esFullscreen ? 24 : 20} />
            <span className="text-xs">Goma</span>
          </button>
          {mostrarMenuGoma && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[80px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 text-center uppercase border-b border-gray-100">Grosor</div>
              {opcionesGrosurGoma.map((grosor) => (
                <button
                  key={grosor}
                  onClick={() => {
                    setGrosurGoma(grosor);
                    setMostrarMenuGoma(false);
                  }}
                  className={`w-full px-4 py-2 text-center text-sm hover:bg-pink-50 ${grosurGoma === grosor ? 'bg-pink-100 font-bold text-pink-700' : 'text-gray-700'}`}
                >
                  {grosor}px
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-1 sm:mx-2"></div>

        <button
          onClick={deshacer}
          className={`p-2 sm:p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-gray-100 text-gray-600 min-w-[64px]`}
        >
          <RotateCcw size={esFullscreen ? 24 : 20} />
          <span className="text-xs">Deshacer</span>
        </button>

        <button
          onClick={limpiarCanvas}
          className={`p-2 sm:p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-red-50 text-red-500 min-w-[64px]`}
        >
          <Trash2 size={esFullscreen ? 24 : 20} />
          <span className="text-xs">Limpiar</span>
        </button>
      </div>

      {/* Contenedor del Canvas */}
      <div 
        className={`${esFullscreen ? 'flex-grow w-full' : 'w-full h-96'} relative bg-white rounded-xl shadow-inner border-2 border-gray-300 overflow-hidden`}
        style={{ 
          backgroundImage: 'linear-gradient(#f3f4f6 1px, transparent 1px), linear-gradient(90deg, #f3f4f6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          touchAction: 'none',
          userSelect: 'none',        
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={iniciarDibujo}
          onMouseMove={(e) => {
            dibujar(e);
            mostrarBorrador(e);
          }}
          onMouseUp={terminarDibujo}
          onMouseLeave={() => {
            terminarDibujo();
            setCursorPos(null);
          }}
          onTouchStart={iniciarDibujo}
          onTouchMove={dibujar}
          onTouchEnd={terminarDibujo}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
        />
        
        {/* Cursor visual de la goma */}
        {esBorrador && cursorPos && (
          <div
            className="absolute pointer-events-none border-2 border-gray-400 border-dashed rounded-full"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              width: `${grosurGoma * 2}px`,
              height: `${grosurGoma * 2}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: 'inset 0 0 5px rgba(100, 100, 100, 0.3)',
            }}
          />
        )}
        
        {/* Botón de pantalla completa */}
        <button
          onClick={solicitarCambioFullscreen}
          className="absolute bottom-3 right-3 p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors shadow-sm"
          title={esFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {esFullscreen ? (
            <Minimize2 size={24} className="text-gray-700" />
          ) : (
            <Maximize2 size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Botón de envío */}
      <button
        onClick={exportarDibujo}
        disabled={!canvasRef.current || enviando}
        className={`mt-4 w-full ${esFullscreen ? 'max-w-md' : 'max-w-xs'} py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 ${
          enviando
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        <CheckCircle size={20} />
        {enviando ? 'Enviando...' : 'Terminar y Revisar'}
      </button>
    </div>
  );
};

export default LienzoDigital;