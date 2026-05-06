'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, CheckCircle, Loader, Aperture, RotateCw, Crop } from 'lucide-react';

const PlantillaGuia = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-hidden">
    <div className="w-3/4 h-1/3 border-2 border-white border-dashed rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-[1px] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
      <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded">
        Centra la palabra aquí
      </span>
    </div>
  </div>
);

const CapturaEscritura = ({ idEjercicioTutor, alTerminar }) => {
  const [imagenPreview, setImagenPreview] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarCamaraWeb, setMostrarCamaraWeb] = useState(false);
  const [stream, setStream] = useState(null);
  const [modoRecorte, setModoRecorte] = useState(false);
  const [crop, setCrop] = useState(null);
  const [dragInfo, setDragInfo] = useState(null);

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [videoRef, stream, mostrarCamaraWeb]);

  const handleFileChange = (e) => procesarArchivo(e.target.files[0]);

  const procesarArchivo = (file) => {
    setError('');
    setCrop(null);
    setModoRecorte(false);
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Solo se admiten imágenes.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('La imagen es demasiado grande. Máximo 10MB.'); return; }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX = 1200;
        if (width > height && width > MAX) { height *= MAX / width; width = MAX; }
        else if (height > MAX) { width *= MAX / height; height = MAX; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        setImagenPreview(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const rotarImagen = () => {
    if (!imagenPreview) return;
    setCrop(null); setModoRecorte(false);
    const img = new Image();
    img.src = imagenPreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height; canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setImagenPreview(canvas.toDataURL('image/jpeg', 0.8));
    };
  };

  const activarModoRecorte = () => {
    setModoRecorte(true);
    if (imgRef.current) {
      const { clientWidth, clientHeight } = imgRef.current;
      setCrop({ x: clientWidth * 0.125, y: clientHeight * 0.333, width: clientWidth * 0.75, height: clientHeight * 0.333 });
    }
  };

  const getPointerCoords = (e) => {
    if (!imgRef.current) return { x: 0, y: 0 };
    const rect = imgRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    };
  };

  const handlePointerDown = (e, handle) => {
    if (!modoRecorte) return;
    e.preventDefault(); e.stopPropagation();
    setDragInfo({ handle, startCoords: getPointerCoords(e), startCrop: { ...crop } });
  };

  useEffect(() => {
    if (!dragInfo) return;
    const handlePointerMove = (e) => {
      e.preventDefault();
      const coords = getPointerCoords(e);
      const dx = coords.x - dragInfo.startCoords.x;
      const dy = coords.y - dragInfo.startCoords.y;
      let { x, y, width, height } = dragInfo.startCrop;
      const minSize = 40;
      const maxWidth = imgRef.current.clientWidth;
      const maxHeight = imgRef.current.clientHeight;
      if (dragInfo.handle.includes('w')) { const newX = Math.min(Math.max(0, x + dx), x + width - minSize); width += (x - newX); x = newX; }
      if (dragInfo.handle.includes('e')) { width = Math.min(maxWidth - x, Math.max(minSize, width + dx)); }
      if (dragInfo.handle.includes('n')) { const newY = Math.min(Math.max(0, y + dy), y + height - minSize); height += (y - newY); y = newY; }
      if (dragInfo.handle.includes('s')) { height = Math.min(maxHeight - y, Math.max(minSize, height + dy)); }
      if (dragInfo.handle === 'move') { x = Math.min(maxWidth - width, Math.max(0, x + dx)); y = Math.min(maxHeight - height, Math.max(0, y + dy)); }
      setCrop({ x, y, width, height });
    };
    const handlePointerUp = () => setDragInfo(null);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); };
  }, [dragInfo]);

  const aplicarRecorte = () => {
    if (!crop) return;
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    const canvas = document.createElement('canvas');
    canvas.width = crop.width * scaleX; canvas.height = crop.height * scaleY;
    canvas.getContext('2d').drawImage(img, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, canvas.width, canvas.height);
    setImagenPreview(canvas.toDataURL('image/jpeg', 0.8));
    setCrop(null); setModoRecorte(false);
  };

  const enviarCaptura = async () => {
    if (!imagenPreview) { setError('Debes seleccionar o capturar una imagen primero.'); return; }
    try {
      setEnviando(true); setError('');
      if (!idEjercicioTutor) { setError("Error: Identificador del ejercicio no encontrado."); setEnviando(false); return; }
      const token = localStorage.getItem('token');
      if (!token) { setError("Error: Sesión expirada."); setEnviando(false); return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/intentos/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_ejercicio_tutor: idEjercicioTutor, imagen_codificada: imagenPreview })
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.detail || 'Error en el servidor'); }
      limpiarCaptura();
      if (alTerminar) alTerminar(imagenPreview);
    } catch (error) {
      setError(`Error: ${error.message || 'Error de conexión'}`);
    } finally {
      setEnviando(false);
    }
  };

  const limpiarCaptura = () => {
    setImagenPreview(null); setError(''); setCrop(null); setModoRecorte(false);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const iniciarCamaraWeb = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('La cámara no está disponible. Usa "Subir Archivo" en su lugar.');
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } });
      setStream(mediaStream); setMostrarCamaraWeb(true);
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const detenerCamaraWeb = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
    setMostrarCamaraWeb(false);
  };

  const capturarFotoWeb = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setImagenPreview(canvas.toDataURL('image/jpeg', 0.8));
      detenerCamaraWeb();
    }
  };

  const handleTomarFotoClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) cameraInputRef.current.click();
    else iniciarCamaraWeb();
  };

  const handles = [
    { handle: 'nw', classes: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
    { handle: 'ne', classes: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
    { handle: 'sw', classes: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
    { handle: 'se', classes: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
    { handle: 'n', classes: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
    { handle: 's', classes: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
    { handle: 'w', classes: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
    { handle: 'e', classes: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      <div className="max-w-md mx-auto relative overflow-hidden"
        style={{ background: 'white', borderRadius: '24px', border: '3px solid #DDD6FE', boxShadow: '0 8px 0 #C4B5FD', padding: '24px' }}>

        {/* Cámara Web */}
        {mostrarCamaraWeb && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col overflow-hidden" style={{ borderRadius: '22px' }}>
            <div className="relative flex-grow">
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
              <PlantillaGuia />
            </div>
            <div className="w-full p-4 flex justify-between items-center bg-black">
              <button onClick={detenerCamaraWeb} className="text-white p-3 rounded-full hover:bg-gray-800">
                <X size={28} />
              </button>
              <button onClick={capturarFotoWeb}
                className="p-4 rounded-full transition-transform active:scale-95 z-20"
                style={{ background: 'white' }}>
                <Aperture size={32} style={{ color: '#1a1a1a' }} />
              </button>
              <div className="w-14" />
            </div>
          </div>
        )}

        {/* Título */}
        <div className="text-center mb-5">
          <div style={{ fontSize: '2.5rem' }} className="mb-1">📷</div>
          <h2 className="font-black" style={{ fontSize: '1.4rem', color: '#6D28D9' }}>Sube tu Escritura</h2>
        </div>

        {/* Área de vista previa */}
        <div className="mb-4 flex flex-col items-center justify-center relative overflow-hidden"
          style={{ minHeight: '200px', border: '2.5px dashed #C4B5FD', borderRadius: '18px', background: '#F5F3FF' }}>
          {imagenPreview ? (
            <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
              <div className="relative inline-block touch-none">
                <img
                  ref={imgRef}
                  src={imagenPreview}
                  alt="Vista previa"
                  className="max-w-full max-h-64 object-contain pointer-events-none select-none"
                  draggable={false}
                />
                {!modoRecorte && <PlantillaGuia />}
                {modoRecorte && crop && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/10 touch-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                    style={{ left: crop.x, top: crop.y, width: crop.width, height: crop.height, cursor: dragInfo?.handle === 'move' ? 'grabbing' : 'grab' }}
                    onPointerDown={(e) => handlePointerDown(e, 'move')}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-white font-bold text-xs bg-black/50 px-2 py-1 rounded select-none opacity-80">Ajusta los bordes</span>
                    </div>
                    {handles.map((h, i) => (
                      <div key={i}
                        className={`absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md ${h.classes}`}
                        onPointerDown={(e) => handlePointerDown(e, h.handle)} />
                    ))}
                  </div>
                )}
              </div>
              <button onClick={limpiarCaptura}
                className="absolute top-2 right-2 p-1.5 rounded-full z-20"
                style={{ background: '#EF4444', color: 'white' }}>
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="text-center p-6 text-gray-400">
              <div style={{ fontSize: '3rem' }} className="mb-2">🖼️</div>
              <p className="font-bold">Vista previa de la imagen</p>
            </div>
          )}
        </div>

        {/* Herramientas de edición */}
        {imagenPreview && (
          <div className="flex justify-between items-center p-2.5 mb-4"
            style={{ background: '#F5F3FF', borderRadius: '14px', border: '2px solid #DDD6FE' }}>
            {!modoRecorte ? (
              <>
                <button onClick={rotarImagen}
                  className="flex items-center gap-2 px-3 py-2 font-bold text-sm"
                  style={{ background: 'white', borderRadius: '10px', border: '2px solid #DDD6FE', color: '#6D28D9' }}>
                  <RotateCw size={16} /> Rotar 90°
                </button>
                <button onClick={activarModoRecorte}
                  className="flex items-center gap-2 px-3 py-2 font-bold text-sm"
                  style={{ background: 'white', borderRadius: '10px', border: '2px solid #DDD6FE', color: '#6D28D9' }}>
                  <Crop size={16} /> Recortar
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setModoRecorte(false); setCrop(null); }}
                  className="flex items-center gap-2 px-3 py-2 font-bold text-sm"
                  style={{ background: 'white', borderRadius: '10px', border: '2px solid #DDD6FE', color: '#6B7280' }}>
                  <X size={16} /> Cancelar
                </button>
                <button onClick={aplicarRecorte}
                  className="flex items-center gap-2 px-3 py-2 font-bold text-sm text-white"
                  style={{ background: '#7C3AED', borderRadius: '10px' }}>
                  <CheckCircle size={16} /> Aplicar
                </button>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 font-bold text-sm text-center"
            style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '14px', color: '#DC2626' }}>
            😅 {error}
          </div>
        )}

        {/* Botones de captura */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={handleTomarFotoClick}
            className="flex flex-col items-center justify-center p-4 font-black transition-all hover:scale-105 active:scale-95"
            style={{ background: '#EFF6FF', borderRadius: '18px', border: '2.5px solid #BFDBFE', color: '#1D4ED8', boxShadow: '0 4px 0 #BFDBFE' }}>
            <Camera size={30} className="mb-1.5" />
            <span className="text-sm">📸 Tomar Foto</span>
          </button>
          <button onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center p-4 font-black transition-all hover:scale-105 active:scale-95"
            style={{ background: '#ECFDF5', borderRadius: '18px', border: '2.5px solid #A7F3D0', color: '#065F46', boxShadow: '0 4px 0 #A7F3D0' }}>
            <Upload size={30} className="mb-1.5" />
            <span className="text-sm">📂 Subir Archivo</span>
          </button>
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>

        {/* Botón enviar */}
        <button
          onClick={enviarCaptura}
          disabled={!imagenPreview || enviando}
          className="w-full py-3.5 font-black text-lg flex items-center justify-center gap-2 transition-all"
          style={{
            borderRadius: '16px',
            background: imagenPreview && !enviando ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : '#E5E7EB',
            color: imagenPreview && !enviando ? 'white' : '#9CA3AF',
            boxShadow: imagenPreview && !enviando ? '0 5px 0 #4C1D95' : 'none',
            cursor: !imagenPreview || enviando ? 'not-allowed' : 'pointer',
          }}>
          {enviando ? (
            <><Loader size={20} className="animate-spin" /> Enviando...</>
          ) : (
            <><CheckCircle size={20} /> ¡Enviar para Revisión! 🚀</>
          )}
        </button>
      </div>
    </div>
  );
};

export default CapturaEscritura;