'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CheckCircle, Eraser, Pen, RotateCcw, Trash2, Maximize2, Minimize2, BookOpen, Image as ImageIcon } from 'lucide-react';
import LectorEjercicio from './lectorejercicio';

/* ─── Colores por tipo de ejercicio ─── */
const TIPO_CONFIG = {
  Legibilidad: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8', emoji: '✍️' },
  Ortografía:  { bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46', emoji: '📝' },
  Mixto:       { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E', emoji: '🎯' },
};

/* ─── Badge de tipo ─── */
const TipoBadge = ({ tipo }) => {
  const cfg = TIPO_CONFIG[tipo] || { bg: '#F3F4F6', border: '#E5E7EB', color: '#374151', emoji: '📋' };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: '8px', color: cfg.color }}>
      {cfg.emoji} {tipo}
    </span>
  );
};

/* ─── Tarjeta de imagen de referencia (fuera del lienzo) ─── */
const ImagenReferencia = ({ src, alt = 'Imagen de referencia' }) => (
  <div className="w-full mb-4 overflow-hidden"
    style={{ border: '2.5px solid #DDD6FE', borderRadius: '18px', background: '#F5F3FF', boxShadow: '0 4px 0 #DDD6FE' }}>
    <div className="flex items-center gap-2 px-4 py-2.5"
      style={{ background: 'white', borderBottom: '2px solid #EDE9FE' }}>
      <ImageIcon size={16} style={{ color: '#7C3AED' }} />
      <span className="font-black text-sm" style={{ color: '#6D28D9' }}>Imagen de referencia</span>
    </div>
    <div className="p-3 flex items-center justify-center">
      <img src={src} alt={alt}
        className="max-w-full object-contain"
        style={{ maxHeight: '200px', borderRadius: '10px' }} />
    </div>
  </div>
);

/* ─── Caja de texto guía ─── */
const TextoGuia = ({ texto }) => (
  <div className="w-full mb-4 px-4 py-3"
    style={{ background: 'white', border: '2.5px solid #DDD6FE', borderRadius: '18px', boxShadow: '0 4px 0 #DDD6FE' }}>
    <p className="text-xs font-black uppercase mb-1.5" style={{ color: '#A78BFA', letterSpacing: '0.06em' }}>
      ✏️ Texto guía — escríbelo en el lienzo
    </p>
    <p className="font-black text-center"
      style={{ fontSize: '1.35rem', color: '#1F2937', letterSpacing: '0.03em', lineHeight: 1.5 }}>
      {texto}
    </p>
  </div>
);

/* ─── Botón de herramienta ─── */
const ToolBtn = ({ onClick, active, activeColor, activeShadow, label, children }) => (
  <button onClick={onClick}
    className="flex flex-col items-center gap-1 transition-all"
    style={{
      padding: '8px 12px', borderRadius: '14px', minWidth: '64px',
      background: active ? activeColor : '#F3F4F6',
      color: active ? 'white' : '#6B7280',
      boxShadow: active ? `0 3px 0 ${activeShadow}` : '0 2px 0 #D1D5DB',
      fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '0.75rem',
      border: 'none', cursor: 'pointer',
      transform: active ? 'translateY(-1px)' : 'none',
    }}>
    {children}
    <span>{label}</span>
  </button>
);

/* ════════════════════════════════════════
   COMPONENTE PRINCIPAL
   Props:
     ejercicio         – objeto { titulo, descripcion, tipo, contenido_base (JSON string) }
     idEjercicioTutor  – ID para el endpoint
     alTerminar        – callback con imagenDataUrl
   ════════════════════════════════════════ */
const LienzoDigital = ({ alTerminar, idEjercicioTutor, ejercicio }) => {

  /* ── Parsear contenido_base ── */
  const contenido = useMemo(() => {
    if (!ejercicio?.contenido_base) return {};
    try { return JSON.parse(ejercicio.contenido_base); }
    catch { return {}; }
  }, [ejercicio]);

  const textoGuia      = contenido.texto_guia   || null;
  const imagenGuia     = contenido.imagen_guia  || null;
  // imagen_en_lienzo: true → se superpone sobre el canvas; false/undefined → tarjeta separada
  const imagenEnLienzo = !!contenido.imagen_en_lienzo;

  /* ── Estado del lienzo ── */
  const canvasRef    = useRef(null);
  const contextRef   = useRef(null);
  const [esBorrador,        setEsBorrador]        = useState(false);
  const [historial,         setHistorial]          = useState([]);
  const [esFullscreen,      setEsFullscreen]       = useState(false);
  const [enviando,          setEnviando]           = useState(false);
  const [grosurLapiz,       setGrosurLapiz]        = useState(4);
  const [grosurGoma,        setGrosurGoma]         = useState(15);
  const [cursorPos,         setCursorPos]          = useState(null);
  const [mostrarMenuLapiz,  setMostrarMenuLapiz]   = useState(false);
  const [mostrarMenuGoma,   setMostrarMenuGoma]    = useState(false);
  const [mostrarAviso,      setMostrarAviso]       = useState(false);
  const [notificacion,      setNotificacion]       = useState(null);

  /* ── Trazo en curso: refs para no esperar a React entre eventos del lápiz ── */
  const dibujandoRef      = useRef(false);
  const punteroRef        = useRef(null);   // pointerId del trazo actual
  const ultimoPuntoRef    = useRef(null);
  const lapizDetectadoRef = useRef(false);  // con lápiz, se ignoran palma y dedos

  const MAX_HISTORIAL = 30;

  const opcionesLapiz = [2, 4, 6, 10];
  const opcionesGoma  = [5, 10, 15, 20, 30];

  /* ── Canvas helpers ── */
  // Copia rápida del lienzo para deshacer. toDataURL (PNG) congelaba la tableta al
  // terminar cada trazo y se perdía el inicio del siguiente.
  const agregarAlHistorial = (copia, reiniciar = false) => setHistorial(prev => {
    const nuevo = reiniciar ? [copia] : [...prev, copia];
    nuevo.slice(0, Math.max(0, nuevo.length - MAX_HISTORIAL)).forEach(c => c.close?.());
    return nuevo.slice(-MAX_HISTORIAL);
  });

  const guardarEstado = (reiniciar = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof createImageBitmap === 'function') {
      createImageBitmap(canvas).then(copia => agregarAlHistorial(copia, reiniciar));
    } else {
      agregarAlHistorial(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height), reiniciar);
    }
  };

  const restaurarCopia = (copia) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (copia instanceof ImageData) ctx.putImageData(copia, 0, 0);
    else ctx.drawImage(copia, 0, 0);
    ctx.restore();
  };

  const inicializarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width  = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    contextRef.current = ctx;
    guardarEstado(true);
  };

  useEffect(() => {
    if (esFullscreen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    const timer = setTimeout(() => inicializarCanvas(), 150);
    return () => { clearTimeout(timer); document.body.style.overflow = 'auto'; };
  }, [esFullscreen]);

  // Safari en iPad: el Apple Pencil también genera eventos touch, y tras cada trazo
  // Safari espera un instante para reconocer sus gestos (doble toque, lupa, Scribble);
  // un trazo que empieza en ese instante se pierde. Bloquearlos aquí (React registra
  // los touch como pasivos y no permite preventDefault) deja todo a los Pointer Events.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bloquear = (e) => { if (e.cancelable) e.preventDefault(); };
    const eventos = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
    eventos.forEach(tipo => canvas.addEventListener(tipo, bloquear, { passive: false }));
    return () => eventos.forEach(tipo => canvas.removeEventListener(tipo, bloquear));
  }, [esFullscreen]);

  useEffect(() => {
    const handler = (e) => {
      if ((mostrarMenuLapiz || mostrarMenuGoma) && !e.target.closest('[data-menu-area]')) {
        setMostrarMenuLapiz(false); setMostrarMenuGoma(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [mostrarMenuLapiz, mostrarMenuGoma]);

  const manejarClickLapiz = () => {
    if (!esBorrador) { setMostrarMenuLapiz(v => !v); setMostrarMenuGoma(false); }
    else { setEsBorrador(false); setMostrarMenuLapiz(false); setMostrarMenuGoma(false); }
  };

  const manejarClickGoma = () => {
    if (esBorrador) { setMostrarMenuGoma(v => !v); setMostrarMenuLapiz(false); }
    else { setEsBorrador(true); setMostrarMenuGoma(false); setMostrarMenuLapiz(false); }
  };

  const deshacer = () => {
    if (historial.length <= 1) return;
    const nuevo = [...historial];
    nuevo.pop()?.close?.();
    setHistorial(nuevo);
    restaurarCopia(nuevo[nuevo.length - 1]);
  };

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    guardarEstado();
  };

  const obtenerCoordenadas = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    };
  };

  const mostrarBorrador = (e) => {
    if (!esBorrador || e.pointerType === 'touch' && lapizDetectadoRef.current) { setCursorPos(null); return; }
    setCursorPos(obtenerCoordenadas(e));
  };

  // Con lápiz detectado, el toque (palma o dedos) no dibuja; sin lápiz, el dedo sí.
  const punteroPermitido = (e) => {
    if (e.pointerType === 'pen') lapizDetectadoRef.current = true;
    return !(e.pointerType === 'touch' && lapizDetectadoRef.current);
  };

  const trazarHasta = ({ x, y }) => {
    const ctx = contextRef.current;
    const desde = ultimoPuntoRef.current;
    ctx.beginPath();
    ctx.moveTo(desde.x, desde.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ultimoPuntoRef.current = { x, y };
  };

  const iniciarDibujo = (e) => {
    if (!punteroPermitido(e) || dibujandoRef.current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const ctx = contextRef.current;
    if (esBorrador) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = grosurGoma;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'black';
      ctx.lineWidth   = grosurLapiz;
    }
    dibujandoRef.current = true;
    punteroRef.current = e.pointerId;
    const punto = obtenerCoordenadas(e);
    ultimoPuntoRef.current = punto;
    trazarHasta(punto);  // un toque sin movimiento deja un punto
  };

  const dibujar = (e) => {
    mostrarBorrador(e);
    if (!dibujandoRef.current || e.pointerId !== punteroRef.current) return;
    e.preventDefault();
    // El lápiz reporta más puntos que cuadros por segundo; se usan todos para un trazo continuo.
    const eventos = e.nativeEvent.getCoalescedEvents?.() || [];
    (eventos.length ? eventos : [e]).forEach(ev => trazarHasta(obtenerCoordenadas(ev)));
  };

  const terminarDibujo = (e) => {
    if (!dibujandoRef.current || (e && e.pointerId !== punteroRef.current)) return;
    dibujandoRef.current = false;
    punteroRef.current = null;
    contextRef.current.globalCompositeOperation = 'source-over';
    guardarEstado();
  };

  const solicitarFullscreen = () => {
    if (historial.length > 1) setMostrarAviso(true);
    else setEsFullscreen(v => !v);
  };

  const confirmarFullscreen = () => {
    setMostrarAviso(false);
    setEsFullscreen(v => !v);
  };

  const mostrarMensaje = (texto, tipo) => {
    setNotificacion({ texto, tipo });
    setTimeout(() => setNotificacion(null), 4000);
  };

  const exportarDibujo = async () => {
    try {
      if (!canvasRef.current) return;
      setEnviando(true);
      const original = canvasRef.current;
      const exportacion = document.createElement('canvas');
      exportacion.width = original.width;
      exportacion.height = original.height;
      const ctx = exportacion.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportacion.width, exportacion.height);
      ctx.drawImage(original, 0, 0);
      const imagenDataUrl = exportacion.toDataURL('image/png');
      if (!idEjercicioTutor) { mostrarMensaje('Error: No se especificó el ejercicio.', 'error'); return; }
      const token = localStorage.getItem('token');
      if (!token) { mostrarMensaje('Error: Sesión expirada.', 'error'); return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/intento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_ejercicio_tutor: idEjercicioTutor, imagen_codificada: imagenDataUrl }),
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.detail || 'Error al enviar el intento'); }
      mostrarMensaje('¡Intento enviado correctamente! 🎉', 'exito');
      if (alTerminar) alTerminar(imagenDataUrl);
    } catch (err) {
      mostrarMensaje(`Error: ${err.message || 'No se pudo enviar el intento'}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      <div className={`flex flex-col items-center ${esFullscreen
        ? 'fixed inset-0 z-[9999] w-full h-full p-4 pt-12 overflow-hidden'
        : 'relative w-full max-w-2xl mx-auto'}`}
        style={{ background: esFullscreen ? 'white' : 'transparent' }}>

        {/* ── Notificación flotante ── */}
        {notificacion && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 font-black z-[10000]"
            style={{
              borderRadius: '20px',
              background: notificacion.tipo === 'error' ? '#FEF2F2' : '#ECFDF5',
              border: `2px solid ${notificacion.tipo === 'error' ? '#FCA5A5' : '#A7F3D0'}`,
              color:  notificacion.tipo === 'error' ? '#DC2626'  : '#059669',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}>
            {notificacion.tipo === 'error' ? '😅' : '🎉'} {notificacion.texto}
          </div>
        )}

        {/* ── Modal aviso fullscreen ── */}
        {mostrarAviso && (
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
                <button onClick={() => setMostrarAviso(false)}
                  className="flex-1 py-3 font-black"
                  style={{ background: '#F3F4F6', borderRadius: '14px', color: '#374151', border: '2px solid #E5E7EB' }}>
                  Cancelar
                </button>
                <button onClick={confirmarFullscreen}
                  className="flex-1 py-3 font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '14px', boxShadow: '0 4px 0 #92400E' }}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            CABECERA DEL EJERCICIO
            (se oculta en fullscreen para maximizar el área de dibujo)
        ══════════════════════════════════ */}
        {!esFullscreen && ejercicio && (
          <div className="w-full mb-4 p-4"
            style={{ background: 'white', border: '2.5px solid #DDD6FE', borderRadius: '22px', boxShadow: '0 6px 0 #DDD6FE' }}>

            {/* Tipo + título */}
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <TipoBadge tipo={ejercicio.tipo} />
              <h2 className="font-black leading-tight" style={{ fontSize: '1.1rem', color: '#1F2937' }}>
                {ejercicio.titulo}
              </h2>
            </div>

            {/* Descripción */}
            {ejercicio.descripcion && (
              <p className="text-sm font-semibold mb-3" style={{ color: '#6B7280', lineHeight: 1.5 }}>
                {ejercicio.descripcion}
              </p>
            )}

            {/* Imagen de referencia FUERA del lienzo */}
            {imagenGuia && !imagenEnLienzo && (
              <ImagenReferencia src={imagenGuia} />
            )}

            {/* Texto guía */}
            {textoGuia && <TextoGuia texto={textoGuia} />}
            
            {/* Botón de lectura en voz alta */}
            {<LectorEjercicio
              titulo={ejercicio.titulo}
              descripcion={ejercicio.descripcion}
              texto={contenido.texto_guia}
              etiqueta="Escuchar ejercicio"
              variante="boton"
            />}
          </div>
        )}

        {/* Texto guía compacto en fullscreen */}
        {esFullscreen && textoGuia && (
          <div className="w-full mb-3 px-4 py-2 flex items-center gap-3"
            style={{ background: '#F5F3FF', border: '2px solid #DDD6FE', borderRadius: '14px' }}>
            <BookOpen size={16} style={{ color: '#7C3AED', flexShrink: 0 }} />
            <p className="font-black" style={{ fontSize: '1.1rem', color: '#1F2937' }}>{textoGuia}</p>
          </div>
        )}

        {/* ── Barra de herramientas ── */}
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
                {opcionesLapiz.map(g => (
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
                {opcionesGoma.map(g => (
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

          <ToolBtn onClick={deshacer} active={false} label="↩️ Deshacer">
            <RotateCcw size={esFullscreen ? 22 : 18} />
          </ToolBtn>

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

        {/* ══════════════════════════════════
            ÁREA DEL CANVAS
        ══════════════════════════════════ */}
        <div className={`${esFullscreen ? 'flex-grow w-full' : 'w-full h-96'} relative overflow-hidden`}
          style={{
            borderRadius: '20px',
            border: '2.5px solid #DDD6FE',
            boxShadow: '0 4px 0 #DDD6FE',
            background: '#FAFAFE',
            backgroundImage: 'linear-gradient(#EDE9FE 1px, transparent 1px), linear-gradient(90deg, #EDE9FE 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            touchAction: 'none',
            userSelect: 'none',
          }}>

          {/* Imagen superpuesta DENTRO del lienzo (guía semitransparente) */}
          {imagenGuia && imagenEnLienzo && (
            <img
              src={imagenGuia}
              alt="Guía"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              style={{ opacity: 0.18, zIndex: 1 }}
            />
          )}

          {/* Badge indicador cuando hay imagen en lienzo */}
          {imagenGuia && imagenEnLienzo && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 z-10 pointer-events-none"
              style={{ background: 'rgba(109,40,217,0.12)', borderRadius: '8px', border: '1px solid #DDD6FE' }}>
              <ImageIcon size={12} style={{ color: '#7C3AED' }} />
              <span className="text-xs font-black" style={{ color: '#7C3AED' }}>Guía visible</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            onPointerDown={iniciarDibujo}
            onPointerMove={dibujar}
            onPointerUp={terminarDibujo}
            onPointerCancel={terminarDibujo}
            onPointerLeave={() => setCursorPos(null)}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            style={{ zIndex: 2, touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
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
                zIndex: 3,
              }} />
          )}

          {/* Botón fullscreen */}
          <button onClick={solicitarFullscreen}
            className="absolute bottom-3 right-3 p-2.5 transition-all hover:scale-110"
            style={{ background: 'white', borderRadius: '12px', border: '2px solid #DDD6FE', boxShadow: '0 2px 0 #DDD6FE', zIndex: 4 }}
            title={esFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
            {esFullscreen
              ? <Minimize2 size={20} style={{ color: '#7C3AED' }} />
              : <Maximize2 size={20} style={{ color: '#7C3AED' }} />}
          </button>
        </div>

        {/* ── Botón enviar ── */}
        <button
          onClick={exportarDibujo}
          disabled={!canvasRef.current || enviando}
          className="mt-4 py-3.5 font-black text-lg flex items-center justify-center gap-2 transition-all"
          style={{
            width: esFullscreen ? '100%' : 'auto', minWidth: '260px',
            borderRadius: '18px',
            background: enviando ? '#D1FAE5' : 'linear-gradient(135deg, #10B981, #059669)',
            color:  enviando ? '#6B7280' : 'white',
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
