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
    if (canvas) setHistorial((prev) => [...prev, canvas.toDataURL()]);
  };

  const inicializarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;
    setHistorial([canvas.toDataURL()]);
  };

  useEffect(() => {
    if (esFullscreen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    const timer = setTimeout(() => inicializarCanvas(), 150);
    return () => { clearTimeout(timer); document.body.style.overflow = 'auto'; };
  }, [esFullscreen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if ((mostrarMenuLapiz || mostrarMenuGoma) && !e.target.closest('[data-menu-area]')) {
        setMostrarMenuLapiz(false);
        setMostrarMenuGoma(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mostrarMenuLapiz, mostrarMenuGoma]);

  const manejarClickLapiz = () => {
    if (!esBorrador) { setMostrarMenuLapiz(!mostrarMenuLapiz); setMostrarMenuGoma(false); }
    else { setEsBorrador(false); setMostrarMenuLapiz(false); setMostrarMenuGoma(false); }
  };

  const manejarClickGoma = () => {
    if (esBorrador) { setMostrarMenuGoma(!mostrarMenuGoma); setMostrarMenuLapiz(false); }
    else { setEsBorrador(true); setMostrarMenuGoma(false); setMostrarMenuLapiz(false); }
  };

  const deshacer = () => {
    if (historial.length <= 1) return;
    const nuevoHistorial = [...historial];
    nuevoHistorial.pop();
    const estadoAnterior = nuevoHistorial[nuevoHistorial.length - 1];
    setHistorial(nuevoHistorial);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = estadoAnterior;
    img.onload = () => {
      context.save();
      context.globalCompositeOperation = 'source-over';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
      context.restore();
    };
  };

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.save();
    context.globalCompositeOperation = 'source-over';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    guardarEstado();
  };

  const obtenerCoordenadas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches?.length > 0) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
    else { clientX = e.clientX; clientY = e.clientY; }
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const mostrarBorrador = (e) => {
    if (!esBorrador) { setCursorPos(null); return; }
    setCursorPos(obtenerCoordenadas(e));
  };

  const iniciarDibujo = (e) => {
    if (e.cancelable) e.preventDefault();
    const { x, y } = obtenerCoordenadas(e);
    if (esBorrador) {
      contextRef.current.globalCompositeOperation = 'destination-out';
      contextRef.current.lineWidth = grosurGoma;
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.strokeStyle = 'black';
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
    contextRef.current.globalCompositeOperation = 'source-over';
    setIsDrawing(false);
    guardarEstado();
  };

  const solicitarCambioFullscreen = () => {
    if (historial.length > 1) setMostrarAvisoFullscreen(true);
    else setEsFullscreen(!esFullscreen);
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
      if (!idEjercicioTutor) { mostrarMensaje('Error: No se especificó el ejercicio.', 'error'); setEnviando(false); return; }
      const token = localStorage.getItem('token');
      if (!token) { mostrarMensaje('Error: Sesión expirada.', 'error'); setEnviando(false); return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/intento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_ejercicio_tutor: idEjercicioTutor, imagen_codificada: imagenDataUrl })
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.detail || 'Error al enviar el intento'); }
      mostrarMensaje('¡Intento enviado correctamente! 🎉', 'exito');
      if (alTerminar) alTerminar(imagenDataUrl);
    } catch (error) {
      mostrarMensaje(`Error: ${error.message || 'No se pudo enviar el intento'}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  const ToolBtn = ({ onClick, active, activeColor, activeShadow, label, children }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 transition-all"
      style={{
        padding: '8px 12px',
        borderRadius: '14px',
        minWidth: '64px',
        background: active ? activeColor : '#F3F4F6',
        color: active ? 'white' : '#6B7280',
        boxShadow: active ? `0 3px 0 ${activeShadow}` : '0 2px 0 #D1D5DB',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: '0.75rem',
        border: 'none',
        cursor: 'pointer',
        transform: active ? 'translateY(-1px)' : 'none',
      }}>
      {children}
      <span>{label}</span>
    </button>
  );

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      <div className={`flex flex-col items-center ${esFullscreen ? 'fixed inset-0 z-[9999] w-full h-full p-4 pt-12 overflow-hidden' : 'relative w-full max-w-2xl mx-auto'}`}
        style={{ background: esFullscreen ? 'white' : 'transparent' }}>

        {/* Notificación */}
        {notificacion && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 font-black z-[10000]"
            style={{
              borderRadius: '20px',
              background: notificacion.tipo === 'error' ? '#FEF2F2' : '#ECFDF5',
              border: `2px solid ${notificacion.tipo === 'error' ? '#FCA5A5' : '#A7F3D0'}`,
              color: notificacion.tipo === 'error' ? '#DC2626' : '#059669',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}>
            {notificacion.tipo === 'error' ? '😅' : '🎉'} {notificacion.texto}
          </div>
        )}

        {/* Modal aviso fullscreen */}
        {mostrarAvisoFullscreen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white p-7 max-w-sm w-full text-center"
              style={{ borderRadius: '24px', border: '3px solid #FDE68A', boxShadow: '0 8px 0 #FDE68A' }}>
              <div style={{ fontSize: '3rem' }} className="mb-3">⚠️</div>
              <h3 className="font-black mb-2 text-gray-800" style={{ fontSize: '1.2rem' }}>¿Cambiar de vista?</h3>
              <p className="font-semibold text-gray-500 mb-6 text-sm">
                Al cambiar el tamaño, el lienzo se limpiará para evitar distorsiones.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setMostrarAvisoFullscreen(false)}
                  className="flex-1 py-3 font-black"
                  style={{ background: '#F3F4F6', borderRadius: '14px', color: '#374151', border: '2px solid #E5E7EB' }}>
                  Cancelar
                </button>
                <button onClick={confirmarCambioFullscreen}
                  className="flex-1 py-3 font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '14px', boxShadow: '0 4px 0 #92400E' }}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barra de herramientas */}
        <div data-menu-area
          className="flex gap-2 mb-4 p-2.5 w-full justify-center flex-wrap"
          style={{ background: 'white', borderRadius: '20px', border: '2.5px solid #E5E7EB', boxShadow: '0 4px 0 #E5E7EB' }}>

          {/* Lápiz */}
          <div className="relative">
            <ToolBtn onClick={manejarClickLapiz} active={!esBorrador} activeColor="#7C3AED" activeShadow="#4C1D95" label="✏️ Lápiz">
              <Pen size={esFullscreen ? 22 : 18} />
            </ToolBtn>
            {mostrarMenuLapiz && (
              <div className="absolute top-full left-0 mt-2 bg-white z-50 overflow-hidden"
                style={{ borderRadius: '14px', border: '2px solid #DDD6FE', boxShadow: '0 6px 20px rgba(109,40,217,0.15)', minWidth: '80px' }}>
                <div className="px-3 py-1.5 text-xs font-black uppercase text-center"
                  style={{ background: '#F5F3FF', color: '#7C3AED', borderBottom: '2px solid #EDE9FE' }}>Grosor</div>
                {opcionesGrosurLapiz.map((g) => (
                  <button key={g} onClick={() => { setGrosurLapiz(g); setMostrarMenuLapiz(false); }}
                    className="w-full px-4 py-2 text-center text-sm font-bold"
                    style={{ background: grosurLapiz === g ? '#EDE9FE' : 'white', color: grosurLapiz === g ? '#7C3AED' : '#6B7280' }}>
                    {g}px
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Goma */}
          <div className="relative">
            <ToolBtn onClick={manejarClickGoma} active={esBorrador} activeColor="#EC4899" activeShadow="#9D174D" label="🩹 Goma">
              <Eraser size={esFullscreen ? 22 : 18} />
            </ToolBtn>
            {mostrarMenuGoma && (
              <div className="absolute top-full left-0 mt-2 bg-white z-50 overflow-hidden"
                style={{ borderRadius: '14px', border: '2px solid #FBCFE8', boxShadow: '0 6px 20px rgba(236,72,153,0.15)', minWidth: '80px' }}>
                <div className="px-3 py-1.5 text-xs font-black uppercase text-center"
                  style={{ background: '#FDF2F8', color: '#EC4899', borderBottom: '2px solid #FBCFE8' }}>Grosor</div>
                {opcionesGrosurGoma.map((g) => (
                  <button key={g} onClick={() => { setGrosurGoma(g); setMostrarMenuGoma(false); }}
                    className="w-full px-4 py-2 text-center text-sm font-bold"
                    style={{ background: grosurGoma === g ? '#FDF2F8' : 'white', color: grosurGoma === g ? '#EC4899' : '#6B7280' }}>
                    {g}px
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '2px', background: '#E5E7EB', margin: '4px 4px' }} />

          {/* Deshacer */}
          <ToolBtn onClick={deshacer} active={false} label="↩️ Deshacer">
            <RotateCcw size={esFullscreen ? 22 : 18} />
          </ToolBtn>

          {/* Limpiar */}
          <button onClick={limpiarCanvas}
            className="flex flex-col items-center gap-1 transition-all hover:scale-105"
            style={{
              padding: '8px 12px', borderRadius: '14px', minWidth: '64px',
              background: '#FEF2F2', color: '#EF4444',
              boxShadow: '0 2px 0 #FECACA', border: '2px solid #FECACA',
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer',
            }}>
            <Trash2 size={esFullscreen ? 22 : 18} />
            <span>🗑️ Limpiar</span>
          </button>
        </div>

        {/* Canvas */}
        <div
          className={`${esFullscreen ? 'flex-grow w-full' : 'w-full h-96'} relative overflow-hidden`}
          style={{
            borderRadius: '20px',
            border: '2.5px solid #DDD6FE',
            boxShadow: '0 4px 0 #DDD6FE',
            backgroundImage: 'linear-gradient(#EDE9FE 1px, transparent 1px), linear-gradient(90deg, #EDE9FE 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            background: '#FAFAFE',
            touchAction: 'none',
            userSelect: 'none',
          }}>
          <canvas
            ref={canvasRef}
            onMouseDown={iniciarDibujo}
            onMouseMove={(e) => { dibujar(e); mostrarBorrador(e); }}
            onMouseUp={terminarDibujo}
            onMouseLeave={() => { terminarDibujo(); setCursorPos(null); }}
            onTouchStart={iniciarDibujo}
            onTouchMove={dibujar}
            onTouchEnd={terminarDibujo}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          />

          {/* Cursor goma visual */}
          {esBorrador && cursorPos && (
            <div className="absolute pointer-events-none border-2 border-dashed rounded-full"
              style={{
                left: `${cursorPos.x}px`, top: `${cursorPos.y}px`,
                width: `${grosurGoma * 2}px`, height: `${grosurGoma * 2}px`,
                transform: 'translate(-50%, -50%)',
                borderColor: '#EC4899',
                boxShadow: 'inset 0 0 5px rgba(236,72,153,0.3)',
              }} />
          )}

          {/* Botón fullscreen */}
          <button onClick={solicitarCambioFullscreen}
            className="absolute bottom-3 right-3 p-2.5 transition-all hover:scale-110"
            style={{ background: 'white', borderRadius: '12px', border: '2px solid #DDD6FE', boxShadow: '0 2px 0 #DDD6FE' }}
            title={esFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
            {esFullscreen
              ? <Minimize2 size={20} style={{ color: '#7C3AED' }} />
              : <Maximize2 size={20} style={{ color: '#7C3AED' }} />}
          </button>
        </div>

        {/* Botón enviar */}
        <button
          onClick={exportarDibujo}
          disabled={!canvasRef.current || enviando}
          className="mt-4 py-3.5 font-black text-lg flex items-center justify-center gap-2 transition-all"
          style={{
            width: esFullscreen ? '100%' : 'auto',
            minWidth: '260px',
            borderRadius: '18px',
            background: enviando ? '#D1FAE5' : 'linear-gradient(135deg, #10B981, #059669)',
            color: enviando ? '#6B7280' : 'white',
            boxShadow: enviando ? 'none' : '0 5px 0 #065F46',
            cursor: enviando ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => { if (!enviando) e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
          <CheckCircle size={22} />
          {enviando ? 'Enviando... ⏳' : '¡Terminar y Entregar! 🚀'}
        </button>
      </div>
    </div>
  );
};

export default LienzoDigital;