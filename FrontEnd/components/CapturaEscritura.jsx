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
    
    // Estado para el cuadro de recorte redimensionable
    const [modoRecorte, setModoRecorte] = useState(false);
    const [crop, setCrop] = useState(null);
    const [dragInfo, setDragInfo] = useState(null);
    
    const cameraInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [videoRef, stream, mostrarCamaraWeb]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        procesarArchivo(file);
    };

    const procesarArchivo = (file) => {
        setError('');
        setCrop(null);
        setModoRecorte(false);
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Solo se admiten imágenes.');
            return;
        }

        // Se aumenta el límite a 10MB porque ahora la comprimiremos antes de procesar
        if (file.size > 10 * 1024 * 1024) {
            setError('La imagen es demasiado grande. Seleccione una menor a 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // Comprimir y redimensionar la imagen original subida
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_DIMENSION = 1200;

                if (width > height && width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                } else if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Exportar como JPEG con 80% de calidad para reducir enormemente el peso en base64
                setImagenPreview(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    // --- Lógica de Edición y Recorte ---

    const rotarImagen = () => {
        if (!imagenPreview) return;
        setCrop(null);
        setModoRecorte(false);
        const img = new Image();
        img.src = imagenPreview;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.height;
            canvas.height = img.width;
            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            // Exportar comprimida
            setImagenPreview(canvas.toDataURL('image/jpeg', 0.8));
        };
    };

    const activarModoRecorte = () => {
        setModoRecorte(true);
        if (imgRef.current) {
            const { clientWidth, clientHeight } = imgRef.current;
            setCrop({
                x: clientWidth * 0.125,
                y: clientHeight * 0.333,
                width: clientWidth * 0.75,
                height: clientHeight * 0.333
            });
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
        e.preventDefault();
        e.stopPropagation();
        setDragInfo({
            handle,
            startCoords: getPointerCoords(e),
            startCrop: { ...crop }
        });
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

            if (dragInfo.handle.includes('w')) {
                const newX = Math.min(Math.max(0, x + dx), x + width - minSize);
                width += (x - newX);
                x = newX;
            }
            if (dragInfo.handle.includes('e')) {
                width = Math.min(maxWidth - x, Math.max(minSize, width + dx));
            }
            if (dragInfo.handle.includes('n')) {
                const newY = Math.min(Math.max(0, y + dy), y + height - minSize);
                height += (y - newY);
                y = newY;
            }
            if (dragInfo.handle.includes('s')) {
                height = Math.min(maxHeight - y, Math.max(minSize, height + dy));
            }
            if (dragInfo.handle === 'move') {
                x = Math.min(maxWidth - width, Math.max(0, x + dx));
                y = Math.min(maxHeight - height, Math.max(0, y + dy));
            }

            setCrop({ x, y, width, height });
        };

        const handlePointerUp = () => {
            setDragInfo(null);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [dragInfo]);

    const aplicarRecorte = () => {
        if (!crop) return;
        const img = imgRef.current;
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;

        const canvas = document.createElement('canvas');
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Exportar el recorte comprimido
        setImagenPreview(canvas.toDataURL('image/jpeg', 0.8));
        setCrop(null);
        setModoRecorte(false);
    };

    // --- Envío de datos ---

    const enviarCaptura = async () => {
        if (!imagenPreview) {
            setError('Debe seleccionar o capturar una imagen primero.');
            return;
        }

        try {
            setEnviando(true);
            setError('');

            if (!idEjercicioTutor) {
                setError("Error: Identificador del ejercicio no encontrado.");
                setEnviando(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Error: Sesión expirada.");
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
                    imagen_codificada: imagenPreview
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en la respuesta del servidor');
            }

            limpiarCaptura();
            if (alTerminar) alTerminar(imagenPreview);

        } catch (error) {
            console.error("Error al enviar:", error);
            setError(`Error: ${error.message || 'Error de conexión'}`);
        } finally {
            setEnviando(false);
        }
    };

    const limpiarCaptura = () => {
        setImagenPreview(null);
        setError('');
        setCrop(null);
        setModoRecorte(false);
        if (cameraInputRef.current) cameraInputRef.current.value = "";
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const iniciarCamaraWeb = async () => {
        setError('');
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('La cámara no está disponible. Requiere HTTPS o conexión local segura. Por favor, use la opción "Subir Archivo".');
            return;
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 } }
            });
            setStream(mediaStream);
            setMostrarCamaraWeb(true);
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            setError('No se pudo acceder a la cámara. Verifique los permisos de su navegador y que tenga una cámara conectada.');
        }
    };

    const detenerCamaraWeb = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setMostrarCamaraWeb(false);
    };

    const capturarFotoWeb = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            // Exportar comprimida
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setImagenPreview(dataUrl);
            detenerCamaraWeb();
        }
    };

    const handleTomarFotoClick = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            cameraInputRef.current.click();
        } else {
            iniciarCamaraWeb();
        }
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
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border-2 border-blue-100 relative overflow-hidden">
            
            {/* Interfaz de Cámara Web para Escritorio */}
            {mostrarCamaraWeb && (
                <div className="absolute inset-0 z-50 bg-black flex flex-col overflow-hidden">
                    <div className="relative flex-grow">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <PlantillaGuia />
                    </div>
                    <div className="w-full p-4 flex justify-between items-center bg-black">
                        <button 
                            onClick={detenerCamaraWeb}
                            className="text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <X size={28} />
                        </button>
                        <button 
                            onClick={capturarFotoWeb}
                            className="bg-white text-black p-4 rounded-full hover:bg-gray-200 transition-transform active:scale-95 z-20"
                        >
                            <Aperture size={32} />
                        </button>
                        <div className="w-14"></div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
                Sube tu Escritura
            </h2>

            {/* Área de Visualización */}
            <div className="mb-4 flex flex-col items-center justify-center min-h-[200px] border-dashed border-4 border-blue-200 rounded-lg bg-blue-50 relative overflow-hidden">
                {imagenPreview ? (
                    <div className="relative flex items-center justify-center w-full h-full bg-black/5 overflow-hidden">
                        <div className="relative inline-block touch-none">
                            <img 
                                ref={imgRef}
                                src={imagenPreview} 
                                alt="Vista previa de escritura" 
                                className="max-w-full max-h-64 object-contain pointer-events-none select-none"
                                draggable={false}
                            />
                            
                            {/* Plantilla superpuesta inicial (desaparece al activar modo recorte) */}
                            {!modoRecorte && <PlantillaGuia />}
                            
                            {/* Visualización del área de recorte manipulable */}
                            {modoRecorte && crop && (
                                <div 
                                    className="absolute border-2 border-blue-500 bg-blue-500/10 touch-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                                    style={{
                                        left: crop.x,
                                        top: crop.y,
                                        width: crop.width,
                                        height: crop.height,
                                        cursor: dragInfo && dragInfo.handle === 'move' ? 'grabbing' : 'grab'
                                    }}
                                    onPointerDown={(e) => handlePointerDown(e, 'move')}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-white font-bold text-xs bg-black/50 px-2 py-1 rounded select-none opacity-80">
                                            Ajusta los bordes
                                        </span>
                                    </div>
                                    {handles.map((h, i) => (
                                        <div
                                            key={i}
                                            className={`absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md ${h.classes}`}
                                            onPointerDown={(e) => handlePointerDown(e, h.handle)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <button 
                            onClick={limpiarCaptura}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-20"
                            title="Eliminar imagen"
                        >
                            <X size={24} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center p-4 text-gray-500">
                        <p>Vista previa de la imagen</p>
                    </div>
                )}
            </div>

            {/* Herramientas de Edición */}
            {imagenPreview && (
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg mb-6 border border-gray-200">
                    {!modoRecorte ? (
                        <>
                            <button
                                onClick={rotarImagen}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                <RotateCw size={16} /> Rotar 90°
                            </button>
                            <button
                                onClick={activarModoRecorte}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                <Crop size={16} /> Recortar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { setModoRecorte(false); setCrop(null); }}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} /> Cancelar
                            </button>
                            <button
                                onClick={aplicarRecorte}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                            >
                                <CheckCircle size={16} /> Aplicar
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Mensajes de Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
                    {error}
                </div>
            )}

            {/* Controles de Entrada */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                    onClick={handleTomarFotoClick}
                    className="flex flex-col items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors cursor-pointer text-blue-700"
                >
                    <Camera size={32} className="mb-2" />
                    <span className="font-bold">Tomar Foto</span>
                </button>

                <button 
                    onClick={() => fileInputRef.current.click()}
                    className="flex flex-col items-center justify-center p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors cursor-pointer text-green-700"
                >
                    <Upload size={32} className="mb-2" />
                    <span className="font-bold">Subir Archivo</span>
                </button>   

                <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    ref={cameraInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Botón de Acción Principal */}
            <button
                onClick={enviarCaptura}
                disabled={!imagenPreview || enviando}
                className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2
                ${imagenPreview && !enviando
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
                {enviando ? (
                    <>
                        <Loader size={20} className="animate-spin" />
                        Enviando...
                    </>
                ) : (
                    <>
                        <CheckCircle />
                        Enviar para Revisión
                    </>
                )}
            </button>
        </div>
    );
};

export default CapturaEscritura;